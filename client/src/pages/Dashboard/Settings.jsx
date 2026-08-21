import { useState } from "react";
import {
  Bell,
  Sparkles,
  Smartphone,
  Apple,
  Play,
  Gift,
  ExternalLink,
  Info,
} from "lucide-react";

const Settings = () => {
  const [notifications, setNotifications] = useState({
    contentCreated: true,
    scheduledReminders: true,
    aiSuggestions: true,
    productUpdates: true,
  });

  const [aiPreferences, setAiPreferences] = useState({
    hashtags: true,
    callToAction: true,
    suggestions: true,
  });

  const handleNotificationChange = (field) => {
    setNotifications((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const handleAIChange = (field) => {
    setAiPreferences((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  return (
    <div className="max-w-4xl space-y-6 pb-10">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
          Settings
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          Customize your CreatorFlow AI experience and preferences.
        </p>
      </div>

      {/* AI Preferences */}
      <section className="bg-white border border-gray-200 rounded-2xl p-5 sm:p-6">
        <div className="flex items-start gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center">
            <Sparkles size={20} className="text-purple-600" />
          </div>

          <div>
            <h2 className="font-bold text-gray-900">AI Content Preferences</h2>

            <p className="text-sm text-gray-500 mt-1">
              Control how CreatorFlow AI assists with your content.
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <SettingToggle
            title="Automatically include hashtags"
            description="Let AI generate relevant hashtags for your content."
            enabled={aiPreferences.hashtags}
            onChange={() => handleAIChange("hashtags")}
          />

          <SettingToggle
            title="Include calls-to-action"
            description="Ask your audience to like, comment, share or take action."
            enabled={aiPreferences.callToAction}
            onChange={() => handleAIChange("callToAction")}
          />

          <SettingToggle
            title="Personalized content suggestions"
            description="Allow CreatorFlow to suggest content based on your niche and activity."
            enabled={aiPreferences.suggestions}
            onChange={() => handleAIChange("suggestions")}
          />
        </div>
      </section>

      {/* Notifications */}
      <section className="bg-white border border-gray-200 rounded-2xl p-5 sm:p-6">
        <div className="flex items-start gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center">
            <Bell size={20} className="text-purple-600" />
          </div>

          <div>
            <h2 className="font-bold text-gray-900">Notifications</h2>

            <p className="text-sm text-gray-500 mt-1">
              Choose the updates you want to receive.
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <SettingToggle
            title="Content created"
            description="Notify me when AI successfully generates content."
            enabled={notifications.contentCreated}
            onChange={() => handleNotificationChange("contentCreated")}
          />

          <SettingToggle
            title="Scheduled content reminders"
            description="Receive reminders about upcoming scheduled posts."
            enabled={notifications.scheduledReminders}
            onChange={() => handleNotificationChange("scheduledReminders")}
          />

          <SettingToggle
            title="AI recommendations"
            description="Receive personalized content ideas and recommendations."
            enabled={notifications.aiSuggestions}
            onChange={() => handleNotificationChange("aiSuggestions")}
          />

          <SettingToggle
            title="CreatorFlow updates"
            description="Receive important product updates and new feature announcements."
            enabled={notifications.productUpdates}
            onChange={() => handleNotificationChange("productUpdates")}
          />
        </div>
      </section>

      {/* Mobile App */}
      <section className="bg-white border border-gray-200 rounded-2xl p-5 sm:p-6">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center">
            <Smartphone size={20} className="text-purple-600" />
          </div>

          <div>
            <h2 className="font-bold text-gray-900">CreatorFlow Mobile App</h2>

            <p className="text-sm text-gray-500 mt-1">
              Take your content management workflow with you wherever you go.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-5">
          <ComingSoonCard
            icon={Apple}
            title="Apple App Store"
            description="The CreatorFlow mobile app will be available on iOS in the future."
          />

          <ComingSoonCard
            icon={Play}
            title="Google Play Store"
            description="The CreatorFlow mobile app will be available on Android in the future."
          />
        </div>

        <div className="mt-5 rounded-xl bg-purple-50 border border-purple-100 p-4">
          <p className="text-sm text-purple-700">
            Follow our official social media channels to be the first to know
            when the mobile app launches.
          </p>
        </div>
      </section>

      {/* Creator Rewards */}
      <section className="rounded-2xl bg-linear-to-br from-purple-600 to-purple-700 p-5 sm:p-6 text-white">
        <div className="flex items-start gap-4">
          <div className="w-11 h-11 rounded-xl bg-white/15 flex items-center justify-center shrink-0">
            <Gift size={22} />
          </div>

          <div>
            <h2 className="font-bold text-lg">Creator Bonuses & Rewards</h2>

            <p className="text-sm text-purple-100 mt-1">
              We regularly reward creators who build and grow with CreatorFlow.
            </p>

            <p className="text-sm text-purple-100 mt-3">
              Follow our social media channels for exclusive creator bonuses,
              challenges, giveaways, product announcements and special
              opportunities.
            </p>

            <button
              type="button"
              className="mt-4 inline-flex items-center gap-2 bg-white text-purple-700 px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-purple-50 transition"
            >
              Follow CreatorFlow
              <ExternalLink size={16} />
            </button>
          </div>
        </div>
      </section>

      {/* About */}
      <section className="bg-white border border-gray-200 rounded-2xl p-5 sm:p-6">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center">
            <Info size={20} className="text-gray-600" />
          </div>

          <div>
            <h2 className="font-bold text-gray-900">About CreatorFlow AI</h2>

            <p className="text-sm text-gray-500 mt-1">
              Your AI-powered social media assistant for creating, planning and
              managing content.
            </p>

            <p className="text-xs text-gray-400 mt-4">
              CreatorFlow AI · Version 1.0.0
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

const SettingToggle = ({ title, description, enabled, onChange }) => {
  return (
    <div className="flex items-center justify-between gap-4 py-3">
      <div>
        <p className="text-sm font-semibold text-gray-900">{title}</p>

        <p className="text-xs text-gray-500 mt-1 max-w-xl">{description}</p>
      </div>

      <button
        type="button"
        onClick={onChange}
        className={`relative shrink-0 w-11 h-6 rounded-full transition ${
          enabled ? "bg-purple-600" : "bg-gray-300"
        }`}
        aria-label={title}
      >
        <span
          className={`absolute top-1 w-4 h-4 rounded-full bg-white transition ${
            enabled ? "left-6" : "left-1"
          }`}
        />
      </button>
    </div>
  );
};

const ComingSoonCard = ({ icon: Icon, title, description }) => {
  return (
    <div className="rounded-xl border border-gray-200 p-4">
      <div className="flex items-center justify-between">
        <Icon size={22} className="text-gray-700" />

        <span className="text-[10px] uppercase tracking-wide font-bold px-2 py-1 rounded-full bg-purple-50 text-purple-600">
          Coming Soon
        </span>
      </div>

      <h3 className="font-semibold text-gray-900 mt-4">{title}</h3>

      <p className="text-xs text-gray-500 mt-1">{description}</p>
    </div>
  );
};

export default Settings;
