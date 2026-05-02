/**
 * WhatsApp Tic-Tac-Toe Bot
 * Bot game Tic-Tac-Toe untuk WhatsApp Group
 * 
 * PERINTAH SEDERHANA:
 * ttt @player   - Tantang pemain
 * ok            - Terima tantangan
 * ga            - Tolak tantangan
 * 1-25          - Pilih posisi (langsung ketik angka)
 * papan         - Lihat papan
 * nyerah        - Menyerah
 * skor          - Lihat statistik
 * menu          - Bantuan
 * 
 * PAPAN 5x5 — Menang kalau 4 sejajar!
 */

const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode');
const fs = require('fs');
const path = require('path');
const TicTacToe = require('./game');

// Menyimpan game aktif per group
const activeGames = new Map();
const pendingChallenges = new Map();
const playerStats = new Map();

// Inisialisasi WhatsApp Client
const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    }
});

// Event: QR Code untuk login
client.on('qr', async (qr) => {
    console.log('\n╔══════════════════════════════════════╗');
    console.log('║   📱 SCAN QR CODE UNTUK LOGIN        ║');
    console.log('╚══════════════════════════════════════╝\n');

    // Simpan QR sebagai file gambar PNG
    const qrPath = path.join(__dirname, 'qrcode.png');
    await qrcode.toFile(qrPath, qr, { width: 300, margin: 2 });
    console.log(`✅ QR Code tersimpan di: ${qrPath}`);
    console.log('👉 Buka file qrcode.png lalu scan dengan WhatsApp\n');

    // Tampilkan juga di terminal (text mode)
    const qrText = await qrcode.toString(qr, { type: 'terminal', small: true });
    console.log(qrText);
    console.log('\n⏰ Jika QR tidak terlihat di terminal, buka file qrcode.png');
});

// Event: Client siap
client.on('ready', () => {
    console.log('╔══════════════════════════════════════╗');
    console.log('║   ✅ BOT TICTACTOE SIAP!            ║');
    console.log('║   Bot sudah terhubung ke WhatsApp    ║');
    console.log('╚══════════════════════════════════════╝');
});

client.on('authenticated', () => {
    console.log('✅ Autentikasi berhasil!');
});

client.on('auth_failure', (msg) => {
    console.error('❌ Autentikasi gagal:', msg);
});

// Daftar perintah yang dikenali bot
const COMMANDS = ['ttt', 'ok', 'ga', 'papan', 'nyerah', 'skor', 'menu', 'reset'];

// Event: Pesan masuk
client.on('message_create', async (message) => {
    try {

        const body = message.body.trim().toLowerCase();
        const firstWord = body.split(/\s+/)[0];

        // Cek apakah pesan adalah angka 1-25 (langkah game)
        const isMove = /^([1-9]|1[0-9]|2[0-5])$/.test(body);
        // Cek apakah pesan adalah command yang dikenali
        const isCommand = COMMANDS.includes(firstWord);

        if (!isMove && !isCommand) return;

        // Debug log
        console.log(`📩 Pesan diterima: "${message.body}" dari ${message.author || message.from} (fromMe: ${message.fromMe})`);
        console.log(`   mentionedIds:`, message.mentionedIds);

        // Hanya proses pesan dari group
        const chat = await message.getChat();
        if (!chat.isGroup) {
            await message.reply('⚠️ Bot ini hanya bisa digunakan di group!');
            return;
        }

        const groupId = chat.id._serialized;
        let senderId = message.author || message.from;
        
        // Jika pesan dari bot sendiri (fromMe), gunakan ID bot
        if (message.fromMe) {
            senderId = 'BOT';
        }

        // === ANGKA LANGSUNG (1-25) = Langkah permainan ===
        if (isMove) {
            await handleMove(message, groupId, senderId, parseInt(body));
            return;
        }

        // === COMMAND ===
        switch (firstWord) {
            case 'ttt':
                // Cek mention dari mentionedIds ATAU dari teks pesan
                let challengedId = null;
                if (message.mentionedIds && message.mentionedIds.length > 0) {
                    challengedId = message.mentionedIds[0]._serialized || message.mentionedIds[0];
                } else {
                    // Fallback: cari nomor dari teks @628xxx
                    const mentionMatch = message.body.match(/@(\d+)/);
                    if (mentionMatch) {
                        challengedId = mentionMatch[1] + '@c.us';
                        console.log(`   Fallback mention: ${challengedId}`);
                    }
                }

                if (challengedId) {
                    await handleChallenge(message, groupId, senderId, challengedId);
                } else {
                    await handleHelp(message);
                }
                break;
            case 'ok':
                await handleAccept(message, groupId, senderId);
                break;
            case 'ga':
                await handleReject(message, groupId, senderId);
                break;
            case 'papan':
                await handleBoard(message, groupId);
                break;
            case 'nyerah':
                await handleQuit(message, groupId, senderId);
                break;
            case 'skor':
                await handleStats(message, groupId);
                break;
            case 'menu':
                await handleHelp(message);
                break;
            case 'reset':
                await handleReset(message, groupId, senderId);
                break;
        }
    } catch (error) {
        console.error('Error:', error);
    }
});

