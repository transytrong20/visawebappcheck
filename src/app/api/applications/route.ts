export const runtime = 'edge';
import { NextResponse } from 'next/server'

// GET /api/applications - Lấy danh sách applications
export async function GET() {
  try {
    const res = await fetch(`${process.env.DATABASE_URL}/applications`, {
      headers: {
        'Authorization': `Bearer ${process.env.CLOUDFLARE_API_TOKEN}`
      }
    })
    const data = await res.json()
    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch applications' }, { status: 500 })
  }
}

// POST /api/applications - Tạo application mới
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const res = await fetch(`${process.env.DATABASE_URL}/applications`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.CLOUDFLARE_API_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    })
    const data = await res.json()
    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create application' }, { status: 500 })
  }
} 