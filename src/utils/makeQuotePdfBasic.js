import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

/**
 * Gera PDF no modelo BÁSICO (Plano Free)
 * - Layout simples e funcional
 * - SEM logo do cliente
 * - Branding Orçamentix em destaque
 */
export function makeQuotePdfBasic(quote) {
  const doc = new jsPDF()
  const pageWidth = doc.internal.pageSize.width
  const pageHeight = doc.internal.pageSize.height
  let yPos = 20

  // ======= HEADER - BRANDING ORÇAMENTIX =======
  // Fundo azul no topo
  doc.setFillColor(37, 99, 235) // blue-600
  doc.rect(0, 0, pageWidth, 35, 'F')

  // Logo Orçamentix (letra O)
  doc.setFillColor(255, 255, 255)
  doc.circle(20, 17, 8, 'F')
  doc.setFontSize(14)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(37, 99, 235)
  doc.text('O', 17, 20)

  // Texto Orçamentix
  doc.setFontSize(20)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(255, 255, 255)
  doc.text('ORÇAMENTIX', 32, 20)

  // Website
  doc.setFontSize(9)
  doc.setFont('helvetica', 'normal')
  doc.text('www.orcamentix.com.br', 32, 26)

  // Data no canto direito
  doc.setFontSize(9)
  const dataAtual = new Date().toLocaleDateString('pt-BR')
  doc.text(dataAtual, pageWidth - 15, 20, { align: 'right' })

  yPos = 45

  // ======= TÍTULO DO ORÇAMENTO =======
  doc.setFontSize(16)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(37, 99, 235)
  doc.text('ORÇAMENTO', 15, yPos)
  
  doc.setFontSize(10)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(100, 100, 100)
  const quoteDate = quote.createdAt 
    ? new Date(quote.createdAt).toLocaleDateString('pt-BR')
    : dataAtual
  doc.text(`Data: ${quoteDate}`, 15, yPos + 6)

  yPos += 20

  // ======= DADOS DO CLIENTE =======
  doc.setFontSize(11)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(0, 0, 0)
  doc.text('CLIENTE:', 15, yPos)
  
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(10)
  yPos += 6
  doc.text(`Nome: ${quote.cliente?.nome || '—'}`, 15, yPos)
  
  if (quote.cliente?.empresa) {
    yPos += 5
    doc.text(`Empresa: ${quote.cliente.empresa}`, 15, yPos)
  }
  
  if (quote.cliente?.telefone) {
    yPos += 5
    doc.text(`Telefone: ${quote.cliente.telefone}`, 15, yPos)
  }
  
  if (quote.cliente?.email) {
    yPos += 5
    doc.text(`E-mail: ${quote.cliente.email}`, 15, yPos)
  }

  yPos += 12

  // ======= TABELA DE ITENS =======
  const tableData = (quote.itens || []).map(item => [
    item.nome || '—',
    `${item.qtd} ${item.unidade || ''}`,
    `R$ ${Number(item.preco || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
    `R$ ${((item.qtd || 0) * (item.preco || 0)).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
  ])

  autoTable({
    startY: yPos,
    head: [['Descrição', 'Quantidade', 'Valor Unit.', 'Subtotal']],
    body: tableData,
    theme: 'striped',
    headStyles: {
      fillColor: [37, 99, 235], // blue-600
      textColor: [255, 255, 255],
      fontSize: 10,
      fontStyle: 'bold',
      halign: 'left'
    },
    bodyStyles: {
      fontSize: 9,
      textColor: [50, 50, 50]
    },
    columnStyles: {
      0: { cellWidth: 80 },
      1: { cellWidth: 35, halign: 'center' },
      2: { cellWidth: 35, halign: 'right' },
      3: { cellWidth: 35, halign: 'right' }
    },
    margin: { left: 15, right: 15 }
  })

  yPos = doc.lastAutoTable.finalY + 10

  // ======= RESUMO FINANCEIRO =======
  const subtotal = quote.subtotal || 0
  const margemVal = subtotal * ((quote.margem || 0) / 100)
  const descVal = subtotal * ((quote.desconto || 0) / 100)
  const total = quote.total || 0

  // Box cinza para o resumo
  const boxX = pageWidth - 75
  const boxY = yPos
  const boxWidth = 60
  let boxHeight = 25

  if (quote.margem) boxHeight += 6
  if (quote.desconto) boxHeight += 6

  doc.setFillColor(245, 245, 245)
  doc.setDrawColor(200, 200, 200)
  doc.rect(boxX, boxY, boxWidth, boxHeight, 'FD')

  // Valores
  doc.setFontSize(9)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(80, 80, 80)
  
  let resumoY = boxY + 6
  doc.text('Subtotal:', boxX + 3, resumoY)
  doc.text(`R$ ${subtotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`, boxX + boxWidth - 3, resumoY, { align: 'right' })

  if (quote.margem) {
    resumoY += 6
    doc.text(`Margem (${quote.margem}%):`, boxX + 3, resumoY)
    doc.text(`R$ ${margemVal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`, boxX + boxWidth - 3, resumoY, { align: 'right' })
  }

  if (quote.desconto) {
    resumoY += 6
    doc.text(`Desconto (${quote.desconto}%):`, boxX + 3, resumoY)
    doc.text(`-R$ ${descVal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`, boxX + boxWidth - 3, resumoY, { align: 'right' })
  }

  // Total em destaque
  resumoY += 8
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(11)
  doc.setTextColor(37, 99, 235)
  doc.text('TOTAL:', boxX + 3, resumoY)
  doc.text(`R$ ${total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`, boxX + boxWidth - 3, resumoY, { align: 'right' })

  // ======= OBSERVAÇÕES =======
  if (quote.obs) {
    yPos = resumoY + 15
    
    doc.setFontSize(10)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(0, 0, 0)
    doc.text('OBSERVAÇÕES:', 15, yPos)
    
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(9)
    doc.setTextColor(60, 60, 60)
    
    const obsLines = doc.splitTextToSize(quote.obs, pageWidth - 30)
    doc.text(obsLines, 15, yPos + 6)
  }

  // ======= FOOTER - BRANDING FORTE =======
  const footerY = pageHeight - 30

  // Box azul no footer
  doc.setFillColor(37, 99, 235)
  doc.rect(0, footerY - 5, pageWidth, 40, 'F')

  // Ícone
  doc.setFillColor(255, 255, 255)
  doc.circle(pageWidth / 2 - 40, footerY + 5, 6, 'F')
  doc.setFontSize(10)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(37, 99, 235)
  doc.text('O', pageWidth / 2 - 42, footerY + 7.5)

  // Texto
  doc.setFontSize(11)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(255, 255, 255)
  doc.text('Orçamento gerado com Orçamentix', pageWidth / 2 - 28, footerY + 5)

  doc.setFontSize(9)
  doc.setFont('helvetica', 'normal')
  doc.text('Crie orçamentos profissionais em instantes', pageWidth / 2 - 28, footerY + 11)

  // Website grande
  doc.setFontSize(10)
  doc.setFont('helvetica', 'bold')
  doc.text('www.orcamentix.com.br', pageWidth / 2 - 28, footerY + 18)

  // Salvar PDF
  const fileName = `orcamento-${quote.cliente?.nome || 'cliente'}-${Date.now()}.pdf`
  doc.save(fileName)
}
