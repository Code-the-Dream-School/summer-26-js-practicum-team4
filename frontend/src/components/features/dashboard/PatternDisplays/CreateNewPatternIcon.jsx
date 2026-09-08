import React from "react";
import { Link } from "react-router-dom";
import { Shapes } from "lucide-react";
import PropTypes from "prop-types";

function CreateNewPatternIcon({ isEmpty = false }) {
  return (
    <div className="w-full m-2">
      <Link
        to="/generate"
        className={`flex w-full flex-col items-center justify-center gap-4
        rounded-2xl border border-gray-400 bg-surface px-6 text-center
        focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2
        ${isEmpty ? "h-[60dvh]" : "h-[45dvh]"}`}
      >
        <Shapes className="h-16 w-16 text-accent" strokeWidth={1.5} />

        <p className="max-w-sm text-lg text-text-secondary">
          {isEmpty ? (
            <>
              You don&apos;t have any patterns yet —{" "}
              <span className="font-medium text-primary">click here</span> to
              create your first one.
            </>
          ) : (
            <>
              Create a new pattern —{" "}
              <span className="font-medium text-primary">click here</span> to
              get started.
            </>
          )}
        </p>
      </Link>
    </div>
  );
}
CreateNewPatternIcon.propTypes = {
  isEmpty: PropTypes.bool,
};

export default CreateNewPatternIcon;
