'use strict';
const chai = require('chai'), expect = chai.expect, should = chai.should();
const dateRanger = require('./index');

const DEBUG = false;

describe('date-ranger', ()=> {

  describe('#contructor(options)', ()=> {

    it('should have a default start date', ()=> {
      const ranger = dateRanger({});
      should.exist(ranger.startDate);
    });

    it('should have a default end date', ()=> {
      const ranger = dateRanger({});
      should.exist(ranger.endDate);
    });

    it('should be able to store the date passed to the start', ()=> {

      const date = new Date('2015-12-16');
      const ranger = dateRanger({startDate: date});
      expect(ranger.startDate).to.satisfy(matchDate.bind(null, date, ranger.startDate));

    });

    it('should be able to store the date passed to the end', ()=> {

      const date = new Date('2015-12-16');
      const ranger = dateRanger({endDate: date});
      expect(ranger.startDate).to.satisfy(matchDate.bind(null, date, ranger.endDate));

    });

    it('should be able to respect a minimum date', ()=> {

      const minDate = new Date('2015-12-16');
      const startDate = new Date('2000-12-15');
      const endDate = new Date('2000-12-15');

      let ranger = dateRanger({ minDate, startDate, endDate });

      expect( ranger ).to.satisfy( ranger => matchDate(ranger.startDate,minDate));
      expect( ranger ).to.satisfy( ranger => matchDate(ranger.endDate,minDate));

    });

    it('should be able to respect a maximum date', ()=> {

      const maxDate = new Date('2015-12-24');
      const startDate = new Date('2016-12-15');
      const endDate = new Date('2016-12-15');

      const ranger = dateRanger({ maxDate, startDate, endDate });

      expect( ranger ).to.satisfy( ranger => matchDate(ranger.startDate,maxDate));
      expect( ranger ).to.satisfy( ranger => matchDate(ranger.endDate,maxDate));

    });

    it('should default to an end date of start date plus delta', ()=> {

      const minDelta = 7;
      const startDate = new Date('2016-12-15');
      const endDate = new Date('2017-12-25');

      const ranger = dateRanger({ minDelta, startDate, endDate });

      expect(ranger).to.satisfy( ranger =>{
        return matchDate( ranger.endDate, new Date('2016-12-22'));
      });

    });

  });

  describe('#startDate', ()=> {

    it('should be able to change the end date to startDate plus delta if out of range', ()=> {

      const ranger = dateRanger({ minDelta: 7 });
      ranger.startDate = new Date('2016-12-15');

      expect(ranger).to.satisfy( ranger =>{
        return matchDate( ranger.endDate, new Date('2016-12-22'));
      });

    });

    it('should respect the minimum date', ()=> {

      const minDate = new Date('2016-12-17');
      const ranger = dateRanger({ minDate });
      ranger.startDate = new Date('2016-12-16');

      expect(ranger).to.satisfy( ranger =>{
        return matchDate( ranger.startDate, minDate);
      });

    });

    it('should respect the maximum date', ()=> {

      const maxDate = new Date('2016-12-15');
      const ranger = dateRanger({ maxDate });
      ranger.startDate = new Date('2016-12-16');

      expect(ranger).to.satisfy( ranger =>{
        return matchDate( ranger.startDate, maxDate);
      });

    });

    it('should be able to respect a delta between the two dates', ()=> {

      const ranger = dateRanger({ minDelta: 7 });
      ranger.startDate = new Date('2016-12-15');

      expect(ranger).to.satisfy( ranger =>{
        return matchDate( ranger.endDate, new Date('2016-12-22') );
      });

    });

  });

  describe('#endDate', ()=> {

    it('should be able to change the startDate to endDate minus delta if out of range', ()=> {

      const ranger = dateRanger({ minDelta: 7 });
      ranger.endDate = new Date('2016-12-15');

      expect(ranger).to.satisfy( ranger =>{
        return matchDate( ranger.startDate, new Date('2016-12-8'));
      });

    });

    it('should respect the minimum date', ()=> {

      const minDate = new Date('2016-12-17');
      const ranger = dateRanger({ minDate });
      ranger.endDate = new Date('2016-12-16');

      expect(ranger).to.satisfy( ranger =>{
        return matchDate( ranger.endDate, minDate);
      });

    });

    it('should respect the maximum date', ()=> {

      const maxDate = new Date('2016-12-15');
      const ranger = dateRanger({ maxDate });
      ranger.endDate = new Date('2016-12-16');

      expect(ranger).to.satisfy( ranger =>{
        return matchDate( ranger.endDate, maxDate);
      });

    });

    it('should be able to respect a delta between the two dates', ()=> {

      const ranger = dateRanger({ minDelta: 7 });
      ranger.endDate = new Date('2016-12-15');

      expect(ranger).to.satisfy( ranger =>{
        return matchDate( ranger.startDate, new Date('2016-12-8') );
      });

    });

  });

});

//Helpers
function matchDate( date1, date2 ) {

  if(DEBUG){
    console.log(`Date 1: ${date1} Date 2: ${date2}`);
  }

  const day1 = date1.getDate();
  const day2 = date2.getDate();

  const month1 = date1.getMonth();
  const month2 = date2.getMonth();

  const year1 = date1.getYear();
  const year2 = date2.getYear();

  return (day1 === day2 && month1 === month2 && year1 === year2);

}