import React from 'react'
import { Header } from '../Header'
import { Document } from '../demo/Document'

export function Doc({
  match: {
    params: { documentId }
  }
}) {
  return (
    <>
      <Header />
      <Document documentId={documentId} />
    </>
  )
}
