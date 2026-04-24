import { getStore, setStore } from '../../database/db.js'
import { existsSync, unlinkSync } from 'fs'

export default {
  name: 'delpay',
  aliases: ['delpayment'],
  category: 'store',
  description: 'Hapus metode pembayaran',
  usage: 'delpay <nomor>',
  permission: 'admin',

  run: async ({ m, text }) => {
    const store = getStore()

    if (!store.payment || store.payment.length === 0) {
      return m.reply('📭 Belum ada metode pembayaran.\n\nTambah dulu dengan:\nsetpay Dana - 08xxxx')
    }

    // Migrasi: convert string lama ke object
    store.payment = store.payment.map(p => {
      if (typeof p === 'string') return { text: p, image: null }
      return p
    })

    if (!text) {
      let list = `📌 *Pilih nomor yang mau dihapus:*\n\n`
      store.payment.forEach((p, i) => {
        list += `${i + 1}. ${p.text}`
        if (p.image) list += ` 🖼️`
        list += `\n`
      })
      list += `\n📝 *Cara pakai:*\ndelpay nomor\n\n📝 *Contoh:*\ndelpay 1`
      return m.reply(list)
    }

    const num = parseInt(text)
    if (isNaN(num) || num < 1 || num > store.payment.length) {
      return m.reply(
        `❌ Nomor tidak valid! Pilih antara 1-${store.payment.length}\n\n` +
        `📝 Contoh: delpay 1`
      )
    }

    const removed = store.payment.splice(num - 1, 1)[0]

    // Hapus file gambar jika ada
    if (removed.image && existsSync(removed.image)) {
      try {
        unlinkSync(removed.image)
      } catch (err) {
        console.error('[DELPAY] Error deleting image:', err.message)
      }
    }

    setStore(store)

    let reply = `✅ Metode pembayaran berhasil dihapus!\n\n📝 ${removed.text}`
    if (removed.image) reply += `\n🖼️ Foto juga dihapus`

    m.reply(reply)
  }
}
