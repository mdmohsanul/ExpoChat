import { getServerSession, User } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";

// getServerSession gives us the loggedin user
export async function POST(request:Request){
    await dbConnect()

    const session = await getServerSession(authOptions)
  const user:User = session?.user as User

  if(!session || !session.user){
    return Response.json({
        success:false,
        message:"Not Authenticated"
    },{status:401})
  }

  const userID = user._id;
  const {acceptMessages} = await request.json()

  try {
    const updatedUser = await UserModel.findByIdAndUpdate(userID,{
        isAcceptingMessage:acceptMessages
    },{new:true})
    if(!updatedUser){
        return Response.json({
        success:false,
        message:"Failed to update user status to accept messages"
    },{status:401})
    }

    return Response.json({
        success:true,
        message:"message acceptance status updated successfully",
        updatedUser
    },{status:200})
  } catch (error) {
    console.log("Failed to update user status to accept messages",error)
    return Response.json({
        success:false,
        message:"Failed to update user status to accept messages"
    },{status:500})
  }

}


export async function GET(request:Request){
    await dbConnect()

    const session = await getServerSession(authOptions)
  const user:User = session?.user as User

  if(!session || !session.user){
    return Response.json({
        success:false,
        message:"Not Authenticated"
    },{status:401})
  }

  const userID = user._id;
  const foundUser = await UserModel.findById({userID})

  try {
    if(!foundUser){
          return Response.json({
          success:false,
          message:"Failed to found the user "
      },{status:404})
      }
  
      return Response.json({
          success:true,
          isAcceptingMessages : foundUser.isAcceptingMessage
      },{status:200})
  } catch (error) {
    console.log("Failed to update user status to accept messages",error)
    return Response.json({
        success:false,
        message:"Error in getting message acceptance status"
    },{status:500})
  }
}