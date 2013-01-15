/**
 * @author alteredq / http://alteredqualia.com/
 * @author mrdoob / http://mrdoob.com/
 * @author mikael emtinger / http://gomo.se/
 */

THREE.ShaderChunk = {


	// FOG

	fog_pars_fragment: [

	"#ifdef USE_FOG",

		"uniform vec3 fogColor;",

		"#ifdef FOG_EXP2",
			"uniform float fogDensity;",
		"#else",
			"uniform float fogNear;",
			"uniform float fogFar;",
		"#endif",

	"#endif"

	].join("\n"),

	fog_fragment: [

	"#ifdef USE_FOG",

		"float depth = gl_FragCoord.z / gl_FragCoord.w;",

		"#ifdef FOG_EXP2",
			"const float LOG2 = 1.442695;",
			"float fogFactor = exp2( - fogDensity * fogDensity * depth * depth * LOG2 );",
			"fogFactor = 1.0 - clamp( fogFactor, 0.0, 1.0 );",
		"#else",
			"float fogFactor = smoothstep( fogNear, fogFar, depth );",
		"#endif",

		"gl_FragColor = mix( gl_FragColor, vec4( fogColor, gl_FragColor.w ), fogFactor );",

	"#endif"

	].join("\n"),

	// ENVIRONMENT MAP

	envmap_pars_fragment: [

	"#ifdef USE_ENVMAP",

		"varying vec3 vReflect;",
		"uniform float reflectivity;",
		"uniform samplerCube envMap;",
		"uniform int combine;",

	"#endif"

	].join("\n"),

	envmap_fragment: [

	"#ifdef USE_ENVMAP",

		"vec4 cubeColor = textureCube( envMap, vec3( -vReflect.x, vReflect.yz ) );",

		"if ( combine == 1 ) {",

			//"gl_FragColor = mix( gl_FragColor, cubeColor, reflectivity );",
			"gl_FragColor = vec4( mix( gl_FragColor.xyz, cubeColor.xyz, reflectivity ), opacity );",

		"} else {",

			"gl_FragColor = gl_FragColor * cubeColor;",

		"}",

	"#endif"

	].join("\n"),

	envmap_pars_vertex: [

	"#ifdef USE_ENVMAP",

		"varying vec3 vReflect;",
		"uniform float refractionRatio;",
		"uniform bool useRefract;",

	"#endif"

	].join("\n"),

	envmap_vertex : [

	"#ifdef USE_ENVMAP",

		"vec4 mPosition = objectMatrix * vec4( position, 1.0 );",
		"vec3 nWorld = mat3( objectMatrix[0].xyz, objectMatrix[1].xyz, objectMatrix[2].xyz ) * normal;",

		"if ( useRefract ) {",

			"vReflect = refract( normalize( mPosition.xyz - cameraPosition ), normalize( nWorld.xyz ), refractionRatio );",

		"} else {",

			"vReflect = reflect( normalize( mPosition.xyz - cameraPosition ), normalize( nWorld.xyz ) );",

		"}",

	"#endif"

	].join("\n"),

	// COLOR MAP (particles)

	map_particle_pars_fragment: [

	"#ifdef USE_MAP",

		"uniform sampler2D map;",

	"#endif"

	].join("\n"),


	map_particle_fragment: [

	"#ifdef USE_MAP",

		"gl_FragColor = gl_FragColor * texture2D( map, gl_PointCoord );",

	"#endif"

	].join("\n"),

	// COLOR MAP (triangles)

	map_pars_fragment: [

	"#ifdef USE_MAP",

		"varying vec2 vUv;",
		"uniform sampler2D map;",

	"#endif"

	].join("\n"),

	map_pars_vertex: [

	"#ifdef USE_MAP",

		"varying vec2 vUv;",

	"#endif"

	].join("\n"),

	map_fragment: [

	"#ifdef USE_MAP",

		"gl_FragColor = gl_FragColor * texture2D( map, vUv );",

	"#endif"

	].join("\n"),

	map_vertex: [

	"#ifdef USE_MAP",

		"vUv = uv;",

	"#endif"

	].join("\n"),

	// LIGHT MAP

	lightmap_pars_fragment: [

	"#ifdef USE_LIGHTMAP",

		"varying vec2 vUv2;",
		"uniform sampler2D lightMap;",

	"#endif"

	].join("\n"),

	lightmap_pars_vertex: [

	"#ifdef USE_LIGHTMAP",

		"varying vec2 vUv2;",

	"#endif"

	].join("\n"),

	lightmap_fragment: [

	"#ifdef USE_LIGHTMAP",

		"gl_FragColor = gl_FragColor * texture2D( lightMap, vUv2 );",

	"#endif"

	].join("\n"),

	lightmap_vertex: [

	"#ifdef USE_LIGHTMAP",

		"vUv2 = uv2;",

	"#endif"

	].join("\n"),

	lights_pars_vertex: [

	"uniform bool enableLighting;",
	"uniform vec3 ambientLightColor;",

	"#if MAX_DIR_LIGHTS > 0",

		"uniform vec3 directionalLightColor[ MAX_DIR_LIGHTS ];",
		"uniform vec3 directionalLightDirection[ MAX_DIR_LIGHTS ];",

	"#endif",

	"#if MAX_POINT_LIGHTS > 0",

		"uniform vec3 pointLightColor[ MAX_POINT_LIGHTS ];",
		"uniform vec3 pointLightPosition[ MAX_POINT_LIGHTS ];",

		"#ifdef PHONG",
			"varying vec3 vPointLightVector[ MAX_POINT_LIGHTS ];",
		"#endif",

	"#endif"

	].join("\n"),

	// LIGHTS

	lights_vertex: [

	"if ( !enableLighting ) {",

		"vLightWeighting = vec3( 1.0 );",

	"} else {",

		"vLightWeighting = ambientLightColor;",

		"#if MAX_DIR_LIGHTS > 0",

		"for( int i = 0; i < MAX_DIR_LIGHTS; i++ ) {",

			"vec4 lDirection = viewMatrix * vec4( directionalLightDirection[ i ], 0.0 );",
			"float directionalLightWeighting = max( dot( transformedNormal, normalize( lDirection.xyz ) ), 0.0 );",
			"vLightWeighting += directionalLightColor[ i ] * directionalLightWeighting;",

		"}",

		"#endif",

		"#if MAX_POINT_LIGHTS > 0",

		"for( int i = 0; i < MAX_POINT_LIGHTS; i++ ) {",

			"vec4 lPosition = viewMatrix * vec4( pointLightPosition[ i ], 1.0 );",
			"vec3 pointLightVector = normalize( lPosition.xyz - mvPosition.xyz );",
			"float pointLightWeighting = max( dot( transformedNormal, pointLightVector ), 0.0 );",
			"vLightWeighting += pointLightColor[ i ] * pointLightWeighting;",

			"#ifdef PHONG",
				"vPointLightVector[ i ] = pointLightVector;",
			"#endif",

		"}",

		"#endif",

	"}"

	].join("\n"),

	lights_pars_fragment: [

	"#if MAX_DIR_LIGHTS > 0",
		"uniform vec3 directionalLightDirection[ MAX_DIR_LIGHTS ];",
	"#endif",

	"#if MAX_POINT_LIGHTS > 0",
		"varying vec3 vPointLightVector[ MAX_POINT_LIGHTS ];",
	"#endif",

	"varying vec3 vViewPosition;",
	"varying vec3 vNormal;"

	].join("\n"),

	lights_fragment: [

	"vec3 normal = normalize( vNormal );",
	"vec3 viewPosition = normalize( vViewPosition );",

	"vec4 mColor = vec4( diffuse, opacity );",
	"vec4 mSpecular = vec4( specular, opacity );",

	"#if MAX_POINT_LIGHTS > 0",

		"vec4 pointDiffuse  = vec4( 0.0 );",
		"vec4 pointSpecular = vec4( 0.0 );",

		"for( int i = 0; i < MAX_POINT_LIGHTS; i++ ) {",

			"vec3 pointVector = normalize( vPointLightVector[ i ] );",
			"vec3 pointHalfVector = normalize( vPointLightVector[ i ] + vViewPosition );",

			"float pointDotNormalHalf = dot( normal, pointHalfVector );",
			"float pointDiffuseWeight = max( dot( normal, pointVector ), 0.0 );",

			"float pointSpecularWeight = 0.0;",
			"if ( pointDotNormalHalf >= 0.0 )",
				"pointSpecularWeight = pow( pointDotNormalHalf, shininess );",

			"pointDiffuse  += mColor * pointDiffuseWeight;",
			"pointSpecular += mSpecular * pointSpecularWeight;",

			"}",

	"#endif",

	"#if MAX_DIR_LIGHTS > 0",

		"vec4 dirDiffuse  = vec4( 0.0 );",
		"vec4 dirSpecular = vec4( 0.0 );" ,

		"for( int i = 0; i < MAX_DIR_LIGHTS; i++ ) {",

			"vec4 lDirection = viewMatrix * vec4( directionalLightDirection[ i ], 0.0 );",

			"vec3 dirVector = normalize( lDirection.xyz );",
			"vec3 dirHalfVector = normalize( lDirection.xyz + vViewPosition );",

			"float dirDotNormalHalf = dot( normal, dirHalfVector );",

			"float dirDiffuseWeight = max( dot( normal, dirVector ), 0.0 );",

			"float dirSpecularWeight = 0.0;",
			"if ( dirDotNormalHalf >= 0.0 )",
				"dirSpecularWeight = pow( dirDotNormalHalf, shininess );",

			"dirDiffuse  += mColor * dirDiffuseWeight;",
			"dirSpecular += mSpecular * dirSpecularWeight;",

		"}",

	"#endif",

	"vec4 totalLight = vec4( ambient, opacity );",

	"#if MAX_DIR_LIGHTS > 0",
		"totalLight += dirDiffuse + dirSpecular;",
	"#endif",

	"#if MAX_POINT_LIGHTS > 0",
		"totalLight += pointDiffuse + pointSpecular;",
	"#endif",

	"gl_FragColor = gl_FragColor * totalLight;"

	].join("\n"),

	// VERTEX COLORS

	color_pars_fragment: [

	"#ifdef USE_COLOR",

		"varying vec3 vColor;",

	"#endif"

	].join("\n"),


	color_fragment: [

	"#ifdef USE_COLOR",

		"gl_FragColor = gl_FragColor * vec4( vColor, opacity );",

	"#endif"

	].join("\n"),

	color_pars_vertex: [

	"#ifdef USE_COLOR",

		"varying vec3 vColor;",

	"#endif"

	].join("\n"),


	color_vertex: [

	"#ifdef USE_COLOR",

		"vColor = color;",

	"#endif"

	].join("\n"),

	// skinning

	skinning_pars_vertex: [

	"#ifdef USE_SKINNING",

		"uniform mat4 boneGlobalMatrices[ MAX_BONES ];",

	"#endif"

	].join("\n"),

	skinning_vertex: [

	"#ifdef USE_SKINNING",

		"gl_Position  = ( boneGlobalMatrices[ int( skinIndex.x ) ] * skinVertexA ) * skinWeight.x;",
		"gl_Position += ( boneGlobalMatrices[ int( skinIndex.y ) ] * skinVertexB ) * skinWeight.y;",

		// this doesn't work, no idea why
		//"gl_Position  = projectionMatrix * cameraInverseMatrix * objectMatrix * gl_Position;",

		"gl_Position  = projectionMatrix * viewMatrix * objectMatrix * gl_Position;",

	"#endif"

	].join("\n"),

	// morphing
	
	morphtarget_pars_vertex: [

	"#ifdef USE_MORPHTARGETS",

		"uniform float morphTargetInfluences[ 8 ];",

	"#endif"

	].join("\n"),

	morphtarget_vertex: [

	"#ifdef USE_MORPHTARGETS",

		"vec3 morphed = vec3( 0.0, 0.0, 0.0 );",
		"morphed += ( morphTarget0 - position ) * morphTargetInfluences[ 0 ];",
		"morphed += ( morphTarget1 - position ) * morphTargetInfluences[ 1 ];",
		"morphed += ( morphTarget2 - position ) * morphTargetInfluences[ 2 ];",
		"morphed += ( morphTarget3 - position ) * morphTargetInfluences[ 3 ];",
		"morphed += ( morphTarget4 - position ) * morphTargetInfluences[ 4 ];",
		"morphed += ( morphTarget5 - position ) * morphTargetInfluences[ 5 ];",
		"morphed += ( morphTarget6 - position ) * morphTargetInfluences[ 6 ];",
		"morphed += ( morphTarget7 - position ) * morphTargetInfluences[ 7 ];",
		"morphed += position;",
		
		"gl_Position = projectionMatrix * modelViewMatrix * vec4( morphed, 1.0 );",

	"#endif"

	].join("\n"),
	
	default_vertex : [
	
	"#ifndef USE_MORPHTARGETS",
	"#ifndef USE_SKINNING",
		
		"gl_Position = projectionMatrix * mvPosition;",

	"#endif",
	"#endif"
	
	].join("\n")

};

