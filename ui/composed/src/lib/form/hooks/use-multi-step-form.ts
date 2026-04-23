import { useCallback, useState } from 'react';
import type { FieldValues, UseFormReturn } from 'react-hook-form';

export type MultiStepFormState = Readonly<{
  currentStep: number;
  currentStepName: string;
  isFirstStep: boolean;
  isLastStep: boolean;
  nextStep: () => Promise<void>;
  prevStep: () => void;
  goToStep: (step: number) => void;
  totalSteps: number;
}>;

export function useMultiStepForm<TFieldValues extends FieldValues>(
  form: UseFormReturn<TFieldValues>,
  steps: readonly string[],
): MultiStepFormState {
  const [currentStep, setCurrentStep] = useState(0);

  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === steps.length - 1;

  const nextStep = useCallback(async (): Promise<void> => {
    const isStepValid = await form.trigger();

    if (isStepValid && !isLastStep) {
      setCurrentStep((previousStep) => previousStep + 1);
    }
  }, [form, isLastStep]);

  const prevStep = useCallback((): void => {
    if (!isFirstStep) {
      setCurrentStep((previousStep) => previousStep - 1);
    }
  }, [isFirstStep]);

  const goToStep = useCallback(
    (step: number): void => {
      if (step >= 0 && step < steps.length) {
        setCurrentStep(step);
      }
    },
    [steps.length],
  );

  return {
    currentStep,
    currentStepName: steps[currentStep] ?? '',
    isFirstStep,
    isLastStep,
    nextStep,
    prevStep,
    goToStep,
    totalSteps: steps.length,
  };
}
