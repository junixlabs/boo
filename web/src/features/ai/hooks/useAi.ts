import { useMutation } from '@tanstack/react-query'
import { aiApi } from '../api/ai.api'
import type { AiWeeklySummaryRequest, AiSuggestPrioritiesRequest, AiReviewPromptRequest } from '../types'

export function useWeeklySummary() {
  return useMutation({
    mutationFn: (data: AiWeeklySummaryRequest) =>
      aiApi.weeklySummary(data).then((r) => r.data.data),
  })
}

export function useSuggestPriorities() {
  return useMutation({
    mutationFn: (data: AiSuggestPrioritiesRequest) =>
      aiApi.suggestPriorities(data).then((r) => r.data.data),
  })
}

export function useReviewPrompt() {
  return useMutation({
    mutationFn: (data: AiReviewPromptRequest) =>
      aiApi.reviewPrompt(data).then((r) => r.data.data),
  })
}
