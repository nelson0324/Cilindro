
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
var tamanioLiniaCE;
var radioInterno;
var valorCarga;


var createSomething = function( klass, args ) {

	var F = function( klass, args ) {

		return klass.apply( this, args );

	};

	F.prototype = klass.prototype;

	return new F( klass, args );

};

// Create new object by parameters

function setVars(radio,radioInterno,radioG,alturaG,valorCarga){

	if(radioInterno >=radio){

			alert("El radio Interno del cilindro no puede ser mayor o igual al radio externo");

			return false;
	}



	var geometriesParams=[];
	radioCylindro=radio;
	radioGauss=radioG;
	alturaCylindroGausiano=alturaG;
	radioInterno=radioInterno;
	tamanioLiniaCE=radioGauss+5;
	if(	document.getElementById("contenedor")){
		var el=document.getElementById("contenedor");
		el.parentNode.removeChild( el );
	}

	crearGrafico();
	init();
	animate();
	addStuff();
	var campoElectrico=calcular(radio,radioInterno,radioG,alturaG,valorCarga);

	dataGrafico.push([ parseInt(radioG),parseFloat(campoElectrico) ]);
//	dataGrafico.push([ parseInt(radio),parseInt(radioG) ]);
	drawChart();
	dataTablaValores.push(	[{v: parseInt(radio), f: radio}, {v: parseInt(radioInterno), f: radioInterno}, {v: parseInt(radioG), f: radioG},
		{v: parseInt(alturaG), f: alturaG},  {v: parseInt(valorCarga), f: valorCarga}, {v: parseInt(campoElectrico), f: String(campoElectrico) }]);

	drawTable();


	/*	['Jim',   {v:8000,   f: '$8,000'},  false],
	['Alice', {v: 12500, f: '$12,500'}, true],
	['Bob',   {v: 7000,  f: '$7,000'},  true]*/

}


function calcular(rc,ri,rg,l,q){

rg=parseFloat(rg);
rc=parseFloat(rc);
ri=parseFloat(ri);
l=parseFloat(l);
q=parseFloat(q);

	var epsilon=8.854187817 * Math.pow(10,-12);


	if( (ri<=rg) &&  (rg<=rc)){
	//	alert("Rg en la mitad");
		A=(Math.PI*Math.pow(rc,2))-(Math.PI*Math.pow(ri,2));
	//	A= (Math.PI*Math.pow(rg,2))-(Math.PI*Math.pow(ri,2));

	//	h2=(Math.PI*Math.pow(rc,2))-(Math.PI*Math.pow(ri,2));
		return ((q/A*l)*(Math.pow(rg,2)-Math.pow(ri,2)))/(2*epsilon*rg);
	};
	if( (rc<=rg)) {

	//	alert("Rg afuera");
	//	h=(Math.PI*Math.pow(rc,2))-(Math.PI*Math.pow(ri,2));
		A2=(Math.PI*Math.pow(rg,2))-(Math.PI*Math.pow(ri,2));
		return ((q/A2*l)*(Math.pow(rc,2)- Math.pow(ri,2)))/(2*epsilon*rg);

}
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
		{ type: 'CylinderGeometry', args: [ radioCylindro, radioCylindro, 200, 20,10,true ]} ,

	];

	cilindroGausiano = new THREE.CylinderGeometry(radioGauss, radioGauss, alturaCylindroGausiano, 20);
	cilindroInterno= new THREE.CylinderGeometry(radioInterno, radioInterno, 200, 20,10,true);
	//alert(cilindroGausiano);

