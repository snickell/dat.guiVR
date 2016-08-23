import loadFont from 'load-bmfont';
import Emitter from 'events';

import createSlider from './slider';
import createFolder from './folder';
import * as SDFText from './sdftext';

export default function DATGUIVR(){

  const textMaterial = SDFText.createMaterial();

  const inputObjects = [];
  const controllers = [];

  const events = new Emitter();
  events.setMaxListeners( 100 );

  const DEFAULT_FNT = 'fonts/lucidasansunicode.fnt';

  const guiState = {
    currentHover: undefined,
    currentInteraction: undefined
  };

  loadFont( DEFAULT_FNT, function( err, font ){
    if( err ){
      console.warn( err );
    }
    events.emit( 'fontLoaded', font );
  });

  const textCreator = SDFText.creator( textMaterial, events );

  function addInputObject( object ){
    inputObjects.push( {
      box: new THREE.Box3(),
      object
    });
  }

  function add( object, propertyName, min = 0.0, max = 100.0 ){

    const slider = createSlider( {
      guiState, textCreator, propertyName, object, min, max,
      initialValue: object[ propertyName ]
    });

    controllers.push( slider );

    return slider;
  }

  function addFolder( name ){
    const folder = createFolder({
      guiState, textCreator,
      name
    });

    controllers.push( folder );

    return folder;
  }


  function update() {
    requestAnimationFrame( update );

    inputObjects.forEach( function( set ){
      set.object.updateMatrix();
      set.object.updateMatrixWorld();
      set.box.setFromObject( set.object );
    });

    controllers.forEach( function( controller ){
      controller.update( inputObjects );
    });
  }

  update();

  return {
    addInputObject,
    add,
    addFolder
  };

}

if( window ){
  window.DATGUIVR = DATGUIVR;
}