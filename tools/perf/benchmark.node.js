var fs = require('fs');
var L20n = require('../../dist/bundle/node/l20n');

var ftlCode = fs.readFileSync(__dirname + '/example.ftl').toString();

var data = {
  "brandShortName": "BRANDSHORTNAME",
  "ssid": "SSID",
  "capabilities": "CAPABILITIES",
  "linkSpeed": "LINKSPEED",
  "pin": "PIN",
  "n": 3,
  "name": "NAME",
  "device": "DEVICE",
  "code": "CODE",
  "app": "APP",
  "size": 100,
  "unit": "UNIT",
  "list": "LIST",
  "level": "LEVEL",
  "number": "NUMBER",
  "link1": "LINK1",
  "link2": "LINK2",
  "count": 10,
};

var lang = {
  code:'en-US',
  src: 'app',
};
function micro(time) {
  // time is [seconds, nanoseconds]
  return Math.round((time[0] * 1e9 + time[1]) / 1000);
}

var cumulative = {};
var start = process.hrtime();

cumulative.ftlParseStart = process.hrtime(start);
var [resource] = L20n.FTLASTParser.parseResource(ftlCode);
cumulative.ftlParseEnd = process.hrtime(start);

cumulative.ftlEntriesParseStart = process.hrtime(start);
var [entries] = L20n.FTLEntriesParser.parseResource(ftlCode);
cumulative.ftlEntriesParseEnd = process.hrtime(start);

var ctx = new L20n.MockContext(entries);

cumulative.format = process.hrtime(start);
for (var id in entries) {
  L20n.format(ctx, lang, data, entries[id]);
}
cumulative.formatEnd = process.hrtime(start);

var results = {
  parseFTL: micro(cumulative.ftlParseEnd) - micro(cumulative.ftlParseStart),
  parseFTLEntries: micro(cumulative.ftlEntriesParseEnd) - micro(cumulative.ftlEntriesParseStart),
  format: micro(cumulative.formatEnd) - micro(cumulative.format),
};
console.log(JSON.stringify(results));
