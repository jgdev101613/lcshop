import { useState } from "react";
import { useUser } from "@clerk/react";
import { SparklesIcon, ArrowRightIcon, UserCircle2Icon } from "lucide-react";

const ProfileCompletion = () => {
  const { user } = useUser();
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    try {
      setLoading(true);
      await user.update({ firstName: name });
      window.location.reload();
    } catch (error) {
      console.error("Failed to update profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const initials = name.trim()
    ? name
        .trim()
        .split(" ")
        .map((w) => w[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : null;

  return (
    <div className="min-h-screen bg-base-100 flex items-center justify-center px-4 relative overflow-hidden">
      {/* Decorative blurred orbs — use theme colors */}
      <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-primary/10 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-secondary/10 blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-accent/5 blur-3xl pointer-events-none" />

      {/* Card */}
      <div className="relative z-10 w-full max-w-md animate-in fade-in slide-in-from-bottom-4 duration-500">
        {/* Floating avatar preview */}
        <div className="flex justify-center mb-6">
          <div
            className={`relative w-20 h-20 rounded-2xl flex items-center justify-center transition-all duration-300 shadow-lg ${
              initials
                ? "bg-primary text-primary-content scale-110"
                : "bg-base-300 text-base-content/30"
            }`}
          >
            {initials ? (
              <span className="text-2xl font-bold tracking-tight">
                {initials}
              </span>
            ) : (
              <UserCircle2Icon className="size-10" />
            )}
            {/* Sparkle badge */}
            {initials && (
              <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-accent flex items-center justify-center shadow animate-bounce">
                <SparklesIcon className="size-3 text-accent-content" />
              </div>
            )}
          </div>
        </div>

        {/* Main card */}
        <div className="card bg-base-200 border border-base-300 shadow-2xl">
          <div className="card-body p-8 gap-6">
            {/* Header */}
            <div className="text-center space-y-1.5">
              <div className="inline-flex items-center gap-1.5 badge badge-primary badge-outline text-xs px-3 py-2 mb-2">
                <SparklesIcon className="size-3" />
                Almost there
              </div>
              <h2 className="text-3xl font-extrabold tracking-tight leading-tight">
                Set up your profile
              </h2>
              <p className="text-base-content/50 text-sm leading-relaxed">
                Just one quick step before you dive in — tell us what to call
                you.
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name Input */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-widest text-base-content/40 pl-1">
                  Your name
                </label>
                <div
                  className={`relative rounded-xl border-2 transition-all duration-200 bg-base-100 ${
                    focused
                      ? "border-primary shadow-[0_0_0_3px_oklch(var(--p)/0.15)]"
                      : "border-base-300"
                  }`}
                >
                  <input
                    type="text"
                    placeholder="e.g. Eunice Gregg"
                    className="input w-full bg-transparent border-none focus:outline-none text-base placeholder:text-base-content/25 px-4 py-3 h-auto"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    onFocus={() => setFocused(true)}
                    onBlur={() => setFocused(false)}
                    disabled={loading}
                    autoFocus
                  />
                  {/* Live char count */}
                  {name.length > 0 && (
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-base-content/30 tabular-nums">
                      {name.length}
                    </span>
                  )}
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading || !name.trim()}
                className="btn btn-primary w-full rounded-xl gap-2 text-sm font-bold shadow-md shadow-primary/20 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-40 disabled:scale-100"
              >
                {loading ? (
                  <>
                    <span className="loading loading-spinner loading-sm" />
                    Saving your profile…
                  </>
                ) : (
                  <>
                    Continue
                    <ArrowRightIcon className="size-4" />
                  </>
                )}
              </button>
            </form>

            {/* Footer note */}
            <p className="text-center text-xs text-base-content/30 leading-relaxed">
              You can always update this later in your account settings.
            </p>
          </div>
        </div>

        {/* Subtle step indicator */}
        <div className="flex justify-center gap-1.5 mt-5">
          <span className="w-6 h-1.5 rounded-full bg-primary" />
          <span className="w-1.5 h-1.5 rounded-full bg-base-300" />
          <span className="w-1.5 h-1.5 rounded-full bg-base-300" />
        </div>
      </div>
    </div>
  );
};

export default ProfileCompletion;
