import { filter, get, map, slice, split, trim } from "lodash";
import { getFolderSystem, getSettings } from "./setting"
import fs from 'node:fs'
import { ClearHistory, ClearHistoryType } from "../src/types/window";

export const getHistory = () => {
  try {
    const { history } = getFolderSystem()
    const historyData = fs.readFileSync(history, 'utf8');
    const lines = split(historyData, '\n').map(line => line.trim()).filter(line => line !== '');
    const last100Lines = slice(lines, -1000)
    return map(last100Lines, (line) => {
      const [profileId, postUrl, createdAt] = split(line, '||');
      return {
        profile_id: trim(profileId),
        post_url: trim(postUrl),
        created_at: trim(createdAt)
      }
    })
  } catch (error) {
    console.error(error)
    return []
  }
}

export const getHistoryByProfileId = ({ profileId, limit = 10 }: { profileId: string, limit?: number }) => {
  const history = getHistory()
  const profileHistory = filter(history, (history) => history.profile_id === profileId)
  return slice(profileHistory, -limit)
}

export const getRandomUrlByProfileId = ({ profileId }: { profileId: string }) => {
  const histories = getHistoryByProfileId({ profileId })
  const historyUrls = map(histories, (history) => history.post_url)

  const settings = getSettings()
  const urls = settings.urls

  // get urls exclude historyUrls
  const urlsExcludeHistoryUrls = filter(urls, (url) => !historyUrls.includes(url.value))
  return get(urlsExcludeHistoryUrls, '[0].value', '')
}

export const clearHistory = ({ type }: ClearHistory) => {
  const history = getHistory()
  const { history: historyPath } = getFolderSystem()
  const filteredHistory = filter(history, (history) => {
    const createdAt = new Date(history.created_at)
    const now = new Date()

    switch (type) {
      case ClearHistoryType.ALL:
        return false // Keep none (clear all)
      case ClearHistoryType.TODAY:
        return createdAt.toDateString() !== now.toDateString() // Keep records NOT from today

      case ClearHistoryType.YESTERDAY: {
        const yesterday = new Date(now)
        yesterday.setDate(now.getDate() - 1)
        return createdAt.toDateString() !== yesterday.toDateString() // Keep records NOT from yesterday
      }

      case ClearHistoryType.LAST_3_DAYS:
        return createdAt < new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000) // Keep records older than 3 days

      case ClearHistoryType.LAST_7_DAYS:
        return createdAt < new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000) // Keep records older than 7 days

      case ClearHistoryType.LAST_30_DAYS:
        return createdAt < new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000) // Keep records older than 30 days

      case ClearHistoryType.LAST_60_DAYS:
        return createdAt < new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000) // Keep records older than 60 days

      default:
        return true // Keep all (don't clear anything)
    }
  })

  const historyData = filteredHistory.map(history => `${history.profile_id}||${history.post_url}||${history.created_at}`).join('\n')
  fs.writeFileSync(historyPath, historyData)
}