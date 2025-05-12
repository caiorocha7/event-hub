import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { Link } from 'react-router-dom';

const MyEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMyEvents = async () => {
      try {
        const response = await api.get('/my-events');
        // Garante que events seja sempre um array
        const data = Array.isArray(response.data) ? response.data : [];
        setEvents(data);
      } catch (err) {
        console.error('Erro ao buscar eventos:', err);
        setEvents([]);
      } finally {
        setLoading(false);
      }
    };

    fetchMyEvents();
  }, []);

  return (
    <div className="events-container">
      <h2>Meus eventos</h2>
      <div className="events-grid">
        {loading && <p>Carregando...</p>}
        {!loading && events.length === 0 && (
          <p>Você não está inscrito nem é dono de nenhum evento.</p>
        )}
        {events.map(event => (
          <Link
            to={`/events/${event.uuid_code}`}
            className="event-card"
            key={event.uuid_code}
          >
            <div className="event-card-info">
              <div className="event-card-date">
                {event.starts_at
                  ? new Date(event.starts_at).toLocaleDateString('pt-BR')
                  : ''}
              </div>
              <h3>{event.name}</h3>
              <div>
                {event.address} - {event.city}, {event.state}
              </div>
              {/* Exibe se você é o dono */}
              {event.owner_id && event.owner_id === event.user_id && (
                <span className="badge badge-owner">Você é o dono</span>
              )}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default MyEvents;
