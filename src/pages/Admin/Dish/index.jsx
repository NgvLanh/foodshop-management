import { useState } from 'react';
import { Container, Row, Col, InputGroup, FormControl, Modal, Button, Badge } from 'react-bootstrap';
import toast, { Toaster } from 'react-hot-toast';
import Table from '../../../components/Admin/Table';

const Dish = () => {
    const [tables, setTables] = useState([
        { id: 1, number: 1, seats: 4, isOccupied: false, createdAt: '2024-08-01T12:00:00Z', availableUntil: '2024-08-01T18:00:00Z', orders: [] },
        { id: 2, number: 2, seats: 2, isOccupied: false, createdAt: '2024-08-01T13:00:00Z', availableUntil: '2024-08-01T19:00:00Z', orders: [] },
        { id: 3, number: 3, seats: 6, isOccupied: true, createdAt: '2024-08-01T14:00:00Z', availableUntil: '2024-08-01T20:00:00Z', orders: [{ name: 'Pizza', status: 'Chưa Nấu', price: 200000 }, { name: 'Pasta', status: 'Chưa Nấu', price: 150000 }] },
        { id: 4, number: 4, seats: 4, isOccupied: true, createdAt: '2024-08-01T15:00:00Z', availableUntil: '2024-08-01T21:00:00Z', orders: [] },
    ]);

    const [selectedTable, setSelectedTable] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    const handleTableClick = (id) => {
        const table = tables.find(table => table.id === id);
        setSelectedTable(table);
    };

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleConfirmOrder = (tableId) => {
        setTables(prevTables => prevTables.map(table =>
            table.id === tableId ? {
                ...table,
                orders: table.orders.map(order => ({
                    ...order,
                    status: 'Đã Nấu'
                }))
            } : table
        ));
        toast.success('Đã xác nhận món ăn là đã nấu.');
    };

    const handlePayment = (tableId) => {
        const table = tables.find(table => table.id === tableId);
        const totalAmount = table.orders.reduce((total, order) => total + (order.price || 0), 0);
        // In hóa đơn (Có thể thay thế bằng chức năng khác tùy theo yêu cầu)
        console.log(`Hóa đơn cho bàn số ${tableId}:`);
        console.log(`Tổng cộng: ${totalAmount} VND`);

        toast.success(`Hóa đơn đã được in  \n Tổng cộng: ${totalAmount} VND`);
        setSelectedTable(false);
    };

    const filteredTables = tables.filter(table =>
        table.number.toString().includes(searchTerm) ||
        table.seats.toString().includes(searchTerm)
    );

    return (
        <Container fluid style={{ background: '#f7f4f4', height: '100vh' }}>
            <Toaster />
            <Row className="mb-4">
                <Col>
                    <h2>Quản Lý Bàn</h2>
                    <InputGroup className="mb-3">
                        <FormControl
                            placeholder="Tìm kiếm theo số bàn hoặc số ghế"
                            value={searchTerm}
                            onChange={handleSearch}
                        />
                    </InputGroup>
                </Col>
            </Row>
            <Row>
                {filteredTables.map(table => (
                    <Col key={table.id} sm={6} md={4} lg={3}>
                        <div style={{ position: 'relative' }}>
                            <Table
                                id={table.id}
                                number={table.number}
                                seats={table.seats}
                                isOccupied={table.isOccupied}
                                onClick={() => handleTableClick(table.id)}
                                style={{ backgroundColor: table.isOccupied ? 'lightgreen' : 'lightcoral' }}
                            />
                            {table.orders.length > 0 && (
                                <Badge bg="danger" style={{ position: 'absolute', top: 0, right: 0 }}>
                                    Đơn hàng
                                </Badge>
                            )}
                        </div>
                    </Col>
                ))}
            </Row>

            {/* Modal for table details */}
            {selectedTable && (
                <Modal show={selectedTable} onHide={() => setSelectedTable(null)}>
                    <Modal.Header closeButton>
                        <Modal.Title>Thông Tin Bàn {selectedTable.number}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <p><strong>Số Bàn:</strong> {selectedTable.number}</p>
                        <p><strong>Số Ghế:</strong> {selectedTable.seats}</p>
                        <p><strong>Tình Trạng:</strong> {selectedTable.isOccupied ? 'Có người dùng' : 'Không có người dùng'}</p>
                        <p><strong>Thời Gian Còn Trống:</strong> {new Date(selectedTable.availableUntil).toLocaleString()}</p>
                        {selectedTable.orders.length > 0 && (
                            <div>
                                <h5>Đơn Hàng:</h5>
                                <ul>
                                    {selectedTable.orders.map((order, index) => (
                                        <li key={index}>
                                            {order.name} - <span style={{ color: order.status === 'Chưa Nấu' ? 'red' : 'green' }}>{order.status}</span> - {order.price ? `${order.price} VND` : 'Chưa xác định giá'}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setSelectedTable(null)}>Đóng</Button>
                        {selectedTable.orders.some(order => order.status === 'Chưa Nấu') && (
                            <Button variant="primary" onClick={() => handleConfirmOrder(selectedTable.id)}>
                                Xác Nhận Nấu
                            </Button>
                        )}
                        {selectedTable.orders.length > 0 && (
                            <Button variant="success" onClick={() => handlePayment(selectedTable.id)}>
                                Thanh Toán
                            </Button>
                        )}
                    </Modal.Footer>
                </Modal>
            )}
        </Container>
    );
};

export default Dish;
