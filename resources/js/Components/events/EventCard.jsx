import React from 'react';
import { Link } from 'react-router-dom';

const EventCard = ({ event }) => {
  // Formata a data para o padrão brasileiro
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
  };

  return (
    <Link to={`/events/${event.uuid_code}`} className="event-card">
      <div className="event-card-info">
        <div className="event-card-date">
          {formatDate(event.starts_at)}
        </div>
        <h3>{event.name}</h3>
        <div>
          {event.address} - {event.city}, {event.state}
        </div>
      </div>
    </Link>
  );
};

export default EventCard;
