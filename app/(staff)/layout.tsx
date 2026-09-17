import StaffHeader from "@/components/StaffHeader";

// Shared chrome for the admin-gated pages (/verify, /onboard, /admin).
// The public /register page and /login sit outside this group.
export default function StaffLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <StaffHeader />
      <main className="mx-auto w-full max-w-xl flex-1 px-4 py-8 sm:py-10">{children}</main>
    </>
  );
}
