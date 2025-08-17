import Subscription from "../models/Subscription";
import { stripe } from "../app";
import expressAsyncHandler from "express-async-handler"
import User from "../models/User";

export const createCheckoutSession = expressAsyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const userId = req.user?._id; // Assuming you have user in req.user from your auth middleware
  
  const [plan, user] = await Promise.all([
    Subscription.findById(id),
    User.findById(userId)
  ]);

  if (!plan) {
    return res.status(404).json({ message: 'Plan not found' });
  }

  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  if (!user.stripeCustomerId) {
    return res.status(400).json({ message: 'No Stripe customer ID found for this user' });
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
export const stripeWebhookHandler = expressAsyncHandler(async (req, res) => {
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
        console.log(`⚠️  Webhook signature verification failed.`, err.message);
        return res.sendStatus(400);
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
              return res.status(404).json({message: 'User not found'});
            }
          
            // Find the subscription by priceId
            const subscription = await Subscription.findOne({ priceId: data.plan.id });
            if (!subscription) {
              console.error('Subscription not found for price ID:', data.plan.id);
              return res.status(404).json({ message: "Subscription plan not found" });
            }
          
            user.isSubscribed = true;
            user.subscription = subscription._id;  // Store the MongoDB _id
            user.subscriptionType = subscription.plan;
            user.subscriptionStartDate = new Date(data.current_period_start * 1000);
            user.subscriptionEndDate = new Date(data.current_period_end * 1000);
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