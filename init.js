const mongoose= require("mongoose");
const Chat= require("./models/chat.js");

main().then(()=>{
    console.log("connection successful");
})
.catch((err)=>console.log(err));

async function main(){
    await mongoose.connect("mongodb://127.0.0.1:27017/fakewhatsapp");
}

let allChats= [
    {
        from: "neha",
        to: "priya",
        msg: "Send me your exam sheets",
        created_at: new Date(),   
    },
    {
        from: "Rohit",
        to: "Mohit",
        msg: "Send me notes of exam",
        created_at: new Date(),
    },
    {
        from: "Aman",
        to: "Amit",
        msg: "Cook the food fast",
        created_at: new Date(),   
    },
    {
        from: "Prince",
        to: "Manu",
        msg: "Send me pic of yours",
        created_at: new Date(),
    },
    {
        from: "virat",
        to: "Rohit",
        msg: "Congrats for century",
        created_at: new Date(),   
    },
    {
        from: "Shami",
        to: "Jadega",
        msg: "Take the Catch!!",
        created_at: new Date(),
    }
]
Chat.insertMany(allChats);
// Chat.deleteMany().then((res)=>{
//     console.log(res);
// });
 
