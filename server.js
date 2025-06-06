const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const helmet = require('helmet'); 

const app = express();
app.use(express.json());

app.use(cookieParser())

app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            connectSrc: ["'self'", "http://localhost:5000"],
            imgSrc: ["'self'", "data:", "http://localhost:5000/uploads/"], 
        }
    }
}));


app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({extended:false}))


app.get("/",(req,res)=>{
    res.redirect("/home")
})
app.get("/print",(req,res)=>{
    res.render("print.ejs")
})
app.get("/documents",(req,res)=>{
    res.render("documents.ejs")
})
app.get("/home",(req,res)=>{
    res.render("search.ejs")
})
app.get("/login",(req,res)=>{
    res.render("login.ejs")
})
app.get("/upload",(req,res)=>{
    res.render("upload.ejs")
})
app.get("/search/work-section/:WSId",(req,res)=>{
    res.render("folder.ejs")
})
app.get("/search/:imgId",(req,res)=>{
    res.render("preview-image.ejs")
})
app.get("/hall",(req,res)=>{
    res.render("hall.ejs")
})
app.get("/adminDashBoard/",(req,res)=>{
    res.render("dashboardAdmin/dashboard.ejs")
})

app.get("/adminDashBoard/workSection",(req,res)=>{
    res.render("dashboardAdmin/workSection.ejs")
})
app.get("/adminDashBoard/hall",(req,res)=>{
    res.render("dashboardAdmin/halls.ejs")
})
app.get("/aboutUs",(req,res)=>{
    res.render("aboutUs.ejs")
})
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something went wrong!' });
});

const PORT = 7070;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));