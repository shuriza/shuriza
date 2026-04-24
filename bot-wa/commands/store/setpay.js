import { getStore, setStore } from '../../database/db.js'
import { writeFileSync } from 'fs'
import { join } from 'path'
import { randomId } from '../../lib/utils.js'

export default {
  name: 'setpay',
  aliases: ['addpay', 'addpayment'],
  category: 'store',
  description: 'Tambah metode pembayaran (support foto QRIS)',
  usage: 'setpay <keterangan>',
  permission: 'admin',

  run: async ({ m, text }) => {
    if (!text) {
      return m.reply(
        `❌ Tulis keterangan pembayaran!\n\n` +
        `📌 *Cara pakai:*\n` +
        `setpay keterangan pembayaran\n\n` +
        `📝 *Contoh tanpa foto:*\n` +
        `setpay Dana - 081234567890 (a/n Toko)\n` +
        `setpay BCA - 1234567890 (a/n Toko)\n\n` +
        `📝 *Contoh dengan foto QRIS:*\n` +
        `1. Kirim foto QRIS dengan caption:\n` +
        `   setpay QRIS - Scan untuk bayar\n\n` +
        `2. Atau reply foto QRIS lalu ketik:\n` +
        `   setpay QRIS - Scan untuk bayar\n\n` +
        `ℹ️ Foto akan otomatis tersimpan dan\n` +
        `   ditampilkan saat customer ketik *pay*`
      )
    }

    // Cek apakah ada gambar (kirim langsung atau reply)
    const hasImage = m.isImage || (m.quoted && m.quoted.isImage)
    let imagePath = null

    if (hasImage) {
      try {
        const buffer = m.isImage ? await m.download() : await m.downloadQuoted()
        const fileName = `pay_${randomId(8)}.jpg`
        imagePath = join('media', fileName)
        writeFileSync(imagePath, buffer)
      } catch (err) {
        console.error('[SETPAY] Error saving image:', err.message)
        // Lanjut tanpa gambar jika gagal
        imagePath = null
      }
    }

    const store = getStore()
    if (!store.payment) store.payment = []

    // Migrasi: jika payment masih format lama (string), convert ke object
    store.payment = store.payment.map(p => {
      if (typeof p === 'string') return { text: p, image: null }
      return p
    })

    const paymentData = {
      text: text,
      image: imagePath,
    }

    store.payment.push(paymentData)
    setStore(store)

    let reply = `✅ Metode pembayaran berhasil ditambahkan!\n\n`
    reply += `📝 ${text}\n`
    if (imagePath) reply += `🖼️ Foto QRIS tersimpan\n`
    reply += `\nTotal: ${store.payment.length} metode pembayaran`

    m.reply(reply)
  }
}
