import React from 'react'
import { AutoLogin } from '../components/NaturalRights'
import { UserActions } from '../components/UserActions'
import { Document } from '../demo/Document'

function Homepage() {
  return (
    <AutoLogin>
      <UserActions />
      <hr />
      <Document />
    </AutoLogin>
  )
}

export default Homepage
