import { useState, useEffect } from "react";
import { ethers } from "ethers";
import DocumentVerifier from "./DocumentVerifier.json";
import { computeFileHash } from "./hashUtils";

const contractAddress = "0xDa493C7b01e06D0a76F14b835565506F9834c33d";

const StudentView = () => {
  const [documents, setDocuments] = useState([]);
  const [account, setAccount] = useState(null);
  const [file, setFile] = useState(null);
  const [computedHash, setComputedHash] = useState("");
  const [verificationResult, setVerificationResult] = useState("");

  useEffect(() => {
    const fetchDocuments = async () => {
      if (!window.ethereum) return;

      const provider = new ethers.BrowserProvider(window.ethereum);
      const accounts = await provider.send("eth_requestAccounts", []);
      setAccount(accounts[0]);

      const contract = new ethers.Contract(contractAddress, DocumentVerifier.abi, provider);
      const result = await contract.getStudentDocuments(accounts[0]);
      setDocuments(result);
    };

    fetchDocuments();
  }, []);

  const handleFileChange = async (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    setFile(selectedFile);
    const hash = await computeFileHash(selectedFile);
    setComputedHash(hash);
  };

  const verifyDocument = () => {
    if (!computedHash) {
      setVerificationResult("Please upload a document first.");
      return;
    }

    const matched = documents.some((doc) => doc.documentHash === computedHash);
    setVerificationResult(matched ? "✅ Document is Authentic!" : "❌ Document is NOT Authentic!");
  };

  // Internal CSS styles
  const styles = {
    container: {
      maxWidth: "600px",
      margin: "auto",
      padding: "20px",
      borderRadius: "10px",
      boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.1)",
      backgroundColor: "#f9f9f9",
      textAlign: "center",
    },
    heading: {
      color: "#333",
      marginBottom: "20px",
    },
    input: {
      width: "90%",
      padding: "10px",
      marginBottom: "10px",
      borderRadius: "5px",
      border: "1px solid #ccc",
    },
    button: {
      padding: "10px 20px",
      backgroundColor: "#28a745",
      color: "#fff",
      border: "none",
      borderRadius: "5px",
      cursor: "pointer",
      margin: "10px 5px",
    },
    buttonDisabled: {
      padding: "10px 20px",
      backgroundColor: "#ccc",
      color: "#666",
      border: "none",
      borderRadius: "5px",
      cursor: "not-allowed",
      margin: "10px 5px",
    },
    fileInput: {
      display: "block",
      margin: "10px auto",
    },
    documentList: {
      listStyle: "none",
      padding: "0",
    },
    documentItem: {
      background: "#e3e3e3",
      margin: "5px 0",
      padding: "10px",
      borderRadius: "5px",
    },
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>📄 Your Documents</h2>
      <p>🔑 Connected Wallet: {account}</p>

      {documents.length === 0 ? (
        <p>No documents found</p>
      ) : (
        <ul style={styles.documentList}>
          {documents.map((doc, index) => (
            <li key={index} style={styles.documentItem}>
              <strong>{doc.name}</strong> - {doc.documentHash}
            </li>
          ))}
        </ul>
      )}

      <h2 style={styles.heading}>🔍 Verify Your Document</h2>
      <input type="file" onChange={handleFileChange} style={styles.fileInput} />
      <p>Computed Hash: {computedHash}</p>
      <button
        style={computedHash ? styles.button : styles.buttonDisabled}
        onClick={verifyDocument}
        disabled={!computedHash}
      >
        Verify
      </button>
      <p>{verificationResult}</p>
    </div>
  );
};

export default StudentView;