// ErrorUpload.js
//CSS
import styles from "./ResponseUpload.module.css";

//Router
import { Link, useLocation } from "react-router-dom";

const ErrorUpload = () => {
  const location = useLocation();
  const errorObj = location.state?.error; 

  let displayMessage = "Um erro inesperado ocorreu durante o upload.";
  let errorCode = null;

  if (errorObj) {
    if (typeof errorObj === 'string') {
      // Se for a mensagem "Operação de upload cancelada: componente desmontado.",
      // mostre algo mais amigável.
      if (errorObj.includes("Operação de upload cancelada: componente desmontado.")) {
        displayMessage = "O envio foi interrompido. Tente novamente ou recarregue a página.";
      } else {
        displayMessage = errorObj;
      }
    } else if (errorObj.message) {
      if (errorObj.message.includes("Operação de upload cancelada: componente desmontado.")) {
        displayMessage = "O envio foi interrompido. Tente novamente ou recarregue a página.";
      } else {
        displayMessage = errorObj.message;
      }
    }

    if (errorObj.code) { 
      errorCode = errorObj.code;
    }
  }

  return (
    <div className="mainNavigate">
      <div className={styles.returnUpload}>
        <h3 className={styles.errorTitleUpload}>Erro!</h3>
        <p className={styles.errorDescriptionUpload}>
          Não foi possível carregar seu arquivo!
        </p>
        <p className={styles.errorDescriptionUpload}>
          Detalhes: {displayMessage}
          {errorCode && ` (Código: ${errorCode})`}
        </p>
        <p className={styles.errorDescriptionUpload}>
          Tente novamente em alguns minutos
        </p>
      </div>
      <div className={styles.buttonUpload}>
        <Link to="/upload">
          <button className="btn btn-outline">Tentar Novamente</button>
        </Link>
      </div>
    </div>
  );
};

export default ErrorUpload;