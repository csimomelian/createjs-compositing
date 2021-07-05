

//Declaring Variables
var radialLine;
var radialLineBounds;
var canvas;
var stage;
var circles;
var circleContainer;
var globalComposition;
var radius;
var diameter;
var square;
var squareSize;
var debug_mode = true;//true : show the fps current status.
var fpsLabel;
var allCircles;//Array that will store the circles objects. Used to reference the circle and know the current postion.
var rgb = [{"RED" : "#FF0000"}, {"GREEN" : "#00FF00"} ,{"BLUE" : "#0000FF"} ];//Primary color used on the 3 circles.

//Declaring constants
const LINE_HEIGHT = 36; ///Value use on the curtain that is shown at the first of the task.
const INIT_GAME_MESSAGE = "Please match the paired colors by dragging the puzzle pieces";
const INIT_GAME_SUB_MESSAGE = "Click anywhere to begin";//title 
const END_GAME_MESSAGE  = "Well done!";//subtitle
const TITLE_FONTSIZE = "2em";//title font size
const SECONDARY_FONTSIZE = "1.5em";//subtitle font size




function init () {
	

	canvas = document.getElementById('canvas');
	globalComposition = "lighter";

	circleContainer = new createjs.Container();
	circleContainer.name="circleContainer";

	//Set canvas meassures 
	canvas.width = document.body.clientWidth || 550;
	canvas.height = document.body.clientHeight || 500;
	console.log('%c##### canvas width : ' + canvas.width , "color:red;");


	stage = new createjs.Stage(canvas);
	stage.name = "stage";
	stage.snapToPixelEnabled = true;
	stage.snapToPixel = true;
	//createjs.Ticker.setInterval(25);
	createjs.Ticker.setFPS(30);
	//Enable mouse over and touch event at the stage,  by default is disabled.
	//stage.enableMouseOver(60);
	createjs.Touch.enable(stage);


	
	ticker();
	//draw();
	//draw_radiaLine();
	

	draw_square();
	//draw_diameter();
	
	circles = new Array();
	circles = triadCircles(globalComposition,0.75,-0.35,square,squareSize);//triadCircles will return an array of 3 objects (the 3 circles)
	

	//console.log(circles);

	setFpsLabel();//

	displayStartMsg();///display the black blur curtain.


/*	createjs.Ticker.addEventListener("tick", function() {
		//console.log(circles[0].x);
		stage.update();
		if (distance(circles[0], circles[1]) < radius * 1.75 && distance(circles[0], circles[2]) < radius * 1.75 && distance(circles[1], circles[2]) < radius * 1.75) {
			setTimeout(function() {
				createjs.Ticker.removeAllEventListeners();
				iExp.taskCompleted();
			}, 1000);
		};	
	});*/

	//draw_Circles ();
}



//dRAW a square that will be the position circle reference.
//Shapes by default have not bounds defined. In this case is setted by the drawrect, but is possible to use setBOunds to set a different size 

function draw_square () {

		 console.log("%c## draw_square","color:green");
		 squareSize = Math.sqrt(Math.pow(stage.canvas.height, 2) + Math.pow(stage.canvas.width, 2))/16;

		 square = new createjs.Shape();
		 square.name ="square";
		 square.graphics.setStrokeStyle(3);
		 square.graphics.beginStroke("green");
		 //square.setBounds(0,0,squareSize,squareSize); or ¬ ¬ 
		 square.graphics.drawRect(0,0,squareSize,squareSize);
		 square.x = stage.canvas.width/2 - squareSize/2 ;
		 square.y = stage.canvas.height/2 - squareSize/2 ;
		 //square.snapToPixel = true;
		 square.alpha = 1.0;
		 square.visible = false;
		 //console.log( square.getTransformedBounds().width)
		 stage.addChild(square);
		 stage.update();
		 square.cache(0,0,squareSize,squareSize);

}




function triadCircles(composite, posLuminance, negLuminance, squareRef, squareRefSize) {

		console.log("%c## triadCircles","color:olive");

		//Store the position of each circle.
		var circlePositions  = [ 
		{"RED"  : { "x": squareRef.x + squareRefSize *2 , "y" : squareRef.y} },
		{"GREEN": { "x": squareRef.x - squareRefSize, "y" : squareRef.y } },
		{"BLUE" : { "x": squareRef.x + squareRefSize/2 , "y" : squareRef.y + squareRefSize*2 }}
		 ];

		 //draw all circles and store them in array.: 
		allCircles = new Array();
		allCircles.push(drawCircle(rgb[0]["RED"], circlePositions[0]["RED"].x,circlePositions[0]["RED"].y,squareRefSize, composite, posLuminance, negLuminance,1,pressMoveCircle ));
		allCircles.push(drawCircle(rgb[1]["GREEN"], circlePositions[1]["GREEN"].x,circlePositions[1]["GREEN"].y,squareRefSize, composite, posLuminance, negLuminance,1,pressMoveCircle ))
		allCircles.push(drawCircle(rgb[2]["BLUE"], circlePositions[2]["BLUE"].x,circlePositions[2]["BLUE"].y, squareRefSize, composite, posLuminance, negLuminance,1,pressMoveCircle ));

		return allCircles;


}





