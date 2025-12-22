import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getInvoiceByEnrollment } from "../services/api";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const Invoice = () => {
  const { token, user } = useAuth();
  const [searchParams] = useSearchParams();
  const enrollmentId = searchParams.get("enrollment");

  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!enrollmentId || !token) return;

    getInvoiceByEnrollment(enrollmentId, token).then((data) => {
      setInvoice(data);
      setLoading(false);
    });
  }, [enrollmentId, token]);

  // 🔽 PDF DOWNLOAD FUNCTION
  const downloadInvoicePDF = async () => {
    const element = document.getElementById("invoice-area");

    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
    });

    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");

    const pdfWidth = 210;
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save(`Invoice-${invoice.invoiceNumber}.pdf`);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <p className="text-gray-500">Loading invoice...</p>
      </div>
    );
  }

  if (!invoice) {
    return (
      <div className="text-center text-red-500">
        Invoice not found
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-6 py-10">
      {/* ⬇️ THIS DIV WILL BE CONVERTED TO PDF */}
      <div
        id="invoice-area"
        className="bg-white shadow-lg rounded-xl p-8"
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              Invoice
            </h1>
            <p className="text-sm text-gray-500">
              Invoice No: {invoice.invoiceNumber}
            </p>
          </div>
          <span className="bg-green-100 text-green-700 px-4 py-1 rounded-full text-sm font-semibold">
            Paid
          </span>
        </div>

        {/* User & Payment Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div>
            <h3 className="font-semibold text-gray-700 mb-1">
              Billed To
            </h3>
            <p>{user?.name}</p>
            <p className="text-sm text-gray-500">
              {user?.email}
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-gray-700 mb-1">
              Payment Info
            </h3>
            <p className="text-sm">
              Method: {invoice.paymentMethod}
            </p>
            <p className="text-sm">
              Transaction ID: {invoice.transactionId}
            </p>
            <p className="text-sm">
              Date:{" "}
              {new Date(invoice.createdAt).toDateString()}
            </p>
          </div>
        </div>

        {/* Course Table */}
        <div className="border rounded-lg overflow-hidden mb-6">
          <table className="w-full text-sm">
            <thead className="bg-gray-100 text-gray-600">
              <tr>
                <th className="px-4 py-2 text-left">Course</th>
                <th className="px-4 py-2 text-right">Amount</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-t">
                <td className="px-4 py-3">
                  {invoice.courseTitle || "Course"}
                </td>
                <td className="px-4 py-3 text-right">
                  ৳{invoice.amount}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Total */}
        <div className="flex justify-end text-lg font-semibold">
          Total Paid: ৳{invoice.amount}
        </div>
      </div>

      {/* ACTION BUTTONS */}
      <div className="flex justify-between items-center mt-6">
        <button
          onClick={downloadInvoicePDF}
          className="px-6 py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700"
        >
          ⬇ Download PDF
        </button>

        <button
          onClick={() => window.print()}
          className="px-6 py-2 rounded-lg border border-gray-300 hover:bg-gray-100"
        >
          🖨 Print
        </button>
      </div>
    </div>
  );
};

export default Invoice;
