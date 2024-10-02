import React from 'react'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CContainer,
  CRow,
  CButton,
  CListGroup,
  CListGroupItem,
} from '@coreui/react'
import { cilCheck } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import './subscription.scss'

function Subscription() {
  const plans = [
    {
      name: 'Basic',
      price: '$9.99',
      features: ['1 User', '5 Projects', '5GB Storage', 'Basic Support'],
      color: 'info',
    },
    {
      name: 'Pro',
      price: '$24.99',
      features: ['5 Users', 'Unlimited Projects', '50GB Storage', 'Priority Support'],
      color: 'primary',
    },
    {
      name: 'Enterprise',
      price: '$49.99',
      features: ['Unlimited Users', 'Unlimited Projects', '500GB Storage', '24/7 Dedicated Support'],
      color: 'success',
    },
  ]

  return (
    <CContainer className="buy-plan-screen py-5">
      <CRow className="justify-content-center">
        <CCol xs={12}>
          <h1 className="text-center mb-5">Choose Your Plan</h1>
        </CCol>
      </CRow>
      <CRow className="justify-content-center">
        {plans.map((plan, index) => (
          <CCol xs={12} md={4} key={index} className="mb-4">
            <CCard className={`h-100 plan-card plan-card-${plan.color}`}>
              <CCardHeader className="text-center">
                <h3 className="mb-0">{plan.name}</h3>
              </CCardHeader>
              <CCardBody className="d-flex flex-column">
                <div className="text-center mb-4">
                  <span className="display-4">{plan.price}</span>
                  <span className="text-muted">/month</span>
                </div>
                <CListGroup flush className="flex-grow-1 mb-4">
                  {plan.features.map((feature, featureIndex) => (
                    <CListGroupItem key={featureIndex}>
                      <CIcon icon={cilCheck} className="me-2 text-success" />
                      {feature}
                    </CListGroupItem>
                  ))}
                </CListGroup>
                <CButton color={plan.color} size="lg" className="mt-auto">
                  Choose {plan.name}
                </CButton>
              </CCardBody>
            </CCard>
          </CCol>
        ))}
      </CRow>
    </CContainer>
  )
}

export default Subscription;