d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_week.geojson").then((data)=>{
    console.log(data);
    createMarker(data.features);
});

function createMarker(data){
    function makeCircle(feature, layer){
        if (feature.geometry.type === 'Point'){
            let mag = feature.properties.mag;
            let depth = feature.geometry.coordinates[2];
            let circle = L.circle([feature.geometry.coordinates[0],feature.geometry.coordinates[1]],{
                radius: Math.sqrt(mag)*50000,
                color: getColor(depth),
                weight: 1,
                opacity: 1,
                fillOpacity: 0.7
            }).bindPopup(`Magnitude: ${mag}<br>Depth: ${depth}km`);
            return circle;
        }
    }
    let earthquake = L.geoJSON(data,{
        pointToLayer: makeCircle
    });
    createMap(earthquake);
 
};
function getColor(depth) {
    return depth > 100 ? 'red' :
           depth > 50  ? 'orange' :
           depth > 20  ? 'yellow' :
           depth > 0   ? 'green' : 'black';
}
function createMap(earthquake){
    let street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      });

    let map = L.map("map",{
        center: [37.09, -95.71],
        zoom: 5,
        layers: [street, earthquake]
    });
    let legend = L.control({position: 'bottomright'});
    legend.onAdd = function(){
        let div = L.DomUtil.create('div','info legend');
        let limits = [0,20,50,100];
        let colors = ['green','yellow','orange','red'];
        let labels = [];
        let legendInfo = "<div class = \"labels\">" +
                         "<div class = \"min\">" + limits[0] + "</div>" +
                         "<div class = \"max\">" + limits[limits.length-1] + "</div>"+
                         "</div>";
        div.innerHTML = legendInfo;
        limits.forEach(function(limit,index){
            labels.push("<li style=\"background-color: "+ colors[index] +"\"></li>");
        })
        div.innerHTML += "<ul>" + labels.join("") + "</ul>";
        return div;
    };
    legend.addTo(map);
    
}


