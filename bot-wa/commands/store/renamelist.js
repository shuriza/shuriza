import { getStore, setStore } from '../../database/db.js'

export default {
  name: 'renamelist',
  aliases: ['renameproduk'],
  category: 'store',
  description: 'Rename nama produk',
  usage: 'renamelist <nomor/nama lama> | <nama baru>',
  permission: 'admin',

  run: async ({ m, text }) => {
    if (!text) {
      return m.reply(
        `❌ Format salah!\n\n` +
        `📌 *Cara pakai:*\n` +
        `renamelist nomor/nama lama | nama baru\n\n` +
        `📝 *Contoh:*\n` +
        `renamelist 1 | Akun Netflix Premium\n` +
        `renamelist Akun Netflix | Akun Netflix Ultra\n\n` +
        `ℹ️ Ketik *list* untuk lihat nomor produk`
      )
    }

    const parts = text.split('|').map(s => s.trim())
    if (parts.length < 2) {
      return m.reply(
        `❌ Format kurang! Pisahkan dengan tanda *|*\n\n` +
        `📌 *Format:*\n` +
        `renamelist nama lama | nama baru\n\n` +
        `📝 *Contoh:*\n` +
        `renamelist 1 | Akun Netflix Premium`
      )
    }

    const [identifier, newName] = parts
    const store = getStore()

    if (!store.products || store.products.length === 0) {
      return m.reply('📭 Belum ada produk di list. Tambahkan dulu dengan *addlist*')
    }

    let index = -1
    const num = parseInt(identifier)
    if (!isNaN(num) && num >= 1 && num <= store.products.length) {
      index = num - 1
    } else {
      index = store.products.findIndex(p => p.name.toLowerCase() === identifier.toLowerCase())
    }

    if (index === -1) {
      return m.reply(
        `❌ Produk "${identifier}" tidak ditemukan!\n\n` +
        `ℹ️ Ketik *list* untuk lihat daftar produk`
      )
    }

    if (!newName) {
      return m.reply(`❌ Nama baru tidak boleh kosong!\n\n📝 Contoh: renamelist ${identifier} | Nama Baru`)
    }

    const exists = store.products.find((p, i) => i !== index && p.name.toLowerCase() === newName.toLowerCase())
    if (exists) {
      return m.reply(`❌ Nama *${newName}* sudah dipakai produk lain!`)
    }

    const oldName = store.products[index].name
    store.products[index].name = newName
    store.products[index].updatedAt = new Date().toISOString()
    setStore(store)

    m.reply(`✅ Produk berhasil di-rename!\n\n*${oldName}* → *${newName}*`)
  }
}
