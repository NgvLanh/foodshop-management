import { useState, useEffect } from 'react';
import { Container, Button, Modal, Row, Col, Pagination, Stack } from 'react-bootstrap';
import { Card, CardMedia, CardContent, Typography, TextField, Box } from '@mui/material';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { Cookies } from 'react-cookie';
import request from '../../../config/apiConfig';
import { getMyInfo } from '../../../services/Auth';
import './style.css';
import { useCart } from '../../../components/Client/CartContext';

const Dishes = () => {
    const navigate = useNavigate();
    const [dishes, setDishes] = useState([]);
    const [user, setUser] = useState({});
    const [selectedDish, setSelectedDish] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedTypes, setSelectedTypes] = useState([]);
    const [quantity, setQuantity] = useState(1);
    const { updateCartDetails } = useCart();

    const itemsPerPage = 8;
    const uniqueTypes = [...new Set(dishes.map(dish => dish.category.name))];

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
            setTimeout(() => navigate('/account'), 700);
            return;
        }

        try {
            const user = await getMyInfo();
            setUser(user);
            const cart = await request({ path: `carts/${user.id}`, header: `Bearer ` });

            if (cart) {
                const existsCartDetails = await request({
                    path: `cart-details/${dish.id}/${cart.id}`,
                    header: `Bearer `
                });
                const res = await request({
                    method: existsCartDetails ? 'PUT' : 'POST',
                    path: `cart-details${existsCartDetails ? `/${dish.id}/${cart.id}` : ''}`,
                    data: existsCartDetails ? { quantity } : { quantity, dish, cart },
                    header: `Bearer `
                });
                await updateCartDetails();
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
            navigate('/account');
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

    const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

    const handleTypeClick = (type) => {
        setSelectedTypes((prevSelectedTypes) =>
            prevSelectedTypes.includes(type)
                ? prevSelectedTypes.filter((t) => t !== type)
                : [...prevSelectedTypes, type]
        );
    };

    const filteredDishes = () => {
        if (selectedTypes.length > 0) {
            return dishes.filter((dish) => selectedTypes.includes(dish.category.name));
        }
        return dishes;
    };


    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredDishes().slice(indexOfFirstItem, indexOfLastItem).reverse();
    const totalPages = Math.ceil(filteredDishes().length / itemsPerPage);

    return (
        <Container className="mt-4">
            <Row className="align-items-center mb-4">
                <Col><h2 className='text-center'>Danh sách món ăn</h2></Col>
            </Row>
            <Row>
                <Col>
                    <div className="filter-bar">
                        {uniqueTypes.map((type) => (
                            <div
                                key={type}
                                className={`filter-item ${selectedTypes.includes(type) ? 'active' : ''}`}
                                onClick={() => handleTypeClick(type)}
                            >
                                {type}
                            </div>
                        ))}
                    </div>
                </Col>
            </Row>
            <Row>
                <Col>
                    <ul className="cards">
                        {currentItems?.map(dish => (
                            <li key={dish.id}>
                                <div className="card" onClick={() => handleDishClick(dish)} >
                                    <img src={`/file/${dish.image}`} className="card__image" alt={dish.name} />
                                    <div className="card__overlay">
                                        <div className="card__header">
                                            <svg className="card__arc" xmlns="http://www.w3.org/2000/svg"><path /></svg>
                                            <img className="card__thumb" src={`/file/${dish.image}`} alt={dish.name} />
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
                            </li>
                        ))}
                    </ul>
                    <Pagination className="justify-content-center mt-4">
                        {Array.from({ length: totalPages }, (_, i) => (
                            <Pagination.Item
                                key={i + 1}
                                active={i + 1 === currentPage}
                                onClick={() => handlePageChange(i + 1)}
                            >
                                {i + 1}
                            </Pagination.Item>
                        ))}
                    </Pagination>
                </Col>
            </Row>
            {
                selectedDish && (
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
                                    image={`/file/${selectedDish.image}`}
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
                )
            }
        </Container >
    );
};

export default Dishes;
