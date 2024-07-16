import vcUser from "../models/vcSchema.js";
import bcrypt from "bcryptjs";

const loginUser = async (req , res) => {
    const { email , password, role } = req.body;
    const user = await vcUser.findOne({email})

    if(user && await user.matchPasswords(password) && user.role.toLowerCase() === role.toLowerCase()){
        res.status(200).json({message : "Login Successful for VC" , user : user})
    }else {
        res.status(401).json({message: 'No use found'})
    }
}

const registerUser = async (req , res) => {
    const {role , email , password} = req.body
    const userExists = await vcUser.findOne({email , role})

    // if(role.toLowerCase() !== 'user' || role.toLowerCase() !== 'admin'){
    //     res.status(400).json({message : "Invalid Role" , role : role})
    // }

    if(userExists){
        res.status(400).json({message: 'user already exists'})
    }

    const user = await vcUser.create({
        role , 
        email , 
        password
    })

    if(user) {
        res.status(201).json({
            message: 'User created successfully for VC',
            _id: user._id,
            name: user.name,
            email: user.email,
        })
    }
    else {
        res.status(400).json({message: 'Invalid data'})
    }
}

export {
    loginUser,
    registerUser
}