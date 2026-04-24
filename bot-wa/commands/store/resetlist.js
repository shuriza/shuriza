import { getStore, setStore } from '../../database/db.js'

export default {
  name: 'resetlist',
  aliases: ['clearlist'],
  category: 'store',
  description: 'Reset/hapus semua produk dari list',
  usage: 'resetlist confirm',
  permission: 'owner',

  run: async ({ m, text }) => {
    const store = getStore()

    if (!store.products || store.products.length === 0) {
      return m.reply('📭 List produk sudah kosong.')
    }

    const count = store.products.length

    if (text !== 'confirm') {
      return m.reply(
        `⚠️ Kamu akan menghapus *${count} produk* dari list!\n\n` +
        `📌 *Cara konfirmasi:*\n` +
        `resetlist confirm\n\n` +
        `❗ Aksi ini tidak bisa dibatalkan!`
      )
    }

    store.products = []
    setStore(store)

    m.reply(`✅ Berhasil menghapus *${count} produk* dari list.`)
  }
}
