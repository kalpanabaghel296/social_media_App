import {auth,currentUser} from "@clerk/nextjs/server"
import { NextResponse } from "next/server";
import {  useUser } from "@clerk/nextjs";


export async function GET(){
    const { user } = useUser();
    const users = await currentUser();

    if(!user){
        return NextResponse.json({message : "Not Authentcated"},{status : 401});
    }
    return NextResponse.json(
        {
            message :"Authenticated",
            deta:{userId:user,username:users?.username}
        
        },
        {status :200}
    );
}