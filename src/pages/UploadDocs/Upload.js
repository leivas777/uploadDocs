//CSS
import styles from "./Upload.module.css";

//Hooks
import { useInsertDocument } from "../../hooks/UploadDoc/useUploadDoc";

//React
import { useState } from "react";

const Upload = () => {
  const [fullName, setFullName] = useState("");
  const [telephone, setTelephone] = useState("");
  const [file, setFile] = useState("");
  const [formError, setFormError] = useState("");

  const { insertDocument } = useInsertDocument("documents");

  const handleSubmit = (e) => {
    e.preventDefault();

    setFormError("");

    if (!fullName || !telephone) {
      setFormError("Por favor preencha todos os campos obrigatórios");
    }

    if (formError) {
      return;
    }

    insertDocument({
      fullName,
      telephone,
      file,
    });
  };

  return (
    <div className={styles.body}>
      <div className={styles.uploadContainer}>
        <div className={styles.uploadTitle}>
          <h4>Preencha os dados e faça upload do seu documento:</h4>
        </div>
        <div className={styles.uploadData}>
          <form onSubmit={handleSubmit}>
            <label>
              <span>Nome Completo:*</span>
              <input
                type="text"
                name="fullName"
                required
                placeholder="Seu primeiro nome"
                onChange={(e) => setFullName(e.target.value)}
                value={fullName}
              />
            </label>
            <label>
              <span>Telefone:*</span>
              <input
                type="tel"
                name="telephone"
                placeholder="Telefone com DDD"
                required
                onChange={(e) => setTelephone(e.target.value)}
                value={telephone}
              />
            </label>
            <label>
              <span>Arquivo:*</span>
              <input
                type="file"
                accept=".pdf"
                onChange={(e) => setFile(e.target.files[0])}
              />
            </label>
            <button>Salvar</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Upload;
