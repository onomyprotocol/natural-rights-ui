import React, { useCallback } from 'react'

export function DocumentSelect({ value, onSelectId }) {
  const onChangeInput = useCallback(
    evt => {
      onSelectId(evt.target.value)
    },
    [onSelectId]
  )

  return (
    <label>
      Document ID
      <input type='text' value={value} onChange={onChangeInput} />
    </label>
  )
}
