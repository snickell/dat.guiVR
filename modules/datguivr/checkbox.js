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

import createTextLabel from './textlabel';
import createInteraction from './interaction';
import * as Colors from './colors';
import * as Layout from './layout';
import * as Graphic from './graphic';
import * as SharedMaterials from './sharedmaterials';
import * as Grab from './grab';
import { CHECKBOX_SIZE } from './layout';

export default function createCheckbox( {
  textCreator,
  object,
  propertyName = 'undefined',
  initialValue = false,
  width = Layout.PANEL_WIDTH,
  height = Layout.PANEL_HEIGHT,
  depth = Layout.PANEL_DEPTH
} = {} ){

  const state = {
    value: initialValue,
    listen: false
  };
  
  const CHECKBOX_PAD = Layout.PANEL_HEIGHT - Layout.CHECKBOX_SIZE;
  
  const group = new THREE.Group();
  group.guiType = "checkbox";
  group.toString = () => `[${group.guiType}: ${propertyName}]`;
  
  let panel;
  //all layout etc is done inside setHeight, which is called once at start.
  //any callbacks etc remain associated with 'group'.
  group.setHeight = newHeight => {
    if (panel) group.remove(panel);
    
    group.spacing = newHeight;
    
    const CHECKBOX_WIDTH = newHeight - CHECKBOX_PAD;
    const CHECKBOX_HEIGHT = CHECKBOX_WIDTH;
    const CHECKBOX_DEPTH = depth;
    const CHECKMARK_SIZE = 0.4 * CHECKBOX_WIDTH / Layout.CHECKBOX_SIZE;
  
    panel = Layout.createPanel( width, newHeight, depth );
    group.add( panel );
  
    //  base checkbox
    const rect = new THREE.BoxGeometry( CHECKBOX_WIDTH, CHECKBOX_HEIGHT, CHECKBOX_DEPTH );
    rect.translate( CHECKBOX_WIDTH * 0.5, 0, 0 );
  
  
    //  hitscan volume
    const hitscanMaterial = new THREE.MeshBasicMaterial();
    hitscanMaterial.visible = false;
  
    const hitscanVolume = new THREE.Mesh( rect.clone(), hitscanMaterial );
    hitscanVolume.position.z = depth;
    hitscanVolume.position.x = width * 0.5;
  
    //  outline volume
    // const outline = new THREE.BoxHelper( hitscanVolume );
    // outline.material.color.setHex( Colors.OUTLINE_COLOR );
  
    //  checkbox volume
    const material = new THREE.MeshBasicMaterial({ color: Colors.CHECKBOX_BG_COLOR });
    const filledVolume = new THREE.Mesh( rect.clone(), material );
    hitscanVolume.add( filledVolume );
  
  
    const descriptorLabel = textCreator.create( propertyName );
    descriptorLabel.position.x = Layout.PANEL_LABEL_TEXT_MARGIN;
    descriptorLabel.position.z = depth;
    descriptorLabel.position.y = -0.03;
  
    const controllerID = Layout.createControllerIDBox( newHeight, Colors.CONTROLLER_ID_CHECKBOX );
    controllerID.position.z = depth;
  
    const borderBox = Layout.createPanel( CHECKBOX_WIDTH + Layout.BORDER_THICKNESS, CHECKBOX_HEIGHT + Layout.BORDER_THICKNESS, CHECKBOX_DEPTH, true );
    borderBox.material.color.setHex( 0x1f7ae7 );
    borderBox.position.x = -Layout.BORDER_THICKNESS * 0.5 + width * 0.5;
    borderBox.position.z = depth * 0.5;
  
    const checkmark = Graphic.checkmark( CHECKMARK_SIZE );
    checkmark.position.z = depth * 0.51;
    hitscanVolume.add( checkmark );
  
    panel.add( descriptorLabel, hitscanVolume, controllerID, borderBox );
  
    // group.add( filledVolume, outline, hitscanVolume, descriptorLabel );
  
    const interaction = createInteraction( hitscanVolume );
    interaction.events.on( 'onPressed', handleOnPress );
  
    updateView();
  
    function handleOnPress( p ){
      if( group.visible === false ){
        return;
      }
  
      state.value = !state.value;
  
      object[ propertyName ] = state.value;
  
      if( onChangedCB ){
        onChangedCB( state.value );
      }
  
      p.locked = true;
    }
  
    function updateView(){
  
      if( state.value ){
        checkmark.visible = true;
      }
      else{
        checkmark.visible = false;
      }
      if( interaction.hovering() ){
        borderBox.visible = true;
      }
      else{
        borderBox.visible = false;
      }
  
    }
  
    let onChangedCB;
    let onFinishChangeCB;
  
    group.onChange = function( callback ){
      onChangedCB = callback;
      return group;
    };
  
    group.interaction = interaction;
    group.hitscan = [ hitscanVolume, panel ];
  
    const grabInteraction = Grab.create( { group, panel } );
  
    group.listen = function(){
      state.listen = true;
      return group;
    };
  
    group.name = function( str ){
      descriptorLabel.updateLabel( str );
      return group;
    };
  
    group.updateControl = function( inputObjects ){
      if( state.listen ){
        state.value = object[ propertyName ];
      }
      interaction.update( inputObjects );
      grabInteraction.update( inputObjects );
      updateView();
    };
  };
  
  group.setHeight(height);

  return group;
}