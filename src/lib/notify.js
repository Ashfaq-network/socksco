import { formatLKR } from './format'

const APP_URL = import.meta.env.VITE_APP_URL || 'http://localhost:5173'

export function buildWhatsAppLink(number, message) {
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`
}

export function buildOrderMessage(order) {
  const lines = []
  lines.push(`🧦 *New Order — Socks Co*`)
  lines.push(`Order: ${order.order_number}`)
  lines.push(`Type: ${order.is_sample ? 'Sample Request' : 'Wholesale Order'}`)
  lines.push('')
  lines.push('*Items:*')
  order.items.forEach((item) => {
    lines.push(
      `• ${item.product_name} x${item.quantity}${item.size ? ` (${item.size})` : ''} — ${formatLKR(item.unit_price * item.quantity)}`
    )
  })
  lines.push('')
  lines.push(`Subtotal: ${formatLKR(order.subtotal)}`)
  lines.push(`Delivery: ${order.shipping_cost ? formatLKR(order.shipping_cost) : 'Free'}`)
  lines.push(`*Total: ${formatLKR(order.total)}*`)
  lines.push('')
  lines.push('*Customer:*')
  lines.push(order.customer_name)
  lines.push(order.phone)
  lines.push(order.email)
  lines.push(`${order.address}, ${order.city}, ${order.district ? order.district + ', ' : ''}${order.province}`)
  if (order.is_sample) {
    if (order.sample_business) lines.push(`Business: ${order.sample_business}`)
    if (order.sample_styles) lines.push(`Interested styles: ${order.sample_styles}`)
  }
  if (order.notes) lines.push(`Notes: ${order.notes}`)
  lines.push('')
  lines.push(`View order: ${APP_URL}/order-confirmation?order=${order.order_number}`)
  return lines.join('\n')
}

export async function sendOrderEmail(settings, order) {
  const email = settings?.order_alerts?.formsubmit_email || settings?.store_info?.email
  if (!email) return { sent: false, reason: 'no-email' }

  try {
    const itemsHtml = order.items
      .map(
        (i) =>
          `<tr><td>${i.product_name}${i.size ? ` (${i.size})` : ''}</td><td>${i.quantity}</td><td>${formatLKR(i.unit_price)}</td><td>${formatLKR(i.unit_price * i.quantity)}</td></tr>`
      )
      .join('')

    const body = `
      <h2>${order.is_sample ? 'Sample Request' : 'New Order'} — ${order.order_number}</h2>
      <p><strong>Customer:</strong> ${order.customer_name} (${order.phone})</p>
      <p><strong>Email:</strong> ${order.email}</p>
      <p><strong>Address:</strong> ${order.address}, ${order.city}, ${order.district ? order.district + ', ' : ''}${order.province}</p>
      ${order.sample_business ? `<p><strong>Business:</strong> ${order.sample_business}</p>` : ''}
      ${order.sample_styles ? `<p><strong>Styles:</strong> ${order.sample_styles}</p>` : ''}
      ${order.notes ? `<p><strong>Notes:</strong> ${order.notes}</p>` : ''}
      <table border="1" cellpadding="6" cellspacing="0" style="border-collapse:collapse">
        <tr><th>Item</th><th>Qty</th><th>Unit</th><th>Total</th></tr>
        ${itemsHtml}
      </table>
      <p><strong>Subtotal:</strong> ${formatLKR(order.subtotal)}<br/>
      <strong>Delivery:</strong> ${order.shipping_cost ? formatLKR(order.shipping_cost) : 'Free'}<br/>
      <strong>Total:</strong> ${formatLKR(order.total)}</p>
      <p><a href="${APP_URL}/order-confirmation?order=${order.order_number}">View order</a></p>
    `

    const res = await fetch(`https://formsubmit.co/ajax/${email}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({
        _subject: `[Socks Co] ${order.is_sample ? 'Sample request' : 'New order'} ${order.order_number}`,
        _template: 'table',
        _captcha: 'false',
        'Order Number': order.order_number,
        'Customer': order.customer_name,
        'Phone': order.phone,
        'Customer Email': order.email,
        'Address': `${order.address}, ${order.city}, ${order.province}`,
        'Items': order.items.map((i) => `${i.product_name} x${i.quantity}`).join(', '),
        'Total': formatLKR(order.total),
        'HTML': body,
      }),
    })

    return { sent: res.ok, status: res.status }
  } catch (err) {
    console.error('Email alert failed:', err)
    return { sent: false, reason: 'error' }
  }
}
