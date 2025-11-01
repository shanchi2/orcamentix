import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

/**
 * Gera PDF no modelo PLUS (Plano Plus)
 * - Layout profissional
 * - Logo do cliente condicional (se existir)
 * - Tabela estilizada
 * - Branding Orçamentix discreto
 */
export function makeQuotePdfPlus(quote, userCompany = {}) {
  const doc = new jsPDF()
  const pageWidth = doc.internal.pageSize.width
  const pageHeight = doc.internal.pageSize.height
  let yPos = 20

  const hasLogo = userCompany?.logo // Verifica se tem logo

  // ======= HEADER =======
  // Linha azul no topo
  doc.setDrawColor(59, 130, 246) // blue-500
  doc.setLineWidth(2)
  doc.line(15, 15, pageWidth - 15, 15)

  yPos = 25

  // Logo do cliente (condicional)
  if (hasLogo) {
    try {
      // Aqui você carregaria a imagem real
      // doc.addImage(userCompany.logo, 'PNG', 15, yPos, 30, 30)
      
      // Placeholder visual
      doc.setFillColor(59, 130, 246)
      doc.rect(15, yPos, 30, 30, 'F')
      doc.setFontSize(16)
      doc.setFont('helvetica', 'bold')
      doc.setTextColor(255, 255, 255)
      doc.text('LOGO', 20, yPos + 20)
      
      yPos += 35
    } catch (e) {
      console.error('Erro ao carregar logo:', e)
    }
  }

  // Nome da empresa em destaque
  const startX = hasLogo ? 15 : 15
  const startY = hasLogo ? 25 : yPos

  doc.setFontSize(18)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(30, 30, 30)
  doc.text(userCompany?.name || 'SUA EMPRESA', startX + (hasLogo ? 35 : 0), startY + 8)

  // Dados da empresa (se existir)
  if (userCompany?.phone || userCompany?.email) {
    doc.setFontSize(9)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(100, 100, 100)
    let infoY = startY + 14
    
    if (userCompany.phone) {
      doc.text(`Tel: ${userCompany.phone}`, startX + (hasLogo ? 35 : 0), infoY)
      infoY += 4
    }
    if (userCompany.email) {
      doc.text(userCompany.email, startX + (hasLogo ? 35 : 0), infoY)
    }
  }

  // Título e número do orçamento no canto direito
  doc.setFontSize(14)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(59, 130, 246)
  doc.text('ORÇAMENTO', pageWidth - 15, startY + 5, { align: 'right' })

  doc.setFontSize(10)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(100, 100, 100)
  const quoteDate = quote.createdAt 
    ? new Date(quote.createdAt).toLocaleDateString('pt-BR')
    : new Date().toLocaleDateString('pt-BR')
  doc.text(quoteDate, pageWidth - 15, startY + 11, { align: 'right' })

  yPos = hasLogo ? yPos + 10 : startY + 25

  // ======= DADOS DO CLIENTE (BOX DESTACADO) =======
  doc.setFillColor(248, 250, 252) // zinc-50
  doc.setDrawColor(226, 232, 240) // zinc-300
  doc.roundedRect(15, yPos, pageWidth - 30, 28, 3, 3, 'FD')

  // Título do box
  doc.setFontSize(9)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(71, 85, 105) // zinc-600
  doc.text('CLIENTE', 20, yPos + 6)

  // Dados do cliente em 2 colunas
  doc.setFontSize(10)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(30, 30, 30)

  const col1X = 20
  const col2X = pageWidth / 2 + 10
  let clientY = yPos + 13

  doc.text(`${quote.cliente?.nome || '—'}`, col1X, clientY)
  
  if (quote.cliente?.empresa) {
    clientY += 5
    doc.setFontSize(9)
    doc.setTextColor(100, 100, 100)
    doc.text(quote.cliente.empresa, col1X, clientY)
  }

  clientY = yPos + 13
  if (quote.cliente?.telefone) {
    doc.setFontSize(9)
    doc.setTextColor(100, 100, 100)
    doc.text(`Tel: ${quote.cliente.telefone}`, col2X, clientY)
    clientY += 5
  }
  
  if (quote.cliente?.email) {
    doc.text(quote.cliente.email, col2X, clientY)
  }

  yPos += 35

  // ======= TABELA DE ITENS =======
  const tableData = (quote.itens || []).map(item => [
    item.nome || '—',
    `${item.qtd} ${item.unidade || ''}`,
    `R$ ${Number(item.preco || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
    `R$ ${((item.qtd || 0) * (item.preco || 0)).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`
  ])

  autoTable({
    startY: yPos,
    head: [['Serviço', 'Qtd', 'Valor Unit.', 'Subtotal']],
    body: tableData,
    theme: 'grid',
    headStyles: {
      fillColor: [59, 130, 246], // blue-500
      textColor: [255, 255, 255],
      fontSize: 10,
      fontStyle: 'bold',
      halign: 'left',
      cellPadding: 4
    },
    bodyStyles: {
      fontSize: 9,
      textColor: [40, 40, 40],
      cellPadding: 4
    },
    alternateRowStyles: {
      fillColor: [248, 250, 252] // zebra striping
    },
    columnStyles: {
      0: { cellWidth: 90 },
      1: { cellWidth: 30, halign: 'center' },
      2: { cellWidth: 32, halign: 'right' },
      3: { cellWidth: 33, halign: 'right', fontStyle: 'bold' }
    },
    margin: { left: 15, right: 15 }
  })

  yPos = doc.lastAutoTable.finalY + 12

  // ======= RESUMO FINANCEIRO (BOX DESTACADO) =======
  const subtotal = quote.subtotal || 0
  const margemVal = subtotal * ((quote.margem || 0) / 100)
  const descVal = subtotal * ((quote.desconto || 0) / 100)
  const total = quote.total || 0

  const boxX = pageWidth - 80
  const boxY = yPos
  const boxWidth = 65
  let boxHeight = 30

  if (quote.margem) boxHeight += 6
  if (quote.desconto) boxHeight += 6

  // Box com borda azul
  doc.setFillColor(248, 250, 252)
  doc.setDrawColor(59, 130, 246)
  doc.setLineWidth(0.5)
  doc.roundedRect(boxX, boxY, boxWidth, boxHeight, 3, 3, 'FD')

  doc.setFontSize(9)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(80, 80, 80)

  let resumoY = boxY + 8
  doc.text('Subtotal:', boxX + 4, resumoY)
  doc.text(`R$ ${subtotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`, boxX + boxWidth - 4, resumoY, { align: 'right' })

  if (quote.margem) {
    resumoY += 6
    doc.setTextColor(34, 197, 94) // green
    doc.text(`Margem (${quote.margem}%):`, boxX + 4, resumoY)
    doc.text(`+R$ ${margemVal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`, boxX + boxWidth - 4, resumoY, { align: 'right' })
    doc.setTextColor(80, 80, 80)
  }

  if (quote.desconto) {
    resumoY += 6
    doc.setTextColor(239, 68, 68) // red
    doc.text(`Desconto (${quote.desconto}%):`, boxX + 4, resumoY)
    doc.text(`-R$ ${descVal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`, boxX + boxWidth - 4, resumoY, { align: 'right' })
    doc.setTextColor(80, 80, 80)
  }

  // Divisória
  resumoY += 5
  doc.setDrawColor(200, 200, 200)
  doc.setLineWidth(0.3)
  doc.line(boxX + 4, resumoY, boxX + boxWidth - 4, resumoY)

  // Total
  resumoY += 6
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(12)
  doc.setTextColor(59, 130, 246)
  doc.text('TOTAL:', boxX + 4, resumoY)
  doc.text(`R$ ${total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`, boxX + boxWidth - 4, resumoY, { align: 'right' })

  // ======= OBSERVAÇÕES =======
  if (quote.obs) {
    yPos = resumoY + 12
    
    if (yPos > pageHeight - 50) {
      doc.addPage()
      yPos = 20
    }

    doc.setFillColor(254, 252, 232) // amber-50
    doc.setDrawColor(251, 191, 36) // amber-400
    doc.setLineWidth(0.5)
    doc.roundedRect(15, yPos, pageWidth - 30, 25, 3, 3, 'FD')

    doc.setFontSize(9)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(146, 64, 14) // amber-800
    doc.text('📝 OBSERVAÇÕES', 20, yPos + 6)

    doc.setFont('helvetica', 'normal')
    doc.setFontSize(9)
    doc.setTextColor(60, 60, 60)

    const obsLines = doc.splitTextToSize(quote.obs, pageWidth - 40)
    doc.text(obsLines, 20, yPos + 12)
  }

  // ======= FOOTER - BRANDING DISCRETO =======
  const footerY = pageHeight - 15

  doc.setFontSize(8)
  doc.setFont('helvetica', 'italic')
  doc.setTextColor(150, 150, 150)
  doc.text('Powered by', pageWidth / 2 - 15, footerY, { align: 'center' })

  doc.setFont('helvetica', 'bold')
  doc.setTextColor(59, 130, 246)
  doc.text('Orçamentix', pageWidth / 2 + 3, footerY, { align: 'center' })

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(7)
  doc.setTextColor(150, 150, 150)
  doc.text('www.orcamentix.com.br', pageWidth / 2, footerY + 4, { align: 'center' })

  // Salvar
  const fileName = `orcamento-${quote.cliente?.nome || 'cliente'}-${Date.now()}.pdf`
  doc.save(fileName)
}
