//costruzione della sfera dal basso
function Sphere(vres, hres){
	console.debug("start sphere");
	this.name = "sphere";
	
	this.vertices = new Float32Array(3*(vres*hres+2));
	
	// bottom of the sphere
	this.vertices[0] = 0.0;
	this.vertices[1] = -1.0;
	this.vertices[2] = 0.0;
	
	var deltaAngle = 3.141592653589793238462643383279 / (hres+1);
	var startAngle = -(1/2)*3.141592653589793238462643383279;
	var vertexoffset = 3;
	var radius;
	var high;
	var angle;
	
	// creating all points
	console.debug("creating all points...");
	for (var i = 1; i < hres+1; i++){
		angle = deltaAngle*i + startAngle;
		radius = Math.cos(angle);
		high = Math.sin(angle);
		
		console.debug("creating circumference " + i + "; angle, radius, high = " + angle+ ", " + radius + ", " + high);
		
		createCircumference(this.vertices, vertexoffset, radius, high, vres);
		vertexoffset+=(vres*3);
	}
	
	console.debug("# of vertices created "+ vertexoffset/3);
	
	// top of the sphere
	this.vertices[vertexoffset] = 0.0;
	this.vertices[vertexoffset+1] = 1.0;
	this.vertices[vertexoffset+2] = 0.0;
	
	// triangles defition
	////////////////////////////////////////////////////////////
	
	//the number of triangles is = vres[for top] + vres[for bottom] +2*vres*(hres-1)[2vres triangles for hres-1 bands] = 2*vres(hres)
	this.triangleIndices = new Uint16Array(3*2*vres*hres);
	
	// bottom surface
	console.debug("creating bottom surface...");
	
	var triangleoffset = 0;
	for (var i = 0; i < vres; i++) {
	
		this.triangleIndices[triangleoffset] = 0;
		this.triangleIndices[triangleoffset+1] = 1 + ((i+1) % vres);
		this.triangleIndices[triangleoffset+2] = 1 + (i % vres);
		triangleoffset += 3;
	}
	
	//surfaces of the bands
	console.debug("creating bands surfaces...");
	
	vertexoffset = 1;
	for (var j = 0 ; j < hres - 1; j++){
	
	console.debug("band # "+ j );
	
		for (var i = 0; i < vres; i++) {
			
			//console.debug("band triangles #" + i);
			
			this.triangleIndices[triangleoffset] = vertexoffset + i;
			this.triangleIndices[triangleoffset+1] = vertexoffset + ((i+1) % vres);
			this.triangleIndices[triangleoffset+2] = vertexoffset + (i + vres);
			triangleoffset += 3;
			
			this.triangleIndices[triangleoffset] = vertexoffset + ((i+1) % vres);
			this.triangleIndices[triangleoffset+1] = vertexoffset + vres +((i + 1) % vres);
			this.triangleIndices[triangleoffset+2] = vertexoffset +  (i + vres);
			triangleoffset += 3;
		}
		vertexoffset+=vres;
	}

	// top surface
	console.debug("creating top surface...");
	
	var topPoint = (vres*hres+2)-1;
	var i;
	for ( i = vertexoffset; i < topPoint; i++) {
	
		this.triangleIndices[triangleoffset] = topPoint;
		this.triangleIndices[triangleoffset+1] = i%vres + vertexoffset;
		this.triangleIndices[triangleoffset+2] = (i+1)%vres + vertexoffset;
		triangleoffset += 3;
	}
	
	console.debug("creation... DONE: vertices used= " + (i+1) + " triangle used= " + triangleoffset/3);
	
//	console.debug("vertices = " + this.vertices.length/3 + ", triangles = " + this.triangleIndices.length/3);
	
//	console.debug("VERTICI ------------------------------------------"); 
//	for (var k=0; k < this.vertices.length; k++){
//		console.debug(this.vertices[k]);
//	}
	
//	console.debug("TRIANGOLI ------------------------------------------"); 
//	for (var k=0; k < this.triangleIndices.length; k++){
//		if(k%3 == 0 ) console.debug(this.triangleIndices[k]+ "----");
//		else console.debug(this.triangleIndices[k]);
//	}
	
	this.numVertices = this.vertices.length/3;
	this.numTriangles = this.triangleIndices.length/3;
}


//vertices = array in which the point of the circumference we'll be put, in CCW order
//vertexoffset = offset from which starting to put the points
//radius = radius of the circumference
//high = at which high put the circumference 
//resolution = number of points for the circumference
function createCircumference( vertices, vertexoffset, radius, high, resolution){
	var angle;
	var step = 6.283185307179586476925286766559 / resolution;

	for (var i = 0; i < resolution; i++) {
	
		angle = step * i;
		
		vertices[vertexoffset] = radius * Math.cos(angle);
		vertices[vertexoffset+1] = high;
		vertices[vertexoffset+2] = radius * Math.sin(angle);
		vertexoffset += 3;
	}
}