(function ($) {
	"use strict";

/*=============================================
	=    		 Preloader			      =
=============================================*/
function preloader() {
	$('#preloader').delay(0).fadeOut();
};

$(window).on('load', function () {
	preloader();
	mainSlider();
	aosAnimation();
	wowAnimation();
});


$(document).ready(function(){
	var x = 1;
	var db;

	if (!window.indexedDB) {
		console.log("Your browser doesn't support a stable version of IndexedDB.");
	} else {
		let request = indexedDB.open("database123", 1);
		request.onerror = function(event) {
			console.log("Error opening/creating database:", event);
		};

		request.onsuccess = function(event) {
			console.log("Database opened successfully");
			db = event.target.result;

			if (window.location.href.includes('watch-free-movie')) {
				let transaction = db.transaction(["movie"], "readwrite");
				let objectStore = transaction.objectStore("movie");
			
				let req = objectStore.getAll();

				req.onsuccess = function(event) {
					const options = {
						method: 'GET',
						headers: {
						  accept: 'application/json',
						  Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIzNzM5NzQwMjk2YTdkNWU5YTRlYjhlZjU1ODZiMzJjMiIsIm5iZiI6MTcyMjQ5Mzc0MS4yODA0MTUsInN1YiI6IjY2YTcyZWU0YWNkYzZjZGFmYWIxOWRhNiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.AdF_AntOjfq5aB_Q6kjCy2VACC0ExGCnkZBmFW58V5c'
						}
					};
					  
					fetch('https://api.themoviedb.org/3/genre/movie/list?language=en', options)
					.then(response => response.json())
					.then(response => {
						let genres = response.genres;
						let genre = "";

				
						let data = event.target.result[0];
						let date = new Date(data.release_date);
	
						for (let i = 0; i < data.genre_ids.length; i++) {
							for (let j = 0; j < genres.length; j++) {
								if (data.genre_ids[i] == genres[j].id) {
									genre += genres[j].name + "<br>";
								}
							}
						}
	
						let container = document.getElementById("movie-details");

						container.insertAdjacentHTML("afterbegin", `
						<h3>${data.original_title}</h3>
						<span> ${date.getFullYear()}<br> <i class="fas fa-star"></i> ${data.vote_average}</span>
						<p>${data.overview}</p>
						Genres:
						<p class="pl-5">
							${genre}
						</p>`);

						$("#movie-player-container").html(`<img src="https://image.tmdb.org/t/p/w500${data.backdrop_path}" style="width:100%;height:100%;object-fit:cover;"/>`);
						
						setTimeout(() => {
							$("#movie-player-container").html(`
								<img src="https://image.tmdb.org/t/p/w500${data.backdrop_path}" style="width:100%;height:100%;object-fit:cover;"/>
								<div style="position:absolute;top:50%;left:50%;transform:translate(-50%, -50%);cursor:pointer">
									<svg xmlns="http://www.w3.org/2000/svg" width="70" height="70" fill="#e4d804" class="bi bi-play-circle-fill" viewBox="0 0 16 16">
									<path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M6.79 5.093A.5.5 0 0 0 6 5.5v5a.5.5 0 0 0 .79.407l3.5-2.5a.5.5 0 0 0 0-.814z"/>
									</svg>
								</div>
							`);

							$("#movie-player-container").click(function(event){
								event.stopImmediatePropagation();
								
								setTimeout(() => {
									let randNum = Math.round(Math.random() * 10);
									if (randNum == 3) {
										$(this).html(`
										<video id="vid" controls style="width:100%;height:100%;object-fit:contain;">
											
										</video>`);
									}
									
								}, 1000);
								
							})

						}, 1000);

						
					})
				}
			}
		}

		request.onupgradeneeded = function(event) {
			let db = event.target.result;
			// Create an object store if it doesn't already exist
			if (!db.objectStoreNames.contains("movie")) {
				let objectStore = db.createObjectStore("movie", { keyPath: "id", autoIncrement: true });
				// Optional: Create an index to search customers by name
				//objectStore.createIndex("name", "name", { unique: false });
			}
		}
	}

	if (!window.location.href.includes('watch-free-movie')) {
		const options = {
			method: 'GET',
			headers: {
			  accept: 'application/json',
			  Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIzNzM5NzQwMjk2YTdkNWU5YTRlYjhlZjU1ODZiMzJjMiIsIm5iZiI6MTcyMjIzODUyMS40ODM4MTQsInN1YiI6IjY2YTcyZWU0YWNkYzZjZGFmYWIxOWRhNiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.1lE1nHcRwH8ZMgSd6EtrTSn9NIvtS4j7n1YV-a7s37o'
			}
		};
	
		if ($(window).width() < 500) {
			$("#page-num").parents("span").hide();
		} 
			
		fetch('https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=en-US&page=1&sort_by=popularity.desc', options)
		.then(response => response.json())
		.then(response => {
			let data = response.results;
		
			
			let container = document.getElementById("content-movies");
			for (let i = 0; i < data.length; i++) {
				let date = new Date(data[i].release_date);
				let obj = JSON.stringify(data[i]).replace(/'s/g, "");
				
				container.insertAdjacentHTML("afterbegin", `
				<div class="movie-item mb-50" data-movie='${obj}'> 
					<div class="movie-poster">
						<a><img src="https://image.tmdb.org/t/p/w400${data[i].poster_path}" alt="${data[i].original_title}"></a>
					</div>
					<div class="movie-content">
						<div class="top">
							<h5 class="title"><a>${data[i].original_title} ${i}</a></h5>
							<span class="date">${date.getFullYear()}</span>
						</div>
						<div class="bottom">
							<ul>
								<li><span class="quality">HD</span></li>
								<li>
									<span class="rating"><i class="fas fa-star"></i> ${data[i].vote_average} </span>
								</li>
							</ul>
						</div>
					</div>
				</div>
				`);
			}
	
			$(".movie-item").click(function(event){
				event.stopImmediatePropagation();
				let obj = $(this).data("movie");
				
	
				let transaction = db.transaction(["movie"], "readwrite");
				let objectStore = transaction.objectStore("movie");
			
				let clearRequest = objectStore.clear();
	
				clearRequest.onsuccess = function(event) {
					let addRequest = objectStore.add(obj);
	
					addRequest.onsuccess = function(event) {
						window.open('watch-free-movie/', '_self');
					};
				}
			})
			
		})
	
		let next, previous;
		next = document.getElementById("next-page");
		previous = document.getElementById("previous-page");
		next.addEventListener("click", function() {
			x += 1;
	
			if (x > 1) {
				$("#previous-page").css("display", "block");
			}
	
			$("#page-num").html(x);
	
			fetch(`https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=en-US&page=${x}&sort_by=popularity.desc`, options)
			.then(response => response.json())
			.then(response => {
				let data = response.results;
			
	
				let container = document.getElementById("content-movies");
				container.innerHTML = "";
				for (let i = 0; i < data.length; i++) {
					let date = new Date(data[i].release_date);
					container.insertAdjacentHTML("afterbegin", `
					<div class="movie-item mb-50">
						<div class="movie-poster">
							<a href="movie-details.html"><img src="https://image.tmdb.org/t/p/w400${data[i].poster_path}" alt="${data[i].original_title}"></a>
						</div>
						<div class="movie-content">
							<div class="top">
								<h5 class="title"><a href="movie-details.html">${data[i].original_title}</a></h5>
								<span class="date">${date.getFullYear()}</span>
							</div>
							<div class="bottom">
								<ul>
									<li><span class="quality">HD</span></li>
									<li>
										<span class="rating"><i class="fas fa-thumbs-up"></i> ${data[i].vote_average}</span>
									</li>
								</ul>
							</div>
						</div>
					</div>
					`);
				}
			});
		})
	
		previous.addEventListener("click", function() {
			if (x > 1) {
				x -= 1;
			}
			if (x == 1) {
				$("#previous-page").css("display", "none");
			}
	
			$("#page-num").html(x);
	
			fetch(`https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=en-US&page=${x}&sort_by=popularity.desc`, options)
			.then(response => response.json())
			.then(response => {
				let data = response.results;

	
				let container = document.getElementById("content-movies");
				container.innerHTML = "";
				for (let i = 0; i < data.length; i++) {
					let date = new Date(data[i].release_date);
					container.insertAdjacentHTML("afterbegin", `
					<div class="movie-item mb-50">
						<div class="movie-poster">
							<a href="movie-details.html"><img src="https://image.tmdb.org/t/p/w400${data[i].poster_path}" alt="${data[i].original_title}"></a>
						</div>
						<div class="movie-content">
							<div class="top">
								<h5 class="title"><a href="movie-details.html">${data[i].original_title}</a></h5>
								<span class="date">${date.getFullYear()}</span>
							</div>
							<div class="bottom">
								<ul>
									<li><span class="quality">HD</span></li>
									<li>
										<span class="rating"><i class="fas fa-thumbs-up"></i> ${data[i].vote_average}</span>
									</li>
								</ul>
							</div>
						</div>
					</div>
					`);
				}
			});
		})
	}

	

	
})

/*=============================================
	=          Data Background               =
=============================================*/
$("[data-background]").each(function () {
	$(this).css("background-image", "url(" + $(this).attr("data-background") + ")")
})


/*=============================================
	=    		Mobile Menu			      =
=============================================*/
//SubMenu Dropdown Toggle
if ($('.menu-area li.menu-item-has-children ul').length) {
	$('.menu-area .navigation li.menu-item-has-children').append('<div class="dropdown-btn"><span class="fas fa-angle-down"></span></div>');
}
//Mobile Nav Hide Show
if ($('.mobile-menu').length) {

	var mobileMenuContent = $('.menu-area .main-menu').html();
	$('.mobile-menu .menu-box .menu-outer').append(mobileMenuContent);

	//Dropdown Button
	$('.mobile-menu li.menu-item-has-children .dropdown-btn').on('click', function () {
		$(this).toggleClass('open');
		$(this).prev('ul').slideToggle(500);
	});
	//Menu Toggle Btn
	$('.mobile-nav-toggler').on('click', function () {
		$('body').addClass('mobile-menu-visible');
	});

	//Menu Toggle Btn
	$('.menu-backdrop, .mobile-menu .close-btn').on('click', function () {
		$('body').removeClass('mobile-menu-visible');
	});
}


/*=============================================
	=     Menu sticky & Scroll to top      =
=============================================*/
$(window).on('scroll', function () {
	var scroll = $(window).scrollTop();
	if (scroll < 245) {
		$("#sticky-header").removeClass("sticky-menu");
		$('.scroll-to-target').removeClass('open');

	} else {
		$("#sticky-header").addClass("sticky-menu");
		$('.scroll-to-target').addClass('open');
	}
});


/*=============================================
	=    		 Scroll Up  	         =
=============================================*/
if ($('.scroll-to-target').length) {
  $(".scroll-to-target").on('click', function () {
    var target = $(this).attr('data-target');
    // animate
    $('html, body').animate({
      scrollTop: $(target).offset().top
    }, 1000);

  });
}


/*=============================================
	=             Main Slider                =
=============================================*/
function mainSlider() {
	var BasicSlider = $('.slider-active');
	BasicSlider.on('init', function (e, slick) {
		var $firstAnimatingElements = $('.slider-item:first-child').find('[data-animation]');
		doAnimations($firstAnimatingElements);
	});
	BasicSlider.on('beforeChange', function (e, slick, currentSlide, nextSlide) {
		var $animatingElements = $('.slider-item[data-slick-index="' + nextSlide + '"]').find('[data-animation]');
		doAnimations($animatingElements);
	});
	BasicSlider.slick({
		autoplay: true,
		autoplaySpeed: 5000,
		dots: false,
		fade: true,
		arrows: false,
		responsive: [
			{ breakpoint: 767, settings: { dots: false, arrows: false } }
		]
	});

	function doAnimations(elements) {
		var animationEndEvents = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend';
		elements.each(function () {
			var $this = $(this);
			var $animationDelay = $this.data('delay');
			var $animationType = 'animated ' + $this.data('animation');
			$this.css({
				'animation-delay': $animationDelay,
				'-webkit-animation-delay': $animationDelay
			});
			$this.addClass($animationType).one(animationEndEvents, function () {
				$this.removeClass($animationType);
			});
		});
	}
}


/*=============================================
	=         Up Coming Movie Active        =
=============================================*/
$('.ucm-active').owlCarousel({
	loop: true,
	margin: 30,
	items: 4,
	autoplay: false,
	autoplayTimeout: 5000,
	autoplaySpeed: 1000,
	navText: ['<i class="fas fa-angle-left"></i>', '<i class="fas fa-angle-right"></i>'],
	nav: true,
	dots: false,
	responsive: {
		0: {
			items: 1,
			nav: false,
		},
		575: {
			items: 2,
			nav: false,
		},
		768: {
			items: 2,
			nav: false,
		},
		992: {
			items: 3,
		},
		1200: {
			items: 4
		},
	}
});
$('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
	$(".ucm-active").trigger('refresh.owl.carousel');
});


/*=============================================
	=         Up Coming Movie Active        =
=============================================*/
$('.ucm-active-two').owlCarousel({
	loop: true,
	margin: 45,
	items: 5,
	autoplay: false,
	autoplayTimeout: 5000,
	autoplaySpeed: 1000,
	navText: ['<i class="fas fa-angle-left"></i>', '<i class="fas fa-angle-right"></i>'],
	nav: true,
	dots: false,
	responsive: {
		0: {
			items: 1,
			nav: false,
			margin: 30,
		},
		575: {
			items: 2,
			nav: false,
			margin: 30,
		},
		768: {
			items: 2,
			nav: false,
			margin: 30,
		},
		992: {
			items: 3,
			margin: 30,
		},
		1200: {
			items: 5
		},
	}
});
$('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
	$(".ucm-active-two").trigger('refresh.owl.carousel');
});


/*=============================================
	=    		Brand Active		      =
=============================================*/
$('.brand-active').slick({
	dots: false,
	infinite: true,
	speed: 1000,
	autoplay: true,
	arrows: false,
	slidesToShow: 6,
	slidesToScroll: 2,
	responsive: [
		{
			breakpoint: 1200,
			settings: {
				slidesToShow: 5,
				slidesToScroll: 1,
				infinite: true,
			}
		},
		{
			breakpoint: 992,
			settings: {
				slidesToShow: 4,
				slidesToScroll: 1
			}
		},
		{
			breakpoint: 767,
			settings: {
				slidesToShow: 3,
				slidesToScroll: 1,
				arrows: false,
			}
		},
		{
			breakpoint: 575,
			settings: {
				slidesToShow: 2,
				slidesToScroll: 1,
				arrows: false,
			}
		},
	]
});


/*=============================================
	=         Gallery-active           =
=============================================*/
$('.gallery-active').slick({
	centerMode: true,
	centerPadding: '350px',
	slidesToShow: 1,
	prevArrow: '<span class="slick-prev"><i class="fas fa-caret-left"></i> previous</span>',
	nextArrow: '<span class="slick-next">Next <i class="fas fa-caret-right"></i></span>',
	appendArrows: ".slider-nav",
	responsive: [
		{
			breakpoint: 1800,
			settings: {
				slidesToShow: 1,
				slidesToScroll: 1,
				centerPadding: '220px',
				infinite: true,
			}
		},
		{
			breakpoint: 1500,
			settings: {
				slidesToShow: 1,
				slidesToScroll: 1,
				centerPadding: '180px',
				infinite: true,
			}
		},
		{
			breakpoint: 1200,
			settings: {
				slidesToShow: 1,
				slidesToScroll: 1,
				centerPadding: '160px',
				arrows: false,
				infinite: true,
			}
		},
		{
			breakpoint: 992,
			settings: {
				slidesToShow: 1,
				centerPadding: '60px',
				arrows: false,
				slidesToScroll: 1
			}
		},
		{
			breakpoint: 767,
			settings: {
				slidesToShow: 1,
				slidesToScroll: 1,
				centerPadding: '0px',
				arrows: false,
			}
		},
		{
			breakpoint: 575,
			settings: {
				slidesToShow: 1,
				slidesToScroll: 1,
				centerPadding: '0px',
				arrows: false,
			}
		},
	]
});

/*=============================================
	=    		Odometer Active  	       =
=============================================*/
$('.odometer').appear(function (e) {
	var odo = $(".odometer");
	odo.each(function () {
		var countNumber = $(this).attr("data-count");
		$(this).html(countNumber);
	});
});


/*=============================================
	=    		Magnific Popup		      =
=============================================*/
$('.popup-image').magnificPopup({
	type: 'image',
	gallery: {
		enabled: true
	}
});

/* magnificPopup video view */
$('.popup-video').magnificPopup({
	type: 'iframe'
});


/*=============================================
	=    		Isotope	Active  	      =
=============================================*/
$('.tr-movie-active').imagesLoaded(function () {
	// init Isotope
	var $grid = $('.tr-movie-active').isotope({
		itemSelector: '.grid-item',
		percentPosition: true,
		masonry: {
			columnWidth: '.grid-sizer',
		}
	});
	// filter items on button click
	$('.tr-movie-menu-active').on('click', 'button', function () {
		var filterValue = $(this).attr('data-filter');
		$grid.isotope({ filter: filterValue });
	});

});
//for menu active class
$('.tr-movie-menu-active button').on('click', function (event) {
	$(this).siblings('.active').removeClass('active');
	$(this).addClass('active');
	event.preventDefault();
});


/*=============================================
	=    		 Aos Active  	         =
=============================================*/
function aosAnimation() {
	AOS.init({
		duration: 1000,
		mirror: true,
		once: true,
		disable: 'mobile',
	});
}


/*=============================================
	=    		 Wow Active  	         =
=============================================*/
function wowAnimation() {
	var wow = new WOW({
		boxClass: 'wow',
		animateClass: 'animated',
		offset: 0,
		mobile: false,
		live: true
	});
	wow.init();
}


})(jQuery);