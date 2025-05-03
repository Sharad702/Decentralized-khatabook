import { Customer, Entry } from '../interfaces';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

// Helper function to format currency
const formatCurrency = (amount: number): string => {
  return `${amount.toFixed(2)} INR`;
};

export const generateInvoice = (
  customer: Customer,
  entries: Entry[],
  customerAddress: string,
  balance: string
): void => {
  const doc = new jsPDF();
  
  // Add company header
  doc.setFontSize(20);
  doc.text('Khatabook Invoice', 105, 20, { align: 'center' });
  
  // Add customer details
  doc.setFontSize(12);
  doc.text('Customer Details:', 20, 40);
  doc.setFontSize(10);
  doc.text(`Name: ${customer.name}`, 20, 50);
  doc.text(`Mobile: ${customer.mobileNumber}`, 20, 60);
  doc.text(`Address: ${customerAddress}`, 20, 70);
  
  // Add current balance
  doc.setFontSize(12);
  doc.text('Current Balance:', 20, 90);
  doc.setFontSize(10);
  const balanceAmount = Number(balance);
  doc.text(`${formatCurrency(Math.abs(balanceAmount))} ${balanceAmount >= 0 ? '(Credit)' : '(Debit)'}`, 20, 100);
  
  // Add transaction table
  const tableColumn = ['Date', 'Description', 'Amount'];
  const tableRows = entries.map(entry => [
    new Date(Number(entry.timestamp) * 1000).toLocaleDateString(),
    entry.description,
    formatCurrency(Math.abs(Number(entry.amount)))
  ]);
  
  autoTable(doc, {
    head: [tableColumn],
    body: tableRows,
    startY: 120,
    theme: 'grid',
    styles: { fontSize: 8 },
    headStyles: { fillColor: [79, 70, 229] },
    columnStyles: {
      2: { halign: 'right' } // Right align the amount column
    }
  });
  
  // Add footer
  const pageCount = (doc as any).internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.text(
      `Generated on ${new Date().toLocaleString()}`,
      doc.internal.pageSize.width / 2,
      doc.internal.pageSize.height - 10,
      { align: 'center' }
    );
  }
  
  // Save the PDF
  doc.save(`invoice_${customer.name}_${new Date().toISOString().split('T')[0]}.pdf`);
}; 