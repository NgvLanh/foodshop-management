import { Alert, Container } from "react-bootstrap";
import './style.css';
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";

const HeaderTop = ({ user }) => {
    const navigate = useNavigate();

    const logout = () => {
        localStorage.clear();
        navigate('/home');
        window.location.reload();
    };

    return (
        <Alert variant='light' className="alert-custom">
            <Container className="d-flex justify-content-between container-custom">
                <span>
                    Xin chào &nbsp;
                    <i>
                        {user.fullName}
                    </i>
                </span>
                <div className="d-flex justify-content-between align-content-center gap-4">
                    <a href="/your-table" className="link-custom">
                        Bàn của bạn
                    </a>
                    <a
                        href={user.id ? '/' : '/account'}
                        className="link-custom"
                        onClick={user.id ? logout : null}
                    >
                        {user.id ? 'Đăng xuất' : 'Tài khoản'}
                    </a>
                    <div>
                        Hotline:
                        <span className="hotline"> 0123456789</span>
                    </div>
                </div>
            </Container>
        </Alert>
    );
};

export default HeaderTop;
