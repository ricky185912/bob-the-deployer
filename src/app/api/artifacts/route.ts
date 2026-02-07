// app/api/artifacts/route.ts - COMPLETE
import { sql } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase";
import AdmZip from 'adm-zip';
import path from 'path';

export async function POST(req: Request) {
  try {
    console.log("=== ARTIFACT CREATION START ===");
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      console.log("❌ No session");
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    console.log("User ID:", session.user.id);

    const formData = await req.formData();
    const zipFile = formData.get('zip') as File;
    const hash = formData.get('hash') as string;
    
    console.log("Zip file received:", zipFile?.name, zipFile?.size);
    console.log("Hash received:", hash);
    
    if (!zipFile || !hash) {
      console.log("❌ Missing file or hash");
      return Response.json({ 
        error: "ZIP file and hash are required" 
      }, { status: 400 });
    }

    // Check if artifact already exists
    const existing = await sql`
      SELECT id FROM artifacts WHERE hash = ${hash}
    `;
    
    if (existing.length > 0) {
      console.log("✓ Artifact already exists");
      return Response.json({
        success: true,
        artifactId: existing[0].id,
        message: "Artifact already exists"
      });
    }

    // Convert File to Buffer
    const bytes = await zipFile.arrayBuffer();
    const buffer = Buffer.from(bytes);
    console.log("Buffer size:", buffer.length);
    
    // Verify hash matches
    const crypto = await import('crypto');
    const computedHash = crypto.createHash('sha256').update(buffer).digest('hex');
    console.log("Computed hash:", computedHash);
    console.log("Provided hash:", hash);
    
    if (computedHash !== hash) {
      throw new Error(`Hash mismatch. Computed: ${computedHash}, Provided: ${hash}`);
    }
    
    // Extract ZIP in memory
    const zip = new AdmZip(buffer);
    const entries = zip.getEntries();
    
    console.log(`ZIP has ${entries.length} entries`);
    
    // Find all files and detect root folder
    const files: Array<{ path: string; data: Buffer; contentType: string }> = [];
    let hasIndexHtml = false;
    let rootFolder = null;
    
    // First: Analyze structure
    for (const entry of entries) {
      if (!entry.isDirectory) {
        const entryPath = entry.entryName.replace(/\\/g, '/');
        const pathParts = entryPath.split('/');
        
        if (pathParts.length > 1 && !rootFolder) {
          rootFolder = pathParts[0];
          console.log(`Detected root folder: "${rootFolder}"`);
        }
      }
    }
    
    // Second: Extract files
    for (const entry of entries) {
      if (!entry.isDirectory) {
        let entryPath = entry.entryName.replace(/\\/g, '/');
        
        // Strip root folder if present
        if (rootFolder && entryPath.startsWith(`${rootFolder}/`)) {
          entryPath = entryPath.substring(rootFolder.length + 1);
        }
        
        if (!entryPath || entryPath === '') continue;
        
        // Check for index.html
        if (entryPath.toLowerCase() === 'index.html') {
          hasIndexHtml = true;
          console.log(`✓ Found index.html: ${entryPath}`);
        }
        
        let fileData = entry.getData();
        
        // AUTO-FIX HTML: Add base tag for proper path resolution
        // This will be overridden during serving, but good fallback
        if (entryPath.toLowerCase().endsWith('.html')) {
          const htmlContent = fileData.toString('utf-8');
          
          // Add base tag with / so it works during serving rewrite
          if (!htmlContent.includes('<base')) {
            const fixedHtml = htmlContent.replace(
              /<head>/i,
              '<head>\n<base href="/">'
            );
            fileData = Buffer.from(fixedHtml, 'utf-8');
            console.log(`  Added temporary base tag to: ${entryPath}`);
          }
        }
        
        const contentType = getContentType(entryPath);
        files.push({
          path: entryPath,
          data: fileData,
          contentType
        });
        
        console.log(`  File: ${entryPath} (${fileData.length} bytes)`);
      }
    }
    
    if (!hasIndexHtml) {
      console.log("❌ No index.html found");
      throw new Error("ZIP must contain an index.html file");
    }
    
    console.log(`Extracted ${files.length} files`);
    
    // Upload files
    console.log("Uploading to Supabase Storage...");
    let uploadedCount = 0;
    
    for (const file of files) {
      try {
        const storagePath = `${hash}/${file.path}`;
        
        const { error } = await supabaseAdmin.storage
          .from('artifacts')
          .upload(storagePath, file.data, {
            contentType: file.contentType,
            cacheControl: 'public, max-age=31536000, immutable',
            upsert: false
          });
        
        if (error) {
          if (error.message?.includes('already exists')) {
            console.log(`  Skipped (exists): ${storagePath}`);
            uploadedCount++;
          } else {
            throw error;
          }
        } else {
          uploadedCount++;
          console.log(`  ✓ Uploaded: ${storagePath}`);
        }
      } catch (error: any) {
        console.log(`  ✗ Failed: ${error.message}`);
        throw error;
      }
    }
    
    console.log(`✓ Uploaded ${uploadedCount} files`);
    
    // Create DB record
    const [artifact] = await sql`
      INSERT INTO artifacts (hash, size, file_count)
      VALUES (${hash}, ${buffer.length}, ${uploadedCount})
      RETURNING id, hash, size, file_count, created_at
    `;

    console.log("✓ Artifact created:", artifact.id);
    console.log("=== ARTIFACT CREATION END ===");

    return Response.json({ 
      success: true, 
      artifact 
    }, { status: 201 });

  } catch (error: unknown) {
    console.error("❌ Artifact creation error:", error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return Response.json({
      success: false,
      error: errorMessage,
    }, { status: 500 });
  }
}

function getContentType(filePath: string): string {
  const ext = path.extname(filePath).toLowerCase();
  const contentTypes: Record<string, string> = {
    '.html': 'text/html', '.htm': 'text/html',
    '.css': 'text/css',
    '.js': 'application/javascript',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon',
    '.webp': 'image/webp',
    '.txt': 'text/plain',
    '.woff': 'font/woff', '.woff2': 'font/woff2',
    '.ttf': 'font/ttf',
    '.mp4': 'video/mp4', '.webm': 'video/webm',
    '.mp3': 'audio/mpeg',
    '.pdf': 'application/pdf',
  };
  return contentTypes[ext] || 'application/octet-stream';
}