import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, Link } from "react-router-dom";
import { isAxiosError } from "axios";
import { useState } from "react";

import {
  resetPasswordSchema,
  type AdminResetPasswordFormValues,
} from "@/features/admin/auth/auth.validation";

import { useAdminAuth } from "@/features/admin/auth/auth.hook";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { OtpInput } from "@/components/ui/otpInput";
import { PageTransition } from "@/components/layout/pageTransition";




const AdminResetPassword = () => {
  const [isReset, setIsReset] = useState(false);
  const navigate = useNavigate();

  const {
    adminResetPassword,
    isResettingAdminPassword,
    adminResetPasswordError,
  } = useAdminAuth();

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<AdminResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      token: "",
    },
  });

  const onSubmit = async (values: AdminResetPasswordFormValues) => {
  try {
    await adminResetPassword(values);
    setIsReset(true);
  } catch (error) {}
};

  const errorMessage =
    isAxiosError(adminResetPasswordError) &&
    adminResetPasswordError.response?.data?.message
      ? adminResetPasswordError.response.data.message
      : undefined;


  if (isReset) {
  return (
    <PageTransition>
      <div className="flex min-h-screen items-center justify-center bg-[#FAF8F4] px-6 text-center">
        <div className="w-full max-w-sm">
          <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-[#E8682F]/10">
            <svg
              className="h-7 w-7 text-[#E8682F]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>

          <h1 className="font-serif text-3xl text-[#14151A]">
            Password Reset
          </h1>

          <p className="mt-2 text-sm text-[#8B8B85]">
            Your password has been updated successfully. You can now sign in
            with your new password.
          </p>

          <Button
            onClick={() => navigate("/admin/login")}
            className="mt-8 w-full"
          >
            Continue to Login
          </Button>
        </div>
      </div>
    </PageTransition>
  );
}    
  return (
    <PageTransition>
      <div className="flex min-h-screen items-center justify-center bg-[#FAF8F4] px-6">

        <div className="w-full max-w-sm">

          {/* LOGO */}
          <Link
            to="/"
            className="mb-10 inline-block font-serif text-2xl italic text-[#14151A]"
          >
            Vend<span className="text-[#E8682F]">o</span>ra
          </Link>

          <h1 className="font-serif text-3xl text-[#14151A]">
            Reset Password
          </h1>

          <p className="mt-2 text-sm text-[#8B8B85]">
            Enter the code sent by the super admin
          </p>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="mt-8 flex flex-col gap-4"
          >

            {/* EMAIL */}
            <Input
              label="Email"
              type="email"
              id="email"
              placeholder="admin@vendora.com"
              error={errors.email?.message}
              {...register("email")}
            />

            {/* OTP TOKEN */}
            <div>
              <p className="mb-2 text-xs font-medium uppercase tracking-wide text-[#8B8B85]">
                Reset Code
              </p>

              <Controller
                name="token"
                control={control}
                render={({ field }) => (
                  <OtpInput
                    length={6}
                    value={field.value}
                    onChange={field.onChange}
                    error={errors.token?.message}
                  />
                )}
              />
            </div>

            {/* NEW PASSWORD */}
            <Input
              label="New Password"
              type="password"
              id="newPassword"
              placeholder="Enter new secure password"
              error={errors.newPassword?.message}
              {...register("newPassword")}
            />

            {/* ERROR */}
            {errorMessage && (
              <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
                {errorMessage}
              </p>
            )}

            {/* BUTTON */}
            <Button
              type="submit"
              isLoading={isResettingAdminPassword}
              className="mt-2 w-full"
            >
              Reset Password
            </Button>
          </form>

          {/* BACK TO LOGIN */}
          <p className="mt-8 text-center text-sm text-[#8B8B85]">
            Remembered it?{" "}
            <Link
              to="/admin/login"
              className="font-medium text-[#E8682F] hover:underline"
            >
              Back to login
            </Link>
          </p>

        </div>
      </div>
    </PageTransition>
  );
};

export default AdminResetPassword;