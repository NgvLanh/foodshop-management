// Order Component
import { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Button, Form, Modal } from 'react-bootstrap';
import { FaEdit, FaTrash } from 'react-icons/fa';
import toast, { Toaster } from 'react-hot-toast';

const Order = () => {
    const [orders, setOrders] = useState([
        { id: 1, orderNumber: 'ORD001', date: '2024-08-01', customer: 'Nguyễn Văn A', totalAmount: 500000, status: 'Completed', items: ['Món 1', 'Món 2'] },
        // More orders
    ]);
    const [filteredOrders, setFilteredOrders] = useState(orders);
    const [search, setSearch] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [currentOrder, setCurrentOrder] = useState(null);

    useEffect(() => {
        setFilteredOrders(
            orders.filter(order =>
                order.customer.toLowerCase().includes(search.toLowerCase())
            )
        );
    }, [search, orders]);

    const handleShowModal = (order = null) => {
        setCurrentOrder(order);
        setShowModal(true);
    };

    const handleCloseModal = () => setShowModal(false);

    const handleDeleteOrder = (id) => {
        setOrders(orders.filter(order => order.id !== id));
        toast.success('Đơn hàng đã được xóa!');
    };

    const handleSaveChanges = () => {
        // Save changes logic
        toast.success('Thông tin đơn hàng đã được cập nhật!');
        handleCloseModal();
    };

    return (
        <Container fluid style={{ background: '#f7f4f4', height: '100vh' }}>
            <Toaster />
            <Row className="my-4">
                <Col>
                    <h2 className="mb-4">Quản Lý Đơn Hàng</h2>
                    <Form.Control
                        type="text"
                        placeholder="Tìm kiếm theo khách hàng..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="mb-4"
                    />
                </Col>
            </Row>
            <Row>
                <Col>
                    <Card>
                        <Card.Body>
                            <Table striped bordered hover>
                                <thead>
                                    <tr>
                                        <th>Mã Đơn Hàng</th>
                                        <th>Ngày</th>
                                        <th>Khách Hàng</th>
                                        <th>Tổng Số Tiền</th>
                                        <th>Trạng Thái</th>
                                        <th>Hành Động</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredOrders.map(order => (
                                        <tr key={order.id}>
                                            <td>{order.orderNumber}</td>
                                            <td>{order.date}</td>
                                            <td>{order.customer}</td>
                                            <td>{order.totalAmount.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</td>
                                            <td>{order.status}</td>
                                            <td>
                                                <Button variant="warning" size="sm" onClick={() => handleShowModal(order)}>
                                                    <FaEdit /> Xem Chi Tiết
                                                </Button>{' '}
                                                <Button variant="danger" size="sm" onClick={() => handleDeleteOrder(order.id)}>
                                                    <FaTrash /> Xóa
                                                </Button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* Modal */}
            <Modal show={showModal} onHide={handleCloseModal}>
                <Modal.Header closeButton>
                    <Modal.Title>{currentOrder ? 'Chi Tiết Đơn Hàng' : 'Thông Tin Đơn Hàng'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {currentOrder && (
                        <div>
                            <p><strong>Mã Đơn Hàng:</strong> {currentOrder.orderNumber}</p>
                            <p><strong>Ngày:</strong> {currentOrder.date}</p>
                            <p><strong>Khách Hàng:</strong> {currentOrder.customer}</p>
                            <p><strong>Tổng Số Tiền:</strong> {currentOrder.totalAmount.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</p>
                            <p><strong>Trạng Thái:</strong> {currentOrder.status}</p>
                            <p><strong>Các Món Ăn:</strong> {currentOrder.items.join(', ')}</p>
                            {/* Additional details */}
                        </div>
                    )}
                    {!currentOrder && <p>Không có thông tin đơn hàng.</p>}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModal}>
                        Đóng
                    </Button>
                    {currentOrder && (
                        <Button variant="primary" onClick={handleSaveChanges}>
                            Lưu Thay Đổi
                        </Button>
                    )}
                </Modal.Footer>
            </Modal>
        </Container>
    );
};

export default Order;
