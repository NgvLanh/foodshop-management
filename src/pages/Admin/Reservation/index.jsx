import { useState } from 'react';
import { Container, Row, Col, Card, Button, Form, Table, Modal } from 'react-bootstrap';
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa';
import { useForm } from 'react-hook-form';
import toast, { Toaster } from 'react-hot-toast';

const Reservation = () => {
    const { register, handleSubmit, setValue, reset, formState: { errors } } = useForm();
    const [showModal, setShowModal] = useState(false);
    const [currentReservation, setCurrentReservation] = useState(null);
    const [reservations, setReservations] = useState([
        { id: 1, tableNumber: 1, reservationTime: '2024-08-01T19:00', status: 'Chưa xác nhận', customerPhone: '0901234567' },
        { id: 2, tableNumber: 2, reservationTime: '2024-08-02T20:00', status: 'Đã xác nhận', customerPhone: '0912345678' },
    ]);
    const [tables, setTables] = useState([
        { id: 1, number: 1, seats: 4 },
        { id: 2, number: 2, seats: 2 },
        { id: 3, number: 3, seats: 6 },
        { id: 4, number: 4, seats: 4 },
    ]);

    const handleShowModal = (reservation = null) => {
        setCurrentReservation(reservation);
        if (reservation) {
            // Set values for editing
            setValue('tableNumber', reservation.tableNumber);
            setValue('reservationTime', reservation.reservationTime);
            setValue('status', reservation.status);
            setValue('customerPhone', reservation.customerPhone);
        } else {
            // Reset form for adding new reservation
            reset();
        }
        setShowModal(true);
    };

    const handleCloseModal = () => setShowModal(false);

    const onSubmit = (data) => {
        const newReservation = {
            id: currentReservation ? currentReservation.id : Date.now(),
            ...data,
        };

        if (currentReservation) {
            // Update existing reservation
            setReservations(reservations.map(reservation =>
                reservation.id === currentReservation.id ? newReservation : reservation
            ));
            toast.success('Đặt bàn đã được cập nhật!');
        } else {
            // Add new reservation
            setReservations([...reservations, newReservation]);
            toast.success('Đặt bàn đã được thêm!');
        }

        handleCloseModal();
    };

    const handleDeleteReservation = (id) => {
        setReservations(reservations.filter(reservation => reservation.id !== id));
        toast.success('Đặt bàn đã được xóa!');
    };

    const getUnavailableTimes = (tableNumber) => {
        return reservations
            .filter(reservation => reservation.tableNumber === tableNumber)
            .map(reservation => reservation.reservationTime);
    };

    const availableTimes = ['2024-08-01T18:00', '2024-08-01T19:00', '2024-08-01T20:00', '2024-08-01T21:00'];

    return (
        <Container fluid style={{ background: '#f7f4f4', height: '100vh' }}>
            <Toaster />
            <Row className="my-4">
                <Col>
                    <h2 className="mb-4">Quản Lý Đặt Bàn</h2>
                    <Button variant="primary" onClick={() => handleShowModal()}>
                        <FaPlus /> Thêm Đặt Bàn Mới
                    </Button>
                </Col>
            </Row>
            <Row>
                <Col>
                    <Card>
                        <Card.Body>
                            <Table striped bordered hover>
                                <thead>
                                    <tr>
                                        <th>Bàn</th>
                                        <th>Thời Gian Đặt</th>
                                        <th>Trạng Thái</th>
                                        <th>Người Đặt</th>
                                        <th>Hành Động</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {reservations.map(reservation => (
                                        <tr key={reservation.id}>
                                            <td>{reservation.tableNumber}</td>
                                            <td>{new Date(reservation.reservationTime).toLocaleString()}</td>
                                            <td>{reservation.status}</td>
                                            <td>{reservation.customerPhone}</td>
                                            <td>
                                                <Button variant="warning" size="sm" onClick={() => handleShowModal(reservation)}>
                                                    <FaEdit /> Chỉnh Sửa
                                                </Button>{' '}
                                                <Button variant="danger" size="sm" onClick={() => handleDeleteReservation(reservation.id)}>
                                                    <FaTrash /> Xóa
                                                </Button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* Modal */}
            <Modal show={showModal} onHide={handleCloseModal}>
                <Modal.Header closeButton>
                    <Modal.Title>{currentReservation ? 'Chỉnh Sửa Đặt Bàn' : 'Thêm Đặt Bàn Mới'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleSubmit(onSubmit)}>
                        <Form.Group className="mb-3">
                            <Form.Label htmlFor="tableNumber">Bàn</Form.Label>
                            <Form.Control
                                as="select"
                                id="tableNumber"
                                placeholder="Chọn bàn"
                                {...register('tableNumber', { required: 'Bàn không được để trống' })}
                                onChange={(e) => setValue('tableNumber', e.target.value)}
                            >
                                {tables.map(table => (
                                    <option key={table.id} value={table.number}>{`Bàn ${table.number} (${table.seats} ghế)`}</option>
                                ))}
                            </Form.Control>
                            {errors.tableNumber && <Form.Text className="text-danger">{errors.tableNumber.message}</Form.Text>}
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Thời Gian Đặt</Form.Label>
                            {availableTimes.map(time => {
                                const isUnavailable = getUnavailableTimes(currentReservation?.tableNumber || tables[0].number).includes(time);
                                return (
                                    <Form.Check
                                        key={time}
                                        type="radio"
                                        label={new Date(time).toLocaleString()}
                                        value={time}
                                        disabled={isUnavailable}
                                        {...register('reservationTime', { required: 'Thời gian đặt không được để trống' })}
                                    />
                                );
                            })}
                            {errors.reservationTime && <Form.Text className="text-danger">{errors.reservationTime.message}</Form.Text>}
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Trạng Thái</Form.Label>
                            <Form.Control as="select" id="status" {...register('status', { required: 'Trạng thái không được để trống' })}>
                                <option value="Chưa xác nhận">Chưa xác nhận</option>
                                <option value="Đã xác nhận">Đã xác nhận</option>
                            </Form.Control>
                            {errors.status && <Form.Text className="text-danger">{errors.status.message}</Form.Text>}
                        </Form.Group>
                        <Form.Floating className="mb-3">
                            <Form.Control
                                type="tel"
                                id="customerPhone"
                                placeholder="Số điện thoại người đặt"
                                {...register('customerPhone', { required: 'Số điện thoại không được để trống' })}
                            />
                            <Form.Label htmlFor="customerPhone">Số Điện Thoại Người Đặt</Form.Label>
                            {errors.customerPhone && <Form.Text className="text-danger">{errors.customerPhone.message}</Form.Text>}
                        </Form.Floating>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={handleCloseModal}>
                                Đóng
                            </Button>
                            <Button variant="primary" type="submit">
                                Lưu
                            </Button>
                        </Modal.Footer>
                    </Form>
                </Modal.Body>
            </Modal>
        </Container>
    );
};

export default Reservation;
