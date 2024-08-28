//Wrote a Common Middleware to Return the Responses instead of Cooking it in Controller

class globalFunctions {
    out(res , statusCode , resultData = null){

     switch (statusCode) {
        case 401:
            res.status(statusCode).json({
                message:"Unauthorized User"
            })
            break;
        case 500:
           res.status(statusCode).json({
              message:"Internal Server Error Occured"
           })
           break;
        case 400:
            res.status(statusCode).json({
               message:resultData
            })
            break;
        case 200:
            res.status(statusCode).json({
                data:resultData
            })
            break;                
        default:
            res.status(statusCode).json({
                data:resultData
            })
            break;
     }
        
    }
}

globalFunctions = new globalFunctions();
export default globalFunctions