/**
 * A database content_status=published is not the same as completion of this
 * module's separate 380-item subject-expert QA. The publication flag is
 * intentionally off by default and contains no secret data.
 */
export function m12PublicationApproved(value: string | undefined): boolean {
  return value === 'true'
}
export const M12_LEARNER_RELEASE_APPROVED =
  m12PublicationApproved(import.meta.env.VITE_M12_LEARNER_RELEASE_APPROVED)
