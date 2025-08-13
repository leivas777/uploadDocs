// useInsertDocument.js
// React
import { useState, useEffect, useReducer } from "react";

// Firebase
import { db, storage } from "../../firebase/config";
import { collection, addDoc, Timestamp } from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage"

const initialState = {
  loading: null,
  error: null,
  document: null,
};

const insertReducer = (state, action) => {
  switch (action.type) {
    case "LOADING":
      return { loading: true, error: null };
    case "INSERTED_DOC":
      // Quando o documento é inserido com sucesso, você pode querer retornar os dados inseridos
      return { loading: false, error: null, document: action.payload };
    case "ERROR":
      // O 'document: action.payload' aqui não faz muito sentido para erro,
      // geralmente seria 'document: null' ou 'document: state.document'
      // Ajustei para 'document: null' para clareza
      return { loading: false, error: action.payload, document: null };
    default:
      return state;
  }
};

export const useInsertDocument = (docCollection) => {
  const [response, dispatch] = useReducer(insertReducer, initialState);
  const [canceled, setCanceled] = useState(false);

  const checkCancelBeforeDispatch = (action) => {
    if (!canceled) {
      dispatch(action);
    }
  };

  // O 'documentData' agora incluirá o objeto File no campo 'file'
  const insertDocument = async (documentData) => {
    checkCancelBeforeDispatch({ type: "LOADING" });
    console.log("useInsertDocument: Data received for upload:", documentData); // Debug inicial

    try {
      const { file, ...rest } = documentData; // Separa o objeto File do restante dos dados
      let fileURL = null;
      let fileName = null;

      if (file) { // Só tenta upload se um objeto File existir
        console.log("useInsertDocument: File object detected. Starting Storage upload.");
        // Cria um nome único para o arquivo no Storage para evitar colisões
        fileName = `${Date.now()}-${file.name}`; // Removi o espaço extra após o '-' no fileName
        const storageRef = ref(storage, `documents/${fileName}`); // Define o caminho no Storage

        const uploadTask = uploadBytesResumable(storageRef, file);

        // Monitora o progresso e a conclusão do upload
        await new Promise((resolve, reject) => {
          uploadTask.on(
            "state_changed",
            (snapshot) => {
              // Você pode usar isso para exibir uma barra de progresso (opcional)
              const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
              console.log(`useInsertDocument: Upload está ${progress.toFixed(2)}% pronto.`);
            },
            (error) => {
              // Trata erros de upload
              console.error("useInsertDocument: Erro no upload para o Storage:", error);
              checkCancelBeforeDispatch({ type: "ERROR", payload: error.message });
              reject(error); // Rejeita a promise em caso de erro
            },
            async () => {
              // Upload completo, agora obtém a URL de download
              fileURL = await getDownloadURL(uploadTask.snapshot.ref);
              console.log("useInsertDocument: File uploaded to Storage. Download URL:", fileURL);
              resolve(); // <--- CHAMA RESOLVE() AQUI! ISSO É CRUCIAL!
            }
          );
        });
      } else {
        console.log("useInsertDocument: No file object detected. Saving metadata only (if applicable).");
      }

      // 2. Salvar os dados do documento no Firestore
      const newDocument = {
        ...rest, // full_name, process_number, telephone
        fileURL, // A URL para download do arquivo no Storage (agora preenchida!)
        fileName, // O nome original do arquivo (agora preenchido!)
        createdAt: Timestamp.fromDate(new Date()), // Use Timestamp para datas no Firestore
      };

      console.log("useInsertDocument: Document data prepared for Firestore:", newDocument); // <-- MUITO IMPORTANTE!

      const insertedDocumentRef = await addDoc(
        collection(db, docCollection),
        newDocument
      );

      console.log("useInsertDocument: Document successfully added to Firestore with ID:", insertedDocumentRef.id);

      checkCancelBeforeDispatch({
        type: "INSERTED_DOC",
        payload: { id: insertedDocumentRef.id, ...newDocument },
      });
    } catch (error) {
      console.error("useInsertDocument: Erro geral ao fazer upload do documento ou salvar no Firestore:", error);
      checkCancelBeforeDispatch({ type: "ERROR", payload: error.message });
    }
  };

  useEffect(() => {
    return () => setCanceled(true);
  }, []);

  return { insertDocument, response };
};