import { getConnection } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  let connection: any = null;
  
  try {
    console.log("[Tasks Update API] PUT request received at:", new Date().toISOString());
    
    const { id } = await params;
    console.log("[Tasks Update API] Params.id:", id);
    console.log("[Tasks Update API] Params.id type:", typeof id);
    
    const body = await request.json();
    console.log("[Tasks Update API] Request body:", JSON.stringify(body));
    
    const taskId = id;
    console.log("[Tasks Update API] Task ID from params:", taskId);
    
    const { status, dateCompleted } = body;
    
    console.log("[Tasks Update API] Received status:", status);
    console.log("[Tasks Update API] Received dateCompleted:", dateCompleted);

    if (!taskId || !status) {
      console.log("[Tasks Update API] Missing required fields - taskId:", taskId, "status:", status);
      const errorResponse = { 
        error: "Missing required fields (taskId, status)", 
        received: { taskId, status } 
      };
      console.log("[Tasks Update API] Sending error response:", errorResponse);
      return NextResponse.json(errorResponse, { status: 400 });
    }

    const taskIdNumber = parseInt(taskId, 10);
    if (isNaN(taskIdNumber)) {
      console.log("[Tasks Update API] Invalid taskId:", taskId);
      return NextResponse.json(
        { error: "Invalid taskId", taskId },
        { status: 400 }
      );
    }

    console.log("[Tasks Update API] Connecting to database...");
    connection = await getConnection();
    console.log("[Tasks Update API] Connected to database");

    console.log("[Tasks Update API] Updating task:", taskIdNumber);
    
    if (dateCompleted) {
      console.log("[Tasks Update API] Updating with dateCompleted:", dateCompleted);
      // Update task with status and completion date
      const updateResult = await connection.execute(
        "UPDATE Tasks SET TaskStatus = ?, DateCompleted = ? WHERE TaskID = ?",
        [status, dateCompleted, taskIdNumber]
      );
      console.log("[Tasks Update API] Update result (with date):", updateResult);
    } else {
      console.log("[Tasks Update API] Updating status only (no date)");
      // Update task with status only
      const updateResult = await connection.execute(
        "UPDATE Tasks SET TaskStatus = ? WHERE TaskID = ?",
        [status, taskIdNumber]
      );
      console.log("[Tasks Update API] Update result (no date):", updateResult);
    }
    
    console.log("[Tasks Update API] Task updated successfully");

    await connection.end();
    connection = null;
    console.log("[Tasks Update API] Connection closed");

    const successResponse = { 
      message: "Task updated successfully", 
      taskId: taskIdNumber 
    };
    
    console.log("[Tasks Update API] Sending success response:", successResponse);

    return NextResponse.json(successResponse, { status: 200 });
  } catch (error) {
    console.error("[Tasks Update API] Error updating task:", error);
    
    let errorMessage = "Unknown error";
    let errorCode = "UNKNOWN";
    let errorErrno = "UNKNOWN";
    let errorStack = "";
    
    if (error instanceof Error) {
      errorMessage = error.message;
      errorStack = error.stack || "";
    } else {
      errorMessage = String(error);
    }
    
    if ((error as any)?.code) {
      errorCode = (error as any).code;
    }
    if ((error as any)?.errno) {
      errorErrno = (error as any).errno;
    }
    
    console.error("[Tasks Update API] Error details - Message:", errorMessage);
    console.error("[Tasks Update API] Error details - Code:", errorCode);
    console.error("[Tasks Update API] Error details - Errno:", errorErrno);
    console.error("[Tasks Update API] Error details - Stack:", errorStack);
    
    try {
      if (connection) {
        await connection.end();
      }
    } catch (closeError) {
      console.error("[Tasks Update API] Error closing connection:", closeError);
    }

    const errorResponse: any = { 
      error: "Failed to update task",
      message: errorMessage,
      code: errorCode,
      errno: errorErrno
    };
    
    if (process.env.NODE_ENV === "development") {
      errorResponse.stack = errorStack;
    }

    return NextResponse.json(errorResponse, { status: 500 });
  }
}
