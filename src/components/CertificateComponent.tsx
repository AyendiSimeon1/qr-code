'use client';

import React, { useRef, useState } from 'react';
import Image from 'next/image';
// PDFKit related imports
// import PDFDocument from 'pdfkit';
import PDFDocument from 'pdfkit/js/pdfkit.standalone.js';
import blobStream from 'blob-stream';
import { Button } from './ui/Button'; // Assuming Button component exists

// Original data structure from your code
export interface CertificateData {
  company_name: string;
  cert_no: string;
  seriel_no: string; // Note: 'seriel_no' might be a typo for 'serial_no'
  date_issued: string;
  manufacturer?: string;
  equipment_s_no?: string;
  ref_equipment?: string; // Used for Procedure
  range?: string;
  connection?: string; // Used for Location
  qr_code_url: string;
}

// Extended data structure to better match the target image
// In a real application, your API would ideally provide this richer data.
interface FullCertificateViewData {
  reportGeneratedOn: string;
  logoImagePath: string;
  qrCodeUrl: string;
  statusReportTitle: string;

  clientNameLabel: string;
  clientNameValue: string;

  dateIssuedLabel: string;
  dateIssuedValue: string;

  certificateNoLabel: string;
  certificateNoValue: string;

  serialNoLabel: string;
  serialNoValue: string;

  // Blue Box
  blueBox_companyLabel: string;
  blueBox_companyValue: string;
  blueBox_reportNoLabel: string;
  blueBox_reportNoValue: string;

  // Table below blue box
  locationUnitNoLabel: string;
  locationUnitNoValue: string;
  testDateLabel: string;
  testDateValue: string; // This might be different from date_issued
  dueDateLabel: string;
  dueDateValue: string; // This is new data not in original CertificateData
  procedureLabel: string;
  procedureValue: string;
  standardLabel: string;
  standardValue: string;

  remarksTitle: string;
  remarksContent: string; // remarksText from the image

  signatureImagePath: string;
}


export interface CertificateGeneratorProps {
  data: CertificateData;
  onClose: () => void;
}

