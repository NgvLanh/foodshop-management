import { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Form, Table, Modal, Image, Pagination } from 'react-bootstrap';
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa';
import { useForm } from 'react-hook-form';
import { useDropzone } from 'react-dropzone';
import request from '../../../config/apiConfig';
import toast, { Toaster } from 'react-hot-toast';
import { confirmAlert } from 'react-confirm-alert';

const Menu = () => {
  const { register, handleSubmit, setValue, reset, formState: { errors } } = useForm();
  const [showModal, setShowModal] = useState(false);
  const [currentDish, setCurrentDish] = useState(null);
  const [dishes, setDishes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [uploadedImage, setUploadedImage] = useState('');
  const [file, setFile] = useState(null);
  const [imageFileName, setImageFileName] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 5;

  useEffect(() => {
    fetchCategoryData();
    fetchDishData();
  }, []);

  const fetchCategoryData = async () => {
    try {
      const res = await request({
        path: 'categories'
      })
      setCategories(res.data);
    } catch (error) {
      alert(error)
    }
  }

  const fetchDishData = async () => {
    try {
      const res = await request({
        path: 'dishes'
      })
      setDishes(res.data);
    } catch (error) {
      alert(error)
    }
  }

  const handleShowModal = (dish = null) => {
    setCurrentDish(dish);
    if (dish) {
      // Set values for editing
      setValue('name', dish.name);
      setValue('description', dish.description);
      setValue('price', dish.price);
      setValue('salePrice', dish.salePrice);
      setValue('category', dish.category?.id);
      setUploadedImage(dish.image);
      setImageFileName(dish.image);
    } else {
      // Reset form for adding new dish
      reset();
      setImageFileName('');
      setUploadedImage('');
    }
    setShowModal(true);
  };

  const handleCloseModal = () => setShowModal(false);

  const handleStatusChange = async (dish, status) => {
    dish.status = status;
    try {
      const res = await request({
        method: 'PUT',
        path: `dishes/${dish.id}`,
        data: dish,
      });
      fetchDishData();
      if (res.success) {
        toast.success('Món đã được cập nhật!');
      }

    } catch (error) {
      alert(error)
    }
  };

  const onSubmit = async (data) => {
    if (parseFloat(data.salePrice) <= parseFloat(data.price)) {
      toast.error('Giá bán phải lớn hơn giá nhập.');
      return;
    }

    const category = categories.find(c => c.id === parseInt(data.category));

    if (category) {
      data.category = category;
    }

    const newDish = {
      ...data,
      image: imageFileName,
      status: true
    };

    if (currentDish) {
      // Update dish
      try {
        const res = await request({
          method: 'PUT',
          path: `dishes/${currentDish.id}`,
          data: newDish,
        });
        fetchDishData();
        if (res.success) {
          toast.success('Món đã được cập nhật!');
        }

      } catch (error) {
        alert(error)
      }
    } else {
      // Add new dish
      try {
        const res = await request({
          method: 'POST',
          path: 'dishes',
          data: newDish,
        });

        const formData = new FormData();
        formData.append('image', file);
        const res_up = await request({
          method: 'POST',
          path: 'dishes/uploads',
          data: formData,
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        fetchDishData();
        if (res.success) {
          toast.success('Món đã được thêm!');
        }
      } catch (error) {
        alert(error)
      }
    }
    handleCloseModal();
  };
  const handleDeleteDish = async (id) => {
    try {
      await request({
        method: 'DELETE',
        path: `dishes/${id}`,
      })
    } catch (error) {
      alert(error)
    }
    setDishes(dishes.filter(dish => dish.id !== id));
    toast.success('Món đã được xóa!');
  };

  const confirmDelete = (id) => {
    confirmAlert({
      title: 'Xác nhận xóa',
      message: 'Bạn có chắc chắn muốn xóa món ăn này không?',
      buttons: [
        {
          label: 'Có',
          onClick: () => handleDeleteDish(id)
        },
        {
          label: 'Không'
        }
      ]
    });
  };

  const handleDrop = (acceptedFiles) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      setUploadedImage(reader.result);
      setFile(acceptedFiles[0]);
      setImageFileName(acceptedFiles[0].name);
    };
    reader.readAsDataURL(acceptedFiles[0]);
  };

  const { getRootProps, getInputProps } = useDropzone({ onDrop: handleDrop });



  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentDishes = dishes?.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(dishes?.length / itemsPerPage);

  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <Container fluid style={{ background: '#f7f4f4', height: '100vh' }}>
      <Toaster />
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
                  {currentDishes?.map(dish => (
                    <tr key={dish.id}>
                      <td><Image src={`/assets/images/${dish.image}`} thumbnail style={{ width: '100px', height: '80px' }} /></td>
                      <td>{dish.name}</td>
                      <td>{dish.price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</td>
                      <td>{dish.salePrice.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</td>
                      <td>{dish.category?.name}</td>
                      <td>
                        <Form.Check
                          type="checkbox"
                          checked={dish.status}
                          onChange={(e) => handleStatusChange(dish, e.target.checked)}
                        />
                      </td>
                      <td>
                        <Button variant="warning" size="sm" onClick={() => handleShowModal(dish)}>
                          <FaEdit /> Chỉnh Sửa
                        </Button>{' '}
                        <Button variant="danger" size="sm" onClick={() => confirmDelete(dish.id)}>
                          <FaTrash /> Xóa
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
              <Pagination className='d-flex justify-content-center'>
                {[...Array(totalPages)]?.map((_, idx) => (
                  <Pagination.Item
                    key={idx + 1}
                    active={idx + 1 === currentPage}
                    onClick={() => handlePageChange(idx + 1)}
                  >
                    {idx + 1}
                  </Pagination.Item>
                ))}
              </Pagination>
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
                id="dishprice"
                placeholder="Giá nhập"
                {...register('price', { required: 'Giá nhập không được để trống', valueAsNumber: true })}
              />
              <Form.Label htmlFor="dishprice">Giá Nhập</Form.Label>
              {errors.price && <Form.Text className="text-danger">{errors.price.message}</Form.Text>}
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
              <Form.Select
                id="dishCategory"
                {...register('category', { required: 'Danh mục không được để trống' })}
              >
                <option value="">Chọn danh mục</option>
                {categories?.map(category => (
                  <option key={category.id} value={category.id}>{category.name}</option>
                ))}
              </Form.Select>
              <Form.Label htmlFor="dishCategory">Danh Mục</Form.Label>
              {errors.category && <Form.Text className="text-danger">{errors.category.message}</Form.Text>}
            </Form.Floating>
            <Form.Group className="mb-3">
              <Form.Label>Hình Ảnh</Form.Label>
              <div {...getRootProps({ className: 'dropzone border p-3 mb-3 rounded text-center' })}>
                <input {...getInputProps()} />
                <p>Kéo thả hình ảnh vào đây, hoặc nhấp để chọn tệp</p>
                {currentDish ? <Image src={`/assets/images/${uploadedImage}`} thumbnail style={{ width: '150px' }} />
                  : <Image src={`${uploadedImage}`} thumbnail style={{ width: '150px' }} />}
              </div>
            </Form.Group>
            <Button variant="primary" type="submit">
              {currentDish ? 'Cập Nhật' : 'Thêm'}
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default Menu;
