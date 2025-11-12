import ExcelJS from 'exceljs';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

export const exportFilteredData = async (res, data, format, fileName) => {
  try {
    console.log('exportFilteredData called with:', { dataCount: data.length, format, fileName });
    
    if (data.length === 0) {
      return res.status(404).json({ message: "No data found for the given filters" });
    }

    const timestamp = Date.now();
    const fullFileName = `${fileName}_${timestamp}`;

    switch (format.toLowerCase()) {
      case 'csv':
        console.log('Exporting as CSV');
        return exportAsCSV(res, data, fullFileName);
      case 'excel':
        console.log('Exporting as Excel');
        return exportAsExcel(res, data, fullFileName);
      case 'pdf':
        console.log('Exporting as PDF');
        return exportAsPDF(res, data, fullFileName);
      default:
        console.log('Unknown format, returning JSON');
        return res.json({ message: "Export successful", count: data.length, data });
    }
  } catch (error) {
    console.error('Error in exportFilteredData:', error);
    res.status(500).json({ message: 'Export failed', error: error.message });
  }
};

function exportAsCSV(res, data, fileName) {
  try {
    console.log('exportAsCSV - processing data:', data.length, 'rows');
    const headers = Object.keys(data[0]);
    console.log('CSV headers:', headers);
    
    const csvContent = [
      headers.join(','),
      ...data.map(row => headers.map(header => `"${String(row[header] || '').replace(/"/g, '""')}"`).join(','))
    ].join('\n');

    console.log('CSV content length:', csvContent.length);
    
    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="${fileName}.csv"`);
    res.setHeader('Content-Length', Buffer.byteLength(csvContent, 'utf8'));
    
    console.log('exportAsCSV - sending CSV file:', fileName);
    return res.send(csvContent);
  } catch (error) {
    console.error('Error in exportAsCSV:', error);
    throw error;
  }
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
  try {
    console.log('exportAsPDF started with data length:', data.length);
    console.log('Creating jsPDF instance...');
    
    const doc = new jsPDF();
    
    console.log('Adding header text...');
    doc.setFontSize(16);
    doc.text('Faculty Export Report', 20, 20);
    doc.setFontSize(10);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, 30);
    doc.text(`Total Records: ${data.length}`, 20, 37);

    console.log('Preparing table data...');
    const headers = Object.keys(data[0]);
    console.log('Headers:', headers);
    
    const tableData = data.map(item => headers.map(header => String(item[header] || '')));
    console.log('Table rows:', tableData.length);

    console.log('Adding autoTable...');
    autoTable(doc, {
      head: [headers.map(h => h.charAt(0).toUpperCase() + h.slice(1).replace(/([A-Z])/g, ' $1').trim())],
      body: tableData,
      startY: 45,
      styles: { fontSize: 8, cellPadding: 2 },
      headStyles: { fillColor: [79, 70, 229], fontStyle: 'bold' },
      alternateRowStyles: { fillColor: [245, 245, 245] }
    });

    console.log('Generating PDF buffer...');
    const pdfBuffer = doc.output('arraybuffer');
    console.log('PDF buffer size:', pdfBuffer.byteLength);
    
    console.log('Setting response headers...');
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${fileName}.pdf"`);
    res.setHeader('Content-Length', pdfBuffer.byteLength);
    
    console.log('Sending PDF response...');
    res.send(Buffer.from(pdfBuffer));
    console.log('PDF sent successfully');
  } catch (error) {
    console.error('Error in exportAsPDF:', error);
    console.error('Error stack:', error.stack);
    throw error;
  }
}
