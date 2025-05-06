"use client";
import { useSession } from "@/hooks/useSession";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function DashboardPage() {
  const { session, loading } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !session) {
      router.push("/auth");
    }
  }, [session, loading, router]);

  if (loading) return <div>Loading...</div>;
  if (!session) return null;

  return (
    <div>
      <h1>Welcome, {session.user.email}</h1>
      {/* dashboard */}
    </div>
  );
}
