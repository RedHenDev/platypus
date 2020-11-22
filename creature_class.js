class Creature extends Subject{
   constructor(_x, _y){
     // Super used to call parent class's
     // constructor. Must be used before
     // .this keyword used for new variables.
     super(_x, _y);
		 // Original positions.
		 // Logic for this found in resetLevel().
		 //this.op = createVector(_x,_y);
     this.name = 'creature';
     this.w = 160;
     this.h = 84;
     this.calcForCollisions();
     
		 // For image flipping on y axis.
		 // Right = 1. Left = -1.
		 // Used in calculations when rendering.
		 // Changed with controls in update().
		 this.flip = -1;
		 // Let's determine a default  
		 // image for subjects.
		 this.imgName = 'unicorn.gif';
		 //this.useImg = true;
		 
     // Euler physics properties.
     //this.vel = createVector(0,0);
     //this.acc = createVector(0,0);
     // Gravity direction and force.
     //this.gDir = createVector(0,0.1);
   }
  
  // Gravity...and collisions?
  // Well yes -- our platforms are
  // our main obj with which sprites
  // can interact physically. That is,
  // platforms should be the key
  // building block of collisions and
  // terrain.
	// SelfIndex used for collisions.
  update(selfIndex){
    
    // I'm just hard coding in plats array.
    // But we could pass in an array parameter
    // in future?
    // This checks collisions.
    // Four corners of subject/other obj.
    // False means not inside object.
    let tr = false;
    let tl = false;
    let br = false; 
    let bl = false;
		let otr = false;
    let otl = false;
    let obr = false; 
    let obl = false;
		let trx = false;
    let tlx = false;
    let brx = false; 
    let blx = false;
		let otrx = false;
    let otlx = false;
    let obrx = false; 
    let oblx = false;
		
		let useGrav = true;
    for (let i = 0; i < plats.length; i++){
      // Don't check against self...
			// (i===selfIndex) // Faster, surely.
      if (i===selfIndex) 
				continue;
			// Don't check against non-physical objects.
			if (plats[i].name==='decoration')
				continue;
	
			// ^^^ NEW COLLISION SYSTEM ^^^
			
			// Check that subject has shorter width.
			if (this.w <= plats[i].w){
				// So, now see whether one of subject's
				// corners is in body of other obj.
				// This is for vertical (y) collision.
				tl = plats[i].hoverCheck(
        this.p.x - this.wh,
        this.p.y - this.hh, 1);
      	tr = plats[i].hoverCheck(
        this.p.x + this.wh,
        this.p.y - this.hh, 1);
      	bl = plats[i].hoverCheck(
        this.p.x - this.wh,
        this.p.y + this.hh, 1);
      	br = plats[i].hoverCheck(
        this.p.x + this.wh,
        this.p.y + this.hh, 1);
				// Break - no more checks, vertical
				// collision takes precedence.
				//if (tl || tr || bl || br) break;
			} else {
				// Other object thinner.
				otl = this.hoverCheck(
        plats[i].p.x - plats[i].wh,
        plats[i].p.y - plats[i].hh, 1);
      	otr = this.hoverCheck(
        plats[i].p.x + plats[i].wh,
        plats[i].p.y - plats[i].hh, 1);
      	obl = this.hoverCheck(
        plats[i].p.x - plats[i].wh,
        plats[i].p.y + plats[i].hh, 1);
      	obr = this.hoverCheck(
        plats[i].p.x + plats[i].wh,
        plats[i].p.y + plats[i].hh, 1);
				// Break - no more checks, vertical
				// collision takes precedence.
				//if (otl || otr || obl || obr) break;
			}
			// Check that subject has shorter height.
			if (this.h <= plats[i].h){
				// So, now see whether one of subject's
				// corners is in body of other obj.
				// This is for horizontal (x) collision.
				// Take 0.90 off height to avoid x friction
				// when on top of an obj.
				tlx = plats[i].hoverCheck(
        this.p.x - this.wh,
        this.p.y - this.hh*0.70, 1);
      	trx = plats[i].hoverCheck(
        this.p.x + this.wh,
        this.p.y - this.hh*0.70, 1);
      	blx = plats[i].hoverCheck(
        this.p.x - this.wh,
        this.p.y + this.hh*0.70, 1);
      	brx = plats[i].hoverCheck(
        this.p.x + this.wh,
        this.p.y + this.hh*0.70, 1);
			} else {
				// Other object flatter.
				// So, see if one of obj's corners in
				// subject's body.
				otlx = this.hoverCheck(
        plats[i].p.x - plats[i].wh,
        plats[i].p.y - plats[i].hh*0.70, 1);
      	otrx = this.hoverCheck(
        plats[i].p.x + plats[i].wh,
        plats[i].p.y - plats[i].hh*0.70, 1);
      	oblx = this.hoverCheck(
        plats[i].p.x - plats[i].wh,
        plats[i].p.y + plats[i].hh*0.70, 1);
      	obrx = this.hoverCheck(
        plats[i].p.x + plats[i].wh,
        plats[i].p.y + plats[i].hh*0.70, 1);
			}
			
			// ^^^ EOF - NEW COLLISION SYSTEM ^^^
			
			// Now collision consequences...
			// Bottom of subject in body of plat.
    // So, zero out velocity and add
    // upward force.
    if (bl || br || otl || otr) {
      // Bounce force is a third of current
      // velocity.y, and gravity off.
      let dir = createVector(0,
                this.vel.y*
                -0.5);
      this.p.y -= this.vel.y; // Extract upward.
      //this.vel.y = 0;
      this.acc.add(dir);
      // Switch off gravity this update -
			// cheap way to know we are grounded.
      useGrav = false;
    }
    // Top of subject in plat.
    // So, zero out velocity and add
    // downward force.
    if (tl || tr || obl || obr) {
      let dir = createVector(0,1);
      //this.vel.mult(0);
      this.acc.add(dir);
			//console.log("hit from under");
    }
		
		// Collide from left into object.
		if (
				(trx || brx || otlx || oblx)) {
      let dir = createVector(-1,0);
			this.vel.x = -1;
      this.acc.add(dir);
			//console.log("hit from left");
    }
		// Collide from right into object.
		if (tlx || blx || otrx || obrx) {
      let dir = createVector(1,0);
			this.vel.x = 1;
      this.acc.add(dir);
			//console.log("hit from right");
    }
			
			
			
			
    }
    
    // Collision consequences used to be here...
    
    // Gravity.
    // Switched off if grounded.
    if (useGrav)
      this.acc.add(this.gDir);
    
    // Here's where we might place
		// locomotion ai.
		
		// Every 300 frames flip direction of
		// creature and add force in that direction.
		// OMG this works beautifully!
		if (frameCount % 100 === 0){
			this.flip *= -1;
			this.acc.x += 5 * this.flip;
		}
    
    
    // Here is the Euler physics system.
    this.vel.add(this.acc);
    this.p.add(this.vel);
    this.acc.mult(0);
    // Friction.
    let tempY = this.vel.y;
    this.vel.mult(0.96);
    this.vel.y = tempY;  // Do not affect y.
  }
   
	render(){
		if (!playmode || !this.useImg){
    push();
			// Highlighted.
      if (this.mouseOver &&
         !this.selected) {
        fill(0,222,0,42);
        strokeWeight(3);
        stroke(200,0,200);
        
      } else if(this.selected){
        fill(0,222,0,42);
        strokeWeight(3);
        stroke(0,200,0);
        
      } else{
        // Natural appearance.
        fill(0,222,0,42);
        strokeWeight(1);
        stroke(42);
        
      }
      translate(this.p.x, this.p.y);
      rect(0,0, this.w, this.h);
    pop();
  	} // End of edit mode in render.
		// Image render.
		if (this.useImg){
		push();
     	//console.log('Trying to render img...');
      translate(this.p.x-(this.wh*this.flip), 
								this.p.y-this.hh);
     
			scale(this.flip,1);
			//images[0].delay(200);	// Speed of gif.
   		image(this.img,
						0,
						0,
						this.w,
						this.h);
				
     pop();
		 } // End of is using image.
	} // End of render.
	
} // End of creature class.
