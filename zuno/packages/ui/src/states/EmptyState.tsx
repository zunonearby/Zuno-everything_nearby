export interface EmptyStateProps {
  title: string;
  description?: string;
}

/** "No data yet" pattern — never substitute fake data to make a screen look populated. */
export function EmptyState({ title, description }: EmptyStateProps) {
  return (
    <div data-component="empty-state">
      <p>{title}</p>
      {description ? <p>{description}</p> : null}
    </div>
  );
}
