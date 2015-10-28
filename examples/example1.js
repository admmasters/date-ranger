'use strict';

let DateRanger = require('../index');

let dateRangeInstance = DateRanger({ minDelta: 7 });
let date1 = dateRangeInstance.startDate;
let date2 = dateRangeInstance.endDate;

console.log( date1 );
console.log( date2 );