import React from 'react'
import { useNaturalRights } from './NaturalRights'

export function CurrentUser() {
  const { userId } = useNaturalRights()

  return (
    <>
      Current User ID:
      <pre>{userId}</pre>
    </>
  )
}
