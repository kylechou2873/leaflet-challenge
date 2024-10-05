d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_week.geojson").then((data)=>{
    console.log(data);
    createMarker(data.features);
});

function createMarker(data){
    function circle(feature, layer){
        if (feature.geometry.type === 'Point'){
            console.log("HERE!!!!")
            let mag = feature.properties.mag;
            let depth = feature.geometry.coordinates[2];
            return new L.circleMarker([feature.geometry.coordinates[0],feature.geometry.coordinates[1]],{
                radius: Math.sqrt(mag)*500,
                filColor: getColor(depth),
                color: "black",
                weight: 1,
                opacity: 1,
                fillOpacity: 0.7
            }).bindPopup(`Magnitude: ${mag}<br>Depth: ${depth}km`);
        }
    }
    let earthquake = L.geoJSON(data,{
        onEachFeature: circle
    });
    createMap(earthquake);
};
function getColor(depth) {
    return depth > 100 ? '#ff0000' :
           depth > 50  ? '#ff7f00' :
           depth > 20  ? '#ffff00' :
           depth > 0   ? '#7fff00' :
                         '#00ff00';
}
function createMap(earthquake){
    let topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
        attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
      });

    let map = L.map("map",{
        center: [37.09, -95.71],
        zoom: 5,
        layers: [topo, earthquake]
    });
}
