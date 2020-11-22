// Saving and loading.

// Tues 27th October 2020.

function loadPlats(_file){
  // First, just load a JSON from
  // uploaded file.
  // Later, really need 
  // fileChoose etc.
  
  // How can I make sure this loads
  // before moving on? Let's try 
  // a callback.
  
  // Nope, now done with promise,
  // fetch, and arrow functions.
  
  
  // let promise = fetch('plats.json')
  //   .then(response => response.json())
  //   .then(json => loadIt(json))
  //   .catch(error => console.log(error));
  
  // Should probably do this with
  // await and async.
	console.log(_file.name); // Can we get the name?
  loadIt(_file.data);
}

function loadIt(_json){
  console.log('Got the json!');
  // First, empty out plats array.
  plats = [];
  let jPlats = _json;
  // Now, build new plat objects
  // with reference to platform
  // arrays stored on json.
  let jojo; // Our new object.
  for (let i = 0; 
       i < jPlats.len; i++){
    
    // What type of object is this?
    if (jPlats.name[i] == 'platform'){
      jojo = new 
      Platform(jPlats.x[i],
               jPlats.y[i]);
      //console.log('platform added');
    }
    else if (jPlats.name[i] == 'subject'){
      jojo = new 
      Subject( jPlats.x[i],
               jPlats.y[i]);
			jojo.flip = jPlats.flip[i];	// Unique *.
			jojo.op.x = jPlats.op_x[i];
			jojo.op.y = jPlats.op_y[i];
    }
		else if (jPlats.name[i] == 'decoration'){
      jojo = new 
      Decor(		jPlats.x[i],
               	jPlats.y[i]);
    }
		else if (jPlats.name[i] == 'creature'){
      jojo = new 
      Creature(jPlats.x[i],
               jPlats.y[i]);
			jojo.flip = jPlats.flip[i];	// Unique *.
			jojo.op.x = jPlats.op_x[i];
			jojo.op.y = jPlats.op_y[i];
    }
		
		// Boiler plate stuff common to
		// all object types.
		plats.push(jojo);
    
		jojo.h = jPlats.h[i];
    //jojo.img = jPlat.img[i];
		jojo.imgName = jPlats.imgName[i];
		jojo.useImg = jPlats.useImg[i];
		// NB we do not save the image data to
		// the json, but just the file name.
		// So, upon loading or creating a new
		// object that does have an image name,
		// we must load that image. So, we'll use
		// a static function for that (on the pattern
		// of the changeWidth() function).
		if (jojo.useImg){
			Platform.loadImage(i, jPlats.imgName[i]);
		}
		Platform.changeWidth(i,jPlats.w[i]);
		
		// Use static function, which
    // correctly recalculates width info --
    // has to be after it's pushed to array,
		// since the static function accesses
		// 'jojo' via the plats array itself.
  }
  
	// Grab background image info.
	BGname = jPlats.bg;
	loadBackground();
	
  // Reset relative translation.
  x = 0;
  y = 0;
  // Begin in edit mode.
  playmode = false;
  // Begin with default plat type (for placing).
  whichPlatType = 0;
  // Done!
  console.log('level loaded!');
}

function savePlats(){
  console.log("saving plats...");
  
  // So, I basically would love to just bang
  // the plats[] array onto a json and 
	// go from there?
	// ...Nope. Well, let's try it disaggregated.
	
	// Here's the main json object.
  let jPlats = {};
	// And here's the background img name.
	jPlats.bg = BGname;
	
	// Now each class of object needs to add
	// its unique properties here, so that
	// arrays are co-ordinated. Those objects
	// without those properties will just have
	// null values for those properties saved
	// to the json.
	
  // Platform properties in arrays.
  jPlats.x = [];
  jPlats.y = [];
  jPlats.w = [];
  jPlats.h = [];
  jPlats.name = [];
	//jPlats.img = [];	// Don't store image data!
	jPlats.imgName = [];// Just the file name :)
	jPlats.useImg = [];
	// Subject properties in arrays.
	jPlats.flip = [];
	jPlats.op_x = [];
	jPlats.op_y = [];
  // Number of platforms (plats.length) --
  // required for loading with for loop.
  jPlats.len = plats.length;
  for (let i = 0; i < plats.length; i++){
		// If plat type is 'Platform'.
    jPlats.x[i] = plats[i].p.x;
    jPlats.y[i] = plats[i].p.y;
    jPlats.w[i] = plats[i].w;
    jPlats.h[i] = plats[i].h;
    jPlats.name[i] = plats[i].name;
		//jPlats.img[i] = plats[i].img;
		jPlats.imgName[i] = plats[i].imgName;
		jPlats.useImg[i] = plats[i].useImg;
		// If plat type is 'Subject'.
		if (plats[i].name==='subject'||
			 	plats[i].name==='creature'){
			jPlats.flip[i] = plats[i].flip;
			// NB - we take the actual pos, since
			// user needs to hit play toggle to 
			// set op position vector to current p.
			// That is, we are assuming user is
			// saving level in edit mode.
			// In fact, at some point I likely need
			// to hide the DOM controls during playmode.
			jPlats.op_x[i] = plats[i].p.x;
			jPlats.op_y[i] = plats[i].p.y;
		}
  }
  
	// Aaaaand save this unholy mess to JSON.
  saveJSON(jPlats, 'plats.json');
}
