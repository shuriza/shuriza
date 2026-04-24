import { getWording, setWording } from '../../database/db.js'

const formats = {
  2: '╭─ {name}\n│ Harga: {price}\n│ Desc: {desc}\n│ Stok: {stock}\n╰───···\n',
}

export default {
  name: 'formatkey2',
  aliases: [],
  category: 'wording',
  description: 'Set format key 2',
  usage: 'formatkey2',
  permission: 'admin',
  run: async ({ m }) => {
    const wording = getWording()
    if (!wording.formatKeys) wording.formatKeys = {}
    wording.formatKeys.active = '2'
    wording.formatKeys.template = formats[2]
    setWording(wording)
    const preview = formats[2].replace(/{no}/g, '1').replace(/{name}/g, 'Contoh Produk').replace(/{price}/g, 'Rp 50.000').replace(/{desc}/g, 'Deskripsi produk').replace(/{stock}/g, '10')
    m.reply(`✅ *Format key 2 berhasil diaktifkan!*\n\n📋 *Preview:*\n${preview}\n\n💡 Ketik *formatkey* untuk lihat semua format.`)
  }
}
