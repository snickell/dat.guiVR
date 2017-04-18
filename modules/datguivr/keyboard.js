/**
 * 
 * TODO: Shift, return, backspace... cursors...
 * Maybe something like mobile input where you switch between letters & numbers / symbols
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
    events.on('keyDown', keyListener);
    const keys = "1234567890-=qwertyuiop[]asdfghjkl;'#\zxcvbnm,./ ".split('');
    const objects = keys.map(k => {
        return { func: () => events.emit('keyDown', k), text: k };
    });
    const grid = createImageButtonGrid({textCreator, objects, columns: 12});
    
    return grid;
}
