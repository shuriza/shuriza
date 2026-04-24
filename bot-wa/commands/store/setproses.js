import { getStore, setStore } from '../../database/db.js'

export default {
  name: 'setproses',
  aliases: [],
  category: 'store',
  description: 'Set template pesan proses',
  usage: 'setproses <template>',
  permission: 'admin',

  run: async ({ m, text }) => {
    if (!text) {
      return m.reply(
        `❌ Tulis template pesan proses!\n\n` +
        `📌 *Cara pakai:*\n` +
        `setproses template pesan kamu\n\n` +
        `📝 *Placeholder yang bisa dipakai:*\n` +
        `{target} → mention customer\n` +
        `{keterangan} → keterangan order\n` +
        `{tanggal} → tanggal sekarang\n` +
        `{storename} → nama toko\n` +
        `{botname} → nama bot\n\n` +
        `📝 *Contoh:*\n` +
        `setproses ═[ PROSES ]═\nCustomer: {target}\nPesanan: {keterangan}\nMohon ditunggu ya!`
      )
    }

    const store = getStore()
    store.prosesTemplate = text
    setStore(store)

    m.reply(`✅ Template pesan *proses* berhasil diatur!\n\n📄 Preview:\n${text}`)
  }
}
