import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
// FIX: Added Row and Col to the import list
import { Form, Button, Container, Alert, Row, Col } from 'react-bootstrap'; 

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const { data } = await axios.post('http://localhost:5000/api/users/login', {
        email,
        password,
      });

      // Save user info (token, ID, name) to localStorage
      localStorage.setItem('userInfo', JSON.stringify(data)); 
      navigate('/home'); 

    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Server might be down.');
    }
  };

  return (
    <Container style={{ maxWidth: '400px', marginTop: '100px' }}>
      <h2 className="text-center mb-4">Sign In</h2>
      {error && <Alert variant="danger">{error}</Alert>}

      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3" controlId="email">
          <Form.Label>Email Address</Form.Label>
          <Form.Control 
            type="email" 
            placeholder="Enter email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required 
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="password">
          <Form.Label>Password</Form.Label>
          <Form.Control 
            type="password" 
            placeholder="Enter password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required 
          />
        </Form.Group>
        
        <Button type="submit" variant="primary" className="w-100 mt-3">
          Login
        </Button>
      </Form>
      
      {/* This section now works because Row and Col are imported */}
      <Row className='py-3'> 
          <Col className='text-center'>
              New Customer? <Link to='/register'>Register Here</Link>
          </Col>
      </Row>
    </Container>
  );
};

export default Login;
