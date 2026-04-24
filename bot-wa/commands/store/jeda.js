import { getStore, setStore } from '../../database/db.js'

export default {
  name: 'jeda',
  aliases: ['pause', 'storejeda'],
  category: 'store',
  description: 'Toggle store buka/tutup sementara',
  usage: 'jeda',
  permission: 'admin',

  run: async ({ m }) => {
    const store = getStore()
    store.jeda = !store.jeda
    setStore(store)

    if (store.jeda) {
      m.reply(
        `⏸️ Store sekarang dalam mode *JEDA*\n` +
        `Pelanggan tidak bisa melihat list produk.\n\n` +
        `ℹ️ Ketik *jeda* lagi untuk membuka kembali.`
      )
    } else {
      m.reply(
        `▶️ Store sudah *DIBUKA* kembali!\n` +
        `Pelanggan bisa melihat list produk.\n\n` +
        `ℹ️ Ketik *jeda* lagi untuk menutup sementara.`
      )
    }
  }
}
