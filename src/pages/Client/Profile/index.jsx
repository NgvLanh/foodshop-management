import React, { useEffect, useState } from 'react';
import { Form, Button, Container, Row, Col, Alert, Spinner, Card, Image } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import toast, { Toaster } from 'react-hot-toast';
import { getMyInfo } from '../../../services/Auth';
import request from '../../../config/apiConfig';
import { Cookies } from 'react-cookie';
import './style.css'
import { useDropzone } from 'react-dropzone';
import './style.css'

const Profile = () => {
    const { register, handleSubmit, reset, formState: { errors } } = useForm();
    const [userInfo, setUserInfo] = useState(null);
    const [uploadedImage, setUploadedImage] = useState('');
    const [file, setFile] = useState(null);
    const [imageFileName, setImageFileName] = useState('');

    useEffect(() => {
        fetchUserInfo();
    }, [reset]);

    const fetchUserInfo = async () => {
        try {
            const res = await getMyInfo();
            setUserInfo(res);
            if (res.image) {
                setUploadedImage(`/file/${res.image}`);
            }
            reset(res);
        } catch (err) {
            toast.error('Không thể lấy thông tin người dùng');
        }
    };

    const onSubmit = async (data) => {
        try {
            if (file) {
                await uploadFile();
            }
            const res = await request({
                method: 'PUT',
                path: `users/${userInfo.id}`,
                data: {
                    ...data,
                    image: imageFileName
                },
                header: 'Bearer '
            })
            if (res) {
                toast.success('Cập nhật thông tin người dùng thành công!');
            }
        } catch (err) {
            alert(err)
            toast.error('Cập nhật thông tin người dùng thất bại.');
        }
        window.location.reload();
    };


    const logout = () => {
        const token = new Cookies();
        token.remove('token')
        window.location.reload();
    }

    const uploadFile = async () => {
        const formData = new FormData();
        formData.append('image', file);
        await request({
            method: 'POST',
            path: 'dishes/uploads',
            data: formData,
            header: 'Bearer ',
            headers: { 'Content-Type': 'multipart/form-data' }
        });
    }

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

    return (
        <Container className="mt-4">
            <Row className="justify-content-center">
                <Col xl={3} md={4} sm={11} className="d-flex flex-column align-items-center bg-c-lite-green text-white rounded p-3 me-3">
                    <Card.Body className="text-center">
                        <Form.Group className="mb-3">
                            <Form.Label>Ảnh đại diện</Form.Label>
                            <div {...getRootProps({ className: 'dropzone border p-3 mb-3 rounded text-center' })}>
                                <input {...getInputProps()} />
                                {
                                        userInfo?.image
                                        ?
                                        <Image src={`${uploadedImage}`} thumbnail style={{ width: '150px' }} />
                                        :
                                        <Image src='/assets/images/logo.png' thumbnail style={{ width: '150px' }} />
                                }
                                <p className='mt-2'>Chọn để tải ảnh mới</p>
                            </div>
                        </Form.Group>
                    </Card.Body>
                </Col>
                <Col xl={6} md={7} sm={12}>
                    <Form onSubmit={handleSubmit(onSubmit)}>
                        <Card className="user-card-full">
                            <Card.Body>
                                <h6 className="mb-4 pb-2 border-bottom font-weight-bold">Thông Tin Người Dùng</h6>
                                <Row>
                                    <Col sm={12}>
                                        <Form.Group controlId="formName" className="mb-3">
                                            <Form.Label className='mb-2 font-weight-bold'>Họ Tên</Form.Label>
                                            <Form.Control
                                                className='text-muted font-weight-light'
                                                type="text"
                                                {...register('fullName', { required: 'Họ tên là bắt buộc.' })}
                                                placeholder="Nhập họ tên"
                                            />
                                            {errors.fullName && <Alert variant="danger">{errors.fullName.message}</Alert>}
                                        </Form.Group>
                                    </Col>
                                    <Col sm={12}>
                                        <Form.Group controlId="formPhone" className="mb-3">
                                            <Form.Label className='mb-2 font-weight-bold'>Số Điện Thoại</Form.Label>
                                            <Form.Control
                                                className='text-muted font-weight-light'
                                                type="text"
                                                {...register('phoneNumber', { required: 'Số điện thoại là bắt buộc.' })}
                                                placeholder="Nhập số điện thoại"
                                            />
                                            {errors.phoneNumber && <Alert variant="danger">{errors.phoneNumber.message}</Alert>}
                                        </Form.Group>
                                    </Col>
                                </Row>
                                <div className='mt-3'>
                                    <Button variant="primary" type="submit">
                                        Cập Nhật
                                    </Button>
                                    &nbsp;

                                    <Button variant="secondary" type="button" onClick={logout}>
                                        Đăng xuất
                                    </Button>
                                </div>
                            </Card.Body>
                        </Card>
                    </Form>
                </Col>
            </Row>
        </Container>
    );
};

export default Profile;
