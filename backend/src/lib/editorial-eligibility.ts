/** Only authenticated human editorial reviews may authorize publication. */
export function isEditorialReviewEligible(
  groupCode: string | null | undefined,
  sourceReference: string | null | undefined,
): boolean {
  return ['KS','PM.GEN','PM.MET'].includes(groupCode ?? '') ||
    Boolean(sourceReference?.startsWith('authored:pedguli-')) ||
    Boolean(sourceReference?.startsWith('authored:pedagogy-pdf-corpus:')) ||
    Boolean(sourceReference?.startsWith('MSACCESS-DEMO-STYLE-2026/'))
}
