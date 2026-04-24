import { getWording, setWording } from '../../database/db.js'

export default {
  name: 'setlist2',
  aliases: [],
  category: 'wording',
  description: 'Set wording list produk (slot 2)',
  usage: 'setlist2 <template>',
  permission: 'admin',

  run: async ({ m, text }) => {
    if (!text) {
      return m.reply(
        `❌ *Template belum diisi!*\n\n` +
        `📌 *Cara pakai:*\n` +
        `   setlist2 <template>\n\n` +
        `ℹ️ *Placeholder yang tersedia:*\n` +
        `   {products}  → Daftar produk\n` +
        `   {storename} → Nama toko\n` +
        `   {botname}   → Nama bot\n` +
        `   {total}     → Total produk\n\n` +
        `📝 *Contoh:*\n` +
        `   setlist2 ═[ {storename} ]═\n\n{products}\nTotal: {total} produk\n\n` +
        `💡 Ketik *tutorsetlist* untuk tutorial lengkap.`
      )
    }

    const wording = getWording()
    wording.list2 = text
    setWording(wording)

    m.reply(`✅ *Wording list slot 2 berhasil diatur!*\n\n📋 *Preview:*\n${text}`)
  }
}
