import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';

const CreateEvent = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    zipcode: '',
    address: '',
    number: '',
    complement: '',
    city: '',
    state: '',
    starts_at: '',
    ends_at: '',
    max_subscription: 10
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const fetchCep = async () => {
    if (formData.zipcode.length !== 8) {
      setError('CEP deve ter 8 dígitos');
      return;
    }
    try {
      setLoading(true);
      const response = await fetch(`https://viacep.com.br/ws/${formData.zipcode}/json/`);
      const data = await response.json();
      if (data.erro) {
        setError('CEP não encontrado');
        return;
      }
      setFormData({
        ...formData,
        address: data.logradouro,
        city: data.localidade,
        state: data.uf
      });
      setError(null);
    } catch (err) {
      setError('Erro ao buscar CEP');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await api.post('/events', formData);
      navigate('/');
    } catch (err) {
      setError(
        err.response?.data?.errors
          ? Object.values(err.response.data.errors).flat().join(' ')
          : err.response?.data?.error || 'Erro ao criar evento'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container">
      <form className="form" onSubmit={handleSubmit} autoComplete="off">
        <h2 className="form-title">Cadastrar Evento</h2>
        <p className="form-subtitle">Preencha os dados para criar um novo evento</p>

        {error && <div className="alert alert-danger">{error}</div>}

        <div className="form-group">
          <label htmlFor="name">Nome do Evento</label>
          <input
            className="form-control"
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            placeholder="Ex: React Summit 2025"
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">Descrição do Evento</label>
          <textarea
            className="form-control"
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            placeholder="Descreva o evento..."
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="zipcode">CEP</label>
            <div className="input-with-button">
              <input
                className="form-control"
                type="text"
                id="zipcode"
                name="zipcode"
                maxLength="8"
                value={formData.zipcode}
                onChange={handleChange}
                required
                placeholder="Somente números"
                style={{ width: '70%' }}
              />
              <button
                type="button"
                className="btn btn-primary"
                onClick={fetchCep}
                disabled={loading}
                style={{ width: '28%', marginLeft: '2%' }}
              >
                Buscar
              </button>
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="number">Número</label>
            <input
              className="form-control"
              type="text"
              id="number"
              name="number"
              value={formData.number}
              onChange={handleChange}
              required
              placeholder="Número"
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="address">Endereço</label>
          <input
            className="form-control"
            type="text"
            id="address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            required
            readOnly
            placeholder="Rua/Avenida"
          />
        </div>

        <div className="form-group">
          <label htmlFor="complement">Complemento</label>
          <input
            className="form-control"
            type="text"
            id="complement"
            name="complement"
            value={formData.complement}
            onChange={handleChange}
            placeholder="Opcional"
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="city">Cidade</label>
            <input
              className="form-control"
              type="text"
              id="city"
              name="city"
              value={formData.city}
              onChange={handleChange}
              required
              readOnly
            />
          </div>
          <div className="form-group">
            <label htmlFor="state">Estado</label>
            <input
              className="form-control"
              type="text"
              id="state"
              name="state"
              value={formData.state}
              onChange={handleChange}
              required
              readOnly
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="starts_at">Data/hora início</label>
            <input
              className="form-control"
              type="datetime-local"
              id="starts_at"
              name="starts_at"
              value={formData.starts_at}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="ends_at">Data/hora fim</label>
            <input
              className="form-control"
              type="datetime-local"
              id="ends_at"
              name="ends_at"
              value={formData.ends_at}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="max_subscription">Vagas disponíveis</label>
          <input
            className="form-control"
            type="number"
            id="max_subscription"
            name="max_subscription"
            value={formData.max_subscription}
            onChange={handleChange}
            min="1"
            required
          />
        </div>

        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Criando...' : 'Cadastrar'}
        </button>
      </form>
    </div>
  );
};

export default CreateEvent;
