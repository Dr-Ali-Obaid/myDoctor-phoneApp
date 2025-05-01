import { DataTypes } from "sequelize";
import db from "./database.js";

const Profile = db.define(
    'Profile',
    {
        phone: {
            type: DataTypes.STRING,
        },
        workingHours: {
            type: DataTypes.STRING,
        },
        address: {
            type: DataTypes.STRING,
        },
        specialization: {
            type: DataTypes.STRING,
        },
    }
)

Profile.associate = (models)=>{
    Profile.belongsTo(models.User)
}

export default Profile