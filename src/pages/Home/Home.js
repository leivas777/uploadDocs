//CSS
import styles from "./Home.module.css";

//Router
import { Link } from "react-router-dom";

//Imagens
import logo from '../../assets/logo_manu.jpg'

const Home = () => {
  return (
    <div>
      <div className={styles.logo}>
        <img src={logo} alt="Logo"/>
      </div>
      <div className={styles.title}>
        <h1>Bem Vindo(a)</h1>
        <h5>Faça upload dos seus arquivos</h5>

      </div>
      <div className={styles.body}>
        <div className={styles.uploads}>
          <Link to='/upload'>Fazer upload de arquivo</Link>
        </div>

      </div>
              <div className={styles.login}>
          <Link to='/login'>Efetuar Login</Link>
        </div>
    </div>
  );
};

export default Home;
