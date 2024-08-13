import React, { createContext, useContext, useState, useEffect } from 'react';
import { getMyInfo } from '../../../services/Auth';
import request from '../../../config/apiConfig';

// Tạo Context
const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [cart, setCart] = useState(null);
    const [cartDetails, setCartDetails] = useState([]);

    useEffect(() => {
        fetchUser();
    }, []);

    useEffect(() => {
        if (user) {
            fetchCart();
        }
    }, [user]);

    useEffect(() => {
        if (cart) {
            fetchCartDetails();
        }
    }, [cart]);

    const fetchUser = async () => {
        const res = await getMyInfo();
        setUser(res);
    };

    const fetchCart = async () => {
        const res = await request({
            path: `carts/${user.id}`,
            header: 'Bearer ',
        });
        setCart(res);
    };

    const fetchCartDetails = async () => {
        const res = await request({
            path: `cart-details/carts/${cart.id}`,
            header: 'Bearer ',
        });
        setCartDetails(res);
    };

    const updateCartDetails = async () => {
        await fetchCartDetails(); // Cập nhật lại chi tiết giỏ hàng
    };

    return (
        <CartContext.Provider value={{ cartDetails, updateCartDetails }}>
            {children}
        </CartContext.Provider>
    );
};
