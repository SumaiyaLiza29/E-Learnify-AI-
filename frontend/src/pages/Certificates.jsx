import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { getMyCertificates } from "../services/api";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const Certificates = () => {
  const { token } = useAuth();
  const [certs, setCerts] = useState([]);

  useEffect(() => {
    if (token) {
      getMyCertificates(token).then((data) => {
        setCerts(Array.isArray(data) ? data : []);
      });
    }
  }, [token]);

  // ✅ PDF generator
  const downloadPDF = async (cert) => {
    const element = document.getElementById(`cert-${cert._id}`);

    const canvas = await html2canvas(element, { scale: 2 });
    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF("p", "mm", "a4");
    const pdfWidth = 210;
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save(`${cert.courseTitle}-certificate.pdf`);
  };

  return (
    <div>
      <h2>My Certificates</h2>

      {certs.length === 0 ? (
        <p>You have not completed any courses yet.</p>
      ) : (
        certs.map((c) => (
          <div key={c._id} style={{ marginBottom: "40px" }}>
            {/* 🎓 CERTIFICATE VIEW */}
            <div
              id={`cert-${c._id}`}
              style={{
                width: "800px",
                padding: "40px",
                border: "10px solid #1e3a8a",
                textAlign: "center",
                background: "#fff",
              }}
            >
              <h1>Certificate of Completion</h1>
              <p>This is to certify that</p>

              <h2>{c.studentName || "Student"}</h2>

              <p>has successfully completed the course</p>

              <h3>{c.courseTitle}</h3>

              <p>
                Issued on:{" "}
                {c.issuedAt
                  ? new Date(c.issuedAt).toDateString()
                  : "N/A"}
              </p>
            </div>

            {/* ⬇️ DOWNLOAD BUTTON */}
            <button
              onClick={() => downloadPDF(c)}
              style={{
                marginTop: "12px",
                padding: "10px 20px",
                fontSize: "16px",
                cursor: "pointer",
              }}
            >
              Download PDF
            </button>
          </div>
        ))
      )}
    </div>
  );
};

export default Certificates;
