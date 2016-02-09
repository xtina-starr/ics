var expect = require('chai').expect;
var path = require('path');
var timezones = require('../lib/timezones.js')

var TMPDIR = require('os').tmpdir();

var ics = require('../index.js');

describe('ics', function() {

  var sampleEvent = {
    eventName: 'Welcome Event to ICS',
    description: 'Meet Down at the index.js',
    fileName: 'example.ics',
    dtstart:'Sat Nov 02 2014 13:15:00 GMT-0700 (PDT)',
    dtend:'Sat Nov 02 2014 15:20:00 GMT-0700 (PDT)',
    location: 'Fort Worth, Texas',
    organizer: {
        name: 'greenpioneersolutions',
        email: 'info@greenpioneersolutions.com'
    },
    attendees:[
      {
        name: 'Support Team',
        email: 'Support@greenpioneersolutions.com',
        rsvp: true
      },
      {
        name: 'Accounting Team',
        email: 'Accounting@greenpioneersolutions.com'
      }
    ]
  };

  describe('getEvent()', function() {
    it('creates a default event when no options passed', function() {
      var defaultEvent = ics.getEvent({});
      expect(defaultEvent.search(/BEGIN:VCALENDAR\r\n/)).to.equal(0);
      expect(defaultEvent.search(/VERSION:2.0\r\n/)).to.equal(17);
      expect(defaultEvent.search(/BEGIN:VEVENT\r\n/)).to.equal(30);
      expect(defaultEvent.search(/DESCRIPTION/)).to.equal(-1);
      expect(defaultEvent.search(/SUMMARY:New Event\r\n/)).to.equal(120);
      expect(defaultEvent.search(/END:VEVENT\r\n/)).to.equal(139);
      expect(defaultEvent.search(/END:VCALENDAR/)).to.equal(151);
    });

    it('has an event name', function() {
      expect(ics.getEvent(sampleEvent).split('\r\n').indexOf('SUMMARY:' + sampleEvent.eventName)).to.be.greaterThan(-1);
    });
  });

  describe('createEvent()', function() {
    it('creates event with every option passed', function() {
      var expected = path.join(TMPDIR, 'calendar-event.ics');

      ics.createEvent(sampleEvent, null, function(err, filepath) {
        if (err) throw err;
        expect(filepath).to.equal(expected);
      });
    });

    it('returns a default filepath when no filename or filepath provided', function() {
      var expected = path.join(TMPDIR, 'calendar-event.ics');

      ics.createEvent({}, null, function(err, filepath) {
        if (err) throw err;
        expect(filepath).to.equal(expected);
      });
    });

    it('returns a default filepath and custom filename when filename provided', function() {
      var expected = path.join(TMPDIR, 'custom-name.ics');

      ics.createEvent({filename: 'custom-name'}, null, function(err, filepath) {
        if (err) throw err;
        expect(filepath).to.equal(expected);
      })
    });

    it('returns a custom filepath when one is provided', function() {
      var expected = '/Users/gibber/Desktop/my-file.ics';

      ics.createEvent({}, '/Users/gibber/Desktop/my-file.ics', function(err, filepath) {
        if (err) throw err;
        expect(filepath).to.equal(expected);
      })
    })
  });

});

describe('ics with timezone', function() {

  var sampleEvent = {
    eventName: 'Welcome Event to ICS',
    description: 'Meet Down at the index.js',
    fileName: 'example.ics',
    dtstart:'Sat Nov 02 2014 13:15:00 GMT-0700 (PDT)',
    dtend:'Sat Nov 02 2014 15:20:00 GMT-0700 (PDT)',
    location: 'Fort Worth, Texas',
    organizer: {
        name: 'greenpioneersolutions',
        email: 'info@greenpioneersolutions.com'
    },
    attendees:[
      {
        name: 'Support Team',
        email: 'Support@greenpioneersolutions.com',
        rsvp: true
      },
      {
        name: 'Accounting Team',
        email: 'Accounting@greenpioneersolutions.com'
      }
    ],
    timezone: 'UTC'
  };

  describe('getEvent() - timezone', function() {

    it('includes UTC timezone format in ics', function() {
      expect(ics.getEvent(sampleEvent).split('\r\n').indexOf('TZID:' + timezones[sampleEvent.timezone]['TZID'])).to.be.greaterThan(-1);
      expect(ics.getEvent(sampleEvent).split('\r\n').indexOf('X-LIC-LOCATION:' + timezones[sampleEvent.timezone]['X-LIC-LOCATION'])).to.be.greaterThan(-1);
      expect(ics.getEvent(sampleEvent).split('\r\n').indexOf('TZOFFSETFROM:' + timezones[sampleEvent.timezone]['TZOFFSETFROM'])).to.be.greaterThan(-1);
      expect(ics.getEvent(sampleEvent).split('\r\n').indexOf('TZOFFSETTO:' + timezones[sampleEvent.timezone]['TZOFFSETTO'])).to.be.greaterThan(-1);
      expect(ics.getEvent(sampleEvent).split('\r\n').indexOf('TZNAME:' + timezones[sampleEvent.timezone]['TZNAME'])).to.be.greaterThan(-1);
      expect(ics.getEvent(sampleEvent).split('\r\n').indexOf('DTSTART:' + timezones[sampleEvent.timezone]['DTSTART'])).to.be.greaterThan(-1);
    });

    it('gets correct timezone values', function() {
      expect(timezones[sampleEvent.timezone]['TZID']).to.be.equal('UTC')
      expect(timezones[sampleEvent.timezone]['X-LIC-LOCATION']).to.be.equal('UTC')
      expect(timezones[sampleEvent.timezone]['TZOFFSETFROM']).to.be.equal('+0000')
      expect(timezones[sampleEvent.timezone]['TZOFFSETTO']).to.be.equal('+0000')
      expect(timezones[sampleEvent.timezone]['TZNAME']).to.be.equal('UTC')
      expect(timezones[sampleEvent.timezone]['DTSTART']).to.be.equal('19700101T000000')
    })
  });

});
