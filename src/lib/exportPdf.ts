import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { format } from 'date-fns';
import { Transaction, Account, Goal, Category } from '../store/useStore';

function formatCurrency(amount: number, currency: string) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(amount);
}

const ACCENT = [137, 233, 0] as [number, number, number];
const DARK   = [26, 26, 26] as [number, number, number];
const SURFACE= [46, 46, 46] as [number, number, number];
const WHITE  = [255, 255, 255] as [number, number, number];
const MUTED  = [170, 170, 170] as [number, number, number];

export function exportToPDF(
  userName: string,
  currency: string,
  transactions: Transaction[],
  accounts: Account[],
  goals: Goal[],
  categories: Category[]
) {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();
  const now = new Date();

  // ── Helper ──────────────────────────────────────────────────────────────
  const addPageBackground = () => {
    doc.setFillColor(...DARK);
    doc.rect(0, 0, pageW, pageH, 'F');
  };

  const addFooter = (pageNum: number, totalPages: number) => {
    doc.setFontSize(7);
    doc.setTextColor(...MUTED);
    doc.text(`KAI Finance  •  Generated ${format(now, 'dd MMM yyyy HH:mm')}  •  Page ${pageNum} of ${totalPages}`, pageW / 2, pageH - 6, { align: 'center' });
  };

  // ── PAGE 1: Cover / Summary ──────────────────────────────────────────────
  addPageBackground();

  // Green accent bar top
  doc.setFillColor(...ACCENT);
  doc.rect(0, 0, pageW, 2, 'F');

  // Logo area
  doc.setFillColor(...SURFACE);
  doc.roundedRect(14, 12, 24, 24, 4, 4, 'F');
  doc.setTextColor(...ACCENT);
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('K', 26, 28, { align: 'center' });

  // Title
  doc.setTextColor(...WHITE);
  doc.setFontSize(26);
  doc.setFont('helvetica', 'bold');
  doc.text('Financial Report', 44, 24);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...MUTED);
  doc.text(`Prepared for ${userName}  •  ${format(now, 'MMMM yyyy')}`, 44, 31);

  // Divider
  doc.setDrawColor(...ACCENT);
  doc.setLineWidth(0.5);
  doc.line(14, 42, pageW - 14, 42);

  // Summary cards
  const totalBalance = accounts.reduce((s, a) => s + a.balance, 0);
  const totalIncome  = transactions.filter(t => t.type === 'credit').reduce((s, t) => s + t.amount, 0);
  const totalExpense = transactions.filter(t => t.type === 'debit').reduce((s, t) => s + t.amount, 0);
  const netFlow      = totalIncome - totalExpense;

  const cards = [
    { label: 'Net Worth',    value: formatCurrency(totalBalance, currency), color: ACCENT },
    { label: 'Total Income', value: formatCurrency(totalIncome, currency),  color: [100, 200, 100] as [number,number,number] },
    { label: 'Total Expenses',value: formatCurrency(totalExpense, currency),color: [255, 77, 77] as [number,number,number] },
    { label: 'Net Cash Flow', value: formatCurrency(netFlow, currency),     color: netFlow >= 0 ? ACCENT : [255,77,77] as [number,number,number] },
  ];

  const cardW = (pageW - 28 - 9) / 2;
  cards.forEach((card, i) => {
    const x = 14 + (i % 2) * (cardW + 6);
    const y = 48 + Math.floor(i / 2) * 28;
    doc.setFillColor(...SURFACE);
    doc.roundedRect(x, y, cardW, 22, 3, 3, 'F');
    doc.setFontSize(7);
    doc.setTextColor(...MUTED);
    doc.setFont('helvetica', 'normal');
    doc.text(card.label.toUpperCase(), x + 5, y + 7);
    doc.setFontSize(12);
    doc.setTextColor(...card.color);
    doc.setFont('helvetica', 'bold');
    doc.text(card.value, x + 5, y + 16);
  });

  // Accounts table
  let y = 112;
  doc.setTextColor(...MUTED);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.text('ACCOUNTS', 14, y);
  y += 4;

  autoTable(doc, {
    startY: y,
    head: [['Account', 'Type', 'Balance']],
    body: accounts.map(a => [a.name, a.type.toUpperCase(), formatCurrency(a.balance, currency)]),
    theme: 'plain',
    styles: { fillColor: SURFACE, textColor: WHITE, fontSize: 9, cellPadding: 4 },
    headStyles: { fillColor: DARK, textColor: ACCENT as any, fontSize: 7, fontStyle: 'bold' },
    alternateRowStyles: { fillColor: DARK },
    columnStyles: { 2: { halign: 'right' } },
    margin: { left: 14, right: 14 },
  });

  // Goals table
  if (goals.length > 0) {
    y = (doc as any).lastAutoTable.finalY + 10;
    doc.setTextColor(...MUTED);
    doc.setFontSize(8);
    doc.setFont('helvetica', 'bold');
    doc.text('SAVINGS GOALS', 14, y);
    y += 4;

    autoTable(doc, {
      startY: y,
      head: [['Goal', 'Target', 'Saved', 'Progress']],
      body: goals.map(g => [
        g.name,
        formatCurrency(g.targetAmount, currency),
        formatCurrency(g.currentAmount, currency),
        `${Math.min(Math.round((g.currentAmount / g.targetAmount) * 100), 100)}%`,
      ]),
      theme: 'plain',
      styles: { fillColor: SURFACE, textColor: WHITE, fontSize: 9, cellPadding: 4 },
      headStyles: { fillColor: DARK, textColor: ACCENT as any, fontSize: 7, fontStyle: 'bold' },
      alternateRowStyles: { fillColor: DARK },
      columnStyles: { 1: { halign: 'right' }, 2: { halign: 'right' }, 3: { halign: 'right' } },
      margin: { left: 14, right: 14 },
    });
  }

  addFooter(1, 2);

  // ── PAGE 2: Transaction History ──────────────────────────────────────────
  doc.addPage();
  addPageBackground();
  doc.setFillColor(...ACCENT);
  doc.rect(0, 0, pageW, 2, 'F');

  doc.setTextColor(...WHITE);
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('Transaction History', 14, 18);
  doc.setFontSize(8);
  doc.setTextColor(...MUTED);
  doc.setFont('helvetica', 'normal');
  doc.text(`${transactions.length} transactions total`, 14, 25);

  const getCategoryName = (id: string) => categories.find(c => c.id === id)?.name ?? id;
  const getAccountName  = (id: string) => accounts.find(a => a.id === id)?.name ?? id;

  autoTable(doc, {
    startY: 30,
    head: [['Date', 'Type', 'Category', 'Account', 'Note', 'Amount']],
    body: transactions.map(t => [
      format(new Date(t.date), 'dd MMM yy'),
      t.type === 'credit' ? '↑ IN' : '↓ OUT',
      getCategoryName(t.categoryId),
      getAccountName(t.accountId),
      t.note || '—',
      (t.type === 'credit' ? '+' : '-') + formatCurrency(t.amount, currency),
    ]),
    theme: 'plain',
    styles: { fillColor: SURFACE, textColor: WHITE, fontSize: 8, cellPadding: 3.5, overflow: 'ellipsize' },
    headStyles: { fillColor: DARK, textColor: ACCENT as any, fontSize: 7, fontStyle: 'bold' },
    alternateRowStyles: { fillColor: DARK },
    columnStyles: {
      0: { cellWidth: 20 },
      1: { cellWidth: 14 },
      2: { cellWidth: 22 },
      3: { cellWidth: 32 },
      4: { cellWidth: 'auto' },
      5: { cellWidth: 28, halign: 'right' },
    },
    didParseCell: (data) => {
      if (data.column.index === 5 && data.section === 'body') {
        const val = String(data.cell.raw);
        data.cell.styles.textColor = val.startsWith('+') ? ACCENT : [255, 77, 77];
      }
      if (data.column.index === 1 && data.section === 'body') {
        const val = String(data.cell.raw);
        data.cell.styles.textColor = val.startsWith('↑') ? ACCENT : [255, 77, 77];
      }
    },
    margin: { left: 14, right: 14 },
  });

  addFooter(2, 2);

  // ── Save ─────────────────────────────────────────────────────────────────
  doc.save(`KAI_Report_${format(now, 'yyyyMMdd_HHmm')}.pdf`);
}