// ==================== HANDLER FUNCTIONS ====================

async function handleHelp(message) {
    const helpText = `
🎮 *TIC-TAC-TOE 5x5* 🎮
━━━━━━━━━━━━━━━━━━━━

📝 *PERINTAH:*
• *ttt @nama* → Tantang pemain
• *ok* → Terima tantangan
• *ga* → Tolak tantangan
• *1-25* → Pilih posisi (langsung ketik angka!)
• *papan* → Lihat papan
• *nyerah* → Menyerah
• *skor* → Statistik
• *menu* → Bantuan ini

📍 *POSISI:*
 1 │ 2 │ 3 │ 4 │ 5
──┼──┼──┼──┼──
 6 │ 7 │ 8 │ 9 │10
──┼──┼──┼──┼──
11│12│13│14│15
──┼──┼──┼──┼──
16│17│18│19│20
──┼──┼──┼──┼──
21│22│23│24│25

🏆 *4 SEJAJAR = MENANG!*

🎯 *CARA MAIN:*
1. Ketik *ttt @teman*
2. Teman ketik *ok*
3. Langsung ketik angka *1-25*
━━━━━━━━━━━━━━━━━━━━
`;
    await message.reply(helpText);
}

async function handleChallenge(message, groupId, challengerId, challengedId) {
    if (activeGames.has(groupId)) {
        await message.reply('⚠️ Masih ada game berjalan! Ketik *nyerah* untuk akhiri.');
        return;
    }

    if (pendingChallenges.has(groupId)) {
        await message.reply('⚠️ Ada tantangan menunggu! Ketik *ga* untuk batal.');
        return;
    }

    if (challengerId === challengedId) {
        await message.reply('⚠️ Ga bisa tantang diri sendiri! 😅');
        return;
    }

    // Jika bot yang menantang (challengerId === 'BOT'), set challengerId ke 'BOT'
    // Jika yang ditantang adalah bot, langsung auto-accept
    if (challengedId === 'BOT' || challengerId === 'BOT') {
        // Bot tidak bisa tantang diri sendiri
        if (challengedId === 'BOT' && challengerId === 'BOT') {
            await message.reply('⚠️ Ga bisa tantang diri sendiri! 😅');
            return;
        }
    }

    // Jika yang ditantang adalah bot, langsung auto-accept
    if (challengedId === 'BOT') {
        const game = new TicTacToe(challengerId, 'BOT');
        activeGames.set(groupId, game);

        const board = game.renderBoardEmoji();

        await message.reply(
            `🎮 *GAME START!* 🎮\n\n` +
            `❌ P1: @${challengerId.split('@')[0]}\n` +
            `⭕ P2: Bot 🤖\n\n` +
            `${board}\n\n` +
`Giliran P1 (❌) — langsung ketik angka *1-25*`
        );
        return;
    }

    pendingChallenges.set(groupId, {
        challenger: challengerId,
        challenged: challengedId,
        timestamp: Date.now()
    });

    // Auto-expire 2 menit
    setTimeout(() => {
        if (pendingChallenges.has(groupId)) {
            const c = pendingChallenges.get(groupId);
            if (c.challenger === challengerId && c.challenged === challengedId) {
                pendingChallenges.delete(groupId);
            }
        }
    }, 120000);

    // Ambil nama penantang
    let name = 'Bot 🤖';
    if (challengerId !== 'BOT') {
        try {
            const contact = await message.getContact();
            name = contact.pushname || contact.number || challengerId.split('@')[0];
        } catch (e) {
            name = challengerId.split('@')[0];
        }
    }

    const chat = await message.getChat();
    await chat.sendMessage(
        `🎮 *TANTANGAN!*\n\n` +
        `${name} ngajak @${challengedId.split('@')[0]} main Tic-Tac-Toe!\n\n` +
        `Ketik *ok* untuk terima\n` +
        `Ketik *ga* untuk tolak\n\n` +
        `⏰ Expired dalam 2 menit`,
        { mentions: [challengedId] }
    );
}

