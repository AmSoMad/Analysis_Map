    proj4.defs('EPSG:5179','+proj=tmerc +lat_0=38 +lon_0=127.5 +k=0.9996 +x_0=1000000 +y_0=2000000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs');
    proj4.defs('EPSG:4326', '+proj=longlat +datum=WGS84 +no_defs');
    //ol.proj.proj4.register(proj4);

    var naver_map_version = '1630584268'
    let newProj = ol.proj.get('EPSG:3857'); // 사용 좌표계
    //let newProj = ol.proj.get('EPSG:4326'); // 사용 좌표계
    let newProjExtent = newProj.getExtent(); // 지도의 범위
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
    // A group layer for base layers
    let OSM_layers = new ol.layer.Group({
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

    let carto_layers = new ol.layer.Group({
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

    let vwolrd_layers = new ol.layer.Group({
      title: 'Vworld',
      openInLayerSwitcher: false,
      layers:[
        new ol.layer.Tile({
          source: new ol.source.XYZ({
            url: 'http://xdworld.vworld.kr:8080/2d/gray/202002/{z}/{x}/{y}.png',
            format: new ol.format.GeoJSON
          }),
          name: '2D회색지도',
          //minResolution: 0,
          //maxResolution: 1400,
          visible: false,
        }),
        new ol.layer.Tile({
          source: new ol.source.XYZ({
            url: 'https://xdworld.vworld.kr/2d/midnight/service/{z}/{x}/{y}.png',
            format: new ol.format.GeoJSON
          }),
          name: '2D야간지도',
          //minResolution: 0,
          //maxResolution: 1400,
          visible: false,
        }),
        new ol.layer.Tile({
          source: new ol.source.XYZ({
            url: 'https://xdworld.vworld.kr/2d/Base/service/{z}/{x}/{y}.png',
            format: new ol.format.GeoJSON
          }),
          name: '2D배경지도',
          //   minResolution: 0,	
          //   maxResolution: 1400,
          visible: true,
        }),
        new ol.layer.Tile({//2d위성영상지도
          source: new ol.source.WMTS({
            //layer : ["AIRPHOTO", "AIRPHOTO_2011", "AIRPHOTO_2012", "AIRPHOTO_2013", "AIRPHOTO_2014", "AIRPHOTO_2015", "AIRPHOTO_2016", "AIRPHOTO_2017", "AIRPHOTO_2018", "AIRPHOTO_2019"],
            layer: "AIRPHOTO",
            url: `http://210.117.198.120:8081/o2map/services`,
            service: 'WMTS',
            matrixSet: 'NGIS_AIR',
            style: "_null",
            format: "image/jpg", //
            projection: 'EPSG:5179',
            tileGrid: new ol.tilegrid.WMTS({ //영상지도 설정
              origin: [-200000.0, 4000000.0],
              resolutions: [2088.96, 1044.48, 522.24, 261.12, 130.56, 65.28, 32.64, 16.32, 8.16, 4.08, 2.04, 1.02, 0.51, 0.255],//properties.wmtEmapOption.serverResolutions,
              matrixIds: ['5', '6', '7', '8', '9', '10', '11',
                '12', '13', '14', '15', '16', '17', '18']
            }),
          }),
          //  maxResolution: 5,
          name: '위성사진',
          visible: false,
        }),
        new ol.layer.Tile({//2d위성영상지도
          source: new ol.source.XYZ({
            url: 'https://xdworld.vworld.kr/2d/Satellite/202002/{z}/{x}/{y}.jpeg',
            format: new ol.format.GeoJSON
          }),
          name: '위성사진(2018)',
          visible: false,
        }),
        new ol.layer.Tile({//2d위성영상지도
          source: new ol.source.XYZ({
            url: 'https://xdworld.vworld.kr/2d/Hybrid/service/{z}/{x}/{y}.png',
            format: new ol.format.GeoJSON
          }),
          // maxResolution: 5,
          name: '하이브리드',
          visible: false,
        }),









      ],
      visible:true
    });

    let ncp_Naver_Satellite_Group = new ol.layer.Group({
        title: '네이버(편집도)',
        openInLayerSwitcher: false,
        layers: [
          new ol.layer.Tile({//테스트레이어
            source: new ol.source.XYZ({
              url: 'https://map.pstatic.net/nrb/styles/basic/' + naver_map_version + '/{z}/{x}/{y}.png?mt=bg.ol.ts.lko',
              format: new ol.format.GeoJSON,
              attributions: ['<a href="http://map.naver.com"><img src="http://static.naver.net/maps2/logo_naver_s.png"></a>'],
            }),
            name: '네이버 배경지도',
            visible: true,
            baseLayer: true,
          }),
          new ol.layer.Tile({//테스트레이어
            source: new ol.source.XYZ({
              url: 'https://map.pstatic.net/nrb/styles/terrain/' + naver_map_version + '/{z}/{x}/{y}.png?mt=bg.ol.ts.lko&crs=EPSG:3857',
              format: new ol.format.GeoJSON,
              attributions: ['<a href="http://map.naver.com"><img src="http://static.naver.net/maps2/logo_naver_s.png"></a>'],
            }),
            name: '네이버 지형지도',
            visible: false,
            baseLayer: true,
          }),
          new ol.layer.Tile({//테스트레이어
            source: new ol.source.XYZ({
              url: 'https://map.pstatic.net/nrb/styles/satellite/' + naver_map_version + '/{z}/{x}/{y}.png?mt=bg.ol.ts.lko&crs=EPSG:3857',
              format: new ol.format.GeoJSON,
              attributions: ['<a href="http://map.naver.com"><img src="http://static.naver.net/maps2/logo_naver_s.png"></a>'],
            }),
            name: '네이버 위성지도',
            visible: false,
            baseLayer: true,
          }),
          new ol.layer.Tile({//테스트레이어
            source: new ol.source.XYZ({
              url: 'https://map.pstatic.net/nrb/styles/basic/' + naver_map_version + '/{z}/{x}/{y}.png?mt=bg.ol.ts.lp&crs=EPSG:3857',
              format: new ol.format.GeoJSON,
              attributions: ['<a href="http://map.naver.com"><img src="http://static.naver.net/maps2/logo_naver_s.png"></a>'],
            }),
            name: '네이버 용도구역(base)',
            visible: false,
            baseLayer: true,
          }),
          new ol.layer.Tile({//테스트레이어
            source: new ol.source.XYZ({
              url: 'https://map.pstatic.net/nrb/styles/satellite/' + naver_map_version + '/{z}/{x}/{y}.png?mt=bg.ol.ts.lp&crs=EPSG:3857',
              format: new ol.format.GeoJSON,
              attributions: ['<a href="http://map.naver.com"><img src="http://static.naver.net/maps2/logo_naver_s.png"></a>'],
            }),
            name: '네이버 용도구역(위성)',
            visible: false,
            baseLayer: true,
          }),
          new ol.layer.Tile({//테스트레이어
            source: new ol.source.XYZ({
              url: 'https://map.pstatic.net/nrb/styles/basic/' + naver_map_version + '/{z}/{x}/{y}.png?mt=ctt&crs=EPSG:3857',
              format: new ol.format.GeoJSON,
              attributions: ['<a href="http://map.naver.com"><img src="http://static.naver.net/maps2/logo_naver_s.png"></a>'],
            }),
            name: '네이버 도로교통',
            visible: true,
            baseLayer: false,
            opacity: 0.3,
          }),
        ],
        visible: false,
        attributions: [
          new ol.control.Attribution({
            html: ['<a href="http://map.naver.com"><img src="http://static.naver.net/maps2/logo_naver_s.png"></a>']
          })
        ]
      });

    let base_layers = new ol.layer.Group({
    title: '배경지도',
    openInLayerSwitcher: true,
    layers: [
        carto_layers,
        vwolrd_layers,
        // Satellite,
        // Satellite2,
        // weatherLayers,
        // road_stat_Layer,
        // midnightLayer,
        ncp_Naver_Satellite_Group,
    ]
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

    var mouseControlCoordinate = new ol.control.MousePosition({
       coordinateFormat: new ol.coordinate.createStringXY(4),
       projection: 'EPSG:3857',
      //좌표계 설정 
      className: 'mousePointer_Coordinate', //css 클래스 이름 
      //target: mouseCoordinate_Hover,//좌표를 뿌릴 element 
      undefinedHTML: '&nbsp;'
    });

    var map = new ol.Map({
      target: 'map',
      layers: [
      OSM_layers,base_layers
      ],
      view: olView,
      interactions: ol.interaction.defaults({ altShiftDragRotate:true, pinchRotate:true }),
      controls: ol.control.defaults().extend(
      [
          new ol.control.FullScreen({source:'fullscreen',}),
          new ol.control.ScaleLine({units: 'metric'}),
          overviewMapControl,
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

    // 오버레이
    var menu = new ol.control.Overlay ({ 
      closeBox : true, 
      className: "slide-left menu", 
      content: $("#menu").get(0),
        // hideOnClick:true
    });
    map.addControl(menu);

    //좌측 메뉴 토글바
    var t = new ol.control.Toggle(
      {
        html: '<i class="fa fa-bars"></i>',
        className: "menu btn btn-yoonsik",
        title: "Menu",
        onToggle: function () { menu.toggle(); }
      });
    map.addControl(t);

    //하단 알림창
    var notification = new ol.control.Notification({
    });
    map.addControl(notification);
    //feature 선택 팝업창
    var select = new ol.interaction.Select({
      hitTolerance: 5,
      multi: true,
      condition: ol.events.condition.singleClick
    });
    map.addInteraction(select);
