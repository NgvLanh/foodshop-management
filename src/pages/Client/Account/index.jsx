import { useState } from 'react';
import { Form, Button, Container, Row, Col, Tabs, Tab } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import toast, { Toaster } from 'react-hot-toast';
import response from '../../../config/apiConfig'
import { Navigate, useNavigate } from 'react-router-dom';
import { getMyInfo, loginApi } from '../../../services/Auth';
import { useCookies } from 'react-cookie';
import request from '../../../config/apiConfig';
import { jwtDecode } from 'jwt-decode';


const Account = () => {
    const [cookies, setCookie, removeCookie] = useCookies(["token", "role"]);
    const navigate = useNavigate();
    const [key, setKey] = useState('login');
    const { register: login, handleSubmit: handleSubmitLogin, formState: { errors: errorsLogin } } = useForm();
    const { register: register, handleSubmit: handleSubmitRegister, formState: { errors: errorsRegister }, watch } = useForm();

    const onLoginSubmit = async (data) => {
        try {
            const res = await loginApi({
                email: data.email,
                password: data.password
            })

            if (res.authenticated) {
                toast.success('Đăng nhập thành công.');
                setCookie('token', res.token);
                try {
                    const userInfo = await getMyInfo();
                    const roles = userInfo.roles;
                    console.log(roles);
                    if (roles.includes('ADMIN')) {
                        navigate('/admin');
                    } else {
                        navigate('/home');
                    }
                } catch (error) {
                    alert(error);
                }
            } else {
                toast.error('Mật khẩu hoặc email không đúng.');
            }
        } catch (error) {
            alert(error);
        }
    };

    const onRegisterSubmit = async (data) => {
        try {
            const res = await request({
                method: 'POST',
                path: 'users',
                data: data
            });
            
            if (res) {
                toast.success('Đăng ký thành công.');
                setTimeout(() => { window.location.reload() }, 700);
            } else {
                toast.error(res.message);
            }
        } catch (error) {
            alert(error);
        }

    };

    return (
        <Container className="mt-5">
            <Toaster position="top-center" reverseOrder={false} />
            <Tabs
                id="auth-tabs"
                activeKey={key}
                onSelect={(k) => setKey(k)}
                className="mb-3 border-0"
            >
                <Tab eventKey="login" title="Đăng nhập">
                    <Row className="align-items-center">
                        <Col md={6}>
                            <img
                                src="/assets/images/login.webp"
                                alt="Login Illustration"
                                className="img-fluid p-4"
                            />
                        </Col>
                        <Col md={6}>
                            <h2 className='text-center mb-2'>Đăng nhập</h2>
                            <Form onSubmit={handleSubmitLogin(onLoginSubmit)}>
                                <Form.Group className="form-floating mb-3" controlId="formLoginEmail">
                                    <Form.Control
                                        type="email"
                                        placeholder="Nhập email của bạn"
                                        {...login('email', {
                                            required: "Email là bắt buộc",
                                            pattern: {
                                                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                                message: "Email không hợp lệ"
                                            }
                                        })}
                                    />
                                    <Form.Label>Email</Form.Label>
                                    {errorsLogin.email && (
                                        <Form.Text className="text-danger d-block mt-1 ms-1">
                                            {errorsLogin.email.message}
                                        </Form.Text>
                                    )}
                                </Form.Group>

                                <Form.Group className="form-floating mb-3" controlId="formLoginPassword">
                                    <Form.Control
                                        type="password"
                                        placeholder="Nhập mật khẩu của bạn"
                                        {...login('password', { required: "Mật khẩu là bắt buộc" })}
                                    />
                                    <Form.Label>Mật khẩu</Form.Label>
                                    {errorsLogin.password && (
                                        <Form.Text className="text-danger d-block mt-1 ms-1">
                                            {errorsLogin.password.message}
                                        </Form.Text>
                                    )}
                                </Form.Group>

                                <Button variant="primary" type="submit" className="mt-3">
                                    Đăng nhập
                                </Button>
                            </Form>
                        </Col>
                    </Row>
                </Tab>
                <Tab eventKey="register" title="Đăng ký">
                    <Row className="align-items-center">
                        <Col md={6}>
                            <img
                                src="/assets/images/register.jpg"
                                alt="Register Illustration"
                                className="img-fluid p-4"
                            />
                        </Col>
                        <Col md={6}>
                            <h2 className='text-center mb-2'>Đăng ký</h2>
                            <Form onSubmit={handleSubmitRegister(onRegisterSubmit)}>
                                <Form.Group className="form-floating mb-3" controlId="formRegisterName">
                                    <Form.Control
                                        type="text"
                                        placeholder="Nhập tên của bạn"
                                        {...register('fullName', {
                                            required: "Tên là bắt buộc",
                                            minLength: {
                                                value: 2,
                                                message: 'Tên phải có ít nhất 2 ký tự'
                                            }
                                        })}
                                    />
                                    <Form.Label>Họ tên</Form.Label>
                                    {errorsRegister.fullName && (
                                        <Form.Text className="text-danger d-block mt-1 ms-1">
                                            {errorsRegister.fullName.message}
                                        </Form.Text>
                                    )}
                                </Form.Group>

                                <Form.Group className="form-floating mb-3" controlId="formRegisterEmail">
                                    <Form.Control
                                        type="email"
                                        placeholder="Nhập email của bạn"
                                        {...register('email', {
                                            required: "Email là bắt buộc",
                                            pattern: {
                                                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                                message: "Email không hợp lệ"
                                            }
                                        })}
                                    />
                                    <Form.Label>Email</Form.Label>
                                    {errorsRegister.email && (
                                        <Form.Text className="text-danger d-block mt-1 ms-1">
                                            {errorsRegister.email.message}
                                        </Form.Text>
                                    )}
                                </Form.Group>

                                <Form.Group className="form-floating mb-3" controlId="formRegisterPhoneNumber">
                                    <Form.Control
                                        type="text"
                                        placeholder="Nhập số điện thoại của bạn"
                                        {...register('phoneNumber', {
                                            required: "Số điện thoại là bắt buộc",
                                            pattern: {
                                                value: /^[0-9]{10}$/,
                                                message: "Số điện thoại không hợp lệ"
                                            }
                                        })}
                                    />
                                    <Form.Label>Số điện thoại</Form.Label>
                                    {errorsRegister.phoneNumber && (
                                        <Form.Text className="text-danger d-block mt-1 ms-1">
                                            {errorsRegister.phoneNumber.message}
                                        </Form.Text>
                                    )}
                                </Form.Group>

                                <Form.Group className="form-floating mb-3" controlId="formRegisterPassword">
                                    <Form.Control
                                        type="password"
                                        placeholder="Nhập mật khẩu của bạn"
                                        {...register('password', {
                                            required: "Mật khẩu là bắt buộc",
                                            minLength: {
                                                value: 6,
                                                message: 'Mật khẩu phải có ít nhất 6 ký tự'
                                            }
                                        })}
                                    />
                                    <Form.Label>Mật khẩu</Form.Label>
                                    {errorsRegister.password && (
                                        <Form.Text className="text-danger d-block mt-1 ms-1">
                                            {errorsRegister.password.message}
                                        </Form.Text>
                                    )}
                                </Form.Group>

                                <Form.Group className="form-floating mb-3" controlId="formConfirmPassword">
                                    <Form.Control
                                        type="password"
                                        placeholder="Xác nhận mật khẩu"
                                        {...register('confirmPassword', {
                                            required: "Xác nhận mật khẩu là bắt buộc",
                                            validate: value =>
                                                value === watch('password') || "Mật khẩu không khớp"
                                        })}
                                    />
                                    <Form.Label>Xác nhận mật khẩu</Form.Label>
                                    {errorsRegister.confirmPassword && (
                                        <Form.Text className="text-danger d-block mt-1 ms-1">
                                            {errorsRegister.confirmPassword.message}
                                        </Form.Text>
                                    )}
                                </Form.Group>

                                <Button variant="primary" type="submit" className="mt-3">
                                    Đăng ký
                                </Button>
                            </Form>
                        </Col>
                    </Row>
                </Tab>
            </Tabs>
        </Container>
    );
};

export default Account;
