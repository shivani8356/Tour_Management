const User = require ('./../models/userModels')
const jwt = require('jsonwebtoken');

const signToken = (id)=>{return jwt.sign ({id} , process.env.JWT_SECRETKEY , {
    expiresIn : process.env.JWT_EXPIRYDATE
})}

exports.signup = async (req,res)=>{
    try {
        const {name , email , password , passwordConfirm} = req.body;
        const newUser = await User.create({
            name ,
            email,
            password,
            passwordConfirm
        });
        console.log(newUser)
        const token = (signToken(newUser._id))
        res.status(200).json({
            status : "success",
            token,
            data : 
            {
                newUser
            }
        })
    } catch (error) {
        res.status(400).json({
            status : "fail",
            message : error
        })
    }
}

exports.login = async (req,res)=>{
    const {email , password} = req.body;
    //if email or password is not entered
    if(!email || !password){
        return res.status(400).json({
            status : "fail",
            message : "please enter email or password"
        })
    }
    //to check if user is existing or not
    const user = await User.findOne({email}).select("+password");
    // console.log(user);
   
    if(!user || !await user.correctPassword(password , user.password)){
        return res.status(400).json({
            status : "fail",
            message : "incorrect password or email"
        })
    }
    const token = (signToken(user._id));
    res.status(200).json({
    status : "success",
    token
});
}
