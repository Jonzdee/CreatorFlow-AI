import Button from "../common/Button";
import { Sparkles } from "lucide-react";

const WelcomeStep = ({ nextStep }) => {
  return (
    <div className="text-center py-4">
      {/* Icon */}
      <div className="flex justify-center mb-6">
        <div className="bg-purple-100 p-4 rounded-full">
          <Sparkles className="w-10 h-10 text-purple-600" />
        </div>
      </div>

      {/* Heading */}
      <h1 className="text-3xl font-bold text-gray-900">
        Welcome to CreatorFlow AI
      </h1>

      {/* Subtitle */}
      <p className="mt-4 text-gray-600 leading-relaxed">
        Let's build your personal AI Social Media Manager.
      </p>

      {/* Description */}
      <p className="mt-4 text-gray-500">
        In less than 2 minutes, we'll learn about your business, audience, and
        goals so CreatorFlow AI can create content that feels like it was
        written by you.
      </p>

      {/* Features */}
      <div className="mt-8 space-y-3 text-left bg-gray-50 p-5 rounded-xl">
        <div>✅ Personalized Content Strategy</div>

        <div>✅ AI Optimized Posting Schedule</div>

        <div>✅ Platform-Specific Content</div>

        <div>✅ Smarter Growth Recommendations</div>
      </div>

      {/* Button */}
      <div className="mt-10">
        <Button onClick={nextStep}>Get Started</Button>
      </div>
    </div>
  );
};

export default WelcomeStep;
