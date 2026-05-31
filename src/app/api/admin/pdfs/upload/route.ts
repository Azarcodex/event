import { handleUpload, type HandleUploadBody } from '@vercel/blob/client';
import { NextResponse, NextRequest } from 'next/server';
import { verifyApiSuperAdmin } from '@/lib/api-auth';

export async function POST(request: NextRequest) {
  const body = (await request.json()) as HandleUploadBody;

  try {
    const jsonResponse = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async (pathname) => {
        // Authenticate the user
        const { errorResponse } = await verifyApiSuperAdmin();
        if (errorResponse) {
          throw new Error('Unauthorized');
        }
        
        return {
          allowedContentTypes: ['application/pdf'],
          tokenPayload: JSON.stringify({}),
        };
      },
      onUploadCompleted: async ({ blob, tokenPayload }) => {
        // We handle DB saving on the client to avoid local webhook issues
        console.log('Upload completed:', blob.url);
      },
    });

    return NextResponse.json(jsonResponse);
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 400 },
    );
  }
}
