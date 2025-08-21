'use client'

import React from 'react'
import NavBarSection from './main-page/nav-bar-section/nav-bar-section'
import AppName from './components/app-name'
import StatsSection from './main-page/stats-section/stats-section'
import DataTableSection from './main-page/data-table-section.tsx/data-table'

function page() {
  return (
    <div>
      <NavBarSection />
      <StatsSection />
      <DataTableSection />
    </div>
  )
}

export default page