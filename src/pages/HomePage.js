import React, { useState, useEffect, useCallback, useMemo } from 'react';
import axios from 'axios';
import { Card, Row, Col, Container, Button, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cartMessage, setCartMessage] = useState(null);
  
  // Get the raw localStorage value first (this string is stable unless the storage changes)
  const rawUserInfo = localStorage.getItem('userInfo');

  // FIX: Memoize userInfo based on the raw string change.
  // This ensures the object reference is stable and fixes the flicker.
  const userInfo = useMemo(() => {
    return rawUserInfo ? JSON.parse(rawUserInfo) : null;
  }, [rawUserInfo]); // Dependency is now the stable raw string, fixing the ESLint warning.

  // 1. Authentication Guard: Redirect if not logged in
  useEffect(() => {
    // If userInfo doesn't exist (not logged in), redirect to login page.
    if (!userInfo || !userInfo.token) {
        navigate('/');
    }
  }, [userInfo, navigate]);

  // 2. Data Fetching Function (Stabilized with useCallback)
  const fetchProducts = useCallback(async () => {
    // Check authentication again inside fetch function
    if (!userInfo || !userInfo.token) return;

    setError(null);
    setLoading(true); // Set loading true inside the stable function call

    try {
        const config = {
            headers: {
                Authorization: `Bearer ${userInfo.token}`,
            },
        };
        
        const { data } = await axios.get('http://localhost:5000/api/products', config);
        
        setProducts(data);

    } catch (err) {
        // Handle specific 401 error (unauthorized) by forcing logout/redirect
        if (err.response?.status === 401) {
             navigate('/');
        }
        setError('Failed to fetch products. Is the backend server running?');
        console.error(err);
    } finally {
        setLoading(false); // Crucial: Always set loading to false here.
    }
  }, [userInfo, navigate]); // Dependencies: user state and router navigation

  // 3. Effect to execute data fetching
  useEffect(() => {
    // Only call fetchProducts if userInfo is present
    if (userInfo && userInfo.token) {
        fetchProducts();
    }
  }, [fetchProducts, userInfo]); // Dependency: Runs only when the stable fetchProducts function or userInfo changes

  // Handler for adding items to the cart
  const addToCartHandler = async (productId, quantity = 1) => {
    if (!userInfo || !userInfo.token) {
        setCartMessage({ type: 'danger', text: 'Please log in to add items.' });
        return;
    }

    try {
        const config = {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${userInfo.token}`,
            },
        };
        
        await axios.post(
            'http://localhost:5000/api/cart', 
            { 
                productId: productId, 
                quantity: quantity 
            },
            config
        );
        
        setCartMessage({ type: 'success', text: 'Item added to cart!' });

    } catch (error) {
        setCartMessage({ 
            type: 'danger', 
            text: error.response?.data?.message || 'Error adding item to cart.' 
        });
    }
  };


  if (loading) {
    return <h2 className='text-center mt-5'>Loading Products...</h2>;
  }

  if (error) {
    return <h2 className='text-danger text-center mt-5'>{error}</h2>;
  }
  
  return (
    <Container className="my-5">
      <h2 className="text-center mb-4">
        👋 Welcome {userInfo?.name || 'User'} — Available Products
      </h2>
      {/* Link to Cart */}
      <div className="d-flex justify-content-end mb-4">
          <Button variant="outline-success" onClick={() => navigate('/cart')}>
              Go to Cart <i className="fas fa-shopping-cart"></i>
          </Button>
      </div>
      
      {cartMessage && <Alert variant={cartMessage.type} className='text-center'>{cartMessage.text}</Alert>} 

      <Row>
        {products.length === 0 ? (
            <h4 className='text-center text-muted'>No products found in the database.</h4>
        ) : (
            products.map((product) => (
            <Col key={product._id} sm={12} md={6} lg={4} xl={3} className='mb-4'>
                <Card className='shadow-sm p-3 rounded'>
                <Card.Img 
                    variant="top" 
                    src={product.imageUrl || 'https://placehold.co/150x150/0000FF/FFFFFF?text=NO+IMAGE'} 
                    style={{ height: '200px', objectFit: 'cover' }} 
                />
                <Card.Body>
                    <Card.Title as='div'>
                    <strong>{product.name}</strong>
                    </Card.Title>
                    <Card.Text as='h3' className='mt-2'>
                    ${product.price.toFixed(2)}
                    </Card.Text>
                    <Card.Text as='div'>
                    Stock: {product.stock}
                    </Card.Text>
                    <Button 
                        variant='primary' 
                        className='w-100' 
                        onClick={() => addToCartHandler(product._id)}
                        disabled={product.stock === 0}
                    >
                    {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
                    </Button>
                </Card.Body>
                </Card>
            </Col>
            ))
        )}
      </Row>
    </Container>
  );
};

export default HomePage;
