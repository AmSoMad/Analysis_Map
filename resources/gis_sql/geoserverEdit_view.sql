/*  지역구별 산업단지 검색
* 
*
*/

SELECT DISTINCT dd.* from industry.dam_pdan as dd 
LEFT JOIN factory.danji_limit as dlimit ON dd.dan_id = dlimit.danji_code 
LEFT JOIN factory.danji_list as dl ON dd.dan_id = dl.danji_code 
WHERE dlimit."%ksic_code%" != 0 AND (dl.sido LIKE '%%sigungu%%' OR dl.sigungu LIKE '%%sigungu%%')


/*  지적도 지구별 정보 검색
* 
*
*/
SELECT DISTINCT ad.* FROM  gis_bld_info.al_26_d010_20210807 ad
LEFT JOIN cadastral.al_26_d002_20210807 ad2 ON ad.a5 = ad2.a4
WHERE ST_Intersects(ad2.geom , ST_GeomFromText('POINT(%loc_y%  %loc_x%)' , 5174)) AND ST_Within(ad.geom,ad2.geom)



