import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { Form, Button, Container, Alert, Row, Col } from 'react-bootstrap';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    try {
      // 1. Call the backend API registration endpoint
      const { data } = await axios.post('http://localhost:5000/api/users/register', {
        name,
        email,
        password,
      });

      // 2. Save user info (token, ID, name) to localStorage for immediate login
      localStorage.setItem('userInfo', JSON.stringify(data)); 

      // 3. Redirect to the main product page (Home)
      setMessage({ type: 'success', text: data.message + ' Redirecting to Home...' });
      setTimeout(() => navigate('/home'), 1500);

    } catch (err) {
      // 4. Handle errors (e.g., User already exists)
      setMessage({ type: 'danger', text: err.response?.data?.message || 'Registration failed. Server might be down.' });
    }
  };

  return (
    <Container style={{ maxWidth: '400px', marginTop: '100px' }}>
      <h2 className="text-center mb-4">Create Account</h2>
      
      {message && <Alert variant={message.type}>{message.text}</Alert>}

      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3" controlId="name">
          <Form.Label>Full Name</Form.Label>
          <Form.Control 
            type="text" 
            placeholder="Enter full name" 
            value={name} 
            onChange={(e) => setName(e.target.value)} 
            required 
          />
        </Form.Group>

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
        
        <Button type="submit" variant="success" className="w-100 mt-3">
          Register
        </Button>
      </Form>
      
      <Row className='py-3'>
          <Col className='text-center'>
              Already have an account? <Link to='/'>Login Here</Link>
          </Col>
      </Row>
    </Container>
  );
};

export default Register;
