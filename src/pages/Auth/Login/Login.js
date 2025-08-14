//CSS
import styles from "./Login.module.css";

//Router
import { useNavigate, Link } from "react-router-dom"; // Importe useNavigate aqui

//Hooks
import { useAuthentication } from "../../../hooks/Auth/useAuthentication";
import { useState, useEffect } from "react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const { login, error: authError, loading} = useAuthentication();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    const user = {
      email,
      password,
    };
    
    const res = await login(user);

    if (!authError) {
      if (res && res.success) {
        navigate("/uploadedDocs");
      }
    }
  };

  useEffect(() => {
    if (authError) {
      setError(authError);
    }
  }, [authError, loading, navigate, email, password]);
  return (
    <div className={styles.login}>
      <h1>Entrar</h1>
      <p>Faça o login para poder utilizar o sistema</p>
      <form onSubmit={handleSubmit}>
        <label>
          <span>E-mail:</span>
          <input
            type="email"
            name="email"
            required
            placeholder="E-mail do usuário"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>
        <label>
          <span>Senha:</span>
          <input
            type="password"
            name="password"
            required
            placeholder="Insira sua senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>
        {!loading && <button>Entrar</button>}
        {loading && (
          <button disabled>
            Aguarde...
          </button>
        )}
        {error && <p className="error">{error}</p>}
      </form>
      <Link to="/">
            <button>Voltar</button>
      </Link>

    </div>
  );
};

export default Login;
