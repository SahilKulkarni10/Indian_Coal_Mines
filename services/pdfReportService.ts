import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import type { ExistingMineFeatureCollection, PredictedZoneFeatureCollection, AnalyticsData } from '../types';

interface ReportData {
  existingMines: ExistingMineFeatureCollection | null;
  predictedZones: PredictedZoneFeatureCollection | null;
  analytics: AnalyticsData | null;
}

export const generateCoalMineReport = (data: ReportData): void => {
  try {
    console.log('PDF Service: Starting report generation');
    const { existingMines, predictedZones, analytics } = data;
    
    // Validate data
    if (!existingMines && !predictedZones && !analytics) {
      throw new Error('No data available to generate report');
    }
    
    console.log('PDF Service: Creating document');
    // Create new PDF document
    const doc = new jsPDF('p', 'mm', 'a4');
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    let yPosition = 20;

  // Helper function to add new page if needed
  const checkPageBreak = (requiredSpace: number): void => {
    if (yPosition + requiredSpace > pageHeight - 20) {
      doc.addPage();
      yPosition = 20;
      return;
    }
  };

  // Title Page
  doc.setFillColor(59, 130, 246); // Blue-600
  doc.rect(0, 0, pageWidth, 60, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(28);
  doc.setFont('helvetica', 'bold');
  doc.text('CoalSight AI', pageWidth / 2, 25, { align: 'center' });
  
  doc.setFontSize(18);
  doc.setFont('helvetica', 'normal');
  doc.text('Coal Mines Comprehensive Report', pageWidth / 2, 40, { align: 'center' });
  
  doc.setFontSize(12);
  doc.text('India - All States', pageWidth / 2, 50, { align: 'center' });
  
  // Date and time
  doc.setTextColor(59, 130, 246);
  doc.setFontSize(10);
  yPosition = 70;
  const currentDate = new Date().toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
  doc.text(`Report Generated: ${currentDate}`, 20, yPosition);
  
  // Executive Summary
  yPosition += 15;
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(30, 58, 138); // Blue-900
  doc.text('Executive Summary', 20, yPosition);
  
  yPosition += 10;
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(0, 0, 0);
  
  if (analytics) {
    const summaryData = [
      ['Total Known Mines', analytics.totalKnownMines.toString()],
      ['Total Predicted Zones', analytics.totalPredictedZones.toString()],
      ['Zones with Known Mines', analytics.overlapStatistics.zonesWithKnownMines.toString()],
      ['Overlap Percentage', `${analytics.overlapStatistics.percentageOverlap}%`],
      ['Average Thermal Anomaly', `${analytics.avgThermalAnomaly.toFixed(2)}°C`]
    ];
    
    autoTable(doc, {
      startY: yPosition,
      head: [['Metric', 'Value']],
      body: summaryData,
      theme: 'grid',
      headStyles: {
        fillColor: [59, 130, 246],
        textColor: [255, 255, 255],
        fontStyle: 'bold',
        fontSize: 11
      },
      styles: {
        fontSize: 10,
        cellPadding: 5
      },
      alternateRowStyles: {
        fillColor: [239, 246, 255]
      }
    });
    
    yPosition = (doc as any).lastAutoTable.finalY + 15;
  }
  
  // Existing Mines Section
  checkPageBreak(30);
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(30, 58, 138);
  doc.text('Existing Coal Mines', 20, yPosition);
  
  yPosition += 5;
  
  if (existingMines && existingMines.features.length > 0) {
    const minesData = existingMines.features.map((feature, index) => [
      (index + 1).toString(),
      feature.properties.name,
      feature.properties.state,
      feature.properties.district,
      feature.properties.owner,
      feature.properties.status,
      `${feature.geometry.coordinates[1].toFixed(4)}°N, ${feature.geometry.coordinates[0].toFixed(4)}°E`
    ]);
    
    autoTable(doc, {
      startY: yPosition,
      head: [['#', 'Mine Name', 'State', 'District', 'Owner', 'Status', 'Coordinates']],
      body: minesData,
      theme: 'striped',
      headStyles: {
        fillColor: [59, 130, 246],
        textColor: [255, 255, 255],
        fontStyle: 'bold',
        fontSize: 9
      },
      styles: {
        fontSize: 8,
        cellPadding: 3
      },
      alternateRowStyles: {
        fillColor: [239, 246, 255]
      },
      columnStyles: {
        0: { cellWidth: 10 },
        1: { cellWidth: 40 },
        2: { cellWidth: 25 },
        3: { cellWidth: 25 },
        4: { cellWidth: 35 },
        5: { cellWidth: 20 },
        6: { cellWidth: 35 }
      },
      margin: { left: 20, right: 20 }
    });
    
    yPosition = (doc as any).lastAutoTable.finalY + 15;
  } else {
    yPosition += 10;
    doc.setFontSize(10);
    doc.setFont('helvetica', 'italic');
    doc.text('No existing mine data available', 20, yPosition);
    yPosition += 15;
  }
  
  // Predicted Zones Section
  doc.addPage();
  yPosition = 20;
  
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(30, 58, 138);
  doc.text('AI-Predicted Coal Zones', 20, yPosition);
  
  yPosition += 5;
  
  if (predictedZones && predictedZones.features.length > 0) {
    // Surface Mines
    const surfaceMines = predictedZones.features.filter(f => f.properties.type === 'surface');
    
    if (surfaceMines.length > 0) {
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(37, 99, 235); // Blue-600
      doc.text('Surface Mining Zones', 20, yPosition);
      yPosition += 5;
      
      const surfaceData = surfaceMines.map((feature, index) => [
        (index + 1).toString(),
        feature.properties.id,
        feature.properties.state,
        feature.properties.district,
        'Predicted',
        `${(feature.properties.confidence * 100).toFixed(1)}%`,
        feature.properties.area_sqkm.toFixed(2),
        `${feature.properties.avg_thermal_anomaly.toFixed(2)}°C`,
        `${feature.geometry.coordinates[0][0][1].toFixed(4)}°N, ${feature.geometry.coordinates[0][0][0].toFixed(4)}°E`
      ]);
      
      autoTable(doc, {
        startY: yPosition,
        head: [['#', 'Zone ID', 'State', 'District', 'Status', 'Confidence', 'Area (km²)', 'Thermal Anomaly', 'Coordinates']],
        body: surfaceData,
        theme: 'striped',
        headStyles: {
          fillColor: [37, 99, 235],
          textColor: [255, 255, 255],
          fontStyle: 'bold',
          fontSize: 9
        },
        styles: {
          fontSize: 8,
          cellPadding: 3
        },
        alternateRowStyles: {
          fillColor: [239, 246, 255]
        },
        columnStyles: {
          0: { cellWidth: 8 },
          1: { cellWidth: 20 },
          2: { cellWidth: 22 },
          3: { cellWidth: 22 },
          4: { cellWidth: 18 },
          5: { cellWidth: 18 },
          6: { cellWidth: 18 },
          7: { cellWidth: 22 },
          8: { cellWidth: 35 }
        },
        margin: { left: 20, right: 20 }
      });
      
      yPosition = (doc as any).lastAutoTable.finalY + 15;
    }
    
    // Underground Mines
    const undergroundMines = predictedZones.features.filter(f => f.properties.type === 'underground');
    
    if (undergroundMines.length > 0) {
      checkPageBreak(30);
      
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(37, 99, 235);
      doc.text('Underground Mining Zones', 20, yPosition);
      yPosition += 5;
      
      const undergroundData = undergroundMines.map((feature, index) => [
        (index + 1).toString(),
        feature.properties.id,
        feature.properties.state,
        feature.properties.district,
        'Predicted',
        `${(feature.properties.confidence * 100).toFixed(1)}%`,
        feature.properties.area_sqkm.toFixed(2),
        `${feature.properties.avg_thermal_anomaly.toFixed(2)}°C`,
        `${feature.geometry.coordinates[0][0][1].toFixed(4)}°N, ${feature.geometry.coordinates[0][0][0].toFixed(4)}°E`
      ]);
      
      autoTable(doc, {
        startY: yPosition,
        head: [['#', 'Zone ID', 'State', 'District', 'Status', 'Confidence', 'Area (km²)', 'Thermal Anomaly', 'Coordinates']],
        body: undergroundData,
        theme: 'striped',
        headStyles: {
          fillColor: [37, 99, 235],
          textColor: [255, 255, 255],
          fontStyle: 'bold',
          fontSize: 9
        },
        styles: {
          fontSize: 8,
          cellPadding: 3
        },
        alternateRowStyles: {
          fillColor: [239, 246, 255]
        },
        columnStyles: {
          0: { cellWidth: 8 },
          1: { cellWidth: 20 },
          2: { cellWidth: 22 },
          3: { cellWidth: 22 },
          4: { cellWidth: 18 },
          5: { cellWidth: 18 },
          6: { cellWidth: 18 },
          7: { cellWidth: 22 },
          8: { cellWidth: 35 }
        },
        margin: { left: 20, right: 20 }
      });
      
      yPosition = (doc as any).lastAutoTable.finalY + 15;
    }
  } else {
    yPosition += 10;
    doc.setFontSize(10);
    doc.setFont('helvetica', 'italic');
    doc.text('No predicted zone data available', 20, yPosition);
  }
  
  // State Distribution Section
  if (analytics && analytics.stateDistribution.length > 0) {
    doc.addPage();
    yPosition = 20;
    
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(30, 58, 138);
    doc.text('State-wise Distribution', 20, yPosition);
    
    yPosition += 5;
    
    const stateData = analytics.stateDistribution.map((state, index) => [
      (index + 1).toString(),
      state.state,
      state.known.toString(),
      state.predicted.toString(),
      (state.known + state.predicted).toString()
    ]);
    
    autoTable(doc, {
      startY: yPosition,
      head: [['#', 'State/UT', 'Known Mines', 'Predicted Zones', 'Total']],
      body: stateData,
      theme: 'grid',
      headStyles: {
        fillColor: [59, 130, 246],
        textColor: [255, 255, 255],
        fontStyle: 'bold',
        fontSize: 10
      },
      styles: {
        fontSize: 9,
        cellPadding: 4
      },
      alternateRowStyles: {
        fillColor: [239, 246, 255]
      },
      columnStyles: {
        0: { cellWidth: 15 },
        1: { cellWidth: 60 },
        2: { cellWidth: 35, halign: 'center' },
        3: { cellWidth: 35, halign: 'center' },
        4: { cellWidth: 25, halign: 'center', fontStyle: 'bold' }
      },
      margin: { left: 20, right: 20 }
    });
  }
  
  // Footer on all pages
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(100, 100, 100);
    doc.text(
      `CoalSight AI Report | Page ${i} of ${totalPages}`,
      pageWidth / 2,
      pageHeight - 10,
      { align: 'center' }
    );
    
    doc.setTextColor(59, 130, 246);
    doc.text(
      'Generated by CoalSight AI - Coal Mining Intelligence Platform',
      pageWidth / 2,
      pageHeight - 5,
      { align: 'center' }
    );
  }
  
  // Save the PDF
  const fileName = `CoalSight_AI_Coal_Mines_Report_${new Date().toISOString().split('T')[0]}.pdf`;
  console.log('PDF Service: Saving file as', fileName);
  doc.save(fileName);
  console.log('PDF Service: File saved successfully');
  } catch (error) {
    console.error('PDF Service Error:', error);
    throw new Error(`Failed to generate PDF: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

export const generateDetailedMineReport = (
  mineName: string,
  mineData: any
): void => {
  const doc = new jsPDF('p', 'mm', 'a4');
  const pageWidth = doc.internal.pageSize.getWidth();
  
  // Title
  doc.setFillColor(59, 130, 246);
  doc.rect(0, 0, pageWidth, 40, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text('Mine Detailed Report', pageWidth / 2, 20, { align: 'center' });
  
  doc.setFontSize(14);
  doc.text(mineName, pageWidth / 2, 30, { align: 'center' });
  
  // Content
  let yPos = 50;
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(12);
  
  Object.entries(mineData).forEach(([key, value]) => {
    doc.setFont('helvetica', 'bold');
    doc.text(`${key}:`, 20, yPos);
    doc.setFont('helvetica', 'normal');
    doc.text(String(value), 80, yPos);
    yPos += 10;
  });
  
  doc.save(`${mineName.replace(/\s+/g, '_')}_Report.pdf`);
};
