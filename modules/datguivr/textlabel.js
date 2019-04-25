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

import * as Colors from './colors';
import * as SharedMaterials from './sharedmaterials';
import * as Layout from './layout';

export default function createTextLabel( textCreator, str, width = 0.4, depth = 0.029, fgColor = 0xffffff, bgColor = Colors.DEFAULT_BACK, scale = 1.0 ){

  const group = new THREE.Group();
  group.guiType = "textlabel";
  group.toString = () => `[${group.guiType}: ${str}]`;

  const internalPositioning = new THREE.Group(); //rather unnecessary.
  group.add( internalPositioning );

  const text = textCreator.create( str.toString(), { color: fgColor, scale } );
  internalPositioning.add( text );
  group.userData.text = text;

  group.setString = function( str ){
    if (str === undefined) str = "[undefined]";
    text.updateLabel( str.toString() );
    //text.constrainBounds(totalWidth, 0.04);
  };

  group.setNumber = function( str ){
    text.updateLabel( str.toFixed(2) );
  };

  text.position.z = depth;

  const backBounds = 0.01;
  const margin = 0.01;
  const totalWidth = width;
  const totalHeight = 0.04 + margin * 2;

  //text.constrainBounds(totalWidth, 0.04);

  const labelBackGeometry = new THREE.BoxGeometry( totalWidth, totalHeight, depth, 1, 1, 1 );
  labelBackGeometry.applyMatrix( new THREE.Matrix4().makeTranslation( totalWidth * 0.5 - margin, 0, 0 ) );

  const labelBackMesh = new THREE.Mesh( labelBackGeometry, SharedMaterials.PANEL );
  Colors.colorizeGeometry( labelBackMesh.geometry, bgColor );

  labelBackMesh.position.y = 0.03;
  internalPositioning.add( labelBackMesh );
  internalPositioning.position.y = -totalHeight * 0.5;

  group.back = labelBackMesh;

  return group;
}

export function createToolTip( textCreator, tip, parentWidth, parentHeight, parentDepth ) {
  const tipText = textCreator.create(tip);
  
  const tipGroup = new THREE.Group();

  const w = tipText.computeWidth();
  const h = Layout.TEXT_SCALE * tipText.layout.height;

  tipGroup.position.x  = 0.5 * parentWidth;
  tipGroup.position.y = -1.05 * parentHeight - h;
  tipGroup.position.z = parentDepth * 3;
  tipGroup.visible = false;

//  subgroup.add(tipGroup);
  tipGroup.add(tipText);
//  subgroup.tipText = tipGroup;

  const paddedW = w + 0.03, paddedH = h + 0.03;
  const tipRect = new THREE.PlaneGeometry(paddedW, paddedH, 1, 1);
  const tipBackground = new THREE.Mesh(tipRect, SharedMaterials.TOOLTIP);
  tipBackground.position.x = 0; //paddedW / 2;
  tipBackground.position.y = h / 2;
  tipBackground.position.z = -parentDepth * 0.5;
  tipGroup.add(tipBackground);

  tipText.position.x = -0.5 * w;
  tipText.position.y = -0.5 * h + 0.0015;

  tipGroup.userData.w = w;
  tipGroup.userData.h = h;

  return tipGroup;
}
