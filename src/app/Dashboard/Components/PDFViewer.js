import { Worker, Viewer } from "@react-pdf-viewer/core";
import "@react-pdf-viewer/core/lib/styles/index.css";

const PDFViewer = ({ pdfPreview }) => {
  console.log(pdfPreview);
  return (
    <div style={{ width: "100%", height: "600px" }}>
      <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.6.2/build/pdf.worker.min.js">
        <Viewer fileUrl={pdfPreview} />
      </Worker>
    </div>
  );
};

export default PDFViewer;
