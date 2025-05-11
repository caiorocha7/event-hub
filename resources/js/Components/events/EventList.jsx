import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import EventCard from './EventCard';

const EventList = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await api.get('/events');
        setEvents(response.data);
        setLoading(false);
      } catch (err) {
        setError('Erro ao carregar eventos');
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  if (loading) return <div>Carregando eventos...</div>;
  if (error) return <div className="alert alert-danger">{error}</div>;

  return (
    <div className="events-container">
      <h2>Eventos disponíveis</h2>
      
      <div className="events-grid">
        {events.length > 0 ? (
          events.map(event => (
            <EventCard key={event.uuid_code} event={event} />
          ))
        ) : (
          <p>Nenhum evento disponível no momento.</p>
        )}
      </div>
      
      <Link to="/events/create" className="btn-primary">
        Criar novo evento
      </Link>
    </div>
  );
};

export default EventList;