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

  for (var i = 0; i < 10; i++) {
    this.toAdd = new Array();
    for (var j = 0; j < 10; j++) {
      var choice = Math.random()*6;
      // if (choice < 1) {
      //   this.toAdd.push(new GameObject(new Mesh(this.starGeometry, this.material)));
      //   this.toAdd[j].id = "star";
      // }
      // else if (choice < 2) {
      //   this.toAdd.push(new GameObject(new Mesh(this.triangleGeometry, this.material)));
      //   this.toAdd[j].id = "triangle";
      // }
      // else if (choice < 3) {
      //   this.toAdd.push(new GameObject(new Mesh(this.squareGeometry, this.material)));
      //   this.toAdd[j].id = "square";
      // }
      // else if (choice < 4) {
      //   this.toAdd.push(new GameObject(new Mesh(this.texturedQuadGeometry, this.textureMaterial)));
      //   this.toAdd[j].id = "asteroid";
      // }
      // else if (choice < 5) {
      //   this.toAdd.push(new GameObject(new Mesh(this.circleGeometry, this.material)));
      //   this.toAdd[j].id = "circle";
      // }
      if (choice < 6) {
        this.toAdd.push(new GameObject(new MultiMesh(gl, "js/slowpoke/Slowpoke.json", [this.spMat1, this.spMat2])));
        this.toAdd[j].scale.mul(.08,.08,.08);
        this.toAdd[j].id = "slowpoke";
      }
      // else {
      //   this.toAdd.push(new GameObject(new Mesh(this.heartGeometry, this.heartMaterial)));
      //   this.toAdd[j].id = "heart";
      // }

    }
    this.grid.push(this.toAdd);
  }

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

   // while (remove(this, false)) {
   //   refill(this);
   // }


};

function remove(theScene, justFind) {
  var xToRem = [];
  var yToRem = [];
  for (var i = 0; i < 10; i ++) {
    for (var j = 0; j < 10; j++) {
      var id = theScene.grid[i][j].id;
      var counter = 1;
      var offset = 1;
      while (i + offset < 10) {
        if (id === theScene.grid[i+offset][j].id) {
          counter ++;
          offset++;
        }
        else
          break;
      }
      
      if (counter >= 3) {
        xToRem.push(i);
        yToRem.push(j);
        for (var k = 1; k < counter; k ++) {
          xToRem.push(i + k);
          yToRem.push(j);
        }
      }

      counter = 1;
      offset = 1;

      while (j + offset < 10) {
        if (id === theScene.grid[i][j+offset].id) {
          counter ++;
          offset++;
        }
        else
          break;
      }
      
      if (counter >= 3) {
        xToRem.push(i);
        yToRem.push(j);
        for (var k = 1; k < counter; k ++) {
          xToRem.push(i);
          yToRem.push(j + k);
        }
      }

     }
  }


   // remove or start shrinking process

  for (var i = 0; i < xToRem.length; i ++) {
    if (justFind) {
      theScene.grid[xToRem[i]][yToRem[i]].removing = true;
    }
    else
      theScene.grid[xToRem[i]][yToRem[i]] = null;
  }




  if (xToRem.length == 0)
    return false;
  return true;
  //false if no deletions, true if deletions
}


function refill(theScene) {
  var numToDrop = [];

  for (var i = 0; i < 10; i ++) {
    var arr = [];
    numToDrop.push(arr)
  }
  for (var i = 0; i < 10; i ++) {
    for (var j = 0; j < 10; j ++) {
      numToDrop[i][j] = 0;
    }
  }
  //calc how far the drop is
  for (var i = 0; i < 10; i++) {
    var thisCol = [];
    for (var j = 0; j < 10; j++) {
      for (var k = j - 1; k >= 0; k--) {
        if (theScene.grid[i][k] == null) {
          numToDrop[i][j]++;
          
        }
      }
    }
  }

  // drop them

  for (var i = 0; i < 10; i ++) {
    for (var j = 1; j < 10; j ++) {
      if (numToDrop[i][j] != 0) {
        theScene.grid[i][j - numToDrop[i][j]] = theScene.grid[i][j];
        theScene.grid[i][j] = null;

        var diffVector = new Vec3(-1+(i * .2) ,-1+ (j - numToDrop[i][j])* .2, 0);
        if (theScene.grid[i][j - numToDrop[i][j]] != null)
          theScene.grid[i][j - numToDrop[i][j]].position.set(diffVector);
      }
    }
  }





  for (var i = 0; i < 10; i ++) {
    for (var j = 0; j < 10; j ++) {
      if (theScene.grid[i][j] == null) {
        var choice = Math.random()*5;
        // if (choice < 1) {
        //   theScene.grid[i][j] = new GameObject(new Mesh(theScene.starGeometry, theScene.material));
        //   theScene.grid[i][j].id = "star";
        // }
        // else if (choice < 2) {
        //   theScene.grid[i][j] = new GameObject(new Mesh(theScene.triangleGeometry, theScene.material));
        //   theScene.grid[i][j].id = "triangle";
        // }
        // else if (choice < 3) {
        //   theScene.grid[i][j] = new GameObject(new Mesh(theScene.squareGeometry, theScene.material));
        //   theScene.grid[i][j].id = "square";
        // }
        // else if (choice < 4) {
        //   theScene.grid[i][j] = new GameObject(new Mesh(theScene.circleGeometry, theScene.material));
        //   theScene.grid[i][j].id = "circle";
        // }
         if (choice < 5) {
          theScene.grid[i][j] = new GameObject(new MultiMesh(theScene.gl, "js/slowpoke/Slowpoke.json", [theScene.spMat1, theScene.spMat2]));
          theScene.grid[i][j].scale.mul(.08,.08,.08);
          theScene.grid[i][j].id = "slowpoke";
      }
        // else {
        //   theScene.grid[i][j] = new GameObject(new Mesh(theScene.heartGeometry, theScene.heartMaterial));
        //   theScene.grid[i][j].id = "heart";
        // }

        var diffVector = new Vec3(-1+(i * .2) ,-1+ j * .2, 0);
        theScene.grid[i][j].position.set(diffVector);

      }
    }
  }


}

Scene.prototype.drawBoard = function(gl) {

  for (var i = 0; i < 10; i ++) {
    for (var j = 0; j < 10; j++) {
      var diffVector = new Vec3(-1+(i * .2) ,-1+ j * .2, 0);
      this.grid[i][j].position.set(diffVector);
    }
  } 
}

Scene.prototype.quakeRemove = function(gl) {
  for (var i = 0; i < 10; i ++) {
    for (var j = 0; j < 10; j++) {
      if (Math.random()*10 < .1)
        this.grid[i][j].removing = true;
    }
  }
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


