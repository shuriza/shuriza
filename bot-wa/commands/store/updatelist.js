import { getStore, setStore } from '../../database/db.js'
import { formatRupiah } from '../../lib/utils.js'

export default {
  name: 'updatelist',
  aliases: ['updateproduk'],
  category: 'store',
  description: 'Update harga/deskripsi/stok produk',
  usage: 'updatelist <nomor/nama> | <field> | <value>',
  permission: 'admin',

  run: async ({ m, text }) => {
    if (!text) {
      return m.reply(
        `❌ Format salah!\n\n` +
        `📌 *Cara pakai:*\n` +
        `updatelist nomor/nama | field | nilai baru\n\n` +
        `📝 *Field yang tersedia:*\n` +
        `- harga → ubah harga produk\n` +
        `- desc → ubah deskripsi\n` +
        `- stok → ubah jumlah stok\n\n` +
        `📝 *Contoh:*\n` +
        `updatelist 1 | harga | 75000\n` +
        `updatelist Akun Netflix | desc | Premium 3 Bulan\n` +
        `updatelist 2 | stok | 50\n\n` +
        `ℹ️ Ketik *list* untuk lihat nomor produk`
      )
    }

    const parts = text.split('|').map(s => s.trim())
    if (parts.length < 3) {
      return m.reply(
        `❌ Format kurang lengkap! Butuh 3 bagian dipisah *|*\n\n` +
        `📌 *Format:*\n` +
        `updatelist nomor/nama | field | nilai baru\n\n` +
        `📝 *Contoh:*\n` +
        `updatelist 1 | harga | 75000\n` +
        `updatelist Akun Netflix | stok | 20`
      )
    }

    const [identifier, field, value] = parts
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

    const product = store.products[index]
    const fieldLower = field.toLowerCase()

    if (fieldLower === 'harga' || fieldLower === 'price') {
      const price = parseInt(value)
      if (isNaN(price) || price < 0) {
        return m.reply(`❌ Harga harus berupa *angka*!\n\n📝 Contoh: updatelist ${identifier} | harga | 75000`)
      }
      product.price = price
    } else if (fieldLower === 'desc' || fieldLower === 'deskripsi' || fieldLower === 'description') {
      product.description = value
    } else if (fieldLower === 'stok' || fieldLower === 'stock') {
      const stock = parseInt(value)
      if (isNaN(stock) || stock < 0) {
        return m.reply(`❌ Stok harus berupa *angka*!\n\n📝 Contoh: updatelist ${identifier} | stok | 50`)
      }
      product.stock = stock
    } else {
      return m.reply(
        `❌ Field "${field}" tidak dikenali!\n\n` +
        `📌 *Field yang tersedia:*\n` +
        `- harga\n` +
        `- desc\n` +
        `- stok\n\n` +
        `📝 Contoh: updatelist ${identifier} | harga | 75000`
      )
    }

    product.updatedAt = new Date().toISOString()
    setStore(store)

    let reply = `✅ Produk *${product.name}* berhasil diupdate!\n\n`
    reply += `📦 Nama  : *${product.name}*\n`
    reply += `💰 Harga : ${formatRupiah(product.price)}\n`
    if (product.description) reply += `📝 Desc  : ${product.description}\n`
    if (product.stock !== undefined) reply += `📊 Stok  : ${product.stock}\n`

    m.reply(reply)
  }
}
