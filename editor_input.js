// For dealing with all editor input.

// Tues 27th Oct 2020.

// Placing a plat first.
// keyboard functions next.
// Mouse at bottom.


// To place a new plat object.
function placePlat(whereX,whereY){
  
  if (playmode) return;
  // Create new platform at mouse pos.
  if (!canPlace) return;
	// Temp holder for our new plat.
  let jo;
  if (whichPlatType===0)
    jo = new Platform(whereX-x,whereY-y);
  else if (whichPlatType===1)
    jo = new Creature(whereX-x,whereY-y);
	else if (whichPlatType===2)
    jo = new Decor(whereX-x,whereY-y);
	else if (whichPlatType===3)
    jo = new Subject(whereX-x,whereY-y);
  // Push onto plats array.
  plats.push(jo);
	
	// Now make sure newly instantiated
	// plat is selected in the editor.
  if (plats[prevSel])
    plats[prevSel].selected = false;
	
  prevSel = plats.length - 1;
  jo.selected = true;
	// Do we need to load any imagery?
	if (jo.useImg){
		Platform.loadImage(prevSel);
	}
	// Also need to update DOM fields.
  manageProperties();
	
}

function keyPressed(){
  
  // Toggle playmode with space.
  // if(keyCode===32){
  //   playmode=!playmode;
  // }
  
  // Edit mode.
  if (!playmode){
  // Test for changing object type.
  // I think I want this done via
  // the DOM -- and by all means 
  // incorportate a shortcut key.
  if (key=="o" && mouseY < height){
    whichPlatType++;
		haveBegunPreview = false;
    if (whichPlatType>3) whichPlatType = 0;
  }
  
	// Duplicate...
	// This could be a static method...
	if (key=="d" && plats[prevSel])
	{
		let clone;
		if (plats[prevSel].name==='platform'){
				clone = new 
				Platform(plats[prevSel].p.x,
							 	plats[prevSel].p.y);
		}
		else if (plats[prevSel].name==='subject'){
				clone = new 
				Subject(plats[prevSel].p.x,
							 	plats[prevSel].p.y);
			clone.flip = plats[prevSel].flip;
		}
		else if (plats[prevSel].name==='decoration'){
				clone = new 
				Decor(plats[prevSel].p.x,
							plats[prevSel].p.y);
		}
		else if (plats[prevSel].name==='creature'){
				clone = new 
				Creature(plats[prevSel].p.x,
							 	plats[prevSel].p.y);
			clone.flip = plats[prevSel].flip;
		}
		// Common properties.
		clone.w = plats[prevSel].w;
		clone.h = plats[prevSel].h;
		clone.useImg = plats[prevSel].useImg;
		clone.imgName = plats[prevSel].imgName;
		// Load afresh to prevent .gif sharing bug.
		// i.e. don't just clone straight across.
		clone.img = 
			loadImage(plats[prevSel].imgName);
		// Move to new position.
		clone.p.x += clone.w;
		// Push to plats array.
		plats.push(clone);
		// Sort out 'wh' etc. for collisions.
		Platform.changeWidth(plats.length-1,
												 clone.w);
		// Finally, make sure we have selected
		// the just-created object.
		// Now make sure newly instantiated
		// plat is selected in the editor.
  	if (plats[prevSel])
    	plats[prevSel].selected = false;
  	prevSel = plats.length - 1;
  	clone.selected = true;	
		// Also need to update DOM fields.
  	manageProperties();
	}
		
  // Don't want unfortunate deletions etc.
  // So -- ignore keys if mouse off canvas.
  if (mouseY > height) return;
  
  // No platforms?
  if (plats.length < 1) return;
  
  // Backspace pressed?
  if (keyCode===BACKSPACE){
    // Does this presently selected
    // exist, and is it selected?
    if (plats[prevSel] &&
        plats[prevSel].selected)
        plats.splice(prevSel,1);
				// Either way -- once backspace
				// pressed, nothing is selected.
				prevSel = -1
    return;
  }
  } // End of edit mode keys.
  
  
}

// Movement by arrowkeys/wsad.
// Everything is translated relative.
// NB reset when level loaded.
let x = 0;
let y = 0;
function checkNavInput(){
  if (!keyIsPressed) return;
	if (playmode) return;
	
  // Space-bar pressed?
  if (keyCode===32){
    // Maybe duplicate?
    // We'll use this to bring user
    // back to 'home start' of level.
    x = 0;
    y = 0;
    return;
  }
  
  // Don't want unfortunate deletions etc.
  // So -- ignore keys if mouse off canvas.
  if (mouseY > height) return;
  
  // This now placed in draw().
  // Perform translation.
  //translate(x,y);
  
  // Shouldn't need this now since
  // we're called this function from
  // keyPressed().
  if (keyIsPressed===false) return;
  
  let speed = 12;
  
  if (keyCode==
     UP_ARROW){
    //spaceVoice.speak("going up");
    y+=speed;
  }
  if (keyCode==DOWN_ARROW){
    //spaceVoice.speak("going down");
    y-=speed;
  }
  if (keyCode==
     LEFT_ARROW){
    x+=speed;
  }
  if (keyCode==
     RIGHT_ARROW){
    x-=speed;
  }
}

function mouseMoved(){
  if (!amDragging)
  canPlace = true;
}

function mouseDragged(){
  
  if (mouseY > height) return;
  
  // Manage selection.
  if (!amDragging)
  mouseSelect(false);
  
  // Check that mouse is over a 
  // platform before trying anything.
  if (plats[prevSel] &&
      plats[prevSel].mouseOver){}
  else return;
  
  // Move item according to mouse pos.
  // x and y are position offset for
  // navigation while editing level.
  // dmX and dmY are mouse offset.
  if (plats[prevSel]){    
    amDragging = true;
    plats[prevSel].p.x = mouseX-x-dmX;
    plats[prevSel].p.y = mouseY-y-dmY;
		
	}
}

function mouseSelect(toggle){
  // Select highlighted platform.
  for (let i = 0; i < plats.length; i++){
    if (plats[i].mouseOver){
      
      // ********************************
      // We're over an object, so do not
      // permit creation of new objects.
      canPlace = false;
      
      // Judge where mouse is in relation
      // to selected obj. For dragging
      // without having obj jump to being
      // centred around mouse.
      // OK - I think this needs to happen
      // in mouseSelect. Hmmmm.
      // NB x and y are edit nav offsets.
      dmX = mouseX - plats[i].p.x - x;
      dmY = mouseY - plats[i].p.y - y;
      
      // ********************************
      
      // Toggle or select object.
      if (toggle){
        plats[i].selected =
        !plats[i].selected;
      }
      else { 
        plats[i].selected = true;}
  
      // ? Needs comment.
      if (plats[prevSel] && prevSel !== i){
          plats[prevSel].selected = false;
          }
      
      // Set current selected object (prevSel)
			// to this [i] object on plats.
      // But if nothing now selected,
      // set prevSel to -1.
			// NB Also populate editor fields
			// with object's properties (if anything
			// selected).
      if (plats[i].selected){
        prevSel = i;
				// Now populate DOM fields with
				// currently selected (prevSel)
				// object's properties.
        manageProperties();
      } else prevSel = -1;
      
      // Job done -- exit loop & function!
      return;
    }
  }
}

function mousePressed(){
  
  if (mouseY > height) return;
  
  // True argument means selection can
  // toggle obj as selected/not-selected.
  // False selects it no matter what.
  mouseSelect(true);
}

function mouseReleased(){
  
  amDragging = false;
  
  if (mouseY > height) return;
  placePlat(mouseX,mouseY);
  
}
