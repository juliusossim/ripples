import { useCallback, useState } from 'react';
import { type FieldValues, type UseFormReturn } from 'react-hook-form';

/**
 * Hook for managing multi-step form state
 * @param form UseFormReturn instance
 * @param steps Array of step names
 * @returns Object containing current step, current step name, whether it's the first step, whether it's the last step, next step function, previous step function, go to step function, and total steps count
 */
export function useMultiStepForm<TFieldValues extends FieldValues>(
  form: UseFormReturn<TFieldValues>,
  steps: string[]
) {
  const [currentStep, setCurrentStep] = useState(0);

  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === steps.length - 1;

  const nextStep = useCallback(async () => {
    // Validate current step fields before proceeding
    const isStepValid = await form.trigger();

    if (isStepValid && !isLastStep) {
      setCurrentStep((prev) => prev + 1);
    }
  }, [form, isLastStep]);

  const prevStep = useCallback(() => {
    if (!isFirstStep) {
      setCurrentStep((prev) => prev - 1);
    }
  }, [isFirstStep]);

  const goToStep = useCallback(
    (step: number) => {
      if (step >= 0 && step < steps.length) {
        setCurrentStep(step);
      }
    },
    [steps.length]
  );

  return {
    currentStep,
    currentStepName: steps[currentStep],
    isFirstStep,
    isLastStep,
    nextStep,
    prevStep,
    goToStep,
    totalSteps: steps.length,
  };
}
