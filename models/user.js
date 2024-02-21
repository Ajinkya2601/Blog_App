const mongoose=require('mongoose')
const {createHmac ,randomBytes}=require('crypto');
const { createTokenForUser } = require('../services/authentication');


const userSchema=new mongoose.Schema({
    fullName:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
        unique:true,
    },
    salt:{
        type:String, 
    },
    password:{
        type:String,
        required:true,     
    },
    profileImageURL:{
        type:String,
        default:"/public/anonymous.jpg"
    },
    role:{
        type:String,
        enum:['USER','ADMIN'],
        default:"USER"
    },
},{timestamps:true});

userSchema.pre("save",function(next){
    const user=this
    if(!user.isModified("password")) return;
    const salt=randomBytes(16).toString();
    const hashedPassword=createHmac('sha256',salt).update(user.password).digest("hex")
    this.salt=salt;
    this.password=hashedPassword
    next();
})

userSchema.static("matchPassword",async function (name,password){
    const user = await User.findOne({fullName:name})
    if (!user) throw new Error("user not found")
    const salt=user.salt
    const hashedPassword=user.password
    
    const userProvidedHash=createHmac("sha256",salt).update(password).digest("hex")
    if(hashedPassword===userProvidedHash){
        const token=createTokenForUser(user);
        return token
    }
    else{
        throw new Error("incorrect password")
    }
})

const User=mongoose.model('user',userSchema)

module.exports=User;