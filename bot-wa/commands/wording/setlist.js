import { getWording, setWording } from '../../database/db.js'

export default {
  name: 'setlist',
  aliases: [],
  category: 'wording',
  description: 'Set wording list produk (slot 1)',
  usage: 'setlist <template>',
  permission: 'admin',

  run: async ({ m, text, command }) => {
    if (!text) {
      return m.reply(
        `❌ *Template belum diisi!*\n\n` +
        `📌 *Cara pakai:*\n` +
        `   ${command} <template>\n\n` +
        `ℹ️ *Placeholder yang tersedia:*\n` +
        `   {products}  → Daftar produk\n` +
        `   {storename} → Nama toko\n` +
        `   {botname}   → Nama bot\n` +
        `   {total}     → Total produk\n\n` +
        `📝 *Contoh:*\n` +
        `   ${command} ═[ {storename} ]═\n\n{products}\nTotal: {total} produk\n\n` +
        `💡 Ketik *tutorsetlist* untuk tutorial lengkap.`
      )
    }

    const wording = getWording()

    // Tentukan slot berdasarkan command
    if (command === 'setlist2') {
      wording.list2 = text
    } else if (command === 'setlist3') {
      wording.list3 = text
    } else {
      wording.list = text
    }

    setWording(wording)

    const slot = command === 'setlist2' ? '2' : command === 'setlist3' ? '3' : '1'
    m.reply(`✅ *Wording list slot ${slot} berhasil diatur!*\n\n📋 *Preview:*\n${text}`)
  }
}
