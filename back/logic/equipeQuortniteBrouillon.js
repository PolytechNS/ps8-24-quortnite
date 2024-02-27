// equipeQuortnite.js


// he gameState object has the following properties:
//
// opponentWalls: a list containing each of your opponent's walls (for each wall, the value is a list containing 2 elements --> a position string representing the top-left square that the wall is in contact with, and 0 if the wall is placed horizontally or1 if it is vertical).
// ownWalls: a list containing each of your walls (the same way opponentWalls are defined).
// board: a list containing 9 lists of length 9, for which board[i][j] represents the content of the cell (i+1, j+1) as defined in the rules. The value for each cell is an integer : -1 if you do not see the cell, 0 if you see the cell but it is empty, 1 if you are in the cell, 2 if your opponent is in the cell
// The move object has the following properties:
//
// action: "move", "wall", or "idle" (note that "idle" can only be used when no legal action can be performed)
// value (only if the action is not "idle"):
// for the "move" action: a position string
// for the "wall" action: a list containing 2 elements --> a position string representing the top-left square that the wall is in contact with, and an integer: 0 if the wall is placed horizontally or 1 if it is vertical.

let AIplayeNumber = 0;

const setup = (AIplay) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            let positionInitiale;
            if (AIplay === 1) {
                positionInitiale = "11"; // Si l'IA est le premier joueur, la position initiale est A1
                AIplayeNumber = 1;
            } else if (AIplay === 2) {
                positionInitiale = "19"; // Si l'IA est le deuxième joueur, la position initiale est A9
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
            const adversaryPosition = findPlayerPosition(gameState);
            let move;


            // // Placement des murs verticaux en commençant du bas (pour le joueur 1) ou du haut (pour le joueur 2)
            // if (gameState.ownWalls.length < 4) {
            //     let wallColumnIndex =1; // Ajustez selon la colonne de départ pour chaque joueur
            //     let wallRowIndex = gameState.ownWalls.length * 2 + 1; // Assurez-vous que les murs sont placés verticalement l'un après l'autre
            //
            //     // Convertir les indices en position de mur au format "colonne-ligne"
            //     let wallPosition = `${wallColumnIndex}${wallRowIndex}`;
            //
            //     resolve({ action: "wall", value: [wallPosition, 1] }); // 1 pour vertical
            //     return;
            // }




            // Vérifier si le joueur 2 est juste en dessous de la ligne 5
            // const isPlayer2BelowLine5 = gameState.board[4].includes(-1);
            // console.log(isPlayer2BelowLine5);
            // let columnIndex = gameState.board[4].indexOf(-1);
            // console.log(columnIndex);
            //
            // // S'il est temps de placer un mur horizontal
            // if (player === 1 && isPlayer2BelowLine5 && gameState.ownWalls.length < 10) {
            //     console.log('wall');
            //
            //     // Trouver une position valide pour placer le mur
            //     const wallPosition = findHorizontalWallPosition(gameState,4, columnIndex);
            //
            //     if (wallPosition) {
            //         resolve({ action: "wall", value: [wallPosition, 0] }); // 0 pour horizontal
            //         return;
            //     }
            // }




            //HUZOG //
            // const move = findShortestPathMove(gameState, player);
            //
            // // Vérifier si l'adversaire est au centre et si vous avez des murs à placer
            // if (isAdversaryInCenter(adversaryPosition) && gameState.ownWalls.length > 0) {
            //     const wallPlacement = calculateWallPlacements(adversaryPosition, gameState.ownWalls, gameState.board);
            //     if (wallPlacement.length > 0) {
            //         // Choisir le premier emplacement de mur proposé
            //         move = { action: "wall", value: wallPlacement[0] };
            //         resolve(move);
            //         return;
            //     }
            // }


            // Sinon, trouver le chemin le plus court vers la ligne d'arrivée
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
            if (gameState.board[i][j] === 1) {
                return { x: i, y: j };
            }
        }
    }
    return null;
}





