// useUploadedDocs.js
// React
import { useState, useEffect } from "react";

// Firebase
import { db, storage } from "../../firebase/config"; // �� Importe 'storage'
import {
  collection,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";
// 👉 Importe 'ref' e 'getDownloadURL'
import { ref, getDownloadURL } from "firebase/storage"; 

export const useUploadedDocs = (docCollection) => {
  const [documents, setDocuments] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isCurrentEffectActive = true;

    console.log("useUploadedDocs Hook: Effect started for collection:", docCollection);
    setLoading(true);

    const collectionRef = collection(db, docCollection);
    let q = query(collectionRef, orderBy('createdAt', 'desc'));

    // Torne o callback do onSnapshot assíncrono para poder usar await
    const unsubscribe = onSnapshot(q, async (querySnapshot) => { // 👉 Adicione 'async' aqui
      console.log("useUploadedDocs: onSnapshot callback triggered.");
      if (isCurrentEffectActive) {
        // Primeiro, mapeie os dados brutos do Firestore
        const rawDocs = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        // Agora, para cada documento, tente obter a URL de download
        const docsWithUrls = await Promise.all( // 👉 Use Promise.all para esperar todas as URLs
          rawDocs.map(async (doc) => {
            if (doc.storageFilePath) { // Se o documento tiver um storageFilePath
              try {
                // Cria uma referência para o arquivo no Storage
                const fileRef = ref(storage, doc.storageFilePath);
                // Tenta obter a URL de download (requer autenticação e permissão de leitura)
                const downloadUrl = await getDownloadURL(fileRef);
                return { ...doc, downloadUrl }; // Retorna o documento com a downloadUrl
              } catch (urlError) {
                // Se houver um erro ao obter a URL (ex: permissão, arquivo não encontrado)
                console.warn(`useUploadedDocs: Erro ao obter URL de download para ${doc.storageFilePath}:`, urlError);
                return { ...doc, downloadUrl: null, downloadError: urlError.message }; // Indica falha na URL
              }
            }
            return { ...doc, downloadUrl: null }; // Documento sem storageFilePath
          })
        );

        console.log("useUploadedDocs: Documents fetched and URLs processed (count):", docsWithUrls.length);

        setDocuments(docsWithUrls); // Atualize o estado com os documentos que agora têm 'downloadUrl'
        setLoading(false);
        setError(null);
        console.log("useUploadedDocs: Loading set to false. Documents state updated.");
      } else {
        console.log("useUploadedDocs: onSnapshot triggered but effect no longer active. Skipping state update.");
      }
    }, (err) => {
      console.error("useUploadedDocs: Firebase onSnapshot ERROR DETAILS:", err.code, err.message, err);
      if (isCurrentEffectActive) {
        setError("Erro ao carregar documentos: " + err.message);
        setLoading(false);
        setDocuments([]);
        console.log("useUploadedDocs: Loading set to false due to error.");
      } else {
        console.log("useUploadedDocs: onSnapshot error fired but effect no longer active. State update skipped.");
      }
    });

    return () => {
      console.log("useUploadedDocs: Cleanup for effect. Unsubscribing from Firestore.");
      isCurrentEffectActive = false;
      unsubscribe();
    };
  }, [docCollection]);

  console.log("useUploadedDocs Hook: Current state on render - documents:", documents.length, "loading:", loading, "error:", error);

  return { documents, loading, error };
};