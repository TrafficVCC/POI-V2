/**
 * 绘制热力图, 初始市区
 * @param {string} clusterdataPath Cluster data path
 */
function drawHeatMap() {
    var data = window.clusterdata;
    var heatdata = [];
    var maxCount = 0;

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

    map.setView(xzqh[window.cur_area]['center'], 12);
}

function drawClusterPoints() {
    var data = window.clusterdata;
    var layers = [];
    if(window.clusterGroup != null) {
        window.clusterGroup.clearLayers();
    }

    for (var i=0; i<data.length; i++) {
        var color = colorlist[data[i]['class']];
        var points = data[i]['points'];
        for (var j=0; j<points.length; j++) {
            var layer = L.circleMarker([points[j].lat, points[j].lng], {
                fillColor: color,
                radius: 6,
                color: "gray",
                opacity: 0.8,
                weight: 1.0,
                fillOpacity: 0.8
            }).bindTooltip(points[j].sgdd,{ direction: 'left' });
            layers.push(layer);
        }
    }

    window.clusterGroup = L.layerGroup(layers);
    map.addLayer(clusterGroup);
    map.setView(xzqh[window.cur_area]['center'], 12);
}


//选择某一类后, 以marker显示该类别(需要先存储至geojson)
function drawMarkers2(geojsonPath) {
    d3.json(geojsonPath, function(error, data) {
        console.log(data);
        clearMap();

        window.markerType = L.geoJSON(data, {
            pointToLayer: pointToLayer,
            onEachFeature: onEachFeature
        }).addTo(map);

        var bounds = window.markerType.getBounds();
        map.fitBounds(bounds);
    });

    var pointToLayer = function (feature, latlng) {
        var options = {
            fillColor: window.colorlist[window.cur_type],
            radius: 7,
            color: "gray",
            opacity: 0.8,
            weight: 1.0,
            fillOpacity: 0.8
        };
        return L.circleMarker(latlng, options);
    };

    var onEachFeature = function (feature, layer) {
        var popupContent = feature.properties.sgdd + "<br>count: " + feature.properties.count;
        layer.bindPopup(popupContent);
    };
}


//选择某一类后, 以marker显示该类别(不从geojson文件)
function drawMarkers(geojsonPath) {
    //直接从先前保存的window.clusterdata读取类别数据
    var points = [];
    var layers = [];
    for(var i=0; i<window.clusterdata.length; i++) {
        cluster = window.clusterdata[i];
        if(cluster['class'] == window.cur_type) {
            points = cluster['points'];
            break;
        }
    }
    console.log(points);
    clearMap();
    for (var j=0; j<points.length; j++) {
        var layer = L.circleMarker([points[j].lat, points[j].lng], {
            fillColor: window.colorlist[window.cur_type],
            radius: 6,
            color: "gray",
            opacity: 0.8,
            weight: 1.0,
            fillOpacity: 0.8
        }).bindTooltip(points[j].sgdd,{ direction: 'left' });

        layers.push(layer);
    }

    window.markerType = L.layerGroup(layers);
    map.addLayer(window.markerType);
}
