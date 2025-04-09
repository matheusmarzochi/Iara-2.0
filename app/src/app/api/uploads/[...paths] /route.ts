import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import mime from 'mime-types';
import download from 'iara-shared/storage/download';
import crypto from 'crypto';

// Configure where the uploads are stored
const uploadsDirectory = path.join('/', 'code', 'uploads');

function generateETag(buffer: Buffer): string {
  const hash = crypto.createHash('sha1').update(buffer).digest('hex');
  return `"${hash}"`;
}

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ paths: string[] }> }
) {
  try {
    const { paths } = await context.params;
    const filePath = path.join(uploadsDirectory, ...paths);

    // Ensure the file path is within the uploads directory
    if (!filePath.startsWith(uploadsDirectory)) {
      return new NextResponse('Invalid path', { status: 400 });
    }

    let fileBuffer;
    try {
      fileBuffer = await download(filePath);
    } catch {
      return new NextResponse('Not found', { status: 404 });
    }

    const contentType = mime.lookup(filePath) || 'application/octet-stream';
    const etag = generateETag(fileBuffer);
    const ifNoneMatch = request.headers.get('if-none-match');

    // Handle 304 Not Modified based on ETag
    if (ifNoneMatch === etag) {
      return new NextResponse(null, {
        status: 304,
        headers: {
          'ETag': etag,
          'Cache-Control': 'public, max-age=86400',
          'Accept-Ranges': 'bytes',
        },
      });
    }

    return new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Content-Length': fileBuffer.length.toString(),
        'Cache-Control': 'public, max-age=86400',
        'ETag': etag,
        'Accept-Ranges': 'bytes',
      },
    });
  } catch (error) {
    console.error('Error serving file:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}