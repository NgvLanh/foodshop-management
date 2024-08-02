import { useState } from 'react';
import { Form, Button, Container, Row, Col, Tabs, Tab } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import toast, { Toaster } from 'react-hot-toast';
import axios from 'axios';

const Account = () => {
    const [key, setKey] = useState('login');
    const { register: login, handleSubmit: handleSubmitLogin, formState: { errors: errorsLogin } } = useForm();
    const { register: register, handleSubmit: handleSubmitRegister, formState: { errors: errorsRegister }, watch } = useForm();

    const onLoginSubmit = async (data) => {
        
    };

    const onRegisterSubmit = async (data) => {
        
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
                                src="https://via.placeholder.com/500?text=Login+Illustration"
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
                                src="https://via.placeholder.com/500?text=Register+Illustration"
                                alt="Register Illustration"
                                className="img-fluid p-4"
                            />
                        </Col>
                        <Col md={6}>
                            <h2 className='text-center mb-2'>Đăng ký</h2>
                            <Form onSubmit={handleSubmitRegister(onRegisterSubmit)}>
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

                                <Form.Group className="form-floating mb-3" controlId="formRegisterPassword">
                                    <Form.Control
                                        type="password"
                                        placeholder="Nhập mật khẩu của bạn"
                                        {...register('password', { required: "Mật khẩu là bắt buộc" })}
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
