// app/api/upload/route.js
import { NextResponse } from 'next/server';
import { put } from '@vercel/blob';

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file');
    const type = formData.get('type') || 'general';
    const category = formData.get('category') || 'image';

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    // Generate unique filename
    const timestamp = Date.now();
    const randomStr = Math.random().toString(36).substring(2, 8);
    const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, '').replace(/\s+/g, '-');
    const filename = `${timestamp}-${randomStr}-${safeName}`;
    
    // Determine folder
    let folder = 'general';
    if (type === 'packages') folder = 'Packages';
    if (type === 'blogs') folder = 'Blogs';
    
    const subfolder = category === 'document' ? 'documents' : 'images';
    const blobPath = `assets/${folder}/${subfolder}/${filename}`;

    // ✅ CHANGE: Use 'private' instead of 'public'
    const blob = await put(blobPath, file, {
      access: 'public',  // ← Changed from 'public' to 'private'
      token: process.env.BLOB_READ_WRITE_TOKEN,
    });

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