import { Card } from './Card/Card';
import socialData from 'data/social';
import { useCart } from 'context/CartContext';
import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';

export const Cart = () => {
  const { cart, updateQuantity, removeFromCart } = useCart();
  const socialLinks = [...socialData];
  const [total, setTotal] = useState(0);

  // Calculate total using useCallback
  const calculateTotal = useCallback(() => {
    return cart.reduce((sum, item) => 
      sum + (Number(item.price) * Number(item.quantity)), 0
    );
  }, [cart]);

  // Update total when cart changes
  useEffect(() => {
    setTotal(calculateTotal());
  }, [cart, calculateTotal]);

  // Handle quantity changes
  const handleQuantityChange = (id, action) => {
    const cartItem = cart.find(item => item.id === id);
    if (!cartItem) return;

    let newQuantity;
    if (action === 'increase') {
      newQuantity = cartItem.quantity + 1;
    } else if (action === 'decrease') {
      newQuantity = cartItem.quantity - 1;
      if (newQuantity < 1) {
        // If quantity becomes 0, remove the item
        handleRemoveFromCart(id);
        return;
      }
    }

    updateQuantity(id, newQuantity);
  };

  // Handle remove from cart
  const handleRemoveFromCart = (productId) => {
    try {
      removeFromCart(productId);
    } catch (error) {
      console.error('Error removing item from cart:', error);
    }
  };

  return (
    <>
      {/* <!-- BEGIN CART --> */}
      <div className='cart'>
        <div className='wrapper'>
          <div className='cart-table'>
            <div className='cart-table__box'>
              <div className='cart-table__row cart-table__row-head'>
                <div className='cart-table__col'>Product</div>
                <div className='cart-table__col'>Price</div>
                <div className='cart-table__col'>Quantity</div>
                <div className='cart-table__col'>Total</div>
              </div>
              {cart.map((cart) => (
                <Card 
                  key={cart.id} 
                  cart={cart} 
                  onQuantityChange={handleQuantityChange}
                  onRemove={() => handleRemoveFromCart(cart.id)}
                />
              ))}
            </div>
          </div>
          <div className='cart-bottom'>
            <div className='cart-bottom__promo'>
              <form className='cart-bottom__promo-form'>
                <div className='box-field__row'>
                  <div className='box-field'>
                    <input
                      type='text'
                      className='form-control'
                      placeholder='Enter promo code'
                    />
                  </div>
                  <button type='submit' className='btn btn-grey'>
                    apply code
                  </button>
                </div>
              </form>
              <h6>How to get a promo code?</h6>
              <p>
                Follow our news on the website, as well as subscribe to our
                social networks. So you will not only be able to receive
                up-to-date codes, but also learn about new products and
                promotional items.
              </p>
              <div className='contacts-info__social'>
                <span>Find us here:</span>
                <ul>
                  {socialLinks.map((social, index) => (
                    <li key={index}>
                      <a href={social.path} target='_blank' rel="noopener noreferrer">
                        <i className={social.icon}></i>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className='cart-bottom__total'>
              <div className='cart-bottom__total-goods'>
                Goods on
                <span>${total.toFixed(2)}</span>
              </div>
              <div className='cart-bottom__total-promo'>
                Discount on promo code
                <span>No</span>
              </div>
              <div className='cart-bottom__total-num'>
                Total:
                <span>${total.toFixed(2)}</span>
              </div>
              <Link href='/checkout'>
                <a className='btn'>Checkout</a>
              </Link>
            </div>
          </div>
        </div>
        <img
          className='promo-video__decor js-img'
          src='assets/img/promo-video__decor.jpg'
          alt=''
        />
      </div>
      {/* <!-- CART EOF   --> */}
    </>
  );
};
