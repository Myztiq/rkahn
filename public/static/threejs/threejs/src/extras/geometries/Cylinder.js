/**
 * @author kile / http://kile.stravaganza.org/
 * @author mr.doob / http://mrdoob.com/
 * @author fuzzthink
 */

var Cylinder = function ( numSegs, topRad, botRad, height, topOffset, botOffset ) {

	THREE.Geometry.call( this );

	var scope = this, i, pi = Math.PI, halfHeight = height / 2;

	// Top circle vertices

	for ( i = 0; i < numSegs; i ++ ) {

		v( Math.sin( 2 * pi * i / numSegs ) * topRad, Math.cos( 2 * pi * i / numSegs ) * topRad, - halfHeight );

	}

	// Bottom circle vertices

	for ( i = 0; i < numSegs; i ++ ) {

		v( Math.sin( 2 * pi * i / numSegs ) * botRad, Math.cos( 2 * pi * i / numSegs ) * botRad, halfHeight );

	}

	// Body faces

	for ( i = 0; i < numSegs; i++ ) {

		f4(
			i,
			i + numSegs,
			numSegs + ( i + 1 ) % numSegs,
			( i + 1 ) % numSegs
		);

	}

	// Bottom circle faces

	if ( botRad > 0 ) {

		v( 0, 0, - halfHeight - ( botOffset || 0 ) );

		for ( i = numSegs; i < numSegs + ( numSegs / 2 ); i++ ) {

			f4(
				2 * numSegs,
				( 2 * i - 2 * numSegs ) % numSegs,
				( 2 * i - 2 * numSegs + 1 ) % numSegs,
				( 2 * i - 2 * numSegs + 2 ) % numSegs
			);

		}

	}

	// Top circle faces

	if ( topRad > 0 ) {

		v( 0, 0, halfHeight + ( topOffset || 0 ) );

		for ( i = numSegs + ( numSegs / 2 ); i < 2 * numSegs; i ++ ) {

			f4(
				2 * numSegs + 1,
				( 2 * i - 2 * numSegs + 2 ) % numSegs + numSegs,
				( 2 * i - 2 * numSegs + 1 ) % numSegs + numSegs,
				( 2 * i - 2 * numSegs ) % numSegs + numSegs
			);

		}

	}

	this.computeCentroids();
	this.computeFaceNormals();
	// this.computeVertexNormals();

	function v( x, y, z ) {

		scope.vertices.push( new THREE.Vertex( new THREE.Vector3( x, y, z ) ) );

	}

	function f4( a, b, c, d ) {

		scope.faces.push( new THREE.Face4( a, b, c, d ) );

	}

};

Cylinder.prototype = new THREE.Geometry();
Cylinder.prototype.constructor = Cylinder;
