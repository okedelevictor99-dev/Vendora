import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { PageTransition } from "@/components/layout/pageTransition";
import { useAuthContext } from "@/context/authContext";
import welcomeBg from "@/assets/welcome-bg.png";

const Welcome = () => {
  const { isAuthenticated } = useAuthContext();

  return (
    <PageTransition>
      <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-[#FAF8F4] px-6">
        {/* Background image */}
        <img
          src={welcomeBg}
          alt=""
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-55"
        />

        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#FAF8F4]/20 via-[#FAF8F4]/50 to-[#FAF8F4]/90" />
        {/* Content */}
       <div className="relative z-10 w-full max-w-md rounded-2xl bg-white/35 px-8 py-10 text-center shadow-[0_4px_20px_rgba(20,21,26,0.04)] backdrop-blur-sm">
          <h1 className="font-serif text-6xl italic text-[#14151A]">
            Vend<span className="text-[#E8682F]">o</span>ra
          </h1>
          <p className="mt-3 text-sm text-[#8B8B85]">
            Where are you headed today?
          </p>
          <div className="mt-10 flex flex-col gap-4">
            <motion.div
              whileHover={{ y: -2, boxShadow: "0 6px 16px rgba(232,104,47,0.3)" }}
              whileTap={{ scale: 0.97, y: 0 }}
              transition={{ duration: 0.15, ease: "easeOut" }}
              className="rounded-lg"
            >
              <Link
                to={isAuthenticated ? "/dashboard" : "/login"}
                className="block rounded-lg bg-[#E8682F] px-6 py-4 text-sm font-semibold text-white"
              >
                Continue as Customer
              </Link>
            </motion.div>
            <motion.div
              whileHover={{ y: -2, boxShadow: "0 6px 16px rgba(0,0,0,0.08)" }}
              whileTap={{ scale: 0.97, y: 0 }}
              transition={{ duration: 0.15, ease: "easeOut" }}
              className="rounded-lg"
            >
              <Link
                to="/products"
                className="block rounded-lg border border-[#E5E2DA] bg-white px-6 py-4 text-sm font-semibold text-[#14151A]"
              >
                Browse as Guest
              </Link>
            </motion.div>
          </div>
          <Link
            to="/admin/login"
            className="mt-10 inline-block text-sm text-[#5F5E5A] underline decoration-[#E5E2DA] underline-offset-4 transition hover:text-[#E8682F] hover:decoration-[#E8682F]"
          >
            Sign in as admin
          </Link>
        </div>
      </div>
    </PageTransition>
  );
};

export default Welcome;