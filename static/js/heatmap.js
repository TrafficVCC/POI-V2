/**
 * 绘制热力图, 初始市区
 * @param {string} clusterdataPath Cluster data path
 */
function drawHeatMap(clusterdataPath) {
    d3.json(clusterdataPath, function(err,data){
        var heatdata = [];
        var maxCount = 0;
        console.log(clusterdataPath);

        for(var i=0; i<data.length; i++) {
            var points = data[i]['points'];
            for(var j=0; j<points.length; j++) {
                heatdata.push([points[j]['lat'], points[j]['lng'], ""+points[j]['count']]);
                if(points[j]['count'] > maxCount) {
                    maxCount = points[j]['count'];
                }
            }
        }

        if(window.heat != null) {
            map.removeLayer(window.heat);
        }
        
        window.heat = L.heatLayer(heatdata, {
            radius: 20,
            //blur: 15,
            maxZoom: 10,
            max: maxCount,
    
            // gradient: {
            //     0.0: '#50a3ba',
            //     0.5: '#eac736',
            //     1.0: '#d94e5d'
            // }
    
            // gradient: {
            //     0.2: '#ffffb2',
            //     0.4: '#fd8d3c',
            //     0.6: '#fd8d3c',
            //     0.8: '#f03b20',
            //     1: '#bd0026'
            // }
        }).addTo(map);
    });
}