//	alert(alturaCylindroGausiano);

	loader = new THREE.FontLoader();
	loader.load( 'fonts/helvetiker_regular.typeface.js', function ( font ) {

		geometriesParams[ 12 ].args[ 1 ].font = font;

	} );

	var info;
	// start scene
	//	init();



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
	getVars();

	colorSuperficieMenor=0xBCB5B2;
	colorSuperficieMenor=0x663300
	if( radioCylindro>=radioGauss){

		var cilindroMaterial = new THREE.MeshLambertMaterial( { color: 0x00b33c,  opacity: 0.5, transparent:true, emissive:0x00b33c,specular:0x00b33c } );
		var cylinderGausmaterial=new THREE.MeshPhongMaterial( { color: colorSuperficieMenor } )

	}else{

		var cylinderGausmaterial = new THREE.MeshBasicMaterial( { color: 0x663300, wireframe: true, opacity: 0.5 } );
		var cilindroMaterial=new THREE.MeshPhongMaterial( { color: 0x00b33c } )
	}

	//var cylindermaterial = new THREE.MeshPhongMaterial( { color: 0x7777ff } );

	var cylinder2 = new THREE.Mesh(cilindroGausiano, cylinderGausmaterial);
	var cylinderIn=  new THREE.Mesh(cilindroInterno, cilindroMaterial);
	//	var mesh = new THREE.MeshPhongMaterial( { color: 0x000000, specular: 0x666666, emissive: 0xff0000, shininess: 10, shading: THREE.SmoothShading, opacity: 0.9, transparent: true } );
	//		var mesh = new THREE.MeshStandardMaterial( { map: imgTexture, bumpMap: imgTexture, bumpScale: bumpScale, color: diffuseColor, metalness: metalness, roughness: roughness, shading: THREE.SmoothShading, envMap: localReflectionCube } )

	//trasparente
	//var mesh = new THREE.Mesh( geometry, new THREE.MeshBasicMaterial( { color: 0xfefefe, wireframe: true, opacity: 0.5 } ) );

	//verde
	//var mesh = new THREE.Mesh( geometry, new THREE.MeshBasicMaterial( { color: 0x93C54B, wireframe: false, opacity: 10 } ) );

	var mesh = new THREE.Mesh( geometry, cilindroMaterial );


	group.add( mesh );
	group.add( cylinderIn );
	group.add( cylinder2 );

	var fvNames = [ 'a', 'b', 'c', 'd' ];

	var normalLength = radioGauss;

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
			0x000000 );
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
					0x000000);
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

				if(document.getElementById('contenedor')){
					document.body.removeChild(document.getElementById(contenedor));
				}
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

			function getVars(){
				cylindergeometry2 = new THREE.CylinderGeometry(40, 40, 200, 150, false);
				//alert(cylindergeometry2);
			}

			function drawChart() {

				/*[  4, 7],
				[  9,2],
				[  16, 1.125],
				[  25, 0.72],*/
				var dataChart = new google.visualization.DataTable();
						dataChart.addColumn('number', 'Radio aaaa');
						dataChart.addColumn('number', 'Campo Electrico ');
						//row=[];
						//row.push(dataGrafico);
					//	alert(dataGrafico);
						dataChart.addRows(dataGrafico);

			/*	var data = google.visualization.arrayToDataTable(

					dataGrafico

				);*/

				var options = {
					title: 'Campo Electrico en Cilindro',
				//	curveType: 'function',
				curveType: 'function',
				hAxes: {
						0: {title: 'Radio Superficie Gauss (M)'}
					},
					legend: { position: 'top' },
					vAxes: {
				 // Adds titles to each axis.
				 0: {title: 'Campo Electrico (N/C)'},
				 1: {title: 'Radio Superficie Gauss (M)'}
			 },


				};
				var chart = new google.visualization.LineChart(document.getElementById('curve_chart'));

				chart.draw(dataChart, options);

				}

			function drawTable() {
				var data = new google.visualization.DataTable();
					data.addColumn('number', 'Radio Cilindro(M)');
						data.addColumn('number', 'Radio Interno Cilindro(M)');
					data.addColumn('number', 'Radio S Gauss(M)');
					data.addColumn('number', 'Longitud S Gauss(M)');
					data.addColumn('number', 'Q encerrada(C)');
				  data.addColumn('number', 'Campo Electrico(N/C)');

				data.addRows(

					dataTablaValores

				);

				var table = new google.visualization.Table(document.getElementById('table_div'));

				table.draw(data, {showRowNumber: true, width: '100%', height: '100%'});
			}
