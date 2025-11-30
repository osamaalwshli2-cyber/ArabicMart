import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { User, LogOut, Lock } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Loader2, LogIn } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect } from "react";
import type { Customer } from "@shared/schema";

interface AccountMenuProps {
  isLoggedIn: boolean;
  onLogout: () => void;
}

export default function AccountMenu({ isLoggedIn, onLogout }: AccountMenuProps) {
  const [openDialog, setOpenDialog] = useState(false);
  const [tab, setTab] = useState<"account" | "admin">("account");
  const [customer, setCustomer] = useState<Partial<Customer> | null>(null);
  const [adminUsername, setAdminUsername] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const queryClient = useQueryClient();
  const { toast } = useToast();

  useEffect(() => {
    if (openDialog && isLoggedIn && tab === "account") {
      const email = localStorage.getItem("customerEmail");
      if (email) {
        fetch(`/api/customers/by-email?email=${encodeURIComponent(email)}`)
          .then((res) => res.json())
          .then((data) => setCustomer(data))
          .catch((error) => console.error("Error fetching customer:", error));
      }
    }
  }, [openDialog, isLoggedIn, tab]);

  const adminLoginMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", "/api/admin/login", {
        username: adminUsername,
        password: adminPassword,
      });
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/auth-status"] });
      queryClient.refetchQueries({ queryKey: ["/api/admin/auth-status"] });
      toast({
        title: "تم التسجيل بنجاح",
        description: "مرحبا بك في لوحة التحكم",
      });
      setOpenDialog(false);
      window.location.href = "/admin";
    },
    onError: () => {
      toast({
        title: "خطأ في التسجيل",
        description: "اسم المستخدم أو كلمة المرور غير صحيحة",
        variant: "destructive",
      });
    },
  });

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminUsername || !adminPassword) {
      toast({
        title: "حقول مطلوبة",
        description: "يرجى إدخال اسم المستخدم وكلمة المرور",
        variant: "destructive",
      });
      return;
    }
    adminLoginMutation.mutate();
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" title="الحساب" data-testid="button-account-menu">
            <User className="h-5 w-5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48" dir="rtl">
          <DropdownMenuItem onClick={() => { setTab("account"); setOpenDialog(true); }} data-testid="menu-item-my-account">
            <User className="h-4 w-4 ml-2" />
            معلومات حسابي
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => { setTab("admin"); setOpenDialog(true); }} data-testid="menu-item-admin-login">
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

      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="max-w-2xl" dir="rtl">
          <DialogTitle style={{ display: "none" }}>حساب العميل</DialogTitle>
          <DialogDescription style={{ display: "none" }}>إدارة حسابك</DialogDescription>

          <Tabs value={tab} onValueChange={(value) => setTab(value as "account" | "admin")} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="account" data-testid="tab-account-dialog">
                معلومات حسابي
              </TabsTrigger>
              <TabsTrigger value="admin" data-testid="tab-admin-dialog">
                Admin
              </TabsTrigger>
            </TabsList>

            {/* Account Tab */}
            <TabsContent value="account" className="mt-6">
              {isLoggedIn && customer ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm text-muted-foreground">الاسم</Label>
                      <p className="font-medium" data-testid="text-dialog-name">{customer.name || "-"}</p>
                    </div>
                    <div>
                      <Label className="text-sm text-muted-foreground">البريد الإلكتروني</Label>
                      <p className="font-medium dir-ltr" data-testid="text-dialog-email">{customer.email || "-"}</p>
                    </div>
                    <div>
                      <Label className="text-sm text-muted-foreground">الهاتف</Label>
                      <p className="font-medium dir-ltr" data-testid="text-dialog-phone">{customer.phone || "-"}</p>
                    </div>
                    <div>
                      <Label className="text-sm text-muted-foreground">المدينة</Label>
                      <p className="font-medium" data-testid="text-dialog-city">{customer.city || "-"}</p>
                    </div>
                  </div>
                  <div>
                    <Label className="text-sm text-muted-foreground">العنوان</Label>
                    <p className="font-medium" data-testid="text-dialog-address">{customer.address || "-"}</p>
                  </div>
                </div>
              ) : (
                <p className="text-center text-muted-foreground py-8">يرجى تسجيل الدخول أولا</p>
              )}
            </TabsContent>

            {/* Admin Tab */}
            <TabsContent value="admin" className="mt-6">
              <Card>
                <CardHeader className="text-center space-y-2">
                  <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center mx-auto">
                    <Lock className="h-6 w-6 text-primary-foreground" />
                  </div>
                  <CardTitle className="text-lg" data-testid="text-admin-title">
                    تسجيل دخول الإدارة
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleAdminLogin} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="admin-username-dialog">اسم المستخدم</Label>
                      <Input
                        id="admin-username-dialog"
                        type="text"
                        value={adminUsername}
                        onChange={(e) => setAdminUsername(e.target.value)}
                        placeholder="أدخل اسم المستخدم"
                        data-testid="input-admin-username-dialog"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="admin-password-dialog">كلمة المرور</Label>
                      <Input
                        id="admin-password-dialog"
                        type="password"
                        value={adminPassword}
                        onChange={(e) => setAdminPassword(e.target.value)}
                        placeholder="أدخل كلمة المرور"
                        data-testid="input-admin-password-dialog"
                      />
                    </div>
                    <Button
                      type="submit"
                      className="w-full"
                      disabled={adminLoginMutation.isPending}
                      data-testid="button-admin-login-dialog"
                    >
                      {adminLoginMutation.isPending ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin ml-2" />
                          جاري التسجيل...
                        </>
                      ) : (
                        <>
                          <LogIn className="h-4 w-4 ml-2" />
                          تسجيل الدخول
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
    </>
  );
}
