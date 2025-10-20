import { BadRequest_400_Error, NotFound_404_Error, Unauthorized_401_Error, } from '../error-classes.js';
import { checkPassword, makeJWT, makeRefreshToken } from '../auth.js';
import { userExists } from '../db/queries/read-user.js';
import { configObj } from '../config.js';
const SECONDS_IN_HOUR = 60 * 60;
const SECONDS_IN_DAY = SECONDS_IN_HOUR * 24;
const NUMBER_OF_DAYS = 60;
export async function handlerUserLogin(req, res, next) {
    const nowInSeconds = Math.floor(Date.now() / 1000);
    const expClaim = {
        jwtExpiration: nowInSeconds + SECONDS_IN_HOUR,
        refershTokenExpiration: nowInSeconds + SECONDS_IN_DAY * NUMBER_OF_DAYS,
    };
    try {
        const parsedBody = req.body;
        if (!parsedBody || !Object.hasOwn(parsedBody, 'email')) {
            throw new BadRequest_400_Error('Invalid request body');
        }
        if (!parsedBody || !Object.hasOwn(parsedBody, 'password')) {
            throw new BadRequest_400_Error('Invalid request body');
        }
        const updatedObj = Object.assign(parsedBody, expClaim.jwtExpiration);
        const returnedUser = await userExists(updatedObj.email);
        if (!returnedUser) {
            throw new NotFound_404_Error('User not found');
        }
        const verified = await checkPassword(updatedObj.password, returnedUser.hashedPassword);
        const { hashedPassword: _omit, ...response } = returnedUser;
        if (verified) {
            const jwtToken = makeJWT(returnedUser.id, updatedObj, configObj.secret);
            const refreshToken = makeRefreshToken();
            const updatedResponse = { ...response, token: jwtToken, refreshToken: refreshToken };
            res.status(200).json(updatedResponse);
        }
        else {
            throw new Unauthorized_401_Error('Incorrect email or password');
        }
    }
    catch (error) {
        next(error);
    }
}
