'use strict';

const moment = require('moment');

//TODO: Add the logic to update dates based upon params

/**
 * Creates a date ranger.
 * @constructor
 * @param options { Object }
 * @param options.minDate { Date } minimum date
 * @param options.maxDate { Date } maximum date
 * @param options.minDelta { Number } days between startDate and endDate
 */
function dateRanger( options ) {

  let initialDate = options.minDate || new Date();

  let startDate = moment( initialDate );
  let endDate = moment( initialDate ).add( options.minDelta, 'days');

  return {

    /**
     * Set the start date
     * @param date { Date }
     */
    set startDate( date ) {

      if (!date){
        return;
      }

      startDate = moment(date);

      let diff = startDate.diff( endDate, 'days' );
      endDate = diff > 0 ? moment(date) : startDate;

    },

    get startDate() {
      return moment(startDate).toDate();
    },

    /**
     * Set the end date
     * @param date { Date }
     */
    set endDate( date ) {

      if (!date){
        return;
      }

      endDate = moment( date );

      let diff = startDate.diff(endDate, 'days');

      startDate = diff < 0 ? startDate :  moment(date);

    },

    get endDate() {
      return moment(endDate).toDate();
    }

  };

}

module.exports = dateRanger;
