import { Link, useLocation } from "wouter";
import {
  LayoutDashboard,
  Package,
  FolderTree,
  ShoppingBag,
  Users,
  LogOut,
  Settings,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const menuItems = [
  { href: "/admin", icon: LayoutDashboard, label: "لوحة التحكم" },
  { href: "/admin/products", icon: Package, label: "المنتجات" },
  { href: "/admin/categories", icon: FolderTree, label: "الفئات" },
  { href: "/admin/orders", icon: ShoppingBag, label: "الطلبات" },
  { href: "/admin/customers", icon: Users, label: "العملاء" },
];

export function AdminSidebar() {
  const [location] = useLocation();

  const isActive = (href: string) => {
    if (href === "/admin") {
      return location === "/admin";
    }
    return location.startsWith(href);
  };

  return (
    <aside className="w-64 bg-sidebar border-l h-screen sticky top-0 flex flex-col">
      <div className="p-6 border-b border-sidebar-border">
        <Link href="/admin" className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-xl">م</span>
          </div>
          <div>
            <span className="font-bold text-lg">لوحة التحكم</span>
            <p className="text-xs text-muted-foreground">متجر العربي</p>
          </div>
        </Link>
      </div>

      <nav className="flex-1 p-4">
        <ul className="space-y-1">
          {menuItems.map((item) => (
            <li key={item.href}>
              <Link href={item.href} data-testid={`link-admin-${item.label}`}>
                <Button
                  variant="ghost"
                  className={cn(
                    "w-full justify-start gap-3 h-11",
                    isActive(item.href) && "bg-sidebar-accent text-sidebar-accent-foreground"
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  {item.label}
                </Button>
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <div className="p-4 border-t border-sidebar-border space-y-1">
        <Link href="/" data-testid="link-view-store">
          <Button variant="ghost" className="w-full justify-start gap-3 h-11">
            <Settings className="h-5 w-5" />
            عرض المتجر
          </Button>
        </Link>
        <a href="/api/logout" data-testid="button-admin-logout">
          <Button variant="ghost" className="w-full justify-start gap-3 h-11 text-destructive hover:text-destructive">
            <LogOut className="h-5 w-5" />
            تسجيل الخروج
          </Button>
        </a>
      </div>
    </aside>
  );
}
