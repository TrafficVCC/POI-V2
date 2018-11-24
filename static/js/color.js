var colors2 = [
    '#ff0000',
    '#ff9900',
    '#ffff00',
    '#00ff00',
    '#4a86e8',
    '#9900ff',
    '#93c47d',
    '#c27ba0',
    '#6fa8dc',
    '#d9ead3'
]

var colors = [
    "#1f77b4",
    "#ff7f0e",
    "#2ca02c",
    "#d62728",
    "#9467bd",
    "#8c564b",
    "#e377c2",
    "#7f7f7f",
    "#bcbd22",
    "#17becf"
]

function getcolormat(){
    var colorlist = [];
    $.getJSON(clusterdataPath + 'colorlist3x3.json', function (data) {
        data.forEach(function (d, i) {
            colorlist.push(d3.lab(d[0], d[1], d[2]));
        })
    });
    return colorlist;
}