import { useState } from 'react';
import { Container, Row, Col, Card, Button, Form, Tab, Tabs, Modal } from 'react-bootstrap';
import toast, { Toaster } from 'react-hot-toast';

const suggestions = [
    { name: "AAAAAAAA", price: 30000, image: "https://via.placeholder.com/50?text=30_000" },
    { name: "BBBBBBBB", price: 20000, image: "https://via.placeholder.com/50?text=20_000" },
];

const sampleTables = [
    {
        id: 1,
        image: "https://via.placeholder.com/150?text=Table+1",
        seats: 4,
        tableNumber: "B01",
        userName: "Nguyễn Văn A",
        startTime: "18:00",
        orders: [
            { id: 1, description: "Phở Bò", price: 50000, quantity: 2, status: "Đang xác nhận" },
            { id: 2, description: "Phở Gà", price: 45000, quantity: 1, status: "Đang nấu" },
        ],
    },
];

const sampleHistoryTables = [
    {
        id: 1,
        image: "https://via.placeholder.com/150?text=Table+1",
        seats: 4,
        tableNumber: "B01",
        userName: "Nguyễn Văn B",
        startTime: "18:00",
        date: new Date('2023-07-18'),
        orders: [
            { id: 1, description: "Phở Bò", price: 50000, quantity: 2, status: "Đã hoàn thành" },
            { id: 2, description: "Phở Gà", price: 45000, quantity: 1, status: "Đã hoàn thành" },
        ],
    },
    {
        id: 2,
        image: "https://via.placeholder.com/150?text=Table+2",
        seats: 4,
        tableNumber: "B01",
        userName: "Nguyễn Văn B",
        startTime: "18:00",
        date: new Date('2023-07-15'),
        orders: [
            { id: 1, description: "Phở Bò", price: 50000, quantity: 2, status: "Đã hoàn thành" },
            { id: 2, description: "Phở Gà", price: 45000, quantity: 1, status: "Đã hoàn thành" },
        ],
    }
];

