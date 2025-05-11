import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../services/api';

const EventDetails = () => {
  const { uuid } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [subscribeError, setSubscribeError] = useState(null);
  const [subscribeLoading, setSubscribeLoading] = useState(false);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await api.get(`/events/${uuid}`);
        setEvent(response.data);
      } catch (err) {
        setError('Erro ao carregar evento');
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [uuid]);

  const handleSubscribe = async () => {
    setSubscribeError(null);
    setSubscribeLoading(true);
    
    try {
      await api.post(`/events/${uuid}/subscribe`);
      navigate('/my-events');
    } catch (err) {
      setSubscribeError(err.response?.data?.error || 'Erro ao se inscrever no evento');
    } finally {
      setSubscribeLoading(false);
    }
  };

  if (loading) return <div>Carregando...</div>;
  if (error) return <div className="alert alert-danger">{error}</div>;
  if (!event) return <div>Evento não encontrado</div>;

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR') + ' às ' + date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="event-details-container">
      <h1>{event.name}</h1>
      
      <div className="event-info">
        <div className="event-date">
          <i className="icon-calendar"></i>
          {formatDate(event.starts_at)}
        </div>
        
        <div className="event-location">
          <i className="icon-location"></i>
          {event.address}, {event.number} - {event.city}, {event.state}
        </div>
      </div>
      
      <h3>Informações do evento</h3>
      <p className="event-description">{event.description}</p>
      
      {subscribeError && <div className="alert alert-danger">{subscribeError}</div>}
      
      <button 
        onClick={handleSubscribe} 
        className="btn-primary"
        disabled={subscribeLoading}
      >
        {subscribeLoading ? 'Processando...' : 'Inscrever-se'}
      </button>
    </div>
  );
};

export default EventDetails;
