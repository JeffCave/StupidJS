'use strict';

/*
<!-- This script and many more from -->
<!-- http://rainbow.arch.scriptmania.com -->
*/

function ElasticBalls(){
	
	let nDots = 7;
	
	let DELAY = 20;
	let DELTAT = 0.01;
	let SEGLEN = 10;
	let SPRINGK = 10;
	let MASS = 1;
	let GRAVITY = 50;
	let RESISTANCE = 10;
	let STOPVEL = 0.1;
	let STOPACC = 0.1;
	let BOUNCE = 0.75;

	let pin = null;
	let pinBuster = null;
	let mousePos = {x:0,y:0};

	
	this.start = function(){
		if(pin !== null) return;
		
		document.addEventListener('mousemove',updatePinPosition);
		this.isActive = function(){return true;};
	};
	
	
	/**
	 * Stop the animation associated with the visualization
	 * 
	 * The user has indicated they would like the visualization to stop. 
	 * Since this is an animation that follows the mouse, we have no 
	 * idea where it is going to stop. Removes it from the screen.
	 */
	this.stop = function(){
		document.removeEventListener('mousemove',updatePinPosition);
		document.removeEventListener('mouseout', destroyPin);
		destroyPin();
		this.isActive = function(){return false;};
	};
	
	this.activate = function(state){
		state = (state !== false);
		if(state === this.isActive()){
			return;
		}
		if(state){
			this.start();
		}
		else{
			this.stop();
		}
	};
	
	this.toggle = function(){
		if(pin === null){
			this.start();
		}
		else{
			this.stop();
		}
	};
	
	
	/**
	 * 
	 * 
	 */
	this.isActive = function(){
		return pin !== null;
	};
	
	
	function updatePinPosition(e){
		if(pinBuster){
			clearTimeout(pinBuster);
			pinBuster = null;
		}
		if(pin === null){
			init();
		}
		pin.x = e.pageX;
		pin.y = e.pageY;
		pin.velocity.x = 0;
		pin.velocity.y = 0;
		
		mousePos.x = e.pageX;
		mousePos.y = e.pageY;
	}
	
	function destroyPin(){
		if(pin && !pinBuster){
			pinBuster = setTimeout(function(){pin.destroy()}, 5);
		}
	}
	
	function init()
	{
		let chain = new Dot();
		for(let d=1; d<nDots; d++){
			chain.prev = new Dot();
			chain.prev.next = chain;
			chain = chain.prev;
		}
		pin = chain;
		
		pin.elem.style.display = 'none';
		document.removeEventListener('mouseout', destroyPin);
		document.addEventListener('mouseout', destroyPin);
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
			x:STOPVEL,
			y:STOPVEL
		};
		
		this.prev = null;
		this.next = null;
		
		document.body.append(this.elem);
		
		let animate = function(d){d.animate();};
		let interval = setInterval(animate,DELAY,this);
		
		
		this.destroy = function(){
			this.elem.remove();
			if(this.next){
				this.next.prev = null;
			}
			if(this.prev){
				this.prev.next = null;
			}
			if(pin === this){
				pin = null;
			}
			if(interval){
				clearInterval(interval);
				interval = null;
			}
		};
		
		
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
			if(this === pin){
				return;
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
				if(dot.prev){
					if (dot.velocity.y > 0) {
						dot.velocity.y = BOUNCE * -dot.velocity.y;
					}
					dot.y = height - dot.elem.offsetHeight - 1;
				}
				else if(dot.y >=  height){
					dot.destroy();
					return;
				}
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
}
