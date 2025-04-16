import { getAssetFromKV } from '@cloudflare/kv-asset-handler'
import type { ExecutionContext, D1Database, R2Bucket, KVNamespace } from '@cloudflare/workers-types'

export interface Env {
  DB: D1Database;
  BUCKET: R2Bucket;
  __STATIC_CONTENT: KVNamespace;
  __STATIC_CONTENT_MANIFEST: string;
  CLOUDFLARE_ACCOUNT_ID: string;
  R2_PUBLIC_URL: string;
  BUCKET_NAME: string;
}

// Define interface for visa holder response
interface VisaHolderResponse {
  id: number;
  nationality: string;
  full_name: string;
  passport_number: string;
  date_of_birth: string;
  image_urls: string[];
}

interface ApiResponse {
  success: boolean;
  message: string;
  data?: VisaHolderResponse;
}

const worker = {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    try {
      const url = new URL(request.url);
      console.log('Request URL:', url.pathname);
      
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
        try {
          const imageKey = decodeURIComponent(url.pathname.replace("/images/", ""));
          console.log('Attempting to fetch image from R2. Key:', imageKey);
          
          const obj = await env.BUCKET.get(imageKey);
          if (!obj) {
            console.error('Image not found in bucket:', imageKey);
            return new Response("Image not found", { 
              status: 404,
              headers: {
                "Access-Control-Allow-Origin": "*",
              }
            });
          }

          console.log('Image found in R2, size:', obj.size, 'content type:', obj.httpMetadata?.contentType);
          const data = await obj.arrayBuffer();
          
          const headers = new Headers({
            "Access-Control-Allow-Origin": "*",
            "Cache-Control": "public, max-age=31536000",
            "Content-Type": obj.httpMetadata?.contentType || "image/png",
            "Content-Length": obj.size.toString(),
          });

          return new Response(data, { headers });
        } catch (error) {
          console.error('Error serving image:', error);
          return new Response("Error serving image", { 
            status: 500,
            headers: {
              "Access-Control-Allow-Origin": "*",
            }
          });
        }
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
                success: false,
                message: 'Missing required fields',
              }),
              {
                status: 400,
                headers: {
                  'Content-Type': 'application/json',
                  'Access-Control-Allow-Origin': '*',
                },
              }
            );
          }

          try {
            const result = await env.DB.prepare(`
              SELECT 
                vh.id,
                vh.nationality,
                vh.full_name,
                vh.passport_number,
                vh.date_of_birth,
                GROUP_CONCAT(vi.image_url) as image_urls
              FROM visa_holders vh
              LEFT JOIN visa_images vi ON vh.id = vi.visa_holder_id
              WHERE 
                vh.nationality = ?
                AND vh.full_name = ?
                AND vh.passport_number = ?
                AND vh.date_of_birth = ?
              GROUP BY vh.id
            `)
              .bind(nationality, fullName, passportNumber, dateOfBirth)
              .first();

            if (!result) {
              return new Response(
                JSON.stringify({
                  success: false,
                  message: 'No visa information found',
                }),
                {
                  status: 404,
                  headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                  },
                }
              );
            }

            console.log('Raw image URLs from DB:', result.image_urls);
            const imageUrls = result.image_urls ? (result.image_urls as string).split(',').map(url => url.trim()) : [];
            console.log('Split image URLs:', imageUrls);

            const publicUrls = await Promise.all(
              imageUrls.map(async (imageUrl) => {
                // Remove any leading/trailing whitespace
                const cleanUrl = imageUrl.trim();
                return generatePublicUrl(env, cleanUrl, request.url);
              })
            );
            console.log('Generated public URLs:', publicUrls);

            const response: ApiResponse = {
              success: true,
              message: 'Visa information found',
              data: {
                id: result.id as number,
                nationality: result.nationality as string,
                full_name: result.full_name as string,
                passport_number: result.passport_number as string,
                date_of_birth: result.date_of_birth as string,
                image_urls: publicUrls,
              },
            };

            return new Response(JSON.stringify(response), {
              headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
              },
            });
          } catch (error) {
            console.error('Database query failed:', error);
            return new Response(
              JSON.stringify({
                success: false,
                message: 'Internal server error',
              }),
              {
                status: 500,
                headers: {
                  'Content-Type': 'application/json',
                  'Access-Control-Allow-Origin': '*',
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
            
            // Validate required fields
            const nationality = formData.get("nationality") as string;
            const fullName = formData.get("fullName") as string;
            const passportNumber = formData.get("passportNumber") as string;
            const dateOfBirth = formData.get("dateOfBirth") as string;
            const visaImages = formData.getAll("visaImages") as File[];

            // Log received data for debugging
            console.log('Received form data:', {
              nationality,
              fullName,
              passportNumber,
              dateOfBirth,
              imageCount: visaImages.length
            });

            if (!nationality || !fullName || !passportNumber || !dateOfBirth || !visaImages.length) {
              const missingFields = {
                nationality: !nationality,
                fullName: !fullName,
                passportNumber: !passportNumber,
                dateOfBirth: !dateOfBirth,
                visaImages: !visaImages.length
              };
              console.log('Validation failed:', missingFields);
              
              return new Response(
                JSON.stringify({
                  success: false,
                  message: 'Missing required fields',
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
              // Insert visa holder first
              const insertResult = await env.DB.prepare(
                `INSERT INTO visa_holders (nationality, full_name, passport_number, date_of_birth) 
                 VALUES (?, ?, ?, ?)`
              )
                .bind(nationality, fullName, passportNumber, dateOfBirth)
                .run();

              if (!insertResult.success) {
                throw new Error("Failed to insert visa holder");
              }

              // Get the last inserted ID
              const lastIdResult = await env.DB.prepare('SELECT last_insert_rowid() as id')
                .first<{ id: number }>();
              
              if (!lastIdResult?.id) {
                throw new Error("Failed to get visa holder ID");
              }

              const visaHolderId = lastIdResult.id;
              console.log('Visa holder created with ID:', visaHolderId);

              // Process images
              const imageUrls: string[] = [];
              let successfulUploads = 0;

              for (const visaImage of visaImages) {
                try {
                  // Generate unique image key
                  const timestamp = Date.now();
                  const randomString = Math.random().toString(36).substring(7);
                  const imageKey = `visa-images/${timestamp}-${randomString}-${visaImage.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`;
                  
                  // Upload image to R2
                  const imageBuffer = await visaImage.arrayBuffer();
                  await env.BUCKET.put(imageKey, imageBuffer, {
                    httpMetadata: {
                      contentType: visaImage.type || "application/octet-stream",
                    },
                  });

                  // Insert image record
                  const imageResult = await env.DB.prepare(
                    `INSERT INTO visa_images (visa_holder_id, image_url) VALUES (?, ?)`
                  )
                    .bind(visaHolderId, imageKey)
                    .run();

                  if (!imageResult.success) {
                    throw new Error("Failed to insert image record");
                  }

                  imageUrls.push(`${url.origin}/images/${imageKey}`);
                  successfulUploads++;
                } catch (error) {
                  console.error('Error processing image:', error);
                  // Continue with next image if one fails
                  continue;
                }
              }

              // If no images were processed successfully, clean up and return error
              if (successfulUploads === 0) {
                // Delete visa holder record
                await env.DB.prepare('DELETE FROM visa_holders WHERE id = ?')
                  .bind(visaHolderId)
                  .run();
                
                throw new Error("Failed to process any images");
              }

              if (insertResult.success) {
                return new Response(JSON.stringify({ message: "Visa information saved successfully" }), {
                  status: 200,
                  headers: {
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Origin": "*",
                  },
                });
              }
            } catch (error) {
              console.error('Database or storage operation failed:', error);
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
      return new Response("Not found", { 
        status: 404,
        headers: {
          "Access-Control-Allow-Origin": "*",
        }
      });
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

async function generatePublicUrl(env: Env, imageKey: string, requestUrl: string): Promise<string> {
  // Return direct R2 bucket URL
  return `https://pub-d007d74036654473a8d7d9d0a663708b.r2.dev/${imageKey}`;
}

export default worker 