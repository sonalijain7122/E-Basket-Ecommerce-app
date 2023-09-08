import slugify from "slugify";
import CategoryModel from "../models/CategoryModel.js";

export const createCategoryController = async(req,res) =>{
try{
    const {name} = req.body
    if(!name){
        return res.status(401).send({message:'Name is required'})
    }
    const existingCategory = await CategoryModel.findOne({name})
    if(existingCategory){
        return res.status(200).send({
            success:true,
            message:'Category Already Exists'
        })
    }

    const category = await new CategoryModel({name,slug:slugify(name)}).save()
    res.status(201).send({
        success:true,
        message:'New Category Created',
        category
    })

} catch(error){
    
    res.status(500).send({
        success:false,
        error,
        message:'Error in Category'
    })
}


};

//update CategoryController

export const updateCategoryController = async(req,res) =>{
try {
    const {name}  = req.body
    const {id} = req.params
const category = await CategoryModel.findByIdAndUpdate(id,{name,slug:slugify(name)},{new:true})
res.status(200).send({
success:true,
message: "Category updated successfully",
category
})

} catch (error) {
  
    res.status(500).send({
        success:false,
        error,
        message:'Error while updating category'
    })
}
};


// category controller
export const categoryController = async(req,res)=>{
try {
    const category = await CategoryModel.find({});
    res.status(200).send({
        success:true,
        message:"All categories List",
        category
    });
} catch (error) {
    
    res.status(500).send({
        success:false,
        error,
        message:'Error while getting all categories'
    })
}
};


// single category 
export const singleCategoryController = async(req,res)=>{
try {
    const category = await CategoryModel.findOne({slug:req.params.slug})
    res.status(200).send({
        success:true,
        message:'Single category',
        category
    })
} catch (error) {
   
    res.status(500).send({
        success:false,
        error,
        message:'Error while getting single categories'
    })
}
}


// delete category
export const deleteCategoryController = async(req,res)=>{
try {
    const {id} = req.params;
    await CategoryModel.findByIdAndDelete(id);
    res.status(200).send({
        success:true,
        message:"category deleted successfully"
    });
} catch (error) {
   
    res.status(500).send({
        success:false,
        error,
        message:'error while deleting single categories'
    })
}
}