THREE.UniformsLib = {

	common: {

	"diffuse" : { type: "c", value: new THREE.Color( 0xeeeeee ) },
	"opacity" : { type: "f", value: 1.0 },
	"map"     : { type: "t", value: 0, texture: null },

	"lightMap"       : { type: "t", value: 2, texture: null },

	"envMap" 		  : { type: "t", value: 1, texture: null },
	"useRefract"	  : { type: "i", value: 0 },
	"reflectivity"    : { type: "f", value: 1.0 },
	"refractionRatio": { type: "f", value: 0.98 },
	"combine"		  : { type: "i", value: 0 },

	"fogDensity": { type: "f", value: 0.00025 },
	"fogNear"	: { type: "f", value: 1 },
	"fogFar"	: { type: "f", value: 2000 },
	"fogColor"	: { type: "c", value: new THREE.Color( 0xffffff ) },
	
	"morphTargetInfluences" : { type: "f", value: 0 }

	},

	lights: {

	"enableLighting" 			: { type: "i", value: 1 },
	"ambientLightColor" 		: { type: "fv", value: [] },
	"directionalLightDirection" : { type: "fv", value: [] },
	"directionalLightColor" 	: { type: "fv", value: [] },
	"pointLightPosition"		: { type: "fv", value: [] },
	"pointLightColor"			: { type: "fv", value: [] }

	},

	particle: {

	"psColor"   : { type: "c", value: new THREE.Color( 0xeeeeee ) },
	"opacity" : { type: "f", value: 1.0 },
	"size" 	  : { type: "f", value: 1.0 },
	"scale"   : { type: "f", value: 1.0 },
	"map"     : { type: "t", value: 0, texture: null },

	"fogDensity": { type: "f", value: 0.00025 },
	"fogNear"	: { type: "f", value: 1 },
	"fogFar"	: { type: "f", value: 2000 },
	"fogColor"	: { type: "c", value: new THREE.Color( 0xffffff ) }

	}

};

