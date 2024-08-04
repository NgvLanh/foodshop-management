import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Container, Row, Col, Card, Button, Form, Table, Modal } from 'react-bootstrap';
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa';
import toast, { Toaster } from 'react-hot-toast';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import './style.css';
import request from '../../../config/apiConfig';

const Employee = () => {
    const [employees, setEmployees] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editIndex, setEditIndex] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    const { register, handleSubmit, formState: { errors }, setValue, reset } = useForm();

    useEffect(() => {
        fillDataEmployees();
    }, []);

    const fillDataEmployees = async () => {
        try {
            const res = await request({
                path: 'employees'
            });
            setEmployees(res.data);
        } catch (error) {
            console.log('Error getting employees:', error);
        }
    };

    const onSubmit = async (data) => {
        const newEmployee = {
            name: data.name,
            phoneNumber: data.phoneNumber,
            email: data.email,
            password: data.password,
            role: 'nhân viên'
        };

        try {
            if (isEditing) {
                await request({
                    method: 'PUT',
                    path: `employees/${employees[editIndex].id}`,
                    data: newEmployee
                });
                toast.success('Cập nhật nhân viên thành công!');
            } else {
                await request({
                    method: 'POST',
                    path: 'employees',
                    data: newEmployee
                });
                toast.success('Thêm nhân viên thành công!');
            }
            fillDataEmployees();
            reset();
            setShowModal(false);
            setIsEditing(false);
            setEditIndex(null);
        } catch (error) {
            console.log('Error adding/updating employee:', error);
        }
    };

    const handleEdit = (index) => {
        const employee = employees[index];
        setValue('name', employee.name);
        setValue('phoneNumber', employee.phoneNumber);
        setValue('email', employee.email);
        setValue('password', employee.password);
        setIsEditing(true);
        setEditIndex(index);
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        try {
            await request({
                method: 'DELETE',
                path: `employees/${id}`
            });
            fillDataEmployees();
            toast.success('Xóa nhân viên thành công!');
        } catch (error) {
            console.log('Error deleting employee:', error);
        }
    };

    const confirmDelete = (id) => {
        confirmAlert({
            title: 'Xác nhận xóa',
            message: 'Bạn có chắc chắn muốn xóa nhân viên này không?',
            buttons: [
                {
                    label: 'Có',
                    onClick: () => handleDelete(id)
                },
                {
                    label: 'Không'
                }
            ]
        });
    };

    const handleShowModal = () => {
        reset();
        setIsEditing(false);
        setEditIndex(null);
        setShowModal(true);
    };

    const handleCloseModal = () => setShowModal(false);

    const filteredEmployees = employees.filter(employee =>
        employee.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <Container fluid style={{ background: '#f7f4f4', height: '100vh' }}>
            <Toaster />
            <Row className="my-4">
                <Col>
                    <h2 className="mb-4">Quản Lý Nhân Viên</h2>
                    <Button variant="primary" onClick={handleShowModal}>
                        <FaPlus /> Thêm Nhân Viên
                    </Button>
                </Col>
            </Row>
            <Row>
                <Col>
                    <Card>
                        <Card.Body>
                            <Form.Group as={Row} className="mb-3 d-flex justify-content-end">

                            </Form.Group>
                            <Table striped bordered hover>
                                <thead>
                                    <tr>
                                        <th>Tên</th>
                                        <th>Số Điện Thoại</th>
                                        <th>Email</th>
                                        <th>Vai trò</th>
                                        <th>Hành Động</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredEmployees.map((employee, index) => (
                                        <tr key={employee.id}>
                                            <td>{employee.name}</td>
                                            <td>{employee.phoneNumber}</td>
                                            <td>{employee.email}</td>
                                            <td>{employee.role}</td>
                                            <td>
                                                <Button variant="warning" size="sm" onClick={() => handleEdit(index)}>
                                                    <FaEdit /> Sửa
                                                </Button>{' '}
                                                <Button variant="danger" size="sm" onClick={() => confirmDelete(employee.id)}>
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
                    <Modal.Title>{isEditing ? 'Sửa Nhân Viên' : 'Thêm Nhân Viên'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleSubmit(onSubmit)}>
                        <Form.Floating className="mb-3">
                            <Form.Control
                                type="text"
                                id="name"
                                placeholder="Tên"
                                {...register('name', {
                                    required: 'Tên không được bỏ trống'
                                })}
                            />
                            <Form.Label htmlFor="name">Tên</Form.Label>
                            {errors.name && <Form.Text className="text-danger">{errors.name.message}</Form.Text>}
                        </Form.Floating>
                        <Form.Floating className="mb-3">
                            <Form.Control
                                type="text"
                                id="phoneNumber"
                                placeholder="Số điện thoại"
                                {...register('phoneNumber', {
                                    required: 'Số điện thoại không được bỏ trống',
                                    pattern: {
                                        value: /^[0-9]{10}$/,
                                        message: 'Số điện thoại phải gồm 10 chữ số'
                                    }
                                })}
                            />
                            <Form.Label htmlFor="phoneNumber">Số Điện Thoại</Form.Label>
                            {errors.phoneNumber && <Form.Text className="text-danger">{errors.phoneNumber.message}</Form.Text>}
                        </Form.Floating>
                        <Form.Floating className="mb-3">
                            <Form.Control
                                type="email"
                                id="email"
                                placeholder="Email"
                                {...register('email', {
                                    required: 'Email không được bỏ trống',
                                    pattern: {
                                        value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                                        message: 'Địa chỉ email không hợp lệ'
                                    }
                                })}
                            />
                            <Form.Label htmlFor="email">Email</Form.Label>
                            {errors.email && <Form.Text className="text-danger">{errors.email.message}</Form.Text>}
                        </Form.Floating>
                        <Form.Floating className="mb-3">
                            <Form.Control
                                type="password"
                                id="password"
                                placeholder="Mật khẩu"
                                {...register('password', {
                                    required: 'Mật khẩu không được bỏ trống',
                                    minLength: {
                                        value: 6,
                                        message: 'Mật khẩu phải có ít nhất 6 ký tự'
                                    }
                                })}
                            />
                            <Form.Label htmlFor="password">Mật Khẩu</Form.Label>
                            {errors.password && <Form.Text className="text-danger">{errors.password.message}</Form.Text>}
                        </Form.Floating>
                        <div className="d-flex justify-content-end">
                            <Button variant="secondary" onClick={handleCloseModal} className="me-2">
                                Hủy
                            </Button>
                            <Button variant="primary" type="submit">
                                {isEditing ? 'Cập Nhật' : 'Thêmmmm'}
                            </Button>
                        </div>
                    </Form>
                </Modal.Body>
            </Modal>
        </Container>
    );
};

export default Employee;
