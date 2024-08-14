import React, { useEffect, useState } from 'react';
import { Navbar, Nav, Container, Row, Col, NavDropdown, Image } from 'react-bootstrap';
import { getMyInfo } from '../../../services/Auth';
import { Cookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';
import '../CartIcon'
import './style.css';
import CartIcon from '../CartIcon';
import { CiUser } from 'react-icons/ci';
import { FaRegCircleUser } from 'react-icons/fa6';

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
        <Navbar expand="lg" bg="light" style={{ position: 'sticky', top: '0', zIndex: '100', boxShadow: '1px 1px 100px lightgray' }}>
            <Container>
                <Row className="w-100">
                    <Col xs={6} className="d-flex justify-content-end">
                        <Nav className="me-3">
                            <Nav.Link href="/home" className="nav-link-hover">Trang chủ</Nav.Link>
                            <Nav.Link href="/dishes" className="nav-link-hover">Món ăn</Nav.Link>
                        </Nav>
                    </Col>
                    <Col xs={1} className="d-flex justify-content-center align-items-center">
                        <Navbar.Brand href="/home" className="nav-link-hover">
                            <img
                                src="/assets/images/logo.png"
                                height="140"
                                alt="MDB Logo"
                                loading="lazy"
                            />
                        </Navbar.Brand>
                    </Col>
                    <Col xs={5} className="d-flex justify-content-start">
                        <Nav className="ms-5">
                            <Nav.Link href="/about-us" className="nav-link-hover">Giới thiệu</Nav.Link>
                            <Nav.Link href={user.id ? '/profile' : '/account'} className="nav-link-hover">Tài khoản</Nav.Link>
                        </Nav>
                    </Col>
                </Row>
                <div className="d-flex align-items-center justify-content-end">
                    <Nav.Link href="/cart" className="text-reset me-0 nav-link-hover">
                        <CartIcon />
                    </Nav.Link>
                    <NavDropdown
                        align="center"
                        title={
                            user?.image ?
                                < Image
                                    src={`file/${user?.image}`}
                                    roundedCircle
                                    height="30"
                                    width='30'
                                    alt="Avatar"
                                    loading="lazy"
                                /> :
                                <span>
                                    <FaRegCircleUser size={24} />
                                </span>

                        }
                        id="navbarDropdownMenuAvatar"
                    >
                        {
                            user.id ? <NavDropdown.Item href='/order' className="nav-link-hover">Hoá đơn</NavDropdown.Item> : null
                        }
                        {
                            user.id ? <NavDropdown.Item onClick={logout} className="nav-link-hover">Đăng xuất</NavDropdown.Item> : null
                        }
                    </NavDropdown>
                </div>
            </Container>
        </Navbar >
    );
};

export default Header;
