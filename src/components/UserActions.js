import React from 'react'
import { useNaturalRights } from './NaturalRights'
import { AuthorizeDeviceForm } from './AuthorizeDeviceForm'

export function UserActions() {
  const { userId, logout } = useNaturalRights()

  return (
    <>
      {userId} <button onClick={logout}>Logout</button>
      <AuthorizeDeviceForm />
    </>
  )
}
