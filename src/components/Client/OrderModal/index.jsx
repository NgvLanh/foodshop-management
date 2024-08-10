import { useEffect, useState } from 'react';
import { Modal, Button, Table, Row, Col, Badge } from 'react-bootstrap';

const OrderModal = ({ show, handleClose, cartDetails, totalPrice, address, discount = null, user }) => {

    const shippingFee = address?.shippingFee || 0;
    const discountObj = JSON.parse(discount) || {};
    const percent = (discountObj.percentNumber || 0) / 100;
    const discountAmount = totalPrice * percent;
    const isDiscountApplicable = totalPrice >= discountObj.quota;
    const totalWithShippingAndDiscount = totalPrice + shippingFee - (isDiscountApplicable ? discountAmount : 0);
    const cart = cartDetails.filter((c) => c.isSelected === true);


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
                    <h6 className="text-uppercase" style={{ fontWeight: 'bold' }}>Cửa hàng của chúng tôi</h6>
                    <p>Email: shop@example.com</p>
                    <p>Số điện thoại: 0123 456 789</p>
                    <p>Địa chỉ: Số 1, Đường ABC, Quận XYZ, TP. HCM</p>
                </div>
            </Modal.Body>
            <Modal.Footer style={{ backgroundColor: '#f7f1e3', borderTop: '2px solid #e77f67' }}>
                <Button variant="success">Đặt Hàng Ngay</Button>
            </Modal.Footer>
        </Modal>
    );
};

export default OrderModal;
