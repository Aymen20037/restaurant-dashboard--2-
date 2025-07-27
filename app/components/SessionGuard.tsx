"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export function SessionGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  useEffect(() => {
    const checkSession = async () => {
      try {
        const res = await fetch("/api/validate-session", { credentials: "include" });
        if (!res.ok) {
          router.push("/login");
        }
      } catch {
        router.push("/login");
      }
    };

    checkSession();
  }, []);

  return <>{children}</>;
}
