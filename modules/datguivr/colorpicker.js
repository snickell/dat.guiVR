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

//snippet from https://github.com/hughsk/glsl-hsv2rgb/blob/master/index.glsl
//(not going to the lengths of glslify, just copying the function)
const hsv2rgb = `
vec3 hsv2rgb(vec3 c) {
    vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
    vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
    return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}`;

const VertShader = `
varying vec2 vUv;

void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.);
}
`;

const SVFragShader = `
uniform vec3 selectedHSV;
varying vec2 vUv;
${hsv2rgb}

void main() {
    vec3 hsv = vec3(selectedHSV.x, vUv);

    // draw a black circle around selected SV.
    // might look better via separate three object, but shader is less housekeeping
    // need to know aspect ratio if I want it to be a proper circle, though.
    float d = length(selectedHSV.yz - vUv);
    if (d < 0.02 && d > 0.01) hsv.z = 0.;
    gl_FragColor.rgb = hsv2rgb(hsv);
}
`;

const HSliderFragShader = `
uniform vec3 selectedHSV;
varying vec2 vUv;
${hsv2rgb}

void main() {
    // draw a rectangular indicator around selected H
    // might look better via separate three object, but shader is simpler
    float dist = abs(selectedHSV.x - vUv.x);
    bool indicator = dist < 0.01 && dist > 0.005;
    float v = indicator ? 0. : 1.;
    gl_FragColor.rgb = hsv2rgb(vec3(vUv.x, 1., v));
    
}
`;

// http://stackoverflow.com/questions/17242144/javascript-convert-hsb-hsv-color-to-rgb-accurately
/* accepts parameters
 * h  Object = {h:x, s:y, v:z}
 * OR 
 * h, s, v
*/
function HSVtoRGB(h, s, v) {
    var r, g, b, i, f, p, q, t;
    if (arguments.length === 1) {
        //hack to take THREE.Vector3...
        if (h.x !== undefined) s = h.y, v = h.z, h = h.x;
        else s = h.s, v = h.v, h = h.h;
    }
    i = Math.floor(h * 6);
    f = h * 6 - i;
    p = v * (1 - s);
    q = v * (1 - f * s);
    t = v * (1 - (1 - f) * s);
    switch (i % 6) {
        case 0: r = v, g = t, b = p; break;
        case 1: r = q, g = v, b = p; break;
        case 2: r = p, g = v, b = t; break;
        case 3: r = p, g = q, b = v; break;
        case 4: r = t, g = p, b = v; break;
        case 5: r = v, g = p, b = q; break;
    }
    return {
        r: r,
        g: g,
        b: b
    };
}
/* accepts parameters
 * r  Object = {r:x, g:y, b:z}
 * OR 
 * r, g, b
*/
function RGBtoHSV(r, g, b) {
    if (arguments.length === 1) {
        g = r.g, b = r.b, r = r.r;
    }
    var max = Math.max(r, g, b), min = Math.min(r, g, b),
        d = max - min,
        h,
        s = (max === 0 ? 0 : d / max),
        v = max;

    switch (max) {
        case min: h = 0; break;
        case r: h = (g - b) + d * (g < b ? 6: 0); h /= 6 * d; break;
        case g: h = (b - r) + d * 2; h /= 6 * d; break;
        case b: h = (r - g) + d * 4; h /= 6 * d; break;
    }

    return {
        h: h,
        s: s,
        v: v
    };
}

export default function createColorPicker( {
    object,
    propertyName, //must be a THREE.Color for now... should refer to original dat.gui to see what it takes
    textCreator,
    width = Layout.PANEL_WIDTH,
    height = Layout.PANEL_HEIGHT,
    depth = Layout.PANEL_DEPTH / 3.
} = {}) {
    // make the main group be *directly* the one returned by createImageButton;
    // we'll take care of dynamically adding and removing children based on attached...
    // will want to think about listener functions etc.
    let func = toggleDetailPanel;
    const color = object[propertyName]; //for now, this'd better be a THREE.Color or we'll freak out.
    const c = RGBtoHSV(color);
    const uniforms = {selectedHSV: {value: new THREE.Vector3(c.h, c.s, c.v)}};
    const image = new THREE.MeshBasicMaterial({color: color});
    const events = new Emitter();
    const changeColorOnHover = false;
    //TODO make sure color patch occupies full width.  Add text label with hex value?
    const group = createImageButton({
        textCreator, func, image, propertyName, width, height, depth, changeColorOnHover
    });
    group.onHover((x, y)=>{console.log(`${x}, ${y}`)});
    group.guiType = "ColorPicker";
    
    var panel;

    function changeFn() {
        image.color.set(color);
        events.emit('onChange', color);
    }

    const fancyPanel = true;

    function toggleDetailPanel() {
        //why is this ending up getting called twice for one click?
        //is the event attached twice?
        //doesn't happen with other imageButtons, get called back once as expected
        if (panel) {
            panel.visible = !panel.visible;
            panel.position.set(width, 0, 0);
            return;
        } else {
            // For some reason after this is created, 
            console.log("creating colorPicker detail panel");
            // would be handy to have a way to make narrower panel
            panel = dat.GUIVR.create("Color Chooser"); 
            panel.hideGrabber();
            
            if (fancyPanel) {
                const SVMaterial = new THREE.ShaderMaterial({
                    uniforms: uniforms,
                    vertexShader: VertShader,
                    fragmentShader: SVFragShader
                });
                let func = (s, v) => {
                    uniforms.selectedHSV.value.y = s;
                    uniforms.selectedHSV.value.z = v;
                    
                    const c = HSVtoRGB(uniforms.selectedHSV.value);
                    color.setRGB(c.r, c.g, c.b);
                    //console.log(`setSV(${s}, ${v}) => [${c.r}, ${c.g}, ${c.b}]`);
                    changeFn();
                    HMaterial.update();
                };
                let wide = true;
                //TODO: drag...
                panel.addImageButton(func, SVMaterial, wide, Layout.PANEL_WIDTH / 2, depth);
                //panel.addImageButton(func, SVMaterial, wide); // checking square aspect
                const HMaterial = new THREE.ShaderMaterial({
                    uniforms: uniforms,
                    vertexShader: VertShader,
                    fragmentShader: HSliderFragShader
                });
                function setH(h) {
                    uniforms.selectedHSV.value.x = h;
                    const c = HSVtoRGB(uniforms.selectedHSV.value);
                    color.setRGB(c.r, c.g, c.b);
                    //console.log(`setH(${h}) => [${c.r}, ${c.g}, ${c.b}]`);
                    //image.color.setHSL(uniforms.selectedHSV.value);
                    changeFn();
                    HMaterial.update();
                };
                panel.addImageButton(setH, HMaterial, wide, Layout.PANEL_HEIGHT, depth);
            } else {
                panel.add(color, 'r', 0, 1).step(0.01).onChange(changeFn);
                panel.add(color, 'g', 0, 1).step(0.01).onChange(changeFn);
                panel.add(color, 'b', 0, 1).step(0.01).onChange(changeFn);
            }
            group.add(panel);
            panel.position.x = width;
            panel.folder = group.folder;
        }
    }

    group.onChange = (callback) => {
        events.on('onChange', callback);
    }

    return group;
}
