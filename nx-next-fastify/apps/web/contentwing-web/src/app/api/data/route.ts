import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
    console.log('API route called - server side log');

    // Simulate some server-side processing
    const serverData = {
        timestamp: new Date().toISOString(),
        message: 'Hello from server!',
        randomNumber: Math.floor(Math.random() * 1000)
    };

    return NextResponse.json(serverData);
}

export async function POST(request: NextRequest) {
    const body = await request.json();
    console.log('POST request received:', body);

    return NextResponse.json({
        received: body,
        processed: true,
        serverTime: new Date().toISOString()
    });
}