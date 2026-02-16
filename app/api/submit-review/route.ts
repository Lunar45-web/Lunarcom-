import { createClient } from 'next-sanity'
import { NextResponse } from 'next/server'

// Create a write‑capable client using the token
const writeClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: '2024-01-01',
  token: process.env.SANITY_WRITE_TOKEN,
  useCdn: false, // must be false for writes
})

export async function POST(request: Request) {
  try {
    const body = await request.json()

    const result = await writeClient.create({
      _type: 'review',
      reviewerName: body.name,
      rating: body.rating,
      reviewText: body.review,
      serviceReceived: body.service || '',
      reviewDate: new Date().toISOString(),
      status: 'pending',
      source: 'website'
    })

    return NextResponse.json({ success: true, id: result._id })
  } catch (error) {
    console.error('Failed to save review:', error)
    return NextResponse.json({ error: 'Failed to save review' }, { status: 500 })
  }
}