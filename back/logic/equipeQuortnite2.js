let AIplayeNumber = 0;

const setup = (AIplay) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            let positionInitiale;
            if (AIplay === 1) {
                positionInitiale = "19"; // Si l'IA est le premier joueur, la position initiale est 19
                AIplayeNumber = 1;
            } else if (AIplay === 2) {
                positionInitiale = "91"; // Si l'IA est le deuxième joueur, la position initiale est 11
                AIplayeNumber = 2;
            } else {
                reject(new Error("Valeur AIplay invalide"));
                return;
            }
            resolve(positionInitiale);
        }, 500); // resolving well before 1000ms limit
    });
};




const nextMove = (gameState) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            const myPosition = findPlayerPosition(gameState);
            //const adversaryPosition = findPlayerPosition(gameState);
            let move;

            console.log("Position de l'IA:", myPosition);

            move = findShortestPathMove(gameState,AIplayeNumber);

            if (move) {
                resolve(move);
            } else {
                // Si aucun mouvement n'est possible, retourner un mouvement "idle"
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
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(true);

        }, 10); // 10 ms à changer si trop court
    });
};

// Exporting the functions to be used outside this module
exports.setup = setup;
exports.nextMove = nextMove;
exports.correction = correction;
exports.updateBoard = updateBoard;






function findPlayerPosition(gameState) {
    for (let i = 0; i < gameState.board.length; i++) {
        for (let j = 0; j < gameState.board[i].length; j++) {
            if (gameState.board[i][j] === 2) {
                return { y: j, x: i };
            }
        }
    }
    return null;
}

function findShortestPathMove(gameState, AIplayNumber) {
    const startPosition = findPlayerPosition(gameState); // Position actuelle
    if (!startPosition) return null;

    // Détermine la ligne cible basée sur le joueur
    const targetRow = AIplayNumber === 1 ? 0 : gameState.board.length - 1;

    console.log("targetRow", targetRow);

    let queue = [{ position: startPosition, path: [] }];
    let visited = new Set([`${startPosition.x},${startPosition.y}`]); // Utilisation de x comme ligne et y comme colonne

    while (queue.length > 0) {
        let { position, path } = queue.shift();

        // Condition de victoire, arrivée à la ligne cible
        if ((AIplayNumber === 1 && position.x === targetRow) || (AIplayNumber === 2 && position.x === targetRow)) {
            const move = path.length > 0 ? path[0] : { action: "idle" }; // Prend le premier mouvement du chemin
            return move;
        }

        // Générer les mouvements possibles (haut, bas, gauche, droite)
        const directions = [
            { dx: -1, dy: 0, action: "up" },    // Haut
            { dx: 1, dy: 0, action: "down" },   // Bas
            { dx: 0, dy: -1, action: "left" },  // Gauche
            { dx: 0, dy: 1, action: "right" },  // Droite
        ];

        directions.forEach(dir => {
            let newX = position.x + dir.dx;
            let newY = position.y + dir.dy;

            // Vérifier si la nouvelle position est valide et pas encore visitée
            if (newX >= 0 && newX < gameState.board.length && newY >= 0 && newY < gameState.board[0].length && !visited.has(`${newX},${newY}`) ) {
                visited.add(`${newX},${newY}`);
                queue.push({ position: { x: newX, y: newY }, path: [...path, { action: "move", value: `${newY + 1}${newX + 1}` }] }); // Ajout de la nouvelle position au chemin, avec ajustement pour la convention (y, x)
            }
        });
    }

    console.log("Aucun chemin trouvé");

    return { action: "idle" }; // Aucun chemin trouvé
}
