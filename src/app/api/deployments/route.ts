import { sql } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const deployments = await sql`
      SELECT 
        d.id,
        d.url,
        d.status,
        d.created_at,
        a.hash,
        a.size,
        a.file_count
      FROM deployments d
      JOIN artifacts a ON d.artifact_id = a.id
      WHERE d.user_id = ${session.user.id}
      ORDER BY d.created_at DESC
    `;

    return Response.json({ 
      success: true, 
      deployments 
    });

  } catch (error: any) {
    return Response.json({
      success: false,
      error: error.message,
    }, { status: 500 });
  }
}