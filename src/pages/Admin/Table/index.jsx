import { useEffect, useState } from 'react';
import { Container, Row, Col, Button, Modal, Form, InputGroup, FormControl } from 'react-bootstrap';
import toast, { Toaster } from 'react-hot-toast';
import { useForm } from 'react-hook-form';
import Table from '../../../components/Admin/Table';
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa';
import request from '../../../config/apiConfig';
import { confirmAlert } from 'react-confirm-alert';

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
    const [isEditing, setIsEditing] = useState(false);

    const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm();

    useEffect(() => {
        fetchTables();
    }, []);

    const fetchTables = async () => {
        try {
            const res = await request({ path: 'tables' });
            setTables(res.data);
        } catch (error) {
            console.error('Error fetching tables:', error);
        }
    };

    const handleAddTable = async (data) => {
        if (tables.some(table => table.number === parseInt(data.number))) {
            toast.error('Số bàn đã tồn tại!');
            return;
        }
        const newTable = {
            number: data.number,
            seats: parseInt(data.seats),
            isOccupied: false,
        };

        try {
            await request({
                method: 'POST',
                path: 'tables',
                data: newTable
            });
            toast.success('Thêm bàn thành công!');
            fetchTables();
            reset();
            setShowModal(false);
        } catch (error) {
            console.error('Error adding table:', error);
        }
    };

    const handleEditTable = async (data) => {
        if (tables.some(table => table.number === parseInt(data.number) && table.id !== selectedTable.id)) {
            toast.error('Số bàn đã tồn tại!');
            return;
        }
        const updatedTable = {
            number: data.number,
            seats: parseInt(data.seats),
            isOccupied: selectedTable.isOccupied,
        };

        try {
            await request({
                method: 'PUT',
                path: `tables/${selectedTable.id}`,
                data: updatedTable
            });
            toast.success('Cập nhật bàn thành công!');
            fetchTables();
            reset();
            setShowModal(false);
            setIsEditing(false);
            setSelectedTable(null);
        } catch (error) {
            console.error('Error updating table:', error);
        }
    };

    const handleEdit = (table) => {
        setValue('number', table.number);
        setValue('seats', table.seats);
        setIsEditing(true);
        setSelectedTable(table);
        setShowModal(true);
    };

    const handleTableClick = (id) => {
        const table = tables.find(table => table.id === id);
        setSelectedTable(table);
    };

    const handleDeleteTable = async () => {
        try {
            await request({ method: 'DELETE', path: `tables/${selectedTable.id}` });
            fetchTables();
            toast.success('Đã xóa bàn!');
            setShowDeleteModal(false);
            setSelectedTable(null);
        } catch (error) {
            console.error('Error deleting table:', error);
        }
    };

    const confirmDelete = (id) => {
        setSelectedTable(null);
        confirmAlert({
            title: 'Xác nhận xóa',
            message: 'Bạn có chắc chắn muốn xóa bàn này không?',
            buttons: [
                { label: 'Có', onClick: () => handleDeleteTable(id) },
                { label: 'Không' }
            ]
        });
    };

    const handleShowModal = () => {
        reset();
        setShowModal(true);
        setIsEditing(false);
        setSelectedTable(null);
    };

    const handleCloseModal = () => setShowModal(false);

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
                    <Button variant="primary" onClick={handleShowModal}>
                        <FaPlus /> Thêm Bàn
                    </Button>
                </Col>
            </Row>
            <Row>
                {filteredTables.map((table) => (
                    <Col key={table.id} sm={6} md={4} lg={3}>
                        <Table
                            id={table.id}
                            number={table.number}
                            seats={table.seats}
                            isOccupied={table.isOccupied}
                            onClick={() => handleTableClick(table.id)}
                        />

                    </Col>
                ))}
            </Row>

            {/* Modal for adding/editing table */}
            <Modal show={showModal} onHide={handleCloseModal}>
                <Modal.Header closeButton>
                    <Modal.Title>{isEditing ? 'Cập Nhật Bàn' : 'Thêm Bàn Mới'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleSubmit(isEditing ? handleEditTable : handleAddTable)}>
                        <Form.Group className="mb-2">
                            <Form.Label>Số Bàn</Form.Label>
                            <Form.Control
                                type="number"
                                placeholder="Nhập số bàn"
                                {...register('number', { required: 'Số bàn là bắt buộc', min: { value: 1, message: 'Số bàn phải lớn hơn 0' } })}
                            />
                            {errors.number && <p className="text-danger">{errors.number.message}</p>}
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Số Ghế</Form.Label>
                            <Form.Control
                                type="number"
                                placeholder="Nhập số ghế"
                                {...register('seats', { required: 'Số ghế là bắt buộc', min: { value: 1, message: 'Số ghế phải lớn hơn 0' }, max: { value: 16, message: 'Số ghế phải nhỏ hơn 16' } })}
                            />
                            {errors.seats && <p className="text-danger">{errors.seats.message}</p>}
                        </Form.Group>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={handleCloseModal}>Đóng</Button>
                            <Button type="submit" variant="primary">{isEditing ? 'Cập Nhật' : 'Thêm'}</Button>
                        </Modal.Footer>
                    </Form>
                </Modal.Body>
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
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="warning" onClick={() => handleEdit(selectedTable)}>
                            <FaEdit /> Sửa
                        </Button>
                        <Button variant="danger" onClick={() => confirmDelete(selectedTable.id)}>
                            <FaTrash /> Xóa
                        </Button>
                        <Button variant="secondary" onClick={() => setSelectedTable(null)}>Đóng</Button>

                    </Modal.Footer>
                </Modal>
            )}
        </Container>
    );
};

export default TableManagement;
