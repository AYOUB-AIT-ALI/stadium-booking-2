import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import path from 'path';
import fs from 'fs';
import { app } from 'electron';

interface ReceiptData {
  bookingNumber: string;
  clientName: string;
  clientPhone: string;
  date: string;
  startTime: string;
  endTime: string;
  price: number;
  paid: boolean;
  notes?: string;
  stadiumName: string;
  stadiumPhone?: string;
  stadiumAddress?: string;
}

export class ReceiptService {
  static getReceiptsDir(): string {
    const dir = path.join(app.getPath('documents'), 'StadiumBookings', 'receipts');
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    return dir;
  }

  static generateReceipt(data: ReceiptData): string {
    const doc = new jsPDF('p', 'mm', 'a4');
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    const primaryColor: [number, number, number] = [16, 185, 129];
    const darkColor: [number, number, number] = [30, 41, 59];
    const grayColor: [number, number, number] = [100, 116, 139];

    doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.rect(0, 0, pageWidth, 15, 'F');

    doc.setFillColor(248, 250, 252);
    doc.rect(0, 15, pageWidth, 30, 'F');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(22);
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.text('STADIUM BOOKING', pageWidth / 2, 32, { align: 'center' });

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(grayColor[0], grayColor[1], grayColor[2]);
    doc.text('PREMIUM RECEIPT', pageWidth / 2, 40, { align: 'center' });

    doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.rect(0, 45, pageWidth, 0.5, 'F');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(16);
    doc.setTextColor(darkColor[0], darkColor[1], darkColor[2]);
    doc.text('RECEIPT', pageWidth / 2, 58, { align: 'center' });

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(grayColor[0], grayColor[1], grayColor[2]);
    doc.text(`Receipt #: ${data.bookingNumber}`, 20, 68);
    doc.text(`Date: ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}`, pageWidth - 20, 68, { align: 'right' });

    const tableBody = [
      ['Booking Number', data.bookingNumber],
      ['Client Name', data.clientName],
      ['Client Phone', data.clientPhone],
      ['Booking Date', new Date(data.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })],
      ['Time Slot', `${data.startTime} - ${data.endTime}`],
      ['Amount', `${data.price.toFixed(2)} DHs`],
      ['Payment Status', data.paid ? 'Paid' : 'Unpaid'],
      ['Notes', data.notes || 'N/A'],
    ];

    (doc as any).autoTable({
      startY: 75,
      head: [['Field', 'Details']],
      body: tableBody,
      theme: 'grid',
      headStyles: {
        fillColor: primaryColor,
        textColor: 255,
        fontStyle: 'bold',
        fontSize: 10,
        halign: 'center',
      },
      bodyStyles: {
        fontSize: 9,
        textColor: darkColor,
      },
      alternateRowStyles: {
        fillColor: [248, 250, 252],
      },
      columnStyles: {
        0: { cellWidth: 50, fontStyle: 'bold', fillColor: [241, 245, 249] },
        1: { cellWidth: 'auto' },
      },
      margin: { left: 20, right: 20 },
    });

    const lastY = (doc as any).lastAutoTable.finalY || 120;

    doc.setDrawColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.setLineWidth(0.5);
    doc.roundedRect(20, lastY + 15, pageWidth - 40, 40, 3, 3, 'S');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.text(data.stadiumName, pageWidth / 2, lastY + 28, { align: 'center' });

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(grayColor[0], grayColor[1], grayColor[2]);

    const addressLine = data.stadiumAddress || '';
    const phoneLine = data.stadiumPhone ? `Tel: ${data.stadiumPhone}` : '';
    doc.text(addressLine, pageWidth / 2, lastY + 37, { align: 'center' });
    doc.text(phoneLine, pageWidth / 2, lastY + 44, { align: 'center' });

    doc.setFont('helvetica', 'italic');
    doc.setFontSize(10);
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.text('Thank you for your booking!', pageWidth / 2, lastY + 58, { align: 'center' });

    doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.rect(0, pageHeight - 15, pageWidth, 15, 'F');

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(255, 255, 255);
    doc.text('Stadium Booking System \u2013 Premium Edition', pageWidth / 2, pageHeight - 8, { align: 'center' });
    doc.text(`Generated on ${new Date().toLocaleString()}`, pageWidth / 2, pageHeight - 3, { align: 'center' });

