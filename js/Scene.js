"use strict";
let Scene = function(gl) {
  gl.enable(gl.DEPTH_TEST);
  this.vsIdle = new Shader(gl, gl.VERTEX_SHADER, "idle_vs.essl");
  this.fsSolid = new Shader(gl, gl.FRAGMENT_SHADER, "solid_fs.essl");
  this.solidProgram = new Program(gl, this.vsIdle, this.fsSolid);



  this.vsTextured = new Shader(gl, gl.VERTEX_SHADER, "textured_vs.essl");
  this.fsTextured = new Shader(gl, gl.FRAGMENT_SHADER, "textured_fs.essl");
  this.texturedProgram = new TexturedProgram(gl, this.vsTextured, this.fsTextured);

  this.vsShadow = new Shader(gl, gl.VERTEX_SHADER, "shadow_vs.essl");
  this.fsShadow = new Shader(gl, gl.FRAGMENT_SHADER, "shadow_fs.essl");
  this.shadowProgram = new Program(gl, this.vsShadow, this.fsShadow);

  this.threeDvs = new Shader(gl, gl.VERTEX_SHADER, "3d_vs.essl");
  this.threeDfs = new Shader(gl, gl.FRAGMENT_SHADER, "3d_fs.essl")
  this.threeDProgram = new TexturedProgram(gl, this.threeDvs, this.threeDfs);

  this.textureMaterial = new Material(gl, this.texturedProgram);
  this.textureMaterial.colorTexture.set(this.texture2D);


  this.spMat1 = new Material(gl,this.threeDProgram);
  this.spText1 = new Texture2D(gl, "chevy/chevy.png")
  this.spMat1.colorTexture.set(this.spText1);

  this.spMat2 = new Material(gl,this.threeDProgram);
  this.spText2 = new Texture2D(gl, "grass.png")
  this.spMat2.colorTexture.set(this.spText2);

  this.avatarShadowMaterial = new Material(gl, this.shadowProgram);
  this.avatarShadowMesh = new MultiMesh(gl, "chevy/chassis.json", [this.avatarShadowMaterial]);
  this.avatarShadow = new GameObject(this.avatarShadowMesh);
  this.avatarShadow.scale = new Vec3(.5,.5,.5)
  var shadowMat = new Mat4([1, 0, 0, 0, -1, 0, -1, 0, 0, 0, 1, 0, 0, .01, 0, 1]);
  this.avatarShadow.shadowMatrix = shadowMat;
  this.avatarShadow.parent = this.avatar;
  this.avatarShadow.position = new Vec3(1,1,1);


  this.texturedQuadGeometry = new TexturedQuadGeometry(gl);
  this.avatar = new GameObject(new MultiMesh(gl, "chevy/chassis.json", [this.spMat1]));
  this.avatar.scale.set(.5,.5,.5);

  this.wheel1 = new GameObject(new MultiMesh(gl, "chevy/wheel.json", [this.spMat1]));
  this.wheel2 = new GameObject(new MultiMesh(gl, "chevy/wheel.json", [this.spMat1]));
  this.wheel3 = new GameObject(new MultiMesh(gl, "chevy/wheel.json", [this.spMat1]));
  this.wheel4 = new GameObject(new MultiMesh(gl, "chevy/wheel.json", [this.spMat1]));
  this.wheel1.scale.set(.55,.55,.55);
  this.wheel2.scale.set(.55,.55,.55);
  this.wheel3.scale.set(.55,.55,.55);
  this.wheel4.scale.set(.55,.55,.55);
  this.wheel1.position.set(3, -1, 5.7);
  this.wheel2.position.set(-3, -1, 5.7);
  this.wheel3.position.set(3, -1, -7.0);
  this.wheel4.position.set(-3, -1, -7.0);

  this.floor = new GameObject(new Mesh(this.texturedQuadGeometry, this.spMat2));
  this.floor.position = new Vec3(0, -2.5, 0)

      
  this.camera = new OrthoCamera();
  this.perspectiveCamera = new PerspectiveCamera(this.avatar);


   // LIGHT STUFF

  this.directionalLight = new Vec4(0, 1, 0, 0);
  this.headLight = new Vec4(this.avatar.position + this.avatar.ahead, 1);
  this.directionLPD = new Vec3(1000, 1000, 1000);
  this.pointLBD = new Vec3(100, 100, 100);


  this.lights = [this.directionalLight, this.headLight];
  this.LPDs = [this.directionLPD, this.pointLBD];

  Material.lightPos.at(0).set(this.lights[0]);
  Material.lightPos.at(1).set(this.lights[1]);

  Material.lightPowerDensity.at(0).set(this.LPDs[0]);
  Material.lightPowerDensity.at(1).set(this.LPDs[1]);

  Material.spotDirection.at(0).set(new Vec3(0, 1, 0));
  Material.spotDirection.at(1).set(this.avatar.ahead);

  this.gl = gl;

  this.gameObjects = [this.wheel1, this.wheel2, this.wheel3, this.wheel4];
  //this.gameObjects.push(this.avatarShadow);
  for (var i = 0; i < this.gameObjects.length; i++) {
    this.gameObjects[i].parent = this.avatar;
    this.gameObjects[i].draw(this.perspectiveCamera, this.lights, this.LPDs);
  }
  this.gameObjects.push(this.avatar);
  this.avatar.draw(this.perspectiveCamera, this.lights, this.LPDs);


};





