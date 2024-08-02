import { useState } from 'react';
import { Container, Row, Col, Card, Button, Form, Table, Modal } from 'react-bootstrap';
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa';
import { useForm } from 'react-hook-form';
import toast, { Toaster } from 'react-hot-toast';

const Employee = () => {
    const { register, handleSubmit, setValue, reset, formState: { errors } } = useForm();
    const [showModal, setShowModal] = useState(false);
    const [currentEmployee, setCurrentEmployee] = useState(null);
    const [employees, setEmployees] = useState([
        { id: 1, name: 'Nguyễn Văn A', phone: '0901234567', email: 'a@example.com', shift: 'Sáng' },
        { id: 2, name: 'Trần Thị B', phone: '0912345678', email: 'b@example.com', shift: 'Chiều' },
    ]);

    const handleShowModal = (employee = null) => {
        setCurrentEmployee(employee);
        if (employee) {
            // Set values for editing
            setValue('name', employee.name);
            setValue('phone', employee.phone);
            setValue('email', employee.email);
            setValue('shift', employee.shift);
        } else {
            // Reset form for adding new employee
            reset();
        }
        setShowModal(true);
    };

    const handleCloseModal = () => setShowModal(false);

    const onSubmit = (data) => {
        const newEmployee = {
            id: currentEmployee ? currentEmployee.id : Date.now(),
            ...data,
        };

        if (currentEmployee) {
            // Update existing employee
            setEmployees(employees.map(employee =>
                employee.id === currentEmployee.id ? newEmployee : employee
            ));
            toast.success('Nhân viên đã được cập nhật!');
        } else {
            // Add new employee
            setEmployees([...employees, newEmployee]);
            toast.success('Nhân viên đã được thêm!');
        }

        handleCloseModal();
    };

    const handleDeleteEmployee = (id) => {
        setEmployees(employees.filter(employee => employee.id !== id));
        toast.success('Nhân viên đã được xóa!');
    };

    return (
        <Container fluid style={{ background: '#f7f4f4', height: '100vh' }}>
            <Toaster />
            <Row className="my-4">
                <Col>
                    <h2 className="mb-4">Quản Lý Nhân Viên</h2>
                    <Button variant="primary" onClick={() => handleShowModal()}>
                        <FaPlus /> Thêm Nhân Viên Mới
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
                                        <th>Tên</th>
                                        <th>Số Điện Thoại</th>
                                        <th>Email</th>
                                        <th>Ca Làm</th>
                                        <th>Hành Động</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {employees.map(employee => (
                                        <tr key={employee.id}>
                                            <td>{employee.name}</td>
                                            <td>{employee.phone}</td>
                                            <td>{employee.email}</td>
                                            <td>{employee.shift}</td>
                                            <td>
                                                <Button variant="warning" size="sm" onClick={() => handleShowModal(employee)}>
                                                    <FaEdit /> Chỉnh Sửa
                                                </Button>{' '}
                                                <Button variant="danger" size="sm" onClick={() => handleDeleteEmployee(employee.id)}>
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
                    <Modal.Title>{currentEmployee ? 'Chỉnh Sửa Nhân Viên' : 'Thêm Nhân Viên Mới'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleSubmit(onSubmit)}>
                        <Form.Floating className="mb-3">
                            <Form.Control
                                type="text"
                                id="name"
                                placeholder="Tên nhân viên"
                                {...register('name', { required: 'Tên không được để trống' })}
                            />
                            <Form.Label htmlFor="name">Tên</Form.Label>
                            {errors.name && <Form.Text className="text-danger">{errors.name.message}</Form.Text>}
                        </Form.Floating>
                        <Form.Floating className="mb-3">
                            <Form.Control
                                type="tel"
                                id="phone"
                                placeholder="Số điện thoại"
                                {...register('phone', { required: 'Số điện thoại không được để trống' })}
                            />
                            <Form.Label htmlFor="phone">Số Điện Thoại</Form.Label>
                            {errors.phone && <Form.Text className="text-danger">{errors.phone.message}</Form.Text>}
                        </Form.Floating>
                        <Form.Floating className="mb-3">
                            <Form.Control
                                type="email"
                                id="email"
                                placeholder="Email"
                                {...register('email', { required: 'Email không được để trống' })}
                            />
                            <Form.Label htmlFor="email">Email</Form.Label>
                            {errors.email && <Form.Text className="text-danger">{errors.email.message}</Form.Text>}
                        </Form.Floating>
                        <Form.Group className="mb-3">
                            <Form.Label>Ca Làm</Form.Label>
                            <Form.Control as="select" id="shift" {...register('shift', { required: 'Ca làm không được để trống' })}>
                                <option value="Sáng">Sáng</option>
                                <option value="Chiều">Chiều</option>
                                <option value="Tối">Tối</option>
                            </Form.Control>
                            {errors.shift && <Form.Text className="text-danger">{errors.shift.message}</Form.Text>}
                        </Form.Group>
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

export default Employee;
