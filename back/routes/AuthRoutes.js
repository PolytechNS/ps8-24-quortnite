// Importez les fonctions spécifiques depuis AuthController
import { registerUser as manageRegisterUser, loginUser as manageLoginUser } from '../controllers/AuthController.js';

// Exportez la fonction AuthRoutes comme export par défaut
export default async function AuthRoutes(request, response, users) {
    if (request.url.match(/^\/api\/inscription$/) && request.method === 'POST') {
        const body = await getRequestBody(request);
        try {
            const result = await manageRegisterUser(users, body);
            sendJsonResponse(response, result, 200);
        } catch (error) {
            sendJsonResponse(response, { error: error.message }, 400);
        }
    } else if (request.url.match(/^\/api\/login$/) && request.method === 'POST') {
        const body = await getRequestBody(request);
        try {
            const result = await manageLoginUser(users, body);
            sendJsonResponse(response, result, 200);
        } catch (error) {
            sendJsonResponse(response, { error: error.message }, 403);
        }
    } else {
        response.writeHead(404);
        response.end();
    }
}

async function getRequestBody(request) {
    return new Promise((resolve) => {
        let body = '';
        request.on('data', chunk => {
            body += chunk.toString();
        });
        request.on('end', () => {
            resolve(JSON.parse(body));
        });
    });
}

function sendJsonResponse(response, data, statusCode = 200) {
    response.writeHead(statusCode, { 'Content-Type': 'application/json' });
    response.end(JSON.stringify(data));
}
