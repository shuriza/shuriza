import { getWording, setWording } from '../../database/db.js'

// Predefined format templates untuk tampilan produk
const formats = {
  1: '{no}. {name}\n   Harga: {price}\n   Desc: {desc}\n   Stok: {stock}\n',
  2: '╭─ {name}\n│ Harga: {price}\n│ Desc: {desc}\n│ Stok: {stock}\n╰───···\n',
  3: '┌ {name}\n├ {price}\n├ {desc}\n└ Stok: {stock}\n',
  4: '➤ *{name}*\n  💰 {price}\n  📝 {desc}\n  📦 {stock}\n',
  5: '◈ {name} — {price}\n  {desc} | Stok: {stock}\n',
  6: '▸ {name}\n  Price: {price} | Stock: {stock}\n  Info: {desc}\n',
  7: '『 {name} 』\n  Harga : {price}\n  Desc  : {desc}\n  Stok  : {stock}\n',
  8: '⬡ {no}. {name}\n   ↳ {price} • {desc}\n   ↳ Stok: {stock}\n',
}

export default {
  name: 'formatkey',
  aliases: [],
  category: 'wording',
  description: 'Lihat format key saat ini',
  usage: 'formatkey',
  permission: 'admin',

  run: async ({ m }) => {
    const wording = getWording()
    const current = wording.formatKeys?.active || 'default'

    let text = `📋 *DAFTAR FORMAT KEY*\n`
    text += `═══════════════════════\n\n`
    text += `ℹ️ Format aktif saat ini: *Format ${current}*\n\n`
    text += `📌 *Cara pakai:* Ketik nama format untuk mengaktifkan.\n\n`

    for (const [key, fmt] of Object.entries(formats)) {
      const preview = fmt
        .replace(/{no}/g, '1')
        .replace(/{name}/g, 'Contoh Produk')
        .replace(/{price}/g, 'Rp 50.000')
        .replace(/{desc}/g, 'Deskripsi produk')
        .replace(/{stock}/g, '10')

      text += `━━━━━━━━━━━━━━━━━━━━━\n`
      text += `▸ Ketik *formatkey${key}* untuk aktifkan:\n\n${preview}\n`
    }

    text += `━━━━━━━━━━━━━━━━━━━━━\n`
    text += `📝 *Contoh:* Ketik *formatkey4* untuk pakai format 4`

    m.reply(text)
  }
}
