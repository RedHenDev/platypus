/*

Created around 24th October 2020.

A game engine for simple 2D platformer
games.

Allows users to build completely in
the browser, including easy to
manage media assets. Key principle
is to promote non-fiddly simplicity
from the off. So, it should be
like playing with blocks or lego
to build a world.

[Legacy comment :)]
So what we want to be able to do
is save an array
of objects (2D platforms) to a json, 
and then load them up again.

*/

// Would like to make these static
// properties of my Platform class,
// but js doesn't seem to allow this,
// even though seems perfectly fine here:
/* 
https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes/static
*/
// Our array of platforms.
let plats = [];
// Previously selected platform.
// For dealing with selection logic;
// Basically means 'currently selected plat'.
let prevSel = 0;
// Let's deal with moving platforms
// with mouse drag.
let canPlace = true;
let amDragging = false;
// So, canPlace will be false if
// at anytime we are hovering over
// a platform.
// What do we want to do about selecting
// something? I don't know.
// Let's get it working and cross that
// bridge when we get to it.
// Difference from mouse location to
// centre of grabbed/dragged object.
// These values will be added to where
// object is being dragged to; so,
// assigned when mousePressed(), and
// used during mouseDragged().
let dmX;
let dmY;
// Playmode toggle.
let playmode = false;
// Input keys during playmode.
let inLEFT = false;
let inRIGHT = false;
let inUP = false;
let inDOWN = false;
let inSPACE = false;
// Our main subject/player index on plats.
let mainSubjectID = -1;

// Background image.
let BGname;
let currentBG;

function preload(){
	BGname = 'winterBG.jpg';
	loadBackground();
}

function loadBackground(){
	currentBG = loadImage(BGname);
}

function setup() {
  createCanvas(windowWidth,
               windowHeight-200);
  
  // To draw rects from centre, not corner.
  rectMode(CENTER);
  
	// Editor DOM controls.
  setupButtons();
}

// For determing which index of plats array
// belongs to main subject/player.
function findSubject(){
    console.log("Finding subject");
    // We'll iterate over all the plats
    // and find first 'subject' type.
    // this will be the plat controlled
    // by user and whom the camera follows.
    for (let i = 0; i < plats.length; i++){
      if (plats[i].name == 'subject'){
        mainSubjectID = i;
        console.log("Main subject:" + i);
        break;
      }
    }
}

// Called to set up an start a level.
// We do things like returning subjects
// to their start positions.
// So, this also needs to be called when
// we return to edit mode? Yes.
function resetLevel(){
	// Iterate over plats and find
	// any subject types.
	// Reset their positions to
	// start positions.
	
	// Going back into edit mode...
	// Take position from stored original position.
	if (!playmode){
		for (let i = 0; i < plats.length; i++){
			if (plats[i].name==='subject'||
				  plats[i].name==='creature'){
				plats[i].p.x = plats[i].op.x;
				plats[i].p.y = plats[i].op.y;
			}
		}
	}
	
	// Going into play mode...
	// So, here we can set original positions
	// based on current position.
	if (playmode){
		for (let i = 0; i < plats.length; i++){
			if (plats[i].name==='subject'||
				  plats[i].name==='creature'){
				plats[i].op.x = plats[i].p.x;
				plats[i].op.y = plats[i].p.y;
			}
		}
	}
	
	
}


// Setup and management of the
// preview object displayed ready
// for placement.
// Needed since previewPlat operations
// are called in draw() -- so we don't
// want to generate things ad infinitum.
let haveBegunPreview = false;
let whichPlatType = 0;
// Preview plat.
let pPlat;
// This needs to be called in draw.
function previewPlat(){
  
  // If we haven't started edit build yet
  // then initialise a plat and make
  // sure the which-type-next variable
  // is in default mode.
  if (!haveBegunPreview){
		// What we want to do is instantiate
		// a new object of whichPlatType,
		// which load/save and placePlat use
		// to generate their objects.
		// Maybe use placePlat in load? Don't
		// want to be doubling any code.
		let prevX = 0;
		let prevY = 0;
		if (whichPlatType===0){
		pPlat = 
				new Platform(prevX, prevY);
		}
		else if (whichPlatType===1){
		pPlat = 
				new Creature(prevX, prevY);
		}
		else if (whichPlatType===2){
		pPlat = 
				new Decor(prevX, prevY);
		}
		else if (whichPlatType===3){
		pPlat = 
				new Subject(prevX, prevY);
		}
		
		// Adjust position in top left corner.
		pPlat.p.x = pPlat.wh + 12;
		pPlat.p.y = pPlat.hh + 12;
		
		// Using an image be default?
		if (pPlat.useImg){
			// Hmmmm can't use the static
			// function -- because it is
			// disgusting and works on the
			// global array of plats.
			// Instead, then, we'll just 
			// do the work here ourselves.
			// God this is awful.
			// Well...on first test it works. So.
			pPlat.img = loadImage(pPlat.imgName);
			//Platform.loadImage(prevSel);
		}
		
		
		// Now, we don't want to push this
		// to the main plats array, but we
		// simply want to render it during 
		// draw() loop. Maybe just a global
		// variable is needed, then?
		
    haveBegunPreview = true;
  }
  
	// Since this function is called in draw()
	// we can render the previewPlat here.
	// Do we want this to stand out somehow?
	// Sin bob? Colour? Rotate? Something else?
	pPlat.render();
	strokeWeight(2);
	stroke(255);
	fill(0);
	textSize(22);
	text(pPlat.name, 
			 pPlat.p.x-pPlat.wh,
			 pPlat.p.y+pPlat.hh+16);
	
}


