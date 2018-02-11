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
	
	this.start = function(){
		Initialize();
	};
	this.stop = function(){
		while(snowflakes.length > 0){
			snowflakes.pop();
		}
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
		return snowflakes.length > 0;
	};
	
	
	function Initialize(){
		
		window.addEventListener('resize',function(e){
			WinHeight = window.innerHeight;
			WinWidth = window.innerWidth;
		});
		
		while(snowflakes.length < amount){
			let flake = new SnowFlake();
			snowflakes.push(flake);
		}
		
	}
	
	
	function SnowFlake(){
		this.destroy = function(){
			this.elem.style.opacity = 0;
			let i = snowflakes.indexOf(this);
			snowflakes = snowflakes.splice(i,1);
			if(interval){
				clearInterval(interval);
			}
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
		
		this.animate = function(){
			this.Cstep += this.Step;
			
			let sy = this.Speed*Math.sin(90*Math.PI/180);
			let sx = this.Speed*Math.cos(this.Cstep);
			this.Ypos+=sy;
			this.Xpos+=sx;
			
			if(this.Ypos > WinHeight){
				let i = snowflakes.indexOf(this);
				if (i < 0){
					this.destroy();
					return;
				}
				else{
					this.resetFlake();
				}
			}
			
			this.elem.style.left = Math.min(WinWidth, this.Xpos) + "px";
			this.elem.style.top = this.Ypos + "px";
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
		this.Ypos = Math.round(Math.random()*WinHeight);
		
		document.body.append(this.elem);
		
		let interval = setInterval(function(flake){flake.animate();},115,this);
		
	}
	
}
