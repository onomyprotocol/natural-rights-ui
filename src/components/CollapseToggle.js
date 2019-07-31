import { useState, useCallback } from 'react'

export function CollapseToggle({ collapsed = () => null, expanded = () => null }) {
  const [isExpanded, setExpanded] = useState(false)
  const toggleExpanded = useCallback(() => setExpanded(x => !x), [])

  if (isExpanded) return expanded(toggleExpanded)
  return collapsed(toggleExpanded)
}
