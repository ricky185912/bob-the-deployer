// src/app/api/auth/test/route.ts
export async function GET() {
  return Response.json({ 
    message: "Auth API is working",
    timestamp: new Date().toISOString() 
  });
}