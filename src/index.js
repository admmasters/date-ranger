'use strict';

const moment : moment.MomentStatic = require('moment');

//TODO: Add the logic to update dates based upon params

/**
 * Creates a date ranger.
 * @constructor
 * @param options { Object }
 * @param options.startDate { Date } start date
 * @param options.endDate { Date } end date
 * @param options.minDate { Date } minimum date
 * @param options.maxDate { Date } maximum date
 * @param options.minDelta { Number } days between startDate and endDate
 */
function dateRanger( options ) {

  let passedOptions = options || {};

  let initialDate = moment( passedOptions.startDate || new Date());
  let initialEndDate = moment( passedOptions.endDate || new Date());
  let delta = passedOptions.minDelta;

  let rangeTransformedDate = ( newDate )=> {

    if (passedOptions.minDate && moment(newDate).isBefore(passedOptions.minDate)){
      return moment(passedOptions.minDate);
    }

    else if(passedOptions.maxDate && moment(newDate).isAfter(passedOptions.maxDate)){
      return moment(passedOptions.maxDate);
    }

    return moment(newDate);

  };

  let startDate = rangeTransformedDate(initialDate);
  let endDate = rangeTransformedDate(initialEndDate);

  updateEndDate();

  function updateEndDate() {

    if ( delta && !isWithinMinDelta(startDate,endDate,delta) ){
      endDate = moment(startDate).add(delta, 'days');
    }

  }

  function updateStartDate() {

    if ( delta && !isWithinMinDelta(endDate,startDate,delta) ){
      startDate = moment(endDate).subtract(delta, 'days');
    }

  }

  return {

    /**
     * Set the start date
     * @param newDate { Date }
     */
    set startDate( newDate ) {

      if (!newDate){
        return;
      }

      startDate = rangeTransformedDate(newDate);
      updateEndDate();

    },

    /**
     * Returns the start date
     * @returns { Date }
     */
    get startDate() {
      return moment(startDate).toDate();
    },

    /**
     * Set the end date
     * @param newDate { Date }
     */
    set endDate( newDate ) {

      if (!newDate){
        return;
      }

      endDate = rangeTransformedDate( newDate );
      updateStartDate();

    },

    /**
     * Returns the end date
     * @returns { Date }
     */
    get endDate() {
      return moment(endDate).toDate();
    }

  };

}

function isWithinMinDelta( date1, date2, delta ) {

  let dateDelta = date1.diff(date2, 'days');
  return Math.abs(dateDelta) <= delta;

}

module.exports = dateRanger;
