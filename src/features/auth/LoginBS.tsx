import { useState } from 'react';
import { Container, Card, Form, Button, Alert } from 'react-bootstrap';
import api from '../../api/axios';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '../../store';
import { loginFailure, loginStart, loginSuccess } from './authSlice';

export default function LoginBS() {
  const dispatch = useDispatch<AppDispatch>();
  const state = useSelector((store: RootState) => store.auth);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    dispatch(loginStart());
    try {
      const { data: users } = await api.get(`/users?email=${email}`);
      if (users.length === 0 || users[0].password !== password) {
        dispatch(loginFailure('Email ou mot de passe incorrect'));
        return;
      }
      const { password: _, ...user } = users[0];
      const fakeToken = btoa(JSON.stringify({
        userId: user.id,
        email: user.email,
        role: 'admin',
        exp: Date.now() + 3600000,
      }));
      dispatch(loginSuccess({ user, token: fakeToken }));
    } catch {
      dispatch(loginFailure('Erreur serveur'));
    }
  }

  return (
    <Container className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
      <Card style={{ maxWidth: 400, width: '100%' }}>
        <Card.Body>
          <Card.Title className="text-center mb-1" style={{ color: '#1B8C3E', fontSize: '1.8rem', fontWeight: 700 }}>
            TaskFlow
          </Card.Title>
          <p className="text-center text-muted mb-3" style={{ fontSize: '0.9rem' }}>
            Connectez-vous pour continuer
          </p>
          {state.error && <Alert variant="danger">{state.error}</Alert>}
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Control
                type="email"
                placeholder="Email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Control
                type="password"
                placeholder="Mot de passe"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
            </Form.Group>
            <Button
              type="submit"
              className="w-100"
              disabled={state.loading}
              style={{ backgroundColor: '#1B8C3E', borderColor: '#1B8C3E' }}
            >
              {state.loading ? 'Connexion...' : 'Se connecter'}
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
}
