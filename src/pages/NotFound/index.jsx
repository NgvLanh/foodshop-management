import React from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import './NotFound.css'; // Tạo file CSS riêng để định dạng

const NotFound = () => {
    return (
        <Container fluid className="not-found-container d-flex align-items-center justify-content-center">
            <Row className="text-center">
                <Col>
                    <h1 className="oops-text">OOPS!</h1>
                    <h2 className="mt-4">404 - KHÔNG TÌM THẤY TRANG</h2>
                    <Link to="/home">
                        <Button variant="warning" className="mt-3">QUAY LẠI TRANG CHỦ</Button>
                    </Link>
                </Col>
            </Row>
        </Container>
    );
};

export default NotFound;
