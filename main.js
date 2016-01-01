// Just a modified copy of this: http://bl.ocks.org/enjalot/1429426

var h = 700
var barOffsetX = 120

function bars(tower, w, gs, data) {
  max = d3.max(data, function(d) {
    return d.digit
  })

  // nice breakdown of d3 scales
  // http://www.jeromecukier.net/blog/2011/08/11/d3-scales-and-color/
  x = d3.scale.linear()
    .domain([0, max])
    .range([0, w-barOffsetX])

  y = d3.scale.ordinal()
    .domain(d3.range(data.length))
    .rangeBands([0, h], .2)

  var vis = d3.select("#barchart"+tower)

  // a good written tutorial of d3 selections coming from protovis
  // http://www.jeromecukier.net/blog/2011/08/09/d3-adding-stuff-and-oh-understanding-selections/
  var bars = vis.selectAll("rect.bar"+tower).data(data)

  // update
  bars
    .attr("fill", "#0a0")
    .attr("stroke", "#050")

  // enter
  bars.enter()
    .append("rect")
    .attr("class", "bar"+tower)
    .attr("fill", "#800")
    .attr("stroke", "#800")

  // exit
  bars.exit()
    .transition()
    .duration(80)
    .ease("exp")
    .attr("width", 0)
    .remove()

  bars
    .attr("stroke-width", 4)
    .transition()
    .duration(80)
    .ease("quad")
    .attr("width", function (d) { return x(d.digit); })
    .attr("height", y.rangeBand())
    .attr("transform", function(d,i) {
      return "translate(" + [barOffsetX, y(i)] + ")"
    })

  // Text
  var text = vis.selectAll("text.desc").data(data)
  
  text.enter()
  	.append("text")
    .classed('desc', true);

  text.exit()
    .transition()
    .duration(80)
    .ease("exp")
    .attr("width", 0)
    .remove()

  var textLabels = text
    .transition()
    .duration(80)
    .ease("quad")
    .attr("transform", function(d,i) {
      return "translate(" + [10, y(i) + (y.rangeBand()/2)] + ")"
    })
    .text( function (d) { return d.prefixValue + " " + d.prefix + "seconds"; })
    .attr("font-family", "sans-serif")
    .attr("font-size", "12px")
    .attr("dominant-baseline", "middle")
    .attr("fill", "red");

    // Label
    var label = vis.selectAll("text.label").data([gs.toString()])

    label.enter()
      .append("text")
      .classed('label', true);

    label.exit()
      .transition()
      .duration(80)
      .ease("exp")
      .attr("width", 0)
      .remove()

    label
      .text(function (d) { return d })
      .attr("font-family", "sans-serif")
      .attr("font-size", "24px")
      .attr("fill", "black");
}

function setup(tower, w) {
  var svg = d3.select("#"+tower)
    .attr("width", w+100)
    .attr("height", h+100)

  //svg.append("svg:rect")
    //.attr("width", "100%")
    //.attr("height", "100%")
    //.attr("stroke", "#000")
    //.attr("fill", "none")

  svg.append("svg:g")
    .attr("id", "barchart"+tower)
    .attr("transform", "translate(50,50)")

  function update() {
    gs = GigaSeconds()
    bars(tower, w, gs, unitData(gs))
  }
  update()
  setInterval(update, 98)
}

function init() {
  setup("svg-primary", 300)
	setup("svg-lt", 700)
	setup("svg-rt", 700)
}

function random(n) {
  val = []
  for(i = 0; i < n; i++) {
    val.push(Math.random() * 100)
  }
  return val
}


/*
  GigaSecond code
*/

String.prototype.padRight = function(l,c) {return this+Array(l-this.length+1).join(c||" ")}

secondsPerGigaSecond = new Decimal(1).times(1000).times(1000).times(1000)
secondsPerYear = new Decimal(1).times(365).times(24).times(60).times(60)
gigaSecondsPerYear = secondsPerYear.dividedBy(secondsPerGigaSecond)
billion = 1000000000
gigaSecondsPerBillionYears = new Decimal(billion).times(gigaSecondsPerYear)
universeAgeGigaSeconds = gigaSecondsPerBillionYears.times(13.8095)

function timeSinceUnixEpochGigaSeconds() {
	return new Decimal(new Date().getTime()).dividedBy(1000).dividedBy(secondsPerGigaSecond)
}

universeAgeAtUnixEpoch = universeAgeGigaSeconds.minus(timeSinceUnixEpochGigaSeconds())
universeAgeAtUnixEpoch = new Decimal("405587619.6812618494")

function GigaSeconds() {
  return universeAgeAtUnixEpoch.plus(timeSinceUnixEpochGigaSeconds())
}

//function update() {
//  gigaSecond = universeAgeAtUnixEpoch.plus(timeSinceUnixEpochGigaSeconds())
//  document.getElementById("gigasecond").textContent = gigaSecond.toString().padRight(64, "-")
//}
//update()
//setInterval(update, 100)


maxPad = 0
function unitData(gs) {
  val = []
  currentTime = gs.toString()
  if(currentTime.length > maxPad) {
    maxPad = currentTime.length
  }
  currentTime = currentTime.padRight(maxPad, "0")

  prefixes = metricPrefixes(currentTime)
  prefixKeys = []
  prefixValues = []
  for (var k in prefixes) {
    if (prefixes.hasOwnProperty(k)) {
      for(i = 0; i < 3; i++) {
        prefixKeys.push(k)
        prefixValues.push(prefixes[k])
      }
    }
  }
  //prefixKeys = Object.keys(prefixes)
  //prefixValues = prefixKeys.map(function(k) { return prefixes[k]; });
  //console.log(currentTime)
  //console.log(JSON.stringify(prefixes))

  prefixID = 0
  for (var i = 0, len = currentTime.length; i < len; i++) {
    digit = currentTime[i]
    if(digit == ".") {
      digit = "0"
    } else {
      prefixID++
    }
    digit = parseInt(digit)
    // Put in range 0-100
    digit = (digit+1) * 10

    if(digit <= 0) {
      digit = 1
    } else if(digit > 100) {
      digit = 100
    }
    val.push({
      digit: digit,
      prefix: prefixKeys[prefixID],
      prefixValue: prefixValues[prefixID],
    })
  }
  return val
}


// courtesy of @Andoryuuta
function metricPrefixes(gigasec){
	var upNames = ['giga', 'tera', 'peta', 'exa', 'zetta', 'yotta']
var downNames = ['mega', 'kilo', '', 'milli', 'micro', 'nano', 'pico', 'femto', 'atto', 'zepto', 'yocto']
	var outMap = {}
  var decPlace = gigasec.indexOf(".")
  
	var unalignedUpChars = decPlace % 3
  var alignedUpCount = Math.floor(decPlace / 3)
  var downCount = Math.floor((gigasec.length - decPlace) / 3)
  
  //Parse unaligned nums left of decimal
  if(unalignedUpChars != 0){
  	cur = gigasec.slice(0, unalignedUpChars)
  	outMap[upNames[alignedUpCount]] = parseInt(cur, 10)
  }
  
  //parse aligned nums left of decimal
  for(i=alignedUpCount; i > 0 ; i--){
  	off = decPlace - i*3
  	cur = gigasec.slice(off, off+3)
    outMap[upNames[i-1]] = parseInt(cur, 10)
  }
  
  
  //parse aligned nums right of decimal
  for(i=0; i < downCount; i++){
  	off = decPlace+1 + i*3
    cur = gigasec.slice(off, off+3)
    outMap[downNames[i]] = parseInt(cur, 10)
  }
  
  return outMap
}
