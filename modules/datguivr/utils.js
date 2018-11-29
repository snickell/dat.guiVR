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
    var folder = getFolder(group);
    while (folder.folder !== folder) folder = folder.folder;
    return folder;
}

export function getFolder(group) {
    if (group.folder) return group.folder;
    let node = group.parent;
    while (!node.folder && group.parent) node = node.parent;
    return node.folder;
}
