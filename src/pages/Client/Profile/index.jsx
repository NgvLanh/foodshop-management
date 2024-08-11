import React, { useEffect, useState } from 'react';
import { Form, Button, Container, Row, Col, Alert, Spinner, Card, ListGroup } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import toast, { Toaster } from 'react-hot-toast';
import { getMyInfo } from '../../../services/Auth';
import request from '../../../config/apiConfig';
import { Cookies } from 'react-cookie';
import './style.css'
import { PiX } from 'react-icons/pi';
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
        <Container className="mt-4">
            <Row className="justify-content-center">
                <Col xl={3} md={4} sm={11} className="d-flex flex-column align-items-center bg-c-lite-green text-white rounded p-3 me-3">
                    <Card.Body className="text-center">
                        <div className="mb-4">
                            <img
                                src="/assets/images/logo.png"
                                roundedCircle
                                height="250"
                                alt="User-Profile-Image"
                            />
                            <h6 className="font-weight-bold mt-3">Ảnh đại diện</h6>
                        </div>
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
    //     <Container>
    //         <Toaster />
    //         <Row className="justify-content-md-center">

    //             <h2>Thông Tin Người Dùng</h2>

    //             <Form onSubmit={handleSubmit(onSubmit)}>
    //                 <Row className='justify-content-md-center'>
    //                     <Col md={2}><Form.Label>Ảnh đại diện</Form.Label>
    //                         <Form.Group controlId="formImage" className="mb-3">
    //                             <img
    //                                 src="/assets/images/aofpt.png"
    //                                 height="125"
    //                                 alt='logo' loading="lazy"
    //                             />
    //                         </Form.Group></Col>

    //                     <Col md={4}>
    //                         <Form.Group controlId="formName" className="mb-3">
    //                             <Form.Label>Họ Tên</Form.Label>
    //                             <Form.Control
    //                                 type="text"
    //                                 {...register('fullName', { required: 'Họ tên là bắt buộc.' })}
    //                                 placeholder="Nhập họ tên"
    //                             />
    //                             {errors.fullName && <Alert variant="danger">{errors.fullName.message}</Alert>}
    //                         </Form.Group>
    //                         <Form.Group controlId="formPhone" className="mb-3">
    //                             <Form.Label>Số Điện Thoại</Form.Label>
    //                             <Form.Control
    //                                 type="text"
    //                                 {...register('phoneNumber', { required: 'Số điện thoại là bắt buộc.' })}
    //                                 placeholder="Nhập số điện thoại"
    //                             />
    //                             {errors.phoneNumber && <Alert variant="danger">{errors.phoneNumber.message}</Alert>}
    //                         </Form.Group>

    //                         <Button variant="primary" type="submit">
    //                             Cập Nhật Thông Tin
    //                         </Button>
    //                         &nbsp;
    //                         <Button variant="secondary" type="button"
    //                             onClick={logout}>
    //                             Đăng xuất
    //                         </Button>
    //                     </Col>
    //                 </Row>


    //             </Form>

    //         </Row>
    //     </Container>
    // );
};

export default Profile;

{/* <Form.Group controlId="formEmail" className="mb-3">
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
                        </Form.Group> */}