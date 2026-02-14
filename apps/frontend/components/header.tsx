"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Menu, X, LayoutDashboard, LogOut } from "lucide-react";
import { useState } from "react";
import {
  SignInButton,
  SignOutButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";

export function Header() {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { name: "Features", href: "#features" },
    { name: "Pricing", href: "#pricing" },
    { name: "How it Works", href: "#how-it-works" },
  ];

  return (
    // FIX: Using inset-x-0 ensures the header is centered and doesn't bleed off-screen
    <header className="fixed top-3 inset-x-0 z-50 flex justify-center px-4 pointer-events-none">
      <div className="w-full max-w-5xl rounded-full border border-border/40 bg-background/80 backdrop-blur-xl px-3 md:px-6 py-2 flex items-center justify-between shadow-2xl transition-all pointer-events-auto">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <div className="flex h-6 w-6 md:h-7 md:w-7 items-center justify-center rounded-full bg-primary shrink-0">
            <span className="text-[10px] font-bold text-white">AI</span>
          </div>
          <span className="text-sm font-bold tracking-tight text-foreground whitespace-nowrap">
            CareerCoach
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              {item.name}
            </Link>
          ))}
          <SignedIn>
            <Link
              href="/dashboard"
              className="text-xs font-semibold text-primary flex items-center gap-1.5"
            >
              <LayoutDashboard className="h-4 w-4" />
              Dashboard
            </Link>
          </SignedIn>
        </nav>

        {/* Action Group */}
        <div className="flex items-center gap-2">
          <SignedOut>
            <div className="hidden md:flex items-center gap-2">
              <SignInButton mode="modal" forceRedirectUrl="/dashboard">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-xs rounded-full"
                >
                  Sign In
                </Button>
              </SignInButton>
              <SignUpButton mode="modal" forceRedirectUrl="/dashboard">
                <Button
                  size="sm"
                  className="rounded-full px-5 bg-primary text-white text-xs h-8"
                >
                  Get Started
                </Button>
              </SignUpButton>
            </div>
            {/* Mobile "Join" - visible only on small screens */}
            <div className="md:hidden">
              <SignUpButton mode="modal" forceRedirectUrl="/dashboard">
                <Button
                  size="sm"
                  className="rounded-full px-3 h-7 text-[10px] bg-primary text-white font-bold"
                >
                  Join
                </Button>
              </SignUpButton>
            </div>
          </SignedOut>

          <SignedIn>
            <UserButton afterSignOutUrl="/" />
          </SignedIn>

          {/* Mobile Toggle */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-1.5 rounded-full hover:bg-foreground/5 transition-colors shrink-0"
          >
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {/* Mobile Dropdown - Pinned to the Header width */}
        {isOpen && (
          <div className="absolute top-16 left-0 right-0 md:hidden animate-in fade-in slide-in-from-top-4 duration-200">
            <div className="mx-1 rounded-[2rem] border border-border/40 bg-background/95 backdrop-blur-2xl p-6 shadow-2xl">
              <nav className="flex flex-col gap-4">
                <SignedIn>
                  <Link
                    href="/dashboard"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-2 text-sm font-bold text-primary p-3 bg-primary/5 rounded-xl"
                  >
                    <LayoutDashboard className="h-4 w-4" /> Dashboard
                  </Link>
                </SignedIn>
                {navLinks.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className="text-sm font-medium p-2"
                  >
                    {item.name}
                  </Link>
                ))}
                <div className="pt-2 border-t border-border/40">
                  <SignedOut>
                    <div className="flex flex-col gap-2">
                      <SignInButton mode="modal" forceRedirectUrl="/dashboard">
                        <Button
                          variant="outline"
                          className="w-full rounded-xl h-10"
                        >
                          Sign In
                        </Button>
                      </SignInButton>
                      <SignUpButton mode="modal" forceRedirectUrl="/dashboard">
                        <Button className="w-full rounded-xl h-10">
                          Get Started
                        </Button>
                      </SignUpButton>
                    </div>
                  </SignedOut>
                  <SignedIn>
                    <SignOutButton redirectUrl="/">
                      <Button
                        variant="ghost"
                        className="w-full justify-start text-red-500 rounded-xl h-10"
                      >
                        <LogOut className="mr-2 h-4 w-4" /> Sign Out
                      </Button>
                    </SignOutButton>
                  </SignedIn>
                </div>
              </nav>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
