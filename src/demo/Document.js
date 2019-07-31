import React, { useCallback, useEffect, useState } from 'react'
import { withRouter, Link } from 'react-router-dom'
import { CollapseToggle } from '../components/CollapseToggle'
import { GrantAccessForm } from '../components/GrantAccessForm'
import { useNaturalRights } from '../components/NaturalRights'
import { RevokeAccessForm } from '../components/RevokeAccess'

function DocumentBase({ history, documentId: documentIdProp = '' }) {
  const { gun } = useNaturalRights()
  const [node, setNode] = useState(null)
  const [documentId, setDocumentId] = useState(documentIdProp)
  const decryptError = node && node.decryptError
  const data = node && node.data
  const [edited, setEdited] = useState('')

  const onChange = useCallback(evt => {
    setEdited(evt.target.value)
  }, [])

  const onSubmit = useCallback(
    async evt => {
      evt.preventDefault()
      let id = documentId
      if (!id) {
        id = await gun.rights().create()
        setDocumentId(id)
      }

      gun
        .rights()
        .get(id)
        .put({
          data: edited
        })

      if (!documentIdProp) history.push(`/doc/${id}`)
    },
    [edited, gun, documentId]
  )

  useEffect(() => {
    if (!documentId) {
      return
    }
    gun
      .rights()
      .get(documentId)
      // eslint-disable-next-line max-nested-callbacks
      .on(updated => {
        if (updated) {
          setNode({ ...updated })
        }
      })
  }, [documentId])

  useEffect(() => {
    if (documentIdProp && documentId !== documentIdProp) {
      setDocumentId(documentIdProp)
    }
  }, [documentIdProp])

  return (
    <>
      {documentId && (
        <>
          <h4>
            Document: <Link to={`/doc/${documentId}`}>{documentId}</Link>
          </h4>
          {decryptError ? <h1>No Document Access</h1> : <>{data && <pre>{data}</pre>}</>}
        </>
      )}
      {decryptError ? null : (
        <CollapseToggle
          collapsed={expand => (
            <button onClick={expand}>{documentId ? 'Edit' : 'Create'} Document</button>
          )}
          expanded={collapse => (
            <form onSubmit={onSubmit}>
              <fieldset>
                <legend onClick={collapse}>{documentId ? 'Edit' : 'Create'} Document</legend>
                <textarea value={edited} onChange={onChange} cols={80} rows={5} />
                <br />
                <button onClick={collapse}>Cancel</button>
                <button type='submit'>{documentId ? 'Edit' : 'Create'} Document</button>
              </fieldset>
            </form>
          )}
        />
      )}
      {documentId && !decryptError && (
        <CollapseToggle
          collapsed={expand => <button onClick={expand}>Manage Access</button>}
          expanded={collapse => (
            <fieldset>
              <legend onClick={collapse}>Manage Access</legend>
              <GrantAccessForm documentId={documentId} kind='user' />
              <RevokeAccessForm documentId={documentId} kind='user' />
              <GrantAccessForm documentId={documentId} kind='group' />
              <RevokeAccessForm documentId={documentId} kind='group' />
            </fieldset>
          )}
        />
      )}
    </>
  )
}

export const Document = withRouter(DocumentBase)
