import { Op } from "sequelize";
import models from "../models/associations.js";

const index = async(req, res)=>{
    let {q} = req.query
    const searchQuery = q? {name: {[Op.like]: `%${q.replace(' ', '')}%`}} : {}
    try{
        const doctors =await models.User.findAll({
            where: {userType: 'doctor', ...searchQuery},
            include: {model: models.Profile},
            attributes: {exclude: ['password']}
        })
        res.status(200).json(doctors)
    }
    catch(err){
        res.status(500).json(err)
    }
    
}

export default {index}