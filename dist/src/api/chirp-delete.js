import { getBearerToken, validateJWT } from '../auth.js';
import { chirpDelete } from '../db/queries/delete-chirp.js';
import { getSingleChirp } from '../db/queries/read-single-chirp.js';
import { BadRequest_400_Error, Forbidden_403_Error, NotFound_404_Error, } from '../error-classes.js';
import { configObj } from '../config.js';
export async function handlerChirpDelete(req, res, next) {
    console.log('Entering Delete');
    try {
        const accessToken = getBearerToken(req);
        if (!accessToken) {
            throw new Forbidden_403_Error('Not authorized');
        }
        const decodedUserID = validateJWT(accessToken, configObj.jwt.secret);
        const chirpId = req.params.chirpId;
        if (!chirpId) {
            throw new BadRequest_400_Error('No chirp ID in params');
        }
        const singleChirp = await getSingleChirp(chirpId);
        if (!singleChirp) {
            throw new NotFound_404_Error('Chirp not found');
        }
        if (singleChirp.userId !== decodedUserID) {
            throw new Forbidden_403_Error('Chirp does not belong to the user');
        }
        await chirpDelete(chirpId, decodedUserID);
        res.sendStatus(204);
    }
    catch (error) {
        next(error);
    }
}
