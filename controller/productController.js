import slugify from 'slugify';
import productModel from '../models/productModel.js';
import CategoryModel from '../models/CategoryModel.js';
import OrderModel from '../models/OrderModel.js';
import fs from 'fs';
import braintree from 'braintree';
import dotenv from 'dotenv';

dotenv.config();

// payment gateway
var gateway = new braintree.BraintreeGateway({
    environment: braintree.Environment.Sandbox,
    merchantId: process.env.BRAINTREE_MERCHANT_ID,
    publicKey: process.env.BRAINTREE_PUBLIC_ID,
    privateKey: process.env.BRAINTREE_PRIVATE_KEY,
  });

export const createProductController = async(req,res) =>{
try {
    const{name,description,price,category,quantity} = req.fields
    const {photo} = req.files

   // validation
   switch(true){
    case !name:
        return res.status(500).send({error:'Name is required'})
    case !description:
     return res.status(500).send({error:'Description is required'})
     case !price:
      return res.status(500).send({error:'Price is required'})    
      case !category:
        return res.status(500).send({error:'Category is required'})
        case !quantity:
            return res.status(500).send({error:'Quantity is required'})
            case photo && photo.size > 1000000:
                return res.status(500).send({error:'Photo is required and less than 1mb'})
   }

    const products = new productModel({...req.fields,slug:slugify(name)})
    if(photo){
        products.photo.data = fs.readFileSync(photo.path);
        products.photo.contentType = photo.type;
    }
    await products.save();
    res.status(201).send({
        success:true,
        message:"Product created successfully",
        products,
    })
} catch (error) {
   
    res.status(500).send({
        success:false,
        error,
        message:'Error in creating product'
    })
}

};


// get all products
export const getProductController = async(req,res) => {
try {
    const products = await productModel.find({}).populate('category').select("-photo").limit(12).sort({createdAt:-1})
    res.status(200).send({

        success:true,
        TotalProducts: products.length,
        message:'All Products',
        products,
        
    })
} catch (error) {
   
    res.status(500).send({
        success:false,
        error,
        message:'Error in getting products'

    })
}};

// get single product
export const getSingleProductController = async(req,res) =>{
try {
    const product = await productModel.findOne({slug:req.params.slug}).select("-photo").populate('category')
     res.status(200).send({
        success:true,
        message:'Single product fetched',
        product
     })

} catch (error) {
   
    res.status(500).send({
        success:false,
        error,
        message:'Error in getting single product'

    })
}

};

// get photo
export const productPhotoController = async(req,res) => {
try {
    const product = await productModel.findById(req.params.pid).select("photo")
    if(product.photo.data){
        res.set('Content-type',product.photo.contentType);
        return res.status(200).send(product.photo.data);
    }
} catch (error) {
   
    res.status(500).send({
        success:false,
        error,
        message:'Error while getting photo'

    })
}
};

// delete product
export const deleteProductController = async(req,res) => {
try {
    await productModel.findByIdAndDelete(req.params.pid).select("-photo")
    res.status(200).send({
        success:true,
        message:'Product deleted successfully'
    })

} catch (error) {
   
    res.status(500).send({
        success:false,
        error,
        message:'Error in deleting product'
    })
}
};

// update product
export const updateProductController = async(req,res) => {

    try {
        const{name,description,price,category,quantity,shipping} = req.fields;
        const {photo} = req.files;
    
       // validation
       switch(true){
        case !name:
            return res.status(500).send({error:'Name is required'})
        case !description:
         return res.status(500).send({error:'Description is required'})
         case !price:
          return res.status(500).send({error:'Price is required'})    
          case !category:
            return res.status(500).send({error:'Category is required'})
            case !quantity:
                return res.status(500).send({error:'Quantity is required'})
                case photo && photo.size > 1000000:
                    return res.status(500).send({error:'Photo is required and less than 1mb'})
       }
    
        const products = await productModel.findByIdAndUpdate(req.params.pid,{...req.fields,slug:slugify(name)}
        ,{new:true});
        if(photo){
            products.photo.data = fs.readFileSync(photo.path);
            products.photo.contentType = photo.type;
        }
        await products.save();
        res.status(201).send({
            success:true,
            message:"Product updated successfully",
            products,
        })
    } catch (error) {
       
        res.status(500).send({
            success:false,
            error,
            message:'Error in updating product'
        })
    }

 };

