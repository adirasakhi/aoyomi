export function EmptyState({
  title,
  hint,
}: {
  title: string;
  hint?: string;
}) {
  return (
    <div className="card p-8 text-center">
      <p className="text-h2">{title}</p>
      {hint ? <p className="text-meta mt-2">{hint}</p> : null}
    </div>
  );
}

export function ErrorState({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div className="card p-8 text-center border-danger" role="alert">
      <p className="text-h2">Gagal memuat</p>
      <p className="text-meta mt-2">{message}</p>
      {onRetry ? (
        <button onClick={onRetry} className="btn btn-secondary mt-4 tap-target">
          Coba lagi
        </button>
      ) : null}
    </div>
  );
}
