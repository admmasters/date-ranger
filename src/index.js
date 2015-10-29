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

  const passedOptions = options || {};

  const delta = passedOptions.minDelta || 0;

  const minDate = moment( passedOptions.minDate );
  const minEndDate = minDate.add( delta, 'days');

  const maxDate = moment( passedOptions.maxDate );
  const maxStartDate = maxDate.subtract( delta, 'days');

  const initialDate = moment( passedOptions.startDate || new Date());
  const initialEndDate = moment( passedOptions.endDate || new Date());

  const boundRangeTransformedDate = rangeTransformedDate.bind(null,options.minDate,options.maxDate);
  const boundDeltaAdjustedMinEndDate = deltaAdjustedNewMinEndDate.bind(null,delta,minEndDate);
  const boundDeltaAdjustedMaxStartDate = deltaAdjustedNewMaxStartDate.bind(null,delta,maxStartDate);

  const lowerRangeDateProcessor = lowerRangeDate => moment(lowerRangeDate).add(delta, 'days');
  const upperRangeDateProcessor = upperRangeDate => moment(upperRangeDate).subtract(delta, 'days');

  let _startDate = boundRangeTransformedDate(initialDate);
  let _endDate = boundRangeTransformedDate(initialEndDate);

  updateEndDate();

  function updateEndDate() {

    if (moment(_startDate).isAfter(_endDate)){
      _endDate = moment(_startDate);
    }

    _endDate = updateDateWithDeltaFunc( _startDate, _endDate, { days: delta, process: lowerRangeDateProcessor });
    _endDate = boundRangeTransformedDate(_endDate);
  }

  function updateStartDate() {

    if (moment(_endDate).isBefore(_startDate)){
      _startDate = moment(_endDate);
    }

    _startDate = updateDateWithDeltaFunc( _endDate, _startDate, { days: delta, process: upperRangeDateProcessor });
    _startDate = boundRangeTransformedDate(_startDate);

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

      if ( passedOptions.maxDate ){
        newDate = boundDeltaAdjustedMaxStartDate(newDate);
      }

      _startDate = boundRangeTransformedDate(newDate);
      updateEndDate();

    },

    /**
     * Returns the start date
     * @returns { Date }
     */
    get startDate() {
      return moment(_startDate).toDate();
    },

    /**
     * Set the end date
     * @param newDate { Date }
     */
    set endDate( newDate ) {

      if (!newDate){
        return;
      }

      if ( passedOptions.minDate ) {
        newDate = boundDeltaAdjustedMinEndDate(newDate);
      }

      _endDate = boundRangeTransformedDate(newDate);

      updateStartDate();

    },

    /**
     * Returns the end date
     * @returns { Date }
     */
    get endDate() {
      return moment(_endDate).toDate();
    }

  };

}

function isViolatingMinDelta( date1, date2, delta ) {

  let dateDelta = date1.diff(date2, 'days');
  return Math.abs(dateDelta) < delta;

}

function rangeTransformedDate( minDate, maxDate, newDate ) {

  if (minDate && moment(newDate).isBefore(minDate)){
    return moment(minDate);
  }

  else if(maxDate && moment(newDate).isAfter(maxDate)){
    return moment(maxDate);
  }

  return moment(newDate);

}

function updateDateWithDeltaFunc( date1, date2, deltaOptions ) {

  if ( deltaOptions.days && isViolatingMinDelta( date1, date2, deltaOptions.days) ){
    return deltaOptions.process(date1);
  }

  return date2;

}

function deltaAdjustedNewMinEndDate( delta, minEndDate, newDate ) {

  if( delta > 0 &&  moment(newDate).isBefore(minEndDate) ){
    newDate = minEndDate;
  }

  return newDate;

}

function deltaAdjustedNewMaxStartDate( delta, maxStartDate, newDate ) {

  if( delta > 0 &&  moment(newDate).isAfter(maxStartDate) ){
    newDate = maxStartDate;
  }

  return newDate;

}

module.exports = dateRanger;