Scene.prototype.update = function(gl, keysPressed) {
  //jshint bitwise:false
  //jshint unused:false
  let timeAtThisFrame = new Date().getTime();
  let dt = (timeAtThisFrame - this.timeAtLastFrame) / 300;
  this.timeAtLastFrame = timeAtThisFrame;

  // clear the screen
  gl.clearColor(0, .8, 0.8, 1.0);
  gl.clearDepth(1.0);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);


  this.perspectiveCamera.move(dt, keysPressed); 

  this.avatar.velocity = new Vec3(0, 0, 0);

  if (keysPressed["W"]) {
    this.avatar.velocity.add(this.avatar.ahead);
    this.avatar.move(dt);
    this.wheel1.pitch -= 10*dt;
    this.wheel2.pitch -= 10*dt;
    this.wheel3.pitch -= 10*dt;
    this.wheel4.pitch -= 10*dt;

    if (keysPressed["D"]) {
      this.avatar.velocity.add(this.avatar.horizontal);
      this.avatar.yaw-=.5*dt
    }
    if (keysPressed["A"]) {
      this.avatar.velocity.add(this.avatar.horizontal);
      this.avatar.yaw+=.5*dt
    }  
  } 
  if (keysPressed["S"]) {
    this.avatar.velocity.add(this.avatar.ahead);
    this.wheel1.pitch += 10*dt;
    this.wheel2.pitch += 10*dt;
    this.wheel3.pitch += 10*dt;
    this.wheel4.pitch += 10*dt;

    this.avatar.move(-1*dt);

    if (keysPressed["A"]) {
      this.avatar.velocity.add(this.avatar.horizontal);
      //this.avatar.move(dt);
      this.avatar.yaw-=.5*dt
    }
    if (keysPressed["D"]) {
      this.avatar.velocity.add(this.avatar.horizontal);
      //this.avatar.move(-1*dt);
      this.avatar.yaw+=.5*dt
    }  
  }
  if(keysPressed.LEFT) { 
    this.avatar.yaw += .01;
  }
  if(keysPressed.RIGHT) { 
    this.avatar.yaw -= .01;
  }
  if(keysPressed.UP) { 
    this.avatar.pitch += .01;
  }
  if(keysPressed.DOWN) { 
    this.avatar.pitch -= .01;
  }

  if(this.avatar.pitch > Math.PI/2.0) { 
    this.avatar.pitch = Math.PI/2.0; 
  } 
  if(this.avatar.pitch < -Math.PI/2.0) { 
    this.avatar.pitch = -Math.PI/2.0;
  }

  if (this.avatar.position.y < 0)
    this.avatar.position.y = 0;
  for (var i = 0; i < this.gameObjects.length; i ++) {
    this.gameObjects[i].draw(this.perspectiveCamera, this.lights, this.LPDs);

  }

  this.floor.draw(this.perspectiveCamera, this.lights, this.LPDs);


};


