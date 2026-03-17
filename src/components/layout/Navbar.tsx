"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import { useCartStore } from "@/stores/cart";
import { useIsClient } from "@/lib/use-is-client";

const navLinks = [
  { href: "/", label: "Inicio" },
  { href: "/nosotros", label: "Nosotros" },
  { href: "/servicios", label: "Servicios" },
  { href: "/agendar", label: "Agendar" },
  { href: "/tienda", label: "Tienda" },
  { href: "/blog", label: "Blog" },
  { href: "/contacto", label: "Contacto" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const toggleCart = useCartStore((s) => s.toggleCart);
  const itemCount = useCartStore((s) => s.itemCount);
  const mounted = useIsClient();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const closeMobile = useCallback(() => setMobileOpen(false), []);

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <>
      <nav
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
        style={{
          backgroundColor: scrolled
            ? "rgba(250, 248, 245, 0.85)"
            : "transparent",
          backdropFilter: scrolled ? "saturate(1.8) blur(28px)" : "none",
          WebkitBackdropFilter: scrolled
            ? "saturate(1.8) blur(28px)"
            : "none",
          borderBottom: scrolled
            ? "1px solid rgba(45, 45, 45, 0.08)"
            : "1px solid transparent",
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link
              href="/"
              className="font-serif text-xl font-bold tracking-wide text-text-primary transition-colors duration-300"
            >
              Vital Emocion
            </Link>

            {/* Center nav links — desktop */}
            <div className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-300 ${
                    isActive(link.href)
                      ? "text-primary"
                      : "text-text-secondary hover:text-text-primary"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Right: cart + login — desktop */}
            <div className="hidden lg:flex items-center gap-2">
              <button
                onClick={toggleCart}
                className="relative p-2 rounded-lg text-text-secondary hover:text-text-primary transition-colors duration-300"
                aria-label="Abrir carrito"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <circle cx="9" cy="21" r="1" />
                  <circle cx="20" cy="21" r="1" />
                  <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                </svg>
                {mounted && itemCount() > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4.5 h-4.5 bg-accent text-white text-[10px] font-bold rounded-full flex items-center justify-center leading-none">
                    {itemCount()}
                  </span>
                )}
              </button>
              <Link
                href="/login"
                className={`text-sm font-medium px-4 py-2 rounded-lg transition-colors duration-300 ${
                  isActive("/login")
                    ? "text-primary"
                    : "text-text-secondary hover:text-text-primary"
                }`}
              >
                Iniciar Sesion
              </Link>
            </div>

            {/* Cart + Hamburger — mobile */}
            <div className="flex items-center gap-2 lg:hidden">
              <button
                onClick={toggleCart}
                className="relative p-2 rounded-lg text-text-secondary hover:text-text-primary transition-colors duration-300"
                aria-label="Abrir carrito"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <circle cx="9" cy="21" r="1" />
                  <circle cx="20" cy="21" r="1" />
                  <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                </svg>
                {mounted && itemCount() > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4.5 h-4.5 bg-accent text-white text-[10px] font-bold rounded-full flex items-center justify-center leading-none">
                    {itemCount()}
                  </span>
                )}
              </button>
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="p-2 rounded-lg text-text-primary transition-colors duration-300 hover:bg-surface"
                aria-label={mobileOpen ? "Cerrar menu" : "Abrir menu"}
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  {mobileOpen ? (
                    <>
                      <line x1="18" y1="6" x2="6" y2="18" />
                      <line x1="6" y1="6" x2="18" y2="18" />
                    </>
                  ) : (
                    <>
                      <line x1="3" y1="6" x2="21" y2="6" />
                      <line x1="3" y1="12" x2="21" y2="12" />
                      <line x1="3" y1="18" x2="21" y2="18" />
                    </>
                  )}
                </svg>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile drawer overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/30 lg:hidden"
          onClick={closeMobile}
        />
      )}

      {/* Mobile drawer */}
      <div
        className={`fixed top-0 right-0 z-50 h-full w-72 bg-background shadow-2xl transform transition-transform duration-300 ease-out lg:hidden ${
          mobileOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between px-6 h-16 border-b border-surface">
          <span className="font-serif text-lg font-bold text-text-primary">
            Menu
          </span>
          <button
            onClick={closeMobile}
            className="p-2 rounded-lg text-text-secondary hover:text-text-primary transition-colors duration-300"
            aria-label="Cerrar menu"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <nav aria-label="Menu de navegacion movil" className="flex flex-col px-4 py-6 gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={closeMobile}
              className={`px-4 py-3 text-base font-medium rounded-lg transition-colors duration-300 ${
                isActive(link.href)
                  ? "text-primary bg-primary/5"
                  : "text-text-secondary hover:text-text-primary hover:bg-surface"
              }`}
            >
              {link.label}
            </Link>
          ))}

          <div className="my-4 border-t border-surface" />

          <Link
            href="/login"
            onClick={closeMobile}
            className={`px-4 py-3 text-base font-medium rounded-lg transition-colors duration-300 ${
              isActive("/login")
                ? "text-primary bg-primary/5"
                : "text-text-secondary hover:text-text-primary hover:bg-surface"
            }`}
          >
            Iniciar Sesion
          </Link>
        </nav>
      </div>
    </>
  );
}
