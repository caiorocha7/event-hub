import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Header = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <header className="header">
      <div className="header-container">
        <Link to="/" className="logo">Event Hub</Link>
        <nav className="nav-links">
          {token ? (
            <>
              <Link to="/my-events">Meus Eventos</Link>
              <Link to="/events/create">Criar Evento</Link>
              <button onClick={handleLogout} className="btn-primary" style={{marginLeft: 10}}>Sair</button>
            </>
          ) : (
            <>
              <Link to="/login">Entrar</Link>
              <Link to="/register">Cadastrar</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
