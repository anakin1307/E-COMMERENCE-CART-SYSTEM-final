import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Container, Card, ListGroup, Button, Alert, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const CheckoutPage = () => {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true); // Always start true
  const [orderProcessing, setOrderProcessing] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);
  const navigate = useNavigate();

  const userInfo = JSON.parse(localStorage.getItem('userInfo'));

  // Utility function to get auth headers
  const getAuthHeader = useCallback(() => ({
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${userInfo?.token}`
    }
  }), [userInfo?.token]);

  // Fetch Cart Logic
  const fetchCart = useCallback(async () => {
    if (!userInfo || !userInfo.token) return;

    try {
      const { data } = await axios.get('http://localhost:5000/api/cart', getAuthHeader());
      setCart(data);
      if (data.items.length === 0 && !orderSuccess) { // Don't redirect if order was just placed
        setMessage({ type: 'warning', text: 'Your cart is empty. Redirecting to home.' });
        setTimeout(() => navigate('/home'), 2000);
      }
    } catch (err) {
      setError('Could not load cart for checkout. Ensure backend is running.');
    } finally {
      setLoading(false);
    }
  }, [userInfo, getAuthHeader, navigate, setError, setLoading, orderSuccess]); // Added orderSuccess dependency

  // Effect for auth check and initial load
  useEffect(() => {
    if (!userInfo || !userInfo.token) {
        setLoading(false);
        navigate('/');
    } else {
        fetchCart();
    }
  }, [fetchCart, userInfo, navigate]);

  // Handler for placing the order
  const placeOrderHandler = async () => {
    if (!userInfo || !userInfo.token || !cart || cart.items.length === 0) return;

    setOrderProcessing(true);
    setMessage(null);

    try {
      // API call to create the order
      const { data } = await axios.post(
        'http://localhost:5000/api/orders',
        { userId: userInfo._id }, // Passing userId for server side testing
        getAuthHeader()
      );

      // Order placed successfully
      setMessage({ type: 'success', text: `Order ${data.order._id} confirmed! Cart is now empty.` });
      setOrderSuccess(true);

      // ✅ FIX: Navigate immediately after success
      navigate('/order-success');

    } catch (err) {
      // Order failed
      setMessage({ type: 'danger', text: err.response?.data?.message || 'Order failed. Please try again.' });
      console.error("Order placement error:", err.response || err); // Log the detailed error
    } finally {
      setOrderProcessing(false);
    }
  };

  const totalPrice = cart?.items?.reduce((acc, item) => acc + item.product.price * item.quantity, 0) || 0;

  // --- Render Logic ---
  if (loading) return <h2 className="text-center mt-5">Loading Checkout...</h2>;
  if (error) return <Alert variant="danger" className="mt-5">{error}</Alert>;
  if (!cart || cart.items.length === 0) return <Alert variant="warning" className="mt-5 text-center">Cart is empty.</Alert>;


  return (
    <Container className="my-5" style={{ maxWidth: '600px' }}>
      <h2 className="mb-4">Finalize Order</h2>

      {message && <Alert variant={message.type} className="mb-4">{message.text}</Alert>}

      <Card className='shadow-sm'>
        <Card.Header as="h5">Order Summary</Card.Header>
        <ListGroup variant="flush">
          {cart.items.map((item) => (
            <ListGroup.Item key={item.product._id} className="d-flex justify-content-between">
              <span>{item.product.name} ({item.quantity} x ${item.product.price.toFixed(2)})</span>
              <strong>${(item.quantity * item.product.price).toFixed(2)}</strong>
            </ListGroup.Item>
          ))}
          <ListGroup.Item className="d-flex justify-content-between bg-light">
            <h4>Total:</h4>
            <h4>${totalPrice.toFixed(2)}</h4>
          </ListGroup.Item>
        </ListGroup>
        <Card.Body>
          <Button
            variant={orderSuccess ? "success" : "primary"}
            className="w-100"
            onClick={placeOrderHandler}
            disabled={orderProcessing || cart.items.length === 0 || orderSuccess}
          >
            {orderSuccess ? (
              'Order Confirmed'
            ) : orderProcessing ? (
              <><Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" /> Processing...</>
            ) : (
              'Place Order & Pay Later'
            )}
          </Button>
        </Card.Body>
      </Card>
      <div className='mt-3 text-center text-muted'>
          Note: This completes Phase 4 by placing the order in the database.
      </div>
    </Container>
  );
};

export default CheckoutPage;

