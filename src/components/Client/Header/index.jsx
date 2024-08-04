import { useEffect, useState } from 'react';
import { Badge, Button, Container, Form, Nav, Navbar, NavDropdown } from 'react-bootstrap';
import './style.css';
import { MdFileDownloadDone } from 'react-icons/md';
import toast, { Toaster } from 'react-hot-toast';
import { Link } from 'react-router-dom';

// Array các văn bản để đổi placeholder
const placeholderTexts = [
    "Bò nướng",
    "Bánh xèo",
    "Gà rán",
    "Cơm tấm",
    "Phở bò"
];

// Updated suggestions with image and price
const suggestions = [
    { name: "Táo", price: 30_000, image: "https://via.placeholder.com/50?text=Táo" },
    { name: "Chuối", price: 20_000, image: "https://via.placeholder.com/50?text=Chuối" },
    { name: "Cam", price: 25_000, image: "https://via.placeholder.com/50?text=Cam" },
    { name: "Xoài", price: 35_000, image: "https://via.placeholder.com/50?text=Xoài" },
    { name: "Dứa", price: 40_000, image: "https://via.placeholder.com/50?text=Dứa" },
    { name: "Dâu tây", price: 35_000, image: "https://via.placeholder.com/50?text=Dâu+tây" },
    { name: "Việt quất", price: 50_000, image: "https://via.placeholder.com/50?text=Việt+quất" },
];

// Dữ liệu giả cho giỏ hàng
const initialCartItems = [
    { name: "Táo", price: 30_000, quantity: 2, image: "https://via.placeholder.com/50?text=Táo" },
    { name: "Chuối", price: 20_000, quantity: 1, image: "https://via.placeholder.com/50?text=Chuối" },
    { name: "Cam", price: 25_000, quantity: 4, image: "https://via.placeholder.com/50?text=Cam" },
];

const Header = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [filteredSuggestions, setFilteredSuggestions] = useState([]);
    const [cartItems, setCartItems] = useState(initialCartItems); // Using sample cart data

    useEffect(() => {
        const searchInput = document.getElementById("search");
        let index = 0;

        const changePlaceholder = () => {
            searchInput.placeholder = placeholderTexts[index];
            index = (index + 1) % placeholderTexts.length;
        };

        changePlaceholder();
        const interval = setInterval(changePlaceholder, 4000); // Thay đổi mỗi 4 giây

        return () => clearInterval(interval); // Dọn dẹp khi component bị hủy
    }, []);

    // Calculate the total price of items in the cart
    const calculateTotal = () => {
        return cartItems.reduce((total, item) => total + item.price * item.quantity, 0).toLocaleString('vi-VN');
    };

    // Handle input change in the search field
    const handleInputChange = (event) => {
        const value = event.target.value;
        setSearchTerm(value);

        if (value) {
            const filtered = suggestions.filter(suggestion =>
                suggestion.name.toLowerCase().includes(value.toLowerCase())
            );
            setFilteredSuggestions(filtered);
        } else {
            setFilteredSuggestions([]);
        }
    };

    // Handle clicking on a suggestion
    const handleSuggestionClick = (suggestion) => {
        setSearchTerm(suggestion.name);
        setFilteredSuggestions([]);
    };

    // Handle adding item to the cart
    const handleAddToCart = (item) => {
        setCartItems([...cartItems, { ...item, quantity: 1 }]);
        toast.success(`Thêm ${item.name} vào giỏ hàng thành công.`);
        setFilteredSuggestions([]);
    };

    // Remove item from the cart
    const handleRemoveItem = (index) => {
        const removedItem = cartItems[index];
        setCartItems(cartItems.filter((_, i) => i !== index));
        toast.success(`Đã xóa ${removedItem.name} khỏi giỏ hàng.`);
    };

    // Update item quantity in the cart
    const handleQuantityChange = (index, newQuantity) => {
        const updatedCartItems = [...cartItems];
        updatedCartItems[index].quantity = Math.max(1, Number(newQuantity));
        setCartItems(updatedCartItems);
        toast.success(`Số lượng ${updatedCartItems[index].name} đã được cập nhật.`);
    };

    return (
        <div>
            <Toaster />
            <Navbar expand="lg" className="bg-body-tertiary border-0" style={{ background: '#f7f7f7', padding: '12px', borderBottom: '1px solid #ccc' }}>
                <Container className='d-flex flex-column'>
                    {/* Navbar Toggle Button for Mobile */}
                    <Navbar.Toggle aria-controls="navbarScroll" />
                    {/* Navbar Collapse for Menu Items */}
                    <Navbar.Collapse id="navbarScroll" className="justify-content-between w-100 mb-2">
                        <Navbar.Brand href="/home">LOGO</Navbar.Brand>

                        {/* Search Form */}
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
                                                <img src={suggestion.image} alt={suggestion.name} className="suggestion-item-image" />
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

                        {/* Navigation Links */}
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
                                                <img src={item.image} alt={item.name} className="cart-item-image" />
                                                <div className="cart-item-details flex-grow-1 ms-2">
                                                    <div className="cart-item-name">{item.name}</div>
                                                    <div className="cart-item-info d-flex align-items-center">
                                                        <input
                                                            type="number"
                                                            min="1"
                                                            value={item.quantity}
                                                            className="cart-item-quantity"
                                                            onChange={(e) => handleQuantityChange(index, e.target.value)}
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
                    {/* Bottom Navbar */}
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
