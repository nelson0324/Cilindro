
var container, stats;
var camera, controls, scene, renderer;
var cube, plane;
var cilindroGausiano;
var radioCylindro;
var radioCylindroGausiano;
var alturaCylindroGausiano;
var geometriesParams;
var geometryIndex = 0;
var loader;
var materials = [];

var createSomething = function( klass, args ) {

	var F = function( klass, args ) {

		return klass.apply( this, args );

	};

	F.prototype = klass.prototype;

	return new F( klass, args );

};

// Create new object by parameters

function setVars(radio,radioG,alturaG){

	alert(radio);
	var geometriesParams=[];
	radioCylindro=radio;
	radioGauss=radioG;
	alturaGauss=alturaG;
	if(	document.getElementById("contenedor")){
		var el=document.getElementById("contenedor");
		el.parentNode.removeChild( el );
	}
	crearGrafico();

	init();
	animate();
	addStuff();
}

function crearGrafico(){


	for ( var i = 0; i < 6; i ++ ) {

		materials.push( [ new THREE.MeshBasicMaterial( { color: Math.random() * 0xffffff, wireframe: false } ) ] );

	}


	/*		CylinderGeometry(radiusTop, radiusBottom, height, radiusSegments, heightSegments, openEnded, thetaStart, thetaLength)

	radiusTop — Radius of the cylinder at the top. Default is 20.
	radiusBottom — Radius of the cylinder at the bottom. Default is 20.
	height — Height of the cylinder. Default is 100.
	radiusSegments — Number of segmented faces around the circumference of the cylinder. Default is 8
	heightSegments — Number of rows of faces along the height of the cylinder. Default is 1.
	openEnded — A Boolean indicating whether the ends of the cylinder are open or capped. Default is false, meaning capped.
	thetaStart — Start angle for first segment, default = 0 (three o'clock position).
	thetaLength — The central angle, often called theta, of the circular sector. The default is 2*Pi, which makes for a complete cylinder

	*/
	geometriesParams = [
		{ type: 'CylinderGeometry', args: [ radioCylindro, radioCylindro, 100, 8, 20 ]} ,

	];


	cilindroGausiano = new THREE.CylinderGeometry(radioCylindroGausiano, radioCylindroGausiano, alturaCylindroGausiano, 8, false);
		//alert(cilindroGausiano);

	alert(radioCylindro);

	loader = new THREE.FontLoader();
	loader.load( 'fonts/helvetiker_regular.typeface.js', function ( font ) {

		geometriesParams[ 12 ].args[ 1 ].font = font;

	} );

	var info;
	// start scene
	//	init();



}

function nextGeometry() {

	geometryIndex ++;

	if ( geometryIndex > geometriesParams.length - 1 ) {

		geometryIndex = 0;

	}

	addStuff();

}

function switchGeometry(i) {

	geometryIndex = i;

	addStuff();
}



