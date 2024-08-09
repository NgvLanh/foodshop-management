import { json, Outlet } from 'react-router-dom';
import Header from '../../../components/Client/Header'
import HeaderTop from '../../../components/Client/HeaderTop'
import { Container } from 'react-bootstrap';
import Footer from '../../../components/Client/Footer';
import { useEffect, useState } from 'react';
import { Toaster } from 'react-hot-toast';
import request from '../../../config/apiConfig';
import { jwtDecode } from 'jwt-decode';

const Client = () => {

    return (
        <div>
            <Toaster />
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