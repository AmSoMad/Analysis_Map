$(document).ready( function() {

	$('.top_search').click(function(){
	    $( this ).toggleClass('on');
	    $('.top_search_wrap').slideToggle('');
	});

	$('.search_btn').click(function(){
	    $( this ).addClass('on');
	    $('.search_wrap').addClass('on');
	    $('.de00_btn').removeClass('on');
		$('.de01_btn').removeClass('on');
		$('.depth00_wrap').removeClass('on');
	    $('.depth01_wrap').removeClass('on');
	    $('.depth02_wrap').removeClass('on');
	});

	$('.search_wrap .depth_btn').click(function(){
	    $('.search_btn').removeClass('on');
	    $('.search_wrap').removeClass('on');
	});


	//탭부분
	$('.de00_btn').click(function(){
		console.log("1번클릭");
		$('.de00_btn' ).removeClass('on');
		$('.de01_btn' ).removeClass('on');
		$('.depth00_wrap').removeClass('on');
		$('.depth01_wrap').removeClass('on');
		$('.depth02_wrap').removeClass('on');
		$( this ).addClass('on');
		$('.depth00_wrap').addClass('on');
		$('.search_btn' ).removeClass('on');
		$('.search_wrap').removeClass('on');
	});//공장검색정보

	$('.depth00_wrap .depth_btn').click(function(){
		$('.de00_btn').removeClass('on');
		$('.depth00_wrap').removeClass('on');
	});//공장검색정보

	$('.de01_btn').click(function(){
		console.log("2번클릭");
		$('.de00_btn' ).removeClass('on');
		$('.de01_btn' ).removeClass('on');
		$('.depth00_wrap').removeClass('on');
		$('.depth01_wrap').removeClass('on');
		$('.depth02_wrap').removeClass('on');
	    $( this ).addClass('on');
	    $('.depth01_wrap').addClass('on');
	    $('.search_btn' ).removeClass('on');
	    $('.search_wrap').removeClass('on');
	});//기반시설

	$('.depth01_wrap .depth_btn').click(function(){
	    $('.de01_btn').removeClass('on');
	    $('.depth01_wrap').removeClass('on');
	});//기반시설
	
	$('.de02_btn').click(function(){
		console.log("3번클릭");
		$('.de02_btn' ).removeClass('on');
		$('.depth02_wrap').removeClass('on');
		//$( this ).addClass('on');
		//$('.depth02_wrap').addClass('on');
		$('.search_btn' ).removeClass('on');
		$('.search_wrap').removeClass('on');
	});

	$('.depth02_wrap .depth_btn').click(function(){
		$('.de02_btn').removeClass('on');
		$('.depth02_wrap').removeClass('on');
	});
	//탭부분끝 

	//pdf부분
	$('.de01_02_btn').click(function(){
		console.log("pdf 1번클릭");
	    $('.depth02_wrap' ).addClass('on');
	});

	$('.depth02_wrap .depth_btn').click(function(){
	    $('.depth02_wrap').removeClass('on');
	});

	//pdf부분 끝


	$(".faq dt").click(function(){
	    $(this).next().slideToggle();
	    $(this).toggleClass("active");
	});

	//pdf부분 탭
	$('.cate_06 li').click(function(){
		var tab_id = $(this).attr('data-tab');

		$('.cate_06 li').removeClass('on');
		$('.tab_con').removeClass('on');

		$(this).addClass('on');
		$("#"+tab_id).addClass('on');
	});

	$('.d_cate_04 li').click(function(){
		var tab_id = $(this).attr('data-tab');

		$('.d_cate_04 li').removeClass('on');
		$('.tab_con').removeClass('on');

		$(this).addClass('on');
		$("#"+tab_id).addClass('on');
	});

	$('.tab_04 li').click(function(){
		var tab_id = $(this).attr('data-tab');
		console.log('4개탭에서 ' + tab_id + '<- 클릭');

		$('.tab_04 li').removeClass('on');
		//$('.cate_con').removeClass('on');
		$('.de00_cate_con').removeClass('on');

		$(this).addClass('on');
		$("#"+tab_id).addClass('on');
	});

	$('.tab_05 li').click(function(){
		var tab_id = $(this).attr('data-tab');
		console.log('5개탭에서 ' + tab_id + '<- 클릭');

		$('.tab_05 li').removeClass('on');
		$('.cate_con').removeClass('on');

		$(this).addClass('on');
		$("#"+tab_id).addClass('on');
	});

	$('.tab_06 li').click(function(){
		var tab_id = $(this).attr('data-tab');
		console.log('6개탭에서 ' + tab_id + '<- 클릭');

		$('.tab_06 li').removeClass('on');
		$('.cate_con').removeClass('on');

		$(this).addClass('on');
		$("#"+tab_id).addClass('on');
	});

	$(".tab_con dt").click(function(){
	    $(".tab_con dd").slideUp();
	    $(".tab_con dt").removeClass("active");
	    if(!$(this).next().is(":visible"))
	    {
	        $(this).next().slideDown();
	        $(this).addClass("active");
	    }
	});





			

});