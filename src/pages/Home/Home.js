//CSS
import styles from "./Home.module.css";

//Router
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div>
      <div className={styles.title}>
        <h1>Bem Vindo(a)</h1>
      </div>

      <div className={styles.body}>
        <div className={styles.uploads}>
          <Link to='/upload'>Fazer upload de arquivo</Link>
        </div>
        <div className={styles.login}>
          <Link to='/login'>Efetuar Login</Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
