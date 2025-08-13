// React
import { useState, useEffect } from "react" // Removido 'useRef' pois não será mais necessário para isMounted

// Firebase
import { db } from "../../firebase/config"
import {
    collection,
    onSnapshot,
    orderBy,
    query
} from "firebase/firestore"

export const useUploadedDocs = (docCollection) => {
    const [documents, setDocuments] = useState([])
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(true) // Começa como true

    // O isMounted.current não é mais necessário com esta abordagem
    // A flag 'isCurrentEffectActive' abaixo fará o controle

    useEffect(() => {
        // Esta flag será 'true' para esta execução específica do efeito
        // e se tornará 'false' apenas quando o 'cleanup' deste efeito for chamado.
        let isCurrentEffectActive = true;

        console.log("useUploadedDocs Hook: Effect started for collection:", docCollection);
        setLoading(true); // Garante que o loading seja true ao iniciar a busca

        const collectionRef = collection(db, docCollection);
        let q = query(collectionRef, orderBy('createdAt', 'desc'));

        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            console.log("useUploadedDocs: onSnapshot callback triggered.");
            if (isCurrentEffectActive) { // Agora verifica a flag local do efeito
                const fetchedDocs = querySnapshot.docs.map((doc) => {
                    // console.log("Document data from Firestore (sample):", doc.data()); // Manter para debug se necessário
                    return {
                        id: doc.id,
                        ...doc.data()
                    };
                });
                console.log("useUploadedDocs: Documents fetched (count):", fetchedDocs.length);

                setDocuments(fetchedDocs);
                setLoading(false); // Agora este setLoading(false) sempre será chamado se o efeito estiver ativo
                setError(null);
                console.log("useUploadedDocs: Loading set to false. Documents state updated.");
            } else {
                console.log("useUploadedDocs: onSnapshot triggered but effect no longer active. Skipping state update.");
            }
        }, (err) => {
            console.error("useUploadedDocs: Firebase onSnapshot ERROR DETAILS:", err.code, err.message, err);
            if (isCurrentEffectActive) { // Agora verifica a flag local do efeito
                setError("Erro ao carregar documentos: " + err.message);
                setLoading(false); // E este também
                setDocuments([]);
                console.log("useUploadedDocs: Loading set to false due to error.");
            } else {
                console.log("useUploadedDocs: onSnapshot error fired but effect no longer active. State update skipped.");
            }
        });

        // Cleanup function for this useEffect.
        // Ela é executada quando o componente é desmontado ou quando as dependências do useEffect mudam.
        return () => {
            console.log("useUploadedDocs: Cleanup for effect. Unsubscribing from Firestore.");
            isCurrentEffectActive = false; // Marca esta execução do efeito como inativa
            unsubscribe(); // DESINSCREVE-SE DO LISTENER DO FIRESTORE! ESSENCIAL!
        };
    }, [docCollection]); // O efeito roda novamente se a coleção mudar

    // Este log roda em toda renderização, mostrando o estado atual
    console.log("useUploadedDocs Hook: Current state on render - documents:", documents.length, "loading:", loading, "error:", error);

    return { documents, loading, error };
}