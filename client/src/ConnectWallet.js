import { useState, useEffect } from "react";
import { BrowserProvider } from "ethers"; // Correct import for Ethers v6

const ConnectWallet = () => {
  const [account, setAccount] = useState(null);

  useEffect(() => {
    const loadAccount = async () => {
      if (window.ethereum) {
        try {
          const provider = new BrowserProvider(window.ethereum); // Updated provider
          const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
          setAccount(accounts[0]);
        } catch (error) {
          console.error("Error connecting to MetaMask", error);
        }
      }
    };

    loadAccount();
  }, []);

  // Internal CSS styles
  const styles = {
    container: {
      maxWidth: "400px",
      margin: "auto",
      padding: "20px",
      borderRadius: "10px",
      boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.1)",
      backgroundColor: "#f9f9f9",
      textAlign: "center",
    },
    heading: {
      color: "#333",
      marginBottom: "15px",
    },
    status: {
      fontSize: "18px",
      color: account ? "#007bff" : "#ff4d4d",
      fontWeight: "bold",
    },
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>🔗 Connected Wallet</h2>
      <p style={styles.status}>{account ? `✅ ${account}` : "❌ Not Connected"}</p>
    </div>
  );
};

export default ConnectWallet;
