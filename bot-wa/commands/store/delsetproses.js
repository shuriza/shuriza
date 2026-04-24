import { getStore, setStore } from '../../database/db.js'

export default {
  name: 'delsetproses',
  aliases: ['resetproses'],
  category: 'store',
  description: 'Hapus template pesan proses (kembali ke default)',
  usage: 'delsetproses',
  permission: 'admin',

  run: async ({ m }) => {
    const store = getStore()

    if (!store.prosesTemplate) {
      return m.reply('ℹ️ Template proses belum diatur / sudah pakai default.')
    }

    store.prosesTemplate = ''
    setStore(store)

    m.reply('✅ Template pesan *proses* berhasil dihapus.\nSekarang pakai format default.')
  }
}
