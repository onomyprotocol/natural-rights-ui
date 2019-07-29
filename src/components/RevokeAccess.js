import React, { useCallback, useEffect, useState } from 'react'
import { useAsyncFn } from '../lib/use-async-fn'
import { DocumentSelect } from './DocumentSelect'
import { GranteeSelect } from './GranteeSelect'
import { useNaturalRights } from './NaturalRights'
import { ErrorDisplay } from './ErrorDisplay'

export function RevokeAccessForm({
  documentId: documentIdProp = '',
  id: idProp = '',
  kind: kindProp = 'group'
}) {
  const { gun } = useNaturalRights()

  const [{ documentId, kind, id }, setState] = useState({
    documentId: documentIdProp,
    id: idProp,
    kind: kindProp
  })

  const onSelectGrantee = useCallback(
    (gKind, gId) => setState(s => ({ ...s, kind: gKind, id: gId })),
    []
  )

  const onSelectDocumentId = useCallback(dId => setState(s => ({ ...s, documentId: dId })), [])

  const saveForm = useCallback(
    async evt => {
      evt.preventDefault()
      await gun
        .rights()
        .get(documentId)
        .rights()
        .revoke(kind, id)
    },
    [gun, documentId, kind, id]
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
    return <div>Revoking access...</div>
  }

  return (
    <form onSubmit={onSubmit}>
      {error && <ErrorDisplay error={error} />}
      {!documentIdProp && <DocumentSelect value={documentId} onSelectId={onSelectDocumentId} />}
      {!idProp && <GranteeSelect kind={kind} id={id} onSelect={onSelectGrantee} />}
      <button type='submit'>Revoke Access</button>
    </form>
  )
}
