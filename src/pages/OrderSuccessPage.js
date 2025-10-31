import React from 'react';
import { Container, Alert, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const OrderSuccessPage = () => {
  const navigate = useNavigate();

  return (
    <Container className="mt-5 text-center" style={{ maxWidth: '600px' }}>
      <Alert variant="success">
        <h1>🎉 Order Confirmed Successfully!</h1>
        <p>Your order has been placed in the database and your cart has been cleared.</p>
        <p>Thank you for your purchase.</p>
      </Alert>
      <Button variant="primary" onClick={() => navigate('/home')}>
        Continue Shopping
      </Button>
      <Button variant="link" className='ms-3' onClick={() => navigate('/')}>
        Go to Login
      </Button>
    </Container>
  );
};

export default OrderSuccessPage;
