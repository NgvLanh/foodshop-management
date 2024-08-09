import { useState, useEffect } from 'react';
import { Container, Button, Modal, Form, Row, Col, Pagination } from 'react-bootstrap';
import { Card, CardMedia, CardContent, CardActions, Typography, TextField, Box } from '@mui/material';
import { FaShoppingCart } from 'react-icons/fa'; // Import icon for cart
import toast from "react-hot-toast";
import request from "../../../config/apiConfig";
import './style.css';
import { useNavigate } from 'react-router-dom';
import { BiCartAdd, BiCartAlt } from 'react-icons/bi';
import { getMyInfo } from '../../../services/Auth';

const Dishes = () => {
    const navigate = useNavigate();
    const [dishes, setDishes] = useState([]);
    const [user, setUser] = useState({});
    const uniqueTypes = [...new Set(dishes?.map(dish => dish.category.name))]; // Get unique types of dishes

    const [selectedDish, setSelectedDish] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 8; // Số món ăn trên mỗi trang
    const [selectedTypes, setSelectedTypes] = useState([]); // Add state for selected types
    const [quantity, setQuantity] = useState(1);

    useEffect(() => {
        fetchDishes();
        fetchUserInfo();
    }, []);

    const fetchDishes = async () => {
        try {
            const res = await request({ path: 'dishes/status-true' });
            setDishes(res);
        } catch (error) {
            console.error('Error fetching dishes:', error);
        }
    };

    const fetchUserInfo = async () => {
        try {
            const res = await getMyInfo();
            console.log(res);
            setUser(res);
        } catch (error) {
            navigate('/account');
            console.error('Error fetching info:', error);
        }
    }
    const fetchCart = async (userId) => {
        // try {
        //     const res_cart = await request({ path: `carts/customers/${userId}` });
        //     return res_cart.data;
        // } catch (error) {
        //     console.error('Error fetching cart:', error);
        //     return null;
        // }
    };

    const fetchCartItems = async (cartId) => {
        // try {
        //     const res_cart_items = await request({ path: `cart-items/cart/${cartId}` });
        //     return res_cart_items.data || [];
        // } catch (error) {
        //     console.error('Error fetching cart items:', error);
        //     return [];
        // }
    };

    const addToCart = async (dish, quantity) => {
        try {
            const res = await request({ path: `carts/${user.id}`, header: 'Bearer ' });
            console.log(res);
        } catch (error) {
            alert(error)
        }
    };

    const handleDishClick = (dish) => {
        setSelectedDish(dish);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedDish(null);
        setQuantity(1); // Reset số lượng khi đóng modal
    };

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const handleTypeClick = (type) => { // Handle type click
        setSelectedTypes((prevSelectedTypes) =>
            prevSelectedTypes.includes(type)
                ? prevSelectedTypes.filter((t) => t !== type)
                : [...prevSelectedTypes, type]
        );
    };

    const filteredDishes = () => {
        let filtered = dishes;
        if (selectedTypes.length > 0) { // Apply type filtering
            filtered = filtered.filter((dish) => selectedTypes.includes(dish.category.name));
        }
        return filtered;
    };

    // Pagination logic
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredDishes().slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredDishes().length / itemsPerPage);


    return (
        <Container className="mt-4">
            <Row className="align-items-center mb-4">
                <Col>
                    <h2>Danh sách món ăn</h2>
                </Col>
            </Row>
            <Row>
                <Col>
                    <div className="filter-bar">
                        {uniqueTypes?.map((type) => (
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
                    <Row>
                        {filteredDishes()?.map(dish => (
                            <Col key={dish.id} xs={12} sm={6} md={4} lg={3} className="mb-3">
                                <Card sx={{ maxWidth: 345, marginBottom: 2, boxShadow: 3 }}
                                    onClick={() => handleDishClick(dish)}>
                                    <CardMedia
                                        component="img"
                                        alt={dish.name}
                                        height="170"
                                        image={`/assets/images/${dish.image}`}
                                        sx={{ borderRadius: 1 }}
                                    />
                                    <CardContent>
                                        <Typography gutterBottom variant="h5" component="div">
                                            {dish.name}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary" sx={{ maxHeight: '50px', overflow: 'hidden' }}>
                                            {dish.description}
                                        </Typography>
                                        <Typography variant="body2" color="text.primary" sx={{ marginTop: 1 }}>
                                            Giá: {dish.price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
                                        </Typography>
                                        <Box display="flex" alignItems="center" justifyContent="space-between">
                                            <Typography variant="body2" color="text.secondary">
                                                Trạng thái
                                            </Typography>
                                            <Typography
                                                variant="body2"
                                                align="left"
                                                sx={{
                                                    color: dish.status ? 'green' : 'red',
                                                    fontWeight: 'bold',
                                                }}
                                            >
                                                {dish.status ? 'Còn món' : 'Hết món'}
                                            </Typography>
                                        </Box>
                                    </CardContent>
                                </Card>
                            </Col>
                        ))}
                    </Row>

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
            </Row >

            {/* Modal for dish details */}
            {
                selectedDish && (
                    <Modal show={showModal} onHide={handleCloseModal}>
                        <Modal.Header closeButton>
                            <Modal.Title>Chi tiết món ăn</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <Card sx={{ maxWidth: 345, margin: '0 auto', boxShadow: 1 }}>
                                <CardMedia
                                    component="img"
                                    alt={selectedDish.description}
                                    height="150"
                                    image={`/assets/images/${selectedDish.image}`}
                                />
                                <CardContent>
                                    <Typography gutterBottom variant="h5" component="div" align="center">
                                        {selectedDish.name}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" align="center" sx={{ maxHeight: '50px' }}>
                                        {selectedDish.description}
                                    </Typography>
                                    <Typography variant="h6" color="text.primary" align="center" sx={{ marginTop: 2 }}>
                                        Giá: {selectedDish.price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" align="center">
                                        Trạng thái: {selectedDish.status ? 'Còn món' : 'Hết món'}
                                    </Typography>
                                    <Form.Group controlId="formQuantity" className='d-flex justify-content-center align-items-center mt-3'>
                                        <TextField
                                            label="Số lượng"
                                            type="number"
                                            inputProps={{ min: "1" }}
                                            variant="outlined"
                                            size="small"
                                            value={quantity}
                                            onChange={(e) => setQuantity(Number(e.target.value))}
                                            sx={{ width: '25%', marginTop: 2 }}
                                        />
                                    </Form.Group>
                                </CardContent>
                            </Card>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={handleCloseModal}>
                                Đóng
                            </Button>
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
