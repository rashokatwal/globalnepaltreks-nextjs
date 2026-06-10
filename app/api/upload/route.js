// app/api/upload/route.js
import { NextResponse } from 'next/server';
import { put } from '@vercel/blob';

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file');
    const type = formData.get('type') || 'general';
    const category = formData.get('category') || 'image';

    console.log('Upload request received:', { type, category, fileName: file?.name, fileSize: file?.size });

    if (!file) {
      console.error('No file in request');
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    // Allowed MIME types per category
    const allowedTypes = {
      image: ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'],
      document: [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'text/plain',
      ],
    };

    const allowed = allowedTypes[category] ?? allowedTypes['image'];

    if (!allowed.includes(file.type)) {
      console.error('Invalid file type:', file.type);
      return NextResponse.json(
        { error: `File type "${file.type}" is not allowed for category "${category}"` },
        { status: 400 }
      );
    }

    // Validate file size (5MB for images, 10MB for documents)
    const maxSize = category === 'document' ? 10 * 1024 * 1024 : 5 * 1024 * 1024;
    if (file.size > maxSize) {
      console.error('File too large:', file.size);
      return NextResponse.json(
        { error: `File must be less than ${maxSize / (1024 * 1024)}MB` },
        { status: 400 }
      );
    }

    const timestamp = Date.now();
    const randomStr = Math.random().toString(36).substring(2, 8);
    const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, '').replace(/\s+/g, '-');
    const filename = `${timestamp}-${randomStr}-${safeName}`;

    let folder = 'general';
    if (type === 'packages') folder = 'Packages';
    if (type === 'blogs') folder = 'Blogs';

    const subfolder = category === 'document' ? 'documents' : 'images';
    const blobPath = `assets/${folder}/${subfolder}/${filename}`;

    console.log('Uploading to blob:', blobPath);

    const blob = await put(blobPath, file, {
      access: 'public',
      token: process.env.BLOB_READ_WRITE_TOKEN,
    });

    console.log('Upload successful:', blob.url);

    return NextResponse.json({
      success: true,
      url: blob.url,
      filename: blob.pathname,
      type: folder,
      category: subfolder,
    });

  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: 'Upload failed: ' + error.message }, { status: 500 });
  }
}