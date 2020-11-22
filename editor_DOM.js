// Tues 27th Oct 2020

// DOM Editor controls.

// May have to make these global
// at some point. Like now.
// This is so that we can set value
// of butInput to currently selected
// platform.
let butSave;
let butLoad;
let butInputW;
let butInputH;
let butPlay;
let butFindBG;
//let butImgInput;

// Array of textures/images.
// This needs repopulating at start (so, in setup?).
// Key is to have a selection of images right
// there automatically for users, but also so
// that they can upload their own simply (either
// place in root folder, or upload to p5.js Web
// Editor).
// Need to also create a preview of currently
// selected image. Wonder if I can pass this
// to img src in html? So that I can place under
// canvas?
let imgArray = [];
// Selector for images.
// This needs populating from setup.
let butSelect;
let butFindImage;
//let butSuperSave;

// Called in mouseSelect -- for populating
// DOM fields with currently selected
// object's properties.
// NB prevSel refers us to the currently
// selected object.
// We'll also just make sure that such
// an object exists -- i.e. that indeed
// some object with that index exists.
// It is a convention so far to set
// prevSel to -1 when nothing selected.
function manageProperties(){
	if (plats[prevSel]){
		// Width text input.
		butInputW.value(plats[prevSel].w);
		butInputH.value(plats[prevSel].h);
		//butImgInput.value(plats[prevSel].imgName);
	}
}

