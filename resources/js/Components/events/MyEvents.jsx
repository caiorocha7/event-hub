import React, { useEffect, useState } from 'react';
import api from '../../services/api'; // Certifique-se de ter um serviço axios configurado
import { Link } from 'react-router-dom';

const MyEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Busca eventos em que o usuário está inscrito
    const fetchMyEvents = async () => {
      try {
        const response = await api.get('/my-events'); // Ajuste a rota conforme seu backend
        setEvents(response.data);
      } catch (err) {
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
        {!loading && events.length === 0 && <p>Você não está inscrito em nenhum evento.</p>}
        {events.map(event => (
          <Link
            to={`/events/${event.uuid_code}`}
            className="event-card"
            key={event.uuid_code}
          >
            <div className="event-card-info">
              <div className="event-card-date">
                {new Date(event.starts_at).toLocaleDateString('pt-BR')}
              </div>
              <h3>{event.name}</h3>
              <div>
                {event.address} - {event.city}, {event.state}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default MyEvents;
