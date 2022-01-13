//var GeoAddr = "http://192.168.0.5:8080";
var GeoAddr = "http://localhost:8080";
var naver_map_version = '1641459092'

//1630584268 9/13

proj4.defs('EPSG:5179','+proj=tmerc +lat_0=38 +lon_0=127.5 +k=0.9996 +x_0=1000000 +y_0=2000000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs');
proj4.defs('EPSG:4326', '+proj=longlat +datum=WGS84 +no_defs');
ol.proj.proj4.register(proj4);
let newProj = ol.proj.get('EPSG:3857'); // 사용 좌표계
//let newProj = ol.proj.get('EPSG:4326'); // 사용 좌표계
let newProjExtent = newProj.getExtent(); // 지도의 범위
var popup_nm = document.getElementById('popup_nm');

var projectionSelect = "EPSG:3857";
var procisionFormat = new ol.coordinate.createStringXY(5);

/* 오픈 레이어스에서 WMTS API를 이용 브이월드 배경지도를 호출  */
let BaseLayer = new ol.layer.Tile({
	source: new ol.source.XYZ({
		url: 'https://xdworld.vworld.kr/2d/Base/service/{z}/{x}/{y}.png',
		format: new ol.format.GeoJSON
	}),
	name:'2D배경지도',
	visible: false,
	//   minResolution: 0,	
    //   maxResolution: 1400,
	  
});



let GrayLayer = new ol.layer.Tile({
	source: new ol.source.XYZ({
		url: 'http://xdworld.vworld.kr:8080/2d/gray/202002/{z}/{x}/{y}.png',
		format: new ol.format.GeoJSON
	}),
	name:'2D회색지도',
	minResolution: 0,	
    maxResolution: 1400,
	visible: false,
});

let midnightLayer = new ol.layer.Tile({
	source: new ol.source.XYZ({
		url: 'https://xdworld.vworld.kr/2d/midnight/service/{z}/{x}/{y}.png',
		format: new ol.format.GeoJSON
	}),
	name:'2D야간지도',
	minResolution: 0,	
    maxResolution: 1400,
	//visible: false,
    visible: false,
});

let OSMLayer = new ol.layer.Tile({
	source: new ol.source.OSM({crossOrigin: "anonymous",opaque:false,}),
	//minResolution: 1400,
	name:'OSM배경지도',
    visible: false,
    opacity:0.1,
});


let Satellite = new ol.layer.Tile({//2d위성영상지도
	source: new ol.source.WMTS({
        //layer : ["AIRPHOTO", "AIRPHOTO_2011", "AIRPHOTO_2012", "AIRPHOTO_2013", "AIRPHOTO_2014", "AIRPHOTO_2015", "AIRPHOTO_2016", "AIRPHOTO_2017", "AIRPHOTO_2018", "AIRPHOTO_2019"],
        layer: "AIRPHOTO",
        url : `http://210.117.198.120:8081/o2map/services`,
        service : 'WMTS',
        matrixSet : 'NGIS_AIR',
		style:"_null",
		format:"image/jpg", //
		projection: 'EPSG:5179',
        tileGrid : new ol.tilegrid.WMTS({ //영상지도 설정
            origin : [ -200000.0, 4000000.0 ],
            resolutions: [2088.96, 1044.48, 522.24, 261.12, 130.56, 65.28, 32.64, 16.32, 8.16, 4.08, 2.04, 1.02, 0.51, 0.255],//properties.wmtEmapOption.serverResolutions,
            matrixIds : [ '5','6', '7', '8', '9', '10', '11',
                    '12', '13', '14', '15', '16', '17', '18' ]
        }),
    }),
    //  maxResolution: 5,

	name:'위성사진',
	visible: false,
});

let Satellite2 = new ol.layer.Tile({//2d위성영상지도
	source: new ol.source.XYZ({
		url: 'https://xdworld.vworld.kr/2d/Satellite/202002/{z}/{x}/{y}.jpeg',
		//url: 'https://xdworld.vworld.kr/2d/Satellite/service/{z}/{x}/{y}.jpeg',
		format: new ol.format.GeoJSON
	}),
    //  maxResolution: 5,

	name:'위성사진(2018)',
	visible: false,
});

let big_baromap = new ol.layer.Tile({//큰글씨바로맵
	source: new ol.source.WMTS({
        //layer : ["AIRPHOTO", "AIRPHOTO_2011", "AIRPHOTO_2012", "AIRPHOTO_2013", "AIRPHOTO_2014", "AIRPHOTO_2015", "AIRPHOTO_2016", "AIRPHOTO_2017", "AIRPHOTO_2018", "AIRPHOTO_2019"],
        layer: "lowV_map",
        url : `http://210.117.198.120:8081/o2map/services`,
        key:'AF03D7A8A4FD1A2429536F14679F24A0',
        service : 'WMTS',
        matrixSet : 'korean',
		style:"korean",
		format:"image/png", //
		projection: 'EPSG:5179',

        tileGrid : new ol.tilegrid.WMTS({ //영상지도 설정
            origin : [ -200000.0, 4000000.0 ],
            resolutions: [2088.96, 1044.48, 522.24, 261.12, 130.56, 65.28, 32.64, 16.32, 8.16, 4.08, 2.04, 1.02, 0.51, 0.255],//properties.wmtEmapOption.serverResolutions,
            matrixIds : [ '5','6', '7', '8', '9', '10', '11',
                    '12', '13', '14', '15', '16', '17', '18' ]
        }),

    }),
    //  maxResolution: 5,
	name:'큰글씨바로맵',
	visible: false,
});

let Hybrid = new ol.layer.Tile({//2d위성영상지도
	source: new ol.source.XYZ({url: 'https://xdworld.vworld.kr/2d/Hybrid/service/{z}/{x}/{y}.png',
		format: new ol.format.GeoJSON
	}),
    // maxResolution: 5,
	name:'하이브리드',
	visible: false,
});

let weatherLayers = new ol.layer.Tile({//2d위성영상지도
	source: new ol.source.XYZ({
        url: 'https://tile.openweathermap.org/map/temp_new/{z}/{x}/{y}.png?cities=true&appid=015478be5809ffefdd5ce41c802a2e27',
        //url : 'https://maps.openweathermap.org/maps/2.0/weather/1h/TA2/{z}/{x}/{y}?appid=015478be5809ffefdd5ce41c802a2e27',
		format: new ol.format.GeoJSON
	}),
    // maxResolution: 5,
	name:'날씨',
	visible: false,
});

var overviewMapControl = new ol.control.OverviewMap({
    // see in overviewmap-custom.html to see the custom CSS used
    className: 'ol-overviewmap ol-custom-overviewmap',
    layers: [
              new ol.layer.Tile({
                  source: new ol.source.XYZ({
                      url: 'https://xdworld.vworld.kr/2d/Base/service/{z}/{x}/{y}.png',
                      format: new ol.format.GeoJSON
                  }),
              })
          ],
    collapseLabel: '\u00BB',
    label: '\u00AB',
    collapsed: false,
  });

let ncp_Naver_Layer = new ol.layer.Tile({//테스트레이어
	source: new ol.source.XYZ({
        url: 'https://map.pstatic.net/nrb/styles/basic/'+naver_map_version+'/{z}/{x}/{y}.png?mt=bg.ol.ts.lko',
		format: new ol.format.GeoJSON,
        attributions: ['<a href="http://map.naver.com"><img src="http://static.naver.net/maps2/logo_naver_s.png"></a>'],
	}),
    // maxResolution: 5,
 
	name:'네이버 지도',
	//visible: true,
    visible: false,
});

let ncp_Naver_terrain = new ol.layer.Tile({//테스트레이어
	source: new ol.source.XYZ({
        url: 'https://map.pstatic.net/nrb/styles/terrain/'+naver_map_version+'/{z}/{x}/{y}.png?mt=bg.ol.ts.lko&crs=EPSG:3857',
		format: new ol.format.GeoJSON,
        attributions: ['<a href="http://map.naver.com"><img src="http://static.naver.net/maps2/logo_naver_s.png"></a>'],
    
	}),
    // maxResolution: 5,
 
	name:'네이버 지형지도',
	visible: false,
    
});

let ncp_Naver_Satellite = new ol.layer.Tile({//테스트레이어
	source: new ol.source.XYZ({
        url: 'https://map.pstatic.net/nrb/styles/satellite/'+naver_map_version+'/{z}/{x}/{y}.png?mt=bg.ol.ts.lko&crs=EPSG:3857',
		format: new ol.format.GeoJSON,
        attributions: ['<a href="http://map.naver.com"><img src="http://static.naver.net/maps2/logo_naver_s.png"></a>'],
    
	}),
    // maxResolution: 5,
 
	name:'네이버 위성지도',
	visible: false,
});

let ncp_Naver_Satellite_Group = new ol.layer.Group({
    title: '네이버(편집도)',
    openInLayerSwitcher: false,
    layers: [
        new ol.layer.Tile({//테스트레이어
            source: new ol.source.XYZ({
                url: 'https://map.pstatic.net/nrb/styles/basic/'+naver_map_version+'/{z}/{x}/{y}.png?mt=bg.ol.ts.lko',
                format: new ol.format.GeoJSON,
                attributions: [ '<a href="http://map.naver.com"><img src="http://static.naver.net/maps2/logo_naver_s.png"></a>' ],
            }),
            name:'네이버 배경지도',
            visible: true,
            //visible: false,
            baseLayer: true,
        }),
        new ol.layer.Tile({//테스트레이어
            source: new ol.source.XYZ({
                url: 'https://map.pstatic.net/nrb/styles/terrain/'+naver_map_version+'/{z}/{x}/{y}.png?mt=bg.ol.ts.lko&crs=EPSG:3857',
                format: new ol.format.GeoJSON,
                attributions: [ '<a href="http://map.naver.com"><img src="http://static.naver.net/maps2/logo_naver_s.png"></a>' ],
            }),
            name:'네이버 지형지도',
            visible: false,
            baseLayer: true,
        }),
        new ol.layer.Tile({//테스트레이어
            source: new ol.source.XYZ({
                url: 'https://map.pstatic.net/nrb/styles/satellite/'+naver_map_version+'/{z}/{x}/{y}.png?mt=bg.ol.ts.lko&crs=EPSG:3857',
                format: new ol.format.GeoJSON,
                attributions: ['<a href="http://map.naver.com"><img src="http://static.naver.net/maps2/logo_naver_s.png"></a>'],
            }),
            name:'네이버 위성지도',
            visible: false,
            baseLayer: true,
        }),
        new ol.layer.Tile({//테스트레이어
            source: new ol.source.XYZ({
                url: 'https://map.pstatic.net/nrb/styles/basic/'+naver_map_version+'/{z}/{x}/{y}.png?mt=bg.ol.ts.lp&crs=EPSG:3857',
                format: new ol.format.GeoJSON,
                attributions: [ '<a href="http://map.naver.com"><img src="http://static.naver.net/maps2/logo_naver_s.png"></a>'],
            }),
            name:'네이버 용도구역(base)',
            visible: false,
            baseLayer: true,
        }),
        new ol.layer.Tile({//테스트레이어
            source: new ol.source.XYZ({
                url: 'https://map.pstatic.net/nrb/styles/satellite/'+naver_map_version+'/{z}/{x}/{y}.png?mt=bg.ol.ts.lp&crs=EPSG:3857',
                format: new ol.format.GeoJSON,
                attributions: ['<a href="http://map.naver.com"><img src="http://static.naver.net/maps2/logo_naver_s.png"></a>'],
            }),
            name:'네이버 용도구역(위성)',
            visible: false,
            baseLayer: true,
        }),
        new ol.layer.Tile({//테스트레이어
            source: new ol.source.XYZ({
                url: 'https://map.pstatic.net/nrb/styles/basic/'+naver_map_version+'/{z}/{x}/{y}.png?mt=ctt&crs=EPSG:3857',
                format: new ol.format.GeoJSON,
                attributions: ['<a href="http://map.naver.com"><img src="http://static.naver.net/maps2/logo_naver_s.png"></a>'],
            }),
            name:'네이버 도로교통',
            visible: true,
            baseLayer: false,
            opacity:0.3,
        }),
    ],
    visible:true,
    attributions: [
        new ol.control.Attribution({ 
            html: ['<a href="http://map.naver.com"><img src="http://static.naver.net/maps2/logo_naver_s.png"></a>']
        })
    ]
});


let road_stat_Layer = new ol.layer.Tile({//테스트레이어
	source: new ol.source.XYZ({
        url: 'https://its.go.kr:9443/geoserver/gwc/service/wmts/rest/ntic:N_LEVEL_11/ntic:REALTIME/EPSG:3857/EPSG:3857:{z}/{y}/{x}?format=image/png',
        format: new ol.format.GeoJSON,
	}),
    // maxResolution: 5,
    opacity:0.5,
	name:'도로교통상황',
	visible: false,
    
});

// carto 레이어
var carto_layers = new ol.layer.Group({
    title: 'CARTO 레이어',
    openInLayerSwitcher: false,
    layers: [
        new ol.layer.Tile({//테스트레이어
            source: new ol.source.XYZ({
                url: 'https://{a-c}.basemaps.cartocdn.com/rastertiles/voyager_nolabels/{z}/{x}/{y}.png',
                format: new ol.format.GeoJSON,
            }),
            name:'Voyager',
            visible: false,
            baseLayer: false,
            opacity:1.0,
        }),
        new ol.layer.Tile({//테스트레이어
            source: new ol.source.XYZ({
                url: 'https://{a-c}.basemaps.cartocdn.com/rastertiles/voyager_only_labels/{z}/{x}/{y}.png',
                format: new ol.format.GeoJSON,
            }),
            name:'Voyager_labels',
            visible: false,
            baseLayer: false,
            opacity:1.0,
        }),
        new ol.layer.Tile({//테스트레이어
            source: new ol.source.XYZ({
                url: 'https://{a-c}.basemaps.cartocdn.com/rastertiles/light_all/{z}/{x}/{y}.png',
                format: new ol.format.GeoJSON,
            }),
            name:'Positron',
            visible: false,
            baseLayer: false,
            opacity:1.0,
        }),
        new ol.layer.Tile({//테스트레이어
            source: new ol.source.XYZ({
                url: 'https://{a-c}.basemaps.cartocdn.com/rastertiles/dark_all/{z}/{x}/{y}.png',
                format: new ol.format.GeoJSON,
            }),
            name:'Dark Matter',
            visible: false,
            baseLayer: false,
            opacity:1.0,
        }),
    ],
    visible:false,
});

// A group layer for base layers
var OSM_layers = new ol.layer.Group({
    title: 'OSM 레이어',
    openInLayerSwitcher: false,
    layers: [
        new ol.layer.Tile({
        title: "Watercolor",
        source: new ol.source.Stamen({ layer: 'watercolor' }),
        baseLayer: false,
        visible: false,
        }),
        new ol.layer.Tile({
        title: "Toner",
        source: new ol.source.Stamen({ layer: 'toner' }),
        baseLayer: false,
        visible: false,
        }),
        new ol.layer.Tile({
        title: "OSM",
        source: new ol.source.OSM(),
        baseLayer: false,
        visible: false
        }),
    ],
    visible:false,
});




var base_layers = new ol.layer.Group({
    title: '배경지도',
    openInLayerSwitcher: true,
    layers: [
        carto_layers,
        GrayLayer,
        //ncp_Naver_Layer,
        BaseLayer,
        big_baromap,
        Satellite,
        Satellite2,
        Hybrid,
        weatherLayers,
        road_stat_Layer,
        midnightLayer,
        ncp_Naver_Satellite_Group,
    ]
});


 /**
 * 공장,창고,1종,2종근린 레이어
 *
 *
 */
  function factory_layers(PolygonName,setName){
    var vector = new ol.layer.Tile({	
                      source: new ol.source.TileWMS({
                       url: GeoAddr+'/geoserver/ENTER/wms',
                       params:{
                           'STYLES':'factory2',
                           'LAYERS':'ENTER:'+PolygonName,
                       },
                       serverType:'geoserver',
                       format: new ol.format.GeoJSON(),
                       crossOrigin: 'anonymous',
                     }),
                       minResolution: 0,
                       maxResolution: 11,
                       visible: false,
                   });
   vector.set("name",setName);
   map.addLayer(vector);
}


 /**
 * 공장,창고,1종,2종을 제외한 모든레이어
 * URL : http://openapi.nsdi.go.kr/nsdi/eios/OpenapiList.do?provOrg=NIA&gubun=F#
 * 참고사항 : QGIS 수정 추천
 */
function rest_layers(PolygonName,setName){
	var vector = new ol.layer.Tile({	
	 				  source: new ol.source.TileWMS({
					    url: GeoAddr+'/geoserver/ENTER/wms',
						params:{
							'STYLES':'41_etc',
							'LAYERS':'ENTER:'+PolygonName,
						},
						serverType:'geoserver',
						format: new ol.format.GeoJSON(),	
						crossOrigin: 'anonymous',	
					  }),
				    	minResolution: 0,
    					maxResolution: 11,
						visible: false,
					});
	vector.set("name",setName);
	map.addLayer(vector);
}

 /**
 * 전국모든건축물 레이어
 * URL : http://openapi.nsdi.go.kr/nsdi/eios/OpenapiList.do?provOrg=NIA&gubun=F#
 * 참고사항 : QGIS 수정 추천
 */
function All_BD_Layers(PolygonName,setName){

	var vector = new ol.layer.Tile({	
	 				  source: new ol.source.TileWMS({
					    url: GeoAddr+'/geoserver/ENTER/wms',
						params:{
							//'STYLES':'BD_info',
							'LAYERS':'ENTER:'+PolygonName,
                            'CQL_FILTER' : 'USABILITY IN (17000)'
						},
						serverType:'geoserver',
						format: new ol.format.GeoJSON(),	
						crossOrigin: 'anonymous',	
					  }),
				    	// minResolution: 0,
    					// maxResolution: 11,
						visible: false,
                        
					});
	vector.set("name",setName);
	map.addLayer(vector);
}

var all_bd_layers = new ol.layer.Tile({	
    source: new ol.source.TileWMS({
     url: GeoAddr+'/geoserver/ENTER/wms',
     params:{
         //'STYLES':'BD_info',
         'LAYERS':'ENTER:'+'BD_info',
         'CQL_FILTER' : 'USABILITY IN (17000)'
     },
     serverType:'geoserver',
     format: new ol.format.GeoJSON(),	
     crossOrigin: 'anonymous',	
   }),
     // minResolution: 0,
     // maxResolution: 11,
     visible: false,
    name:'전국건축물',
     
 });

var filter;
function setOperation(val) {
  console.log(val)
  if (filter) all_bd_layers.removeFilter(filter);
  filter = new ol.filter.CSS({ blend: val });
  all_bd_layers.addFilter(filter);
}

  /* 뷰 설정 초기 위치 값 및 지도의 지원 줌레벨 현재 줌레벨 지도의 좌표계설정을 설정  */
  let olView = new ol.View({
    //center: ol.proj.transform([127.100616,37.402142], 'EPSG:4326', 'EPSG:3857'),
    center:  [14266500.1385945, 4242489.929359414], 
    zoom: 18,
      minZoom : 1,
      maxZoom : 19,
      projection: newProj,
    extent: newProjExtent || undefined // 해당 지역을 지도에서 벗어나지 않도록 설정
    //extent : [13678546.51713, 3834188.8033424, 14854453.760059, 5314661.8558898],
    
  })
  
  
  //마우스좌표 소지하기
  var mouseCoordinate_Hover = document.getElementById('mouseCoordinate');
  var mouseControlCoordinate = new ol.control.MousePosition({
       coordinateFormat: new ol.coordinate.createStringXY(4),
       projection: 'EPSG:3857',
      //좌표계 설정 
      className: 'mousePointer_Coordinate', //css 클래스 이름 
      target: mouseCoordinate_Hover,//좌표를 뿌릴 element 
      undefinedHTML: '&nbsp;'
  });
  var mousePointer_Coordinate = document.getElementsByClassName(mousePointer_Coordinate);


  /* 지도객체 설정 DIV 영역에 지도를 그림  맵생성*/
