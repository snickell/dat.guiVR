/**
 * When the textbox is focussed,  a keyboard should be created...
 * There should also be a way of dismissing it later.  It may be that we want to
 * prevent multiple keyboards being made simultaneously?
 * 
 * In order to make it appear, it can be added as a child of the texbox node itself...
 * This'll mean that it gets dragged around by the parent GUI as it moves....
 * Makes for relatively clean, simple implementation at least.
 * At the moment, keyboard positioning is messed up by this arrangement.
 * Removing grabber makes it less likely a user will do this, but might be worth fixing the basic bug.
 * 
 */

import * as GUI from './index';
import createTextLabel from './textlabel';
import createInteraction from './interaction';
import * as Colors from './colors';
import * as Layout from './layout';
import * as SharedMaterials from './sharedmaterials';
import * as Grab from './grab';


export default function createTextBox({
    textCreator,
    object,
    propertyName = 'undefined',
    width = Layout.PANEL_WIDTH,
    height = Layout.PANEL_HEIGHT,
    depth = Layout.PANEL_DEPTH
} = {}) {
  // big old copy / paste from button.js. Might try to factor out some of this common code.
  const BUTTON_WIDTH = width * 0.5 - Layout.PANEL_MARGIN;
  const BUTTON_HEIGHT = height - Layout.PANEL_MARGIN;
  const BUTTON_DEPTH = Layout.BUTTON_DEPTH;

  const group = new THREE.Group();
  group.guiType = "textbox";
  group.toString = () => `[${group.guiType}: ${propertyName}]`;

  const panel = Layout.createPanel( width, height, depth );
  group.add( panel );

  //  base checkbox
  const divisions = 4;
  const aspectRatio = BUTTON_WIDTH / BUTTON_HEIGHT;
  const rect = new THREE.BoxGeometry( BUTTON_WIDTH, BUTTON_HEIGHT, BUTTON_DEPTH, Math.floor( divisions * aspectRatio ), divisions, divisions );
  const modifier = new THREE.SubdivisionModifier( 1 );
  modifier.modify( rect );
  rect.translate( BUTTON_WIDTH * 0.5, 0, 0 );

  //  hitscan volume
  const hitscanMaterial = new THREE.MeshBasicMaterial();
  hitscanMaterial.visible = false;

  const hitscanVolume = new THREE.Mesh( rect.clone(), hitscanMaterial );
  hitscanVolume.position.z = BUTTON_DEPTH * 0.5;
  hitscanVolume.position.x = width * 0.5;

  const material = new THREE.MeshBasicMaterial({ color: 0xFFFFFF });
  const filledVolume = new THREE.Mesh( rect.clone(), material );
  hitscanVolume.add( filledVolume );


  //how can I change color of text?
  const buttonLabel = textCreator.create( object[propertyName], { color: 0x0000000, scale: 0.866 } );

  //  This is a real hack since we need to fit the text position to the font scaling
  //  Please fix me.
  //buttonLabel.position.x = BUTTON_WIDTH * 0.5 - buttonLabel.layout.width * 0.000011 * 0.5;
  buttonLabel.position.x = 0.015;
  buttonLabel.position.z = BUTTON_DEPTH * 1.2;
  buttonLabel.position.y = -0.025;
  filledVolume.add( buttonLabel );


  const descriptorLabel = textCreator.create( propertyName );
  descriptorLabel.position.x = Layout.PANEL_LABEL_TEXT_MARGIN;
  descriptorLabel.position.z = depth;
  descriptorLabel.position.y = -0.03;

  const controllerID = Layout.createControllerIDBox( height, Colors.CONTROLLER_ID_BUTTON );
  controllerID.position.z = depth;

  panel.add( descriptorLabel, hitscanVolume, controllerID );

  const interaction = createInteraction( hitscanVolume );
  interaction.events.on( 'onPressed', handleOnPress );

  updateView();

  function updateString(str) {
      object[propertyName] = str;
      buttonLabel.updateLabel(str);
  }
  var keyboard;
  function toggleKeyboard() {
    if (keyboard) {
        keyboard.visible = !keyboard.visible;
        if (keyboard.visible) group.folder.setModalEditor(keyboard);
        return;
    } else {
        keyboard = dat.GUIVR.create("keyboard");
        group.add(keyboard);
        keyboard.folder = group.folder;
        group.folder.setModalEditor(keyboard);
        keyboard.position.x = width;
        keyboard.hideGrabber();
        keyboard.addKeyboard( (k) => {
            var str = object[propertyName];
            switch (k) {
                case '\n':
                    keyboard.visible = false;
                    break;
                case '\b':
                    str = str.substring(0, str.length-1);
                    updateString(str);
                    break;
                default:
                    str += k;
                    updateString(str);
            }
        });
    }
  }

  function handleOnPress( p ){
    //this test should be redundant now
    // if( group.visible === false ){
    //   return;
    // }

    //object[ propertyName ]();

    //hitscanVolume.position.z = BUTTON_DEPTH * 0.1;

    // create a keyboard and attach it as child of group... 
    // or just make sure existing keyboard is visible.
    toggleKeyboard();

    p.locked = true;
  }

  
  function updateView(){

    if( interaction.hovering() ){
      material.color.setHex( Colors.TEXTBOX_HIGHLIGHT_BG );
    }
    else{
      material.color.setHex( Colors.TEXTBOX_BG );
    }

  }

  group.interaction = interaction;
  group.hitscan = [ hitscanVolume, panel ];

  const grabInteraction = Grab.create( { group, panel } );

  group.updateControl = function( inputObjects ){
    interaction.update( inputObjects );
    grabInteraction.update( inputObjects );
    updateView();
  };

  group.name = function( str ){
    descriptorLabel.updateLabel( str );
    return group;
  };


  return group;
}