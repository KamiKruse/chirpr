import { configObj } from '../config.js';
import { BadRequest_400_Error, Forbidden_403_Error, NotFound_404_Error, Unauthorized_401_Error, } from '../error-classes.js';
export const LogResponsesMiddleware = (req, res, next) => {
    res.on('finish', () => {
        if (res.statusCode === 200) {
            console.log(`[OK] ${req.method} ${req.url} `);
        }
        console.log(`[NON-OK] ${req.method} ${req.url} - Status: ${res.statusCode}`);
    });
    next();
};
export const MetricsIncrementMiddleware = (_, res, next) => {
    configObj.fileserverHits += 1;
    next();
};
export const errorHandlerMiddleware = (err, _, res, next) => {
    if (err instanceof BadRequest_400_Error) {
        res.status(400).json({ error: err.message });
    }
    else if (err instanceof Unauthorized_401_Error) {
        res.status(401).json({ error: err.message });
    }
    else if (err instanceof Forbidden_403_Error) {
        res.status(403).json({ error: err.message });
    }
    else if (err instanceof NotFound_404_Error) {
        res.status(404).json({ error: err.message });
    }
    else {
        res.status(500).json({
            error: 'Internal Server Error',
        });
    }
};
