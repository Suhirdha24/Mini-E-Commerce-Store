export const notFound=(req,res)=>res.status(404).json({message:`Route not found: ${req.originalUrl}`});
export const errorHandler=(err,req,res,next)=>{console.error(err); if(err.code===11000) return res.status(400).json({message:'A unique field already exists'}); res.status(err.statusCode||500).json({message:err.message||'Server error'});};
