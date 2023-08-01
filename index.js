const db=require("./config/connection");
db.query("SELECT * FROM department",(err,data)=>{
    if(err)throw err;
    console.log(data);
})