/**
 * 맵생성 정의.
 *
 * @class
 * @augments ol.Map
 * @param {String} url 타일 URL
 * @param {Object} Controls Options
 */
let map = new ol.Map({
    layers: [OSM_layers,base_layers], // 타일레이어를 올림
    target: 'map', //대상이 되는 div 
    view: olView,
    logo:false,
    attribution:'',
    interactions: ol.interaction.defaults({ altShiftDragRotate:true, pinchRotate:true }),
    controls: ol.control.defaults().extend(
        [
            new ol.control.FullScreen({source:'fullscreen',}),
            new ol.control.ScaleLine({units: 'metric'}),
            overviewMapControl,
            mouseControlCoordinate,
            // new ol.control.LayerPopup({reverse: false}),
            new ol.control.Attribution(),
            new ol.control.Permalink({ visible: false, localStorage: true }),
            new ol.control.LayerSwitcher({ 
                target:$(".layerSwitcher").get(0),
                trash: true, 
                extent: true,
                collapsed: true, //false 는 열린상태로시작
                oninfo:function(l){alert(l.get("title"))},
            }),
        ]),
            
});


var r3D = new ol.render3D({
    /** /
    style: new ol.style.Style({
      stroke: new ol.style.Stroke({
        color: 'blue',
        width: 2
      }),
      fill: new ol.style.Fill({ color: 'red' })
    }),
    /**/
    // ghost: true,
    height:0, 
    maxResolution:0.6, 
    defaultHeight:3.5 
  });


var OSMBuildings_Layer = new ol.layer.Tile({
    title: "osmbuildings",
    source: new ol.source.XYZ({
        url: 'https://{a-c}.data.osmbuildings.org/0.2/anonymous/tile/{z}/{x}/{y}.json',
        crossOrigin: 'anonymous',
        format: new ol.format.GeoJSON({featureProjection: map.getView().getProjection()}),
        attributions: '© Data <a href="https://openstreetmap.org/copyright/">OpenStreetMap</a> © Map <a href="https://mapbox.com/">Mapbox</a> © 3D <a href="https://osmbuildings.org/copyright/">OSM Buildings</a>',
        projection: 'EPSG:3857',
        serverType:'OSM Buildings',
    }),
    minResolution: 0,
    maxResolution: 5,
    
})

var Vector_OSMBuildings = new ol.layer.Vector({
    title: "osmbuildings",
    source: new ol.source.XYZ({
        url: 'https://{a-c}.data.osmbuildings.org/0.2/anonymous/tile/{z}/{x}/{y}.json',
        crossOrigin: 'anonymous',
        format: new ol.format.GeoJSON,
        attributions: '© Data <a href="https://openstreetmap.org/copyright/">OpenStreetMap</a> © Map <a href="https://mapbox.com/">Mapbox</a> © 3D <a href="https://osmbuildings.org/copyright/">OSM Buildings</a>',
        projection: 'EPSG:3857',
        serverType:'OSM Buildings',
    }),
    minResolution: 0,
    maxResolution: 5,
    
})
//map.addLayer(OSMBuildings_Layer);
var dbp = new ol.layer.Vector({
    title: "DBPedia",
    source: new ol.source.Vector({
        url: '../data/dbpedia.json',
        format: new ol.format.GeoJSON({featureProjection: map.getView().getProjection()}),
        attributions: [ "&copy; DBPedia" ]
      }),
});
//map.addLayer(dbp);


//OSMBuildings_Layer.setRender3D(r3D);
//new OSMBuildings(map).load('https://d.data.osmbuildings.org/0.2/anonymous/tile/15/{x}/{y}.json');

/**
 * 맵 줌인아웃 딜레이조절
 *
 * @class
 * @augments ol.Map
 * @param {String} url 타일 URL
 * @param {Object} Controls Options
 */

//var duration = 1000; // 1 second
var duration = 0;
map.addControl(new ol.control.Zoom({
  duration: duration
}));
// map.addInteraction(new ol.interaction.MouseWheelZoom({
//   duration: duration
// }));
map.addInteraction(new ol.interaction.DoubleClickZoom({
    duration: duration
}));
map.addInteraction(new ol.interaction.KeyboardZoom({
    duration: duration
}));



/**
 * ol-ext Legend 범례 아이콘
 * https://viglino.github.io/ol-ext/examples/canvas/map.control.printdialog.html
 * @class
 * @augments ol.Map
 * @param {String} 
 * @param {Object} Controls Options
 */
var legend = new ol.legend.Legend({ 
    //title: '범례', 
    margin:120,
    //size: ol.size,
    items: 
    [
        {
            //title: '용도', 
            typeGeom: 'Point', 
            style: new ol.style.Style({ 
                image: new ol.style.Icon({ 
                src: 'https://map.naver.com/v5/assets/img/home/legend-popup_cadastral3.png',
                //crossOrigin: 'anonymous' // Enable print
                scale: 1.0,
                
                })
            }),
            //margin:80,
        },
        {
            //title: '국계', 
            typeGeom: 'Point', 
            style: new ol.style.Style({ 
                image: new ol.style.Icon({ 
                src: 'https://map.naver.com/v5/assets/img/home/legend-popup_cadastral5.png',
                //crossOrigin: 'anonymous' // Enable print
                scale: 1.0,
                
                })
            }),
            //margin:1,
            //margin:80,
        },
        // { 
        // title: 'Photo', 
        // typeGeom: 'Point', 
        // style: new ol.style.Style({ 
        //     image: new ol.style.Icon({ 
        //     src: 'https://api.vworld.kr/req/image?key=52AED5A5-5D49-35C0-97A4-AC567AA055F7&service=image&request=GetLegendGraphic&format=png&type=ALL&layer=LT_C_WKMBBSN&style=LT_C_WKMBBSN',
        //     //crossOrigin: 'anonymous' // Enable print
        // })})
        // },
        // {
        // title: 'Line', typeGeom: 'LineString', style: ol.style.Style.defaultStyle() 
        // },
        // {
        // title: 'Polygon', typeGeom: 'Polygon', style: ol.style.Style.defaultStyle() 
        // }
    ],
    row:4,
  });
  
// function _setLegend(srcUrl){
//     var return_Legend = new ol.legend.Legend({ 
//         title: 'Legend', 
//         margin: 5,
//         items: 
//         [
//             {
//             title: 'Church', 
//             typeGeom: 'Point', 
//             style: new ol.style.Style({ 
//                 image: new ol.style.Icon({ 
//                 src: srcUrl,
//                 crossOrigin: 'anonymous' // Enable print
//             })})
//             },
//         ]
//       });
//     return return_Legend; 
// }

  // Add a legend to the print
  var legendCtrl = new ol.control.Legend({ legend: legend });
  map.addControl(legendCtrl);

/**
 * ol-ext 검색기능
 * 
 * @class
 * @augments ol.Map
 * @param {String} 
 * @param {Object} Controls Options
 */

var plink = new ol.control.Permalink({ visible: false, localStorage: 'position' });
map.addControl(plink);
var SearchNominatim = new ol.control.SearchNominatim({ 
    zoomOnSelect: 13 ,
            //target: $(".options").get(0),
            polygon: true,
            reverse: true,
            position: true,	// Search, with priority to geo position
            maxItems:50,
});
map.addControl(SearchNominatim);

// Current selection
var sLayer = new ol.layer.Vector({
    source: new ol.source.Vector(),
    style: new ol.style.Style({
        image: new ol.style.Circle({
            radius: 5,
            stroke: new ol.style.Stroke({
                color: 'rgb(255,165,0)',
                width: 3
            }),
            fill: new ol.style.Fill({
                color: 'rgba(255,165,0,.3)'
            })
        }),
        stroke: new ol.style.Stroke({
            color: 'rgb(255,165,0)',
            width: 3
        }),
        fill: new ol.style.Fill({
            color: 'rgba(255,165,0,.3)'
        })
    })
});
map.addLayer(sLayer);

// Select feature when click on the reference index
SearchNominatim.on('select', function (e) {	// console.log(e);
    sLayer.getSource().clear();
    // Check if we get a geojson to describe the search
    if (e.search.geojson) {
        var format = new ol.format.GeoJSON();
        var f = format.readFeature(e.search.geojson, { dataProjection: "EPSG:4326", featureProjection: map.getView().getProjection() });
        sLayer.getSource().addFeature(f);
        var view = map.getView();
        var resolution = view.getResolutionForExtent(f.getGeometry().getExtent(), map.getSize());
        var zoom = view.getZoomForResolution(resolution);
        var center = ol.extent.getCenter(f.getGeometry().getExtent());
        // redraw before zoom
        setTimeout(function () {
            view.animate({
                center: center,
                zoom: Math.min(zoom, 16)
            });
        }, 100);
    }
    else {
        map.getView().animate({
            center: e.coordinate,
            zoom: Math.max(map.getView().getZoom(), 16)
        });
    }
});

var cap = new ol.control.WMTSCapabilities({ 
    // target: $('.options').get(0),
    target: document.body,
    srs: ['EPSG:3857'],
    cors: true,
    services: {
      'Géoportail-cartes' : 'https://wxs.ign.fr/cartes/geoportail/wmts?SERVICE=WMTS&VERSION=1.0.0&REQUEST=GetCapabilities',
      'Géoportail-ortho' : 'https://wxs.ign.fr/ortho/geoportail/wmts?SERVICE=WMTS&VERSION=1.0.0&REQUEST=GetCapabilities',
      'Géoportail-orthohisto' : 'https://wxs.ign.fr/orthohisto/geoportail/wmts?SERVICE=WMTS&VERSION=1.0.0&REQUEST=GetCapabilities',
      'Géoportail-satellite' : 'https://wxs.ign.fr/satellite/geoportail/wmts?SERVICE=WMTS&VERSION=1.0.0&REQUEST=GetCapabilities',
      'Géoportail-cartovecto' : 'https://wxs.ign.fr/cartovecto/geoportail/wmts?SERVICE=WMTS&VERSION=1.0.0&REQUEST=GetCapabilities',
      'Géoportail-economie' : 'https://wxs.ign.fr/economie/geoportail/wmts?SERVICE=WMTS&VERSION=1.0.0&REQUEST=GetCapabilities',
      'Géoportail-environnement' : 'https://wxs.ign.fr/environnement/geoportail/wmts?SERVICE=WMTS&VERSION=1.0.0&REQUEST=GetCapabilities',
      'Géoportail-sol' : 'https://wxs.ign.fr/sol/geoportail/wmts?SERVICE=WMTS&VERSION=1.0.0&REQUEST=GetCapabilities',
      'Géoportail-parcellaire' : 'https://wxs.ign.fr/parcellaire/geoportail/wmts?SERVICE=WMTS&VERSION=1.0.0&REQUEST=GetCapabilities',
      'Géoportail-transports' : 'https://wxs.ign.fr/transports/geoportail/wmts?SERVICE=WMTS&VERSION=1.0.0&REQUEST=GetCapabilities',
      'Géoportail-administratif' : 'https://wxs.ign.fr/administratif/geoportail/wmts?SERVICE=WMTS&VERSION=1.0.0&REQUEST=GetCapabilities',
      'Géoportail-altimetrie' : 'https://wxs.ign.fr/altimetrie/geoportail/wmts?SERVICE=WMTS&VERSION=1.0.0&REQUEST=GetCapabilities',
      'Géoportail-agriculture' : 'https://wxs.ign.fr/agriculture/geoportail/wmts?SERVICE=WMTS&VERSION=1.0.0&REQUEST=GetCapabilities',
      'Géoportail-CLC' : 'https://wxs.ign.fr/clc/geoportail/wmts?SERVICE=WMTS&VERSION=1.0.0&REQUEST=GetCapabilities'
    },
    // Show trace in the console
    trace: true
});
map.addControl(cap);

// cap.on('load', function(e) {
//     map.addLayer(e.layer);
//     e.layer.set('legend', e.options.data.legend);
//     plink.setUrlParam('url', e.options.source.url);
//     plink.setUrlParam('layer', e.options.source.layer);
// });
// Permalink
var url = plink.getUrlParam('url');
var layerName = plink.getUrlParam('layer');
if (url) {
    console.log(layerName)
    cap.loadLayer(url, layerName);
} else {
    //map.addLayer(new ol.layer.Tile({ name:"OSM", source: new ol.source.OSM() }));
}
/**
 * ol-ext 북마크기능
 * 
 * @class
 * @augments ol.Map
 * @param {String} 
 * @param {Object} Controls Options
 */
var bm = new ol.control.GeoBookmark({	
    className:'',
    title:'위치저장',
    placeholder:'현재위치를 저장할 이름을 입력해주세요',
    editable:true,
    namespace:'',
    marks:{	
        서울특별시: {pos:ol.proj.transform([14137098.7704, 4518294.3733],'EPSG:3857','EPSG:3857'), zoom:12, permanent: true },
        경기도: {pos:ol.proj.transform([14137746.2487, 4523110.1812],'EPSG:3857','EPSG:3857'), zoom:10, permanent: true },
        인천광역시: {pos:ol.proj.transform([14097076.4869, 4510383.1928],'EPSG:3857','EPSG:3857'), zoom:12, permanent: true },
        강원도: {pos:ol.proj.transform([14298968.1342, 4549120.4730],'EPSG:3857','EPSG:3857'), zoom:9, permanent: true },
        충청북도: {pos:ol.proj.transform([14211998.6615, 4388935.4897],'EPSG:3857','EPSG:3857'), zoom:10, permanent: true },
        충청남도: {pos:ol.proj.transform([14098194.1813, 4377290.9099],'EPSG:3857','EPSG:3857'), zoom:10, permanent: true },
        세종특별자치시: {pos:ol.proj.transform([14164133.7697, 4370447.3786],'EPSG:3857','EPSG:3857'), zoom:13, permanent: true },
        대전광역시: {pos:ol.proj.transform([14176438.7492, 4347599.0818],'EPSG:3857','EPSG:3857'), zoom:12, permanent: true },
        전라북도: {pos:ol.proj.transform([14131301.0439, 4265133.8728],'EPSG:3857','EPSG:3857'), zoom:11, permanent: true },
        전라남도: {pos:ol.proj.transform([14095454.1762, 4148884.3811],'EPSG:3857','EPSG:3857'), zoom:10, permanent: true },
        광주광역시: {pos:ol.proj.transform([14119526.8719, 4185146.6467],'EPSG:3857','EPSG:3857'), zoom:13, permanent: true },
        경상북도: {pos:ol.proj.transform([14346243.4774, 4383012.1517],'EPSG:3857','EPSG:3857'), zoom:10, permanent: true },
        대구광역시: {pos:ol.proj.transform([14315180.4002, 4281477.7573],'EPSG:3857','EPSG:3857'), zoom:12, permanent: true },
        울산광역시: {pos:ol.proj.transform([14395403.6834, 4237011.8155],'EPSG:3857','EPSG:3857'), zoom:12, permanent: true },
        경상남도: {pos:ol.proj.transform([14268864.4194, 4211177.2475],'EPSG:3857','EPSG:3857'), zoom:11, permanent: true },
        부산광역시: {pos:ol.proj.transform([14369958.4009, 4187000.7754],'EPSG:3857','EPSG:3857'), zoom:12, permanent: true },
        제주특별자치도: {pos:ol.proj.transform([14086235.3540, 3945511.1494],'EPSG:3857','EPSG:3857'), zoom:11, permanent: true },
    },
    
});
map.addControl(bm);

/**
 * ol-ext 프린터기능
 * https://viglino.github.io/ol-ext/examples/canvas/map.control.printdialog.html
 * @class
 * @augments ol.Map
 * @param {String} 
 * @param {Object} Controls Options
 */
// Print control
var printControl = new ol.control.PrintDialog();
printControl.setSize('A4');
map.addControl(printControl);

/* On print > save image file */
printControl.on(['print', 'error'], function(e) {
  // Print success
  if (e.image) {
    if (e.pdf) {
      // Export pdf using the print info
      var pdf = new jsPDF({
        orientation: e.print.orientation,
        unit: e.print.unit,
        format: e.print.size
      });
      pdf.addImage(e.image, 'JPEG', e.print.position[0], e.print.position[0], e.print.imageWidth, e.print.imageHeight);
      pdf.save(e.print.legend ? 'legend.pdf' : 'map.pdf');
    } else  {
      // Save image as file
      e.canvas.toBlob(function(blob) {
        var name = (e.print.legend ? 'legend.' : 'map.')+e.imageType.replace('image/','');
        saveAs(blob, name);
      }, e.imageType, e.quality);
    }
  } else {
    console.warn('No canvas to export');
  }
});


/**
 * SWIPE 스와이프 조절
 *
 *
 */
function modeSW(dom){
    $(dom).toggleClass("on");
    return $(dom).hasClass("on")? swipeOn() : swipeOff();
}

var ctrl;

function swipeOn(){
    // Control
    ctrl = new ol.control.Swipe();
    map.addControl(ctrl);
    // Set stamen on left
    ctrl.addLayer(ncp_Naver_Satellite_Group);
    // OSM on right
    ctrl.addLayer(new ol.layer.Tile({//테스트레이어
        source: new ol.source.XYZ({
            url: 'https://map.pstatic.net/nrb/styles/satellite/'+naver_map_version+'/{z}/{x}/{y}.png?mt=bg.ol.ts.lp&crs=EPSG:3857',
            format: new ol.format.GeoJSON,
            attributions: [ "&copy; <a href='http://www.naver.com'>NAVER</a>" ],
        }),
        name:'네이버 용도구역(위성)',
        visible: false,
    }),true);
}

function swipeOff(){
    var i;
    var l;
    if (ctrl.getMap()) {
        for (i=0; i<ctrl.layers.length; i++) {
            l = ctrl.layers[i];
            if (l.right) l.layer.un(['precompose','prerender'], ctrl.precomposeRight_);
    else l.layer.un(['precompose','prerender'], ctrl.precomposeLeft_);
            l.layer.un(['postcompose','postrender'], ctrl.postcompose_);
        }
        ctrl.getMap().renderSync();
    }
    ol.control.Control.prototype.setMap.call(ctrl, map);

    //map에 쌓여있는 swipe-control 삭제
    for(var j = 0 ; j < map.controls.array_.length ; j++){
        var check = $(map.controls.array_[j].element);
        if(check.hasClass("ol-swipe")){
            map.removeControl(map.controls.array_[j]);
        }
    }

    //레이어 및 제어 버튼 제거
    $('div').remove(".ol-swipe");
}

/**
 * 좌측 메뉴바
 *
 *
 */
// Overlay
var menu = new ol.control.Overlay ({ 
	closeBox : true, 
	className: "slide-left menu", 
	content: $("#menu").get(0),
    // hideOnClick:true
});
map.addControl(menu);

/**
 * 우측 메뉴바
 *
 *
 */
var menu2 = new ol.control.Overlay ({ 
	closeBox : true, 
	className: "slide-right menu2", 
	content: $("#menu2").get(0)
});
map.addControl(menu2);

var menu3 = new ol.control.Overlay ({ 
	closeBox : true, 
	className: "menu3 slide-right", 
	content: $("#menu3").get(0)
});
map.addControl(menu3);

var menu4 = new ol.control.Overlay ({ 
	closeBox : true, 
	className: "slide-right menu4 bx-flashing", 
	content: $("#menu4").get(0)
});
map.addControl(menu4);

