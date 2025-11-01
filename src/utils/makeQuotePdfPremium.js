import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

/**
 * Gera PDF no modelo PREMIUM (Plano Premium)
 * - Layout elegante e sofisticado
 * - Logo grande do cliente (condicional)
 * - Design tipo Apple/Notion
 * - Tipografia premium
 * - Branding Orçamentix minimalista
 */
export function makeQuotePdfPremium(quote, userCompany = {}) {
  const doc = new jsPDF()
  const pageWidth = doc.internal.pageSize.width
  const pageHeight = doc.internal.pageSize.height
  let yPos = 30

  const hasLogo = userCompany?.logo
  const primaryColor = userCompany?.brandColor || [37, 99, 235] // blue-600 default

  // ======= HEADER PREMIUM =======
  // Fundo sutil no topo
  doc.setFillColor(249, 250, 251) // zinc-50
  doc.rect(0, 0, pageWidth, 60, 'F')

  // Logo grande do cliente (condicional)
  if (hasLogo) {
    try {
      // Aqui você carregaria a imagem real
      // doc.addImage(userCompany.logo, 'PNG', pageWidth / 2 - 25, 15, 50, 50)
      
      // Placeholder visual elegante
      doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2])
      doc.circle(pageWidth / 2, 35, 20, 'F')
      doc.setFontSize(24)
      doc.setFont('helvetica', 'bold')
      doc.setTextColor(255, 255, 255)
      doc.text('L', pageWidth / 2 - 5, 40)
      
      yPos = 75
    } catch (e) {
      console.error('Erro ao carregar logo:', e)
      yPos = 35
    }
  } else {
    yPos = 35
  }

  // Nome da empresa - Centralizado e elegante
  doc.setFontSize(22)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(20, 20, 20)
  doc.text(userCompany?.name || 'SUA EMPRESA', pageWidth / 2, hasLogo ? yPos : 25, { align: 'center' })

  // Slogan/Tagline (se existir)
  if (userCompany?.tagline) {
    doc.setFontSize(10)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(120, 120, 120)
    doc.text(userCompany.tagline, pageWidth / 2, hasLogo ? yPos + 6 : 31, { align: 'center' })
  }

  yPos = hasLogo ? yPos + 15 : 45

  // Linha fina decorativa
  doc.setDrawColor(220, 220, 220)
  doc.setLineWidth(0.5)
  doc.line(30, yPos, pageWidth - 30, yPos)

  yPos += 15

  // ======= TÍTULO DA PROPOSTA =======
  doc.setFontSize(16)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(100, 100, 100)
  doc.text('PROPOSTA COMERCIAL', 30, yPos)

  // Número e data no mesmo nível
  doc.setFontSize(11)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(140, 140, 140)
  const quoteDate = quote.createdAt 
    ? new Date(quote.createdAt).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })
    : new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })
  doc.text(quoteDate, pageWidth - 30, yPos, { align: 'right' })

  yPos += 18

  // ======= CLIENTE - BOX MINIMALISTA =======
  doc.setFontSize(10)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(100, 100, 100)
  doc.text('PARA:', 30, yPos)

  yPos += 8
  doc.setFontSize(13)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(30, 30, 30)
  doc.text(quote.cliente?.nome || '—', 30, yPos)

  if (quote.cliente?.empresa) {
    yPos += 6
    doc.setFontSize(10)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(100, 100, 100)
    doc.text(quote.cliente.empresa, 30, yPos)
  }

  // Contatos em linha
  yPos += 8
  doc.setFontSize(9)
  let contactText = []
  if (quote.cliente?.telefone) contactText.push(quote.cliente.telefone)
  if (quote.cliente?.email) contactText.push(quote.cliente.email)
  
  if (contactText.length > 0) {
    doc.text(contactText.join(' • '), 30, yPos)
  }

  yPos += 18

  // ======= DIVISÓRIA ELEGANTE =======
  doc.setDrawColor(220, 220, 220)
  doc.setLineWidth(0.3)
  doc.line(30, yPos, pageWidth - 30, yPos)

  yPos += 12

  // ======= SERVIÇOS - TÍTULO =======
  doc.setFontSize(11)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(80, 80, 80)
  doc.text('SERVIÇOS PROPOSTOS', 30, yPos)

  yPos += 8

  // ======= TABELA PREMIUM =======
  const tableData = (quote.itens || []).map(item => [
    item.nome || '—',
    `${item.qtd} ${item.unidade || ''}`,
    `R$ ${Number(item.preco || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
    `R$ ${((item.qtd || 0) * (item.preco || 0)).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`
  ])

  autoTable({
    startY: yPos,
    head: [['Descrição', 'Quantidade', 'Valor Unitário', 'Valor Total']],
    body: tableData,
    theme: 'plain',
    headStyles: {
      fillColor: [255, 255, 255],
      textColor: [100, 100, 100],
      fontSize: 9,
      fontStyle: 'bold',
      halign: 'left',
      cellPadding: { top: 3, bottom: 8, left: 0, right: 0 },
      lineColor: [220, 220, 220],
      lineWidth: { bottom: 0.5 }
    },
    bodyStyles: {
      fontSize: 10,
      textColor: [40, 40, 40],
      cellPadding: { top: 6, bottom: 6, left: 0, right: 0 }
    },
    columnStyles: {
      0: { 
        cellWidth: 95,
        fontStyle: 'normal'
      },
      1: { 
        cellWidth: 30, 
        halign: 'center',
        textColor: [100, 100, 100]
      },
      2: { 
        cellWidth: 32, 
        halign: 'right',
        textColor: [100, 100, 100]
      },
      3: { 
        cellWidth: 33, 
        halign: 'right',
        fontStyle: 'bold',
        textColor: [30, 30, 30]
      }
    },
    margin: { left: 30, right: 30 },
    didDrawCell: (data) => {
      // Linha fina entre itens
      if (data.section === 'body' && data.column.index === 0) {
        doc.setDrawColor(240, 240, 240)
        doc.setLineWidth(0.2)
        doc.line(
          data.cell.x,
          data.cell.y + data.cell.height,
          data.cell.x + pageWidth - 60,
          data.cell.y + data.cell.height
        )
      }
    }
  })

  yPos = doc.lastAutoTable.finalY + 15

  // ======= RESUMO FINANCEIRO ELEGANTE =======
  const subtotal = quote.subtotal || 0
  const margemVal = subtotal * ((quote.margem || 0) / 100)
  const descVal = subtotal * ((quote.desconto || 0) / 100)
  const total = quote.total || 0

  const boxX = pageWidth - 95
  let resumoY = yPos

  // Subtotal
  doc.setFontSize(10)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(120, 120, 120)
  doc.text('Subtotal', boxX, resumoY)
  doc.setTextColor(60, 60, 60)
  doc.text(`R$ ${subtotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`, pageWidth - 30, resumoY, { align: 'right' })

  // Margem
  if (quote.margem) {
    resumoY += 7
    doc.setTextColor(34, 197, 94)
    doc.text(`Margem (${quote.margem}%)`, boxX, resumoY)
    doc.text(`+R$ ${margemVal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`, pageWidth - 30, resumoY, { align: 'right' })
  }

  // Desconto
  if (quote.desconto) {
    resumoY += 7
    doc.setTextColor(239, 68, 68)
    doc.text(`Desconto (${quote.desconto}%)`, boxX, resumoY)
    doc.text(`-R$ ${descVal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`, pageWidth - 30, resumoY, { align: 'right' })
  }

  // Linha divisória elegante
  resumoY += 10
  doc.setDrawColor(200, 200, 200)
  doc.setLineWidth(0.5)
  doc.line(boxX, resumoY, pageWidth - 30, resumoY)

  // Total em destaque
  resumoY += 10
  doc.setFontSize(12)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2])
  doc.text('VALOR TOTAL', boxX, resumoY)
  
  doc.setFontSize(16)
  doc.text(`R$ ${total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`, pageWidth - 30, resumoY, { align: 'right' })

  // ======= OBSERVAÇÕES - BOX PREMIUM =======
  if (quote.obs) {
    yPos = resumoY + 20

    if (yPos > pageHeight - 60) {
      doc.addPage()
      yPos = 30
    }

    // Título
    doc.setFontSize(10)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(80, 80, 80)
    doc.text('INFORMAÇÕES ADICIONAIS', 30, yPos)

    yPos += 8

    // Box sutil
    const obsHeight = 30
    doc.setFillColor(249, 250, 251)
    doc.setDrawColor(229, 231, 235)
    doc.setLineWidth(0.3)
    doc.roundedRect(30, yPos, pageWidth - 60, obsHeight, 2, 2, 'FD')

    // Texto
    doc.setFontSize(9)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(70, 70, 70)
    const obsLines = doc.splitTextToSize(quote.obs, pageWidth - 75)
    doc.text(obsLines, 35, yPos + 6)
  }

  // ======= FOOTER MINIMALISTA =======
  const footerY = pageHeight - 12

  // Apenas o link, bem discreto
  doc.setFontSize(7)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(180, 180, 180)
  doc.text('orcamentix.com.br', pageWidth / 2, footerY, { align: 'center' })

  // Salvar
  const fileName = `proposta-${quote.cliente?.nome?.replace(/\s+/g, '-').toLowerCase() || 'cliente'}-${Date.now()}.pdf`
  doc.save(fileName)
}
