export const runtime = 'edge';
import { NextResponse } from 'next/server'

// GET /api/users - Lấy danh sách users
export async function GET() {
  try {
    const res = await fetch(`${process.env.DATABASE_URL}/users`, {
      headers: {
        'Authorization': `Bearer ${process.env.CLOUDFLARE_API_TOKEN}`
      }
    })
    const data = await res.json()
    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 })
  }
}

// POST /api/users - Tạo user mới
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const res = await fetch(`${process.env.DATABASE_URL}/users`, {
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
    return NextResponse.json({ error: 'Failed to create user' }, { status: 500 })
  }
} 