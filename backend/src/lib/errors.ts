import type { FastifyReply } from 'fastify'

export class AppError extends Error {
  constructor(
    message: string,
    readonly statusCode: number = 400,
    readonly code: string = 'BAD_REQUEST'
  ) {
    super(message)
    this.name = 'AppError'
  }
}

export class NotFoundError extends AppError {
  constructor(message = 'Resurs topilmadi') {
    super(message, 404, 'NOT_FOUND')
    this.name = 'NotFoundError'
  }
}

export class AuthError extends AppError {
  constructor(message = 'Avtorizatsiyadan o\'tmagansiz') {
    super(message, 401, 'UNAUTHORIZED')
    this.name = 'AuthError'
  }
}

export class ForbiddenError extends AppError {
  constructor(message = 'Ruxsat yo\'q') {
    super(message, 403, 'FORBIDDEN')
    this.name = 'ForbiddenError'
  }
}

interface ErrorResponse {
  error: {
    code: string
    message: string
    details?: unknown
  }
}

export function sendError(reply: FastifyReply, error: unknown) {
  if (error instanceof AppError) {
    return reply.status(error.statusCode).send({
      error: {
        code: error.code,
        message: error.message,
      },
    } satisfies ErrorResponse)
  }

  // Fastify validation error
  if (error && typeof error === 'object' && 'validation' in error) {
    return reply.status(400).send({
      error: {
        code: 'VALIDATION_ERROR',
        message: 'So\'rov ma\'lumotlari noto\'g\'ri',
        details: (error as { validation: unknown }).validation,
      },
    } satisfies ErrorResponse)
  }

  // Unknown error
  console.error('[ERROR]', error)
  return reply.status(500).send({
    error: {
      code: 'INTERNAL_ERROR',
      message: 'Serverda kutilmagan xato yuz berdi',
    },
  } satisfies ErrorResponse)
}