async function handleAccept(message, groupId, senderId) {
    const challenge = pendingChallenges.get(groupId);

    if (!challenge) {
        await message.reply('⚠️ Ga ada tantangan aktif.');
        return;
    }

    if (senderId !== challenge.challenged) {
        await message.reply('⚠️ Tantangan ini bukan buat kamu!');
        return;
    }

    const game = new TicTacToe(challenge.challenger, challenge.challenged);
    activeGames.set(groupId, game);
    pendingChallenges.delete(groupId);

    const board = game.renderBoardEmoji();

    const p1Name = challenge.challenger === 'BOT' ? 'Bot 🤖' : `@${challenge.challenger.split('@')[0]}`;
    const p2Name = challenge.challenged === 'BOT' ? 'Bot 🤖' : `@${challenge.challenged.split('@')[0]}`;
    const mentions = [challenge.challenger, challenge.challenged].filter(id => id !== 'BOT');

    await message.reply(
        `🎮 *GAME START!* 🎮\n\n` +
        `❌ P1: ${p1Name}\n` +
        `⭕ P2: ${p2Name}\n\n` +
        `${board}\n\n` +
        `Giliran P1 (❌) — langsung ketik angka *1-25*`,
        undefined,
        { mentions }
    );
}

async function handleReject(message, groupId, senderId) {
    const challenge = pendingChallenges.get(groupId);

    if (!challenge) {
        await message.reply('⚠️ Ga ada tantangan aktif.');
        return;
    }

    if (senderId !== challenge.challenged && senderId !== challenge.challenger) {
        await message.reply('⚠️ Bukan tantanganmu!');
        return;
    }

    pendingChallenges.delete(groupId);
    await message.reply('❌ Tantangan dibatalkan.');
}

async function handleMove(message, groupId, senderId, position) {
    const game = activeGames.get(groupId);

    if (!game) return; // Diam aja kalau ga ada game (biar ga spam)

    // Cek peserta
    if (senderId !== game.player1 && senderId !== game.player2) return;

    const result = game.makeMove(senderId, position);

    if (!result.success) {
        await message.reply(result.message);
        return;
    }

    const board = game.renderBoardEmoji();

    if (result.gameOver) {
        if (result.winner) {
            const loserId = result.winner === game.player1 ? game.player2 : game.player1;
            updateStats(result.winner, 'win');
            updateStats(loserId, 'loss');
        } else {
            updateStats(game.player1, 'draw');
            updateStats(game.player2, 'draw');
        }

        activeGames.delete(groupId);

        await message.reply(
            `${board}\n\n` +
            `${result.message}\n\n` +
            `🔄 Ketik *ttt @nama* untuk main lagi!`
        );
    } else {
        const nextPlayerId = result.nextPlayer;
        const nextName = nextPlayerId === 'BOT' ? 'Bot 🤖' : `@${nextPlayerId.split('@')[0]}`;
        const mentions = nextPlayerId !== 'BOT' ? [nextPlayerId] : [];

        await message.reply(
            `${board}\n\n` +
            `Giliran ${nextName} (${result.nextSymbol === 'X' ? '❌' : '⭕'}) — ketik *1-25*`,
            undefined,
            { mentions }
        );
    }
}

async function handleBoard(message, groupId) {
    const game = activeGames.get(groupId);

    if (!game) {
        await message.reply('⚠️ Ga ada game berjalan!');
        return;
    }

    const board = game.renderBoardEmoji();
    const status = game.getStatus();

    await message.reply(`🎮 *PAPAN:*\n${board}\n\n${status}`);
}

