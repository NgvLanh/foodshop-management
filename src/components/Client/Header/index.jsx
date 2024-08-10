import React, { useEffect, useState } from 'react';
import { Navbar, Nav, Container, NavDropdown, Badge, Image, Button } from 'react-bootstrap';
import { FaShoppingCart, FaBell, FaBars } from 'react-icons/fa';
import { getMyInfo } from '../../../services/Auth';
import { Cookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';

const Header = () => {
    const [user, setUser] = useState({});
    const navigate = useNavigate();

    useEffect(() => {
        fetchUser();
    }, [])

    const fetchUser = async () => {
        const res = await getMyInfo();
        setUser(res);
    }

    const logout = () => {
        new Cookies().remove('token');
        navigate('/home');
        window.location.reload();
    }

    return (
        <Navbar expand="lg" bg="light">
            <Container>
                <Navbar.Toggle aria-controls="navbarSupportedContent">
                    <FaBars />
                </Navbar.Toggle>
                <Navbar.Brand href="/home">
                    <img
                        src="/assets/images/logo.png"
                        height="50"
                        alt="MDB Logo"
                        loading="lazy"
                    />
                </Navbar.Brand>
                <Navbar.Collapse id="navbarSupportedContent">
                    <Nav className="me-auto mb-2 mb-lg-0">
                        <Nav.Link href="/home">Trang chủ</Nav.Link>
                        <Nav.Link href="/about-us">Giới thiệu</Nav.Link>
                        <Nav.Link href="/dishes">Món ăn</Nav.Link>
                    </Nav>
                </Navbar.Collapse>
                <div className="d-flex align-items-center">
                    <Nav.Link href="/cart" className="text-reset me-3">
                        <FaShoppingCart size={20} />
                    </Nav.Link>
                    <NavDropdown
                        align="center"
                        title={
                            <Image
                                src="https://mdbcdn.b-cdn.net/img/new/avatars/2.webp"
                                roundedCircle
                                height="30"
                                alt="Avatar"
                                loading="lazy"
                            />
                        }
                        id="navbarDropdownMenuAvatar"
                    >
                        {
                            user.id ? null
                                : <NavDropdown.Item href="/account">Tài khoản</NavDropdown.Item>
                        }
                        {
                            user.id ? <NavDropdown.Item href="/profile">Hồ sơ</NavDropdown.Item> : null
                        }
                        {
                            user.id ? <NavDropdown.Item onClick={logout}>Đăng xuất</NavDropdown.Item> : null
                        }
                    </NavDropdown>
                </div>
            </Container>
        </Navbar>
    );
};
export default Header;
