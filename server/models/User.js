import { DataTypes } from "sequelize";
import db from "./database.js";
import models from "./associations.js";

const User = db.define(
    'User',
    {
        name: {
            type: DataTypes.STRING
        },
        email: {
            type: DataTypes.STRING,
            unique: true,
        },
        password: {
            type: DataTypes.STRING
        },
        userType: {
            type: DataTypes.ENUM('doctor', 'normal')
        },
        latitude: {
            type: DataTypes.FLOAT
        },
        longitude: {
            type: DataTypes.FLOAT
        }
    }
)

User.associate = (models)=>{
    User.hasOne(models.Profile)
}

export default User