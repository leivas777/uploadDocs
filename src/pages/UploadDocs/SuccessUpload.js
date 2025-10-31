import React from "react";
const SuccessUpload = () => {
  return (
    <div className="mainNavigate">
      <div className="returnUpload">
        <h3 className="titleUpload">Sucesso!</h3>
        <p className="descriptionUpload">Seu arquivo foi carregado!</p>
      </div>
      <div className="buttonsUpload">
        <button>Carregar outro arquivo</button>
      </div>
    </div>
  );
};

export default SuccessUpload;
