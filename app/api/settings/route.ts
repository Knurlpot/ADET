import { NextRequest, NextResponse } from 'next/server';
import { getConnection } from '@/lib/db';
import bcrypt from 'bcryptjs';

export async function GET(request: NextRequest) {
  try {
    const userId = request.nextUrl.searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    const connection = await getConnection();

    const [users] = await connection.execute(
      'SELECT UserID, Username, Email FROM Users WHERE UserID = ?',
      [userId]
    );

    await connection.end();

    if (!Array.isArray(users) || users.length === 0) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    const user = users[0] as { UserID: number; Username: string; Email: string };

    return NextResponse.json(
      {
        message: 'User data retrieved successfully',
        user,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Get user settings error:', error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      { error: `Internal server error: ${errorMessage}` },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { userId, username, email, newPassword } = await request.json();

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    const connection = await getConnection();

    // Build update query dynamically
    const updates: string[] = [];
    const values: (string | number)[] = [];

    if (username) {
      updates.push('Username = ?');
      values.push(username);
    }

    if (email) {
      updates.push('Email = ?');
      values.push(email);
    }

    if (newPassword) {
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      updates.push('AccountPassword = ?');
      values.push(hashedPassword);
    }

    if (updates.length === 0) {
      await connection.end();
      return NextResponse.json(
        { error: 'No fields to update' },
        { status: 400 }
      );
    }

    values.push(userId);

    const query = `UPDATE Users SET ${updates.join(', ')} WHERE UserID = ?`;

    await connection.execute(query, values);
    await connection.end();

    return NextResponse.json(
      { message: 'User settings updated successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Update user settings error:', error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      { error: `Internal server error: ${errorMessage}` },
      { status: 500 }
    );
  }
}
