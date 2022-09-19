function serverError(err:string,res){
    if (err) {
        res.status(500).send({ message: err });
        return;
      }
}

export {
    serverError
}