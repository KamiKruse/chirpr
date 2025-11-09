import { Unauthorized_401_Error, } from '../error-classes.js';
import { getUserFromRefreshToken } from '../db/queries/read-user-from-refresh-token.js';
import { getBearerToken, makeJWT } from '../auth.js';
import { configObj } from '../config.js';
export async function handlerRefreshToken(req, res) {
    const refreshToken = getBearerToken(req);
    const result = await getUserFromRefreshToken(refreshToken);
    if (!result) {
        throw new Unauthorized_401_Error('Invalid Refresh Token');
    }
    const user = result.user;
    const accessToken = makeJWT(user.id, configObj.jwt.defaultDuration, configObj.jwt.secret);
    res.status(200).json({ token: accessToken });
}
