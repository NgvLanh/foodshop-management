import { Outlet } from 'react-router-dom';
import Header from '../../../components/Client/Header'
import HeaderTop from '../../../components/Client/HeaderTop'
import { Container } from 'react-bootstrap';
import Footer from '../../../components/Client/Footer';
import { useEffect, useState } from 'react';
import { Toaster } from 'react-hot-toast';
import request from '../../../config/apiConfig';
import { jwtDecode } from 'jwt-decode';

const Client = () => {
    const [user, setUser] = useState({});

    useEffect(() => {
        getUser();
    }, []);

    const getUser = async () => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const decodedToken = jwtDecode(token);
                const userId = decodedToken.sub;
                const res = await request({
                    path: `customers/${userId}`
                })
                setUser(res.data);
                console.log(user);

            } catch (error) {
                console.error('Error decoding token:', error);
            }
        } else {
            console.log('No token found');
        }

    }


    return (
        <div>
            <Toaster />
            <HeaderTop user={user} />
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