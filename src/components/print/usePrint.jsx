import { useEffect, useRef } from 'react';

/**
 * Custom hook for printing documents
 * Opens a new window with the print content and triggers print dialog
 */
export function usePrint() {
  const printWindowRef = useRef(null);

  const printDocument = (content, title = 'Document') => {
    // Close any existing print window
    if (printWindowRef.current && !printWindowRef.current.closed) {
      printWindowRef.current.close();
    }

    // Create new window
    const printWindow = window.open('', '_blank', 'width=800,height=600,menubar=no,toolbar=no,location=no,status=no');
    printWindowRef.current = printWindow;

    if (!printWindow) {
      alert('Please allow popups for printing');
      return;
    }

    // Write content to new window
    const printContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>${title}</title>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Times+New+Roman&display=swap');
          
          @page {
            size: A4;
            margin: 15mm 15mm 15mm 15mm;
          }
          
          * {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          
          body {
            margin: 0;
            padding: 0;
            font-family: 'Times New Roman', Times, serif;
            font-size: 11pt;
            line-height: 1.4;
            color: #000;
          }
          
          .print-document {
            width: 100%;
            max-width: 210mm;
            margin: 0 auto;
            padding: 0;
            background: white;
          }
          
          .print-header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            padding: 10mm 0;
            border-bottom: 2px solid #000;
            margin-bottom: 5mm;
          }
          
          .print-header-left {
            display: flex;
            align-items: flex-start;
            gap: 5mm;
          }
          
          .company-logo {
            font-size: 24pt;
            line-height: 1;
          }
          
          .company-info {
            font-size: 10pt;
          }
          
          .company-name {
            font-size: 14pt;
            font-weight: bold;
            margin: 0 0 2mm 0;
            text-transform: uppercase;
          }
          
          .company-address,
          .company-contact,
          .company-legal {
            margin: 1mm 0;
            font-size: 9pt;
          }
          
          .company-contact span,
          .company-legal span {
            margin-right: 5mm;
          }
          
          .print-header-right {
            text-align: right;
          }
          
          .document-meta {
            font-size: 9pt;
          }
          
          .meta-row {
            margin: 1mm 0;
          }
          
          .meta-label {
            font-weight: bold;
            margin-right: 2mm;
          }
          
          .meta-value {
            font-weight: normal;
          }
          
          .print-title {
            text-align: center;
            padding: 5mm 0;
            margin-bottom: 5mm;
            border-bottom: 1px solid #ccc;
          }
          
          .print-title h2 {
            font-size: 16pt;
            font-weight: bold;
            text-transform: uppercase;
            margin: 0;
            letter-spacing: 1mm;
          }
          
          .print-content {
            padding: 5mm 0;
          }
          
          .print-table {
            width: 100%;
            border-collapse: collapse;
            margin: 3mm 0;
            font-size: 10pt;
          }
          
          .print-table thead {
            background: #f5f5f5;
          }
          
          .print-table th {
            border: 1px solid #000;
            padding: 2mm;
            text-align: left;
            font-weight: bold;
            font-size: 9pt;
            text-transform: uppercase;
            background: #f5f5f5;
          }
          
          .print-table td {
            border: 1px solid #000;
            padding: 2mm;
            text-align: left;
          }
          
          .print-table td.text-right,
          .print-table th.text-right {
            text-align: right;
          }
          
          .print-table td.text-center,
          .print-table th.text-center {
            text-align: center;
          }
          
          .print-table .total-row {
            background: #f5f5f5;
            font-weight: bold;
          }
          
          .print-info-box {
            border: 1px solid #000;
            padding: 3mm;
            margin: 3mm 0;
            background: #fafafa;
          }
          
          .print-info-box-title {
            font-weight: bold;
            text-transform: uppercase;
            margin-bottom: 2mm;
            font-size: 9pt;
          }
          
          .print-info-row {
            display: flex;
            margin: 1mm 0;
            font-size: 9pt;
          }
          
          .print-info-label {
            font-weight: bold;
            width: 30mm;
            flex-shrink: 0;
          }
          
          .print-info-value {
            flex-grow: 1;
          }
          
          .print-signatures {
            display: flex;
            justify-content: space-between;
            margin-top: 10mm;
            padding-top: 5mm;
          }
          
          .print-signature {
            width: 40%;
            text-align: center;
          }
          
          .print-signature-line {
            border-top: 1px solid #000;
            margin-top: 15mm;
            padding-top: 2mm;
            font-size: 9pt;
          }
          
          .print-footer {
            display: flex;
            justify-content: space-between;
            align-items: flex-end;
            padding: 5mm 0;
            margin-top: 10mm;
            border-top: 1px solid #ccc;
            font-size: 8pt;
            color: #666;
          }
          
          .footer-left p,
          .footer-right p {
            margin: 1mm 0;
          }
          
          .page-number {
            font-weight: bold;
          }
          
          .text-bold {
            font-weight: bold;
          }
          
          .text-uppercase {
            text-transform: uppercase;
          }
          
          .text-center {
            text-align: center;
          }
          
          .text-right {
            text-align: right;
          }
          
          .print-money {
            font-family: 'Courier New', monospace;
            font-weight: bold;
          }
          
          .print-status {
            display: inline-block;
            padding: 1mm 3mm;
            border: 1px solid #000;
            font-size: 8pt;
            font-weight: bold;
            text-transform: uppercase;
          }
          
          .print-status.paye {
            background: #e8f5e9;
            border-color: #4caf50;
          }
          
          .print-status.en-attente {
            background: #fff3e0;
            border-color: #ff9800;
          }
          
          .print-status.annule {
            background: #ffebee;
            border-color: #f44336;
          }
          
          .print-section {
            margin: 5mm 0;
            padding: 3mm 0;
          }
          
          .print-section-title {
            font-size: 11pt;
            font-weight: bold;
            text-transform: uppercase;
            margin-bottom: 3mm;
            padding-bottom: 1mm;
            border-bottom: 1px solid #ccc;
          }
          
          .print-grid-2 {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 3mm;
          }
          
          .print-grid-3 {
            display: grid;
            grid-template-columns: 1fr 1fr 1fr;
            gap: 3mm;
          }
        </style>
      </head>
      <body>
        ${content}
        <script>
          window.onload = function() {
            window.print();
            window.onafterprint = function() {
              window.close();
            };
          };
        </script>
      </body>
      </html>
    `;

    printWindow.document.write(printContent);
    printWindow.document.close();
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (printWindowRef.current && !printWindowRef.current.closed) {
        printWindowRef.current.close();
      }
    };
  }, []);

  return { printDocument };
}
