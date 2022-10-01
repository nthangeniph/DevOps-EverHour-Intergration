import { ObjectId } from "bson";



const validEntityId=(_id:string)=>{
    
    
    if (!ObjectId.isValid(_id)) {
       
        throw new Error (`Invalid id: ${_id}`)
     
      }
    return new ObjectId(_id)
}


export {validEntityId}