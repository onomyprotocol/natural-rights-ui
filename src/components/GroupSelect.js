import React, { useCallback } from 'react'

export function GroupSelect({ value, onSelectId }) {
  const onChangeInput = useCallback(
    evt => {
      onSelectId(evt.target.value)
    },
    [onSelectId]
  )

  return (
    <label>
      Group ID
      <input type='text' value={value} onChange={onChangeInput} />
    </label>
  )
}
