import { Outlet } from 'react-router-dom';
import Header from '../../../components/Client/Header'
import HeaderTop from '../../../components/Client/HeaderTop/HeaderTop.jsx'
import { Container } from 'react-bootstrap';
import Footer from '../../../components/Client/Footer/index.jsx';

const Client = () => {

    return (
        <div>
            <HeaderTop />
            <Header />
            <Container>
                <Outlet />
            </Container>
            <Footer />
        </div>
    )
}

export default Client;