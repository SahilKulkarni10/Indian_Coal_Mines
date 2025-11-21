import { jsPDF } from 'jspdf';

declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: UserOptions) => jsPDF;
    lastAutoTable?: {
      finalY: number;
    };
  }
}

interface UserOptions {
  head?: any[][];
  body?: any[][];
  foot?: any[][];
  startY?: number;
  margin?: number | { top?: number; right?: number; bottom?: number; left?: number };
  pageBreak?: 'auto' | 'avoid' | 'always';
  theme?: 'striped' | 'grid' | 'plain';
  styles?: any;
  headStyles?: any;
  bodyStyles?: any;
  footStyles?: any;
  alternateRowStyles?: any;
  columnStyles?: any;
  [key: string]: any;
}
