import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, Link } from "react-router-dom";
import { isAxiosError } from "axios";

import { forgotPasswordSchema, type ForgotPasswordFormValues } from "@/features/client/auth/auth.validation";
import { useAuth } from "@/features/client/auth/auth.hook";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PageTransition } from "@/components/layout/pageTransition";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const { forgotPassword, isSendingForgotPassword, forgotPasswordError } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (values: ForgotPasswordFormValues) => {
    await forgotPassword(values);
    navigate(`/reset-password?email=${encodeURIComponent(values.email)}`);
  };

  const errorMessage =
    isAxiosError(forgotPasswordError) && forgotPasswordError.response?.data?.message
      ? forgotPasswordError.response.data.message
      : undefined;

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

          <h1 className="font-serif text-3xl text-[#14151A]">Forgot your password?</h1>
          <p className="mt-2 text-sm text-[#8B8B85]"> 
            
            Enter your email and we'll send you a reset code.
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="mt-8 flex flex-col gap-4">
            <Input
              label="Email"
              type="email"
              id="email"
              placeholder="you@example.com"
              error={errors.email?.message}
              {...register("email")}
            />

            {errorMessage && (
              <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
                {errorMessage}
              </p>
            )}

            <Button type="submit" isLoading={isSendingForgotPassword} className="mt-2 w-full">
              Send reset code
            </Button>
          </form>

          <p className="mt-8 text-center text-sm text-[#8B8B85]">
            Remembered your password?{" "}
            <Link to="/login" className="font-medium text-[#E8682F] hover:underline">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </PageTransition>
  );
};

export default ForgotPassword;