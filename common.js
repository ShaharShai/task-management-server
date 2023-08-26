const jwt = require('jsonwebtoken');

const verifyToken = async (req, res, next) => {
    if(req.headers.authorization){
        let token = req.headers.authorization;
        if(token){
            const payload = await jwt.verify(token, '483495483jkfgju8jfklgfhghs')
            console.log(payload)
            next();
        }
        else{
            return res.status(401).send("Authorization error")
        }
    }
    else{
        return res.status(401).send("Authorization error")
    }
}

module.exports = {verifyToken}