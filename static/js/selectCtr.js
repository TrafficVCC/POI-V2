//地图自定义select控件, 切换视图
//clusterPoints heatmap select
var myselectCtr1 = L.control({position: 'topright'});

myselectCtr1.onAdd = function (map) {
    this._div = L.DomUtil.create('div');
    this._div.innerHTML = '<form class="form-inline><select class="custom-select custom-select-sm id="myselect1" onchange="selectOnchange1(this);"> \
                           <option value="points" selected>points</option> \
                           <option value="heatmap">heatmap</option></select></form>';
    return this._div;
};

function selectOnchange1(obj) {
    var value = obj.options[obj.selectedIndex].value;
    if(value == "points") {
        drawClusterPoints();
    } else if(value == "heatmap") {
        drawHeatMap();
    }
}