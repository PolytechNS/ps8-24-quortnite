// The http module contains methods to handle http queries.
const http = require('http')
const socketIO = require('socket.io');
const { MongoClient } = require("mongodb");

const argument = process.argv[2];



// Let's import our logic.
const fileQuery = require('./queryManagers/front.js')
const apiQuery = require('./queryManagers/api.js')
const AuthRoutes = require('./routes/AuthRoutes.js');
const UserModel = require('./models/userModel.js');



const jwt = require("jsonwebtoken");

// Connexion à la base de données MongoDB
let uri;
if(argument === "dev"){
    console.log("dev");
    uri = "mongodb://root:example@localhost:27017/";
}else{
    console.log("prod");
    uri = "mongodb://root:example@localhost:27017/";
}


const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 5000 // Timeout after 5s instead of 30s
});


const host = '0.0.0.0';
const port = 8000;


/*async function run() {
    try {
        const database = client.db('sample_mflix');
        const movies = database.collection('movies');
        // Query for a movie that has the title 'Back to the Future'
        const query = { title: 'Back to the Future' };
        const movie = await movies.findOne(query);
        console.log(movie);
    } finally {
        // Ensures that the client will close when you finish/error
        await client.close();
    }
}
run().catch(console.dir);*/



/* The http module contains a createServer function, which takes one argument, which is the function that
** will be called whenever a new request arrives to the server.
 */
const server=http.createServer(function (request, response) {
    // First, let's check the URL to see if it's a REST request or a file request.
    // We will remove all cases of "../" in the url for security purposes.
    let filePath = request.url.split("/").filter(function(elem) {
        return elem !== "..";
    });

    try {
        // If the URL starts by /api, then it's a REST request (you can change that if you want).
        if (filePath[1] === "api") {
            apiQuery.manage(request, response);
            // If it doesn't start by /api, then it's a request for a file.
        } else {
            fileQuery.manage(request, response);
        }
    } catch(error) {
        console.log(`error while processing ${request.url}: ${error}`)
        response.statusCode = 400;
        response.end(`Something in your request (${request.url}) is strange...`);
    }



// For the server to be listening to request, it needs a port, which is set thanks to the listen function.
});

// We will use the socket.io library to handle websockets.



const io = socketIO(server, {
    cors: {
        origin: "http://localhost:8000", // This should match the origin your client is served from
        methods: ["GET", "POST"],
        allowedHeaders: ["my-custom-header"],
        credentials: true
    }
});


//const gameNamespace = io.of('/api/game');

const secret = 'example';
io.use((socket, next) => {
    const token = jwt.sign({ data: 'your_data_here' }, secret, { expiresIn: '1h' });
    console.log(token);

    //const token = socket.handshake.auth.token;
    if (token) {
        jwt.verify(token, secret, (err, decoded) => {
            if (err) {
                console.log("JWT Verification Error:", err);
                next(new Error('Authentication error'));
            } else {
                socket.decoded = decoded;
                next();
            }
        });
    } else {
        console.log("No token provided");
        next(new Error('Authentication error'));
    }
});



io.on('connection', (socket) => {
    console.log("Un utilisateur s'est connecté à /api/game");

    // Configurez le jeu lorsqu'une connexion est reçue
    socket.on('setup', (data) => {
        // Initialisez ou réinitialisez l'état du jeu
        console.log('Configuration du jeu : ', data);
        // Si l'IA joue en premier, faites le mouvement de l'IA
        if (data.AIplays === 1) {
            // ... L'IA fait un mouvement
            socket.emit('updatedBoard', /* ... votre état du jeu ... */);
        }
    });

    socket.on('saveGame',async(gameState)=>{
        console.log('Saving game state:', gameState);
        try {
            const gamesCollection = client.db('GameSaved').collection('games');

            // un id pour chaque partie
            const result = await gamesCollection.updateOne(
                //si on veut save les parties on peut mettre un id ici
                //{ gameId: gameState.gameId }, // Trouve le document basé sur l'ID du jeu
                { $set: gameState }, // Met à jour l'état du jeu
                { upsert: true } // Créé le document s'il n'existe pas
            );

            socket.emit('gameSaved', { message: 'Game state saved successfully.' });
        } catch (error) {
            console.error('Error saving game state:', error);
            socket.emit('gameSaveError', { message: 'Failed to save game state.' });
        }
    });
    console.log("Testons");
    socket.on('requestGameState', async () => {
        console.log('Client is requesting the current game state');
        try {
            const gamesCollection = client.db('GameSaved').collection('games');
            const gameState = await gamesCollection.findOne({}, { sort: { _id: -1 } }); // Récupère le dernier jeu sauvegardé

            if (gameState) {
                socket.emit('currentGameState', gameState);
            } else {
                socket.emit('game state error', { message: 'No game state found.' });
            }
        } catch (error) {
            console.error('Error retrieving game state:', error);
            socket.emit('gameStateError', { message: 'Failed to retrieve game state.' });
        }
    });

    // Gérez les nouveaux mouvements du joueur
    socket.on('newMove', (move) => {
        // Validez le mouvement
        // Mettez à jour l'état du jeu
        // Vérifiez si c'est le tour de l'IA et si oui, faites un mouvement
        // Émettez l'état du plateau mis à jour
        socket.emit('updatedBoard', /* ... votre état du jeu mis à jour ... */);
    });

    socket.on('disconnect', () => {
        console.log("Un utilisateur s'est déconnecté de /api/game");
    });


});

io.on('connection', (socket) => {
    console.log('A user connected');

    socket.on('disconnect', () => {
        console.log('user disconnected');
    });

    // Handle other socket events as needed
});




server.listen(port, host, () => {
    console.log(`Server is running on http://${host}:${port}`);
});





