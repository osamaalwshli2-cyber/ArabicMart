import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { CartProvider } from "@/context/CartContext";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import ProductDetails from "@/pages/ProductDetails";
import FeaturedProducts from "@/pages/FeaturedProducts";
import CategoryProducts from "@/pages/CategoryProducts";
import MyOrders from "@/pages/MyOrders";
import MyAccount from "@/pages/MyAccount";
import Cart from "@/pages/Cart";
import Checkout from "@/pages/Checkout";
import OrderConfirmation from "@/pages/OrderConfirmation";
import AdminLoginPage from "@/pages/admin/Login";
import AdminLoginStandalone from "@/pages/AdminLogin";
import AdminDashboard from "@/pages/admin/Dashboard";
import AdminProducts from "@/pages/admin/Products";
import AdminCategories from "@/pages/admin/Categories";
import AdminOrders from "@/pages/admin/Orders";
import AdminOrderDetails from "@/pages/admin/OrderDetails";
import AdminCustomers from "@/pages/admin/Customers";

function AdminRouter() {
  const { isAuthenticated, isLoading } = useAdminAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <AdminLoginPage />;
  }

  return (
    <Switch>
      <Route path="/admin" component={AdminDashboard} />
      <Route path="/admin/products" component={AdminProducts} />
      <Route path="/admin/categories" component={AdminCategories} />
      <Route path="/admin/orders/:id" component={AdminOrderDetails} />
      <Route path="/admin/orders" component={AdminOrders} />
      <Route path="/admin/customers" component={AdminCustomers} />
      <Route component={NotFound} />
    </Switch>
  );
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/product/:id" component={ProductDetails} />
      <Route path="/featured" component={FeaturedProducts} />
      <Route path="/category/:id" component={CategoryProducts} />
      <Route path="/my-orders" component={MyOrders} />
      <Route path="/my-account" component={MyAccount} />
      <Route path="/admin-login" component={AdminLoginStandalone} />
      <Route path="/cart" component={Cart} />
      <Route path="/checkout" component={Checkout} />
      <Route path="/order-confirmation/:orderNumber" component={OrderConfirmation} />
      <Route path="/admin/:rest*" component={AdminRouter} />
      <Route path="/admin" component={AdminRouter} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <CartProvider>
          <Toaster />
          <Router />
        </CartProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
