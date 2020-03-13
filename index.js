let scene = new THREE.Scene();
let camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

let renderer = new THREE.WebGLRenderer({
    alpha: true
});
renderer.setClearColor(0x000000, 0);
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

let controls = new THREE.OrbitControls(camera, renderer.domElement)

let ambientLight = new THREE.AmbientLight( 0xcccccc, 0.4 );
scene.add( ambientLight );

camera.position.z = 2;
scene.add( camera );

function getHeightData(img, width, height, scale = 1) {
     
       let canvas = document.createElement( 'canvas' );
       let size = width * height;

       canvas.width = width;
       canvas.height = height;
       let context = canvas.getContext( '2d' );

       let data = new Float32Array( size );
    
       context.drawImage(img,0,0);
    
       for ( let i = 0; i < size; i ++ ) {
           data[i] = 0
       }
    
       let imgd = context.getImageData(0, 0, width, height);
       let pix = imgd.data;
    
       let j=0;
       for (let i = 0; i<pix.length; i +=4) {
           let all = pix[i]+pix[i+1]+pix[i+2];
           data[j++] = all/(12*scale)/100;
       }
        
       return data;
   }
let img = new Image();
// load img source
img.src = "plateau.jpg";
img.onload = function () {
    let width = img.width;
    let height = img.height
  
    //get height data from img
    let data = getHeightData(img, width, height);
  
    // plane
    let geometry = new THREE.PlaneGeometry(3,3, width-1, height-1);
    let texture = new THREE.TextureLoader().load( 'grasstile.jpg' );
    let material = new THREE.MeshBasicMaterial( { map: texture } );
    plane = new THREE.Mesh( geometry, material );
     
    //set height of vertices
    for ( let i = 0; i<plane.geometry.vertices.length; i++ ) {
         plane.geometry.vertices[i].z = data[i] || 0;
    }
    //geometry.vertices.length == data.lenght !!!!!!!!!!
    console.log(geometry.vertices)
    console.log(data)

    plane.rotation.x = THREE.Math.degToRad( 290 );
    scene.add(plane);
   
};


let animate = function () {
    controls.update()
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
};

animate();