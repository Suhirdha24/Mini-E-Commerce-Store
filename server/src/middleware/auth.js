import jwt from 'jsonwebtoken';
import User from '../models/User.js';
export const protect = async (req,res,next)=>{
  const token=req.headers.authorization?.startsWith('Bearer ')?req.headers.authorization.split(' ')[1]:null;
  if(!token) return res.status(401).json({message:'Authentication required'});
  try{const decoded=jwt.verify(token,process.env.JWT_SECRET); req.user=await User.findById(decoded.id).select('-password'); if(!req.user) throw new Error(); next();}
  catch(e){return res.status(401).json({message:'Invalid or expired token'});}
};
export const adminOnly=(req,res,next)=>req.user?.role==='admin'?next():res.status(403).json({message:'Admin access required'});
