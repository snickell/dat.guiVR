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

export default function createCheckbox( {
  textCreator,
  object,
  propertyName = 'undefined',
  initialValue = false,
  options = [],
  width = Layout.PANEL_WIDTH,
  height = Layout.PANEL_HEIGHT,
  depth = Layout.PANEL_DEPTH
} = {} ){


  const state = {
    open: false,
    listen: false
  };

  const DROPDOWN_WIDTH = width * 0.5 - Layout.PANEL_MARGIN;
  const DROPDOWN_HEIGHT = height - Layout.PANEL_MARGIN;
  const DROPDOWN_DEPTH = depth;
  const DROPDOWN_OPTION_HEIGHT = height - Layout.PANEL_MARGIN * 1.2;
  const DROPDOWN_MARGIN = Layout.PANEL_MARGIN * -0.4;
  const MAX_DROPDOWN_LABELS_IN_COLUMN = 25;

  const group = new THREE.Group();
  group.guiType = "dropdown";
  group.toString = () => `[${group.guiType}: ${propertyName}]`;

  //allow for programmatic set. API should not be considered stable.
  group.userData.sourceObject = object;
  group.userData.sourcePropertyName = propertyName;
  group.userData.setValue = v => {
    if (options.indexOf(v) === -1) {
      //I could consider annotating GUI itself with error labels...
      console.warn(`dat.GUIVR: Unknown option "${v}" for dropdown "${propertyName}".\nValid options: [${options.join(', ')}]`);
      return;
    }
    object[propertyName] = v;
    if (onChangedCB) onChangedCB(object[propertyName]);
  }

  const panel = Layout.createPanel( width, height, depth );
  group.add( panel );

  group.hitscan = [ panel ];

  const modalDropdown = new THREE.Group();
  modalDropdown.visible = false;
  modalDropdown.hitscan = [];
  const labelInteractions = [];
  const optionLabels = [];

  //  find actually which label is selected
  const initialLabel = findLabelFromProp();



  function findLabelFromProp(){
    if( Array.isArray( options ) ){
      return options.find( function( optionName ){
        return optionName === object[ propertyName ]
      });
    }
    else{
      return Object.keys(options).find( function( optionName ){
        return object[propertyName] === options[ optionName ];
      });
    }
  }

  function createOption( labelText, isOption ){
    //TODO: truncate long labelText, maybe show full version when hovering.
    const label = createTextLabel(
      textCreator, labelText,
      DROPDOWN_WIDTH, depth,
      Colors.DROPDOWN_FG_COLOR, Colors.DROPDOWN_BG_COLOR,
      0.866
    );
    label.back.guiType = 'dropdownOption';
    label.guiType = 'dropdownOption';

    if (isOption) modalDropdown.hitscan.push( label.back );
    else group.hitscan.push( label.back );
    const labelInteraction = createInteraction( label.back );
    labelInteraction.guiType = 'dropdownOption';
    labelInteractions.push( labelInteraction );
    optionLabels.push( label );


    if( isOption ){
      labelInteraction.events.on( 'onPressed', function( p ){
        state.open = modalDropdown.visible;
        selectedLabel.setString( labelText );

        let propertyChanged = false;

        if( Array.isArray( options ) ){
          propertyChanged = object[ propertyName ] !== labelText;
          if( propertyChanged ){
            object[ propertyName ] = labelText;
          }
        }
        else{
          propertyChanged = object[ propertyName ] !== options[ labelText ];
          if( propertyChanged ){
            object[ propertyName ] = options[ labelText ];
          }
        }


        collapseOptions();
        state.open = false;

        if( onChangedCB && propertyChanged ){
          onChangedCB( object[ propertyName ] );
        }
        if ( onChooseCB ){
          onChooseCB( object[ propertyName ]);
        }

        p.locked = true;

      });
    }
    else{
      labelInteraction.events.on( 'onPressed', function( p ){
        state.open = modalDropdown.visible;
        if( state.open === false ){
          openOptions();
        }
        else{
          collapseOptions();
        }

        p.locked = true;
      });
    }
    label.isOption = isOption;
    return label;
  }

  function collapseOptions(){
    state.open = false;
    if (group.folder) group.folder.clearModalEditor(); //should we check if it wasn't set to something else??
  }

  function openOptions(){
    state.open = true;
    group.folder.setModalEditor(modalDropdown);
    //return;
    //label.isOption seems mostly redundant.
    //labels & backs should be added to a group to be used as 'modal editor', 
    //making everything visible / invisible with one property
    //(nb, even though they are now in a group used as 'modal editor', we still need to set visible...
    //see comment in index.js getVisibleHitscanObjects())
    optionLabels.forEach( function( label ){
      if( label.isOption ){
        label.visible = true;
        label.back.visible = true;
      }
    });
  }

  //  base option
  const selectedLabel = createOption( initialLabel || ' ', false );
  selectedLabel.position.x = Layout.PANEL_MARGIN * 0.5 + width * 0.5;
  selectedLabel.position.z = depth;
  
  const downArrow = Graphic.downArrow();
  // Colors.colorizeGeometry( downArrow.geometry, Colors.DROPDOWN_FG_COLOR );
  downArrow.position.set( DROPDOWN_WIDTH - 0.04, 0, depth * 1.01 );
  selectedLabel.add( downArrow );


  function configureLabelPosition( label, index ){
    label.position.y = -DROPDOWN_MARGIN - (index%MAX_DROPDOWN_LABELS_IN_COLUMN+1) * ( DROPDOWN_OPTION_HEIGHT );
    label.position.z = depth;
    label.position.x += DROPDOWN_WIDTH * Math.floor(index / MAX_DROPDOWN_LABELS_IN_COLUMN);
  }

  function optionToLabel( optionName, index ){
    const optionLabel = createOption( optionName, true );
    configureLabelPosition( optionLabel, index );
    return optionLabel;
  }

  selectedLabel.add(modalDropdown);
  if( Array.isArray( options ) ){
    modalDropdown.add(...options.map(optionToLabel));
  }
  else{
    modalDropdown.add( ...Object.keys(options).map( optionToLabel ) );
  }


  collapseOptions();

  const descriptorLabel = textCreator.create( propertyName );
  descriptorLabel.position.x = Layout.PANEL_LABEL_TEXT_MARGIN;
  descriptorLabel.position.z = depth;
  descriptorLabel.position.y = -0.03;

  const controllerID = Layout.createControllerIDBox( height, Colors.CONTROLLER_ID_DROPDOWN );
  controllerID.position.z = depth;


  const borderBox = Layout.createPanel( DROPDOWN_WIDTH + Layout.BORDER_THICKNESS, DROPDOWN_HEIGHT + Layout.BORDER_THICKNESS * 0.5, DROPDOWN_DEPTH, true );
  borderBox.material.color.setHex( 0x1f7ae7 );
  borderBox.position.x = -Layout.BORDER_THICKNESS * 0.5 + width * 0.5;
  borderBox.position.z = depth * 0.5;

  panel.add( descriptorLabel, controllerID, selectedLabel, borderBox );


  updateView();

  function updateView(){

    labelInteractions.forEach( function( interaction, index ){
      const label = optionLabels[ index ];
      if( label.isOption ){
        if( interaction.hovering() ){
          Colors.colorizeGeometry( label.back.geometry, Colors.HIGHLIGHT_COLOR );
        }
        else{
          Colors.colorizeGeometry( label.back.geometry, Colors.DROPDOWN_BG_COLOR );
        }
      }
    });

    state.open = modalDropdown.visible; //as of this writing, this is believed to be reliable, but beware dragons, future reader.
    if( labelInteractions[0].hovering() || state.open ){
      borderBox.visible = true;
    }
    else{
      borderBox.visible = false;
    }
  }

  let onChangedCB;
  let onFinishChangeCB;
  let onChooseCB;

  group.onChange = function( callback ){
    onChangedCB = callback;
    return group;
  };
  group.onChoose = function( callback ){
    onChooseCB = callback;
    return group;
  }

  const grabInteraction = Grab.create( { group, panel } );

  group.listen = function(){
    state.listen = true;
    return group;
  };

  group.updateControl = function( inputObjects ){
    if( state.listen ){
      selectedLabel.setString( findLabelFromProp() );
    }
    labelInteractions.forEach( function( labelInteraction ){
      labelInteraction.update( inputObjects );
    });
    grabInteraction.update( inputObjects );
    updateView();
  };

  group.name = function( str ){
    descriptorLabel.updateLabel( str );
    return group;
  };


  return group;
}