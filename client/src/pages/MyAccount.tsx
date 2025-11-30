import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Header } from "@/components/storefront/Header";
import { Footer } from "@/components/storefront/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Mail, Phone, MapPin, User, LogOut, Lock, LogIn, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import type { Customer } from "@shared/schema";

export default function MyAccount() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [customer, setCustomer] = useState<Partial<Customer> | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
  });

  // Admin login states
  const [adminUsername, setAdminUsername] = useState("");
  const [adminPassword, setAdminPassword] = useState("");

  useEffect(() => {
    const email = localStorage.getItem("customerEmail");
    if (!email) {
      setLocation("/");
      return;
    }

    const fetchCustomer = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/customers/by-email?email=${encodeURIComponent(email)}`);
        if (!response.ok) {
          throw new Error("Failed to fetch customer");
        }
        const data = await response.json();
        setCustomer(data);
        setFormData({
          name: data.name || "",
          email: data.email || "",
          phone: data.phone || "",
          address: data.address || "",
          city: data.city || "",
        });
      } catch (error) {
        console.error("Error fetching customer:", error);
        setLocation("/");
      } finally {
        setIsLoading(false);
      }
    };

    fetchCustomer();
  }, [setLocation]);

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
        setLocation("/admin");
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

  const handleLogoutCustomer = () => {
    localStorage.removeItem("customerToken");
    localStorage.removeItem("customerId");
    localStorage.removeItem("customerEmail");
    localStorage.removeItem("customerName");
    setLocation("/");
  };

  const handleSave = () => {
    setIsEditing(false);
  };

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

  if (!customer && !isLoading) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2" data-testid="text-account-title">
              الحساب والإدارة
            </h1>
            <p className="text-muted-foreground">إدارة حسابك الشخصي أو دخول لوحة التحكم</p>
          </div>

          <Tabs defaultValue="account" className="w-full" dir="rtl">
            <TabsList className="grid w-full grid-cols-2" data-testid="tabs-account-admin">
              <TabsTrigger value="account" data-testid="tab-account">
                معلومات حسابي
              </TabsTrigger>
              <TabsTrigger value="admin" data-testid="tab-admin">
                تسجيل دخول Admin
              </TabsTrigger>
            </TabsList>

            {/* Customer Account Tab */}
            <TabsContent value="account" className="space-y-6 mt-6">
              {isLoading ? (
                <div className="space-y-4">
                  <Skeleton className="h-16" />
                  <Skeleton className="h-16" />
                  <Skeleton className="h-16" />
                </div>
              ) : (
                <div className="space-y-6">
                  <Card className="hover-elevate">
                    <CardHeader className="flex flex-row items-center justify-between">
                      <CardTitle className="flex items-center gap-2" data-testid="text-account-info">
                        <User className="h-5 w-5" />
                        معلومات الحساب
                      </CardTitle>
                      {!isEditing && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setIsEditing(true)}
                          data-testid="button-edit-account"
                        >
                          تعديل
                        </Button>
                      )}
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Name */}
                        <div className="space-y-2">
                          <Label className="flex items-center gap-2">
                            <User className="h-4 w-4" />
                            الاسم
                          </Label>
                          {isEditing ? (
                            <Input
                              value={formData.name}
                              onChange={(e) =>
                                setFormData((prev) => ({ ...prev, name: e.target.value }))
                              }
                              data-testid="input-name"
                            />
                          ) : (
                            <p className="text-sm font-medium" data-testid="text-name">
                              {customer?.name || "-"}
                            </p>
                          )}
                        </div>

                        {/* Email */}
                        <div className="space-y-2">
                          <Label className="flex items-center gap-2">
                            <Mail className="h-4 w-4" />
                            البريد الإلكتروني
                          </Label>
                          {isEditing ? (
                            <Input
                              type="email"
                              value={formData.email}
                              disabled
                              dir="ltr"
                              data-testid="input-email"
                            />
                          ) : (
                            <p className="text-sm font-medium dir-ltr" data-testid="text-email">
                              {customer?.email || "-"}
                            </p>
                          )}
                        </div>

                        {/* Phone */}
                        <div className="space-y-2">
                          <Label className="flex items-center gap-2">
                            <Phone className="h-4 w-4" />
                            رقم الهاتف
                          </Label>
                          {isEditing ? (
                            <Input
                              value={formData.phone}
                              onChange={(e) =>
                                setFormData((prev) => ({ ...prev, phone: e.target.value }))
                              }
                              dir="ltr"
                              data-testid="input-phone"
                            />
                          ) : (
                            <p className="text-sm font-medium dir-ltr" data-testid="text-phone">
                              {customer?.phone || "-"}
                            </p>
                          )}
                        </div>

                        {/* City */}
                        <div className="space-y-2">
                          <Label className="flex items-center gap-2">
                            <MapPin className="h-4 w-4" />
                            المدينة
                          </Label>
                          {isEditing ? (
                            <Input
                              value={formData.city}
                              onChange={(e) =>
                                setFormData((prev) => ({ ...prev, city: e.target.value }))
                              }
                              data-testid="input-city"
                            />
                          ) : (
                            <p className="text-sm font-medium" data-testid="text-city">
                              {customer?.city || "-"}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Address */}
                      <div className="space-y-2">
                        <Label className="flex items-center gap-2">
                          <MapPin className="h-4 w-4" />
                          العنوان
                        </Label>
                        {isEditing ? (
                          <Input
                            value={formData.address}
                            onChange={(e) =>
                              setFormData((prev) => ({ ...prev, address: e.target.value }))
                            }
                            data-testid="input-address"
                          />
                        ) : (
                          <p className="text-sm font-medium" data-testid="text-address">
                            {customer?.address || "-"}
                          </p>
                        )}
                      </div>

                      {isEditing && (
                        <div className="flex gap-2 pt-4 border-t">
                          <Button onClick={handleSave} data-testid="button-save">
                            حفظ
                          </Button>
                          <Button
                            variant="outline"
                            onClick={() => setIsEditing(false)}
                            data-testid="button-cancel"
                          >
                            إلغاء
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* Logout Button */}
                  <div className="flex gap-2">
                    <Button
                      variant="destructive"
                      onClick={handleLogoutCustomer}
                      className="flex items-center gap-2"
                      data-testid="button-logout"
                    >
                      <LogOut className="h-4 w-4" />
                      تسجيل الخروج
                    </Button>
                  </div>
                </div>
              )}
            </TabsContent>

            {/* Admin Login Tab */}
            <TabsContent value="admin" className="mt-6">
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
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Footer />
    </div>
  );
}
