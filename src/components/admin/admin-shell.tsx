import { Link, useRouterState, useNavigate } from "@tanstack/react-router";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { auth } from "@/lib/firebase";
import { signOut } from "firebase/auth";
import { useQueryClient } from "@tanstack/react-query";
import {
  LayoutDashboard,
  User,
  Briefcase,
  GraduationCap,
  FolderKanban,
  Smartphone,
  Palette,
  MessageSquare,
  LogOut,
  ExternalLink,
} from "lucide-react";
import type { ReactNode } from "react";

type NavItem = { to: string; label: string; icon: typeof LayoutDashboard; exact?: boolean };
const items: NavItem[] = [
  { to: "/admin", label: "Overview", icon: LayoutDashboard, exact: true },
  { to: "/admin/profile", label: "Profile", icon: User },
  { to: "/admin/services", label: "Services", icon: Briefcase },
  { to: "/admin/experience", label: "Experience", icon: GraduationCap },
  { to: "/admin/projects", label: "Projects", icon: FolderKanban },
  { to: "/admin/apps", label: "Apps", icon: Smartphone },
  { to: "/admin/designs", label: "Designs", icon: Palette },
  { to: "/admin/reviews", label: "Reviews", icon: MessageSquare },
];

export function AdminShell({ children }: { children: ReactNode }) {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AdminSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <header className="h-14 flex items-center gap-3 border-b hairline px-4 sticky top-0 bg-background/80 backdrop-blur z-20">
            <SidebarTrigger />
            <span className="font-mono text-xs text-muted-foreground">admin</span>
            <div className="ml-auto flex items-center gap-2">
              <Button asChild variant="ghost" size="sm">
                <Link to="/" target="_blank">
                  <ExternalLink className="h-3.5 w-3.5 mr-1.5" />
                  View site
                </Link>
              </Button>
              <SignOutButton />
            </div>
          </header>
          <main className="flex-1 p-6 sm:p-10 max-w-6xl w-full mx-auto">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
}

function AdminSidebar() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  return (
    <Sidebar collapsible="icon">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>nour.dev / admin</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((it) => {
                const active = it.exact ? pathname === it.to : pathname.startsWith(it.to);
                return (
                  <SidebarMenuItem key={it.to}>
                    <SidebarMenuButton asChild isActive={active}>
                      <Link to={it.to as any} className="flex items-center gap-2">
                        <it.icon className="h-4 w-4" />
                        <span>{it.label}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}

function SignOutButton() {
  const navigate = useNavigate();
  const qc = useQueryClient();
  async function onSignOut() {
    await qc.cancelQueries();
    qc.clear();
    await signOut(auth);
    navigate({ to: "/auth", replace: true });
  }
  return (
    <Button variant="ghost" size="sm" onClick={onSignOut}>
      <LogOut className="h-3.5 w-3.5 mr-1.5" />
      Sign out
    </Button>
  );
}
