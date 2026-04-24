import { getStore, setStore } from '../../database/db.js'

export default {
  name: 'setdone',
  aliases: [],
  category: 'store',
  description: 'Set template pesan done',
  usage: 'setdone <template>',
  permission: 'admin',

  run: async ({ m, text }) => {
    if (!text) {
      return m.reply(
        `❌ Tulis template pesan done!\n\n` +
        `📌 *Cara pakai:*\n` +
        `setdone template pesan kamu\n\n` +
        `📝 *Placeholder yang bisa dipakai:*\n` +
        `{target} → mention customer\n` +
        `{keterangan} → keterangan order\n` +
        `{tanggal} → tanggal sekarang\n` +
        `{storename} → nama toko\n` +
        `{botname} → nama bot\n\n` +
        `📝 *Contoh:*\n` +
        `setdone ═[ DONE ]═\nCustomer: {target}\nPesanan: {keterangan}\nTanggal: {tanggal}\n\nTerima kasih! - {storename}`
      )
    }

    const store = getStore()
    store.doneTemplate = text
    setStore(store)

    m.reply(`✅ Template pesan *done* berhasil diatur!\n\n📄 Preview:\n${text}`)
  }
}
