import { useEffect, useState } from 'react';
import { Badge, Button, Container, Form, Nav, Navbar, NavDropdown } from 'react-bootstrap';
import './style.css';
import { MdFileDownloadDone } from 'react-icons/md';
import toast, { Toaster } from 'react-hot-toast';
import { Link } from 'react-router-dom';
import request from '../../../config/apiConfig';

const Header = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [filteredSuggestions, setFilteredSuggestions] = useState([]);
    const [dishes, setDishes] = useState([]);
    const [cart, setCart] = useState(null);
    const [cartItems, setCartItems] = useState([]);

    const user = JSON.parse(localStorage.getItem('user'));

    useEffect(() => {
        fetchDishes();
        if (user) {
            fetchCart();
        }
    }, []);

    const fetchDishes = async () => {
        try {
            const res = await request({ path: 'dishes' });
            setDishes(res);
        } catch (error) {
            console.error('Error fetching dishes:', error);
        }
    };

    const fetchCart = async () => {
        try {
            const res_cart = await request({ path: `carts/customers/${user.id}` });
            setCart(res_cart.data);

            if (res_cart.data) {
                const res_cart_item = await request({ path: `cart-items/cart/${res_cart.data.id}` });
                setCartItems(res_cart_item.data || []);
            }
        } catch (error) {
            console.error('Error fetching cart:', error);
        }
    };

    const calculateTotal = () => {
        return cartItems.reduce((total, item) => total + item.dish.price * item.quantity, 0).toLocaleString('vi-VN');
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

    const handleAddToCart = async (item) => {
        if (!user) {
            toast.error('Bạn cần đăng nhập để thêm món vào giỏ hàng.');
            return;
        }

        try {
            // Check if the item already exists in the cart
            const existingItem = cartItems.find(cartItem => cartItem.dish.id === item.id);

            if (existingItem) {
                // Update the quantity if the item exists
                await request({
                    method: 'PUT',
                    path: `cart-items/${existingItem.id}`,
                    data: {
                        ...existingItem,
                        quantity: existingItem.quantity + 1
                    }
                });
            } else {
                // Add the item to the cart if it doesn't exist
                await request({
                    method: 'POST',
                    path: 'cart-items',
                    data: {
                        quantity: 1,
                        status: true,
                        isSelected: true,
                        dish: item,
                        cart: cart
                    }
                });
            }

            fetchCart();
            toast.success(`Thêm ${item.name} vào giỏ hàng thành công.`);
        } catch (error) {
            console.error('Error adding item to cart:', error);
            toast.error('Đã xảy ra lỗi khi thêm món vào giỏ hàng.');
        }
    };

    const handleRemoveItem = async (item) => {
        try {
            await request({
                method: 'DELETE',
                path: `cart-items/${item.id}`,
            });
            fetchCart();
            toast.success(`Đã xóa ${item.dish.name} khỏi giỏ hàng.`);
        } catch (error) {
            console.error('Error removing item from cart:', error);
            toast.error('Đã xảy ra lỗi khi xóa món khỏi giỏ hàng.');
        }
    };

    const handleQuantityChange = async (item, newQuantity) => {
        if (newQuantity < 1) {
            toast.error('Số lượng phải lớn hơn hoặc bằng 1.');
            return;
        }
        item.quantity = newQuantity;
        try {
            await request({
                method: 'PUT',
                path: `cart-items/${item.id}`,
                data: item
            });
            fetchCart();
            toast.success(`Số lượng ${item.dish.name} đã được cập nhật.`);
        } catch (error) {
            console.error('Error updating item quantity:', error);
            toast.error('Đã xảy ra lỗi khi cập nhật số lượng món.');
        }
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
                                                    <div className="suggestion-item-name">{suggestion?.name}</div>
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
                                {cartItems.length === 0 ? (
                                    <div className="navbar-cart-empty text-center px-2">Không có món ăn nào</div>
                                ) : (
                                    <div className="navbar-cart-items">
                                        {cartItems.map((item, index) => (
                                            <div key={index} className="cart-item d-flex align-items-center p-2">
                                                <img src={`/assets/images/${item.dish.image}`} alt={item.name} className="cart-item-image" />
                                                <div className="cart-item-details flex-grow-1 ms-2">
                                                    <div className="cart-item-name">{item.dish.name}</div>
                                                    <div className="cart-item-info d-flex align-items-center">
                                                        <input
                                                            type="number"
                                                            min="1"
                                                            value={item.quantity}
                                                            className="cart-item-quantity"
                                                            onChange={(e) => handleQuantityChange(item, e.target.value)}
                                                        />
                                                        <span className="mx-2">x</span>
                                                        <span>{item.dish.price.toLocaleString('vi-VN')}</span>
                                                    </div>
                                                </div>
                                                <Button
                                                    variant=""
                                                    className="cart-item-remove mt-4 mx-2"
                                                    onClick={() => handleRemoveItem(item)}
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
                    <Navbar style={{ width: '100%' }}>
                        <Nav className="w-100 d-flex justify-content-between align-items-center">
                            <Nav.Item>
                                <Nav.Link href="/dishes" style={{ fontWeight: '500' }}>
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
                                <Nav.Link href="/contact" style={{ margin: '0 8px' }}>
                                    Liên hệ
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
