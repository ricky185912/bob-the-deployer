// app/api/deploy/route.ts - UPDATED NORMALIZATION
import { sql } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    console.log("=== DEPLOYMENT CREATION START ===");
    
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      console.log("❌ No session");
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    console.log("User ID:", session.user.id);
    
    const body = await req.json();
    console.log("Request body:", body);

    const { siteName, url, artifactId } = body;
    const actualSiteName = siteName || url;
    
    console.log("Site name/URL:", actualSiteName);
    console.log("Artifact ID:", artifactId);
    
    if (!actualSiteName || !artifactId) {
      console.log("❌ Missing parameters");
      return Response.json({ 
        error: "Site name/URL and artifact ID are required"
      }, { status: 400 });
    }
    
    // NORMALIZE URL - Keep .bob domain!
    let deploymentUrl = actualSiteName
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-')        // Spaces to hyphens
      .replace(/[^\w.-]/g, '')     // Keep dots for .bob, remove other special chars
      .replace(/-+/g, '-')         // Multiple hyphens to single
      .replace(/^\.+|\.+$/g, '')   // Remove leading/trailing dots
      .replace(/^-|-$/g, '');      // Remove leading/trailing hyphens
    
    // ENSURE it ends with .bob
    if (!deploymentUrl.endsWith('.bob')) {
      deploymentUrl += '.bob';
    }
    
    console.log('Normalized deployment URL:', deploymentUrl);
    
    // Check if deployment already exists
    const existing = await sql`
      SELECT id FROM deployments 
      WHERE "url" = ${deploymentUrl}
      AND user_id = ${session.user.id}
      LIMIT 1
    `;
    
    if (existing.length > 0) {
      console.log("❌ Deployment already exists");
      return Response.json({ 
        error: "A deployment with this name already exists" 
      }, { status: 400 });
    }
    
    // Verify artifact exists
    const artifactExists = await sql`
      SELECT id FROM artifacts WHERE id = ${artifactId}
    `;
    
    if (artifactExists.length === 0) {
      console.log("❌ Artifact not found:", artifactId);
      return Response.json({ 
        error: "Artifact not found" 
      }, { status: 400 });
    }
    
    // Create deployment
    const [deployment] = await sql`
      INSERT INTO deployments (
        "url",
        artifact_id, 
        user_id, 
        status
      ) VALUES (
        ${deploymentUrl},
        ${artifactId},
        ${session.user.id},
        'READY'
      ) RETURNING 
        id, 
        "url",
        status, 
        created_at,
        artifact_id
    `;
    
    console.log('✓ Deployment created:', deployment.url);
    console.log("=== DEPLOYMENT CREATION END ===");
    
    return Response.json({ 
      success: true, 
      deployment 
    }, { status: 201 });

  } catch (error: unknown) {
    console.error("❌ Deployment creation error:", error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return Response.json({
      success: false,
      error: errorMessage,
    }, { status: 500 });
  }
}