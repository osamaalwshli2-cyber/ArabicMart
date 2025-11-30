import { useLocation } from "wouter";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { User, LogOut, Lock } from "lucide-react";

interface AccountMenuProps {
  isLoggedIn: boolean;
  onLogout: () => void;
}

export default function AccountMenu({ isLoggedIn, onLogout }: AccountMenuProps) {
  const [, setLocation] = useLocation();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" title="الحساب" data-testid="button-account-menu">
          <User className="h-5 w-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48" dir="rtl">
        <DropdownMenuItem onClick={() => setLocation("/my-account")} data-testid="menu-item-my-account">
          <User className="h-4 w-4 ml-2" />
          معلومات حسابي
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setLocation("/admin-login")} data-testid="menu-item-admin-login">
          <Lock className="h-4 w-4 ml-2" />
          تسجيل دخول Admin
        </DropdownMenuItem>
        {isLoggedIn && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={onLogout} data-testid="menu-item-logout">
              <LogOut className="h-4 w-4 ml-2" />
              تسجيل الخروج
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
