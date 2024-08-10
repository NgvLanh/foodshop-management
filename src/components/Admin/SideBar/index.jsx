import { useEffect, useState } from "react";
import { Nav } from "react-bootstrap";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { MdOutlineDashboard, MdPayments } from "react-icons/md";
import { BiFoodMenu } from "react-icons/bi";
import { BiCategory } from "react-icons/bi";
import { FaUsersGear } from "react-icons/fa6";
import { TbTransformFilled } from "react-icons/tb";
import { FaUsersBetweenLines } from "react-icons/fa6";
import { FaTable } from "react-icons/fa";
import { MdDiscount } from "react-icons/md";
import { GiHotMeal } from "react-icons/gi";
import { FaFileInvoice } from "react-icons/fa";
import "./style.css";
import { getMyInfo } from "../../../services/Auth";

const Sidebar = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [user, setUser] = useState({});
    const [activeTab, setActiveTab] = useState(location.pathname);

    const handleTabClick = (tab) => {
        setActiveTab(tab);
    };

    useEffect(() => {
        getUserInfo();
    }, []);
    const getUserInfo = async () => {
        const res = await getMyInfo();
        setUser(res);
    }
    return (
        <div
            className="sidebar d-flex flex-column vh-100"
            style={{ width: "300px", height: "100%", backgroundColor: "#ffffff" }}
        >
            <Nav className="flex-column">
                <div className="logo">
                    <img src="/assets/images/profile.png" alt="Logo" className="logo-img" />
                    <h6>{user?.email}</h6>
                </div>
                <Nav.Item>
                    <Nav.Link
                        as={Link}
                        to="/admin/dashboard"
                        className={activeTab === "/admin/dashboard" ? "active" : ""}
                        onClick={() => handleTabClick("/admin/dashboard")}
                    >
                        <div className="d-flex align-items-center">
                            <MdOutlineDashboard size={24} />
                            <span className="ms-3">Thống kê</span>
                        </div>
                    </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                    <Nav.Link
                        as={Link}
                        to="/admin/menu"
                        className={activeTab === "/menu" ? "active" : ""}
                        onClick={() => handleTabClick("/menu")}
                    >
                        <div className="d-flex align-items-center">
                            <BiFoodMenu size={24} />
                            <span className="ms-3">Thực đơn</span>
                        </div>
                    </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                    <Nav.Link
                        as={Link}
                        to="/admin/category"
                        className={activeTab === "/category" ? "active" : ""}
                        onClick={() => handleTabClick("/category")}
                    >
                        <div className="d-flex align-items-center">
                            <BiCategory size={24} />
                            <span className="ms-3">Danh mục</span>
                        </div>
                    </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                    <Nav.Link
                        as={Link}
                        to="/admin/customer"
                        className={activeTab === "/customer" ? "active" : ""}
                        onClick={() => handleTabClick("/customer")}
                    >
                        <div className="d-flex align-items-center">
                            <FaUsersBetweenLines size={24} />
                            <span className="ms-3">Khách hàng</span>
                        </div>
                    </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                    <Nav.Link
                        as={Link}
                        to="/admin/discount"
                        className={activeTab === "/discount" ? "active" : ""}
                        onClick={() => handleTabClick("/discount")}
                    >
                        <div className="d-flex align-items-center">
                            <MdDiscount size={24} />
                            <span className="ms-3">Giảm giá</span>
                        </div>
                    </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                    <Nav.Link
                        as={Link}
                        to="/admin/order"
                        className={activeTab === "/order" ? "active" : ""}
                        onClick={() => handleTabClick("/order")}
                    >
                        <div className="d-flex align-items-center">
                            <FaFileInvoice size={24} />
                            <span className="ms-3">Đơn hàng</span>
                        </div>
                    </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                    <Nav.Link
                        as={Link}
                        to="/admin/order"
                        className={activeTab === "/payment-method" ? "active" : ""}
                        onClick={() => handleTabClick("/payment-method")}
                    >
                        <div className="d-flex align-items-center">
                            <MdPayments size={24} />
                            <span className="ms-3">Thanh toán</span>
                        </div>
                    </Nav.Link>
                </Nav.Item>
                {/* <Nav.Item>
                    <Nav.Link
                        as={Link}
                        to="/admin/reservation"
                        className={activeTab === "/reservations" ? "active" : ""}
                        onClick={() => handleTabClick("/reservations")}
                    >
                        <div className="d-flex align-items-center">
                            <TbTransformFilled size={24} />
                            <span className="ms-3">Đặt bàn</span>
                        </div>
                    </Nav.Link>
                </Nav.Item> */}
                {/* <Nav.Item>
                    <Nav.Link
                        as={Link}
                        to="/admin/employee"
                        className={activeTab === "/employees" ? "active" : ""}
                        onClick={() => handleTabClick("/employees")}
                    >
                        <div className="d-flex align-items-center">
                            <FaUsersGear size={24} />
                            <span className="ms-3">Nhân viên</span>
                        </div>
                    </Nav.Link>
                </Nav.Item> */}
                {/* <Nav.Item>
                    <Nav.Link
                        as={Link}
                        to="/admin/table"
                        className={activeTab === "/table" ? "active" : ""}
                        onClick={() => handleTabClick("/table")}
                    >
                        <div className="d-flex align-items-center">
                            <FaTable size={24} />
                            <span className="ms-3">Bàn</span>
                        </div>
                    </Nav.Link>
                </Nav.Item> */}
                {/* <Nav.Item>
                    <Nav.Link
                        as={Link}
                        to="/admin/dish"
                        className={activeTab === "/dish" ? "active" : ""}
                        onClick={() => handleTabClick("/dish")}
                    >
                        <div className="d-flex align-items-center">
                            <GiHotMeal size={24} />
                            <span className="ms-3">Món ăn</span>
                        </div>
                    </Nav.Link>
                </Nav.Item> */}
            </Nav>
        </div>
    );
};

export default Sidebar;
