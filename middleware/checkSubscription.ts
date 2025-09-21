import asyncHandler from "express-async-handler";

const checkProSubscription = asyncHandler(async(req,res,next) => {
    const user = req.user;
    if(!user){
        return next(new Error("Unauthorized"));
    }
    if(user.subscriptionType === "free" || user.isSubscribed === false){
        return next(new Error("Subscription not active"));
    }
    next();
})

export default checkProSubscription