import React, { useCallback } from 'react'

import { useNaturalRights } from './hooks'

export function LoginForm() {
  const { userId, deviceId, signup } = useNaturalRights()

  const onSubmit = useCallback(evt => {
    if (evt) evt.preventDefault()
    signup()
  }, [])

  if (userId) return null

  return (
    <form onSubmit={onSubmit}>
      <div>
        Device ID:
        <pre>{deviceId}</pre>
      </div>
      <button type='submit'>Register New User</button>
    </form>
  )
}
