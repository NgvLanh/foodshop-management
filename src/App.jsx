import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from "react-router-dom";
import Admin from "./pages/Admin/Layout";
import { CookiesProvider } from "react-cookie";
import Dashboard from "./pages/Admin/Dashboard";
import Category from "./pages/Admin/Category";
import Customer from "./pages/Admin/Customer";
import Discount from "./pages/Admin/Discount";
import Dish from "./pages/Admin/Dish";
import Employee from "./pages/Admin/Employee";
import Table from "./pages/Admin/Table";
import Menu from "./pages/Admin/Menu";
import Reservation from "./pages/Admin/Reservation";
import Order from "./pages/Admin/Order";
import NotFound from "./pages/NotFound";
import Login from "./pages/Client/Account";
import Client from "./pages/Client/Layout";
import Home from "./pages/Client/Home";
import DishList from "./pages/Client/DishList";
import AboutUs from "./pages/Client/AboutUs";
import BookTable from "./pages/Client/BookTable";
import Cart from "./pages/Client/Cart";
import YourTable from "./pages/Client/YourTable";
import Account from "./pages/Client/Account";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route>
      {/* Client link */}
      <Route path="/" element={<Client />}>
        <Route index element={<Home />} />
        <Route path="home" element={<Home />} />
        <Route path="dish-list" element={<DishList />} />
        <Route path="about-us" element={<AboutUs />} />
        <Route path="book-table" element={<BookTable />} />
        <Route path="cart" element={<Cart />} />
        <Route path="your-table" element={<YourTable />} />
        <Route path="account" element={<Account />} />
      </Route>

      {/* Admin link */}
      <Route path="/admin" element={< Admin />}>
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="menu" element={<Menu />} />
        <Route path="category" element={<Category />} />
        <Route path="customer" element={<Customer />} />
        <Route path="reservation" element={<Reservation />} />
        <Route path="employee" element={<Employee />} />
        <Route path="table" element={<Table />} />
        <Route path="discount" element={<Discount />} />
        <Route path="order" element={<Order />} />
        <Route path="dish" element={<Dish />} />
      </Route >
      <Route path="*" element={<NotFound />} />
    </Route >
  )
);

const App = () => {
  return (
    <CookiesProvider>
      <RouterProvider router={router} />
    </CookiesProvider>
  );
};

export default App;
