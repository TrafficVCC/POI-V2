/**
 * 定义整个系统的交互方式
 */

$(".custom-select").on('change', function() {
    window.cur_area = this.value;
    var text = "当前区域-" + $(this).find("option:selected").text();
    $(".area").html(text);

    updateView();
});


//地图自定义select控件, 切换视图
//clusterPoints heatmap select
var myselectCtr1 = L.control({position: 'topright'});

myselectCtr1.onAdd = function (map) {
    this._div = L.DomUtil.create('div', 'form-group');
    this._div.innerHTML = '<select class="custom-select custom-select-sm" id="myselect1" onchange="selectOnchange1(this);"> \
                           <option value="heatmap" selected>热力图</option> \
                           <option value="points">散点图</option></select>';
    return this._div;
};

function selectOnchange1(obj) {
    var value = obj.options[obj.selectedIndex].value;
    clearMap();
    if(value == "points") {
        drawClusterPoints();
    } else if(value == "heatmap") {
        drawHeatMap();
    }
}

var updateView = function() {
    //update view
    var clusterfile = window.clusterdataPath + xzqh[window.cur_area]['cluster'];
    d3.json(clusterfile, function(err,data){
        window.clusterdata = data;

        myselectCtr1.addTo(map);
        clearMap();
        drawHeatMap();
        drawBarChart();
        drawPCP();
    });
}