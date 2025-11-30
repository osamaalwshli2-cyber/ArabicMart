import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { Header } from "@/components/storefront/Header";
import { Footer } from "@/components/storefront/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Mail, Phone, MapPin, User, LogOut } from "lucide-react";
import type { Customer } from "@shared/schema";

export default function MyAccount() {
  const [, setLocation] = useLocation();
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

  const handleLogout = () => {
    localStorage.removeItem("customerToken");
    localStorage.removeItem("customerId");
    localStorage.removeItem("customerEmail");
    localStorage.removeItem("customerName");
    setLocation("/");
  };

  const handleSave = () => {
    // Here you could add API call to update customer info
    // For now just show confirmation
    setIsEditing(false);
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
              حسابي
            </h1>
            <p className="text-muted-foreground">إدارة معلومات حسابك الشخصية</p>
          </div>

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
                  onClick={handleLogout}
                  className="flex items-center gap-2"
                  data-testid="button-logout"
                >
                  <LogOut className="h-4 w-4" />
                  تسجيل الخروج
                </Button>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
