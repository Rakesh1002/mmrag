import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function query(data: any) {
  const response = await fetch(
    "https://k5z2ypefl2tfymw7.us-east-1.aws.endpoints.huggingface.cloud",
    {
      headers: { 
        "Accept" : "application/json",
        "Authorization": "Bearer hf_XXXXX",
        "Content-Type": "application/json" 
      },
      method: "POST",
      body: JSON.stringify(data),
    }
  );
  const result = await response.json();
  return result;
}

export async function POST(req: NextRequest) {
  const session = await getServerSession();
  if (!session || !session.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { message } = await req.json();

  try {
    const response = await query({
      inputs: message,
      parameters: {}
    });

    // Save the chat message and response to the database
    await prisma.chatMessage.create({
      data: {
        userId: session.user.id,
        message: message,
        response: response.generated_text,
      },
    });

    return NextResponse.json({ response: response.generated_text });
  } catch (error) {
    console.error('Error querying Hugging Face API:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  const session = await getServerSession();
  if (!session || !session.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const chatHistory = await prisma.chatMessage.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: 'desc' },
      take: 50, // Limit to last 50 messages
    });

    return NextResponse.json({ chatHistory });
  } catch (error) {
    console.error('Error fetching chat history:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}