import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../services/api';

const EditEvent = () => {
  const { uuid } = useParams();
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

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await api.get(`/events/${uuid}`);
        setFormData(response.data);
      } catch (err) {
        setError('Erro ao carregar evento');
      }
    };
    fetchEvent();
  }, [uuid]);

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
      await api.put(`/events/${uuid}`, formData);
      navigate('/my-events');
    } catch (err) {
      setError(
        err.response?.data?.errors 
          ? Object.values(err.response.data.errors).flat().join(' ')
          : 'Erro ao atualizar evento'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container">
      <form className="form" onSubmit={handleSubmit}>
        <h2 className="form-title">Editar Evento</h2>
        <p className="form-subtitle">Atualize os dados do seu evento</p>

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
            placeholder="Nome do evento"
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">Descrição</label>
          <textarea
            className="form-control"
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            placeholder="Descreva detalhes do evento"
            rows="4"
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
                placeholder="00000-000"
                style={{ width: '70%' }}
              />
              <button
                type="button"
                className="btn btn-primary"
                onClick={fetchCep}
                disabled={loading}
                style={{ width: '28%', marginLeft: '2%' }}
              >
                {loading ? 'Buscando...' : 'Buscar'}
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
              placeholder="Nº"
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

        <div className="form-actions">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => navigate(-1)}
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
          >
            {loading ? 'Salvando...' : 'Salvar Alterações'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditEvent;
