import { User } from "../model/user.model";
import Joi from "joi";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import express from 'express'


const router = express.Router();

const handleLogin = async(req, res, next) => {


    try {

        //check for error
        const {error} = validate(req.body);
        if (error){
            return res.status(400).send({message: error.details[0].message});
    
        }
    
        //check if user exists 
        const user = await User.findOne({email: req.body.email})
        if(!user) {
            return res.status.apply(401).send({message: "invalid email or password"})
        }
    
        console.log("req.body password= " + req.body.password);
        console.log("user password= " + user.password);
        
        //check if password valid
        const validPassword = await bcrypt.compare(
            req.body.password,
            user.password
        );
        if(!validPassword){
            return res.status(401).send({message: "Invalid Email or Password"});
           
        }

        //create and sign JWT token with user.Name?
    
        const accessToken = jwt.sign(
            {email: user.email},
            process.env.ACCESS_TOKEN_SECRET,
            {expiresIn : '20h'}
        )
    
        //const token = user.generateAuthToken();
        res.status(200).send({ data: accessToken, message: "logged in successfully" });
    } catch (error) {
        res.send({message: error.message})
    }
    
    
   
}



const validate = (data) => {
    const schema = Joi.object({
      
      email:    Joi.string().email().required().label('Email'),
      password: Joi.string().required().label('Password'),
      userName: Joi.string().required().label("Username"),
    });
    return schema.validate(data);
  };


export {handleLogin}