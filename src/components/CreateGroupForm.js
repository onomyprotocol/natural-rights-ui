import React, { useCallback, useState } from 'react'
import { useAsyncFn } from '../lib/use-async-fn'
import { AddGroupMemberForm } from './AddGroupMemberForm'
import { useNaturalRights } from './NaturalRights'
import { RemoveGroupMemberForm } from './RemoveGroupMemberForm'
import { ErrorDisplay } from './ErrorDisplay'

export function CreateGroupForm() {
  const { gun } = useNaturalRights()

  const createGroup = useCallback(() => gun.rights().createGroup(), [gun])
  const [doCreateGroup, isWorking, error] = useAsyncFn(createGroup)
  const [createdGroupId, setCreatedGroupId] = useState(null)

  const onSubmit = useCallback(
    async evt => {
      evt.preventDefault()
      setCreatedGroupId(await doCreateGroup())
    },
    [doCreateGroup]
  )

  if (isWorking) {
    return <div>Creating group...</div>
  }

  return (
    <>
      <form onSubmit={onSubmit}>
        {error && <ErrorDisplay error={error} />}
        <button type='submit'>Create Group</button>
      </form>
      {createdGroupId && (
        <section>
          <p>Created group</p>
          <pre>{createdGroupId}</pre>
          <AddGroupMemberForm groupId={createdGroupId} />
          <RemoveGroupMemberForm groupId={createdGroupId} />
        </section>
      )}
    </>
  )
}
