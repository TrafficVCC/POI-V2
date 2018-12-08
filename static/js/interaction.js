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

//地图自定义select控件, 切换视图
//piechart markers select
var myselectCtr2 = L.control({position: 'topright'});

myselectCtr2.onAdd = function (map) {
    this._div = L.DomUtil.create('div', 'form-group');
    this._div.innerHTML = '<select class="custom-select custom-select-sm" id="myselect2" onchange="selectOnchange2(this);"> \
                           <option value="markers" selected>散点图</option> \
                           <option value="piechart">圆环图</option></select>';
    return this._div;
};

function selectOnchange2(obj) {
    var value = obj.options[obj.selectedIndex].value;
    var geoFile = window.geojsondataPath + window.cur_area + window.cur_type + ".geojson";
   
    if(value == "markers") {
        poilegend.remove();
        markerclusters.clearLayers();
        drawMarkers(geoFile); 
    } else if(value == "piechart") {
        poilegend.remove();
        window.markerType.clearLayers();    
        //drawPieChart(geoFile);
    }
}
