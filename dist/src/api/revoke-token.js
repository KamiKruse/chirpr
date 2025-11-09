import { getUserToRevokeRefreshToken } from '../db/queries/update-refresh-token-to-revoke.js';
import { getBearerToken } from '../auth.js';
export async function handlerRevokeToken(req, res) {
    const refreshToken = getBearerToken(req);
    await getUserToRevokeRefreshToken(refreshToken);
    res.status(204).send();
}
