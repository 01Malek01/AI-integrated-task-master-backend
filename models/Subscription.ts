import mongoose, { Document } from "mongoose";
// import { stripe } from "../app";

export interface ISubscription extends Document {
  plan: string;
  description: string;
  price: number;
  priceId: string;
  duration: string;
}

const subscriptionSchema = new mongoose.Schema({
  plan: {
    type: String,
    default: 'free'
  },
  description: {
    type: String,
    default: 'free plan'
  },
  price: {
    type: Number,
    default: 0
  },
  //Related to stripe
  priceId: {
    type: String,
    default: ''
  },
  duration: {
    type: String,
    default: 'monthly'
  },
}) 


 //create a pre save hook to create then store stripe price id
//  subscriptionSchema.post('save', async function () {
//     if (this.isModified('priceId')|| this.priceId == '' ) {
//         const priceId = await stripe.prices.create({
//             product:  this._id.toString(), // Your product ID
//             unit_amount:  this.price * 100 , 
//             currency: 'usd',
//             recurring: {
//               interval: 'month', // or 'year'
//             },
//           });
//           this.priceId = priceId.id;
//           await this.save();
//     }
// })
const Subscription = mongoose.model<ISubscription>('Subscription', subscriptionSchema);
 export default Subscription;