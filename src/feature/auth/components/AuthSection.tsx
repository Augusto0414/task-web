import { Asterisk, Eye, EyeOff } from "lucide-react";
import { useState, type Dispatch, type FormEvent, type SetStateAction } from "react";
import AuthSidebar from "./AuthSidebar";

interface AuthFormState {
  name: string;
  email: string;
  password: string;
}

interface AuthSectionProps {
  authMode: "login" | "register";
  onModeChange: (mode: "login" | "register") => void;
  authForm: AuthFormState;
  setAuthForm: Dispatch<SetStateAction<AuthFormState>>;
  authFormError: string | null;
  authError: string | null;
  registerNotice: string | null;
  authStatus: "idle" | "loading" | "succeeded" | "failed";
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
}

function AuthSection({
  authMode,
  onModeChange,
  authForm,
  setAuthForm,
  authFormError,
  authError,
  registerNotice,
  authStatus,
  onSubmit,
}: AuthSectionProps) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="flex w-full items-center justify-center p-4">
      <div className="flex w-full max-w-5xl overflow-hidden rounded-[2.5rem] bg-white p-3 shadow-2xl">
        <AuthSidebar />

        <div className="flex flex-1 flex-col px-10 py-16 lg:px-20 xl:py-20">
          <div className="mb-12 lg:hidden">
             <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white font-bold">
                <Asterisk className="h-6 w-6" strokeWidth={3} />
            </div>
          </div>

          <div className="mb-10">
            <h2 className="mb-3 text-3xl font-bold tracking-tight text-slate-900">
              {authMode === "login" ? "Welcome back" : "Create an account"}
            </h2>
            <p className="max-w-md text-sm leading-relaxed text-slate-500">
              Access your tasks, notes, and projects anytime, anywhere - and keep everything flowing in one place.
            </p>
          </div>

          <form className="flex max-w-md flex-col gap-6" onSubmit={onSubmit}>
            {authMode === "register" && (
              <label className="flex flex-col gap-2">
                <span className="px-1 text-xs font-bold uppercase tracking-wider text-slate-800">Full Name</span>
                <input
                  className="rounded-xl border border-slate-200 bg-white px-4 py-3.5 text-sm text-slate-900 placeholder:text-slate-400 transition focus:border-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-500/10"
                  placeholder="John Doe"
                  value={authForm.name}
                  onChange={(event) =>
                    setAuthForm((prev) => ({
                      ...prev,
                      name: event.target.value,
                    }))
                  }
                />
              </label>
            )}

            <label className="flex flex-col gap-2">
              <span className="px-1 text-xs font-bold uppercase tracking-wider text-slate-800">Your email</span>
              <input
                type="email"
                className="rounded-xl border border-slate-200 bg-white px-4 py-3.5 text-sm text-slate-900 placeholder:text-slate-400 transition focus:border-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-500/10"
                placeholder="farazhaidet786@gmail.com"
                value={authForm.email}
                onChange={(event) =>
                  setAuthForm((prev) => ({
                    ...prev,
                    email: event.target.value,
                  }))
                }
              />
            </label>

            <label className="flex flex-col gap-2">
              <span className="px-1 text-xs font-bold uppercase tracking-wider text-slate-800">Password</span>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3.5 text-sm text-slate-900 placeholder:text-slate-400 transition focus:border-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-500/10"
                  placeholder="••••••••"
                  value={authForm.password}
                  onChange={(event) =>
                    setAuthForm((prev) => ({
                      ...prev,
                      password: event.target.value,
                    }))
                  }
                />
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </label>

            {(authFormError || authError) && (
              <p className="rounded-lg bg-rose-50 p-3 text-xs font-medium text-rose-500">
                {authFormError || authError}
              </p>
            )}

            {registerNotice && (
              <p className="rounded-lg bg-emerald-50 p-3 text-xs font-medium text-emerald-500">
                {registerNotice}
              </p>
            )}

            <button
              className="mt-4 rounded-xl bg-indigo-600 py-4 text-sm font-bold text-white shadow-xl shadow-indigo-600/30 transition hover:bg-indigo-500 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-70"
              type="submit"
              disabled={authStatus === "loading"}
            >
              {authStatus === "loading" ? "Processing..." : authMode === "register" ? "Get Started" : "Sign In"}
            </button>
          </form>

          <div className="mt-12 text-sm">
            <span className="text-slate-500">
              {authMode === "login" ? "Don't have an account?" : "Already have an account?"}
            </span>{" "}
            <button
              className="font-bold text-indigo-600 hover:text-indigo-500 underline-offset-4 hover:underline"
              onClick={() => onModeChange(authMode === "login" ? "register" : "login")}
            >
              {authMode === "login" ? "Sign up" : "Sign in"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AuthSection;
