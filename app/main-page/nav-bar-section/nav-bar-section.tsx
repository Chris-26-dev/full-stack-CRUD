"use client"

import DashboardNavBar1 from '@/app/components/nav-bar'
import { useOpenDialogForm } from '@/app/hooks/useOpenDialogForm';
import React from 'react'
import { IoAdd } from 'react-icons/io5';
import SearchDialog from './search-dialog';

function NavBarSection() {
  const { openDialog } = useOpenDialogForm();

  return (
    <div><DashboardNavBar1
      rightSection={[<SearchDialog key={"search-dialog"} />]}
      buttonData={{
        text: "Add User",
        icon: IoAdd,
        onClickedBtn: () => {
          openDialog();
        }
      }}
    /></div>
  )
}

export default NavBarSection