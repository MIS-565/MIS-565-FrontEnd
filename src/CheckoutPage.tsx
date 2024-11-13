// CheckoutPage.tsx
import React, { useState } from "react";
import { CheckoutProvider } from "./CheckoutContext";
import Step1PatronSearch from "./Step1PatronSearch";
import Step2ItemSearch from "./Step2ItemSearch";
import Step3ConfirmCheckout from "./Step3ConfirmCheckout";

const CheckoutPage: React.FC = () => {
  const [step, setStep] = useState(1);

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);
  const reset = () => {
    setStep(1);
    // Add any other reset logic here, if needed
  };

  return (
    <CheckoutProvider>
      <div className="container">
        <div className="step-container">
          <div className="step-counter" style={{ position: "absolute", top: "40px", right: "40px" }}>
            Step {step}/3
          </div>
        </div>
        {step === 1 && <Step1PatronSearch onNext={nextStep} onReset={reset} />}
        {step === 2 && <Step2ItemSearch onNext={nextStep} onPrevious={prevStep} />}
        {step === 3 && <Step3ConfirmCheckout onPrevious={prevStep} onFinish={reset} />}
      </div>
    </CheckoutProvider>
  );
};

export default CheckoutPage;
