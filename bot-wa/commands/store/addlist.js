import { getStore, setStore } from '../../database/db.js'
import { formatRupiah } from '../../lib/utils.js'

export default {
  name: 'addlist',
  aliases: ['addproduk', 'addproduct'],
  category: 'store',
  description: 'Tambah produk ke list',
  usage: 'addlist nama|harga|deskripsi|stok',
  permission: 'admin',

  run: async ({ m, text }) => {
    if (!text) {
      return m.reply(
        `❌ Format salah!\n\n` +
        `📌 *Cara pakai:*\n` +
        `addlist nama | harga | deskripsi | stok\n\n` +
        `📝 *Contoh:*\n` +
        `addlist Akun Netflix | 50000 | Premium 1 Bulan | 10\n` +
        `addlist Akun Spotify | 30000 | Premium 1 Bulan\n` +
        `addlist Diamond ML 100 | 15000\n\n` +
        `ℹ️ *Keterangan:*\n` +
        `- nama = wajib diisi\n` +
        `- harga = wajib diisi (angka)\n` +
        `- deskripsi = opsional\n` +
        `- stok = opsional (angka)`
      )
    }

    const parts = text.split('|').map(s => s.trim())
    if (parts.length < 2) {
      return m.reply(
        `❌ Minimal isi *nama* dan *harga*!\n\n` +
        `📌 *Format:*\n` +
        `addlist nama | harga\n\n` +
        `📝 *Contoh:*\n` +
        `addlist Akun Netflix | 50000`
      )
    }

    const [name, priceStr, description, stockStr] = parts
    const price = parseInt(priceStr)

    if (!name) {
      return m.reply(`❌ Nama produk tidak boleh kosong!\n\n📝 Contoh: addlist Akun Netflix | 50000`)
    }

    if (isNaN(price) || price < 0) {
      return m.reply(
        `❌ Harga harus berupa *angka*!\n\n` +
        `📌 Yang kamu tulis: "${priceStr}"\n` +
        `📝 Contoh yang benar: addlist Akun Netflix | 50000`
      )
    }

    const store = getStore()
    if (!store.products) store.products = []

    const exists = store.products.find(p => p.name.toLowerCase() === name.toLowerCase())
    if (exists) {
      return m.reply(
        `❌ Produk *${name}* sudah ada di list!\n\n` +
        `📌 Gunakan perintah lain:\n` +
        `- updatelist ${name} | harga | 60000 → ubah harga\n` +
        `- renamelist ${name} | Nama Baru → ganti nama`
      )
    }

    const product = {
      name,
      price,
      description: description || '',
      stock: stockStr ? parseInt(stockStr) : undefined,
      createdAt: new Date().toISOString(),
    }

    store.products.push(product)
    setStore(store)

    let reply = `✅ Produk berhasil ditambahkan!\n\n`
    reply += `📦 Nama  : *${name}*\n`
    reply += `💰 Harga : ${formatRupiah(price)}\n`
    if (description) reply += `📝 Desc  : ${description}\n`
    if (stockStr) reply += `📊 Stok  : ${parseInt(stockStr)}\n`

    m.reply(reply)
  }
}
