import { BrowserRouter as Router, Route, Routes, Link, useLocation } from 'react-router-dom';
import Login from './componentes/Loginlogin';
import Main from './Norma_17/norma_17';
import RiskTable from './Norma_17/norma_17'; // Importa el componente correctamente

function Navigation() {
  const location = useLocation();
  
  // Mostrar la navegación solo si no estamos en las páginas de Login o Main
  const showNavigation = !(location.pathname === '/login' || location.pathname === '/main');

  return (
    <div className="navbar">
      {showNavigation && (
        <>
          <Link to="/">
            <button className="btn btn-primary">Inicio</button>
          </Link>
          <Link to="/login">
            <button className="btn btn-primary">Iniciar Sesión</button>
          </Link>
          <Link to="/norma-17">
            <button className="btn btn-primary">Ir a Norma 17</button>
          </Link>
        </>
      )}
    </div>
  );
}

function App() {
  return (
    <Router>
      <div className="app-container">
        <header className="App-header">
          <Navigation />
          <Routes>
            <Route path="/" element={<h1 className='text'>Bienvenido a la Página de Inicio</h1>} />
            <Route path="/login" element={<Login />} />
            <Route path="/main" element={<Main />} />
            <Route path="/norma-17" element={<RiskTable />} /> {/* Añade la ruta para RiskTable */}
          </Routes>
        </header>
        <footer className="footer">
          <p>© 2024 Mi Aplicación. Todos los derechos reservados.</p>
        </footer>
      </div>
    </Router>
  );
}

export default App;
