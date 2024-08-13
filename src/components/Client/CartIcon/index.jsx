import React from 'react';
import { Badge } from 'react-bootstrap';
import { FaShoppingCart } from 'react-icons/fa';
import { useCart } from '../CartContext';

const CartIcon = () => {
    const { cartDetails } = useCart();

    var cartItems = cartDetails.reduce((total, item) => total + item.quantity, 0);

    return (
        <div className='position-relative mx-2'>
            <FaShoppingCart size={24} />
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
