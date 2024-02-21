const express=require("express")
const User=require('../models/user')
const router=express.Router();

router.get('/signin',(req,res)=>{
    return res.render("signin")
})

router.get('/signup',(req,res)=>{
    return res.render("signup")
})


router.post("/signup",async (req,res)=>{
    console.log(req.body)
    const body=req.body
    await User.create({
       fullName:body.fullName,
       email:body.email,
       password:body.password,
    })
    return res.redirect("/")
})

router.post("/signin",async (req,res)=>{
try {
    const body=req.body;
    const token=await User.matchPassword(body.fullName,body.password)
    res.cookie('token',token)
    return res.redirect("/")
} catch (error) {
    return res.render("signin",{
        error:"inncorrect password"
    })
  }
})

router.get("/logout",(req,res)=>{
    res.clearCookie("token")
    res.redirect("/")
})

module.exports=router