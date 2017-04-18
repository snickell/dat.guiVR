/**
 * 
 * 
 * 
 * Peter Todd 2017
 */

import Emitter from 'events';
import createImageButtonGrid from './imagebuttongrid';

export default function createKeyboard( { 
    keyListener,
    textCreator
} = {}) {
    const events = new Emitter();
    function keyDown(k) {
        return () => events.emit('keyDown', k);
    }
    events.on('keyDown', keyListener);
    const keys = "1234567890-=qwertyuiop[]asdfghjkl;'#\zxcvbnm,./".split('');
    const objects = keys.map(k => {
        return { func: keyDown(k), text: k };
    });
    const grid = createImageButtonGrid({textCreator, objects, columns: 12});
    
    return grid;
}
