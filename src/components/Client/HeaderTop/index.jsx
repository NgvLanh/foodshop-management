import { Alert, Container } from "react-bootstrap";
import './style.css'; 

const HeaderTop = () => {
    return (
        <Alert variant='light' className="alert-custom">
            <Container className="d-flex justify-content-between container-custom">
                <span>
                    Xin chào &nbsp;
                    <i>
                        {/* Add dynamic content if needed */}
                    </i>
                </span>
                <div className="d-flex justify-content-between align-content-center gap-4">
                    <a href="/your-table" className="link-custom">
                        Bàn của bạn
                    </a>
                    <a href='/account' className="link-custom">
                        Tài khoản
                    </a>
                    <div>
                        Hotline:
                        <span className="hotline"> 0123456789</span>
                    </div>
                </div>
            </Container>
        </Alert>
    )
}

export default HeaderTop;
