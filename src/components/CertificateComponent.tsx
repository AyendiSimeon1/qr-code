'use client';

import React, { useRef } from 'react';
import Image from 'next/image';
import html2canvas from 'html2canvas-pro';
import { Button } from './ui/Button';


export interface CertificateData {
  company_name: string;
  cert_no: string;
  seriel_no: string;
  date_issued: string;
  manufacturer?: string;
  equipment_s_no?: string;
  ref_equipment?: string;
  range?: string;
  connection?: string;
  qr_code_url: string;
}

export interface CertificateGeneratorProps {
  data: CertificateData;
  onClose: () => void;
}

export const CertificateGenerator: React.FC<CertificateGeneratorProps> = ({ data, onClose }) => {
  const certificateRef = useRef<HTMLDivElement>(null);
  const proxiedQrCodeUrl = `/api/proxy-image?url=${encodeURIComponent(data.qr_code_url)}`;

  const downloadCertificate = async () => {
    if (!certificateRef.current) return;

    const qrImg = certificateRef.current.querySelector(`img[src=\"${proxiedQrCodeUrl}\"]`);
    if (qrImg instanceof HTMLImageElement && !qrImg.complete) {
      await new Promise<void>((resolve, reject) => {
        qrImg.onload = () => resolve();
        qrImg.onerror = e => reject(e);
      });
    }

    try {
      const canvas = await html2canvas(certificateRef.current, {
        scale: 2,
        useCORS: true,
        onclone: doc => {
          doc.querySelectorAll('*').forEach(el => {
            const style = window.getComputedStyle(el as Element);
            if (style.color.includes('oklch')) {
              (el as HTMLElement).style.color = 'rgb(0,0,0)';
            }
            if (style.backgroundColor.includes('oklch')) {
              (el as HTMLElement).style.backgroundColor = 'white';
            }
          });
        },
      });

      const imgData = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = imgData;
      link.download = `certificate-${data.cert_no}.png`;
      link.click();
    } catch (err) {
      console.error('Error generating certificate:', err);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-auto">
        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-xl font-semibold">Certificate Preview</h2>
          <Button variant="outline" onClick={onClose}>Close</Button>
        </div>
        <div className="p-6">
          <div ref={certificateRef} className="bg-white p-8 border border-gray-300 shadow-sm">
            {/* Header */}
            <div className="flex justify-between items-start mb-6">
              <div>
                <Image src="/ofissa-logo.png" alt="OFISSA Intl" width={100} height={40} />
                <h1 className="text-2xl font-bold mt-4">Status Report</h1>
              </div>
              <div className="w-24 h-24">
                <img src={proxiedQrCodeUrl} alt="QR Code" className="w-full h-full" />
              </div>
            </div>
            {/* Details Grid */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              <div>
                <p className="text-sm text-gray-600">Client Name</p>
                <p className="font-medium">{data.company_name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Date Issued</p>
                <p>{data.date_issued}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Certificate No</p>
                <p>{data.cert_no}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Serial No</p>
                <p>{data.seriel_no}</p>
              </div>
            </div>
            {/* Report Section */}
            <div className="bg-gray-100 p-4 rounded-md mb-8">
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <h3 className="text-sm font-bold uppercase mb-1">Company</h3>
                  <p>{data.company_name}</p>
                </div>
                <div>
                  <h3 className="text-sm font-bold uppercase mb-1">Report No</h3>
                  <p>{data.cert_no}</p>
                </div>
                <div>
                  <h3 className="text-sm font-bold uppercase mb-1">Location</h3>
                  <p>{data.connection ?? 'N/A'}</p>
                </div>
                <div>
                  <h3 className="text-sm font-bold uppercase mb-1">Test Date</h3>
                  <p>{data.date_issued}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-bold uppercase mb-1">Procedure</h3>
                  <p>{data.ref_equipment ?? 'Standard Procedure'}</p>
                </div>
                <div>
                  <h3 className="text-sm font-bold uppercase mb-1">Standard</h3>
                  <p>ANSI B 31.3</p>
                </div>
              </div>
            </div>
            {/* Remarks */}
            <div className="mb-6">
              <h2 className="text-lg font-bold uppercase border-b border-gray-300 pb-2 mb-4">Remarks</h2>
              <p className="text-sm">
                OFISSA INTERNATIONAL certifies that the instrument above has been tested/calibrated for accuracy in accordance with relevant specifications and standards traceable to NIST, ASTM, DPR, and ISO 17025:2017. The values reported refer only to the item(s) calibrated/tested.<br /><br />
                This report may only be produced with written approval of OFISSA Calibration Laboratory.
              </p>
            </div>
            {/* Signature */}
            <div className="border-t border-gray-300 pt-4 flex justify-end">
              <div className="w-40">
                <p className="text-xs mb-1">Authorized Signature</p>
                <div className="border-b border-gray-400 h-12 flex items-end mb-1">
                  <Image src="/signature.png" alt="Signature" width={128} height={40} />
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Actions */}
        <div className="p-4 border-t border-gray-200 flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={downloadCertificate}>Download</Button>
        </div>
      </div>
    </div>
  );
};