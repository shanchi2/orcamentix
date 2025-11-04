import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

/**
 * makeQuotePdfPremium - Clean Premium
 * - total em caixa grande centralizada para evitar sobreposição
 * - layout seguro com margens, quebra de página e espaço opcional para logo
 * - aceitar logo em dataURL (recomendado)
 */
export function makeQuotePdfPremium(quote = {}, userCompany = {}) {
  const doc = new jsPDF({ unit: 'pt', format: 'a4' })
  const pageWidth = doc.internal.pageSize.width
  const pageHeight = doc.internal.pageSize.height

  const M = { left: 40, right: 40, top: 40, bottom: 40 }
  const usableWidth = pageWidth - M.left - M.right

  const safeNum = v => Number(v || 0)
  const fmtBRL = v => `R$ ${safeNum(v).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`
  const clamp = (s, n = 300) => String(s ?? '').slice(0, n)

  // normalize primary color
  let primaryColor = [37, 99, 235]
  if (userCompany?.brandColor) {
    const bc = userCompany.brandColor
    if (Array.isArray(bc) && bc.length === 3) primaryColor = bc.map(x => Number(x) || 0)
    else if (typeof bc === 'string') {
      const hex = bc.replace('#', '')
      if (hex.length === 6) primaryColor = [parseInt(hex.slice(0,2),16), parseInt(hex.slice(2,4),16), parseInt(hex.slice(4,6),16)]
    }
  }

  let y = M.top

  // subtle header band
  doc.setFillColor(250,250,251)
  doc.rect(0,0,pageWidth,88,'F')

  // logo area (optional, prefer dataURL)
  const logoIsDataUrl = typeof userCompany?.logo === 'string' && userCompany.logo.startsWith('data:')
  const logoW = 64, logoH = 64
  if (logoIsDataUrl) {
    try {
      doc.addImage(userCompany.logo, 'PNG', M.left, y, logoW, logoH)
      doc.setFontSize(18); doc.setFont('helvetica','bold'); doc.setTextColor(20,20,20)
      doc.text(userCompany?.name || 'SUA EMPRESA', M.left + logoW + 12, y + 24)
      if (userCompany?.tagline) {
        doc.setFontSize(9); doc.setFont('helvetica','normal'); doc.setTextColor(110,110,110)
        doc.text(userCompany.tagline, M.left + logoW + 12, y + 40)
      }
      y += logoH + 8
    } catch (e) {
      doc.setFontSize(20); doc.setFont('helvetica','bold'); doc.text(userCompany?.name || 'SUA EMPRESA', pageWidth/2, y+20, {align:'center'})
      y += 36
    }
  } else {
    doc.setFontSize(20); doc.setFont('helvetica','bold'); doc.text(userCompany?.name || 'SUA EMPRESA', pageWidth/2, y+20, {align:'center'})
    if (userCompany?.tagline) {
      doc.setFontSize(9); doc.setFont('helvetica','normal'); doc.text(userCompany.tagline, pageWidth/2, y+36, {align:'center'}); y += 16
    }
    y += 36
  }

  // decorative line
  doc.setDrawColor(230,230,230); doc.setLineWidth(0.5); doc.line(M.left, y, pageWidth - M.right, y); y += 14

  // title + date
  doc.setFontSize(14); doc.setFont('helvetica','bold'); doc.setTextColor(80,80,80); doc.text('PROPOSTA COMERCIAL', M.left, y)
  doc.setFontSize(9); doc.setFont('helvetica','normal'); doc.setTextColor(120,120,120)
  const quoteDate = quote?.createdAt ? new Date(quote.createdAt).toLocaleDateString('pt-BR') : new Date().toLocaleDateString('pt-BR')
  doc.text(quoteDate, pageWidth - M.right, y, {align:'right'}); y += 18

  // client block
  doc.setFontSize(9); doc.setFont('helvetica','bold'); doc.setTextColor(100,100,100); doc.text('PARA', M.left, y)
  doc.setFontSize(12); doc.setFont('helvetica','bold'); doc.setTextColor(30,30,30); doc.text(clamp(quote?.cliente?.nome || '—',80), M.left, y+14)
  const contacts = []
  if (quote?.cliente?.telefone) contacts.push(quote.cliente.telefone)
  if (quote?.cliente?.email) contacts.push(quote.cliente.email)
  if (contacts.length) { doc.setFontSize(9); doc.setFont('helvetica','normal'); doc.setTextColor(100,100,100); doc.text(contacts.join(' • '), M.left, y+30) }
  y += 44

  // build table body
  const tableBody = (quote?.itens || []).map(it => {
    const name = clamp(it?.nome || '—', 400)
    const qty = `${safeNum(it?.qtd)}${it?.unidade ? ` ${it.unidade}` : ''}`.trim()
    const unit = fmtBRL(it?.preco)
    const rowTotal = fmtBRL(safeNum(it?.qtd) * safeNum(it?.preco))
    return [name, qty, unit, rowTotal]
  })

  // column widths relative to usableWidth
  const col0 = Math.max(usableWidth * 0.58, 220)
  const col1 = Math.max(usableWidth * 0.12, 50)
  const col2 = Math.max(usableWidth * 0.15, 70)
  const col3 = Math.max(usableWidth * 0.15, 70)

  // improved autoTable: force linebreak overflow, padding and minCellHeight
  try {
    autoTable(doc, {
      startY: y,
      head: [['Descrição','Qtd','Valor Unit.','Subtotal']],
      body: tableBody,
      theme: 'striped',
      tableWidth: 'auto',
      styles: { font:'helvetica', fontSize:10, cellPadding:8, overflow:'linebreak', valign:'middle', minCellHeight:18 },
      headStyles: { fillColor:[255,255,255], textColor:[80,80,80], fontStyle:'bold', fontSize:10 },
      bodyStyles: { textColor:[40,40,40] },
      columnStyles: {
        0: { cellWidth: col0, overflow: 'linebreak' },
        1: { cellWidth: col1, halign:'center' },
        2: { cellWidth: col2, halign:'right' },
        3: { cellWidth: col3, halign:'right' }
      },
      margin: { left: M.left, right: M.right },
      pageBreak: 'auto',
      didParseCell: function(data) {
        if (data.section === 'body' && data.column.index === 0) {
          const raw = data.cell.raw
          const lines = Array.isArray(raw) ? raw.length : String(raw).split('\n').length
          if (lines > 1) data.cell.styles.minCellHeight = Math.max(data.cell.styles.minCellHeight || 18, 6 * lines)
        }
      },
      willDrawCell: function(data) {
        if (data.section === 'body' && data.column.index === 0) {
          doc.setDrawColor(245,245,245); doc.setLineWidth(0.6)
          const x1 = data.cell.x, x2 = data.cell.x + data.cell.width, yLine = data.cell.y + data.cell.height - 0.5
          doc.line(x1, yLine, x2, yLine)
        }
      }
    })
  } catch (err) {
    console.error('autoTable erro (clean premium):', err)
    // fallback simple render
    let fy = y
    doc.setFontSize(9)
    (tableBody || []).forEach(row => {
      doc.text(row.join('  |  '), M.left, fy); fy += 14
      if (fy > pageHeight - M.bottom - 80) { doc.addPage(); fy = M.top }
    })
    y = fy
  }

  // read finalY safely and set next cursor with spacing
  const lastAutoY = (doc && doc.lastAutoTable && doc.lastAutoTable.finalY) || (doc.previousAutoTable && doc.previousAutoTable.finalY) || null
  y = lastAutoY ? lastAutoY + 22 : y + 22

  // if not enough space for total box, add page
  const requiredSpaceForTotal = 120
  if (y > pageHeight - M.bottom - requiredSpaceForTotal) { doc.addPage(); y = M.top }

  // ===== Total box centered (large, unmistakable) =====
  const total = safeNum(quote?.total ?? (quote?.itens || []).reduce((s,it)=> s + safeNum(it?.qtd) * safeNum(it?.preco), 0))
  const boxW = Math.min(usableWidth * 0.6, 420)
  const boxH = 80
  const boxX = (pageWidth - boxW) / 2
  const boxY = y

  // box background and border
  doc.setFillColor(255,255,255)
  doc.setDrawColor(primaryColor[0], primaryColor[1], primaryColor[2])
  doc.setLineWidth(1)
  if (typeof doc.roundedRect === 'function') {
    try { doc.roundedRect(boxX, boxY, boxW, boxH, 8, 8, 'FD') } catch { doc.rect(boxX, boxY, boxW, boxH, 'FD') }
  } else { doc.rect(boxX, boxY, boxW, boxH, 'FD') }

  // label and value
  doc.setFontSize(12); doc.setFont('helvetica','normal'); doc.setTextColor(110,110,110)
  doc.text('VALOR TOTAL', boxX + 18, boxY + 28)
  doc.setFont('helvetica','bold'); doc.setFontSize(28); doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2])
  doc.text(fmtBRL(total), boxX + boxW - 18, boxY + 46, { align: 'right' })

  y = boxY + boxH + 18

  // Observations
  if (quote?.obs) {
    if (y > pageHeight - M.bottom - 80) { doc.addPage(); y = M.top }
    doc.setFontSize(10); doc.setFont('helvetica','bold'); doc.setTextColor(80,80,80)
    doc.text('INFORMAÇÕES ADICIONAIS', M.left, y); y += 10
    const obsH = 56
    doc.setFillColor(250,250,250); doc.setDrawColor(230,230,230)
    if (typeof doc.roundedRect === 'function') {
      try { doc.roundedRect(M.left, y, usableWidth, obsH, 6, 6, 'FD') } catch { doc.rect(M.left, y, usableWidth, obsH, 'FD') }
    } else { doc.rect(M.left, y, usableWidth, obsH, 'FD') }
    doc.setFont('helvetica','normal'); doc.setFontSize(9); doc.setTextColor(70,70,70)
    const obsLines = doc.splitTextToSize(String(quote.obs||''), usableWidth - 18)
    doc.text(obsLines, M.left + 9, y + 18); y += obsH + 12
  }

  // footer
  const footerY = pageHeight - M.bottom / 2
  doc.setFontSize(8); doc.setFont('helvetica','normal'); doc.setTextColor(150,150,150)
  doc.text('orcamentix.com.br', pageWidth/2, footerY, { align:'center' })

  // save
  const safeName = String(quote?.cliente?.nome || 'cliente').replace(/[^a-z0-9-_]/gi,'-').toLowerCase()
  const fileName = `proposta-${safeName}-${Date.now()}.pdf`
  doc.save(fileName)
}