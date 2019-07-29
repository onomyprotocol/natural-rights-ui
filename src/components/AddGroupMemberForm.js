import React, { useCallback, useEffect, useState } from 'react'
import { useAsyncFn } from '../lib/use-async-fn'
import { GroupSelect } from './GroupSelect'
import { useNaturalRights } from './NaturalRights'
import { UserSelect } from './UserSelect'
import { ErrorDisplay } from './ErrorDisplay'

export function AddGroupMemberForm({ groupId: groupIdProp = '', userId: userIdProp = '' }) {
  const { gun } = useNaturalRights()
  const [{ groupId, readAccess, userId, signAccess }, setState] = useState({
    groupId: groupIdProp,
    readAccess: true,
    signAccess: true,
    userId: userIdProp
  })

  const onSelectGroupId = useCallback(gId => setState(s => ({ ...s, groupId: gId })), [])

  const onSelectUserId = useCallback(uId => setState(s => ({ ...s, userId: uId })), [])

  const onChangeReadAccess = useCallback(evt => {
    const { checked } = evt.target
    setState(s => ({
      ...s,
      readAccess: checked,
      signAccess: checked && s.signAccess
    }))
  }, [])

  const onChangeSignAccess = useCallback(evt => {
    const { checked } = evt.target
    setState(s => ({
      ...s,
      readAccess: checked || s.readAccess,
      signAccess: checked
    }))
  }, [])

  const saveForm = useCallback(
    async evt => {
      evt.preventDefault()
      await gun.rights().addGroupMember(groupId, userId, {
        admin: false,
        read: readAccess,
        sign: signAccess
      })
    },
    [gun, groupId, readAccess, userId, signAccess]
  )

  const [onSubmit, isWorking, error] = useAsyncFn(saveForm)

  useEffect(() => {
    setState(s => ({
      ...s,
      groupId: groupIdProp
    }))
  }, [groupIdProp])

  useEffect(() => {
    setState(s => ({
      ...s,
      userId: userIdProp
    }))
  }, [userIdProp])

  if (isWorking) {
    return <div>Adding group member...</div>
  }

  return (
    <form onSubmit={onSubmit}>
      {error && <ErrorDisplay error={error} />}
      {!groupIdProp && <GroupSelect value={groupId} onSelectId={onSelectGroupId} />}
      {!userIdProp && <UserSelect value={userId} onSelectId={onSelectUserId} />}
      <label>
        Read
        <input type='checkbox' checked={readAccess} onChange={onChangeReadAccess} />
      </label>
      <label>
        Write
        <input type='checkbox' checked={signAccess} onChange={onChangeSignAccess} />
      </label>
      <button type='submit'>Add Member</button>
    </form>
  )
}
