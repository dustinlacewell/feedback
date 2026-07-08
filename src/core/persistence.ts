/**
 * Persistence: the feedback document survives in `localStorage` between
 * visits, and can be exported to / imported from a single JSON file so a
 * reviewer can send their notes to whoever owns the page.
 *
 * The file dialogs prefer the File System Access API where it exists
 * (Chromium) and fall back to a plain download / hidden input elsewhere
 * (Firefox, Safari).
 */

import { EMPTY_DOC, normalizeDoc, type FeedbackDoc } from './document'

export function readDoc(storageKey: string): FeedbackDoc {
  if (typeof window === 'undefined') return EMPTY_DOC
  try {
    return normalizeDoc(JSON.parse(window.localStorage.getItem(storageKey) ?? '{}'))
  } catch {
    return EMPTY_DOC
  }
}

export function writeDoc(storageKey: string, doc: FeedbackDoc): void {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(storageKey, JSON.stringify(doc))
  } catch (err) {
    console.error('[feedback] failed to persist', err)
  }
}

/** Save the whole document to one JSON file. */
export async function exportDoc(doc: FeedbackDoc, fileName: string): Promise<void> {
  const payload = JSON.stringify({ exportedAt: new Date().toISOString(), ...doc }, null, 2)
  if (await saveViaPicker(payload, fileName)) return
  saveViaDownload(payload, fileName)
}

/** Open a saved file and parse it into a document, or null if cancelled. */
export async function importDoc(): Promise<FeedbackDoc | null> {
  const file = await pickFile()
  if (!file) return null
  try {
    return normalizeDoc(JSON.parse(await file.text()))
  } catch {
    return EMPTY_DOC
  }
}

// --- File System Access API shims (typed narrowly, feature-detected) ---

interface WritableFileStreamLike {
  write: (data: string) => Promise<void>
  close: () => Promise<void>
}
interface SaveHandleLike {
  createWritable: () => Promise<WritableFileStreamLike>
}
interface OpenHandleLike {
  getFile: () => Promise<File>
}
interface PickerTypes {
  suggestedName?: string
  multiple?: boolean
  types?: { description?: string; accept: Record<string, string[]> }[]
}
type SaveFilePicker = (options?: PickerTypes) => Promise<SaveHandleLike>
type OpenFilePicker = (options?: PickerTypes) => Promise<OpenHandleLike[]>

const JSON_TYPES = [{ description: 'JSON', accept: { 'application/json': ['.json'] } }]

/** Returns true when the save was handled (written, or the dialog cancelled). */
async function saveViaPicker(text: string, fileName: string): Promise<boolean> {
  const picker = (window as unknown as { showSaveFilePicker?: SaveFilePicker }).showSaveFilePicker
  if (typeof picker !== 'function') return false
  try {
    const handle = await picker({ suggestedName: fileName, types: JSON_TYPES })
    const writable = await handle.createWritable()
    await writable.write(text)
    await writable.close()
    return true
  } catch (err) {
    // Dismissing the dialog is a completed choice, not a reason to fall back.
    if (err instanceof DOMException && err.name === 'AbortError') return true
    return false
  }
}

function saveViaDownload(text: string, fileName: string): void {
  const url = URL.createObjectURL(new Blob([text], { type: 'application/json' }))
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = fileName
  anchor.click()
  URL.revokeObjectURL(url)
}

async function pickFile(): Promise<File | null> {
  const picker = (window as unknown as { showOpenFilePicker?: OpenFilePicker }).showOpenFilePicker
  if (typeof picker === 'function') {
    try {
      const [handle] = await picker({ multiple: false, types: JSON_TYPES })
      return handle ? await handle.getFile() : null
    } catch (err) {
      if (err instanceof DOMException && err.name === 'AbortError') return null
      // Any other failure: fall through to the input fallback.
    }
  }
  return pickViaInput()
}

/** Fallback for browsers without the File System Access API. */
function pickViaInput(): Promise<File | null> {
  return new Promise((resolve) => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'application/json,.json'
    input.addEventListener('change', () => resolve(input.files?.[0] ?? null), { once: true })
    input.click()
  })
}
