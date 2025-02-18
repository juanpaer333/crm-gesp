import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Link, useLocation } from "wouter";
import {
  LayoutDashboard,
  Building2,
  Users,
  Calendar,
  DollarSign,
  LogOut,
  Shield
} from "lucide-react";
import { signOut } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/auth-context";

interface SidebarNavProps extends React.HTMLAttributes<HTMLDivElement> {
  isCollapsed: boolean;
}

export function SidebarNav({ className, isCollapsed }: SidebarNavProps) {
  const [location] = useLocation();
  const { toast } = useToast();
  const { isAdmin } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut();
      toast({
        title: "Logged out successfully",
        variant: "default"
      });
    } catch (error) {
      toast({
        title: "Error logging out",
        variant: "destructive"
      });
    }
  };

  const items = [
    ...(isAdmin ? [{
      title: "Admin",
      icon: Shield,
      href: "/admin"
    }] : []),
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
      <Button
        variant="ghost"
        className={cn(
          "w-full justify-start my-2",
          isCollapsed && "justify-center"
        )}
        onClick={handleSignOut}
      >
        <LogOut className={cn("h-4 w-4", !isCollapsed && "mr-2")} />
        {!isCollapsed && "Logout"}
      </Button>
    </div>
  );
}