function setupButtons(){
  
  // Maybe I should organise this
  // either with an array of positions
  // or something, or as a class?
  
  // Padding positions for buttons.
  let pad = 2;
  // Button width and height.
  let bw = 64;
  let bh = bw * 0.618;
  
	// OK -- for the image property of our
	// platforms, we could use an input field.
	// This could simply be the name of the file
	// the user wants to use as an image, it
	// necessarily being in the root folder.
	// Perhaps later it would be easy to implement
	// and a good idea to have a 'images' folder?
	// What I still must consider, though, is
	// ease of use, esp. avoiding complication
	// when setting up files and folders.
	// Ideally I'd use something like another
	// createFileInput(); however, I don't know
	// how to organise the save and load from 
	// that point -- we can't seem to be able
	// to simply save the correct path.
	// Instead, then, we're having to upload image
	// files to the p5 Web Editor, else putting
	// files in the correct folder.
	// At least, if I'm going to use an 'images'
	// folder etc. later, I can set this up on
	// p5 editor for students to easily fork or
	// download.
	// But surely there is a way for me to code
	// a search of the root folder for any image
	// files types and then load these into a simple
	// drop down list for users to select from?
	
//	butImgInput = createInput('none');
//	butImgInput.input(imgValChanged);
//	function imgValChanged(){
//		
//			// Attempt to load the image.
//			// NB plat objects have two image-related
//			// properties: one for the image itself
//			// called (.img) and one for the name of
//			// the file (.imgName), so that we can
//			// work with and display the name of the
//			// image file in the DOM input field, and
//			// not the image object itself!
//			// Need to refactor this as a promise.
//			if (plats[prevSel]){
//				plats[prevSel].img =
//					loadImage(butImgInput.value());
//				plats[prevSel].imgName =
//					butImgInput.value();
//				plats[prevSel].useImg = true;
//			}
//			// Don't forget to update the DOM's
//			// field of name of this image...
//			// (this may become obsolete since used
//			// to develop functionality, before
//			// drop down menu used...)
//			manageProperties();
//		
//	}
//	butImgInput.position(width*0.5, height+pad);
//	butImgInput.size(bw,bh);
	
	// Change width of object.
  butInputW = createInput('0','number');
  butInputW.changed(valChangeW);
  butInputW.position(pad,
                    height+bh*1+pad);
  butInputW.size(bw,bh);
  
  function valChangeW(){
    // Delimits to positive numbers.
    if (this.value() < 0) this.value(0);
    
    // Let's see if we can change width
    // of selected platform.
    // Should do this in a static method.
    let v = Math.round(this.value());
    Platform.changeWidth(prevSel, 
                         v);
    
    //console.log(this.value());
  }
	
	// Change height of object.
	butInputH = createInput('0','number');
  butInputH.changed(valChangeH);
  butInputH.position(pad,
                    height+bh*2.4+pad);
  butInputH.size(bw,bh);
  
  function valChangeH(){
    // Delimits to positive numbers.
    if (this.value() < 0) this.value(0);
    
    // Let's see if we can change width
    // of selected platform.
    // Should do this in a static method.
    let v = Math.round(this.value());
    Platform.changeHeight(prevSel, 
                         v);
    
    //console.log(this.value());
  }
  
  butSave = createButton("Save");
  butSave.mousePressed(savePlats);
  butSave.position(pad,height+pad);
  butSave.size(bw,bh);
	
	// An attempt to use json properly...
	// ...and fail.
//	butSuperSave = createButton("Super Save");
//  butSuperSave.mousePressed(superSavePlats);
//  butSuperSave.position(pad+bw+pad,height+pad);
//  butSuperSave.size(bw,bh);
  
  butPlay = createButton("Play toggle");
  butPlay.mousePressed(h=>
          {
						// Toggle playmode.
            playmode=!playmode;
						// If we're in playmode,
						// work out who our main
						// subject/player is -- so
						// that camera follow works.
						if (playmode){
            	findSubject();
						}
						// Also, manage subject start pos.
						resetLevel();
						// Since we've just started either
						// mode -- deselect all objects.
						// Previously/Currently selected
						// set to -1, which is 'none'.
						if (plats[prevSel])
							plats[prevSel].selected
							=false;
            prevSel = -1;
          });
  butPlay.position(width-pad-bw,height+pad);
  butPlay.size(bw,bh);
	
	// Experiment.
	
  //butLoad = createButton("Load");
  //butLoad.mousePressed(loadPlats);
  butLoad = createFileInput(loadPlats);
  butLoad.position(pad+bw+pad,height + pad);
  butLoad.size(bw*3,bh);
	
	// Finding image from file...
	butFindImage = createFileInput(findImage);
  butFindImage.position(width*0.5, height+pad+bh);
  butFindImage.size(bw*3,bh);
	
	// Finding background image from file..
	butFindBG = createFileInput(makeBG);
	butFindBG.position(width*0.5+300, height+pad+bh);
  butFindBG.size(bw*3,bh);
	let labelBG = createP('background');
	labelBG.position(width*0.5+300, height+pad+bh+14);
	
	function makeBG(_file){
		let tsa = loadImage(_file.data);
		currentBG = tsa;
		BGname = _file.name;
	}
	
	imgArray.push('none');
	imgArray.push('basicPlat.png');
	imgArray.push('marioGround.png');
	butSelect = createSelect();
	butSelect.position(width*0.5, height+pad+bh*3);
	butSelect.option(imgArray[0]);
	butSelect.option(imgArray[1]);
	butSelect.option(imgArray[2]);
	butSelect.selected(imgArray[0]);
	butSelect.changed(selectTexture);
	butSelect.mousePressed(selectTexture);
	
	function selectTexture(){
		//butImgInput.value(butSelect.value());
		//imgValChanged();
		if (plats[prevSel]){
				plats[prevSel].img =
					loadImage(butSelect.value());
				plats[prevSel].imgName = butSelect.value();
				plats[prevSel].useImg = true;
			}
		previewImage();
	}
	
	function previewImage(){
		let domi;
		
		// If no texture selected, then load some
		// sort of null texture. For testing etc.
		// I'm obviously using an animated
		// totoro.gif.
		if (butSelect.value()==='none'){
			li = 'totoro.gif';
		} else {
			li = butSelect.value();
		}
		domi = createImg(li,
										 butSelect.value());
		domi.size(64,64);
		domi.position(width*0.5-bw-64, height+pad+bh*3);
	}
	
	function findImage(_file){
		// Looks like not using tsa anymore...
		// Used to be first parameter, see below.
		let tsa = loadImage(_file.data);
		
		// Just wants a string as first parameter, huh?
		let domi = 
				createImg(_file.name, _file.name);
		domi.size(64,64);
		domi.position(222,height);
		
		// Oh! So we can just save the names
		// of all the textures found/loaded this
		// way, and load them up again from their
		// names, just as I'm doing with plats.img and
		// plats.imgName.
		// All we need is this: _file.name :)
		imgArray.push(_file.name);
		butSelect.option(_file.name);
		butSelect.selected(_file.name);
		selectTexture();
		//console.log('You loaded ' + _file.name);
	}
	
}
