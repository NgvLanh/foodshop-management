import { useState, useEffect } from 'react';
import { Container, Button, Modal, Row, Col } from 'react-bootstrap';
import { Card, CardMedia, CardContent, Typography, TextField, Box } from '@mui/material';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { Cookies } from 'react-cookie';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/effect-coverflow';
import './style.css';
import request from '../../../config/apiConfig';
import { getMyInfo } from '../../../services/Auth';

const Dishes = () => {
    const navigate = useNavigate();
    const [dishes, setDishes] = useState([]);
    const [user, setUser] = useState({});
    const [selectedDish, setSelectedDish] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [quantity, setQuantity] = useState(1);

    useEffect(() => {
        fetchDishes();
    }, []);

    const fetchDishes = async () => {
        try {
            const res = await request({ path: 'dishes/status-true' });
            setDishes(res);
        } catch (error) {
            console.error('Error fetching dishes:', error);
        }
    };

    const addToCart = async (dish, quantity) => {
        const cookie = new Cookies();
        const token = cookie.get('token');

        if (!token) {
            toast.error('Vui lòng đăng nhập để tiếp tục.');
            // setTimeout(() => navigate('/account'), 700);
            return;
        }
        if (quantity > 25) {
            toast.error('Số lượng món chỉ  hoặc bằng 25 trong 1 lần đặt.');
            setQuantity(25);
            return;
        }
        try {
            const user = await getMyInfo();
            setUser(user);

            const cart = await request({
                path: `carts/${user.id}`,
                header: `Bearer `
            });

            if (cart) {
                const existsCartDetails = await request({
                    path: `cart-details/${dish.id}`,
                    header: `Bearer `
                });
                await request({
                    method: existsCartDetails ? 'PUT' : 'POST',
                    path: `cart-details${existsCartDetails ? `/${dish.id}` : ''}`,
                    data: existsCartDetails ? { quantity } : { quantity, dish, cart },
                    header: `Bearer `
                });

                toast.success(`Đã thêm ${dish.name} vào giỏ hàng.`);
                setShowModal(false);
            } else {
                await request({
                    method: 'POST',
                    path: 'carts',
                    data: { user },
                    header: `Bearer `
                });
            }
        } catch (error) {
            console.error('Error adding to cart:', error);
        }
    };

    const handleDishClick = (dish) => {
        setSelectedDish(dish);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedDish(null);
        setQuantity(1);
    };

    return (
        <Container className="mt-4">
            <Row className="align-items-center mb-4">
                <Col><h2>Danh sách món ăn</h2></Col>
            </Row>
            <Row className="align-items-center pb-4">
                <Col>
                    <Swiper
                        spaceBetween={20}
                        slidesPerView={4}
                        coverflowEffect={{
                            rotate: 50,
                            stretch: 0,
                            depth: 100,
                            modifier: 1,
                            slideShadows: true,
                        }}
                        className='cart'
                    >
                        {dishes?.map(dish => (
                            <SwiperSlide key={dish.id} style={{ border: 'solid 1px lightgray', borderRadius: '16px' }}
                                className="card">
                                <div onClick={() => handleDishClick(dish)} >
                                    <img src={`/assets/images/${dish.image}`} className="card__image" alt={dish.name} />
                                    <div className="card__overlay">
                                        <div className="card__header">
                                            <svg className="card__arc" xmlns="http://www.w3.org/2000/svg"><path /></svg>
                                            <img className="card__thumb" src={`/assets/images/${dish.image}`} alt={dish.name} />
                                            <div className="card__header-text">
                                                <h3 className="card__title">{dish.name} </h3>
                                                <span className="card__status">
                                                    Giá bán: {dish.price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</span>
                                            </div>
                                        </div>
                                        <p className="card__description">
                                            {dish.description}
                                        </p>
                                    </div>
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </Col>
            </Row>

            {selectedDish && (
                <Modal show={showModal} onHide={handleCloseModal}>
                    <Modal.Header closeButton>
                        <Modal.Title>Chi tiết món ăn</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Card sx={{ maxWidth: 345, margin: '0 auto', boxShadow: 3 }}>
                            <CardMedia
                                component="img"
                                alt={selectedDish.name}
                                height="234"
                                image={`/assets/images/${selectedDish.image}`}
                            />
                            <CardContent>
                                <Typography gutterBottom variant="h5" align="center">{selectedDish.name}</Typography>
                                <Typography variant="body2" color="text.secondary" align="center">{selectedDish.description}</Typography>
                                <Typography variant="h6" color="text.primary" align="center" sx={{ marginTop: 2 }}>
                                    Giá: {selectedDish.price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
                                </Typography>
                                <Typography variant="body2" color="text.secondary" align="center" marginBottom={2}>
                                    Trạng thái: {selectedDish.status ? 'Còn món' : 'Hết món'}
                                </Typography>
                                <TextField
                                    label="Số lượng"
                                    type="number"
                                    inputProps={{ min: 1 }}
                                    variant="outlined"
                                    size="small"
                                    value={quantity}
                                    onChange={(e) => setQuantity(Number(e.target.value))}
                                    sx={{ width: '25%', marginTop: 2, margin: '0 auto', display: 'block' }}
                                />
                            </CardContent>
                        </Card>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleCloseModal}>Đóng</Button>
                        <Button variant="primary" onClick={() => addToCart(selectedDish, quantity)} disabled={!quantity}>
                            Thêm món
                        </Button>
                    </Modal.Footer>
                </Modal>
            )}
        </Container>
    );
};

export default Dishes;
