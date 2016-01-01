// Just a modified copy of this: http://bl.ocks.org/enjalot/1429426

var w = 700
var h = 700
var barOffsetX = 120

function bars(tower, data) {
  max = d3.max(data)

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
  var bars = vis.selectAll("rect.bar").data(data)

  // update
  bars
    .attr("fill", "#0a0")
    .attr("stroke", "#050")

  // enter
  bars.enter()
    .append("svg:rect")
    .attr("class", "bar")
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
    .attr("width", x)
    .attr("height", y.rangeBand())
    .attr("transform", function(d,i) {
      return "translate(" + [barOffsetX, y(i)] + ")"
    })

  // Text
  var text = vis.selectAll("text").data(data)
  
  text.enter()
  	.append("text");

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
    .text( function (d) { return d + " hectoseconds"; })
    .attr("font-family", "sans-serif")
    .attr("font-size", "12px")
    .attr("dominant-baseline", "middle")
    .attr("fill", "red");
}

function setup(tower) {
  var svg = d3.select("#"+tower)
    .attr("width", w+100)
    .attr("height", h+100)

  svg.append("svg:rect")
    .attr("width", "100%")
    .attr("height", "100%")
    .attr("stroke", "#000")
    .attr("fill", "none")

  svg.append("svg:g")
    .attr("id", "barchart"+tower)
    .attr("transform", "translate(50,50)")

  function update() {
    bars(tower, unitData())
  }
  update()
  setInterval(update, 98)
}

function init() {
	setup("svg-lt")
	setup("svg-rt")
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
function unitData() {
  val = []
  currentTime = GigaSeconds().toString()
  if(currentTime.length > maxPad) {
    maxPad = currentTime.length
  }
  currentTime = currentTime.padRight(maxPad, "0")
  for (var i = 0, len = currentTime.length; i < len; i++) {
    digit = currentTime[i]
    if(digit == ".") {
      digit = "0"
    }
    digit = parseInt(digit)
    // Put in range 0-100
    digit = (digit+1) * 10

    if(digit <= 0) {
      digit = 1
    } else if(digit > 100) {
      digit = 100
    }
    val.push(digit)
  }
  return val
}

