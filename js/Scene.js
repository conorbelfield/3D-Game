"use strict";
let Scene = function(gl) {
  gl.enable(gl.DEPTH_TEST);
  this.vsIdle = new Shader(gl, gl.VERTEX_SHADER, "idle_vs.essl");
  this.fsSolid = new Shader(gl, gl.FRAGMENT_SHADER, "solid_fs.essl");
  this.solidProgram = new Program(gl, this.vsIdle, this.fsSolid);



  this.material = new Material(gl, this.solidProgram);
  this.material.time.set(0);
  this.heartMaterial = new Material(gl, this.solidProgram);
  this.heartMaterial.time.set(0);
  this.material.solidColor.set(1, 1, 1);
  this.heartMaterial.solidColor.set(1,1,1);
  this.triangleGeometry = new TriangleGeometry(gl);
  this.squareGeometry = new SquareGeometry(gl);
  this.starGeometry = new StarGeometry(gl);
  this.heartGeometry = new HeartGeometry(gl);
  this.circleGeometry = new CircleGeometry(gl);

  this.texture2D = new Texture2D(gl, "js/img/asteroid.png");


  this.vsTextured = new Shader(gl, gl.VERTEX_SHADER, "textured_vs.essl");
  this.fsTextured = new Shader(gl, gl.FRAGMENT_SHADER, "textured_fs.essl");
  this.texturedProgram = new TexturedProgram(gl, this.vsTextured, this.fsTextured);


  this.threeDvs = new Shader(gl, gl.VERTEX_SHADER, "3d_vs.essl");
  this.threeDfs = new Shader(gl, gl.FRAGMENT_SHADER, "3d_fs.essl")
  this.threeDProgram = new TexturedProgram(gl, this.threeDvs, this.threeDfs);

  this.textureMaterial = new Material(gl, this.texturedProgram);
  this.textureMaterial.colorTexture.set(this.texture2D);


  this.spMat1 = new Material(gl,this.threeDProgram);
  this.spText1 = new Texture2D(gl, "js/slowpoke/YadonDh.png")
  this.spMat1.colorTexture.set(this.spText1);

  this.spMat2 = new Material(gl,this.threeDProgram);
  this.spText2 = new Texture2D(gl, "js/slowpoke/YadonEyeDh.png")
  this.spMat2.colorTexture.set(this.spText2);
  this.grid = new Array();

  this.texturedQuadGeometry = new TexturedQuadGeometry(gl);
  this.avatar = new GameObject(new MultiMesh(gl, "js/slowpoke/Slowpoke.json", [this.spMat1, this.spMat2]));
  this.avatar.scale.mul(.08,.08,.08);


  

  this.camera = new OrthoCamera();
  this.perspectiveCamera = new PerspectiveCamera();



  this.dx = 1;
  this.scaleVector = new Vec2(1, 1, 0);
  this.scaleChange = .05;
  this.rotateVal = 0;
  this.rotateChange = .05;
  this.timeAtLastFrame = new Date().getTime();
  this.drawBoard();
  this.gl = gl;



};



Scene.prototype.drawBoard = function(gl) {


      this.avatar.position.set(diffVector);

}




Scene.prototype.update = function(gl, keysPressed) {
  //jshint bitwise:false
  //jshint unused:false
  let timeAtThisFrame = new Date().getTime();
  let dt = (timeAtThisFrame - this.timeAtLastFrame) / 1000.0;
  this.timeAtLastFrame = timeAtThisFrame;
  //this.trianglePosition.x = ((1 + .1  * dt + this.trianglePosition.x) % 2) -1;

  // clear the screen
  gl.clearColor(0, .8, 0.8, 1.0);
  gl.clearDepth(1.0);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);


  // //remove(this, true); 

  // for (var i = 0; i < 10; i ++) {
  //   for (var j = 0; j < 10; j++) {
  //     if (this.grid[i][j].removing) {
  //       if (this.grid[i][j].remCounter > 80)
  //         this.grid[i][j] = null
  //       else {
  //         this.grid[i][j].remCounter++;
  //         this.grid[i][j].orientation+=(3*dt);
  //         this.grid[i][j].scale.mul(.985);
  //       }
  //     }
  //   }
  // }

  // refill(this);

  this.heartMaterial.time.add(2*dt);

  for (var i = 0; i < 10; i ++) {
    for (var j = 0; j < 10; j++) {
      if (this.grid[i][j].id == "heart")
        this.grid[i][j].orientation += (dt);
      this.grid[i][j].draw(this.perspectiveCamera);
    }
  }

  // if (keysPressed["I"]) {
  //   this.perspectiveCamera.rotation -= dt;
  //   this.perspectiveCamera.updateViewProjMatrix();
  //   console.log("hi")
  // }
  // if (keysPressed["O"]) {
  //   this.perspectiveCamera.rotation += dt;
  //   this.perspectiveCamera.updateViewProjMatrix();
  // }
  // if(keysPressed["P"]) {
  //   this.perspectiveCamera.rotation += Math.sin(timeAtThisFrame/10)/100;
  //   this.quakeRemove();
  //   this.perspectiveCamera.updateViewProjMatrix();
  // }
  if (keysPressed["W"])
    console.log("hey")
  this.perspectiveCamera.move(dt, keysPressed);



};


