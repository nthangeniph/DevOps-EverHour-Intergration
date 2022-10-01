function serverError(err:string,res){
    if (err) {
        res.status(500).send({ message: err.toString() });
        return;
      }
}
function catchAsync(fn){
    return function(req,res,next){
        fn(req,res,next).catch((err)=>{
            next(err)
        });
        
    }

}

export {
    serverError,
    catchAsync
}