import React from 'react'
import { Badge, Button } from 'react-bootstrap'
import { PlanningButtonType } from '../../definitions/ComponentType'


export default function PlanningButton({ planningButtonProps }: { planningButtonProps: PlanningButtonType }) {
  const { ordersForConnaissement, handleShowSearchPlanning } = planningButtonProps
  return (
    <React.Fragment>
      {ordersForConnaissement?.length > 0 && (
        <Badge
          bg='dark'
          className='m-auto p fab2 rounded-circle primary-colo'
          onClick={handleShowSearchPlanning}
        >
          {ordersForConnaissement?.length}
        </Badge>
      )}
      <Button className='m-auto fab rounded-pill button-primary ' 
      onClick={handleShowSearchPlanning}
      >
        <i className='ri-sailboat-fill'></i> Planning
      </Button>
    </React.Fragment>
  )
}
