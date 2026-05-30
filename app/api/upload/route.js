import { NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file');
    const type = formData.get('type') || 'general'; // 'packages', 'blogs', or 'general'
    const category = formData.get('category') || 'image'; // 'image', 'gallery', 'document'

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    // Validate file size (20MB for documents, 5MB for images)
    const maxSize = category === 'document' ? 20 * 1024 * 1024 : 5 * 1024 * 1024;
    if (file.size > maxSize) {
      return NextResponse.json({ 
        error: `File must be less than ${maxSize / (1024 * 1024)}MB` 
      }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    // Generate unique filename
    const timestamp = Date.now();
    const randomStr = Math.random().toString(36).substring(2, 8);
    const originalExt = path.extname(file.name);
    const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, '').replace(/\s+/g, '-');
    const filename = `${timestamp}-${randomStr}-${safeName}`;
    
    // Determine upload directory
    let uploadSubDir = 'general';
    if (type === 'packages') uploadSubDir = 'Packages';
    if (type === 'blogs') uploadSubDir = 'Blogs';
    
    // Subfolder for documents vs images
    const categoryFolder = category === 'document' ? 'documents' : 'images';
    const uploadDir = path.join(process.cwd(), 'public', 'assets', uploadSubDir, categoryFolder);
    await mkdir(uploadDir, { recursive: true });
    
    // Save file
    const filePath = path.join(uploadDir, filename);
    await writeFile(filePath, buffer);
    
    // Return the public URL
    const url = `/assets/${uploadSubDir}/${categoryFolder}/${filename}`;
    
    return NextResponse.json({ 
      success: true, 
      url,
      filename,
      type: uploadSubDir,
      category: categoryFolder,
      size: file.size,
    });
    
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}