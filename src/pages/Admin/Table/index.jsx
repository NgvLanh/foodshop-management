import { useState } from 'react';
import { Container, Row, Col, Button, Modal, Form, InputGroup, FormControl } from 'react-bootstrap';
import toast, { Toaster } from 'react-hot-toast';
import { useForm } from 'react-hook-form';
import Table from '../../../components/Admin/Table';
import { FaPlus } from 'react-icons/fa';

const TableManagement = () => {
    const [tables, setTables] = useState([
        { id: 1, number: 1, seats: 4, isOccupied: false, createdAt: '2024-08-01T12:00:00Z', availableUntil: '2024-08-01T18:00:00Z' },
        { id: 2, number: 2, seats: 2, isOccupied: false, createdAt: '2024-08-01T13:00:00Z', availableUntil: '2024-08-01T19:00:00Z' },
        { id: 3, number: 3, seats: 6, isOccupied: true, createdAt: '2024-08-01T14:00:00Z', availableUntil: '2024-08-01T20:00:00Z' },
        { id: 4, number: 4, seats: 4, isOccupied: false, createdAt: '2024-08-01T15:00:00Z', availableUntil: '2024-08-01T21:00:00Z' },
    ]);

    const [showModal, setShowModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedTable, setSelectedTable] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    const { register, handleSubmit, reset, formState: { errors } } = useForm();

    const handleAddTable = (data) => {
        setTables([
            ...tables,
            { id: Date.now(), number: data.number, seats: parseInt(data.seats), isOccupied: false, createdAt: new Date().toISOString(), availableUntil: new Date(Date.now() + 6 * 60 * 60 * 1000).toISOString() },
        ]);
        setShowModal(false);
        toast.success('Đã thêm bàn mới!');
        reset(); // Reset form fields after submission
    };

    const handleTableClick = (id) => {
        const table = tables.find(table => table.id === id);
        setSelectedTable(table);
    };

    const handleDeleteTable = () => {
        setTables(tables.filter(table => table.id !== selectedTable.id));
        setShowDeleteModal(false);
        toast.success('Đã xóa bàn!');
        setSelectedTable(null);
    };

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
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
                    <Button variant="primary" onClick={() => setShowModal(true)}>
                        <FaPlus /> Thêm Bàn
                    </Button>
                </Col>
            </Row>
            <Row>
                {filteredTables.map(table => (
                    <Col key={table.id} sm={6} md={4} lg={3}>
                        <Table
                            id={table.id}
                            number={table.number}
                            seats={table.seats}
                            isOccupied={table.isOccupied}
                            onClick={handleTableClick}
                        />
                    </Col>
                ))}
            </Row>

            {/* Modal for adding new table */}
            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Thêm Bàn Mới</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleSubmit(handleAddTable)}>
                        <Form.Group className="mb-3">
                            <Form.Label>Số Bàn</Form.Label>
                            <Form.Control
                                type="number"
                                placeholder="Nhập số bàn"
                                {...register('number', { required: 'Số bàn là bắt buộc' })}
                            />
                            {errors.number && <p className="text-danger">{errors.number.message}</p>}
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Số Ghế</Form.Label>
                            <Form.Control
                                type="number"
                                placeholder="Nhập số ghế"
                                {...register('seats', { required: 'Số ghế là bắt buộc' })}
                            />
                            {errors.seats && <p className="text-danger">{errors.seats.message}</p>}
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>Đóng</Button>
                    <Button type="submit" variant="primary">Thêm</Button>
                </Modal.Footer>
            </Modal>

            {/* Modal for table details */}
            {selectedTable && (
                <Modal show={!!selectedTable} onHide={() => setSelectedTable(null)}>
                    <Modal.Header closeButton>
                        <Modal.Title>Thông Tin Bàn {selectedTable.number}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <p><strong>Số Bàn:</strong> {selectedTable.number}</p>
                        <p><strong>Số Ghế:</strong> {selectedTable.seats}</p>
                        <p><strong>Tình Trạng:</strong> {selectedTable.isOccupied ? 'Có người dùng' : 'Không có người dùng'}</p>
                        <p><strong>Thời Gian Tạo:</strong> {new Date(selectedTable.createdAt).toLocaleString()}</p>
                        <p><strong>Thời Gian Còn Trống:</strong> {new Date(selectedTable.availableUntil).toLocaleString()}</p>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="danger" onClick={() => setShowDeleteModal(true)}>Xóa Bàn</Button>
                        <Button variant="secondary" onClick={() => setSelectedTable(null)}>Đóng</Button>
                    </Modal.Footer>
                </Modal>
            )}

            {/* Modal for deleting table */}
            {selectedTable && (
                <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
                    <Modal.Header closeButton>
                        <Modal.Title>Xác Nhận Xóa</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <p>Bạn có chắc chắn muốn xóa bàn số {selectedTable.number} không?</p>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>Hủy</Button>
                        <Button variant="danger" onClick={handleDeleteTable}>Xóa</Button>
                    </Modal.Footer>
                </Modal>
            )}
        </Container>
    );
};

export default TableManagement;
