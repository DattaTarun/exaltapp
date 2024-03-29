

const stripe = require('stripe')('sk_test_51NTiVHSBfN5I5yfEtBUGiXYa6e6oHQGCMxnIaiG6ndMvDikZE2MLpb0WINdq8qzarzhkhGS386XO2tztgR4IKcJT008BDG9hal');
'use strict';
/**
 * order controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController("api::order.order",({strapi})=>({
    async create(ctx){
        const {products}=ctx.request.body;
        const lineitems=await Promise.all(
            products.map(async (product)=>{const item = await strapi.service("api::product.product").findOne(product.id)
            return{
                price_data:{
                    currency:"usd",
                    product_data:{
                        name:item.title,
                    },
                    unit_amount:item.price*100
                },
                quantity:product.quantity
            }
        })
        )
        try{ 
            const session=await stripe.checkout.sessions.create({
                mode:"payment",
                success_url:process.env.CLIENT_URL+"?success=true",
                cancel_url:process.env.CLIENT_URL+"?success=false",
                line_items:lineitems,
                shipping_address_collection:{allowed_countries:["US","CA"]}, 
                payment_method_types:["card"],
            })

            await strapi.service("api::order.order").create({data:{
                products, 
                stripeId:session.id,
            }})
            return{
                stripeSession:session
            }
        }
        catch(err){
            ctx.response.status=500
            console.log(err)
        }
    }
}));
