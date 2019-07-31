import React from 'react'
import { Header } from '../Header'
import { Document } from '../demo/Document'
import { AuthorizeDeviceForm } from '../components/AuthorizeDeviceForm'

function Homepage() {
  return (
    <>
      <Header />
      <AuthorizeDeviceForm style={{ display: 'inline' }} />
      <Document />
    </>
  )
}

export default Homepage
