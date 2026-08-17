import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { isAxiosError } from "axios";
import { z } from "zod";

import {
  sendAdminVerificationSchema,
  nameSchema,
} from "@/features/admin/auth/auth.validation";
import { emailSchema } from "@/features/client/auth/auth.validation";
import { useAdminAuth } from "@/features/admin/auth/auth.hook";
import { useCooldown } from "@/hooks/useCooldown";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const forgotPasswordTriggerSchema = z.object({ email: emailSchema });
type ForgotPasswordTriggerValues = z.infer<typeof forgotPasswordTriggerSchema>;
type InviteFormValues = z.infer<typeof sendAdminVerificationSchema>;

type Tab = "invite" | "reset";

const AdminManagement = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<Tab>("invite");
  return (
    <div className="mx-auto max-w-lg">
      <h1 className="font-serif text-2xl text-[#14151A]">Admin Management</h1>
      <p className="mt-2 text-sm text-[#8B8B85]">
        Invite new admins or help a teammate reset their password.
      </p>

      <div className="mt-6 flex gap-2 border-b border-[#E5E2DA]">
        <button
          type="button"
          onClick={() => setActiveTab("invite")}
          className={`px-4 py-2 text-sm font-medium ${
            activeTab === "invite"
              ? "border-b-2 border-[#E8682F] text-[#14151A]"
              : "text-[#8B8B85]"
          }`}
        >
          Invite admin
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("reset")}
          className={`px-4 py-2 text-sm font-medium ${
            activeTab === "reset"
              ? "border-b-2 border-[#E8682F] text-[#14151A]"
              : "text-[#8B8B85]"
          }`}
        >
          Reset admin password
        </button>
      </div>

      <div className="mt-6">
        {activeTab === "invite" ? (
          <InviteAdminPanel onDone={() => navigate("/admin/dashboard")} />
        ) : (
          <ResetAdminPasswordPanel onDone={() => navigate("/admin/dashboard")} />
        )}
      </div>
    </div>
  );
};

const InviteAdminPanel = ({ onDone }: { onDone: () => void }) => {
  const [sentEmail, setSentEmail] = useState<string | null>(null);
  const [resendMessage, setResendMessage] = useState<string | null>(null);
  const { secondsLeft, isActive: isCoolingDown, start: startCooldown } = useCooldown(60);

  const {
    sendAdminVerification,
    isSendingAdminVerification,
    sendAdminVerificationError,
    resendAdminVerification,
    isResendingAdminVerification,
  } = useAdminAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<InviteFormValues>({
    resolver: zodResolver(sendAdminVerificationSchema),
  });

  const onSubmit = async (values: InviteFormValues) => {
    await sendAdminVerification(values);
    setSentEmail(values.email);
  };

  const handleResend = async () => {
    if (!sentEmail) return;
    setResendMessage(null);
    try {
      await resendAdminVerification({ email: sentEmail });
      setResendMessage("Invite resent.");
      startCooldown();
    } catch {
      setResendMessage("Couldn't resend. Please try again.");
    }
  };

  const errorMessage =
    isAxiosError(sendAdminVerificationError) && sendAdminVerificationError.response?.data?.message
      ? sendAdminVerificationError.response.data.message
      : undefined;

  if (sentEmail) {
    return (
      <div className="rounded-lg border border-[#E5E2DA] bg-white p-6 text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#E8682F]/10">
          <svg className="h-6 w-6 text-[#E8682F]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="font-serif text-xl text-[#14151A]">Invite sent</h2>
        <p className="mt-2 text-sm text-[#8B8B85]">
          We've emailed an invite to <span className="font-medium text-[#14151A]">{sentEmail}</span>.
        </p>

        <button
          type="button"
          onClick={handleResend}
          disabled={isResendingAdminVerification || isCoolingDown}
          className="mt-4 text-sm font-medium text-[#E8682F] hover:underline disabled:opacity-60"
        >
          {isResendingAdminVerification
            ? "Resending..."
            : isCoolingDown
            ? `Resend invite in ${secondsLeft}s`
            : "Resend invite"}
        </button>

        {resendMessage && <p className="mt-2 text-xs text-[#8B8B85]">{resendMessage}</p>}

        <Button onClick={onDone} variant="secondary" className="mt-6 w-full">
          Done
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <Input
        label="Name"
        type="text"
        id="invite-name"
        placeholder="New admin's full name"
        error={errors.name?.message}
        {...register("name")}
      />
      <Input
        label="Email"
        type="email"
        id="invite-email"
        placeholder="newadmin@example.com"
        error={errors.email?.message}
        {...register("email")}
      />

      {errorMessage && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{errorMessage}</p>
      )}

      <Button type="submit" isLoading={isSendingAdminVerification} className="mt-2 w-full">
        Send invite
      </Button>
    </form>
  );
};

const ResetAdminPasswordPanel = ({ onDone }: { onDone: () => void }) => {
  const [sentEmail, setSentEmail] = useState<string | null>(null);
  const [resendMessage, setResendMessage] = useState<string | null>(null);
  const { secondsLeft, isActive: isCoolingDown, start: startCooldown } = useCooldown(60);

  const {
    adminForgotPassword,
    isSendingAdminForgotPassword,
    adminForgotPasswordError,
    resendAdminForgotPassword,
    isResendingAdminForgotPassword,
  } = useAdminAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordTriggerValues>({
    resolver: zodResolver(forgotPasswordTriggerSchema),
  });

  const onSubmit = async (values: ForgotPasswordTriggerValues) => {
    await adminForgotPassword(values);
    setSentEmail(values.email);
  };

  const handleResend = async () => {
    if (!sentEmail) return;
    setResendMessage(null);
    try {
      await resendAdminForgotPassword({ email: sentEmail });
      setResendMessage("Reset code resent.");
      startCooldown();
    } catch {
      setResendMessage("Couldn't resend. Please try again.");
    }
  };

  const errorMessage =
    isAxiosError(adminForgotPasswordError) && adminForgotPasswordError.response?.data?.message
      ? adminForgotPasswordError.response.data.message
      : undefined;

  if (sentEmail) {
    return (
      <div className="rounded-lg border border-[#E5E2DA] bg-white p-6 text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#E8682F]/10">
          <svg className="h-6 w-6 text-[#E8682F]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="font-serif text-xl text-[#14151A]">Reset code sent</h2>
        <p className="mt-2 text-sm text-[#8B8B85]">
          We've emailed a reset code to <span className="font-medium text-[#14151A]">{sentEmail}</span>.
        </p>

        <button
          type="button"
          onClick={handleResend}
          disabled={isResendingAdminForgotPassword || isCoolingDown}
          className="mt-4 text-sm font-medium text-[#E8682F] hover:underline disabled:opacity-60"
        >
          {isResendingAdminForgotPassword
            ? "Resending..."
            : isCoolingDown
            ? `Resend code in ${secondsLeft}s`
            : "Resend code"}
        </button>

        {resendMessage && <p className="mt-2 text-xs text-[#8B8B85]">{resendMessage}</p>}

        <Button onClick={onDone} variant="secondary" className="mt-6 w-full">
          Done
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <Input
        label="Admin's email"
        type="email"
        id="reset-email"
        placeholder="admin@example.com"
        error={errors.email?.message}
        {...register("email")}
      />

      {errorMessage && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{errorMessage}</p>
      )}

      <Button type="submit" isLoading={isSendingAdminForgotPassword} className="mt-2 w-full">
        Send reset code
      </Button>
    </form>
  );
};

export default AdminManagement;