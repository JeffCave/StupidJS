'use strict';

/*
Snow Fall Java Script
Visit http://rainbow.arch.scriptmania.com/scripts/
  for this script and many more
*/

/*
global Image,
*/

function SnowFall(){
	// Configure below - change number of snow to render
	let Amount=15; 
	
	let Ypos=new Array();
	let Xpos=new Array();
	let Speed=new Array();
	let Step=new Array();
	let Cstep=new Array();
	
	for (let i = 0; i < Amount; i++){
		let img = document.createElement('div');
		img.id = "si"+i;
		img.style = "position:absolute;top:0px;left:0px;background-color:white;";
		let size = (Math.random()*0.5+0.25).toFixed(2);
		img.style.height = size + 'em';
		img.style.width = size + 'em';
		img.style.borderRadius = (size/2)+'em';
		img.style.opacity = Math.random()*0.75+0.25;
		document.body.append(img);
	}

	let WinHeight=window.innerHeight;
	let WinWidth=window.innerWidth;
	for (let i=0; i < Amount; i++){
		Ypos[i] = Math.round(Math.random()*WinHeight);
		Xpos[i] = Math.round(Math.random()*WinWidth);
		Speed[i]= Math.random()*5+3;
		Cstep[i]=0;
		Step[i]=Math.random()*0.1+0.05;
	}
	
	let interval = null;
	this.start = function(){
		if(interval) return;
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
	
	
	function fall(){
		var WinHeight=window.innerHeight;
		var WinWidth=window.innerWidth;
		for (let i=0; i < Amount; i++){
			let sy = Speed[i]*Math.sin(90*Math.PI/180);
			let sx = Speed[i]*Math.cos(Cstep[i]);
			Ypos[i]+=sy;
			Xpos[i]+=sx;
			if (Ypos[i] > WinHeight){
				Ypos[i]=-60;
				Xpos[i]=Math.round(Math.random()*WinWidth);
				Speed[i]=Math.random()*5+3;
			}
			let snowflake = document.querySelector("#si"+i);
			snowflake.style.left=Math.min(WinWidth,Xpos[i]) + "px";
			snowflake.style.top=Ypos[i] + "px";
			Cstep[i]+=Step[i];
		}
	}
	
	

}
