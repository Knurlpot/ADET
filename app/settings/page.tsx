"use client";

import { FormEvent, useId, useState, useEffect } from "react";
import { SidebarNavigationSection } from "@/app/components/SidebarNavigationSection";
import { DashboardGreetingSection } from "@/app/components/DashboardGreetingSection";

type FormState = {
  username: string;
  email: string;
  newPassword: string;
  confirmPassword: string;
};

const profileFields = [
  {
    key: "username",
    label: "username",
    type: "text",
    autoComplete: "username",
  },
  { key: "email", label: "email", type: "email", autoComplete: "email" },
] as const;

const passwordFields = [
  {
    key: "newPassword",
    label: "new password",
    type: "password",
    autoComplete: "new-password",
  },
  {
    key: "confirmPassword",
    label: "confirm new password",
    type: "password",
    autoComplete: "new-password",
  },
] as const;

const fieldWrapperClassName =
  "flex flex-col items-start px-[15px] py-2.5 relative self-stretch w-full flex-[0_0_auto] rounded-[8.06px] border-[1.39px] border-solid border-[#002a8b]";
const fieldLabelClassName =
  "relative self-stretch mt-[-1.39px] [font-family:'TT_Fors_Trial-Bold',Helvetica] font-bold text-[#002a8b] text-[19.3px] tracking-[0] leading-[normal]";
const fieldInputClassName =
  "relative self-stretch [font-family:'TT_Fors_Trial-Regular',Helvetica] font-normal text-[#002a8b] text-[19.3px] tracking-[0] leading-[normal] placeholder:text-[#002a8b] placeholder:opacity-100";

