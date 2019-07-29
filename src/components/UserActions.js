import React from 'react'
import { CreateGroupForm } from './CreateGroupForm'
import { useNaturalRights } from './NaturalRights'

export function UserActions() {
  const { userId } = useNaturalRights()

  return (
    <>
      <pre>User ID: {userId}</pre>
      <hr />
      <CreateGroupForm />
    </>
  )
}
