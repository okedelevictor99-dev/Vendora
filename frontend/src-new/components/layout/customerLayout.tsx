
import { useState, useEffect } from "react";
import { NavLink, Outlet, Link } from "react-router-dom";
import { AnimatePresence, motion } from "motion/react";

import { useAuth } from "@/features/client/auth/auth.hook";
import { useCart } from "@/features/client/cart/cart.hook";

import FullScreenLoader from "../ui/fullScreenLoader";

const CustomerLayout = () => {
  const {
    logout,
    isLoggingOut,
    logoutAll,
    isLoggingOutAll,
  } = useAuth();

  const { cart } = useCart();

  const [menuOpen, setMenuOpen] = useState(false);

  const itemCount = cart?.totalQuantity ?? 0;

  const closeMenu = () => setMenuOpen(false);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const handleLogoutAll = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to log out of all devices? This will sign you out everywhere, including this device."
    );

    if (!confirmed) return;

    try {
      await logoutAll();
    } catch (error) {
      console.error("Failed to log out of all devices:", error);
    }
  };

  if (isLoggingOut || isLoggingOutAll) {
    return <FullScreenLoader text="Logging out..." />;
  }

  return (
    <div className="flex min-h-screen flex-col bg-[#FAF8F4]">
      <header className="sticky top-0 z-40 border-b border-[#E5E2DA] bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
          {/* Left */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              className="rounded-md p-1 text-[#14151A] transition-colors hover:text-[#E8682F] md:hidden"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>

            <Link
              to="/dashboard"
              onClick={closeMenu}
              className="font-serif text-xl italic text-[#14151A] transition-opacity hover:opacity-80"
            >
              Vend<span className="text-[#E8682F]">o</span>ra
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="flex items-center gap-5">
            <nav className="hidden items-center gap-7 md:flex">
              <NavLink
                to="/dashboard"
                end
                className={({ isActive }) =>
                  `text-sm font-medium transition-colors duration-200 ${
                    isActive
                      ? "text-[#E8682F]"
                      : "text-[#8B8B85] hover:text-[#E8682F]"
                  }`
                }
              >
                Shop
              </NavLink>

              <NavLink
                to="/dashboard/orders"
                className={({ isActive }) =>
                  `text-sm font-medium transition-colors duration-200 ${
                    isActive
                      ? "text-[#E8682F]"
                      : "text-[#8B8B85] hover:text-[#E8682F]"
                  }`
                }
              >
                Orders
              </NavLink>

              <NavLink
                to="/dashboard/account"
                className={({ isActive }) =>
                  `text-sm font-medium transition-colors duration-200 ${
                    isActive
                      ? "text-[#E8682F]"
                      : "text-[#8B8B85] hover:text-[#E8682F]"
                  }`
                }
              >
                Profile
              </NavLink>

              {/* Logout all devices */}
              <button
                type="button"
                onClick={handleLogoutAll}
                disabled={isLoggingOutAll}
                className="
                  text-sm
                  font-medium
                  text-[#8B8B85]
                  transition-colors
                  duration-200
                  hover:text-[#E8682F]
                  disabled:cursor-not-allowed
                  disabled:opacity-50
                "
              >
                {isLoggingOutAll
                  ? "Logging out..."
                  : "Logout all devices"}
              </button>

              {/* Normal logout */}
              <button
                type="button"
                onClick={() => logout()}
                disabled={isLoggingOut}
                className="
                  text-sm
                  font-medium
                  text-[#8B8B85]
                  transition-colors
                  duration-200
                  hover:text-[#E8682F]
                  disabled:cursor-not-allowed
                  disabled:opacity-50
                "
              >
                {isLoggingOut ? "Logging out..." : "Logout"}
              </button>
            </nav>

            {/* Cart */}
            <Link
              to="/dashboard/cart"
              className="relative text-[#14151A] transition-colors duration-200 hover:text-[#E8682F]"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.8}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 1.872-4.485 2.273-6.578a.75.75 0 0 0-.738-.922H5.106M7.5 14.25 5.106 5.272M6 18.75a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z"
                />
              </svg>

              {itemCount > 0 && (
                <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-[#E8682F] text-[10px] font-bold text-white">
                  {itemCount}
                </span>
              )}
            </Link>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <>
            {/* Overlay */}
            <motion.div
              className="fixed inset-0 z-40 bg-black/40 md:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeMenu}
            />

            {/* Drawer */}
            <motion.aside
              className="fixed left-0 top-0 z-50 flex h-full w-72 flex-col bg-white shadow-xl md:hidden"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{
                type: "spring",
                stiffness: 320,
                damping: 30,
              }}
            >
              {/* Mobile Header */}
              <div className="border-b border-[#E5E2DA] px-6 py-6">
                <Link
                  to="/dashboard"
                  onClick={closeMenu}
                  className="font-serif text-2xl italic text-[#14151A]"
                >
                  Vend<span className="text-[#E8682F]">o</span>ra
                </Link>
              </div>

              {/* Mobile Navigation */}
              <nav className="flex flex-1 flex-col p-4">
                <NavLink
                  to="/dashboard"
                  end
                  onClick={closeMenu}
                  className={({ isActive }) =>
                    `rounded-lg px-4 py-3 text-sm font-medium transition-all duration-200 ${
                      isActive
                        ? "bg-[#FFF2EC] font-bold text-[#E8682F]"
                        : "text-[#14151A] hover:bg-[#FFF2EC] hover:text-[#E8682F]"
                    }`
                  }
                >
                  Shop
                </NavLink>

                <NavLink
                  to="/dashboard/orders"
                  onClick={closeMenu}
                  className={({ isActive }) =>
                    `mt-2 rounded-lg px-4 py-3 text-sm font-medium transition-all duration-200 ${
                      isActive
                        ? "bg-[#FFF2EC] font-bold text-[#E8682F]"
                        : "text-[#14151A] hover:bg-[#FFF2EC] hover:text-[#E8682F]"
                    }`
                  }
                >
                  Orders
                </NavLink>

                <NavLink
                  to="/dashboard/account"
                  onClick={closeMenu}
                  className={({ isActive }) =>
                    `mt-2 rounded-lg px-4 py-3 text-sm font-medium transition-all duration-200 ${
                      isActive
                        ? "bg-[#FFF2EC] font-bold text-[#E8682F]"
                        : "text-[#14151A] hover:bg-[#FFF2EC] hover:text-[#E8682F]"
                    }`
                  }
                >
                  Profile
                </NavLink>

                {/* Logout all devices */}
                <button
                  type="button"
                  onClick={handleLogoutAll}
                  disabled={isLoggingOutAll}
                  className="
                    mt-2
                    rounded-lg
                    px-4
                    py-3
                    text-left
                    text-sm
                    font-medium
                    text-[#14151A]
                    transition-all
                    duration-200
                    hover:bg-[#FFF2EC]
                    hover:text-[#E8682F]
                    disabled:cursor-not-allowed
                    disabled:opacity-50
                  "
                >
                  {isLoggingOutAll
                    ? "Logging out..."
                    : "Logout all devices"}
                </button>

                {/* Normal logout */}
                <button
                  type="button"
                  onClick={() => {
                    closeMenu();
                    logout();
                  }}
                  disabled={isLoggingOut}
                  className="
                    mt-2
                    rounded-lg
                    px-4
                    py-3
                    text-left
                    text-sm
                    font-medium
                    text-[#14151A]
                    transition-all
                    duration-200
                    hover:bg-[#FFF2EC]
                    hover:text-[#E8682F]
                    disabled:cursor-not-allowed
                    disabled:opacity-50
                  "
                >
                  {isLoggingOut ? "Logging out..." : "Logout"}
                </button>
              </nav>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
};

export default CustomerLayout;

