import { useState } from 'react';
import { Container, Row, Col, Card, Button, Form, FormCheck } from 'react-bootstrap';
import { toast, Toaster } from 'react-hot-toast';

const sampleCartItems = [
    { id: 1, image: "https://via.placeholder.com/150?text=Dish+1", description: "Phở Bò", price: 50000, quantity: 2 },
    { id: 2, image: "https://via.placeholder.com/150?text=Dish+2", description: "Phở Gà", price: 45000, quantity: 1 },
    // Thêm nhiều món ăn khác vào đây nếu cần
];

const Cart = () => {
    const [cartItems, setCartItems] = useState(sampleCartItems);
    const [discount, setDiscount] = useState(0);

    const handleQuantityChange = (id, newQuantity) => {
        setCartItems((prevItems) =>
            prevItems.map((item) =>
                item.id === id ? { ...item, quantity: newQuantity } : item
            )
        );
    };

    const handleRemoveItem = (id) => {
        setCartItems((prevItems) => prevItems.filter((item) => item.id !== id));
        toast.success('Món đã được xóa khỏi giỏ hàng');
    };

    const calculateTotal = () => {
        return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
    };

    const calculateDiscountedTotal = () => {
        const total = calculateTotal();
        return total - (total * discount) / 100;
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
                                        <FormCheck.Input className='p-2 mx-4' />
                                        <Card.Img variant="top" src={item.image} style={{ width: '100px', margin: '12px' }} />
                                        <Card.Body className="d-flex flex-row align-items-center w-100">
                                            <Col xs={3}>
                                                <Card.Title>{item.description}</Card.Title>
                                                <Card.Text>Giá: {item.price.toLocaleString()} VND</Card.Text>
                                            </Col>
                                            <Col xs={3}>
                                                <Form.Group controlId={`formQuantity-${item.id}`} className="w-100 d-flex justify-content-end gap-4 align-items-center">
                                                    <Form.Label>Số lượng:</Form.Label>
                                                    <Form.Control
                                                        style={{ width: '50px' }}
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
                                                <Card.Text>Thành tiền: {(item.price * item.quantity).toLocaleString()} VND</Card.Text>
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
                    <div className=''>
                        <div className="">
                            <h5>Tổng tiền: {calculateDiscountedTotal().toLocaleString()} VND</h5>
                            <div className="d-flex justify-content-end mt-3">
                                <Button>Đặt món</Button>
                            </div>
                        </div>
                    </div>
                </Col>
            </Row>
        </Container>
    );
};

export default Cart;
