let AIplayeNumber = 0;

const setup = (AIplay) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            let positionInitiale;
            if (AIplay === 1) {
                positionInitiale = "11"; // Si l'IA est le premier joueur, la position initiale est 19
                AIplayeNumber = 1;
            } else if (AIplay === 2) {
                positionInitiale = "99"; // Si l'IA est le deuxième joueur, la position initiale est 11
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



            if (gameState.ownWalls.length < 4) {
                if (AIplayeNumber === 1) {
                    let wallColumnIndex = 1; // Ajustez selon la colonne de départ pour chaque joueur
                    let wallRowIndex = gameState.ownWalls.length * 2 + 2; // Assurez-vous que les murs sont placés verticalement l'un après l'autre

                    // Convertir les indices en position de mur au format "colonne-ligne"
                    let wallPosition = `${wallColumnIndex}${wallRowIndex}`;

                    resolve({action: "wall", value: [wallPosition, 1]}); // 1 pour vertical
                    return;
                }

                else if (AIplayeNumber === 2) {
                        let wallColumnIndex = 8; // Ajustez selon la colonne de départ pour chaque joueur
                        let wallRowIndex = gameState.ownWalls.length * 2 + 2; // Assurez-vous que les murs sont placés verticalement l'un après l'autre

                        // Convertir les indices en position de mur au format "colonne-ligne"
                        let wallPosition = `${wallColumnIndex}${wallRowIndex}`;

                        resolve({action: "wall", value: [wallPosition, 1]}); // 1 pour vertical
                        return;
                    }
            }





            const depth = 3; // Ajustez en fonction des performances et de la complexité
            const isMaximizingPlayer = true; // L'IA cherche à maximiser son score
            //const move = minimax(gameState, depth, isMaximizingPlayer);

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

        }, 10);
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
            if (gameState.board[i][j] === 1) {
                return { x: j, y: i };
            }
        }
    }
    return null;
}

function findShortestPathMove(gameState, AIplayNumber) {
    const startPosition = findPlayerPosition(gameState); // Position actuelle
    if (!startPosition) return null;

    // Détermine la ligne cible basée sur le joueur
    const targetRow = AIplayNumber === 1 ?  gameState.board.length - 1 :0 ;

    console.log("targetRow", targetRow);

    let queue = [{ position: startPosition, path: [] }];
    let visited = new Set([`${startPosition.y},${startPosition.x}`]); // Utilisation de x comme ligne et y comme colonne

    console.log("queue",queue.length);

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





function placeWall(square, verticalOrHorizontal) {
    const column = parseInt(square[0], 10);
    const row = parseInt(square[1], 10);

    const boardSize = 9;

    if (column < 1 || column >= boardSize || row < 1 || row >= boardSize) {
        throw new Error("Invalid position for placing a wall. Walls cannot be placed on the leftmost column or the bottom row.");
    }

    if (verticalOrHorizontal !== 0 && verticalOrHorizontal !== 1) {
        throw new Error("Invalid wall orientation. Use 0 for horizontal or 1 for vertical.");
    }

    const move = {
        action: "wall",
        value: [square, verticalOrHorizontal]
    };
    return move;
}


function shouldPlaceWall(myPosition, remainingWalls, gameState) {
    return true;
}

function makeStrategicMove(gameState) {
    const myPosition = findPlayerPosition(gameState, AIplayeNumber);
    const adversaryPosition = findPlayerPosition(gameState, AIplayeNumber === 1 ? 2 : 1);
    const remainingWalls = 10-gameState.ownWalls.length;

    // Premièrement, évaluer si on doit se déplacer ou placer un mur
    if (shouldPlaceWall(myPosition, remainingWalls, gameState)) {
        // Logique pour déterminer la position et l'orientation du mur
        const wallMove = determineWallPlacement(myPosition, adversaryPosition, gameState);
        if (wallMove) return wallMove;
    }

    // Si placer un mur n'est pas avantageux ou possible, chercher le meilleur chemin pour se déplacer
    const move = findShortestPathMove(gameState, AIplayeNumber);
    return move;
}




function determineWallPlacement(gameState, AIplayeNumber) {
    // Exemple de logique pour déterminer où placer un mur.
    // Pour une stratégie réelle, vous voudrez évaluer l'effet d'un mur sur votre chemin vers la ligne d'arrivée
    // et potentiellement sur un chemin hypothétique de l'adversaire.
    // Ce code est un placeholder et doit être remplacé par votre logique.
    const possiblePlacement = "55"; // Exemple de placement, doit être calculé.
    const orientation = Math.random() > 0.5 ? 0 : 1; // Choix aléatoire pour l'exemple.

    // Vérifiez si le placement est valide avant de décider.
    if (isValidWallPlacement(possiblePlacement, orientation, gameState)) {
        return { action: "wall", value: [possiblePlacement, orientation] };
    } else {
        return null;
    }
}


function isValidWallPlacement(square, orientation, gameState) {
    // Implémentez la vérification si le mur peut être placé à cette position sans bloquer complètement un chemin.
    // Ceci est une fonction placeholder et doit être développée en fonction des règles de Qoridor.
    return true; // Simplification pour l'exemple.
}




