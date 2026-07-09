import { Icon } from './Icon'

/** Speech bubble with a plus — "leave a note". */
export function NoteIcon() {
  return (
    <Icon size={20}>
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      <line x1="12" y1="8" x2="12" y2="14" />
      <line x1="9" y1="11" x2="15" y2="11" />
    </Icon>
  )
}

/** Downward tray — "save to a file". */
export function SaveIcon() {
  return (
    <Icon size={20}>
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </Icon>
  )
}

/** Upward tray — "load a file". */
export function LoadIcon() {
  return (
    <Icon size={20}>
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="17 8 12 3 7 8" />
      <line x1="12" y1="3" x2="12" y2="15" />
    </Icon>
  )
}

/** Paper plane — "submit feedback to the collector". */
export function SendIcon() {
  return (
    <Icon size={20}>
      <line x1="22" y1="2" x2="11" y2="13" />
      <polygon points="22 2 15 22 11 13 2 9 22 2" />
    </Icon>
  )
}

/** Check in a circle — "the send went through". */
export function SentIcon() {
  return (
    <Icon size={20}>
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </Icon>
  )
}

/** Question mark in a circle — "how does this work?". */
export function HelpIcon() {
  return (
    <Icon size={20}>
      <circle cx="12" cy="12" r="10" />
      <path d="M9.1 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </Icon>
  )
}

/** Clipboard with a check — "review mode". */
export function ReviewIcon() {
  return (
    <Icon size={20}>
      <path d="M9 4h6a1 1 0 0 1 1 1v1a1 1 0 0 1-1 1H9a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1z" />
      <path d="M8 5H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2" />
      <polyline points="9 14 11 16 15 12" />
    </Icon>
  )
}

export function CloseIcon() {
  return (
    <Icon size={14}>
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </Icon>
  )
}

export function CheckIcon() {
  return (
    <Icon size={14}>
      <polyline points="20 6 9 17 4 12" />
    </Icon>
  )
}

export function TrashIcon() {
  return (
    <Icon size={16}>
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
      <line x1="10" y1="11" x2="10" y2="17" />
      <line x1="14" y1="11" x2="14" y2="17" />
    </Icon>
  )
}

/** Six dots — the universal "grab here to drag" affordance. */
export function GripIcon() {
  return (
    <Icon size={14} fill="currentColor" stroke="none">
      <circle cx="9" cy="6" r="1.4" />
      <circle cx="15" cy="6" r="1.4" />
      <circle cx="9" cy="12" r="1.4" />
      <circle cx="15" cy="12" r="1.4" />
      <circle cx="9" cy="18" r="1.4" />
      <circle cx="15" cy="18" r="1.4" />
    </Icon>
  )
}

/** ◁| — jump to the first note. */
export function FirstIcon() {
  return (
    <Icon size={18}>
      <polygon points="19 20 9 12 19 4" fill="currentColor" stroke="none" />
      <line x1="5" y1="19" x2="5" y2="5" />
    </Icon>
  )
}

export function PrevIcon() {
  return (
    <Icon size={18}>
      <polyline points="15 18 9 12 15 6" />
    </Icon>
  )
}

export function NextIcon() {
  return (
    <Icon size={18}>
      <polyline points="9 18 15 12 9 6" />
    </Icon>
  )
}

/** |▷ — jump to the last note. */
export function LastIcon() {
  return (
    <Icon size={18}>
      <polygon points="5 4 15 12 5 20" fill="currentColor" stroke="none" />
      <line x1="19" y1="5" x2="19" y2="19" />
    </Icon>
  )
}

/** Eye — "include resolved notes while navigating". */
export function EyeIcon() {
  return (
    <Icon size={18}>
      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z" />
      <circle cx="12" cy="12" r="3" />
    </Icon>
  )
}