///funcion que dibuja y posiciona un circulo con degradado.
///Los circulos son añadidos a un container para aplicar el efecto blur al iniciar el task.
///Al hacer click en la cortinilla creada al iniciar el task, se elimina el efecto blur con uncache.

function drawCircle (colour, x, y, rad, composite, posLuminance, negLuminance,alpha,EventMovehandler) {

		
		console.log("%c## drawCircle","color:green");
		var circ =  new createjs.Shape();
		circ.name = colour;
		circ.snapToPixel = false;
		circ.compositeOperation = composite;	
		circ.alpha = alpha;
		circ.graphics.beginRadialGradientFill([colourLuminance(colour,posLuminance), colourLuminance(colour,negLuminance), colour], [0, 1, 0], -(rad/2), -(rad/2), 0, 0, 0, rad).drawCircle(0, 0, rad);
		circ.x = x;
		circ.y = y;
		circ.initialX = x;
		circ.initialY = y;
		circ.on('pressmove',EventMovehandler);

		//Add display objects to the stage.
		circleContainer.addChild(circ);		
		stage.addChild(circleContainer);

		//Apply a blur effect to the container to have the effect to their childs (the 3 circles)
		//The blur effect does not take effect if the cache region is not set.
		circleContainer.filters = [new createjs.BlurFilter(25, 25, 5), new createjs.ColorMatrixFilter(new createjs.ColorMatrix(60))];
		circ.cache(-rad, -rad, rad * 2, rad * 2);
		circleContainer.cache(0,0,stage.canvas.width,stage.canvas.height);
		stage.update();

		return circ;
		
}

//Handle the pressmove event attache to each circle.

function pressMoveCircle (event) {

		console.log("%c## pressMoveCircle","color:red");
		circleContainer.setChildIndex(event.target, circleContainer.getNumChildren() - 1);
		//console.log(event.currentTarget)
		event.currentTarget.x = event.stageX;
		event.currentTarget.y = event.stageY;
		stage.update();

}


//Show FPS for debug purpouses.

function setFpsLabel () {

	// add a text object to output the current FPS:
	
	fpsLabel = new createjs.Text("-- fps", "bold 1em Arial", "#FFF");
	stage.addChild(fpsLabel);
	fpsLabel.x = 10;
	fpsLabel.y = 20;
	fpsLabel.name = "fpslabel";
	stage.update();

}



///Show the start task curtain. Are a container that group a three display objects ( shape obj, 2 texts obj )

function displayStartMsg () {

		
		//An a container is created that contains 

		var container = new createjs.Container();
		container.name = "displayStartMsgContainer";

		///draw a black square with opacity 
		var fadingRect = new createjs.Shape();
		fadingRect.graphics.beginFill("black").drawRect(0, 0, canvas.width, canvas.height);
		fadingRect.alpha = 0.81;



		//Text 1
		var startTaskText = new createjs.Text(INIT_GAME_MESSAGE, TITLE_FONTSIZE + " Arial", "white");
		startTaskText.lineWidth = document.body.clientWidth*(9/10);
		///set position text1
		startTaskText.lineHeight = LINE_HEIGHT;
		startTaskText.textAlign = "center";
		startTaskText.x = canvas.width/2;
		startTaskText.y = canvas.height/2 - startTaskText.getMeasuredHeight();

		


		//Text 2
		var nextText = new createjs.Text(INIT_GAME_SUB_MESSAGE, SECONDARY_FONTSIZE + " Arial", "white");
		nextText.lineWidth = document.body.clientWidth*(9/10);
		nextText.lineHeight = LINE_HEIGHT;
		nextText.textAlign = "center";
		nextText.x = canvas.width/2;
		nextText.y = canvas.height/2 + startTaskText.getMeasuredHeight()/2 + LINE_HEIGHT;


		//add display objects to the stage
		container.addChild(fadingRect,startTaskText,nextText);
		stage.addChild(container);


		fadingRect.addEventListener('click', function(evt) { 
				console.log(evt.target.name+" : "+evt.eventPhase+" : "+evt.currentTarget.name)
				stage.removeChild(container);///remove the curtain from the stage
				circleContainer.uncache(); //clean the blur effect of the circle container. 
				animateCircle(circles);

		 }, null, false, null, false);

		
		stage.update();
}	



