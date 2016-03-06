//// dataset url
var dataset = 'https://raw.githubusercontent.com/yuchu/midterm-project-story-map/master/station.geojson';

////Basemaps collections
var CartoDB_Positron = L.tileLayer('http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="http://cartodb.com/attributions">CartoDB</a>',
  subdomains: 'abcd',
  maxZoom: 19
});

var CartoDB_DarkMatter = L.tileLayer('http://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="http://cartodb.com/attributions">CartoDB</a>',
  subdomains: 'abcd',
  maxZoom: 19
});

var Thunderforest_Transport = L.tileLayer('http://{s}.tile.thunderforest.com/transport/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="http://www.opencyclemap.org">OpenCycleMap</a>, &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  maxZoom: 19
});

var OpenMapSurfer_Roads = L.tileLayer('http://korona.geog.uni-heidelberg.de/tiles/roads/x={x}&y={y}&z={z}', {
  maxZoom: 20,
  attribution: 'Imagery from <a href="http://giscience.uni-hd.de/">GIScience Research Group @ University of Heidelberg</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
});

var Hydda_Full = L.tileLayer('http://{s}.tile.openstreetmap.se/hydda/full/{z}/{x}/{y}.png', {
  attribution: 'Tiles courtesy of <a href="http://openstreetmap.se/" target="_blank">OpenStreetMap Sweden</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
});

var Stamen_TonerLite = L.tileLayer('http://stamen-tiles-{s}.a.ssl.fastly.net/toner-lite/{z}/{x}/{y}.{ext}', {
  attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  subdomains: 'abcd',
  minZoom: 0,
  maxZoom: 20,
  ext: 'png'
});

var basemaps = {
  "CartoDB_Positron": CartoDB_Positron,
  "CartoDB_DarkMatter": CartoDB_DarkMatter,
  "Thunderforest_Transport": Thunderforest_Transport,
  "OpenMapSurfer_Roads":  OpenMapSurfer_Roads,
  "Hydda_Full": Hydda_Full,
  "Stamen_TonerLite": Stamen_TonerLite
};

//// Leaflet Configuration
var map = L.map('map', {
  center: [39.956, -75.173],
  zoom: 14,
  layers: [CartoDB_Positron]
});

L.control.layers(basemaps).addTo(map);

