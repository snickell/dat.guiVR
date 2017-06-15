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

export function getTopLevelFolder(group) {
    var folder = group.folder;
    if (!folder) return group;
    while (folder.folder !== folder) folder = folder.folder;
    return folder;
}

