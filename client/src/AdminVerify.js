import { useState, useEffect } from "react";
import { ethers } from "ethers";
import DocumentVerifier from "./DocumentVerifier.json";
import { computeFileHash } from "./hashUtils";

const contractAddress = "0xDa493C7b01e06D0a76F14b835565506F9834c33d";

const AdminVerify = () => {
  const [admin, setAdmin] = useState(null);
  const [account, setAccount] = useState(null);
  const [studentAddress, setStudentAddress] = useState("");
  const [documents, setDocuments] = useState([]);
  const [file, setFile] = useState(null);
  const [computedHash, setComputedHash] = useState("");
  const [verificationResult, setVerificationResult] = useState("");

  useEffect(() => {
    const checkAdmin = async () => {
      if (!window.ethereum) return;

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(contractAddress, DocumentVerifier.abi, signer);

      const adminAddress = await contract.admin();
      const userAddress = await signer.getAddress();
      setAccount(userAddress);
      setAdmin(userAddress === adminAddress);
    };

    checkAdmin();
  }, []);

  const fetchStudentDocuments = async () => {
    if (!admin) {
      alert("Access Denied! Only the admin can view student documents.");
      return;
    }

    if (!window.ethereum) {
      alert("MetaMask is required!");
      return;
    }

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const contract = new ethers.Contract(contractAddress, DocumentVerifier.abi, provider);
      const result = await contract.getStudentDocuments(studentAddress);
      setDocuments(result);
    } catch (error) {
      console.error("Error fetching documents:", error);
      alert("Error fetching student documents.");
    }
  };

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
      backgroundColor: "#007BFF",
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
      <h2 style={styles.heading}>Admin Document Verification</h2>
      {admin === null ? (
        <p>Checking admin status...</p>
      ) : admin ? (
        <>
          <p>🔑 Logged in as Admin: {account}</p>
          <input
            type="text"
            placeholder="Enter Student Address"
            value={studentAddress}
            onChange={(e) => setStudentAddress(e.target.value)}
            style={styles.input}
          />
          <button style={styles.button} onClick={fetchStudentDocuments}>
            Fetch Documents
          </button>

          {documents.length > 0 && (
            <div>
              <h3>Student Documents</h3>
              <ul style={styles.documentList}>
                {documents.map((doc, index) => (
                  <li key={index} style={styles.documentItem}>
                    <strong>{doc.name}</strong> - {doc.documentHash}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <h3>Upload Document to Verify</h3>
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
        </>
      ) : (
        <p style={{ color: "red", fontWeight: "bold" }}>🚫 Access Denied! You are not an admin.</p>
      )}
    </div>
  );
};

export default AdminVerify;
