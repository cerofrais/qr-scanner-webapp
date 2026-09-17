"use client";

import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    await fetch("/api/auth", { method: "DELETE" });
    router.push("/login");
    router.refresh();
  };

  return (
    <button
      onClick={handleLogout}
      className="eyebrow shrink-0 whitespace-nowrap px-1 py-1.5 text-mist transition hover:text-cream"
    >
      Log out
    </button>
  );
}
