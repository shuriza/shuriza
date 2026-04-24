import { getStore, setStore } from '../../database/db.js'

export default {
  name: 'changedone',
  aliases: [],
  category: 'store',
  description: 'Ubah template pesan done',
  usage: 'changedone <template baru>',
  permission: 'admin',

  run: async ({ m, text }) => {
    if (!text) {
      const store = getStore()
      const current = store.doneTemplate || '(belum diatur, pakai default)'
      return m.reply(
        `📄 *Template done saat ini:*\n${current}\n\n` +
        `📌 *Cara ubah:*\n` +
        `changedone template baru kamu\n\n` +
        `📝 *Contoh:*\n` +
        `changedone ═[ SELESAI ]═\n{target} pesananmu sudah selesai!\n{keterangan}`
      )
    }

    const store = getStore()
    store.doneTemplate = text
    setStore(store)

    m.reply(`✅ Template pesan *done* berhasil diubah!\n\n📄 Preview:\n${text}`)
  }
}
