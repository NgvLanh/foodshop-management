import { Alert, Container } from "react-bootstrap";
import './style.css';
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getMyInfo } from "../../../services/Auth";

const HeaderTop = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState({});

    useEffect(() => {
        getUserInfo();
    }, [])

    const getUserInfo = async () => {
        const res = await getMyInfo();
        setUser(res);
    }

    return (
        <Alert variant='light' className="alert-custom">
            <Container className="d-flex justify-content-between container-custom">
                <span>
                    Xin chào &nbsp;
                    <i>
                        {user?.fullName}
                    </i>
                </span>
                <div className="d-flex justify-content-between align-content-center gap-4">
                    <a
                        href={user?.id ? '/my-info' : '/account'}
                        className="link-custom"
                    >
                        Tài khoản
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
