import { Routes, Route } from "react-router-dom";

import Welcome from "@/components/common/Welcome";
import Login from "@/features/client/auth/auth.pages/Login";
import Signup from "@/features/client/auth/auth.pages/Signup";
import VerifyEmail from "@/features/client/auth/auth.pages/VerifyEmail";
import ForgotPassword from "@/features/client/auth/auth.pages/ForgotPassword";
import ResetPassword from "@/features/client/auth/auth.pages/ResetPassword";
import ProductList from "@/features/client/product/product.pages/publicProductList";
import { ProductDetailsPage } from "@/features/client/product/product.pages/publicProductDetails";

import CustomerLayout from "@/components/layout/customerLayout";
import { RequireAuth } from "./RequireAuth";

import CustomerProductList from "@/features/client/product/product.pages/customerProductList";
import CustomerProductDetailsPage from "@/features/client/product/product.pages/customerProductDetails";
import Cart from "@/features/client/cart/cart.pages/cart";
import Order from "@/features/client/order/order.pages/Order";
import OrderDetails from "@/features/client/order/order.pages/OrderDetails";
import PaymentVerifyPage from "@/features/client/order/order.pages/PaymentVerify";
import AccountSettings from "@/features/client/user/pages/AccountSettings"

const UserRoutes = () => {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<Welcome />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/verify-email" element={<VerifyEmail />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/products" element={<ProductList />} />
      <Route path="/products/:id" element={<ProductDetailsPage />} />
      


      {/* Protected routes */}
      <Route element={<RequireAuth />}>
        <Route element={<CustomerLayout />}>
          <Route path="/dashboard" element={<CustomerProductList />} />
          <Route path="/dashboard/cart" element={<Cart />} />
          <Route path="/dashboard/orders" element={<Order />} />
          <Route path="/dashboard/orders/:id" element={<OrderDetails/>} />
          <Route path="/dashboard/products/:id" element={<CustomerProductDetailsPage />} />
          <Route path="/dashboard/payment/verify" element={<PaymentVerifyPage/>} />
          <Route path="/dashboard/account" element={<AccountSettings/>}/>
        </Route>
      </Route>
    </Routes>
  );
};

export default UserRoutes;