/**
 * This should look like an imagebutton with a solid color MeshBasicMaterial
 * When pressed it could bring up some kind of picker depending on configuration.
 * 
 * For now, just going with RGB sliders as I shouldn't spend too long on this ATM,
 * but very tempted by prospect of an HS square with V slider... 
 * or H slider and SV square which seems to be what dat.gui uses.
 * Or something fancier like a hue circle around an SV triangle etc etc.
 * 
 * 
 * Peter Todd 2017
 */

import Emitter from 'events';
import createImageButton from './imagebutton';
import * as Colors from './colors';
import * as Layout from './layout';
import * as SharedMaterials from './sharedmaterials';
import * as Grab from './grab';

export default function createColorPicker( {
    object,
    propertyName, //must be a THREE.Color for now... should refer to original dat.gui to see what it takes
    textCreator,
    width = Layout.PANEL_WIDTH,
    height = Layout.PANEL_HEIGHT
} = {}) {
    // make the main group be *directly* the one returned by createImageButton;
    // we'll take care of dynamically adding and removing children based on attached...
    // will want to think about listener functions etc.
    let func = toggleDetailPanel;
    const color = object[propertyName]; //for now, this'd better be a THREE.Color or we'll freak out.
    const image = new THREE.MeshBasicMaterial({color: color});
    window.testColorMat = image;
    window.testColorX = color;
    const changeColorOnHover = false;
    const group = createImageButton({
        textCreator, func, image, propertyName, width, height, changeColorOnHover
    });
    group.guiType = "ColorPicker";
    
    var panel;
    function toggleDetailPanel() {
        if (panel) {
            panel.visible = !panel.visible;
            panel.position.set(width, 0, 0);
            return;
        } else {
            // would be handy to have a way to make narrower panel
            panel = dat.GUIVR.create("Color Chooser"); 
            panel.hideGrabber();
            panel.add(color, 'r', 0, 1).step(0.01).onChange(v=>image.color.set(color));
            panel.add(color, 'g', 0, 1).step(0.01).onChange(v=>image.color.set(color));
            panel.add(color, 'b', 0, 1).step(0.01).onChange(v=>image.color.set(color));
            group.add(panel);
            panel.position.x = width;
            panel.folder = group.folder;
        }
    }

    return group;
}