var menu5 = new ol.control.Overlay ({ 
	closeBox : true, 
	className: "slide-right menu5", 
	content: $("#menu5").get(0)
});
map.addControl(menu5);

var menu6 = new ol.control.Overlay ({ 
	closeBox : true, 
	className: "slide-right menu6", 
	content: $("#menu6").get(0)
});
map.addControl(menu6);


/**
 * 좌측 메뉴 토글바
 *
 *
 */
// A toggle control to show/hide the menu
var t = new ol.control.Toggle(
	{	html: '<i class="fa fa-bars" ></i>',
		className: "menu btn btn-seungjang",
		title: "Menu",
		onToggle: function() { menu.toggle(); }
	});
map.addControl(t);

/**
 * 우측 메뉴 토글바
 *
 *
 */
var t2 = new ol.control.Toggle(
	{	
        html: '<i class="bx bxs-map-alt bx-tada-hover tab-btn-right"></i>',
		className: "menu2 btn btn-seungjang overlay-btn-right",
		title: "Menu2",
		onToggle: function() { menu2.toggle(); }
	});
map.addControl(t2);

var t3 = new ol.control.Toggle(
	{	
        html: '<i class="bx bx-minus-back bx-tada-hover tab-btn-right"></i>',
		className: "menu3 btn btn-seungjang",
		title: "Menu3",
		onToggle: function() { menu3.toggle(); }
	});
map.addControl(t3);

var t4 = new ol.control.Toggle(
	{	html: '<i class="fa fa-bars" ><spen>    기반시설</spen></i>',
		className: "menu4 btn btn-seungjang",
		title: "Menu4",
		onToggle: function() { menu4.toggle(); },
        autoActive : true,
        bar:new ol.control.Bar(),
	});
map.addControl(t4);

var t5 = new ol.control.Toggle(
	{	html: '<i class="fa fa-bars" ><spen>    제조현황</spen></i>',
		className: "menu5 btn btn-seungjang",
		title: "Menu5",
		onToggle: function() { menu5.toggle(); }
	});
map.addControl(t5);

var t6 = new ol.control.Toggle(
	{	html: '<i class="fa fa-bars" ><spen>    미정입니다</spen></i>',
		className: "menu6 btn btn-seungjang",
		title: "Menu6",
		onToggle: function() { menu6.toggle(); }
	});
map.addControl(t6);

/**
 * 하단 알림창
 *
 *
 */
// Control
var notification = new ol.control.Notification({
});
map.addControl(notification);

/**
 * feature 선택시 팝업창
 *
 *
 */
var select = new ol.interaction.Select({
    hitTolerance: 5,
    multi: true,
    condition: ol.events.condition.singleClick
  });
map.addInteraction(select);

var ttttt;
//Elements that make up the popup.
var container = document.getElementById('popup');
var content = document.getElementById('popup-content');
var closer = document.getElementById('popup-closer');

var popup2 = new ol.Overlay({
    element: container,
    positioning: 'bottom-center',
    stopEvent: false,
    offset: [0, -10]
});
map.addOverlay(popup2);

  //Add a click handler to hide the popup.
// closer.onclick = function () {
//     popup2.setPosition(undefined);
//     closer.blur();
//     return false;
// };

var html_content = `<table class="ui blue small selectable collapsing celled striped table">
<thead>
  <tr>
    <th>ATM name</th>
    <th>ATM Status</th>
    <th>Open incident(s)</th>
    <th>Weekly availability</th>
  </tr>
</thead>
<tbody>
  <tr>
    <td class="collapsing"> <a data-remote="true" href="/monitoring/atms/63?locale=en">8296735803</a>
      </td><td class="collapsing"> <span class="ui label device_status tiny" style="background-color:#db2828;">Out of service</span></td>
      <td class="collapsing"><span class="translation_missing" title="translation missing: en.2">2</span></td>
      <td class="collapsing"><div style="color:orange;"><i style="color:green;" class="large long arrow icon counterclockwise rotated45 right"></i>62.0%</div> </td>
    </tr>
  <tr>
    <td class="collapsing"> <a data-remote="true" href="/monitoring/atms/65?locale=en">2975421050</a>
      </td><td class="collapsing"> <span class="ui label device_status tiny" style="background-color:#21ba45;">In service</span></td>
      <td class="collapsing"><span class="translation_missing" title="translation missing: en.1">1</span></td>
      <td class="collapsing"><div style="color:green;"><i style="color:green;" class="large long arrow icon counterclockwise rotated45 right"></i>93.0%</div> </td>
    </tr>
  </tbody>
</table>`;
// Select control
var popup = new ol.Overlay.PopupFeature({
    popupClass: 'default anim',
    select: select,
    canFix: true,
    template: {
        title: 
            // 'nom',   // only display the name
            function(f) {
            return '등록공장';//+f.get('name')+'';
            },
        attributes: // [ 'region', 'arrond', 'cantons', 'communes', 'pop' ]
        {
            'region': { title: 'Région' },
            'arrond': { title: 'Arrondissement' },
            'cantons': { title: 'Cantons' },
            'communes': { title: 'Communes' },
            'name': { title: 'name' },
            // with prefix and suffix
            'pop': { 
                title: 'Population',  // attribute's title
                before: '',           // something to add before
                format: ol.Overlay.PopupFeature.localString(),  // format as local string
                after: ' hab.'        // something to add after
            },
            // calculated attribute
            'pop2': {
                title: 'Population (kHab.)',  // attribute's title
                format: function(val, f) { 
                    return Math.round(parseInt(f.get('pop'))/100).toLocaleString() + ' kHab.' 
                }
            },
            /* Using localString with a date * //*
            'date': { 
            title: 'Date', 
            format: ol.Overlay.PopupFeature.localString("ko-KR", { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) 
            }
            */
        }
    }
});
//map.addOverlay (popup);

/**
 * Cluster 클러스터
 * URL : 
 * 참고사항 : showInfo 함수
 * 
 */
// Cluster Source
// 자식 포인트의 스타일
var cluster_img = new ol.style.Circle({    
    radius: 5,
    stroke: new ol.style.Stroke({
        color: 'rgba(0,255,255,1)', 
        width: 1 
    }),
    fill: new ol.style.Fill({
        color: 'rgba(0,255,255,0.3)'
    })
});
// 자식 포인트와 부모 피쳐 사이에 그릴 선에 대한 스타일
var cluster_linkStyle = new ol.style.Style({
    image: cluster_img,
    stroke: new ol.style.Stroke({
        color: '#fff', 
        width: 1 
    }) 
});

// var selectCluster = new ol.interaction.SelectCluster({    
//     // 부모를 클릭하여 자식이 표시될때 부모와 자식간의 거리(px 단위)
//     pointRadius:7,
//     animate: true,
//     // 부모와 자식 사이에 그려질 선에 대한 스타일
//     featureStyle: function() {
//         return [ cluster_linkStyle ];
//     },
//     // 부모가 선택된 상태에서 다시 부모와 자식이 선택될때 선택된 요소의 스타일
//     style: function(f, res) {
//         var cluster = f.get('features');
//         if (cluster.length>1) {     // 부모 스타일
//             return getStyle(f,res);
//         } else { // 자식 스타일
//             return [
//                 new ol.style.Style({    
//                     image: new ol.style.Circle({    
//                         stroke: new ol.style.Stroke({ color: 'rgba(0,0,192,0.5)', width:2 }),
//                         fill: new ol.style.Fill({ color: 'rgba(0,0,192,0.3)' }),
//                         radius: 5
//                     })
//                 })
//             ];
//         }
//     }
// });

// selectCluster.getFeatures().on(['add'], function (e)
// {
//     var c = e.element.get('features');
//     if (c.length==1) { // 자식을 선택하때, 자식의 id 속성을 표시    
//         var feature = c[0];
//         console.log('Selected Feature Id = ' + feature.get('id'));
//     } else { // 부모를 선택할때, 부모가 가진 자식의 개수를 표시
//         console.log('Count = ' + c.length); 
//     }
// });
// selectCluster.getFeatures().on(['remove'], function (e)
// {    
//     //.
// });
//map.addInteraction(selectCluster);

var clusterSource = new ol.source.Cluster({
    distance: 40,
    source: new ol.source.Vector(),
    //minResolution: 50,	
    //maxResolution: 1400,
});

// Style for the clusters
var styleCache = {};
function getStyle (feature, resolution){
    var size = feature.get('features').length;
    var style = styleCache[size];
    if (!style) {
    var color = size>50 ? "191,84,113" : size>25 ? "3,103,166" : size>10 ? "56,155,166" : size>5 ? "242,116,5" : size>2 ? "242,116,5" : "130,40,11";
    var radius = Math.max(8, Math.min(size*0.75, 20));
    var dash = 2*Math.PI*radius/6;
    var dash = [ 0, dash, dash, dash, dash, dash, dash ];
    style = styleCache[size] = new ol.style.Style({
        image: new ol.style.Circle({
        radius: radius,
        stroke: new ol.style.Stroke({
            color: "rgba("+color+",0.5)", 
            width: 25 ,
            lineJoin: "bevel", //Line join style: bevel, round, or miter.
            //lineDash: dash, //Array.<number> Default is null (no dash)
            lineDash: [360,360], //Array.<number> Default is null (no dash)
            lineCap: "butt" //Line cap style: butt, round, or square.
        }),
        fill: new ol.style.Fill({
            color:"rgba("+color+",1)"
        })
        }),
        text: new ol.style.Text({
            text: size.toString(),
            //font: 'bold 12px comic sans ms',
            font: 'bold 15px sans ms',
            //textBaseline: 'top',
        fill: new ol.style.Fill({
            color: '#fff'
        })
        })
    });
    }
    return style;
}
// Animated cluster layer
var clusterLayer = new ol.layer.AnimatedCluster({
    name: 'Cluster',
    source: clusterSource,
    animationDuration: 700,
    // Cluster style
    style: getStyle,
    minResolution: 50,	
    //maxResolution: 1000,
});
map.addLayer(clusterLayer);
// Addfeatures to the cluster
function addFeatures(nb){
    var ext = map.getView().calculateExtent(map.getSize());
    var features=[];
    for (var i=0; i<nb; ++i){
        features[i]=new ol.Feature(new ol.geom.Point([ext[0]+(ext[2]-ext[0])*Math.random(), ext[1]+(ext[3]-ext[1])*Math.random()]));
        features[i].set('id',i);
    }
    clusterSource.getSource().clear();
    clusterSource.getSource().addFeatures(features);
}
//addFeatures(2000);




// 각 행정구역 마우스 오버시 하이라이팅
// 마우스 오버시 스타일 지정
var selectPointerMove = new ol.interaction.Select({
    condition: ol.events.condition.pointerMove,
    style: new ol.style.Style({
        stroke: new ol.style.Stroke({
            color: 'rgba(1, 38, 21, 1)',
            width: 2
        }),
        fill: new ol.style.Fill({
            color: 'rgba(83, 176, 174, 0.3)'
        })
    })
});
// interaction 추가
map.addInteraction(selectPointerMove);



/**
 * 문서시작시
 * 기능 : String 에 일치하는 레이어를 삭제
 * 참고사항 : 레이어를 추가할경우 항상 이름을 붙여줄것 
 */
$(document).ready(function(){
    //map.getView().setCenter([14138885.7929,4508222.2418])
    //map.getView().setZoom(19); 명산빌딩고정
    sgis_authkey();
    //youtube_run();
    //v월드 레이어 호출
    $.ajax({
        type: "POST", 
        url : "/location/layerList",
        data : '',
        success : function(result){
            $('#vLayerList').append(result);//v월드 레이어 테이블 추가
        },		
    });	
    map.addLayer(all_bd_layers);
    map.addLayer(DAN);
    map.addLayer(SDG_SANDAN);
    map.addLayer(YUCH);
    openapiTest4('test','도로명주소안내도');
    //factory_layers('factory','공장');
    //rest_layers('rest','주거시설');
    openapiTest('test','용도별건물정보서비스');
    openapiTest2('test','일반지도(지적도)');
    openapiTest3('test','항공지도(지적도)');
    openapiTest5('test','토지특성정보서비스');
    //openapiTest6('test','GIS건물통합정보');

    

    // All_BD_Layers('BD_info',"전국건축물");
    //Select_26_bld_cadastral("부산공장&지적도");

    //$(".left_wrap .left_nav ul .left_nav0 button").trigger("click");


    
    $('.nav-tabs').click(function(){
        var tab_id = $(this).attr('data-tab');
        console.log(tab_id);
        $('.nav-tabs li').removeClass('active');
        $('.tab-content').removeClass('active');

        $(this).addClass('active');
        $("#"+tab_id).addClass('active');
    });
    $('#navbar-brand').click(function(){
		var tab_id = $(this).attr('data-tab');

		$('#navSelect .navbar-brand li').removeClass('current');
		$('.tab-content').removeClass('current');

		$(this).addClass('current');
		$("#"+tab_id).addClass('current');
	});

    //pdf객체 옵션
    var option = {
        height: '673px',
        //pdfOpenParams: {view: 'FitV', page: '2'}
    }
    PDFObject.embed("/resources/new/img/2020년_공단_브로슈어_국문.pdf", "#tab1_brochure01",option);
    PDFObject.embed("/resources/new/img/중소기업세제세정지원제도.pdf", "#tab3_brochure01",option);
    PDFObject.embed("/resources/new/img/brochure_190223_hr.pdf", "#hs_brochure",option);

 });

/**
 * 주소검색 클릭시 상세주소입력창 다음주소api활용
 * 기능 : 주소검색시 시군구코드 가 담겨있다.
 * 참고사항 : 레이어를 추가할경우 항상 이름을 붙여줄것 
 */
 $("#srch_address").on("click", function(){
     //아래 코드처럼 테마 객체를 생성합니다.(color값은 #F00, #FF0000 형식으로 입력하세요.)
    //변경되지 않는 색상의 경우 주석 또는 제거하시거나 값을 공백으로 하시면 됩니다.
    var themeObj = {
        //bgColor: "", //바탕 배경색
        //searchBgColor: "", //검색창 배경색
        //contentBgColor: "", //본문 배경색(검색결과,결과없음,첫화면,검색서제스트)
        //pageBgColor: "", //페이지 배경색
        //textColor: "", //기본 글자색
        //queryTextColor: "", //검색창 글자색
        //postcodeTextColor: "", //우편번호 글자색
        //emphTextColor: "", //강조 글자색
        //outlineColor: "" //테두리
    };
    new daum.Postcode({
        theme:themeObj,
        onsearch:function(data){
            //q : 검색어
            //count : 결과총갯수
            console.log(data);
        },
        width:500,
        height:500,
        animation:true,
        focusInput:true,
        autoMapping:false,  //주소와 도로명주소가 무조건 메칭되게 설정
        shrothand:false,//서울특별시 -> 서울, 광주광역시 -> 광주 기능 세종,제주 제외
        oncomplete: function(data) {
            // 팝업에서 검색결과 항목을 클릭했을때 실행할 코드를 작성하는 부분입니다.
            // 예제를 참고하여 다양한 활용법을 확인해 보세요.
            $("#srch_address").val(data.address);
            srch_addr($('input[name=srch_address]').val());
            // postcode: ""
            // postcode1: ""
            // postcode2: ""
            // postcodeSeq: ""
            // zonecode: "06596"
            // address: "서울 서초구 서초대로49길 11"
            // addressEnglish: "11, Seocho-daero 49-gil, Seocho-gu, Seoul, Korea"
            // addressType: "R"
            // bcode: "1165010800"
            // bname: "서초동"
            // bnameEnglish: "Seocho-dong"
            // bname1: ""
            // bname1English: ""
            // bname2: "서초동"
            // bname2English: "Seocho-dong"
            // sido: "서울"
            // sidoEnglish: "Seoul"
            // sigungu: "서초구"
            // sigunguEnglish: "Seocho-gu"
            // sigunguCode: "11650"
            // userLanguageType: "K"
            // query: "서초대로49길"
            // buildingName: "명산빌딩"
            // buildingCode: "1165010800117120004020354"
            // apartment: "N"
            // jibunAddress: "서울 서초구 서초동 1712-4"
            // jibunAddressEnglish: "1712-4, Seocho-dong, Seocho-gu, Seoul, Korea"
            // roadAddress: "서울 서초구 서초대로49길 11"
            // roadAddressEnglish: "11, Seocho-daero 49-gil, Seocho-gu, Seoul, Korea"
            // autoRoadAddress: ""
            // autoRoadAddressEnglish: ""
            // autoJibunAddress: ""
            // autoJibunAddressEnglish: ""
            // userSelectedType: "R"
            // noSelected: "N"
            // hname: ""
            // roadnameCode: "4163412"
            // roadname: "서초대로49길"
            // roadnameEnglish: "Seocho-daero 49-gil"
        }
    }).open({
        popupTitle:'우편번호 검색',
        popupKey:'addressPopup',
        autoClose:true
    });
 });

/**
 * 레이어 삭제함수
 * 기능 : String 에 일치하는 레이어를 삭제
 * 참고사항 : 레이어를 추가할경우 항상 이름을 붙여줄것 
 */
function layerRemover(getName){
	map.getLayers().forEach(function(ollayer){
		if(ollayer.get("name")==getName){
			map.removeLayer(ollayer);//기존결과 삭제
		}
	})
}

 /**
 * 줌아웃 인 이벤트
 * 기능 : 해당주소를 5179좌표로 변환하여 알려준다.
 * 참고사항 : SGIS api 활용 단 주소가 옛날 체계를 사용함(법정동도 껴있음)
 *  duration 수치와 애니메이션수치 조절시 줌확대,이동속도 조절가능
 */
function flyTo(location, done) {
    var duration = 5000;
    //var zoom = map.getView().getZoom();
    var zoom = 9;
    var parts = 2;
    var called = false;
    function callback(complete) {
      --parts;
      if (called) {
          console.log("1");
        return;
      }
      if (parts === 0 || !complete) {
        console.log("2");
        console.log(complete);
        called = true;
        
        done(complete);
      }
    }
    olView.animate(
      {
        center: location,
        duration: duration,
      },
      callback
    );
    olView.animate(
      {
        zoom: zoom - 1,
        duration: duration / 2,
      },
      {
        zoom: 19,
        duration: duration / 2,
      },
      callback
    );
  }

 /**
 * SGIS 지오코딩
 * 기능 : 해당주소를 5179좌표로 변환하여 알려준다.
 * 참고사항 : SGIS api 활용 단 주소가 옛날 체계를 사용함(법정동도 껴있음)
 */
var test_cc
  function srch_addr(address){
	//주소
    console.log(address);
	var param = {
		"address":address,
		"accessToken" :	$("input[name=SGIS_AccessToken]").val(),
        "pagenum" : 0, //페이지수 default : 0
        "resultcount" : 1 // 결과수 최소 1 최대 50  기본값 5
	}
    $.ajax({
		type: "GET", 
		url : "https://sgisapi.kostat.go.kr/OpenAPI3/addr/geocode.json",
		data : param,
		dataType:'json',
		success : function(data){
            test_cc = data;
            var coordinate_x = data.result.resultdata[0].x;
            var coordinate_y = data.result.resultdata[0].y;
            var point = new ol.geom.Point([Number(coordinate_x),Number(coordinate_y)]);
            console.log(point);
            var p_3857 = proj4('EPSG:5179','EPSG:3857',[point.flatCoordinates[0],point.flatCoordinates[1]]);
            
            console.log(p_3857);
            flyTo(p_3857, function () {});

		}
    }); 
    
}

 /**
 * SGIS 리버스 지오코딩
 * 기능 : 해당좌표를 도로명,지번으로 조회한다
 * 참고사항 : SGIS api 활용 단 주소가 옛날 체계를 사용함(법정동도 껴있음)
 */
  function Reverse_GeoCodding(loc_x, loc_y, addr_type){
	console.log(loc_x);
	console.log(loc_y);
	
	//도로명주소
	var param = {
		"x_coor":loc_x,
		"y_coor":loc_y,
		"addr_type":"10",
		"accessToken" :	$("input[name=SGIS_AccessToken]").val()
	}
	var param2 = {
		"x_coor":loc_x,
		"y_coor":loc_y,
		"addr_type":"21",
		"accessToken" :	$("input[name=SGIS_AccessToken]").val()
	}


	geocode_promise_function(param2)
	.then(geocode_promise_function(param))
    .finally();
	//.then(notification.show([$("input[name=road_address]").val() +"  "+ $("input[name=bunji_address]").val()]));

}

