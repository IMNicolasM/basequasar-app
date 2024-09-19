export default {
  'ileads': {
    'cms': {
      'sidebar': {
        'adminAssignments': 'Assignments',
        'adminPrevAssignments': 'Preview Assignments'
      },
      'create': {
        'config': 'Create New Config'
      },
      'edit': {
        'config': 'Update Config'
      },
      'title': {},
      'button': {},
      'table': {},
      'label': {
        'unlock': 'Unlock All Assigned Appointments',
        'lock': 'Lock All Assigned Appointments'
      },
      'form': {
        'apptdate': 'Appointment Date',
        'slrName': 'Sales Rep',
        'morning': 'Morning',
        'afternoon': 'Afternoon',
        'lateAfternoon': 'Late Afternoon',
        'evening': 'Evening',
        'brnId': 'Market',
        'rnkId': 'Grade',
        'dspId': 'Dsp Id',
        'milesTrip': 'Max Miles Trip',
        'milesHome': 'Max Miles From Home',
        'ignoreSlots': 'Ignore Slots',
        'ignoreRnkId': 'Ignore Grades',
        'daysSalesman': 'Sales Review Period (Days)',
        'costPerMile': 'Travel Cost per Mile ($)',
        'futureDistanceWeight': 'Future Route Efficiency (%)',
        'currentDistanceWeight': 'Next Appointment Proximity (%)',
        'profitWeight': 'Profit Priority (%)',
        'choosePreset': 'Choose a preset'
      },
      'messages': {
        'reassign': 'Re-calculate Assignments',
        'autoAssignerUpdate': 'The auto-assigner settings have been successfully updated',
        'autoAssignerNoUpdate': 'The auto-assigner settings could not be updated',
        'valuesBetween0to100': 'Only values between 0 and 100 are allowed.',
        'values0to100': 'Please enter a percentage value between 0 and 100.',
        'descProfit': 'Defines the importance of maximizing profit when assigning a salesperson to a lead. A higher value prioritizes leads with greater profit potential using the Salesman Past Sales data and the Expected Value (EV) for a Lead.',
        'descNextAppt': 'Indicates the weight in percentage given to the distance between the salesman\'s current location and the next lead\'s location. A higher value favors leads that are closer to the salesperson\'s current appointment or current location.',
        'descFutureAppt': 'Represents the importance of considering future appointments when assigning leads. A higher value prioritizes leads that align with the salesperson\'s upcoming schedule and travel routes like locked appointments and Follow-ups.',
        'descDaysSalesman': 'Sets the number of past days considered for evaluating the salesperson\'s performance. Choose between 7, 30, or 60 days to reflect different time frames of sales activity.',
        'descCostPerMile': 'Specifies the cost incurred for each mile traveled. This value is multiplied by the distance to calculate the total trip cost, helping to maximize profit in sales assignments.'
      },
      'validation': {},
    }
  }
}
