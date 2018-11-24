  //bar chart
 function drawBarChart() {
    var data = [];
    for (var i=0; i<window.clusterdata.length; i++) {
        data.push({'name': "class"+window.clusterdata[i]['class'], 'value': window.clusterdata[i]['points'].length, 'color': colorlist[window.clusterdata[i]['class']], 'type': window.clusterdata[i]['class']});
    }

    console.log(data);
    d3.select("#somType").select("svg > *").remove();
    var element = d3.select('#somType').node();
    var div_width = element.getBoundingClientRect().width;
    var div_height = element.getBoundingClientRect().height;

    //sort bars based on value
    data = data.sort(function (a, b) {
        return d3.ascending(a.value, b.value);
    });

    //set up svg using margin conventions - we'll need plenty of room on the left for labels
    var margin = {
        top: 15,
        right: 30,
        bottom: 15,
        left: 65
    };

    var width = div_width - margin.left - margin.right,
        height = div_height - margin.top - margin.bottom;

    var svg = d3.select("#somType").append("svg")
        .attr("preserveAspectRatio", "xMidYMid meet")
        .attr("viewBox", "0 0 "+div_width+ " "+div_height)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var x = d3.scale.linear()
        .range([0, width])
        .domain([0, d3.max(data, function (d) {
            return d.value;
        })]);

    var y = d3.scale.ordinal()
        .rangeRoundBands([height, 0], .2)
        .domain(data.map(function (d) {
            return d.name;
        }));
    //make y axis to show bar names
    var yAxis = d3.svg.axis()
        .scale(y)
        //no tick marks
        .tickSize(0)
        .orient("left");

    var gy = svg.append("g")
        .attr("class", "y axis")
        .call(yAxis);

    var bars = svg.selectAll(".bar")
        .data(data)
        .enter()
        .append("g");

    //append rects
    bars.append("rect")
        .attr("class", "bar")
        .attr("y", function (d) {
            return y(d.name);
        })
        .attr("height", y.rangeBand())
        .attr("x", 0)
        .attr("width", function (d) {
            return x(d.value);
        })
        .attr("fill", function (d) {
            return d.color;
        });

    //add a value label to the right of each bar
    bars.append("text") 
        .attr("class", "label")
        //y position of the label is halfway down the bar
        .attr("y", function (d) {
            return y(d.name) + y.rangeBand() / 2 + 4;
        })
        //x position is 3 pixels to the right of the bar
        .attr("x", function (d) {
            return x(d.value) + 3;
        })
        .text(function (d) {
            return d.value;
        });
 }

 function _drawBarChart(data) {
    console.log(data);
    d3.select("#somType").select("svg > *").remove();
    var element = d3.select('#somType').node();
    var div_width = element.getBoundingClientRect().width;
    var div_height = element.getBoundingClientRect().height;

    //sort bars based on value
    data = data.sort(function (a, b) {
        return d3.ascending(a.value, b.value);
    });

    //set up svg using margin conventions - we'll need plenty of room on the left for labels
    var margin = {
        top: 15,
        right: 30,
        bottom: 15,
        left: 65
    };

    var width = div_width - margin.left - margin.right,
        height = div_height - margin.top - margin.bottom;

    var svg = d3.select("#somType").append("svg")
        .attr("preserveAspectRatio", "xMidYMid meet")
        .attr("viewBox", "0 0 "+div_width+ " "+div_height)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var x = d3.scale.linear()
        .range([0, width])
        .domain([0, d3.max(data, function (d) {
            return d.value;
        })]);

    var y = d3.scale.ordinal()
        .rangeRoundBands([height, 0], .2)
        .domain(data.map(function (d) {
            return d.name;
        }));
    //make y axis to show bar names
    var yAxis = d3.svg.axis()
        .scale(y)
        //no tick marks
        .tickSize(0)
        .orient("left");

    var gy = svg.append("g")
        .attr("class", "y axis")
        .call(yAxis);

    var bars = svg.selectAll(".bar")
        .data(data)
        .enter()
        .append("g");

    //append rects
    bars.append("rect")
        .attr("class", "bar")
        .attr("y", function (d) {
            return y(d.name);
        })
        .attr("height", y.rangeBand())
        .attr("x", 0)
        .attr("width", function (d) {
            return x(d.value);
        })
        .attr("fill", function (d) {
            return d.color;
        });

    //add a value label to the right of each bar
    bars.append("text") 
        .attr("class", "label")
        //y position of the label is halfway down the bar
        .attr("y", function (d) {
            return y(d.name) + y.rangeBand() / 2 + 4;
        })
        //x position is 3 pixels to the right of the bar
        .attr("x", function (d) {
            return x(d.value) + 3;
        })
        .text(function (d) {
            return d.value;
        });
}