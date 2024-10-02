import { element } from 'prop-types'
import React from 'react'

const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard'))
const Colors = React.lazy(() => import('./views/theme/colors/Colors'))
const Typography = React.lazy(() => import('./views/theme/typography/Typography'))

// Base
const Accordion = React.lazy(() => import('./views/base/accordion/Accordion'))
const Breadcrumbs = React.lazy(() => import('./views/base/breadcrumbs/Breadcrumbs'))
const Cards = React.lazy(() => import('./views/base/cards/Cards'))
const Carousels = React.lazy(() => import('./views/base/carousels/Carousels'))
const Collapses = React.lazy(() => import('./views/base/collapses/Collapses'))
const ListGroups = React.lazy(() => import('./views/base/list-groups/ListGroups'))
const Navs = React.lazy(() => import('./views/base/navs/Navs'))
const Paginations = React.lazy(() => import('./views/base/paginations/Paginations'))
const Placeholders = React.lazy(() => import('./views/base/placeholders/Placeholders'))
const Popovers = React.lazy(() => import('./views/base/popovers/Popovers'))
const Progress = React.lazy(() => import('./views/base/progress/Progress'))
const Spinners = React.lazy(() => import('./views/base/spinners/Spinners'))
const Tabs = React.lazy(() => import('./views/base/tabs/Tabs'))
const Tables = React.lazy(() => import('./views/base/tables/Tables'))
const Tooltips = React.lazy(() => import('./views/base/tooltips/Tooltips'))

// Buttons
const Buttons = React.lazy(() => import('./views/buttons/buttons/Buttons'))
const ButtonGroups = React.lazy(() => import('./views/buttons/button-groups/ButtonGroups'))
const Dropdowns = React.lazy(() => import('./views/buttons/dropdowns/Dropdowns'))

//Forms
const ChecksRadios = React.lazy(() => import('./views/forms/checks-radios/ChecksRadios'))
const FloatingLabels = React.lazy(() => import('./views/forms/floating-labels/FloatingLabels'))
const FormControl = React.lazy(() => import('./views/forms/form-control/FormControl'))
const InputGroup = React.lazy(() => import('./views/forms/input-group/InputGroup'))
const Layout = React.lazy(() => import('./views/forms/layout/Layout'))
const Range = React.lazy(() => import('./views/forms/range/Range'))
const Select = React.lazy(() => import('./views/forms/select/Select'))
const Validation = React.lazy(() => import('./views/forms/validation/Validation'))

const Teachers =  React.lazy(() => import('./views/Teachers/teacher'))

// Icons

// Notifications

const TeacherDetails = React.lazy(() => import('./views/Teachers/teacherDetails'))
const Users = React.lazy(() => import('./views/users/users'))
const StudentOnBoard = React.lazy(() => import('./views/onBoarding/OnBoard'))
const Onboard = React.lazy(() => import('./views/onBoarding/OnboardingSelection'))
const ManageClass = React.lazy(() => import('./views/Teachers/ManageClass/Classes'))
const TestCreationPage = React.lazy(() => import('./views/ManageTests/CreateTests'))
const Widgets = React.lazy(() => import('./views/widgets/Widgets'))
const Announcement = React.lazy(() => import('./views/Announcements/Announcements'))
const AddClass = React.lazy(() => import('./views/ClassManagement/AddClass'))
const Subscription = React.lazy(() => import('./views/Subscription/Subscription'))
const classes = React.lazy(() => import('./views/Classes/StudentClasses'))

const routes = [
  { path: '/', exact: true, name: 'Home' },
  { path: '/Class', name: 'Classes', element: classes},
  { path: '/subscription', name: 'Subscription', element: Subscription},
  { path: '/teachers', name: 'Teachers', element: Teachers },
  { path: '/users', name: 'Users', element: Users },
  { path: '/announcements', name: 'Announcement', element: Announcement},
  { path: '/ManageClasses', name: 'ManageClass', element: AddClass},
  { path: '/OnBoardingSelection', name: 'OnBoardingSelection', element: Onboard },
  { path: '/createTest', name: 'TestCreationPage', element: TestCreationPage },
  { path: '/teacherDetails/:id', exact: true, name: 'TeacherDetails', element : TeacherDetails },
  { path: '/ManageClass', exact: true, name: 'ManageClass', element : ManageClass },
  { path: '/dashboard', name: 'Dashboard', element: Dashboard },
  { path: '/theme', name: 'Theme', element: Colors, exact: true },
  { path: '/theme/colors', name: 'Colors', element: Colors },
  { path: '/theme/typography', name: 'Typography', element: Typography },
  { path: '/base', name: 'Base', element: Cards, exact: true },
  { path: '/base/accordion', name: 'Accordion', element: Accordion },
  { path: '/base/breadcrumbs', name: 'Breadcrumbs', element: Breadcrumbs },
  { path: '/base/cards', name: 'Cards', element: Cards },
  { path: '/base/carousels', name: 'Carousel', element: Carousels },

  { path: '/widgets', name: 'Widgets', element: Widgets },
]

export default routes
