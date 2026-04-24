import { getStore, getWording } from '../../database/db.js'
import { formatRupiah } from '../../lib/utils.js'
import config from '../../config.js'

export default {
  name: 'list',
  aliases: ['produk', 'product', 'katalog'],
  category: 'store',
  description: 'Tampilkan daftar produk',
  usage: 'list',
  permission: 'user',

  run: async ({ m }) => {
    const store = getStore()
    const wording = getWording()

    if (store.jeda) {
      return m.reply('⏸️ Store sedang *JEDA* / tutup sementara.\nSilakan hubungi admin.')
    }

    if (!store.products || store.products.length === 0) {
      return m.reply('📭 Belum ada produk di store.\n\nAdmin bisa tambah produk dengan:\naddlist nama | harga | deskripsi | stok')
    }

    // Cek apakah ada custom wording list
    if (wording.list) {
      let text = wording.list
      let productList = ''

      // Cek apakah ada format key aktif
      const fmtTemplate = wording.formatKeys?.template
      
      store.products.forEach((p, i) => {
        if (fmtTemplate) {
          productList += fmtTemplate
            .replace(/{no}/g, i + 1)
            .replace(/{name}/g, p.name)
            .replace(/{price}/g, formatRupiah(p.price))
            .replace(/{desc}/g, p.description || '-')
            .replace(/{stock}/g, p.stock !== undefined ? p.stock : '-')
          productList += '\n'
        } else {
          productList += `${i + 1}. *${p.name}*\n`
          productList += `   Harga: ${formatRupiah(p.price)}\n`
          if (p.description) productList += `   Desc: ${p.description}\n`
          if (p.stock !== undefined) productList += `   Stok: ${p.stock}\n`
          productList += '\n'
        }
      })

      text = text.replace(/{products}/gi, productList)
      text = text.replace(/{storename}/gi, config.storeName)
      text = text.replace(/{botname}/gi, config.botName)
      text = text.replace(/{total}/gi, store.products.length)
      return m.reply(text)
    }

    // Default format (juga cek format key)
    const fmtTemplate = wording.formatKeys?.template
    let text = `═[ ${config.storeName} - PRODUCT LIST ]═───···\n\n`

    store.products.forEach((p, i) => {
      if (fmtTemplate) {
        text += fmtTemplate
          .replace(/{no}/g, i + 1)
          .replace(/{name}/g, p.name)
          .replace(/{price}/g, formatRupiah(p.price))
          .replace(/{desc}/g, p.description || '-')
          .replace(/{stock}/g, p.stock !== undefined ? p.stock : '-')
        text += '\n'
      } else {
        text += `*${i + 1}. ${p.name}*\n`
        text += `   💰 Harga: ${formatRupiah(p.price)}\n`
        if (p.description) text += `   📝 Desc: ${p.description}\n`
        if (p.stock !== undefined) text += `   📦 Stok: ${p.stock}\n`
        text += '\n'
      }
    })

    text += `───···\n`
    text += `Total: ${store.products.length} produk\n`

    if (store.payment && store.payment.length > 0) {
      text += `\n═[ PEMBAYARAN ]═───···\n`
      store.payment.forEach((p, i) => {
        text += `${i + 1}. ${p}\n`
      })
    }

    m.reply(text)
  }
}
