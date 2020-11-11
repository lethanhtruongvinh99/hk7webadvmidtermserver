const jwt = require("jsonwebtoken");
const secret = process.env.JWT_SECRET;

export const authCheck = (req, res, next) => {
    if (req.headers.authorization){
        const token = req.headers.authorization;
        jwt.verify(token, secret, (err, decoded) => {
            if (err){
                res.status(401).send({message: "Hết Hạn/ Lỗi xác thực"}).end();
            }
            else {
                next;
            }
        })
    }
    else {
        res.status(401).send({message: "Hết Hạn/ Lỗi xác thực"}).end();
    }
}