function geocode_promise_function(param){
    return new Promise((resolve, reject) => {
      $.ajax({
		type: "GET", 
		//url : "/location/Reverse_GeoCodding",
		url : "https://sgisapi.kostat.go.kr/OpenAPI3/addr/rgeocode.json",
		data : param,
		dataType:'json',
		success : function(data){
            console.log(data);
            if(data.errMsg == 'Success'){
                if(data.result[0].hasOwnProperty('emdong_nm')){
                    $("input[name=bunji_address]").val(data.result[0].full_addr);	
                    notification.show([$("input[name=bunji_address]").val()+'<br>'+$("input[name=road_address]").val()]);
                    
                }else{
                    $("input[name=road_address]").val(data.result[0].full_addr);
                    notification.show([$("input[name=bunji_address]").val()+'<br>'+$("input[name=road_address]").val()]);
                    
                }
                if(data.result[0].hasOwnProperty('sido_nm')){
                    $("input[name=sido_nm]").val(data.result[0].sido_nm);
                }
            }else{
                $("input[name=road_address]").val(data.errMsg);
                notification.show([$("input[name=bunji_address]").val()+'<br>'+$("input[name=road_address]").val()]);
            }
			
		}
      }); 
    });
}

 /**
 * SGIS 인증키발급
 * 기능 : SGIS 인증키를 매번 실행시 받는다.
 * 참고사항 : 매번 실행시 인증키가 변경됌
 */
 function sgis_authkey(){
	var cunsumer_key = "c8fa0b47181b4c48897f";
	var consumer_secret = "5172bd52d4d7465ba144";
	var param = {
		"consumer_key" : cunsumer_key,
		"consumer_secret" : consumer_secret,
	}
	
	
	$.ajax({
		type: "GET", 
		//url : "/location/Reverse_GeoCodding",
		url : "https://sgisapi.kostat.go.kr/OpenAPI3/auth/authentication.json",
		data : param,
		dataType:'json',
		success : function(getResult){
			console.log(getResult);
			$("input[name=SGIS_AccessToken]").val(getResult.result.accessToken);
			

		},		
	});	
	
}

 /**
 * SGIS 인구주택총조사
 * 기능 : SGIS 인증키를 매번 실행시 받는다.
 * 참고사항 : 
 * adm_cd : 선택사항
 * 	non : 전국 시도 리스트
 * 2자리 : 해당 시도
 * 5자리 : 해당 시군구
 * 7자리 : 해당 읍면동
 * 
 * low_seach : 선택사항
 * 행정구역코드에 해당하는 정보만 요청 : 0
 * 1단계 하위 행정구역 정보 요청 : 1
 * 2단계 하위 행정구역 정보 요청 : 2
 */

function sgis_populations(sigunguCode){
    var param = {
        accessToken : 	$("input[name=SGIS_AccessToken]").val(),
        year : 2019,
        adm_cd : '',
        low_search : '1',  //default : 1
    }

    $.ajax({
		type: "GET", 
		//url : "/location/Reverse_GeoCodding",
		url : "https://sgisapi.kostat.go.kr/OpenAPI3/stats/population.json",
		data : param,
		dataType:'json',
		success : function(getResult){
			console.log(getResult);
			alert(getResult);
			

		},		
	});	
}



 /**
 * v월드 레이어 선택부분
 * URL : 
 * 참고사항 : select_wms 선택값 변경시 해당레이어 추가한다.
 * 
 * 
 */

$(function(){
	$(document).on('change','#select_wms',function(){
		let this_val = $(this).val();
		//console.log($(this).find("option[value='" + $(this).val() + "']").text()); 선택된 옵션의 text
		let this_layer = $(this).find("option[value='" + $(this).val() + "']").text();
		let this_title = $(this).prev().text();
		$('[name=TYPENAME]').val(this_val.toLowerCase());
		//선택시 레이어 삭제
		map.getLayers().forEach(function(layer){
			 if(layer.get("name")==this_layer){
			 	map.removeLayer(layer);//기존결과 삭제
			 }
		})
		let code = map.getView().getProjection().getCode();
		
		let layer_tile = new ol.layer.Tile({
	        //title:  'v월드',//this_title,
	        id: this_val,
	        //name: 'wms_theme', //vmap 올린 레이어를 삭제하거나 수정,변경할때 접근할 name 속성
	        projection: code,
	        extent: map.getView().getProjection().getExtent(), //[-20037508.34, -20037508.34, 20037508.34, 20037508.34]
	        //maxZoom: 21,
	        //minZoom: 10,
	        tilePixelRatio: 1,
	        tileSize: [512, 512],

	        source: new ol.source.TileWMS({
	            //url: "https://api.vworld.kr/req/wms?",
				url: "https://api.vworld.kr/req/wms?",
	            params: {
	                LAYERS: this_val.toLowerCase(),
	                STYLES: this_val.toLowerCase(),
	                CRS: code,
	                apikey: "C4C4FE9D-271A-3D7D-9DBE-BF7030912E04",
                    //key: "D8DA2C77-00ED-3DE3-8252-E183BB2F1B6A",

	                //DOMAIN:"http://ENTER.com",
	                //title: this_title,
					//title: 'v월드',
	                FORMAT: "image/png",
	                WIDTH:512,
	                HEIGHT:512
	            },
				//name:this_val,
		
		    }),
            opacity:0.3,
		});
    
		layer_tile.setZIndex(5);
		layer_tile.set("name",this_layer);
        layer_tile.set("id",this_layer);
		map.addLayer(layer_tile);
		let imgSrc = "https://api.vworld.kr/req/image?key=C4C4FE9D-271A-3D7D-9DBE-BF7030912E04&service=image&request=GetLegendGraphic&format=png&type=ALL&layer="+this_val+"&style="+this_val
		//$('#wms_image').html("<img src='"+imgSrc+"' alt ='"+this_title+"' >");
        $('#wms_image').append("<img src='"+imgSrc+"' alt ='"+this_title+"' >");
		//wms_imageTest.innerHTML +=  "<img src='"+imgSrc+"' alt ='"+this_title+"의 범례이미지' >";
		
	});//'change'
})

 /**
 * 용도별건물정보서비스 
 * URL : http://openapi.nsdi.go.kr/nsdi/eios/OpenapiList.do?provOrg=SCOS&gubun=S
 * 참고사항 : 국가공간정보포털에서 제공하는 자료는 하루 1만건이 최대
 * 그렇기때문에 공공데이터 포털에서 신청시 하루 100만건까지 되오나 현재 안되는상황
 * 결국 국가공간정보포털에서 받아가는 자료인데 국가정보포털꺼는 되오나 공공데이터포털꺼는 안된다.
 */
function openapiTest(PolygonName,setName){ //용도별건물정보서비스
	var params = { //이건 국가공간정보포털
		'backcolor':'0xRRGGBB',
		'SERVICE':'WMS',
		'REQUEST':'GetMap',
		'FORMAT':'image/png',
		'TRANSPARENT':'true',
		'STYLES':'',
		'VERSION':'1.3.0',
		'LAYERS':'F253',
		'WIDTH':'915',//512,256
		'HEIGHT':'700',//512,256
		'CRS':'EPSG:3857',
		'authkey':'e81986658904d15b1ac83f',
		//'ServiceKey':'C1wdeeOwmZvH+X0rpTyH7R9MhQWiSyw4hfGlGkY35pHKMrBY8rgKRvTyJlq48/U8Gz9+7AoqL/1yMbiEembLMg==',
		'exceptions':'blank'
	}
	var vector = new ol.layer.Tile({	
					  source: new ol.source.TileWMS({
					    url: 'http://openapi.nsdi.go.kr/nsdi/BuildingUseService/wms/getBuildingUseWMS',    //이건 국가공간정보포털
						//url: 'http://apis.data.go.kr/1611000/nsdi/BuildingUseService/wms/getBuildingUseWMS', //공공데이터포털
						params:params,
						/*
						params:	{
							'ServiceKey':'C1wdeeOwmZvH+X0rpTyH7R9MhQWiSyw4hfGlGkY35pHKMrBY8rgKRvTyJlq48/U8Gz9+7AoqL/1yMbiEembLMg==',
							 'LAYERS':'F253',
							 'CRS':'EPSG:5174',
							 'WIDTH':'256',//512,256
							 'HEIGHT':'256',//512,256
							 'FORMAT':'image/png',
							 'TRANSPARENT':'true',
							 'bgcolor':'0xFFFFFF',
							 'exceptions':'blank'
						},
						*/   
						serverType:'geoserver',
					  }),
				    	minResolution: 0,
    					maxResolution: 11,
						visible: false,
					});
	vector.set("name",setName);
	map.addLayer(vector);
}

 /**
 * 지도조회 (UTM-K)
 * URL : http://openapi.nsdi.go.kr/nsdi/map/LandInfoBaseMapUTMKBlueService
 * 참고사항 : 국가공간정보포털에서 제공하는 자료는 하루 1만건이 최대
 * 그렇기때문에 공공데이터 포털에서 신청시 하루 100만건까지 되오나 현재 안되는상황
 * 결국 국가공간정보포털에서 받아가는 자료인데 국가정보포털꺼는 되오나 공공데이터포털꺼는 안된다.
 */
  function openapiTest2(PolygonName,setName){ //용도별건물정보서비스
	var params = { //이건 국가공간정보포털
		'backcolor':'0xRRGGBB',
		'SERVICE':'WMS',
		'REQUEST':'GetMap',
		'FORMAT':'image/png',
		'TRANSPARENT':'true',
		'STYLES':'',
		'VERSION':'1.3.0',
		'LAYERS':'0',
		'WIDTH':'915',//512,256
		'HEIGHT':'700',//512,256
		'CRS':'EPSG:3857',
		'authkey':'cac01fd2da687a3ddff6de',
		//'ServiceKey':'C1wdeeOwmZvH+X0rpTyH7R9MhQWiSyw4hfGlGkY35pHKMrBY8rgKRvTyJlq48/U8Gz9+7AoqL/1yMbiEembLMg==',
		'exceptions':'blank'
	}
	var vector = new ol.layer.Tile({	
					  source: new ol.source.TileWMS({
					    url: '	http://openapi.nsdi.go.kr/nsdi/map/LandInfoBaseMapUTMKBlueService',    //이건 국가공간정보포털
						//url: 'http://apis.data.go.kr/1611000/nsdi/BuildingUseService/wms/getBuildingUseWMS', //공공데이터포털
						params:params,
						/*
						params:	{
							'ServiceKey':'C1wdeeOwmZvH+X0rpTyH7R9MhQWiSyw4hfGlGkY35pHKMrBY8rgKRvTyJlq48/U8Gz9+7AoqL/1yMbiEembLMg==',
							 'LAYERS':'F253',
							 'CRS':'EPSG:5174',
							 'WIDTH':'256',//512,256
							 'HEIGHT':'256',//512,256
							 'FORMAT':'image/png',
							 'TRANSPARENT':'true',
							 'bgcolor':'0xFFFFFF',
							 'exceptions':'blank'
						},
						*/   
						serverType:'geoserver',
					  }),
				    	//minResolution: 0,
    					//maxResolution: 11,
						visible: false,
					});
	vector.set("name",setName);
	map.addLayer(vector);
}

/**
 * 항공영상 지도조회 (UTM-K)
 * URL : http://openapi.nsdi.go.kr/nsdi/map/LandInfoBaseMapUTMKBlueService
 * 참고사항 : 국가공간정보포털에서 제공하는 자료는 하루 1만건이 최대
 * 그렇기때문에 공공데이터 포털에서 신청시 하루 100만건까지 되오나 현재 안되는상황
 * 결국 국가공간정보포털에서 받아가는 자료인데 국가정보포털꺼는 되오나 공공데이터포털꺼는 안된다.
 */
 function openapiTest3(PolygonName,setName){ //용도별건물정보서비스
	var params = { //이건 국가공간정보포털
		'backcolor':'0xRRGGBB',
		'SERVICE':'WMS',
		'REQUEST':'GetMap',
		'FORMAT':'image/png',
		'TRANSPARENT':'true',
		'STYLES':'',
		'VERSION':'1.3.0',
		'LAYERS':'0',
		'WIDTH':'915',//512,256
		'HEIGHT':'700',//512,256
		'CRS':'EPSG:3857',
		'authkey':'4833043bf4c024a731418f',
		//'ServiceKey':'C1wdeeOwmZvH+X0rpTyH7R9MhQWiSyw4hfGlGkY35pHKMrBY8rgKRvTyJlq48/U8Gz9+7AoqL/1yMbiEembLMg==',
		'exceptions':'blank'
	}
	var vector = new ol.layer.Tile({	
					  source: new ol.source.TileWMS({
					    url: 'http://openapi.nsdi.go.kr/nsdi/map/LandInfoBaseMapUTMKService',    //이건 국가공간정보포털
						//url: 'http://apis.data.go.kr/1611000/nsdi/BuildingUseService/wms/getBuildingUseWMS', //공공데이터포털
						params:params,
						/*
						params:	{
							'ServiceKey':'C1wdeeOwmZvH+X0rpTyH7R9MhQWiSyw4hfGlGkY35pHKMrBY8rgKRvTyJlq48/U8Gz9+7AoqL/1yMbiEembLMg==',
							 'LAYERS':'F253',
							 'CRS':'EPSG:5174',
							 'WIDTH':'256',//512,256
							 'HEIGHT':'256',//512,256
							 'FORMAT':'image/png',
							 'TRANSPARENT':'true',
							 'bgcolor':'0xFFFFFF',
							 'exceptions':'blank'
						},
						*/   
						serverType:'geoserver',
					  }),
				    	//minResolution: 0,
    					//maxResolution: 11,
						visible: false,
					});
	vector.set("name",setName);
	map.addLayer(vector);
}

/**
 * 도로명주소안내도 (UTM-K)
 * URL : http://openapi.nsdi.go.kr/nsdi/map/LandInfoBaseMapUTMKBlueService
 * 참고사항 : 국가공간정보포털에서 제공하는 자료는 하루 1만건이 최대
 * 그렇기때문에 공공데이터 포털에서 신청시 하루 100만건까지 되오나 현재 안되는상황
 * 결국 국가공간정보포털에서 받아가는 자료인데 국가정보포털꺼는 되오나 공공데이터포털꺼는 안된다.
 */
 function openapiTest4(PolygonName,setName){ //용도별건물정보서비스
	var params = { //이건 국가공간정보포털
		'backcolor':'0xRRGGBB',
		'SERVICE':'WMS',
		'REQUEST':'GetMap',
		'FORMAT':'image/png',
		'TRANSPARENT':'true',
		'STYLES':'',
		'VERSION':'1.3.0',
		'LAYERS':'0',
		'WIDTH':'915',//512,256
		'HEIGHT':'700',//512,256
		'CRS':'EPSG:3857',
		'authkey':'ce0232a474f36542b4cc47',
		//'ServiceKey':'C1wdeeOwmZvH+X0rpTyH7R9MhQWiSyw4hfGlGkY35pHKMrBY8rgKRvTyJlq48/U8Gz9+7AoqL/1yMbiEembLMg==',
		'exceptions':'blank'
	}
	var vector = new ol.layer.Tile({	
					  source: new ol.source.TileWMS({
					    url: 'http://openapi.nsdi.go.kr/nsdi/RoadService/wms/getRoadBaseMapITRF2000',    //이건 국가공간정보포털
						//url: 'http://apis.data.go.kr/1611000/nsdi/BuildingUseService/wms/getBuildingUseWMS', //공공데이터포털
						params:params,
						/*
						params:	{
							'ServiceKey':'C1wdeeOwmZvH+X0rpTyH7R9MhQWiSyw4hfGlGkY35pHKMrBY8rgKRvTyJlq48/U8Gz9+7AoqL/1yMbiEembLMg==',
							 'LAYERS':'F253',
							 'CRS':'EPSG:5174',
							 'WIDTH':'256',//512,256
							 'HEIGHT':'256',//512,256
							 'FORMAT':'image/png',
							 'TRANSPARENT':'true',
							 'bgcolor':'0xFFFFFF',
							 'exceptions':'blank'
						},
						*/   
						serverType:'geoserver',
					  }),
				    	//minResolution: 0,
    					//maxResolution: 11,
						visible: false,
					});
	vector.set("name",setName);
	map.addLayer(vector);
}

/**
 * 토지특성정보서비스 
 * URL : http://openapi.nsdi.go.kr/nsdi/LandCharacteristicsService/wms/getLandCharacteristicsWMS
 * 참고사항 : 국가공간정보포털에서 제공하는 자료는 하루 1만건이 최대
 * 그렇기때문에 공공데이터 포털에서 신청시 하루 100만건까지 되오나 현재 안되는상황
 * 결국 국가공간정보포털에서 받아가는 자료인데 국가정보포털꺼는 되오나 공공데이터포털꺼는 안된다.
 */
 function openapiTest5(PolygonName,setName){ //토지특성정보서비스
	var params = { //이건 국가공간정보포털
		'backcolor':'0xRRGGBB',
		'SERVICE':'WMS',
		'REQUEST':'GetMap',
		'FORMAT':'image/png',
		'TRANSPARENT':'true',
		'STYLES':'',
		'VERSION':'1.3.0',
		'LAYERS':'F251',
		'WIDTH':'915',//512,256
		'HEIGHT':'700',//512,256
		'CRS':'EPSG:3857',
		'authkey':'ef75690e3d4fd987ba4fb8',
		'exceptions':'blank'
	}
	var vector = new ol.layer.Tile({	
					  source: new ol.source.TileWMS({
					    url: 'http://openapi.nsdi.go.kr/nsdi/LandCharacteristicsService/wms/getLandCharacteristicsWMS',    //이건 국가공간정보포털
						params:params,
						/*
						params:	{
							'ServiceKey':'C1wdeeOwmZvH+X0rpTyH7R9MhQWiSyw4hfGlGkY35pHKMrBY8rgKRvTyJlq48/U8Gz9+7AoqL/1yMbiEembLMg==',
							 'LAYERS':'F253',
							 'CRS':'EPSG:5174',
							 'WIDTH':'256',//512,256
							 'HEIGHT':'256',//512,256
							 'FORMAT':'image/png',
							 'TRANSPARENT':'true',
							 'bgcolor':'0xFFFFFF',
							 'exceptions':'blank'
						},
						*/   
						serverType:'geoserver',
					  }),
				    	minResolution: 0,
    					maxResolution: 11,
						visible: false,
					});
	vector.set("name",setName);
	map.addLayer(vector);
}


