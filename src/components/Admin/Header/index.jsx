import { LuBellRing } from "react-icons/lu";
import { Navbar, Nav, Dropdown, Image, Button } from 'react-bootstrap';
import { Cookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import { BiBell } from "react-icons/bi";

const Header = () => {

    const navigate = useNavigate();

    const logout = () => {
        new Cookies().remove('token');
        navigate('/home');
        window.location.reload();
    }
    return (
        <div className="m-4 mx-lg-5 d-flex justify-content-between align-items-center">
            <BiBell size={24} cursor='pointer' />
            <Dropdown>
                <Dropdown.Toggle as='div'>
                    <img src="/assets/images/profile.png" alt="profile.png" width='40px' />
                </Dropdown.Toggle>
                <Dropdown.Menu>
                    <Dropdown.Item onClick={logout}>Đăng xuất</Dropdown.Item>
                </Dropdown.Menu>
            </Dropdown>

        </div>
    );
};

export default Header;
