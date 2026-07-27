import express from "express"

const app= express()

const PORT = 5000

app.get("/", (req, res)=>{
    res.send("CreatorFlow API is running")
}) 

app.listen(PORT, ()=>{
    console.log(`Server running on port ${PORT}`);
    
});

