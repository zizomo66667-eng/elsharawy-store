export function EmptyState({
  title = "لا توجد نتائج",
  description,
}: {
  title?: string;
  description?: string;
}) {
  return (
    <div className="text-center py-16 px-4">
      <p className="text-lg font-medium text-primary">{title}</p>
      {description && (
        <p className="text-muted-text text-sm mt-2 max-w-md mx-auto">{description}</p>
      )}
    </div>
  );
}
