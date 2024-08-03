import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Container, Row, Col, Card, Button, Form, Table, Modal } from 'react-bootstrap';
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa';
import toast, { Toaster } from 'react-hot-toast';
import './style.css';
import request from '../../../config/apiConfig';

const Discount = () => {
    const [discounts, setDiscounts] = useState([]);
    const [formSubmitted, setFormSubmitted] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editIndex, setEditIndex] = useState(null);

    const { register, handleSubmit, formState: { errors }, setValue, reset } = useForm({
        defaultValues: {
            dateEnd: '',
            quantity: '',
            quota: '',
            percentNumber: ''
        }
    });

    useEffect(() => {
        fillDataDiscount();
    }, []);

    const fillDataDiscount = async () => {
        try {
            const res = await request({
                path: 'discounts'
            });
            setDiscounts(res.data);
        } catch (error) {
            console.log('Error getting discounts:', error);
        }
    };

    const onSubmit = async (data) => {
        const newDiscount = {
            code: isEditing ? discounts[editIndex].code : generateRandomCode(),
            createAt: isEditing ? discounts[editIndex].createAt : getCurrentDate(),
            dateEnd: data.dateEnd,
            quantity: Number(data.quantity),
            quota: Number(data.quota),
            percentNumber: data.percentNumber
        };

        try {
            if (isEditing) {
                await request({
                    method: 'PUT',
                    path: `discounts/${discounts[editIndex].id}`,
                    data: newDiscount
                });
                fillDataDiscount();
                toast.success('Đã cập nhật giảm giá thành công!');
            } else {
                await request({
                    method: 'POST',
                    path: 'discounts',
                    data: newDiscount
                });
                fillDataDiscount();
                toast.success('Đã thêm giảm giá thành công!');
            }

            setFormSubmitted(true);
            reset();
            setShowModal(false);
            setIsEditing(false);
            setEditIndex(null);
        } catch (error) {
            console.log('Error adding/updating discount:', error);
        }
    };

    const handleEdit = (index) => {
        const discount = discounts[index];
        setValue('dateEnd', discount.dateEnd);
        setValue('quantity', discount.quantity);
        setValue('quota', discount.quota);
        setValue('percentNumber', discount.percentNumber);
        setIsEditing(true);
        setEditIndex(index);
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        try {
            await request({
                method: 'DELETE',
                path: `discounts/${id}`
            });
            fillDataDiscount();
            toast.success('Đã xóa giảm giá thành công!');
        } catch (error) {
            console.log('Error deleting discount:', error);
        }
    };

    const getCurrentDate = () => {
        const today = new Date();
        const yyyy = today.getFullYear();
        const mm = String(today.getMonth() + 1).padStart(2, '0');
        const dd = String(today.getDate()).padStart(2, '0');
        return `${yyyy}-${mm}-${dd}`;
    };

    const generateRandomCode = () => {
        return Math.random().toString(36).substring(2, 10).toUpperCase();
    };

    const handleShowModal = () => {
        reset();
        setIsEditing(false);
        setEditIndex(null);
        setShowModal(true);
    };

    const handleCloseModal = () => setShowModal(false);

    const filteredDiscounts = discounts.filter(discount =>
        discount.code.toLowerCase().includes(searchTerm.toLowerCase())
    );

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
                                        <tr key={discount.id}>
                                            <td>{discount.code}</td>
                                            <td>{discount.createAt}</td>
                                            <td>{discount.dateEnd}</td>
                                            <td>{discount.quantity}</td>
                                            <td>{discount.quota}</td>
                                            <td>{discount.percentNumber}%</td>
                                            <td>
                                                <Button variant="warning" size="sm" onClick={() => handleEdit(index)}>
                                                    <FaEdit /> Sửa
                                                </Button>{' '}
                                                <Button variant="danger" size="sm" onClick={() => handleDelete(discount.id)}>
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
                                id="dateEnd"
                                placeholder="Ngày kết thúc"
                                {...register('dateEnd', {
                                    required: 'Ngày kết thúc không được bỏ trống',
                                    validate: value => value >= getCurrentDate() || 'Ngày kết thúc không thể trước ngày hiện tại'
                                })}
                            />
                            <Form.Label htmlFor="dateEnd">Ngày Kết Thúc</Form.Label>
                            {errors.dateEnd && <Form.Text className="text-danger">{errors.dateEnd.message}</Form.Text>}
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
                                id="percentNumber"
                                placeholder="Phần trăm"
                                {...register('percentNumber', {
                                    required: 'Phần trăm không được bỏ trống',
                                    min: { value: 1, message: 'Phần trăm phải lớn hơn 0' },
                                    max: { value: 30, message: 'Phần trăm phải nhỏ hơn hoặc bằng 30' }
                                })}
                            />
                            <Form.Label htmlFor="percentNumber">Phần Trăm</Form.Label>
                            {errors.percentNumber && <Form.Text className="text-danger">{errors.percentNumber.message}</Form.Text>}
                        </Form.Floating>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={handleCloseModal}>
                                Đóng
                            </Button>
                            <Button type="submit" variant="primary">
                                {isEditing ? 'Lưu Thay Đổi' : 'Thêm Giảm Giá'}
                            </Button>
                        </Modal.Footer>
                    </Form>
                </Modal.Body>
            </Modal>
        </Container>
    );
};

export default Discount;
