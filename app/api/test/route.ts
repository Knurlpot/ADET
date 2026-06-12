import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    console.log("[Test API] POST request received");
    const body = await request.json();
    console.log("[Test API] Body:", body);

    return NextResponse.json(
      { 
        message: "Test successful",
        receivedBody: body,
        timestamp: new Date().toISOString()
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("[Test API] Error:", error);
    return NextResponse.json(
      { 
        error: "Test failed",
        message: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}
