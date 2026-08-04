import { ArrowLeft, ArrowRight } from "lucide-react";
import Button from "../common/Button";

const StepNavigation = ({
  onBack,
  onNext,
  nextDisabled = false,
  backText = "Back",
  nextText = "Continue",
}) => {
  return (
    <div className="flex items-center justify-between gap-3 mt-10">
      <Button
        variant="outline"
        icon={ArrowLeft}
        fullWidth={false}
        onClick={onBack}
        className="px-5"
      >
        {backText}
      </Button>

      <Button
        icon={ArrowRight}
        iconPosition="right"
        fullWidth={false}
        disabled={nextDisabled}
        onClick={onNext}
        className="px-8"
      >
        {nextText}
      </Button>
    </div>
  );
};

export default StepNavigation;
