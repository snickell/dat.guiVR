/**
 * 
 * TODO: Shift, return, backspace... cursors...
 * Maybe something like mobile input where you switch between letters & numbers / symbols
 * 
 * Something like a split keyboard ala https://medium.com/aaronn/vr-text-input-split-keyboard-e5bf3fd87a4c
 * might be better.
 * 
 * Peter Todd 2017
 */

import Emitter from 'events';
import createImageButtonGrid from './imagebuttongrid';

export default function createKeyboard( { 
    keyListener,
    textCreator
} = {}) {
    const group = new THREE.Group();

    const events = new Emitter();
    events.on('keyDown', keyListener);
    
    const lowerChars = "1234567890-=qwertyuiop[]asdfghjkl;'#\\zxcvbnm,./ ".split('');
    let objects = lowerChars.map(k => {
        return { func: () => events.emit('keyDown', k), text: k };
    });
    const lowerKeys = createImageButtonGrid({textCreator, objects, columns: 12});
    group.add(lowerKeys);

    const upperChars = "!\"£$%^&*()_+QWERTYUIOP{}ASDFGHJKL:@~|ZXCVBNM<>? ".split('');
    objects = upperChars.map(k => {
        return { func: () => events.emit('keyDown', k), text: k };
    });
    const upperKeys = createImageButtonGrid({textCreator, objects, columns: 12});
    upperKeys.visible = false;
    group.add(upperKeys);

    let shift = false;
    function shiftToggle() {
        shift = !shift;
        lowerKeys.visible = !shift;
        upperKeys.visible = shift;
   }
    
    objects = [
        { text: "shift", func: shiftToggle },
        { text: "backspace", func: () => events.emit('keyDown', '\b') },
        { text: "enter", func: () => events.emit('keyDown', '\n') }
    ]
    const specialKeys = createImageButtonGrid({textCreator, objects, columns: 3, rowHeight: 0.1});
    group.add(specialKeys);
    specialKeys.position.y = -0.5 * (lowerKeys.spacing + specialKeys.spacing);
    group.spacing = lowerKeys.spacing + specialKeys.spacing;

    Object.defineProperty(group, 'hitscan', {
        get: () => [
            specialKeys.hitscan, shift ? upperKeys.hitscan : lowerKeys.hitscan
        ].reduce((a, b) => { return a.concat(b)}, [])
    });

    upperKeys.folder = lowerKeys.folder = specialKeys.folder = group;
    group.updateControl = (inputs) => {
        specialKeys.updateControl(inputs);
        lowerKeys.updateControl(inputs);
        upperKeys.updateControl(inputs);
    };

    return group;
}
