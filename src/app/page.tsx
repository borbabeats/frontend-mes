"use client";

import { Suspense } from "react";
import { redirect } from "next/navigation";

export default function IndexPage() {
  redirect("/dashboard");
}