const findPossibleMoves = (gameState) => {
    let possibleMoves = [];

    let myPosition = findPlayerPosition(gameState);

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

function calculateWallPlacements(opponentPosition, ownWalls, board) {
    // Cette fonction doit retourner un tableau d'emplacements de murs potentiels
    // en considérant la position actuelle de l'adversaire et le nombre de murs restants.
    // Note : Ceci est un exemple simplifié. Vous devez adapter cette logique à votre stratégie.

    let wallPlacements = [];

    // Exemple de stratégie pour placer des murs : essayer de bloquer directement devant l'adversaire
    // si possible, sans toutefois fermer complètement son chemin.
    // On considère qu'on peut placer des murs horizontalement ou verticalement autour de l'adversaire.

    // Vérifier s'il est possible de placer un mur horizontal ou vertical
    // en fonction de la position de l'adversaire et des murs déjà présents.

    // Exemple de vérification pour un mur horizontal directement au-dessus de l'adversaire
    if (opponentPosition.y > 0 && ownWalls.length > 0) { // Assurez-vous qu'il y a de l'espace et des murs disponibles
        const wallPosition = String.fromCharCode(97 + opponentPosition.x) + (opponentPosition.y);
        wallPlacements.push([wallPosition, 0]); // 0 pour horizontal
    }

    // Ajouter d'autres conditions ici pour les murs verticaux ou dans d'autres directions

    return wallPlacements;
}



function findShortestPathMove(gameState,AIplay) {
    const startPosition = findPlayerPosition(gameState);
    if (!startPosition) return null;

    const targetRow = AIplay === 1 ? 0:gameState.board.length - 1 ;

    console.log("1");


    let queue = [{ position: startPosition, path: [] }];
    let visited = new Set([`${startPosition.x},${startPosition.y}`]);

    while (queue.length > 0) {
        console.log("2");
        let { position, path } = queue.shift();

        // Vérifier si la position actuelle est la ligne d'arrivée
        if (position.x === targetRow) {
            console.log("3");
            if (path.length > 0) {
                console.log("4");
                // Conversion de la première étape du chemin en format "colonne-ligne"
                const firstMove = path[0];
                const moveCol = firstMove.value[1]; // Extraction de la colonne (y)
                const moveRow = firstMove.value[0]; // Extraction de la ligne (x)
                firstMove.value = `${moveCol}${moveRow}`; // Inversion pour le format "colonne-ligne"
                return firstMove;
            } else {
                return { action: "idle" };
            }
        }

        const directions = [
            { dx: -1, dy: 0 }, // Haut
            { dx: 1, dy: 0 },  // Bas
            { dx: 0, dy: -1 }, // Gauche
            { dx: 0, dy: 1 }   // Droite
        ];

        directions.forEach(({ dx, dy }) => {
            console.log("5");
            let newX = position.x + dx;
            let newY = position.y + dy;

            if (newX >= 0 && newX < gameState.board.length && newY >= 0 && newY < gameState.board[0].length && !visited.has(`${newX},${newY}`)) {
                visited.add(`${newX},${newY}`);

                console.log("6");
                // Ajout du mouvement en format "colonne-ligne" dans le chemin
                const newMoveCol = newX +1;
                const newMoveRow = newY +1;
                queue.push({ position: { x: newX, y: newY }, path: [...path, { action: "move", value: `${newMoveCol}${newMoveRow}` }] }); // Inversion x et y pour format "colonne-ligne"
            }
        });
    }

    return { action: "idle" }; // Si aucun chemin n'est trouvé
}








function findHorizontalWallPosition(gameState, aboveRowIndex, columnIndex) {
    // Assurez-vous que les indices sont dans les limites du tableau
    if (aboveRowIndex >= 0 && aboveRowIndex < gameState.board.length && columnIndex >= 0 && columnIndex < gameState.board[aboveRowIndex].length) {
        const positionStr = `${columnIndex}${aboveRowIndex}`;
        const wallExists = gameState.ownWalls.concat(gameState.opponentWalls).some(wall => wall[0] === positionStr && wall[1] === 0);
        if (!wallExists) {

            return positionStr;
        }
    }
    return null;
}





