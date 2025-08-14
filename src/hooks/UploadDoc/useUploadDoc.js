// useInsertDocument.js
// React
import { useState, useEffect, useReducer, useCallback } from "react";

// Firebase
import { db, storage } from "../../firebase/config";
import { collection, addDoc, Timestamp } from "firebase/firestore";
import { ref, uploadBytesResumable } from "firebase/storage"

const initialState = {
  loading: null,
  error: null,
  document: null,
};

const insertReducer = (state, action) => {
  switch (action.type) {
    case "LOADING":
      return { loading: true, error: null, document: null };
    case "INSERTED_DOC":
      return { loading: false, error: null, document: action.payload };
    case "ERROR":
      return { loading: false, error: action.payload, document: null };
    default:
      return state;
  }
};

export const useInsertDocument = (docCollection) => {
  const [response, dispatch] = useReducer(insertReducer, initialState);
  const [canceled, setCanceled] = useState(false);

  const insertDocument = useCallback(async (documentData) => {
    // 👉 1. Dispatch LOADING imediatamente para atualizar a UI.
    // Esta ação é síncrona e deve ocorrer antes de qualquer verificação de cancelamento
    // que possa abortar a operação principal.
    dispatch({ type: "LOADING" });
    console.log("useInsertDocument - Dispatching LOADING.");

    try {
      // 👉 2. Agora, verifique se o hook foi "cancelado" (componente desmontado)
      // Se sim, aborte a operação longa e defina o estado de erro.
      if (canceled) {
        const cancelError = new Error("Operação de upload cancelada: componente desmontado.");
        console.warn("useInsertDocument - Component already unmounted. Aborting operation.");
        // Define o estado de erro, pois a operação foi abortada.
        dispatch({ type: "ERROR", payload: cancelError }); 
        return Promise.reject(cancelError); // Rejeita a Promise para que o chamador capture
      }

      const { file, ...rest } = documentData;
      let storageFilePath = null;
      let fileName = null;

      if (file) {
        console.log("useInsertDocument: File object detected. Starting Storage upload.");
        fileName = `${Date.now()}-${file.name}`;
        storageFilePath = `unauthenticated_uploads/${fileName}`; 
        const storageRef = ref(storage, storageFilePath);

        const uploadTask = uploadBytesResumable(storageRef, file);

        await new Promise((resolve, reject) => {
          uploadTask.on(
            "state_changed",
            (snapshot) => {
              const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
              console.log(`useInsertDocument: Upload está ${progress.toFixed(2)}% pronto.`);
            },
            (error) => {
              console.error("useInsertDocument: Erro REAL no upload para o Storage (on state_changed):", error);
              // Dispatch ERROR apenas se não cancelado APÓS a operação assíncrona (boa prática)
              if (!canceled) {
                dispatch({ type: "ERROR", payload: error });
              }
              reject(error); 
            },
            () => {
              console.log("useInsertDocument: File uploaded to Storage. Skipping getDownloadURL for security.");
              resolve(); 
            }
          );
        });
      } else {
        console.log("useInsertDocument: No file object detected. Saving metadata only (if applicable).");
      }

      const newDocument = {
        ...rest,
        storageFilePath: storageFilePath, 
        fileName: fileName, 
        createdAt: Timestamp.fromDate(new Date()),
      };

      console.log("useInsertDocument: Document data prepared for Firestore:", newDocument);

      const insertedDocumentRef = await addDoc(
        collection(db, docCollection),
        newDocument
      );

      const resultPayload = { id: insertedDocumentRef.id, ...newDocument };
      console.log("useInsertDocument: Document successfully added to Firestore with ID:", insertedDocumentRef.id);
      
      // Dispatch INSERTED_DOC apenas se não cancelado APÓS a operação assíncrona
      if (!canceled) {
        dispatch({ type: "INSERTED_DOC", payload: resultPayload });
      }
      console.log("useInsertDocument - insertDocument concluído com sucesso.");
      return resultPayload; 
    } catch (error) {
      console.error("useInsertDocument: Erro crítico (catch externo):", error);
      // Dispatch ERROR apenas se não cancelado APÓS a operação assíncrona
      if (!canceled) {
        dispatch({ type: "ERROR", payload: error });
      }
      console.log("useInsertDocument - insertDocument concluído com erro.");
      throw error; 
    }
  }, [docCollection, canceled]); // `canceled` é uma dependência do useCallback

  // Este useEffect é para gerenciar a flag 'canceled' quando o componente é montado/desmontado
  useEffect(() => {
    setCanceled(false); // Garante que canceled seja false na montagem inicial
    return () => {
      setCanceled(true); // Define canceled como true na desmontagem do componente
      console.log("useInsertDocument - Cleanup: setCanceled(true)");
    };
  }, []); // Array de dependências vazio significa que roda uma vez na montagem e uma vez na desmontagem

  // Log para depuração do estado atual do 'response'
  useEffect(() => {
    console.log("useInsertDocument - ESTADO ATUAL DO RESPONSE:", response);
  }, [response]);

  return { insertDocument, response };
};