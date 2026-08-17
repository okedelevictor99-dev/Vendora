import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, Link, useSearchParams } from "react-router-dom";
import { isAxiosError } from "axios";

import {
  adminSignupSchema,
  type AdminSignupFormValues,
} from "@/features/admin/auth/auth.validation";

import { useAdminAuth } from "@/features/admin/auth/auth.hook";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PageTransition } from "@/components/layout/pageTransition";
import { OtpInput } from "@/components/ui/otpInput";

const AdminSignup = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [signupSuccess, setSignupSuccess] = useState(false);

  const prefilledEmail = searchParams.get("email") || "";

  const { adminSignup, isAdminSigningUp, adminSignupError } = useAdminAuth();

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<AdminSignupFormValues>({
    resolver: zodResolver(adminSignupSchema),
    defaultValues: {
      email: prefilledEmail,
      token: "",
    },
  });

  const onSubmit = async (values: AdminSignupFormValues) => {
    try {
      await adminSignup(values);
      setSignupSuccess(true);
    } catch {
      // handled by react-query
    }
  };

  const errorMessage =
    isAxiosError(adminSignupError) &&
    adminSignupError.response?.data?.message
      ? adminSignupError.response.data.message
      : undefined;

  return (
    <PageTransition>
      <div className="min-h-screen overflow-hidden bg-[#FAF8F4] md:flex">
        {/* LEFT SIDE */}
        <section className="flex w-full items-center justify-center px-6 py-6 md:w-1/2">
          <div className="w-full max-w-md space-y-6">
            {/* LOGO */}
            <Link
              to="/"
              className="inline-block font-serif text-2xl italic text-[#14151A]"
            >
              Vend<span className="text-[#E8682F]">o</span>ra
            </Link>

            {!signupSuccess ? (
              <>
                {/* HEADER */}
                <div>
                  <h1 className="font-serif text-3xl text-[#14151A]">
                    Admin Setup
                  </h1>

                  <p className="mt-2 text-sm text-[#8B8B85]">
                    Complete your invitation to activate access
                  </p>
                </div>

                {/* FORM */}
                <form
                  onSubmit={handleSubmit(onSubmit)}
                  className="flex flex-col gap-5"
                >
                  <Input
                    label="Email"
                    type="email"
                    id="email"
                    placeholder="admin@vendora.com"
                    error={errors.email?.message}
                    {...register("email")}
                  />

                  {/* OTP */}
                  <div className="flex flex-col gap-2">
                    <p className="text-xs font-medium uppercase tracking-wide text-[#8B8B85]">
                      Invite Code
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

                  <Input
                    label="Password"
                    type="password"
                    id="password"
                    placeholder="Create a secure password"
                    error={errors.password?.message}
                    {...register("password")}
                  />

                  {/* Reserved space for server errors */}
                  <div>
                    {errorMessage && (
                      <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
                        {errorMessage}
                      </p>
                    )}
                  </div>

                  <Button
                    type="submit"
                    isLoading={isAdminSigningUp}
                    className="w-full"
                  >
                    Activate Admin Account
                  </Button>
                </form>

                {/* FOOTER */}
                <p className="text-center text-sm text-[#8B8B85]">
                  Already activated?{" "}
                  <Link
                    to="/admin/login"
                    className="font-medium text-[#E8682F] hover:underline"
                  >
                    Sign in
                  </Link>
                </p>
              </>
            ) : (
              <div className="flex flex-col items-center text-center">
                <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-[#E8682F]/10">
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

                <h2 className="font-serif text-3xl text-[#14151A]">
                  Signup successful
                </h2>

                <p className="mt-2 text-sm text-[#8B8B85]">
                  Your admin account has been activated successfully. You can now
                  log in to access the admin dashboard.
                </p>

                <Button
                  onClick={() => navigate("/admin/login")}
                  className="mt-8 w-full"
                >
                  Continue to login
                </Button>
              </div>
            )}
          </div>
        </section>

        {/* RIGHT SIDE */}
        <aside className="relative hidden items-center justify-center overflow-hidden bg-[#14151A] md:flex md:w-1/2">
          <div
            className="absolute inset-0 opacity-[0.07]"
            style={{
              backgroundImage:
                "repeating-linear-gradient(45deg, #fff 0, #fff 1px, transparent 1px, transparent 40px)",
            }}
          />

          <div className="relative px-12 text-center">
            <p className="font-serif text-6xl leading-[1.1] text-[#FAF8F4]">
              Welcome, Admin.
              <br />
              <span className="text-[#E8682F]">Complete setup.</span>
            </p>

            <p className="mt-6 text-sm text-[#8B8B85]">
              Admin access is granted through invitation only
            </p>
          </div>
        </aside>
      </div>
    </PageTransition>
  );
};

export default AdminSignup;