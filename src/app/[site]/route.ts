// src/app/[site]/route.ts - COMPLETE FIXED VERSION
import { sql } from "@/lib/db";
import { NextRequest } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import path from 'path';

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

function rewriteHtmlForDeployment(htmlContent: string, deploymentUrl: string): string {
  // Remove .bob suffix from deployment URL for base path
  const cleanDeploymentUrl = deploymentUrl.replace(/\.bob$/i, '');
  const basePath = `/${cleanDeploymentUrl}/`;
  
  console.log(`📝 Rewriting HTML for deployment: ${deploymentUrl}`);
  console.log(`📝 Clean base path: ${basePath}`);
  
  let rewritten = htmlContent;
  
  // 1. Fix or add base tag
  const baseTagRegex = /<base[^>]*>/i;
  if (rewritten.match(baseTagRegex)) {
    rewritten = rewritten.replace(baseTagRegex, `<base href="${basePath}">`);
    console.log(`  Updated base tag to: ${basePath}`);
  } else {
    // Try to add base tag after <head>
    const headRegex = /<head[^>]*>/i;
    if (rewritten.match(headRegex)) {
      rewritten = rewritten.replace(headRegex, `$&\n<base href="${basePath}">`);
      console.log(`  Added base tag after head: ${basePath}`);
    } else {
      // Try to add base tag after <html> or at beginning
      const htmlRegex = /<html[^>]*>/i;
      if (rewritten.match(htmlRegex)) {
        // Find position after <html> tag
        const match = rewritten.match(htmlRegex);
        if (match) {
          const position = match.index! + match[0].length;
          rewritten = rewritten.slice(0, position) + 
                     `\n<head><base href="${basePath}"></head>` + 
                     rewritten.slice(position);
          console.log(`  Added head with base tag after html: ${basePath}`);
        }
      } else {
        // No html tag, add at very beginning
        rewritten = `<!DOCTYPE html>\n<html>\n<head><base href="${basePath}"></head>\n${rewritten}`;
        console.log(`  Wrapped in HTML with base tag: ${basePath}`);
      }
    }
  }
  
  return rewritten;
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ site: string }> }
) {
  try {
    const { site } = await params;
    const decodedSite = decodeURIComponent(site);
    
    console.log('🚀 Serving request for:', decodedSite);
    
    // Handle static files at root (like /favicon.ico, /robots.txt, etc.)
    if (decodedSite.includes('.')) {
      const ext = path.extname(decodedSite).toLowerCase();
      const staticExtensions = ['.css', '.js', '.png', '.jpg', '.jpeg', '.gif', '.svg', '.ico', '.woff', '.woff2', '.ttf', '.txt', '.xml', '.json', '.webmanifest'];
      
      if (staticExtensions.includes(ext)) {
        console.log(`📄 Static file request: ${decodedSite}`);
        
        // Try to find from referer
        const referer = request.headers.get('referer');
        if (referer) {
          try {
            const refererUrl = new URL(referer);
            const refererPath = refererUrl.pathname;
            const pathParts = refererPath.split('/').filter(Boolean);
            
            if (pathParts.length > 0) {
              const deploymentName = pathParts[0];
              console.log(`  From referer deployment: ${deploymentName}`);
              
              // Try to serve from this deployment
              const deployments = await sql`
                SELECT d.*, a.hash 
                FROM deployments d 
                JOIN artifacts a ON d.artifact_id = a.id 
                WHERE d."url" = ${deploymentName}
                   OR d."url" = ${deploymentName + '.bob'}
                LIMIT 1
              `;
              
              if (deployments.length > 0) {
                const deployment = deployments[0];
                const storagePath = `${deployment.hash}/${decodedSite}`;
                console.log(`  Trying: ${storagePath}`);
                
                const { data, error } = await supabaseAdmin.storage
                  .from('artifacts')
                  .download(storagePath);
                
                if (data && !error) {
                  console.log(`✅ Served static file via referer`);
                  return new Response(data, {
                    headers: {
                      'Content-Type': getContentType(decodedSite),
                      'Cache-Control': 'public, max-age=31536000, immutable'
                    }
                  });
                }
              }
            }
          } catch (refererError) {
            console.log('Referer parsing error:', refererError);
          }
        }
        
        console.log(`❌ Static file not associated with any deployment`);
        return new Response("File not found", { status: 404 });
      }
    }
    
    // FIND DEPLOYMENT - Handle both with and without .bob
    console.log('🔍 Looking for deployment matching:', decodedSite);
    
    const deployments = await sql`
      SELECT d.*, a.hash 
      FROM deployments d 
      JOIN artifacts a ON d.artifact_id = a.id 
      WHERE d."url" = ${decodedSite} 
         OR d."url" = ${decodedSite + '.bob'}
         OR d."url" = ${decodedSite.replace(/\.bob$/i, '')}
      AND d.status = 'READY'
      LIMIT 1
    `;
    
    if (deployments.length === 0) {
      console.log('❌ Deployment not found');
      return new Response("Deployment not found", { 
        status: 404, 
        headers: { 'Content-Type': 'text/html' }
      });
    }

    const deployment = deployments[0];
    console.log('✅ Found deployment:', deployment.url);
    
    // Get file path from URL
    const url = new URL(request.url);
    const fullPath = url.pathname;
    console.log('📂 Full path:', fullPath);
    
    // Determine the actual file path to serve
    let filePath = fullPath;
    
    // Try to strip the deployment name from the path
    const possiblePrefixes = [
      `/${deployment.url}`,
      `/${deployment.url.replace(/\.bob$/i, '')}`,
      `/${site}`,
      `/${decodedSite}`
    ];
    
    for (const prefix of possiblePrefixes) {
      if (filePath.startsWith(prefix + '/') || filePath === prefix) {
        filePath = filePath.substring(prefix.length);
        console.log(`  Stripped prefix "${prefix}", remaining: "${filePath}"`);
        break;
      }
    }
    
    // Handle root path
    if (filePath === '' || filePath === '/') {
      filePath = 'index.html';
    }
    
    // Remove leading slash if present
    if (filePath.startsWith('/')) {
      filePath = filePath.substring(1);
    }
    
    console.log('📁 Serving file:', filePath);
    
    // Construct storage path
    const storagePath = `${deployment.hash}/${filePath}`;
    console.log('📦 Storage path:', storagePath);
    
    // Download file from storage
    const { data, error } = await supabaseAdmin.storage
      .from('artifacts')
      .download(storagePath);
    
    if (error || !data) {
      console.log('❌ File not found:', storagePath, error?.message);
      
      // If index.html not found, try root index.html
      if (filePath === 'index.html') {
        const fallbackPath = `${deployment.hash}/index.html`;
        console.log('🔄 Trying fallback:', fallbackPath);
        
        const { data: fallbackData, error: fallbackError } = await supabaseAdmin.storage
          .from('artifacts')
          .download(fallbackPath);
        
        if (fallbackData && !fallbackError) {
          console.log('✅ Served from fallback');
          return serveHtmlFile(fallbackData, deployment);
        }
      }
      
      return new Response("File not found", { 
        status: 404, 
        headers: { 'Content-Type': 'text/html' }
      });
    }
    
    // Serve the file
    return serveFile(data, filePath, deployment);

  } catch (error: unknown) {
    console.error("🔥 Error:", error);
    return new Response("Internal server error", { 
      status: 500, 
      headers: { 'Content-Type': 'text/html' }
    });
  }
}

