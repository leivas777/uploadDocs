// Upload.js
//CSS
import styles from "./Upload.module.css";

//Hooks
import { useInsertDocument } from "../../hooks/UploadDoc/useUploadDoc"; // Verifique o caminho correto!

//React
import { useState } from "react"; // Removido useEffect, já que a navegação será direta

//Router
import { useNavigate } from "react-router-dom";


const Upload = () => {
  const [fullName, setFullName] = useState("");
  const [telephone, setTelephone] = useState("");
  const [file, setFile] = useState(null);
  const [formError, setFormError] = useState("");

  // 'response' ainda será útil para exibir o estado de loading no botão
  const { insertDocument, response } = useInsertDocument("documents");

  const navigate = useNavigate();

  // 👉 O 'submitAttempted' e o 'useEffect' de navegação são removidos,
  // pois a navegação agora é tratada diretamente no handleSubmit.

  const handleSubmit = async (e) => {
    e.preventDefault();

    setFormError(""); // Limpa erros de formulário anteriores

    // Validação básica do formulário
    if (!fullName || !telephone || !file) {
      setFormError("Por favor, preencha todos os campos obrigatórios e selecione um arquivo.");
      return;
    }

    try {
      // �� AGUARDA diretamente a Promise retornada por insertDocument
      const result = await insertDocument({
        fullName,
        telephone,
        file,
      });
      console.log("Upload Component - insertDocument RESOLVEU com:", result);
      // Se a Promise resolveu, o upload e save foram bem-sucedidos
      navigate("/sucessoUpload");
    } catch (e) {
      console.error("Upload Component - Erro FINAL capturado no handleSubmit:", e);
      // Se a Promise foi rejeitada, algo deu errado
      // Use a mensagem de erro ou uma mensagem genérica
      navigate("/erroUpload", { state: { error: e.message || "Erro desconhecido durante o upload." } });
    }
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
                accept=".pdf, image/*"
                onChange={(e) => setFile(e.target.files[0])}
              />
            </label>
            {formError && <p className="error">{formError}</p>}
            {/* O response.loading do hook ainda controlará o botão */}
            {response.loading ? (
              <button disabled>Enviando...</button>
            ) : (
              <button>Salvar</button>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default Upload;