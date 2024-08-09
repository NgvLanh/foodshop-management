import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Container, Row, Col, Card, Button, Form, Table, Modal } from 'react-bootstrap';
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa';
import toast, { Toaster } from 'react-hot-toast';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import './style.css';
import request from '../../../config/apiConfig';

const Category = () => {
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editIndex, setEditIndex] = useState(null);

  const { register, handleSubmit, formState: { errors }, setValue, reset } = useForm();

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await request({ path: 'categories' });
      setCategories(res);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const onSubmit = async (data) => {
    const newCategory = {
      name: data.name,
      description: data.description,
    };

    try {
      if (isEditing) {
        await request({
          method: 'PUT',
          path: `categories/${categories[editIndex].id}`,
          data: newCategory,
          header: 'Bearer '
        });
        toast.success('Cập nhật danh mục thành công!');
      } else {
        await request({
          method: 'POST',
          path: 'categories',
          data: newCategory,
          header: 'Bearer '
        });
        toast.success('Thêm danh mục thành công!');
      }

      fetchCategories();
      reset();
      setShowModal(false);
      setIsEditing(false);
      setEditIndex(null);
    } catch (error) {
      console.error('Error adding/updating category:', error);
    }
  };

  const handleEdit = (index) => {
    const category = categories[index];
    setValue('name', category.name);
    setValue('description', category.description);
    setIsEditing(true);
    setEditIndex(index);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    try {
      await request({ method: 'DELETE', path: `categories/${id}`, header: 'Bearer ' });
      fetchCategories();
      toast.success('Xóa danh mục thành công!');
    } catch (error) {
      console.error('Error deleting category:', error);
    }
  };

  const confirmDelete = (id) => {
    confirmAlert({
      title: 'Xác nhận xóa',
      message: 'Bạn có chắc chắn muốn xóa danh mục này không?',
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

  const filteredCategories = categories?.filter(category =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Container fluid style={{ background: '#f7f4f4', height: '100vh' }}>
      <Toaster />
      <Row className="my-4">
        <Col>
          <h2 className="mb-4">Quản Lý Danh Mục</h2>
          <Button variant="primary" onClick={handleShowModal}>
            <FaPlus /> Thêm Danh Mục
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
                    <th>Tên Danh Mục</th>
                    <th>Chi Tiết</th>
                    <th>Hành Động</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCategories?.map((category, index) => (
                    <tr key={category.id}>
                      <td>{category.name}</td>
                      <td>{category.description}</td>
                      <td>
                        <Button variant="warning" size="sm" onClick={() => handleEdit(index)}>
                          <FaEdit /> Sửa
                        </Button>{' '}
                        <Button variant="danger" size="sm" onClick={() => confirmDelete(category.id)}>
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
          <Modal.Title>{isEditing ? 'Sửa Danh Mục' : 'Thêm Danh Mục'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit(onSubmit)}>
            <Form.Floating className="mb-3">
              <Form.Control
                type="text"
                id="name"
                placeholder="Tên danh mục"
                {...register('name', {
                  required: 'Tên danh mục không được bỏ trống'
                })}
              />
              <Form.Label htmlFor="name">Tên Danh Mục</Form.Label>
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

export default Category;
