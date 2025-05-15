import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../firebase/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import "./Login.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password,
      );
      const userEmail = userCredential.user.email;
      const userId = userCredential.user.uid;
      localStorage.setItem("userEmail", userEmail);

      const userDocRef = doc(db, "users", userId);
      const userDoc = await getDoc(userDocRef);
      if (userDoc.exists()) {
        const userData = userDoc.data();
        console.log("Datos del usuario:", userData);
      } else {
        console.error("No se encontraron datos del usuario en Firestore");
      }
      navigate("/");
    } catch (err) {
      console.error("Error de inicio de sesión:", err);
      setError("Credenciales incorrectas. Por favor, intente nuevamente.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-background-overlay"></div>
      <main className="login-form">
        <div className="login-header">
          <img src="/images/industrial-logo.png" alt="" className="login-logo" />
        
         
        </div>
        
        <form onSubmit={handleSubmit}>
          {error && <div className="login-error">{error}</div>}
          
          <div className="form-group">
            <label htmlFor="email">Correo Electrónico</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="usuario@empresa.com"
            />
            <span className="input-icon">
              <i className="fas fa-envelope"></i>
            </span>
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Contraseña</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
            />
            <span className="input-icon">
              <i className="fas fa-lock"></i>
            </span>
          </div>
          
          <button type="submit" className="login-button" disabled={isLoading}>
            {isLoading ? (
              <span className="spinner"></span>
            ) : (
              "INICIAR SESIÓN"
            )}
          </button>
          
          <div className="login-footer">
            <span className="divider">|</span>
            
          </div>
        </form>
        
        
      </main>
    </div>
  );
}

export default Login;