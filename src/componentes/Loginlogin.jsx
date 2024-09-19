// src/componentes/Login.jsx
import React, { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebaseConfig';
import 'bootstrap/dist/css/bootstrap.min.css'; 

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/'); // Redirige a la página inicial de tu aplicación
    } catch (err) {
      console.error('Error de inicio de sesión:', err);
      setError('Credenciales incorrectas o error en el inicio de sesión');
    }
  };

  return (
    <div className="d-flex align-items-center justify-content-center vh-100 bg-body-tertiary">
      <main className="form-signin text-center" style={{ width: '300px' }}>
        <form onSubmit={handleSubmit}>
          <h1 className="h3 mb-3 fw-normal" style={{ color: '#007bff' }}>LOGIN</h1>
          <div className="form-floating mb-3">
            <input
              type="email"
              className="form-control"
              id="floatingInput"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <label htmlFor="floatingInput">Email</label>
          </div>
          <div className="form-floating mb-3">
            <input
              type="password"
              className="form-control"
              id="floatingPassword"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <label htmlFor="floatingPassword">Contraseña</label>
          </div>
          <button className="w-100 btn btn-lg mt-3" type="submit" style={{ backgroundColor: '#007bff', borderColor: '#007bff' }}>
            Iniciar Sesión
          </button>
          {error && <p className="text-danger mt-3">{error}</p>}
          <p className="mt-5 mb-3 text-muted">&copy; 2023</p>
        </form>
      </main>
    </div>
  );
}

export default Login;
