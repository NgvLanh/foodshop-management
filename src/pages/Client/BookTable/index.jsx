import { useState } from 'react';
import { Container, Card, Button, Modal, Form, Row, Col, Pagination } from 'react-bootstrap';

// Sample data for tables
const tablesData = [
    { id: 1, tableNumber: 1, seats: 4, status: 'Available' },
    { id: 2, tableNumber: 2, seats: 2, status: 'Available' },
    { id: 3, tableNumber: 3, seats: 6, status: 'Occupied' },
    { id: 4, tableNumber: 4, seats: 4, status: 'Available' },
    { id: 5, tableNumber: 5, seats: 2, status: 'Available' },
    // Add more tables here
];

const uniqueSeats = [...new Set(tablesData.map(table => table.seats))]; // Get unique seat numbers

const BookTable = () => {
    const [selectedTable, setSelectedTable] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10; // Number of tables per page
    const [selectedSeats, setSelectedSeats] = useState([]); // State for selected seats
    const [customerName, setCustomerName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [bookingTime, setBookingTime] = useState('');

    const handleTableClick = (table) => {
        setSelectedTable(table);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedTable(null);
        setCustomerName('');
        setPhoneNumber('');
        setBookingTime('');
    };

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const handleSeatsClick = (seats) => { // Handle seat filter click
        setSelectedSeats((prevSelectedSeats) =>
            prevSelectedSeats.includes(seats)
                ? prevSelectedSeats.filter((s) => s !== seats)
                : [...prevSelectedSeats, seats]
        );
    };

    const handleBookTable = () => {
        // Handle the logic to book the table
        alert(`Đã đặt bàn số ${selectedTable.tableNumber} cho ${customerName} vào lúc ${bookingTime}`);
        handleCloseModal();
    };

    const filteredTables = () => {
        let filtered = tablesData;
        if (selectedSeats.length > 0) { // Apply seats filtering
            filtered = filtered.filter((table) => selectedSeats.includes(table.seats));
        }
        return filtered;
    };

    // Pagination logic
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentTables = filteredTables().slice(indexOfFirstItem, indexOfLastItem);

    const totalPages = Math.ceil(filteredTables().length / itemsPerPage);

    return (
        <Container className="mt-4">
            <Row className="align-items-center mb-4">
                <Col>
                    <h2 className="text-left">Danh sách bàn</h2>
                </Col>
            </Row>
            <Row>
                <Col>
                    <div className="filter-bar">
                        {uniqueSeats.map((seats) => (
                            <div
                                key={seats}
                                className={`filter-item ${selectedSeats.includes(seats) ? 'active' : ''}`}
                                onClick={() => handleSeatsClick(seats)}
                            >
                                {seats} ghế
                            </div>
                        ))}
                    </div>
                </Col>
            </Row>
            <Row>
                {currentTables.map(table => (
                    <Col key={table.id} xs={12} sm={6} md={4} lg={3} className="mb-3">
                        <Card className="table-card">
                            <Card.Body className="table-card-body">
                                <Card.Title>Bàn số {table.tableNumber}</Card.Title>
                                <Card.Text>Số ghế: {table.seats}</Card.Text>
                                <Card.Text>Trạng thái: {table.status}</Card.Text>
                                <Button
                                    variant="primary"
                                    onClick={() => handleTableClick(table)}
                                    disabled={table.status === 'Occupied'}
                                >
                                    Đặt bàn
                                </Button>
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

            {/* Modal for table booking */}
            {selectedTable && (
                <Modal show={showModal} onHide={handleCloseModal}>
                    <Modal.Header closeButton>
                        <Modal.Title>Đặt bàn</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div className="d-flex flex-column align-items-center">
                            <h5>Bàn số {selectedTable.tableNumber}</h5>
                            <p>Số ghế: {selectedTable.seats}</p>
                            <Form.Group controlId="formCustomerName">
                                <Form.Label>Họ tên:</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={customerName}
                                    onChange={(e) => setCustomerName(e.target.value)}
                                />
                            </Form.Group>
                            <Form.Group controlId="formPhoneNumber">
                                <Form.Label>Số điện thoại:</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={phoneNumber}
                                    onChange={(e) => setPhoneNumber(e.target.value)}
                                />
                            </Form.Group>
                            <Form.Group controlId="formBookingTime">
                                <Form.Label>Thời gian đặt bàn:</Form.Label>
                                <Form.Control
                                    type="datetime-local"
                                    value={bookingTime}
                                    onChange={(e) => setBookingTime(e.target.value)}
                                />
                            </Form.Group>
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleCloseModal}>
                            Đóng
                        </Button>
                        <Button variant="primary" onClick={handleBookTable} disabled={!customerName || !phoneNumber || !bookingTime}>
                            Xác nhận đặt bàn
                        </Button>
                    </Modal.Footer>
                </Modal>
            )}
        </Container>
    );
};

export default BookTable;
