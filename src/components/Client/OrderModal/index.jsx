import { useEffect, useState } from 'react';
import { Modal, Button, Table, Row, Col, Badge } from 'react-bootstrap';
import request from '../../../config/apiConfig';
import toast from 'react-hot-toast';

const OrderModal = ({ show, handleClose, cartDetails, totalPrice, address, discount = null, user, method }) => {

    const shippingFee = address?.shippingFee || 0;
    const discountObj = JSON.parse(discount) || {};
    const percent = (discountObj.percentNumber || 0) / 100;
    const discountAmount = totalPrice * percent;
    const isDiscountApplicable = totalPrice >= discountObj.quota;
    const totalWithShippingAndDiscount = totalPrice + shippingFee - (isDiscountApplicable ? discountAmount : 0);
    const cart = cartDetails.filter((c) => c.isSelected === true);

    const createOrder = async (totalPrice, totalWithShippingAndDiscount, address, discount) => {
        try {
            const res = await request({
                method: 'POST',
                path: 'orders',
                header: 'Bearer ',
                data: {
                    subtotal: totalPrice,
                    total: totalWithShippingAndDiscount,
                    address: address,
                    discount: discount
                }
            })
            if (res) {
                createOrderDetails(res);
                await request({
                    method: 'POST',
                    path: 'invoices',
                    header: 'Bearer ',
                    data: {
                        amount: 0,
                        paymentMethod: 'OFFLINE',
                        order: res
                    }
                })
            }
        } catch (error) {
            alert(error)
        }
    }
    const createOrderDetails = async (order) => {
        cart.forEach(async (e) => {
            try {
                const res = await request({
                    method: 'POST',
                    path: 'order-details',
                    data: {
                        price: e.dish.price,
                        quantity: e.quantity,
                        dish: e.dish,
                        order: order
                    },
                    header: 'Bearer '
                })
            } catch (error) {
                alert(error);
                return;
            }
        });

        cart.forEach(async (c) => {
            try {
                const res = await request({
                    method: 'DELETE',
                    path: `cart-details/${c.id}`,
                    header: 'Bearer '
                })
            } catch (error) {
                alert(error);
                return;
            }
        })
        toast.success('Đặt hàng thành công.');
        setTimeout(() => {
            window.location.reload();
        }, 700);
    }

    const handleOrder = async (totalPrice, totalWithShippingAndDiscount, address, discount, method) => {
        if (method === 'off') {
            createOrder(totalPrice, totalWithShippingAndDiscount, address, discount);
        } else {
            // toast.error('Phương thức này chưa hỗ trợ');
            const res = await request({
                method: 'POST',
                path: '/api/v1/vnpay/create-order',
                data: {
                    total: totalWithShippingAndDiscount,
                    orderInfo: "Thanh toán hoá đơn",
                    returnUrl: "http://localhost:8080/api/v1/vnpay/order-return"
                },
                header: 'Bearer '
            });
            if (res) {
                window.location.href = res.paymentUrl;
                try {
                    const res = await request({
                        method: 'POST',
                        path: 'orders',
                        header: 'Bearer ',
                        data: {
                            subtotal: totalPrice,
                            total: totalWithShippingAndDiscount,
                            address: address,
                            discount: discount
                        }
                    })
                    if (res) {
                        createOrderDetails(res);
                        const py = await request({
                            method: 'POST',
                            path: 'invoices',
                            header: 'Bearer ',
                            data: {
                                amount: totalWithShippingAndDiscount,
                                paymentMethod: 'ONLINE',
                                order: res
                            }
                        })
                    }
                } catch (error) {
                    alert(error)
                }
            }
        }
        handleClose();
    }

    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton style={{ backgroundColor: '#f7f1e3', borderBottom: '2px solid #e77f67' }}>
                <Modal.Title className="text-uppercase" style={{ color: '#e77f67', fontWeight: 'bold' }}>Hóa Đơn</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Row className="mb-3">
                    <Col className="text-muted">
                        Ngày: {new Date().toLocaleDateString()}
                    </Col>
                </Row>
                <Row className="mb-4">
                    <Col md={6}>
                        <h6 className="text-muted">Thông tin của bạn</h6>
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
                <hr />
                <Table borderless hover style={{ backgroundColor: '#fff4e6' }}>
                    <thead className="table-light">
                        <tr>
                            <th className="text-start">Món ăn</th>
                            <th>Số lượng</th>
                            <th>Giá tiền</th>
                            <th className="text-end">Tổng</th>
                        </tr>
                    </thead>
                    <tbody>
                        {cart?.map((item, index) => (
                            <tr key={index}>
                                <td className="text-start">{item.dish.name}</td>
                                <td>
                                    x{item.quantity}
                                </td>
                                <td>{item.dish.price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</td>
                                <td className="text-end">{(item.dish.price * item.quantity).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
                <Table borderless hover>
                    <tbody>
                        <tr>
                            <td className="text-start">Phí vận chuyển</td>
                            <td className="text-end">
                                {shippingFee.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
                            </td>
                        </tr>
                        <tr>
                            <td className="text-start">Giảm giá ({JSON.parse(discount)?.percentNumber}%)</td>
                            <td className="text-end">
                                - {discountAmount?.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
                            </td>
                        </tr>
                        {
                            totalPrice < JSON.parse(discount)?.quota &&
                            <tr>
                                <td className="text-start">Hạn mức</td>
                                <td className="text-end text-danger">
                                    Chỉ áp dụng hoá đơn trên {JSON.parse(discount)?.quota.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
                                </td>
                            </tr>
                        }
                        <tr>
                            <td className="text-start"><strong>Tổng cộng</strong></td>
                            <td className="text-end">
                                <strong>{totalWithShippingAndDiscount.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</strong>
                            </td>
                        </tr>
                    </tbody>
                </Table>
                <hr />
                <div className="text-center mt-3">
                    <img src={`/assets/images/logo.png`} alt="logo" height='100px' />
                    <h6 className="text-uppercase" style={{ fontWeight: 'bold' }}>Cửa hàng của chúng tôi</h6>
                    <p className='mb-2'>Email: halatpfoods@gmail.com</p>
                    <p className='mb-2'>Số điện thoại: 0385420077</p>
                    <p>Địa chỉ: 63/2 Trần Hưng Đạo, Lê Bình, Cái Răng, Cần Thơ</p>
                </div>
            </Modal.Body>
            <Modal.Footer style={{ backgroundColor: '#f7f1e3', borderTop: '2px solid #e77f67' }}>
                <Button variant="success" onClick={() => handleOrder(totalPrice,
                    totalWithShippingAndDiscount, address, JSON.parse(discount), method)}>Đặt Hàng Ngay</Button>
            </Modal.Footer>
        </Modal>
    );
};

export default OrderModal;