// Helper function to serve HTML files with rewriting
async function serveHtmlFile(data: Blob, deployment: any): Promise<Response> {
  const htmlContent = await data.text();
  const rewrittenHtml = rewriteHtmlForDeployment(htmlContent, deployment.url);
  
  console.log('✅ HTML served (rewritten on-the-fly)');
  console.log('Response length:', rewrittenHtml.length);
  console.log('First 100 chars:', rewrittenHtml.substring(0, Math.min(100, rewrittenHtml.length)));
  
  return new Response(rewrittenHtml, {
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'public, max-age=31536000, immutable',
      'Access-Control-Allow-Origin': '*',
      'X-HTML-Rewritten': 'true',
      'X-Deployment-URL': deployment.url
    }
  });
}

// Helper function to serve non-HTML files
function serveFile(data: Blob, filePath: string, deployment: any): Response {
  console.log('✅ Served successfully!');
  
  return new Response(data, {
    headers: {
      'Content-Type': getContentType(filePath),
      'Cache-Control': 'public, max-age=31536000, immutable',
      'Access-Control-Allow-Origin': '*',
      'X-Deployment-URL': deployment.url
    }
  });
}

export async function HEAD(
  request: NextRequest,
  { params }: { params: Promise<{ site: string }> }
) {
  const response = await GET(request, { params });
  return new Response(null, {
    status: response.status,
    headers: response.headers,
  });
}