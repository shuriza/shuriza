import { getStore, setStore } from '../../database/db.js'

export default {
  name: 'dellist',
  aliases: ['delproduk', 'delproduct'],
  category: 'store',
  description: 'Hapus produk dari list',
  usage: 'dellist <nomor/nama>',
  permission: 'admin',

  run: async ({ m, text }) => {
    if (!text) {
      return m.reply(
        `❌ Tulis nomor atau nama produk yang mau dihapus!\n\n` +
        `📌 *Cara pakai:*\n` +
        `dellist nomor\n` +
        `dellist nama produk\n\n` +
        `📝 *Contoh:*\n` +
        `dellist 1\n` +
        `dellist Akun Netflix\n\n` +
        `ℹ️ Ketik *list* untuk lihat daftar produk & nomornya`
      )
    }

    const store = getStore()
    if (!store.products || store.products.length === 0) {
      return m.reply('📭 Belum ada produk di list. Tambahkan dulu dengan *addlist*')
    }

    let index = -1
    const num = parseInt(text)

    if (!isNaN(num) && num >= 1 && num <= store.products.length) {
      index = num - 1
    } else {
      index = store.products.findIndex(p => p.name.toLowerCase() === text.toLowerCase())
    }

    if (index === -1) {
      return m.reply(
        `❌ Produk "${text}" tidak ditemukan!\n\n` +
        `ℹ️ Ketik *list* untuk lihat daftar produk yang tersedia`
      )
    }

    const removed = store.products.splice(index, 1)[0]
    setStore(store)

    m.reply(`✅ Produk *${removed.name}* berhasil dihapus dari list.`)
  }
}
