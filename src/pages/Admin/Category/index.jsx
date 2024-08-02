import { useState } from 'react';
import { Col, Form, Button, FloatingLabel, Table, Container, Row, Card, Modal } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import toast, { Toaster } from 'react-hot-toast';
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa';
import './style.css';

const Category = () => {
  const { register, handleSubmit, setValue, reset, formState: { errors } } = useForm();
  const [categories, setCategories] = useState([
    { id: 1, name: 'Món khai vị', details: 'Các món khai vị như salad, súp' },
    { id: 2, name: 'Món chính', details: 'Các món ăn chính như thịt, cá, cơm' },
    { id: 3, name: 'Tráng miệng', details: 'Các món tráng miệng như bánh ngọt, kem' },
    { id: 4, name: 'Đồ uống', details: 'Các loại đồ uống như nước trái cây, soda' },
  ]);
  const [currentCategory, setCurrentCategory] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const handleShowModal = (category = null) => {
    setCurrentCategory(category);
    if (category) {
      setValue('name', category.name);
      setValue('details', category.details);
    } else {
      reset();
    }
    setShowModal(true);
  };

  const handleCloseModal = () => setShowModal(false);

  const onSubmit = (data) => {
    const newCategory = {
      id: currentCategory ? currentCategory.id : Date.now(),
      ...data,
    };

    if (currentCategory) {
      setCategories(categories.map(category =>
        category.id === currentCategory.id ? newCategory : category
      ));
      toast.success('Danh mục đã được cập nhật!');
    } else {
      setCategories([...categories, newCategory]);
      toast.success('Danh mục đã được thêm!');
    }

    handleCloseModal();
  };

  const handleDeleteCategory = (id) => {
    setCategories(categories.filter(category => category.id !== id));
    toast.success('Danh mục đã được xóa!');
  };

  return (
    <Container fluid style={{ background: '#f7f4f4', height: '100vh' }}>
      <Toaster />
      <Row className="my-4">
        <Col>
          <h2 className="mb-4">Quản Lý Danh Mục</h2>
          <Button variant="primary" onClick={() => handleShowModal()}>
            <FaPlus /> Thêm Danh Mục Mới
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
                  {categories.map(category => (
                    <tr key={category.id}>
                      <td>{category.name}</td>
                      <td>{category.details}</td>
                      <td>
                        <Button variant="warning" size="sm" onClick={() => handleShowModal(category)}>
                          <FaEdit /> Chỉnh Sửa
                        </Button>{' '}
                        <Button variant="danger" size="sm" onClick={() => handleDeleteCategory(category.id)}>
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
          <Modal.Title>{currentCategory ? 'Chỉnh Sửa Danh Mục' : 'Thêm Danh Mục Mới'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit(onSubmit)}>
            <FloatingLabel controlId="name" label="Tên Danh Mục" className="mb-3">
              <Form.Control
                type="text"
                placeholder="Tên danh mục"
                {...register('name', { required: 'Tên danh mục không được để trống' })}
              />
              {errors.name && <Form.Text className="text-danger">{errors.name.message}</Form.Text>}
            </FloatingLabel>
            <FloatingLabel controlId="details" label="Chi Tiết" className="mb-3">
              <Form.Control
                as="textarea"
                placeholder="Chi tiết"
                {...register('details', { required: 'Chi tiết không được để trống' })}
              />
              {errors.details && <Form.Text className="text-danger">{errors.details.message}</Form.Text>}
            </FloatingLabel>
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

export default Category;
