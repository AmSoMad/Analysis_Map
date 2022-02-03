# Portfolio 
~~[일부기능 구현중인 화면]~~ ~~[http://amsomad.com/]~~
## 뚝딱뚝딱 제작중.

- 제작 의도
   - 각부처별 제공된 공간정보을 활용하여 지역별 분석과 관련정보를 유추할수 있다.


- 현재 적용된 기능
   - geocode 클릭시 해당위치의 주소 알림출력
   - 주소검색 후 해당위치로 이동
   - 첨부파일 양식에 맞춰 주소를 지오코더로 변환하여 마커등록(지번, 도로명) 각각따로
   - Vworld 레이어 출력 및 해당레이어 정보 출력


- 사용된 라이브러리 
  - [OpenLayers6][https://openlayers.org/] 
  - [OL-ext][https://viglino.github.io/ol-ext/]
  - [다음주소api][https://postcode.map.daum.net/guide]
  - [pdfobject][https://pdfobject.com/]
  - [bootstrap5][https://getbootstrap.com/] 


- 활용API
  - VWorld
    - Vworld에서 제공하는 레이어와 지오코딩,WFS, WebGL
  - SGIS
    - SGIS(통계청)에서 지원하는 지오코딩, 시도별 산업분포표 및 인구분포,인구이동 데이터
  - ngii(국토지리정보원)
    - 위성사진(최신)
  - nsdi(국가공간정보포털)
    - GIS 건물일반집합정보
    - 토지이용계획정보
    - 용도지역정보(도시계획)
    - GIS건물통합정보
    - 연속지적도
    - 국토정보기본도
    - 도로명주소안내도
    - 추가 작성예정...........
    - 용도지역지구정보 (총 160개)
