
			var container, stats;
			var camera, controls, scene, renderer;
			var cube, plane;
			var cylindergeometry2;

			// Create new object by parameters

			var createSomething = function( klass, args ) {

				var F = function( klass, args ) {

					return klass.apply( this, args );

				};

				F.prototype = klass.prototype;

				return new F( klass, args );

			};


			// Cube

			var materials = [];

			for ( var i = 0; i < 6; i ++ ) {

				materials.push( [ new THREE.MeshBasicMaterial( { color: Math.random() * 0xffffff, wireframe: false } ) ] );

			}

			var geometriesParams = [


				{ type: 'CylinderGeometry', args: [ 20, 20, 200, 8, 35 ]} ,

			];

			var loader = new THREE.FontLoader();
			loader.load( 'fonts/helvetiker_regular.typeface.js', function ( font ) {

				geometriesParams[ 12 ].args[ 1 ].font = font;

			} );

			var info;
			var geometryIndex = 0;

			// start scene

		//	init();
		animate();

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

			function updateInfo() {

				var params = geometriesParams[ geometryIndex ];

				var dropdown = '<select id="dropdown" onchange="switchGeometry(this.value)">';

				for (  i = 0; i < geometriesParams.length; i ++ ) {
					dropdown += '<option value="' + i + '"';

					dropdown += (geometryIndex == i)  ? ' selected' : '';

					dropdown += '>' + geometriesParams[i].type + '</option>';
				}

				dropdown += '</select>';

				var text =
					'Drag to spin THREE.' + params.type +
				 	'<br>' +
					'<br>Geometry: ' + dropdown + ' <a href="#" onclick="nextGeometry();return false;">next</a>';

				text +=
					'<br><br><font color="3333FF">Blue Arrows: Face Normals</font>' +
					'<br><font color="FF3333">Red Arrows: Vertex Normals before Geometry.mergeVertices</font>' +
					'<br>Black Arrows: Vertex Normals after Geometry.mergeVertices';

				info.innerHTML = text;

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

				updateInfo();

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
				getVars();
        var cylindermaterial = new THREE.MeshLambertMaterial({wireframe: true, color: 0x000000});


        var cylinder2 = new THREE.Mesh(cylindergeometry2, cylindermaterial);

		//	var mesh = new THREE.MeshPhongMaterial( { color: 0x000000, specular: 0x666666, emissive: 0xff0000, shininess: 10, shading: THREE.SmoothShading, opacity: 0.9, transparent: true } );
	//		var mesh = new THREE.MeshStandardMaterial( { map: imgTexture, bumpMap: imgTexture, bumpScale: bumpScale, color: diffuseColor, metalness: metalness, roughness: roughness, shading: THREE.SmoothShading, envMap: localReflectionCube } )

		//trasparente
			var mesh = new THREE.Mesh( geometry, new THREE.MeshBasicMaterial( { color: 0xfefefe, wireframe: true, opacity: 0.5 } ) );
				group.add( mesh );
			//	group.add( cylinder2 );

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

			function init() {

				container = document.createElement( 'div' );
				document.body.appendChild( container );

				info = document.getElementById( 'grafico' );
				info.style.position = 'relative';
				info.style.top = '10px';
				info.style.width = '50%';
				info.style.textAlign = 'center';
				info.innerHTML = 'Drag to spin the geometry ';
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

			function getVars(){
				cylindergeometry2 = new THREE.CylinderGeometry(40, 40, 200, 150, false);
				//alert(cylindergeometry2);
			}