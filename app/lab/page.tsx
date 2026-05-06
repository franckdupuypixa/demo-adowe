import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { readSession } from "@/lib/token";
import LabClient from "./LabClient";

export default async function LabPage() {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("adowe_session")?.value;

  if (!sessionToken) redirect("/");

  const session = readSession(sessionToken);
  if (!session.ok) redirect("/lab/fin");

  return (
    <LabClient
      startTime={session.startTime}
      userData={session.data}
    />
  );
}