$(document).ready(function() {

  //// Setting slide_state
  var slide_state = 1;
  // Hide the "previous_button" when started
  if (slide_state == 1){
    $('#previous_button').hide();
  }

  var parseData = function(data){
    return JSON.parse(data);
  };

  var makeMarkers = function(data){
    return L.geoJson(data,{
      onEachFeature: eachFeature,
      filter: markerFilter,
      pointToLayer: function (feature, latlng) {
        return L.circleMarker(latlng, markerStlye(feature));
      }
    });
  };

  var plotMarkers = function(marker){
    marker.addTo(map);
  };

  var removeMarkers = function(marker) {
    map.removeLayer(marker);
  };

  //// Temporal cluster group descriptiion
  var tempClusterDesc = function(weekday_type, cluster_num){
    if(weekday_type == 1){
      switch(cluster_num){
        case 1: return "AM outflow; PM inflow";
        case 2: return "Balanced; slight AM outflow";
        case 3: return "AM inflow; PM outflow";
      }
    }else if (weekday_type == 2) {
      switch(cluster_num){
        case 1: return "Balanced";
        case 2: return "Slight AM outflow";
        case 3: return "Slight AM inflow";
      }
    }
  };

  //// Activity cluster group deiscription
  var ActClusterDesc = function(cluster_num){
    switch(cluster_num){
      case 1: return "Highly used";
      case 2: return "Medium used";
      case 3: return "Lowly used";
    }
  };

  //// Feature setting
  var eachFeature = function(feature, layer){
    switch(slide_state){
      case 1: layer.bindPopup((feature.properties.Name).concat("<br>","Total Docks: ",feature.properties.Docks)); break;
      case 2: switch(feature.properties.cluster_weekday){
                case 1: layer.bindPopup((feature.properties.Name).concat("<br>","Weekday temporal usage type: ", tempClusterDesc(1,1))); break;
                case 2: layer.bindPopup((feature.properties.Name).concat("<br>","Weekday temporal usage type: ", tempClusterDesc(1,2))); break;
                case 3: layer.bindPopup((feature.properties.Name).concat("<br>","Weekday temporal usage type: ", tempClusterDesc(1,3))); break;
              }
              break;
      case 3: layer.bindPopup(feature.properties.Name); break;
      case 4: layer.bindPopup(feature.properties.Name); break;
      case 5: layer.bindPopup(feature.properties.Name); break;
      case 6: switch(feature.properties.cluster_weekend){
                case 1: layer.bindPopup((feature.properties.Name).concat("<br>","Weekend temporal usage type: ", tempClusterDesc(2,1))); break;
                case 2: layer.bindPopup((feature.properties.Name).concat("<br>","Weekend temporal usage type: ", tempClusterDesc(2,2))); break;
                case 3: layer.bindPopup((feature.properties.Name).concat("<br>","Weekend temporal usage type: ", tempClusterDesc(2,3))); break;
              }
              break;
      case 7: layer.bindPopup(feature.properties.Name); break;
      case 8: layer.bindPopup(feature.properties.Name); break;
      case 9: layer.bindPopup(feature.properties.Name); break;
      case 10: switch(feature.properties.station_avg_ridership_cluster_weekday){
                 case 1: layer.bindPopup((feature.properties.Name).concat("<br>","Activity group: ",ActClusterDesc(1),"<br>","Average weekday activity: ", feature.properties.station_avg_ridership_weekday.toFixed(2))); break;
                 case 2: layer.bindPopup((feature.properties.Name).concat("<br>","Activity group: ",ActClusterDesc(2),"<br>","Average weekday activity: ", feature.properties.station_avg_ridership_weekday.toFixed(2))); break;
                 case 3: layer.bindPopup((feature.properties.Name).concat("<br>","Activity group: ",ActClusterDesc(3),"<br>","Average weekday activity: ", feature.properties.station_avg_ridership_weekday.toFixed(2))); break;
               }
               break;
      case 11: switch(feature.properties.station_avg_ridership_cluster_weekend){
                 case 1: layer.bindPopup((feature.properties.Name).concat("<br>","Activity group: ",ActClusterDesc(1),"<br>","Average weekday activity: ", feature.properties.station_avg_ridership_weekend.toFixed(2))); break;
                 case 2: layer.bindPopup((feature.properties.Name).concat("<br>","Activity group: ",ActClusterDesc(2),"<br>","Average weekday activity: ", feature.properties.station_avg_ridership_weekend.toFixed(2))); break;
                 case 3: layer.bindPopup((feature.properties.Name).concat("<br>","Activity group: ",ActClusterDesc(3),"<br>","Average weekday activity: ", feature.properties.station_avg_ridership_weekend.toFixed(2))); break;
               }
               break;
      case 12: switch(feature.properties.final_cluster_weekday){
                 case 1: layer.bindPopup((feature.properties.Name).concat("<br>","Weekday temporal usage type: ", tempClusterDesc(1,1),"<br>","Activity group: ",ActClusterDesc(1))); break;
                 case 2: layer.bindPopup((feature.properties.Name).concat("<br>","Weekday temporal usage type: ", tempClusterDesc(1,1),"<br>","Activity group: ",ActClusterDesc(2))); break;
                 case 3: layer.bindPopup((feature.properties.Name).concat("<br>","Weekday temporal usage type: ", tempClusterDesc(1,1),"<br>","Activity group: ",ActClusterDesc(3))); break;
                 case 4: layer.bindPopup((feature.properties.Name).concat("<br>","Weekday temporal usage type: ", tempClusterDesc(1,2),"<br>","Activity group: ",ActClusterDesc(1))); break;
                 case 5: layer.bindPopup((feature.properties.Name).concat("<br>","Weekday temporal usage type: ", tempClusterDesc(1,2),"<br>","Activity group: ",ActClusterDesc(2))); break;
                 case 6: layer.bindPopup((feature.properties.Name).concat("<br>","Weekday temporal usage type: ", tempClusterDesc(1,2),"<br>","Activity group: ",ActClusterDesc(3))); break;
                 case 7: layer.bindPopup((feature.properties.Name).concat("<br>","Weekday temporal usage type: ", tempClusterDesc(1,3),"<br>","Activity group: ",ActClusterDesc(1))); break;
                 case 8: layer.bindPopup((feature.properties.Name).concat("<br>","Weekday temporal usage type: ", tempClusterDesc(1,3),"<br>","Activity group: ",ActClusterDesc(2))); break;
                 case 9: layer.bindPopup((feature.properties.Name).concat("<br>","Weekday temporal usage type: ", tempClusterDesc(1,3),"<br>","Activity group: ",ActClusterDesc(3))); break;
               }
               break;
      case 13: switch(feature.properties.final_cluster_weekend){
                 case 1: layer.bindPopup((feature.properties.Name).concat("<br>","Weekend temporal usage type: ", tempClusterDesc(2,1),"<br>","Activity group: ",ActClusterDesc(1))); break;
                 case 2: layer.bindPopup((feature.properties.Name).concat("<br>","Weekend temporal usage type: ", tempClusterDesc(2,1),"<br>","Activity group: ",ActClusterDesc(2))); break;
                 case 3: layer.bindPopup((feature.properties.Name).concat("<br>","Weekend temporal usage type: ", tempClusterDesc(2,1),"<br>","Activity group: ",ActClusterDesc(3))); break;
                 case 4: layer.bindPopup((feature.properties.Name).concat("<br>","Weekend temporal usage type: ", tempClusterDesc(2,2),"<br>","Activity group: ",ActClusterDesc(1))); break;
                 case 5: layer.bindPopup((feature.properties.Name).concat("<br>","Weekend temporal usage type: ", tempClusterDesc(2,2),"<br>","Activity group: ",ActClusterDesc(2))); break;
                 case 6: layer.bindPopup((feature.properties.Name).concat("<br>","Weekend temporal usage type: ", tempClusterDesc(2,2),"<br>","Activity group: ",ActClusterDesc(3))); break;
                 case 7: layer.bindPopup((feature.properties.Name).concat("<br>","Weekend temporal usage type: ", tempClusterDesc(2,3),"<br>","Activity group: ",ActClusterDesc(1))); break;
                 case 8: layer.bindPopup((feature.properties.Name).concat("<br>","Weekend temporal usage type: ", tempClusterDesc(2,3),"<br>","Activity group: ",ActClusterDesc(2))); break;
                 case 9: layer.bindPopup((feature.properties.Name).concat("<br>","Weekend temporal usage type: ", tempClusterDesc(2,3),"<br>","Activity group: ",ActClusterDesc(3))); break;
               }
               break;
      case 14: layer.bindPopup((feature.properties.Name).concat("<br>","Average weekday ridership: ", feature.properties.station_avg_ridership_weekday.toFixed(2))); break;
      case 15: layer.bindPopup((feature.properties.Name).concat("<br>","Average weekend ridership: ", feature.properties.station_avg_ridership_weekend.toFixed(2))); break;
      case 16: if(feature.properties.most_positive_imbalanced_pressure > Math.abs(feature.properties.most_negative_imbalanced_pressure)){
                  layer.bindPopup((feature.properties.Name).concat("<br>","Highest positive imbalanced pressure: ", feature.properties.most_positive_imbalanced_pressure.toFixed(2),
                  "<br>","Weekday: ",feature.properties.most_positive_imbalanced_weekday,
                  "<br>","Hour: ", feature.properties.most_positive_imbalanced_hour,
                  "<br>","Average checkout: ", feature.properties.most_positive_imbalanced_avg_checkout.toFixed(2),
                  "<br>","Average return: ", feature.properties.most_positive_imbalanced_avg_return.toFixed(2)));
               }else{
                 layer.bindPopup((feature.properties.Name).concat("<br>","Lowest negative imbalanced pressure: ", feature.properties.most_negative_imbalanced_pressure.toFixed(2),
                 "<br>","Weekday: ",feature.properties.most_negative_imbalanced_weekday,
                 "<br>","Hour: ", feature.properties.most_negative_imbalanced_hour,
                 "<br>","Average checkout: ", feature.properties.most_negative_imbalanced_avg_checkout.toFixed(2),
                 "<br>","Average return: ", feature.properties.most_negative_imbalanced_avg_return.toFixed(2)));
               }
               break;
      case 17: if(feature.properties.most_positive_imbalanced_pressure == getMaxPositiveImbalance){
                 layer.bindPopup((feature.properties.Name).concat("<br>","Highest positive imbalance pressure: ",feature.properties.most_positive_imbalanced_pressure.toFixed(2),
                 "<br>",'\u00A0','\u00A0','\u00A0',"Weekday: ", feature.properties.most_positive_imbalanced_weekday,
                 "<br>",'\u00A0','\u00A0','\u00A0',"Hour: ", feature.properties.most_positive_imbalanced_hour,
                 "<br>",'\u00A0','\u00A0','\u00A0',"Average checkout: ", feature.properties.most_positive_imbalanced_avg_checkout.toFixed(2),
                 "<br>",'\u00A0','\u00A0','\u00A0',"Average return: ", feature.properties.most_positive_imbalanced_avg_return.toFixed(2)));
               }else{
                 layer.bindPopup((feature.properties.Name).concat("<br>","Lowest negative imbalance pressure: ",feature.properties.most_negative_imbalanced_pressure.toFixed(2),
                 "<br>",'\u00A0','\u00A0','\u00A0',"Weekday: ", feature.properties.most_negative_imbalanced_weekday,
                 "<br>",'\u00A0','\u00A0','\u00A0',"Hour: ", feature.properties.most_negative_imbalanced_hour,
                 "<br>",'\u00A0','\u00A0','\u00A0',"Average checkout: ", feature.properties.most_negative_imbalanced_avg_checkout.toFixed(2),
                 "<br>",'\u00A0','\u00A0','\u00A0',"Average return: ", feature.properties.most_negative_imbalanced_avg_return.toFixed(2)));
               }
               break;
      case 18: layer.bindPopup((feature.properties.Name).concat("<br>","Docks: ", feature.properties.Docks,
                "<br>","Weekday temporal usage type: ",tempClusterDesc(1,feature.properties.cluster_weekday),
                "<br>","Weekday activity group: ",ActClusterDesc(feature.properties.station_avg_ridership_cluster_weekday),
                "<br>","Weekend temporal usage type: ",tempClusterDesc(2,feature.properties.cluster_weekend),
                "<br>","Weekend activity group: ",ActClusterDesc(feature.properties.station_avg_ridership_cluster_weekend),
                "<br>","Highest positive imbalance pressure: ", feature.properties.most_positive_imbalanced_pressure.toFixed(2),
                "<br>",'\u00A0','\u00A0','\u00A0',"Weekday: ", feature.properties.most_positive_imbalanced_weekday,
                "<br>",'\u00A0','\u00A0','\u00A0',"Hour: ", feature.properties.most_positive_imbalanced_hour,
                "<br>",'\u00A0','\u00A0','\u00A0',"Average checkout: ", feature.properties.most_positive_imbalanced_avg_checkout.toFixed(2),
                "<br>",'\u00A0','\u00A0','\u00A0',"Average return: ", feature.properties.most_positive_imbalanced_avg_return.toFixed(2),
                "<br>","Lowest negative imbalance pressure: ", feature.properties.most_negative_imbalanced_pressure.toFixed(2),
                "<br>",'\u00A0','\u00A0','\u00A0',"Weekday: ", feature.properties.most_negative_imbalanced_weekday,
                "<br>",'\u00A0','\u00A0','\u00A0',"Hour: ", feature.properties.most_negative_imbalanced_hour,
                "<br>",'\u00A0','\u00A0','\u00A0',"Average checkout: ", feature.properties.most_negative_imbalanced_avg_checkout.toFixed(2),
                "<br>",'\u00A0','\u00A0','\u00A0',"Average return: ", feature.properties.most_negative_imbalanced_avg_return.toFixed(2)));
               break;
    }
  };

  //// markerFilter
  var markerFilter = function(feature, layer){
    switch(slide_state){
      case 1: return feature;
      case 2: return feature;
      case 3: return (feature.properties.cluster_weekday == 1);
      case 4: return (feature.properties.cluster_weekday == 2);
      case 5: return (feature.properties.cluster_weekday == 3);
      case 6: return feature;
      case 7: return (feature.properties.cluster_weekend == 1);
      case 8: return (feature.properties.cluster_weekend == 2);
      case 9: return (feature.properties.cluster_weekend == 3);
      case 10: return feature;
      case 11: return feature;
      case 12: return feature;
      case 13: return feature;
      case 14: return ((feature.properties.station_avg_ridership_weekday == getMaxValueWeekday) | (feature.properties.station_avg_ridership_weekday == getMinValueWeekday));
      case 15: return ((feature.properties.station_avg_ridership_weekend == getMaxValueWeekend) | (feature.properties.station_avg_ridership_weekend == getMinValueWeekend));
      case 16: return feature;
      case 17: return ((feature.properties.most_positive_imbalanced_pressure == getMaxPositiveImbalance) | (feature.properties.most_negative_imbalanced_pressure == getMaxNegativeImbalance));
      case 18: return feature;
    }
  };

  //// marker radius
  var markerRadius = function(feature){
    switch(slide_state){
      case 1: return (feature.properties.Docks)/1.5;
      case 2: return 8;
      case 3: return 8;
      case 4: return 8;
      case 5: return 8;
      case 6: return 8;
      case 7: return 8;
      case 8: return 8;
      case 9: return 8;
      case 10: return (18/(feature.properties.station_avg_ridership_cluster_weekday));
      case 11: return (18/(feature.properties.station_avg_ridership_cluster_weekend));
      case 12: return (18/(feature.properties.station_avg_ridership_cluster_weekday));
      case 13: return (18/(feature.properties.station_avg_ridership_cluster_weekend));
      case 14: return 8;
      case 15: return 8;
      case 16: return 8;
      case 17: return 8;
      case 18: return 8;
    }
  };

  //// marker border color
  var markerColor = function(feature){
    switch(slide_state){
      case 1: return "#0F4AA7";
      case 2: switch(feature.properties.cluster_weekday){
                case 1: return "#294993";
                case 2: return "#57BE25";
                case 3: return "#FDF300";
              }
              break;
      case 3: switch(feature.properties.cluster_weekday){
                case 1: return "#294993";
                case 2: return "#57BE25";
                case 3: return "#FDF300";
              }
              break;
      case 4: switch(feature.properties.cluster_weekday){
                case 1: return "#294993";
                case 2: return "#57BE25";
                case 3: return "#FDF300";
              }
              break;
      case 5: switch(feature.properties.cluster_weekday){
                case 1: return "#294993";
                case 2: return "#57BE25";
                case 3: return "#FDF300";
              }
              break;
      case 6: switch(feature.properties.cluster_weekend){
                case 1: return "#57BE25";
                case 2: return "#294993";
                case 3: return "#FDF300";
              }
              break;
      case 7: switch(feature.properties.cluster_weekend){
                case 1: return "#57BE25";
                case 2: return "#294993";
                case 3: return "#FDF300";
              }
              break;
      case 8: switch(feature.properties.cluster_weekend){
                case 1: return "#57BE25";
                case 2: return "#294993";
                case 3: return "#FDF300";
              }
              break;
      case 9: switch(feature.properties.cluster_weekend){
                case 1: return "#57BE25";
                case 2: return "#294993";
                case 3: return "#FDF300";
              }
              break;
      case 10: return "grey";
      case 11: return "grey";
      case 12: switch(feature.properties.final_cluster_weekday){
                 case 1: return "#294993";
                 case 2: return "#425E9F";
                 case 3: return "#667FB8";
                 case 4: return "#57BE25";
                 case 5: return "#73CE47";
                 case 6: return "#96E272";
                 case 7: return "#FDF300";
                 case 8: return "#FFF738";
                 case 9: return "#FFF963";
               }
               break;
      case 13: switch(feature.properties.final_cluster_weekend){
                 case 1: return "#57BE25";
                 case 2: return "#73CE47";
                 case 3: return "#96E272";
                 case 4: return "#294993";
                 case 5: return "#425E9F";
                 case 6: return "#667FB8";
                 case 7: return "#FDF300";
                 case 8: return "#FFF738";
                 case 9: return "#FFF963";
               }
               break;
      case 14: if(feature.properties.station_avg_ridership_weekday == getMaxValueWeekday){
                return "#FD3500";
               }else{
                 return "#0F4AA7";
               }
               break;
      case 15: if(feature.properties.station_avg_ridership_weekend == getMaxValueWeekend){
                return "#FD3500";
               }else{
                 return "#0F4AA7";
               }
               break;
      case 16: if(feature.properties.most_positive_imbalanced_pressure > Math.abs(feature.properties.most_negative_imbalanced_pressure)){
                return "#FD3500";
               }else{
                 return "#0F4AA7";
               }
               break;
      case 17: if(feature.properties.most_positive_imbalanced_pressure == getMaxPositiveImbalance){
                return "#FD3500";
               }else{
                 return "#0F4AA7";
               }
               break;
      case 18: return "#0F4AA7";
    }
  };

  //// marker fillColor
  var markerFillcolor = function(feature){
    switch(slide_state){
      case 1: return "#0F4AA7";
      case 2: switch(feature.properties.cluster_weekday){
                case 1: return "#294993";
                case 2: return "#57BE25";
                case 3: return "#FDF300";
              }
              break;
      case 3: switch(feature.properties.cluster_weekday){
                case 1: return "#294993";
                case 2: return "#57BE25";
                case 3: return "#FDF300";
              }
              break;
      case 4: switch(feature.properties.cluster_weekday){
                case 1: return "#294993";
                case 2: return "#57BE25";
                case 3: return "#FDF300";
              }
              break;
      case 5: switch(feature.properties.cluster_weekday){
                case 1: return "#294993";
                case 2: return "#57BE25";
                case 3: return "#FDF300";
              }
              break;
      case 6: switch(feature.properties.cluster_weekend){
                case 1: return "#57BE25";
                case 2: return "#294993";
                case 3: return "#FDF300";
              }
              break;
      case 7: switch(feature.properties.cluster_weekend){
                case 1: return "#57BE25";
                case 2: return "#294993";
                case 3: return "#FDF300";
              }
              break;
      case 8: switch(feature.properties.cluster_weekend){
                case 1: return "#57BE25";
                case 2: return "#294993";
                case 3: return "#FDF300";
              }
              break;
      case 9: switch(feature.properties.cluster_weekend){
                case 1: return "#57BE25";
                case 2: return "#294993";
                case 3: return "#FDF300";
              }
              break;
      case 10: return "grey";
      case 11: return "grey";
      case 12: switch(feature.properties.final_cluster_weekday){
                 case 1: return "#294993";
                 case 2: return "#425E9F";
                 case 3: return "#667FB8";
                 case 4: return "#57BE25";
                 case 5: return "#73CE47";
                 case 6: return "#96E272";
                 case 7: return "#FDF300";
                 case 8: return "#FFF738";
                 case 9: return "#FFF963";
               }
               break;
      case 13: switch(feature.properties.final_cluster_weekend){
                 case 1: return "#57BE25";
                 case 2: return "#73CE47";
                 case 3: return "#96E272";
                 case 4: return "#294993";
                 case 5: return "#425E9F";
                 case 6: return "#667FB8";
                 case 7: return "#FDF300";
                 case 8: return "#FFF738";
                 case 9: return "#FFF963";
               }
               break;
      case 14: if(feature.properties.station_avg_ridership_weekday == getMaxValueWeekday){
                return "#FD3500";
               }else{
                 return "#0F4AA7";
               }
               break;
      case 15: if(feature.properties.station_avg_ridership_weekend == getMaxValueWeekend){
                return "#FD3500";
               }else{
                 return "#0F4AA7";
               }
               break;
      case 16: if(feature.properties.most_positive_imbalanced_pressure > Math.abs(feature.properties.most_negative_imbalanced_pressure)){
                return "#FD3500";
               }else{
                 return "#0F4AA7";
               }
               break;
      case 17: if(feature.properties.most_positive_imbalanced_pressure == getMaxPositiveImbalance){
                return "#FD3500";
               }else{
                 return "#0F4AA7";
               }
               break;
      case 18: return "#0F4AA7";
    }
  };

  //// Style setting of station markers
  var markerStlye = function(feature){
    return{
      radius: markerRadius(feature),
      color: markerColor(feature),
      opacity: 1,
      fillColor: markerFillcolor(feature),
      fillOpacity: 0.7,
    };
  };

  //// Button click evet
  $('#previous_button').click(function(e) {
    slide_state -= 1;
    switch(slide_state){
      case 1: $('#previous_button').hide();
              $('#first_slide').show();
              $('#second_slide').hide();
              removeMarkers(markers);
              ajaxCall();
              break;
      case 2: $('#second_slide').show();
              $('#third_slide').hide();
              removeMarkers(markers);
              ajaxCall();
              break;
      case 3: $('#third_slide').show();
              $('#forth_slide').hide();
              removeMarkers(markers);
              ajaxCall();
              break;
      case 4: $('#forth_slide').show();
              $('#fifth_slide').hide();
              removeMarkers(markers);
              ajaxCall();
              break;
      case 5: $('#fifth_slide').show();
              $('#sixth_slide').hide();
              removeMarkers(markers);
              ajaxCall();
              break;
      case 6: $('#sixth_slide').show();
              $('#seventh_slide').hide();
              removeMarkers(markers);
              ajaxCall();
              break;
      case 7: $('#seventh_slide').show();
              $('#eighth_slide').hide();
              removeMarkers(markers);
              ajaxCall();
              break;
      case 8: $('#eighth_slide').show();
              $('#ninth_slide').hide();
              removeMarkers(markers);
              ajaxCall();
              break;
      case 9: $('#ninth_slide').show();
              $('#tenth_slide').hide();
              removeMarkers(markers);
              ajaxCall();
              break;
      case 10: $('#tenth_slide').show();
               $('#eleventh_slide').hide();
               removeMarkers(markers);
               ajaxCall();
               break;
      case 11: $('#eleventh_slide').show();
               $('#twelfth_slide').hide();
               removeMarkers(markers);
               ajaxCall();
               break;
      case 12: $('#twelfth_slide').show();
               $('#thirteenth_slide').hide();
               removeMarkers(markers);
               ajaxCall();
               break;
      case 13: $('#thirteenth_slide').show();
               $('#forteenth_slide').hide();
               removeMarkers(markers);
               ajaxCall();
               break;
      case 14: $('#forteenth_slide').show();
               $('#fifteenth_slide').hide();
               removeMarkers(markers);
               ajaxCall();
               break;
      case 15: $('#fifteenth_slide').show();
               $('#sixteenth_slide').hide();
               removeMarkers(markers);
               ajaxCall();
               break;
      case 16: $('#sixteenth_slide').show();
               $('#seventeenth_slide').hide();
               removeMarkers(markers);
               ajaxCall();
               break;
      case 17: $('#next_button').show();
               $('#seventeenth_slide').show();
               $('#eighteenth_slide').hide();
               removeMarkers(markers);
               ajaxCall();
               break;
      case 18: break;
    }
    console.log(slide_state);
  });

  $('#next_button').click(function(e){
    slide_state += 1;
    switch(slide_state){
      case 1: break;
      case 2: $('#previous_button').show();
              $('#first_slide').hide();
              $('#second_slide').show();
              removeMarkers(markers);
              ajaxCall();
              break;
      case 3: $('#second_slide').hide();
              $('#third_slide').show();
              removeMarkers(markers);
              ajaxCall();
              break;
      case 4: $('#third_slide').hide();
              $('#forth_slide').show();
              removeMarkers(markers);
              ajaxCall();
              break;
      case 5: $('#forth_slide').hide();
              $('#fifth_slide').show();
              removeMarkers(markers);
              ajaxCall();
              break;
      case 6: $('#fifth_slide').hide();
              $('#sixth_slide').show();
              removeMarkers(markers);
              ajaxCall();
              break;
      case 7: $('#sixth_slide').hide();
              $('#seventh_slide').show();
              removeMarkers(markers);
              ajaxCall();
              break;
      case 8: $('#seventh_slide').hide();
              $('#eighth_slide').show();
              removeMarkers(markers);
              ajaxCall();
              break;
      case 9: $('#eighth_slide').hide();
              $('#ninth_slide').show();
              removeMarkers(markers);
              ajaxCall();
              break;
      case 10: $('#ninth_slide').hide();
               $('#tenth_slide').show();
               removeMarkers(markers);
               ajaxCall();
               break;
      case 11: $('#tenth_slide').hide();
               $('#eleventh_slide').show();
               removeMarkers(markers);
               ajaxCall();
               break;
      case 12: $('#eleventh_slide').hide();
               $('#twelfth_slide').show();
               removeMarkers(markers);
               ajaxCall();
               break;
      case 13: $('#twelfth_slide').hide();
               $('#thirteenth_slide').show();
               removeMarkers(markers);
               ajaxCall();
               break;
      case 14: $('#thirteenth_slide').hide();
               $('#forteenth_slide').show();
               removeMarkers(markers);
               ajaxCall();
               break;
      case 15: $('#forteenth_slide').hide();
               $('#fifteenth_slide').show();
               removeMarkers(markers);
               ajaxCall();
               break;
      case 16: $('#fifteenth_slide').hide();
               $('#sixteenth_slide').show();
               removeMarkers(markers);
               ajaxCall();
               break;
      case 17: $('#sixteenth_slide').hide();
               $('#seventeenth_slide').show();
               removeMarkers(markers);
               ajaxCall();
               break;
      case 18: $('#next_button').hide();
               $('#seventeenth_slide').hide();
               $('#eighteenth_slide').show();
               removeMarkers(markers);
               ajaxCall();
               break;
    }
    console.log(slide_state);
  });

  dataArray = [];
  var ajaxCall = function(){$.ajax(dataset).done(function(data){
    parsed = parseData(data);
    dataArray = (parsed.features);
    getMaxValueWeekday = _.max(_.map(dataArray, function(x){return x.properties.station_avg_ridership_weekday;}));
    getMinValueWeekday = _.min(_.map(dataArray, function(x){return x.properties.station_avg_ridership_weekday;}));
    getMaxValueWeekend = _.max(_.map(dataArray, function(x){return x.properties.station_avg_ridership_weekend;}));
    getMinValueWeekend = _.min(_.map(dataArray, function(x){return x.properties.station_avg_ridership_weekend;}));
    getMaxPositiveImbalance = _.max(_.map(dataArray, function(x){return x.properties.most_positive_imbalanced_pressure;}));
    getMaxNegativeImbalance = _.max(_.map(dataArray, function(x){return x.properties.most_negative_imbalanced_pressure;}));
    markers = makeMarkers(parsed);
    plotMarkers(markers);
    map.fitBounds(markers.getBounds());
    });
  };

  ajaxCall();
});
