/**
 * 视图更新与请求数据
 */

var updateView = function() {
    //update view
    var clusterfile = window.clusterdataPath + xzqh[window.cur_area]['cluster'];
    d3.json(clusterfile, function(err,data){
        window.clusterdata = data;

        clearMap();
        poilegend.remove();
        myselectCtr2.remove();
        myselectCtr1.addTo(map);

        drawHeatMap();
        drawBarChart();
        drawPCP();
    });
}