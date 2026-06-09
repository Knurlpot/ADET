import { NextRequest, NextResponse } from 'next/server';
import { getConnection } from '@/lib/db';
import bcrypt from 'bcryptjs';

export async function POST(request: NextRequest) {
  try {
    const { username, email, accountPassword } = await request.json();

    // Validation
    if (!username || !email || !accountPassword) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    // Validate password strength
    if (accountPassword.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters long' },
        { status: 400 }
      );
    }

    const connection = await getConnection();

    // Check if email already exists
    const [existingUser] = await connection.execute(
      'SELECT * FROM Users WHERE Email = ?',
      [email]
    );

    if (Array.isArray(existingUser) && existingUser.length > 0) {
      await connection.end();
      return NextResponse.json(
        { error: 'Email already exists' },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(accountPassword, 10);

    // Insert new user
    await connection.execute(
      'INSERT INTO Users (Username, Email, AccountPassword) VALUES (?, ?, ?)',
      [username, email, hashedPassword]
    );

    await connection.end();

    return NextResponse.json(
      { message: 'User created successfully' },
      { status: 201 }
    );
  } catch (error) {
    console.error('Signup error details:', error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('Error message:', errorMessage);
    return NextResponse.json(
      { error: `Internal server error: ${errorMessage}` },
      { status: 500 }
    );
  }
}
