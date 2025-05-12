import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { login } from '../../services/auth';

const Login = () => {
  const [data, setData] = useState({
    email: '',
    password: '',
    remember: false,
  });
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setProcessing(true);

    try {
      await login(data.email, data.password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.error || 'Falha na autenticação');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="auth-container">
      <form className="auth-form" onSubmit={handleSubmit} autoComplete="off">
        <h2 className="form-title">Entrar</h2>
        <p className="form-subtitle">Entre com sua conta para participar de eventos</p>

        {error && <div className="alert alert-danger">{error}</div>}

        <div className="form-group">
          <label htmlFor="email" className="form-label">Email</label>
          <input
            className="form-control"
            id="email"
            type="email"
            name="email"
            value={data.email}
            autoComplete="username"
            autoFocus
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group" style={{ marginTop: 16 }}>
          <label htmlFor="password" className="form-label">Senha</label>
          <input
            className="form-control"
            id="password"
            type="password"
            name="password"
            value={data.password}
            autoComplete="current-password"
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group" style={{ marginTop: 16 }}>
          <label className="flex items-center" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <input
              type="checkbox"
              name="remember"
              checked={data.remember}
              onChange={handleChange}
              style={{ width: 16, height: 16 }}
            />
            <span className="text-sm" style={{ color: '#666' }}>Lembrar-me</span>
          </label>
        </div>

        <div className="form-actions">
          <button type="submit" className="btn btn-primary" disabled={processing}>
            {processing ? 'Entrando...' : 'Entrar'}
          </button>
        </div>

      </form>
    </div>
  );
};

export default Login;
