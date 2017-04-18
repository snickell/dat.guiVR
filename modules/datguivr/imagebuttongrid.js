/** 
 * Grid of buttons with images on (which might come from a file or existing texture,
 * the texture might be from a RenderTarget...).
 * 
 * I'd put this more separate from the datgui modules but need to think a little
 * bit about how to structure that etc.  Very un-DRY, but I'm starting by just
 * copying existing imagebutton.js in its entirety.
 * 
 * TODO: not just simple 'bang' function but callbacks for hover / etc.
 * 
 * 
 * Copyright  Data Arts Team, Google inc. 2016 / Peter Todd, 2017
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
import * as SharedMaterials from './sharedmaterials';
import * as Grab from './grab';

export default function createImageButtonGrid( {
  textCreator,
  objects, // array of {func, image | text, tip(optional)}
  width = Layout.PANEL_WIDTH,
  depth = Layout.PANEL_DEPTH,
  columns = 4
} = {} ){
  
  const buttons = [];

  function applyImageToMaterial(image, targetMaterial) {
      if (typeof image === "string") {
        //TODO cache.  Does TextureLoader already cache?
        //TODO Image only on front face of button.
        new THREE.TextureLoader().load(image, (texture) => {
            texture.wrapS = texture.wrapT = THREE.ClampToEdgeWrapping;
            targetMaterial.map = texture;
            targetMaterial.needsUpdate = true;
        });
      } else if (image.isTexture) {
          targetMaterial.map = image;
      } else if (image.isWebGLRenderTarget) {
          targetMaterial.map = image.texture;
      } else throw "not sure how to interpret image " + image;
      targetMaterial.needsUpdate = true;
  }

  const BUTTON_WIDTH = width * (1/columns) - Layout.PANEL_MARGIN;
  const BUTTON_HEIGHT = BUTTON_WIDTH; //height - Layout.PANEL_MARGIN;
  const BUTTON_DEPTH = Layout.BUTTON_DEPTH * 2;

  const group = new THREE.Group();
  group.guiType = "imagebuttongrid";
  group.toString = () => `[${group.guiType}: ${objects}]`;
  group.guiChildren = buttons;
  
  const rows = Math.ceil(objects.length / columns);
  const height = Layout.PANEL_MARGIN + BUTTON_HEIGHT * rows;
  group.spacing = height; 

  const panel = Layout.createPanel( width, height, depth );
  group.add( panel );

  var i = 0;
  const colOffset = (0.5 * Layout.PANEL_WIDTH) - (0.5 * BUTTON_WIDTH) - 0.043;
  const rowOffset = 0.5 * BUTTON_WIDTH;
  objects.forEach(obj => {
    let subgroup = new THREE.Group();
    subgroup.guiType = "imageButtonGridElement";
    group.add(subgroup);
    buttons.push(subgroup);

    const col = i % columns;
    const x = (BUTTON_WIDTH * col) - colOffset;
    const row = Math.floor(i / columns);
    const y = (height/2) - (BUTTON_HEIGHT * row) - rowOffset;

    //  base checkbox
    const rect = new THREE.PlaneGeometry( BUTTON_WIDTH, BUTTON_HEIGHT, 1, 1 );
    rect.translate( x, y, BUTTON_DEPTH );

    //  hitscan volume
    const hitscanMaterial = new THREE.MeshBasicMaterial();
    hitscanMaterial.visible = false;

    const hitscanVolume = new THREE.Mesh( rect.clone(), hitscanMaterial );
    hitscanVolume.position.z = BUTTON_DEPTH;
    hitscanVolume.position.x = width * 0.5;

    const material = new THREE.MeshBasicMaterial();
    material.transparent = true;
    if (obj.image) applyImageToMaterial(obj.image, material);
    if (obj.text) {
        const text = textCreator.create(obj.text);
        subgroup.add(text);
        text.position.x = (col+1) * BUTTON_WIDTH;
        text.position.y = -(row-1) * BUTTON_HEIGHT;
        text.position.z = BUTTON_DEPTH * 2.2;
    }
    const filledVolume = new THREE.Mesh( rect.clone(), material );
    hitscanVolume.add( filledVolume );

    //button label & descriptor label removed; might want options like a hover label in future.
    if (obj.tip) {
        const tipText = textCreator.create(obj.tip);
        subgroup.add(tipText);
        subgroup.tipText = tipText;
        //TODO: compute text geometry and adjust
        tipText.position.x = (col+0.5) * BUTTON_WIDTH;
        tipText.position.y = -row * BUTTON_HEIGHT + 0.1;
        tipText.position.z = BUTTON_DEPTH * 2.5;
        tipText.visible = false;
    }
    
    const controllerID = Layout.createControllerIDBox( height, Colors.CONTROLLER_ID_BUTTON );
    controllerID.position.z = depth;

    //panel.add( descriptorLabel, hitscanVolume, controllerID );
    subgroup.add( hitscanVolume, controllerID );
    panel.add(subgroup);

    const interaction = createInteraction( hitscanVolume );
    interaction.events.on( 'onPressed', handleOnPress );
    interaction.events.on( 'onReleased', handleOnRelease );


    function handleOnPress( p ){
        if( subgroup.visible === false ){
            return;
        }

        obj.func();

        hitscanVolume.position.z = BUTTON_DEPTH * 0.1;

        p.locked = true;
    }

    function handleOnRelease(){
        hitscanVolume.position.z = BUTTON_DEPTH * 0.5;
    }
    //quick hack...
    const hoverCol = obj.text ? 0x888 : 0xFFFFFF;
    const noHoverCol = obj.text ? 0x111 : 0xCCCCCC;
    subgroup.updateView = () => {

        if( interaction.hovering() ){
            material.color.setHex( hoverCol );
            if (subgroup.tipText) subgroup.tipText.visible = true;
        }
        else{
            material.color.setHex( noHoverCol );
            if (subgroup.tipText) subgroup.tipText.visible = false;
        }

    }
    
    subgroup.updateView();

    subgroup.interaction = interaction;
    subgroup.hitscan = hitscanVolume; //XXX: making this single element rather than array,
    //that means these 'subgroup' buttons aren't acting exactly as normal dat.GUIVR controllers
    i++;
  });

  group.hitscan = buttons.map(b=>b.hitscan);//.push(panel);
  group.hitscan.push(panel);

  const grabInteraction = Grab.create( { group, panel } );

  function updateView() {
      buttons.forEach(b=>b.updateView());
  }
  
  group.updateControl = function( inputObjects ){
    buttons.forEach(b=>{
        b.interaction.update( inputObjects );
    });
    //interaction.update( inputObjects );
    grabInteraction.update( inputObjects );
    updateView();
  };

  group.name = function( str ){
    descriptorLabel.updateLabel( str );
    return group;
  };


  return group;
}