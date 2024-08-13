import { useEffect, useState } from "react";
import { Nav } from "react-bootstrap";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { MdOutlineDashboard, MdPayments } from "react-icons/md";
import { BiFoodMenu } from "react-icons/bi";
import { BiCategory } from "react-icons/bi";
import { FaUsersBetweenLines } from "react-icons/fa6";
import { MdDiscount } from "react-icons/md";
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
            <Nav className="flex-column" style={{ gap: '6px' }}>
                <div className="logo mb-4">
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
                        to="/admin/user"
                        className={activeTab === "/user" ? "active" : ""}
                        onClick={() => handleTabClick("/user")}
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
            </Nav>
        </div>
    );
};

export default Sidebar;
