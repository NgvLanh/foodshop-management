import { Col, Container, ListGroup, Nav, Row } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import { FaFacebookF, FaTwitter, FaInstagram } from 'react-icons/fa';
import { SiVisa, SiMastercard, SiPaypal } from 'react-icons/si';

const Footer = () => {
    return (
        <footer className="footer bg-light py-4 mt-4">
            <Container>
                <Row>
                    <Col md={3} className="mb-3">
                        <h5>Thông tin liên hệ</h5>
                        <ListGroup variant="flush">
                            <ListGroup.Item className="bg-light border-0">Địa chỉ: 123 Đường ABC, Thành phố XYZ</ListGroup.Item>
                            <ListGroup.Item className="bg-light border-0">Điện thoại: (123) 456-7890</ListGroup.Item>
                            <ListGroup.Item className="bg-light border-0">Email: contact@example.com</ListGroup.Item>
                        </ListGroup>
                    </Col>
                    <Col md={3} className="mb-3">
                        <h5>Dịch vụ</h5>
                        <Nav className="flex-column">
                            <Nav.Link as={NavLink} to="/home">Trang chủ</Nav.Link>
                            <Nav.Link as={NavLink} to="/about-us">Giới thiệu</Nav.Link>
                            <Nav.Link as={NavLink} to="/book-table">Đặt bàn</Nav.Link>
                        </Nav>
                    </Col>
                    <Col md={3} className="mb-3">
                        <h5>Theo dõi chúng tôi</h5>
                        <Nav className="social-icons">
                            <Nav.Link href="#" className="social-icon">
                                <FaFacebookF size={24} />
                            </Nav.Link>
                            <Nav.Link href="#" className="social-icon">
                                <FaTwitter size={24} />
                            </Nav.Link>
                            <Nav.Link href="#" className="social-icon">
                                <FaInstagram size={24} />
                            </Nav.Link>
                        </Nav>
                    </Col>
                    <Col md={3} className="mb-3">
                        <h5>Thanh toán</h5>
                        <Row className="payment-methods">
                            <Col xs={3} className="d-flex justify-content-center align-items-center mb-2">
                                <SiVisa size={60} />
                            </Col>
                            <Col xs={3} className="d-flex justify-content-center align-items-center mb-2">
                                <SiMastercard size={60} />
                            </Col>
                            <Col xs={3} className="d-flex justify-content-center align-items-center mb-2">
                                <SiPaypal size={60} />
                            </Col>
                        </Row>
                    </Col>
                </Row>
                <Row>
                    <Col className="text-center mt-4">
                        <p className="mb-0">© {new Date().getFullYear()} Công ty XYZ. Tất cả các quyền được bảo lưu.</p>
                    </Col>
                </Row>
            </Container>
        </footer>
    );
};

export default Footer;
