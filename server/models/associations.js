import Profile from "./Profile.js";
import User from "./User.js";

const models = {
    User: User,
    Profile: Profile
}

Object.keys(models).forEach(key=>{
    if('associate' in models[key]){
        models[key].associate(models)
    }
})

export default models