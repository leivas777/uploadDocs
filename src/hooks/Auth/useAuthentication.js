//Firebase
import { db } from "../../firebase/config"
import { getAuth, signOut, signInWithEmailAndPassword, } from "firebase/auth";

//React
import { useState, useEffect } from "react";

export const useAuthentication = () => {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(null);
  const [canceled, setCanceled] = useState(false);

  const auth = getAuth();

  function checkIfIsCanceled() {
    if (canceled) {
      return;
    }
  }

  //Logout
  const logout = () => {
    checkIfIsCanceled();
    signOut(auth);
  };

  //Login
  const login = async (data) => {
    checkIfIsCanceled();

    setLoading(true);
    setError(false);

    try {
      await signInWithEmailAndPassword(auth, data.email, data.password);
      setLoading(false)
      return {success: true}
    } catch (error) {
      console.log(error.message);
      console.log(typeof error.message);
      console.log(error.message.includes("useer-not"));

      let systemErrorMessage;

      if (error.message.includes("user-not-found")) {
        systemErrorMessage = "Usuário não encontrado.";
      } else if (error.message.includes("wrong-password")) {
        systemErrorMessage = "Senha Incorreta.";
      } else {
        systemErrorMessage = "Ocorreu um erro, por favor tente mais tarde.";
      }

      setError(systemErrorMessage);
    }
    setLoading(false);
  };
  useEffect(() => {
    return setCanceled(true);
  }, []);

  return {
    auth,
    error,
    loading,
    logout,
    login,
  };
};
