'use client';

import { FormEvent, useId, useState } from "react";
import { useRouter } from "next/navigation";

const formFields = [
  {
    key: "username",
    label: "username",
    type: "text",
    icon: "/username.svg",
    iconClassName: "w-8 h-8 md:w-10 md:h-10",
    inputClassName:
      "w-full bg-transparent outline-none text-[#002a8b] placeholder:text-[#002a8b80] text-lg md:text-xl",
  },
  {
    key: "email",
    label: "email",
    type: "email",
    icon: "/email.svg",
    iconClassName: "w-8 h-8 md:w-10 md:h-10",
    inputClassName:
      "w-full bg-transparent outline-none text-[#002a8b] placeholder:text-[#002a8b80] text-lg md:text-xl",
  },
  {
    key: "accountPassword",
    label: "password",
    type: "password",
    icon: "/password.svg",
    iconClassName: "w-8 h-8 md:w-10 md:h-10",
    inputClassName:
      "w-full bg-transparent outline-none text-[#002a8b] placeholder:text-[#002a8b80] text-lg md:text-xl",
  },
] as const;

export const Signup = (): JSX.Element => {
  const router = useRouter();
  const usernameId = useId();
  const emailId = useId();
  const passwordId = useId();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    accountPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const fieldIds: Record<string, string> = {
    username: usernameId,
    email: emailId,
    accountPassword: passwordId,
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setErrorMessage("");

    try {
      const response = await fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        setErrorMessage(data.error || "Signup failed. Please try again.");
        setLoading(false);
        return;
      }

      setFormData({ username: "", email: "", accountPassword: "" });
      localStorage.setItem("userUsername", formData.username);
      localStorage.setItem("userId", data.userId);
      setTimeout(() => {
        setLoading(false);
        router.push("/dashboard");
      }, 1500);
    } catch (err) {
      setErrorMessage("An error occurred. Please try again.");
      setLoading(false);
    }
  };

  return (
    <main className="relative min-h-screen w-full bg-[#002a8b] overflow-hidden">
      {/* Left Background Panel */}
      <section
        aria-label="Sign up"
        className="absolute inset-y-0 left-0 w-full lg:w-[60%] bg-[#f8f0e2] lg:rounded-r-[120px]"
      />

      {/* Decorative Nudge SVG */}
      <img
        src="/nudge.svg"
        alt=""
        aria-hidden="true"
        className="absolute left-[65%] top-[13%] w-[160px] h-auto"
      />

      {/* Cat Illustration */}
      <img
        src="/cat.png"
        alt="Illustration of a cat being petted"
        className="hidden lg:block absolute right-[-170px] bottom-[-10px] w-[750px] h-auto z-10"
      />

      {/* Content */}
      <div className="relative z-20 flex min-h-screen items-center">
        <div className="w-full lg:w-[60%] flex justify-center px-6 sm:px-10 lg:px-16">
          <div className="w-full max-w-xl">
            {/* Logo */}
            <header className="mb-8">
              <h2 className="font-bold text-[#191818] text-4xl md:text-5xl">
                nudge.
              </h2>
            </header>

            {/* Signup Form */}
            <section>
              <h1 className="font-bold text-[#002a8b] text-5xl md:text-7xl mb-10">
                signup
              </h1>

              <form
                onSubmit={handleSubmit}
                className="flex flex-col gap-6"
              >
                {formFields.map((field) => (
                  <label
                    key={field.key}
                    htmlFor={fieldIds[field.key]}
                    className="flex items-center gap-4 px-6 py-5 bg-[#f8f0e2] rounded-xl border-2 border-[#002a8b] cursor-text"
                  >
                    <img
                      src={field.icon}
                      alt=""
                      aria-hidden="true"
                      className={field.iconClassName}
                    />

                    <div className="flex-1">
                      <input
                        id={fieldIds[field.key]}
                        name={field.key}
                        type={field.type}
                        autoComplete={field.key}
                        value={formData[field.key as keyof typeof formData]}
                        onChange={(event) =>
                          setFormData((current) => ({
                            ...current,
                            [field.key]: event.target.value,
                          }))
                        }
                        placeholder={field.label}
                        aria-label={field.label}
                        className={field.inputClassName}
                      />
                    </div>
                  </label>
                ))}

                {errorMessage && (
                  <div className="flex w-full h-auto items-center justify-center px-4 py-3 bg-red-500 rounded-xl">
                    <div className="font-bold text-white text-sm text-center">
                      {errorMessage}
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full h-16 rounded-xl bg-[#002a8bcc] hover:bg-[#002a8b] transition-colors flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="font-bold text-white text-lg md:text-xl">
                    {loading ? "Signing up..." : "Sign Up"}
                  </span>
                </button>
              </form>

              {/* Sign In */}
              <div className="mt-6 flex items-center justify-center gap-1">
                <p className="text-[#002a8b] text-sm">
                  already have an account?
                </p>

                <a
                  href="/login"
                  className="font-bold text-[#002a8b] text-sm hover:underline"
                >
                  SIGN IN
                </a>
              </div>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Signup;
