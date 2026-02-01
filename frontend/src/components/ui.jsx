// Modern Select Component
export function Select({ label, error, options = [], value, onChange, placeholder, disabled, ...props }) {
  return (
    <label className="block">
      {label ? <div className="mb-2 text-sm font-medium text-text-primary">{label}</div> : null}
      <div className="relative">
        <select
          value={value}
          onChange={onChange}
          disabled={disabled}
          {...props}
          className={[
            'w-full appearance-none rounded-xl border bg-surface px-4 py-3.5 pr-10 text-sm transition-all duration-200',
            'placeholder:text-muted-foreground focus:outline-none',
            error
              ? 'border-error/50 text-error focus:border-error focus:ring-4 focus:ring-error/10'
              : 'border-border text-text-primary hover:border-primary/50 focus:border-primary focus:ring-4 focus:ring-primary/10',
            disabled ? 'cursor-not-allowed opacity-60 bg-border-light' : 'cursor-pointer hover:bg-surface-hover',
            props.className || '',
          ].join(' ')}
        >
          {placeholder && <option value="">{placeholder}</option>}
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
          <svg className="h-5 w-5 text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
      {error ? <div className="mt-1.5 text-xs text-error">{error}</div> : null}
    </label>
  )
}

export function Input({ label, error, ...props }) {
  return (
    <label className="block">
      {label ? <div className="mb-2 text-sm font-medium text-text-primary">{label}</div> : null}
      <input
        {...props}
        className={[
          'w-full rounded-xl border bg-surface px-4 py-3.5 text-sm transition-all duration-200',
          'placeholder:text-muted-foreground focus:outline-none',
          error
            ? 'border-error/50 focus:border-error focus:ring-4 focus:ring-error/10'
            : 'border-border hover:border-primary/50 focus:border-primary focus:ring-4 focus:ring-primary/10',
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
      ? 'border border-border bg-surface text-text-secondary hover:bg-surface-hover hover:border-primary/30 focus:ring-primary/20 shadow-soft'
      : variant === 'danger'
        ? 'bg-error text-white hover:bg-error/90 focus:ring-error/20 shadow-soft'
        : variant === 'ghost'
          ? 'bg-transparent text-text-secondary hover:bg-surface-hover hover:text-text-primary focus:ring-primary/20'
          : variant === 'success'
            ? 'bg-accent text-white hover:bg-accent/90 focus:ring-accent/20 shadow-soft'
            : 'bg-primary text-white hover:bg-primary/90 focus:ring-primary/20 shadow-soft'

  const sizeStyles = 
    size === 'sm' 
      ? 'px-3 py-2 text-xs'
      : size === 'lg'
        ? 'px-6 py-4 text-base'
        : 'px-4 py-3 text-sm'

  return (
    <button
      {...props}
      className={[
        'inline-flex items-center justify-center gap-2 rounded-xl font-medium transition-all duration-200',
        'focus:outline-none focus:ring-4 disabled:opacity-50 disabled:cursor-not-allowed',
        'transform hover:scale-[1.02] active:scale-[0.98]',
        styles,
        sizeStyles,
        props.className || '',
      ].join(' ')}
    >
      {children}
    </button>
  )
}

export function Card({ title, children, right, className = '', hover = false }) {
  return (
    <div className={[
      'rounded-2xl border border-border bg-surface shadow-soft backdrop-blur-sm transition-all duration-200',
      hover ? 'hover:shadow-soft-md hover:border-primary/20 hover:-translate-y-0.5' : '',
      className
    ].join(' ')}>
      {title ? (
        <div className="flex items-center justify-between border-b border-border-light px-6 py-4">
          <div className="text-sm font-semibold text-text-primary">{title}</div>
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
        ? 'border-accent/20 bg-accent/5 text-accent-700'
        : kind === 'warning'
          ? 'border-warning/20 bg-warning/5 text-warning-700'
          : 'border-border bg-surface-hover text-text-secondary'
  
  return (
    <div className={[
      'rounded-xl border px-4 py-3 text-sm animate-fade-in',
      cls
    ].join(' ')}>
      {children}
    </div>
  )
}

export function Spinner({ size = 18, className = '' }) {
  return (
    <span
      aria-label="Loading"
      className={[
        'inline-block animate-spin rounded-full border-2 border-border border-t-primary align-[-0.125em]',
        className,
      ].join(' ')}
      style={{ width: size, height: size }}
    />
  )
}

/**
 * Confirmation dialog modal. Avoids native confirm() which can block/freeze
 * the renderer in Electron and cause focus/input issues.
 */
export function ConfirmDialog({ open, title, message, confirmLabel, cancelLabel, variant = 'danger', confirmDisabled, onConfirm, onCancel }) {
  if (!open) return null
  const isDanger = variant === 'danger'
  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-dialog-title"
    >
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={confirmDisabled ? undefined : onCancel}
        aria-hidden="true"
      />
      <div className="relative rounded-2xl border border-border bg-surface shadow-soft p-6 max-w-md w-full animate-fade-in">
        <h2 id="confirm-dialog-title" className="text-lg font-semibold text-text-primary mb-2">
          {title}
        </h2>
        <p className="text-sm text-text-secondary mb-6">{message}</p>
        <div className="flex gap-3 justify-end">
          <Button variant="secondary" onClick={onCancel} disabled={confirmDisabled}>
            {cancelLabel}
          </Button>
          <Button variant={isDanger ? 'danger' : 'primary'} onClick={onConfirm} disabled={confirmDisabled}>
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  )
}

// Modern Badge Component
export function Badge({ children, variant = 'default', className = '' }) {
  const styles = 
    variant === 'success'
      ? 'bg-accent/10 text-accent-700 border-accent/20'
      : variant === 'warning'
        ? 'bg-warning/10 text-warning-700 border-warning/20'
        : variant === 'error'
          ? 'bg-error/10 text-error border-error/20'
          : 'bg-secondary-100 text-secondary-700 border-secondary-200'

  return (
    <span className={[
      'inline-flex items-center px-2.5 py-0.5 rounded-lg text-xs font-medium border',
      styles,
      className
    ].join(' ')}>
      {children}
    </span>
  )
}