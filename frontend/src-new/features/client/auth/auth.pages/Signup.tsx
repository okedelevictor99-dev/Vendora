import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, Link } from "react-router-dom";
import { isAxiosError } from "axios";

import {
  signupSchema,
  type SignupFormValues,
} from "@/features/client/auth/auth.validation";
import { useAuth } from "@/features/client/auth/auth.hook";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PageTransition } from "@/components/layout/pageTransition";

const Signup = () => {
  const navigate = useNavigate();
  const { signup, isSigningUp, signupError } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
  });

  const onSubmit = async (values: SignupFormValues) => {
    await signup(values);
    navigate(`/verify-email?email=${encodeURIComponent(values.email)}`);
  };

  const signupErrorMessage =
    isAxiosError(signupError) && signupError.response?.data?.message
      ? signupError.response.data.message
      : undefined;

  return (
    <PageTransition>
      <div className="flex min-h-screen flex-col md:flex-row bg-[#FAF8F4]">
        {/* LEFT FORM */}
        <div className="flex w-full flex-col items-center justify-center px-6 py-8 md:w-1/2">
          <div className="w-full max-w-sm">
            <Link
              to="/"
              className="mb-6 inline-block font-serif text-2xl italic text-[#14151A]"
            >
              Vend<span className="text-[#E8682F]">o</span>ra
            </Link>

            <h1 className="font-serif text-3xl text-[#14151A]">
              Create your account
            </h1>

            <p className="mt-2 text-sm text-[#8B8B85]">
              Join Vendora to start shopping.
            </p>

            <form
              onSubmit={handleSubmit(onSubmit)}
              className="mt-8 flex flex-col gap-4"
            >
              <Input
                label="Name"
                type="text"
                id="name"
                placeholder="Your full name"
                error={errors.name?.message}
                {...register("name")}
              />

              <Input
                label="Email"
                type="email"
                id="email"
                placeholder="you@example.com"
                error={errors.email?.message}
                {...register("email")}
              />

              <div>
                <Input
                  label="Password"
                  type="password"
                  id="password"
                  placeholder="••••••••"
                  error={errors.password?.message}
                  {...register("password")}
                />

                {!errors.password && (
                  <p className="mt-1.5 text-xs text-[#8B8B85]">
                    At least 8 characters, with uppercase, lowercase, and a
                    number.
                  </p>
                )}
              </div>

              {signupErrorMessage && (
                <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
                  {signupErrorMessage}
                </p>
              )}

              <Button
                type="submit"
                isLoading={isSigningUp}
                className="mt-2 w-full"
              >
                Create account
              </Button>
            </form>

            <p className="mt-8 text-center text-sm text-[#8B8B85]">
              Already have an account?{" "}
              <Link
                to="/login"
                className="font-medium text-[#E8682F] hover:underline"
              >
                Log in
              </Link>
            </p>
          </div>
        </div>

        {/* DESKTOP/TABLET RIGHT PANEL */}
        <div className="relative hidden w-1/2 items-center justify-center overflow-hidden bg-[#14151A] md:flex">
          <div
            className="absolute inset-0 opacity-[0.07]"
            style={{
              backgroundImage:
                "repeating-linear-gradient(45deg, #fff 0, #fff 1px, transparent 1px, transparent 40px)",
            }}
          />

          <div className="relative px-12 text-center">
            <p className="font-serif text-6xl leading-[1.1] text-[#FAF8F4]">
              Join the
              <br />
              <span className="text-[#E8682F]">marketplace.</span>
            </p>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default Signup;