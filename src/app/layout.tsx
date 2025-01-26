import {
  ClerkLoaded,
  ClerkLoading,
  ClerkProvider,
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton
} from '@clerk/nextjs'
import './globals.css'
import Navbar from "@/components/Navbar";
//import {dark} from "@clerk/themes";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body>
          <ClerkLoading>
          LOADING...
          </ClerkLoading>
          <SignedOut>
            <SignInButton />
          </SignedOut>
          <ClerkLoaded>
          <SignedIn>
            <UserButton />
          </SignedIn>
          {children}
          </ClerkLoaded>
        </body>
      </html>
    </ClerkProvider>
  )
}