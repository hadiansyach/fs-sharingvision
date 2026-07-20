import React from "react";
import { Sidebar } from "./Sidebar";
import { TopBar } from "./TopBar";

interface AdminLayoutProps {
  children: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-background text-on-background font-body-md flex flex-col">
      <Sidebar />
      <TopBar />
      <main className="flex-1 md:ml-[280px] p-margin-mobile md:p-margin-desktop">
        {children}
      </main>
    </div>
  );
};
