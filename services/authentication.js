const JWT=require("jsonwebtoken");
const secret="abcd"

function createTokenForUser(user){
    const payload={
        _id:user._id,
        fullName:user.fullName,
        profileImageURL:user.profileImageURL,
        role:user.role,
    };
    const token=JWT.sign(payload,secret)
    return token;
}

function validateToken(token){
    const payload=JWT.verify(token,secret)
    return payload;
}

module.exports={
    createTokenForUser,
    validateToken,
}