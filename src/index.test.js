'use strict';
const chai = require('chai'), expect = chai.expect, should = chai.should();
const dateRanger = require('./index');

const DEBUG = true;

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

    it('should be earlier than the endDate', ()=> {

      const startDate = new Date('2015-01-20')
      const endDate = new Date('2015-01-01')
      const ranger = dateRanger({ startDate, endDate });

      expect(ranger).to.satisfy( ranger => {
        return matchDate( ranger.startDate, ranger.endDate );
      });

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
      const endDate = new Date('2016-12-15');

      const ranger = dateRanger({ minDelta, startDate, endDate });

      expect(ranger).to.satisfy( ranger =>{
        return matchDate( ranger.endDate, new Date('2016-12-22'));
      });

    });

  });

  describe('#startDate', ()=> {

    it('should be earlier than the endDate', ()=> {

      const ranger = dateRanger({});
      ranger.endDate = new Date('2015-01-01');
      ranger.startDate = new Date('2015-01-20');


      expect(ranger).to.satisfy( ranger => {
        return matchDate( ranger.startDate, ranger.endDate );
      });

    });

    it('should be able to change the end date to startDate plus delta if out of range', ()=> {

      const ranger = dateRanger({ minDelta: 7 });
      ranger.endDate = new Date('2016-12-15');
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
      ranger.endDate = new Date('2016-12-15');
      ranger.startDate = new Date('2016-12-15');

      expect(ranger).to.satisfy( ranger =>{
        return matchDate( ranger.endDate, new Date('2016-12-22') );
      });

    });

    it('should be able to update endDate to endDate plus delta', ()=> {

      const startDate = new Date('2015-11-30');
      const endDate = new Date('2015-11-30');

      const ranger = dateRanger({ startDate, endDate, minDelta: 7 });

      expect(ranger).to.satisfy( ranger => {
        return matchDate( ranger.endDate, new Date('2015-12-07') );
      });

    });

  });

  describe('#endDate', ()=> {

    it('should be later than the startDate', ()=> {

      const ranger = dateRanger({});
      ranger.startDate = new Date('2015-01-20');
      ranger.endDate = new Date('2015-01-01');

      expect(ranger).to.satisfy( ranger => {
        return matchDate( ranger.startDate, ranger.endDate );
      });

    });

    it('should be able to change the startDate to endDate minus delta if out of range', ()=> {

      const ranger = dateRanger({ minDelta: 7 });
      ranger.startDate = new Date('2016-12-15');
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

    it('should be able to update startDate to endDate minus delta if we are within the maxDate minus delta', ()=> {

      const maxDate = new Date('2015-11-30');
      const startDate = new Date('2015-11-30');
      const endDate = new Date('2015-11-30');

      const ranger = dateRanger({ maxDate, endDate, minDelta: 7 });
      ranger.startDate = startDate;

      expect(ranger).to.satisfy( ranger => {
        return matchDate( ranger.startDate, new Date('2015-11-23') );
      });

    });

  });

  describe('#checkSlotIsWithinRange() it should be able to tell me whether a date range is within another date range', ()=>{

    const booking = {
      start: new Date('December 17, 1995 10:00:00'),
      end: new Date('December 17, 1995 10:30:00')
    };

    it('should be within a range', ()=> {

      const slot = {
        start: new Date('December 17, 1995 10:00:00'),
        end: new Date('December 17, 1995 10:30:00')
      };

      const result = dateRanger.checkSlotIsWithinRange( slot, booking );
      expect(result).to.be.true;

    });

    it('should be outside of a range', ()=> {

      const slot = {
        start: new Date('December 17, 1995 09:00:00'),
        end: new Date('December 17, 1995 09:30:00')
      };

      const result = dateRanger.checkSlotIsWithinRange( slot, booking );
      expect(result).to.be.false;

    });

    it('should be outside while on the edge of the range', ()=> {

      const slot1 = {
        start: new Date('December 17, 1995 09:30:00'),
        end: new Date('December 17, 1995 10:00:00')
      };

      const slot2 = {
        start: new Date('December 17, 1995 10:30:00'),
        end: new Date('December 17, 1995 11:00:00')
      };

      const result1 = dateRanger.checkSlotIsWithinRange( slot1, booking );
      expect(result1).to.be.false;

      const result2 = dateRanger.checkSlotIsWithinRange( slot2, booking );
      expect(result2).to.be.false;

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