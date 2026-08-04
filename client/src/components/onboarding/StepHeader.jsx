const TITLES = {
  1: {
    title: "Welcome 👋",
    subtitle: "Let's personalise CreatorFlow AI.",
  },
  2: {
    title: "Choose your niche",
    subtitle: "Tell us what you create.",
  },
  3: {
    title: "Content Platforms",
    subtitle: "Where do you publish?",
  },
  4: {
    title: "Primary Platform",
    subtitle: "We'll optimize content for this platform.",
  },
  5: {
    title: "Content Goals",
    subtitle: "What do you want to achieve?",
  },
  6: {
    title: "Writing Style",
    subtitle: "Choose your AI tone.",
  },
  7: {
    title: "Location",
    subtitle: "Recommend the best posting time.",
  },
  8: {
    title: "Posting Preferences",
    subtitle: "Let's build your schedule.",
  },
  9: {
    title: "Brand Voice",
    subtitle: "Describe your business.",
  },
};

const StepHeader = ({ step, totalSteps }) => {
  const current = TITLES[step];

  return (
    <div className="mb-8">
      <p className="text-sm text-purple-600 font-semibold">
        {step} of {totalSteps}
      </p>

      <h1 className="text-3xl font-bold mt-2">{current.title}</h1>

      <p className="text-gray-500 mt-2">{current.subtitle}</p>
    </div>
  );
};

export default StepHeader;
