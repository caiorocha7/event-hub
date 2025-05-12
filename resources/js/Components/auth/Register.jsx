import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { register } from '../../services/auth';
import Alert from '../common/Alert';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    password_confirmation: ''
  });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    if (formData.password !== formData.password_confirmation) {
      setError('As senhas não coincidem');
      setLoading(false);
      return;
    }

    try {
      await register(
        formData.username,
        formData.email,
        formData.password,
        formData.password_confirmation
      );
      setSuccess('Cadastro realizado com sucesso! Você será redirecionado para login.');
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Erro ao cadastrar usuário');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h2 className="form-title">Cadastre-se</h2>
        <p className="form-subtitle">Crie sua conta para participar dos eventos</p>

        {error && <Alert type="danger" message={error} />}
        {success && <Alert type="success" message={success} />}

        <div className="form-group">
          <label htmlFor="username" className="form-label">Nome de usuário</label>
          <input
            type="text"
            id="username"
            name="username"
            className="form-control"
            value={formData.username}
            onChange={handleChange}
            placeholder="Digite seu nome de usuário"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="email" className="form-label">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            className="form-control"
            value={formData.email}
            onChange={handleChange}
            placeholder="Digite seu email"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="password" className="form-label">Senha</label>
          <input
            type="password"
            id="password"
            name="password"
            className="form-control"
            value={formData.password}
            onChange={handleChange}
            placeholder="Digite sua senha"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="password_confirmation" className="form-label">Confirme a senha</label>
          <input
            type="password"
            id="password_confirmation"
            name="password_confirmation"
            className="form-control"
            value={formData.password_confirmation}
            onChange={handleChange}
            placeholder="Confirme sua senha"
            required
          />
        </div>

        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Cadastrando...' : 'Cadastrar'}
        </button>
      </form>
    </div>
  );
};

export default Register;
