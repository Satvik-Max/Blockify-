import { useState } from "react";
import { ethers } from "ethers";
import DocumentVerifier from "./DocumentVerifier.json";
import { db } from "./firebase";
import { collection, addDoc } from "firebase/firestore";
import { toast } from "react-toastify";
import { computeFileHash } from "./hashUtils";

const contractAddress = "0xDa493C7b01e06D0a76F14b835565506F9834c33d";

const IssueCertificate = () => {
  const [studentAddress, setStudentAddress] = useState("");
  const [docName, setDocName] = useState("");
  const [file, setFile] = useState(null);
  const [docHash, setDocHash] = useState("");

  const handleFileChange = async (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    setFile(selectedFile);
    const hash = await computeFileHash(selectedFile);
    setDocHash(hash);
  };

  const issueCertificate = async () => {
    if (!window.ethereum) {
      toast.error("MetaMask is required!");
      return;
    }

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(contractAddress, DocumentVerifier.abi, signer);

      const tx = await contract.issueDocument(studentAddress, docName, docHash);
      await tx.wait();

      await addDoc(collection(db, "certificates"), {
        student: studentAddress,
        name: docName,
        hash: docHash,
        issuedAt: new Date(),
      });

      toast.success("✅ Certificate Issued!");
    } catch (error) {
      toast.error("❌ Error issuing certificate");
      console.error(error);
    }
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
      backgroundColor: "#007bff",
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
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>🎓 Issue Certificate</h2>
      <input
        type="text"
        placeholder="👤 Student Address"
        onChange={(e) => setStudentAddress(e.target.value)}
        style={styles.input}
      />
      <input
        type="text"
        placeholder="📜 Document Name"
        onChange={(e) => setDocName(e.target.value)}
        style={styles.input}
      />
      <input type="file" onChange={handleFileChange} style={styles.fileInput} />
      <p>🔍 Computed Hash: {docHash}</p>
      <button
        style={docHash ? styles.button : styles.buttonDisabled}
        onClick={issueCertificate}
        disabled={!docHash}
      >
        Issue Certificate
      </button>
    </div>
  );
};

export default IssueCertificate;
