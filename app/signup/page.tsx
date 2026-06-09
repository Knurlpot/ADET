'use client';

import React, { FormEvent, useId, useState } from "react";
import { useRouter } from "next/navigation";

type FieldConfig = {
  id: string;
  name: "username" | "email" | "accountPassword";
  type: string;
  label: string;
  icon: string;
  iconClassName: string;
};

export const Signup = (): JSX.Element => {
  const router = useRouter();
  const formId = useId();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    accountPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const fields: FieldConfig[] = [
    {
      id: `${formId}-username`,
      name: "username",
      type: "text",
      label: "username",
      icon: "/username.svg",
      iconClassName: "relative w-[45px] h-[47.22px]",
    },
    {
      id: `${formId}-email`,
      name: "email",
      type: "email",
      label: "email",
      icon: "/email.svg",
      iconClassName: "relative w-[45px] h-[27px]",
    },
    {
      id: `${formId}-password`,
      name: "accountPassword",
      type: "password",
      label: "password",
      icon: "/password.svg",
      iconClassName: "relative w-[45px] h-[62.47px]",
    },
  ];

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
    <main className="bg-[#002a8b] w-full min-w-[1440px] min-h-[1024px] relative overflow-hidden">
      <section
        aria-label="Sign up"
        className="absolute top-0 left-0 w-[895px] h-[1024px] bg-[#f8f0e2] rounded-[0px_200px_200px_0px]"
      />
      <div className="absolute top-[104px] left-[161px] w-[168px] h-[67px] flex">
        <div className="flex-1 w-[168px] [font-family:'TT_Fors_Trial-Bold',Helvetica] font-bold text-[#191818] text-[48.2px] tracking-[0] leading-[normal]">
          nudge.
        </div>
      </div>
      <form
        className="flex flex-col w-[573px] items-start gap-[42px] absolute top-[154px] left-[161px]"
        onSubmit={handleSubmit}
      >
        <h1 className="relative self-stretch mt-[-1.00px] [font-family:'TT_Fors_Trial-Bold',Helvetica] font-bold text-[#002a8b] text-[96.7px] tracking-[0] leading-[normal]">
          signup
        </h1>
        {fields.map((field) => (
          <label
            key={field.id}
            htmlFor={field.id}
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
                id={field.id}
                name={field.name}
                type={field.type}
                aria-label={field.label}
                autoComplete={field.name}
                value={formData[field.name]}
                onChange={(event) =>
                  setFormData((prev) => ({
                    ...prev,
                    [field.name]: event.target.value,
                  }))
                }
                className="[font-family:'TT_Fors_Trial-Regular',Helvetica] font-normal text-[#002a8b] placeholder:text-[#002a8b80] text-[27.8px] tracking-[0] leading-[normal] w-[327.59px]"
                placeholder={field.label}
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

        <button
          type="submit"
          disabled={loading}
          className="flex w-[573px] h-[99px] items-center justify-center gap-[30px] px-[23.15px] py-[0px] relative bg-[#002a8b80] hover:bg-[#002a8bcc] active:bg-[#002a8bff] transition-colors rounded-[11.58px] disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Sign Up"
        >
          <div className="flex flex-col w-[327.59px] items-center justify-center relative">
            <div className="relative w-fit mt-[-1.00px] [font-family:'TT_Fors_Trial-Bold',Helvetica] font-bold text-[#d9d9d9] text-[27.8px] text-center tracking-[0] leading-[normal]">
              {loading ? "Signing up..." : "Sign Up"}
            </div>
          </div>
        </button>
      </form>
      <div className="flex w-[248px] items-center justify-between absolute top-[898px] left-[324px]">
        <p className="relative w-fit mt-[-0.54px] [font-family:'TT_Fors_Trial-Regular',Helvetica] font-normal text-[#002a8b] text-[14.9px] tracking-[0] leading-[normal]">
          already have an account?
        </p>
        <a
          href="/login"
          className="relative w-fit mt-[-0.54px] [font-family:'TT_Fors_Trial-Bold',Helvetica] font-bold text-[#002a8b] text-[14.9px] tracking-[0] leading-[normal]"
        >
          SIGN IN
        </a>
      </div>
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
    </main>
  );
};

export default Signup;
