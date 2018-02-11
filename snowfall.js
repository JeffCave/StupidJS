'use strict';

/*
Snow Fall Java Script
Visit http://rainbow.arch.scriptmania.com/scripts/
  for this script and many more
*/

function SnowFall(amount = 15){
	let WinHeight = window.innerHeight;
	let WinWidth = window.innerWidth;
	let snowflakes = [];
	
	let interval = null;
	
	this.start = function(){
		if(interval) return;
		Initialize();
		interval = setInterval(fall,115);
	};
	this.stop = function(){
		if(interval){
			clearInterval(interval);
		}
		interval = null;
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
	this.isActive = function(){
		return interval !== null;
	};
	
	
	function Initialize(){
		
		window.addEventListener('resize',function(e){
			WinHeight = window.innerHeight;
			WinWidth = window.innerWidth;
		});
		
		for (let i = 0; i < amount; i++){
			let flake = new SnowFlake();
			snowflakes.push(flake);
		}
	}
	
	function SnowFlake(){
		this.destroy = function(){
			this.elem.style.opacity = 0;
			setTimeout(function(elem){
				elem.remove();
			},1000,this.elem);
		};
			
		this.resetFlake = function(){
			this.Ypos=-60;
			this.Xpos=Math.round(Math.random()*WinWidth);
			this.Speed = Math.random()*5+3;
			this.Cstep = 0;
			this.Step = Math.random()*0.1+0.05;
		};
	
		this.elem = document.createElement('div');
		this.elem.classList.add('snowflake');
		this.elem.style = "position:absolute;top:0px;left:0px;background-color:white;";
		
		let size = (Math.random()*0.5+0.25).toFixed(2);
		this.elem.style.height = size + 'em';
		this.elem.style.width = size + 'em';
		this.elem.style.borderRadius = (size/2)+'em';
		this.elem.style.opacity = Math.random()*0.75+0.25;
		this.elem.style.transition = 'opacity 1s';
		
		this.resetFlake();
		this.elem.Ypos = Math.round(Math.random()*WinHeight);
		
		document.body.append(this.elem);
		
	}
	
	function fall(){
		snowflakes.forEach(function(flake){
			let sy = flake.Speed*Math.sin(90*Math.PI/180);
			let sx = flake.Speed*Math.cos(flake.Cstep);
			flake.Ypos+=sy;
			flake.Xpos+=sx;
			if (flake.Ypos > WinHeight){
				flake.resetFlake();
			}
			flake.elem.style.left = Math.min(WinWidth, flake.Xpos) + "px";
			flake.elem.style.top = flake.Ypos + "px";
			flake.Cstep += flake.Step;
		});
	}
	
	
}