THREE.ShaderLib = {

	'shadowPost': {
		
		vertexShader: [
		
			"uniform 	mat4 	projectionMatrix;",
			"attribute 	vec3 	position;",
	
			"void main(void)",
			"{",
				"gl_Position = projectionMatrix * vec4( position, 1.0 );",
			"}"

		].join( "\n" ),
		
		fragmentShader: [
		
			"#ifdef GL_ES",
				"precision highp float;",
			"#endif",		
	
			"void main( void )",
			"{",
				"gl_FragColor = vec4( 0, 0, 0, 0.5 );",
			"}"

		].join( "\n" )
		
	},


	'shadowVolumeDynamic': {
		
		uniforms: { "directionalLightDirection": { type: "fv", value: [] }},

		vertexShader: [

			"uniform 	vec3 	directionalLightDirection;",
	
			"void main() {",

				"vec4 pos      = objectMatrix * vec4( position, 1.0 );",
				"vec3 norm     = mat3( objectMatrix[0].xyz, objectMatrix[1].xyz, objectMatrix[2].xyz ) * normal;",
				"vec4 extruded = vec4( directionalLightDirection * 5000.0 * step( 0.0, dot( directionalLightDirection, norm )), 0.0 );",
				"gl_Position   = projectionMatrix * viewMatrix * ( pos + extruded );",
			"}"

		].join( "\n" ),

		fragmentShader: [

			"void main() {",

				"gl_FragColor = vec4( 1, 1, 1, 1 );",

			"}"

		].join( "\n" )
	},		


	'depth': {

		uniforms: { "mNear": { type: "f", value: 1.0 },
					"mFar" : { type: "f", value: 2000.0 },
					"opacity" : { type: "f", value: 1.0 }
				  },

		fragmentShader: [

			"uniform float mNear;",
			"uniform float mFar;",
			"uniform float opacity;",

			"void main() {",

				"float depth = gl_FragCoord.z / gl_FragCoord.w;",
				"float color = 1.0 - smoothstep( mNear, mFar, depth );",
				"gl_FragColor = vec4( vec3( color ), opacity );",

			"}"

		].join("\n"),

		vertexShader: [

			"void main() {",

				"gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",

			"}"

		].join("\n")

	},

	'normal': {

		uniforms: { "opacity" : { type: "f", value: 1.0 } },

		fragmentShader: [

			"uniform float opacity;",
			"varying vec3 vNormal;",

			"void main() {",

				"gl_FragColor = vec4( 0.5 * normalize( vNormal ) + 0.5, opacity );",

			"}"

		].join("\n"),

		vertexShader: [

			"varying vec3 vNormal;",

			"void main() {",

				"vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );",
				"vNormal = normalize( normalMatrix * normal );",

				"gl_Position = projectionMatrix * mvPosition;",

			"}"

		].join("\n")

	},

	'basic': {

		uniforms: THREE.UniformsLib[ "common" ],

		fragmentShader: [

			"uniform vec3 diffuse;",
			"uniform float opacity;",

			THREE.ShaderChunk[ "color_pars_fragment" ],
			THREE.ShaderChunk[ "map_pars_fragment" ],
			THREE.ShaderChunk[ "lightmap_pars_fragment" ],
			THREE.ShaderChunk[ "envmap_pars_fragment" ],
			THREE.ShaderChunk[ "fog_pars_fragment" ],

			"void main() {",

				"gl_FragColor = vec4( diffuse, opacity );",

				THREE.ShaderChunk[ "map_fragment" ],
				THREE.ShaderChunk[ "lightmap_fragment" ],
				THREE.ShaderChunk[ "color_fragment" ],
				THREE.ShaderChunk[ "envmap_fragment" ],
				THREE.ShaderChunk[ "fog_fragment" ],

			"}"

		].join("\n"),

		vertexShader: [

			THREE.ShaderChunk[ "map_pars_vertex" ],
			THREE.ShaderChunk[ "lightmap_pars_vertex" ],
			THREE.ShaderChunk[ "envmap_pars_vertex" ],
			THREE.ShaderChunk[ "color_pars_vertex" ],
			THREE.ShaderChunk[ "skinning_pars_vertex" ],
			THREE.ShaderChunk[ "morphtarget_pars_vertex" ],

			"void main() {",

				"vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );",

				THREE.ShaderChunk[ "map_vertex" ],
				THREE.ShaderChunk[ "lightmap_vertex" ],
				THREE.ShaderChunk[ "envmap_vertex" ],
				THREE.ShaderChunk[ "color_vertex" ],
				THREE.ShaderChunk[ "skinning_vertex" ],
				THREE.ShaderChunk[ "morphtarget_vertex" ],
				THREE.ShaderChunk[ "default_vertex" ],
				
			"}"

		].join("\n")

	},

	'lambert': {

		uniforms: Uniforms.merge( [ THREE.UniformsLib[ "common" ],
									THREE.UniformsLib[ "lights" ] ] ),

		fragmentShader: [

			"uniform vec3 diffuse;",
			"uniform float opacity;",

			"varying vec3 vLightWeighting;",

			THREE.ShaderChunk[ "color_pars_fragment" ],
			THREE.ShaderChunk[ "map_pars_fragment" ],
			THREE.ShaderChunk[ "lightmap_pars_fragment" ],
			THREE.ShaderChunk[ "envmap_pars_fragment" ],
			THREE.ShaderChunk[ "fog_pars_fragment" ],

			"void main() {",

				"gl_FragColor = vec4( diffuse, opacity );",
				"gl_FragColor = gl_FragColor * vec4( vLightWeighting, 1.0 );",

				THREE.ShaderChunk[ "map_fragment" ],
				THREE.ShaderChunk[ "lightmap_fragment" ],
				THREE.ShaderChunk[ "color_fragment" ],
				THREE.ShaderChunk[ "envmap_fragment" ],
				THREE.ShaderChunk[ "fog_fragment" ],

			"}"

		].join("\n"),

		vertexShader: [

			"varying vec3 vLightWeighting;",

			THREE.ShaderChunk[ "map_pars_vertex" ],
			THREE.ShaderChunk[ "lightmap_pars_vertex" ],
			THREE.ShaderChunk[ "envmap_pars_vertex" ],
			THREE.ShaderChunk[ "lights_pars_vertex" ],
			THREE.ShaderChunk[ "color_pars_vertex" ],
			THREE.ShaderChunk[ "skinning_pars_vertex" ],
			THREE.ShaderChunk[ "morphtarget_pars_vertex" ],

			"void main() {",

				"vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );",

				THREE.ShaderChunk[ "map_vertex" ],
				THREE.ShaderChunk[ "lightmap_vertex" ],
				THREE.ShaderChunk[ "envmap_vertex" ],
				THREE.ShaderChunk[ "color_vertex" ],

				"vec3 transformedNormal = normalize( normalMatrix * normal );",

				THREE.ShaderChunk[ "lights_vertex" ],
				THREE.ShaderChunk[ "skinning_vertex" ],
				THREE.ShaderChunk[ "morphtarget_vertex" ],
				THREE.ShaderChunk[ "default_vertex" ],

			"}"

		].join("\n")

	},

	'phong': {

		uniforms: Uniforms.merge( [ THREE.UniformsLib[ "common" ],
									THREE.UniformsLib[ "lights" ],

									{ "ambient"  : { type: "c", value: new THREE.Color( 0x050505 ) },
									  "specular" : { type: "c", value: new THREE.Color( 0x111111 ) },
									  "shininess": { type: "f", value: 30 }
									}

								] ),

		fragmentShader: [

			"uniform vec3 diffuse;",
			"uniform float opacity;",

			"uniform vec3 ambient;",
			"uniform vec3 specular;",
			"uniform float shininess;",

			"varying vec3 vLightWeighting;",

			THREE.ShaderChunk[ "color_pars_fragment" ],
			THREE.ShaderChunk[ "map_pars_fragment" ],
			THREE.ShaderChunk[ "lightmap_pars_fragment" ],
			THREE.ShaderChunk[ "envmap_pars_fragment" ],
			THREE.ShaderChunk[ "fog_pars_fragment" ],
			THREE.ShaderChunk[ "lights_pars_fragment" ],

			"void main() {",

				"gl_FragColor = vec4( vLightWeighting, 1.0 );",
				THREE.ShaderChunk[ "lights_fragment" ],

				THREE.ShaderChunk[ "map_fragment" ],
				THREE.ShaderChunk[ "lightmap_fragment" ],
				THREE.ShaderChunk[ "color_fragment" ],
				THREE.ShaderChunk[ "envmap_fragment" ],
				THREE.ShaderChunk[ "fog_fragment" ],

			"}"

		].join("\n"),

		vertexShader: [

			"#define PHONG",

			"varying vec3 vLightWeighting;",
			"varying vec3 vViewPosition;",
			"varying vec3 vNormal;",

			THREE.ShaderChunk[ "map_pars_vertex" ],
			THREE.ShaderChunk[ "lightmap_pars_vertex" ],
			THREE.ShaderChunk[ "envmap_pars_vertex" ],
			THREE.ShaderChunk[ "lights_pars_vertex" ],
			THREE.ShaderChunk[ "color_pars_vertex" ],
			THREE.ShaderChunk[ "skinning_pars_vertex" ],
			THREE.ShaderChunk[ "morphtarget_pars_vertex" ],

			"void main() {",

				"vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );",

				THREE.ShaderChunk[ "map_vertex" ],
				THREE.ShaderChunk[ "lightmap_vertex" ],
				THREE.ShaderChunk[ "envmap_vertex" ],
				THREE.ShaderChunk[ "color_vertex" ],

				"#ifndef USE_ENVMAP",
					"vec4 mPosition = objectMatrix * vec4( position, 1.0 );",
				"#endif",

				"vViewPosition = cameraPosition - mPosition.xyz;",

				"vec3 transformedNormal = normalize( normalMatrix * normal );",
				"vNormal = transformedNormal;",

				THREE.ShaderChunk[ "lights_vertex" ],
				THREE.ShaderChunk[ "skinning_vertex" ],
				THREE.ShaderChunk[ "morphtarget_vertex" ],
				THREE.ShaderChunk[ "default_vertex" ],

			"}"

		].join("\n")

	},

	'particle_basic': {

		uniforms: THREE.UniformsLib[ "particle" ],

		fragmentShader: [

			"uniform vec3 psColor;",
			"uniform float opacity;",

			THREE.ShaderChunk[ "color_pars_fragment" ],
			THREE.ShaderChunk[ "map_particle_pars_fragment" ],
			THREE.ShaderChunk[ "fog_pars_fragment" ],

			"void main() {",

				"gl_FragColor = vec4( psColor, opacity );",

				THREE.ShaderChunk[ "map_particle_fragment" ],
				THREE.ShaderChunk[ "color_fragment" ],
				THREE.ShaderChunk[ "fog_fragment" ],

			"}"

		].join("\n"),

		vertexShader: [

			"uniform float size;",
			"uniform float scale;",

			THREE.ShaderChunk[ "color_pars_vertex" ],

			"void main() {",

				THREE.ShaderChunk[ "color_vertex" ],

				"vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );",

				"#ifdef USE_SIZEATTENUATION",
					"gl_PointSize = size * ( scale / length( mvPosition.xyz ) );",
				"#else",
					"gl_PointSize = size;",
				"#endif",

				"gl_Position = projectionMatrix * mvPosition;",

			"}"

		].join("\n")

	}

};
