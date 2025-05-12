import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../services/api';

const EventDetails = () => {
  const { uuid } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState(null);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Busca o evento
        const eventResponse = await api.get(`/events/${uuid}`);
        setEvent(eventResponse.data);

        // Busca o usuário logado
        const userResponse = await api.get('/auth/me');
        setUserId(userResponse.data.id);

      } catch (err) {
        setError('Erro ao carregar evento');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [uuid]);

  const isOwner = event && userId && event.owner_id === userId;
  const isSubscribed = event?.guests?.some(guest => guest.user_id === userId);

  const handleSubscribe = async () => {
    setError(null);
    setActionLoading(true);
    try {
      await api.post(`/events/${uuid}/subscribe`);
      navigate('/my-events');
    } catch (err) {
      setError(err.response?.data?.error || 'Erro ao se inscrever');
    } finally {
      setActionLoading(false);
    }
  };

  const handleUnsubscribe = async () => {
    setError(null);
    setActionLoading(true);
    try {
      await api.delete(`/events/${uuid}/unsubscribe`);
      navigate('/my-events');
    } catch (err) {
      setError(err.response?.data?.error || 'Erro ao cancelar inscrição');
    } finally {
      setActionLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR') + ' às ' + 
           date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  };

  if (loading) return <div>Carregando...</div>;
  if (error) return <div className="alert alert-danger">{error}</div>;
  if (!event) return <div>Evento não encontrado</div>;

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

      {error && <div className="alert alert-danger">{error}</div>}

      {!isOwner && (
        <div className="event-actions">
          {isSubscribed ? (
            <button
              className="btn-danger"
              onClick={handleUnsubscribe}
              disabled={actionLoading}
            >
              {actionLoading ? 'Cancelando...' : 'Cancelar Inscrição'}
            </button>
          ) : (
            <button
              className="btn-primary"
              onClick={handleSubscribe}
              disabled={actionLoading}
            >
              {actionLoading ? 'Inscrevendo...' : 'Inscrever-se'}
            </button>
          )}
        </div>
      )}

      {isOwner && (
        <div className="alert alert-info">
          Você é o organizador deste evento
        </div>
      )}
    </div>
  );
};

export default EventDetails;
