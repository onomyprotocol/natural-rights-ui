import React, { useCallback } from 'react'
import { GroupSelect } from './GroupSelect'
import { UserSelect } from './UserSelect'

export function GranteeSelect({ id = '', kind = 'group', onSelect = () => null }) {
  const setId = useCallback(newId => onSelect(kind, newId), [kind])

  return (
    <>
      {kind === 'group' && <GroupSelect value={id} onSelectId={setId} />}
      {kind === 'user' && <UserSelect value={id} onSelectId={setId} />}
    </>
  )
}
