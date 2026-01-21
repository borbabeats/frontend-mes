
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function LoginLayout({
  children,
}: React.PropsWithChildren) {
  const cookiesList = await cookies();
  const token = cookiesList.get("auth_token")?.value;

  if (token) {
    return redirect("/");
  }

  return <>{children}</>;
}