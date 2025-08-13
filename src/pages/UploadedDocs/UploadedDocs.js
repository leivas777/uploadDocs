//CSS
import styles from "./UploadedDocs.module.css";
//Hooks
import { useAuthentication } from "../../hooks/Auth/useAuthentication";
import { useUploadedDocs } from "../../hooks/UploadDoc/useUploadedDocs";

//Router
import { useNavigate } from "react-router-dom";

const UploadedDocs = () => {
  const { logout } = useAuthentication();
  const { documents, loading, error } = useUploadedDocs("documents");

  return (
    <div className={styles.main}>
      <button onClick={logout}>Efetuar Logout</button>
      <div className={styles.documents}>
        <table>
          <thead>
            <tr>
              <th>Cliente:</th>
              <th>Telefone:</th>
              <th>Arquivo:</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan="3">Carregando Documentos...</td>
              </tr>
            )}
            {error && (
              <tr>
                <td colSpan="3" style={{ color: "red" }}>
                  Erro ao carregar: {error}
                </td>
              </tr>
            )}
            {!loading && !error && documents.length === 0 && (
              <tr>
                <td colSpan="3"> Nenhum documento encontrado.</td>
              </tr>
            )}
            {!loading &&
              !error &&
              documents.length > 0 &&
              documents.map(
                (
                  post // <-- MUDAR {} PARA () AQUI
                ) => (
                  <tr key={post.id}>
                    <td>{post.fullName}</td>
                    <td>{post.telephone}</td>
                    <td>
                      {post.fileURL ? (
                        <a
                          href={post.fileURL}
                          target="_blank" // Abrir em nova aba é uma boa prática
                          rel="noopener noreferrer"
                          download={post.fileName || "document.pdf"}
                        >
                          {post.fileName || "Visualizar/Baixar Documento"}
                        </a>
                      ) : (
                        "N/A"
                      )}
                    </td>
                  </tr>
                )
              )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UploadedDocs;
