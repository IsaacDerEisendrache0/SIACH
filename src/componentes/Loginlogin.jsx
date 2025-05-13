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
  const navigate = useNavigate();

  // Actualiza las variables CSS según la posición del cursor
  useEffect(() => {
    const handleMouseMove = (e) => {
      const x = e.clientX / window.innerWidth;
      const y = e.clientY / window.innerHeight;
      // Actualiza las variables CSS en el root del documento
      document.documentElement.style.setProperty("--bg-x", `${x * 100}%`);
      document.documentElement.style.setProperty("--bg-y", `${y * 100}%`);
    };

    document.addEventListener("mousemove", handleMouseMove);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
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
      setError("Credenciales incorrectas o error en el inicio de sesión");
    }
  };

  return (
    <div className="login-container">
      <video autoPlay muted loop className="video-background">
        <source src="/videos/72544-543388333_small.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <main className="form-signin text-center">
        <form onSubmit={handleSubmit}>
          <h1 className="h3 mb-3 fw-normal">LOGIN</h1>
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
          <button className="w-100 btn btn-lg mt-3" type="submit">
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