    const receiptsDir = ReceiptService.getReceiptsDir();
    const fileName = `receipt_${data.bookingNumber}.pdf`;
    const filePath = path.join(receiptsDir, fileName);
    doc.save(filePath);

    return filePath;
  }

  static generateReceiptBuffer(data: ReceiptData): Uint8Array {
    const doc = new jsPDF('p', 'mm', 'a4');
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    const primaryColor: [number, number, number] = [16, 185, 129];
    const darkColor: [number, number, number] = [30, 41, 59];
    const grayColor: [number, number, number] = [100, 116, 139];

    doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.rect(0, 0, pageWidth, 15, 'F');

    doc.setFillColor(248, 250, 252);
    doc.rect(0, 15, pageWidth, 30, 'F');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(22);
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.text('STADIUM BOOKING', pageWidth / 2, 32, { align: 'center' });

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(grayColor[0], grayColor[1], grayColor[2]);
    doc.text('PREMIUM RECEIPT', pageWidth / 2, 40, { align: 'center' });

    doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.rect(0, 45, pageWidth, 0.5, 'F');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(16);
    doc.setTextColor(darkColor[0], darkColor[1], darkColor[2]);
    doc.text('RECEIPT', pageWidth / 2, 58, { align: 'center' });

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(grayColor[0], grayColor[1], grayColor[2]);
    doc.text(`Receipt #: ${data.bookingNumber}`, 20, 68);
    doc.text(`Date: ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}`, pageWidth - 20, 68, { align: 'right' });

    const tableBody = [
      ['Booking Number', data.bookingNumber],
      ['Client Name', data.clientName],
      ['Client Phone', data.clientPhone],
      ['Booking Date', new Date(data.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })],
      ['Time Slot', `${data.startTime} - ${data.endTime}`],
      ['Amount', `${data.price.toFixed(2)} DHs`],
      ['Payment Status', data.paid ? 'Paid' : 'Unpaid'],
      ['Notes', data.notes || 'N/A'],
    ];

    (doc as any).autoTable({
      startY: 75,
      head: [['Field', 'Details']],
      body: tableBody,
      theme: 'grid',
      headStyles: {
        fillColor: primaryColor,
        textColor: 255,
        fontStyle: 'bold',
        fontSize: 10,
        halign: 'center',
      },
      bodyStyles: {
        fontSize: 9,
        textColor: darkColor,
      },
      alternateRowStyles: {
        fillColor: [248, 250, 252],
      },
      columnStyles: {
        0: { cellWidth: 50, fontStyle: 'bold', fillColor: [241, 245, 249] },
        1: { cellWidth: 'auto' },
      },
      margin: { left: 20, right: 20 },
    });

    const lastY = (doc as any).lastAutoTable.finalY || 120;

    doc.setDrawColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.setLineWidth(0.5);
    doc.roundedRect(20, lastY + 15, pageWidth - 40, 40, 3, 3, 'S');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.text(data.stadiumName, pageWidth / 2, lastY + 28, { align: 'center' });

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(grayColor[0], grayColor[1], grayColor[2]);

    const addressLine = data.stadiumAddress || '';
    const phoneLine = data.stadiumPhone ? `Tel: ${data.stadiumPhone}` : '';
    doc.text(addressLine, pageWidth / 2, lastY + 37, { align: 'center' });
    doc.text(phoneLine, pageWidth / 2, lastY + 44, { align: 'center' });

    doc.setFont('helvetica', 'italic');
    doc.setFontSize(10);
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.text('Thank you for your booking!', pageWidth / 2, lastY + 58, { align: 'center' });

    doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.rect(0, pageHeight - 15, pageWidth, 15, 'F');

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(255, 255, 255);
    doc.text('Stadium Booking System \u2013 Premium Edition', pageWidth / 2, pageHeight - 8, { align: 'center' });
    doc.text(`Generated on ${new Date().toLocaleString()}`, pageWidth / 2, pageHeight - 3, { align: 'center' });

    return Buffer.from(doc.output('arraybuffer'));
  }
}
