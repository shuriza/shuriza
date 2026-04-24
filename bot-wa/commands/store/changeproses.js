import { getStore, setStore } from '../../database/db.js'

export default {
  name: 'changeproses',
  aliases: [],
  category: 'store',
  description: 'Ubah template pesan proses',
  usage: 'changeproses <template baru>',
  permission: 'admin',

  run: async ({ m, text }) => {
    if (!text) {
      const store = getStore()
      const current = store.prosesTemplate || '(belum diatur, pakai default)'
      return m.reply(
        `📄 *Template proses saat ini:*\n${current}\n\n` +
        `📌 *Cara ubah:*\n` +
        `changeproses template baru kamu\n\n` +
        `📝 *Contoh:*\n` +
        `changeproses ⏳ Hai {target}!\nPesananmu sedang diproses.\n{keterangan}`
      )
    }

    const store = getStore()
    store.prosesTemplate = text
    setStore(store)

    m.reply(`✅ Template pesan *proses* berhasil diubah!\n\n📄 Preview:\n${text}`)
  }
}
