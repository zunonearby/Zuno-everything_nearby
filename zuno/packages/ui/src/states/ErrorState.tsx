export interface ErrorStateProps {
  message: string;
  onRetry?: () => void;
}

export function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <div data-component="error-state">
      <p>{message}</p>
      {onRetry ? <button onClick={onRetry}>Retry</button> : null}
    </div>
  );
}