function checkPlayInput(){
	// Turn off global input -- must make
  // sure user is providing input *this* update.
  inRIGHT = false;
  inLEFT = false;
  inUP = false;
  inDOWN = false;
	
    if (keyIsDown(RIGHT_ARROW)){
        inRIGHT = true;
				plats[mainSubjectID].flip = 1;
        } else inRIGHT = false;
    if (keyIsDown(LEFT_ARROW)){
        inLEFT = true;
				plats[mainSubjectID].flip = -1;
        } else inLEFT = false;
    if (keyIsDown(DOWN_ARROW)){
        inDOWN = true;
        } else inDOWN = false;
    if (keyIsDown(UP_ARROW)){
        inUP = true;
        } else inUP = false;
    //if (keyIsDown(keyCode(32))){
      //  inSPACE = true;
       // } else inSPACE = false; 
}




function draw() {
	
	// Draw the background.
	// NB - at time of writing, we always
	// load in a BG image by default
	// (see preload()).
	// What we need is a more sophisticated
	// system that at least allows us to
	// choose between images and simple RGB.
	image(currentBG,0,0,width,height);
	 
	
  // If in editmode, green frame around screen.
  if (!playmode){
    noFill();
    strokeWeight(15);
    stroke(0,200,0);
    rect(width*0.5, height*0.5,width,height);
		
  }else{
    // Nothing.
  }
  
  // Navigate level with arrow key
  // during edit mode.
  // x and y are variables used for this
  // translation.
	push();
  if (!playmode) {
		
  	translate(x,y);
    checkNavInput()
	}
  else checkPlayInput();
  
  // Translate view around subject.
  // As if camera following.
  //push();
  if (playmode && plats[mainSubjectID]) 
    translate(
      width*0.5-plats[mainSubjectID].p.x,
      height*0.5-plats[mainSubjectID].p.y);
  
	
	// Render background decoration elements first.
	for (let i = 0; i<plats.length;i++){
		if (plats[i].name==='decoration')
			plats[i].render();
	}
	
  // Update plats -- check to see if mouse
  // is hoving over (not needed in playmode)
  // and render plats.
  let i = 0;
  while (i < plats.length){
    
    // Do hovercheck etc. if in edit mode.
    if (!playmode){
    if(
      plats[i].hoverCheck(
      mouseX-x,
      mouseY-y,1)
      ) { plats[i].mouseOver = true;
         // We are over something,
         // so we shouldn't be able to
				 // place new objects.
         canPlace = false;
				 // ...Unless we're just over a
				 // background element, which could
				 // be huuuuuge.
//				 if (plats[i].name==='decoration'){
//					 canPlace = true;
//				 }
        }
    else plats[i].mouseOver = false;
    } // End of 'if in edit mode'.
    
    // Draw all objects to screen.
		// But not decoration elements, which
		// have already been rendered so as
		// to appear behind subject etc.
		if (plats[i].name!=='decoration')
    	plats[i].render();
    
    // Subject update: physics and
		// locomotion.
    if ((plats[i].name==='subject'||
				plats[i].name==='creature') &&
        playmode)
        plats[i].update(i);
    
    i++;
  }
	
	
	pop();	// Reset matrix -- so that preview
					// Plat is static, top left.
	
	// We do this after other objects, so that
	// it will always be in view (on top).
	if (!playmode){
		// Display a preview of plat type to be
		// instantiated on mousePress().
  	previewPlat();
	}
  
	// Image loading test...
//  if (imgArray.length>0){
//		image(imgArray[0],width*0.5,42,101,101);
//	}
}