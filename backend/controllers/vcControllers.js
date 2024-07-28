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
    try {
        const {role , email , password} = req.body
        const userExists = await vcUser.findOne({email , role})
        if(userExists){
            res.status(400).json({message: 'User already exists'})
        }

        const user = await vcUser.create({
            role: role.toLowerCase(), 
            email: email , 
            password: password,
        });

        if (user) {
            res.status(201).json({
            message: "User created successfully for Institute",
            user: {
                _id: user._id,
                email: user.email,
                role: user.role,
            },
            });
        } else {
            res.status(400).json({ message: "Invalid user data" });
        }
    } catch (error) {
        if (error.code === 11000) {
          return res.status(400).json({ message: "User already exists" });
        }
        res.status(500).json({ message: error.message });
      }
}

export {
    loginUser,
    registerUser
}