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

import createInteraction from './interaction';
import {getTopLevelFolder} from './utils';

export function create( { group, panel } = {} ){

  const interaction = createInteraction( panel );

  interaction.events.on( 'onPressed', handleOnPress );
  interaction.events.on( 'tick', handleTick );
  interaction.events.on( 'onReleased', handleOnRelease );

  const tempMatrix = new THREE.Matrix4();
  const tPosition = new THREE.Vector3();

  //let oldParent;
  
  function handleTick( { input } = {} ){
    const folder = getTopLevelFolder(group);
    if( folder === undefined  || folder.grabDisabled ){
      return;
    }

    if( input.mouse ){
      if( input.pressed && input.selected && input.raycast.ray.intersectPlane( input.mousePlane, input.mouseIntersection ) ){
        if( input.interaction.press === interaction ){
          input.mouseIntersection.sub( input.mouseOffset );
                    
          input.selected.parent.updateMatrixWorld();          
          input.selected.parent.worldToLocal(input.mouseIntersection);
          
          //NOTE:: in orthographic mode, we've already mutated the position of folders,
          //meaning there could be some inconsistency with the mouseIntersection point no longer being right...
          //I thought this was playing a role in a bug with orthographic folder layout, appears ok for now.
          folder.position.copy(input.mouseIntersection);

          folder.updateMatrix();
          return;
        }
      }
      else if( input.intersections.length > 0 ){
        const hitObject = input.intersections[ 0 ].object;
        if( hitObject === panel ){
          hitObject.updateMatrixWorld();
          //failing to account for the position not necessarily being the world position?
          tPosition.setFromMatrixPosition( hitObject.matrixWorld );

          input.mousePlane.setFromNormalAndCoplanarPoint( input.mouseCamera.getWorldDirection( input.mousePlane.normal ), tPosition );
          // console.log( input.mousePlane );
        }
      }
    }



  }

  function handleOnPress( p ){

    let { inputObject, input } = p;

    const folder = getTopLevelFolder(group);
    if( folder === undefined ){
      return;
    }

    if( folder.beingMoved === true ){
      return;
    }

    if( input.mouse ){
      if( input.intersections.length > 0 ){
        if( input.raycast.ray.intersectPlane( input.mousePlane, input.mouseIntersection ) ){
          const hitObject = input.intersections[ 0 ].object;
          if( hitObject !== panel ){
            return;
          }

          input.selected = folder;

          if (folder.grabDisabled) return;

          input.selected.updateMatrixWorld();
          tPosition.setFromMatrixPosition( input.selected.matrixWorld );

          input.mouseOffset.copy( input.mouseIntersection ).sub( tPosition );
          // console.log( input.mouseOffset );

        }
      }
    }

    else{
      if (folder.grabDisabled) return;
      
      tempMatrix.getInverse( inputObject.matrixWorld );

      folder.matrix.premultiply( tempMatrix );
      folder.matrix.decompose( folder.position, folder.quaternion, folder.scale );

      folder.oldParent = folder.parent;
      //failing to account for the position not necessarily being the world position?
      inputObject.add( folder ); 
    }

    p.locked = true;

    folder.beingMoved = true;

    input.events.emit( 'grabbed', input );
  }

  function handleOnRelease( p ){

    let { inputObject, input } = p;

    const folder = getTopLevelFolder(group);
    if( folder === undefined ){
      return;
    }

    if( folder.beingMoved === false ){
      return;
    }

    if( input.mouse ){
      input.selected = undefined;
    }
    else{

      if( folder.oldParent === undefined ){
        return;
      }

      folder.matrix.premultiply( inputObject.matrixWorld );
      folder.matrix.decompose( folder.position, folder.quaternion, folder.scale );
      folder.oldParent.add( folder );
      folder.oldParent = undefined;
    }

    folder.beingMoved = false;

    input.events.emit( 'grabReleased', input );
  }

  return interaction;
}