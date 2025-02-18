import { useState } from "react";
import { Button } from "@/components/ui/button";
import { SidebarNav } from "@/components/ui/sidebar-nav";
import { Menu } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

interface DashboardShellProps {
  children: React.ReactNode;
}

export function DashboardShell({ children }: DashboardShellProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const isMobile = useIsMobile();

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <div
        className={`bg-sidebar border-r border-border transition-all duration-300 ${
          isCollapsed ? "w-16" : "w-64"
        } ${isMobile ? (isCollapsed ? "-ml-16" : "-ml-64") : ""}`}
      >
        <SidebarNav isCollapsed={isCollapsed} />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <header className="h-14 border-b border-border px-4 flex items-center">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsCollapsed(!isCollapsed)}
          >
            <Menu className="h-5 w-5" />
          </Button>
        </header>
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
}