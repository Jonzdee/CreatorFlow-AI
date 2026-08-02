import jwt from "jsonwebtoken"

const authMiddleware = (req, res, next)=>{
    try {
        // Get token from request header
        const authHeader = req.headers.authorization;

        // Check if token exists
        if(!authHeader || !authHeader.startsWith("Bearer")){
            return res.status(401).json({
                success: false,
                message: "Access denied. No token provided",
            });
        }


        //Remove "Bearer" from the token
        
        const token = authHeader.split(" ")[1];
        
        //Verify the token
     
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Attach decoded data to request 
        req.user = decoded; 
        
        // Continue to the next middleware or route 
        next()

    } catch (error) {
        // return res.status(401).json({
        //     success:false,
        //     message: "Invalid or expired token"
        // })
        console.error(error);
    }
}

export default authMiddleware