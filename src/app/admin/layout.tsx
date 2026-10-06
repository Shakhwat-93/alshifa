import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Al-Shifa Care | Enterprise Admin Control Hub",
  description: "Enterprise E-Commerce Admin Control System",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="admin-tiro font-tiro w-full min-h-screen">
      {children}
    </div>
  );
}
