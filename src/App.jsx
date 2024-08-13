import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from "react-router-dom";
import Admin from "./pages/Admin/Layout";
import { Cookies, CookiesProvider } from "react-cookie";
import Dashboard from "./pages/Admin/Dashboard";
import Category from "./pages/Admin/Category";
import User from "./pages/Admin/User";
import Discount from "./pages/Admin/Discount";
import Menu from "./pages/Admin/Menu";
import Order from "./pages/Admin/Order";
import PaymentMethod from "./pages/Admin/PaymentMethod";
import NotFound from "./pages/NotFound";
import Client from "./pages/Client/Layout";
import Home from "./pages/Client/Home";
import AboutUs from "./pages/Client/AboutUs";
import Cart from "./pages/Client/Cart";
import Account from "./pages/Client/Account";
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast, { Toaster } from "react-hot-toast";
import { getMyInfo } from "./services/Auth";
import Dishes from "./pages/Client/Dishes";
import Profile from "./pages/Client/Profile";
import YourOrder from "./pages/Client/YourOrder";
import { CartProvider } from "./components/Client/CartContext";



const ProtectedRoute = ({ element, adminOnly = false }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const hasShownToast = useRef(false);


  useEffect(() => {
    const checkAuth = async () => {
      try {
        const userInfo = await getMyInfo();
        setUser(userInfo);
        if (!userInfo && !hasShownToast.current) {
          toast.error('Vui lòng đăng nhập để tiếp tục.');
          hasShownToast.current = true;
          navigate('/account');
        } else if (adminOnly && !userInfo?.roles?.includes('ADMIN') && !hasShownToast.current) {
          toast.error('Bạn không có quyền truy cập.');
          hasShownToast.current = true;
          navigate('/'); // Điều hướng người dùng về trang chủ nếu không phải admin
        }
      } catch (error) {
        if (!hasShownToast.current) {
          toast.error('Vui lòng đăng nhập để tiếp tục');
          hasShownToast.current = true;
          navigate('/account');
          new Cookies().remove('token');
        }
      }
    };

    checkAuth();
  }, [navigate]);

  return user && (!adminOnly || user.roles.includes('ADMIN')) ? element : null;
};

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route>
      {/* Đường dẫn cho client */}
      <Route path="/" element={<Client />}>
        <Route index element={<Home />} />
        <Route path="home" element={<Home />} />
        <Route path="dishes" element={<Dishes />} />
        <Route path="about-us" element={<AboutUs />} />
        <Route path="profile" element={<ProtectedRoute element={<Profile />} />} />
        <Route path="cart" element={<ProtectedRoute element={<Cart />} />} />
        <Route path="account" element={<Account />} />
        <Route path="order" element={<ProtectedRoute element={<YourOrder />} />} />
      </Route>

      {/* Đường dẫn cho admin */}
      <Route path="/admin" element={<ProtectedRoute element={<Admin />} adminOnly={true} />}>
        <Route index element={<Dashboard />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="menu" element={<Menu />} />
        <Route path="category" element={<Category />} />
        <Route path="user" element={<User />} />
        <Route path="discount" element={<Discount />} />
        <Route path="order" element={<Order />} />
        <Route path="payment-method" element={<PaymentMethod />} />
      </Route>
      <Route path="*" element={<NotFound />} />
    </Route>
  )
);

const App = () => {
  return (
    <CookiesProvider>
      <Toaster />
      <CartProvider>
        <RouterProvider router={router} />
      </CartProvider>
    </CookiesProvider>
  );
};

export default App;
