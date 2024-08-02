import { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Form, Table, Modal, Image } from 'react-bootstrap';
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa';
import { useForm } from 'react-hook-form';
import { useDropzone } from 'react-dropzone';
import toast, { Toaster } from 'react-hot-toast';

const Menu = () => {
  const { register, handleSubmit, setValue, reset, formState: { errors } } = useForm();
  const [showModal, setShowModal] = useState(false);
  const [currentDish, setCurrentDish] = useState(null);
  const [dishes, setDishes] = useState([
    { id: 1, name: 'Món 1', description: 'Mô tả món 1', purchasePrice: 30000, salePrice: 50000, category: 'Category 1', image: '/path/to/image1.jpg', status: true },
    { id: 2, name: 'Món 2', description: 'Mô tả món 2', purchasePrice: 50000, salePrice: 75000, category: 'Category 2', image: '/path/to/image2.jpg', status: false },
  ]);
  const [categories, setCategories] = useState([
    { id: 1, name: 'Category 1' },
    { id: 2, name: 'Category 2' },
  ]);
  const [uploadedImage, setUploadedImage] = useState('');

  useEffect(() => {
    // Fetch categories from the server or use local data
  }, []);

  const handleShowModal = (dish = null) => {
    setCurrentDish(dish);
    if (dish) {
      // Set values for editing
      setValue('name', dish.name);
      setValue('description', dish.description);
      setValue('purchasePrice', dish.purchasePrice);
      setValue('salePrice', dish.salePrice);
      setValue('category', dish.category);
      setValue('status', dish.status);
      setUploadedImage(dish.image);
    } else {
      // Reset form for adding new dish
      reset();
      setUploadedImage('');
      setValue('status', true);
    }
    setShowModal(true);
  };

  const handleCloseModal = () => setShowModal(false);

  const onSubmit = (data) => {
    if (parseFloat(data.salePrice) <= parseFloat(data.purchasePrice)) {
      toast.error('Giá bán phải lớn hơn giá nhập.');
      return;
    }

    const newDish = {
      id: currentDish ? currentDish.id : Date.now(),
      ...data,
      image: uploadedImage,
      status: true
    };

    if (currentDish) {
      // Update existing dish
      setDishes(dishes.map(dish =>
        dish.id === currentDish.id ? newDish : dish
      ));
      toast.success('Món đã được cập nhật!');
    } else {
      // Add new dish
      setDishes([...dishes, newDish]);
      toast.success('Món đã được thêm!');
    }

    handleCloseModal();
  };

  const handleDeleteDish = (id) => {
    setDishes(dishes.filter(dish => dish.id !== id));
    toast.success('Món đã được xóa!');
  };

  const handleDrop = (acceptedFiles) => {
    const file = acceptedFiles[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      setUploadedImage(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const { getRootProps, getInputProps } = useDropzone({ onDrop: handleDrop });

  const handleStatusChange = (id, status) => {
    setDishes(dishes.map(dish =>
      dish.id === id ? { ...dish, status } : dish
    ));
  };

  return (
    <Container fluid style={{ background: '#f7f4f4', height: '100vh' }}>
      <Toaster/>
      <Row className="my-4">
        <Col>
          <h2 className="mb-4">Quản Lý Thực Đơn</h2>
          <Button variant="primary" onClick={() => handleShowModal()}>
            <FaPlus /> Thêm Món Mới
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
                    <th>Hình Ảnh</th>
                    <th>Tên Món</th>
                    <th>Giá Nhập</th>
                    <th>Giá Bán</th>
                    <th>Danh Mục</th>
                    <th>Trạng Thái</th>
                    <th>Hành Động</th>
                  </tr>
                </thead>
                <tbody>
                  {dishes.map(dish => (
                    <tr key={dish.id}>
                      <td><Image src={dish.image} thumbnail style={{ width: '100px' }} /></td>
                      <td>{dish.name}</td>
                      <td>{dish.purchasePrice.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</td>
                      <td>{dish.salePrice.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</td>
                      <td>{dish.category}</td>
                      <td>
                        <Form.Check
                          type="checkbox"
                          checked={dish.status}
                          onChange={(e) => handleStatusChange(dish.id, e.target.checked)}
                        />
                      </td>
                      <td>
                        <Button variant="warning" size="sm" onClick={() => handleShowModal(dish)}>
                          <FaEdit /> Chỉnh Sửa
                        </Button>{' '}
                        <Button variant="danger" size="sm" onClick={() => handleDeleteDish(dish.id)}>
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
          <Modal.Title>{currentDish ? 'Chỉnh Sửa Món' : 'Thêm Món Mới'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit(onSubmit)}>
            <Form.Floating className="mb-3">
              <Form.Control
                type="text"
                id="dishName"
                placeholder="Tên món"
                {...register('name', { required: 'Tên món không được để trống' })}
              />
              <Form.Label htmlFor="dishName">Tên Món</Form.Label>
              {errors.name && <Form.Text className="text-danger">{errors.name.message}</Form.Text>}
            </Form.Floating>
            <Form.Floating className="mb-3">
              <Form.Control
                type="text"
                id="dishDescription"
                placeholder="Mô tả món"
                {...register('description', { required: 'Mô tả không được để trống' })}
              />
              <Form.Label htmlFor="dishDescription">Mô Tả</Form.Label>
              {errors.description && <Form.Text className="text-danger">{errors.description.message}</Form.Text>}
            </Form.Floating>
            <Form.Floating className="mb-3">
              <Form.Control
                type="number"
                id="dishPurchasePrice"
                placeholder="Giá nhập"
                {...register('purchasePrice', { required: 'Giá nhập không được để trống', valueAsNumber: true })}
              />
              <Form.Label htmlFor="dishPurchasePrice">Giá Nhập</Form.Label>
              {errors.purchasePrice && <Form.Text className="text-danger">{errors.purchasePrice.message}</Form.Text>}
            </Form.Floating>
            <Form.Floating className="mb-3">
              <Form.Control
                type="number"
                id="dishSalePrice"
                placeholder="Giá bán"
                {...register('salePrice', { required: 'Giá bán không được để trống', valueAsNumber: true })}
              />
              <Form.Label htmlFor="dishSalePrice">Giá Bán</Form.Label>
              {errors.salePrice && <Form.Text className="text-danger">{errors.salePrice.message}</Form.Text>}
            </Form.Floating>
            <Form.Floating className="mb-3">
              <Form.Control as="select" id="dishCategory" {...register('category', { required: 'Danh mục không được để trống' })}>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.name}>{cat.name}</option>
                ))}
              </Form.Control>
              <Form.Label htmlFor="dishCategory">Danh Mục</Form.Label>
              {errors.category && <Form.Text className="text-danger">{errors.category.message}</Form.Text>}
            </Form.Floating>
            <Form.Group className="mb-3">
              <Form.Label>Hình Ảnh</Form.Label>
              <div {...getRootProps({ className: 'dropzone border p-3 mb-3 rounded' })}>
                <input {...getInputProps()} />
                <p>Kéo thả hình ảnh vào đây, hoặc nhấp để chọn tệp</p>
                {uploadedImage && <Image src={uploadedImage} thumbnail style={{ width: '150px' }} />}
              </div>
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

export default Menu;
