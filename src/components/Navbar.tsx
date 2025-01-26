import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { UserButton } from "@clerk/nextjs";
import { UserProfile, useUser } from "@clerk/nextjs"; 

const Navbar = () => {
    const {user} = useUser();
  return <div>
    <ul className="flex justify-between m-10 items-center">
    <div>
    <Link href = "/">
        <li>Home</li>
    </Link>
    </div>
    <div className ="flex gap-10.">
        {!user ?(
            <>)
    <Link href = "/sign-in">
        <li>Login</li>
    </Link>
    <Link href = "/sign-up">
        <li>Sign Up</li>
    </Link>
    </>
    ):(
        <>
    <Link href = "/profile">
        <li>Profile</li>
    </Link>
    <li className = "flex items-centre">
        <UserButton/>
    </li>
    </>
    )}
    
    <li></li>
    </div>
    </ul>
    </div>
}
export default Navbar;