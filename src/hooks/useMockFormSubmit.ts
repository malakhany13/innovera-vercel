import { useState, type FormEvent } from "react";

interface UseMockFormSubmitOptions {
  onSuccess?: () => void;
  delayMs?: number;
}

export function useMockFormSubmit({ delayMs = 1500, onSuccess }: UseMockFormSubmitOptions = {}) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      onSuccess?.();
      (e.target as HTMLFormElement).reset();
    }, delayMs);
  };

  const reset = () => setIsSubmitted(false);

  return { isSubmitting, isSubmitted, handleSubmit, reset };
}
