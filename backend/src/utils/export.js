import ExcelJS from 'exceljs';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

export const exportFilteredData = async (res, data, format, fileName) => {
  if (data.length === 0) {
    return res.status(404).json({ message: "No data found for the given filters" });
  }

  const timestamp = Date.now();
  const fullFileName = `${fileName}_${timestamp}`;

  switch (format.toLowerCase()) {
    case 'csv':
      return exportAsCSV(res, data, fullFileName);
    case 'excel':
      return exportAsExcel(res, data, fullFileName);
    case 'pdf':
      return exportAsPDF(res, data, fullFileName);
    default:
      return res.json({ message: "Export successful", count: data.length, data });
  }
};

function exportAsCSV(res, data, fileName) {
  const headers = Object.keys(data[0]);
  const csvContent = [
    headers.join(','),
    ...data.map(row => headers.map(header => `"${row[header] || ''}"`).join(','))
  ].join('\n');

  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', `attachment; filename="${fileName}.csv"`);
  res.send(csvContent);
}

async function exportAsExcel(res, data, fileName) {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Export Data');


  const headers = Object.keys(data[0]);
  worksheet.columns = headers.map(header => ({
    header: header.charAt(0).toUpperCase() + header.slice(1).replace(/([A-Z])/g, ' $1'),
    key: header,
    width: 20
  }));


  worksheet.getRow(1).font = { bold: true };
  worksheet.getRow(1).fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FFE0E0E0' }
  };


  data.forEach(item => worksheet.addRow(item));

  const buffer = await workbook.xlsx.writeBuffer();
  
  res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
  res.setHeader('Content-Disposition', `attachment; filename="${fileName}.xlsx"`);
  res.send(buffer);
}

function exportAsPDF(res, data, fileName) {
  const doc = new jsPDF();
  
  doc.setFontSize(16);
  doc.text('Export Report', 20, 20);
  doc.setFontSize(10);
  doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, 30);

  const headers = Object.keys(data[0]);
  const tableData = data.map(item => headers.map(header => item[header] || ''));

  doc.autoTable({
    head: [headers.map(h => h.charAt(0).toUpperCase() + h.slice(1))],
    body: tableData,
    startY: 40,
    styles: { fontSize: 8 }
  });

  const pdfBuffer = doc.output();
  
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename="${fileName}.pdf"`);
  res.send(Buffer.from(pdfBuffer, 'binary'));
}
