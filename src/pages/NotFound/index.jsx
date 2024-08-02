import { Container, Row, Col, Button } from 'react-bootstrap';
import { IoMdWarning } from 'react-icons/io';
import { Link } from 'react-router-dom'; 

const NotFound = () => {
    return (
        <Container fluid className="d-flex align-items-center justify-content-center" style={{ height: '100vh', backgroundColor: '#f7f7f7' }}>
            <Row className="text-center">
                <Col>
                    <IoMdWarning size={80} color="#ff4d4d" />
                    <h1 className="mt-4">404</h1>
                    <h2>Trang không tìm thấy</h2>
                    <p className="mt-3">Xin lỗi, trang bạn đang tìm không tồn tại.</p>
                    <Link to="/home">
                        <Button variant="primary" className="mt-3">Trở về trang chủ</Button>
                    </Link>
                </Col>
            </Row>
        </Container>
    );
};

export default NotFound;
