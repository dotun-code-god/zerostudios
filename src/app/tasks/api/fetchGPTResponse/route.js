import OpenAI from 'openai';
import { OpenAIStream, StreamingTextResponse } from 'ai';
import { NextRequest, NextResponse } from 'next/server';

const openai = new OpenAI({ 
    apiKey: process.env.NEXT_OPENAI_API_KEY 
});

export const runtime = 'edge'

export async function POST(req){
    try {
        const body = await req.json();
        const response = await openai.chat.completions.create(body);

        const stream = OpenAIStream(response);
        return new StreamingTextResponse(stream);
    } catch (error) {
        if (error instanceof OpenAI.APIError) {
            const { name, status, headers, message } = error;
            return NextResponse.json({ name, status, headers, message }, { status });
        } else {
            throw error;
        }
    }
}