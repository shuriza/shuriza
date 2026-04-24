import { getStore } from '../../database/db.js'
import { existsSync, readFileSync } from 'fs'
import config from '../../config.js'

export default {
  name: 'pay',
  aliases: ['payment', 'pembayaran', 'bayar'],
  category: 'store',
  description: 'Lihat metode pembayaran',
  usage: 'pay',
  permission: 'user',

  run: async ({ sock, m }) => {
    const store = getStore()

    if (!store.payment || store.payment.length === 0) {
      return m.reply(
        '📭 Belum ada metode pembayaran yang diatur.\n\n' +
        'Admin bisa tambah dengan:\nsetpay Dana - 081234567890\n\n' +
        'Atau kirim foto QRIS dengan caption:\nsetpay QRIS - Scan untuk bayar'
      )
    }

    // Migrasi: convert string lama ke object
    const payments = store.payment.map(p => {
      if (typeof p === 'string') return { text: p, image: null }
      return p
    })

    // Pisahkan payment yang punya foto dan yang tidak
    const withImage = payments.filter(p => p.image && existsSync(p.image))
    const withoutImage = payments.filter(p => !p.image || !existsSync(p.image))

    const storeName = config.storeName

    // Kirim daftar teks dulu
    let text = `═[ ${storeName} - PEMBAYARAN ]═───···\n\n`
    payments.forEach((p, i) => {
      text += `${i + 1}. ${p.text}`
      if (p.image && existsSync(p.image)) text += ` 🖼️`
      text += `\n`
    })
    text += `\n───···\n`
    text += `Hubungi admin untuk konfirmasi pembayaran.`

    await sock.sendMessage(m.from, { text }, { quoted: m.msg })

    // Kirim foto-foto QRIS satu per satu
    for (const pay of withImage) {
      try {
        const imageBuffer = readFileSync(pay.image)
        await sock.sendMessage(m.from, {
          image: imageBuffer,
          caption: `💳 ${pay.text}`,
        })
      } catch (err) {
        console.error('[PAY] Error sending image:', err.message)
      }
    }
  }
}