// filters
export  const productFiltersController = async(req,res) => {
try {
    const {checked,radio} = req.body
    let args = {};
    if(checked.length > 0) args.category = checked;
    if(radio.length) args.price = { $gte: radio[0], $lte: radio[1]};
    const products = await productModel.find(args);
    res.status(200).send({
        success:true,
        products,
    });

} catch (error) {
   
    res.status(400).send({
        success:false,
        message:'Error while Filtering Products',
        error
    })
}
};

// product count
 export const productCountCotroller = async(req,res) =>{
try {
    const total = await productModel.find({}).estimatedDocumentCount()
    res.status(200).send({
        success:true,
        total,
    });
} catch (error) {
   
    res.status(400).send({
        message:'Error in product count',
        error,
        success:false
    })
}

 };


 //product per page
 export const productListController = async(req,res) => {
try {
    const perPage = 5
    const page = req.params.page ? req.params.page : 1
    const products = await productModel.find({}).select("-photo").skip((page-1)*perPage).limit(perPage).sort({createdAt: -1});

    res.status(200).send({
        success:true,
        products,
    })

} catch (error) {
   
    res.status(400).send({
        success:false,
        message:'Error in per page ctrl',
        error,
    })
}
 };


 // search product controller
 export const searchProductController = async(req,res) => {
    try {
        const {keyword} = req.params
        const results = await productModel.find({
            $or:[
                {name:{$regex: keyword, $options:"i"}},
                {description:{$regex: keyword, $options:"i"}},
            ]
        }).select("-photo");
        res.json(results); 
    } catch (error) {
      
        res.status(400).send({
            success:false,
            message:'error in search Product API',
            error
        })
    }
 }


 // related product controller
  export const relatedProductController = async(req,res) => {
try {
    const {pid,cid} = req.params;
    const products = await productModel.find({
        category: cid,
        _id: { $ne : pid},
    })
    .select("-photo")
    .limit(3)
    .populate("category");
    res.status(200).send({
        success:true,
        products
    })
} catch (error) {
    
    res.status(400).send({
        success:false,
        message:'Error while getting related product',
        error
    })
}
  };


  export const productCategoryController = async(req,res) => {
try {
    const category = await CategoryModel.findOne({slug:req.params.slug})
    const products = await productModel.find({category}).populate('category')
    res.status(200).send({
        success:true,
        category,
        products,
    })
} catch (error) {
  
    res.status(400).send({
        success:false,
        message:'Error while getting product',
        error
    })
}
  };


  // Payment gateway API
  // token
  export const braintreeTokenController = async(req,res) => {
 try {
    gateway.clientToken.generate({} , function (err , response){
        if(err){
            res.status(500).send(err);
        }else{
            res.send(response);
        }
    });
} catch (error) {
    console.log(error)
}
  };

  
//payment
  export const braintreePaymentsController = async(req,res) => {

    try {
        const {cart,nonce} = req.body;
        let total =0;
        cart.map((i) => {
            total += i.price;
        });
       let newTransaction = gateway.transaction.sale({
        amount:total,
        paymentMethodNonce:nonce,
        options:{
            submitForSettlement:true
        }
       },
       function(error,result){
        if(result){
         const order = new OrderModel({
            products: cart,
            payment: result,
            buyer: req.user._id
         }).save()
         res.json({ok:true})
        }else{
            res.status(500).send(error)
        }
       }
       
       )

    } catch (error) {
        console.log(error)
    }
  };


