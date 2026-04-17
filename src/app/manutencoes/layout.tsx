"use client";

import { ThemedLayout } from "@refinedev/mui";
import { Header } from "@components/header";

export default function ManutencoesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ThemedLayout Header={Header}>
      {children}
    </ThemedLayout>
  );
}
