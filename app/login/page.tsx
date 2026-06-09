'use client';

import React, { FormEvent, useId, useState } from "react";

const formFields = [
  {
    key: "email",
    label: "email",
    type: "email",
    icon: "/email.svg",
    iconClassName: "relative w-[45px] h-[27px]",
    inputClassName:
      "relative self-stretch mt-[-1.00px] [font-family:'TT_Fors_Trial-Regular',Helvetica] font-normal text-[#002a8b] placeholder:text-[#002a8b80] text-[27.8px] tracking-[0] leading-[normal]",
  },
  {
    key: "accountPassword",
    label: "password",
    type: "password",
    icon: "/password.svg",
    iconClassName: "relative w-[45px] h-[62.47px]",
    inputClassName:
      "relative self-stretch mt-[-1.00px] [font-family:'TT_Fors_Trial-Regular',Helvetica] font-normal text-[#002a8b] placeholder:text-[#002a8b80] text-[27.8px] tracking-[0] leading-[normal]",
  },
] as const;

export const Login = (): JSX.Element => {
  const emailId = useId();
  const passwordId = useId();
  const [formData, setFormData] = useState({
    email: "",
    accountPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const fieldIds: Record<(typeof formFields)[number]["key"], string> = {
    email: emailId,
    accountPassword: passwordId,
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        setErrorMessage(data.error || "Login failed. Please try again.");
        setLoading(false);
        return;
      }

      setSuccessMessage("Login successful!");
      setFormData({ email: "", accountPassword: "" });
      setTimeout(() => {
        setSuccessMessage("");
        setLoading(false);
      }, 2000);
    } catch (err) {
      setErrorMessage("An error occurred. Please try again.");
      setLoading(false);
    }
  };

  return (
    <main className="bg-[#002a8b] w-full min-w-[1440px] min-h-[1024px] relative overflow-hidden">
      <section
        aria-label="Login"
        className="absolute top-0 left-0 w-[895px] h-[1024px] bg-[#f8f0e2] rounded-[0px_200px_200px_0px]"
      />
      <img
        className="absolute top-[184px] left-[940px] w-[500px] h-[655px]"
        alt="Illustration of a cat being petted"
        src="/cat.png"
      />
      <img
        className="absolute w-[140.55px] h-[152.51px] top-[13.57%] left-[69.63%]"
        alt=""
        aria-hidden="true"
        src="/nudge.svg"
      />
      <header className="absolute top-[169px] left-[161px] w-[168px] h-[67px] flex">
        <div className="flex-1 w-[168px] [font-family:'TT_Fors_Trial-Bold',Helvetica] font-bold text-[#191818] text-[48.2px] tracking-[0] leading-[normal]">
          nudge.
        </div>
      </header>
      <section className="flex flex-col w-[573px] items-start gap-[42px] absolute top-[219px] left-[161px]">
        <h1 className="relative self-stretch mt-[-1.00px] [font-family:'TT_Fors_Trial-Bold',Helvetica] font-bold text-[#002a8b] text-[96.7px] tracking-[0] leading-[normal]">
          login
        </h1>
        <form
          onSubmit={handleSubmit}
          className="flex flex-col w-full items-start gap-[42px]"
        >
          {formFields.map((field) => (
            <label
              key={field.key}
              htmlFor={fieldIds[field.key]}
              className="flex h-[103px] items-center gap-[30px] px-[23.15px] py-[0px] relative self-stretch w-full ml-[-2.00px] mr-[-2.00px] bg-[#f8f0e2] rounded-[11.58px] border-2 border-solid border-[#002a8b] cursor-text"
            >
              <img
                className={field.iconClassName}
                alt=""
                aria-hidden="true"
                src={field.icon}
              />
              <div className="flex flex-col w-[327.59px] items-start relative">
                <input
                  id={fieldIds[field.key]}
                  name={field.key}
                  type={field.type}
                  autoComplete={field.key}
                  value={formData[field.key]}
                  onChange={(event) =>
                    setFormData((current) => ({
                      ...current,
                      [field.key]: event.target.value,
                    }))
                  }
                  placeholder={field.label}
                  aria-label={field.label}
                  className={`${field.inputClassName} w-full`}
                />
              </div>
            </label>
          ))}

          {errorMessage && (
            <div className="flex w-full h-auto items-center justify-center px-[23.15px] py-[12px] relative bg-[#ff4444] rounded-[11.58px]">
              <div className="relative w-fit [font-family:'TT_Fors_Trial-Bold',Helvetica] font-bold text-[#ffffff] text-[18px] text-center tracking-[0] leading-[normal]">
                {errorMessage}
              </div>
            </div>
          )}

          {successMessage && (
            <div className="flex w-full h-auto items-center justify-center px-[23.15px] py-[12px] relative bg-[#44ff44] rounded-[11.58px]">
              <div className="relative w-fit [font-family:'TT_Fors_Trial-Bold',Helvetica] font-bold text-[#000000] text-[18px] text-center tracking-[0] leading-[normal]">
                {successMessage}
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="flex w-[573px] h-[99px] items-center justify-center gap-[30px] px-[23.15px] py-[0px] relative bg-[#002a8b80] hover:bg-[#002a8bcc] active:bg-[#002a8bff] transition-colors rounded-[11.58px] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span className="flex flex-col w-[327.59px] items-center justify-center relative">
              <span className="relative w-fit mt-[-1.00px] [font-family:'TT_Fors_Trial-Bold',Helvetica] font-bold text-[#d9d9d9] text-[27.8px] text-center tracking-[0] leading-[normal]">
                {loading ? "Logging in..." : "Log In"}
              </span>
            </span>
          </button>
        </form>
      </section>
      <div className="inline-flex items-center gap-[3.96px] absolute top-[818px] left-[351px]">
        <p className="relative w-fit mt-[-0.54px] [font-family:'TT_Fors_Trial-Regular',Helvetica] font-normal text-[#002a8b] text-[14.9px] tracking-[0] leading-[normal]">
          need an account?
        </p>
        <a
          href="/signup"
          className="relative w-fit mt-[-0.54px] [font-family:'TT_Fors_Trial-Bold',Helvetica] font-bold text-[#002a8b] text-[14.9px] tracking-[0] leading-[normal]"
        >
          SIGN UP
        </a>
      </div>
    </main>
  );
};

export default Login;
