import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import { auth } from '../firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useTranslation } from 'react-i18next';
import './Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { t } = useTranslation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="login-container">
      <div className="login-form">
        <h1 className="text-center">{t('admin_login')}</h1>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>{t('email_address')}</Form.Label>
            <Form.Control
              type="email"
              placeholder={t('enter_email')}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label>{t('password')}</Form.Label>
            <Form.Control
              type="password"
              placeholder={t('enter_password')}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </Form.Group>
          <div className="d-grid">
            <Button variant="primary" type="submit">
              {t('login')}
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default Login;
