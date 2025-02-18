import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Link, useLocation } from "wouter";
import {
  LayoutDashboard,
  Building2,
  Users,
  Calendar,
  DollarSign
} from "lucide-react";

interface SidebarNavProps extends React.HTMLAttributes<HTMLDivElement> {
  isCollapsed: boolean;
}

export function SidebarNav({ className, isCollapsed }: SidebarNavProps) {
  const [location] = useLocation();

  const items = [
    {
      title: "Dashboard",
      icon: LayoutDashboard,
      href: "/dashboard"
    },
    {
      title: "Properties",
      icon: Building2,
      href: "/properties"
    },
    {
      title: "Clients",
      icon: Users,
      href: "/clients"
    },
    {
      title: "Appointments",
      icon: Calendar,
      href: "/appointments"
    },
    {
      title: "Sales",
      icon: DollarSign,
      href: "/sales"
    }
  ];

  return (
    <div className={cn("flex flex-col h-screen", className)}>
      <ScrollArea className="flex-1">
        <div className="space-y-2 py-4">
          {items.map((item) => (
            <Link key={item.href} href={item.href}>
              <Button
                variant={location === item.href ? "secondary" : "ghost"}
                className={cn(
                  "w-full justify-start",
                  isCollapsed && "justify-center"
                )}
              >
                <item.icon className={cn("h-4 w-4", !isCollapsed && "mr-2")} />
                {!isCollapsed && item.title}
              </Button>
            </Link>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}