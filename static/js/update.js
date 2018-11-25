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

//选择某个类别后,请求该类别各个事故点POI数据, 并存储为geojson
function updateTypePoi(type) {
    clearMap();
    alert("update");
    $.ajax({
        type: "GET",
        url:'/typepoi',
        data: {'type': type, 'area': window.cur_area, 'xzqh': xzqh[window.cur_area]['xzqh']},
        dataType:'json',//希望服务器返回json格式的数据
        success: function (data, status) {
            alert(status);
            js = data;
            console.log(js);
            convertGeoJson(js);
        }
    });
}

var convertGeoJson = function (js) {
    GeoJSON.parse(js, {Point: ['lat', 'lng']}, function (geojson) {
        console.log(JSON.stringify(geojson));
        $.ajax({
            type: "POST",
            url:'/geojson',
            data: {"data": JSON.stringify(geojson), "filename": window.cur_area + window.cur_type },
            dataType:'json',//希望服务器返回json格式的数据
            success: function (data, status) {
                alert(status);
            }
        });
    });
};