// src/app/[...catchAll]/route.ts - REQUIRED FOR STATIC FILES
import { sql } from "@/lib/db";
import { NextRequest } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import path from 'path';

function getContentType(filePath: string): string {
  const ext = path.extname(filePath).toLowerCase();
  const contentTypes: Record<string, string> = {
    '.css': 'text/css',
    '.js': 'application/javascript',
    '.png': 'image/png',
    '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon',
    '.webp': 'image/webp',
    '.woff': 'font/woff', '.woff2': 'font/woff2',
    '.ttf': 'font/ttf',
  };
  return contentTypes[ext] || 'application/octet-stream';
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ catchAll: string[] }> }
) {
  try {
    const { catchAll } = await params;
    const filePath = catchAll.join('/');
    
    console.log('🔍 Static file request:', filePath);
    
    // Only handle static files with extensions
    if (!filePath.includes('.')) {
      return new Response("Not found", { status: 404 });
    }
    
    // Get referer to determine which deployment
    const referer = request.headers.get('referer');
    if (!referer) {
      console.log('No referer header');
      return new Response("Not found", { status: 404 });
    }
    
    const refererUrl = new URL(referer);
    const refererPath = refererUrl.pathname;
    
    // Extract deployment name (e.g., /test-site-1 → test-site-1)
    const pathParts = refererPath.split('/').filter(Boolean);
    if (pathParts.length === 0) {
      console.log('Could not extract deployment from referer');
      return new Response("Not found", { status: 404 });
    }
    
    const deploymentName = pathParts[0];
    console.log('Referer deployment:', deploymentName);
    
    // Find deployment
    const deployments = await sql`
      SELECT d.*, a.hash 
      FROM deployments d 
      JOIN artifacts a ON d.artifact_id = a.id 
      WHERE d.url = ${deploymentName} OR d.url = ${deploymentName + '.bob'}
      LIMIT 1
    `;
    
    if (deployments.length === 0) {
      console.log('Deployment not found in DB');
      return new Response("Not found", { status: 404 });
    }
    
    const deployment = deployments[0];
    
    // Serve the file
    const storagePath = `${deployment.hash}/${filePath}`;
    console.log('Fetching from storage:', storagePath);
    
    const { data, error } = await supabaseAdmin.storage
      .from('artifacts')
      .download(storagePath);
    
    if (error || !data) {
      console.log('File not found in storage');
      return new Response("File not found", { status: 404 });
    }
    
    console.log('✅ Static file served via catch-all');
    
    return new Response(data, {
      headers: {
        'Content-Type': getContentType(filePath),
        'Cache-Control': 'public, max-age=31536000, immutable',
        'Access-Control-Allow-Origin': '*'
      }
    });

  } catch (error: unknown) {
    console.error("Catch-all error:", error);
    return new Response("Internal error", { status: 500 });
  }
}