import { useI18n } from '../../i18n';

interface ConnectionExercise {
  id: number;
  instruction: string;
  prompt: string;
  hints: string[];
  exampleAnswer: string;
}

interface ConnectionFeedbackProps {
  exercise: ConnectionExercise;
  userAnswer: string;
  aiFeedback?: string | null;
}

export function ConnectionFeedback({ exercise, userAnswer, aiFeedback }: ConnectionFeedbackProps) {
  const { t } = useI18n();
  const trimmed = userAnswer.trim();
  const isEmpty = trimmed.length === 0;
  const isShort = trimmed.length > 0 && trimmed.split(/\s+/).length < 5;

  return (
    <div className="mt-3 text-xs space-y-2.5">
      {/* Empty / short answer hints */}
      {isEmpty && (
        <div className="p-2.5 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800">
          <p className="font-semibold text-amber-700 dark:text-amber-400 mb-1">
            ✍️ {t('connectionFeedback.tryWriting')}
          </p>
          {exercise.hints.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-1.5">
              {exercise.hints.map((h, i) => (
                <span key={i} className="text-xs px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300">
                  💡 {h}
                </span>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Short answer nudge */}
      {isShort && (
        <div className="p-2.5 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800">
          <p className="font-semibold text-amber-700 dark:text-amber-400">
            ✍️ {t('connectionFeedback.writeMore')}
          </p>
        </div>
      )}

      {/* AI feedback (placeholder — not wired to API yet) */}
      {aiFeedback && (
        <div className="p-2.5 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
          <p className="font-semibold text-blue-700 dark:text-blue-400 mb-0.5">
            🤖 {t('connectionFeedback.aiFeedback')}
          </p>
          <p className="text-blue-800 dark:text-blue-300 leading-relaxed">{aiFeedback}</p>
        </div>
      )}

      {/* Example answer */}
      <div className="p-2.5 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700">
        <p className="font-semibold text-gray-500 dark:text-gray-400 mb-0.5">
          📋 {t('connectionFeedback.exampleAnswer')}
        </p>
        <p className="text-gray-700 dark:text-gray-300 font-mono leading-relaxed">
          {exercise.exampleAnswer}
        </p>
      </div>
    </div>
  );
}
