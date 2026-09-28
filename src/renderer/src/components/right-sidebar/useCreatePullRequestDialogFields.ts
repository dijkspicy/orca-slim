import { useCallback, useRef, useState } from 'react'
import { resolveSourceControlAiForOperation } from '../../../../shared/source-control-ai'
import type {
  PullRequestFieldName,
  PullRequestFieldRevisions
} from '@/store/slices/pull-request-generation'
import { stripBaseRef } from './create-pull-request-base-ref-normalization'
import {
  createInitialPullRequestFieldRevisions,
  type PullRequestDraftFields,
  type UseCreatePullRequestDialogFieldsOptions
} from './create-pull-request-dialog-field-model'

export function useCreatePullRequestDialogFields({
  repo,
  settings,
  sourceControlAiActionsVisible = true
}: UseCreatePullRequestDialogFieldsOptions) {
  const resolvedPullRequestAi = settings
    ? resolveSourceControlAiForOperation({
        settings,
        repo,
        operation: 'pullRequest'
      })
    : null
  const fieldRevisionsRef = useRef<PullRequestFieldRevisions>(undefined!)
  fieldRevisionsRef.current ??= createInitialPullRequestFieldRevisions()
  const [base, setBase] = useState('')
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [draft, setDraft] = useState(false)
  const [baseQuery, setBaseQuery] = useState('')
  const [baseResults, setBaseResults] = useState<string[]>([])
  // Why: lets the picker withhold "no branches match" until a search settles, so
  // the debounce and an SSH round-trip can't read as an observed absence.
  const [baseSearchPending] = useState(false)
  const [baseSearchError] = useState<string | null>(null)
  const markFieldDirty = useCallback((field: PullRequestFieldName): void => {
    fieldRevisionsRef.current = {
      ...fieldRevisionsRef.current,
      [field]: fieldRevisionsRef.current[field] + 1
    }
  }, [])

  const setUserBase = useCallback(
    (value: string): void => {
      baseEditedByUserRef.current = true
      markFieldDirty('base')
      setBase(value)
    },
    [markFieldDirty]
  )
  const setUserTitle = useCallback(
    (value: string): void => {
      markFieldDirty('title')
      setTitle(value)
    },
    [markFieldDirty]
  )
  const setUserBody = useCallback(
    (value: string): void => {
      markFieldDirty('body')
      setBody(value)
    },
    [markFieldDirty]
  )
  const setUserDraft = useCallback(
    (value: boolean): void => {
      markFieldDirty('draft')
      setDraft(value)
    },
    [markFieldDirty]
  )

  const applyGeneratedFields = useCallback(
    (
      fields: PullRequestDraftFields,
      seedRevisions: PullRequestFieldRevisions
    ): PullRequestDraftFields => {
      const currentRevisions = fieldRevisionsRef.current
      const nextFields = { base, title, body, draft }
      // Why: AI generation runs asynchronously; only fields untouched since
      // the request started are safe to replace with generated output.
      if (currentRevisions.base === seedRevisions.base) {
        nextFields.base = stripBaseRef(fields.base)
        setBase(nextFields.base)
        setBaseQuery('')
        setBaseResults([])
      }
      if (currentRevisions.title === seedRevisions.title) {
        nextFields.title = fields.title
        setTitle(fields.title)
      }
      if (currentRevisions.body === seedRevisions.body) {
        nextFields.body = fields.body
        setBody(fields.body)
      }
      if (currentRevisions.draft === seedRevisions.draft) {
        nextFields.draft = fields.draft
        setDraft(fields.draft)
      }
      return nextFields
    },
    [base, body, draft, title]
  )

  // PR field seeding, base-ref discovery, and AI field generation were part of
  // the hosted-forge creation flow and are gone; the dialog shell keeps inert
  // values so the surviving form keeps compiling until it is removed with it.
  const repoDefaultBaseRef = null
  const effectiveGenerating = false
  const effectiveGenerateError = null
  const generateDisabled = true
  const generateDisabledReason = undefined
  const handleGenerate = async (): Promise<void> => {}
  const handleCancelGenerate = (): void => {}

  return {
    aiGenerationEnabled: sourceControlAiActionsVisible && resolvedPullRequestAi?.ok === true,
    initializedFromEligibility: false,
    base,
    setBase: setUserBase,
    title,
    setTitle: setUserTitle,
    body,
    setBody: setUserBody,
    draft,
    setDraft: setUserDraft,
    stackedCreationSupported: eligibility?.stackedCreationSupported === true,
    repoDefaultBaseRef,
    fieldRevisions: fieldRevisionsRef.current,
    applyGeneratedFields,
    baseQuery,
    setBaseQuery,
    baseResults,
    setBaseResults,
    baseSearchPending,
    baseSearchError,
    generating: effectiveGenerating,
    generateError: effectiveGenerateError,
    generateDisabled,
    generateDisabledReason,
    handleGenerate,
    handleCancelGenerate
  }
}
