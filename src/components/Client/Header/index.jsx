import { useEffect, useState } from 'react';
import { Badge, Button, Container, Form, Nav, Navbar, NavDropdown } from 'react-bootstrap';
import './style.css';
import { MdFileDownloadDone } from 'react-icons/md';
import toast, { Toaster } from 'react-hot-toast';
import { Link } from 'react-router-dom';
import request from '../../../config/apiConfig';

const initialCartItems = JSON.parse(localStorage.getItem('tempCartItem')) || [];

const Header = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [filteredSuggestions, setFilteredSuggestions] = useState([]);
    const [dishes, setDishes] = useState([]);
    const [cartItems, setCartItems] = useState(initialCartItems);

    useEffect(() => {
        fetchDataDishes();
    }, []);

    const fetchDataDishes = async () => {
        try {
            const res = await request({ path: 'dishes' });
            setDishes(res.data);
        } catch (error) {
            alert(error)
        }
    };

    const calculateTotal = () => {
        return cartItems.reduce((total, item) => total + item.price * item.quantity, 0).toLocaleString('vi-VN');
    };

    const handleInputChange = (event) => {
        const value = event.target.value;
        setSearchTerm(value);

        if (value) {
            const filtered = dishes.filter(dish =>
                dish.name.toLowerCase().includes(value.toLowerCase())
            );
            setFilteredSuggestions(filtered);
        } else {
            setFilteredSuggestions([]);
        }
    };

    const handleSuggestionClick = (suggestion) => {
        setSearchTerm(suggestion.name);
        setFilteredSuggestions([]);
    };

    const handleAddToCart = (item) => {
        const token = localStorage.getItem('token');
        if (!token) {
            const existingItemIndex = cartItems.findIndex(cartItem => cartItem.name === item.name);
            let updatedCartItems;

            if (existingItemIndex !== -1) {
                updatedCartItems = [...cartItems];
                updatedCartItems[existingItemIndex].quantity += 1;
            } else {
                updatedCartItems = [...cartItems, { ...item, quantity: 1 }];
            }

            localStorage.setItem('tempCartItem', JSON.stringify(updatedCartItems));
            setCartItems(updatedCartItems);
        } else {
            console.log(token);
        }
        toast.success(`Thêm ${item.name} vào giỏ hàng thành công.`);
        setTimeout(() => { window.location.reload(); }, 500);
    };

    const handleRemoveItem = (index) => {
        const currentCartItems = JSON.parse(localStorage.getItem('tempCartItem')) || [];
        const removedItem = currentCartItems[index];
        const updatedCartItems = currentCartItems.filter((_, i) => i !== index);

        localStorage.setItem('tempCartItem', JSON.stringify(updatedCartItems));
        setCartItems(updatedCartItems);
        toast.success(`Đã xóa ${removedItem.name} khỏi giỏ hàng.`);
    };

    const handleQuantityChange = (item, newQuantity) => {
        const existingItemIndex = cartItems.findIndex(cartItem => cartItem.name === item.name);
        let updatedCartItems;
        if (existingItemIndex !== -1) {
            updatedCartItems = [...cartItems];
            updatedCartItems[existingItemIndex].quantity = newQuantity;
        } else {
            updatedCartItems = [...cartItems, { ...item, quantity: 1 }];
        }

        localStorage.setItem('tempCartItem', JSON.stringify(updatedCartItems));
        setCartItems(updatedCartItems);
        toast.success(`Số lượng ${item.name} đã được cập nhật.`);
    };

    return (
        <div>
            <Toaster />
            <Navbar expand="lg" className="bg-body-tertiary border-0" style={{ background: '#f7f7f7', padding: '12px', borderBottom: '1px solid #ccc' }}>
                <Container className='d-flex flex-column'>
                    <Navbar.Toggle aria-controls="navbarScroll" />
                    <Navbar.Collapse id="navbarScroll" className="justify-content-between w-100 mb-2">
                        <Navbar.Brand href="/home">LOGO</Navbar.Brand>
                        <div className="input-header-bar d-flex flex-grow-1 mx-3 position-relative">
                            <Form.Control
                                id="search"
                                type="search"
                                placeholder="Tìm kiếm"
                                className="search-input me-2"
                                aria-label="Search"
                                value={searchTerm}
                                onChange={handleInputChange}
                            />
                            <Button variant="" className="search-button text-secondary">Tìm</Button>
                            {filteredSuggestions.length > 0 && (
                                <ul className="suggestions-list position-absolute top-100 start-0 bg-white border rounded ps-0">
                                    {filteredSuggestions.map((suggestion, index) => (
                                        <li
                                            key={index}
                                            className="suggestion-item d-flex justify-content-between align-items-center p-2"
                                            onClick={() => handleSuggestionClick(suggestion)}
                                        >
                                            <div className='d-flex align-items-center p-2'>
                                                <img src={`/assets/images/${suggestion.image}`} alt={suggestion.name} style={{ height: '70px', width: '100px' }} />
                                                <div className="suggestion-item-details ms-2">
                                                    <div className="suggestion-item-name">{suggestion.name}</div>
                                                    <div className="suggestion-item-price">{suggestion.price.toLocaleString('vi-VN')} VND</div>
                                                </div>
                                            </div>
                                            <Button
                                                variant="secondary"
                                                className="ms-4" style={{ right: '0' }}
                                                onClick={() => handleAddToCart(suggestion)}
                                            >
                                                <MdFileDownloadDone />
                                            </Button>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                        <Nav className="my-2 my-lg-0 d-flex gap-2" style={{ maxHeight: '100px' }} navbarScroll>
                            <NavDropdown title={
                                <span>
                                    <span className="cart-icon">🛒</span> Giỏ
                                    <Badge bg="success" className="ms-2">
                                        {cartItems.length}
                                    </Badge>
                                </span>
                            }>
                                {cartItems?.length === 0 ? (
                                    <div className="navbar-cart-empty text-center px-2">Không có món ăn nào</div>
                                ) : (
                                    <div className="navbar-cart-items">
                                        {cartItems?.map((item, index) => (
                                            <div key={index} className="cart-item d-flex align-items-center p-2">
                                                <img src={`/assets/images/${item.image}`} alt={item.name} className="cart-item-image" />
                                                <div className="cart-item-details flex-grow-1 ms-2">
                                                    <div className="cart-item-name">{item.name}</div>
                                                    <div className="cart-item-info d-flex align-items-center">
                                                        <input
                                                            type="number"
                                                            min="1"
                                                            value={item.quantity}
                                                            className="cart-item-quantity"
                                                            onChange={(e) => handleQuantityChange(item, e.target.value)}
                                                        />
                                                        <span className="mx-2">x</span>
                                                        <span>{item.price.toLocaleString('vi-VN')}</span>
                                                    </div>
                                                </div>
                                                <Button
                                                    variant=""
                                                    className="cart-item-remove mt-4 mx-2"
                                                    onClick={() => handleRemoveItem(index)}
                                                >
                                                    ❌
                                                </Button>
                                            </div>
                                        ))}
                                        <div className="cart-total p-2 border-top d-flex flex-column">
                                            <span>
                                                <strong>Tổng:</strong> {calculateTotal()} VND
                                            </span>
                                            <Link to={'/cart'}
                                                className="w-100 mt-2 d-flex justify-content-center bg-primary p-2 rounded-2 text-white">
                                                Xem chi tiết
                                            </Link>
                                        </div>
                                    </div>
                                )}
                            </NavDropdown>
                        </Nav>
                    </Navbar.Collapse>
                    <Navbar style={{
                        width: '100%'
                    }}>
                        <Nav className="w-100 d-flex justify-content-between align-items-center">
                            <Nav.Item>
                                <Nav.Link href="/dish-list" style={{
                                    fontWeight: '500'
                                }}>
                                    Danh sách món ăn
                                </Nav.Link>
                            </Nav.Item>
                            <div style={{ display: 'flex' }}>
                                <Nav.Link href="/home" style={{ margin: '0 8px' }}>
                                    Trang chủ
                                </Nav.Link>
                                <Nav.Link href="/about-us" style={{ margin: '0 8px' }}>
                                    Giới thiệu
                                </Nav.Link>
                                <Nav.Link href="/news" style={{ margin: '0 8px' }}>
                                    Tin tức
                                </Nav.Link>
                                <Nav.Link href="/book-table" className="book-table-link">
                                    Đặt bàn nhanh
                                </Nav.Link>
                            </div>
                        </Nav>
                    </Navbar>
                </Container>
            </Navbar>
        </div>
    );
};

export default Header;