async function handleQuit(message, groupId, senderId) {
    const game = activeGames.get(groupId);

    if (!game) {
        if (pendingChallenges.has(groupId)) {
            pendingChallenges.delete(groupId);
            await message.reply('❌ Tantangan dibatalkan.');
            return;
        }
        await message.reply('⚠️ Ga ada game berjalan!');
        return;
    }

    if (senderId !== game.player1 && senderId !== game.player2) {
        await message.reply('⚠️ Kamu bukan peserta!');
        return;
    }

    const winnerId = senderId === game.player1 ? game.player2 : game.player1;
    updateStats(winnerId, 'win');
    updateStats(senderId, 'loss');
    activeGames.delete(groupId);

    let name = 'Bot 🤖';
    if (senderId !== 'BOT') {
        try {
            const contact = await message.getContact();
            name = contact.pushname || contact.number || senderId.split('@')[0];
        } catch (e) {
            name = senderId.split('@')[0];
        }
    }

    const winnerName = winnerId === 'BOT' ? 'Bot 🤖' : `@${winnerId.split('@')[0]}`;
    const mentions = winnerId !== 'BOT' ? [winnerId] : [];

    await message.reply(
        `🏳️ *${name} NYERAH!*\n\n` +
        `🏆 Pemenang: ${winnerName}\n\n` +
        `🔄 Ketik *ttt @nama* untuk main lagi!`,
        undefined,
        { mentions }
    );
}

async function handleStats(message, groupId) {
    let text = '📊 *SKOR* 📊\n━━━━━━━━━━━━━\n\n';

    if (playerStats.size === 0) {
        text += '_Belum ada data. Main dulu!_';
    } else {
        const sorted = [...playerStats.entries()].sort((a, b) => b[1].wins - a[1].wins);
        let rank = 1;
        for (const [id, s] of sorted) {
            const medal = rank === 1 ? '🥇' : rank === 2 ? '🥈' : rank === 3 ? '🥉' : '▪️';
            const total = s.wins + s.losses + s.draws;
            const wr = total > 0 ? Math.round((s.wins / total) * 100) : 0;
            text += `${medal} @${id.split('@')[0]}\n`;
            text += `   W:${s.wins} L:${s.losses} D:${s.draws} (${wr}%)\n\n`;
            rank++;
        }
    }

    const mentions = [...playerStats.keys()];
    await message.reply(text, undefined, { mentions });
}

async function handleReset(message, groupId, senderId) {
    const chat = await message.getChat();
    const participant = chat.participants.find(p => {
        return (p.id._serialized || p.id) === senderId;
    });

    const isAdmin = participant && (participant.isAdmin || participant.isSuperAdmin);
    const game = activeGames.get(groupId);
    const isPlayer = game && (senderId === game.player1 || senderId === game.player2);

    if (!isAdmin && !isPlayer) {
        await message.reply('⚠️ Hanya admin/pemain yang bisa reset!');
        return;
    }

    activeGames.delete(groupId);
    pendingChallenges.delete(groupId);
    await message.reply('🔄 Game direset! Ketik *ttt @nama* untuk main baru.');
}

// ==================== UTILITY ====================

function updateStats(playerId, result) {
    if (!playerStats.has(playerId)) {
        playerStats.set(playerId, { wins: 0, losses: 0, draws: 0 });
    }
    const s = playerStats.get(playerId);
    if (result === 'win') s.wins++;
    else if (result === 'loss') s.losses++;
    else if (result === 'draw') s.draws++;
}

// ==================== START ====================
console.log('🎮 Memulai WhatsApp Tic-Tac-Toe Bot...');
console.log('📱 Silakan scan QR Code...\n');

client.on('disconnected', (reason) => {
    console.log('⚠️ Client disconnected:', reason);
});

client.initialize().catch((err) => {
    console.error('❌ Gagal initialize client:', err);
});

process.on('SIGINT', async () => {
    console.log('\n🛑 Bot mati...');
    await client.destroy();
    process.exit(0);
});

process.on('SIGTERM', async () => {
    await client.destroy();
    process.exit(0);
});
