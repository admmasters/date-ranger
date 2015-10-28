var chai = require('chai'), expect = chai.expect, should = chai.should();
var dateRanger = require('./index');

describe('date-ranger', function(){

  describe('#contructor(options)', function(){

    it('should have a default start date', function(){
      var ranger = dateRanger({});
      should.exist(ranger.startDate);
    });

    it('should have a default end date', function(){
      var ranger = dateRanger({});
      should.exist(ranger.endDate);
    });

    it('should be able to store the date passed to the start', function(){

      var date = new Date('2015-12-16');
      var ranger = dateRanger({ startDate: date });
      expect( ranger.startDate ).to.satisfy(matchDate.bind(null,date,ranger.startDate));

    });

    it('should be able to store the date passed to the end', function(){

      var date = new Date('2015-12-16');
      var ranger = dateRanger({ endDate: date });
      expect( ranger.startDate ).to.satisfy(matchDate.bind(null,date,ranger.endDate));

    });

    it('should be able to respect a minimum date', function(){

      var minDate = new Date('2015-12-16');
      var startDate = new Date('2000-12-15');
      var endDate = new Date('2000-12-15');

      var ranger = dateRanger({ minDate, startDate, endDate });

      expect( ranger ).to.satisfy( ranger => matchDate(ranger.startDate,minDate));
      expect( ranger ).to.satisfy( ranger => matchDate(ranger.endDate,minDate));

    });

    it('should be able to respect a maximum date', function(){

      var maxDate = new Date('2015-12-24');
      var startDate = new Date('2016-12-15');
      var endDate = new Date('2016-12-15');

      var ranger = dateRanger({ maxDate, startDate, endDate });

      expect( ranger ).to.satisfy( ranger => matchDate(ranger.startDate,maxDate));
      expect( ranger ).to.satisfy( ranger => matchDate(ranger.endDate,maxDate));

    });

    it('should be able to respect a delta between the two dates', function(){

      var minDelta = 7;
      var startDate = new Date('2016-12-15');
      var endDate = new Date('2017-12-25');

      var ranger = dateRanger({ startDate, endDate, minDelta });

      expect(ranger).to.satisfy( ranger =>{
        return matchDate( ranger.endDate, new Date('2016-12-22') );
      });

    });

  });

});

//Helpers
function matchDate( date1, date2 ) {

  var day1 = date1.getDate();
  var day2 = date2.getDate();

  var month1 = date1.getMonth();
  var month2 = date2.getMonth();

  var year1 = date1.getYear();
  var year2 = date2.getYear();

  return (day1 === day2 && month1 === month2 && year1 === year2);

}