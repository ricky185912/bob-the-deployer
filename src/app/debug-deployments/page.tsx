// src/app/debug-deployments/page.tsx
import { sql } from "@/lib/db";

export default async function DebugPage() {
  const deployments = await sql`
    SELECT id, url, created_at 
    FROM deployments 
    ORDER BY created_at DESC 
    LIMIT 10
  `;

  return (
    <div>
      <h1>Existing Deployments</h1>
      <ul>
        {deployments.map((dep: any) => (
          <li key={dep.id}>
            URL: <strong>{dep.url}</strong> | Created: {dep.created_at.toISOString()}
          </li>
        ))}
      </ul>
    </div>
  );
}