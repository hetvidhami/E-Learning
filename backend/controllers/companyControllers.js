import companyUser from "../models/companySchema.js";
import bcrypt from 'bcryptjs'

const loginUser = async (req , res) => {
    const { email , password, role } = req.body;
    const user = await companyUser.findOne({email})

    if(user && await user.matchPasswords(password) && user.role.toLowerCase() === role.toLowerCase()){
        res.status(200).json({message : "Login Successful for Company" , user : user})
    }else {
        res.status(401).json({message: 'NO user found'})
    }
}

const registerUser = async (req , res) => {
    const {role , email , password} = req.body
    const userExists = await companyUser.findOne({email , role})

    if(userExists){
        res.status(400).json({message : 'user already exists'})
    }

    const user = await companyUser.create({
        role , 
        email , 
        password
    })

    if(user) {
        res.status(201).json({
            message : 'User created successfully for Company',
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