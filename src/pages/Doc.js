import React from 'react'
import { Link } from 'react-router-dom'
import { Document } from '../demo/Document'
import { AutoLogin } from '../components/NaturalRights'
import { UserActions } from '../components/UserActions'

export function Doc({
  match: {
    params: { documentId }
  }
}) {
  return (
    <AutoLogin>
      <Link to='/'>Homepage</Link>
      <hr />
      <UserActions />
      <hr />
      <Document documentId={documentId} />
    </AutoLogin>
  )
}
