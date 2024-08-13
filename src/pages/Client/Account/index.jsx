import { useState } from 'react';
import { Form, Button, Container } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import toast, { Toaster } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { getMyInfo, loginApi } from '../../../services/Auth';
import { useCookies } from 'react-cookie';
import request from '../../../config/apiConfig';
import './style.css';

const Account = () => {
    const [cookies, setCookie] = useCookies(["token", "role"]);
    const navigate = useNavigate();
    const [key, setKey] = useState('login');
    const { register: login, handleSubmit: handleSubmitLogin, formState: { errors: errorsLogin } } = useForm();
    const { register: registerForm, handleSubmit: handleSubmitRegister, formState: { errors: errorsRegister }, watch } = useForm();

    const onLoginSubmit = async (data) => {
        try {
            const res = await loginApi({ email: data.email, password: data.password });

            if (res.authenticated) {
                toast.success('Đăng nhập thành công.');
                setCookie('token', res.token);
                try {
                    const userInfo = await getMyInfo();
                    const roles = userInfo.roles;
                    if (roles.includes('ADMIN')) {
                        navigate('/admin');
                    } else {
                        navigate('/home');
                    }
                    window.location.reload();
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
            <div className="auth-container">
                <div className="backbox">
                    <div className="loginMsg">
                        <div className="textcontent">
                            <p className="title">Bạn chưa có tài khoản?</p>
                            <p>Đăng ký để mua hàng.</p>
                            <button onClick={() => setKey('register')}>Đăng Ký</button>
                        </div>
                    </div>
                    <div className="signupMsg">
                        <div className="textcontent">
                            <p className="title">Bạn đã có tài khoản?</p>
                            <p>Đăng nhập để xem tất cả bộ sưu tập của bạn.</p>
                            <button onClick={() => setKey('login')}>ĐĂNG NHẬP</button>
                        </div>
                    </div>
                </div>

                <div className={`frontbox ${key === 'login' ? '' : 'moving'}`}>
                    <div className={`login ${key === 'login' ? 'visible' : 'hidden'}`}>
                        <h2>ĐĂNG NHẬP</h2>
                        <div className="inputbox">
                            <Form onSubmit={handleSubmitLogin(onLoginSubmit)}>
                                <Form.Group className="form-floating mb-3">
                                    <Form.Control
                                        type="email"
                                        placeholder="EMAIL"
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
                                        <Form.Text className="text-danger">
                                            {errorsLogin.email.message}
                                        </Form.Text>
                                    )}
                                </Form.Group>

                                <Form.Group className="form-floating mb-3">
                                    <Form.Control
                                        type="password"
                                        placeholder="MẬT KHẨU"
                                        {...login('password', { required: "Mật khẩu là bắt buộc" })}
                                    />
                                    <Form.Label>Mật khẩu</Form.Label>
                                    {errorsLogin.password && (
                                        <Form.Text className="text-danger">
                                            {errorsLogin.password.message}
                                        </Form.Text>
                                    )}
                                </Form.Group>
                                <Button variant="secondary" type="submit" className="mt-3">
                                    Đăng nhập
                                </Button>
                            </Form>
                        </div>
                    </div>

                    <div className={`signup ${key === 'register' ? 'visible' : 'hidden'}`}>
                        <h2>ĐĂNG KÝ</h2>
                        <div className="inputbox">
                            <Form onSubmit={handleSubmitRegister(onRegisterSubmit)}>
                                <Form.Group className="form-floating mb-3">
                                    <Form.Control
                                        type="text"
                                        placeholder="HỌ TÊN"
                                        {...registerForm('fullName', {
                                            required: "Tên là bắt buộc",
                                            minLength: {
                                                value: 2,
                                                message: 'Tên phải có ít nhất 2 ký tự'
                                            }
                                        })}
                                    />
                                    <Form.Label>Họ tên</Form.Label>
                                    {errorsRegister.fullName && (
                                        <Form.Text className="text-danger">
                                            {errorsRegister.fullName.message}
                                        </Form.Text>
                                    )}
                                </Form.Group>

                                <Form.Group className="form-floating mb-3">
                                    <Form.Control
                                        type="email"
                                        placeholder="EMAIL"
                                        {...registerForm('email', {
                                            required: "Email là bắt buộc",
                                            pattern: {
                                                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                                message: "Email không hợp lệ"
                                            }
                                        })}
                                    />
                                    <Form.Label>Email</Form.Label>
                                    {errorsRegister.email && (
                                        <Form.Text className="text-danger">
                                            {errorsRegister.email.message}
                                        </Form.Text>
                                    )}
                                </Form.Group>

                                <Form.Group className="form-floating mb-3">
                                    <Form.Control
                                        type="text"
                                        placeholder="SỐ ĐIỆN THOẠI"
                                        {...registerForm('phoneNumber', {
                                            required: "Số điện thoại là bắt buộc",
                                            pattern: {
                                                value: /^[0-9]{10}$/,
                                                message: "Số điện thoại không hợp lệ"
                                            }
                                        })}
                                    />
                                    <Form.Label>Số điện thoại</Form.Label>
                                    {errorsRegister.phoneNumber && (
                                        <Form.Text className="text-danger">
                                            {errorsRegister.phoneNumber.message}
                                        </Form.Text>
                                    )}
                                </Form.Group>

                                <Form.Group className="form-floating mb-3">
                                    <Form.Control
                                        type="password"
                                        placeholder="MẬT KHẨU"
                                        {...registerForm('password', {
                                            required: "Mật khẩu là bắt buộc",
                                            minLength: {
                                                value: 6,
                                                message: 'Mật khẩu phải có ít nhất 6 ký tự'
                                            }
                                        })}
                                    />
                                    <Form.Label>Mật khẩu</Form.Label>
                                    {errorsRegister.password && (
                                        <Form.Text className="text-danger">
                                            {errorsRegister.password.message}
                                        </Form.Text>
                                    )}
                                </Form.Group>

                                <Form.Group className="form-floating mb-3">
                                    <Form.Control
                                        type="password"
                                        placeholder="XÁC NHẬN MẬT KHẨU"
                                        {...registerForm('confirmPassword', {
                                            required: "Xác nhận mật khẩu là bắt buộc",
                                            validate: value =>
                                                value === watch('password') || "Mật khẩu không khớp"
                                        })}
                                    />
                                    <Form.Label>Xác nhận mật khẩu</Form.Label>
                                    {errorsRegister.confirmPassword && (
                                        <Form.Text className="text-danger">
                                            {errorsRegister.confirmPassword.message}
                                        </Form.Text>
                                    )}
                                </Form.Group>
                                <Button variant="secondary" type="submit" className="mt-3">
                                    Đăng ký
                                </Button>
                            </Form>
                        </div>
                    </div>
                </div>
            </div>
        </Container>
    );
};

export default Account;
