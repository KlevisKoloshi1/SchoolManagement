import { Component } from 'react'

export class ErrorBoundary extends Component {
  state = { hasError: false, error: null }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, info) {
    console.error('ErrorBoundary caught:', error, info)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-background text-text-primary">
          <h1 className="text-xl font-bold mb-2">Something went wrong</h1>
          <p className="text-sm text-text-secondary mb-4 max-w-md text-center">
            {this.state.error?.message || 'An error occurred.'}
          </p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="px-4 py-2 rounded-xl bg-primary text-white font-medium"
          >
            Reload page
          </button>
        </div>
      )
    }
    return this.props.children
  }
}
