import { useEffect, useState } from 'react';
import { Container, Row, Col, Table, Tabs, Tab, Modal, Button } from 'react-bootstrap';
import toast, { Toaster } from 'react-hot-toast';
import request from '../../../config/apiConfig';
import { FcViewDetails } from 'react-icons/fc';
import { confirmAlert } from 'react-confirm-alert';

const Discount = () => {
    const [orders, setOrders] = useState([]);
    const [orderStatus, setOrderStatus] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [orderDetails, setOrderDetails] = useState([]);
    const [order, setOrder] = useState({});
    const [address, setAddress] = useState({});
    const [user, setUser] = useState({});


    const orderStatusMapping = {
        PENDING: 'Chờ xác nhận',
        CONFIRMED: 'Đã xác nhận',
        SHIPPED: 'Đã gửi hàng',
        DELIVERED: 'Đã giao hàng',
        CANCELED: 'Đã hủy'
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const res = await request({
                path: 'orders',
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
            setOrderDetails(res);
        } catch (error) {
            alert(error)
        }
    }

    const handleShowModal = (order) => {
        fetchOrderDetailsByOrderId(order);
        setOrder(order);
        setAddress(order.address);
        setUser(order.address.user);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
    };

    const updateStatusOrder = async (order) => {
        try {
            const res = await request({
                method: 'PUT',
                path: `orders/${order.id}`,
                header: 'Bearer '
            });
            if (res) {
                toast.success('Xác nhận thành công.')
            } else {
                toast.error('Xác nhận không thành công do khách hàng đã huỷ đơn.')
            }
            if (res.status == 'DELIVERED') {
                try {
                    await request({
                        method: 'PUT',
                        path: `payments/${order.id}?money=${res.total}`,
                        header: 'Bearer '
                    });
                } catch (error) {
                    alert(error)
                }
            }
            fetchOrders();
            setShowModal(false);
        } catch (error) {
            alert(error);
        }
    }

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

    const cancelOrder = (id) => {
        setShowModal(false);
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
        <Container fluid style={{ background: '#f7f4f4', height: '100vh' }}>
            <Toaster />
            <Row className="my-4">
                <Col>
                    <h2 className="mb-4">Quản lý đơn hàng</h2>
                </Col>
            </Row>
            <Tabs defaultActiveKey={orderStatus[0]} id="discount-tabs" className="mb-1">
                {
                    orderStatus.map((status) => (
                        <Tab key={status} eventKey={status} title={status} className='mt-2'>
                            <Row>
                                <Col sm={12} className="mb-3">
                                    <Table striped bordered hover className="w-100">
                                        <thead>
                                            <tr>
                                                <th>ID</th>
                                                <th>Ngày</th>
                                                <th>Trạng Thái</th>
                                                <th>Tổng Giá</th>
                                                <th>Tổng Tiền</th>
                                                <th>Giảm Giá</th>
                                                <th>Chi tiết</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                orders?.filter((order) => orderStatusMapping[order.status] === status).reverse()
                                                    .map((order) => (
                                                        <tr key={order.id}>
                                                            <td>{order.id}</td>
                                                            <td>{order.date}</td>
                                                            <td>{orderStatusMapping[order.status]}</td>
                                                            <td>{order.subtotal.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</td>
                                                            <td>{order.total.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</td>
                                                            <td>{order.discount ? order.discount.percentNumber.toLocaleString() + '%' : '0%'}</td>
                                                            <td>
                                                                <FcViewDetails size={24} cursor='pointer'
                                                                    onClick={() => handleShowModal(order)} />
                                                            </td>
                                                        </tr>
                                                    ))
                                            }
                                        </tbody>
                                    </Table>
                                </Col>
                            </Row>
                        </Tab>
                    ))
                }
            </Tabs>

            <Modal show={showModal} onHide={handleCloseModal} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title className='ms-2'>Chi tiết đơn hàng ({orderStatusMapping[order.status]}) </Modal.Title>
                </Modal.Header>
                <Row className="my-2 mx-4">
                    <Col md={6}>
                        <h6 className="text-muted">Thông tin khách hàng</h6>
                        <ul className="list-unstyled">
                            <li><b>Họ tên:</b> {user?.fullName}</li>
                            <li><b>Email:</b> {user?.email}</li>
                            <li><b>SDT: </b>{user?.phoneNumber}</li>
                        </ul>
                    </Col>
                    <Col md={6}>
                        <h6 className="text-muted">Địa chỉ giao hàng</h6>
                        <ul className="list-unstyled">
                            <li>{address?.province} {address?.district} {address?.ward}</li>
                        </ul>
                    </Col>
                </Row>
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
                    {
                        order.status == 'PENDING' &&
                        <Button variant="danger" onClick={() => cancelOrder(order.id)}>
                            Huỷ đơn
                        </Button>
                    }
                    {
                        order.status != 'DELIVERED' &&
                        <Button variant="success" onClick={() => updateStatusOrder(order)}>
                            Đồng ý
                        </Button>
                    }
                </Modal.Footer>
            </Modal>
        </Container >
    );
};

export default Discount;
