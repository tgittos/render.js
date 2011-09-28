RJS.Renderer = {};

RJS.Renderer.render = function() {
	var gl = RJS.Context;
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT); // gl.STENCIL_BUFFER_BIT ?
}

RJS.Renderer.renderToFBO = function(fbo, vertices, lines, faces, shader, perspectiveMatrix, texture = null) {
	var gl = RJS.Context;
	gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
	gl.viewPort(0, 0, fbo.width, fbo.height);
	vertices = RJS.Renderer.convertArrayToFloat32Array(vertices);
	lines = RJS.Renderer.convertArrayToFloat32Array(lines);
	faces = RJS.Renderer.convertArrayToFloat32Array(faces);
	
}

RJS.Renderer.convertArrayToFloat32Array = function(arr) {
	if (arr.instanceof(Float32Array)) return arr;
	f32a = new Float32Array(arr);
	arr = null;
	return f32a;
}

RJS.Renderer.createFBO = function(width, height) {
	var gl = RJS.Context;
	// create the fbo
	var fbo = gl.createFramebuffer();
	gl.bindFrameBuffer(gl.FRAMEBUFFER, fbo);
	fbo.width = width;
	fbo.height = height;
	// create the texture the fbo renders to
	var tex = RJS.Renderer.createTexture2D(width, height, {
		TEXTURE_MAG_FILTER: LINEAR,
		TEXTURE_MIN_FILTER: LINEAR_MIPMAP_NEAREST
	});
	gl.bindTexture(gl.TEXTURE_2D, tex);
	// create the depth buffer
	var depthBuffer = RJS.Renderer.createRenderBuffer(width, height);
	// tell the frame buffer about the texture
	// TODO: What is color_attachment0
	gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, tex, 0);
	// tell the frame buffer about the render buffer
	gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, depthBuffer);
	gl.bindTexture(gl.TEXTURE_2D, null);
	gl.bindRenderbuffer(gl.RENDERBUFFER, null);
	gl.bindFramebuffer(gl.FRAMEBUFFER, null);
	return fbo;
}

RJS.Renderer.createTexture2D = function(width, height, options) {
	var gl = RJS.Context;
	var tex = gl.createTexture();
	gl.bindTexture(gl.TEXTURE_2D, tex);
	for (key in options) {
		gl.texParameteri(gl.TEXTURE_2D, gl[key], gl[options[key]]);
	}
	gl.generateMipmap(gl.TEXTURE_2D);
	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, width, height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
	gl.bindTexture(gl.TEXTURE_2D, null);
	return tex;
}

RJS.Renderer.createRenderBuffer = function(width, height) {
	var buffer = gl.createRenderbuffer();
	gl.bindRenderbuffer(gl.RENDERBUFFER, buffer);
	// TODO: what is depth_component16?
	gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, width, height);
	gl.bindRenderbuffer(gl.RENDERBUFFER, null);
	return buffer;
}