/** basic utility functions */

export function isControllerVisible(control) {
    if (!control.visible) return false;
    var folder = control.folder;
    while (folder.folder !== folder){
        if (folder.isCollapsed() || !folder.visible) return false;
        folder = folder.folder;
    }
    if (!folder.parent) return false;
    return folder.visible;
}

/**
 * Returns the highest level of parent folder in the gui hiearchy containing a given object.
 * nb. older versions of this function would return the input object if it didn't have a 'folder' property.
 * Now, it is intended that it should either return a folder if appropriate, or nothing.
 * @param {*} group either a folder, or an object whose parent has a folder... apologies, this is not the clearest spec.
 * ... intention is that it should work with any gui element, in particular any hitObject in interaction.js...
 */
export function getTopLevelFolder(group) {
    var folder = group.folder;
    //if (!folder) return group; //??? in this case, it isn't a folder... should we return ~null instead?
    
    //if (!folder) return; //actually seems to work ok for most uses (unit tests would be handy)... 
    //but changing spec for dealing with modal editor interaction...
    
    if (!folder) {
        if (!group.parent || !group.parent.folder) return;
        folder = group.parent.folder;
    }
    
    while (folder.folder !== folder) folder = folder.folder;
    return folder;
}