const YourTable = () => {
    const [tables, setTables] = useState(sampleTables);
    const [historyTables, setHistoryTables] = useState(sampleHistoryTables);
    const [discount, setDiscount] = useState('');
    const [filteredSuggestions, setFilteredSuggestions] = useState([]);
    const [dateRange, setDateRange] = useState('all');
    const [showModal, setShowModal] = useState(false);
    const [selectedTable, setSelectedTable] = useState(null);

    const calculateTotal = (orders) => {
        return orders.reduce((total, item) => total + item.price * item.quantity, 0);
    };

    const calculateDiscountedTotal = (orders) => {
        const total = calculateTotal(orders);
        return total - (total * discount) / 100;
    };

    const filterHistoryByDateRange = () => {
        const now = new Date();
        if (dateRange === '3days') {
            return historyTables.filter(table => (now - table.date) / (1000 * 60 * 60 * 24) <= 3);
        } else if (dateRange === '1week') {
            return historyTables.filter(table => (now - table.date) / (1000 * 60 * 60 * 24) <= 7);
        } else {
            return historyTables;
        }
    };

    const filteredHistoryTables = filterHistoryByDateRange();

    const handleShowModal = (table) => {
        setSelectedTable(table);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedTable(null);
    };

    const handleDiscountChange = (e) => {
        const value = e.target.value;
        setDiscount(value);

        if (value) {
            const filtered = suggestions.filter(suggestion =>
                suggestion.name.toLowerCase().includes(value.toLowerCase())
            );
            setFilteredSuggestions(filtered);
        } else {
            setFilteredSuggestions([]);
        }
    };

    const handleSuggestionClick = (suggestion) => {
        setDiscount(suggestion.name);
        setFilteredSuggestions([]);
        toast.success(`Đã áp dụng mã giảm giá: ${suggestion.name}`);
    };

    const handlePayment = () => {
        if (selectedTable) {
            toast.success('Thanh toán thành công');
        }
        handleCloseModal();
    };

    return (
        <Container className="mt-4 py-4">
            <Toaster />
            <h2 className="mb-4">Bàn của bạn</h2>
            <Tabs defaultActiveKey="current" id="table-tabs">
                <Tab eventKey="current" title="Bàn hiện tại">
                    <Row>
                        {tables.length === 0 ? (
                            <p>Hiện tại không có bàn nào.</p>
                        ) : (
                            tables.map((table) => (
                                <Col xs={12} key={table.id} className="mb-4">
                                    <Card className="table-card p-3">
                                        <Card.Body>
                                            <Card.Title>Bàn {table.tableNumber}</Card.Title>
                                            <Card.Text>Số chỗ ngồi: {table.seats}</Card.Text>
                                            <Card.Text>Thời gian bắt đầu ăn: {table.startTime}</Card.Text>
                                            <Card.Text>Tên người dùng: {table.userName}</Card.Text>
                                            <div>
                                                <strong>Món đã gọi:</strong>
                                                <ul>
                                                    {table.orders.map((order) => (
                                                        <li key={order.id}>
                                                            {order.description} - {order.quantity} suất - {order.price.toLocaleString()} VND mỗi suất
                                                            <span> ({order.status})</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                            <Row>
                                                <Col xs={12}>
                                                    <Card.Text>
                                                        <strong>Tổng cộng: {calculateTotal(table.orders).toLocaleString()} VND</strong>
                                                    </Card.Text>
                                                    <div className="input-header-bar d-flex flex-column jus flex-grow-1 mx-3 position-relative">
                                                        <Form.Label>Nhập mã giảm giá:</Form.Label>
                                                        <Form.Control
                                                            id="search"
                                                            type="search"
                                                            placeholder="Nhập mã giảm giá"
                                                            className="search-input me-2"
                                                            aria-label="Search"
                                                            value={discount}
                                                            onChange={handleDiscountChange}
                                                        />
                                                        {
                                                            filteredSuggestions.length > 0 && (
                                                                <ul className="suggestions-list position-absolute top-100 start-0 bg-white border rounded ps-0">
                                                                    {filteredSuggestions.map((suggestion, index) => (
                                                                        <li
                                                                            key={index}
                                                                            className="suggestion-item d-flex align-items-center p-2"
                                                                            onClick={() => handleSuggestionClick(suggestion)}
                                                                        >
                                                                            <img src={suggestion.image} alt={suggestion.name} className="suggestion-item-image" />
                                                                            <div className="suggestion-item-details ms-2">
                                                                                <div className="suggestion-item-name">{suggestion.name}</div>
                                                                                <div className="suggestion-item-price">{suggestion.price.toLocaleString()} VND</div>
                                                                            </div>
                                                                        </li>
                                                                    ))}
                                                                </ul>
                                                            )
                                                        }
                                                    </div>
                                                    <Card.Text className='mt-3'>
                                                        <strong>Tổng tiền sau giảm giá: {calculateDiscountedTotal(table.orders).toLocaleString()} VND</strong>
                                                    </Card.Text>
                                                </Col>
                                            </Row>
                                            <div className="d-flex justify-content-end mt-3">
                                                <Button onClick={() => handleShowModal(table)}>Thanh toán</Button>
                                            </div>
                                        </Card.Body>
                                    </Card>
                                </Col>
                            ))
                        )}
                    </Row>
                </Tab>
                <Tab eventKey="history" title="Lịch sử hóa đơn">
                    <Form.Group controlId="selectDateRange" className="mb-3">
                        <Form.Label></Form.Label>
                        <Form.Control as="select" value={dateRange} onChange={(e) => setDateRange(e.target.value)}>
                            <option value="all">Tất cả</option>
                            <option value="3days">3 ngày trước</option>
                            <option value="1week">1 tuần trước</option>
                        </Form.Control>
                    </Form.Group>
                    <Row>
                        {filteredHistoryTables.length === 0 ? (
                            <p>Không có lịch sử hóa đơn.</p>
                        ) : (
                            filteredHistoryTables.map((table) => (
                                <Col xs={12} key={table.id} className="mb-4">
                                    <Card className="table-card p-3">
                                        <Card.Body>
                                            <Card.Title>Bàn {table.tableNumber}</Card.Title>
                                            <Card.Text>Số chỗ ngồi: {table.seats}</Card.Text>
                                            <Card.Text>Thời gian bắt đầu ăn: {table.startTime}</Card.Text>
                                            <Card.Text>Ngày: {table.date.toLocaleDateString()}</Card.Text>
                                            <Card.Text>Tên người dùng: {table.userName}</Card.Text>
                                            <div>
                                                <strong>Món đã gọi:</strong>
                                                <ul>
                                                    {table.orders.map((order) => (
                                                        <li key={order.id}>
                                                            {order.description} - {order.quantity} suất - {order.price.toLocaleString()} VND mỗi suất
                                                            <span> ({order.status})</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                            <Card.Text>
                                                <strong>Tổng cộng: {calculateTotal(table.orders).toLocaleString()} VND</strong>
                                            </Card.Text>
                                            <Card.Text>
                                                <strong>Tổng tiền sau giảm giá: {calculateDiscountedTotal(table.orders).toLocaleString()} VND</strong>
                                            </Card.Text>
                                        </Card.Body>
                                    </Card>
                                </Col>
                            ))
                        )}
                    </Row>
                </Tab>
            </Tabs>
            <Modal show={showModal} onHide={handleCloseModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Thanh toán</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedTable && (
                        <>
                            <h5>Bàn {selectedTable.tableNumber}</h5>
                            <p>Số chỗ ngồi: {selectedTable.seats}</p>
                            <p>Thời gian bắt đầu ăn: {selectedTable.startTime}</p>
                            <p>Tên người dùng: {selectedTable.userName}</p>
                            <ul>
                                {selectedTable.orders.map((order) => (
                                    <li key={order.id}>
                                        {order.description} - {order.quantity} suất - {order.price.toLocaleString()} VND mỗi suất
                                        <span> ({order.status})</span>
                                    </li>
                                ))}
                            </ul>
                            <p><strong>Tổng cộng: {calculateTotal(selectedTable.orders).toLocaleString()} VND</strong></p>
                            <p><strong>Tổng tiền sau giảm giá: {calculateDiscountedTotal(selectedTable.orders).toLocaleString()} VND</strong></p>
                        </>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModal}>
                        Đóng
                    </Button>
                    <Button variant="primary" onClick={handlePayment}>
                        Xác nhận thanh toán
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
}

export default YourTable;
