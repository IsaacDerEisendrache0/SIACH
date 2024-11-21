import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../firebase/firebaseConfig'; // Importa auth y db desde firebaseConfig
import { doc, getDoc } from 'firebase/firestore';
import './Login.css'; // Estilos personalizados (opcional)

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); // Reinicia el mensaje de error antes de intentar el login
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const userEmail = userCredential.user.email; // Obtener el correo electrónico del usuario
      const userId = userCredential.user.uid;

      // Guardar el correo en el localStorage
      localStorage.setItem("userEmail", userEmail);

      // Recuperar datos del usuario desde Firestore (opcional)
      const userDocRef = doc(db, 'users', userId);
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        const userData = userDoc.data();
        console.log('Datos del usuario:', userData);
      } else {
        console.error('No se encontraron datos del usuario en Firestore');
      }

      navigate('/'); // Redirige a la página inicial de tu aplicación
    } catch (err) {
      console.error('Error de inicio de sesión:', err);
      setError('Credenciales incorrectas o error en el inicio de sesión');
    }
  };

  return (
    <div className="login-container">
      <video autoPlay muted loop className="video-background">
        <source src="/videos/72544-543388333_small.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <main className="form-signin text-center" style={{ width: '300px', position: 'relative', zIndex: 1 }}>
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
