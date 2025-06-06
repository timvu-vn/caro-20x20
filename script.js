// Game State
let currentPlayer = 'X';
let gameBoard = [];
let gameActive = true;
let currentUser = null;
const BOARD_SIZE = 20;
const WIN_LENGTH = 5;

// Initialize board
function initializeBoard() {
    gameBoard = Array(BOARD_SIZE).fill(null).map(() => Array(BOARD_SIZE).fill(''));
    const boardElement = document.getElementById('gameBoard');
    boardElement.innerHTML = '';
    
    for (let i = 0; i < BOARD_SIZE; i++) {
        for (let j = 0; j < BOARD_SIZE; j++) {
            const cell = document.createElement('div');
            cell.className = 'cell';
            cell.dataset.row = i;
            cell.dataset.col = j;
            cell.addEventListener('click', handleCellClick);
            boardElement.appendChild(cell);
        }
    }
}

// Handle cell click
function handleCellClick(e) {
    if (!gameActive) return;
    
    const row = parseInt(e.target.dataset.row);
    const col = parseInt(e.target.dataset.col);
    
    if (gameBoard[row][col] !== '') return;
    
    gameBoard[row][col] = currentPlayer;
    e.target.textContent = currentPlayer;
    e.target.classList.add('taken', currentPlayer.toLowerCase());
    
    if (checkWin(row, col)) {
        endGame(`Người chơi ${currentPlayer} thắng!`);
        return;
    }
    
    if (checkDraw()) {
        endGame('Hòa!');
        return;
    }
    
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    document.getElementById('currentTurn').textContent = currentPlayer;
}

// Check win condition
function checkWin(row, col) {
    const player = gameBoard[row][col];
    
    // Check all 4 directions
    const directions = [
        [[0, 1], [0, -1]], // Horizontal
        [[1, 0], [-1, 0]], // Vertical
        [[1, 1], [-1, -1]], // Diagonal \
        [[1, -1], [-1, 1]] // Diagonal /
    ];
    
    for (const direction of directions) {
        let count = 1;
        const winningCells = [[row, col]];
        
        // Check both directions
        for (const [dr, dc] of direction) {
            let r = row + dr;
            let c = col + dc;
            
            while (r >= 0 && r < BOARD_SIZE && c >= 0 && c < BOARD_SIZE && gameBoard[r][c] === player) {
                count++;
                winningCells.push([r, c]);
                r += dr;
                c += dc;
            }
        }
        
        if (count >= WIN_LENGTH) {
            highlightWinningCells(winningCells);
            return true;
        }
    }
    
    return false;
}

// Highlight winning cells
function highlightWinningCells(cells) {
    const boardElement = document.getElementById('gameBoard');
    cells.forEach(([row, col]) => {
        const index = row * BOARD_SIZE + col;
        boardElement.children[index].classList.add('winning');
    });
}

// Check draw
function checkDraw() {
    for (let i = 0; i < BOARD_SIZE; i++) {
        for (let j = 0; j < BOARD_SIZE; j++) {
            if (gameBoard[i][j] === '') return false;
        }
    }
    return true;
}

// End game
function endGame(message) {
    gameActive = false;
    document.getElementById('winnerText').textContent = message;
    document.getElementById('winnerMessage').classList.remove('hidden');
}

// Reset game
function resetGame() {
    currentPlayer = 'X';
    gameActive = true;
    document.getElementById('currentTurn').textContent = currentPlayer;
    document.getElementById('winnerMessage').classList.add('hidden');
    initializeBoard();
}

// Authentication Functions
function showLogin() {
    document.getElementById('loginForm').classList.remove('hidden');
    document.getElementById('registerForm').classList.add('hidden');
}

function showRegister() {
    document.getElementById('loginForm').classList.add('hidden');
    document.getElementById('registerForm').classList.remove('hidden');
}

function register() {
    const username = document.getElementById('regUsername').value.trim();
    const password = document.getElementById('regPassword').value;
    const confirmPassword = document.getElementById('regConfirmPassword').value;
    
    if (!username || !password || !confirmPassword) {
        alert('Vui lòng điền đầy đủ thông tin!');
        return;
    }
    
    if (password !== confirmPassword) {
        alert('Mật khẩu xác nhận không khớp!');
        return;
    }
    
    if (password.length < 6) {
        alert('Mật khẩu phải có ít nhất 6 ký tự!');
        return;
    }
    
    // Get existing users
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    
    // Check if username exists
    if (users.find(u => u.username === username)) {
        alert('Tên đăng nhập đã tồn tại!');
        return;
    }
    
    // Save new user
    users.push({ username, password });
    localStorage.setItem('users', JSON.stringify(users));
    
    alert('Đăng ký thành công! Vui lòng đăng nhập.');
    showLogin();
    
    // Clear form
    document.getElementById('regUsername').value = '';
    document.getElementById('regPassword').value = '';
    document.getElementById('regConfirmPassword').value = '';
}

function login() {
    const username = document.getElementById('loginUsername').value.trim();
    const password = document.getElementById('loginPassword').value;
    
    if (!username || !password) {
        alert('Vui lòng điền đầy đủ thông tin!');
        return;
    }
    
    // Get users
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    
    // Check credentials
    const user = users.find(u => u.username === username && u.password === password);
    
    if (!user) {
        alert('Tên đăng nhập hoặc mật khẩu không đúng!');
        return;
    }
    
    // Set current user
    currentUser = username;
    localStorage.setItem('currentUser', username);
    
    // Show game
    document.getElementById('authSection').classList.add('hidden');
    document.getElementById('gameSection').classList.remove('hidden');
    document.getElementById('currentUser').textContent = username;
    
    // Initialize game
    initializeBoard();
    
    // Clear form
    document.getElementById('loginUsername').value = '';
    document.getElementById('loginPassword').value = '';
}

function logout() {
    currentUser = null;
    localStorage.removeItem('currentUser');
    
    document.getElementById('authSection').classList.remove('hidden');
    document.getElementById('gameSection').classList.add('hidden');
    
    showLogin();
}

// Check if user is already logged in
window.onload = function() {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
        currentUser = savedUser;
        document.getElementById('authSection').classList.add('hidden');
        document.getElementById('gameSection').classList.remove('hidden');
        document.getElementById('currentUser').textContent = savedUser;
        initializeBoard();
    }
}