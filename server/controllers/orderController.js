import Order from "../models/Order.js"
import Product from "../models/Product.js"
import stripe from "stripe"
import User from "../models/User.js"

// Place Order COD: /api/order/COD

export const placeOrderCOD = async(req, res) =>{
    try {
        const {userId , items, address} = req.body
        if (!items || items.length === 0) {
            return res.json({success:true, message: "Invalid Data"})
        }

        let amount = await items.reduce(async (acc, item)=>{
            const product = await Product.findById(item.product);
            return (await acc) + product.offerPrice * item.quantity;
        }, 0)
        // Add tax charge (2%)
        amount += Math.floor(amount * 0.02);

        await Order.create({
            userId,
            items,
            amount,
            address,
            paymentType: 'COD',
        });
        return res.json({success:true, message: 'Order Placed successfully'})
    } catch (error) {
        console.log(error.message);
        res.json({success:false, message:error.message})
    }
}

// Get orders by user Id: /api/order/user

export const getUsersOrders = async(req, res) =>{
    try {
        const userId = req.userId; 
        const orders = await Order.find({
            userId,
            $or: [{paymentType: 'COD'}, {isPaid: true}]
        }).populate("items.product address").sort({createdAt: -1});
        res.json({success:true, orders})

    } catch (error) {
        console.log(error.message);
        res.json({success:false, message:error.message})
    }
}

// Get All orders (for seller / admin) : /api/order/seller

export const getAllOrders = async(req, res) =>{
    try {
        const orders = await Order.find({
            $or: [{paymentType: 'COD'}, {isPaid: true}]
        }).populate("items.product address").sort({createdAt: -1});
        res.json({success:true, orders})

    } catch (error) {
        console.log(error.message);
        res.json({success:false, message:error.message})
    }
}


// Place Order COD: /api/order/stripe

export const placeOrderStripe= async(req, res) =>{
    try {
        const {userId , items, address} = req.body;
        const {origin} = req.headers;

        if (!items || items.length === 0) {
            return res.json({success:true, message: "Invalid Data"})
        }
        let productData = [];

        let amount = await items.reduce(async (acc, item)=>{
            const product = await Product.findById(item.product);
            productData.push({
                name: product.name,
                price: product.offerPrice,
                quantity: item.quantity,
            })
            return (await acc) + product.offerPrice * item.quantity;
        }, 0)
        // Add tax charge (2%)
        amount += Math.floor(amount * 0.02);

        const order = await Order.create({
            userId,
            items,
            amount,
            address,
            paymentType: 'Online',
        });
        // Stripe Gateway Initialize
        const stripeInstance = new stripe(process.env.STRIPE_SECRET_KEY);
        // create line items for stripe
        const line_items = productData.map((item)=>{
            return {
                price_data: {
                    currency: 'usd',
                    product_data: {
                        name: item.name,
                    },
                    unit_amount: Math.floor(item.price + item.price * 0.02) * 100
                },
                quantity: item.quantity,
            }
        })
        // create session
        const session = await stripeInstance.checkout.sessions.create({
            line_items,
            mode: "payment",
            success_url: `${origin}/loader?next=my-orders`,
            cancel_url: `${origin}/cart`,
            metadata: {
                orderId: order._id.toString(),
                userId,
            }
        })
        return res.json({success:true, url: session.url})
    } catch (error) {
        console.log(error.message);
        res.json({success:false, message:error.message})
    }
}

// Stripe Webhooks to verify Payment Action : /stripe
export const stripeWebhooks= async(request, response) =>{
    // Stripe Gateway Initialize
        const stripeInstance = new stripe(process.env.STRIPE_SECRET_KEY);

        const sig = request.headers["stripe-signature"];
        let event;

    try {
        event = stripeInstance.webhooks.constructEvent(
            request.body,
            sig,
            process.env.STRIPE_WEBHOOK_SECRET
        );

    } catch (error) {
        response.status(400).send(`Webhook Error: ${error.message}`)
    }

    //Handle the event
    switch (event.type) {
        case "payment_instent_succeeded":{
            const paymentIntent = event.data.object;
            const paymentIntentId = paymentIntent.id;

            //Getting session metadata
            const session = await stripeInstance.checkout.sessions.list({
                payment_intent: paymentIntentId,
            });
            const {orderId, userId} = session.data[0].metadata;
            //Mark payment as Paid
            await Order.findByIdAndUpdate(orderId, {isPaid: true})
            //Clear user cart
            await User.findByIdAndUpdate(userId, {cartItems: {}})
            break;
        }
        case "payment_instent_failed":{
            const paymentIntent = event.data.object;
            const paymentIntentId = paymentIntent.id;

            //Getting session metadata
            const session = await stripeInstance.checkout.sessions.list({
                payment_intent: paymentIntentId,
            });
            const {orderId} = session.data[0].metadata;
            await Order.findByIdAndDelete(orderId);
            break;
        }
            
            
    
        default:
            console.log(`Unhandled event type ${event.type}`);
            break;
    }
    response.json({received: true})
}