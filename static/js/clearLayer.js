//清除函数

var clearMap = function() {
    if(window.clusterGroup != null) {
        window.clusterGroup.clearLayers();
    }

    if(window.heat != null) {
        map.removeLayer(window.heat);
    }
}