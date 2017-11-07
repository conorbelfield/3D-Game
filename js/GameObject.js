"use strict"; 
let GameObject = function(mesh) { 
  this.mesh = mesh;

  this.position = new Vec3(0, 0, 0); 
  this.yaw = 0; 
  this.pitch = 0;
  this.front = Math.PI;
  this.scale = new Vec3(1, 1, 1); 

  this.velocity = new Vec3(0,0,0);
  this.id = "";
  this.offset = new Vec3(0,0,0);
  this.ahead = new Vec3(0.0, 0.0, -1.0); 
  this.up = new Vec3(0.0, 1.0, 0.0);

  this.parent = null;
  this.isFloor = false;
  this.horizontal = new Vec3(1,0,0);
  this.up = new Vec3(0, 1, 0);

  this.speed = 10;

  this.modelMatrix = new Mat4(); 
};

GameObject.prototype.updateModelMatrix =
                              function(){ 
	this.modelMatrix.set().scale(this.scale).rotate(this.yaw + this.front, this.up).rotate(this.pitch, 
    this.horizontal).translate(this.position);

  if (this.parent) {
    this.modelMatrix.rotate(this.parent.yaw, this.parent.up)
   .rotate(this.parent.pitch, this.parent.horizontal).translate(this.parent.position);
  }
  // if(this.id.equals("wheel"))
  //   this.modelMatrix.rotate(this.yaw, this.horizontal);
  // 

};

GameObject.prototype.move = function(dt) {
  
  this.updateOrientation();
  this.position.addScaled(this.speed * dt, this.velocity);

};

GameObject.prototype.updateOrientation = function() {
  this.ahead = new Vec3(
   -Math.sin(this.yaw)*Math.cos(this.pitch),
   Math.sin(this.pitch),
   -Math.cos(this.yaw)*Math.cos(this.pitch)); 
  this.ahead.normalize();
  this.horizontal.setVectorProduct(
    this.ahead,
    this.up); 
  this.horizontal.normalize();
}

GameObject.prototype.draw = function(camera){ 
  this.updateModelMatrix();
    
  this.mesh.setUniform("modelMatrix", this.modelMatrix);
  this.mesh.setUniform("modelMatrixInverse", new Mat4(this.modelMatrix).invert());
  this.mesh.setUniform("modelViewProjMatrix", this.modelMatrix.mul(camera.viewProjMatrix));
  // this.mesh.material.modelViewProjMatrix.set(this.modelMatrix.mul(camera.viewProjMatrix));
  this.mesh.draw(); 
};