function addStuff() {

	if ( window.group !== undefined ) {

		scene.remove( group );

	}

	var params = geometriesParams[ geometryIndex ];

	geometry = createSomething( THREE[ params.type ], params.args );

	// scale geometry to a uniform size
	geometry.computeBoundingSphere();

/*	var scaleFactor = 160 / geometry.boundingSphere.radius;
	geometry.scale( scaleFactor, scaleFactor, scaleFactor );*/

	var originalGeometry = geometry.clone();
	originalGeometry.computeFaceNormals();
	originalGeometry.computeVertexNormals( true );

	// in case of duplicated vertices
	geometry.mergeVertices();
	geometry.computeFaceNormals();
	geometry.computeVertexNormals( true );

//	updateInfo();

	var faceABCD = "abcd";
	var color, f, p, n, vertexIndex;

	for ( i = 0; i < geometry.faces.length; i +=8) {

		f  = geometry.faces[ i ];

		n = ( f instanceof THREE.Face3 ) ? 3 : 4;

		for( var j = 0; j < n; j+=20 ) {

			vertexIndex = f[ faceABCD.charAt( j ) ];

			p = geometry.vertices[ vertexIndex ];

			color = new THREE.Color( 0xffffff );
			color.setHSL( ( p.y ) / 400 + 0.5, 1.0, 0.5 );

			f.vertexColors[ j ] = color;

		}

	}

	group = new THREE.Group();
	scene.add( group );
//	getVars();
	var cylindermaterial = new THREE.MeshLambertMaterial({wireframe: true, color: 0x000000});


	var cylinder2 = new THREE.Mesh(cilindroGausiano, cylindermaterial);

//	var mesh = new THREE.MeshPhongMaterial( { color: 0x000000, specular: 0x666666, emissive: 0xff0000, shininess: 10, shading: THREE.SmoothShading, opacity: 0.9, transparent: true } );
//		var mesh = new THREE.MeshStandardMaterial( { map: imgTexture, bumpMap: imgTexture, bumpScale: bumpScale, color: diffuseColor, metalness: metalness, roughness: roughness, shading: THREE.SmoothShading, envMap: localReflectionCube } )

//trasparente
var mesh = new THREE.Mesh( geometry, new THREE.MeshBasicMaterial( { color: 0xfefefe, wireframe: true, opacity: 0.5 } ) );
	group.add( mesh );
group.add( cylinder2 );

	var fvNames = [ 'a', 'b', 'c', 'd' ];

	var normalLength = 30;

	for( var f = 0, fl = geometry.faces.length; f < fl; f +=30 ) {
		var face = geometry.faces[ f ];

		var centroid = new THREE.Vector3()
			.add( geometry.vertices[ face.a ] )
			.add( geometry.vertices[ face.b ] )
			.add( geometry.vertices[ face.c ] )
			.divideScalar( 3 );

		var arrow = new THREE.ArrowHelper(
				face.normal,
				centroid,
				normalLength,
				0x3333FF );
		mesh.add( arrow );
	}

	for( var f = 0, fl = originalGeometry.faces.length; f < fl; f ++ ) {
		var face = originalGeometry.faces[ f ];
		if( face.vertexNormals === undefined ) {
			continue;
		}
		for( var v = 0, vl = face.vertexNormals.length; v < vl; v ++ ) {
			var arrow = new THREE.ArrowHelper(
					face.vertexNormals[ v ],
					originalGeometry.vertices[ face[ fvNames[ v ] ] ],
					normalLength,
					0xFF3333 );
			mesh.add( arrow );
		}
	}

	for( var f = 0, fl = mesh.geometry.faces.length; f < fl; f ++ ) {
		var face = mesh.geometry.faces[ f ];
		if( face.vertexNormals === undefined ) {
			continue;
		}
		for( var v = 0, vl = face.vertexNormals.length; v < vl; v ++ ) {
			var arrow = new THREE.ArrowHelper(
					face.vertexNormals[ v ],
					mesh.geometry.vertices[ face[ fvNames[ v ] ] ],
					normalLength,
					0x000000 );
			mesh.add( arrow );
		}
	}

}
			function init(radiusTop) {


				container = document.createElement( 'div' );
				container.id="contenedor";
				//container.style.float = 'left';
				document.body.appendChild( container );
				/*
				info = document.getElementById( 'grafico' );
				info.style.position = 'relative';
				info.style.top = '10px';
				info.style.width = '50%';
				info.style.textAlign = 'center';
				info.innerHTML = 'Drag to spin the geometry ';
				container.appendChild( info );*/
				info = document.createElement( 'div' );
				info.style.float = 'left';
				info.style.position = 'relative';
				info.style.top = '10px';
				info.style.width = '100%';
				info.style.textAlign = 'center';
				//info.innerHTML = 'Drag to spin the geometry ';
				container.appendChild( info );

				camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 1, 1000 );
				camera.position.z = 100;

				scene = new THREE.Scene();

				var light = new THREE.PointLight( 0xffffff, 1.5 );
				light.position.set( 1000, 1000, 2000 );
				scene.add( light );

				addStuff();

				renderer = new THREE.WebGLRenderer( { antialias: true } ); // WebGLRenderer CanvasRenderer
				renderer.setClearColor( 0xf0f0f0 );
				renderer.setPixelRatio( window.devicePixelRatio );
				renderer.setSize( window.innerWidth, window.innerHeight );
				container.appendChild( renderer.domElement );

				stats = new Stats();
				stats.domElement.style.position = 'absolute';
				stats.domElement.style.top = '0px';
				container.appendChild( stats.domElement );

				//

				controls = new THREE.OrbitControls( camera, renderer.domElement );

				window.addEventListener( 'resize', onWindowResize, false );

			}

			function onWindowResize() {

				camera.aspect = window.innerWidth / window.innerHeight;
				camera.updateProjectionMatrix();

				renderer.setSize( window.innerWidth, window.innerHeight );

			}

			//

			function animate() {

				requestAnimationFrame( animate );

				controls.update();

				render();
				stats.update();

			}

			function render() {

				renderer.render( scene, camera );

			}

			function createMesh(geom) {

            // assign two materials
            var meshMaterial = new THREE.MeshNormalMaterial();
            meshMaterial.side = THREE.DoubleSide;
            var wireFrameMat = new THREE.MeshBasicMaterial();
            wireFrameMat.wireframe = true;

            // create a multimaterial
            var mesh = THREE.SceneUtils.createMultiMaterialObject(geom, [meshMaterial, wireFrameMat]);

            return mesh;
        }
