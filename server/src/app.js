const express = require('express');

const app = express()

app.use((res, res)=>{
    res.send('Hello World')
})

app.listen(3000, ()=>{
    console.log('Server is running on port 3000')
})