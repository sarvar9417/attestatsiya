import { Component } from 'react'
import ErrorDisplay from './ui/ErrorDisplay'
import { monitoring } from '../lib/monitoring'
import type { LucideIcon } from 'lucide-react'
import { Bug } from 'lucide-react'
import type { ErrorSeverity } from '../lib/errors'

interface Props {
  children: React.ReactNode
  fallback?: React.ReactNode

  /** Custom icon for the error display */
  icon?: LucideIcon
  /** Custom title (default: 'Nimadir xato ketdi') */
  title?: string
  /** Custom message (default: 'Kutilmagan xatolik yuz berdi') */
  message?: string

  /** Callback fired when error is caught (for additional logging, state reset, etc.) */
  onError?: (error: Error, info: React.ErrorInfo) => void

  /**
   * Key change forces ErrorBoundary to reset (use location.key for route-level reset).
   * Pass the current route key so navigation clears the error state automatically.
   */
  resetKey?: string

  /** Error severity level (default: 'error') */
  severity?: ErrorSeverity
}

interface State {
  hasError: boolean
  error?: Error
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    monitoring.captureException(error, {
      componentStack: info.componentStack,
      severity: this.props.severity ?? 'error',
    })
    this.props.onError?.(error, info)
  }

  /** Reset error state when resetKey changes (route navigation) */
  componentDidUpdate(prevProps: Props) {
    if (this.props.resetKey && this.props.resetKey !== prevProps.resetKey) {
      if (this.state.hasError) {
        this.setState({ hasError: false, error: undefined })
      }
    }
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: undefined })
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback

      return (
        <div className="min-h-[300px] flex items-center justify-center bg-white dark:bg-gray-900">
          <ErrorDisplay
            icon={this.props.icon ?? Bug}
            title={this.props.title ?? 'Nimadir xato ketdi'}
            message={this.props.message ?? 'Kutilmagan xatolik yuz berdi. Iltimos, qayta urinib ko\'ring.'}
            detail={this.state.error?.stack ?? this.state.error?.message}
            variant="error"
            retry={this.handleRetry}
            retryLabel="Qayta urinish"
            size="md"
          />
        </div>
      )
    }
    return this.props.children
  }
}
