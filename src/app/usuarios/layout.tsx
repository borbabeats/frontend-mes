"use client";

import { Header } from "@components/header";
import { ThemedLayout } from "@refinedev/mui";
import React from "react";

export default function Layout({ children }: React.PropsWithChildren) {
  return <ThemedLayout Header={Header}>{children}</ThemedLayout>;
}
