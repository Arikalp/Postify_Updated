import dbConnect from '@/lib/mongodb';
import Post from '@/models/post';
import User from '@/models/user';
import { getUser } from '@/lib/auth';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const user = await getUser();
    
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await dbConnect();
    
    const { content } = await request.json();

    // Create new post
    const newPost = new Post({
      content,
      user: user._id,
      createdAt: new Date(),
    });

    await newPost.save();

    // Update user's posts array
    await User.findOneAndUpdate(
      { username: user.username },
      { $push: { post: newPost._id } }
    );

    return NextResponse.json({ 
      success: true,
      message: 'Post created successfully',
      post: newPost 
    });
  } catch (error) {
    console.error('Error creating post:', error);
    return NextResponse.json(
      { error: 'Error creating post' },
      { status: 500 }
    );
  }
}

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

    const userWithPosts = await User.findOne({ username: user.username })
      .populate({
        path: 'post',
        populate: { path: 'user', select: 'username' }
      });

    if (!userWithPosts) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ 
      success: true,
      posts: userWithPosts.post 
    });
  } catch (error) {
    console.error('Error fetching posts:', error);
    return NextResponse.json(
      { error: 'Error fetching posts' },
      { status: 500 }
    );
  }
}
