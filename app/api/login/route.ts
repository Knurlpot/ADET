import { NextRequest, NextResponse } from 'next/server';
import { getConnection } from '@/lib/db';
import bcrypt from 'bcryptjs';

export async function POST(request: NextRequest) {
  try {
    const { email, accountPassword } = await request.json();

    // Validation
    if (!email || !accountPassword) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    const connection = await getConnection();

    // Find user by email
    const [users] = await connection.execute(
      'SELECT * FROM Users WHERE Email = ?',
      [email]
    );

    await connection.end();

    if (!Array.isArray(users) || users.length === 0) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    const user = users[0] as { AccountPassword: string; UserID: number; Username: string };

    // Compare password with hashed password
    const isPasswordValid = await bcrypt.compare(
      accountPassword,
      user.AccountPassword
    );

    if (!isPasswordValid) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { 
        message: 'Login successful',
        userId: user.UserID,
        username: user.Username,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Login error details:', error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('Error message:', errorMessage);
    return NextResponse.json(
      { error: `Internal server error: ${errorMessage}` },
      { status: 500 }
    );
  }
}
