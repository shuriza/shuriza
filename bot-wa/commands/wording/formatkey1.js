import { getWording, setWording } from '../../database/db.js'

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

function createFormatKeyCommand(num) {
  return {
    name: `formatkey${num}`,
    aliases: [],
    category: 'wording',
    description: `Set format key ${num} untuk tampilan produk`,
    usage: `formatkey${num}`,
    permission: 'admin',

    run: async ({ m }) => {
      const wording = getWording()
      if (!wording.formatKeys) wording.formatKeys = {}
      wording.formatKeys.active = num.toString()
      wording.formatKeys.template = formats[num]
      setWording(wording)

      const preview = formats[num]
        .replace(/{no}/g, '1')
        .replace(/{name}/g, 'Contoh Produk')
        .replace(/{price}/g, 'Rp 50.000')
        .replace(/{desc}/g, 'Deskripsi produk')
        .replace(/{stock}/g, '10')

      m.reply(`✅ *Format key ${num} berhasil diaktifkan!*\n\n📋 *Preview:*\n${preview}\n\n💡 Ketik *formatkey* untuk lihat semua format.`)
    }
  }
}

// Export formatkey1
export default createFormatKeyCommand(1)
