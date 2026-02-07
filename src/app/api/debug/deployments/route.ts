// app/api/debug/deployments/route.ts
import { sql } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get all deployments for current user
    const deployments = await sql`
      SELECT 
        d.id,
        d.url,
        d.status,
        d.created_at,
        a.hash,
        a.file_count,
        u.name as user_name,
        u.email as user_email
      FROM deployments d
      JOIN artifacts a ON d.artifact_id = a.id
      JOIN users u ON d.user_id = u.id
      WHERE d.user_id = ${session.user.id}
      ORDER BY d.created_at DESC
    `;

    return Response.json({ 
      success: true, 
      deployments,
      user: {
        id: session.user.id,
        email: session.user.email
      }
    });

  } catch (error: unknown) {
    console.error("Debug error:", error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return Response.json({
      success: false,
      error: errorMessage,
    }, { status: 500 });
  }
}