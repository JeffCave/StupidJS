'use strict';

/*
<!-- This script and many more from -->
<!-- http://rainbow.arch.scriptmania.com -->
*/

function ElasticBalls(){
	
	let nDots = 7;
	
	let DELTAT = 0.01;
	let SEGLEN = 10;
	let SPRINGK = 10;
	let MASS = 1;
	let GRAVITY = 50;
	let RESISTANCE = 10;
	let STOPVEL = 0.1;
	let STOPACC = 0.1;
	let BOUNCE = 0.75;

	let dots = [];
	
	let timer = null;
	
	this.start = function(){
		if(timer !== null) return;
		init();
		timer = setInterval(animate, 20);
	};
	
	/**
	 * Stop the animation associated with the visualization
	 * 
	 * The user has indicated they would like the visualization to stop. 
	 * Since this is an animation that follows the mouse, we have no 
	 * idea where it is going to stop. Removes it from the screen.
	 * 
	 */
	this.stop = function(){
		if(timer === null) return;
		clearInterval(timer);
		timer = null;
		// I don't like the fade out effect. I would prefer that 
		// the elements loose their attachment to the mouse and naturally
		// fall off the page. It plays with the physics more.
		dots.forEach(function(d,i){
			setTimeout(function(){
				d.elem.style.opacity = 0;
				setTimeout(d.elem.remove,1000);
			},i*50);
		});
		
	};
	
	
	/**
	 * 
	 * 
	 */
	this.isActive = function(){
		return timer !== null;
	};
	
	function init()
	{
		let prevDot = null;
		dots = new Array(nDots)
			.fill(null)
			.map(function(d,i){
				d = new Dot(i);
				d.prev = prevDot;
				if(prevDot) prevDot.next = d;
				prevDot = d;
				return d;
			})
			;
		
		let firstDot = dots[0];
		firstDot.elem.style.display = 'none';
		document.addEventListener('mousemove', function(e){
			firstDot.pin.x = e.pageX;
			firstDot.pin.y = e.pageY;
		});
		document.addEventListener('mouseout', function(e){
			firstDot.pin.x = null;
			firstDot.pin.y = null;
		});
	}
	
	
	/**
	 * 
	 */
	function Dot() {
		this.elem = document.createElement('div');
		this.elem.style = [
				'background-color:blue',
				'width:0.5em',
				'left:0px',
				'top:0px',
				'height:0.5em',
				'border-radius:0.25em',
				'position:absolute',
				'opacity:1',
				'transition:opacity 1s'
			].join(';');
		this.elem.classList.add('elasticball');
		
		this.x = 0;
		this.y = 0;
		this.velocity = {
			x:0,
			y:0
		};
		this.pin = {
			x:null,
			y:null,
		};
		
		this.prev = null;
		this.next = null;
		
		document.body.append(this.elem);
	
	
		/**
		 * 
		 */
		function springForce(dotA, dotB, spring)
		{
			let dx = (dotA.x - dotB.x);
			let dy = (dotA.y - dotB.y);
			let len = Math.sqrt(dx*dx + dy*dy);
			if (len > SEGLEN) {
				let springF = SPRINGK * (len - SEGLEN);
				spring.x += (dx / len) * springF;
				spring.y += (dy / len) * springF;
			}
		}
		
		
		/**
		 * Animates the specified dot
		 */
		this.animate = function() {
			let dot = this;
			
			// Check to see if the ball is "nailed" to something
			// if so, it does not ahve any motion dictated by springs and gravity
			if(dot.pin.x){
				dot.x = dot.pin.x;
				dot.velocity.x = 0;
			}
			if(dot.pin.y){
				dot.y = dot.pin.y;
				dot.velocity.y = 0;
			}
			
			
			// Now we can start applying physics
			let resist = {x:RESISTANCE,y:RESISTANCE};
			resist.x *= -dot.velocity.x;
			resist.y *= -dot.velocity.y;
			
			let spring = {x:0,y:0};
			if (dot.prev) {
				springForce(dot.prev, dot, spring);
			}
			if (dot.next) {
				springForce(dot.next, dot, spring);
			}
			
			let accel = {
				x : (spring.x+resist.x) / MASS,
				y : (spring.y+resist.y) / MASS
			};
			accel.y += GRAVITY;
			
			dot.velocity.x += (DELTAT * accel.x);
			dot.velocity.y += (DELTAT * accel.y);
			
			// check the item has settled down
			// at some point there is so little movement we may as well call it
			// check our stop constants to see if the movement is too small to
			// really consider
			let isStopped =
				Math.abs(dot.velocity.x) < STOPVEL && 
				Math.abs(dot.velocity.y) < STOPVEL && 
				Math.abs(accel.x) < STOPACC && 
				Math.abs(accel.y) < STOPACC
				; 
			if (isStopped) {
				dot.velocity.x = 0;
				dot.velocity.y = 0;
			}
			
			dot.x += dot.velocity.x;
			dot.y += dot.velocity.y;
			
			
			// Apply boundary checks
			let height = window.innerHeight; // - win.scrollTop;
			let width = window.innerWidth; // - document.scrollLeft;
			if (dot.y >=  height - dot.elem.offsetHeight - 1) {
				if (dot.velocity.y > 0) {
					dot.velocity.y = BOUNCE * -dot.velocity.y;
				}
				dot.y = height - dot.elem.offsetHeight - 1;
			}
			if (dot.y < 0) {
				if (dot.velocity.y < 0) {
					dot.velocity.y = BOUNCE * -dot.velocity.y;
				}
				dot.y = 0;
			}
			if (dot.x >= width - dot.elem.offsetWidth) {
				if (dot.velocity.x > 0) {
					dot.velocity.x = BOUNCE * -dot.velocity.x;
				}
				dot.x = width - dot.elem.offsetWidth - 1;
			}
			if (dot.x < 0) {
				if (dot.velocity.x < 0) {
					dot.velocity.x = BOUNCE * -dot.velocity.x;
				}
				dot.x = 0;
			}
			
			
			// move the object to its new position
			dot.elem.style.left = dot.x + "px";
			dot.elem.style.top =  dot.y + "px";
		};
	}
	
	/**
	 * Animates the specified dot
	 */
	function animate(dot) {
		// originally animate did not take a parameter
		// if no parameter was passed, assume the global array of dots
		if(!dot){
			animate(dots);
			return;
		}
		dot.forEach(function(d){
			d.animate();
		});
		return;
	}

}
