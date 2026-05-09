import AuthForm from "@/components/form/AuthForm";

export default function AuthSignUpPage() {
  return (
    <div className="flex min-h-screen w-full bg-white overflow-hidden max-h-screen">
      <div className="hidden lg:flex flex-1 px-10 py-6">
        <img
          src="/assets/images/5.jpg"
          alt="Auth Image"
          className="rounded-3xl w-full h-full object-cover"
        />
      </div>
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <AuthForm
            labelling="Get Started"
            subLabel="create an account to get started."
            mode="signup"
          />
        </div>
      </div>
    </div>
  );
}