/**
 * GIS건물통합조회
 * URL :http://openapi.nsdi.go.kr/nsdi/map/BldgisSpceService
 * 참고사항 : 국가공간정보포털에서 제공하는 자료는 하루 1만건이 최대
 * 그렇기때문에 공공데이터 포털에서 신청시 하루 100만건까지 되오나 현재 안되는상황
 * 결국 국가공간정보포털에서 받아가는 자료인데 국가정보포털꺼는 되오나 공공데이터포털꺼는 안된다.
 */
 function openapiTest6(PolygonName,setName){ //토지특성정보서비스
	var params = { //이건 국가공간정보포털
		'backcolor':'0xRRGGBB',
		'SERVICE':'WMS',
		'REQUEST':'GetMap',
		'FORMAT':'image/png',
		'TRANSPARENT':'true',
		'STYLES':'',
		'VERSION':'1.3.0',
		'LAYERS':'8',
		'WIDTH':'915',//512,256
		'HEIGHT':'700',//512,256
		'CRS':'EPSG:3857',
		'authkey':'d478d27dfa88d85d8d0d2b',
		'exceptions':'blank'
	}
	var vector = new ol.layer.Tile({	
					  source: new ol.source.TileWMS({
					    url: 'http://openapi.nsdi.go.kr/nsdi/map/BldgisSpceService',    //이건 국가공간정보포털
						params:params,
						serverType:'geoserver',
					  }),
				    	minResolution: 0,
    					maxResolution: 11,
						visible: false,
					});
	vector.set("name",setName);
	map.addLayer(vector);
}


/**
 * GIS건물통합조회 WFS 방식
 * URL : http://openapi.nsdi.go.kr/nsdi/RoadService/wfs/getRoadBaseMapUTMKWFS
 * 참고사항 : 국가공간정보포털에서 제공하는 자료는 하루 1만건이 최대
 * 그렇기때문에 공공데이터 포털에서 신청시 하루 100만건까지 되오나 현재 안되는상황
 * 결국 국가공간정보포털에서 받아가는 자료인데 국가정보포털꺼는 되오나 공공데이터포털꺼는 안된다.
 */
var test33;
 function openapiTest6_WFS(){ //용도별건물정보서비스
    console.log('openapiTest6_WFS');
    layerRemover("선택된건축물");


    var params = { //이건 국가공간정보포털
		'typename':'F8',//F8
		// 'pnu':'1174011000102450001',
		//'maxFeatures': '100',
        'resultType' : 'results',
		'srsName':'EPSG:3857',
		'authkey':'a2ccd7ca0cea2a5ca06552',
	//	'exceptions':'blank'
	}
    var params2 = {
        'typename':'TL_SCCO_CTPRVN',
        'sidoCode':'11',
        'maxFeatures':'100',
        'resultType' : 'results',
		'srsName':'EPSG:3857',
		'authkey':'972cec82a0857e6b1da38d',
	    //'exceptions':'blank'
    }
    $.ajax({
        url : 'http://openapi.nsdi.go.kr/nsdi/map/BldgisSpceService/wfs/getBldgisSpceWFS',
        type : 'GET',
        data : params,
        //contentType : 'application/x-www-form-urlencoded;charset=utf8',
        success: function(data){
            console.log(data);
            var format = new ol.format.XML({ //선 표시
                featureProjection:"EPSG:3857"
            });
    
            var vectorSource = new ol.source.Vector({  //선표시 벡터 적용
                features:format.read(data)
            });
    
            var vectorLayer = new ol.layer.Vector({
                source: vectorSource,
                style: new ol.style.Style({
                    stroke: new ol.style.Stroke({
                        color: 'blue',
                        width: 2
                    })
                })
            });
        	vectorLayer.set("name","선택된건축물");
        	map.addLayer(vectorLayer);
        }

    });

    $.ajax({
        url:'http://openapi.nsdi.go.kr/nsdi/RoadService/wfs/getRoadBaseMapUTMKWFS',
        type : 'GET',
        data : params2,
        //contentType : 'application/x-www-form-urlencoded;charset=utf8',
        success: function(data){
            console.log(data);
            var format = new ol.format.XML({ //선 표시
                featureProjection:"EPSG:5174"
            });
    
            var vectorSource = new ol.source.Vector({  //선표시 벡터 적용
                features:format.read(data)
            });
    
            var vectorLayer = new ol.layer.Vector({
                source: vectorSource,
                style: new ol.style.Style({
                    stroke: new ol.style.Stroke({
                        color: 'blue',
                        width: 2
                    })
                })
            });
        	vectorLayer.set("name","선택된건축물2");
        	map.addLayer(vectorLayer);
        }

    });

    
};







 /**
 * 스마트팩토리 공급기업 리스트
 * URL : 
 * 참고사항 : 스마트팩토리 시설 공급기업 주소를 변환한 X,Y좌표값으로 마커를 뿌린다.
 * 포인트마커 스마트공장 공급 기업 , 스마트공장공급기업
 * 
 */

function supply_companies(){
    var iconFeature_sum = [];
    var styles = SetstyleSymbol();
    $.ajax({
        url:'/location/supply_companies',
        data: '',
        //dataType:'json',
        type:'get',
        cache:false,					
        success:function(data){	
          var data_size = data.length;
          

          for(const element of data){
              var iconFeature = new ol.Feature({
                  geometry:new ol.geom.Point([Number(element.loc_x),Number(element.loc_y)]),
                  name:element.company_nm + ' ' + element.c_number + ' ' ,
                  content:element,
                  population:4000,
                  rainfall:500,
              });
              //iconFeature.setStyle(styles);
              iconFeature.setStyle(ksic_img_style('smart_factory'));
              
              iconFeature_sum.push(iconFeature);
          }
              //clusterSource.getSource().clear();
              //clusterSource.getSource().addFeatures(iconFeature_sum);
              var vectorSource = new ol.source.Vector({
              features: iconFeature_sum,
              name : '',
              });
              var vectorLayer = new ol.layer.Vector({
              source: vectorSource,
              opacity:1,
              visible: true,
              //minResolution: 0,	
              //maxResolution: 50,
              });

              vectorLayer.set("name", '스마트공장공급기업');
              map.addLayer(vectorLayer);
              
              
              
      },
      error: function(request,status,error){
      console.log("code:"+request.status+"\n"+"message:"+request.responseText+"\n"+"error:"+error.toString());
      }
    });
}



 /**
 * 하수처리시설
 * URL : 
 * 참고사항 : 하수처리장의 주소를 변환한 X,Y좌표값으로 마커를 뿌린다.
 * 포인트마커 하수처리
 * 
 */

function swgtr_fclty(){
    var iconFeature_sum = [];
    var styles = SetstyleSymbol();
    //#E2F0D9
    $.ajax({
        url:'/location/swgtr_fclty',
        data: '',
        //dataType:'json',
        type:'get',
        cache:false,					
        success:function(data){	
          var data_size = data.length;
          

          for(const element of data){
              var iconFeature = new ol.Feature({
                  geometry:new ol.geom.Point([Number(element.loc_x),Number(element.loc_y)]),
                  name:element.gungu + ' ' + element.fclty + ' ' + element.addr,
                  content:element,
                  population:4000,
                  rainfall:500,
              });
              //iconFeature.setStyle(styles);
              iconFeature.setStyle(ksic_img_style('hand-washing'));
              
              iconFeature_sum.push(iconFeature);
          }
             // clusterSource.getSource().clear();
             // clusterSource.getSource().addFeatures(iconFeature_sum);
              var vectorSource = new ol.source.Vector({
              features: iconFeature_sum,
              name : '',
              });
              var vectorLayer = new ol.layer.Vector({
              source: vectorSource,
              opacity:1,
              visible: true,
              //minResolution: 0,	
              //maxResolution: 50,
              });

              vectorLayer.set("name", '하수처리시설');
              map.addLayer(vectorLayer);
              
              
              
      },
      error: function(request,status,error){
      console.log("code:"+request.status+"\n"+"message:"+request.responseText+"\n"+"error:"+error.toString());
      }
    });
}


 /**
 * 폐기물처리시설
 * URL : 
 * 참고사항 : 폐기물처리시설의 주소를 변환한 X,Y좌표값으로 마커를 뿌린다.
 * 포인트마커 폐기물처리
 * 
 */

  function waste_fclty(category){

    layerRemover('산단/생활/재활용/허가');
    var iconFeature_sum = [];
    var styles = SetstyleSymbol();
    var param = {
        category : category,
    }
    $.ajax({
        url:'/location/waste_fclty',
        data: param,
        //dataType:'json',
        type:'get',
        cache:false,					
        success:function(data){	

                for(const element of data){
                    var iconFeature = new ol.Feature({
                        geometry:new ol.geom.Point([Number(element.loc_x),Number(element.loc_y)]),
                        name: element.fclty + ' ' + element.addr,
                        content:element,
                        population:4000,
                        rainfall:500,
                    });
                    
                    if(element.category == '2'){
                        iconFeature.setStyle(ksic_img_style("recycle2"));//지정폐기물
                    }else if(element.category =='1'){
                        iconFeature.setStyle(ksic_img_style("recycle"));
                    }
                    
                    iconFeature_sum.push(iconFeature);
                }
              //clusterSource.getSource().clear();
              //clusterSource.getSource().addFeatures(iconFeature_sum);
              var vectorSource = new ol.source.Vector({
              features: iconFeature_sum,
              name : '',
              });
              var vectorLayer = new ol.layer.Vector({
              source: vectorSource,
              opacity:1,
              visible: true,
              //minResolution: 0,	
              //maxResolution: 50,
              });
              if(category == '2'){
                vectorLayer.set("name", '지정/재활용/허가');    
                layerRemover('지정/재활용/허가');
              }else{
                vectorLayer.set("name", '생활/재활용/허가');    
                layerRemover('생활/재활용/허가');
              }
              
              map.addLayer(vectorLayer);
              
              
              
      },
      error: function(request,status,error){
      console.log("code:"+request.status+"\n"+"message:"+request.responseText+"\n"+"error:"+error.toString());
      }
    });
}

function waste_fclty_sandan(category){



    var iconFeature_sum = [];
    var styles = SetstyleSymbol();
    var param = {
        category : category,
    }
    $.ajax({
        url:'/location/waste_fclty_sandan',
        data: param,
        //dataType:'json',
        type:'get',
        cache:false,					
        success:function(data){	

                for(const element of data){
                    var iconFeature = new ol.Feature({
                        geometry:new ol.geom.Point([Number(element.loc_x),Number(element.loc_y)]),
                        name: element.fclty + ' ' + element.addr,
                        content:element,
                        population:4000,
                        rainfall:500,
                    });
                    
                    if(element.category == '2'){
                        iconFeature.setStyle(ksic_img_style("recycle2"));//지정폐기물
                    }else if(element.category =='1'){
                        iconFeature.setStyle(ksic_img_style("recycle"));
                    }
                    
                    iconFeature_sum.push(iconFeature);
                }
              //clusterSource.getSource().clear();
              //clusterSource.getSource().addFeatures(iconFeature_sum);
              var vectorSource = new ol.source.Vector({
              features: iconFeature_sum,
              name : '',
              });
              var vectorLayer = new ol.layer.Vector({
              source: vectorSource,
              opacity:1,
              visible: true,
              //minResolution: 0,	
              //maxResolution: 50,
              });
              if(category == '2'){
                vectorLayer.set("name", '산단/지정/재활용/허가');    
                layerRemover('산단/지정/재활용/허가');
              }else{
                vectorLayer.set("name", '산단/생활/재활용/허가');    
                layerRemover('산단/생활/재활용/허가');
              }
              
              map.addLayer(vectorLayer);
              
              
              
      },
      error: function(request,status,error){
      console.log("code:"+request.status+"\n"+"message:"+request.responseText+"\n"+"error:"+error.toString());
      }
    });
}


 /**
 * PointMarker 
 * URL : 
 * 참고사항 : 등록공장의 주소를 변환한 X,Y좌표값으로 마커를 뿌린다.
 * 포인트마커
 * 
 */
var fillNo = 0; //색선택 순번
var fillColor =[
    'rgba(0, 236, 45, .5)',
    'rgba(253, 203, 186, .5)',
    'rgba(58, 65, 111, .5)',
    'rgba(251, 207, 51, .5)',
    'rgba(74, 23, 123, .5)',
    'rgba(254, 228, 218, .5)',
    'rgba(33, 212, 203, .5)',
    'rgba(171, 37, 76, .5)',
    'rgba(31, 141, 106, .5)',
    'rgba(255, 0, 128, .5)',
];
 /**
 * 포인트마크 스타일, 마커스타일 
 * URL : 
 * 참고사항 : 마커스타일
 * 포인트마커
 * 
 */
function ksic_img_style(ksic_code){
    var custom_bg_color = '#FFF';
    var custom_bg_fill = '#000';
    // switch(ksic_code){
    //     case 'recycle'      : custom_bg_color = '#FFF'; break;
    //     case 'recycle2'  : custom_bg_color = '#FFF'; break;
    //     default :  custom_bg_color = '#FFF';
    // };
    if(ksic_code == 'hand-washing'){
        //custom_bg_color = '';
        custom_bg_color = '#4BC126';
        custom_bg_fill = '#022601';

        //#E2F0D9
    }
    var img_Style = new ol.style.Style ({
        image: new ol.style.Photo ({
          //src: '/resources/assets/img/factory_img.jpg',
          src: '/resources/assets/img/ksic_icon/'+ ksic_code + '.png',
          radius: 10,
          crop: true,
          kind: 'circle', //
          shadow: 5,
          onload: function() { vector.changed(); },
          stroke: new ol.style.Stroke({
            width: 3,
            color: custom_bg_color,//fillColor[fillNo],
          }),
        //   fill: new ol.style.Fill({
        //       width:3,
        //       color:custom_bg_fill,
        //   })
        })
    
    });
    return img_Style;
}

function ksic_img_style_2(ksic_code){
    var custom_bg_color = '#FFF';
    // switch(ksic_code){
    //     case 'recycle'      : custom_bg_color = '#FFF'; break;
    //     case 'recycle2'  : custom_bg_color = '#FFF'; break;
    //     default :  custom_bg_color = '#FFF';
    // };

    var img_Style = new ol.style.Style ({
        image: new ol.style.Photo ({
          //src: '/resources/assets/img/factory_img.jpg',
          src: '/resources/assets/img/ksic_icon/'+ ksic_code + '.png',
          radius: 8,
          crop: true,
          kind: 'circle', //
          shadow: 5,
          //onload: function() { vector.changed(); },
          stroke: new ol.style.Stroke({
            width: 2,
            color: custom_bg_color,//fillColor[fillNo],
          }),
          fill: new ol.style.Fill({
              width:2,
              color:'#000',
          })
        })
    
    });
    return img_Style;
}


function pointMarker_(geometry_point){
	$('input[name=ksic_ind_code]').val(geometry_point);
	var fill = new ol.style.Fill({color: fillColor[fillNo]});
	var styles = SetstyleSymbol();
	var param = {
		ind_code : geometry_point,
		fac_addr : $('input[name=ksic_div_code]').val()
	};
    var ksic_code =  $('input[name=ksic_ind_code]').val();
	var iconFeature_sum = [];
	var ksic_input = "";
    console.log("포인트마커");
	if($('input[name=ksic_ind_code]').val() != null && $('input[name=ksic_ind_code]').val() != "" && Number($('input[name=ksic_ind_code]').val() > 100)) {	
	 $.ajax({
          url:'/location/makerlist',
          data: param,
		  //dataType:'json',
          type:'get',
		  cache:false,					
          success:function(data){
					$.ajax({
						type: "POST", 
						url : "/location/ksic",
						data : ({ ksic_no : $('input[name=ksic_ind_code]').val() }),
						dataType : "json",
						success : function(result){
							ksic_input = result[0].ksic_no + " : "+ result[0].ksic_nm + ' 총 '+ data_size +' 개';
							console.log(ksic_input);
						},		
					});			
            var data_size = data.length;
            console.log(data);
            notification.show(["검색하신 업종은 "+$('input[name=ksic_ind_code]').val()+" 입니다."]);
            $('#srch_ind_code_result').html('<i class="fas fa-industry"></i><span> 코드 : '+ $('input[name=ksic_ind_code]').val() +' 총 ' + data_size + '개<span>');
            //alert("검색하신 업종은 "+$('input[name=ksic_ind_code]').val()+" 입니다."+"등록공장 갯수는 ??????"+" 총 등록된 건축물대장의 수는 "+data_size+" 개 입니다.",'제목이지롱','눌러봐');

            for(const element of data){
                var iconFeature = new ol.Feature({
                    geometry:new ol.geom.Point([Number(element.loc_x),Number(element.loc_y)]),
                    name:element.comp_nm + ' ' + element.int_nm+" "+element.ind_code,
                    content:element,
                    population:4000,
                    rainfall:500,
                });
                //iconFeature.setStyle(styles);
                iconFeature.setStyle(ksic_img_style_2(ksic_code.substring(0,2)));
                //iconFeature.setStyle(markerStyle);
                iconFeature_sum.push(iconFeature);
            }
                clusterSource.getSource().clear();
                clusterSource.getSource().addFeatures(iconFeature_sum);
                var vectorSource = new ol.source.Vector({
                features: iconFeature_sum,
                name : ksic_input
                });
                var vectorLayer = new ol.layer.Vector({
                source: vectorSource,
                opacity:1,
                visible: true,
                //minResolution: 0,	
                //maxResolution: 50,
                });

                $('#dropList').removeClass('show');
                vectorLayer.set("name", '업종명 : '+$('input[name=ksic_ind_code]').val()+ '[' + data_size+ ' 개]');
                map.addLayer(vectorLayer);
                youtube_run();
                
                
                
                if(fillNo == 9){
                    fillNo = 0;
                }else{
                    fillNo++;					
                }
        },
        error: function(request,status,error){
        console.log("code:"+request.status+"\n"+"message:"+request.responseText+"\n"+"error:"+error.toString());
        }
    });
        if(fillNo == 9){
            fillNo = 0;
        }else{
            fillNo++;					
        }
    }else{
        alert("세분류 이상부터 검색가능합니다. (ex 101)");
    }
    //다끝나고 
    
}

 /**
 * symbol 심볼 
 * URL : 
 * 참고사항 : 
 * 
 * 
 */
var glyph = ol.style.FontSymbol.prototype.defs.glyphs;
// Get font glyph
var theGlyph = "maki-industrial";
function SetstyleSymbol(feature){
    var st= [];
        // Shadow style
        st.push ( new ol.style.Style({
            image: new ol.style.Shadow({
            radius: 10,
            blur: 3,
            offsetX: 0,
            offsetY: 0,
            fill: new ol.style.Fill({
                color: "rgba(0,0,0,0.5)"
            })
            })
        }))

        st.push ( new ol.style.Style({
        image: new ol.style.FontSymbol({
                form: 'bubble', //"hexagone", 
                /*
                fontSymbol 가능한것들
                <select id="form" onchange="vector.changed();" >
                    <option value="none" selected="selected">none</option>
                    <option value="circle">circle</option>
                    <option value="poi">poi</option>
                    <option value="bubble">bubble</option>
                    <option value="marker">marker</option>
                    <option value="coma">coma</option>
                    <option value="shield">shield</option>
                    <option value="blazon">blazon</option>
                    <option value="bookmark">bookmark</option>
                    <option value="hexagon">hexagon</option>
                    <option value="diamond">diamond</option>
                    <option value="triangle">triangle</option>
                    <option value="sign">sign</option>
                    <option value="ban">ban</option>
                    <option value="lozenge">lozenge</option>
                    <option value="square">square</option>
                </select>
                */
                text:'',
                gradient: true,/* 그라데이션 줄래말래?  */ 
                glyph:'maki-building',//car[Math.floor(Math.random()*car.length)], 
                font:'sans-serif',
                fontSize: 1,
                fontStyle: '',
                /*
                <select id="style" onchange="vector.changed();" >
                    <option value="">unset</option>
                    <option value="bold" >bold</option>
                    <option value="italic" >italic</option>
                    <option value="bold italic" >bold italic</option>
                </select>
                */
                radius: 15, 
                //offsetX: -15,
                //rotation: Number($("#rotation").val())*Math.PI/180,  // 회전각
                rotation: 0,  // 회전각
                rotateWithView: false,
                //offsetY: $("#offset").prop('checked') ? -Number($("#radius").val()):0 ,
                offsetY:-15 ,
                color: fillColor[fillNo],  //심볼컬러
                fill: new ol.style.Fill({ color: 'green' }),
                stroke: new ol.style.Stroke({ color: 'white', width: 1 }) 
                // fill : new ol.style.Fill({color: fillColor[fillNo]}),
                // stroke : new ol.style.Stroke({color: 'white', width: 2,height:2,opacity:1}),
            }),
            stroke: new ol.style.Stroke({color: 'black', width: 2,height:2,opacity:1}),
            fill: new ol.style.Fill({color: fillColor[fillNo]}),
        }));
        
    return st;
}


