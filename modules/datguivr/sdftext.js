/**
* dat-guiVR Javascript Controller Library for VR
* https://github.com/dataarts/dat.guiVR
*
* Copyright 2016 Data Arts Team, Google Inc.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*     http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

import SDFShader from './sdfshader_logdepth';
import createGeometry from 'three-bmfont-text';
import parseASCII from 'parse-bmfont-ascii';
import * as Layout from './layout';

import * as Font from './font';

export function createMaterial( color ){

  const texture = new THREE.Texture();
  const image = Font.image();
  texture.image = image;
  texture.needsUpdate = true;
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.generateMipmaps = false;

  //NB::: somewhat experimental replacement of RawShader code from bmfont with variation of MeshBasic shader
  //this should allow for logdepth, fog is also anticipated to work reasonably well... 
  //tonemapping etc may conceivably be improved... YMMV.
  let material = new THREE.ShaderMaterial(SDFShader({
    side: THREE.DoubleSide,
    transparent: true,
    color: color,
    map: texture
  }));
  return material;
}

const textScale = Layout.TEXT_SCALE;

export function creator(){

  const font = parseASCII( Font.fnt() );

  const colorMaterials = {};

  function createText( str, font, color = 0xffffff, scale = 1.0, width, height ){

    const geometry = createGeometry({
      text: str,
      align: 'left',
      width: width,
      height: height,
      flipY: true,
      font
    });


    const layout = geometry.layout;

    let material = colorMaterials[ color ];
    if( material === undefined ){
      material = colorMaterials[ color ] = createMaterial( color );
    }
    const mesh = new THREE.Mesh( geometry, material );
    mesh.scale.multiply( new THREE.Vector3(1,-1,1) );

    const finalScale = scale * textScale;

    mesh.scale.multiplyScalar( finalScale );

    mesh.position.y = layout.height * 0.5 * finalScale;

    return mesh;
  }


  function create( str, { color=0xffffff, scale=1.0 } = {} ){
    const group = new THREE.Group();

    let mesh = createText( str, font, color, scale );
    group.add( mesh );
    group.layout = mesh.geometry.layout;
    group.computeWidth = () => {
      return group.layout.width * Layout.TEXT_SCALE;
    }

    group.constrainBounds = (w, h) => {
      group.remove(mesh);
      const s = Layout.TEXT_SCALE;
      mesh = createText(str, font, color, scale, w/s, h/s);
      const hFactor = mesh.geometry.layout.height*s/h;
      if (hFactor > 1) {
        str = str.substring(0, 0.95* str.length/hFactor) + '...';
        mesh = createText(str, font, color, scale, w/s, h/s);
      }
      group.add(mesh);
      group.layout = mesh.geometry.layout;
    }

    group.updateLabel = function( str ){
      mesh.geometry.update( str );
    };

    return group;
  }

  return {
    create,
    getMaterial: ()=> material //XXX: this dates back quite a long way, not sure it was ever right.
  }

}