import { useState } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { isAxiosError } from "axios";

import { useAuth } from "@/features/client/auth/auth.hook";
import { useCooldown } from "@/hooks/useCooldown";
import { OtpInput } from "@/components/ui/otpInput";
import { Button } from "@/components/ui/button";
import { PageTransition } from "@/components/layout/pageTransition";

const VerifyEmail = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const email = searchParams.get("email") ?? "";

  const [code, setCode] = useState("");
  const [resendMessage, setResendMessage] = useState<string | null>(null);
  const { secondsLeft, isActive: isCoolingDown, start: startCooldown } = useCooldown(60);

  const {
    verifyEmail,
    isVerifyingEmail,
    verifyEmailError,
    resendVerificationToken,
    isResendingVerificationToken,
  } = useAuth();

  const handleSubmit = async () => {
    if (code.length !== 6) return;

    try {
      await verifyEmail({ email, token: code });
      setIsVerified(true);
    } catch {
      // error already captured by verifyEmailError below
    }
  };

  const handleResend = async () => {
    setResendMessage(null);
    try {
      await resendVerificationToken({ email });
      setResendMessage("A new code has been sent to your email.");
      startCooldown();
    } catch {
      setResendMessage("Couldn't resend the code. Please try again.");
    }
  };

  const [isVerified, setIsVerified] = useState(false);

  const verifyErrorMessage =
    isAxiosError(verifyEmailError) && verifyEmailError.response?.data?.message
      ? verifyEmailError.response.data.message
      : undefined;

  if (!email) {
    return (
      <PageTransition>
        <div className="flex h-full flex-col items-center justify-center bg-[#FAF8F4] px-6 text-center">
          <p className="text-sm text-[#8B8B85]">
            We couldn't find an email to verify.{" "}
            <Link to="/signup" className="font-medium text-[#E8682F] hover:underline">
              Go back to sign up
            </Link>
          </p>
        </div>
      </PageTransition>
    );
  }

  if (isVerified) {
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

            <h1 className="font-serif text-3xl text-[#14151A]">Email verified</h1>
            <p className="mt-2 text-sm text-[#8B8B85]">
              Your account is ready. You can log in now.
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
        <div className="w-full max-w-sm text-center">
          <Link
            to="/"
            className="mb-10 inline-block font-serif text-2xl italic text-[#14151A]"
          >
            Vend<span className="text-[#E8682F]">o</span>ra
          </Link>

          <h1 className="font-serif text-3xl text-[#14151A]">Check your email</h1>
          <p className="mt-2 text-sm text-[#8B8B85]">
            Enter the 6-digit code we sent you to verify your account.
          </p>

          <div className="mt-8">
            <OtpInput value={code} onChange={setCode} error={verifyErrorMessage} />
          </div>

          <Button
            type="button"
            onClick={handleSubmit}
            isLoading={isVerifyingEmail}
            disabled={code.length !== 6}
            className="mt-6 w-full"
          >
            Verify email
          </Button>

          <div className="mt-6 text-sm text-[#8B8B85]">
            Didn't get a code?{" "}
            <button
              type="button"
              onClick={handleResend}
              disabled={isResendingVerificationToken || isCoolingDown}
              className="font-medium text-[#E8682F] hover:underline disabled:opacity-60"
            >
              {isResendingVerificationToken
                ? "Sending..."
                : isCoolingDown
                ? `Resend in ${secondsLeft}s`
                : "Resend code"}
            </button>
          </div>

          {resendMessage && (
            <p className="mt-3 text-xs text-[#8B8B85]">{resendMessage}</p>
          )}
        </div>
      </div>
    </PageTransition>
  );
};

export default VerifyEmail;