/**
 * 용도지역,지구,구역 확인 
 * URL : 
 * 참고사항 : 클릭 이벤트시 용도지역 160개 레이어를 3857좌표를 5174좌료로 변환후 ST_Intersects 함수활용
 *  SELECT gid,	a0,	a1,	a2,	TO_CHAR(a3, 'YYYY-MM-DD') as a3, ST_transform(geom ,3857)FROM z_shp.al_00_d025_20210614 ad WHERE ST_Intersects(ad.geom , ST_GeomFromText('POINT('||#{loc_x}||'     '||#{loc_y}||')' , 5174))
 * 
 */
function Dist_Info(loc_x, loc_y,p_5179){
	//newsInput();
	var param = {
		'loc_x' : loc_x, 
		'loc_y' : loc_y,
	}

	Reverse_GeoCodding(p_5179[0],p_5179[1],"10");
	//building_info();

	$.ajax({
		type: "POST", 
		url : "/location/dist_Info",
		data : param,
		success : function(result){
			console.log(result);
			if(result[0].a2 != '' || result[0].a2 != null || result[0].a2 != undefined){
				var InnerResult = '';
				for(var i = 0; i < result.length; i ++){
					InnerResult += result[i].a2 + '<br>';
				}
				
				$('#dist_info').html(InnerResult);
            
			}else {
				//notification.show('미확인 지역입니다.');
			}
		
		},		
	});
}

//검색창 산업분류검색
/**
 * Keypress 이벤트 업종코드 및 색인어 검색시 dropList
 * URL : 
 * 참고사항 : 
 *  
 * 
 */
$('input[name=ksic_ind_code]').on('keyup change',function(){
	$('#dropList').addClass('show');
	var ksic_no = $('input[name=ksic_ind_code]').val();
	var people = [];
	if(ksic_no == ""){
		$('#dropList').removeClass('show');
	}else{
		if(isNaN(ksic_no)){
			//문자일경우
			if(ksic_no != null && ksic_no !== ""){
					$.ajax({
						type: "POST", 
						url : "/location/ksic_keyword",
						data : ({ ksic_kw : ksic_no }),
						dataType : "json",
						success : function(result){
							var htmlInner = "";
							for(var i = 0; i < result.length; i++){
								htmlInner += "<span><a class='dropdown-item' value = '"+result[i].ksic_no+"'href = 'javascript:pointMarker_("+result[i].ksic_no+")'>"+result[i].ksic_no+" : "+result[i].ksic_nm+"</a></span><br>";
							}
							$('#dropList').html(htmlInner);
						},		
					});						
			}
		}else{
			//숫자일경우
					$.ajax({
						type: "POST", 
						url : "/location/ksic",
						data : ({ ksic_no : ksic_no }),
						dataType : "json",
						success : function(result){
							var htmlInner = "";
							for(var i = 0; i < result.length; i++){
								htmlInner += "<span><a class='dropdown-item' value = '"+result[i].ksic_no+"'href = 'javascript:pointMarker_("+result[i].ksic_no+")'>"+result[i].ksic_no+" : "+result[i].ksic_nm+"</a></span><br>";
							}
							$('#dropList').html(htmlInner);
						},		
					});
	
		}
	}
	
});		
$('input[name=ksic_ind_code_]').on('keyup change',function(){
	$('#dropList_').addClass('show');
	var ksic_no = $('input[name=ksic_ind_code_]').val();
	var people = [];
	if(ksic_no == ""){
		$('#dropList_').removeClass('show');
	}else{
		if(isNaN(ksic_no)){
			//문자일경우
			if(ksic_no != null && ksic_no !== ""){
					$.ajax({
						type: "POST", 
						url : "/location/ksic_keyword",
						data : ({ ksic_kw : ksic_no }),
						dataType : "json",
						success : function(result){
							var htmlInner = "";
							for(var i = 0; i < result.length; i++){
								htmlInner += "<span><a class='dropdown-item' value = '"+result[i].ksic_no+"'href = 'javascript:pointMarker_("+result[i].ksic_no+")'>"+result[i].ksic_no+" : "+result[i].ksic_nm+"</a></span><br>";
							}
							$('#dropList_').html(htmlInner);
						},		
					});						
			}
		}else{
			//숫자일경우
					$.ajax({
						type: "POST", 
						url : "/location/ksic",
						data : ({ ksic_no : ksic_no }),
						dataType : "json",
						success : function(result){
							var htmlInner = "";
							for(var i = 0; i < result.length; i++){
								htmlInner += "<span><a class='dropdown-item' value = '"+result[i].ksic_no+"'href = 'javascript:pointMarker_("+result[i].ksic_no+")'>"+result[i].ksic_no+" : "+result[i].ksic_nm+"</a></span><br>";
							}
							$('#dropList_').html(htmlInner);
						},		
					});
	
		}
	}
	
});		


/**
 * 산업단지 검색
 * URL : 
 * 참고사항 : 산업단지 지역 몇 업종코드검색시 앞 2개 가능유무 검색
 *  Web은 DB접근 불가로 geoserver를 통하여 접근
 * 
 */
function srch_danji(danji_div_code,danji_ind_code){
    layerRemover("검색한산업단지");
	var vector = new ol.layer.Vector({	
					  source: new ol.source.Vector({
					    url: function(extentArea) {
							
			                var strUrl = GeoAddr+'/geoserver/ENTER/wfs?service=' +
			                    'WFS' +
			                    '&version=1.3.0' +
			                    '&request=GetFeature' +
			                    '&typename=ENTER:srch_danji'+
			                    '&outputFormat=application/json'+
			                    '&srsname=EPSG:3857'+
								'&style=DAM_DAN';
								//+'&bbox=' + extentArea.join(',') + ',EPSG:3857';
								
								
							if(danji_div_code != null && danji_div_code != ''){
								strUrl +='&viewparams=sigungu:'+danji_div_code+';';
								//strUrl +="&CQL_FILTER=''";
							}else{
								strUrl +="&viewparams=sigungu:;";
							}
							if(danji_ind_code != null && danji_ind_code != ''){
								strUrl += 'ksic_code:c'+danji_ind_code.substring(0,2)+';';
							}
							return strUrl;
						},
					    format: new ol.format.GeoJSON(),
						//strategy: ol.loadingstrategy.bbox 해당 
					  }),					  	
					//   style:new ol.style.Style({
					// 	stroke: new ol.style.Stroke({
					// 		//color: 'rgba(81,49,147,1.0)',
					// 		color: 'rgba(222,0,0,1.0)',
					// 		width: 3
					// 	}),
					// 	fill: new ol.style.Fill({
					// 		//color: 'rgba(191,227,74,0.5)',
					// 		color: 'rgba(200,0,0,0.5)',
					// 		width: 1,
					// 	}),	
					//   }),
                      style:new ol.style.Style({
						stroke: new ol.style.Stroke({
							//color: 'rgba(81,49,147,1.0)',
							color: 'rgba(242,51,34,0.8)',
							width: 5
						}),
						fill: new ol.style.Fill({
							//color: 'rgba(191,227,74,0.5)',
							color: 'rgba(242,178,155,0.5)',
							width: 1,
						}),	
					  }),
					  minResolution: 0,
					  maxResolution: 1000,
					  
					});                  
   
	vector.set("name","검색한산업단지");
	map.addLayer(vector);
    youtube_run_2();
}
		
/**
 * 산업단지 클러스터
 * URL : 
 * 참고사항 : 산업단지레이어는 포인트,폴리곤 2개가있다.
 * 
 * 
 */

function srch_danji_cluster(danji_div_code,danji_ind_code){
    // for(const element of data){
    //     var iconFeature = new ol.Feature({
    //         geometry:new ol.geom.Point([Number(element.loc_x),Number(element.loc_y)]),
    //         name:element.comp_nm + ' ' + element.int_nm+" "+element.ind_code,
    //         content:element,
    //         population:4000,
    //         rainfall:500,
    //     });
    //     iconFeature.setStyle(styles);

    //     //iconFeature.setStyle(markerStyle);
    //     iconFeature_sum.push(iconFeature);
    // }
    //     clusterSource.getSource().clear();
    //     clusterSource.getSource().addFeatures(iconFeature_sum);

    var vector = new ol.layer.Vector({	
            source: new ol.source.Vector({
              url: function(extentArea) {
                  
                  var strUrl = GeoAddr+'/geoserver/ENTER/wfs?service=' +
                      'WFS' +
                      '&version=1.3.0' +
                      '&request=GetFeature' +
                      '&typename=ENTER:srch_danji_p'+
                      '&outputFormat=application/json'+
                      '&srsname=EPSG:3857'+
                      '&style=DAM_DAN';
                      //+'&bbox=' + extentArea.join(',') + ',EPSG:3857';
                      
                      
                  if(danji_div_code != null && danji_div_code != ''){
                      strUrl +='&viewparams=sigungu:'+danji_div_code+';';
                      //strUrl +="&CQL_FILTER=''";
                  }else{
                      strUrl +="&viewparams=sigungu:;";
                  }
                  if(danji_ind_code != null && danji_ind_code != ''){
                      strUrl += 'ksic_code:c'+danji_ind_code.substring(0,2)+';';
                  }
                  return strUrl;
              },
              format: new ol.format.GeoJSON(),
              //strategy: ol.loadingstrategy.bbox 해당 
            }),					  	
            style:new ol.style.Style({
              stroke: new ol.style.Stroke({
                  //color: 'rgba(81,49,147,1.0)',
                  color: 'rgba(222,0,0,1.0)',
                  width: 3
              }),
              fill: new ol.style.Fill({
                  //color: 'rgba(191,227,74,0.5)',
                  color: 'rgba(200,0,0,0.5)',
                  width: 1,
              }),	
            }),
            minResolution: 50,
            maxResolution: 1000,
            
          });                   
    vector.set("name","검색한산업단지_P");
    map.addLayer(vector);        
}

/**
 * 드롭다운 클릭
 * URL : 
 * 참고사항 : 변한다.
 * 
 * 
 */

$('.dropdown-item').on('click',function(){
	$('input[name=ksic_ind_code]').val(this.value);
});


// 모든 텍스트의 변경에 반응합니다.
$("input[name=road_address]").on("propertychange change keyup paste input", function() {

    // 현재 변경된 데이터 셋팅
    //newValue = $(this).val();

    // 현재 실시간 데이터 표츌
    notification.show([$("input[name=road_address]").val() +"  "+ $("input[name=bunji_address]").val()]);
});

//팝업창
function OverlayMaker_(InnerHtml){
    $(popup_nm).popover({
      placement: 'top',
      html: true,
      content: InnerHtml,  //name으로 먹인 값들 가져옴
    });
    $(popup_nm).popover('show');
}


/**
 * 클릭 이벤트 맵선택 맵클릭
 * URL : 
 * 참고사항 : 답이없다..
 *  5179 x값과 y값을 Dist_Info()함수에 넘겨준다.
 * 
 */
map.on('click', function (evt) {

    var feature = map.forEachFeatureAtPixel(evt.pixel,
        function (feature) {
            return feature;
        });
    vworld_wfs(evt);
    if (feature) {
        var coordinates = feature.getGeometry().getCoordinates();
        //alert(feature.get('name'));
        //popup.setPosition(evt.coordinate);
        console.log("실행탄다!");
        //popup.show();

        // https://www.hasudoinfo.or.kr/stat/selectPlant.do
        // bscFctCd: 26290PB001R  //26290 시군구코드 발송하고 PB001R붙이면됌
        var param = {
            ADDR_1: "부산광역시 남구 용호동 12",
            BSC_FCT_CLS_NM: "공공하수처리시설",
            BSC_FCT_NM: "남부",
            FCT_CPC: 340000,
            GUGUN: "남구",
            SIDO: "부산광역시",
            SIT_AREA: 123399,
            TEL: "051-713-0133",
            TRT_DSTR_AREA: 4269,
            TRT_END_HAN_NM: null,
            TRT_FRF_HAN_NM: "MBR, MLE",
            TRT_MOC_HAN_NM: "막 계열, A2O 계열",
            
        }
        console.log(feature);
        //alert(feature.getGeometry());
        popup2.setPosition(coordinates);
        // content.innerHTML = `<table class="ui blue small selectable collapsing celled striped table">
        // <thead>
        //   <tr>
        //     <th>ATM name</th>
        //     <th>ATM Status</th>
        //     <th>Open incident(s)</th>
        //     <th>Weekly availability</th>
        //   </tr>
        // </thead>
        // <tbody>
        //   <tr>
        //     <td class="collapsing"> 
        //         <a data-remote="true" href="/monitoring/atms/63?locale=en">${feature.j.content.fclty}</a>
        //       </td><td class="collapsing"> <span class="ui label device_status tiny" style="background-color:#db2828;">Out of service</span></td>
        //       <td class="collapsing"><span class="translation_missing" title="translation missing: en.2">2</span></td>
        //       <td class="collapsing"><div style="color:orange;"><i style="color:green;" class="large long arrow icon counterclockwise rotated45 right"></i>62.0%</div> </td>
        //     </tr>
        //   <tr>
        //     <td class="collapsing"> <a data-remote="true" href="/monitoring/atms/65?locale=en">2975421050</a>
        //       </td><td class="collapsing"> <span class="ui label device_status tiny" style="background-color:#21ba45;">In service</span></td>
        //       <td class="collapsing"><span class="translation_missing" title="translation missing: en.1">1</span></td>
        //       <td class="collapsing"><div style="color:green;"><i style="color:green;" class="large long arrow icon counterclockwise rotated45 right"></i>93.0%</div> </td>
        //     </tr>
        //   </tbody>
        // </table>`;
    } else {
        popup2.setPosition(undefined);
    }

	var p_5179 = proj4('EPSG:3857','EPSG:5179',[evt.coordinate[0],evt.coordinate[1]]);
	var p_5174 = proj4('EPSG:3857','EPSG:5174',[evt.coordinate[0],evt.coordinate[1]]);
	var p_5181 = proj4('EPSG:3857','EPSG:5181',[evt.coordinate[0],evt.coordinate[1]]);
    var p_4326 = proj4('EPSG:3857','EPSG:4326',[evt.coordinate[0],evt.coordinate[1]]);
    
    Dist_Info(p_5174[0],p_5174[1],p_5179);
    //notification.show([$("input[name=bunji_address]").val()]);
        
    
    
    console.log('3857 : ' + evt.coordinate[0],evt.coordinate[1]);
	console.log('4326 : ' + p_4326);
	console.log('5179 : ' + p_5179);
	console.log('5174 : ' + p_5174);
	console.log('5181 : ' + p_5181);
    //openapiTest6_WFS();
    Select_bld_cad(p_5174[1],p_5174[0],$("input[name=sido_nm]").val());
    //Select_bld_info(p_5174[1],p_5174[0]);
}, showInfo);

/**
 * 마우스 이동완료시
 * URL : 
 * 참고사항 : 맵 이동완료시 줌상태 변경
 * 
 */
map.on('moveend', function (evt) {
    var zoomInfo = Math.round(map.getView().getZoom())/1;
    $('#info').html('<i class="fas fa-search-location"></i><span>줌상태 : '+ zoomInfo +'<span>');
    $('#mouseCoordinate_Center').html('<i class="fas fa-search-location"></i><span>중심좌표 : '+ map.getView().getCenter()[0] + ', '+ map.getView().getCenter()[1] +'<span>')
  });

/**
 * 마우스 feature hover 시 showInfo 함수 실행
 * URL : 
 * 참고사항 : showInfo 함수
 * let selected = null; 이건 선택스타일
 */
let selected = null;
var notification_flag =''
const highlightStyle = new ol.style.Style({
    fill: new ol.style.Fill({
      color: 'rgba(255,255,255,0.7)',
    }),
    stroke: new ol.style.Stroke({
      color: '#3399CC',
      width: 3,
    }),
});
  
