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
        //console.log("1");
        return;
      }
      if (parts === 0 || !complete) {
        //console.log("2");
        //console.log(complete);
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
            var coordinate_x = data.result.resultdata[0].x;
            var coordinate_y = data.result.resultdata[0].y;
            var point = new ol.geom.Point([Number(coordinate_x),Number(coordinate_y)]);
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

  function geocode_promise_function(param) {
    return new Promise((resolve, reject) => {
      $.ajax({
        type: "GET",
        //url : "/location/Reverse_GeoCodding",
        url: "https://sgisapi.kostat.go.kr/OpenAPI3/addr/rgeocode.json",
        data: param,
        dataType: 'json',
        success: function (data) {
          console.log(data);
          if (data.errMsg == 'Success') {
            if (data.result[0].hasOwnProperty('emdong_nm')) {
              $("input[name=bunji_address]").val(data.result[0].full_addr);
              notification.show([$("input[name=bunji_address]").val() + '<br>' + $("input[name=road_address]").val()]);

            } else {
              $("input[name=road_address]").val(data.result[0].full_addr);
              notification.show([$("input[name=bunji_address]").val() + '<br>' + $("input[name=road_address]").val()]);

            }
            if (data.result[0].hasOwnProperty('sido_nm')) {
              $("input[name=sido_nm]").val(data.result[0].sido_nm);
            }
          } else {
            $("input[name=road_address]").val(data.errMsg);
            notification.show([$("input[name=bunji_address]").val() + '<br>' + $("input[name=road_address]").val()]);
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
	                apikey: "D8DA2C77-00ED-3DE3-8252-E183BB2F1B6A",
                  	//key: "D8DA2C77-00ED-3DE3-8252-E183BB2F1B6A",
	                FORMAT: "image/png",
	                WIDTH:512,
	                HEIGHT:512
	            },

		    }),
            	opacity:0.3,
		});
    
		layer_tile.setZIndex(5);
		layer_tile.set("name",this_layer);
        	layer_tile.set("id",this_layer);
		map.addLayer(layer_tile);
		let imgSrc = "https://api.vworld.kr/req/image?key=C4C4FE9D-271A-3D7D-9DBE-BF7030912E04&service=image&request=GetLegendGraphic&format=png&type=ALL&layer="+this_val+"&style="+this_val
	
        	$('#wms_image').append("<img src='"+imgSrc+"' alt ='"+this_title+"' >");
	
		
	});//'change'
})

//vworld wfs
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
                }
            },
            error: function(xhr, stat, err) {}
        });
    });
}

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


$(document).ready(function(){
  sgis_authkey();

});
