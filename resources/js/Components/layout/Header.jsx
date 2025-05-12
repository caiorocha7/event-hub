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
      <nav className="navbar">
        <Link to="/" className="logo">Event Hub</Link>

        <div className="nav-group">
          {token ? (
            <>
              <Link to="/my-events">Meus Eventos</Link>
              <Link to="/events/create">Criar Evento</Link>
              <button onClick={handleLogout} className="btn btn-primary btn-logout">
                Sair
              </button>
            </>
          ) : (
            <>
              <Link to="/login">Entrar</Link>
              <Link to="/register">Cadastrar</Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Header;