map.on('pointermove',function(event){
    // if (selected !== null) {
    //     selected.setStyle(undefined);
    //     selected = null;
    // }
    if (map.getView().getInteracting() || map.getView().getAnimating()) {
        return;
    }
    const pixel = event.pixel;
    map.forEachFeatureAtPixel(pixel, function (feature) {
        console.log(feature);
        // selected = feature;
        // feature.setStyle(highlightStyle);
        if(feature.hasOwnProperty('j')){
            if(feature.j.hasOwnProperty('name')){
                if(feature.j.name != notification_flag){
                    notification_flag = feature.j.name;
                    notification.show([feature.j.name]);
                }
            }else if(feature.j.hasOwnProperty('dan_id')){
                if(feature.j.dan_id != notification_flag){
                    notification_flag = feature.j.dan_id;
                    notification.show([feature.j.dan_id + ' ' + feature.j.dan_name]);
                }
            }else{
                if(feature.j.hasOwnProperty('DAN_ID') && feature.j.DAN_ID != notification_flag){
                    notification_flag = feature.j.DAN_ID;
                    notification.show([feature.j.DAN_ID + ' ' + feature.j.DAN_NAME]);
                }
            }
            if(feature.j.hasOwnProperty('content')){
                if(feature.j.content != notification_flag){
                    notification_flag = feature.j.content;
                    if(feature.j.content.hasOwnProperty('category')){
                        
                    }else if(feature.j.content.hasOwnProperty('company_nm','c_number')){
                        notification.show(['['+feature.j.content.company_nm + ' ' + feature.j.content.c_number + ']']);    
                    }else if(feature.j.content.hasOwnProperty('fac_no')){
                        notification.show(['['+feature.j.content.comp_nm + '] 주소 : ' + feature.j.content.fac_addr]);    
                    }else{
                        notification.show(['['+feature.j.content.gungu + ' ' + feature.j.content.fclty + '] 주소 : ' + feature.j.content.addr]);    
                    }
                    
                    
                }
            }
            if(feature.j.hasOwnProperty('시설명')){
                notification_flag = feature.j.id;
                notification.show(['['+feature.j.시설명 + ' ' + '연락처' + feature.j.연락처 + ' ' + '주소 : '+ feature.j.주소 + ' ' + '주요정보 : ' + feature.j.주요정보 + ']']);    

            }
            showInfo(event);
        }else{
            showInfo(event);
        }

        return true;        
    });
    
});
//쇼인포
//showinfo 
//hasOwnProperty 함수 활용할것
//해당정보 탭에 보여줄때 사용
var features_flag_danji = "";
function showInfo(event, evt) {
    var features = map.getFeaturesAtPixel(event.pixel);//Features 값은들어있다.
    var innercontent = "";
    //pdf객체 옵션
    var option = {
        height: "100%",
        height: '673px',
        //pdfOpenParams: {view: 'FitV', page: '2'}
    }
    // var features = map.forEachFeatureAtPixel(event.pixel, function (features) {
    //     return features;
    // });
    console.log(features);
    if (features) {//geoserver 레이어 마우스Hover시 //산업단지레이어
        if (features[0].j.hasOwnProperty('dan_id')) {//postGIS에서는 소문자로 날라온다.
            features[0].j.DAN_ID = features[0].j.dan_id;
            features[0].j.DAN_NAME = features[0].j.dan_name;
            features[0].j.DANJI_TYPE = features[0].j.danji_type;
        }
        if (features[0].j.hasOwnProperty('DAN_ID') && features[0].j.DAN_ID != features_flag_danji) {//postGIS에서는 소문자로 날라온다.
            features_flag_danji = features[0].j.DAN_ID;
            $.ajax({
                url: '/location/danji_Limit',
                data: { danji_code: features[0].j.DAN_ID },
                //dataType:'json',
                type: 'post',
                cache: false,
                success: function (data) {
                    $('#danji_info').html(data);
                    $('#left_tab-2').html(data);


                },
                error: function (xhr, stat, err) { },
                complete: function () { },
            });
            try {
                PDFObject.embed("/resources/sandan/" + features[0].j.DAN_ID + "/" + features[0].j.DAN_ID + "_1.pdf", "#myPdf", option);
                //PDFObject.embed("/resources/sandan/"+features[0].j.DAN_ID+"/"+features[0].j.DAN_ID+"_2.pdf", "#myPdf2",option);
                //PDFObject.embed("/resources/sandan/"+features[0].j.DAN_ID+"/"+features[0].j.DAN_ID+"_3.pdf", "#myPdf3",option);
                //PDFObject.embed("/resources/sandan/"+features[0].j.DAN_ID+"/"+features[0].j.DAN_ID+"_1.pdf", "#left_myPdf",option);
            } catch (error) {
                console.log(error);
                PDFObject.embed("/resources/sandan/" + features[0].j.DAN_ID + "/" + features[0].j.DAN_ID + "_1.hwp", "#myPdf", option);
                //PDFObject.embed("/resources/sandan/"+features[0].j.DAN_ID+"/"+features[0].j.DAN_ID+"_1.hwp", "#left_myPdf",option);
            }

        }
        if (features[0].j.hasOwnProperty('content')) {//postGIS에서는 소문자로 날라온다.

            if (features[0].j.content.hasOwnProperty('fac_no')) { //공장검색
                if (features[0].j.content.fac_no && features[0].j.content.fac_no != features_flag_danji) {
                    features_flag_danji = features[0].j.content.fac_no;
                    $.ajax({
                        url: '/location/fac_info',
                        data: {
                            "fac_no": features[0].j.content.fac_no,
                        },
                        //dataType:'json',
                        type: 'post',
                        cache: false,
                        success: function (data) {
                            //console.log(data);
                            //$('#left_tab-1').html(data);
                            $('#factory_info').html(data);
                            $('.depth00_wrap').addClass('on');


                        },
                        error: function (xhr, stat, err) { },
                        complete: function () { },
                    });
                }
            } else if (features[0].j.content.hasOwnProperty('category')) { // 하수처리시설 쇼인포
                if (features[0].j.content.no && features[0].j.content.no != features_flag_danji) {
                    features_flag_danji = features[0].j.content.no;
                    $.ajax({
                        url: '/location/waste_fclty_info',
                        data: {
                            "no": features[0].j.content.no,
                        },
                        //dataType:'json',
                        type: 'post',
                        cache: false,
                        success: function (data) {
                            //console.log(data);
                            //$('.factory_info').html(data);
                            $('#waste_fclty_info').html(data);
                            $('.waste_fclty_info').html(data);
                            $('.depth00_wrap').addClass('on');

                        },
                        error: function (xhr, stat, err) { },
                        complete: function () { },
                    });
                }
            } else if (features[0].j.content.hasOwnProperty('company_nm', 'c_number')) {
                if (features[0].j.content.no && features[0].j.content.no != features_flag_danji) {
                    features_flag_danji = features[0].j.content.no;
                    $.ajax({
                        url: '/location/supply_companies_info',
                        data: {
                            "no": features[0].j.content.no,
                            "c_number": features[0].j.content.c_number,
                            "company_nm": features[0].j.content.company_nm,
                        },
                        //dataType:'json',
                        type: 'post',
                        cache: false,
                        success: function (data) {
                            //console.log(data);
                            $('#supply_companies_info').html(data);
                            $('.supply_companies_info').html(data);
                            $('.depth00_wrap').addClass('on');

                            //console.log("3");
                        },
                        error: function (xhr, stat, err) { },
                        complete: function () { },
                    });
                }
            } else {
                if (features[0].j.content.no && features[0].j.content.no != features_flag_danji) {// 폐기물처리 쇼인포
                    features_flag_danji = features[0].j.content.no;
                    $.ajax({
                        url: '/location/swgtr_fclty_info',
                        data: {
                            "no": features[0].j.content.no,
                            "si": features[0].j.content.si,
                            "gungu": features[0].j.content.gungu,
                            "fclty": features[0].j.content.fclty,
                        },
                        //dataType:'json',
                        type: 'post',
                        cache: false,
                        success: function (data) {
                            //$('.left_cnt7').html(data);
                            $('#swgtr_fclty_info').html(data);
                            $('.swgtr_fclty_info').html(data);
                            $('.depth00_wrap').addClass('on');

                            //console.log("3");
                        },
                        error: function (xhr, stat, err) { },
                        complete: function () { },
                    });
                }
            }

        } else if (features[0].j.hasOwnProperty('input_type')) {// 엑셀 업로드 쇼인포
            if (features[0].j.input_type == 'excel' && features_flag_danji != features[0].j.id) {
                console.log('엑셀업로드 Feature');
                console.log(features);
                features_flag_danji = features[0].j.id;
                var param = {
                    id: features[0].j.id,
                    input_type : features[0].j.input_type,
                    nm : features[0].j.시설명,
                    tel : features[0].j.연락처,
                    addr : features[0].j.주소,
                    im_info : features[0].j.주요정보,

                }
                $.ajax({
                    url:'/location/excel_Feature_info',
                    data: param,
                    //dataType:'json',
                    type:'post',
                    cache:false,					
                    success:function(data){

                          $('#excel_data_info').html(data);
                          //$('.excel_data_info').html(data);
                          $('.depth00_wrap').addClass('on');
                          //$('#excel_data_title').addClass('active');
                          
                      },
                  error: function(xhr, stat, err) {},
                  complete:function(){},
                });
            }

        } else {
            console.log('aa');
        }
    }
}

/**
 * sgis_layer
 * URL : https://sgisapi.kostat.go.kr/tiles/bmap4/L{z}/{y}/{x}.png
 * 참고사항 : wmts방식으로진행 실패
 * 
 */

var sgis_tileGrid = new ol.tilegrid.WMTS({ //영상지도 설정
    origin : [-200000, -28024123.62, 31824123.62, 4000000],
    resolutions: [2048, 1024, 512, 256, 128, 64, 32, 16, 8, 4, 2, 1, 0.5, 0.025],
    matrixIds : [ '1','2', '3', '4', '5', '6', '7',
    '8', '9', '10', '11', '12', '13', '14' ],
});
let sgis_layer = new ol.layer.Tile({//2d위성영상지도
	source: new ol.source.WMTS({
        //layer : ["AIRPHOTO", "AIRPHOTO_2011", "AIRPHOTO_2012", "AIRPHOTO_2013", "AIRPHOTO_2014", "AIRPHOTO_2015", "AIRPHOTO_2016", "AIRPHOTO_2017", "AIRPHOTO_2018", "AIRPHOTO_2019"],
        //layer: "AIRPHOTO",
        //url : `https://sgisapi.kostat.go.kr/tiles/bmap4/L{z}/{y}/{x}.png`,
        tileUrlFunction:function(coordinate){
            var z = fillZero(coordinate[0].toString(10),2);
            var x ='C'+fillZero(coordinate[1].toString(16),8);
            var y = 'R'+fillZero(coordinate[2].toString(16),8);
            return 'https://sgisapi.kostat.go.kr/tiles/bmap4/L' + z + '/' + y + '/' + x + '.png';
        },
		format:"image/png", //
		projection: 'EPSG:3857',
        tileGrid : sgis_tileGrid,
    }),
    //  maxResolution: 5,

	name:'sgis(통계청)',
	visible: false,
});
function fillZero(strB, strLen){
    return '00000000'.substr(0, strLen - (strB + '').length) + strB;
};


/**
 * 엑셀읽기
 * readExcel
 * 참고사항 : 여러가질 해야함.
 * 양식 : 
 * @param {String} col1 
 * @param {String} col2 
 * @param {String} col3 
 * @param {String} fac_addr 주소 필수
 * 
 * 
 */
 var geo_index = new Array();
 var geo_result = [];
 var cnt = 0;
 var cnt2 = 1000;

 
 function callSearch_Addr(addr,col1,col2,col3){
    let  value = addr;
    let  search_data = "service=search&version=2.0&request=search&key=CEB52025-E065-364C-9DBA-44880E3B02B8&format=json&size=1&page=1&type=address&category=parcel&crs=EPSG:3857";
    search_data += "&query="+value
    
    $.ajax({
            type: "get",
            url: "https://api.vworld.kr/req/search",
            data : search_data,
            dataType: 'jsonp',
            async: false,
            success: function(data) {
                //let  features = new Array();
                //let  features = '';
                try{
                    for(let  o in data.response.result.items){ 
                        //Feature 객체에 저장하여 활용 
                        // features[o] = new ol.Feature({
                        //     geometry: new ol.geom.Point([data.response.result.items[o].point.x*1,data.response.result.items[o].point.y*1]),
                        //     title: data.response.result.items[o].title,
                        //     parcel: data.response.result.items[o].address.parcel,
                        //     road: data.response.result.items[o].address.road,
                        //     category: data.response.result.items[o].category,
                        //     point: data.response.result.items[o].point,
                        //     시설명:col1,
                        //     주소:addr,
                        //     주요정보:col2,
                        //     연락처:col3,
                        // });
                        // features[o].set("id",data.response.result.items[o].id);
                        var features = new ol.Feature({
                            geometry: new ol.geom.Point([data.response.result.items[o].point.x*1,data.response.result.items[o].point.y*1]),
                            title: data.response.result.items[o].title,
                            parcel: data.response.result.items[o].address.parcel,
                            road: data.response.result.items[o].address.road,
                            category: data.response.result.items[o].category,
                            point: data.response.result.items[o].point,
                            시설명:col1,
                            주소:addr,
                            주요정보:col2,
                            연락처:col3,
                        });
                        features.set("id",data.response.result.items[o].id);
                        features.set("input_type",'excel');
                        geo_index.push(features);
                        // geo_result.push({
                        //     시설명:col1,
                        //     주소:addr,
                        //     주요정보:col2,
                        //     연락처:col3,
                            // col1:col1,
                            // col2:col2,
                            // col3:col3,
                            //fac_addr:addr,
                            //title:geo_index[cnt][0].j.title,
                            //parcel : geo_index[cnt][0].j.parcel,
                            //road:geo_index[cnt][0].j.road,
                            //category:geo_index[cnt][0].j.category,
                            //point:geo_index[cnt][0].j.point,
                            //x:geo_index[cnt][0].j.point.x,
                            //y:geo_index[cnt][0].j.point.y,
                            // loc_x:geo_index[cnt][0].j.point.x,
                            // loc_y:geo_index[cnt][0].j.point.y,
                            // etc1:'',
                            // etc2:'',
                            // etc3:'',
                            // etc4:'',
                            // etc5:'',
                        //});
                        //cnt++;
                        // if(cnt == cnt2){
                        //     console.log(cnt2 +'개 돌파');
                        //     cnt2 += 1000;
                        // }

                        // if(cnt == excelResult.length-1){
                        //     alert('변경완료');
                        //     console.log(geo_result);
                        //     downloadCSV(geo_result);
                        // }
                    }
                }catch (err){
                   
                }
            },
    });
}    
function callSearch_Addr_road(addr,col1,col2,col3){
    let  value = addr;
    let  search_data = "service=search&version=2.0&request=search&key=CEB52025-E065-364C-9DBA-44880E3B02B8&format=json&size=1&page=1&type=address&category=road&crs=EPSG:3857";
    search_data += "&query="+value
    
    $.ajax({
            type: "get",
            url: "https://api.vworld.kr/req/search",
            data : search_data,
            dataType: 'jsonp',
            async: false,
            success: function(data) {
                //let  features = new Array();
                try{
                    for(let  o in data.response.result.items){ 
                        //Feature 객체에 저장하여 활용 
                        var features = new ol.Feature({
                            geometry: new ol.geom.Point([data.response.result.items[o].point.x*1,data.response.result.items[o].point.y*1]),
                            title: data.response.result.items[o].title,
                            parcel: data.response.result.items[o].address.parcel,
                            road: data.response.result.items[o].address.road,
                            category: data.response.result.items[o].category,
                            point: data.response.result.items[o].point,
                            시설명:col1,
                            주소:addr,
                            주요정보:col2,
                            연락처:col3,
                        });
                        features.set("id",data.response.result.items[o].id);
                        features.set("input_type",'excel');
                        geo_index.push(features);
                        //cnt++;
                        // if(cnt == cnt2){
                        //     console.log(cnt2 +'개 돌파');
                        //     cnt2 += 1000;
                        // }

                        // if(cnt == excelResult.length-1){
                        //     alert('변경완료');
                        //     console.log(geo_result);
                        //     downloadCSV(geo_result);
                        // }
                    }
                }catch (err){
                   
                }
            },
    });
}    

var excelResult = '';
var Input_excelResult = [];

function readExcel(category) {
    console.log(category);
    let input = event.target;
    let reader = new FileReader();
    reader.onload = function () {
        let data = reader.result;
        let workBook = XLSX.read(data, { type: 'binary' });
        workBook.SheetNames.forEach(function (sheetName) {
            console.log('SheetName: ' + sheetName);
            let rows = XLSX.utils.sheet_to_json(workBook.Sheets[sheetName]);
            excelResult = rows;
            console.log(JSON.stringify(rows[0]));
            console.log(excelResult.length);

            if(category == 'road'){
                for(var i = 0; i < excelResult.length; i++){
                    if(!excelResult[i].col2){
                        excelResult[i].col2 = '';
                    }
                    callSearch_Addr_road(excelResult[i].fac_addr,excelResult[i].col1, excelResult[i].col2, excelResult[i].col3);
    
                };
            }else if(category == 'parcel'){
                for(var i = 0; i < excelResult.length; i++){
                    if(!excelResult[i].col2){
                        excelResult[i].col2 = '';
                    }
                    callSearch_Addr(excelResult[i].fac_addr,excelResult[i].col1, excelResult[i].col2, excelResult[i].col3);
    
                };
            }else{
                console.log('빠짐');
            }
            

             
        })
    };
    
    reader.readAsBinaryString(input.files[0]);
    
}    
// 이것과 
// for (let row of this.rows) {
//     if (!row.selected) {
//         this.selectAllChecked = false;
//         break;
//     }
// }
// 이건 수행이 같다.
// this.selectAllChecked = this.rows.every(row => row.selected);


function downloadCSV(arrayToCSV){


    // col1:col1,
    // col2:col2,
    // col3:col3,
    // fac_addr:addr,
    // title:geo_index[cnt][0].j.title,
    // parcel : geo_index[cnt][0].j.parcel,
    // road:geo_index[cnt][0].j.road,
    // category:geo_index[cnt][0].j.category,
    // point:geo_index[cnt][0].j.point,
    // x:geo_index[cnt][0].j.point.x,
    // y:geo_index[cnt][0].j.point.y,
    var a = "";
    $.each(arrayToCSV, function(i, item){
        a += item.col1 + "," + 
        item.col2 + "," + 
        item.col3 + "," + 
        item.fac_addr + "," + 
        item.title + "," + 
        item.parcel + "," + 
        item.road + "," + 
        item.category + "," + 
        item.point + "," + 
        item.x + "," + 
        item.y + "," + 
        "\r\n";
    });

    // jquery 사용하지 않는 경우
    /* for(var i=0; i<array.length; i++){
        a += array[i].name + "," + array[i].age + "," + array[i].test + "\r\n";
    } */

    var downloadLink = document.createElement("a");
    var blob = new Blob([a], { type: "text/csv;charset=utf-8" });
    var url = URL.createObjectURL(blob);
    downloadLink.href = url;
    downloadLink.download = "Convert_data.csv";

    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
    
}


/**
 * 유튜브재생
 * youtube
 * 참고사항 : https://img.youtube.com/vi/xRbPAVnqtcs/0.jpg
 * 양식 : 
 * @param {String}  
 * @param {String}  
 * @param {String}  
 * @param {String} 
 *  
 */

 let video_list = [
    'azGg68B-Glk',
    '6Sq-TC2p9jk',
    '6qYtmyS8yuw',
    'qrs9dRkEDPQ',
    'MJZ4DZ1pAPc',
    '7rxyranHX-U',
    'YAV2LdzFq7g',
    '3kKb8Lla-64',
    'RhqLg_2BHuE',
    '_XK9CtHb07M',
    'VLXxyMuSb5U',
    '0vuShSep5Vk',
    'YzaR2sR2DWA',
    'M_xIyr1qlvg',
    'C8ryyF_beCI',
    'g4TDjVAPgPI',
    'hoCrXh2Dhj0',
    '_nUayEvt-hE',
    'uyU-D1tiR_U',
    'Q8SdPwKD8d0',
    'tXWAoJtDlp4',
    'Y9YPb8f7PuY',
    'IfM6J_fdwrQ',
    '9vt3BSvqsp4',
    'qANXufAR8yI',
    'gjQfuPIukqQ',
    '8T5zvly9LjI',
    'woH-m3TRakA',
    'TenYpy6A26w',
    'oc_ykfQkLRc',
    'kYw-bFI57gE',
];
function randomValueFromArray(array) {
    const random = Math.floor(Math.random() * array.length);
    return array[random];
}

function youtube_run(){
    

    //document.getElementById('youtube').innerHTML = '<div class="slick-slide slick-current slick-active" data-slick-index="0" aria-hidden="false" style="width: 350px; position: relative; left: 0px; top: 0px; z-index: 999; opacity: 1;" tabindex="0"><iframe width="100%" height="200px" src="https://www.youtube.com/embed/C8ryyF_beCI?autoplay=1&mute=1&loop=1" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></div> <div><img src="/resources/new/img/vedio_list.png">2</div> <div><img src="/resources/new/img/vedio_list.png">3</div> <div><img src="/resources/new/img/vedio_list.png">4</div> <div><img src="/resources/new/img/vedio_list.png">5</div> <div><img src="/resources/new/img/vedio_list.png">6</div> <div><img src="/resources/new/img/vedio_list.png">7</div>';
    //  $('.youtube').html(`<iframe width="100%" height="400px" src="https://www.youtube.com/embed/${randomValueFromArray(video_list)}?autoplay=1&mute=1&loop=1" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
    // <div><img src="/resources/new/img/vedio_list.png">2</div>
	// 						<div><img src="/resources/new/img/vedio_list.png">3</div>
	// 						<div><img src="/resources/new/img/vedio_list.png">4</div>
	// 						<div><img src="/resources/new/img/vedio_list.png">5</div>
	// 						<div><img src="/resources/new/img/vedio_list.png">6</div>
	// 						<div><img src="/resources/new/img/vedio_list.png">7</div>`);

    $('.industry_video').html(`<iframe width="100%" height="400px" src="https://www.youtube.com/embed/${randomValueFromArray(video_list)}?autoplay=1&mute=1&loop=1" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`);
    $('.de00_btn' ).removeClass('on');
    $('.de01_btn' ).removeClass('on');
    $('.depth00_wrap').removeClass('on');
    $('.depth01_wrap').removeClass('on');
    $('.depth02_wrap').removeClass('on');
    $('.de00_btn').addClass('on');
    $('.depth00_wrap').addClass('on');
    $('.act01').trigger("click");
    $('.search_btn' ).removeClass('on');
    $('.search_wrap').removeClass('on');

}

