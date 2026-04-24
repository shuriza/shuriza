import { getWording, setWording } from '../../database/db.js'

export default {
  name: 'setlist3',
  aliases: [],
  category: 'wording',
  description: 'Set wording list produk (slot 3)',
  usage: 'setlist3 <template>',
  permission: 'admin',

  run: async ({ m, text }) => {
    if (!text) {
      return m.reply(
        `❌ *Template belum diisi!*\n\n` +
        `📌 *Cara pakai:*\n` +
        `   setlist3 <template>\n\n` +
        `ℹ️ *Placeholder yang tersedia:*\n` +
        `   {products}  → Daftar produk\n` +
        `   {storename} → Nama toko\n` +
        `   {botname}   → Nama bot\n` +
        `   {total}     → Total produk\n\n` +
        `📝 *Contoh:*\n` +
        `   setlist3 ═[ {storename} ]═\n\n{products}\nTotal: {total} produk\n\n` +
        `💡 Ketik *tutorsetlist* untuk tutorial lengkap.`
      )
    }

    const wording = getWording()
    wording.list3 = text
    setWording(wording)

    m.reply(`✅ *Wording list slot 3 berhasil diatur!*\n\n📋 *Preview:*\n${text}`)
  }
}
