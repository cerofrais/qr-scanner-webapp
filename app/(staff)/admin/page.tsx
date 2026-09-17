import AdminSearch from "@/components/AdminSearch";
import PageHeader from "@/components/PageHeader";

export default function AdminPage() {
  return (
    <>
      <PageHeader eyebrow="Guest list" title="Search registrations">
        Find a guest by name, email or phone number to edit, reprint or delete their pass.
      </PageHeader>
      <AdminSearch />
    </>
  );
}