function animateCircle (circles) {

		createjs.Tween.get(circles[0], {loop: false , override :false}).to({alpha: 0.5 ,x : square.x + squareSize }, 1750, createjs.Ease.bounceOut).to({alpha: 1 });
		createjs.Tween.get(circles[1], {loop: false , override :false}).to({alpha: 0.5 ,x : square.x  }, 1750, createjs.Ease.bounceOut).to({alpha: 1 });
		createjs.Tween.get(circles[2], {loop: false , override :false}).to({alpha: 0.5 ,y : square.y + squareSize }, 1750, createjs.Ease.bounceOut).to({alpha: 1 });
}



function ticker () {

		console.log('#Trigger draw') 
        
        createjs.Ticker.addEventListener("tick",stage);

        createjs.Ticker.addEventListener("tick", function(){
        		 if (debug_mode){

        		 	fpsLabel.text = Math.round(createjs.Ticker.getMeasuredFPS()) + " fps";
        		 }	
        });
       
}




/**
Adds or substract light(lum) from a given colour(hex)
**/
function colourLuminance(hex, lum) {

		// validate hex string
		hex = String(hex).replace(/[^0-9a-f]/gi, '');
		if (hex.length < 6) {
			hex = hex[0]+hex[0]+hex[1]+hex[1]+hex[2]+hex[2];
		}
		lum = lum || 0;

		// convert to decimal and change luminosity
		var rgb = "#", c, i;
		for (i = 0; i < 3; i++) {
			c = parseInt(hex.substr(i*2,2), 16);
			c = Math.round(Math.min(Math.max(0, c + (c * lum)), 255)).toString(16);
			rgb += ("00"+c).substr(c.length);
		}
		return rgb;
}






//Prueba de callbacks js  : https://fernetjs.com/2011/12/creando-y-utilizando-callbacks/
//el parametro callback representra a una funcion,en este caso se llama a triadCircles
function test (callback){

//callback(globalComposition,0.75,-0.35,square,squareSize);
	
//Asi se llmaria en el init a esta function test(triadCircles) 
}



window.onresize = function(){

		//reset canvas , radius circles meassures 
		canvas.width = document.body.clientWidth || 550;
		canvas.height = document.body.clientHeight || 500;

		console.log('resize');
		//Removing puzzle by child of the stage, except fpslabel.
		//AL hacer resize , los circulos se duplicaban debido al cache del containerCircle , 
		//Hay dos maneras de solucionarlos , 1 removiendo los chiidrens del container o actualizando el cache de cada circulo.
			//circleContainer.removeAllChildren(); 
		for (var i = circles.length - 1; i >= 0; i--) {
			
			circles[i].removeAllEventListeners();
			circles[i].uncache();
			circles[i].cache(-radius, -radius, radius * 2, radius * 2);

		};
			//circleContainer.uncache(); 
		stage.removeAllChildren();
		stage.update();

		draw_radiaLine();
		draw_square();
		draw_diameter();
		//guardo los circulos para actualizar el cache en cada resize.
		circles = triadCircles(globalComposition,0.75,-0.35,square,squareSize);
		setFpsLabel();
		displayStartMsg();
		
		console.log(circles);


}



/*//////////////////////////////////////////////OBSOLETE FUNCTION :  TESTING PURPOUSES
*///not used : IT was only for testing
//

function draw_radiaLine (){

		 console.log("%c## draw_radiaLine","color:green");
		 //http://blog.createjs.com/update-width-height-in-easeljs/ 
		 // Shapes do not have getBounds, you have set it manually by setBounds
		 radialLine = new createjs.Shape();
		 radialLine.name ="radialLine";
		 radialLine.graphics.setStrokeStyle(3);
		 radialLine.graphics.beginStroke("white");
		 radialLine.graphics.beginFill("white");
		 radialLine.setBounds(0,stage.canvas.height/2,stage.canvas.width,1);
		 radialLine.graphics.moveTo(0,stage.canvas.height/2).lineTo(stage.canvas.width,stage.canvas.height/2)
		 stage.addChild(radialLine);
		 radialLine.alpha = 1 ;
		 radialLine.visible = false;
		 radialLineBounds = radialLine.getBounds();
		 //console.log(radialLine.getMeasuredWidth() )//solo en textos.
		 console.log(radialLine.getTransformedBounds().x)
		 console.log(radialLineBounds.width);
		 stage.update();
}



function draw_diameter(){

		 console.log("%c## draw_diameter","color:green");
		 diameter = new createjs.Shape();
		 diameter.name="diameter";
		 diameter.graphics.setStrokeStyle(3);
		 diameter.graphics.beginStroke("blue");
		 diameter.graphics.beginFill("blue");
		 diameter.graphics.moveTo(square.x,square.y).lineTo(square.x + squareSize ,square.y + squareSize).moveTo(square.x + squareSize,square.y).lineTo(square.x,square.y + squareSize);
		 diameter.alpha = 1 ;
		 diameter.visible = false;
		 //circleContainer.addChild(diameter);
		 stage.addChild(diameter);
		 //console.log( diameter.getTransformedBounds().width)
		 stage.update();

}	


