import ConnectWallet from "./ConnectWallet";
import IssueCertificate from "./IssueCertificate";
import StudentView from "./StudentView";
import AdminVerify from "./AdminVerify"; // Import Admin Verify Component
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  // Internal CSS styles
  const styles = {
    container: {
      maxWidth: "800px",
      margin: "auto",
      padding: "20px",
      borderRadius: "10px",
      boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.1)",
      backgroundColor: "#f9f9f9",
      textAlign: "center",
      fontFamily: "Arial, sans-serif",
    },
    heading: {
      color: "#333",
      fontSize: "28px",
      fontWeight: "bold",
      marginBottom: "20px",
    },
    section: {
      marginBottom: "30px",
      padding: "15px",
      borderRadius: "8px",
      backgroundColor: "#fff",
      boxShadow: "0px 0px 8px rgba(0, 0, 0, 0.1)",
    },
  };

  return (
    <div style={styles.container}>
      <ToastContainer />
      <h1 style={styles.heading}>🔗 Blockchain Document Verifier</h1>
      
      <div style={styles.section}>
        <ConnectWallet />
      </div>

      <div style={styles.section}>
        <IssueCertificate />
      </div>

      <div style={styles.section}>
        <StudentView />
      </div>

      <div style={styles.section}>
        <AdminVerify />
      </div>
    </div>
  );
}

export default App;
