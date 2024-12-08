import React from 'react'
import { CFooter } from '@coreui/react'

const AppFooter = () => {
  return (
    <CFooter className="px-4">
      <div>
        {/* <a href="https://coreui.io" target="_blank" rel="noopener noreferrer">
          Klug
        </a> */}
        {/* <span className="ms-1">&copy; 2024 .</span> */}
      </div>
      <div className="ms-auto">
        {/* <span className="me-1">Product of</span> */}
          Ellasca soft.
      </div>
    </CFooter>
  )
}

export default React.memo(AppFooter)
