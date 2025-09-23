import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import {z} from "zod"
import { usernameValidation } from "@/schema/signUpSchema";

const UserNameQuerySchema =  z.object({
    username :usernameValidation
})

export async function GET(request:Request){
    
    await dbConnect()
    try {
        // extract username from URL queryparams

        const {searchParams} = new URL(request.url)
        const queryParam = {
            username : searchParams.get("username")
        }

        // validate with zod
    const result = UserNameQuerySchema.safeParse(queryParam)
    console.log(result)

    if(!result.success){
        const userNameErrors = result.error.format().username?._errors || []
        return Response.json({
            success:false,
            message:userNameErrors.length > 0 ? userNameErrors.join(", ") : "Invalid query parameters"
        },{
            status:500
        })
    }
    const {username} = result.data;

     const existingVerifiedUser =   await UserModel.findOne({username,isVerified:true})
     if(existingVerifiedUser){
        return Response.json({
            success:false,
            message:"Username is already taken"
        },{
            status:500
        })
     }
     return Response.json({
            success:true,
            message:"Username is available"
        },{
            status:200
        })
        
    } catch (error) {
         console.log("error checking username ", error)
          return Response.json({
            success : true,
            message:"error checking username",
            
         },
        {status:500})
    }
}