import { useEffect, useState } from 'react';
import { Container, Card, Button, Modal, Form, Row, Col, Pagination } from 'react-bootstrap';
import response from '../../../config/apiConfig';
import { FaChair } from 'react-icons/fa';
import { MdOutlineTableBar } from 'react-icons/md';

const BookTable = () => {
    const [tables, setTables] = useState([]);
    const uniqueSeats = [...new Set(tables.map(table => table.seats))];
    const [selectedTable, setSelectedTable] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 8;
    const [selectedSeats, setSelectedSeats] = useState([]);
    const [customerName, setCustomerName] = useState('');
    const [selectedTimeSlot, setSelectedTimeSlot] = useState('');

    useEffect(() => {
        fetchDataTables();
    }, []);

    const fetchDataTables = async () => {
        const res = await response({
            path: 'tables'
        });
        setTables(res.data);
    }

    const handleTableClick = (table) => {
        setSelectedTable(table);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedTable(null);
        setSelectedTimeSlot('');
    };

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const handleSeatsClick = (seats) => {
        setSelectedSeats((prevSelectedSeats) =>
            prevSelectedSeats.includes(seats)
                ? prevSelectedSeats.filter((s) => s !== seats)
                : [...prevSelectedSeats, seats]
        );
    };

    const handleBookTable = () => {
        // Handle the logic to book the table with the selected time slot
        alert(`Đã đặt bàn số ${selectedTable.tableNumber} vào khoảng thời gian ${selectedTimeSlot}`);
        handleCloseModal();
    };

    const filteredTables = () => {
        let filtered = tables;
        if (selectedSeats.length > 0) {
            filtered = filtered.filter((table) => selectedSeats.includes(table.seats));
        }
        return filtered;
    };

    const totalPages = Math.ceil(filteredTables().length / itemsPerPage);

    // Mốc thời gian đặt bàn
    const timeSlots = [
        '2 PM - 4 PM',  // 2 PM - 4 PM
        '4 PM - 6 PM',  // 4 PM - 6 PM
        '6 PM - 8 PM',  // 6 PM - 8 PM
        '8 PM - 10 PM',  // 8 PM - 10 PM
    ];
    

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
                                {seats} Ghế
                            </div>
                        ))}
                    </div>
                </Col>
            </Row>
            <Row>
                {filteredTables().slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map(table => (
                    <Col key={table.id} xs={12} sm={6} md={4} lg={3} className="mb-3">
                        <Card className="table-card">
                            <Card.Body className="table-card-body">
                                <Card.Title><MdOutlineTableBar size={24} /> số {table.number}</Card.Title>
                                <Card.Text>
                                    {Array.from({ length: table.seats }).map((_, index) => (
                                        <FaChair key={index} style={{ marginRight: '5px' }} />
                                    ))}
                                </Card.Text>
                                <Card.Text>Trạng thái: <span style={{ color: `${table.status ? 'brown' : 'green'}` }}>{table.status ? 'Đang dùng' : 'Trống'}</span></Card.Text>
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
                            <h5>Bàn số {selectedTable.number}</h5>
                            <p>Số ghế: {selectedTable.seats}</p>
                            <Form.Group>
                                <Form.Label>Chọn khoảng thời gian:</Form.Label>
                                <Row>
                                    {timeSlots.map((slot) => (
                                        <Col sm={6}
                                            key={slot}
                                            className={`m-0 mb-2 filter-item ${selectedTimeSlot === slot ? 'active' : ''}`}
                                            onClick={() => setSelectedTimeSlot(slot)}
                                        >
                                            {slot}
                                        </Col>
                                    ))}
                                </Row>
                            </Form.Group>
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleCloseModal}>
                            Đóng
                        </Button>
                        <Button variant="primary" onClick={handleBookTable} disabled={!selectedTimeSlot}>
                            Xác nhận đặt bàn
                        </Button>
                    </Modal.Footer>
                </Modal>
            )}
        </Container>
    );
};

export default BookTable;
