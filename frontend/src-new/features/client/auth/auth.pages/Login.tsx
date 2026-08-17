import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { isAxiosError } from "axios";

import {
  loginSchema,
  type LoginFormValues,
} from "@/features/client/auth/auth.validation";
import { useAuth } from "@/features/client/auth/auth.hook";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PageTransition } from "@/components/layout/pageTransition";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isLoggingIn, loginError } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const from =
    (location.state as { from?: Location })?.from?.pathname ??
    "/dashboard";

  const onSubmit = async (values: LoginFormValues) => {
    try {
      await login(values);
      navigate(from);
    } catch (error) {
      if (isAxiosError(error) && error.response?.status === 403) {
        navigate(`/verify-email?email=${encodeURIComponent(values.email)}`);
      }
    }
  };

  const loginErrorMessage =
    isAxiosError(loginError) && loginError.response?.data?.message
      ? loginError.response.data.message
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
              Welcome back
            </h1>

            <p className="mt-2 text-sm text-[#8B8B85]">
              Log in to pick up your cart where you left it.
            </p>

            <form
              onSubmit={handleSubmit(onSubmit)}
              className="mt-8 flex flex-col gap-4"
            >
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

                <div className="mt-2 text-right">
                  <Link
                    to="/forgot-password"
                    className="text-xs text-[#8B8B85] hover:text-[#E8682F]"
                  >
                    Forgot password?
                  </Link>
                </div>
              </div>

              {loginErrorMessage && (
                <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
                  {loginErrorMessage}
                </p>
              )}

              <Button
                type="submit"
                isLoading={isLoggingIn}
                className="mt-2 w-full"
              >
                Log in
              </Button>
            </form>

            <p className="mt-8 text-center text-sm text-[#8B8B85]">
              New to Vendora?{" "}
              <Link
                to="/signup"
                className="font-medium text-[#E8682F] hover:underline"
              >
                Create an account
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
              Buy it.
              <br />
              <span className="text-[#E8682F]">Sell it.</span>
              <br />
              Vendora it.
            </p>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default Login;