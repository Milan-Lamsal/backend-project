//PROMISE 
const asyncHandler = (requestHandler) => {
    return (req, res, next) => {
        Promise.resolve(requestHandler(req, res, next))
            .catch((err) => next(err))// resolve and reject 
    }
}


export { asyncHandler }

//TRY CATCH

//A Higher-Order Function (HOF) is a function that takes another function as an argument or returns a function as its result.
// const asyncHandler = (fn)=>()=>

//     const asyncHandler = ()=>{} //This is just an empty arrow function.


//     const asyncHandler = (fn)=>()=>{}//This is a higher-order function because it takes fn (a function) as an argument and returns another function.

// const asyncHandler = (fn)=>async(req, res, next)=>{
//     try{
//         await fn(req, res, next )

//     }catch (error){
//         res.status(error.code ||  500).json({
//             success:false,
//             message: error.message
//         })
//     }

// } //This function takes an fn (another function) as an argument. It returns an async function that accepts (req, res, next) – typical Express.js middleware parameters.