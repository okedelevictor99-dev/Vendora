import { Routes, Route } from "react-router-dom"
import AdminLogin from "@/features/admin/auth/auth.pages/AdminLogin";
import AdminSignup from "@/features/admin/auth/auth.pages/AdminSignup";
import AdminResetPassword from "@/features/admin/auth/auth.pages/AdminResetPassword";
import AdminLayout from "@/components/layout/adminLayout";
import AdminDashboard from "@/features/admin/dashboard/dashboard.pages/AdminDashboard";
import AdminProductForm from "@/features/admin/product/product.pages/AdminProductForm";
import AdminManagement from "@/features/admin/auth/auth.pages/AdminManagement";
import AdminProducts from "@/features/admin/product/product.pages/AdminProducts";
import AdminUsers from "@/features/admin/user/user.pages/AdminUser"
import AdminUserDetails from "@/features/admin/user/user.pages/AdminUserDetails";
import { RequireAdmin } from "./RequireAdmin";
import AdminOrders from "@/features/admin/order/order.pages/AdminOrder";
import AdminAccount from "@/features/admin/account/account.pages/AdminAccount";
import AdminOrderDetails from "@/features/admin/order/order.pages/AdminOrderDetails";


const AdminRoutes = () => {
  return (
    <Routes>
      <Route path="login" element={<AdminLogin />} />
      <Route path="signup" element={<AdminSignup />} />
      <Route path="reset-password" element={<AdminResetPassword />} />

      <Route element={<RequireAdmin />}>
        <Route element={<AdminLayout />}>
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="user/:id" element={<AdminUserDetails />} />
          <Route path="orders/:id" element={<AdminOrderDetails />} />
          <Route path="management" element={<AdminManagement />} />
          <Route path="account" element={<AdminAccount />} />
          <Route path="products/new" element={<AdminProductForm />} />
          <Route path="products/:id/edit" element={<AdminProductForm />} />
        </Route>
      </Route>
    </Routes>
  );
};

export default AdminRoutes;