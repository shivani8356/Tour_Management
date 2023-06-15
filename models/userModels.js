const mongoose = require ('mongoose')
const validator = require ('validator')
const bcrypt = require('bcryptjs')
const crypto = require('crypto')

const userSchema = mongoose.Schema({
    name : 
    {
        type : String,
        required : [true , "name is required"],
        unique : true,
    },
    email : 
    {
        type : String,
        validate : [validator.isEmail , "enter email"],
        required : true
    },
    password : 
    {
        type : String,
        minLength : [5,"minimum len is 5 chars"],
        required : [true , "enter password"],
        select : false
    },
    passwordConfirm : 
    {
        type : String,
        minLength :  [5,"minimum len is 5 chars"],
        required : [true , "re enter password"],
        validate : {
            //works only works for save and create
                validator : function(el){
                return el === this.password;
            },
            message : "passwords are not same"
        }
    },
    passwordChangedAt :
    {
        type : Date,
        select : true,
        // required : [true , "this field is mandatory"],
        default : Date.now
    } ,
    passwordResetToken : String,
    passwordResetTokenExpiresAt : Date
});

userSchema.pre('save' , async function(next){
    //works only when password is modified
    if(!this.isModified('password')) return next();
    this.password = bcrypt.hash(this.password , 12);//hash the password with cost of 12
    this.passwordConfirm = undefined; //deletes passwordConfirm field
    next();
})

userSchema.methods.correctPassword = async function(candidatePassword , userPassword){
    return await bcrypt.compare(candidatePassword , userPassword);
}

userSchema.methods.isPasswordChanged = async function(JWTTimeStamp){
    if(this.passwordChangedAt){
        const psdChangedTimeStamp = parseInt(this.passwordChangedAt.getTime() / 1000 , 10);
        console.log(psdChangedTimeStamp , JWTTimeStamp);
        return (JWTTimeStamp>psdChangedTimeStamp);
    }
    return false;
}

userSchema.methods.createPasswordResetToken = async function(){
    const resetToken = crypto.randomBytes(32).toString('hex');
    this.passwordResetToken  = crypto.createHash('sha256').update(resetToken).digest('hex');
    this.passwordResetTokenExpiresAt = Date.now() + 10 * 60 * 1000;
    console.log({resetToken} , this.passwordResetToken);
    return resetToken;
}
const User = mongoose.model('User' , userSchema);

module.exports = User;