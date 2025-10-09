// app/api/chat/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from 'app/api/auth/[...nextauth]/route';
import { sendChatMessageController } from "@/interface-adapters/controllers/chat.controller";
import { IAuthenticationService } from "@/application/services/auth.service.interface";

const AuthService: IAuthenticationService = {
  async isAuthenticated(): Promise<boolean> {
    const session = await getServerSession(authOptions);
    return !!session;
  },
};

const chatController = sendChatMessageController(AuthService);

export async function POST(req: NextRequest) {
  try {
    const { message } = await req.json();
    const reply = await chatController(message);
    return NextResponse.json({ reply });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: err.message || "Failed to get AI response" }, { status: 500 });
  }
}
