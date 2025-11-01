// src/utils/quotePdf.js
import jsPDF from 'jspdf'

export function makeQuotePdf(qt) {
  const doc = new jsPDF({ unit: 'pt', format: 'a4' })
  const M = 40
  let y = M

  // Cabeçalho
  doc.setFont('helvetica', 'bold').setFontSize(16)
  doc.text('Orçamentix - Proposta', M, y)
  y += 24

  doc.setFont('helvetica', 'normal').setFontSize(11)
  doc.text(
    `Cliente: ${qt.cliente?.nome || ''}${
      qt.cliente?.empresa ? ` (${qt.cliente.empresa})` : ''
    }`,
    M,
    y
  )
  y += 16
  if (qt.cliente?.email) {
    doc.text(`E-mail: ${qt.cliente.email}`, M, y)
    y += 16
  }
  if (qt.cliente?.telefone) {
    doc.text(`Telefone: ${qt.cliente.telefone}`, M, y)
    y += 16
  }
  y += 8

  // Tabela
  doc.setFont('helvetica', 'bold')
  doc.text('Itens', M, y)
  y += 16
  doc.setFont('helvetica', 'normal')

  const colX = [M, 330, 410, 500] // desc, qtd, preço, subtotal
  doc.text('Descrição', colX[0], y)
  doc.text('Qtd', colX[1], y, { align: 'right' })
  doc.text('Preço', colX[2], y, { align: 'right' })
  doc.text('Subtotal', colX[3], y, { align: 'right' })
  y += 12
  doc.setLineWidth(0.5)
  doc.line(M, y, 555, y)
  y += 10

  qt.itens.forEach((it) => {
    const qtd = Number(it.qtd) || 0
    const preco = Number(it.preco) || 0
    const sub = qtd * preco

    const lines = doc.splitTextToSize(it.nome, 270)
    lines.forEach((ln, idx) => doc.text(ln, colX[0], y + idx * 16))

    doc.text(String(qtd), colX[1], y, { align: 'right' })
    doc.text(toBRL(preco), colX[2], y, { align: 'right' })
    doc.text(toBRL(sub), colX[3], y, { align: 'right' })

    y += Math.max(16, lines.length * 16) + 4
    if (y > 760) {
      doc.addPage()
      y = M
    }
  })

  y += 6
  doc.line(M, y, 555, y)
  y += 16

  // Resumo
  doc.text(`Subtotal: ${toBRL(qt.subtotal)}`, M, y)
  y += 16
  if (qt.margem) {
    doc.text(
      `Margem (${qt.margem}%): +${toBRL(qt.subtotal * (qt.margem / 100))}`,
      M,
      y
    )
    y += 16
  }
  if (qt.desconto) {
    doc.text(
      `Desconto (${qt.desconto}%): -${toBRL(qt.subtotal * (qt.desconto / 100))}`,
      M,
      y
    )
    y += 16
  }
  doc.setFont('helvetica', 'bold')
  doc.text(`Total: ${toBRL(qt.total)}`, M, y)
  y += 24
  doc.setFont('helvetica', 'normal')

  // Observações
  if (qt.obs) {
    doc.text('Observações:', M, y)
    y += 14
    const obsLines = doc.splitTextToSize(qt.obs, 515)
    doc.text(obsLines, M, y)
  }

  const filename = `orcamentix-${
    (qt.cliente?.nome || 'cliente').toLowerCase().replace(/\s+/g, '-')
  }-${(qt.createdAt || '').slice(0, 10)}.pdf`
  doc.save(filename)
}

function toBRL(v) {
  return (Number(v) || 0).toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  })
}
