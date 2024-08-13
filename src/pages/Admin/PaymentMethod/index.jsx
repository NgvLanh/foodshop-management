import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Container, Row, Col, Card, Button, Form, Table, Modal } from 'react-bootstrap';
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa';
import toast, { Toaster } from 'react-hot-toast';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import request from '../../../config/apiConfig';

const PaymentMethod = () => {
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editIndex, setEditIndex] = useState(null);

  const { register, handleSubmit, formState: { errors }, setValue, reset } = useForm();

  useEffect(() => {
    fetchPaymentMethods();
  }, []);

  const fetchPaymentMethods = async () => {
    try {
      const res = await request({ path: 'payment-methods' });
      setPaymentMethods(res);
    } catch (error) {
      console.error('Error fetching payment methods:', error);
    }
  };

  const onSubmit = async (data) => {
    const newPaymentMethod = {
      name: data.name,
      description: data.description,
    };

    try {
      if (isEditing) {
        await request({
          method: 'PUT',
          path: `payment-methods/${paymentMethods[editIndex].id}`,
          data: newPaymentMethod,
          header: 'Bearer '
        });
        toast.success('Cập nhật phương thức thanh toán thành công!');
      } else {
        await request({
          method: 'POST',
          path: 'payment-methods',
          data: newPaymentMethod,
          header: 'Bearer '
        });
        toast.success('Thêm phương thức thanh toán thành công!');
      }

      fetchPaymentMethods();
      reset();
      setShowModal(false);
      setIsEditing(false);
      setEditIndex(null);
    } catch (error) {
      console.error('Error adding/updating payment method:', error);
    }
  };

  const handleEdit = (index) => {
    const paymentMethod = paymentMethods[index];
    setValue('name', paymentMethod.name);
    setValue('description', paymentMethod.description);
    setValue('isOnline', paymentMethod.isOnline);
    setValue('isActive', paymentMethod.isActive);
    setIsEditing(true);
    setEditIndex(index);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    try {
      await request({ method: 'DELETE', path: `payment-methods/${id}`, header: 'Bearer ' });
      fetchPaymentMethods();
      toast.success('Xóa phương thức thanh toán thành công!');
    } catch (error) {
      toast.error('Không thể xoá phương thức thanh toán này do ràng buộc dữ liệu!');
    }
  };

  const confirmDelete = (id) => {
    confirmAlert({
      title: 'Xác nhận xóa',
      message: 'Bạn có chắc chắn muốn xóa phương thức thanh toán này không?',
      buttons: [
        { label: 'Có', onClick: () => handleDelete(id) },
        { label: 'Không' }
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

  const filteredPaymentMethods = paymentMethods?.filter(paymentMethod =>
    paymentMethod.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Container fluid style={{ background: '#f7f4f4', height: '100vh' }}>
      <Toaster />
      <Row className="my-4">
        <Col>
          <h2 className="mb-4">Quản Lý Phương Thức Thanh Toán</h2>
          <Button variant="primary" onClick={handleShowModal}>
            <FaPlus /> Thêm Phương Thức Thanh Toán
          </Button>
        </Col>
      </Row>
      <Row>
        <Col>
          <Card className='rounded-0'>
            <Card.Body>
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th>Tên Phương Thức</th>
                    <th>Chi Tiết</th>
                    <th>Trực Tuyến</th>
                    <th>Hoạt Động</th>
                    <th>Hành Động</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPaymentMethods?.reverse().map((paymentMethod, index) => (
                    <tr key={paymentMethod.id}>
                      <td>{paymentMethod.name}</td>
                      <td>{paymentMethod.description}</td>
                      <td>{paymentMethod.isOnline ? 'Có' : 'Không'}</td>
                      <td>{paymentMethod.isActive ? 'Đang hoạt động' : 'Không hoạt động'}</td>
                      <td>
                        <Button variant="warning" size="sm" onClick={() => handleEdit(index)}>
                          <FaEdit /> Sửa
                        </Button>{' '}
                        <Button variant="danger" size="sm" onClick={() => confirmDelete(paymentMethod.id)}>
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
          <Modal.Title>{isEditing ? 'Sửa Phương Thức Thanh Toán' : 'Thêm Phương Thức Thanh Toán'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit(onSubmit)}>
            <Form.Floating className="mb-3">
              <Form.Control
                type="text"
                id="name"
                placeholder="Tên phương thức"
                {...register('name', {
                  required: 'Tên phương thức không được bỏ trống'
                })}
              />
              <Form.Label htmlFor="name">Tên Phương Thức</Form.Label>
              {errors.name && <Form.Text className="text-danger">{errors.name.message}</Form.Text>}
            </Form.Floating>
            <Form.Floating className="mb-3">
              <Form.Control
                as="textarea"
                id="description"
                placeholder="Mô tả"
                {...register('description', {
                  required: 'Mô tả không được bỏ trống'
                })}
              />
              <Form.Label htmlFor="description">Mô tả</Form.Label>
              {errors.description && <Form.Text className="text-danger">{errors.description.message}</Form.Text>}
            </Form.Floating>
            <div className="d-flex justify-content-end">
              <Button variant="secondary" onClick={handleCloseModal} className="me-2">
                Hủy
              </Button>
              <Button variant="primary" type="submit">
                {isEditing ? 'Cập Nhật' : 'Thêm'}
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default PaymentMethod;
