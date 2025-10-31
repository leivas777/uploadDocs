import React, { useState, useRef, useEffect } from "react";
import styles from "./MainHome.module.css";

const MainHome = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Olá! Como posso ajudá-lo hoje?",
      sender: "bot",
      timestamp: new Date(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  // URL do seu webhook N8N - substitua pela sua URL real
  const N8N_WEBHOOK_URL =
    "https://curso-n8n-n8n.ebwe7d.easypanel.host/webhook/faleConosco";


  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessageToN8N = async (message) => {
    try {
      const response = await fetch(N8N_WEBHOOK_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: message,
          timestamp: new Date().toISOString(),
          sessionId: generateSessionId(), // Para manter contexto da conversa
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.response || "Desculpe, não consegui processar sua mensagem.";
    } catch (error) {
      console.error("Erro ao enviar mensagem para N8N:", error);
      throw new Error("Erro de conexão. Tente novamente em alguns instantes.");
    }
  };

  const generateSessionId = () => {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();

    if (!inputMessage.trim() || isLoading) return;

    const userMessage = {
      id: Date.now(),
      text: inputMessage.trim(),
      sender: "user",
      timestamp: new Date(),
    };

    // Adiciona mensagem do usuário
    setMessages((prev) => [...prev, userMessage]);
    setInputMessage("");
    setIsLoading(true);
    setIsTyping(true);

    try {
      // Simula delay de digitação do bot
      setTimeout(() => setIsTyping(false), 1000);

      const botResponse = await sendMessageToN8N(userMessage.text);

      const botMessage = {
        id: Date.now() + 1,
        text: botResponse,
        sender: "bot",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      const errorMessage = {
        id: Date.now() + 1,
        text: error.message,
        sender: "bot",
        timestamp: new Date(),
        isError: true,
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(e);
    }
  };

  return (
    <div>
      <div className={styles.navbar}>
        <div className={styles.logo}>
          <h3>Leivas & Leivas Automação</h3>
        </div>
        <div className={styles.nav}></div>
      </div>
      <div className={styles.body}>
        <div className={styles.chatContainer}>
          <div className={styles.chatHeader}>
            <h4>💬 Fale conosco</h4>
            <span className={styles.status}>
              {isTyping ? "Digitando..." : "Online"}
            </span>
          </div>

          <div className={styles.chatMessages}>
            {messages.map((message) => (
              <div
                key={message.id}
                className={`${styles.message} ${
                  message.sender === "user"
                    ? styles.userMessage
                    : styles.botMessage
                } ${message.isError ? styles.errorMessage : ""}`}
              >
                <div className={styles.messageContent}>
                  <p>{message.text}</p>
                  <span className={styles.timestamp}>
                    {message.timestamp.toLocaleTimeString("pt-BR", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className={`${styles.message} ${styles.botMessage}`}>
                <div className={styles.typingIndicator}>
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          <form className={styles.chatInput} onSubmit={handleSendMessage}>
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Digite sua mensagem..."
              disabled={isLoading}
              maxLength={500}
            />
            <button
              type="submit"
              disabled={isLoading || !inputMessage.trim()}
              className={styles.sendButton}
            >
              {isLoading ? "..." : "Enviar"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default MainHome;