// Helper to fetch image as ArrayBuffer for PDFKit
async function fetchImageAsArrayBuffer(url: string): Promise<ArrayBuffer> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch image: ${url}, status: ${response.status}`);
  }
  return response.arrayBuffer();
}

export const CertificateGenerator: React.FC<CertificateGeneratorProps> = ({ data, onClose }) => {
  const certificateRef = useRef<HTMLDivElement>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const proxiedQrCodeUrl = `/api/proxy-image?url=${encodeURIComponent(data.qr_code_url)}`;

  // Map input data and use hardcoded values from the image where necessary
  const viewData: FullCertificateViewData = {
    reportGeneratedOn: "Report generated on",
    logoImagePath: "/ofissa-logo.png", // Ensure this is in /public
    qrCodeUrl: proxiedQrCodeUrl,
    statusReportTitle: "Status Report",

    clientNameLabel: "Client Name",
    clientNameValue: data.company_name,

    dateIssuedLabel: "Date Issued",
    dateIssuedValue: data.date_issued, // Using data.date_issued as per original mapping

    certificateNoLabel: "Certificate No",
    certificateNoValue: data.cert_no,

    serialNoLabel: "Serial No",
    serialNoValue: data.seriel_no,

    // Blue Box - Text from the provided image
    blueBox_companyLabel: "COMPANY",
    blueBox_companyValue: "CAMERON FLOW\nCONTROL TECH",
    blueBox_reportNoLabel: "REPORT NO",
    blueBox_reportNoValue: "OIL/TCFCT/01/25/100",

    // Table below blue box - Text from the provided image
    locationUnitNoLabel: "LOCATION\nUNIT NO:",
    locationUnitNoValue: data.connection || "OFISSA BASE", // Use data.connection or default from image
    testDateLabel: "TEST DATE",
    testDateValue: "15/01/2025", // Specific date from image, might differ from date_issued
    dueDateLabel: "DUE DATE",
    dueDateValue: "14/01/2026", // Specific date from image
    procedureLabel: "PROCEDURE",
    procedureValue: data.ref_equipment || "OFS/1/QAQC/01", // Use data.ref_equipment or default from image
    standardLabel: "STANDARD",
    standardValue: "ANSI B 31.3", // As per image

    remarksTitle: "REMARKS",
    remarksContent: "OFISSA INTERNATIONAL Certifies that the TEREK PRESSURE GAUGE above has been tested/calibrated for accuracy in accordance to the relevant specifications/measurement standards traceable to NIST/ASTM/DPR AND ISO17025:2017. This calibration further applies the specifications in Mineral Oil Safety (Statutory) Laws and Regulation for FACTORIES ACT 1990. The equipment is fit for operation within the Pressure range and time limit here stated. This report may only be produced with written approval of OFISSA Calibration Laboratory.",
    signatureImagePath: "/signature.png", // Ensure this is in /public
  };

  const downloadCertificatePdf = async () => {
    if (!viewData) return;
    setIsDownloading(true);

    try {
      const doc = new PDFDocument({
        size: 'A4', // Standard A4 size
        margins: { top: 30, bottom: 30, left: 35, right: 35 },
        bufferPages: true,
      });

      const stream = doc.pipe(blobStream());

      // --- PDF Colors and Fonts (matching the image) ---
      const creamBg = '#F8F6F2';
      const darkBlueHeaderBg = '#1A4A6F';
      const textBlack = '#000000'; // Using black for main text for clarity
      const textGray = '#333333'; // Dark gray for some labels/text
      const textWhite = '#FFFFFF';

      doc.font('Helvetica'); // Standard sans-serif font

      // --- Fetch images ---
      let logoBuffer, qrBuffer, signatureBuffer;
      try {
        [logoBuffer, qrBuffer] = await Promise.all([
          fetchImageAsArrayBuffer(viewData.logoImagePath),
          fetchImageAsArrayBuffer(viewData.qrCodeUrl),
          // fetchImageAsArrayBuffer(viewData.signatureImagePath),
        ]);
      } catch (error) {
        console.error("Error fetching images for PDF:", error);
        alert("Error fetching images required for the PDF. Please check console.");
        setIsDownloading(false);
        return;
      }
      
      // --- Certificate Background ---
      // To make the content area cream, draw a rect. PDF page itself is white.
      // We draw content on this cream rect.
      const contentPadding = 0; // No extra padding, margins handle spacing
      const mainContentX = doc.page.margins.left - contentPadding;
      const mainContentY = doc.page.margins.top - contentPadding;
      const mainContentWidth = doc.page.width - doc.page.margins.left - doc.page.margins.right + (contentPadding * 2);
      // Calculate height later or use a fixed large enough value if single page.
      // For now, let's assume it fits on one page and draw it full content height.
      // Or, simply don't draw a full page rect if the PDF viewer bg is acceptable.
      // For exact match of image, the cream area is bordered.
      // Let's draw the cream background for the content area.
      // The whole page is not cream, just the certificate content block.

      let yPos = doc.page.margins.top;
      const startX = doc.page.margins.left;
      const contentWidth = doc.page.width - doc.page.margins.left - doc.page.margins.right;

      // 1. "Report generated on"
      doc.fontSize(8).fillColor(textGray).text(viewData.reportGeneratedOn, startX, yPos);
      yPos += 15;

      // 2. OFISSA Logo
      if (logoBuffer) {
        doc.image(logoBuffer, startX, yPos, { width: 120 });
      }
      
      // 3. QR Code (Top Right)
      const qrCodeSize = 60; // Adjusted size
      if (qrBuffer) {
        doc.image(qrBuffer, doc.page.width - doc.page.margins.right - qrCodeSize, doc.page.margins.top, { // Align QR with top margin
          width: qrCodeSize,
          height: qrCodeSize,
        });
      }
      yPos += 35; // Adjust based on logo height

      // 4. "Status Report" Title
      doc.fontSize(22).fillColor(textBlack).font('Helvetica-Bold');
      doc.text(viewData.statusReportTitle, startX, yPos);
      doc.font('Helvetica'); // Reset font
      yPos += 40;

      // --- Helper function for label-value pairs ---
      const addLabelValue = (label: string, value: string, y: number, labelSize = 9, valueSize = 10, valueBold = true) => {
        doc.fontSize(labelSize).fillColor(textGray).text(label, startX, y);
        doc.fontSize(valueSize).fillColor(textBlack);
        if (valueBold) doc.font('Helvetica-Bold');
        doc.text(value, startX, y + labelSize + 2); // Spacing between label and value
        if (valueBold) doc.font('Helvetica'); // Reset font
        return y + labelSize + valueSize + 8; // Return new Y
      };
      
      const colWidth = contentWidth / 2 - 5; // For two-column layout

      // 5. Client Information Section (2 columns)
      const clientInfoYStart = yPos;
      doc.fontSize(9).fillColor(textGray).text(viewData.clientNameLabel, startX, yPos);
      doc.fontSize(10).fillColor(textBlack).font('Helvetica-Bold').text(viewData.clientNameValue, startX, yPos + 11);
      
      doc.fontSize(9).fillColor(textGray).text(viewData.dateIssuedLabel, startX + colWidth + 10, yPos);
      doc.fontSize(10).fillColor(textBlack).font('Helvetica-Bold').text(viewData.dateIssuedValue, startX + colWidth + 10, yPos + 11);
      yPos += 30;

      doc.fontSize(9).fillColor(textGray).text(viewData.certificateNoLabel, startX, yPos);
      doc.fontSize(10).fillColor(textBlack).font('Helvetica-Bold').text(viewData.certificateNoValue, startX, yPos + 11);

      doc.fontSize(9).fillColor(textGray).text(viewData.serialNoLabel, startX + colWidth + 10, yPos);
      doc.fontSize(10).fillColor(textBlack).font('Helvetica-Bold').text(viewData.serialNoValue, startX + colWidth + 10, yPos + 11);
      yPos += 40;
      doc.font('Helvetica'); // Reset

      // 6. Main Information Table Section
      // Dark Blue Header Part
      const blueBoxHeight = 50;
      doc.rect(startX, yPos, contentWidth, blueBoxHeight).fill(darkBlueHeaderBg);
      
      const blueBoxTextY = yPos + 8;
      doc.fillColor(textWhite).fontSize(7).font('Helvetica');
      doc.text(viewData.blueBox_companyLabel, startX + 10, blueBoxTextY);
      doc.fontSize(10).font('Helvetica-Bold');
      doc.text(viewData.blueBox_companyValue, startX + 10, blueBoxTextY + 9, { width: colWidth - 20 });

      doc.fillColor(textWhite).fontSize(7).font('Helvetica');
      doc.text(viewData.blueBox_reportNoLabel, startX + colWidth + 10, blueBoxTextY);
      doc.fontSize(10).font('Helvetica-Bold');
      doc.text(viewData.blueBox_reportNoValue, startX + colWidth + 10, blueBoxTextY + 9, { width: colWidth - 20 });
      yPos += blueBoxHeight;
      doc.font('Helvetica'); // Reset font

      // Data Rows Part (Light Background - this will be the page/cream background)
      // Add a border around this section if needed, or ensure page bg is cream
      const tablePadding = 10;
      yPos += tablePadding; // Space before table content

      const smallLabelSize = 7;
      const valueSize = 9;
      const itemSpacing = 20; // Vertical spacing between items in table

      // Row 1
      let currentX = startX + tablePadding / 2;
      const tableColWidth = contentWidth / 3 - (tablePadding*2/3);

      doc.fontSize(smallLabelSize).fillColor(textGray).text(viewData.locationUnitNoLabel, currentX, yPos, {width: tableColWidth});
      doc.fontSize(valueSize).fillColor(textBlack).font('Helvetica-Bold').text(viewData.locationUnitNoValue, currentX, yPos + smallLabelSize * (viewData.locationUnitNoLabel.includes('\n') ? 2.5 : 1.5) , {width: tableColWidth});
      currentX += tableColWidth + tablePadding;
      
      doc.fontSize(smallLabelSize).fillColor(textGray).text(viewData.testDateLabel, currentX, yPos, {width: tableColWidth});
      doc.fontSize(valueSize).fillColor(textBlack).font('Helvetica-Bold').text(viewData.testDateValue, currentX, yPos + smallLabelSize + 2, {width: tableColWidth});
      currentX += tableColWidth + tablePadding;

      doc.fontSize(smallLabelSize).fillColor(textGray).text(viewData.dueDateLabel, currentX, yPos, {width: tableColWidth});
      doc.fontSize(valueSize).fillColor(textBlack).font('Helvetica-Bold').text(viewData.dueDateValue, currentX, yPos + smallLabelSize + 2, {width: tableColWidth});
      
      yPos += itemSpacing + 10; // Extra space after first row
      
      // Row 2
      currentX = startX + tablePadding / 2;
      doc.fontSize(smallLabelSize).fillColor(textGray).text(viewData.procedureLabel, currentX, yPos, {width: tableColWidth});
      doc.fontSize(valueSize).fillColor(textBlack).font('Helvetica-Bold').text(viewData.procedureValue, currentX, yPos + smallLabelSize + 2, {width: tableColWidth});
      currentX += tableColWidth + tablePadding;

      doc.fontSize(smallLabelSize).fillColor(textGray).text(viewData.standardLabel, currentX, yPos, {width: tableColWidth});
      doc.fontSize(valueSize).fillColor(textBlack).font('Helvetica-Bold').text(viewData.standardValue, currentX, yPos + smallLabelSize + 2, {width: tableColWidth});

      yPos += itemSpacing + 20; // Extra space after table
      doc.font('Helvetica'); // Reset font

      // 7. Remarks Section
      doc.fontSize(10).fillColor(textBlack).font('Helvetica-Bold');
      doc.text(viewData.remarksTitle, startX, yPos);
      yPos += 18;
      doc.fontSize(9).fillColor(textGray).font('Helvetica');
      doc.text(viewData.remarksContent, startX, yPos, {
        width: contentWidth,
        align: 'justify', // Or 'left'
      });
      yPos += 80; // Estimate based on remark length

      // 8. Signature (space for offline signature)
      const signatureWidth = 100;
      const signatureHeight = 30; // Approximate
      const signatureX = doc.page.width - doc.page.margins.right - signatureWidth;
      // Draw a line for signature
      doc.moveTo(signatureX, yPos + signatureHeight)
         .lineTo(signatureX + signatureWidth, yPos + signatureHeight)
         .stroke();
      doc.fontSize(8).fillColor(textGray).text("Authorized Signature", signatureX, yPos + signatureHeight + 5, { width: signatureWidth, align: 'center' });
      // --- Finalize PDF ---
      doc.end();
      stream.on('finish', () => {
        const blob = stream.toBlob('application/pdf');
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `OFISSA-Status-Report-${data.cert_no || 'doc'}.pdf`;
        document.body.appendChild(link); // Required for Firefox
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        setIsDownloading(false);
      });
      stream.on('error', (err: any) => {
        console.error("Stream error:", err);
        alert("Error generating PDF. See console for details.");
        setIsDownloading(false);
      });

    } catch (error) {
      console.error('Error generating PDF:', error);
      alert("An unexpected error occurred while generating the PDF. See console for details.");
      setIsDownloading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-2 sm:p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[95vh] flex flex-col">
        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-800">Certificate Preview</h2>
          <Button variant="outline" size="sm" onClick={onClose}>Close</Button>
        </div>
        
        {/* Scrollable content area for the preview */}
        <div className="p-3 sm:p-6 overflow-y-auto flex-grow">
          {/* This div is for on-screen preview, styled to match the image */}
          <div 
            ref={certificateRef} 
            className="mx-auto max-w-[210mm] p-6 sm:p-8 shadow-lg" // A4-ish aspect, shadow for depth
            style={{ backgroundColor: '#F8F6F2' }} // Cream background for the certificate paper
          >
            {/* Header Section */}
            <div className="mb-4">
              <p className="text-xs text-gray-600">{viewData.reportGeneratedOn}</p>
            </div>
            <div className="flex justify-between items-start mb-6">
              <div className="pt-1"> {/* OFISSA Logo and Title */}
                <Image src={viewData.logoImagePath} alt="OFISSA International Limited" width={150} height={50} priority />
                <h1 className="text-3xl font-bold mt-4 text-black">{viewData.statusReportTitle}</h1>
              </div>
              <div className="w-20 h-20 sm:w-24 sm:h-24"> {/* QR Code */}
                {/* Using Next.js Image for optimized QR code loading in preview */}
                <Image src={viewData.qrCodeUrl} alt="QR Code" width={96} height={96} className="w-full h-full object-contain" />
              </div>
            </div>

            {/* Client Details Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 mb-8">
              <div>
                <p className="text-xs text-gray-500 uppercase">{viewData.clientNameLabel}</p>
                <p className="font-semibold text-sm text-black">{viewData.clientNameValue}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase">{viewData.dateIssuedLabel}</p>
                <p className="font-semibold text-sm text-black">{viewData.dateIssuedValue}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase">{viewData.certificateNoLabel}</p>
                <p className="font-semibold text-sm text-black">{viewData.certificateNoValue}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase">{viewData.serialNoLabel}</p>
                <p className="font-semibold text-sm text-black">{viewData.serialNoValue}</p>
              </div>
            </div>

            {/* Main Information Table Section */}
            <div className="mb-8">
              {/* Dark Blue Header */}
              <div className="bg-[#1A4A6F] text-white p-3 grid grid-cols-2 gap-x-4 rounded-t-md">
                <div>
                  <p className="text-[0.6rem] uppercase font-light">{viewData.blueBox_companyLabel}</p>
                  <p className="text-xs font-semibold whitespace-pre-line">{viewData.blueBox_companyValue}</p>
                </div>
                <div>
                  <p className="text-[0.6rem] uppercase font-light">{viewData.blueBox_reportNoLabel}</p>
                  <p className="text-xs font-semibold">{viewData.blueBox_reportNoValue}</p>
                </div>
              </div>
              {/* Data Rows */}
              <div className="border border-gray-300 border-t-0 p-3 rounded-b-md grid grid-cols-1 sm:grid-cols-3 gap-x-4 gap-y-3">
                <div>
                  <p className="text-[0.6rem] text-gray-500 uppercase font-light whitespace-pre-line">{viewData.locationUnitNoLabel}</p>
                  <p className="text-xs font-semibold text-black">{viewData.locationUnitNoValue}</p>
                </div>
                <div>
                  <p className="text-[0.6rem] text-gray-500 uppercase font-light">{viewData.testDateLabel}</p>
                  <p className="text-xs font-semibold text-black">{viewData.testDateValue}</p>
                </div>
                <div>
                  <p className="text-[0.6rem] text-gray-500 uppercase font-light">{viewData.dueDateLabel}</p>
                  <p className="text-xs font-semibold text-black">{viewData.dueDateValue}</p>
                </div>
                <div className="sm:col-start-1"> {/* Ensure these start on new line if needed or adjust grid */}
                  <p className="text-[0.6rem] text-gray-500 uppercase font-light">{viewData.procedureLabel}</p>
                  <p className="text-xs font-semibold text-black">{viewData.procedureValue}</p>
                </div>
                <div>
                  <p className="text-[0.6rem] text-gray-500 uppercase font-light">{viewData.standardLabel}</p>
                  <p className="text-xs font-semibold text-black">{viewData.standardValue}</p>
                </div>
              </div>
            </div>
            
            {/* Remarks */}
            <div className="mb-10">
              <h2 className="text-sm font-bold uppercase text-gray-700 mb-2">{viewData.remarksTitle}</h2>
              <p className="text-xs text-gray-600 leading-relaxed">
                {viewData.remarksContent}
              </p>
            </div>

            {/* Signature */}
            <div className="flex justify-end mt-8">
              <div className="w-32 h-10 sm:w-40 sm:h-12 border-b-2 border-gray-400 flex items-end justify-center">
                {/* Space for offline signature */}
                <span className="text-xs text-gray-400">Signature</span>
              </div>
            </div>
          </div>
        </div>

        {/* Actions Footer */}
        <div className="p-4 border-t border-gray-200 flex justify-end gap-2">
          <Button variant="outline" onClick={onClose} disabled={isDownloading}>
            Cancel
          </Button>
          <Button onClick={downloadCertificatePdf} disabled={isDownloading}>
            {isDownloading ? 'Downloading...' : 'Download PDF'}
          </Button>
        </div>
      </div>
    </div>
  );
};