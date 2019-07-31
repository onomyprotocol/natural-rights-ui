/* eslint-disable react/jsx-max-depth */
import React, { useState, useCallback, useEffect, useMemo } from 'react'
import { Header } from '../Header'
import { useNaturalRights } from '../components/NaturalRights'
import { AuthorizeDeviceForm } from '../components/AuthorizeDeviceForm'
import { CreateGroupForm } from '../components/CreateGroupForm'

const DEFAULT_PROFILE = {
  name: ''
}

export function MyProfile() {
  const { deviceId, userId, gun } = useNaturalRights()

  const [profileNode, setProfileNode] = useState(DEFAULT_PROFILE)
  const chain = useMemo(
    () =>
      gun
        .rights()
        .root()
        .get('profile'),
    [gun]
  )

  const onChangeName = useCallback(evt => {
    const name = evt.target.value
    setProfileNode(n => ({ ...n, name }))
  })

  const onSubmit = useCallback(
    evt => {
      if (evt) evt.preventDefault()
      return new Promise((ok, fail) =>
        chain.put(profileNode, ack => {
          if (ack.err) fail(ack)
          ok(ack)
        })
      )
    },
    [profileNode]
  )

  useEffect(() => {
    chain.on(node => node && setProfileNode(node))
  }, [chain])

  return (
    <>
      <Header />
      <form onSubmit={onSubmit}>
        <fieldset>
          <legend>My Profile</legend>
          <div>
            <label>
              Name
              <input value={profileNode.name || ''} onChange={onChangeName} />
            </label>
          </div>
          <button type='submit'>Save</button>
        </fieldset>
      </form>
      <pre>User ID: {userId}</pre>
      <pre>Device ID: {deviceId}</pre>
      <AuthorizeDeviceForm />
      <hr />
      <CreateGroupForm />
    </>
  )
}
