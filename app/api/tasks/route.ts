import { getConnection } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

type TaskCategory = "Personal" | "School" | "Work" | "Fitness" | "Others";
type TaskPriority = "Low" | "Medium" | "High";
type TaskStatus = "Pending" | "In-Progress" | "Completed";

type Task = {
  TaskID: number;
  TaskName: string;
  TaskDesc: string;
  TaskCategory: TaskCategory;
  PriorityLevel: TaskPriority;
  TaskStatus: TaskStatus;
};

export async function POST(request: NextRequest) {
  let connection: any = null;
  
  try {
    console.log("[Tasks API] POST request received");
    
    const body = await request.json();
    console.log("[Tasks API] Request body:", body);
    
    const { userId, name, description, category, priority, status } = body;

    if (!userId || !name || !description || !category || !priority) {
      console.log("[Tasks API] Missing required fields");
      return NextResponse.json(
        { error: "Missing required fields", received: { userId, name, description, category, priority } },
        { status: 400 }
      );
    }

    const userIdNumber = parseInt(userId, 10);
    if (isNaN(userIdNumber)) {
      console.log("[Tasks API] Invalid userId:", userId);
      return NextResponse.json(
        { error: "Invalid userId", userId },
        { status: 400 }
      );
    }

    console.log("[Tasks API] Connecting to database...");
    connection = await getConnection();
    console.log("[Tasks API] Connected to database");

    console.log("[Tasks API] Inserting task for UserID:", userIdNumber);
    const [result] = await connection.execute(
      "INSERT INTO Tasks (UserID, TaskName, TaskDesc, TaskCategory, PriorityLevel, TaskStatus) VALUES (?, ?, ?, ?, ?, ?)",
      [userIdNumber, name, description, category, priority, status || "Pending"]
    );
    console.log("[Tasks API] Task inserted, result:", result);

    await connection.end();
    connection = null;
    console.log("[Tasks API] Connection closed");

    return NextResponse.json(
      { 
        message: "Task created successfully", 
        taskId: (result as any).insertId 
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("[Tasks API] Error creating task:", error);
    
    const errorMessage = error instanceof Error ? error.message : String(error);
    const errorStack = error instanceof Error ? error.stack : "";
    const errorCode = (error as any)?.code || "UNKNOWN";
    const errorErrno = (error as any)?.errno || "UNKNOWN";
    
    console.error("[Tasks API] Error details - Message:", errorMessage);
    console.error("[Tasks API] Error details - Code:", errorCode);
    console.error("[Tasks API] Error details - Errno:", errorErrno);
    console.error("[Tasks API] Error details - Stack:", errorStack);
    
    try {
      if (connection) {
        await connection.end();
      }
    } catch (closeError) {
      console.error("[Tasks API] Error closing connection:", closeError);
    }

    return NextResponse.json(
      { 
        error: "Failed to create task",
        message: errorMessage,
        code: errorCode,
        errno: errorErrno,
        stack: process.env.NODE_ENV === "development" ? errorStack : undefined
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  let connection: any = null;
  
  try {
    const userId = request.nextUrl.searchParams.get("userId");
    console.log("[Tasks API] GET request for userId:", userId);

    if (!userId) {
      console.log("[Tasks API] Missing userId parameter");
      return NextResponse.json(
        { error: "userId is required" },
        { status: 400 }
      );
    }

    const userIdNumber = parseInt(userId, 10);
    if (isNaN(userIdNumber)) {
      console.log("[Tasks API] Invalid userId:", userId);
      return NextResponse.json(
        { error: "Invalid userId", userId },
        { status: 400 }
      );
    }

    console.log("[Tasks API] Connecting to database...");
    connection = await getConnection();
    console.log("[Tasks API] Connected to database");

    console.log("[Tasks API] Fetching tasks for UserID:", userIdNumber);
    const [tasks] = await connection.execute(
      "SELECT TaskID, TaskName, TaskDesc, TaskCategory, PriorityLevel, TaskStatus, DateCompleted FROM Tasks WHERE UserID = ? ORDER BY TaskID DESC",
      [userIdNumber]
    );
    console.log("[Tasks API] Tasks fetched:", tasks);

    await connection.end();
    connection = null;
    console.log("[Tasks API] Connection closed");

    return NextResponse.json({ tasks }, { status: 200 });
  } catch (error) {
    console.error("[Tasks API] Error fetching tasks:", error);
    
    const errorMessage = error instanceof Error ? error.message : String(error);
    const errorStack = error instanceof Error ? error.stack : "";
    const errorCode = (error as any)?.code || "UNKNOWN";
    const errorErrno = (error as any)?.errno || "UNKNOWN";
    
    console.error("[Tasks API] Error details - Message:", errorMessage);
    console.error("[Tasks API] Error details - Code:", errorCode);
    console.error("[Tasks API] Error details - Errno:", errorErrno);
    console.error("[Tasks API] Error details - Stack:", errorStack);
    
    try {
      if (connection) {
        await connection.end();
      }
    } catch (closeError) {
      console.error("[Tasks API] Error closing connection:", closeError);
    }

    return NextResponse.json(
      { 
        error: "Failed to fetch tasks", 
        message: errorMessage,
        code: errorCode,
        errno: errorErrno,
        stack: process.env.NODE_ENV === "development" ? errorStack : undefined
      },
      { status: 500 }
    );
  }
}
