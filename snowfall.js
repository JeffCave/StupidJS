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
 
	//Pre-loads your image/s below
	//Configure below - change URL path to the snow image
	
	let grphcs=new Array(5)
	let Image0=new Image();
	Image0.src=grphcs[0]="snow1.gif";
	let Image1=new Image();
	Image1.src=grphcs[1]="snow2.gif";
	let Image2=new Image();
	Image2.src=grphcs[2]="snow3.gif";
	let Image3=new Image();
	Image3.src=grphcs[3]="snow4.gif";
	let Image4=new Image();
	Image4.src=grphcs[4]="snow5.gif";
	
	//Smoothness depends on image file size, 
	//the smaller the size the more you can use!
	
	// Configure below - change number of snow to render
	let Amount=15; 
	
	let Ypos=new Array();
	let Xpos=new Array();
	let Speed=new Array();
	let Step=new Array();
	let Cstep=new Array();
	
	for (let i = 0; i < Amount; i++){
		let P=Math.floor(Math.random()*grphcs.length);
		let rndPic=grphcs[P];
		let img = document.createElement('img');
		img.id = "si"+i;
		img.src = rndPic;
		img.style = "position:absolute;top:0px;left:0px";
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
