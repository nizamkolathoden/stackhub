const jwt = require('jsonwebtoken');

const client = require('./redis_init')

module.exports = {

    siginAdminAccessToken: (userId) => {

        try {
            return new Promise((resolve, reject) => {

                const payload = {
                    aud: userId
                }

                const secret = process.env.Admin_AcessToken_Secret;

                const options = {
                    issuer: "stackhubMasc",
                    expiresIn: '2h',
                }

                jwt.sign(payload, secret, options, (err, token) => {

                    if (err) {
                        reject({ message: 'Un Authrized User', code: 401 })
                    }

                    resolve(token);
                })
            })
        } catch (err) {
            console.error(err.message);
        }

    },

    verifyAdminAccessToken: (req, res, next) => {

        try {
            const authHeader = req.headers['authorization'];

        const secret = process.env.Admin_AcessToken_Secret;

        if (!authHeader) return res.status(401).json({ error: "Un Authrized User" });

        const bearerToken = authHeader.split(' ');

        const token = bearerToken[1];

        jwt.verify(token, secret, (err, payload) => {

            if (err) {

                const message = err.name = 'JsonWebTokenError' ? 'Un Authrized User' : err.message;

                return res.json({ error: message });
            }

            req.payload = payload;

            next();
        })
        } catch (err) {
            console.error(err.message)
        }
        
    },

    siginAdminRefreshToken: (userId) => {

        return new Promise((resolve, reject) => {
            const secret = process.env.Admin_RefreshToken_Secret;

            const payload = {
                aud: userId
            }

            const options = {
                issuer: "stackhubMasc",
                expiresIn: '30d',
            }

            jwt.sign(payload, secret, options, (err, token) => {

                if (err)
                    reject({ message: 'Un Authrized User', code: 401 })

                const key = userId.toString()

                client.SET(key, token, 'EX', 30 * 24 * 60 * 60, (err, reply) => {
                    if (err) {

                        console.log(err.message);

                        return res.status(500).json({ error: "Internal Server Error" });
                    }
                })

                resolve(token);
            })
        })
    },

    verifyAdminRefreshToken: (refreshToken) => {



        return new Promise((resolve, reject) => {

            const secret = process.env.Admin_RefreshToken_Secret

            jwt.verify(refreshToken, secret, (err, payload) => {

                const userId = payload.aud;
                if (err) {

                    console.log(err.message);
                    reject({ message: 'Un Authrized User', code: 401 });

                }
                client.GET(userId, (err, result) => {

                    if (err) {
                        console.log(err.message);
                        return res.status(500).json({ error: "Internal Server Error" })
                    }
                    if (result === refreshToken)
                        return resolve(userId)

                    reject({ message: "Un Autherized User", code: 401 })
                })





            })
        })

    },

    //user

    siginUserAccessToken: (userId) => {
        return new Promise((resolve, reject) => {

            const payload = {
                aud: userId
            }

            const secret = process.env.User_AcessToken_Secret;

            const options = {
                issuer: "stackhubMasc",
                expiresIn: '2h',
            }

            jwt.sign(payload, secret, options, (err, token) => {

                if (err) {
                    reject({ message: 'Un Authrized User', code: 401 })
                }

                resolve(token);
            })
        })
    },

    verifyUserAccessToken: (req, res, next) => {

        try {
            const authHeader = req.headers['authorization'];

        const secret = process.env.User_AcessToken_Secret;

        if (!authHeader) return res.status(401).json({ error: "Un Authrized User" });

        const bearerToken = authHeader.split(' ');

        const token = bearerToken[1];

        jwt.verify(token, secret, (err, payload) => {

            if (err) {

                const message = err.name = 'JsonWebTokenError' ? 'Un Authrized User' : err.message;

                return res.json({ error: message });
            }

            req.payload = payload;

            next();
        })
        } catch (err) {
            console.error(err.message)
        }

        
    },

    siginUserRefreshToken: (userId) => {

        return new Promise((resolve, reject) => {
            const secret = process.env.User_RefreshToken_Secret;

            const payload = {
                aud: userId
            }

            const options = {
                issuer: "stackhubMasc",
                expiresIn: '30d',
            }

            jwt.sign(payload, secret, options, (err, token) => {

                if (err)
                    reject({ message: 'Un Authrized User', code: 401 })

                const key = userId.toString()

                client.SET(key, token, 'EX', 30 * 24 * 60 * 60, (err, reply) => {
                    if (err) {

                        console.log(err.message);

                        return res.status(500).json({ error: "Internal Server Error" });
                    }
                })

                resolve(token);
            })
        })
    },

    verifyUserRefreshToken: (refreshToken) => {


            try{
        return new Promise((resolve, reject) => {

            const secret = process.env.User_RefreshToken_Secret

            jwt.verify(refreshToken, secret, (err, payload) => {

                const userId = payload.aud;
                if (err) {

                    console.log(err.message);
                    reject({ message: 'Un Authrized User', code: 401 });

                }
                client.GET(userId, (err, result) => {

                    if (err) {
                        console.log(err.message);
                        return res.status(500).json({ error: "Internal Server Error" })
                    }
                    if (result === refreshToken)
                        return resolve(userId)

                    reject({ message: "Un Autherized User", code: 401 })
                })





            })
        })
    }catch(err){
        
        console.error(err.message)
    }
    },


}