import React from 'react';
import {redirect} from 'next/navigation'
import { UserProfile, useUser } from "@clerk/nextjs"; // Correct import for client-side usage



const Profile = () => {
  const { user, isLoaded } = useUser(); // Fetch user info using the Clerk hook
  const isAuth =!!user;
  if (!isLoaded) {
    return <p>Loading...</p>; // Handle the loading state
  }

 if(!isAuth){
    redirect("/");
 }
 
  return (
    <div>
      <h1>User Name</h1>
      <p>{user?.firstName} {user?.lastName}</p> {/* Display user's name */}
      <UserProfile /> {/* Display the UserProfile component */}
    </div>
  );
};

export default Profile;
