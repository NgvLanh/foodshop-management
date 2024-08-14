import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Button, Form } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import request from '../../../config/apiConfig';
import { getMyInfo } from '../../../services/Auth';
import { BiLocationPlus, BiMinus, BiPlus, BiShoppingBag } from 'react-icons/bi';
import { FiDelete } from 'react-icons/fi';
import { Checkbox, Radio } from '@mui/material';
import ShippingModal from '../../../components/Client/ShippingModal';
import { SiElectron } from 'react-icons/si';
import { FcAddressBook, FcDeleteRow } from 'react-icons/fc';
import OrderModal from '../../../components/Client/OrderModal';
import { useCart } from '../../../components/Client/CartContext';

const Cart = () => {
    const [user, setUser] = useState();
    const [cart, setCart] = useState();
    const [addresses, setAddresses] = useState([]);
    const [address, setAddress] = useState(null);
    const [cartDetails, setCartDetails] = useState([]);
    const [showShippingModal, setShowShippingModal] = useState(false);
    const [showOrderModal, setShowOrderModal] = useState(false);
    const [shippingAddress, setShippingAddress] = useState('');
    const [discount, setDiscount] = useState();
    const [payOption, setPayOption] = useState();
    const { updateCartDetails } = useCart();

    useEffect(() => {
        fetchUser();
    }, []);

    useEffect(() => {
        if (user) {
            fetchCart();
        }
    }, [user]);

    useEffect(() => {
        if (cart) {
            fetchCartDetails();
        }
    }, [cart]);

    useEffect(() => {
        if (user) {
            fetchAddress();
        }
    }, [user]);

    useEffect(() => {
        if (addresses?.length > 0) {
            handleAddress(addresses[0].id);
        }
    }, [addresses]);

    const fetchUser = async () => {
        const res = await getMyInfo();
        setUser(res);
    };

    const fetchCart = async () => {
        const res = await request({
            path: `carts/${user.id}`,
            header: 'Bearer '
        });
        setCart(res);
    };

    const fetchCartDetails = async () => {
        const res = await request({
            path: `cart-details/carts/${cart.id}`,
            header: 'Bearer '
        });
        setCartDetails(res);
    };

    const fetchAddress = async () => {
        const res = await request({
            path: `addresses/${user.id}`,
            header: 'Bearer '
        });
        setAddresses(res.reverse());
    };

    const fetchDiscount = async () => {
        if (discount) {
            if (typeof discount === 'string') {
                try {
                    const res = await request({
                        path: `discounts/${discount}`,
                        header: 'Bearer '
                    });
                    const discountEndDate = new Date(res.dateEnd);
                    if (res) {
                        if (res.quantity == 0) {
                            toast.error('Mã giảm giá của bạn đã hết số lượng.');
                            return;
                        } else if (discountEndDate < new Date()) {
                            toast.error('Mã giảm giá của bạn đã hết hạn sử dụng.');
                            return;
                        }
                    }
                    setDiscount(res);
                } catch (error) {
                    toast.error('Mã giảm giá của bạn không hợp lệ.');
                }
            }
        }
    }

    const handleUpdateSelected = async (item) => {
        await request({
            method: 'PUT',
            path: `cart-details/update-selected/${item.id}`,
            header: 'Bearer '
        });
        fetchCartDetails();
    }

    const handleUpdateQuantity = async (item, type, value = null) => {
        if (type === 'plus') {
            item.quantity++;
        } else if (type === 'minus') {
            item.quantity--;
        } else if (type === 'input') {
            item.quantity = value ? parseInt(value, 10) : 1;
        }
        if (isNaN(item.quantity) || item.quantity < 2) {
            item.quantity = 1;
        }
        if (item.quantity > 24) {
            toast.error('Số lượng chỉ nên dưới 25');
            return;
        }
        try {
            await request({
                method: 'PUT',
                path: `cart-details/update-quantity/${item.id}`,
                data: item,
                header: 'Bearer '
            });
            await updateCartDetails();
            fetchCartDetails();
        } catch (error) {
            alert(error)
        }
    }

    const handleDelete = async (item) => {
        await request({
            method: 'DELETE',
            path: `cart-details/${item.id}`,
            header: 'Bearer '
        });
        await updateCartDetails();
        fetchCartDetails();
    }

    // Tính tổng tiền
    const getTotalPrice = () => {
        if (address) {
            return cartDetails.reduce((total, item) => total + item.dish.price * item.quantity, 0) + address.shippingFee;
        }
        return cartDetails.reduce((total, item) => total + item.dish.price * item.quantity, 0);
    }
    const getAmountPrice = () => {
        return cartDetails.reduce((total, item) => total + item.dish.price * item.quantity, 0);
    }
    // Tính tổng món
    const getTotalDish = () => {
        const itemInCart = cartDetails.reduce((total, item) => total + item.quantity, 0);
        return itemInCart;
    }

    const handleSaveShipping = async (address) => {
        const newAddress = {
            user: user,
            province: address.provinceName,
            district: address.districtName,
            ward: address.wardName,
            shippingFee: address.fee,
            isDefault: false
        };
        setShippingAddress(address);
        setShowShippingModal(false);
        try {
            const res = await request({
                method: 'POST',
                path: 'addresses',
                data: newAddress,
                header: 'Bearer '
            });
            if (res) {
                toast.success('Lưu địa chỉ thành công.')
            }
            fetchAddress();
            handleAddress(addresses[0]?.id);
            // window.location.reload();
        } catch (error) {
            alert(error)
        }
    };
    const handleAddress = (id) => {
        const selectedAddress = addresses?.find((address) => address?.id == id);
        setAddress(selectedAddress);
    };
    const setDiscountCode = (value) => {
        setDiscount(value);
    }
    const handleShowOrderModal = () => {
        fetchDiscount();
        const hasSelectedItems = cartDetails.some(c => c.isSelected);
        if (!hasSelectedItems) {
            toast.error('Vui lòng chọn sản phẩm cần mua.')
        } else if (!address) {
            toast.error('Vui lòng chọn một địa chỉ giao hàng.')
        } else if (!payOption) {
            toast.error('Vui lòng chọn một phương thức thanh toán.')
        } else {
            setShowOrderModal(true);
        }

    }
    const handleCloseOrderModal = () => setShowOrderModal(false);

    return (
        <section className="h-100 h-custom" style={{ backgroundColor: 'burlywood' }}>
            <Container className="py-5 h-100" >
                <Row className="d-flex justify-content-center align-items-center h-100">
                    <Col md={12}>
                        <Card className="card-registration card-registration-2" style={{ borderRadius: '15px' }}>
                            <Card.Body className="p-0">
                                <Row className="g-0">
                                    <Col lg={8}>
                                        <div className="p-5">
                                            <div className="d-flex justify-content-between align-items-center mb-5">
                                                <h1 className="fw-bold mb-0">Giỏ Hàng</h1>
                                                <h6 className="mb-0 text-muted">{cartDetails?.length > 0 ?
                                                    <span> {cartDetails.length} món </span>
                                                    : <i> Giỏ hàng trống </i>
                                                }
                                                </h6>
                                            </div>
                                            <hr className="my-4" />
                                            {cartDetails?.map((item, index) => (
                                                <Row className="mb-4 d-flex align-items-center" key={index}>
                                                    <Col md={1} className='p-0'>
                                                        <Checkbox checked={item.isSelected}
                                                            onClick={() => handleUpdateSelected(item)} />
                                                    </Col>
                                                    <Col md={2} className='p-0'>
                                                        <img
                                                            src={`/file/${item.dish.image}`}
                                                            className="img-fluid rounded-3"
                                                            alt={`${item.dish.name}`}
                                                        />
                                                    </Col>
                                                    <Col md={3} className='p-0 ps-4'>
                                                        <h6 className="text-muted mb-0">
                                                            {item.dish.name}
                                                        </h6>
                                                        <h6 className="mb-0">
                                                            {item.dish.category?.name}
                                                        </h6>
                                                    </Col>
                                                    <Col md={3} className="d-flex align-items-center p-0">
                                                        <Button variant="link" className="px-2"
                                                            onClick={() => handleUpdateQuantity(item, 'plus')}>
                                                            <BiPlus color='black' />
                                                        </Button>
                                                        <Form.Control
                                                            type="text"
                                                            className='text-center'
                                                            min="0"
                                                            value={item.quantity}
                                                            style={{ width: '50px' }}
                                                            onChange={(e) => handleUpdateQuantity(item, 'input', e.target.value)}
                                                        />
                                                        <Button variant="link" className="px-2"
                                                            onClick={() => handleUpdateQuantity(item, 'minus')}>
                                                            <BiMinus color='black' />
                                                        </Button>
                                                    </Col>
                                                    <Col md={2} className="p-0">
                                                        <h6 className="mb-0">
                                                            {item?.dish.price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
                                                        </h6>
                                                    </Col>
                                                    <Col md={1} className="text-end p-0">
                                                        <FiDelete size={24} color='red' cursor='pointer'
                                                            onClick={() => handleDelete(item)} />
                                                    </Col>
                                                </Row>
                                            ))}

                                            <hr className="my-4" />

                                            <div className="pt-5">
                                                <h6 className="mb-0">
                                                    <a href="/home" className="text-body d-flex align-items-center"
                                                        style={{ gap: '8px' }}>
                                                        Mua thêm
                                                        <BiShoppingBag />
                                                    </a>
                                                </h6>
                                            </div>
                                        </div>
                                    </Col>
                                    <Col lg={4} className="bg-body-tertiary" style={{ borderRadius: '15px' }}>
                                        <div className="p-5">
                                            <h3 className="fw-bold mb-5 mt-2 pt-1">Thông tin</h3>
                                            <hr className="my-4" />

                                            <div className="d-flex justify-content-between mb-4">
                                                <h5 className="text-uppercase">Tổng số món</h5>
                                                <h5>{getTotalDish().toString()}</h5>
                                            </div>

                                            <div className="d-flex justify-content-between mb-4">
                                                <h5 className="text-uppercase">Tổng Giá</h5>
                                                <h5>{getAmountPrice().toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</h5>
                                            </div>

                                            <h5 className="text-uppercase mb-3 d-flex align-item-center">
                                                Vận Chuyển &nbsp;
                                                <BiLocationPlus size={24} color='green'
                                                    cursor='pointer'
                                                    onClick={() => setShowShippingModal(true)} />
                                            </h5>
                                            <Form.Group>
                                                <Form.Select onChange={(e) => handleAddress(e.target.value)}>
                                                    {
                                                        addresses?.map((address) => (
                                                            <option value={address.id} key={address.id}>
                                                                Tỉnh {address.province}, &nbsp;
                                                                {address.district}, &nbsp;
                                                                {address.ward}
                                                            </option>
                                                        ))

                                                    }
                                                </Form.Select>
                                                <Form.Text style={{ cursor: 'pointer', display: 'block', marginTop: '8px' }}>
                                                    Phí giao hàng: &nbsp;
                                                    {address?.shippingFee?.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
                                                </Form.Text>
                                            </Form.Group>
                                            <h5 className="text-uppercase mt-4">Mã Giảm Giá</h5>
                                            <div className="mb-4">
                                                <Form.Group controlId="form3Examplea2">
                                                    <Form.Control type="text"
                                                        onChange={(e) => setDiscountCode(e.target.value)}
                                                        placeholder="Nhập mã của bạn" />
                                                </Form.Group>
                                            </div>
                                            <h5 className="text-uppercase">Phương thức thanh toán</h5>
                                            <div className="mb-5">
                                                <Form.Group controlId="form3Examplea2">
                                                    <Form.Group className='d-flex align-items-center'>
                                                        <Form.Check
                                                            onChange={(e) => setPayOption(e.target.value)}
                                                            value='onl'
                                                            type='radio'
                                                            id='onl'
                                                            name='pay-method'
                                                            label='Thanh toán trực tuyến'
                                                            style={{ cursor: 'pointer', userSelect: 'none', margin: '0' }}
                                                        />
                                                    </Form.Group>
                                                    <Form.Group className='d-flex align-items-center'>
                                                        <Form.Check
                                                            onChange={(e) => setPayOption(e.target.value)}
                                                            value='off'
                                                            type='radio'
                                                            id='off'
                                                            name='pay-method'
                                                            label='Thanh toán khi nhận hàng'
                                                            style={{ cursor: 'pointer', userSelect: 'none', margin: '0' }}
                                                        />
                                                    </Form.Group>
                                                </Form.Group>
                                            </div>
                                            <hr className="my-2" />
                                            {cartDetails.length > 0 &&
                                                <div>
                                                    <div className="d-flex justify-content-between mb-5">
                                                        <h5 className="text-uppercase">Tổng Tiền</h5>
                                                        <h5>{getTotalPrice().toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</h5>
                                                    </div>

                                                    <Button variant="dark" size="lg" block
                                                        onClick={handleShowOrderModal}>
                                                        Kiểm tra
                                                    </Button>
                                                </div>
                                            }
                                        </div>
                                    </Col>
                                </Row>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>

            {/* MODAL */}
            <ShippingModal
                show={showShippingModal}
                handleClose={() => setShowShippingModal(false)}
                handleSave={handleSaveShipping}
            />
            <OrderModal
                show={showOrderModal}
                handleClose={handleCloseOrderModal}
                cartDetails={cartDetails}
                totalPrice={getAmountPrice()}
                address={address}
                user={user}
                discount={JSON.stringify(discount)}
                method={payOption}
            />
        </section >
    );
};

export default Cart;
