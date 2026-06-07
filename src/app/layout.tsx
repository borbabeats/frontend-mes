"use client";

import React, { Suspense, useEffect, useState } from "react";
import { RefineContext } from "./_refine_context";
import { GlobalLoading } from "@/components/GlobalLoading";
import { SocketProvider } from "@/providers/socket";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [defaultMode, setDefaultMode] = useState<"light" | "dark">("light");
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    // Obter tema do localStorage em vez de cookies
    if (typeof window !== "undefined") {
      const savedTheme = localStorage.getItem("theme");
      setDefaultMode(savedTheme === "dark" ? "dark" : "light");
    }
  }, []);

  return (
    <html lang="en">
      <body>
        <Suspense>
          <SocketProvider>
            <RefineContext defaultMode={isClient ? defaultMode : "light"}>
              {children}
            </RefineContext>
          </SocketProvider>
          <GlobalLoading />
        </Suspense>
      </body>
    </html>
  );
}
