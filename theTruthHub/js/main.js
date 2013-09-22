$(document).ready(function() {
	$("#navigation a, #icon-menu a").smoothScroll({speed:500, easing:"swing"});
	// $("#icon-menu a").smoothScroll({speed:500});

				$( '#meat').cbpFWSlider();
				$( '#seafood').cbpFWSlider();
				$( '#dairy').cbpFWSlider();
				$( '#eggs').cbpFWSlider();
				$( '#gmo').cbpFWSlider();
				$( '#additives').cbpFWSlider();
				

		$(window).scroll(function() {
		   if ($(window).scrollTop() > 200) {
		   	$('#navigation').fadeIn(300);
		   } else {
		   	$('#navigation').fadeOut(300);
		   }
		});

		

		$('#toggle1').click(function() {
			$('.toggle1').slideToggle('medium');
			return false;
		});

		$('#toggle2').click(function() {
			$('.toggle1').hide('medium');
			return false;
		});

		$('#toggle3').click(function() {
			$('.toggle1').hide('medium');
			return false;
		});



		$('#toggle2').click(function() {
			$('.toggle2').slideToggle('medium');
			return false;
		});

		$('#toggle1').click(function() {
			$('.toggle2').hide('medium');
			return false;
		});

		$('#toggle3').click(function() {
			$('.toggle2').hide('medium');
			return false;
		});




		$('#toggle3').click(function() {
			$('.toggle3').slideToggle('medium');
			return false;
		});

		$('#toggle1').click(function() {
			$('.toggle3').hide('medium');
			return false;
		});

		$('#toggle2').click(function() {
			$('.toggle3').hide('medium');
			return false;
		});


});

