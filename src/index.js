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

  let initialDate = moment( options.startDate || new Date());
  let initialEndDate = moment( options.endDate || new Date());
  let delta = options.minDelta;

  let rangeTransformedDate = ( newDate )=> {

    if (options.minDate && moment(newDate).isBefore(options.minDate)){
      return moment(options.minDate);
    }


    else if(options.maxDate && moment(newDate).isAfter(options.maxDate)){
      return moment(options.maxDate);
    }

    return moment(newDate);

  };

  let startDate = rangeTransformedDate(initialDate);
  let endDate = rangeTransformedDate(initialEndDate);

  if ( delta && !isWithinMinDelta(startDate,endDate,delta) ){
    endDate = moment(startDate).add(delta, 'days');
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
