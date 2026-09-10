


import { useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { useAdminAuthContext } from "@/context/adminAuthContext";
import { useAdminAuth } from "@/features/admin/auth/auth.hook";
import FullScreenLoader from "../ui/fullScreenLoader";

const navItems = [
  { label: "Dashboard", to: "/admin/dashboard" },
  { label: "Products", to: "/admin/products" },
  { label: "Orders", to: "/admin/orders" },
  { label: "Users", to: "/admin/users" },
  {
    label: "Admin Management",
    to: "/admin/management",
    superAdminOnly: true,
  },
  { label: "Account", to: "/admin/account" },
];

interface SidebarContentProps {
  onNavigate?: () => void;
  onLogout: () => Promise<void>;
}

const SidebarContent = ({
  onNavigate,
  onLogout,
}: SidebarContentProps) => {
  const { admin } = useAdminAuthContext();

  const visibleNavItems = navItems.filter(
    (item) => !item.superAdminOnly || admin?.role === "super-admin"
  );

  return (
    <div className="flex h-full flex-col px-4 py-6">
      <div className="mb-8 px-2 font-serif text-2xl italic text-white">
        Vend<span className="text-[#E8682F]">o</span>ra
      </div>

      <nav className="flex flex-1 flex-col gap-1">
        {visibleNavItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            onClick={onNavigate}
            className={({ isActive }) =>
              `rounded-lg px-3 py-2 text-sm font-medium transition ${
                isActive
                  ? "bg-[#E8682F] text-white"
                  : "text-[#A8A6A0] hover:bg-white/5 hover:text-white"
              }`
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-white/10 pt-4">
        <p className="px-3 text-xs text-[#8B8B85]">
          {admin?.email}
        </p>

        <button
          type="button"
          onClick={onLogout}
          className="mt-2 w-full rounded-lg px-3 py-2 text-left text-sm font-medium text-[#A8A6A0] transition hover:bg-white/5 hover:text-white"
        >
          Log out
        </button>
      </div>
    </div>
  );
};

const AdminLayout = () => {
  const { adminLogout, isAdminLoggingOut } = useAdminAuth();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await adminLogout();
  };

  if (isAdminLoggingOut) {
    return <FullScreenLoader text="Logging out..." />;
  }

  return (
    <div className="flex min-h-dvh bg-[#FAF8F4]">
      {/* Desktop Sidebar */}
      <aside className="hidden sticky top-0 h-dvh w-64 flex-col bg-[#14151A] lg:flex">
        <SidebarContent onLogout={handleLogout} />
      </aside>

      {/* Main Content */}
      <div className=" min-w-0 flex flex-1 flex-col">
        <header className=" sticky top-0 z-30 flex items-center justify-between border-b border-[#E5E2DA] bg-white px-4 py-3 lg:hidden">
          <span className="font-serif text-xl italic text-[#14151A]">
            Vend<span className="text-[#E8682F]">o</span>ra
          </span>

          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(true)}
            className="rounded-lg p-2 text-[#14151A] hover:bg-[#F0EDE6]"
            aria-label="Open menu"
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
                d="M3.75 6.75h16.5M3.75 12h16.5M3.75 17.25h16.5"
              />
            </svg>
          </button>
        </header>

        <main className="flex-1  bg-[#FAF8F4] px-4 py-6 lg:p-8">
  <Outlet />
</main>
      </div>

      <AnimatePresence>
                {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 z-40 bg-black/50 lg:hidden"
            />

            {/* Mobile Sidebar */}
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="fixed inset-y-0 left-0 z-50 w-72 bg-[#14151A] lg:hidden"
            >
              <SidebarContent
                onNavigate={() => setIsMobileMenuOpen(false)}
                onLogout={async () => {
                  setIsMobileMenuOpen(false);
                  await handleLogout();
                }}
              />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminLayout;