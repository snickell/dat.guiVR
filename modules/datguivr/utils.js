/** basic utility functions */

export function isControllerVisible(control) {
  var folder = control.folder;
  //note: the basis on which a controller is considered visible revised for 'header' objects.
  //for now, this should allow header controllers to update while folder is collapsed.
  //only applies to checkbox, pending design revision & fuller implementation...
  if (control.isShownInFolderHeader) return isControllerVisible(folder);
  
  if (!control.visible) return false;
  
  while (folder.folder !== folder){
    if (folder.isCollapsed() || !folder.visible) return false;
    folder = folder.folder;
  }
  if (!folder.parent) return false;
  return folder.visible;
}

/** 
 * Invisible THREE objects incur significant CPU cost.
 * This avoids that by removing them from scene hierarchy.
 * 
 * If visible is true, make sure child.visible=true and is a child of parent.
 * If visible is false, make sure child.visible=false and is removed from scene hierarchy.
 */
export function setVisibility(parent, child, visible) {
    const isChild = parent.children.includes(child);
    child.visible = visible;
    //make sure we use original THREE methods that this library overrides (TODO: refactor...)
    if (visible && !isChild) THREE.Group.prototype.add.call(parent, child);
    if (!visible && isChild) THREE.Group.prototype.remove.call(parent, child);
    if (!parent.visible) console.warn(`setVisibility called on child ${child} of invisible parent ${parent}`);
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

//we need to avoid NaN because of TextGeometry position having itemSize == 2 which upsets Vector3.fromBufferAttribute
//https://github.com/mrdoob/three.js/issues/14352
export function setBoxFromObject(box, obj) {
  const wonkyGeom = [];
  obj.traverse(o => {
    if (o.geometry && o.geometry.isBufferGeometry && o.geometry.attributes.position.itemSize !== 3) {
      o.geometry.isBufferGeometry = false;
      wonkyGeom.push(o.geometry);
    }
  });
  box.setFromObject(obj);
  wonkyGeom.forEach(g => g.isBufferGeometry = true);
  return box;
}
