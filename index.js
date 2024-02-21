const express=require("express")
const path=require('path')
const userRoute=require("./routes/user")
const blogRoute=require("./routes/blog")
const mongoose=require('mongoose')
const User=require('./models/user')
const CookieParser = require("cookie-parser")
const Blog=require('./models/blog')
const Comment=require('./models/comment')
const { checkForAuthentication } = require("./middlewares/authentication")

const app=express()
const port=8000

mongoose.connect("mongodb://localhost:27017/blogify")
.then(()=>{console.log("mongodb connected")})

app.set('view engine','ejs')
app.set('views',path.resolve("./views"))

app.use(express.urlencoded({extended:false}))
app.use(CookieParser())
app.use(checkForAuthentication("token"))
app.use(express.static("public"))

app.get('/',async (req,res)=>{
    const allBlogs=await Blog.find({}).sort("createdAt")
    return res.render("home",{
        user:req.user,
        blogs:allBlogs,
    })
})

app.use('/user',userRoute)
app.use("/blog",blogRoute)

app.listen(port,()=>console.log(`server started at ${port}`))

