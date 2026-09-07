import React from "react";
import { Link } from "react-router-dom";
import { Shapes } from "lucide-react";

function CreateNewPatternIcon() {
  return (
    <div className="w-full">
      <Link
        to="/generate"
        className="flex min-h-[600px] w-full flex-col items-center justify-center gap-4
                   rounded-2xl border border-border bg-surface px-6 text-center
                   focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
      >
        <Shapes className="w-16 h-16 text-accent" strokeWidth={1.5} />

        <p className="max-w-sm text-lg text-text-secondary">
          You don't have any patterns yet —{" "}
          <span className="font-medium text-primary">click here</span> to
          create your first one.
        </p>
      </Link>
    </div>
  );
}

export default CreateNewPatternIcon;