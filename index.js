const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const Chat = require("./models/chat.js");
const methodOverride = require("method-override");
const ExpressError = require("./ExpressError.js");


app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

main().then(() => {
    console.log("connection successful");
})
    .catch((err) => console.log(err));

async function main() {
    await mongoose.connect("mongodb://127.0.0.1:27017/fakewhatsapp");
}

//Index Route
app.get("/chats", asyncWrap(async (req, res, next) => {
    
        let chats = await Chat.find();
        // console.log(chats);
        res.render("index.ejs", { chats });
    
    

}));
//new Route

app.get("/chats/new", (req, res) => {
    // throw new ExpressError(404, "Page not found");
    res.render("new.ejs")
})

//Create Route
app.post("/chats", asyncWrap(async (req, res, next) => {
   
        let { from, to, msg } = req.body;
        let newChat = new Chat({
            from: from,
            to: to,
            msg: msg,
            created_at: new Date()
        });
            await newChat.save()  //javascript automatically know by then that it is promise


        res.redirect("/chats");
        
        
   
}));

function asyncWrap(fn) {
    return function( req, res, next) {
        fn(req, res, next).catch((err)=>next(err));
    }
}

//New-show Route
app.get("/chats/:id", asyncWrap(async (req, res, next) => {
    
        let { id } = req.params;
        let chat = await Chat.findById(id);
        if (!chat) {
            next(new ExpressError(404, "Chat not found"));

        }
        res.render("edit.ejs", { chat });
    
    }));

//edit route
app.get("/chats/:id/edit", asyncWrap(async (req, res,next) => {
    
        let { id } = req.params;
        let chat = await Chat.findById(id);
        res.render("edit.ejs", { chat });
    
    
    
}));
    
//Update Route
app.put("/chats/:id", asyncWrap(async (req, res,next) => { 
    
        let { id } = req.params;
        let { msg: newMsg } = req.body;
        let updatedChat = await Chat.findByIdAndUpdate(id, { msg: newMsg },
            { runValidators: true, new: true });
        console.log(updatedChat);
        res.redirect("/chats");
    
    
}));

//Delete Route
app.delete("/chats/:id", asyncWrap(async (req, res, next) => {
    
        let { id } = req.params;
        let deleteChat = await Chat.findByIdAndDelete(id);
        console.log(deleteChat);
        res.redirect("/chats");
    
    
}));

app.get("/", (req, res) => {
    res.send("root is Working");
});

const handleValidationErr= (err)=>{
    console.log("This was a Validation Error PLease follow rules");
    console.dir(err.message);
}

app.use((err, req, res, next)=>{
    console.log(err.name);
    
    if(err.name=="ValidationError"){
        err= handleValidationErr(err);
    }
    next(err);
});

//Error handling Middleware
app.use((err, req, res, next) => {
    let { status = 500, message = "Some error occured" } = err;
    res.status(status).send(message);
})

app.listen(8080, () => {
    console.log("port connected successfully through port:8080");
})