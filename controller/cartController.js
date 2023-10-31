const cartDb = require("../models/cartModel")
const userDb = require("../models/userModel")
const productDb = require("../models/productModel")
const { ObjectId } = require('mongoose').Types;


const addToCart = async (req, res) => {
    try {
        if (req.session.user_id) {
            const productId = req.body.id;
            const name = req.session.user_id;
            const userData = await userDb.findOne({ _id: name });
            const userId = userData._id;
            const productData = await productDb.findById(productId);

            const userCart = await cartDb.findOne({ user: userId });

            if (userCart) {
                const productExist = await userCart.products.findIndex(product => product.productId == productId)

                // console.log(productExist);

                if (productExist != -1) {
                    const cartData = await cartDb.findOne({ user: userId, "products.productId": productId },
                        { "products.productId.$": 1, "products.quantity": 1 })

                    const [{ quantity: quantity }] = cartData.products

                    if (productData.quantity <= quantity) {
                        res.json({ outofstock: true })
                    } else {
                        await cartDb.findOneAndUpdate({ user: userId, "products.productId": productId },
                            { $inc: { "products.$.quantity": 1 } })
                    }

                } else {
                    await cartDb.findOneAndUpdate({ user: userId }, { $push: { products: { productId: productId, price: productData.price } } });
                }


            } else {
                const data = new cartDb({
                    user: userId,
                    products: [{ productId: productId, price: productData.price }]
                });
                const result = await data.save();
            }
            res.json({ success: true });
        } else {
            res.json({ loginRequired: true });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'An error occurred' });
    }
};

    const loadCart = async(req,res)=>{
        try{

            const name = req.session.user_id

            const userData = await userDb.findById({_id:name})
            
            const userId = userData._id
            
            const cartData = await cartDb.findOne({user:userId}).populate("products.productId")
            if (req.session.user_id) {
                if(cartData){
                    let Total;
                    if(cartData.products != 0){
                        const total = await cartDb.aggregate([
                            {
                                $match :{user : new ObjectId(userId)}
                            },
                            {
                                $unwind : '$products'
                            },
                            {
                                $project :{
                                    price :  '$products.price',
                                    quantity : '$products.quantity'
                                }
                            },
                            {
                                $group :{
                                    _id : null,
                                    total : {
                                        $sum :  {
                                            $multiply : ["$quantity","$price"]
                                        }
                                    }
                                }
                            }
                        ])
                        Total = total[0].total

                        console.log(Total);

        
                       
                        res.render('cart', { user: req.session.user_id, cart: cartData.products, userId: userId, total: Total ,user:userData });
                    }else{
                        res.render('cart', { user: req.session.user_id,  cart: [],total:0 });
                    }
                }else {
                    res.render('cart', { user: req.session.user, cart: [] ,total: 0  });
                } 
            } else {
                res.render('cart', { message: "User Logged", cart: [] ,total: 0 });
            }

        

        }catch(error){
            console.log(error);
        }
    }

    const cartQuantity = async(req,res)=>{
        try{
            
            const userId = req.body.user
            const productId = req.body.product
            const count = parseInt(req.body.count)

            const cartData = await cartDb.findOne({user:new ObjectId(userId),"products.productId":new ObjectId(productId)},{"products.productId.$":1 , "products.quantity":1})
            console.log(cartData);

            const [{quantity:quantity}] = cartData.products

            const stockAvailale = await productDb.findById({_id:new ObjectId(productId)})
            console.log("stockAvailale",stockAvailale.quantity);
            
            if(stockAvailale.quantity < quantity + count){
                res.json({changeSuccess:true})
                return;
            }else{
                await cartDb.updateOne(
                    {user:userId, "products.productId" : productId},
                    {$inc : {"products.$.quantity" : count}})
                    res.json({changeSuccess:true})
            }

        }catch(error){
            console.log(error);
        }
    }


    const removeProduct=async (req,res)=>{
        try {
            
              const productId=req.body.product
                
              const user=req.session.user_id
              const userId=user._id
    
                 const cartData=await cartDb.findOneAndUpdate({"products.productId":productId},
                    {
                        $pull:{products:{productId:productId}}
                    }
                 )
                 res.json({success:true})
    
        } catch (error) {
            console.log(error);
        }
    }





module.exports={
    addToCart,
    loadCart ,
    cartQuantity,
    removeProduct
}