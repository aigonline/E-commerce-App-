import { RegisterForm } from "@/components/auth/register-form"
import { getUser } from "@/lib/auth"
import { redirect } from "next/navigation"

export default async function RegisterPage() {
  const user = await getUser()

  // Redirect if already logged in
  if (user) {
    redirect("/")
  }

  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">Create an account</h1>
          <p className="text-sm text-muted-foreground">Enter your information to create an account</p>
        </div>
        <RegisterForm />
      </div>
    </div>
  )
}
