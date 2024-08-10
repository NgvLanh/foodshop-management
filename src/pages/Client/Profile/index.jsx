import React, { useEffect, useState } from 'react';
import { Form, Button, Container, Row, Col, Alert, Spinner } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import toast, { Toaster } from 'react-hot-toast';
import { getMyInfo } from '../../../services/Auth';
import request from '../../../config/apiConfig';
import { Cookies } from 'react-cookie';

const Profile = () => {
    const { register, handleSubmit, reset, formState: { errors } } = useForm();
    const [userInfo, setUserInfo] = useState(null);

    useEffect(() => {
        fetchUserInfo();
    }, [reset]);

    const fetchUserInfo = async () => {
        try {
            const res = await getMyInfo();
            setUserInfo(res);
            reset(res);
        } catch (err) {
            toast.error('Không thể lấy thông tin người dùng');
        }
    };

    const onSubmit = async (data) => {
        try {
            const res = await request({
                method: 'PUT',
                path: `users/${userInfo.id}`,
                data: data,
                header: 'Bearer '
            })
            console.log(res);
            
            if (res) {
                toast.success('Cập nhật thông tin người dùng thành công!');
            }
        } catch (err) {
            toast.error('Cập nhật thông tin người dùng thất bại.');
        }
    };

    const logout = () => {
        const token = new Cookies();
        token.remove('token')
        window.location.reload();
    }

    return (
        <Container>
            <Toaster />
            <Row className="justify-content-md-center">
                <Col md={6}>
                    <h2>Thông Tin Người Dùng</h2>
                    <Form onSubmit={handleSubmit(onSubmit)}>
                        <Form.Group controlId="formName" className="mb-3">
                            <Form.Label>Họ Tên</Form.Label>
                            <Form.Control
                                type="text"
                                {...register('fullName', { required: 'Họ tên là bắt buộc.' })}
                                placeholder="Nhập họ tên"
                            />
                            {errors.fullName && <Alert variant="danger">{errors.fullName.message}</Alert>}
                        </Form.Group>

                        <Form.Group controlId="formEmail" className="mb-3">
                            <Form.Label>Email</Form.Label>
                            <Form.Control
                                type="email"
                                {...register('email', {
                                    required: 'Email là bắt buộc.',
                                    pattern: {
                                        value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                                        message: 'Email không hợp lệ.'
                                    }
                                })}
                                placeholder="Nhập email"
                            />
                            {errors.email && <Alert variant="danger">{errors.email.message}</Alert>}
                        </Form.Group>

                        <Form.Group controlId="formPhone" className="mb-3">
                            <Form.Label>Số Điện Thoại</Form.Label>
                            <Form.Control
                                type="text"
                                {...register('phoneNumber', { required: 'Số điện thoại là bắt buộc.' })}
                                placeholder="Nhập số điện thoại"
                            />
                            {errors.phoneNumber && <Alert variant="danger">{errors.phoneNumber.message}</Alert>}
                        </Form.Group>

                        <Button variant="primary" type="submit">
                            Cập Nhật Thông Tin
                        </Button>
                        &nbsp;
                        <Button variant="secondary" type="button"
                            onClick={logout}>
                            Đăng xuất
                        </Button>
                    </Form>
                </Col>
            </Row>
        </Container>
    );
    };

    export default Profile;
