import express from 'express';
import 'dotenv/config'
import morgan from 'morgan';
import cors from 'cors';
import router from './routes/index.js';
import db from './models/database.js';
import models from './models/associations.js';



const app = express();
const port = process.env.PORT
app.use(morgan('dev'))
app.use(cors())
app.use(express.urlencoded({extended: false}))
app.use(express.json())

app.use('/', router)

// إنشاء رسالة الخطأ ثم تمريرها كبرمجية وسيطة
app.use((req, res, next)=>{
    const err = new Error("Page Not Found")
    err.status = 404
    next(err)
})
// بعد تمرير رسالة الخطأ من خلال نكست سيتم تلقيها والتعامل معها ومع غيرها
// وإظهارها في كائن الاستجابة 
app.use((err, req, res, next)=>{
    res.status(err.status || 500)
    res.json({error: err.message})
})


db.sync().then(()=> {
    app.listen(port, ()=>{
        console.log('express is running at port ' + port)
    })
    
})
