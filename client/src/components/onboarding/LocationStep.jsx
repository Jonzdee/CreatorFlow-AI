import { motion } from "framer-motion";
import Select from "react-select";
import TimezoneSelect from "react-timezone-select";
import { getNames } from "country-list";

import StepNavigation from "./StepNavigation";

const countries = getNames().map((country) => ({
  value: country,
  label: country,
}));

const customStyles = {
  control: (provided) => ({
    ...provided,
    minHeight: "56px",
    borderRadius: "16px",
    borderColor: "#E5E7EB",
    boxShadow: "none",
    "&:hover": {
      borderColor: "#7C3AED",
    },
  }),
};

const LocationStep = ({ formData, updateFormData, nextStep, previousStep }) => {
  const handleNext = () => {
    nextStep();
  };

  return (
    <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}>
      <h2 className="text-2xl font-bold text-center">Where are you located?</h2>

      <p className="text-center text-gray-500 mt-2 mb-8">
        We'll recommend the best posting times for your audience.
      </p>

      <div className="space-y-6">
        {/* Country */}

        <div>
          <label className="block font-medium mb-2">Country</label>

          <Select
            styles={customStyles}
            options={countries}
            placeholder="Search country..."
            value={
              countries.find((country) => country.value === formData.country) ||
              null
            }
            onChange={(selected) => updateFormData("country", selected.value)}
          />
        </div>

        {/* Timezone */}

        <div>
          <label className="block font-medium mb-2">Timezone</label>

          <TimezoneSelect
            value={formData.timezone}
            onChange={(timezone) => updateFormData("timezone", timezone.value)}
          />
        </div>
      </div>

      <StepNavigation
        onBack={previousStep}
        onNext={nextStep}
        nextDisabled={!formData.country || !formData.timezone}
      />
    </motion.div>
  );
};

export default LocationStep;