export default function SettingsPage() {
  const formId = useId();
  const [isMounted, setIsMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [scale, setScale] = useState<number>(1);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [formState, setFormState] = useState<FormState>({
    username: "",
    email: "",
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    setIsMounted(true);
    fetchUserData();

    const updateScale = () => {
      setScale(Math.min(window.innerWidth / 1440, window.innerHeight / 1024));
    };
    updateScale();
    window.addEventListener("resize", updateScale);
    return () => window.removeEventListener("resize", updateScale);
  }, []);

  const fetchUserData = async () => {
    try {
      const userId = localStorage.getItem("userId");
      if (!userId) {
        setMessage({ type: "error", text: "User ID not found" });
        setIsLoading(false);
        return;
      }

      const response = await fetch(`/api/settings?userId=${userId}`);
      const data = await response.json();

      if (response.ok) {
        setFormState((prev) => ({
          ...prev,
          username: data.user.Username || "",
          email: data.user.Email || "",
        }));
      } else {
        setMessage({ type: "error", text: data.error || "Failed to load user data" });
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      setMessage({ type: "error", text: "Error loading user data" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (key: keyof FormState, value: string) => {
    setFormState((current) => ({
      ...current,
      [key]: value,
    }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSaving(true);
    setMessage(null);

    try {
      if (formState.newPassword || formState.confirmPassword) {
        if (formState.newPassword !== formState.confirmPassword) {
          setMessage({ type: "error", text: "Passwords do not match" });
          setIsSaving(false);
          return;
        }
        if (formState.newPassword.length < 6) {
          setMessage({ type: "error", text: "Password must be at least 6 characters" });
          setIsSaving(false);
          return;
        }
      }

      const userId = localStorage.getItem("userId");
      if (!userId) {
        setMessage({ type: "error", text: "User ID not found" });
        setIsSaving(false);
        return;
      }

      const response = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          username: formState.username,
          email: formState.email,
          newPassword: formState.newPassword || undefined,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({ type: "success", text: "Settings updated successfully" });
        if (formState.username) {
          localStorage.setItem("userUsername", formState.username);
        }
        setFormState((prev) => ({
          ...prev,
          newPassword: "",
          confirmPassword: "",
        }));
      } else {
        setMessage({ type: "error", text: data.error || "Failed to update settings" });
      }
    } catch (error) {
      console.error("Error updating settings:", error);
      setMessage({ type: "error", text: "Error updating settings" });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="w-screen h-screen overflow-hidden bg-[#f8f0e2] flex items-center justify-center">
      <div
        style={{
          transform: `scale(${scale})`,
          transformOrigin: "center",
          width: "1440px",
          height: "1024px",
        }}
      >
        <div className="bg-[#f8f0e2] w-full min-w-[1440px] min-h-[1024px] flex relative">
          <div className="fixed top-0 left-0 right-0 w-full h-[212px] bg-[#f8f0e2] blur-[20px]" aria-hidden="true" />
          <header className="contents">
            {/* Added px-8 to position class to match the main layout spacing */}
            <DashboardGreetingSection
              username=""
              greetingText="settings"
              showUsername={false}
              position="fixed top-[77px] left-[500px] sm:left-[566px] px-8"
              ariaLabel="Settings page header"
            />
            {/* Added px-8 to match left alignments */}
            <p className="fixed top-[130px] left-[500px] sm:left-[566px] px-8 w-[432px] [font-family:'TT_Fors_Trial-Regular',Helvetica] font-normal text-[#00000080] text-[15px] tracking-[0] leading-[normal]">
              keep your personal details private. information you add here is
              visible to anyone who can view your profile.
            </p>
            <div className="inline-flex flex-col items-center justify-center gap-2.5 px-5 py-2.5 fixed top-20 right-4 sm:right-8 bg-[#002a8b] rounded-[15px]">
              <div className="flex items-center gap-5 relative self-stretch w-full flex-[0_0_auto]">
                <img
                  className="relative w-[19.19px] h-[20.13px]"
                  alt=""
                  src="/user.svg"
                  aria-hidden="true"
                />
                <div className="w-fit mt-[-1.00px] [font-family:'TT_Fors_Trial-Bold',Helvetica] font-bold text-[#f8f0e2] text-[15px] relative tracking-[0] leading-[normal]">
                  {isMounted ? formState.username : "User"}
                </div>
              </div>
            </div>
          </header>
          
          <SidebarNavigationSection />
          
          {/* Main keeps its base margin and horizontal padding parameters unchanged */}
          <main className="flex z-[1] mt-[212px] relative flex-col items-start gap-[25px] px-8 py-8 ml-[500px] sm:ml-[566px]">
            {message && (
              <div
                className={`w-full p-4 rounded-lg ${
                  message.type === "success"
                    ? "bg-green-100 text-green-800 border border-green-300"
                    : "bg-red-100 text-red-800 border border-red-300"
                }`}
              >
                {message.text}
              </div>
            )}
            {isLoading && (
              <div className="text-[#002a8b] text-center w-full py-8">
                Loading your settings...
              </div>
            )}
            {!isLoading && (
              <form
                id={formId}
                onSubmit={handleSubmit}
                className="flex w-full flex-col items-start gap-[25px]"
              >
                {/* Removed the left border or structural margins pushing text inside section to achieve absolute line alignment */}
                <section className="inline-flex h-[38.81px] items-center gap-[5.55px] relative border-l-[3px] border-solid border-[#002a8b] pl-[12px]">
                  <h2 className="relative w-fit mt-[-17.62px] mb-[-11.62px] [font-family:'TT_Fors_Trial-Regular',Helvetica] font-normal text-[#002a8b] text-[26.2px] tracking-[0] leading-[normal]">
                    edit profile
                  </h2>
                </section>
                <div className="flex flex-col items-start gap-[11px] relative self-stretch w-full flex-[0_0_auto]">
                  {profileFields.map((field) => {
                    const inputId = `${formId}-${field.key}`;

                    return (
                      <div key={field.key} className={fieldWrapperClassName}>
                        <label htmlFor={inputId} className={fieldLabelClassName}>
                          {field.label}
                        </label>
                        <input
                          id={inputId}
                          name={field.key}
                          type={field.type}
                          autoComplete={field.autoComplete}
                          value={formState[field.key]}
                          onChange={(event) =>
                            handleChange(field.key, event.target.value)
                          }
                          className={fieldInputClassName}
                          aria-label={field.label}
                        />
                      </div>
                    );
                  })}
                </div>
                <section className="inline-flex h-[38.81px] items-center gap-[5.55px] relative border-l-[3px] border-solid border-[#002a8b] pl-[12px]">
                  <h2 className="relative w-fit mt-[-17.62px] mb-[-11.62px] [font-family:'TT_Fors_Trial-Regular',Helvetica] font-normal text-[#002a8b] text-[26.2px] tracking-[0] leading-[normal]">
                    change password
                  </h2>
                </section>
                <div className="flex flex-col items-start gap-[11px] relative self-stretch w-full flex-[0_0_auto]">
                  {passwordFields.map((field) => {
                    const inputId = `${formId}-${field.key}`;

                    return (
                      <div key={field.key} className={fieldWrapperClassName}>
                        <label htmlFor={inputId} className={fieldLabelClassName}>
                          {field.label}
                        </label>
                        <input
                          id={inputId}
                          name={field.key}
                          type={field.type}
                          autoComplete={field.autoComplete}
                          value={formState[field.key]}
                          onChange={(event) =>
                            handleChange(field.key, event.target.value)
                          }
                          className={fieldInputClassName}
                          aria-label={field.label}
                        />
                      </div>
                    );
                  })}
                </div>
                <button
                  type="submit"
                  disabled={isSaving || isLoading}
                  className={`flex w-[494px] items-center justify-center gap-2.5 p-2.5 relative flex-[0_0_auto] rounded-[10px] border border-solid transition-colors ${
                    isSaving || isLoading
                      ? "border-[#b0b0b0] bg-[#f0f0f0] opacity-50 cursor-not-allowed"
                      : "border-[#002a8b] hover:bg-[#002a8b] hover:text-[#f8f0e2]"
                  }`}
                >
                  <div className="relative w-fit mt-[-1.00px] [font-family:'TT_Fors_Trial-Regular',Helvetica] font-normal text-[#002a8b] text-[19.3px] tracking-[0] leading-[normal]">
                    {isSaving ? "Saving..." : "save changes"}
                  </div>
                </button>
              </form>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}