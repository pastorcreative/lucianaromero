import { handlePayloadRequest } from '@payloadcms/next/handlers'
import config from '@payload-config'

export const GET = handlePayloadRequest({ config })
export const POST = handlePayloadRequest({ config })
export const PUT = handlePayloadRequest({ config })
export const DELETE = handlePayloadRequest({ config })
export const PATCH = handlePayloadRequest({ config })
