import dbConnect from '@/lib/mongodb';
import User from '@/models/user';
import { getUser } from '@/lib/auth';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const user = await getUser();
    
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await dbConnect();

    const userProfile = await User.findOne({ username: user.username })
      .populate({
        path: 'post',
        populate: { path: 'user', select: 'username' }
      });

    if (!userProfile) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ 
      success: true,
      user: {
        _id: userProfile._id,
        username: userProfile.username,
        email: userProfile.email,
        posts: userProfile.post
      }
    });
  } catch (error) {
    console.error('Error fetching profile:', error);
    return NextResponse.json(
      { error: 'Error fetching profile' },
      { status: 500 }
    );
  }
}
