const { setup: setupEquipe1, nextMove: nextMoveEquipe1, correction: correctionEquipe1, updateBoard: updateBoardEquipe1 } = require('./EquipeQuortnite');
const { setup: setupEquipe2, nextMove: nextMoveEquipe2, correction: correctionEquipe2, updateBoard: updateBoardEquipe2 } = require('./EquipeQuortnite2');



// Initialisation des états de jeu pour chaque équipe
let gameStateEquipe1 = {
    opponentWalls: [],
    ownWalls: [],
    board: Array(9).fill().map((_, rowIndex) =>
        rowIndex >= 5 ? Array(9).fill(-1) : Array(9).fill(0)
    ),
};

let gameStateEquipe2 = {
    opponentWalls: [],
    ownWalls: [],
    board: Array(9).fill().map((_, rowIndex) =>
        rowIndex >= 5 ? Array(9).fill(-1) : Array(9).fill(0)
    ),
};

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function simulateGame() {
    const player1Position = await setupEquipe1(1);
    const player2Position = await setupEquipe2(2);

    // Adapter les positions initiales au format du plateau pour chaque équipe
    gameStateEquipe1.board[parseInt(player1Position[1])-1][parseInt(player1Position[0])-1] = 1;
    gameStateEquipe2.board[parseInt(player2Position[1])-1][parseInt(player2Position[0])-1] = 2;

    console.log("État initial du plateau pour l'Equipe 1:");
    printBoard(gameStateEquipe1.board);
    console.log("État initial du plateau pour l'Equipe 2:");
    printBoard(gameStateEquipe2.board);

    let winner = null;

    while (!winner) {
        for (let player = 1; player <= 2; player++) {
            console.log(`Tour du joueur ${player}:`);

            if (player === 1) {
                console.log("Murs du joueur 1 (Own Walls):", gameStateEquipe1.ownWalls);
                console.log("Murs du joueur 2 (Opponent Walls):", gameStateEquipe1.opponentWalls);
            } else {
                console.log("Murs du joueur 2 (Own Walls):", gameStateEquipe2.ownWalls);
                console.log("Murs du joueur 1 (Opponent Walls):", gameStateEquipe2.opponentWalls);
            }

            // Sélection du gameState et des fonctions en fonction du joueur
            let gameState = player === 1 ? gameStateEquipe1 : gameStateEquipe2;
            let nextMove = player === 1 ? nextMoveEquipe1 : nextMoveEquipe2;
            let updateBoard = player === 1 ? updateBoardEquipe1 : updateBoardEquipe2;

            const move = await nextMove(gameState);
            console.log("Mouvement choisi:", move);

            if (move.action === "wall") {
                if (player === 1) {
                    gameState.ownWalls.push(move.value);
                } else {
                    gameState.opponentWalls.push(move.value);
                }
            } else if (move.action === "move") {
                applyMoveToBoard(player, move, gameState.board);
            }

            await updateBoard(gameState);

            if (player === 2) {
                updateVisibility(player, gameState.board);
            }

            if (hasPlayerWon(player, gameState.board)) {
                winner = player;
                console.log(`Le joueur ${winner} a gagné!`);
                break;
            }

            printBoard(gameState.board);
            await delay(1000);
        }
    }
}


function hasPlayerWon(player, board) {
    if (player === 1) {
        return board[0].includes(1);
    } else if (player === 2) {
        return board[8].includes(2);
    }
    return false;
}

function applyMoveToBoard(player, move, board) {
    if (move.action === "move") {
        const x = parseInt(move.value[0], 10)-1;
        const y = parseInt(move.value[1], 10)-1;

        for (let i = 0; i < board.length; i++) {
            for (let j = 0; j < board[i].length; j++) {
                if (board[i][j] === player) {
                    board[i][j] = 0;
                    break;
                }
            }
        }

        board[y][x] = player;
    }
}

function printBoard(board) {
    board.forEach(row => {
        console.log(row.map(cell => cell === -1 ? 'X' : cell).join(' '));
    });
    console.log('\n');
}

function updateVisibility(player, board) {
    for (let i = 0; i < board.length; i++) {
        for (let j = 0; j < board[i].length; j++) {
            if (board[i][j] === player) {
                if (i > 0) board[i-1][j] = -1;
                if (i < board.length - 1) board[i+1][j] = -1;
                if (j > 0) board[i][j-1] = -1;
                if (j < board[i].length - 1) board[i][j+1] = -1;
                return;
            }
        }
    }
}

simulateGame().catch(console.error);