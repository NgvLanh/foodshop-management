import { CiSearch } from "react-icons/ci";
import { LuBellRing } from "react-icons/lu";
import { Navbar, Form, FormControl, Nav, Dropdown, Image } from 'react-bootstrap';
import './style.css';

const Header = () => {
    return (
        <Navbar bg="light" expand="lg" className="header px-4">
            <Navbar.Brand href="" className="d-flex align-items-center">
                <Dropdown>
                    <Dropdown.Toggle variant="light" id="dropdown-notifications" className="custom-dropdown-toggle">
                        <LuBellRing size={24} />
                    </Dropdown.Toggle>
                    {/* <Dropdown.Menu>
                        <Dropdown.Item href="/">Thông Báo</Dropdown.Item>
                        <Dropdown.Item href="/">Đăng Xuất</Dropdown.Item>
                    </Dropdown.Menu> */}
                </Dropdown>
            </Navbar.Brand>

            <Form className="mx-auto search-container">
                <FormControl
                    type="text"
                    placeholder="Tìm kiếm..."
                    className="mr-sm-2 search-input"
                />
                <CiSearch size={24} />
            </Form>

            <Nav className="ml-auto">
                <Nav.Item className="profile">
                    <Dropdown>
                        <Dropdown.Toggle variant="light" id="dropdown-profile" className="custom-dropdown-toggle">
                            <Image
                                src="/assets/images/profile.png"
                                alt="Profile"
                                roundedCircle
                                className="profile-img"
                                style={{ width: "30px", height: "30px" }}
                            />
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                            <Dropdown.Item href="/logout">Đăng Xuất</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                </Nav.Item>
            </Nav>
        </Navbar>
    );
};

export default Header;
