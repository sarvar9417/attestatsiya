import { Component } from 'react'
import { monitoring } from '../lib/monitoring'
import { AlertTriangle, RefreshCw } from 'lucide-react'

interface Props {
  children: React.ReactNode
  fallback?: React.ReactNode
  onError?: (error: Error, info: React.ErrorInfo) => void
  resetKey?: string
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
    })
    this.props.onError?.(error, info)
  }

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
          <div className="flex flex-col items-center justify-center text-center p-6">
            <AlertTriangle size={48} className="text-red-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Nimadir xato ketdi</h3>
            <p className="text-gray-500 mb-4">Kutilmagan xatolik yuz berdi</p>
            <button onClick={this.handleRetry} className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors text-sm font-medium">
              <RefreshCw size={16} />
              Qayta urinish
            </button>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}
