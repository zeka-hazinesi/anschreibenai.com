import { useTranslations } from "next-intl";
import React from "react";

// Define step titles as constants

// Define props interface for the component
interface ProgressStepperProps {
  currentStep: number;
}

const ProgressStepper: React.FC<ProgressStepperProps> = ({ currentStep }) => {
  const t = useTranslations("progress");
  const STEP_TITLES: string[] = [t("link"), t("address"), t("personal"), t("review")];
  return (
    <div className="flex h-auto w-full flex-row items-center justify-center pt-[4rem] sm:pt-[6rem]">
      {STEP_TITLES.map((title, index) => {
        const stepNumber = index + 1;
        // Determine if step is completed, active, or inactive
        const isCompleted = stepNumber < currentStep;
        const isActive = stepNumber === currentStep;
        const isInactive = stepNumber > currentStep;

        // Set appropriate styling based on step status
        const circleTextColor = isCompleted ? "text-white" : isActive ? "text-primary" : "text-border";
        const circleBgColor = isCompleted ? "bg-primary" : "bg-transparent";
        const circleBorderColor = isInactive ? "border-border" : "border-primary";
        const textColor = isInactive ? "text-border" : "text-primary";
        const lineColor =
          index < STEP_TITLES.length - 1 ? (stepNumber < currentStep ? "border-primary" : "border-border") : "";

        return (
          <React.Fragment key={`step-${stepNumber}`}>
            <div className="relative">
              <div
                className={`flex font-bold ${circleTextColor} ${circleBgColor} items-center justify-center rounded-full border-3 text-lg sm:text-2xl ${circleBorderColor} h-10 w-10 sm:h-12 sm:w-12`}
              >
                {isCompleted ? "✓" : stepNumber}
              </div>
              <p
                className={`absolute text-base font-semibold sm:text-lg ${textColor} top-12 left-1/2 -translate-x-1/2 sm:top-14`}
              >
                {title}
              </p>
            </div>
            {index < STEP_TITLES.length - 1 && <div className={`h-1 w-42 border-2 ${lineColor}`}></div>}
          </React.Fragment>
        );
      })}
    </div>
  );
};

export default ProgressStepper;
