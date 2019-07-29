import React, { useCallback, useEffect, useState } from 'react'
import { useAsyncFn } from '../lib/use-async-fn'
import { DocumentSelect } from './DocumentSelect'
import { GranteeSelect } from './GranteeSelect'
import { useNaturalRights } from './NaturalRights'
import { ErrorDisplay } from './ErrorDisplay'

export function GrantAccessForm({
  documentId: documentIdProp = '',
  id: idProp = '',
  kind: kindProp = 'group'
}) {
  const { gun } = useNaturalRights()

  const [{ documentId, kind, id, readAccess, signAccess }, setState] = useState({
    documentId: documentIdProp,
    id: idProp,
    kind: kindProp,
    readAccess: true,
    signAccess: true
  })

  const onSelectGrantee = useCallback(
    (gKind, gId) => setState(s => ({ ...s, kind: gKind, id: gId })),
    []
  )

  const onSelectDocumentId = useCallback(dId => setState(s => ({ ...s, documentId: dId })), [])

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
      await gun
        .rights()
        .get(documentId)
        .rights()
        .grant(kind, id, {
          read: readAccess,
          sign: signAccess
        })
    },
    [documentId, readAccess, kind, id, signAccess, gun]
  )

  const [onSubmit, isWorking, error] = useAsyncFn(saveForm)

  useEffect(() => {
    setState(s => ({
      ...s,
      id: idProp,
      kind: kindProp
    }))
  }, [kindProp, idProp])

  useEffect(() => {
    setState(s => ({
      ...s,
      documentId: documentIdProp
    }))
  }, [documentIdProp])

  if (isWorking) {
    return <div>Adding group member...</div>
  }

  return (
    <form onSubmit={onSubmit}>
      {error && <ErrorDisplay error={error} />}
      {!idProp && <GranteeSelect kind={kind} id={id} onSelect={onSelectGrantee} />}
      {!documentIdProp && <DocumentSelect value={documentId} onSelectId={onSelectDocumentId} />}
      <label>
        Read
        <input type='checkbox' checked={readAccess} onChange={onChangeReadAccess} />
      </label>
      <label>
        Write
        <input type='checkbox' checked={signAccess} onChange={onChangeSignAccess} />
      </label>
      <button type='submit'>Grant Access</button>
    </form>
  )
}
