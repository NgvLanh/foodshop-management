import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Container, Row, Col, Card, Button, Form, Table, Modal } from 'react-bootstrap';
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa';
import toast, { Toaster } from 'react-hot-toast';
import './style.css';

const Discount = () => {
    const getCurrentDate = () => {
        const today = new Date();
        const yyyy = today.getFullYear();
        const mm = String(today.getMonth() + 1).padStart(2, '0');
        const dd = String(today.getDate()).padStart(2, '0');
        return `${yyyy}-${mm}-${dd}`;
    };

    const { register, handleSubmit, formState: { errors }, setValue, reset } = useForm({
        defaultValues: {
            startDate: getCurrentDate()
        }
    });
    const [discounts, setDiscounts] = useState([]);
    const [formSubmitted, setFormSubmitted] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editIndex, setEditIndex] = useState(null);

    const generateRandomCode = () => {
        return Math.random().toString(36).substring(2, 10).toUpperCase();
    };

    const onSubmit = data => {
        const newDiscount = {
            code: isEditing ? discounts[editIndex].code : generateRandomCode(),
            startDate: isEditing ? discounts[editIndex].startDate : getCurrentDate(), // Keep startDate for editing
            endDate: data.endDate,
            quantity: data.quantity,
            quota: data.quota,
            percentage: data.percentage
        };

        if (isEditing) {
            const updatedDiscounts = discounts.map((discount, index) =>
                index === editIndex ? newDiscount : discount
            );
            setDiscounts(updatedDiscounts);
            toast.success('Đã cập nhật giảm giá thành công!');
            setIsEditing(false);
            setEditIndex(null);
        } else {
            setDiscounts([...discounts, newDiscount]);
            toast.success('Đã thêm giảm giá thành công!');
        }

        setFormSubmitted(true);
        reset(); // Reset form fields after submission
        setShowModal(false); // Close modal after submission
    };

    const filteredDiscounts = discounts.filter(discount =>
        discount.code.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleEdit = index => {
        const discount = discounts[index];
        setValue('endDate', discount.endDate);
        setValue('quantity', discount.quantity);
        setValue('quota', discount.quota);
        setValue('percentage', discount.percentage);
        setIsEditing(true);
        setEditIndex(index);
        setShowModal(true);
    };

    const handleDelete = code => {
        setDiscounts(discounts.filter(discount => discount.code !== code));
        toast.success('Đã xóa giảm giá thành công!');
    };

    const handleShowModal = () => {
        reset();
        setIsEditing(false);
        setEditIndex(null);
        setShowModal(true);
    };

    const handleCloseModal = () => setShowModal(false);

    return (
        <Container fluid style={{ background: '#f7f4f4', height: '100vh' }}>
            <Toaster />
            <Row className="my-4">
                <Col>
                    <h2 className="mb-4">Quản Lý Giảm Giá</h2>
                    <Button variant="primary" onClick={handleShowModal}>
                        <FaPlus /> Thêm Giảm Giá
                    </Button>
                </Col>
            </Row>
            <Row>
                <Col>
                    <Card>
                        <Card.Body>
                            <Form.Group as={Row} className="mb-3 d-flex justify-content-end">
                                <Col md={4}>
                                    <Form.Control
                                        type="text"
                                        placeholder="Tìm kiếm theo mã giảm giá"
                                        value={searchTerm}
                                        onChange={e => setSearchTerm(e.target.value)}
                                    />
                                </Col>
                            </Form.Group>
                            <Table striped bordered hover>
                                <thead>
                                    <tr>
                                        <th>Mã</th>
                                        <th>Ngày bắt đầu</th>
                                        <th>Ngày kết thúc</th>
                                        <th>Số lượng</th>
                                        <th>Hạn mức</th>
                                        <th>Phần trăm</th>
                                        <th>Hành Động</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredDiscounts.map((discount, index) => (
                                        <tr key={index}>
                                            <td>{discount.code}</td>
                                            <td>{discount.startDate}</td>
                                            <td>{discount.endDate}</td>
                                            <td>{discount.quantity}</td>
                                            <td>{discount.quota}</td>
                                            <td>{discount.percentage}%</td>
                                            <td>
                                                <Button variant="warning" size="sm" onClick={() => handleEdit(index)}>
                                                    <FaEdit /> Sửa
                                                </Button>{' '}
                                                <Button variant="danger" size="sm" onClick={() => handleDelete(discount.code)}>
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
                    <Modal.Title>{isEditing ? 'Sửa Giảm Giá' : 'Thêm Giảm Giá'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleSubmit(onSubmit)}>
                        <Form.Floating className="mb-3">
                            <Form.Control
                                type="date"
                                id="endDate"
                                placeholder="Ngày kết thúc"
                                {...register('endDate', {
                                    required: 'Ngày kết thúc không được bỏ trống',
                                    validate: value => value >= getCurrentDate() || 'Ngày kết thúc không thể trước ngày hiện tại'
                                })}
                            />
                            <Form.Label htmlFor="endDate">Ngày Kết Thúc</Form.Label>
                            {errors.endDate && <Form.Text className="text-danger">{errors.endDate.message}</Form.Text>}
                        </Form.Floating>
                        <Form.Floating className="mb-3">
                            <Form.Control
                                type="number"
                                id="quantity"
                                placeholder="Số lượng"
                                {...register('quantity', {
                                    required: 'Số lượng không được bỏ trống',
                                    min: { value: 1, message: 'Số lượng phải lớn hơn 0' },
                                    max: { value: 20, message: 'Số lượng phải nhỏ hơn hoặc bằng 20' }
                                })}
                            />
                            <Form.Label htmlFor="quantity">Số Lượng</Form.Label>
                            {errors.quantity && <Form.Text className="text-danger">{errors.quantity.message}</Form.Text>}
                        </Form.Floating>
                        <Form.Floating className="mb-3">
                            <Form.Control
                                type="number"
                                id="quota"
                                placeholder="Hạn mức"
                                {...register('quota', {
                                    required: 'Hạn mức không được bỏ trống',
                                    min: { value: 100, message: 'Hạn mức phải lớn hơn 100' }
                                })}
                            />
                            <Form.Label htmlFor="quota">Hạn Mức</Form.Label>
                            {errors.quota && <Form.Text className="text-danger">{errors.quota.message}</Form.Text>}
                        </Form.Floating>
                        <Form.Floating className="mb-3">
                            <Form.Control
                                type="number"
                                id="percentage"
                                placeholder="Phần trăm"
                                {...register('percentage', {
                                    required: 'Phần trăm không được bỏ trống',
                                    min: { value: 1, message: 'Phần trăm phải lớn hơn 0' },
                                    max: { value: 30, message: 'Phần trăm phải nhỏ hơn hoặc bằng 30' }
                                })}
                            />
                            <Form.Label htmlFor="percentage">Phần Trăm</Form.Label>
                            {errors.percentage && <Form.Text className="text-danger">{errors.percentage.message}</Form.Text>}
                        </Form.Floating>
                        <Button variant="secondary" type="reset" className="mt-3 me-2" onClick={() => { reset(); setIsEditing(false); setEditIndex(null); }}>
                            Reset
                        </Button>
                        <Button variant="primary" type="submit" className="mt-3">
                            {isEditing ? 'Lưu' : 'Thêm'}
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>
        </Container>
    );
};

export default Discount;
