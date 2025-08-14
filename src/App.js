//CSS
import "./App.css";

//React
import { useEffect, useState } from "react";

//Router
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

//Hooks
import { useAuthentication } from "./hooks/Auth/useAuthentication";

//Context
import { AuthProvider } from "./context/Auth/AuthContext";

//Pages
import Home from "./pages/Home/Home";
import Upload from "./pages/UploadDocs/Upload";
import UploadedDocs from "./pages/UploadedDocs/UploadedDocs";
import Login from "./pages/Auth/Login/Login";

//Firebase
import { onAuthStateChanged } from "firebase/auth";
import SuccessUpload from "./pages/ResponseUpload/SuccessUpload";
import ErrorUpload from "./pages/ResponseUpload/ErrorUpload";

function App() {
  const [user, setUser] = useState(undefined);
  const { auth } = useAuthentication();

  const loadingUser = user === undefined;

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      setUser(user);
    });
  }, [auth]);

  if (loadingUser) {
    return <p>Carregando...</p>;
  }
  return (
    <>
      <AuthProvider value={{ user }}>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/upload" element={<Upload />} />
            <Route path="/sucessoUpload" element={<SuccessUpload/>}/>
            <Route path="/erroUpload" element={<ErrorUpload/>}/>
            <Route
              path="/uploadedDocs"
              element={user ? <UploadedDocs /> : <Navigate to="/login" />}
            />
            <Route path="login" element={<Login />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </>
  );
}

export default App;
