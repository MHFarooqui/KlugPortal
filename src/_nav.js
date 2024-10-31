import React from 'react'
import CIcon from '@coreui/icons-react'
import { cilAccountLogout, cilLockUnlocked, cilRoom } from '@coreui/icons'
import {
  cilBell,
  cilCalculator,
  cilChartPie,
  cilCursor,
  cilDescription,
  cilDrop,
  cilNotes,
  cilPencil,
  cilPeople,
  cilPuzzle,
  cilSpeedometer,
  cilStar,
  cilCloudUpload
} from '@coreui/icons'
import { CNavGroup, CNavItem, CNavTitle } from '@coreui/react'
import { SiGoogleclassroom } from "react-icons/si";
import { PiExamLight } from "react-icons/pi";


const _nav = [


  {
    component: CNavTitle,
    name: 'Settings',
  },
  {
    component: CNavItem,
    name: 'Teachers',
    to: '/teachers',
    icon: <CIcon icon={cilPeople} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Onboard users',
    to: '/OnBoardingSelection',
    icon: <CIcon icon={cilCloudUpload} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Create Test',
    to: '/createTest',
    icon: <PiExamLight className="nav-icon"/>,
  },
  // {
  //   component: CNavItem,
  //   name: 'Manage department',
  //   to: '/ManageClasses',
  //   icon: <SiGoogleclassroom className="nav-icon"/>,
  // },
  {
    component: CNavItem,
    name: ' Classes',
    to: '/Class',
    icon: <CIcon icon={cilRoom} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Logout',
    to: '/login',
    icon: <CIcon icon={cilAccountLogout} customClassName="nav-icon" />,
  },
]

export default _nav
