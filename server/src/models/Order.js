import mongoose from 'mongoose';
const itemSchema = new mongoose.Schema({product:{type:mongoose.Schema.Types.ObjectId,ref:'Product'},name:String,image:String,price:Number,quantity:Number},{_id:false});
const orderSchema = new mongoose.Schema({
  user:{type:mongoose.Schema.Types.ObjectId,ref:'User',required:true},
  items:{type:[itemSchema],required:true},
  shipping:{name:String,address:String,city:String,state:String,postalCode:String,phone:String},
  total:{type:Number,required:true},
  status:{type:String,enum:['Placed','Processing','Shipped','Delivered','Cancelled'],default:'Placed'}
},{timestamps:true});
export default mongoose.model('Order',orderSchema);
