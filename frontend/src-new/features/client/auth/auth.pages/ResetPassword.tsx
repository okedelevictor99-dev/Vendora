import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { isAxiosError } from "axios";
import { z } from "zod";

import { passwordSchema } from "@/features/client/auth/auth.validation";
import { useAuth } from "@/features/client/auth/auth.hook";
import { useCooldown } from "@/hooks/useCooldown";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { OtpInput } from "@/components/ui/otpInput";
import { PageTransition } from "@/components/layout/pageTransition";

const newPasswordSchema = z.object({ newPassword: passwordSchema });
type NewPasswordFormValues = z.infer<typeof newPasswordSchema>;

const ResetPassword = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const email = searchParams.get("email") ?? "";

  const [code, setCode] = useState("");
  const [codeTouched, setCodeTouched] = useState(false);
  const [isReset, setIsReset] = useState(false);
  const [resendMessage, setResendMessage] = useState<string | null>(null);
  const { secondsLeft, isActive: isCoolingDown, start: startCooldown } = useCooldown(60);

  const {
    resetPassword,
    isResettingPassword,
    resetPasswordError,
    resendForgotPasswordToken,
    isResendingForgotPasswordToken,
  } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<NewPasswordFormValues>({
    resolver: zodResolver(newPasswordSchema),
  });

  const onSubmit = async (values: NewPasswordFormValues) => {
    setCodeTouched(true);
    if (code.length !== 6) return;

    try {
      await resetPassword({ email, token: code, newPassword: values.newPassword });
      setIsReset(true);
    } catch {
      // error already captured by resetPasswordError below
    }
  };

  const handleResend = async () => {
    setResendMessage(null);
    try {
      await resendForgotPasswordToken({ email });
      setResendMessage("A new code has been sent to your email.");
      startCooldown();
    } catch {
      setResendMessage("Couldn't resend the code. Please try again.");
    }
  };

  const resetErrorMessage =
    isAxiosError(resetPasswordError) && resetPasswordError.response?.data?.message
      ? resetPasswordError.response.data.message
      : undefined;

  if (!email) {
    return (
      <PageTransition>
        <div className="flex h-full flex-col items-center justify-center bg-[#FAF8F4] px-6 text-center">
          <p className="text-sm text-[#8B8B85]">
            We couldn't find an email to reset.{" "}
            <Link to="/forgot-password" className="font-medium text-[#E8682F] hover:underline">
              Start over
            </Link>
          </p>
        </div>
      </PageTransition>
    );
  }

  if (isReset) {
    return (
      <PageTransition>
        <div className="flex h-full flex-col items-center justify-center bg-[#FAF8F4] px-6 text-center">
          <div className="w-full max-w-sm">
            <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-[#E8682F]/10">
              <svg
                className="h-7 w-7 text-[#E8682F]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>

            <h1 className="font-serif text-3xl text-[#14151A]">Password reset</h1>
            <p className="mt-2 text-sm text-[#8B8B85]">
              Your password has been updated. You can log in now.
            </p>

            <Button onClick={() => navigate("/login")} className="mt-8 w-full">
              Continue to login
            </Button>
          </div>
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <div className="flex h-full flex-col items-center justify-center bg-[#FAF8F4] px-6">
        <div className="w-full max-w-sm">
          <Link
            to="/"
            className="mb-10 inline-block font-serif text-2xl italic text-[#14151A]"
          >
            Vend<span className="text-[#E8682F]">o</span>ra
          </Link>

          <h1 className="font-serif text-3xl text-[#14151A]">Reset your password</h1>
          <p className="mt-2 text-sm text-[#8B8B85]">
            Enter the code we sent you and choose a new password.
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="mt-8 flex flex-col gap-4">
            <OtpInput
              value={code}
              onChange={(value) => {
                setCode(value);
              }}
              error={codeTouched && code.length !== 6 ? "Enter the 6-digit code" : undefined}
            />

            <div>
              <Input
                label="New password"
                type="password"
                id="newPassword"
                placeholder="••••••••"
                error={errors.newPassword?.message}
                {...register("newPassword")}
              />
              {!errors.newPassword && (
                <p className="mt-1.5 text-xs text-[#8B8B85]">
                  At least 8 characters, with uppercase, lowercase, and a number.
                </p>
              )}
            </div>

            {resetErrorMessage && (
              <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
                {resetErrorMessage}
              </p>
            )}

            <Button type="submit" isLoading={isResettingPassword} className="mt-2 w-full">
              Reset password
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-[#8B8B85]">
            Didn't get a code?{" "}
            <button
              type="button"
              onClick={handleResend}
              disabled={isResendingForgotPasswordToken || isCoolingDown}
              className="font-medium text-[#E8682F] hover:underline disabled:opacity-60"
            >
              {isResendingForgotPasswordToken
                ? "Sending..."
                : isCoolingDown
                ? `Resend in ${secondsLeft}s`
                : "Resend code"}
            </button>
          </div>

          {resendMessage && (
            <p className="mt-3 text-center text-xs text-[#8B8B85]">{resendMessage}</p>
          )}
        </div>
      </div>
    </PageTransition>
  );
};

export default ResetPassword;