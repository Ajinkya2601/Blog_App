const express=require("express")
const multer=require("multer")
const path=require("path")
const Blog=require("../models/blog")
const router=express.Router();
const Comment=require("../models/comment")

const storage=multer.diskStorage({
    destination:function(req,file,cb){
       return cb(null,`./public/uploads`)
    },
    filename:function(req,file,cb){
        const unquieSuffix=`${Date.now()}-${file.originalname}`;
        return cb(null,unquieSuffix)
    }
})

const upload=multer({storage:storage})

router.get("/add-new",(req,res)=>{
   return res.render("addBlog",{
    user:req.user
   })
})

router.get("/:id",async(req,res)=>{
    const blog=await Blog.findById(req.params.id).populate('createdBy')
    const comments=await Comment.find({blogId:req.params.id}).populate('createdBy')
    return res.render("blog",{
      user:req.user,
      blog:blog,
      comments:comments,
    })
})

router.post("/add-new", upload.single("coverImage"), async (req, res) => {
   try {
       if (!req.file) {
           throw new Error('No file uploaded.');
       }
       const { title, body } = req.body;
       console.log(req.file.filename);
       const blog = await Blog.create({
           title: title,
           body: body,
           createdBy: req.user._id,
           coverImageURL:`/uploads/${req.file.filename}`,
       });
       return res.redirect(`/blog/${blog._id}`);
   } catch (error) {
       console.error(error);
       return res.status(500).send('Internal Server Error');
   }
});

router.post('/comment/:blogId', async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.blogId);
        console.log('Blog:', blog);

        const comment = await Comment.create({
            content: req.body.content,
            blogId: req.params.blogId,
            createdBy: req.user._id
        });

        console.log('Comment created:', comment);
        return res.redirect(`/blog/${req.params.blogId}`);
    } catch (error) {
        console.error('Error creating comment:', error);
        return res.status(500).send('Internal Server Error');
    }
});


 module.exports=router