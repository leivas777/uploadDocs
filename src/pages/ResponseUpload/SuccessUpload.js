//CSS
import styles from "./ResponseUpload.module.css";

//Router
import { Link } from "react-router-dom";

const SuccessUpload = () => {
  return (
    <div className="mainNavigate">
      <div className={styles.returnUpload}>
        <h3 className={styles.successTitleUpload}>Sucesso!</h3>
        <p className={styles.successDescriptionUpload}>
          Seu arquivo foi carregado com sucesso!
        </p>
      </div>
      <div className={styles.buttonUpload}>
        <Link to="/upload">
          <button className="btn btn-outline">Carregar outro arquivo</button>
        </Link>
      </div>
    </div>
  );
};

export default SuccessUpload;
