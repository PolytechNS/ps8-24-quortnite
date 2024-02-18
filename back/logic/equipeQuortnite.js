// equipeQuortnite.js
const setup = (AIplay) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            let positionInitiale;
            if (AIplay === 1) {
                positionInitiale = "OO"; // Si l'IA est le premier joueur, la position initiale est A1
            } else if (AIplay === 2) {
                positionInitiale = "88"; // Si l'IA est le deuxième joueur, la position initiale est A9
            } else {
                reject(new Error("Valeur AIplay invalide"));
                return;
            }
            resolve(positionInitiale);
        }, 500); // resolving well before 1000ms limit
    });
};





const nextMove = (gameState) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {

            const opponentWalls = gameState.opponentWalls;
            const ownWalls = gameState.ownWalls;
            const board = gameState.board;

            let myPosition;

            // Find your AI's position on the board
            for (let i = 0; i < gameState.board.length; i++) {
                for (let j = 0; j < gameState.board[i].length; j++) {
                    if (gameState.board[i][j] === 1) { // 1 represents your AI's position
                        myPosition = { x: i, y: j };
                        break;
                    }
                }
                if (myPosition) break;
            }

            let possibleMoves = findPossibleMoves(gameState);
            // Vérifier si la liste des mouvements possibles n'est pas vide
            if (possibleMoves.length > 0) {
                // Sélectionner un mouvement aléatoire parmi les mouvements possibles
                const randomIndex = Math.floor(Math.random() * possibleMoves.length);
                const move = possibleMoves[randomIndex];

                resolve(move);
            } else {
                // Si aucun mouvement possible n'est trouvé, rejeter la promesse ou envoyer un mouvement "idle"
                resolve({ action: "idle" });

            }
        }, 100); // resolving well before 200ms limit
    });
};

const correction = (rightMove) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            // Example: AI simply accepts the correction without processing

            const readyToContinue = true;

            resolve(readyToContinue);
        }, 10); // resolving well before 50ms limit
    });
};

const updateBoard = (gameState) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            // Example: AI updates its internal state based on the game state, if necessary
            // This is a placeholder and should contain logic to update AI's game understanding
            resolve(true);
        }, 10); // resolving well before 50ms limit
    });
};

// Exporting the functions to be used outside this module
exports.setup = setup;
exports.nextMove = nextMove;
exports.correction = correction;
exports.updateBoard = updateBoard;









const findPossibleMoves = (gameState) => {
    let possibleMoves = [];
    let myPosition;

    // Find AI's position
    for (let i = 0; i < gameState.board.length; i++) {
        for (let j = 0; j < gameState.board[i].length; j++) {
            if (gameState.board[i][j] === 1) { // Assuming 1 is the AI's position
                myPosition = {x: i, y: j};
                break;
            }
        }
        if (myPosition) break;
    }

    if (!myPosition) return possibleMoves; // If AI's position is not found

    // Directions to check: Up, Down, Left, Right
    const directions = [
        {dx: -1, dy: 0}, // Up
        {dx: 1, dy: 0},  // Down
        {dx: 0, dy: -1}, // Left
        {dx: 0, dy: 1}   // Right
    ];

    directions.forEach(dir => {
        const newX = myPosition.x + dir.dx;
        const newY = myPosition.y + dir.dy;

        // Check boundaries
        if (newX >= 0 && newX < gameState.board.length && newY >= 0 && newY < gameState.board[0].length) {
            // Check if the move is blocked by a wall
            let blockedByWall = false;

            // Example check for walls (you need to replace this with your actual wall-checking logic)
            // This is a placeholder check. Your game might represent walls differently.
            gameState.opponentWalls.concat(gameState.ownWalls).forEach(wall => {
                if (wall[0] === `${newX}${newY}` && wall[1] === 0 /* horizontal wall check */ ||
                    wall[0] === `${newX}${newY}` && wall[1] === 1 /* vertical wall check */) {
                    blockedByWall = true;
                }
            });

            if (!blockedByWall) {
                possibleMoves.push({action: "move", value: `${newX}${newY}`});
            }
        }
    });
    return possibleMoves;
};