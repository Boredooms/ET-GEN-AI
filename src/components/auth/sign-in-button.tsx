"use client";

import { signIn } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { LogIn } from "lucide-react";
import { useState } from "react";

interface SignInButtonProps {
  provider?: "google" | "email";
  className?: string;
  children?: React.ReactNode;
}

export function SignInButton({ 
  provider = "google", 
  className,
  children 
}: SignInButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleSignIn = async () => {
    setIsLoading(true);
    try {
      await signIn.social({
        provider,
        callbackURL: "/dashboard",
      });
    } catch (error) {
      console.error("Sign in error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      onClick={handleSignIn}
      disabled={isLoading}
      className={className}
    >
      {children || (
        <>
          <LogIn className="h-4 w-4 mr-2" />
          Sign In with {provider === "google" ? "Google" : "Email"}
        </>
      )}
    </Button>
  );
}
