import { useState } from 'react';
import { Container, Card, Button, Modal, Form, Row, Col, Pagination } from 'react-bootstrap';
import './style.css';

// Sample data for dishes
const dishesData = [
    { id: 1, image: "https://via.placeholder.com/150?text=Dish+1", description: "Phở Bò", price: 50000, status: 'Còn hàng', type: 'Món Chính' },
    { id: 2, image: "https://via.placeholder.com/150?text=Dish+2", description: "Phở Gà", price: 45000, status: 'Còn hàng', type: 'Món Chính' },
    { id: 3, image: "https://via.placeholder.com/150?text=Dish+3", description: "Bún Bò Huế", price: 55000, status: 'Còn hàng', type: 'Món Chính' },
    { id: 4, image: "https://via.placeholder.com/150?text=Dish+4", description: "Bún Chả", price: 60000, status: 'Hết hàng', type: 'Món Chính' },
    { id: 5, image: "https://via.placeholder.com/150?text=Dish+5", description: "Gỏi Cuốn", price: 35000, status: 'Còn hàng', type: 'Cuốn' },
    { id: 6, image: "https://via.placeholder.com/150?text=Dish+6", description: "Chả Giò", price: 40000, status: 'Hết hàng', type: 'Cuốn' },
    // Thêm nhiều món ăn khác vào đây
];

const uniqueTypes = [...new Set(dishesData.map(dish => dish.type))]; // Get unique types of dishes

const DishList = () => {
    const [selectedDish, setSelectedDish] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 16; // Số món ăn trên mỗi trang
    const [selectedTypes, setSelectedTypes] = useState([]); // Add state for selected types
    const [quantity, setQuantity] = useState(1);

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

    const handleAddToCart = () => {
        // Handle the logic to add the dish to the cart with the specified quantity
        alert(`Đã thêm ${quantity} ${selectedDish.description} vào giỏ hàng`);
        handleCloseModal();
    };

    const filteredDishes = () => {
        let filtered = dishesData;
        if (selectedTypes.length > 0) { // Apply type filtering
            filtered = filtered.filter((dish) => selectedTypes.includes(dish.type));
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
                    <Row>
                        {currentItems.map(dish => (
                            <Col key={dish.id} xs={12} sm={6} md={4} lg={3} className="mb-3">
                                <Card className="dish-card">
                                    <Card.Img variant="top" src={dish.image} className="dish-card-img" />
                                    <Card.Body className="dish-card-body">
                                        <Card.Title>{dish.description}</Card.Title>
                                        <Card.Text>Giá: {dish.price.toLocaleString()} VND</Card.Text>
                                        <Card.Text>Trạng thái: {dish.status}</Card.Text>
                                        <Button variant="primary" onClick={() => handleDishClick(dish)}>Xem chi tiết</Button>
                                    </Card.Body>
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
            </Row>

            {/* Modal for dish details */}
            {selectedDish && (
                <Modal show={showModal} onHide={handleCloseModal}>
                    <Modal.Header closeButton>
                        <Modal.Title>Chi tiết món ăn</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div className="d-flex flex-column align-items-center">
                            <img src={selectedDish.image} alt={selectedDish.description} className="mb-3" style={{ width: '150px' }} />
                            <h5>{selectedDish.description}</h5>
                            <p>Giá: {selectedDish.price.toLocaleString()} VND</p>
                            <p>Trạng thái: {selectedDish.status}</p>
                            <Form.Group controlId="formQuantity">
                                <Form.Label>Số lượng:</Form.Label>
                                <Form.Control
                                    type="number"
                                    min="1"
                                    value={quantity}
                                    onChange={(e) => setQuantity(Number(e.target.value))}
                                />
                            </Form.Group>
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleCloseModal}>
                            Đóng
                        </Button>
                        <Button variant="primary" onClick={handleAddToCart} disabled={!quantity}>
                            Thêm món
                        </Button>
                    </Modal.Footer>
                </Modal>
            )}
        </Container>
    );
};

export default DishList;
