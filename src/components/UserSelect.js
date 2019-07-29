import React, { useCallback } from 'react'

export function UserSelect({ value, onSelectId }) {
  const onChangeInput = useCallback(
    evt => {
      onSelectId(evt.target.value)
    },
    [onSelectId]
  )

  return (
    <label>
      User ID
      <input type='text' value={value} onChange={onChangeInput} />
    </label>
  )
}
