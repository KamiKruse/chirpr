import express from 'express';
import { LogResponsesMiddleware, MetricsIncrementMiddleware, errorHandlerMiddleware, } from './api/middleware.js';
import { handlerReadiness } from './api/health.js';
import { handlerMetricReadout } from './api/metrics.js';
import { handlerGetChirps } from './api/get-all-chirps.js';
import { handlerGetSingleChirp } from './api/get-one-chirp.js';
import { handlerReset } from './api/reset.js';
import { handlerUserCreation } from './api/user-create.js';
import { handlerUserLogin } from './api/user-login.js';
import { handlerChirps } from './api/chirps.js';
// import { handlerRefreshToken } from './api/refresh-token.js'
const app = express();
const PORT = 8080;
//Middlewares
app.use(express.json());
app.use('/app', MetricsIncrementMiddleware, express.static('./src/app'));
app.use(LogResponsesMiddleware);
//Routes
app.get('/api/healthz', handlerReadiness);
app.post('/api/chirps', handlerChirps);
app.get('/api/chirps', handlerGetChirps);
app.get('/api/chirps/:chirpId', handlerGetSingleChirp);
app.post('/api/users', handlerUserCreation);
app.post('/api/login', handlerUserLogin);
app.get('/admin/metrics', handlerMetricReadout);
app.post('/admin/reset', handlerReset);
// app.post('/api/refresh', handlerRefreshToken)
//Error Handling
app.use(errorHandlerMiddleware);
app.listen(PORT, () => console.log(`server listening on port ${PORT}`));
