import { getWording, setWording } from '../../database/db.js'

const fmt = '┌ {name}\n├ {price}\n├ {desc}\n└ Stok: {stock}\n'

export default {
  name: 'formatkey3',
  aliases: [],
  category: 'wording',
  description: 'Set format key 3',
  usage: 'formatkey3',
  permission: 'admin',
  run: async ({ m }) => {
    const wording = getWording()
    if (!wording.formatKeys) wording.formatKeys = {}
    wording.formatKeys.active = '3'
    wording.formatKeys.template = fmt
    setWording(wording)
    const preview = fmt.replace(/{no}/g, '1').replace(/{name}/g, 'Contoh Produk').replace(/{price}/g, 'Rp 50.000').replace(/{desc}/g, 'Deskripsi produk').replace(/{stock}/g, '10')
    m.reply(`✅ *Format key 3 berhasil diaktifkan!*\n\n📋 *Preview:*\n${preview}\n\n💡 Ketik *formatkey* untuk lihat semua format.`)
  }
}
