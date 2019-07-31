import React, { useCallback } from 'react'

export function DeviceSelect({ value, onSelectId, placeholder = 'Device ID' }) {
  const onChangeInput = useCallback(
    evt => {
      onSelectId(evt.target.value)
    },
    [onSelectId]
  )

  return <input type='text' placeholder={placeholder} value={value} onChange={onChangeInput} />
}
