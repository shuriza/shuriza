export default {
  name: 'tutorsetlist',
  aliases: ['tutorialsetlist'],
  category: 'wording',
  description: 'Tutorial cara set wording list produk',
  usage: 'tutorsetlist',
  permission: 'admin',

  run: async ({ m }) => {
    let text = `📖 *TUTORIAL SET WORDING LIST*\n`
    text += `═══════════════════════\n\n`
    text += `ℹ️ Wording list adalah template custom untuk menampilkan daftar produk kamu.\n\n`

    text += `━━━━━━━━━━━━━━━━━━━━━\n`
    text += `*LANGKAH 1 — Set Wording List*\n`
    text += `━━━━━━━━━━━━━━━━━━━━━\n\n`
    text += `📌 *Cara pakai:*\n`
    text += `   setlist <template>\n\n`
    text += `📝 *Contoh:*\n`
    text += `   setlist ═[ {storename} ]═\n\n{products}\nTotal: {total} produk\n\n`

    text += `━━━━━━━━━━━━━━━━━━━━━\n`
    text += `*LANGKAH 2 — Placeholder yang Tersedia*\n`
    text += `━━━━━━━━━━━━━━━━━━━━━\n\n`
    text += `   {products}  → Daftar produk\n`
    text += `   {storename} → Nama toko\n`
    text += `   {botname}   → Nama bot\n`
    text += `   {total}     → Total produk\n\n`

    text += `━━━━━━━━━━━━━━━━━━━━━\n`
    text += `*LANGKAH 3 — Slot Wording (3 Slot)*\n`
    text += `━━━━━━━━━━━━━━━━━━━━━\n\n`
    text += `   *setlist*  → Slot utama (dipakai di list)\n`
    text += `   *setlist2* → Slot cadangan 2\n`
    text += `   *setlist3* → Slot cadangan 3\n\n`

    text += `━━━━━━━━━━━━━━━━━━━━━\n`
    text += `*LANGKAH 4 — Format Key (Tampilan Produk)*\n`
    text += `━━━━━━━━━━━━━━━━━━━━━\n\n`
    text += `   *formatkey*  → Lihat semua format & preview\n`
    text += `   *formatkey1* s/d *formatkey8* → Pilih format\n\n`

    text += `━━━━━━━━━━━━━━━━━━━━━\n`
    text += `*LANGKAH 5 — Reset Wording*\n`
    text += `━━━━━━━━━━━━━━━━━━━━━\n\n`
    text += `   *resetwdlist* → Reset semua wording ke default\n\n`

    text += `💡 *Tips:* Ketik *formatkey* untuk melihat preview semua format tampilan produk.`

    m.reply(text)
  }
}
