import React from 'react';
import { useReactToPrint } from 'react-to-print';
import { Download } from 'lucide-react';

const ExportPDF = ({ targetRef }) => {
  const handlePrint = useReactToPrint({
    contentRef: targetRef,
    documentTitle: 'My_Study_Plan',
  });

  return (
    <button 
      onClick={handlePrint}
      className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-bold transition-all shadow-lg hover:scale-105 active:scale-95"
    >
      <Download size={20} />
      Export to PDF
    </button>
  );
};

export default ExportPDF;