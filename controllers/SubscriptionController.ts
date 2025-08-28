import Subscription from "../models/Subscription.js";
import { stripe } from "../app.js";
import expressAsyncHandler from "express-async-handler";
import User from "../models/User.js";
import { Request, Response, NextFunction } from "express";
    
export const createCheckoutSession = expressAsyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const userId = req.user?._id; // Assuming you have user in req.user from your auth middleware
  
  const [plan, user] = await Promise.all([
    Subscription.findById(id),
    User.findById(userId)
  ]);

  if (!plan) {
    res.status(404).json({ message: 'Plan not found' });
    return;
  }

  if (!user) {
    res.status(404).json({ message: 'User not found' });
    return;
  }

  if (!user.stripeCustomerId) {
    res.status(400).json({ message: 'No Stripe customer ID found for this user' });
    return;
  }

  const session = await stripe.checkout.sessions.create({
    mode: 'subscription',
    customer: user.stripeCustomerId, // Use existing customer ID
    line_items: [
      {
        price: plan.priceId as string,
        quantity: 1,
      },
    ],
    success_url: `${process.env.FRONTEND_URL}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.FRONTEND_URL}/payment/failed`,
  });

  res.send(session.url);
})

//for production 
export const stripeWebhookHandler = expressAsyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    let event;
  
    // Verify webhook signature
    try {
        event = stripe.webhooks.constructEvent(
          req.body,
          req.headers['stripe-signature'] as string,
          webhookSecret as string
        );
      } catch (err) {
        console.log(`⚠️  Webhook signature verification failed.`, (err as Error)?.message);
         res.sendStatus(400);
          return;
      }
  
      let user;
    // Handle the event
    switch (event.type) {
      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object;
        break;
      
      case 'payment_intent.created':
        break;
      
      case 'payment_method.attached':
        break;
      
      case 'charge.succeeded':
        break;
      
      case 'checkout.session.completed':
        break;
      
      case 'customer.created':
      
        break;
      
      case 'customer.updated':

        break;
      
        case 'customer.subscription.created':
            const data = event.data.object;
            console.log('data', data.customer);
            user = await User.findOne({stripeCustomerId: data.customer});
            
            if(!user) {
               res.status(404).json({message: 'User not found'});
               return;
            }
          
            // Find the subscription by priceId
            //@ts-expect-error
            const subscription = await Subscription.findOne({ priceId: data.plan.id });
            if (!subscription) {
                            //@ts-expect-error

              console.error('Subscription not found for price ID:', data.plan.id);
               res.status(404).json({ message: "Subscription plan not found" });
               return;
            }
          
            user.isSubscribed = true;
            //@ts-expect-error
            user.subscription = subscription._id as string;  // Store the MongoDB _id
            user.subscriptionType = subscription.plan;
            const subscriptionData = data as unknown as { current_period_start: number; current_period_end: number; };
            user.subscriptionStartDate = new Date(subscriptionData.current_period_start * 1000);
            user.subscriptionEndDate = new Date(subscriptionData.current_period_end * 1000);
            await user.save();
            break;
      case 'invoice.created':
break;
      
      case 'invoice.finalized':
break;
      
      case 'invoice.paid':
break;
      
      case 'invoice.payment_succeeded':
break;
      
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }
  
    res.sendStatus(200);
  });
export const getSubscriptions = expressAsyncHandler(async (req, res, next) => {
    const subscriptions = await Subscription.find();
    res.json(subscriptions);
}) 