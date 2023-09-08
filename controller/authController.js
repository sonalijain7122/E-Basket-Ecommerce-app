import userModel from "../models/userModel.js";
import orderModel from "../models/OrderModel.js";
import { comparePassword, hashPassword } from "../helpers/authHelpers.js";
import JWT from "jsonwebtoken";


// post register
export const registerController = async( req,res) => {
try{
    const {name,email,password,phone,address,answer} = req.body
    if(!name){
        return res.send({message:'Name is Requied'})
    }
    if(!email){
        return res.send({message:'email is Requied'})
    }
    if(!password){
        return res.send({message:'password is Requied'})
    }
    if(!phone){
        return res.send({message:'phone is Requied'})
    }
    if(!address){
        return res.send({message:'address is Requied'})
    }
    if(!answer){
        return res.send({message:'answer is Requied'})
    }


   
  // check user
  const existinguser = await userModel.findOne({email})
  //existing user
  if(existinguser){
    return res.status(200).send({
        success:false,
        message:'Already Register please login',
    })
  }
      // register user
      const hashedPassword = await hashPassword(password)
      //save
      const user = await new userModel({name,email,phone,address,password:hashedPassword,answer}).save()

      res.status(201).send({
        success:true,
        message:"User Register successfully",
        user,
      })


}
catch(error){
  
    res.status(500).send({
        success:false,
        message:'Error in registraion',
        error
    })
}


};


//post login
 export const loginController = async(req,res) => {
try{
const{email,password} = req.body
//validation
if(!email || !password){
    return res.status(404).send({
        success:false,
        message:'Invald email or password'
    })
}
// check user
const user = await userModel.findOne({email})
if(!user){
    return res.status(404).send({
        success:false,
        message:'Email is not registerd'
    })
}
const match = await comparePassword(password,user.password)
if(!match){
    return res.status(200).send({
        success:false,
        message:'Invalid Password'
    })
}
//token
const token = await JWT.sign({_id: user._id}, process.env.JWT_SECRET,{expiresIn:"7d",});

res.status(200).send({
    success:true,
    message:"login successfully",
    user: {
        _id:user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        role: user.role,
    },
    token,
});

}catch(error){
    
    res.status(500).send({
        success:false,
        message:'login failed',
        error
    })
}

 };

 
// forgot password

 export const forgotPasswordController = async(req,res)=>{

    try{
const{email,answer, newPassword} = req.body;
if(!email){
    res.status(400).send({message:'Email is required'})
}
if(!answer){
    res.status(400).send({message:'Nick Name is required'})
}
if(!newPassword){
    res.status(400).send({message:'New Password is required'})
}
//check
const user = await userModel.findOne({email,answer});
//validation
if(!user){
    return res.status(404).send({
        success: false,
        message:"Wrong Email or Answer"
    });
}

const hashed = await hashPassword(newPassword);
 await userModel.findByIdAndUpdate(user._id,{password:hashed});
res.status(200).send({
   success:true,
   message:"Your Password Reset Successfully", 
   
});

}
catch(error){
console.log(error);
res.status(500).send({
    success:false,
    message:'Someting is wrong',
    error,
});
}
 };


 //test controller

 export const testController =(req,res)=>{
    try{
        res.send('route protected');
    }
    catch(error){
       
        res.send({error});
 }
 }

 // update profile 
  export const updateProfileController = async (req,res) => {

    try {
        const {name,email,password,address,phone} = req.body
        const user = await userModel.findById(req.user._id)
         // password
         if(password && password.length < 4){
            return res.json({error:'Password is Reqiured and atleast 4 character long'})
         }
          const hashedPassword = password ? await hashPassword(password) : undefined;
         const updatedUser = await userModel.findByIdAndUpdate(req.user._id,{
               name:name || user.name,
               password: hashedPassword || user.password,
               phone:phone || user.phone,
               address:address || user.address,

         },{new:true})
        res.status(200).send({
            success:true,
            message:'Profile Updated Successfully',
            updatedUser

        })
    } catch (error) { 
        
        res.status(400).send({
            success:false,
            message:'Error while updating profile',
            error
        })
    }
  };

  // Orders
  export const getOrdersController = async(req,res) => {
try {
    const orders = await orderModel.find({buyer: req.user._id}).populate("products","-photo")
    .populate("buyer","name");
    res.json(orders);
} catch (error) {
    
    res.status(500).send({
        success:false,
        message:'Error while getting Orders',
        error
    })
}

  };


  // All Orders
  export const getAllOrdersController = async(req,res) => {
try {
    const orders = await orderModel.find({}).populate("products","-photo")
    .populate("buyer","name").sort({createdAt: "-1"});
    res.json(orders);
} catch (error) {
    
    res.status(500).send({
        success:false,
        message:'Error while getting Orders',
        error
    })
}

  };


  // order status
  export const orderStatusController = async(req,res) => {
try {
    const {orderId } = req.params
    const {status } = req.body
const orders = await orderModel.findByIdAndUpdate(orderId,{status},{new:true})
res.json(orders);


} catch (error) {
   
    res.status(500).send({
        success:false,
        message:'Error while Updating Orders',
        error
    })
}

  };