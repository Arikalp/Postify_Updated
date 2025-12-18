import dbConnect from '@/lib/mongodb';
import Post from '@/models/post';
import { getUser } from '@/lib/auth';
import { NextResponse } from 'next/server';

export async function POST(request, { params }) {
  try {
    const user = await getUser();
    
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await dbConnect();
    
    const { id } = await params;
    const post = await Post.findOne({ _id: id });

    if (!post) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      );
    }

    const userId = user._id;

    if (post.likes.includes(userId)) {
      post.likes.pull(userId);
    } else {
      post.likes.push(userId);
    }

    await post.save();

    return NextResponse.json({ 
      success: true,
      liked: post.likes.includes(userId),
      likesCount: post.likes.length 
    });
  } catch (error) {
    console.error('Error liking/unliking post:', error);
    return NextResponse.json(
      { error: 'Error liking/unliking post' },
      { status: 500 }
    );
  }
}
