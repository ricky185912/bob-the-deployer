// app/api/debug/route.ts - For testing
import { supabaseAdmin } from "@/lib/supabase";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const hash = searchParams.get('hash');
  
  if (!hash) {
    return NextResponse.json({ 
      error: "Hash parameter required" 
    }, { status: 400 });
  }
  
  try {
    // List files
    const { data: files, error } = await supabaseAdmin.storage
      .from('artifacts')
      .list(hash);
    
    if (error) {
      return NextResponse.json({ 
        error: error.message 
      }, { status: 500 });
    }
    
    // Get file details
    const fileDetails = [];
    for (const file of files || []) {
      const { data: fileData } = await supabaseAdmin.storage
        .from('artifacts')
        .download(`${hash}/${file.name}`);
      
      fileDetails.push({
        name: file.name,
        size: file.metadata?.size || 0,
        type: file.metadata?.mimetype || 'unknown',
        downloadable: !!fileData
      });
    }
    
    return NextResponse.json({
      hash,
      fileCount: files?.length || 0,
      files: fileDetails
    });
    
  } catch (error: any) {
    return NextResponse.json({ 
      error: error.message 
    }, { status: 500 });
  }
}