/**
 * PJT: This is a variation on sdfshader from bmfont, which should Just Work with logarithmic depth buffers.
 * At time of writing, this is work in progress... I may want to return a Material object, rather than {vertexShader, fragmentShader...}
 * as I suspect that it may be necessary to have something like an onBeforeCompile pre-processor step. That could fit in sdftext.js, though
 * nb look for logDepthBuf (case insensitive) & logarithmicDepthBuffer in three.js code...
 */
var assign = require('object-assign');

module.exports = function createSDFShader (opt) {
  opt = opt || {};
  var opacity = typeof opt.opacity === 'number' ? opt.opacity : 1;
  ///-- hardcoded, guivr never passed these in opt --
  //var alphaTest = typeof opt.alphaTest === 'number' ? opt.alphaTest : 0.0001
  //var precision = opt.precision || 'highp'
  var color = opt.color;
  var map = opt.map;

  // remove to satisfy r73
  delete opt.map;
  delete opt.color;
  delete opt.precision;
  delete opt.opacity;

  return assign({
    uniforms: {
      opacity: { type: 'f', value: opacity },
      map: { type: 't', value: map || new THREE.Texture() },
      color: { type: 'c', value: new THREE.Color(color) }
    },
    vertexShader: `
        attribute vec2 uv;
        attribute vec4 position;
        uniform mat4 projectionMatrix;
        uniform mat4 modelViewMatrix;
        varying vec2 vUv;
        void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * position;
        }`,
    fragmentShader: `
        #ifdef GL_OES_standard_derivatives
        #extension GL_OES_standard_derivatives : enable
        #endif
        precision highp float;
        uniform float opacity;
        uniform vec3 color;
        uniform sampler2D map;
        varying vec2 vUv;
        float aastep(float value) {
            #ifdef GL_OES_standard_derivatives
                float afwidth = length(vec2(dFdx(value), dFdy(value))) * 0.70710678118654757;
            #else
                float afwidth = (1.0 / 32.0) * (1.4142135623730951 / (2.0 * gl_FragCoord.w));
            #endif
            return smoothstep(0.5 - afwidth, 0.5 + afwidth, value);
        }
        void main() {
            vec4 texColor = texture2D(map, vUv);
            float alpha = aastep(texColor.a);
            gl_FragColor = vec4(color, opacity * alpha);
            if (gl_FragColor.a < 0.0001) discard;
            //change_me
        }`
  }, opt);
}
