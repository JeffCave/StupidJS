'use strict';

/*
<!-- This script and many more from -->
<!-- http://rainbow.arch.scriptmania.com -->
*/

function ElasticBalls(){
	
	let nDots = 7;
	let Xpos = 0;
	let Ypos = 0;
	
	
	let DELTAT = 0.01;
	let SEGLEN = 10;
	let SPRINGK = 10;
	let MASS = 1;
	let GRAVITY = 50;
	let RESISTANCE = 10;
	let STOPVEL = 0.1;
	let STOPACC = 0.1;
	let BOUNCE = 0.75;

	let dots = new Array();
	
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
		for (let i = 0; i < nDots; i++) {
			dots[i] = new dot(i);
		}
		
		for (let i = 0; i < nDots; i++) {
			dots[i].obj.left = dots[i].X + "px";
			dots[i].obj.top = dots[i].Y + "px";
		}
		
		let firstDot = dots[0];
		firstDot.obj.display = 'none';
		document.addEventListener('mousemove', function(e){
			firstDot.nailedX = e.pageX;
			firstDot.nailedY = e.pageY;
		});
		document.addEventListener('mouseover', function(e){
			firstDot.nailedX = e.pageX;
			firstDot.nailedY = e.pageY;
		});
		document.addEventListener('mouseout', function(e){
			firstDot.nailedX = null;
			firstDot.nailedY = null;
		});
	}
	
	
	/**
	 * 
	 */
	function dot() {
		this.elem = document.createElement('div');
		this.obj = this.elem.style;
		
		this.elem.style = [
				'background-color:blue',
				'width:0.5em',
				'height:0.5em',
				'border-radius:0.25em',
				'position:absolute',
				'opacity:1',
				'transition:opacity 1s'
			].join(';');
		
		this.X = Xpos;
		this.Y = Ypos;
		this.dx = 0;
		this.dy = 0;
		
		document.body.append(this.elem);
	}
	
	
	/**
	 * 
	 */
	function vec(X, Y) {
		this.X = X;
		this.Y = Y;
	}
	
	
	/**
	 * 
	 */
	function springForce(i, j, spring)
	{
		var dx = (dots[i].X - dots[j].X);
		var dy = (dots[i].Y - dots[j].Y);
		var len = Math.sqrt(dx*dx + dy*dy);
		if (len > SEGLEN) {
			var springF = SPRINGK * (len - SEGLEN);
			spring.X += (dx / len) * springF;
			spring.Y += (dy / len) * springF;
		}
	}
	
	
	/**
	 * Animates the specified dot
	 */
	function animate(dot,i) {
		// originally animate did not take a parameter
		// if no parameter was passed, assume the global array of dots
		if(!dot){
			animate(dots);
			return;
		}
		// originally animate worked on an array of dots. If they passed an 
		// array, animate each individual dot.
		if(Array.isArray(dot)){
			dot.forEach(animate);
			return;
		}
		
		
		// Check to see if the ball is "nailed" to something
		// if so, it does not ahve any motion dictated by springs and gravity
		if(dot.nailedX){
			dot.X = dot.nailedX;
			dot.dx = 0;
		}
		if(dot.nailedY){
			dot.Y = dot.nailedY;
			dot.dy = 0;
		}
		
		
		// Now we can start applying things like spring tensions
		var spring = new vec(0, 0);
		if (i > 0) {
			springForce(i-1, i, spring);
		}
		if (i < (nDots - 1)) {
			springForce(i+1, i, spring);
		}
		
		var resist = new vec(-dot.dx * RESISTANCE, -dot.dy * RESISTANCE);
		
		var accel = new vec((spring.X + resist.X)/ MASS, (spring.Y + resist.Y)/ MASS + GRAVITY);
		
		dot.dx += (DELTAT * accel.X);
		dot.dy += (DELTAT * accel.Y);
		
		if (Math.abs(dot.dx) < STOPVEL && Math.abs(dot.dy) < STOPVEL && Math.abs(accel.X) < STOPACC && Math.abs(accel.Y) < STOPACC) {
			dot.dx = 0;
			dot.dy = 0;
		}
		
		dot.X += dot.dx;
		dot.Y += dot.dy;
		
		let height = window.innerHeight; // - win.scrollTop;
		let width = window.innerWidth; // - document.scrollLeft;
		
		if (dot.Y >=  height - dot.elem.offsetHeight - 1) {
			if (dot.dy > 0) {
				dot.dy = BOUNCE * -dot.dy;
			}
			dot.Y = height - dot.elem.offsetHeight - 1;
		}
		if (dot.Y < 0) {
			if (dot.dy < 0) {
				dot.dy = BOUNCE * -dot.dy;
			}
			dot.Y = 0;
		}
		
		if (dot.X >= width - dot.elem.offsetWidth) {
			if (dot.dx > 0) {
				dot.dx = BOUNCE * -dot.dx;
			}
			dot.X = width - dot.elem.offsetWidth - 1;
		}
		if (dot.X < 0) {
			if (dot.dx < 0) {
				dot.dx = BOUNCE * -dot.dx;
			}
			dot.X = 0;
		}
		
		dot.obj.left = dot.X + "px";
		dot.obj.top =  dot.Y + "px";
	}
	
}
