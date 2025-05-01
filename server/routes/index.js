import express from 'express'
import userController from '../controllers/userController.js'
import { validationRules, validate } from '../middlewares/validator.js';
import isLoggedIn from '../middlewares/auth.js';
import doctorController from '../controllers/doctorController.js';

const router = express.Router();

router.get('/', (req, res)=>{
    res.json({message: 'hi world'})
})

// user routers
router.post('/account/signup',validationRules(), validate, userController.register)
router.post('/account/login', userController.login)
router.get('/account/me', isLoggedIn, userController.me)
router.get('/account/profile', isLoggedIn, userController.getUser)
router.get('/doctors', doctorController.index)
router.put('/update',isLoggedIn,  userController.updateUser)
router.delete('/delete', isLoggedIn, userController.deleteUser)

export default router