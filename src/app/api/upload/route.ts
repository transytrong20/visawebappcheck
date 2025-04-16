export const runtime = 'edge';

import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    // Convert file to buffer
    const buffer = await file.arrayBuffer()

    // Upload to R2
    const res = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${process.env.CLOUDFLARE_ACCOUNT_ID}/r2/buckets/${process.env.R2_BUCKET_NAME}/objects/${file.name}`,
      {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${process.env.CLOUDFLARE_API_TOKEN}`,
          'Content-Type': file.type,
        },
        body: buffer,
      }
    )

    if (!res.ok) {
      throw new Error('Failed to upload to R2')
    }

    return NextResponse.json({ 
      success: true,
      fileUrl: `${process.env.R2_PUBLIC_URL}/${file.name}`
    })
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
  }
} 