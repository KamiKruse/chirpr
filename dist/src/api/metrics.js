import { configObj } from '../config.js';
export const handlerMetricReadout = (_, res) => {
    res.set({
        'Content-Type': 'text/html',
        charset: 'utf-8',
    });
    res.send(`<html>
  <body>
    <h1>Welcome, Chirpy Admin</h1>
    <p>Chirpy has been visited ${configObj.api.fileserverHits} times!</p>
  </body>
</html>`);
};
