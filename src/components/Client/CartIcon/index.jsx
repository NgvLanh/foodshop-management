import React from 'react';
import { Badge } from 'react-bootstrap';
import { useCart } from '../CartContext';
import { FaCartShopping } from 'react-icons/fa6';

const CartIcon = () => {
    const { cartDetails } = useCart();

    var cartItems = cartDetails.reduce((total, item) => total + item.quantity, 0);

    return (
        <div className='position-relative'>
            <FaCartShopping size={24} />
            {
                cartItems > 0 &&
                <Badge style={{ fontSize: '12px', position: 'absolute', top: '-25%', left: '50%' }}>
                    {cartItems}
                </Badge>
            }
        </div >
    );
};

export default CartIcon;