function youtube_run_2(){
    

    //document.getElementById('youtube').innerHTML = '<div class="slick-slide slick-current slick-active" data-slick-index="0" aria-hidden="false" style="width: 350px; position: relative; left: 0px; top: 0px; z-index: 999; opacity: 1;" tabindex="0"><iframe width="100%" height="200px" src="https://www.youtube.com/embed/C8ryyF_beCI?autoplay=1&mute=1&loop=1" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></div> <div><img src="/resources/new/img/vedio_list.png">2</div> <div><img src="/resources/new/img/vedio_list.png">3</div> <div><img src="/resources/new/img/vedio_list.png">4</div> <div><img src="/resources/new/img/vedio_list.png">5</div> <div><img src="/resources/new/img/vedio_list.png">6</div> <div><img src="/resources/new/img/vedio_list.png">7</div>';
    //  $('.youtube').html(`<iframe width="100%" height="400px" src="https://www.youtube.com/embed/${randomValueFromArray(video_list)}?autoplay=1&mute=1&loop=1" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
    // <div><img src="/resources/new/img/vedio_list.png">2</div>
	// 						<div><img src="/resources/new/img/vedio_list.png">3</div>
	// 						<div><img src="/resources/new/img/vedio_list.png">4</div>
	// 						<div><img src="/resources/new/img/vedio_list.png">5</div>
	// 						<div><img src="/resources/new/img/vedio_list.png">6</div>
	// 						<div><img src="/resources/new/img/vedio_list.png">7</div>`);

    $('.industry_video2').html(`<iframe width="100%" height="400px" src="https://www.youtube.com/embed/${randomValueFromArray(video_list)}?autoplay=1&mute=1&loop=1" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`);
    $('.de00_btn' ).removeClass('on');
    $('.de01_btn' ).removeClass('on');
    $('.depth00_wrap').removeClass('on');
    $('.depth01_wrap').removeClass('on');
    $('.depth02_wrap').removeClass('on');
    $('depth00_wrap .cate_0_1').removeClass('on');
    $('depth00_wrap .cate_0_2').removeClass('on');
    $('depth00_wrap .cate_0_3').removeClass('on');
    $('depth00_wrap .cate_0_4').removeClass('on');
    
    $('.de00_btn').addClass('on');
    $('.depth00_wrap').addClass('on');
    $('depth00_wrap .cate_0_2').addClass('on');
    $('.act02').trigger("click");
    $('.search_btn' ).removeClass('on');
    $('.search_wrap').removeClass('on');

}

function reg_fac_list(category){
    var iconFeature_sum = [];

    if(category == 1){
        const stroke = new ol.style.Stroke({
            //color: 'rgba(255,255,0,0.9)',
            color: '#0D0B40',
            width: 3,
          });
        const fill = new ol.style.Fill({
            color : '#666666',
            wideth : 3,
        })
        const style = new ol.style.Style({
            stroke: stroke,
            fill:fill,
            image: new ol.style.Circle({
                radius: 7,
                stroke: stroke,
                fill:fill,
                
            }),
        });
        var param = {
            ind_code : '1',
        };
        $.ajax({
            url:'/location/reg_fac_list_sandan',
            data: param,
            //dataType:'json',
            type:'get',
            cache:false,					
            success:function(data){	
              var data_size = data.length;
              console.log(data);
              for(const element of data){
                  var iconFeature = new ol.Feature({
                      geometry:new ol.geom.Point([Number(element.loc_x),Number(element.loc_y)]),
                      name:element.comp_nm + ' ' + element.int_nm+" "+element.ind_code,
                      content:element,
                      population:4000,
                      rainfall:500,
                  });
                  iconFeature.setStyle(style);
                  //iconFeature.setStyle(ksic_img_style_2(ksic_code.substring(0,2)));
                  //iconFeature.setStyle(markerStyle);
                  iconFeature_sum.push(iconFeature);
              }
                  //clusterSource.getSource().clear();
                  //clusterSource.getSource().addFeatures(iconFeature_sum);
                  var vectorSource = new ol.source.Vector({
                  features: iconFeature_sum,
                  });
                  var vectorLayer = new ol.layer.Vector({
                  source: vectorSource,
                  opacity:1,
                  visible: true,
                  //minResolution: 0,	
                  //maxResolution: 50,
                  });
    
                  $('#dropList').removeClass('show');
                  vectorLayer.set("name", '산업단지내공장');
                  map.addLayer(vectorLayer);
          },
          error: function(request,status,error){
          console.log("code:"+request.status+"\n"+"message:"+request.responseText+"\n"+"error:"+error.toString());
          }
      });
    }else{
        const stroke = new ol.style.Stroke({
            color: '#0D0B40',
            width: 3,
          });
        const fill = new ol.style.Fill({
            color : '#666666',
            wideth : 3,
        })
        const style = new ol.style.Style({
            stroke: stroke,
            fill:fill,
            image: new ol.style.Circle({
                radius: 7,
                stroke: stroke,
                fill:fill,
                
            }),
        });
        var param = {
            ind_code : '2',
        };
        $.ajax({
            url:'/location/reg_fac_list_sandan',
            data: param,
            //dataType:'json',
            type:'get',
            cache:false,					
            success:function(data){	
              var data_size = data.length;
              console.log(data);
              for(const element of data){
                  var iconFeature = new ol.Feature({
                      geometry:new ol.geom.Point([Number(element.loc_x),Number(element.loc_y)]),
                      name:element.comp_nm + ' ' + element.int_nm+" "+element.ind_code,
                      content:element,
                      population:4000,
                      rainfall:500,
                  });
                  iconFeature.setStyle(style);
                  //iconFeature.setStyle(ksic_img_style_2(ksic_code.substring(0,2)));
                  //iconFeature.setStyle(markerStyle);
                  iconFeature_sum.push(iconFeature);
              }
                  //clusterSource.getSource().clear();
                  //clusterSource.getSource().addFeatures(iconFeature_sum);
                  var vectorSource = new ol.source.Vector({
                  features: iconFeature_sum,
                  });
                  var vectorLayer = new ol.layer.Vector({
                  source: vectorSource,
                  opacity:1,
                  visible: true,
                  //minResolution: 0,	
                  //maxResolution: 50,
                  });
                  $('#dropList').removeClass('show');
                  vectorLayer.set("name", '산업단지외공장');
                  map.addLayer(vectorLayer);
          },
          error: function(request,status,error){
          console.log("code:"+request.status+"\n"+"message:"+request.responseText+"\n"+"error:"+error.toString());
          }
      });
    }
    
};




function vworld_wfs(evt){
    map.getLayers().forEach(function(layer){
        // if(layer.get("name")=="시군구"){}
        let selectlayer = layer.get("id")
        // if(selectlayer.indexOf(",") >-1){
        //     selectlayer = selectlayer.split(",")[0]; 
        // }
        //data API는 레이어 1개씩 조회가 가능해서 2개이상이 입력될경우 변경되도록 설정(지적도)
        let min = map.getCoordinateFromPixel([evt.pixel[0] -4,evt.pixel[1]+4])
        let max = map.getCoordinateFromPixel([evt.pixel[0] +4,evt.pixel[1]-4])
        let box = min[0]+","+min[1]+","+max[0]+","+max[1]
        console.log('여기탓음');
        let code = map.getView().getProjection().getCode();
        
        /*WFS jsonp 테스트*/
        
        $('#wfsForm > [name=BBOX]').val(box);		
        $('#wfsForm > [name=SRSNAME]').val(code);
        $.ajax({
            type: "get",
            url: "https://api.vworld.kr/req/wfs",
            data : $('#wfsForm').serialize(),
            dataType: 'jsonp',
            async: false,
            jsonpCallback:"parseResponse",
            success: function(data) {
                turl = 'https://api.vworld.kr/req/wfs?'+$('#wfsForm').serialize();
                //$('#wfs_url').html(`<a href="${turl}">${turl}</a>`)
                
                let vectorSource = new ol.source.Vector({features: (new ol.format.GeoJSON()).readFeatures(data)})
                
                map.getLayers().forEach(function(ollayer){
                    if(ollayer.get("name")=="wfs_result"){
                        map.removeLayer(ollayer);//기존결과 삭제
                    }
                })
            
                let vector_layer = new ol.layer.Vector({
                    source: vectorSource,
                    //style: vectorStyle
                })
                
                vector_layer.set("name","wfs_result");
                map.addLayer(vector_layer);
                
                let resultFeature = vectorSource.getFeatures()[0]
                if(typeof resultFeature == "object"){
                    let wfs_html="";
                    for(let i in resultFeature.getKeys()){ 
                    if(resultFeature.getKeys()[i] == "bbox"){
                        continue;
                    }
                        wfs_html += resultFeature.getKeys()[i] + " = "+resultFeature.get(resultFeature.getKeys()[i])+"\n<br>";
                    }
                        wfs_html += "--------------------------------------<br>";
                                $('#wfs_result').html(wfs_html);
                        resultArray.push(wfs_html);
                    if(cnt >= 0){
                        $('#resultP').html(wfs_html);
                        cnt = 0;
                    }else{
                        $('#resultP').append(wfs_html);
                        cnt++;
                    }
                }
            },
            error: function(xhr, stat, err) {}
        });
    });
}



function addList()  {
  
    // 1. 추가할 값을 input창에서 읽어온다
    const addValue 
      = document.getElementById('addValue').value;
    
    // 2. 추가할 li element 생성
    // 2-1. 추가할 li element 생성
    const li = document.createElement("li");
    
    // 2-2. li에 id 속성 추가 
    li.setAttribute('id',addValue);
    
    li.innerHTML = '<b>테스트</b>';
    // 2-3. li에 text node 추가 
    const textNode = document.createTextNode(addValue);
    li.appendChild(textNode);
    
    // 3. 생성된 li를 ul에 추가
    document
      .getElementById('fruits')
      .appendChild(li);
  }




 /**
 * 포인트마크 마커등록함수
 * URL : 
 * 참고사항 : 마커스타일
 * 포인트마커
 * 
 */

function addMarker_(data){
    var iconFeature_sum;

    for(const element of data){
        var iconFeature = new ol.Feature({
            geometry:new ol.geom.Point([Number(element.loc_x),Number(element.loc_y)]),
            name:element.addr,
            content:element,
            population:4000,
            rainfall:500,
        });
        //iconFeature.setStyle(styles);
        //iconFeature.setStyle(ksic_img_style_2(ksic_code.substring(0,2)));
        //iconFeature.setStyle(markerStyle);
        iconFeature_sum.push(iconFeature);
    }

    var vectorSource = new ol.source.Vector({
        features: iconFeature_sum,
        name : '엑셀파일'
        });
    var vectorLayer = new ol.layer.Vector({
        source: vectorSource,
        opacity:1,
        visible: true,
        //minResolution: 0,	
        //maxResolution: 50,
        });
    vectorLayer.set("name", '엑셀업로드');
    map.addLayer(vectorLayer);

}

 /**
 * 엑셀파일첨부 기능
 * URL : 
 * 참고사항 : 마커스타일
 * 포인트마커
 * 
 */

function excelUpload_function(){
    $('#file_3').trigger("click", function () {
        console.log('파일첨부됨');
        try {
            if($("input:radio[name='addr']:checked").length > 0){
                console.log(';asdfasdf');
            }else{
                alert('검색하여 출력하실 타입을 선택해주세요( ex : 도로명 혹은 지번주소 )');
            }
        } catch (error) {
            
        }
    });

}

var fileTarget = $('#file_3');

fileTarget.on('change', function () { // 값이 변경되면
    if (window.FileReader) { // modern browser
        try {
            var filename = $(this)[0].files[0].name;    
        } catch (error) {
            var filename = '파일을 첨부해주세요.';
        }
    } else { // old IE
        var filename = $(this).val().split('/').pop().split('\\').pop(); // 파일명만 추출
    }  // 추출한 파일명 삽입
    console.log(filename);
    $('#excel_address').val(filename);

});
var xhr_cnt = 0;
var read_excelLength = 0;
let excel_col_array = [];
var workbook_excel = '';
const timer = ms => new Promise(res=>setTimeout(res,ms));
function input_ReadExcel() {
    console.log('리드엑셀마커 ');
    if($("input:radio[name='addr']:checked").length > 0){
        var category = $("input:radio[name='addr']:checked").val();
        let input = event.target.files[0];
        let reader = new FileReader();
        reader.onload = function () {
            let data = reader.result;
            let workBook = XLSX.read(data, { type: 'binary' });
            console.log(workBook);
            workbook_excel = workBook;
            
            //console.log(data + '///////' + workBook);
            workBook.SheetNames.forEach(function (sheetName) {
                console.log('SheetName: ' + sheetName);
                let rows = XLSX.utils.sheet_to_json(workBook.Sheets[sheetName]);
                let excel_hearder = XLSX.utils.sheet_to_json(workBook.Sheets[sheetName,{header:1,raw:true}]);
                console.log(excel_hearder);
                Input_excelResult = rows;
                console.log(JSON.stringify(rows[0]));
                excel_col_array = Object.keys(Input_excelResult[0]);
                read_excelLength = Input_excelResult.length;
                
            })
            $('#read_count').text('총 갯수 : '+read_excelLength);
            $("#progressbar").progressbar({
                value: 1,
            });
            $('#progressbar').attr('aria-valuemax',read_excelLength);
            $('#count1').removeClass('hidden');
            $('#count2').removeClass('hidden');
            
            
        };
        reader.readAsBinaryString(input);

    }else{
        alert('해당파일주소 형태를 선택해주세요. (ex ; 도로명 & 지번주소)');
    } 
} 
var geo_return_cnt = 0;
async function readExcel_Marker(category){
    xhr_cnt = 0;
    geo_return_cnt = 0;
    if (category == 'road') {
        for (var i = 0; i < Input_excelResult.length; i++) {
            callSearch_Addr_road(Input_excelResult[i].주소, Input_excelResult[i].시설명, Input_excelResult[i].주요정보, Input_excelResult[i].연락처);
            //callSearch_Addr_road_obj(Input_excelResult[i].주소,excel_col_array,Input_excelResult[i]);
        };
        //alert('변환이 완료되었습니다.' + '미변환된 주소는 총 '+ (read_excelLength - geo_index.length) + '개 입니다.');
        for (var i = 0; i < read_excelLength; i++){
            await timer(50);
            //console.log('프로그래스바');
            xhr_cnt++;
            $('#progressbar').progressbar( "value" , xhr_cnt);
            if(geo_return_cnt != geo_index.length){geo_return_cnt = geo_index.length;}
            $('#exc_count').text('변환된 갯수 : '+geo_return_cnt);
            if((xhr_cnt % 100) == 0){$('#add_marker_btn').trigger('click');}
        }
        if(geo_return_cnt == geo_index.length){
            await timer(8000);
            $('#add_marker_btn').trigger('click');
        }

    }else if(category == 'parcel'){
        for (var i = 0; i < Input_excelResult.length; i++) {
            callSearch_Addr(Input_excelResult[i].주소 ,Input_excelResult[i].시설명, Input_excelResult[i].주요정보, Input_excelResult[i].연락처);

        };
        //alert('변환이 완료되었습니다.' + '미변환된 주소는 총 '+ (read_excelLength - geo_index.length) + '개 입니다.');
        for (var i = 0; i < read_excelLength; i++){
            await timer(50);
            //console.log('프로그래스바');
            xhr_cnt++;
            $('#progressbar').progressbar( "value" , xhr_cnt);
            if(geo_return_cnt != geo_index.length){geo_return_cnt = geo_index.length;}
            $('#exc_count').text('변환된 갯수 : '+geo_return_cnt);
            if((xhr_cnt % 100) == 0){$('#add_marker_btn').trigger('click');}
        }
        if(geo_return_cnt == geo_index.length){
            await timer(8000);
            $('#add_marker_btn').trigger('click');
        }
    }else{
        console.log('빠짐');
    }

}

function add_Feature_Marker(category){
    if (category == 'road') {
        let vectorSource = new ol.source.Vector({
            features: geo_index
        });
        let vectorLayer = new ol.layer.Vector({
            source: vectorSource,
            // style: new ol.style.Style({
            //     fill: new ol.style.Fill({
            //         color: 'rgba(245,223,77,1.0)',
            //     }),
            //     stroke: new ol.style.Stroke({
            //         color: '#3399CC',
            //         width: 3,
            //     })
            // })
        });
        vectorLayer.set("name", "엑셀도로명검색");
        layerRemover("엑셀도로명검색");
        map.addLayer(vectorLayer);
        //geo_index = new Array();
    }else if(category == 'parcel'){
        let vectorSource = new ol.source.Vector({
            features: geo_index
        });
        let vectorLayer = new ol.layer.Vector({
            source: vectorSource,
            // style: new ol.style.Style({
            //     fill: new ol.style.Fill({
            //         color: 'rgba(245,223,77,1.0)',
            //     }),
            //     stroke: new ol.style.Stroke({
            //         color: '#3399CC',
            //         width: 3,
            //     })
            // })
        });
        vectorLayer.set("name", "엑셀지번검색")
        layerRemover("엑셀지번검색");
        map.addLayer(vectorLayer);
        //geo_index = new Array();
    }else{
        console.log('빠짐');
    }
}

function callSearch_Addr_obj(addr,array_col,obj){
    let  value = addr;
    let  search_data = "service=search&version=2.0&request=search&key=CEB52025-E065-364C-9DBA-44880E3B02B8&format=json&size=1&page=1&type=address&category=parcel&crs=EPSG:3857";
    search_data += "&query="+value
    
    $.ajax({
            type: "get",
            url: "https://api.vworld.kr/req/search",
            data : search_data,
            dataType: 'jsonp',
            async: false,
            success: function(data) {
                try{
                    for(let  o in data.response.result.items){ 

                        var features = new ol.Feature({
                            geometry: new ol.geom.Point([data.response.result.items[o].point.x*1,data.response.result.items[o].point.y*1]),
                            title: data.response.result.items[o].title,
                            parcel: data.response.result.items[o].address.parcel,
                            road: data.response.result.items[o].address.road,
                            category: data.response.result.items[o].category,
                            point: data.response.result.items[o].point,
                            시설명:col1,
                            주소:addr,
                            주요정보:col2,
                            연락처:col3,
                        });
                        features.set("id",data.response.result.items[o].id);
                        geo_index.push(features);
                        
                    }

                }catch (err){
                   
                }
            },
    });
}    
function callSearch_Addr_road_obj(addr,excel_col_array,obj){
    let  value = addr;
    let  search_data = "service=search&version=2.0&request=search&key=CEB52025-E065-364C-9DBA-44880E3B02B8&format=json&size=1&page=1&type=address&category=road&crs=EPSG:3857";
    search_data += "&query="+value
    
    $.ajax({
            type: "get",
            url: "https://api.vworld.kr/req/search",
            data : search_data,
            dataType: 'jsonp',
            async: false,
            success: function(data) {
                //let  features = new Array();
                try{
                    for(let  o in data.response.result.items){ 
                        //Feature 객체에 저장하여 활용 
                        var features = new ol.Feature({
                            geometry: new ol.geom.Point([data.response.result.items[o].point.x*1,data.response.result.items[o].point.y*1]),
                            title: data.response.result.items[o].title,
                            parcel: data.response.result.items[o].address.parcel,
                            road: data.response.result.items[o].address.road,
                            category: data.response.result.items[o].category,
                            point: data.response.result.items[o].point,
                        });
                        features.set("id",data.response.result.items[o].id);
                        geo_index.push(features);
                
                    }
                    // for (var i = 0; excel_col_array.length > i; i++) {
                    //     features.set(excel_col_array[i], obj.getProperties(excel_col_array[i]).val());
                    // }

                    
                }catch (err){
                   //console.log(err);
                }
            },
    });
}    
