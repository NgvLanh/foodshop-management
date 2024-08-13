import { Outlet } from 'react-router-dom';
import Header from '../../../components/Client/Header'
import { Container } from 'react-bootstrap';
import Footer from '../../../components/Client/Footer';
import { Toaster } from 'react-hot-toast';

const Client = () => {

    return (
        <div>
            <Toaster />
            <Header />
            <Container className='pt-2'>
                <Outlet />
            </Container>
            <Footer />
        </div>
    )
}

export default Client;