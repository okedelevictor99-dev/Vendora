import { useState } from "react";
import { useLocation, Link } from "react-router-dom";
import { Menu, X } from "lucide-react";

const ShopNavbar = () => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const hideNavbar = location.pathname.startsWith("/dashboard");
  if (hideNavbar) return null;

  const isActive = (path: string) => location.pathname === path;

  const closeMenu = () => setIsOpen(false);

  return (
    <nav className="sticky top-0 z-50 border-b border-[#E5E2DA] bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        
        {/* Brand */}
        <Link
          to="/products"
          onClick={closeMenu}
          className="text-lg font-semibold tracking-tight text-[#14151A] italic"
        >
           Vend<span className="text-[#E8682F]">o</span>ra
        </Link>

        {/* Desktop Links */}
        <div className="hidden items-center gap-6 text-sm font-medium sm:flex">
          <Link
            to="/products"
            className={`transition hover:text-[#E8682F] ${
              isActive("/products") ? "text-[#E8682F]" : "text-[#14151A]"
            }`}
          >
            Shop
          </Link>

          <Link
            to="/login"
            className="rounded-full border border-[#E5E2DA] px-4 py-1.5 text-[#14151A] transition hover:border-[#E8682F] hover:text-[#E8682F]"
          >
            Login
          </Link>

          <Link
            to="/signup"
            className="rounded-full border border-[#E5E2DA] px-4 py-1.5 text-[#14151A] transition hover:border-[#E8682F] hover:text-[#E8682F]"
          >
            Signup
          </Link>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          onClick={() => setIsOpen((prev) => !prev)}
          className="text-[#14151A] sm:hidden"
          aria-label="Toggle menu"
        >
          {isOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile Dropdown */}
      {isOpen && (
        <div className="flex flex-col gap-1 border-t border-[#E5E2DA] bg-white/95 px-6 py-4 text-sm font-medium sm:hidden">
          <Link
            to="/products"
            onClick={closeMenu}
            className={`rounded-md px-3 py-2 transition hover:text-[#E8682F] ${
              isActive("/products") ? "text-[#E8682F]" : "text-[#14151A]"
            }`}
          >
            Shop
          </Link>

          <Link
            to="/login"
            onClick={closeMenu}
            className="rounded-md px-3 py-2 text-[#14151A] transition hover:text-[#E8682F]"
          >
            Login
          </Link>

          <Link
            to="/signup"
            onClick={closeMenu}
            className="rounded-md px-3 py-2 text-[#14151A] transition hover:text-[#E8682F]"
          >
            Signup
          </Link>
        </div>
      )}

      {/* subtle amber glow line */}
      <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-[#E8682F]/40 to-transparent" />
    </nav>
  );
};

export default ShopNavbar;