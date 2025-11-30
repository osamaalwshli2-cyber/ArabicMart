import { useState } from "react";
import { useLocation } from "wouter";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Header } from "@/components/storefront/Header";
import { Footer } from "@/components/storefront/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Lock, LogIn, Loader2, ArrowRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

export default function AdminLogin() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [adminUsername, setAdminUsername] = useState("");
  const [adminPassword, setAdminPassword] = useState("");

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
      setTimeout(() => {
        window.location.href = "/admin";
      }, 300);
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
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto">
          <div className="mb-8">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setLocation("/")}
              className="mb-4"
              data-testid="button-back"
            >
              <ArrowRight className="h-4 w-4 ml-2" />
              رجوع
            </Button>
          </div>

          <Card className="hover-elevate">
            <CardHeader className="text-center space-y-4">
              <div className="w-16 h-16 bg-primary rounded-xl flex items-center justify-center mx-auto">
                <Lock className="h-8 w-8 text-primary-foreground" />
              </div>
              <CardTitle className="text-2xl" data-testid="text-admin-login-title">
                تسجيل دخول الإدارة
              </CardTitle>
              <p className="text-muted-foreground text-sm">
                أدخل بيانات اعتمادك للوصول إلى لوحة التحكم
              </p>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleAdminLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="admin-username" data-testid="label-admin-username">
                    اسم المستخدم
                  </Label>
                  <Input
                    id="admin-username"
                    type="text"
                    value={adminUsername}
                    onChange={(e) => setAdminUsername(e.target.value)}
                    placeholder="أدخل اسم المستخدم"
                    data-testid="input-admin-username"
                    dir="rtl"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="admin-password" data-testid="label-admin-password">
                    كلمة المرور
                  </Label>
                  <Input
                    id="admin-password"
                    type="password"
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                    placeholder="أدخل كلمة المرور"
                    data-testid="input-admin-password"
                    dir="rtl"
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full flex items-center gap-2"
                  disabled={adminLoginMutation.isPending}
                  data-testid="button-admin-login"
                >
                  {adminLoginMutation.isPending ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      جاري التسجيل...
                    </>
                  ) : (
                    <>
                      <LogIn className="h-4 w-4" />
                      تسجيل الدخول
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
}
