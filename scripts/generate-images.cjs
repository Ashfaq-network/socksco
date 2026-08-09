const fs = require('fs')
const path = require('path')

const OUT = path.resolve(__dirname, '../public/images/products')
fs.mkdirSync(OUT, { recursive: true })

// Product image configs: body color, cuff color, accent stripes, background tone
const products = [
  // Men's
  { file: 'men-crew-navy', cat: 'Men', body: '#2C3E5C', cuff: '#FFFFFF', stripes: ['#FFFFFF', '#F0B429'], bg: '#EFF1F5' },
  { file: 'men-formal-charcoal', cat: 'Men', body: '#3C4148', cuff: '#3C4148', stripes: [], bg: '#EFEFED' },
  { file: 'men-ankle-black', cat: 'Men', body: '#26282B', cuff: '#E2572C', stripes: ['#FFFFFF'], bg: '#EDEDF0' },
  // Women's
  { file: 'womens-no-show-blush', cat: 'Women', body: '#E8B4BC', cuff: '#E8B4BC', stripes: [], bg: '#F7F0F1' },
  { file: 'womens-crew-lavender', cat: 'Women', body: '#B9A7D9', cuff: '#FFFFFF', stripes: ['#FFFFFF', '#7B6CB3'], bg: '#F2EFF6' },
  { file: 'womens-knee-coral', cat: 'Women', body: '#E88A7A', cuff: '#FFFFFF', stripes: ['#FFFFFF', '#2C3E5C'], bg: '#F7F1EF' },
  // Kids'
  { file: 'kids-school-white-blue', cat: 'Kids', body: '#F7F8FA', cuff: '#4A6FA5', stripes: ['#4A6FA5', '#F0B429'], bg: '#F1F3F6' },
  { file: 'kids-ankle-sky', cat: 'Kids', body: '#7FB8E0', cuff: '#F0B429', stripes: ['#FFFFFF'], bg: '#EFF5F8' },
  { file: 'kids-knee-teal', cat: 'Kids', body: '#5BB7A9', cuff: '#FFFFFF', stripes: ['#FFFFFF', '#F2A65A'], bg: '#EEF5F3' },
  // Sports
  { file: 'sport-running-navy', cat: 'Sports', body: '#223A5E', cuff: '#E2572C', stripes: ['#FFFFFF', '#E2572C'], bg: '#EDF0F4' },
  { file: 'sport-football-lime', cat: 'Sports', body: '#5E8A3A', cuff: '#26282B', stripes: ['#FFFFFF'], bg: '#EFF3EC' },
  { file: 'sport-tennis-white', cat: 'Sports', body: '#F3F4F6', cuff: '#223A5E', stripes: ['#223A5E', '#E2572C'], bg: '#EEF0F3' },
  // Casual
  { file: 'casual-argyle-mustard', cat: 'Casual', body: '#D9A441', cuff: '#6B4E1F', stripes: [], bg: '#F5F1EA' },
  { file: 'casual-knit-terracotta', cat: 'Casual', body: '#C46A4A', cuff: '#E8CFC0', stripes: ['#E8CFC0'], bg: '#F4EFEC' },
  { file: 'casual-loafer-heather', cat: 'Casual', body: '#8B8E96', cuff: '#8B8E96', stripes: [], bg: '#EEEEF0' },
  // Formal
  { file: 'formal-rib-navy', cat: 'Formal', body: '#1F3A5F', cuff: '#1F3A5F', stripes: [], bg: '#EFF1F5' },
  { file: 'formal-fine-dark', cat: 'Formal', body: '#2B2F35', cuff: '#2B2F35', stripes: [], bg: '#EFEFEE' },
]

function esc(hex) {
  return hex.replace('#', '%23')
}

function sockSVG(p, width, height) {
  const c = p.body
  const cuff = p.cuff
  const stripes = p.stripes
  const bg = p.bg
  // Geometry — single sock, foot pointing right, stroke-based L shape
  const legX = 350
  const topY = 170
  const sw = 108 // stroke width
  const footLen = 240

  let cuffStripe = ''
  stripes.forEach((s, i) => {
    const y = 238 + i * 40
    cuffStripe += `<rect x="${legX - sw / 2 - 4}" y="${y}" width="${sw + 8}" height="16" rx="8" fill="${s}"/>`
  })

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 800 800">
  <defs>
    <radialGradient id="bg" cx="50%" cy="42%" r="75%">
      <stop offset="0%" stop-color="#ffffff"/>
      <stop offset="100%" stop-color="${bg}"/>
    </radialGradient>
    <linearGradient id="shade" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#000000" stop-opacity="0.16"/>
      <stop offset="30%" stop-color="#000000" stop-opacity="0"/>
      <stop offset="70%" stop-color="#000000" stop-opacity="0"/>
      <stop offset="100%" stop-color="#000000" stop-opacity="0.14"/>
    </linearGradient>
    <filter id="shadow" x="-40%" y="-40%" width="180%" height="180%">
      <feDropShadow dx="0" dy="14" stdDeviation="14" flood-color="#101826" flood-opacity="0.22"/>
    </filter>
  </defs>
  <rect width="800" height="800" fill="url(#bg)"/>
  <ellipse cx="${legX + footLen - 60}" cy="608" rx="150" ry="26" fill="#101826" opacity="0.10"/>
  <g filter="url(#shadow)">
    <path d="M ${legX} ${topY}
             C ${legX} ${topY + 120}, ${legX} ${topY + 220}, ${legX + 18} ${topY + 300}
             C ${legX + 34} ${topY + 360}, ${legX + 78} ${topY + 392}, ${legX + footLen} ${topY + 392}"
          fill="none" stroke="${c}" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round"/>
  </g>
  <path d="M ${legX} ${topY}
           C ${legX} ${topY + 120}, ${legX} ${topY + 220}, ${legX + 18} ${topY + 300}
           C ${legX + 34} ${topY + 360}, ${legX + 78} ${topY + 392}, ${legX + footLen} ${topY + 392}"
        fill="none" stroke="url(#shade)" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round" opacity="0.9"/>
  <rect x="${legX - sw / 2 - 8}" y="${topY - 30}" width="${sw + 16}" height="74" rx="20" fill="${cuff}"/>
  <rect x="${legX - sw / 2 - 4}" y="${topY - 22}" width="${sw + 8}" height="10" rx="5" fill="#ffffff" opacity="0.35"/>
  ${cuffStripe}
  <rect x="${legX - sw / 2 - 4}" y="${topY + 356}" width="${sw + 8}" height="18" rx="9" fill="#ffffff" opacity="0.18"/>
</svg>`
}

products.forEach((p) => {
  fs.writeFileSync(path.join(OUT, `${p.file}.svg`), sockSVG(p, 800, 800))
  console.log('wrote', p.file)
})
console.log('done', products.length)
