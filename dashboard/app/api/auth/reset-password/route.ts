import { NextRequest, NextResponse } from "next/server";
import {
  createPasswordResetToken,
  resetUserPasswordWithToken,
  verifyResetToken,
} from "@/lib/db/auth-db";
import { hashPassword } from "@/lib/auth/password";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { email, token, newPassword } = body;

    // Mode A: Reset password using verified token
    if (token) {
      if (!newPassword || typeof newPassword !== "string" || newPassword.length < 6) {
        return NextResponse.json(
          { error: "New password must be at least 6 characters in length." },
          { status: 400 }
        );
      }

      const newPasswordHash = hashPassword(newPassword);
      const success = await resetUserPasswordWithToken(token, newPasswordHash);

      if (!success) {
        return NextResponse.json(
          { error: "Reset token is invalid or has expired. Please request a new one." },
          { status: 400 }
        );
      }

      return NextResponse.json({
        success: true,
        message: "Your password has been successfully updated. You may now sign in.",
      });
    }

    // Mode B: Request a password reset token
    if (!email || typeof email !== "string" || !email.includes("@")) {
      return NextResponse.json(
        { error: "A valid work email address is required." },
        { status: 400 }
      );
    }

    const resetToken = await createPasswordResetToken(email);

    // In production with Resend/Postmark configured, the email is dispatched here.
    // For privacy and security, we always return a generic success response to prevent user enumeration.
    return NextResponse.json({
      success: true,
      message:
        "If an active account is associated with this email address, password reset instructions have been generated.",
      // Include token in dev/beta for immediate verification
      ...(process.env.NODE_ENV !== "production" && resetToken ? { devToken: resetToken } : {}),
    });
  } catch (err: any) {
    console.error("[API:Auth:ResetPassword] Error:", err);
    return NextResponse.json(
      { error: "An unexpected error occurred while processing your password reset request." },
      { status: 500 }
    );
  }
}

