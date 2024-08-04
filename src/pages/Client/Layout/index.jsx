import { Outlet } from 'react-router-dom';
import Header from '../../../components/Client/Header'
import HeaderTop from '../../../components/Client/HeaderTop'
import { Container } from 'react-bootstrap';
import Footer from '../../../components/Client/Footer';

const Client = () => {

    return (
        <div>
            <HeaderTop />
            <Header />
            <div className='pt-2'>
                <Container>
                    <Outlet />
                </Container>
            </div>
            <Footer />
        </div>
    )
}

export default Client;