/**
 * Tic-Tac-Toe Game Logic (5x5)
 * Game untuk WhatsApp Group
 * Papan 5x5, menang kalau 4 sejajar
 */

class TicTacToe {
    constructor(player1, player2) {
        this.size = 5;
        this.winLength = 4; // 4 sejajar untuk menang
        this.board = [];
        let num = 1;
        for (let i = 0; i < this.size; i++) {
            this.board[i] = [];
            for (let j = 0; j < this.size; j++) {
                this.board[i][j] = String(num);
                num++;
            }
        }
        this.player1 = player1; // X
        this.player2 = player2; // O
        this.currentPlayer = player1;
        this.currentSymbol = 'X';
        this.winner = null;
        this.gameOver = false;
        this.moves = 0;
        this.totalCells = this.size * this.size; // 25
    }

    /**
     * Render papan permainan dengan emoji
     */
    renderBoardEmoji() {
        const numEmoji = [
            '1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣',
            '6️⃣', '7️⃣', '8️⃣', '9️⃣', '🔟',
            '⓫', '⓬', '⓭', '⓮', '⓯',
            '⓰', '⓱', '⓲', '⓳', '⓴',
            '㉑', '㉒', '㉓', '㉔', '㉕'
        ];

        let display = '\n';
        for (let i = 0; i < this.size; i++) {
            for (let j = 0; j < this.size; j++) {
                const cell = this.board[i][j];
                if (cell === 'X') {
                    display += '❌';
                } else if (cell === 'O') {
                    display += '⭕';
                } else {
                    const num = parseInt(cell) - 1;
                    display += numEmoji[num];
                }
                if (j < this.size - 1) display += '│';
            }
            display += '\n';
            if (i < this.size - 1) {
                display += '──┼──┼──┼──┼──\n';
            }
        }

        return display;
    }

    /**
     * Melakukan langkah permainan
     * @param {string} playerId - ID pemain yang melakukan langkah
     * @param {number} position - Posisi 1-25
     * @returns {object} - Hasil langkah
     */
    makeMove(playerId, position) {
        // Validasi game masih berjalan
        if (this.gameOver) {
            return { success: false, message: '⚠️ Game sudah selesai!' };
        }

        // Validasi giliran pemain
        if (playerId !== this.currentPlayer) {
            const currentName = this.currentPlayer === this.player1 ? 'Player 1 (❌)' : 'Player 2 (⭕)';
            return { success: false, message: `⚠️ Bukan giliranmu! Sekarang giliran ${currentName}` };
        }

        // Validasi posisi
        if (position < 1 || position > this.totalCells) {
            return { success: false, message: `⚠️ Posisi harus antara 1-${this.totalCells}!` };
        }

        // Konversi posisi ke row dan col
        const row = Math.floor((position - 1) / this.size);
        const col = (position - 1) % this.size;

        // Cek apakah posisi sudah terisi
        if (this.board[row][col] === 'X' || this.board[row][col] === 'O') {
            return { success: false, message: '⚠️ Posisi sudah terisi! Pilih posisi lain.' };
        }

        // Lakukan langkah
        this.board[row][col] = this.currentSymbol;
        this.moves++;

        // Cek pemenang
        if (this.checkWinner(row, col)) {
            this.gameOver = true;
            this.winner = this.currentPlayer;
            return {
                success: true,
                gameOver: true,
                winner: this.currentPlayer,
                symbol: this.currentSymbol,
                message: `🎉🏆 *SELAMAT!* Player ${this.currentSymbol === 'X' ? '1' : '2'} (${this.currentSymbol === 'X' ? '❌' : '⭕'}) MENANG! 🏆🎉`
            };
        }

        // Cek seri
        if (this.moves === this.totalCells) {
            this.gameOver = true;
            return {
                success: true,
                gameOver: true,
                winner: null,
                message: '🤝 *SERI!* Tidak ada pemenang. Permainan berakhir imbang!'
            };
        }

        // Ganti giliran
        this.currentPlayer = this.currentPlayer === this.player1 ? this.player2 : this.player1;
        this.currentSymbol = this.currentSymbol === 'X' ? 'O' : 'X';

        return {
            success: true,
            gameOver: false,
            nextPlayer: this.currentPlayer,
            nextSymbol: this.currentSymbol,
            message: `✅ Langkah berhasil! Giliran selanjutnya: Player ${this.currentSymbol === 'X' ? '1' : '2'} (${this.currentSymbol === 'X' ? '❌' : '⭕'})`
        };
    }

    /**
     * Cek apakah ada pemenang (4 sejajar)
     * Cek dari posisi terakhir yang diisi
     */
    checkWinner(row, col) {
        const symbol = this.board[row][col];
        const directions = [
            [0, 1],   // horizontal →
            [1, 0],   // vertikal ↓
            [1, 1],   // diagonal ↘
            [1, -1]   // diagonal ↙
        ];

        for (const [dr, dc] of directions) {
            let count = 1;

            // Cek ke arah positif
            for (let i = 1; i < this.winLength; i++) {
                const r = row + dr * i;
                const c = col + dc * i;
                if (r >= 0 && r < this.size && c >= 0 && c < this.size && this.board[r][c] === symbol) {
                    count++;
                } else {
                    break;
                }
            }

            // Cek ke arah negatif
            for (let i = 1; i < this.winLength; i++) {
                const r = row - dr * i;
                const c = col - dc * i;
                if (r >= 0 && r < this.size && c >= 0 && c < this.size && this.board[r][c] === symbol) {
                    count++;
                } else {
                    break;
                }
            }

            if (count >= this.winLength) return true;
        }

        return false;
    }

    /**
     * Mendapatkan status game saat ini
     */
    getStatus() {
        if (this.gameOver) {
            if (this.winner) {
                return `Game selesai! Pemenang: ${this.winner === this.player1 ? 'Player 1 (❌)' : 'Player 2 (⭕)'}`;
            }
            return 'Game selesai! Hasil: Seri';
        }
        return `Giliran: ${this.currentPlayer === this.player1 ? 'Player 1 (❌)' : 'Player 2 (⭕)'}`;
    }
}

module.exports = TicTacToe;
