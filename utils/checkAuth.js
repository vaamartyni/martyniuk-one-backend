import jwt from 'jsonwebtoken';

export default (req, res, next) => {
    const token = (req.headers.authorization || '').replace(/Bearer\s?/,'');
    if (token){
        try {
            const encryptedJwt = jwt.verify(token, 'secret');
            req.userId = encryptedJwt._id;
            next();
        } catch (e) {
            return res.status(403).json({
                message: "an error occurred while trying to authorize user"
            });
        }
    } else {
        return res.status(401).json({
            message: "unauthorized request"
        });
    }
}