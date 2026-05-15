import React, { useState } from 'react';
import {
  Alert,
  AlertActionCloseButton,
  Brand,
  Bullseye,
  Button,
  Card,
  CardBody,
  Divider,
  Form,
  FormGroup,
  PageSection,
  TextInput,
  Title,
} from '@patternfly/react-core';
import logoLight from '../../design-system/assets/logos/spie.svg?url';
import { getCookie } from '../utils/csrf';
import './Login.css';

interface LoginProps {
  onLoginSuccess: () => void;
}

function Login({ onLoginSuccess }: LoginProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const API_URL = import.meta.env.VITE_GRPC_BACKEND_URL || 'https://hub.tastenmo.de';
      
      // First, fetch CSRF token
      await fetch(`${API_URL}/api/auth/csrf/`, {
        method: 'GET',
        credentials: 'include',
      });
      
      // Now get the token from cookie
      const csrfToken = getCookie('csrftoken');
      console.log('Attempting login to:', `${API_URL}/api/auth/login/`);
      
      const response = await fetch(`${API_URL}/api/auth/login/`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': csrfToken || '',
        },
        body: JSON.stringify({
          username,
          password,
        }),
      });

      console.log('Login response status:', response.status);
      if (response.ok) {
        const data = await response.json();
        console.log('✓ Login successful:', data.user);
        onLoginSuccess();
      } else {
        const data = await response.json();
        console.error('✗ Login failed:', data);
        setError(data.error || 'Login failed. Please try again.');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
      console.error('Login error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Bullseye className="login-page">
      <PageSection isFilled className="login-section">
        <Card isRounded className="login-card">
          <CardBody>
            <div className="login-branding">
              <Brand src={logoLight} alt="SPIE Hub" heights={{ default: '24px', md: '28px' }} />
              <Title headingLevel="h1" size="2xl">SPIE Hub</Title>
              <p>Sign in to access your repositories and documents.</p>
            </div>

            <Divider className="login-divider" />

            <Form onSubmit={handleSubmit}>
              {error && (
                <Alert
                  variant="danger"
                  title="Login failed"
                  actionClose={<AlertActionCloseButton onClose={() => setError('')} />}
                  isInline
                  className="login-alert"
                >
                  {error}
                </Alert>
              )}

              <FormGroup label="Email or Username" fieldId="username">
                <TextInput
                  id="username"
                  value={username}
                  onChange={(_, value) => setUsername(value)}
                  placeholder="Enter your email or username"
                  isRequired
                  isDisabled={isLoading}
                />
              </FormGroup>

              <FormGroup label="Password" fieldId="password">
                <TextInput
                  id="password"
                  type="password"
                  value={password}
                  onChange={(_, value) => setPassword(value)}
                  placeholder="Enter your password"
                  isRequired
                  isDisabled={isLoading}
                />
              </FormGroup>

              <Button type="submit" variant="primary" isBlock isDisabled={isLoading}>
                {isLoading ? 'Signing in...' : 'Sign in'}
              </Button>
            </Form>
          </CardBody>
        </Card>
      </PageSection>
    </Bullseye>
  );
}

export default Login;
