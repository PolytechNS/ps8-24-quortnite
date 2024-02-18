const { setup, nextMove, correction, updateBoard } = require('./equipeQuortnite');

// Initialiser l'état du jeu
let gameState = {
    opponentWalls: [],
    ownWalls: [],
    board: Array(9).fill().map(() => Array(9).fill(0)),
};

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Simuler une partie
async function simulateGame() {
    // Configurer les positions initiales des IA
    const player1Position = await setup(1);
    const player2Position = await setup(2);

    // Initialiser l'état du plateau avec les positions des joueurs
    gameState.board[0][0] = 1; // Joueur 1 position initiale
    gameState.board[8][8] = 2; // Joueur 2 position initiale

    console.log("État initial du plateau :");
    printBoard(gameState.board);

    let winner = null;

    // Continuer jusqu'à ce qu'un joueur atteigne la ligne de l'arrivée
    while (!winner) {
        for (let player = 1; player <= 2; player++) {
            console.log(`Tour du joueur ${player}:`);

            // Imprimer les listes des murs
            console.log("Murs de l'opposant:", gameState.opponentWalls);
            console.log("Vos murs:", gameState.ownWalls);

            // Obtenir et appliquer le prochain mouvement de l'IA
            const move = await nextMove(gameState,player);
            console.log("Mouvement choisi:", move);

            // Appliquer le mouvement à l'état du jeu
            // Cette partie doit être implémentée selon les règles de votre jeu
            // Mettre à jour gameState ici

            applyMoveToBoard(player, move, gameState.board);
            await updateBoard(gameState);

            // Vérifier si le joueur a gagné
            if (hasPlayerWon(player, gameState.board)) {
                winner = player;
                console.log(`Le joueur ${winner} a gagné!`);
                break; // Sortir de la boucle si un joueur a gagné
            }

            // Afficher l'état mis à jour du plateau
            printBoard(gameState.board);
            await delay(2000);
        }
    }
}


// Fonction pour déterminer si un joueur a gagné
function hasPlayerWon(player, board) {
    // Condition de victoire pour le joueur 1 (atteindre la dernière ligne)
    if (player === 1) {
        return board[8].includes(1);
    }
    // Condition de victoire pour le joueur 2 (atteindre la première ligne)
    else if (player === 2) {
        return board[0].includes(2);
    }
    return false;
}

function applyMoveToBoard(player, move, board) {
    if (move.action === "move") {
        // Extraire les coordonnées de la valeur de mouvement
        const x = parseInt(move.value[0], 10);
        const y = parseInt(move.value[1], 10);


        // Effacer la position actuelle du joueur
        for (let i = 0; i < board.length; i++) {
                for (let j = 0; j < board[i].length; j++) {
                    if (board[i][j] === player) {
                        board[i][j] = 0; // Vider la position actuelle
                        break;
                    }
                }
            }

        // Appliquer le nouveau mouvement
        board[x][y] = player;
    }
    // Gérer ici d'autres types d'actions, comme "wall"
}


// Fonction pour afficher l'état du plateau
function printBoard(board) {
    board.forEach(row => {
        console.log(row.map(cell => cell === -1 ? 'X' : cell).join(' '));
    });
    console.log('\n');
}

simulateGame().catch(console.error);


