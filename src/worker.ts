import { getAssetFromKV } from '@cloudflare/kv-asset-handler'
import type { ExecutionContext, D1Database, R2Bucket, KVNamespace } from '@cloudflare/workers-types'

export interface Env {
  DB: D1Database;
  BUCKET: R2Bucket;
  __STATIC_CONTENT: KVNamespace;
  __STATIC_CONTENT_MANIFEST: string;
  CLOUDFLARE_ACCOUNT_ID: string;
  R2_PUBLIC_URL: string;
}

const worker = {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    try {
      const url = new URL(request.url);
      
      // Handle CORS preflight requests
      if (request.method === "OPTIONS") {
        return new Response(null, {
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type",
          },
        });
      }

      // Serve images from R2
      if (url.pathname.startsWith("/images/")) {
        const imageKey = url.pathname.replace("/images/", "");
        const obj = await env.BUCKET.get(imageKey);

        if (!obj) {
          return new Response("Image not found", { status: 404 });
        }

        const data = await obj.arrayBuffer();
        const headers = new Headers({
          "Access-Control-Allow-Origin": "*",
          "Cache-Control": "public, max-age=31536000",
          "Content-Type": obj.httpMetadata?.contentType || "application/octet-stream",
          "Content-Length": obj.size.toString(),
          "ETag": obj.httpEtag,
        });

        return new Response(data, {
          headers,
        });
      }

      // API endpoint for visa information
      if (url.pathname === "/api/evisa") {
        // Handle GET request - Check visa information
        if (request.method === "GET") {
          const { searchParams } = url;
          const nationality = searchParams.get("nationality");
          const fullName = searchParams.get("fullName");
          const passportNumber = searchParams.get("passportNumber");
          const dateOfBirth = searchParams.get("dateOfBirth");

          if (!nationality || !fullName || !passportNumber || !dateOfBirth) {
            return new Response(
              JSON.stringify({
                error: "All fields are required",
                details: {
                  nationality: !nationality,
                  fullName: !fullName,
                  passportNumber: !passportNumber,
                  dateOfBirth: !dateOfBirth,
                },
              }),
              {
                status: 400,
                headers: {
                  "Content-Type": "application/json",
                  "Access-Control-Allow-Origin": "*",
                },
              }
            );
          }

          try {
            const result = await env.DB.prepare(
              `SELECT * FROM visas WHERE nationality = ? AND full_name = ? AND passport_number = ? AND date_of_birth = ? LIMIT 1`
            )
              .bind(nationality, fullName, passportNumber, dateOfBirth)
              .all();

            if (!result.results || result.results.length === 0) {
              return new Response(
                JSON.stringify({ error: "No matching visa found" }),
                {
                  status: 404,
                  headers: {
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Origin": "*",
                  },
                }
              );
            }

            const visa = result.results[0];
            const imageUrl = `${url.origin}/images/${visa.image_url}`;

            return new Response(
              JSON.stringify({
                success: true,
                imageUrl,
              }),
              {
                headers: {
                  "Content-Type": "application/json",
                  "Access-Control-Allow-Origin": "*",
                },
              }
            );
          } catch (error) {
            console.error('Error checking visa:', error);
            return new Response(
              JSON.stringify({
                error: "Failed to check visa",
                details: error instanceof Error ? error.message : String(error),
              }),
              {
                status: 500,
                headers: {
                  "Content-Type": "application/json",
                  "Access-Control-Allow-Origin": "*",
                },
              }
            );
          }
        }

        // Handle POST request - Add new visa information
        if (request.method === "POST") {
          try {
            console.log('Starting POST request processing...');
            const formData = await request.formData();
            console.log('FormData received:', {
              nationality: formData.get("nationality"),
              fullName: formData.get("fullName"),
              passportNumber: formData.get("passportNumber"),
              dateOfBirth: formData.get("dateOfBirth"),
              hasImage: formData.has("visaImage")
            });

            const nationality = formData.get("nationality")?.toString();
            const fullName = formData.get("fullName")?.toString();
            const passportNumber = formData.get("passportNumber")?.toString();
            const dateOfBirth = formData.get("dateOfBirth")?.toString();
            const visaImage = formData.get("visaImage") as File | null;

            if (!nationality || !fullName || !passportNumber || !dateOfBirth || !visaImage) {
              console.log('Validation failed:', {
                nationality: !nationality,
                fullName: !fullName,
                passportNumber: !passportNumber,
                dateOfBirth: !dateOfBirth,
                visaImage: !visaImage
              });
              return new Response(
                JSON.stringify({
                  error: "All fields are required",
                  details: {
                    nationality: !nationality,
                    fullName: !fullName,
                    passportNumber: !passportNumber,
                    dateOfBirth: !dateOfBirth,
                    visaImage: !visaImage,
                  },
                }),
                {
                  status: 400,
                  headers: {
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Origin": "*",
                  },
                }
              );
            }

            try {
              console.log('Uploading image to R2...');
              // Upload image to R2
              const imageBuffer = await visaImage.arrayBuffer();
              const imageKey = `visa-images/${Date.now()}-${visaImage.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`;
              
              await env.BUCKET.put(imageKey, imageBuffer, {
                httpMetadata: {
                  contentType: visaImage.type || "application/octet-stream",
                },
              });
              console.log('Image uploaded successfully to R2 with key:', imageKey);

              console.log('Saving to database...');
              // Save information to D1
              const dbResult = await env.DB.prepare(
                `INSERT INTO visas (nationality, full_name, passport_number, date_of_birth, image_url) VALUES (?, ?, ?, ?, ?)`
              )
                .bind(nationality, fullName, passportNumber, dateOfBirth, imageKey)
                .run();
              
              console.log('Database insert result:', dbResult);

              // Trả về URL thông qua worker
              const imageUrl = `${url.origin}/images/${imageKey}`;

              return new Response(
                JSON.stringify({
                  success: true,
                  message: "Visa information saved successfully",
                  data: {
                    nationality,
                    fullName,
                    passportNumber,
                    dateOfBirth,
                    imageUrl,
                  },
                }),
                {
                  headers: {
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Origin": "*",
                  },
                }
              );
            } catch (error) {
              console.error('Error in database or storage operations:', error);
              throw error;
            }
          } catch (error) {
            console.error('Error processing request:', error);
            return new Response(
              JSON.stringify({
                error: "Failed to save data",
                details: error instanceof Error ? error.message : String(error),
              }),
              {
                status: 500,
                headers: {
                  "Content-Type": "application/json",
                  "Access-Control-Allow-Origin": "*",
                },
              }
            );
          }
        }
      }

      // Handle unknown routes
      return new Response("Not found", { status: 404 });
    } catch (error) {
      console.error('Error:', error);
      return new Response(
        JSON.stringify({
          error: "Error processing request",
          details: error instanceof Error ? error.message : String(error),
        }),
        {
          status: 500,
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          },
        }
      );
    }
  },
}

export default worker 