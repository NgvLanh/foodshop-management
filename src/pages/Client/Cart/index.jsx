import { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Form } from 'react-bootstrap';
import { toast, Toaster } from 'react-hot-toast';
import request from '../../../config/apiConfig';
import { useNavigate } from 'react-router-dom';

const Cart = () => {
    const [cartItems, setCartItems] = useState([]);
    const [discount, setDiscount] = useState(0);
    const [reservations, setReservations] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetchCartItems();
        fetchReservations(); // Fetch reservations when the component mounts
    }, []);

    const fetchCartItems = async () => {
        const user = JSON.parse(localStorage.getItem('user'));
        if (!user) {
            toast.error('Bạn cần đăng nhập để xem giỏ hàng.');
            setTimeout(() => navigate('/account'), 700);
            return;
        }

        try {
            const cartRes = await request({ path: `carts/customers/${user.id}` });
            const cartItemsRes = await request({ path: `cart-items/cart/${cartRes.data.id}` });
            setCartItems(cartItemsRes.data || []);
        } catch (error) {
            console.error('Error fetching cart items:', error);
        }
    };

    const fetchReservations = async () => {
        const user = JSON.parse(localStorage.getItem('user'));
        if (!user) return;

        try {
            const res = await request({ path: 'reservations' });
            setReservations(res.data);
        } catch (error) {
            console.error('Error fetching reservations:', error);
        }
    };

    const handleQuantityChange = async (id, newQuantity) => {
        try {
            const item = cartItems.find((item) => item.id === id);
            await request({
                method: 'PUT',
                path: `cart-items/${id}`,
                data: { ...item, quantity: newQuantity }
            });
            setCartItems((prevItems) =>
                prevItems.map((item) =>
                    item.id === id ? { ...item, quantity: newQuantity } : item
                )
            );
        } catch (error) {
            console.error('Error updating cart item quantity:', error);
        }
    };

    const handleRemoveItem = async (id) => {
        try {
            await request({ method: 'DELETE', path: `cart-items/${id}` });
            setCartItems((prevItems) => prevItems.filter((item) => item.id !== id));
            toast.success('Món đã được xóa khỏi giỏ hàng');
        } catch (error) {
            console.error('Error removing cart item:', error);
        }
    };

    const calculateTotal = () => {
        return cartItems.reduce((total, item) => total + item.dish.price * item.quantity, 0);
    };

    const calculateDiscountedTotal = () => {
        const total = calculateTotal();
        return total - (total * discount) / 100;
    };

    const handleCook = async () => {
        // const user = JSON.parse(localStorage.getItem('user'));
        // if (!user) {
        //     toast.error('Bạn cần đăng nhập để xác nhận bàn.');
        //     setTimeout(() => navigate('/account'), 700);
        //     return;
        // }

        // try {
        //     const reservation = reservations.find(res => res.customer.id === user.id && !res.status);
        //     if (reservation) {
        //         toast.error('Nhân viên chưa xác nhận bàn cho bạn.');
        //     } else {
        //         toast.success('Bàn của bạn đã được xác nhận.');
        //     }
        // } catch (error) {
        //     console.error('Error checking reservation status:', error);
        // }
    };

    return (
        <Container className="mt-4 py-4">
            <Toaster />
            <h2 className="mb-4">Giỏ hàng của bạn</h2>
            <Row>
                <Col xs={12}>
                    {cartItems.length === 0 ? (
                        <p>Giỏ hàng của bạn trống.</p>
                    ) : (
                        cartItems.map((item) => (
                            <Row key={item.id} className="mb-3 align-items-center">
                                <Col xs={12}>
                                    <Card className="cart-item-card d-flex flex-row align-items-center">
                                        <Card.Img src={`assets/images/${item.dish.image}`} style={{ width: '180px', margin: '12px' }} />
                                        <Card.Body className="d-flex flex-row align-items-center w-100">
                                            <Col xs={3}>
                                                <Card.Title>{item.dish.name}</Card.Title>
                                                <Card.Text>Giá: {item.dish.price.toLocaleString()} VND</Card.Text>
                                            </Col>
                                            <Col xs={3}>
                                                <Form.Group controlId={`formQuantity-${item.id}`} className="w-100 d-flex justify-content-end gap-4 align-items-center">
                                                    <Form.Label>Số lượng:</Form.Label>
                                                    <Form.Control
                                                        style={{ width: '70px' }}
                                                        type="number"
                                                        min="1"
                                                        value={item.quantity}
                                                        onChange={(e) =>
                                                            handleQuantityChange(item.id, Number(e.target.value))
                                                        }
                                                    />
                                                </Form.Group>
                                            </Col>
                                            <Col xs={3} className='d-flex justify-content-end'>
                                                <Card.Text>Thành tiền: {(item.dish.price * item.quantity).toLocaleString()} VND</Card.Text>
                                            </Col>
                                            <Col xs={3} className='d-flex justify-content-end'>
                                                <Button
                                                    variant="danger"
                                                    onClick={() => handleRemoveItem(item.id)}
                                                >
                                                    Xóa
                                                </Button>
                                            </Col>
                                        </Card.Body>
                                    </Card>
                                </Col>
                            </Row>
                        ))
                    )}
                </Col>
                <Col xs={12} className='d-flex justify-content-end'>
                    <div>
                        <h5>Tổng tiền: {calculateDiscountedTotal().toLocaleString()} VND</h5>
                        <div className="d-flex justify-content-end mt-3">
                            <Button onClick={handleCook}>Nấu</Button>
                        </div>
                    </div>
                </Col>
            </Row>
        </Container>
    );
};

export default Cart;
