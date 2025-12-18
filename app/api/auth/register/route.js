import dbConnect from '@/lib/mongodb';
import User from '@/models/user';
import bcrypt from 'bcrypt';
import { createToken } from '@/lib/auth';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(request) {
  try {
    await dbConnect();
    
    const { username, email, password } = await request.json();

    // Check if user already exists
    const existingUser = await User.findOne({ 
      $or: [{ email }, { username }] 
    });
    
    if (existingUser) {
      return NextResponse.json(
        { error: 'User already exists' },
        { status: 400 }
      );
    }

    // Hash password
    const hash = await bcrypt.hash(password, 10);
    
    // Create new user
    const newUser = new User({
      username,
      email,
      password: hash,
    });

    await newUser.save();

    // Generate token
    const token = createToken({ email, username, _id: newUser._id });
    
    // Set cookie
    const cookieStore = await cookies();
    cookieStore.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7 // 7 days
    });

    return NextResponse.json({ 
      success: true,
      message: 'User registered successfully' 
    });
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Error during registration' },
      { status: 500 }
    );
  }
}
