// UploadedDocs.js
//CSS
import styles from "./UploadedDocs.module.css";
//Hooks
import { useAuthentication } from "../../hooks/Auth/useAuthentication";
import { useUploadedDocs } from "../../hooks/UploadDoc/useUploadedDocs";


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
                (post) => (
                  <tr key={post.id}>
                    <td>{post.fullName}</td>
                    <td>{post.telephone}</td>
                    <td>
                      {/* 👉 AGORA USAMOS post.downloadUrl */}
                      {post.downloadUrl ? (
                        <a
                          href={post.downloadUrl}
                           
                          rel="noopener noreferrer"
                          // Use download attribute para forçar o download em vez de abrir no navegador
                          // O navegador ainda pode abrir se o tipo de arquivo for suportado
                          download={post.fileName || `documento-${post.id}`} 
                        >
                          {post.fileName || "Visualizar/Baixar Documento"}
                        </a>
                      ) : (
                        // Mostra uma mensagem de erro se a URL não pôde ser gerada
                        <span style={{ color: 'red' }}>
                          Não disponível {post.downloadError ? `(${post.downloadError.substring(0, 30)}...)` : ''}
                        </span>
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