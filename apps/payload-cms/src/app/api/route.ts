import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

export async function GET(request: NextRequest) {
  const payload = await getPayload({ config })
  
  return NextResponse.json({ message: 'Payload API is running' })
}
