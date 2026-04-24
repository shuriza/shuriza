import { getStore, setStore } from '../../database/db.js'

export default {
  name: 'delsetdone',
  aliases: ['resetdone'],
  category: 'store',
  description: 'Hapus template pesan done (kembali ke default)',
  usage: 'delsetdone',
  permission: 'admin',

  run: async ({ m }) => {
    const store = getStore()

    if (!store.doneTemplate) {
      return m.reply('ℹ️ Template done belum diatur / sudah pakai default.')
    }

    store.doneTemplate = ''
    setStore(store)

    m.reply('✅ Template pesan *done* berhasil dihapus.\nSekarang pakai format default.')
  }
}
