export function Input({ label, error, ...props }) {
  return (
    <label className="block">
      {label ? <div className="mb-2 text-sm font-medium text-gray-700">{label}</div> : null}
      <input
        {...props}
        className={[
          'w-full rounded-lg border bg-surface px-4 py-3 text-sm transition-all duration-200',
          'placeholder:text-muted-foreground',
          error
            ? 'border-error/50 focus:border-error focus:outline-none focus:ring-4 focus:ring-error/10'
            : 'border-border hover:border-primary/50 focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10',
          props.className || '',
        ].join(' ')}
      />
      {error ? <div className="mt-1.5 text-xs text-error">{error}</div> : null}
    </label>
  )
}

export function Button({ children, variant = 'primary', size = 'md', ...props }) {
  const styles =
    variant === 'secondary'
      ? 'border border-border bg-surface text-gray-700 hover:bg-gray-50 focus:ring-primary/20'
      : variant === 'danger'
        ? 'bg-error text-white hover:bg-error/90 focus:ring-error/20'
        : variant === 'ghost'
          ? 'bg-transparent text-gray-700 hover:bg-gray-100 focus:ring-primary/20'
          : 'bg-primary text-white hover:bg-primary/90 focus:ring-primary/20'

  const sizeStyles = 
    size === 'sm' 
      ? 'px-3 py-1.5 text-xs'
      : size === 'lg'
        ? 'px-6 py-4 text-base'
        : 'px-4 py-3 text-sm'

  return (
    <button
      {...props}
      className={[
        'inline-flex items-center justify-center gap-2 rounded-lg font-medium shadow-sm disabled:opacity-50',
        'focus:outline-none focus:ring-4 transition-all duration-200',
        styles,
        sizeStyles,
        props.className || '',
      ].join(' ')}
    >
      {children}
    </button>
  )
}

export function Card({ title, children, right, className = '' }) {
  return (
    <div className={[
      'rounded-2xl border border-border-light bg-surface shadow-soft backdrop-blur-sm',
      className
    ].join(' ')}>
      {title ? (
        <div className="flex items-center justify-between border-b border-border-light px-6 py-4">
          <div className="text-sm font-semibold text-gray-900">{title}</div>
          {right ? <div>{right}</div> : null}
        </div>
      ) : null}
      <div className="p-6">{children}</div>
    </div>
  )
}

export function Alert({ kind = 'info', children }) {
  const cls =
    kind === 'error'
      ? 'border-error/20 bg-error/5 text-error'
      : kind === 'success'
        ? 'border-success/20 bg-success/5 text-success'
        : 'border-border bg-gray-50/50 text-gray-700'
  return <div className={['rounded-lg border px-4 py-3 text-sm', cls].join(' ')}>{children}</div>
}

export function Spinner({ size = 18, className = '' }) {
  return (
    <span
      aria-label="Loading"
      className={[
        'inline-block animate-spin rounded-full border-2 border-gray-200 border-t-primary align-[-0.125em]',
        className,
      ].join(' ')}
      style={{ width: size, height: size }}
    />
  )
}