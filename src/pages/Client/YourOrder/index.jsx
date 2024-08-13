import { useEffect, useState } from 'react';
import { Container, Row, Col, Tabs, Tab, Modal, Button, Form, Table } from 'react-bootstrap';
import toast, { Toaster } from 'react-hot-toast';
import request from '../../../config/apiConfig';
import { getMyInfo } from '../../../services/Auth';
import './style.css'
import { CgDetailsMore } from 'react-icons/cg';
import { GiCancel } from 'react-icons/gi';
import { confirmAlert } from 'react-confirm-alert';

const YourOrder = () => {
    const [userInfo, setUserInfo] = useState(null);
    const [orders, setOrders] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [orderDetails, setOrderDetails] = useState([]);
    const [orderStatus, setOrderStatus] = useState([]);

    const orderStatusMapping = {
        PENDING: 'Chờ xác nhận',
        CONFIRMED: 'Đã xác nhận',
        SHIPPED: 'Đã gửi hàng',
        DELIVERED: 'Đã giao hàng',
        CANCELED: 'Đã hủy'
    };

    useEffect(() => {
        fetchUserInfo();
    }, []);

    useEffect(() => {
        if (userInfo) {
            fetchOrders();
        }
    }, [userInfo]);

    const fetchUserInfo = async () => {
        try {
            const res = await getMyInfo();
            setUserInfo(res);
        } catch (err) {
            toast.error('Không thể lấy thông tin người dùng');
        }
    };

    const fetchOrders = async () => {
        try {
            const res = await request({
                path: `orders/${userInfo?.id}`,
                header: 'Bearer '
            });
            setOrders(res);
            const uniqueStatuses = [...new Set(res.map((o) => orderStatusMapping[o.status]))];
            setOrderStatus(uniqueStatuses);
        } catch (error) {
            alert(error);
        }
    };

    const fetchOrderDetailsByOrderId = async (order) => {
        try {
            const res = await request({
                path: `order-details/orders/${order.id}`,
                header: 'Bearer '
            })
            console.log(res);
            setOrderDetails(res);
        } catch (error) {
            alert(error)
        }
    }

    const handleShowModal = (order) => {
        fetchOrderDetailsByOrderId(order);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedOrder(null);
    };

    const handleCancelOrder = async (id) => {
        try {
            const res = await request({ method: 'PUT', path: `orders/${id}/cancel`, header: 'Bearer ' });
            if (res) {
                toast.success('Huỷ đơn hàng thành công!');
            } else {
                toast.error('Không thể huỷ do cửa hàng đã xác nhận!');
            }
            window.location.reload();
        } catch (error) {
            alert(error)
        }
    };

    const confirmDeleteOrder = (id) => {
        confirmAlert({
            title: 'Xác nhận huỷ đơn hàng',
            message: 'Bạn có chắc chắn muốn huỷ đơn hàng này không?',
            buttons: [
                { label: 'Có', onClick: () => handleCancelOrder(id) },
                { label: 'Không' }
            ]
        })
    };

    return (
        <Container className="mt-4 py-4">
            <Toaster />
            <h2 className="mb-4">Tiến trình hóa đơn</h2>
            <Tabs defaultActiveKey="Chờ xác nhận" id="order-status-tabs">
                {
                    orderStatus.map((status) => (
                        <Tab key={status} eventKey={status} title={status} className='mt-2'>
                            <Row>
                                {
                                    orders
                                        .filter((order) => orderStatusMapping[order.status] === status)
                                        .map((order) => (
                                            <Col key={order.id} sm={12} md={6} lg={4} className="mb-3">
                                                <div className="custom-card">
                                                    <div className="custom-card-info">
                                                        <h5>Mã đơn hàng: {order.id}</h5>
                                                        <p><strong>Ngày:</strong> {new Date(order.date).toLocaleDateString()}</p>
                                                        <p><strong>Tổng cộng:</strong> {order.subtotal.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</p>
                                                        <p><strong>Phí vận chuyển:</strong> {order.address.shippingFee.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</p>
                                                        <p><strong>Giảm giá:</strong> {order.discount ? order.discount?.percentNumber.toLocaleString() + ' %' : 'Không có'}</p>
                                                        <p><strong>Địa chỉ:</strong> {order.address.ward}, {order.address.district}, {order.address.province}</p>
                                                        <i style={{ cursor: 'pointer' }}
                                                            className='text-muted'
                                                            onClick={() => handleShowModal(order)}>
                                                            <small><u>Chi tiết hoá đơn</u></small>
                                                        </i>
                                                    </div>
                                                    <div className="custom-card-footer">
                                                        <span className="custom-text-title">${order.total.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</span>
                                                        <div className="custom-card-button">
                                                            {order.status === 'PENDING' && (
                                                                <button
                                                                    className="btn btn-danger"
                                                                    onClick={() => confirmDeleteOrder(order.id)}
                                                                >
                                                                    Hủy
                                                                </button>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </Col>
                                        ))
                                }
                            </Row>
                        </Tab>
                    ))
                }
            </Tabs>

            <Modal show={showModal} onHide={handleCloseModal} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>Danh sách món</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Table hover className="border-0">
                        <thead>
                            <tr>
                                <th>Hình ảnh</th>
                                <th>Tên món</th>
                                <th>Giá</th>
                                <th>Số lượng</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orderDetails?.map((o) => (
                                <tr key={o.id} className='align-middle'>
                                    <td>
                                        <img src={`/assets/images/${o.dish.image}`} alt={`${o.dish.image}`}
                                            width='123px' />
                                    </td>
                                    <td>
                                        {o.dish.name}
                                        <br />
                                        {o.dish.description}
                                    </td>
                                    <td>{o.price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</td>
                                    <td>x{o.quantity}</td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModal}>
                        Đóng
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container >
    );
};

export default YourOrder;
