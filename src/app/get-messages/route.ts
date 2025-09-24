import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { User } from "next-auth";
import mongoose from "mongoose";


export async function GET(request:Request){
    await dbConnect()
  const session = await getServerSession(authOptions)
  const userID:User = session?.user
  if(!session || !session.user){
    return Response.json({
        success:false,
        message:"Not Authorized"
    },{status:401})
  }

  const user = new mongoose.Types.ObjectId(userID._id)

  try {
    // creating aggregation pipeline for messages 
      const user = await UserModel.aggregate([
        {$match : {id:userID}},
        {$unwind: '$messages'},
        {$sort:{"messages.createdAt":-1}},
        {$group:{_id:"$_id" , messages:{$push:"$messages"}}}
      ])
      if(!user || user.length === 0){
        return Response.json({
        success:false,
        message:"User not found"
    },{status:401})
      }

      return Response.json({
        success:true,
        messages:user[0].messages
    },{status:200})
  } catch (error) {
    
  }
}