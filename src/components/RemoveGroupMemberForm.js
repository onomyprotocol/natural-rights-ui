import React, { useCallback, useEffect, useState } from 'react'
import { useAsyncFn } from '../lib/use-async-fn'
import { GroupSelect } from './GroupSelect'
import { useNaturalRights } from './NaturalRights'
import { UserSelect } from './UserSelect'
import { ErrorDisplay } from './ErrorDisplay'

export function RemoveGroupMemberForm({ groupId: groupIdProp = '', userId: userIdProp = '' }) {
  const { gun } = useNaturalRights()
  const [{ groupId, userId }, setState] = useState({
    groupId: groupIdProp,
    userId: userIdProp
  })

  const onSelectGroupId = useCallback(gId => setState(s => ({ ...s, groupId: gId })), [])

  const onSelectUserId = useCallback(uId => setState(s => ({ ...s, userId: uId })), [])

  const saveForm = useCallback(
    async evt => {
      evt.preventDefault()
      await gun.rights().removeGroupMember(groupId, userId)
    },
    [groupId, userId, gun]
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
    return <div>Removing group member...</div>
  }

  return (
    <form onSubmit={onSubmit}>
      {error && <ErrorDisplay error={error} />}
      {!groupIdProp && <GroupSelect value={groupId} onSelectId={onSelectGroupId} />}
      {!userIdProp && <UserSelect value={userId} onSelectId={onSelectUserId} />}
      <button type='submit'>Remove Member</button>
    </form>
  )
}
