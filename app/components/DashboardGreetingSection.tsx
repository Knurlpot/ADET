export const DashboardGreetingSection = ({
  username,
  greetingText = "good morning,",
  showUsername = true,
  position = "fixed top-[77px] left-[450px] sm:left-[516px]",
  ariaLabel = "Dashboard greeting",
}: {
  username: string;
  greetingText?: string;
  showUsername?: boolean;
  position?: string;
  ariaLabel?: string;
}): JSX.Element => {
  const greetingParts = [
    {
      id: "greeting",
      text: greetingText,
      className:
        "relative w-fit mt-[-1.19px] [font-family:'TT_Fors_Trial-Bold',Helvetica] font-bold text-black text-[33.8px] tracking-[0] leading-[normal]",
    },
    ...(showUsername
      ? [
          {
            id: "name",
            text: `${username}!`,
            className:
              "relative w-fit mt-[-1.19px] [font-family:'TT_Fors_Trial-Bold',Helvetica] font-bold text-[#002a8b] text-[33.8px] tracking-[0] leading-[normal]",
          },
        ]
      : []),
  ];

  return (
    <header
      className={`inline-flex items-center gap-[7.15px] ${position}`}
      aria-label={ariaLabel}
    >
      <h1 className="inline-flex items-center gap-[7.15px] m-0 p-0 not-italic">
        {greetingParts.map((part) => (
          <span key={part.id} className={part.className}>
            {part.text}
          </span>
        ))}
      </h1>
    </header>
  );
};
