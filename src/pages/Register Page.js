import React from "react";
import { Container, Alert } from "react-bootstrap";
// Note: Actual registration logic requires implementing the form and API call to /api/users/register

const Register = () => {
  return (
    <Container className="mt-5 text-center" style={{ maxWidth: '400px' }}>
        <Alert variant="warning">
          <h3>Register Under Construction</h3>
          <p>The register API route is active, but the frontend form is not built yet.</p>
          <p>Please test with existing users or implement the form to create a new one!</p>
          <a href="/">Go to Login</a>
        </Alert>
    </Container>
  );
};

export default Register;
