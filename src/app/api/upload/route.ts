
import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

export async function POST(request: Request) {
  try {
    const { image } = await request.json();
    if (!image || typeof image !== 'string') {
      return NextResponse.json({ message: 'Invalid image data' }, { status: 400 });
    }

    const base64Data = image.split(';base64,').pop();
    if (!base64Data) {
      return NextResponse.json({ message: 'Invalid image format' }, { status: 400 });
    }

    const buffer = Buffer.from(base64Data, 'base64');
    // Save the image to the public folder
    const filePath = path.join(process.cwd(), 'public', 'iptv-hero.jpg');

    await fs.writeFile(filePath, buffer);

    return NextResponse.json({ message: 'Image uploaded successfully' }, { status: 200 });
  } catch (error) {
    console.error('Upload failed:', error);
    return NextResponse.json({ message: 'Upload failed' }, { status: 500 });
  }
}
