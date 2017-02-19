(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = createButton;

var _SubdivisionModifier = require('../thirdparty/SubdivisionModifier');

var SubdivisionModifier = _interopRequireWildcard(_SubdivisionModifier);

var _textlabel = require('./textlabel');

var _textlabel2 = _interopRequireDefault(_textlabel);

var _interaction = require('./interaction');

var _interaction2 = _interopRequireDefault(_interaction);

var _colors = require('./colors');

var Colors = _interopRequireWildcard(_colors);

var _layout = require('./layout');

var Layout = _interopRequireWildcard(_layout);

var _sharedmaterials = require('./sharedmaterials');

var SharedMaterials = _interopRequireWildcard(_sharedmaterials);

var _grab = require('./grab');

var Grab = _interopRequireWildcard(_grab);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function createButton() {
  var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
      textCreator = _ref.textCreator,
      object = _ref.object,
      _ref$propertyName = _ref.propertyName,
      propertyName = _ref$propertyName === undefined ? 'undefined' : _ref$propertyName,
      _ref$width = _ref.width,
      width = _ref$width === undefined ? Layout.PANEL_WIDTH : _ref$width,
      _ref$height = _ref.height,
      height = _ref$height === undefined ? Layout.PANEL_HEIGHT : _ref$height,
      _ref$depth = _ref.depth,
      depth = _ref$depth === undefined ? Layout.PANEL_DEPTH : _ref$depth;

  var BUTTON_WIDTH = width * 0.5 - Layout.PANEL_MARGIN;
  var BUTTON_HEIGHT = height - Layout.PANEL_MARGIN;
  var BUTTON_DEPTH = Layout.BUTTON_DEPTH;

  var group = new THREE.Group();

  var panel = Layout.createPanel(width, height, depth);
  group.add(panel);

  //  base checkbox
  var divisions = 4;
  var aspectRatio = BUTTON_WIDTH / BUTTON_HEIGHT;
  var rect = new THREE.BoxGeometry(BUTTON_WIDTH, BUTTON_HEIGHT, BUTTON_DEPTH, Math.floor(divisions * aspectRatio), divisions, divisions);
  var modifier = new THREE.SubdivisionModifier(1);
  modifier.modify(rect);
  rect.translate(BUTTON_WIDTH * 0.5, 0, 0);

  //  hitscan volume
  var hitscanMaterial = new THREE.MeshBasicMaterial();
  hitscanMaterial.visible = false;

  var hitscanVolume = new THREE.Mesh(rect.clone(), hitscanMaterial);
  hitscanVolume.position.z = BUTTON_DEPTH * 0.5;
  hitscanVolume.position.x = width * 0.5;

  var material = new THREE.MeshBasicMaterial({ color: Colors.BUTTON_COLOR });
  var filledVolume = new THREE.Mesh(rect.clone(), material);
  hitscanVolume.add(filledVolume);

  var buttonLabel = textCreator.create(propertyName, { scale: 0.866 });

  //  This is a real hack since we need to fit the text position to the font scaling
  //  Please fix me.
  buttonLabel.position.x = BUTTON_WIDTH * 0.5 - buttonLabel.layout.width * 0.000011 * 0.5;
  buttonLabel.position.z = BUTTON_DEPTH * 1.2;
  buttonLabel.position.y = -0.025;
  filledVolume.add(buttonLabel);

  var descriptorLabel = textCreator.create(propertyName);
  descriptorLabel.position.x = Layout.PANEL_LABEL_TEXT_MARGIN;
  descriptorLabel.position.z = depth;
  descriptorLabel.position.y = -0.03;

  var controllerID = Layout.createControllerIDBox(height, Colors.CONTROLLER_ID_BUTTON);
  controllerID.position.z = depth;

  panel.add(descriptorLabel, hitscanVolume, controllerID);

  var interaction = (0, _interaction2.default)(hitscanVolume);
  interaction.events.on('onPressed', handleOnPress);
  interaction.events.on('onReleased', handleOnRelease);

  updateView();

  function handleOnPress(p) {
    if (group.visible === false) {
      return;
    }

    object[propertyName]();

    hitscanVolume.position.z = BUTTON_DEPTH * 0.1;

    p.locked = true;
  }

  function handleOnRelease() {
    hitscanVolume.position.z = BUTTON_DEPTH * 0.5;
  }

  function updateView() {

    if (interaction.hovering()) {
      material.color.setHex(Colors.BUTTON_HIGHLIGHT_COLOR);
    } else {
      material.color.setHex(Colors.BUTTON_COLOR);
    }
  }

  group.interaction = interaction;
  group.hitscan = [hitscanVolume, panel];

  var grabInteraction = Grab.create({ group: group, panel: panel });

  group.update = function (inputObjects) {
    interaction.update(inputObjects);
    grabInteraction.update(inputObjects);
    updateView();
  };

  group.name = function (str) {
    descriptorLabel.update(str);
    return group;
  };

  return group;
} /**
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

},{"../thirdparty/SubdivisionModifier":18,"./colors":3,"./grab":7,"./interaction":11,"./layout":12,"./sharedmaterials":15,"./textlabel":17}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = createCheckbox;

var _textlabel = require('./textlabel');

var _textlabel2 = _interopRequireDefault(_textlabel);

var _interaction = require('./interaction');

var _interaction2 = _interopRequireDefault(_interaction);

var _colors = require('./colors');

var Colors = _interopRequireWildcard(_colors);

var _layout = require('./layout');

var Layout = _interopRequireWildcard(_layout);

var _graphic = require('./graphic');

var Graphic = _interopRequireWildcard(_graphic);

var _sharedmaterials = require('./sharedmaterials');

var SharedMaterials = _interopRequireWildcard(_sharedmaterials);

var _grab = require('./grab');

var Grab = _interopRequireWildcard(_grab);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function createCheckbox() {
  var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
      textCreator = _ref.textCreator,
      object = _ref.object,
      _ref$propertyName = _ref.propertyName,
      propertyName = _ref$propertyName === undefined ? 'undefined' : _ref$propertyName,
      _ref$initialValue = _ref.initialValue,
      initialValue = _ref$initialValue === undefined ? false : _ref$initialValue,
      _ref$width = _ref.width,
      width = _ref$width === undefined ? Layout.PANEL_WIDTH : _ref$width,
      _ref$height = _ref.height,
      height = _ref$height === undefined ? Layout.PANEL_HEIGHT : _ref$height,
      _ref$depth = _ref.depth,
      depth = _ref$depth === undefined ? Layout.PANEL_DEPTH : _ref$depth;

  var CHECKBOX_WIDTH = Layout.CHECKBOX_SIZE;
  var CHECKBOX_HEIGHT = CHECKBOX_WIDTH;
  var CHECKBOX_DEPTH = depth;

  var INACTIVE_SCALE = 0.001;
  var ACTIVE_SCALE = 0.9;

  var state = {
    value: initialValue,
    listen: false
  };

  var group = new THREE.Group();

  var panel = Layout.createPanel(width, height, depth);
  group.add(panel);

  //  base checkbox
  var rect = new THREE.BoxGeometry(CHECKBOX_WIDTH, CHECKBOX_HEIGHT, CHECKBOX_DEPTH);
  rect.translate(CHECKBOX_WIDTH * 0.5, 0, 0);

  //  hitscan volume
  var hitscanMaterial = new THREE.MeshBasicMaterial();
  hitscanMaterial.visible = false;

  var hitscanVolume = new THREE.Mesh(rect.clone(), hitscanMaterial);
  hitscanVolume.position.z = depth;
  hitscanVolume.position.x = width * 0.5;

  //  outline volume
  // const outline = new THREE.BoxHelper( hitscanVolume );
  // outline.material.color.setHex( Colors.OUTLINE_COLOR );

  //  checkbox volume
  var material = new THREE.MeshBasicMaterial({ color: Colors.CHECKBOX_BG_COLOR });
  var filledVolume = new THREE.Mesh(rect.clone(), material);
  // filledVolume.scale.set( ACTIVE_SCALE, ACTIVE_SCALE,ACTIVE_SCALE );
  hitscanVolume.add(filledVolume);

  var descriptorLabel = textCreator.create(propertyName);
  descriptorLabel.position.x = Layout.PANEL_LABEL_TEXT_MARGIN;
  descriptorLabel.position.z = depth;
  descriptorLabel.position.y = -0.03;

  var controllerID = Layout.createControllerIDBox(height, Colors.CONTROLLER_ID_CHECKBOX);
  controllerID.position.z = depth;

  var borderBox = Layout.createPanel(CHECKBOX_WIDTH + Layout.BORDER_THICKNESS, CHECKBOX_HEIGHT + Layout.BORDER_THICKNESS, CHECKBOX_DEPTH, true);
  borderBox.material.color.setHex(0x1f7ae7);
  borderBox.position.x = -Layout.BORDER_THICKNESS * 0.5 + width * 0.5;
  borderBox.position.z = depth * 0.5;

  var checkmark = Graphic.checkmark();
  checkmark.position.z = depth * 0.51;
  hitscanVolume.add(checkmark);

  panel.add(descriptorLabel, hitscanVolume, controllerID, borderBox);

  // group.add( filledVolume, outline, hitscanVolume, descriptorLabel );

  var interaction = (0, _interaction2.default)(hitscanVolume);
  interaction.events.on('onPressed', handleOnPress);

  updateView();

  function handleOnPress(p) {
    if (group.visible === false) {
      return;
    }

    state.value = !state.value;

    object[propertyName] = state.value;

    if (onChangedCB) {
      onChangedCB(state.value);
    }

    p.locked = true;
  }

  function updateView() {

    if (state.value) {
      checkmark.visible = true;
    } else {
      checkmark.visible = false;
    }
    if (interaction.hovering()) {
      borderBox.visible = true;
    } else {
      borderBox.visible = false;
    }
  }

  var onChangedCB = void 0;
  var onFinishChangeCB = void 0;

  group.onChange = function (callback) {
    onChangedCB = callback;
    return group;
  };

  group.interaction = interaction;
  group.hitscan = [hitscanVolume, panel];

  var grabInteraction = Grab.create({ group: group, panel: panel });

  group.listen = function () {
    state.listen = true;
    return group;
  };

  group.name = function (str) {
    descriptorLabel.update(str);
    return group;
  };

  group.update = function (inputObjects) {
    if (state.listen) {
      state.value = object[propertyName];
    }
    interaction.update(inputObjects);
    grabInteraction.update(inputObjects);
    updateView();
  };

  return group;
} /**
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

},{"./colors":3,"./grab":7,"./graphic":8,"./interaction":11,"./layout":12,"./sharedmaterials":15,"./textlabel":17}],3:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.colorizeGeometry = colorizeGeometry;
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

var DEFAULT_COLOR = exports.DEFAULT_COLOR = 0x2FA1D6;
var HIGHLIGHT_COLOR = exports.HIGHLIGHT_COLOR = 0x43b5ea;
var INTERACTION_COLOR = exports.INTERACTION_COLOR = 0x07ABF7;
var EMISSIVE_COLOR = exports.EMISSIVE_COLOR = 0x222222;
var HIGHLIGHT_EMISSIVE_COLOR = exports.HIGHLIGHT_EMISSIVE_COLOR = 0x999999;
var OUTLINE_COLOR = exports.OUTLINE_COLOR = 0x999999;
var DEFAULT_BACK = exports.DEFAULT_BACK = 0x1a1a1a;
var HIGHLIGHT_BACK = exports.HIGHLIGHT_BACK = 0x313131;
var INACTIVE_COLOR = exports.INACTIVE_COLOR = 0x161829;
var CONTROLLER_ID_SLIDER = exports.CONTROLLER_ID_SLIDER = 0x2fa1d6;
var CONTROLLER_ID_CHECKBOX = exports.CONTROLLER_ID_CHECKBOX = 0x806787;
var CONTROLLER_ID_BUTTON = exports.CONTROLLER_ID_BUTTON = 0xe61d5f;
var CONTROLLER_ID_TEXT = exports.CONTROLLER_ID_TEXT = 0x1ed36f;
var CONTROLLER_ID_DROPDOWN = exports.CONTROLLER_ID_DROPDOWN = 0xfff000;
var DROPDOWN_BG_COLOR = exports.DROPDOWN_BG_COLOR = 0xffffff;
var DROPDOWN_FG_COLOR = exports.DROPDOWN_FG_COLOR = 0x000000;
var CHECKBOX_BG_COLOR = exports.CHECKBOX_BG_COLOR = 0xffffff;
var BUTTON_COLOR = exports.BUTTON_COLOR = 0xe61d5f;
var BUTTON_HIGHLIGHT_COLOR = exports.BUTTON_HIGHLIGHT_COLOR = 0xfa3173;
var SLIDER_BG = exports.SLIDER_BG = 0x444444;

function colorizeGeometry(geometry, color) {
  geometry.faces.forEach(function (face) {
    face.color.setHex(color);
  });
  geometry.colorsNeedUpdate = true;
  return geometry;
}

},{}],4:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = createCheckbox;

var _textlabel = require('./textlabel');

var _textlabel2 = _interopRequireDefault(_textlabel);

var _interaction = require('./interaction');

var _interaction2 = _interopRequireDefault(_interaction);

var _colors = require('./colors');

var Colors = _interopRequireWildcard(_colors);

var _layout = require('./layout');

var Layout = _interopRequireWildcard(_layout);

var _graphic = require('./graphic');

var Graphic = _interopRequireWildcard(_graphic);

var _sharedmaterials = require('./sharedmaterials');

var SharedMaterials = _interopRequireWildcard(_sharedmaterials);

var _grab = require('./grab');

var Grab = _interopRequireWildcard(_grab);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } } /**
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

function createCheckbox() {
  var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
      textCreator = _ref.textCreator,
      object = _ref.object,
      _ref$propertyName = _ref.propertyName,
      propertyName = _ref$propertyName === undefined ? 'undefined' : _ref$propertyName,
      _ref$initialValue = _ref.initialValue,
      initialValue = _ref$initialValue === undefined ? false : _ref$initialValue,
      _ref$options = _ref.options,
      options = _ref$options === undefined ? [] : _ref$options,
      _ref$width = _ref.width,
      width = _ref$width === undefined ? Layout.PANEL_WIDTH : _ref$width,
      _ref$height = _ref.height,
      height = _ref$height === undefined ? Layout.PANEL_HEIGHT : _ref$height,
      _ref$depth = _ref.depth,
      depth = _ref$depth === undefined ? Layout.PANEL_DEPTH : _ref$depth;

  var state = {
    open: false,
    listen: false
  };

  var DROPDOWN_WIDTH = width * 0.5 - Layout.PANEL_MARGIN;
  var DROPDOWN_HEIGHT = height - Layout.PANEL_MARGIN;
  var DROPDOWN_DEPTH = depth;
  var DROPDOWN_OPTION_HEIGHT = height - Layout.PANEL_MARGIN * 1.2;
  var DROPDOWN_MARGIN = Layout.PANEL_MARGIN * -0.4;

  var group = new THREE.Group();

  var panel = Layout.createPanel(width, height, depth);
  group.add(panel);

  group.hitscan = [panel];

  var labelInteractions = [];
  var optionLabels = [];

  //  find actually which label is selected
  var initialLabel = findLabelFromProp();

  function findLabelFromProp() {
    if (Array.isArray(options)) {
      return options.find(function (optionName) {
        return optionName === object[propertyName];
      });
    } else {
      return Object.keys(options).find(function (optionName) {
        return object[propertyName] === options[optionName];
      });
    }
  }

  function createOption(labelText, isOption) {
    var label = (0, _textlabel2.default)(textCreator, labelText, DROPDOWN_WIDTH, depth, Colors.DROPDOWN_FG_COLOR, Colors.DROPDOWN_BG_COLOR, 0.866);

    group.hitscan.push(label.back);
    var labelInteraction = (0, _interaction2.default)(label.back);
    labelInteractions.push(labelInteraction);
    optionLabels.push(label);

    if (isOption) {
      labelInteraction.events.on('onPressed', function (p) {
        selectedLabel.setString(labelText);

        var propertyChanged = false;

        if (Array.isArray(options)) {
          propertyChanged = object[propertyName] !== labelText;
          if (propertyChanged) {
            object[propertyName] = labelText;
          }
        } else {
          propertyChanged = object[propertyName] !== options[labelText];
          if (propertyChanged) {
            object[propertyName] = options[labelText];
          }
        }

        collapseOptions();
        state.open = false;

        if (onChangedCB && propertyChanged) {
          onChangedCB(object[propertyName]);
        }

        p.locked = true;
      });
    } else {
      labelInteraction.events.on('onPressed', function (p) {
        if (state.open === false) {
          openOptions();
          state.open = true;
        } else {
          collapseOptions();
          state.open = false;
        }

        p.locked = true;
      });
    }
    label.isOption = isOption;
    return label;
  }

  function collapseOptions() {
    optionLabels.forEach(function (label) {
      if (label.isOption) {
        label.visible = false;
        label.back.visible = false;
      }
    });
  }

  function openOptions() {
    optionLabels.forEach(function (label) {
      if (label.isOption) {
        label.visible = true;
        label.back.visible = true;
      }
    });
  }

  //  base option
  var selectedLabel = createOption(initialLabel, false);
  selectedLabel.position.x = Layout.PANEL_MARGIN * 0.5 + width * 0.5;
  selectedLabel.position.z = depth;

  var downArrow = Graphic.downArrow();
  // Colors.colorizeGeometry( downArrow.geometry, Colors.DROPDOWN_FG_COLOR );
  downArrow.position.set(DROPDOWN_WIDTH - 0.04, 0, depth * 1.01);
  selectedLabel.add(downArrow);

  function configureLabelPosition(label, index) {
    label.position.y = -DROPDOWN_MARGIN - (index + 1) * DROPDOWN_OPTION_HEIGHT;
    label.position.z = depth;
  }

  function optionToLabel(optionName, index) {
    var optionLabel = createOption(optionName, true);
    configureLabelPosition(optionLabel, index);
    return optionLabel;
  }

  if (Array.isArray(options)) {
    selectedLabel.add.apply(selectedLabel, _toConsumableArray(options.map(optionToLabel)));
  } else {
    selectedLabel.add.apply(selectedLabel, _toConsumableArray(Object.keys(options).map(optionToLabel)));
  }

  collapseOptions();

  var descriptorLabel = textCreator.create(propertyName);
  descriptorLabel.position.x = Layout.PANEL_LABEL_TEXT_MARGIN;
  descriptorLabel.position.z = depth;
  descriptorLabel.position.y = -0.03;

  var controllerID = Layout.createControllerIDBox(height, Colors.CONTROLLER_ID_DROPDOWN);
  controllerID.position.z = depth;

  var borderBox = Layout.createPanel(DROPDOWN_WIDTH + Layout.BORDER_THICKNESS, DROPDOWN_HEIGHT + Layout.BORDER_THICKNESS * 0.5, DROPDOWN_DEPTH, true);
  borderBox.material.color.setHex(0x1f7ae7);
  borderBox.position.x = -Layout.BORDER_THICKNESS * 0.5 + width * 0.5;
  borderBox.position.z = depth * 0.5;

  panel.add(descriptorLabel, controllerID, selectedLabel, borderBox);

  updateView();

  function updateView() {

    labelInteractions.forEach(function (interaction, index) {
      var label = optionLabels[index];
      if (label.isOption) {
        if (interaction.hovering()) {
          Colors.colorizeGeometry(label.back.geometry, Colors.HIGHLIGHT_COLOR);
        } else {
          Colors.colorizeGeometry(label.back.geometry, Colors.DROPDOWN_BG_COLOR);
        }
      }
    });

    if (labelInteractions[0].hovering() || state.open) {
      borderBox.visible = true;
    } else {
      borderBox.visible = false;
    }
  }

  var onChangedCB = void 0;
  var onFinishChangeCB = void 0;

  group.onChange = function (callback) {
    onChangedCB = callback;
    return group;
  };

  var grabInteraction = Grab.create({ group: group, panel: panel });

  group.listen = function () {
    state.listen = true;
    return group;
  };

  group.update = function (inputObjects) {
    if (state.listen) {
      selectedLabel.setString(findLabelFromProp());
    }
    labelInteractions.forEach(function (labelInteraction) {
      labelInteraction.update(inputObjects);
    });
    grabInteraction.update(inputObjects);
    updateView();
  };

  group.name = function (str) {
    descriptorLabel.update(str);
    return group;
  };

  return group;
}

},{"./colors":3,"./grab":7,"./graphic":8,"./interaction":11,"./layout":12,"./sharedmaterials":15,"./textlabel":17}],5:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = createFolder;

var _textlabel = require('./textlabel');

var _textlabel2 = _interopRequireDefault(_textlabel);

var _interaction = require('./interaction');

var _interaction2 = _interopRequireDefault(_interaction);

var _colors = require('./colors');

var Colors = _interopRequireWildcard(_colors);

var _layout = require('./layout');

var Layout = _interopRequireWildcard(_layout);

var _graphic = require('./graphic');

var Graphic = _interopRequireWildcard(_graphic);

var _sharedmaterials = require('./sharedmaterials');

var SharedMaterials = _interopRequireWildcard(_sharedmaterials);

var _grab = require('./grab');

var Grab = _interopRequireWildcard(_grab);

var _palette = require('./palette');

var Palette = _interopRequireWildcard(_palette);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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

function createFolder() {
  var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
      textCreator = _ref.textCreator,
      name = _ref.name,
      guiAdd = _ref.guiAdd,
      addSlider = _ref.addSlider,
      addDropdown = _ref.addDropdown,
      addCheckbox = _ref.addCheckbox,
      addButton = _ref.addButton,
      addImageButton = _ref.addImageButton;

  var width = Layout.FOLDER_WIDTH;
  var depth = Layout.PANEL_DEPTH;

  var state = {
    collapsed: false,
    previousParent: undefined
  };

  var group = new THREE.Group();
  var collapseGroup = new THREE.Group();
  group.add(collapseGroup);

  //expose as public interface so that children can call it when their spacing changes
  group.performLayout = performLayout;
  group.isCollapsed = function () {
    return state.collapsed;
  };
  group.folderName = name; //for debugging

  //  Yeah. Gross.
  var addOriginal = THREE.Group.prototype.add;

  function addImpl(o) {
    addOriginal.call(group, o);
  }

  addImpl(collapseGroup);

  var panel = Layout.createPanel(width, Layout.FOLDER_HEIGHT, depth, true);
  addImpl(panel);

  var descriptorLabel = textCreator.create(name);
  descriptorLabel.position.x = Layout.PANEL_LABEL_TEXT_MARGIN * 1.5;
  descriptorLabel.position.y = -0.03;
  descriptorLabel.position.z = depth;
  panel.add(descriptorLabel);

  var downArrow = Layout.createDownArrow();
  Colors.colorizeGeometry(downArrow.geometry, 0xffffff);
  downArrow.position.set(0.05, 0, depth * 1.01);
  panel.add(downArrow);

  var grabber = Layout.createPanel(width, Layout.FOLDER_GRAB_HEIGHT, depth, true);
  grabber.position.y = Layout.FOLDER_HEIGHT * 0.86; //XXX: magic number
  grabber.name = 'grabber';
  addImpl(grabber);

  var grabBar = Graphic.grabBar();
  grabBar.position.set(width * 0.5, 0, depth * 1.001);
  grabber.add(grabBar);
  group.isFolder = true;
  group.hideGrabber = function () {
    grabber.visible = false;
  };

  group.add = function () {
    var newController = guiAdd.apply(undefined, arguments);

    if (newController) {
      group.addController(newController);
      return newController;
    } else {
      return new THREE.Group();
    }
  };

  group.addController = function () {
    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    args.forEach(function (obj) {
      collapseGroup.add(obj);
      obj.folder = group;
      if (obj.isFolder) {
        obj.hideGrabber();
        obj.close();
      }
    });

    performLayout();
  };

  group.addFolder = function () {
    for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      args[_key2] = arguments[_key2];
    }

    args.forEach(function (obj) {
      collapseGroup.add(obj);
      obj.folder = group;
      obj.hideGrabber();
      obj.close();
    });

    performLayout();
  };

  function performLayout() {
    var spacingPerController = Layout.PANEL_HEIGHT + Layout.PANEL_SPACING;
    var emptyFolderSpace = Layout.FOLDER_HEIGHT + Layout.PANEL_SPACING;
    var totalSpacing = emptyFolderSpace;

    collapseGroup.children.forEach(function (c) {
      c.visible = !state.collapsed;
    });

    if (state.collapsed) {
      downArrow.rotation.z = Math.PI * 0.5;
    } else {
      downArrow.rotation.z = 0;

      var y = 0,
          lastHeight = emptyFolderSpace;

      collapseGroup.children.forEach(function (child, i) {
        var h = child.spacing ? child.spacing : spacingPerController;
        // how far to get from the middle of previous to middle of this child?
        // half of the height of previous plus half height of this.
        var spacing = 0.5 * (lastHeight + h);

        if (child.isFolder) {
          // For folders, the origin isn't in the middle of the entire height of the folder,
          // but just the middle of the top panel.
          var offset = 0.5 * (lastHeight + emptyFolderSpace);
          child.position.y = y - offset;
        } else {
          child.position.y = y - spacing;
        }
        // in any case, for use by the next object along we remember 'y' as the middle of the whole panel
        y -= spacing;
        lastHeight = h;
        totalSpacing += h;
        child.position.x = 0.026;
      });
    }

    group.spacing = totalSpacing;

    //make sure parent folder also performs layout.
    if (group.folder !== group) group.folder.performLayout();
  }

  function updateView() {
    if (interaction.hovering()) {
      panel.material.color.setHex(Colors.HIGHLIGHT_BACK);
    } else {
      panel.material.color.setHex(Colors.DEFAULT_BACK);
    }

    if (grabInteraction.hovering()) {
      grabber.material.color.setHex(Colors.HIGHLIGHT_BACK);
    } else {
      grabber.material.color.setHex(Colors.DEFAULT_BACK);
    }
  }

  var interaction = (0, _interaction2.default)(panel);
  interaction.events.on('onPressed', function (p) {
    state.collapsed = !state.collapsed;
    performLayout();
    p.locked = true;
  });

  group.open = function () {
    //should we consider checking if parents are open and automatically open them if not?
    if (!state.collapsed) return;
    state.collapsed = false;
    performLayout();
  };

  group.close = function () {
    if (state.collapsed) return;
    state.collapsed = true;
    performLayout();
  };

  group.folder = group;

  var grabInteraction = Grab.create({ group: group, panel: grabber });
  var paletteInteraction = Palette.create({ group: group, panel: panel });

  group.update = function (inputObjects) {
    interaction.update(inputObjects);
    grabInteraction.update(inputObjects);
    paletteInteraction.update(inputObjects);

    updateView();
  };

  group.name = function (str) {
    descriptorLabel.update(str);
    return group;
  };

  group.hitscan = [panel, grabber];

  group.beingMoved = false;

  group.addSlider = function () {
    var controller = addSlider.apply(undefined, arguments);
    if (controller) {
      group.addController(controller);
      return controller;
    } else {
      return new THREE.Group();
    }
  };
  group.addDropdown = function () {
    var controller = addDropdown.apply(undefined, arguments);
    if (controller) {
      group.addController(controller);
      return controller;
    } else {
      return new THREE.Group();
    }
  };
  group.addCheckbox = function () {
    var controller = addCheckbox.apply(undefined, arguments);
    if (controller) {
      group.addController(controller);
      return controller;
    } else {
      return new THREE.Group();
    }
  };
  group.addButton = function () {
    var controller = addButton.apply(undefined, arguments);
    if (controller) {
      group.addController(controller);
      return controller;
    } else {
      return new THREE.Group();
    }
  };
  group.addImageButton = function () {
    var controller = addImageButton.apply(undefined, arguments);
    if (controller) {
      group.addController(controller);
      return controller;
    } else {
      return new THREE.Group();
    }
  };

  return group;
}

},{"./colors":3,"./grab":7,"./graphic":8,"./interaction":11,"./layout":12,"./palette":13,"./sharedmaterials":15,"./textlabel":17}],6:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.image = image;
exports.fnt = fnt;
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

function image() {
  var image = new Image();
  image.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAgAAAAEACAMAAADyTj5VAAAAjVBMVEVHcEz///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////+umAc7AAAAL3RSTlMAWnJfbnqDWGR4a2ZcYnBRalRLgH6ETnR8UGh2RoZDXlaHSYo8QHU2LyYcFAwFmmUR1OIAAJFhSURBVHhetL2JWmu7jjUKIQkkQLqZvgMCZO2zT/33/R/vSkNDkj2TrOarVd5V6xDP3pJlWdKQ7qaPb6+vrw8vj+PZ/vvrxz///Pj63s/G7/cP2n0/XZ6Op6X8fJHfaG/3j9q5X/LKt/t3v/QfufQk/Xoubolz/Dq5LH7y1nLVl9xeH4b28jidncZy/ZM0P+Wff/7zn//8++9//sG5Uztav3H1inJIXkle8Qvn3+OROP2oj5OPmz7ev+m5PDDFyXan/UwewBd8124ZDn2o3eTBBmCKAzZQfjY75WX//Y+/Kj6Ln77//uF3r24vHyfP5ae9cRRsaH5I/48veQqP5Kh9X9z86wvn+wjhZfmYjTzmyBflSOBz5V1lXO8eH54mw8nzK8dTHsnPepbupwft1Vu+PslvaZPts73FaWxXbp/iUjx/I9SUc3HLqZ2DhntVP0ERfN79q918+/T2uFlO8ew8BW+qw4Rz5RZbOTp5fsJj+dTqFZ/llTAquLc+Em8jA/4dA/S89c95khEh8ZTYm8e3p+0QV9xP5f5fQjU8VLueJ3ite9CT9Lezn5ID+Kp8tB3EmOfdefsl580PY1WMDkaBNFXqH5VjeSSG5HjRdTzq+eAMjP+EL8vHyCSzFzW6LE96Prjv7uVpMup0uluMp7IpuWXb7XQ6wycZttkUb93toI269rHLKa8cbp0UnM2vTxM9t/v88IhzeN3k6SV/4tbyZse9fd4Qfd2JvO7m8eG5W57yDRbArMK5uDveGCT9Qb7IV+zaGM72xxPuPcLpSs8j59nzpBufM3x24nHavtoDhnIP6SXV8N64aDQkPTlRtnb2s99E39RfdRifrrwknbw7bo/JhXlLwelPmciT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";
  return image;
}

function fnt() {
  return "info face=\"Roboto\" size=192 bold=0 italic=0 charset=\"\" unicode=1 stretchH=100 smooth=1 aa=1 padding=24,24,24,24 spacing=12,12 outline=0\ncommon lineHeight=192 base=152 scaleW=3072 scaleH=1536 pages=1 packed=0 alphaChnl=0 redChnl=4 greenChnl=4 blueChnl=4\npage id=0 file=\"roboto_0.png\"\nchars count=194\nchar id=0    x=636   y=1438  width=48    height=49    xoffset=-24   yoffset=167   xadvance=0     page=0  chnl=15\nchar id=2    x=576   y=1438  width=48    height=49    xoffset=-24   yoffset=167   xadvance=0     page=0  chnl=15\nchar id=13   x=450   y=1439  width=51    height=49    xoffset=-25   yoffset=167   xadvance=40    page=0  chnl=15\nchar id=32   x=2987  y=1242  width=51    height=49    xoffset=-25   yoffset=167   xadvance=40    page=0  chnl=15\nchar id=33   x=1714  y=769   width=66    height=163   xoffset=-12   yoffset=14    xadvance=41    page=0  chnl=15\nchar id=34   x=1999  y=1263  width=81    height=87    xoffset=-14   yoffset=8     xadvance=51    page=0  chnl=15\nchar id=35   x=1214  y=951   width=136   height=162   xoffset=-15   yoffset=14    xadvance=99    page=0  chnl=15\nchar id=36   x=1610  y=0     width=122   height=196   xoffset=-16   yoffset=-4    xadvance=90    page=0  chnl=15\nchar id=37   x=1341  y=595   width=152   height=165   xoffset=-17   yoffset=13    xadvance=117   page=0  chnl=15\nchar id=38   x=1658  y=592   width=141   height=165   xoffset=-17   yoffset=13    xadvance=99    page=0  chnl=15\nchar id=39   x=2092  y=1263  width=62    height=85    xoffset=-17   yoffset=8     xadvance=28    page=0  chnl=15\nchar id=40   x=103   y=0     width=90    height=213   xoffset=-14   yoffset=0     xadvance=55    page=0  chnl=15\nchar id=41   x=0     y=0     width=91    height=213   xoffset=-22   yoffset=0     xadvance=56    page=0  chnl=15\nchar id=42   x=664   y=1294  width=114   height=114   xoffset=-23   yoffset=14    xadvance=69    page=0  chnl=15\nchar id=43   x=0     y=1317  width=128   height=129   xoffset=-19   yoffset=34    xadvance=91    page=0  chnl=15\nchar id=44   x=1916  y=1264  width=71    height=88    xoffset=-22   yoffset=111   xadvance=31    page=0  chnl=15\nchar id=45   x=233   y=1457  width=88    height=60    xoffset=-22   yoffset=74    xadvance=44    page=0  chnl=15\nchar id=46   x=2828  y=1245  width=68    height=65    xoffset=-14   yoffset=112   xadvance=42    page=0  chnl=15\nchar id=47   x=0     y=429   width=109   height=172   xoffset=-23   yoffset=14    xadvance=66    page=0  chnl=15\nchar id=48   x=2392  y=583   width=122   height=165   xoffset=-16   yoffset=13    xadvance=90    page=0  chnl=15\nchar id=49   x=112   y=1143  width=93    height=162   xoffset=-11   yoffset=14    xadvance=90    page=0  chnl=15\nchar id=50   x=1443  y=772   width=126   height=163   xoffset=-17   yoffset=13    xadvance=90    page=0  chnl=15\nchar id=51   x=2660  y=575   width=121   height=165   xoffset=-17   yoffset=13    xadvance=90    page=0  chnl=15\nchar id=52   x=1794  y=943   width=132   height=162   xoffset=-21   yoffset=14    xadvance=90    page=0  chnl=15\nchar id=53   x=539   y=779   width=121   height=164   xoffset=-13   yoffset=14    xadvance=90    page=0  chnl=15\nchar id=54   x=406   y=779   width=121   height=164   xoffset=-14   yoffset=14    xadvance=90    page=0  chnl=15\nchar id=55   x=2082  y=941   width=127   height=162   xoffset=-19   yoffset=14    xadvance=90    page=0  chnl=15\nchar id=56   x=2526  y=581   width=122   height=165   xoffset=-16   yoffset=13    xadvance=90    page=0  chnl=15\nchar id=57   x=1581  y=771   width=121   height=163   xoffset=-17   yoffset=13    xadvance=90    page=0  chnl=15\nchar id=58   x=2383  y=1113  width=67    height=134   xoffset=-14   yoffset=43    xadvance=39    page=0  chnl=15\nchar id=59   x=372   y=1140  width=73    height=156   xoffset=-22   yoffset=43    xadvance=34    page=0  chnl=15\nchar id=60   x=539   y=1307  width=113   height=119   xoffset=-19   yoffset=42    xadvance=81    page=0  chnl=15\nchar id=61   x=1688  y=1269  width=115   height=93    xoffset=-13   yoffset=51    xadvance=88    page=0  chnl=15\nchar id=62   x=411   y=1308  width=116   height=119   xoffset=-14   yoffset=42    xadvance=84    page=0  chnl=15\nchar id=63   x=800   y=779   width=113   height=164   xoffset=-19   yoffset=13    xadvance=76    page=0  chnl=15\nchar id=64   x=1421  y=0     width=177   height=196   xoffset=-16   yoffset=16    xadvance=144   page=0  chnl=15\nchar id=65   x=2708  y=752   width=150   height=162   xoffset=-23   yoffset=14    xadvance=104   page=0  chnl=15\nchar id=66   x=2221  y=939   width=127   height=162   xoffset=-12   yoffset=14    xadvance=100   page=0  chnl=15\nchar id=67   x=1811  y=592   width=137   height=165   xoffset=-15   yoffset=13    xadvance=104   page=0  chnl=15\nchar id=68   x=1650  y=946   width=132   height=162   xoffset=-12   yoffset=14    xadvance=105   page=0  chnl=15\nchar id=69   x=2496  y=934   width=122   height=162   xoffset=-12   yoffset=14    xadvance=91    page=0  chnl=15\nchar id=70   x=2630  y=932   width=120   height=162   xoffset=-12   yoffset=14    xadvance=88    page=0  chnl=15\nchar id=71   x=1960  y=590   width=137   height=165   xoffset=-15   yoffset=13    xadvance=109   page=0  chnl=15\nchar id=72   x=916   y=955   width=137   height=162   xoffset=-12   yoffset=14    xadvance=114   page=0  chnl=15\nchar id=73   x=296   y=1142  width=64    height=162   xoffset=-10   yoffset=14    xadvance=44    page=0  chnl=15\nchar id=74   x=272   y=790   width=122   height=164   xoffset=-21   yoffset=14    xadvance=88    page=0  chnl=15\nchar id=75   x=767   y=955   width=137   height=162   xoffset=-12   yoffset=14    xadvance=100   page=0  chnl=15\nchar id=76   x=2762  y=926   width=119   height=162   xoffset=-12   yoffset=14    xadvance=86    page=0  chnl=15\nchar id=77   x=2197  y=765   width=163   height=162   xoffset=-12   yoffset=14    xadvance=140   page=0  chnl=15\nchar id=78   x=1065  y=952   width=137   height=162   xoffset=-12   yoffset=14    xadvance=114   page=0  chnl=15\nchar id=79   x=1505  y=594   width=141   height=165   xoffset=-16   yoffset=13    xadvance=110   page=0  chnl=15\nchar id=80   x=1938  y=943   width=132   height=162   xoffset=-12   yoffset=14    xadvance=101   page=0  chnl=15\nchar id=81   x=2222  y=207   width=141   height=183   xoffset=-16   yoffset=13    xadvance=110   page=0  chnl=15\nchar id=82   x=1362  y=949   width=132   height=162   xoffset=-11   yoffset=14    xadvance=99    page=0  chnl=15\nchar id=83   x=2109  y=588   width=132   height=165   xoffset=-18   yoffset=13    xadvance=95    page=0  chnl=15\nchar id=84   x=617   y=955   width=138   height=162   xoffset=-21   yoffset=14    xadvance=95    page=0  chnl=15\nchar id=85   x=128   y=792   width=132   height=164   xoffset=-14   yoffset=14    xadvance=104   page=0  chnl=15\nchar id=86   x=2870  y=749   width=147   height=162   xoffset=-22   yoffset=14    xadvance=102   page=0  chnl=15\nchar id=87   x=2002  y=767   width=183   height=162   xoffset=-20   yoffset=14    xadvance=142   page=0  chnl=15\nchar id=88   x=312   y=966   width=141   height=162   xoffset=-20   yoffset=14    xadvance=100   page=0  chnl=15\nchar id=89   x=157   y=968   width=143   height=162   xoffset=-24   yoffset=14    xadvance=96    page=0  chnl=15\nchar id=90   x=1506  y=947   width=132   height=162   xoffset=-18   yoffset=14    xadvance=96    page=0  chnl=15\nchar id=91   x=658   y=0     width=79    height=202   xoffset=-13   yoffset=-2    xadvance=42    page=0  chnl=15\nchar id=92   x=2945  y=204   width=111   height=172   xoffset=-22   yoffset=14    xadvance=66    page=0  chnl=15\nchar id=93   x=567   y=0     width=79    height=202   xoffset=-24   yoffset=-2    xadvance=42    page=0  chnl=15\nchar id=94   x=1570  y=1271  width=106   height=105   xoffset=-20   yoffset=14    xadvance=67    page=0  chnl=15\nchar id=95   x=0     y=1458  width=121   height=60    xoffset=-24   yoffset=128   xadvance=72    page=0  chnl=15\nchar id=96   x=2622  y=1258  width=82    height=71    xoffset=-20   yoffset=8     xadvance=49    page=0  chnl=15\nchar id=97   x=1585  y=1121  width=119   height=136   xoffset=-16   yoffset=42    xadvance=87    page=0  chnl=15\nchar id=98   x=677   y=418   width=121   height=170   xoffset=-14   yoffset=8     xadvance=90    page=0  chnl=15\nchar id=99   x=1453  y=1123  width=120   height=136   xoffset=-17   yoffset=42    xadvance=84    page=0  chnl=15\nchar id=100  x=1209  y=413   width=120   height=170   xoffset=-17   yoffset=8     xadvance=90    page=0  chnl=15\nchar id=101  x=1320  y=1125  width=121   height=136   xoffset=-17   yoffset=42    xadvance=85    page=0  chnl=15\nchar id=102  x=1866  y=408   width=101   height=170   xoffset=-20   yoffset=6     xadvance=56    page=0  chnl=15\nchar id=103  x=134   y=612   width=121   height=167   xoffset=-17   yoffset=42    xadvance=90    page=0  chnl=15\nchar id=104  x=2627  y=395   width=116   height=168   xoffset=-14   yoffset=8     xadvance=88    page=0  chnl=15\nchar id=105  x=1050  y=776   width=67    height=164   xoffset=-14   yoffset=12    xadvance=39    page=0  chnl=15\nchar id=106  x=1327  y=0     width=82    height=198   xoffset=-30   yoffset=12    xadvance=38    page=0  chnl=15\nchar id=107  x=2495  y=401   width=120   height=168   xoffset=-14   yoffset=8     xadvance=81    page=0  chnl=15\nchar id=108  x=2755  y=392   width=64    height=168   xoffset=-13   yoffset=8     xadvance=39    page=0  chnl=15\nchar id=109  x=1973  y=1117  width=168   height=134   xoffset=-14   yoffset=42    xadvance=140   page=0  chnl=15\nchar id=110  x=2153  y=1115  width=116   height=134   xoffset=-14   yoffset=42    xadvance=88    page=0  chnl=15\nchar id=111  x=1181  y=1126  width=127   height=136   xoffset=-18   yoffset=42    xadvance=91    page=0  chnl=15\nchar id=112  x=267   y=611   width=121   height=167   xoffset=-14   yoffset=42    xadvance=90    page=0  chnl=15\nchar id=113  x=400   y=600   width=120   height=167   xoffset=-17   yoffset=42    xadvance=91    page=0  chnl=15\nchar id=114  x=2281  y=1113  width=90    height=134   xoffset=-14   yoffset=42    xadvance=54    page=0  chnl=15\nchar id=115  x=1716  y=1120  width=117   height=136   xoffset=-17   yoffset=42    xadvance=83    page=0  chnl=15\nchar id=116  x=457   y=1140  width=95    height=155   xoffset=-24   yoffset=23    xadvance=52    page=0  chnl=15\nchar id=117  x=1845  y=1117  width=116   height=135   xoffset=-14   yoffset=43    xadvance=88    page=0  chnl=15\nchar id=118  x=2772  y=1100  width=122   height=133   xoffset=-22   yoffset=43    xadvance=78    page=0  chnl=15\nchar id=119  x=2462  y=1113  width=163   height=133   xoffset=-22   yoffset=43    xadvance=120   page=0  chnl=15\nchar id=120  x=2637  y=1106  width=123   height=133   xoffset=-22   yoffset=43    xadvance=79    page=0  chnl=15\nchar id=121  x=0     y=613   width=122   height=167   xoffset=-23   yoffset=43    xadvance=76    page=0  chnl=15\nchar id=122  x=2906  y=1097  width=117   height=133   xoffset=-18   yoffset=43    xadvance=79    page=0  chnl=15\nchar id=123  x=458   y=0     width=97    height=202   xoffset=-20   yoffset=3     xadvance=54    page=0  chnl=15\nchar id=124  x=2451  y=206   width=61    height=183   xoffset=-11   yoffset=14    xadvance=39    page=0  chnl=15\nchar id=125  x=349   y=0     width=97    height=202   xoffset=-23   yoffset=3     xadvance=54    page=0  chnl=15\nchar id=126  x=2378  y=1259  width=138   height=79    xoffset=-14   yoffset=65    xadvance=109   page=0  chnl=15\nchar id=160  x=513   y=1439  width=51    height=49    xoffset=-25   yoffset=167   xadvance=40    page=0  chnl=15\nchar id=161  x=217   y=1142  width=67    height=162   xoffset=-14   yoffset=42    xadvance=39    page=0  chnl=15\nchar id=162  x=1341  y=413   width=120   height=170   xoffset=-16   yoffset=25    xadvance=88    page=0  chnl=15\nchar id=163  x=1300  y=774   width=131   height=163   xoffset=-18   yoffset=13    xadvance=93    page=0  chnl=15\nchar id=164  x=702   y=1129  width=149   height=149   xoffset=-17   yoffset=30    xadvance=114   page=0  chnl=15\nchar id=165  x=465   y=955   width=140   height=162   xoffset=-22   yoffset=14    xadvance=97    page=0  chnl=15\nchar id=166  x=2375  y=206   width=64    height=183   xoffset=-13   yoffset=14    xadvance=38    page=0  chnl=15\nchar id=167  x=205   y=0     width=132   height=202   xoffset=-18   yoffset=13    xadvance=98    page=0  chnl=15\nchar id=168  x=2716  y=1251  width=100   height=65    xoffset=-17   yoffset=12    xadvance=67    page=0  chnl=15\nchar id=169  x=995   y=599   width=161   height=165   xoffset=-18   yoffset=13    xadvance=126   page=0  chnl=15\nchar id=170  x=1368  y=1273  width=99    height=109   xoffset=-13   yoffset=13    xadvance=71    page=0  chnl=15\nchar id=171  x=1131  y=1277  width=110   height=110   xoffset=-17   yoffset=54    xadvance=75    page=0  chnl=15\nchar id=172  x=2251  y=1261  width=115   height=81    xoffset=-15   yoffset=65    xadvance=89    page=0  chnl=15\nchar id=173  x=133   y=1458  width=88    height=60    xoffset=-22   yoffset=74    xadvance=44    page=0  chnl=15\nchar id=174  x=1168  y=597   width=161   height=165   xoffset=-18   yoffset=13    xadvance=126   page=0  chnl=15\nchar id=175  x=333   y=1448  width=105   height=59    xoffset=-15   yoffset=14    xadvance=73    page=0  chnl=15\nchar id=176  x=1815  y=1268  width=89    height=88    xoffset=-15   yoffset=13    xadvance=60    page=0  chnl=15\nchar id=177  x=863   y=1129  width=121   height=147   xoffset=-17   yoffset=29    xadvance=85    page=0  chnl=15\nchar id=178  x=899   y=1288  width=97    height=111   xoffset=-19   yoffset=13    xadvance=59    page=0  chnl=15\nchar id=179  x=790   y=1290  width=97    height=112   xoffset=-20   yoffset=13    xadvance=59    page=0  chnl=15\nchar id=180  x=2528  y=1258  width=82    height=71    xoffset=-15   yoffset=8     xadvance=50    page=0  chnl=15\nchar id=181  x=866   y=599   width=117   height=166   xoffset=-13   yoffset=43    xadvance=91    page=0  chnl=15\nchar id=182  x=2893  y=923   width=110   height=162   xoffset=-20   yoffset=14    xadvance=78    page=0  chnl=15\nchar id=183  x=2908  y=1242  width=67    height=65    xoffset=-13   yoffset=62    xadvance=42    page=0  chnl=15\nchar id=184  x=2166  y=1261  width=73    height=82    xoffset=-15   yoffset=128   xadvance=40    page=0  chnl=15\nchar id=185  x=1479  y=1271  width=79    height=109   xoffset=-15   yoffset=14    xadvance=59    page=0  chnl=15\nchar id=186  x=1253  y=1274  width=103   height=109   xoffset=-15   yoffset=13    xadvance=73    page=0  chnl=15\nchar id=187  x=1008  y=1277  width=111   height=110   xoffset=-17   yoffset=54    xadvance=75    page=0  chnl=15\nchar id=188  x=2542  y=758   width=154   height=162   xoffset=-18   yoffset=14    xadvance=117   page=0  chnl=15\nchar id=189  x=2372  y=760   width=158   height=162   xoffset=-18   yoffset=14    xadvance=124   page=0  chnl=15\nchar id=190  x=1129  y=776   width=159   height=163   xoffset=-16   yoffset=13    xadvance=124   page=0  chnl=15\nchar id=191  x=925   y=777   width=113   height=164   xoffset=-19   yoffset=42    xadvance=76    page=0  chnl=15\nchar id=192  x=162   y=225   width=150   height=192   xoffset=-23   yoffset=-16   xadvance=104   page=0  chnl=15\nchar id=193  x=324   y=214   width=150   height=192   xoffset=-23   yoffset=-16   xadvance=104   page=0  chnl=15\nchar id=194  x=0     y=225   width=150   height=192   xoffset=-23   yoffset=-16   xadvance=104   page=0  chnl=15\nchar id=195  x=1359  y=210   width=150   height=190   xoffset=-23   yoffset=-14   xadvance=104   page=0  chnl=15\nchar id=196  x=1814  y=208   width=150   height=188   xoffset=-23   yoffset=-12   xadvance=104   page=0  chnl=15\nchar id=197  x=1016  y=0     width=150   height=199   xoffset=-23   yoffset=-23   xadvance=104   page=0  chnl=15\nchar id=198  x=1792  y=769   width=198   height=162   xoffset=-26   yoffset=14    xadvance=150   page=0  chnl=15\nchar id=199  x=1178  y=0     width=137   height=198   xoffset=-15   yoffset=13    xadvance=104   page=0  chnl=15\nchar id=200  x=2922  y=0     width=122   height=192   xoffset=-12   yoffset=-16   xadvance=91    page=0  chnl=15\nchar id=201  x=641   y=214   width=122   height=192   xoffset=-12   yoffset=-16   xadvance=91    page=0  chnl=15\nchar id=202  x=775   y=213   width=122   height=192   xoffset=-12   yoffset=-16   xadvance=91    page=0  chnl=15\nchar id=203  x=1976  y=207   width=122   height=188   xoffset=-12   yoffset=-12   xadvance=91    page=0  chnl=15\nchar id=204  x=1018  y=211   width=82    height=192   xoffset=-27   yoffset=-16   xadvance=44    page=0  chnl=15\nchar id=205  x=1112  y=211   width=82    height=192   xoffset=-11   yoffset=-16   xadvance=44    page=0  chnl=15\nchar id=206  x=909   y=213   width=97    height=192   xoffset=-27   yoffset=-16   xadvance=44    page=0  chnl=15\nchar id=207  x=2110  y=207   width=100   height=188   xoffset=-28   yoffset=-12   xadvance=44    page=0  chnl=15\nchar id=208  x=0     y=969   width=145   height=162   xoffset=-22   yoffset=14    xadvance=107   page=0  chnl=15\nchar id=209  x=1521  y=208   width=137   height=190   xoffset=-12   yoffset=-14   xadvance=114   page=0  chnl=15\nchar id=210  x=2184  y=0     width=141   height=195   xoffset=-16   yoffset=-17   xadvance=110   page=0  chnl=15\nchar id=211  x=2031  y=0     width=141   height=195   xoffset=-16   yoffset=-17   xadvance=110   page=0  chnl=15\nchar id=212  x=1878  y=0     width=141   height=195   xoffset=-16   yoffset=-17   xadvance=110   page=0  chnl=15\nchar id=213  x=2769  y=0     width=141   height=193   xoffset=-16   yoffset=-15   xadvance=110   page=0  chnl=15\nchar id=214  x=1206  y=210   width=141   height=191   xoffset=-16   yoffset=-13   xadvance=110   page=0  chnl=15\nchar id=215  x=279   y=1316  width=120   height=120   xoffset=-18   yoffset=40    xadvance=85    page=0  chnl=15\nchar id=216  x=2655  y=206   width=143   height=174   xoffset=-16   yoffset=10    xadvance=110   page=0  chnl=15\nchar id=217  x=2625  y=0     width=132   height=194   xoffset=-14   yoffset=-16   xadvance=104   page=0  chnl=15\nchar id=218  x=2481  y=0     width=132   height=194   xoffset=-14   yoffset=-16   xadvance=104   page=0  chnl=15\nchar id=219  x=2337  y=0     width=132   height=194   xoffset=-14   yoffset=-16   xadvance=104   page=0  chnl=15\nchar id=220  x=1670  y=208   width=132   height=190   xoffset=-14   yoffset=-12   xadvance=104   page=0  chnl=15\nchar id=221  x=486   y=214   width=143   height=192   xoffset=-24   yoffset=-16   xadvance=96    page=0  chnl=15\nchar id=222  x=2360  y=939   width=124   height=162   xoffset=-12   yoffset=14    xadvance=95    page=0  chnl=15\nchar id=223  x=121   y=429   width=127   height=171   xoffset=-14   yoffset=7     xadvance=95    page=0  chnl=15\nchar id=224  x=1604  y=410   width=119   height=170   xoffset=-16   yoffset=8     xadvance=87    page=0  chnl=15\nchar id=225  x=1473  y=412   width=119   height=170   xoffset=-16   yoffset=8     xadvance=87    page=0  chnl=15\nchar id=226  x=1735  y=410   width=119   height=170   xoffset=-16   yoffset=8     xadvance=87    page=0  chnl=15\nchar id=227  x=532   y=600   width=119   height=167   xoffset=-16   yoffset=11    xadvance=87    page=0  chnl=15\nchar id=228  x=2926  y=569   width=119   height=165   xoffset=-16   yoffset=13    xadvance=87    page=0  chnl=15\nchar id=229  x=2524  y=206   width=119   height=177   xoffset=-16   yoffset=1     xadvance=87    page=0  chnl=15\nchar id=230  x=996   y=1129  width=173   height=136   xoffset=-19   yoffset=42    xadvance=135   page=0  chnl=15\nchar id=231  x=1979  y=407   width=120   height=169   xoffset=-17   yoffset=42    xadvance=84    page=0  chnl=15\nchar id=232  x=1076  y=415   width=121   height=170   xoffset=-17   yoffset=8     xadvance=85    page=0  chnl=15\nchar id=233  x=943   y=417   width=121   height=170   xoffset=-17   yoffset=8     xadvance=85    page=0  chnl=15\nchar id=234  x=810   y=417   width=121   height=170   xoffset=-17   yoffset=8     xadvance=85    page=0  chnl=15\nchar id=235  x=2793  y=572   width=121   height=165   xoffset=-17   yoffset=13    xadvance=85    page=0  chnl=15\nchar id=236  x=772   y=600   width=82    height=167   xoffset=-29   yoffset=9     xadvance=40    page=0  chnl=15\nchar id=237  x=2970  y=388   width=82    height=167   xoffset=-13   yoffset=9     xadvance=40    page=0  chnl=15\nchar id=238  x=663   y=600   width=97    height=167   xoffset=-29   yoffset=9     xadvance=40    page=0  chnl=15\nchar id=239  x=0     y=1143  width=100   height=162   xoffset=-30   yoffset=14    xadvance=40    page=0  chnl=15\nchar id=240  x=2810  y=205   width=123   height=173   xoffset=-15   yoffset=5     xadvance=94    page=0  chnl=15\nchar id=241  x=0     y=792   width=116   height=165   xoffset=-14   yoffset=11    xadvance=88    page=0  chnl=15\nchar id=242  x=260   y=429   width=127   height=170   xoffset=-18   yoffset=8     xadvance=91    page=0  chnl=15\nchar id=243  x=538   y=418   width=127   height=170   xoffset=-18   yoffset=8     xadvance=91    page=0  chnl=15\nchar id=244  x=399   y=418   width=127   height=170   xoffset=-18   yoffset=8     xadvance=91    page=0  chnl=15\nchar id=245  x=2831  y=390   width=127   height=167   xoffset=-18   yoffset=11    xadvance=91    page=0  chnl=15\nchar id=246  x=2253  y=583   width=127   height=165   xoffset=-18   yoffset=13    xadvance=91    page=0  chnl=15\nchar id=247  x=140   y=1317  width=127   height=128   xoffset=-19   yoffset=34    xadvance=91    page=0  chnl=15\nchar id=248  x=564   y=1129  width=126   height=153   xoffset=-17   yoffset=34    xadvance=91    page=0  chnl=15\nchar id=249  x=2111  y=407   width=116   height=169   xoffset=-14   yoffset=9     xadvance=88    page=0  chnl=15\nchar id=250  x=2239  y=402   width=116   height=169   xoffset=-14   yoffset=9     xadvance=88    page=0  chnl=15\nchar id=251  x=2367  y=402   width=116   height=169   xoffset=-14   yoffset=9     xadvance=88    page=0  chnl=15\nchar id=252  x=672   y=779   width=116   height=164   xoffset=-14   yoffset=14    xadvance=88    page=0  chnl=15\nchar id=253  x=749   y=0     width=122   height=201   xoffset=-23   yoffset=9     xadvance=76    page=0  chnl=15\nchar id=254  x=883   y=0     width=121   height=201   xoffset=-13   yoffset=8     xadvance=92    page=0  chnl=15\nchar id=255  x=1744  y=0     width=122   height=196   xoffset=-23   yoffset=14    xadvance=76    page=0  chnl=15\nkernings count=1686\nkerning first=32  second=84  amount=-3\nkerning first=40  second=86  amount=2\nkerning first=40  second=87  amount=1\nkerning first=40  second=89  amount=2\nkerning first=40  second=221 amount=2\nkerning first=70  second=44  amount=-18\nkerning first=70  second=46  amount=-18\nkerning first=70  second=65  amount=-13\nkerning first=70  second=74  amount=-21\nkerning first=70  second=84  amount=2\nkerning first=70  second=97  amount=-3\nkerning first=70  second=99  amount=-2\nkerning first=70  second=100 amount=-2\nkerning first=70  second=101 amount=-2\nkerning first=70  second=103 amount=-2\nkerning first=70  second=111 amount=-2\nkerning first=70  second=113 amount=-2\nkerning first=70  second=117 amount=-2\nkerning first=70  second=118 amount=-2\nkerning first=70  second=121 amount=-2\nkerning first=70  second=192 amount=-13\nkerning first=70  second=193 amount=-13\nkerning first=70  second=194 amount=-13\nkerning first=70  second=195 amount=-13\nkerning first=70  second=196 amount=-13\nkerning first=70  second=197 amount=-13\nkerning first=70  second=224 amount=-3\nkerning first=70  second=225 amount=-3\nkerning first=70  second=226 amount=-3\nkerning first=70  second=227 amount=-3\nkerning first=70  second=228 amount=-3\nkerning first=70  second=229 amount=-3\nkerning first=70  second=231 amount=-2\nkerning first=70  second=232 amount=-2\nkerning first=70  second=233 amount=-2\nkerning first=70  second=234 amount=-2\nkerning first=70  second=235 amount=-2\nkerning first=70  second=242 amount=-2\nkerning first=70  second=243 amount=-2\nkerning first=70  second=244 amount=-2\nkerning first=70  second=245 amount=-2\nkerning first=70  second=246 amount=-2\nkerning first=70  second=249 amount=-2\nkerning first=70  second=250 amount=-2\nkerning first=70  second=251 amount=-2\nkerning first=70  second=252 amount=-2\nkerning first=70  second=253 amount=-2\nkerning first=70  second=255 amount=-2\nkerning first=81  second=84  amount=-3\nkerning first=81  second=86  amount=-2\nkerning first=81  second=87  amount=-2\nkerning first=81  second=89  amount=-3\nkerning first=81  second=221 amount=-3\nkerning first=82  second=84  amount=-6\nkerning first=82  second=86  amount=-1\nkerning first=82  second=89  amount=-4\nkerning first=82  second=221 amount=-4\nkerning first=91  second=74  amount=-1\nkerning first=91  second=85  amount=-1\nkerning first=91  second=217 amount=-1\nkerning first=91  second=218 amount=-1\nkerning first=91  second=219 amount=-1\nkerning first=91  second=220 amount=-1\nkerning first=102 second=34  amount=1\nkerning first=102 second=39  amount=1\nkerning first=102 second=99  amount=-2\nkerning first=102 second=100 amount=-2\nkerning first=102 second=101 amount=-2\nkerning first=102 second=103 amount=-2\nkerning first=102 second=113 amount=-2\nkerning first=102 second=231 amount=-2\nkerning first=102 second=232 amount=-2\nkerning first=102 second=233 amount=-2\nkerning first=102 second=234 amount=-2\nkerning first=102 second=235 amount=-2\nkerning first=107 second=99  amount=-2\nkerning first=107 second=100 amount=-2\nkerning first=107 second=101 amount=-2\nkerning first=107 second=103 amount=-2\nkerning first=107 second=113 amount=-2\nkerning first=107 second=231 amount=-2\nkerning first=107 second=232 amount=-2\nkerning first=107 second=233 amount=-2\nkerning first=107 second=234 amount=-2\nkerning first=107 second=235 amount=-2\nkerning first=116 second=111 amount=-2\nkerning first=116 second=242 amount=-2\nkerning first=116 second=243 amount=-2\nkerning first=116 second=244 amount=-2\nkerning first=116 second=245 amount=-2\nkerning first=116 second=246 amount=-2\nkerning first=119 second=44  amount=-10\nkerning first=119 second=46  amount=-10\nkerning first=123 second=74  amount=-2\nkerning first=123 second=85  amount=-2\nkerning first=123 second=217 amount=-2\nkerning first=123 second=218 amount=-2\nkerning first=123 second=219 amount=-2\nkerning first=123 second=220 amount=-2\nkerning first=34  second=34  amount=-8\nkerning first=34  second=39  amount=-8\nkerning first=34  second=111 amount=-5\nkerning first=34  second=242 amount=-5\nkerning first=34  second=243 amount=-5\nkerning first=34  second=244 amount=-5\nkerning first=34  second=245 amount=-5\nkerning first=34  second=246 amount=-5\nkerning first=34  second=65  amount=-9\nkerning first=34  second=192 amount=-9\nkerning first=34  second=193 amount=-9\nkerning first=34  second=194 amount=-9\nkerning first=34  second=195 amount=-9\nkerning first=34  second=196 amount=-9\nkerning first=34  second=197 amount=-9\nkerning first=34  second=99  amount=-5\nkerning first=34  second=100 amount=-5\nkerning first=34  second=101 amount=-5\nkerning first=34  second=103 amount=-5\nkerning first=34  second=113 amount=-5\nkerning first=34  second=231 amount=-5\nkerning first=34  second=232 amount=-5\nkerning first=34  second=233 amount=-5\nkerning first=34  second=234 amount=-5\nkerning first=34  second=235 amount=-5\nkerning first=34  second=109 amount=-2\nkerning first=34  second=110 amount=-2\nkerning first=34  second=112 amount=-2\nkerning first=34  second=241 amount=-2\nkerning first=34  second=97  amount=-4\nkerning first=34  second=224 amount=-4\nkerning first=34  second=225 amount=-4\nkerning first=34  second=226 amount=-4\nkerning first=34  second=227 amount=-4\nkerning first=34  second=228 amount=-4\nkerning first=34  second=229 amount=-4\nkerning first=34  second=115 amount=-6\nkerning first=39  second=34  amount=-8\nkerning first=39  second=39  amount=-8\nkerning first=39  second=111 amount=-5\nkerning first=39  second=242 amount=-5\nkerning first=39  second=243 amount=-5\nkerning first=39  second=244 amount=-5\nkerning first=39  second=245 amount=-5\nkerning first=39  second=246 amount=-5\nkerning first=39  second=65  amount=-9\nkerning first=39  second=192 amount=-9\nkerning first=39  second=193 amount=-9\nkerning first=39  second=194 amount=-9\nkerning first=39  second=195 amount=-9\nkerning first=39  second=196 amount=-9\nkerning first=39  second=197 amount=-9\nkerning first=39  second=99  amount=-5\nkerning first=39  second=100 amount=-5\nkerning first=39  second=101 amount=-5\nkerning first=39  second=103 amount=-5\nkerning first=39  second=113 amount=-5\nkerning first=39  second=231 amount=-5\nkerning first=39  second=232 amount=-5\nkerning first=39  second=233 amount=-5\nkerning first=39  second=234 amount=-5\nkerning first=39  second=235 amount=-5\nkerning first=39  second=109 amount=-2\nkerning first=39  second=110 amount=-2\nkerning first=39  second=112 amount=-2\nkerning first=39  second=241 amount=-2\nkerning first=39  second=97  amount=-4\nkerning first=39  second=224 amount=-4\nkerning first=39  second=225 amount=-4\nkerning first=39  second=226 amount=-4\nkerning first=39  second=227 amount=-4\nkerning first=39  second=228 amount=-4\nkerning first=39  second=229 amount=-4\nkerning first=39  second=115 amount=-6\nkerning first=44  second=34  amount=-13\nkerning first=44  second=39  amount=-13\nkerning first=46  second=34  amount=-13\nkerning first=46  second=39  amount=-13\nkerning first=65  second=118 amount=-4\nkerning first=65  second=121 amount=-4\nkerning first=65  second=253 amount=-4\nkerning first=65  second=255 amount=-4\nkerning first=65  second=67  amount=-1\nkerning first=65  second=71  amount=-1\nkerning first=65  second=79  amount=-1\nkerning first=65  second=81  amount=-1\nkerning first=65  second=216 amount=-1\nkerning first=65  second=199 amount=-1\nkerning first=65  second=210 amount=-1\nkerning first=65  second=211 amount=-1\nkerning first=65  second=212 amount=-1\nkerning first=65  second=213 amount=-1\nkerning first=65  second=214 amount=-1\nkerning first=65  second=85  amount=-1\nkerning first=65  second=217 amount=-1\nkerning first=65  second=218 amount=-1\nkerning first=65  second=219 amount=-1\nkerning first=65  second=220 amount=-1\nkerning first=65  second=34  amount=-9\nkerning first=65  second=39  amount=-9\nkerning first=65  second=111 amount=-1\nkerning first=65  second=242 amount=-1\nkerning first=65  second=243 amount=-1\nkerning first=65  second=244 amount=-1\nkerning first=65  second=245 amount=-1\nkerning first=65  second=246 amount=-1\nkerning first=65  second=87  amount=-5\nkerning first=65  second=84  amount=-10\nkerning first=65  second=117 amount=-1\nkerning first=65  second=249 amount=-1\nkerning first=65  second=250 amount=-1\nkerning first=65  second=251 amount=-1\nkerning first=65  second=252 amount=-1\nkerning first=65  second=122 amount=1\nkerning first=65  second=86  amount=-7\nkerning first=65  second=89  amount=-7\nkerning first=65  second=221 amount=-7\nkerning first=66  second=84  amount=-2\nkerning first=66  second=86  amount=-2\nkerning first=66  second=89  amount=-4\nkerning first=66  second=221 amount=-4\nkerning first=67  second=84  amount=-2\nkerning first=68  second=84  amount=-2\nkerning first=68  second=86  amount=-2\nkerning first=68  second=89  amount=-3\nkerning first=68  second=221 amount=-3\nkerning first=68  second=65  amount=-2\nkerning first=68  second=192 amount=-2\nkerning first=68  second=193 amount=-2\nkerning first=68  second=194 amount=-2\nkerning first=68  second=195 amount=-2\nkerning first=68  second=196 amount=-2\nkerning first=68  second=197 amount=-2\nkerning first=68  second=88  amount=-2\nkerning first=68  second=44  amount=-8\nkerning first=68  second=46  amount=-8\nkerning first=68  second=90  amount=-2\nkerning first=69  second=118 amount=-2\nkerning first=69  second=121 amount=-2\nkerning first=69  second=253 amount=-2\nkerning first=69  second=255 amount=-2\nkerning first=69  second=111 amount=-1\nkerning first=69  second=242 amount=-1\nkerning first=69  second=243 amount=-1\nkerning first=69  second=244 amount=-1\nkerning first=69  second=245 amount=-1\nkerning first=69  second=246 amount=-1\nkerning first=69  second=84  amount=2\nkerning first=69  second=117 amount=-1\nkerning first=69  second=249 amount=-1\nkerning first=69  second=250 amount=-1\nkerning first=69  second=251 amount=-1\nkerning first=69  second=252 amount=-1\nkerning first=69  second=99  amount=-1\nkerning first=69  second=100 amount=-1\nkerning first=69  second=101 amount=-1\nkerning first=69  second=103 amount=-1\nkerning first=69  second=113 amount=-1\nkerning first=69  second=231 amount=-1\nkerning first=69  second=232 amount=-1\nkerning first=69  second=233 amount=-1\nkerning first=69  second=234 amount=-1\nkerning first=69  second=235 amount=-1\nkerning first=72  second=84  amount=-2\nkerning first=72  second=89  amount=-2\nkerning first=72  second=221 amount=-2\nkerning first=72  second=65  amount=1\nkerning first=72  second=192 amount=1\nkerning first=72  second=193 amount=1\nkerning first=72  second=194 amount=1\nkerning first=72  second=195 amount=1\nkerning first=72  second=196 amount=1\nkerning first=72  second=197 amount=1\nkerning first=72  second=88  amount=1\nkerning first=73  second=84  amount=-2\nkerning first=73  second=89  amount=-2\nkerning first=73  second=221 amount=-2\nkerning first=73  second=65  amount=1\nkerning first=73  second=192 amount=1\nkerning first=73  second=193 amount=1\nkerning first=73  second=194 amount=1\nkerning first=73  second=195 amount=1\nkerning first=73  second=196 amount=1\nkerning first=73  second=197 amount=1\nkerning first=73  second=88  amount=1\nkerning first=74  second=65  amount=-2\nkerning first=74  second=192 amount=-2\nkerning first=74  second=193 amount=-2\nkerning first=74  second=194 amount=-2\nkerning first=74  second=195 amount=-2\nkerning first=74  second=196 amount=-2\nkerning first=74  second=197 amount=-2\nkerning first=75  second=118 amount=-3\nkerning first=75  second=121 amount=-3\nkerning first=75  second=253 amount=-3\nkerning first=75  second=255 amount=-3\nkerning first=75  second=67  amount=-2\nkerning first=75  second=71  amount=-2\nkerning first=75  second=79  amount=-2\nkerning first=75  second=81  amount=-2\nkerning first=75  second=216 amount=-2\nkerning first=75  second=199 amount=-2\nkerning first=75  second=210 amount=-2\nkerning first=75  second=211 amount=-2\nkerning first=75  second=212 amount=-2\nkerning first=75  second=213 amount=-2\nkerning first=75  second=214 amount=-2\nkerning first=75  second=111 amount=-2\nkerning first=75  second=242 amount=-2\nkerning first=75  second=243 amount=-2\nkerning first=75  second=244 amount=-2\nkerning first=75  second=245 amount=-2\nkerning first=75  second=246 amount=-2\nkerning first=75  second=117 amount=-2\nkerning first=75  second=249 amount=-2\nkerning first=75  second=250 amount=-2\nkerning first=75  second=251 amount=-2\nkerning first=75  second=252 amount=-2\nkerning first=75  second=99  amount=-2\nkerning first=75  second=100 amount=-2\nkerning first=75  second=101 amount=-2\nkerning first=75  second=103 amount=-2\nkerning first=75  second=113 amount=-2\nkerning first=75  second=231 amount=-2\nkerning first=75  second=232 amount=-2\nkerning first=75  second=233 amount=-2\nkerning first=75  second=234 amount=-2\nkerning first=75  second=235 amount=-2\nkerning first=75  second=45  amount=-5\nkerning first=75  second=173 amount=-5\nkerning first=75  second=109 amount=-2\nkerning first=75  second=110 amount=-2\nkerning first=75  second=112 amount=-2\nkerning first=75  second=241 amount=-2\nkerning first=76  second=118 amount=-10\nkerning first=76  second=121 amount=-10\nkerning first=76  second=253 amount=-10\nkerning first=76  second=255 amount=-10\nkerning first=76  second=67  amount=-5\nkerning first=76  second=71  amount=-5\nkerning first=76  second=79  amount=-5\nkerning first=76  second=81  amount=-5\nkerning first=76  second=216 amount=-5\nkerning first=76  second=199 amount=-5\nkerning first=76  second=210 amount=-5\nkerning first=76  second=211 amount=-5\nkerning first=76  second=212 amount=-5\nkerning first=76  second=213 amount=-5\nkerning first=76  second=214 amount=-5\nkerning first=76  second=85  amount=-4\nkerning first=76  second=217 amount=-4\nkerning first=76  second=218 amount=-4\nkerning first=76  second=219 amount=-4\nkerning first=76  second=220 amount=-4\nkerning first=76  second=34  amount=-26\nkerning first=76  second=39  amount=-26\nkerning first=76  second=87  amount=-11\nkerning first=76  second=84  amount=-21\nkerning first=76  second=117 amount=-3\nkerning first=76  second=249 amount=-3\nkerning first=76  second=250 amount=-3\nkerning first=76  second=251 amount=-3\nkerning first=76  second=252 amount=-3\nkerning first=76  second=86  amount=-14\nkerning first=76  second=89  amount=-19\nkerning first=76  second=221 amount=-19\nkerning first=76  second=65  amount=1\nkerning first=76  second=192 amount=1\nkerning first=76  second=193 amount=1\nkerning first=76  second=194 amount=1\nkerning first=76  second=195 amount=1\nkerning first=76  second=196 amount=1\nkerning first=76  second=197 amount=1\nkerning first=77  second=84  amount=-2\nkerning first=77  second=89  amount=-2\nkerning first=77  second=221 amount=-2\nkerning first=77  second=65  amount=1\nkerning first=77  second=192 amount=1\nkerning first=77  second=193 amount=1\nkerning first=77  second=194 amount=1\nkerning first=77  second=195 amount=1\nkerning first=77  second=196 amount=1\nkerning first=77  second=197 amount=1\nkerning first=77  second=88  amount=1\nkerning first=78  second=84  amount=-2\nkerning first=78  second=89  amount=-2\nkerning first=78  second=221 amount=-2\nkerning first=78  second=65  amount=1\nkerning first=78  second=192 amount=1\nkerning first=78  second=193 amount=1\nkerning first=78  second=194 amount=1\nkerning first=78  second=195 amount=1\nkerning first=78  second=196 amount=1\nkerning first=78  second=197 amount=1\nkerning first=78  second=88  amount=1\nkerning first=79  second=84  amount=-2\nkerning first=79  second=86  amount=-2\nkerning first=79  second=89  amount=-3\nkerning first=79  second=221 amount=-3\nkerning first=79  second=65  amount=-2\nkerning first=79  second=192 amount=-2\nkerning first=79  second=193 amount=-2\nkerning first=79  second=194 amount=-2\nkerning first=79  second=195 amount=-2\nkerning first=79  second=196 amount=-2\nkerning first=79  second=197 amount=-2\nkerning first=79  second=88  amount=-2\nkerning first=79  second=44  amount=-8\nkerning first=79  second=46  amount=-8\nkerning first=79  second=90  amount=-2\nkerning first=80  second=118 amount=1\nkerning first=80  second=121 amount=1\nkerning first=80  second=253 amount=1\nkerning first=80  second=255 amount=1\nkerning first=80  second=111 amount=-1\nkerning first=80  second=242 amount=-1\nkerning first=80  second=243 amount=-1\nkerning first=80  second=244 amount=-1\nkerning first=80  second=245 amount=-1\nkerning first=80  second=246 amount=-1\nkerning first=80  second=65  amount=-11\nkerning first=80  second=192 amount=-11\nkerning first=80  second=193 amount=-11\nkerning first=80  second=194 amount=-11\nkerning first=80  second=195 amount=-11\nkerning first=80  second=196 amount=-11\nkerning first=80  second=197 amount=-11\nkerning first=80  second=88  amount=-2\nkerning first=80  second=44  amount=-25\nkerning first=80  second=46  amount=-25\nkerning first=80  second=90  amount=-2\nkerning first=80  second=99  amount=-1\nkerning first=80  second=100 amount=-1\nkerning first=80  second=101 amount=-1\nkerning first=80  second=103 amount=-1\nkerning first=80  second=113 amount=-1\nkerning first=80  second=231 amount=-1\nkerning first=80  second=232 amount=-1\nkerning first=80  second=233 amount=-1\nkerning first=80  second=234 amount=-1\nkerning first=80  second=235 amount=-1\nkerning first=80  second=97  amount=-1\nkerning first=80  second=224 amount=-1\nkerning first=80  second=225 amount=-1\nkerning first=80  second=226 amount=-1\nkerning first=80  second=227 amount=-1\nkerning first=80  second=228 amount=-1\nkerning first=80  second=229 amount=-1\nkerning first=80  second=74  amount=-16\nkerning first=84  second=118 amount=-6\nkerning first=84  second=121 amount=-6\nkerning first=84  second=253 amount=-6\nkerning first=84  second=255 amount=-6\nkerning first=84  second=67  amount=-2\nkerning first=84  second=71  amount=-2\nkerning first=84  second=79  amount=-2\nkerning first=84  second=81  amount=-2\nkerning first=84  second=216 amount=-2\nkerning first=84  second=199 amount=-2\nkerning first=84  second=210 amount=-2\nkerning first=84  second=211 amount=-2\nkerning first=84  second=212 amount=-2\nkerning first=84  second=213 amount=-2\nkerning first=84  second=214 amount=-2\nkerning first=84  second=111 amount=-8\nkerning first=84  second=242 amount=-8\nkerning first=84  second=243 amount=-8\nkerning first=84  second=244 amount=-8\nkerning first=84  second=245 amount=-8\nkerning first=84  second=246 amount=-8\nkerning first=84  second=87  amount=1\nkerning first=84  second=84  amount=1\nkerning first=84  second=117 amount=-7\nkerning first=84  second=249 amount=-7\nkerning first=84  second=250 amount=-7\nkerning first=84  second=251 amount=-7\nkerning first=84  second=252 amount=-7\nkerning first=84  second=122 amount=-5\nkerning first=84  second=86  amount=1\nkerning first=84  second=89  amount=1\nkerning first=84  second=221 amount=1\nkerning first=84  second=65  amount=-6\nkerning first=84  second=192 amount=-6\nkerning first=84  second=193 amount=-6\nkerning first=84  second=194 amount=-6\nkerning first=84  second=195 amount=-6\nkerning first=84  second=196 amount=-6\nkerning first=84  second=197 amount=-6\nkerning first=84  second=44  amount=-17\nkerning first=84  second=46  amount=-17\nkerning first=84  second=99  amount=-8\nkerning first=84  second=100 amount=-8\nkerning first=84  second=101 amount=-8\nkerning first=84  second=103 amount=-8\nkerning first=84  second=113 amount=-8\nkerning first=84  second=231 amount=-8\nkerning first=84  second=232 amount=-8\nkerning first=84  second=233 amount=-8\nkerning first=84  second=234 amount=-8\nkerning first=84  second=235 amount=-8\nkerning first=84  second=120 amount=-6\nkerning first=84  second=45  amount=-18\nkerning first=84  second=173 amount=-18\nkerning first=84  second=109 amount=-9\nkerning first=84  second=110 amount=-9\nkerning first=84  second=112 amount=-9\nkerning first=84  second=241 amount=-9\nkerning first=84  second=83  amount=-1\nkerning first=84  second=97  amount=-9\nkerning first=84  second=224 amount=-9\nkerning first=84  second=225 amount=-9\nkerning first=84  second=226 amount=-9\nkerning first=84  second=227 amount=-9\nkerning first=84  second=228 amount=-9\nkerning first=84  second=229 amount=-9\nkerning first=84  second=115 amount=-9\nkerning first=84  second=74  amount=-19\nkerning first=85  second=65  amount=-2\nkerning first=85  second=192 amount=-2\nkerning first=85  second=193 amount=-2\nkerning first=85  second=194 amount=-2\nkerning first=85  second=195 amount=-2\nkerning first=85  second=196 amount=-2\nkerning first=85  second=197 amount=-2\nkerning first=86  second=118 amount=-1\nkerning first=86  second=121 amount=-1\nkerning first=86  second=253 amount=-1\nkerning first=86  second=255 amount=-1\nkerning first=86  second=67  amount=-1\nkerning first=86  second=71  amount=-1\nkerning first=86  second=79  amount=-1\nkerning first=86  second=81  amount=-1\nkerning first=86  second=216 amount=-1\nkerning first=86  second=199 amount=-1\nkerning first=86  second=210 amount=-1\nkerning first=86  second=211 amount=-1\nkerning first=86  second=212 amount=-1\nkerning first=86  second=213 amount=-1\nkerning first=86  second=214 amount=-1\nkerning first=86  second=111 amount=-4\nkerning first=86  second=242 amount=-4\nkerning first=86  second=243 amount=-4\nkerning first=86  second=244 amount=-4\nkerning first=86  second=245 amount=-4\nkerning first=86  second=246 amount=-4\nkerning first=86  second=117 amount=-2\nkerning first=86  second=249 amount=-2\nkerning first=86  second=250 amount=-2\nkerning first=86  second=251 amount=-2\nkerning first=86  second=252 amount=-2\nkerning first=86  second=65  amount=-6\nkerning first=86  second=192 amount=-6\nkerning first=86  second=193 amount=-6\nkerning first=86  second=194 amount=-6\nkerning first=86  second=195 amount=-6\nkerning first=86  second=196 amount=-6\nkerning first=86  second=197 amount=-6\nkerning first=86  second=44  amount=-18\nkerning first=86  second=46  amount=-18\nkerning first=86  second=99  amount=-3\nkerning first=86  second=100 amount=-3\nkerning first=86  second=101 amount=-3\nkerning first=86  second=103 amount=-3\nkerning first=86  second=113 amount=-3\nkerning first=86  second=231 amount=-3\nkerning first=86  second=232 amount=-3\nkerning first=86  second=233 amount=-3\nkerning first=86  second=234 amount=-3\nkerning first=86  second=235 amount=-3\nkerning first=86  second=45  amount=-3\nkerning first=86  second=173 amount=-3\nkerning first=86  second=97  amount=-4\nkerning first=86  second=224 amount=-4\nkerning first=86  second=225 amount=-4\nkerning first=86  second=226 amount=-4\nkerning first=86  second=227 amount=-4\nkerning first=86  second=228 amount=-4\nkerning first=86  second=229 amount=-4\nkerning first=87  second=111 amount=-2\nkerning first=87  second=242 amount=-2\nkerning first=87  second=243 amount=-2\nkerning first=87  second=244 amount=-2\nkerning first=87  second=245 amount=-2\nkerning first=87  second=246 amount=-2\nkerning first=87  second=84  amount=1\nkerning first=87  second=117 amount=-1\nkerning first=87  second=249 amount=-1\nkerning first=87  second=250 amount=-1\nkerning first=87  second=251 amount=-1\nkerning first=87  second=252 amount=-1\nkerning first=87  second=65  amount=-3\nkerning first=87  second=192 amount=-3\nkerning first=87  second=193 amount=-3\nkerning first=87  second=194 amount=-3\nkerning first=87  second=195 amount=-3\nkerning first=87  second=196 amount=-3\nkerning first=87  second=197 amount=-3\nkerning first=87  second=44  amount=-10\nkerning first=87  second=46  amount=-10\nkerning first=87  second=99  amount=-2\nkerning first=87  second=100 amount=-2\nkerning first=87  second=101 amount=-2\nkerning first=87  second=103 amount=-2\nkerning first=87  second=113 amount=-2\nkerning first=87  second=231 amount=-2\nkerning first=87  second=232 amount=-2\nkerning first=87  second=233 amount=-2\nkerning first=87  second=234 amount=-2\nkerning first=87  second=235 amount=-2\nkerning first=87  second=45  amount=-5\nkerning first=87  second=173 amount=-5\nkerning first=87  second=97  amount=-3\nkerning first=87  second=224 amount=-3\nkerning first=87  second=225 amount=-3\nkerning first=87  second=226 amount=-3\nkerning first=87  second=227 amount=-3\nkerning first=87  second=228 amount=-3\nkerning first=87  second=229 amount=-3\nkerning first=88  second=118 amount=-2\nkerning first=88  second=121 amount=-2\nkerning first=88  second=253 amount=-2\nkerning first=88  second=255 amount=-2\nkerning first=88  second=67  amount=-2\nkerning first=88  second=71  amount=-2\nkerning first=88  second=79  amount=-2\nkerning first=88  second=81  amount=-2\nkerning first=88  second=216 amount=-2\nkerning first=88  second=199 amount=-2\nkerning first=88  second=210 amount=-2\nkerning first=88  second=211 amount=-2\nkerning first=88  second=212 amount=-2\nkerning first=88  second=213 amount=-2\nkerning first=88  second=214 amount=-2\nkerning first=88  second=111 amount=-2\nkerning first=88  second=242 amount=-2\nkerning first=88  second=243 amount=-2\nkerning first=88  second=244 amount=-2\nkerning first=88  second=245 amount=-2\nkerning first=88  second=246 amount=-2\nkerning first=88  second=117 amount=-2\nkerning first=88  second=249 amount=-2\nkerning first=88  second=250 amount=-2\nkerning first=88  second=251 amount=-2\nkerning first=88  second=252 amount=-2\nkerning first=88  second=86  amount=1\nkerning first=88  second=99  amount=-2\nkerning first=88  second=100 amount=-2\nkerning first=88  second=101 amount=-2\nkerning first=88  second=103 amount=-2\nkerning first=88  second=113 amount=-2\nkerning first=88  second=231 amount=-2\nkerning first=88  second=232 amount=-2\nkerning first=88  second=233 amount=-2\nkerning first=88  second=234 amount=-2\nkerning first=88  second=235 amount=-2\nkerning first=88  second=45  amount=-4\nkerning first=88  second=173 amount=-4\nkerning first=89  second=118 amount=-2\nkerning first=89  second=121 amount=-2\nkerning first=89  second=253 amount=-2\nkerning first=89  second=255 amount=-2\nkerning first=89  second=67  amount=-2\nkerning first=89  second=71  amount=-2\nkerning first=89  second=79  amount=-2\nkerning first=89  second=81  amount=-2\nkerning first=89  second=216 amount=-2\nkerning first=89  second=199 amount=-2\nkerning first=89  second=210 amount=-2\nkerning first=89  second=211 amount=-2\nkerning first=89  second=212 amount=-2\nkerning first=89  second=213 amount=-2\nkerning first=89  second=214 amount=-2\nkerning first=89  second=85  amount=-7\nkerning first=89  second=217 amount=-7\nkerning first=89  second=218 amount=-7\nkerning first=89  second=219 amount=-7\nkerning first=89  second=220 amount=-7\nkerning first=89  second=111 amount=-5\nkerning first=89  second=242 amount=-5\nkerning first=89  second=243 amount=-5\nkerning first=89  second=244 amount=-5\nkerning first=89  second=245 amount=-5\nkerning first=89  second=246 amount=-5\nkerning first=89  second=87  amount=1\nkerning first=89  second=84  amount=1\nkerning first=89  second=117 amount=-3\nkerning first=89  second=249 amount=-3\nkerning first=89  second=250 amount=-3\nkerning first=89  second=251 amount=-3\nkerning first=89  second=252 amount=-3\nkerning first=89  second=122 amount=-2\nkerning first=89  second=86  amount=1\nkerning first=89  second=89  amount=1\nkerning first=89  second=221 amount=1\nkerning first=89  second=65  amount=-7\nkerning first=89  second=192 amount=-7\nkerning first=89  second=193 amount=-7\nkerning first=89  second=194 amount=-7\nkerning first=89  second=195 amount=-7\nkerning first=89  second=196 amount=-7\nkerning first=89  second=197 amount=-7\nkerning first=89  second=88  amount=1\nkerning first=89  second=44  amount=-16\nkerning first=89  second=46  amount=-16\nkerning first=89  second=99  amount=-5\nkerning first=89  second=100 amount=-5\nkerning first=89  second=101 amount=-5\nkerning first=89  second=103 amount=-5\nkerning first=89  second=113 amount=-5\nkerning first=89  second=231 amount=-5\nkerning first=89  second=232 amount=-5\nkerning first=89  second=233 amount=-5\nkerning first=89  second=234 amount=-5\nkerning first=89  second=235 amount=-5\nkerning first=89  second=120 amount=-2\nkerning first=89  second=45  amount=-4\nkerning first=89  second=173 amount=-4\nkerning first=89  second=109 amount=-3\nkerning first=89  second=110 amount=-3\nkerning first=89  second=112 amount=-3\nkerning first=89  second=241 amount=-3\nkerning first=89  second=83  amount=-1\nkerning first=89  second=97  amount=-6\nkerning first=89  second=224 amount=-6\nkerning first=89  second=225 amount=-6\nkerning first=89  second=226 amount=-6\nkerning first=89  second=227 amount=-6\nkerning first=89  second=228 amount=-6\nkerning first=89  second=229 amount=-6\nkerning first=89  second=115 amount=-5\nkerning first=89  second=74  amount=-7\nkerning first=90  second=118 amount=-2\nkerning first=90  second=121 amount=-2\nkerning first=90  second=253 amount=-2\nkerning first=90  second=255 amount=-2\nkerning first=90  second=67  amount=-2\nkerning first=90  second=71  amount=-2\nkerning first=90  second=79  amount=-2\nkerning first=90  second=81  amount=-2\nkerning first=90  second=216 amount=-2\nkerning first=90  second=199 amount=-2\nkerning first=90  second=210 amount=-2\nkerning first=90  second=211 amount=-2\nkerning first=90  second=212 amount=-2\nkerning first=90  second=213 amount=-2\nkerning first=90  second=214 amount=-2\nkerning first=90  second=111 amount=-2\nkerning first=90  second=242 amount=-2\nkerning first=90  second=243 amount=-2\nkerning first=90  second=244 amount=-2\nkerning first=90  second=245 amount=-2\nkerning first=90  second=246 amount=-2\nkerning first=90  second=117 amount=-1\nkerning first=90  second=249 amount=-1\nkerning first=90  second=250 amount=-1\nkerning first=90  second=251 amount=-1\nkerning first=90  second=252 amount=-1\nkerning first=90  second=65  amount=1\nkerning first=90  second=192 amount=1\nkerning first=90  second=193 amount=1\nkerning first=90  second=194 amount=1\nkerning first=90  second=195 amount=1\nkerning first=90  second=196 amount=1\nkerning first=90  second=197 amount=1\nkerning first=90  second=99  amount=-2\nkerning first=90  second=100 amount=-2\nkerning first=90  second=101 amount=-2\nkerning first=90  second=103 amount=-2\nkerning first=90  second=113 amount=-2\nkerning first=90  second=231 amount=-2\nkerning first=90  second=232 amount=-2\nkerning first=90  second=233 amount=-2\nkerning first=90  second=234 amount=-2\nkerning first=90  second=235 amount=-2\nkerning first=97  second=118 amount=-1\nkerning first=97  second=121 amount=-1\nkerning first=97  second=253 amount=-1\nkerning first=97  second=255 amount=-1\nkerning first=97  second=34  amount=-5\nkerning first=97  second=39  amount=-5\nkerning first=98  second=118 amount=-1\nkerning first=98  second=121 amount=-1\nkerning first=98  second=253 amount=-1\nkerning first=98  second=255 amount=-1\nkerning first=98  second=34  amount=-2\nkerning first=98  second=39  amount=-2\nkerning first=98  second=122 amount=-1\nkerning first=98  second=120 amount=-1\nkerning first=99  second=34  amount=-1\nkerning first=99  second=39  amount=-1\nkerning first=101 second=118 amount=-1\nkerning first=101 second=121 amount=-1\nkerning first=101 second=253 amount=-1\nkerning first=101 second=255 amount=-1\nkerning first=101 second=34  amount=-1\nkerning first=101 second=39  amount=-1\nkerning first=104 second=34  amount=-8\nkerning first=104 second=39  amount=-8\nkerning first=109 second=34  amount=-8\nkerning first=109 second=39  amount=-8\nkerning first=110 second=34  amount=-8\nkerning first=110 second=39  amount=-8\nkerning first=111 second=118 amount=-1\nkerning first=111 second=121 amount=-1\nkerning first=111 second=253 amount=-1\nkerning first=111 second=255 amount=-1\nkerning first=111 second=34  amount=-11\nkerning first=111 second=39  amount=-11\nkerning first=111 second=122 amount=-1\nkerning first=111 second=120 amount=-2\nkerning first=112 second=118 amount=-1\nkerning first=112 second=121 amount=-1\nkerning first=112 second=253 amount=-1\nkerning first=112 second=255 amount=-1\nkerning first=112 second=34  amount=-2\nkerning first=112 second=39  amount=-2\nkerning first=112 second=122 amount=-1\nkerning first=112 second=120 amount=-1\nkerning first=114 second=118 amount=1\nkerning first=114 second=121 amount=1\nkerning first=114 second=253 amount=1\nkerning first=114 second=255 amount=1\nkerning first=114 second=34  amount=1\nkerning first=114 second=39  amount=1\nkerning first=114 second=111 amount=-2\nkerning first=114 second=242 amount=-2\nkerning first=114 second=243 amount=-2\nkerning first=114 second=244 amount=-2\nkerning first=114 second=245 amount=-2\nkerning first=114 second=246 amount=-2\nkerning first=114 second=44  amount=-10\nkerning first=114 second=46  amount=-10\nkerning first=114 second=99  amount=-1\nkerning first=114 second=100 amount=-1\nkerning first=114 second=101 amount=-1\nkerning first=114 second=103 amount=-1\nkerning first=114 second=113 amount=-1\nkerning first=114 second=231 amount=-1\nkerning first=114 second=232 amount=-1\nkerning first=114 second=233 amount=-1\nkerning first=114 second=234 amount=-1\nkerning first=114 second=235 amount=-1\nkerning first=114 second=97  amount=-3\nkerning first=114 second=224 amount=-3\nkerning first=114 second=225 amount=-3\nkerning first=114 second=226 amount=-3\nkerning first=114 second=227 amount=-3\nkerning first=114 second=228 amount=-3\nkerning first=114 second=229 amount=-3\nkerning first=118 second=34  amount=1\nkerning first=118 second=39  amount=1\nkerning first=118 second=111 amount=-1\nkerning first=118 second=242 amount=-1\nkerning first=118 second=243 amount=-1\nkerning first=118 second=244 amount=-1\nkerning first=118 second=245 amount=-1\nkerning first=118 second=246 amount=-1\nkerning first=118 second=44  amount=-8\nkerning first=118 second=46  amount=-8\nkerning first=118 second=99  amount=-1\nkerning first=118 second=100 amount=-1\nkerning first=118 second=101 amount=-1\nkerning first=118 second=103 amount=-1\nkerning first=118 second=113 amount=-1\nkerning first=118 second=231 amount=-1\nkerning first=118 second=232 amount=-1\nkerning first=118 second=233 amount=-1\nkerning first=118 second=234 amount=-1\nkerning first=118 second=235 amount=-1\nkerning first=118 second=97  amount=-1\nkerning first=118 second=224 amount=-1\nkerning first=118 second=225 amount=-1\nkerning first=118 second=226 amount=-1\nkerning first=118 second=227 amount=-1\nkerning first=118 second=228 amount=-1\nkerning first=118 second=229 amount=-1\nkerning first=120 second=111 amount=-2\nkerning first=120 second=242 amount=-2\nkerning first=120 second=243 amount=-2\nkerning first=120 second=244 amount=-2\nkerning first=120 second=245 amount=-2\nkerning first=120 second=246 amount=-2\nkerning first=120 second=99  amount=-2\nkerning first=120 second=100 amount=-2\nkerning first=120 second=101 amount=-2\nkerning first=120 second=103 amount=-2\nkerning first=120 second=113 amount=-2\nkerning first=120 second=231 amount=-2\nkerning first=120 second=232 amount=-2\nkerning first=120 second=233 amount=-2\nkerning first=120 second=234 amount=-2\nkerning first=120 second=235 amount=-2\nkerning first=121 second=34  amount=1\nkerning first=121 second=39  amount=1\nkerning first=121 second=111 amount=-1\nkerning first=121 second=242 amount=-1\nkerning first=121 second=243 amount=-1\nkerning first=121 second=244 amount=-1\nkerning first=121 second=245 amount=-1\nkerning first=121 second=246 amount=-1\nkerning first=121 second=44  amount=-8\nkerning first=121 second=46  amount=-8\nkerning first=121 second=99  amount=-1\nkerning first=121 second=100 amount=-1\nkerning first=121 second=101 amount=-1\nkerning first=121 second=103 amount=-1\nkerning first=121 second=113 amount=-1\nkerning first=121 second=231 amount=-1\nkerning first=121 second=232 amount=-1\nkerning first=121 second=233 amount=-1\nkerning first=121 second=234 amount=-1\nkerning first=121 second=235 amount=-1\nkerning first=121 second=97  amount=-1\nkerning first=121 second=224 amount=-1\nkerning first=121 second=225 amount=-1\nkerning first=121 second=226 amount=-1\nkerning first=121 second=227 amount=-1\nkerning first=121 second=228 amount=-1\nkerning first=121 second=229 amount=-1\nkerning first=122 second=111 amount=-1\nkerning first=122 second=242 amount=-1\nkerning first=122 second=243 amount=-1\nkerning first=122 second=244 amount=-1\nkerning first=122 second=245 amount=-1\nkerning first=122 second=246 amount=-1\nkerning first=122 second=99  amount=-1\nkerning first=122 second=100 amount=-1\nkerning first=122 second=101 amount=-1\nkerning first=122 second=103 amount=-1\nkerning first=122 second=113 amount=-1\nkerning first=122 second=231 amount=-1\nkerning first=122 second=232 amount=-1\nkerning first=122 second=233 amount=-1\nkerning first=122 second=234 amount=-1\nkerning first=122 second=235 amount=-1\nkerning first=254 second=118 amount=-1\nkerning first=254 second=121 amount=-1\nkerning first=254 second=253 amount=-1\nkerning first=254 second=255 amount=-1\nkerning first=254 second=34  amount=-2\nkerning first=254 second=39  amount=-2\nkerning first=254 second=122 amount=-1\nkerning first=254 second=120 amount=-1\nkerning first=208 second=84  amount=-2\nkerning first=208 second=86  amount=-2\nkerning first=208 second=89  amount=-3\nkerning first=208 second=221 amount=-3\nkerning first=208 second=65  amount=-2\nkerning first=208 second=192 amount=-2\nkerning first=208 second=193 amount=-2\nkerning first=208 second=194 amount=-2\nkerning first=208 second=195 amount=-2\nkerning first=208 second=196 amount=-2\nkerning first=208 second=197 amount=-2\nkerning first=208 second=88  amount=-2\nkerning first=208 second=44  amount=-8\nkerning first=208 second=46  amount=-8\nkerning first=208 second=90  amount=-2\nkerning first=192 second=118 amount=-4\nkerning first=192 second=121 amount=-4\nkerning first=192 second=253 amount=-4\nkerning first=192 second=255 amount=-4\nkerning first=192 second=67  amount=-1\nkerning first=192 second=71  amount=-1\nkerning first=192 second=79  amount=-1\nkerning first=192 second=81  amount=-1\nkerning first=192 second=216 amount=-1\nkerning first=192 second=199 amount=-1\nkerning first=192 second=210 amount=-1\nkerning first=192 second=211 amount=-1\nkerning first=192 second=212 amount=-1\nkerning first=192 second=213 amount=-1\nkerning first=192 second=214 amount=-1\nkerning first=192 second=85  amount=-1\nkerning first=192 second=217 amount=-1\nkerning first=192 second=218 amount=-1\nkerning first=192 second=219 amount=-1\nkerning first=192 second=220 amount=-1\nkerning first=192 second=34  amount=-9\nkerning first=192 second=39  amount=-9\nkerning first=192 second=111 amount=-1\nkerning first=192 second=242 amount=-1\nkerning first=192 second=243 amount=-1\nkerning first=192 second=244 amount=-1\nkerning first=192 second=245 amount=-1\nkerning first=192 second=246 amount=-1\nkerning first=192 second=87  amount=-5\nkerning first=192 second=84  amount=-10\nkerning first=192 second=117 amount=-1\nkerning first=192 second=249 amount=-1\nkerning first=192 second=250 amount=-1\nkerning first=192 second=251 amount=-1\nkerning first=192 second=252 amount=-1\nkerning first=192 second=122 amount=1\nkerning first=192 second=86  amount=-7\nkerning first=192 second=89  amount=-7\nkerning first=192 second=221 amount=-7\nkerning first=193 second=118 amount=-4\nkerning first=193 second=121 amount=-4\nkerning first=193 second=253 amount=-4\nkerning first=193 second=255 amount=-4\nkerning first=193 second=67  amount=-1\nkerning first=193 second=71  amount=-1\nkerning first=193 second=79  amount=-1\nkerning first=193 second=81  amount=-1\nkerning first=193 second=216 amount=-1\nkerning first=193 second=199 amount=-1\nkerning first=193 second=210 amount=-1\nkerning first=193 second=211 amount=-1\nkerning first=193 second=212 amount=-1\nkerning first=193 second=213 amount=-1\nkerning first=193 second=214 amount=-1\nkerning first=193 second=85  amount=-1\nkerning first=193 second=217 amount=-1\nkerning first=193 second=218 amount=-1\nkerning first=193 second=219 amount=-1\nkerning first=193 second=220 amount=-1\nkerning first=193 second=34  amount=-9\nkerning first=193 second=39  amount=-9\nkerning first=193 second=111 amount=-1\nkerning first=193 second=242 amount=-1\nkerning first=193 second=243 amount=-1\nkerning first=193 second=244 amount=-1\nkerning first=193 second=245 amount=-1\nkerning first=193 second=246 amount=-1\nkerning first=193 second=87  amount=-5\nkerning first=193 second=84  amount=-10\nkerning first=193 second=117 amount=-1\nkerning first=193 second=249 amount=-1\nkerning first=193 second=250 amount=-1\nkerning first=193 second=251 amount=-1\nkerning first=193 second=252 amount=-1\nkerning first=193 second=122 amount=1\nkerning first=193 second=86  amount=-7\nkerning first=193 second=89  amount=-7\nkerning first=193 second=221 amount=-7\nkerning first=194 second=118 amount=-4\nkerning first=194 second=121 amount=-4\nkerning first=194 second=253 amount=-4\nkerning first=194 second=255 amount=-4\nkerning first=194 second=67  amount=-1\nkerning first=194 second=71  amount=-1\nkerning first=194 second=79  amount=-1\nkerning first=194 second=81  amount=-1\nkerning first=194 second=216 amount=-1\nkerning first=194 second=199 amount=-1\nkerning first=194 second=210 amount=-1\nkerning first=194 second=211 amount=-1\nkerning first=194 second=212 amount=-1\nkerning first=194 second=213 amount=-1\nkerning first=194 second=214 amount=-1\nkerning first=194 second=85  amount=-1\nkerning first=194 second=217 amount=-1\nkerning first=194 second=218 amount=-1\nkerning first=194 second=219 amount=-1\nkerning first=194 second=220 amount=-1\nkerning first=194 second=34  amount=-9\nkerning first=194 second=39  amount=-9\nkerning first=194 second=111 amount=-1\nkerning first=194 second=242 amount=-1\nkerning first=194 second=243 amount=-1\nkerning first=194 second=244 amount=-1\nkerning first=194 second=245 amount=-1\nkerning first=194 second=246 amount=-1\nkerning first=194 second=87  amount=-5\nkerning first=194 second=84  amount=-10\nkerning first=194 second=117 amount=-1\nkerning first=194 second=249 amount=-1\nkerning first=194 second=250 amount=-1\nkerning first=194 second=251 amount=-1\nkerning first=194 second=252 amount=-1\nkerning first=194 second=122 amount=1\nkerning first=194 second=86  amount=-7\nkerning first=194 second=89  amount=-7\nkerning first=194 second=221 amount=-7\nkerning first=195 second=118 amount=-4\nkerning first=195 second=121 amount=-4\nkerning first=195 second=253 amount=-4\nkerning first=195 second=255 amount=-4\nkerning first=195 second=67  amount=-1\nkerning first=195 second=71  amount=-1\nkerning first=195 second=79  amount=-1\nkerning first=195 second=81  amount=-1\nkerning first=195 second=216 amount=-1\nkerning first=195 second=199 amount=-1\nkerning first=195 second=210 amount=-1\nkerning first=195 second=211 amount=-1\nkerning first=195 second=212 amount=-1\nkerning first=195 second=213 amount=-1\nkerning first=195 second=214 amount=-1\nkerning first=195 second=85  amount=-1\nkerning first=195 second=217 amount=-1\nkerning first=195 second=218 amount=-1\nkerning first=195 second=219 amount=-1\nkerning first=195 second=220 amount=-1\nkerning first=195 second=34  amount=-9\nkerning first=195 second=39  amount=-9\nkerning first=195 second=111 amount=-1\nkerning first=195 second=242 amount=-1\nkerning first=195 second=243 amount=-1\nkerning first=195 second=244 amount=-1\nkerning first=195 second=245 amount=-1\nkerning first=195 second=246 amount=-1\nkerning first=195 second=87  amount=-5\nkerning first=195 second=84  amount=-10\nkerning first=195 second=117 amount=-1\nkerning first=195 second=249 amount=-1\nkerning first=195 second=250 amount=-1\nkerning first=195 second=251 amount=-1\nkerning first=195 second=252 amount=-1\nkerning first=195 second=122 amount=1\nkerning first=195 second=86  amount=-7\nkerning first=195 second=89  amount=-7\nkerning first=195 second=221 amount=-7\nkerning first=196 second=118 amount=-4\nkerning first=196 second=121 amount=-4\nkerning first=196 second=253 amount=-4\nkerning first=196 second=255 amount=-4\nkerning first=196 second=67  amount=-1\nkerning first=196 second=71  amount=-1\nkerning first=196 second=79  amount=-1\nkerning first=196 second=81  amount=-1\nkerning first=196 second=216 amount=-1\nkerning first=196 second=199 amount=-1\nkerning first=196 second=210 amount=-1\nkerning first=196 second=211 amount=-1\nkerning first=196 second=212 amount=-1\nkerning first=196 second=213 amount=-1\nkerning first=196 second=214 amount=-1\nkerning first=196 second=85  amount=-1\nkerning first=196 second=217 amount=-1\nkerning first=196 second=218 amount=-1\nkerning first=196 second=219 amount=-1\nkerning first=196 second=220 amount=-1\nkerning first=196 second=34  amount=-9\nkerning first=196 second=39  amount=-9\nkerning first=196 second=111 amount=-1\nkerning first=196 second=242 amount=-1\nkerning first=196 second=243 amount=-1\nkerning first=196 second=244 amount=-1\nkerning first=196 second=245 amount=-1\nkerning first=196 second=246 amount=-1\nkerning first=196 second=87  amount=-5\nkerning first=196 second=84  amount=-10\nkerning first=196 second=117 amount=-1\nkerning first=196 second=249 amount=-1\nkerning first=196 second=250 amount=-1\nkerning first=196 second=251 amount=-1\nkerning first=196 second=252 amount=-1\nkerning first=196 second=122 amount=1\nkerning first=196 second=86  amount=-7\nkerning first=196 second=89  amount=-7\nkerning first=196 second=221 amount=-7\nkerning first=197 second=118 amount=-4\nkerning first=197 second=121 amount=-4\nkerning first=197 second=253 amount=-4\nkerning first=197 second=255 amount=-4\nkerning first=197 second=67  amount=-1\nkerning first=197 second=71  amount=-1\nkerning first=197 second=79  amount=-1\nkerning first=197 second=81  amount=-1\nkerning first=197 second=216 amount=-1\nkerning first=197 second=199 amount=-1\nkerning first=197 second=210 amount=-1\nkerning first=197 second=211 amount=-1\nkerning first=197 second=212 amount=-1\nkerning first=197 second=213 amount=-1\nkerning first=197 second=214 amount=-1\nkerning first=197 second=85  amount=-1\nkerning first=197 second=217 amount=-1\nkerning first=197 second=218 amount=-1\nkerning first=197 second=219 amount=-1\nkerning first=197 second=220 amount=-1\nkerning first=197 second=34  amount=-9\nkerning first=197 second=39  amount=-9\nkerning first=197 second=111 amount=-1\nkerning first=197 second=242 amount=-1\nkerning first=197 second=243 amount=-1\nkerning first=197 second=244 amount=-1\nkerning first=197 second=245 amount=-1\nkerning first=197 second=246 amount=-1\nkerning first=197 second=87  amount=-5\nkerning first=197 second=84  amount=-10\nkerning first=197 second=117 amount=-1\nkerning first=197 second=249 amount=-1\nkerning first=197 second=250 amount=-1\nkerning first=197 second=251 amount=-1\nkerning first=197 second=252 amount=-1\nkerning first=197 second=122 amount=1\nkerning first=197 second=86  amount=-7\nkerning first=197 second=89  amount=-7\nkerning first=197 second=221 amount=-7\nkerning first=199 second=84  amount=-2\nkerning first=200 second=118 amount=-2\nkerning first=200 second=121 amount=-2\nkerning first=200 second=253 amount=-2\nkerning first=200 second=255 amount=-2\nkerning first=200 second=111 amount=-1\nkerning first=200 second=242 amount=-1\nkerning first=200 second=243 amount=-1\nkerning first=200 second=244 amount=-1\nkerning first=200 second=245 amount=-1\nkerning first=200 second=246 amount=-1\nkerning first=200 second=84  amount=2\nkerning first=200 second=117 amount=-1\nkerning first=200 second=249 amount=-1\nkerning first=200 second=250 amount=-1\nkerning first=200 second=251 amount=-1\nkerning first=200 second=252 amount=-1\nkerning first=200 second=99  amount=-1\nkerning first=200 second=100 amount=-1\nkerning first=200 second=101 amount=-1\nkerning first=200 second=103 amount=-1\nkerning first=200 second=113 amount=-1\nkerning first=200 second=231 amount=-1\nkerning first=200 second=232 amount=-1\nkerning first=200 second=233 amount=-1\nkerning first=200 second=234 amount=-1\nkerning first=200 second=235 amount=-1\nkerning first=201 second=118 amount=-2\nkerning first=201 second=121 amount=-2\nkerning first=201 second=253 amount=-2\nkerning first=201 second=255 amount=-2\nkerning first=201 second=111 amount=-1\nkerning first=201 second=242 amount=-1\nkerning first=201 second=243 amount=-1\nkerning first=201 second=244 amount=-1\nkerning first=201 second=245 amount=-1\nkerning first=201 second=246 amount=-1\nkerning first=201 second=84  amount=2\nkerning first=201 second=117 amount=-1\nkerning first=201 second=249 amount=-1\nkerning first=201 second=250 amount=-1\nkerning first=201 second=251 amount=-1\nkerning first=201 second=252 amount=-1\nkerning first=201 second=99  amount=-1\nkerning first=201 second=100 amount=-1\nkerning first=201 second=101 amount=-1\nkerning first=201 second=103 amount=-1\nkerning first=201 second=113 amount=-1\nkerning first=201 second=231 amount=-1\nkerning first=201 second=232 amount=-1\nkerning first=201 second=233 amount=-1\nkerning first=201 second=234 amount=-1\nkerning first=201 second=235 amount=-1\nkerning first=202 second=118 amount=-2\nkerning first=202 second=121 amount=-2\nkerning first=202 second=253 amount=-2\nkerning first=202 second=255 amount=-2\nkerning first=202 second=111 amount=-1\nkerning first=202 second=242 amount=-1\nkerning first=202 second=243 amount=-1\nkerning first=202 second=244 amount=-1\nkerning first=202 second=245 amount=-1\nkerning first=202 second=246 amount=-1\nkerning first=202 second=84  amount=2\nkerning first=202 second=117 amount=-1\nkerning first=202 second=249 amount=-1\nkerning first=202 second=250 amount=-1\nkerning first=202 second=251 amount=-1\nkerning first=202 second=252 amount=-1\nkerning first=202 second=99  amount=-1\nkerning first=202 second=100 amount=-1\nkerning first=202 second=101 amount=-1\nkerning first=202 second=103 amount=-1\nkerning first=202 second=113 amount=-1\nkerning first=202 second=231 amount=-1\nkerning first=202 second=232 amount=-1\nkerning first=202 second=233 amount=-1\nkerning first=202 second=234 amount=-1\nkerning first=202 second=235 amount=-1\nkerning first=203 second=118 amount=-2\nkerning first=203 second=121 amount=-2\nkerning first=203 second=253 amount=-2\nkerning first=203 second=255 amount=-2\nkerning first=203 second=111 amount=-1\nkerning first=203 second=242 amount=-1\nkerning first=203 second=243 amount=-1\nkerning first=203 second=244 amount=-1\nkerning first=203 second=245 amount=-1\nkerning first=203 second=246 amount=-1\nkerning first=203 second=84  amount=2\nkerning first=203 second=117 amount=-1\nkerning first=203 second=249 amount=-1\nkerning first=203 second=250 amount=-1\nkerning first=203 second=251 amount=-1\nkerning first=203 second=252 amount=-1\nkerning first=203 second=99  amount=-1\nkerning first=203 second=100 amount=-1\nkerning first=203 second=101 amount=-1\nkerning first=203 second=103 amount=-1\nkerning first=203 second=113 amount=-1\nkerning first=203 second=231 amount=-1\nkerning first=203 second=232 amount=-1\nkerning first=203 second=233 amount=-1\nkerning first=203 second=234 amount=-1\nkerning first=203 second=235 amount=-1\nkerning first=204 second=84  amount=-2\nkerning first=204 second=89  amount=-2\nkerning first=204 second=221 amount=-2\nkerning first=204 second=65  amount=1\nkerning first=204 second=192 amount=1\nkerning first=204 second=193 amount=1\nkerning first=204 second=194 amount=1\nkerning first=204 second=195 amount=1\nkerning first=204 second=196 amount=1\nkerning first=204 second=197 amount=1\nkerning first=204 second=88  amount=1\nkerning first=205 second=84  amount=-2\nkerning first=205 second=89  amount=-2\nkerning first=205 second=221 amount=-2\nkerning first=205 second=65  amount=1\nkerning first=205 second=192 amount=1\nkerning first=205 second=193 amount=1\nkerning first=205 second=194 amount=1\nkerning first=205 second=195 amount=1\nkerning first=205 second=196 amount=1\nkerning first=205 second=197 amount=1\nkerning first=205 second=88  amount=1\nkerning first=206 second=84  amount=-2\nkerning first=206 second=89  amount=-2\nkerning first=206 second=221 amount=-2\nkerning first=206 second=65  amount=1\nkerning first=206 second=192 amount=1\nkerning first=206 second=193 amount=1\nkerning first=206 second=194 amount=1\nkerning first=206 second=195 amount=1\nkerning first=206 second=196 amount=1\nkerning first=206 second=197 amount=1\nkerning first=206 second=88  amount=1\nkerning first=207 second=84  amount=-2\nkerning first=207 second=89  amount=-2\nkerning first=207 second=221 amount=-2\nkerning first=207 second=65  amount=1\nkerning first=207 second=192 amount=1\nkerning first=207 second=193 amount=1\nkerning first=207 second=194 amount=1\nkerning first=207 second=195 amount=1\nkerning first=207 second=196 amount=1\nkerning first=207 second=197 amount=1\nkerning first=207 second=88  amount=1\nkerning first=209 second=84  amount=-2\nkerning first=209 second=89  amount=-2\nkerning first=209 second=221 amount=-2\nkerning first=209 second=65  amount=1\nkerning first=209 second=192 amount=1\nkerning first=209 second=193 amount=1\nkerning first=209 second=194 amount=1\nkerning first=209 second=195 amount=1\nkerning first=209 second=196 amount=1\nkerning first=209 second=197 amount=1\nkerning first=209 second=88  amount=1\nkerning first=210 second=84  amount=-2\nkerning first=210 second=86  amount=-2\nkerning first=210 second=89  amount=-3\nkerning first=210 second=221 amount=-3\nkerning first=210 second=65  amount=-2\nkerning first=210 second=192 amount=-2\nkerning first=210 second=193 amount=-2\nkerning first=210 second=194 amount=-2\nkerning first=210 second=195 amount=-2\nkerning first=210 second=196 amount=-2\nkerning first=210 second=197 amount=-2\nkerning first=210 second=88  amount=-2\nkerning first=210 second=44  amount=-8\nkerning first=210 second=46  amount=-8\nkerning first=210 second=90  amount=-2\nkerning first=211 second=84  amount=-2\nkerning first=211 second=86  amount=-2\nkerning first=211 second=89  amount=-3\nkerning first=211 second=221 amount=-3\nkerning first=211 second=65  amount=-2\nkerning first=211 second=192 amount=-2\nkerning first=211 second=193 amount=-2\nkerning first=211 second=194 amount=-2\nkerning first=211 second=195 amount=-2\nkerning first=211 second=196 amount=-2\nkerning first=211 second=197 amount=-2\nkerning first=211 second=88  amount=-2\nkerning first=211 second=44  amount=-8\nkerning first=211 second=46  amount=-8\nkerning first=211 second=90  amount=-2\nkerning first=212 second=84  amount=-2\nkerning first=212 second=86  amount=-2\nkerning first=212 second=89  amount=-3\nkerning first=212 second=221 amount=-3\nkerning first=212 second=65  amount=-2\nkerning first=212 second=192 amount=-2\nkerning first=212 second=193 amount=-2\nkerning first=212 second=194 amount=-2\nkerning first=212 second=195 amount=-2\nkerning first=212 second=196 amount=-2\nkerning first=212 second=197 amount=-2\nkerning first=212 second=88  amount=-2\nkerning first=212 second=44  amount=-8\nkerning first=212 second=46  amount=-8\nkerning first=212 second=90  amount=-2\nkerning first=213 second=84  amount=-2\nkerning first=213 second=86  amount=-2\nkerning first=213 second=89  amount=-3\nkerning first=213 second=221 amount=-3\nkerning first=213 second=65  amount=-2\nkerning first=213 second=192 amount=-2\nkerning first=213 second=193 amount=-2\nkerning first=213 second=194 amount=-2\nkerning first=213 second=195 amount=-2\nkerning first=213 second=196 amount=-2\nkerning first=213 second=197 amount=-2\nkerning first=213 second=88  amount=-2\nkerning first=213 second=44  amount=-8\nkerning first=213 second=46  amount=-8\nkerning first=213 second=90  amount=-2\nkerning first=214 second=84  amount=-2\nkerning first=214 second=86  amount=-2\nkerning first=214 second=89  amount=-3\nkerning first=214 second=221 amount=-3\nkerning first=214 second=65  amount=-2\nkerning first=214 second=192 amount=-2\nkerning first=214 second=193 amount=-2\nkerning first=214 second=194 amount=-2\nkerning first=214 second=195 amount=-2\nkerning first=214 second=196 amount=-2\nkerning first=214 second=197 amount=-2\nkerning first=214 second=88  amount=-2\nkerning first=214 second=44  amount=-8\nkerning first=214 second=46  amount=-8\nkerning first=214 second=90  amount=-2\nkerning first=217 second=65  amount=-2\nkerning first=217 second=192 amount=-2\nkerning first=217 second=193 amount=-2\nkerning first=217 second=194 amount=-2\nkerning first=217 second=195 amount=-2\nkerning first=217 second=196 amount=-2\nkerning first=217 second=197 amount=-2\nkerning first=218 second=65  amount=-2\nkerning first=218 second=192 amount=-2\nkerning first=218 second=193 amount=-2\nkerning first=218 second=194 amount=-2\nkerning first=218 second=195 amount=-2\nkerning first=218 second=196 amount=-2\nkerning first=218 second=197 amount=-2\nkerning first=219 second=65  amount=-2\nkerning first=219 second=192 amount=-2\nkerning first=219 second=193 amount=-2\nkerning first=219 second=194 amount=-2\nkerning first=219 second=195 amount=-2\nkerning first=219 second=196 amount=-2\nkerning first=219 second=197 amount=-2\nkerning first=220 second=65  amount=-2\nkerning first=220 second=192 amount=-2\nkerning first=220 second=193 amount=-2\nkerning first=220 second=194 amount=-2\nkerning first=220 second=195 amount=-2\nkerning first=220 second=196 amount=-2\nkerning first=220 second=197 amount=-2\nkerning first=221 second=118 amount=-2\nkerning first=221 second=121 amount=-2\nkerning first=221 second=253 amount=-2\nkerning first=221 second=255 amount=-2\nkerning first=221 second=67  amount=-2\nkerning first=221 second=71  amount=-2\nkerning first=221 second=79  amount=-2\nkerning first=221 second=81  amount=-2\nkerning first=221 second=216 amount=-2\nkerning first=221 second=199 amount=-2\nkerning first=221 second=210 amount=-2\nkerning first=221 second=211 amount=-2\nkerning first=221 second=212 amount=-2\nkerning first=221 second=213 amount=-2\nkerning first=221 second=214 amount=-2\nkerning first=221 second=85  amount=-7\nkerning first=221 second=217 amount=-7\nkerning first=221 second=218 amount=-7\nkerning first=221 second=219 amount=-7\nkerning first=221 second=220 amount=-7\nkerning first=221 second=111 amount=-5\nkerning first=221 second=242 amount=-5\nkerning first=221 second=243 amount=-5\nkerning first=221 second=244 amount=-5\nkerning first=221 second=245 amount=-5\nkerning first=221 second=246 amount=-5\nkerning first=221 second=87  amount=1\nkerning first=221 second=84  amount=1\nkerning first=221 second=117 amount=-3\nkerning first=221 second=249 amount=-3\nkerning first=221 second=250 amount=-3\nkerning first=221 second=251 amount=-3\nkerning first=221 second=252 amount=-3\nkerning first=221 second=122 amount=-2\nkerning first=221 second=86  amount=1\nkerning first=221 second=89  amount=1\nkerning first=221 second=221 amount=1\nkerning first=221 second=65  amount=-7\nkerning first=221 second=192 amount=-7\nkerning first=221 second=193 amount=-7\nkerning first=221 second=194 amount=-7\nkerning first=221 second=195 amount=-7\nkerning first=221 second=196 amount=-7\nkerning first=221 second=197 amount=-7\nkerning first=221 second=88  amount=1\nkerning first=221 second=44  amount=-16\nkerning first=221 second=46  amount=-16\nkerning first=221 second=99  amount=-5\nkerning first=221 second=100 amount=-5\nkerning first=221 second=101 amount=-5\nkerning first=221 second=103 amount=-5\nkerning first=221 second=113 amount=-5\nkerning first=221 second=231 amount=-5\nkerning first=221 second=232 amount=-5\nkerning first=221 second=233 amount=-5\nkerning first=221 second=234 amount=-5\nkerning first=221 second=235 amount=-5\nkerning first=221 second=120 amount=-2\nkerning first=221 second=45  amount=-4\nkerning first=221 second=173 amount=-4\nkerning first=221 second=109 amount=-3\nkerning first=221 second=110 amount=-3\nkerning first=221 second=112 amount=-3\nkerning first=221 second=241 amount=-3\nkerning first=221 second=83  amount=-1\nkerning first=221 second=97  amount=-6\nkerning first=221 second=224 amount=-6\nkerning first=221 second=225 amount=-6\nkerning first=221 second=226 amount=-6\nkerning first=221 second=227 amount=-6\nkerning first=221 second=228 amount=-6\nkerning first=221 second=229 amount=-6\nkerning first=221 second=115 amount=-5\nkerning first=221 second=74  amount=-7\nkerning first=224 second=118 amount=-1\nkerning first=224 second=121 amount=-1\nkerning first=224 second=253 amount=-1\nkerning first=224 second=255 amount=-1\nkerning first=224 second=34  amount=-5\nkerning first=224 second=39  amount=-5\nkerning first=225 second=118 amount=-1\nkerning first=225 second=121 amount=-1\nkerning first=225 second=253 amount=-1\nkerning first=225 second=255 amount=-1\nkerning first=225 second=34  amount=-5\nkerning first=225 second=39  amount=-5\nkerning first=226 second=118 amount=-1\nkerning first=226 second=121 amount=-1\nkerning first=226 second=253 amount=-1\nkerning first=226 second=255 amount=-1\nkerning first=226 second=34  amount=-5\nkerning first=226 second=39  amount=-5\nkerning first=227 second=118 amount=-1\nkerning first=227 second=121 amount=-1\nkerning first=227 second=253 amount=-1\nkerning first=227 second=255 amount=-1\nkerning first=227 second=34  amount=-5\nkerning first=227 second=39  amount=-5\nkerning first=228 second=118 amount=-1\nkerning first=228 second=121 amount=-1\nkerning first=228 second=253 amount=-1\nkerning first=228 second=255 amount=-1\nkerning first=228 second=34  amount=-5\nkerning first=228 second=39  amount=-5\nkerning first=229 second=118 amount=-1\nkerning first=229 second=121 amount=-1\nkerning first=229 second=253 amount=-1\nkerning first=229 second=255 amount=-1\nkerning first=229 second=34  amount=-5\nkerning first=229 second=39  amount=-5\nkerning first=231 second=34  amount=-1\nkerning first=231 second=39  amount=-1\nkerning first=232 second=118 amount=-1\nkerning first=232 second=121 amount=-1\nkerning first=232 second=253 amount=-1\nkerning first=232 second=255 amount=-1\nkerning first=232 second=34  amount=-1\nkerning first=232 second=39  amount=-1\nkerning first=233 second=118 amount=-1\nkerning first=233 second=121 amount=-1\nkerning first=233 second=253 amount=-1\nkerning first=233 second=255 amount=-1\nkerning first=233 second=34  amount=-1\nkerning first=233 second=39  amount=-1\nkerning first=234 second=118 amount=-1\nkerning first=234 second=121 amount=-1\nkerning first=234 second=253 amount=-1\nkerning first=234 second=255 amount=-1\nkerning first=234 second=34  amount=-1\nkerning first=234 second=39  amount=-1\nkerning first=235 second=118 amount=-1\nkerning first=235 second=121 amount=-1\nkerning first=235 second=253 amount=-1\nkerning first=235 second=255 amount=-1\nkerning first=235 second=34  amount=-1\nkerning first=235 second=39  amount=-1\nkerning first=241 second=34  amount=-8\nkerning first=241 second=39  amount=-8\nkerning first=242 second=118 amount=-1\nkerning first=242 second=121 amount=-1\nkerning first=242 second=253 amount=-1\nkerning first=242 second=255 amount=-1\nkerning first=242 second=34  amount=-11\nkerning first=242 second=39  amount=-11\nkerning first=242 second=122 amount=-1\nkerning first=242 second=120 amount=-2\nkerning first=243 second=118 amount=-1\nkerning first=243 second=121 amount=-1\nkerning first=243 second=253 amount=-1\nkerning first=243 second=255 amount=-1\nkerning first=243 second=34  amount=-11\nkerning first=243 second=39  amount=-11\nkerning first=243 second=122 amount=-1\nkerning first=243 second=120 amount=-2\nkerning first=244 second=118 amount=-1\nkerning first=244 second=121 amount=-1\nkerning first=244 second=253 amount=-1\nkerning first=244 second=255 amount=-1\nkerning first=244 second=34  amount=-11\nkerning first=244 second=39  amount=-11\nkerning first=244 second=122 amount=-1\nkerning first=244 second=120 amount=-2\nkerning first=245 second=118 amount=-1\nkerning first=245 second=121 amount=-1\nkerning first=245 second=253 amount=-1\nkerning first=245 second=255 amount=-1\nkerning first=245 second=34  amount=-11\nkerning first=245 second=39  amount=-11\nkerning first=245 second=122 amount=-1\nkerning first=245 second=120 amount=-2\nkerning first=246 second=118 amount=-1\nkerning first=246 second=121 amount=-1\nkerning first=246 second=253 amount=-1\nkerning first=246 second=255 amount=-1\nkerning first=246 second=34  amount=-11\nkerning first=246 second=39  amount=-11\nkerning first=246 second=122 amount=-1\nkerning first=246 second=120 amount=-2\nkerning first=253 second=34  amount=1\nkerning first=253 second=39  amount=1\nkerning first=253 second=111 amount=-1\nkerning first=253 second=242 amount=-1\nkerning first=253 second=243 amount=-1\nkerning first=253 second=244 amount=-1\nkerning first=253 second=245 amount=-1\nkerning first=253 second=246 amount=-1\nkerning first=253 second=44  amount=-8\nkerning first=253 second=46  amount=-8\nkerning first=253 second=99  amount=-1\nkerning first=253 second=100 amount=-1\nkerning first=253 second=101 amount=-1\nkerning first=253 second=103 amount=-1\nkerning first=253 second=113 amount=-1\nkerning first=253 second=231 amount=-1\nkerning first=253 second=232 amount=-1\nkerning first=253 second=233 amount=-1\nkerning first=253 second=234 amount=-1\nkerning first=253 second=235 amount=-1\nkerning first=253 second=97  amount=-1\nkerning first=253 second=224 amount=-1\nkerning first=253 second=225 amount=-1\nkerning first=253 second=226 amount=-1\nkerning first=253 second=227 amount=-1\nkerning first=253 second=228 amount=-1\nkerning first=253 second=229 amount=-1\nkerning first=255 second=34  amount=1\nkerning first=255 second=39  amount=1\nkerning first=255 second=111 amount=-1\nkerning first=255 second=242 amount=-1\nkerning first=255 second=243 amount=-1\nkerning first=255 second=244 amount=-1\nkerning first=255 second=245 amount=-1\nkerning first=255 second=246 amount=-1\nkerning first=255 second=44  amount=-8\nkerning first=255 second=46  amount=-8\nkerning first=255 second=99  amount=-1\nkerning first=255 second=100 amount=-1\nkerning first=255 second=101 amount=-1\nkerning first=255 second=103 amount=-1\nkerning first=255 second=113 amount=-1\nkerning first=255 second=231 amount=-1\nkerning first=255 second=232 amount=-1\nkerning first=255 second=233 amount=-1\nkerning first=255 second=234 amount=-1\nkerning first=255 second=235 amount=-1\nkerning first=255 second=97  amount=-1\nkerning first=255 second=224 amount=-1\nkerning first=255 second=225 amount=-1\nkerning first=255 second=226 amount=-1\nkerning first=255 second=227 amount=-1\nkerning first=255 second=228 amount=-1\nkerning first=255 second=229 amount=-1\n";
}

},{}],7:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.create = create;

var _interaction = require('./interaction');

var _interaction2 = _interopRequireDefault(_interaction);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function create() {
  var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
      group = _ref.group,
      panel = _ref.panel;

  var interaction = (0, _interaction2.default)(panel);

  interaction.events.on('onPressed', handleOnPress);
  interaction.events.on('tick', handleTick);
  interaction.events.on('onReleased', handleOnRelease);

  var tempMatrix = new THREE.Matrix4();
  var tPosition = new THREE.Vector3();

  var oldParent = void 0;

  function getTopLevelFolder(group) {
    var folder = group.folder;
    while (folder.folder !== folder) {
      folder = folder.folder;
    }return folder;
  }

  function handleTick() {
    var _ref2 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
        input = _ref2.input;

    var folder = getTopLevelFolder(group);
    if (folder === undefined) {
      return;
    }

    if (input.mouse) {
      if (input.pressed && input.selected && input.raycast.ray.intersectPlane(input.mousePlane, input.mouseIntersection)) {
        if (input.interaction.press === interaction) {
          folder.position.copy(input.mouseIntersection.sub(input.mouseOffset));
          return;
        }
      } else if (input.intersections.length > 0) {
        var hitObject = input.intersections[0].object;
        if (hitObject === panel) {
          hitObject.updateMatrixWorld();
          tPosition.setFromMatrixPosition(hitObject.matrixWorld);

          input.mousePlane.setFromNormalAndCoplanarPoint(input.mouseCamera.getWorldDirection(input.mousePlane.normal), tPosition);
          // console.log( input.mousePlane );
        }
      }
    }
  }

  function handleOnPress(p) {
    var inputObject = p.inputObject,
        input = p.input;


    var folder = getTopLevelFolder(group);
    if (folder === undefined) {
      return;
    }

    if (folder.beingMoved === true) {
      return;
    }

    if (input.mouse) {
      if (input.intersections.length > 0) {
        if (input.raycast.ray.intersectPlane(input.mousePlane, input.mouseIntersection)) {
          var hitObject = input.intersections[0].object;
          if (hitObject !== panel) {
            return;
          }

          input.selected = folder;

          input.selected.updateMatrixWorld();
          tPosition.setFromMatrixPosition(input.selected.matrixWorld);

          input.mouseOffset.copy(input.mouseIntersection).sub(tPosition);
          // console.log( input.mouseOffset );
        }
      }
    } else {
      tempMatrix.getInverse(inputObject.matrixWorld);

      folder.matrix.premultiply(tempMatrix);
      folder.matrix.decompose(folder.position, folder.quaternion, folder.scale);

      oldParent = folder.parent;
      inputObject.add(folder);
    }

    p.locked = true;

    folder.beingMoved = true;

    input.events.emit('grabbed', input);
  }

  function handleOnRelease(p) {
    var inputObject = p.inputObject,
        input = p.input;


    var folder = getTopLevelFolder(group);
    if (folder === undefined) {
      return;
    }

    if (folder.beingMoved === false) {
      return;
    }

    if (input.mouse) {
      input.selected = undefined;
    } else {

      if (oldParent === undefined) {
        return;
      }

      folder.matrix.premultiply(inputObject.matrixWorld);
      folder.matrix.decompose(folder.position, folder.quaternion, folder.scale);
      oldParent.add(folder);
      oldParent = undefined;
    }

    folder.beingMoved = false;

    input.events.emit('grabReleased', input);
  }

  return interaction;
} /**
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

},{"./interaction":11}],8:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var grabBar = exports.grabBar = function () {
  var image = new Image();
  image.src = 'data:image/png;base64,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/GMzLdsAADskaVRYdFhNTDpjb20uYWRvYmUueG1wAAAAAAA8P3hwYWNrZXQgYmVnaW49Iu+7vyIgaWQ9Ilc1TTBNcENlaGlIenJlU3pOVGN6a2M5ZCI/Pgo8eDp4bXBtZXRhIHhtbG5zOng9ImFkb2JlOm5zOm1ldGEvIiB4OnhtcHRrPSJBZG9iZSBYTVAgQ29yZSA1LjYtYzEzMiA3OS4xNTkyODQsIDIwMTYvMDQvMTktMTM6MTM6NDAgICAgICAgICI+CiAgIDxyZGY6UkRGIHhtbG5zOnJkZj0iaHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyI+CiAgICAgIDxyZGY6RGVzY3JpcHRpb24gcmRmOmFib3V0PSIiCiAgICAgICAgICAgIHhtbG5zOnhtcD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLyIKICAgICAgICAgICAgeG1sbnM6ZGM9Imh0dHA6Ly9wdXJsLm9yZy9kYy9lbGVtZW50cy8xLjEvIgogICAgICAgICAgICB4bWxuczpwaG90b3Nob3A9Imh0dHA6Ly9ucy5hZG9iZS5jb20vcGhvdG9zaG9wLzEuMC8iCiAgICAgICAgICAgIHhtbG5zOnhtcE1NPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvbW0vIgogICAgICAgICAgICB4bWxuczpzdEV2dD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL3NUeXBlL1Jlc291cmNlRXZlbnQjIgogICAgICAgICAgICB4bWxuczp0aWZmPSJodHRwOi8vbnMuYWRvYmUuY29tL3RpZmYvMS4wLyIKICAgICAgICAgICAgeG1sbnM6ZXhpZj0iaHR0cDovL25zLmFkb2JlLmNvbS9leGlmLzEuMC8iPgogICAgICAgICA8eG1wOkNyZWF0b3JUb29sPkFkb2JlIFBob3Rvc2hvcCBDQyAyMDE1LjUgKFdpbmRvd3MpPC94bXA6Q3JlYXRvclRvb2w+CiAgICAgICAgIDx4bXA6Q3JlYXRlRGF0ZT4yMDE2LTA5LTI4VDE2OjI1OjMyLTA3OjAwPC94bXA6Q3JlYXRlRGF0ZT4KICAgICAgICAgPHhtcDpNb2RpZnlEYXRlPjIwMTYtMDktMjhUMTY6Mzc6MjMtMDc6MDA8L3htcDpNb2RpZnlEYXRlPgogICAgICAgICA8eG1wOk1ldGFkYXRhRGF0ZT4yMDE2LTA5LTI4VDE2OjM3OjIzLTA3OjAwPC94bXA6TWV0YWRhdGFEYXRlPgogICAgICAgICA8ZGM6Zm9ybWF0PmltYWdlL3BuZzwvZGM6Zm9ybWF0PgogICAgICAgICA8cGhvdG9zaG9wOkNvbG9yTW9kZT4zPC9waG90b3Nob3A6Q29sb3JNb2RlPgogICAgICAgICA8cGhvdG9zaG9wOklDQ1Byb2ZpbGU+c1JHQiBJRUM2MTk2Ni0yLjE8L3Bob3Rvc2hvcDpJQ0NQcm9maWxlPgogICAgICAgICA8eG1wTU06SW5zdGFuY2VJRD54bXAuaWlkOmFhYTFjMTQzLTUwZmUtOTQ0My1hNThmLWEyM2VkNTM3MDdmMDwveG1wTU06SW5zdGFuY2VJRD4KICAgICAgICAgPHhtcE1NOkRvY3VtZW50SUQ+YWRvYmU6ZG9jaWQ6cGhvdG9zaG9wOjdlNzdmYmZjLTg1ZDQtMTFlNi1hYzhmLWFjNzU0ZWQ1ODM3ZjwveG1wTU06RG9jdW1lbnRJRD4KICAgICAgICAgPHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD54bXAuZGlkOmM1ZmM0ZGYyLTkxY2MtZTI0MS04Y2VjLTMzODIyY2Q1ZWFlOTwveG1wTU06T3JpZ2luYWxEb2N1bWVudElEPgogICAgICAgICA8eG1wTU06SGlzdG9yeT4KICAgICAgICAgICAgPHJkZjpTZXE+CiAgICAgICAgICAgICAgIDxyZGY6bGkgcmRmOnBhcnNlVHlwZT0iUmVzb3VyY2UiPgogICAgICAgICAgICAgICAgICA8c3RFdnQ6YWN0aW9uPmNyZWF0ZWQ8L3N0RXZ0OmFjdGlvbj4KICAgICAgICAgICAgICAgICAgPHN0RXZ0Omluc3RhbmNlSUQ+eG1wLmlpZDpjNWZjNGRmMi05MWNjLWUyNDEtOGNlYy0zMzgyMmNkNWVhZTk8L3N0RXZ0Omluc3RhbmNlSUQ+CiAgICAgICAgICAgICAgICAgIDxzdEV2dDp3aGVuPjIwMTYtMDktMjhUMTY6MjU6MzItMDc6MDA8L3N0RXZ0OndoZW4+CiAgICAgICAgICAgICAgICAgIDxzdEV2dDpzb2Z0d2FyZUFnZW50PkFkb2JlIFBob3Rvc2hvcCBDQyAyMDE1LjUgKFdpbmRvd3MpPC9zdEV2dDpzb2Z0d2FyZUFnZW50PgogICAgICAgICAgICAgICA8L3JkZjpsaT4KICAgICAgICAgICAgICAgPHJkZjpsaSByZGY6cGFyc2VUeXBlPSJSZXNvdXJjZSI+CiAgICAgICAgICAgICAgICAgIDxzdEV2dDphY3Rpb24+Y29udmVydGVkPC9zdEV2dDphY3Rpb24+CiAgICAgICAgICAgICAgICAgIDxzdEV2dDpwYXJhbWV0ZXJzPmZyb20gYXBwbGljYXRpb24vdm5kLmFkb2JlLnBob3Rvc2hvcCB0byBpbWFnZS9wbmc8L3N0RXZ0OnBhcmFtZXRlcnM+CiAgICAgICAgICAgICAgIDwvcmRmOmxpPgogICAgICAgICAgICAgICA8cmRmOmxpIHJkZjpwYXJzZVR5cGU9IlJlc291cmNlIj4KICAgICAgICAgICAgICAgICAgPHN0RXZ0OmFjdGlvbj5zYXZlZDwvc3RFdnQ6YWN0aW9uPgogICAgICAgICAgICAgICAgICA8c3RFdnQ6aW5zdGFuY2VJRD54bXAuaWlkOmFhYTFjMTQzLTUwZmUtOTQ0My1hNThmLWEyM2VkNTM3MDdmMDwvc3RFdnQ6aW5zdGFuY2VJRD4KICAgICAgICAgICAgICAgICAgPHN0RXZ0OndoZW4+MjAxNi0wOS0yOFQxNjozNzoyMy0wNzowMDwvc3RFdnQ6d2hlbj4KICAgICAgICAgICAgICAgICAgPHN0RXZ0OnNvZnR3YXJlQWdlbnQ+QWRvYmUgUGhvdG9zaG9wIENDIDIwMTUuNSAoV2luZG93cyk8L3N0RXZ0OnNvZnR3YXJlQWdlbnQ+CiAgICAgICAgICAgICAgICAgIDxzdEV2dDpjaGFuZ2VkPi88L3N0RXZ0OmNoYW5nZWQ+CiAgICAgICAgICAgICAgIDwvcmRmOmxpPgogICAgICAgICAgICA8L3JkZjpTZXE+CiAgICAgICAgIDwveG1wTU06SGlzdG9yeT4KICAgICAgICAgPHRpZmY6T3JpZW50YXRpb24+MTwvdGlmZjpPcmllbnRhdGlvbj4KICAgICAgICAgPHRpZmY6WFJlc29sdXRpb24+MzAwMDAwMC8xMDAwMDwvdGlmZjpYUmVzb2x1dGlvbj4KICAgICAgICAgPHRpZmY6WVJlc29sdXRpb24+MzAwMDAwMC8xMDAwMDwvdGlmZjpZUmVzb2x1dGlvbj4KICAgICAgICAgPHRpZmY6UmVzb2x1dGlvblVuaXQ+MjwvdGlmZjpSZXNvbHV0aW9uVW5pdD4KICAgICAgICAgPGV4aWY6Q29sb3JTcGFjZT4xPC9leGlmOkNvbG9yU3BhY2U+CiAgICAgICAgIDxleGlmOlBpeGVsWERpbWVuc2lvbj42NDwvZXhpZjpQaXhlbFhEaW1lbnNpb24+CiAgICAgICAgIDxleGlmOlBpeGVsWURpbWVuc2lvbj4zMjwvZXhpZjpQaXhlbFlEaW1lbnNpb24+CiAgICAgIDwvcmRmOkRlc2NyaXB0aW9uPgogICA8L3JkZjpSREY+CjwveDp4bXBtZXRhPgogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgIAo8P3hwYWNrZXQgZW5kPSJ3Ij8+OhF7RwAAACBjSFJNAAB6JQAAgIMAAPn/AACA6QAAdTAAAOpgAAA6mAAAF2+SX8VGAAAAlElEQVR42uzZsQ3AIAxEUTuTZJRskt5LRFmCdTLapUKCBijo/F0hn2SkJxIKXJJlrsOSFwAAAABA6vKI6O7BUorXdZu1/VEWEZeZfbN5m/ZamjfK+AQAAAAAAAAAAAAAAAAAAAAAACBfuaSna7i/dd1mbX+USTrN7J7N27TX0rxRxgngZYifIAAAAJC4fgAAAP//AwAuMVPw20hxCwAAAABJRU5ErkJggg==';

  var texture = new THREE.Texture();
  texture.image = image;
  texture.needsUpdate = true;
  // texture.minFilter = THREE.LinearMipMapLinearFilter;
  // texture.magFilter = THREE.LinearFilter;
  // texture.generateMipmaps = false;

  var material = new THREE.MeshBasicMaterial({
    // color: 0xff0000,
    side: THREE.DoubleSide,
    transparent: true,
    map: texture
  });
  material.alphaTest = 0.5;

  return function () {
    var geometry = new THREE.PlaneGeometry(image.width / 1000, image.height / 1000, 1, 1);

    var mesh = new THREE.Mesh(geometry, material);
    return mesh;
  };
}();

var downArrow = exports.downArrow = function () {
  var image = new Image();
  image.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAABACAYAAADS1n9/AAAACXBIWXMAACxLAAAsSwGlPZapAAA4K2lUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4KPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxMzIgNzkuMTU5Mjg0LCAyMDE2LzA0LzE5LTEzOjEzOjQwICAgICAgICAiPgogICA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPgogICAgICA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIgogICAgICAgICAgICB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iCiAgICAgICAgICAgIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIKICAgICAgICAgICAgeG1sbnM6cGhvdG9zaG9wPSJodHRwOi8vbnMuYWRvYmUuY29tL3Bob3Rvc2hvcC8xLjAvIgogICAgICAgICAgICB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIKICAgICAgICAgICAgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIKICAgICAgICAgICAgeG1sbnM6dGlmZj0iaHR0cDovL25zLmFkb2JlLmNvbS90aWZmLzEuMC8iCiAgICAgICAgICAgIHhtbG5zOmV4aWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20vZXhpZi8xLjAvIj4KICAgICAgICAgPHhtcDpDcmVhdG9yVG9vbD5BZG9iZSBQaG90b3Nob3AgQ0MgMjAxNS41IChXaW5kb3dzKTwveG1wOkNyZWF0b3JUb29sPgogICAgICAgICA8eG1wOkNyZWF0ZURhdGU+MjAxNi0xMC0xOFQxNzozMzowNi0wNzowMDwveG1wOkNyZWF0ZURhdGU+CiAgICAgICAgIDx4bXA6TW9kaWZ5RGF0ZT4yMDE2LTEwLTIwVDIxOjE4OjI1LTA3OjAwPC94bXA6TW9kaWZ5RGF0ZT4KICAgICAgICAgPHhtcDpNZXRhZGF0YURhdGU+MjAxNi0xMC0yMFQyMToxODoyNS0wNzowMDwveG1wOk1ldGFkYXRhRGF0ZT4KICAgICAgICAgPGRjOmZvcm1hdD5pbWFnZS9wbmc8L2RjOmZvcm1hdD4KICAgICAgICAgPHBob3Rvc2hvcDpDb2xvck1vZGU+MzwvcGhvdG9zaG9wOkNvbG9yTW9kZT4KICAgICAgICAgPHhtcE1NOkluc3RhbmNlSUQ+eG1wLmlpZDozMDQyYjI0ZS1iMzc2LWI0NGItOGI4Yy1lZTFjY2IzYWU1MDU8L3htcE1NOkluc3RhbmNlSUQ+CiAgICAgICAgIDx4bXBNTTpEb2N1bWVudElEPnhtcC5kaWQ6MzA0MmIyNGUtYjM3Ni1iNDRiLThiOGMtZWUxY2NiM2FlNTA1PC94bXBNTTpEb2N1bWVudElEPgogICAgICAgICA8eG1wTU06T3JpZ2luYWxEb2N1bWVudElEPnhtcC5kaWQ6MzA0MmIyNGUtYjM3Ni1iNDRiLThiOGMtZWUxY2NiM2FlNTA1PC94bXBNTTpPcmlnaW5hbERvY3VtZW50SUQ+CiAgICAgICAgIDx4bXBNTTpIaXN0b3J5PgogICAgICAgICAgICA8cmRmOlNlcT4KICAgICAgICAgICAgICAgPHJkZjpsaSByZGY6cGFyc2VUeXBlPSJSZXNvdXJjZSI+CiAgICAgICAgICAgICAgICAgIDxzdEV2dDphY3Rpb24+Y3JlYXRlZDwvc3RFdnQ6YWN0aW9uPgogICAgICAgICAgICAgICAgICA8c3RFdnQ6aW5zdGFuY2VJRD54bXAuaWlkOjMwNDJiMjRlLWIzNzYtYjQ0Yi04YjhjLWVlMWNjYjNhZTUwNTwvc3RFdnQ6aW5zdGFuY2VJRD4KICAgICAgICAgICAgICAgICAgPHN0RXZ0OndoZW4+MjAxNi0xMC0xOFQxNzozMzowNi0wNzowMDwvc3RFdnQ6d2hlbj4KICAgICAgICAgICAgICAgICAgPHN0RXZ0OnNvZnR3YXJlQWdlbnQ+QWRvYmUgUGhvdG9zaG9wIENDIDIwMTUuNSAoV2luZG93cyk8L3N0RXZ0OnNvZnR3YXJlQWdlbnQ+CiAgICAgICAgICAgICAgIDwvcmRmOmxpPgogICAgICAgICAgICA8L3JkZjpTZXE+CiAgICAgICAgIDwveG1wTU06SGlzdG9yeT4KICAgICAgICAgPHRpZmY6T3JpZW50YXRpb24+MTwvdGlmZjpPcmllbnRhdGlvbj4KICAgICAgICAgPHRpZmY6WFJlc29sdXRpb24+Mjg4MDAwMC8xMDAwMDwvdGlmZjpYUmVzb2x1dGlvbj4KICAgICAgICAgPHRpZmY6WVJlc29sdXRpb24+Mjg4MDAwMC8xMDAwMDwvdGlmZjpZUmVzb2x1dGlvbj4KICAgICAgICAgPHRpZmY6UmVzb2x1dGlvblVuaXQ+MjwvdGlmZjpSZXNvbHV0aW9uVW5pdD4KICAgICAgICAgPGV4aWY6Q29sb3JTcGFjZT42NTUzNTwvZXhpZjpDb2xvclNwYWNlPgogICAgICAgICA8ZXhpZjpQaXhlbFhEaW1lbnNpb24+MTI4PC9leGlmOlBpeGVsWERpbWVuc2lvbj4KICAgICAgICAgPGV4aWY6UGl4ZWxZRGltZW5zaW9uPjY0PC9leGlmOlBpeGVsWURpbWVuc2lvbj4KICAgICAgPC9yZGY6RGVzY3JpcHRpb24+CiAgIDwvcmRmOlJERj4KPC94OnhtcG1ldGE+CiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgCjw/eHBhY2tldCBlbmQ9InciPz5Uilz0AAAAIGNIUk0AAHolAACAgwAA+f8AAIDpAAB1MAAA6mAAADqYAAAXb5JfxUYAAAJdSURBVHja7N3LccJAEIThRuW7ncUeTQhkQAiIDMgIhUIIcFQWJgJ88FKlovwArN2d6Z45cZGA/T9viYftxeVyQYzudLEEASAmAMQEgBjJeWl1xymlNwAHAMdxHHvFxU8pDQCWAFbjOH7I7ACT+O8ANnkhFONv8hoc8prwA7iJfx0pBJP412mGoDMQXwrBN/GbIuiMxJdA8Ev8Zgg6Q/GpEdwRvwmCzlh8SgQPxK+OoMYOMDwYnwrBE/GnCAbXAPKTX//jFJuUUu84fv9k/OusS/8QdAbl387eI4L8mPcznKroTlhyB1jOeC5XCGaMX2ItqwFYATipISgQ/5TX0heA/N62FIJS8Ut+TlD0IlAJgcf4VV4GKiDwGr/W+wDUCDzHrwaAFYH3+FUBsCFgiF8dAAsClvhNAHhHwBS/GQCvCNjiNwXgDQFj/OYAvCBgjW8CgHUEzPHNALCKgD2+KQDWECjENwfACgKV+CYBTBD0AM61ERSIfwbQW4xvFkBGcMw7QTUEheKv8nNBADCMQDG+eQC1EKjGB4CFl78RlFJa4usXTF7njJRvz35eD/FdASiIAKrx3QEohACq8V1cA1S6JpCM7xKAQQRu47sFYAiB6/iuARhA4D6+ewANEVDEpwDQAAFNfBoAFRFQxacCUAEBXXw6AAURUManBFAAAW18WgAzIqCOTw1gBgT08ekBTBDsnjh0xx5fAkBGMADYPnDINh+DAKCHQCa+FIA7EUjFlwPwBwK5+JIAfkAgGR9w+JWwOef6zWDV+PIAYuLfxgWAWIIAEBMAYgJAjOR8DgD+6Ozgv4uy9gAAAABJRU5ErkJggg==';

  var texture = new THREE.Texture();
  texture.image = image;
  texture.needsUpdate = true;
  texture.minFilter = THREE.LinearMipMapLinearFilter;
  texture.magFilter = THREE.LinearFilter;
  // texture.anisotropic
  // texture.generateMipmaps = false;

  var material = new THREE.MeshBasicMaterial({
    // color: 0xff0000,
    side: THREE.DoubleSide,
    transparent: true,
    map: texture
  });
  material.alphaTest = 0.2;

  return function () {
    var h = 0.3;
    var geo = new THREE.PlaneGeometry(image.width / 1000 * h, image.height / 1000 * h, 1, 1);
    geo.translate(-0.005, -0.004, 0);
    return new THREE.Mesh(geo, material);
  };
}();

var checkmark = exports.checkmark = function () {
  var image = new Image();
  image.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAABACAYAAADS1n9/AAAACXBIWXMAACxLAAAsSwGlPZapAAA4K2lUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4KPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxMzIgNzkuMTU5Mjg0LCAyMDE2LzA0LzE5LTEzOjEzOjQwICAgICAgICAiPgogICA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPgogICAgICA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIgogICAgICAgICAgICB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iCiAgICAgICAgICAgIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIKICAgICAgICAgICAgeG1sbnM6cGhvdG9zaG9wPSJodHRwOi8vbnMuYWRvYmUuY29tL3Bob3Rvc2hvcC8xLjAvIgogICAgICAgICAgICB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIKICAgICAgICAgICAgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIKICAgICAgICAgICAgeG1sbnM6dGlmZj0iaHR0cDovL25zLmFkb2JlLmNvbS90aWZmLzEuMC8iCiAgICAgICAgICAgIHhtbG5zOmV4aWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20vZXhpZi8xLjAvIj4KICAgICAgICAgPHhtcDpDcmVhdG9yVG9vbD5BZG9iZSBQaG90b3Nob3AgQ0MgMjAxNS41IChXaW5kb3dzKTwveG1wOkNyZWF0b3JUb29sPgogICAgICAgICA8eG1wOkNyZWF0ZURhdGU+MjAxNi0xMC0xOFQxNzozMzowNi0wNzowMDwveG1wOkNyZWF0ZURhdGU+CiAgICAgICAgIDx4bXA6TW9kaWZ5RGF0ZT4yMDE2LTEwLTIwVDIxOjMzOjUzLTA3OjAwPC94bXA6TW9kaWZ5RGF0ZT4KICAgICAgICAgPHhtcDpNZXRhZGF0YURhdGU+MjAxNi0xMC0yMFQyMTozMzo1My0wNzowMDwveG1wOk1ldGFkYXRhRGF0ZT4KICAgICAgICAgPGRjOmZvcm1hdD5pbWFnZS9wbmc8L2RjOmZvcm1hdD4KICAgICAgICAgPHBob3Rvc2hvcDpDb2xvck1vZGU+MzwvcGhvdG9zaG9wOkNvbG9yTW9kZT4KICAgICAgICAgPHhtcE1NOkluc3RhbmNlSUQ+eG1wLmlpZDo2ODcxYTk5Yy0zNjE5LTlkNGEtODdkNi0wYWE5YTRiNWU4Mjc8L3htcE1NOkluc3RhbmNlSUQ+CiAgICAgICAgIDx4bXBNTTpEb2N1bWVudElEPnhtcC5kaWQ6Njg3MWE5OWMtMzYxOS05ZDRhLTg3ZDYtMGFhOWE0YjVlODI3PC94bXBNTTpEb2N1bWVudElEPgogICAgICAgICA8eG1wTU06T3JpZ2luYWxEb2N1bWVudElEPnhtcC5kaWQ6Njg3MWE5OWMtMzYxOS05ZDRhLTg3ZDYtMGFhOWE0YjVlODI3PC94bXBNTTpPcmlnaW5hbERvY3VtZW50SUQ+CiAgICAgICAgIDx4bXBNTTpIaXN0b3J5PgogICAgICAgICAgICA8cmRmOlNlcT4KICAgICAgICAgICAgICAgPHJkZjpsaSByZGY6cGFyc2VUeXBlPSJSZXNvdXJjZSI+CiAgICAgICAgICAgICAgICAgIDxzdEV2dDphY3Rpb24+Y3JlYXRlZDwvc3RFdnQ6YWN0aW9uPgogICAgICAgICAgICAgICAgICA8c3RFdnQ6aW5zdGFuY2VJRD54bXAuaWlkOjY4NzFhOTljLTM2MTktOWQ0YS04N2Q2LTBhYTlhNGI1ZTgyNzwvc3RFdnQ6aW5zdGFuY2VJRD4KICAgICAgICAgICAgICAgICAgPHN0RXZ0OndoZW4+MjAxNi0xMC0xOFQxNzozMzowNi0wNzowMDwvc3RFdnQ6d2hlbj4KICAgICAgICAgICAgICAgICAgPHN0RXZ0OnNvZnR3YXJlQWdlbnQ+QWRvYmUgUGhvdG9zaG9wIENDIDIwMTUuNSAoV2luZG93cyk8L3N0RXZ0OnNvZnR3YXJlQWdlbnQ+CiAgICAgICAgICAgICAgIDwvcmRmOmxpPgogICAgICAgICAgICA8L3JkZjpTZXE+CiAgICAgICAgIDwveG1wTU06SGlzdG9yeT4KICAgICAgICAgPHRpZmY6T3JpZW50YXRpb24+MTwvdGlmZjpPcmllbnRhdGlvbj4KICAgICAgICAgPHRpZmY6WFJlc29sdXRpb24+Mjg4MDAwMC8xMDAwMDwvdGlmZjpYUmVzb2x1dGlvbj4KICAgICAgICAgPHRpZmY6WVJlc29sdXRpb24+Mjg4MDAwMC8xMDAwMDwvdGlmZjpZUmVzb2x1dGlvbj4KICAgICAgICAgPHRpZmY6UmVzb2x1dGlvblVuaXQ+MjwvdGlmZjpSZXNvbHV0aW9uVW5pdD4KICAgICAgICAgPGV4aWY6Q29sb3JTcGFjZT42NTUzNTwvZXhpZjpDb2xvclNwYWNlPgogICAgICAgICA8ZXhpZjpQaXhlbFhEaW1lbnNpb24+MTI4PC9leGlmOlBpeGVsWERpbWVuc2lvbj4KICAgICAgICAgPGV4aWY6UGl4ZWxZRGltZW5zaW9uPjY0PC9leGlmOlBpeGVsWURpbWVuc2lvbj4KICAgICAgPC9yZGY6RGVzY3JpcHRpb24+CiAgIDwvcmRmOlJERj4KPC94OnhtcG1ldGE+CiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgCjw/eHBhY2tldCBlbmQ9InciPz5z9RT3AAAAIGNIUk0AAHolAACAgwAA+f8AAIDpAAB1MAAA6mAAADqYAAAXb5JfxUYAAATtSURBVHja7Jzbb5RFGMZ/2xbCvVhASExUiI144w0hQtHEGrHgISqgN6KgtNYWAb0w0Wo1XqrbPbSlokYSxfMhemX/Aa7wGAVq8XTp30DXi5mJm0a2u9v3/b6Z2XludrOHdw/PMzPP+74zX6FWqyGFgYEBElpGD/AecCtwB/Dbcm+Ym5sT+/Cu9P/nim6gCDwCXAt8DVyX5RdIAsgPBaAEjNQ9diPwFbA5CSB+TAFP/c/jW4HPgL4kgHgxCww1eP5m4GN7mwQQEbos+U808dqtwEf2NgkgErc/0yT5Dn12OdiSBBA++aUWyXfYAnwDXJ8EEG6qNwkMryDGZpsi3pAEEB6qV3D7raIP+NKmikkAgeAt4IhgvJvsTJAE4DkKwCngsELss0kA/q/5s8AhhdjTwEFpd5ogS35VaeTPAk8Di0kA/pJfEl7zHU7SuHKYlgAP1vyykNtfihkt8pMAZEkaVohbVYqbBCCIU8CTCnFLwJj2l08CWNma/7aS268Cx6QNXxKArHmeBh5XWk7GsiA/TwGMYfa/hUp+mfYaO824/eGsyM9LAC9gmiPvAzsDI7/Lrs1DSiN/KI8flCXGgVft/V7gDLArIAFMh+r2fRDAS8DEksc2Ah8C/R3s9svAaJ5TWlbkv3yF59Zjdr1s93ja13L7Fev2azELYLwB+Q5rMb3ubR4avpNKbn8aeAa4nLe6tQ3fRJOv7QW+8Ggm6LEjVKOxM4M5D3A57x+pKYAX6wxfs9gAfALs8IB8rcaOKxvXfFC5lgDGgVfafK8zhrty/E+0XHklL7efpQAmWpj2lxPBbTn8J7Po1fZH8QzSAnjNjn4JrMecjsmqWFQA3lVy+yXr9oldAHcKx7sa+DwDY9hj8/yDiqneYicI4FHgR+GYa5WzA83GzhRw1FfyNQTwC3CPvZXEOuBTzEUUJLEqg1TPW/K1TOCfwCBwUTjuNciWjbsxZViNVC+32r4vaeAfwF3AgnDcTVYEtwuNUA3yy5jdu3SyAAB+B3YrLAcbBOoE7yhN+5N2zScJwGAeeAD4TjhuL6aB1Kon6LbkP6Y08o/jSYXPFwEAnAceVhDBVS1mB66xo0H+FKaxs0hgyKodfAF4EPhJqU6w3EywyhqzQ0rkj4RIfpYCALgE7LEzgiRcxbC/wcivoFPedeQHi6y3hP1ljeG8Uoq4NDsoYIo8Wjt5giY/DwHUp4i/KmQHZ+pEUMDs5NFw+0UyOLQRqwDccnAv8L1w3HXAaZsivq5k+IrACSJBnqeD54EDwAfALYJxNwHfKpmysiV/MRYB5H0y6AKwH/hBOO5qYI2C4TsaE/k+CADM1bH3Il8xlETVGr4akcGXs4F/A3fbGcE3VAioth+qAMB0EXd7JoJJPNzGFasAwDSQBpHfVNKu2z9G5PDxePgC8BBwLueRfyLGNT8EAYDZTHIA+QZSs2v+8djcfmgCcHWC+5FvIC3n9kc7hXzfBeCM4R7ky8Yd5/ZDFQD810C6qPgZ0bv9kAVQnyJqFIvexGzmIAnAb1wC7hM2hkXgWToYoV0lzDWQJFLE6Bo7nSAAlyLuY2UNpAoZXootCUAeC5gG0s9tkj9KQtACANNAGqS1PYalRH48AnApYrPby4oEdmgjCaD5FHEvjbeXvYEp7yZEKADnCfZbEfwDPI85L+DIf44OaOy0g38HAM/e7guIRx94AAAAAElFTkSuQmCC';

  var texture = new THREE.Texture();
  texture.image = image;
  texture.needsUpdate = true;
  texture.minFilter = THREE.LinearMipMapLinearFilter;
  texture.magFilter = THREE.LinearFilter;
  // texture.anisotropic
  // texture.generateMipmaps = false;

  var material = new THREE.MeshBasicMaterial({
    // color: 0xff0000,
    side: THREE.DoubleSide,
    transparent: true,
    map: texture
  });
  material.alphaTest = 0.2;

  return function () {
    var h = 0.4;
    var geo = new THREE.PlaneGeometry(image.width / 1000 * h, image.height / 1000 * h, 1, 1);
    geo.translate(0.025, 0, 0);
    return new THREE.Mesh(geo, material);
  };
}();

},{}],9:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = createImageButton;

var _SubdivisionModifier = require('../thirdparty/SubdivisionModifier');

var SubdivisionModifier = _interopRequireWildcard(_SubdivisionModifier);

var _textlabel = require('./textlabel');

var _textlabel2 = _interopRequireDefault(_textlabel);

var _interaction = require('./interaction');

var _interaction2 = _interopRequireDefault(_interaction);

var _colors = require('./colors');

var Colors = _interopRequireWildcard(_colors);

var _layout = require('./layout');

var Layout = _interopRequireWildcard(_layout);

var _sharedmaterials = require('./sharedmaterials');

var SharedMaterials = _interopRequireWildcard(_sharedmaterials);

var _grab = require('./grab');

var Grab = _interopRequireWildcard(_grab);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function createImageButton() {
  var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
      textCreator = _ref.textCreator,
      object = _ref.object,
      _ref$propertyName = _ref.propertyName,
      propertyName = _ref$propertyName === undefined ? 'undefined' : _ref$propertyName,
      _ref$image = _ref.image,
      image = _ref$image === undefined ? "textures/spotlight.jpg" : _ref$image,
      _ref$width = _ref.width,
      width = _ref$width === undefined ? Layout.PANEL_WIDTH : _ref$width,
      _ref$height = _ref.height,
      height = _ref$height === undefined ? Layout.PANEL_WIDTH / 3 : _ref$height,
      _ref$depth = _ref.depth,
      depth = _ref$depth === undefined ? Layout.PANEL_DEPTH : _ref$depth;

  function applyImageToMaterial(image, targetMaterial) {
    if (typeof image === "string") {
      //TODO cache.  Does TextureLoader already cache?
      //TODO Image only on front face of button.
      new THREE.TextureLoader().load(image, function (texture) {
        texture.wrapS = texture.wrapT = THREE.ClampToEdgeWrapping;
        targetMaterial.map = texture;
        targetMaterial.needsUpdate = true;
      });
    } else if (image.isTexture) {
      targetMaterial.map = image;
    } else if (image.isWebGLRenderTarget) {
      targetMaterial.map = image.texture;
    } else throw "not sure how to interpret image " + image;
    targetMaterial.needsUpdate = true;
  }

  var BUTTON_WIDTH = width * 0.5 - Layout.PANEL_MARGIN;
  var BUTTON_HEIGHT = height - Layout.PANEL_MARGIN;
  var BUTTON_DEPTH = Layout.BUTTON_DEPTH * 2;

  var group = new THREE.Group();
  group.spacing = height;

  var panel = Layout.createPanel(width, height, depth);
  group.add(panel);

  //  base checkbox
  var aspectRatio = BUTTON_WIDTH / BUTTON_HEIGHT;
  var rect = new THREE.PlaneGeometry(BUTTON_WIDTH, BUTTON_HEIGHT, 1, 1);
  var modifier = new THREE.SubdivisionModifier(1);
  //modifier.modify( rect );
  rect.translate(BUTTON_WIDTH * 0.5, 0, BUTTON_DEPTH);

  //  hitscan volume
  var hitscanMaterial = new THREE.MeshBasicMaterial();
  hitscanMaterial.visible = false;

  var hitscanVolume = new THREE.Mesh(rect.clone(), hitscanMaterial);
  hitscanVolume.position.z = BUTTON_DEPTH;
  hitscanVolume.position.x = width * 0.5;

  var material = new THREE.MeshBasicMaterial();
  material.transparent = true;
  applyImageToMaterial(image, material);
  var filledVolume = new THREE.Mesh(rect.clone(), material);
  hitscanVolume.add(filledVolume);

  //button label removed; might want options like a hover label in future.

  var descriptorLabel = textCreator.create(propertyName);
  descriptorLabel.position.x = Layout.PANEL_LABEL_TEXT_MARGIN;
  descriptorLabel.position.z = depth;
  descriptorLabel.position.y = -0.03;

  var controllerID = Layout.createControllerIDBox(height, Colors.CONTROLLER_ID_BUTTON);
  controllerID.position.z = depth;

  panel.add(descriptorLabel, hitscanVolume, controllerID);

  var interaction = (0, _interaction2.default)(hitscanVolume);
  interaction.events.on('onPressed', handleOnPress);
  interaction.events.on('onReleased', handleOnRelease);

  updateView();

  function handleOnPress(p) {
    if (group.visible === false) {
      return;
    }

    object[propertyName]();

    hitscanVolume.position.z = BUTTON_DEPTH * 0.1;

    p.locked = true;
  }

  function handleOnRelease() {
    hitscanVolume.position.z = BUTTON_DEPTH * 0.5;
  }

  function updateView() {

    if (interaction.hovering()) {
      material.color.setHex(0xFFFFFF);
    } else {
      material.color.setHex(0xCCCCCC);
    }
  }

  group.interaction = interaction;
  group.hitscan = [hitscanVolume, panel];

  var grabInteraction = Grab.create({ group: group, panel: panel });

  group.update = function (inputObjects) {
    interaction.update(inputObjects);
    grabInteraction.update(inputObjects);
    updateView();
  };

  group.name = function (str) {
    descriptorLabel.update(str);
    return group;
  };

  return group;
} /** 
   * Big button with an image on (which might come from a file or existing texture,
   * the texture might be from a RenderTarget...).
   * 
   * I'd put this more separate from the datgui modules but need to think a little
   * bit about how to structure that etc.  Very un-DRY, but I'm starting by just
   * copying existing button.js in its entirety.
   * 
   * TODO: not just simple 'bang' function but callbacks for hover / etc.
   * 
   * 
   * Copyright  Data Arts Team, Google inc. 2016 / Peter Todd, 2017
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

},{"../thirdparty/SubdivisionModifier":18,"./colors":3,"./grab":7,"./interaction":11,"./layout":12,"./sharedmaterials":15,"./textlabel":17}],10:[function(require,module,exports){
'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _events = require('events');

var _events2 = _interopRequireDefault(_events);

var _slider = require('./slider');

var _slider2 = _interopRequireDefault(_slider);

var _checkbox = require('./checkbox');

var _checkbox2 = _interopRequireDefault(_checkbox);

var _button = require('./button');

var _button2 = _interopRequireDefault(_button);

var _folder = require('./folder');

var _folder2 = _interopRequireDefault(_folder);

var _dropdown = require('./dropdown');

var _dropdown2 = _interopRequireDefault(_dropdown);

var _imagebutton = require('./imagebutton');

var _imagebutton2 = _interopRequireDefault(_imagebutton);

var _sdftext = require('./sdftext');

var SDFText = _interopRequireWildcard(_sdftext);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } } /**
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

//PJT: I'd rather inject custom extensions like this, but will work that out later.


var GUIVR = function DATGUIVR() {

  /*
    SDF font
  */
  var textCreator = SDFText.creator();

  /*
    Lists.
    InputObjects are things like VIVE controllers, cardboard headsets, etc.
    Controllers are the DAT GUI sliders, checkboxes, etc.
    HitscanObjects are anything raycasts will hit-test against.
  */
  var inputObjects = [];
  var controllers = [];
  var hitscanObjects = []; //XXX: this is currently not used.

  /*
    Functions for determining whether a given controller is visible (by which we
    mean not hidden, not 'visible' in terms of the camera orientation etc), and
    for retrieving the list of visible hitscanObjects dynamically.
    This might benefit from some caching especially in cases with large complex GUIs.
    I haven't measured the impact of garbage collection etc.
  */
  function isControllerVisible(control) {
    if (!control.visible) return false;
    var folder = control.folder;
    while (folder.folder !== folder) {
      folder = folder.folder;
      if (folder.isCollapsed() || !folder.visible) return false;
    }
    return true;
  }
  function getVisibleControllers() {
    // not terribly efficient
    return controllers.filter(isControllerVisible);
  }
  function getVisibleHitscanObjects() {
    var tmp = getVisibleControllers().map(function (o) {
      return o.hitscan;
    });
    return tmp.reduce(function (a, b) {
      return a.concat(b);
    }, []);
  }

  var mouseEnabled = false;
  var mouseRenderer = undefined;

  function enableMouse(camera, renderer) {
    mouseEnabled = true;
    mouseRenderer = renderer;
    mouseInput.mouseCamera = camera;
    return mouseInput.laser;
  }

  function disableMouse() {
    mouseEnabled = false;
  }

  /*
    The default laser pointer coming out of each InputObject.
  */
  var laserMaterial = new THREE.LineBasicMaterial({ color: 0x55aaff, transparent: true, blending: THREE.AdditiveBlending });
  function createLaser() {
    var g = new THREE.Geometry();
    g.vertices.push(new THREE.Vector3());
    g.vertices.push(new THREE.Vector3(0, 0, 0));
    return new THREE.Line(g, laserMaterial);
  }

  /*
    A "cursor", eg the ball that appears at the end of your laser.
  */
  var cursorMaterial = new THREE.MeshBasicMaterial({ color: 0x444444, transparent: true, blending: THREE.AdditiveBlending });
  function createCursor() {
    return new THREE.Mesh(new THREE.SphereGeometry(0.006, 4, 4), cursorMaterial);
  }

  /*
    Creates a generic Input type.
    Takes any THREE.Object3D type object and uses its position
    and orientation as an input device.
     A laser pointer is included and will be updated.
    Contains state about which Interaction is currently being used or hover.
  */
  function createInput() {
    var inputObject = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : new THREE.Group();

    var input = {
      raycast: new THREE.Raycaster(new THREE.Vector3(), new THREE.Vector3()),
      laser: createLaser(),
      cursor: createCursor(),
      object: inputObject,
      pressed: false,
      gripped: false,
      events: new _events2.default(),
      interaction: {
        grip: undefined,
        press: undefined,
        hover: undefined
      }
    };

    input.laser.add(input.cursor);

    return input;
  }

  /*
    MouseInput.
    Allows you to click on the screen when not in VR for debugging.
  */
  var mouseInput = createMouseInput();

  function createMouseInput() {
    var mouse = new THREE.Vector2(-1, -1);

    var input = createInput();
    input.mouse = mouse;
    input.mouseIntersection = new THREE.Vector3();
    input.mouseOffset = new THREE.Vector3();
    input.mousePlane = new THREE.Plane();
    input.intersections = [];

    //  set my enableMouse
    input.mouseCamera = undefined;

    window.addEventListener('mousemove', function (event) {
      // if a specific renderer has been defined
      if (mouseRenderer) {
        var clientRect = mouseRenderer.domElement.getBoundingClientRect();
        mouse.x = (event.clientX - clientRect.left) / clientRect.width * 2 - 1;
        mouse.y = -((event.clientY - clientRect.top) / clientRect.height) * 2 + 1;
      }
      // default to fullscreen
      else {
          mouse.x = event.clientX / window.innerWidth * 2 - 1;
          mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
        }
    }, false);

    window.addEventListener('mousedown', function (event) {
      if (input.intersections.length > 0) {
        // prevent mouse down from triggering other listeners (polyfill, etc)
        event.stopImmediatePropagation();
        input.pressed = true;
      }
    }, true);

    window.addEventListener('mouseup', function (event) {
      input.pressed = false;
    }, false);

    return input;
  }

  /*
    Public function users run to give DAT GUI an input device.
    Automatically detects for ViveController and binds buttons + haptic feedback.
     Returns a laser pointer so it can be directly added to scene.
     The laser will then have two methods:
    laser.pressed(), laser.gripped()
     These can then be bound to any button the user wants. Useful for binding to
    cardboard or alternate input devices.
     For example...
      document.addEventListener( 'mousedown', function(){ laser.pressed( true ); } );
  */
  function addInputObject(object) {
    var input = createInput(object);

    input.laser.pressed = function (flag) {
      // only pay attention to presses over the GUI
      if (flag && input.intersections.length > 0) {
        input.pressed = true;
      } else {
        input.pressed = false;
      }
    };

    input.laser.gripped = function (flag) {
      input.gripped = flag;
    };

    input.laser.cursor = input.cursor;

    if (THREE.ViveController && object instanceof THREE.ViveController) {
      bindViveController(input, object, input.laser.pressed, input.laser.gripped);
    }

    inputObjects.push(input);

    return input.laser;
  }

  /*
    Here are the main dat gui controller types.
  */

  function addSlider(object, propertyName) {
    var min = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0.0;
    var max = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 100.0;

    var slider = (0, _slider2.default)({
      textCreator: textCreator, propertyName: propertyName, object: object, min: min, max: max,
      initialValue: object[propertyName]
    });

    controllers.push(slider);
    hitscanObjects.push.apply(hitscanObjects, _toConsumableArray(slider.hitscan));

    return slider;
  }

  function addCheckbox(object, propertyName) {
    var checkbox = (0, _checkbox2.default)({
      textCreator: textCreator, propertyName: propertyName, object: object,
      initialValue: object[propertyName]
    });

    controllers.push(checkbox);
    hitscanObjects.push.apply(hitscanObjects, _toConsumableArray(checkbox.hitscan));

    return checkbox;
  }

  function addButton(object, propertyName) {
    var button = (0, _button2.default)({
      textCreator: textCreator, propertyName: propertyName, object: object
    });

    controllers.push(button);
    hitscanObjects.push.apply(hitscanObjects, _toConsumableArray(button.hitscan));
    return button;
  }

  function addImageButton(func, image) {
    var object = { f: func };
    var propertyName = 'f';

    //see also folder.js where this is added to group object...
    //as such this function also needs to be passed as an argument to createFolder.
    //perhaps all of these 'addX' functions could be initially put onto an object so that
    //new additions could be added slightly more easily.
    var button = (0, _imagebutton2.default)({
      textCreator: textCreator, object: object, propertyName: propertyName, image: image
    });
    controllers.push(button);
    hitscanObjects.push.apply(hitscanObjects, _toConsumableArray(button.hitscan)); //PJT: what does this ... actually mean?
    return button;
  }

  function addDropdown(object, propertyName, options) {
    var dropdown = (0, _dropdown2.default)({
      textCreator: textCreator, propertyName: propertyName, object: object, options: options
    });

    controllers.push(dropdown);
    hitscanObjects.push.apply(hitscanObjects, _toConsumableArray(dropdown.hitscan));
    return dropdown;
  }

  /*
    An implicit Add function which detects for property type
    and gives you the correct controller.
     Dropdown:
      add( object, propertyName, objectType )
     Slider:
      add( object, propertyOfNumberType, min, max )
     Checkbox:
      add( object, propertyOfBooleanType )
     Button:
      add( object, propertyOfFunctionType )
     Not used directly. Used by folders.
  */

  function add(object, propertyName, arg3, arg4) {

    if (object === undefined) {
      return undefined;
    } else if (object[propertyName] === undefined) {
      console.warn('no property named', propertyName, 'on object', object);
      return new THREE.Group();
    }

    if (isObject(arg3) || isArray(arg3)) {
      return addDropdown(object, propertyName, arg3);
    }

    if (isNumber(object[propertyName])) {
      return addSlider(object, propertyName, arg3, arg4);
    }

    if (isBoolean(object[propertyName])) {
      return addCheckbox(object, propertyName);
    }

    if (isFunction(object[propertyName])) {
      return addButton(object, propertyName);
    }

    //  add couldn't figure it out, pass it back to folder
    return undefined;
  }

  function addSimpleSlider() {
    var min = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
    var max = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;

    var proxy = {
      number: min
    };

    return addSlider(proxy, 'number', min, max);
  }

  function addSimpleDropdown() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

    var proxy = {
      option: ''
    };

    if (options !== undefined) {
      proxy.option = isArray(options) ? options[0] : options[Object.keys(options)[0]];
    }

    return addDropdown(proxy, 'option', options);
  }

  function addSimpleCheckbox() {
    var defaultOption = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

    var proxy = {
      checked: defaultOption
    };

    return addCheckbox(proxy, 'checked');
  }

  function addSimpleButton(fn) {
    var proxy = {
      button: fn !== undefined ? fn : function () {}
    };

    return addButton(proxy, 'button');
  }

  /*
    Creates a folder with the name.
     Folders are THREE.Group type objects and can do group.add() for siblings.
    Folders will automatically attempt to lay its children out in sequence.
     Folders are given the add() functionality so that they can do
    folder.add( ... ) to create controllers.
  */

  function create(name) {
    var folder = (0, _folder2.default)({
      textCreator: textCreator,
      name: name,
      guiAdd: add,
      addSlider: addSimpleSlider,
      addDropdown: addSimpleDropdown,
      addCheckbox: addSimpleCheckbox,
      addButton: addSimpleButton,
      addImageButton: addImageButton
    });

    controllers.push(folder);
    if (folder.hitscan) {
      hitscanObjects.push.apply(hitscanObjects, _toConsumableArray(folder.hitscan));
    }

    return folder;
  }

  /*
    Perform the necessary updates, raycasts on its own RAF.
  */

  var tPosition = new THREE.Vector3();
  var tDirection = new THREE.Vector3(0, 0, -1);
  var tMatrix = new THREE.Matrix4();

  function update() {
    requestAnimationFrame(update);

    var hitscanObjects = getVisibleHitscanObjects();

    if (mouseEnabled) {
      mouseInput.intersections = performMouseInput(hitscanObjects, mouseInput);
    }

    inputObjects.forEach(function () {
      var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
          box = _ref.box,
          object = _ref.object,
          raycast = _ref.raycast,
          laser = _ref.laser,
          cursor = _ref.cursor;

      var index = arguments[1];

      object.updateMatrixWorld();

      tPosition.set(0, 0, 0).setFromMatrixPosition(object.matrixWorld);
      tMatrix.identity().extractRotation(object.matrixWorld);
      tDirection.set(0, 0, -1).applyMatrix4(tMatrix).normalize();

      raycast.set(tPosition, tDirection);

      laser.geometry.vertices[0].copy(tPosition);

      //  debug...
      // laser.geometry.vertices[ 1 ].copy( tPosition ).add( tDirection.multiplyScalar( 1 ) );

      var intersections = raycast.intersectObjects(hitscanObjects, false);
      parseIntersections(intersections, laser, cursor);

      inputObjects[index].intersections = intersections;
    });

    var inputs = inputObjects.slice();

    if (mouseEnabled) {
      inputs.push(mouseInput);
    }

    controllers.forEach(function (controller) {
      //nb, we could do a more thorough check for visibilty, not sure how important
      //this bit is at this stage...
      if (controller.visible) controller.update(inputs);
    });
  }

  function updateLaser(laser, point) {
    laser.geometry.vertices[1].copy(point);
    laser.visible = true;
    laser.geometry.computeBoundingSphere();
    laser.geometry.computeBoundingBox();
    laser.geometry.verticesNeedUpdate = true;
  }

  function parseIntersections(intersections, laser, cursor) {
    if (intersections.length > 0) {
      var firstHit = intersections[0];
      updateLaser(laser, firstHit.point);
      cursor.position.copy(firstHit.point);
      cursor.visible = true;
      cursor.updateMatrixWorld();
    } else {
      laser.visible = false;
      cursor.visible = false;
    }
  }

  function parseMouseIntersection(intersection, laser, cursor) {
    cursor.position.copy(intersection);
    updateLaser(laser, cursor.position);
  }

  function performMouseIntersection(raycast, mouse, camera) {
    raycast.setFromCamera(mouse, camera);
    var hitscanObjects = getVisibleHitscanObjects();
    return raycast.intersectObjects(hitscanObjects, false);
  }

  function mouseIntersectsPlane(raycast, v, plane) {
    return raycast.ray.intersectPlane(plane, v);
  }

  function performMouseInput(hitscanObjects) {
    var _ref2 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
        box = _ref2.box,
        object = _ref2.object,
        raycast = _ref2.raycast,
        laser = _ref2.laser,
        cursor = _ref2.cursor,
        mouse = _ref2.mouse,
        mouseCamera = _ref2.mouseCamera;

    var intersections = [];

    if (mouseCamera) {
      intersections = performMouseIntersection(raycast, mouse, mouseCamera);
      parseIntersections(intersections, laser, cursor);
      cursor.visible = true;
      laser.visible = true;
    }

    return intersections;
  }

  update();

  /*
    Public methods.
  */

  return {
    create: create,
    addInputObject: addInputObject,
    enableMouse: enableMouse,
    disableMouse: disableMouse
  };
}();

if (window) {
  if (window.dat === undefined) {
    window.dat = {};
  }

  window.dat.GUIVR = GUIVR;
}

if (module) {
  module.exports = {
    dat: GUIVR
  };
}

if (typeof define === 'function' && define.amd) {
  define([], GUIVR);
}

/*
  Bunch of state-less utility functions.
*/

function isNumber(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}

function isBoolean(n) {
  return typeof n === 'boolean';
}

function isFunction(functionToCheck) {
  var getType = {};
  return functionToCheck && getType.toString.call(functionToCheck) === '[object Function]';
}

//  only {} objects not arrays
//                    which are technically objects but you're just being pedantic
function isObject(item) {
  return (typeof item === 'undefined' ? 'undefined' : _typeof(item)) === 'object' && !Array.isArray(item) && item !== null;
}

function isArray(o) {
  return Array.isArray(o);
}

/*
  Controller-specific support.
*/

function bindViveController(input, controller, pressed, gripped) {
  controller.addEventListener('triggerdown', function () {
    return pressed(true);
  });
  controller.addEventListener('triggerup', function () {
    return pressed(false);
  });
  controller.addEventListener('gripsdown', function () {
    return gripped(true);
  });
  controller.addEventListener('gripsup', function () {
    return gripped(false);
  });

  var gamepad = controller.getGamepad();
  function vibrate(t, a) {
    if (gamepad && gamepad.hapticActuators.length > 0) {
      gamepad.hapticActuators[0].pulse(t, a);
    }
  }

  function hapticsTap() {
    setIntervalTimes(function (x, t, a) {
      return vibrate(1 - a, 0.5);
    }, 10, 20);
  }

  function hapticsEcho() {
    setIntervalTimes(function (x, t, a) {
      return vibrate(4, 1.0 * (1 - a));
    }, 100, 4);
  }

  input.events.on('onControllerHeld', function (input) {
    vibrate(0.3, 0.3);
  });

  input.events.on('grabbed', function () {
    hapticsTap();
  });

  input.events.on('grabReleased', function () {
    hapticsEcho();
  });

  input.events.on('pinned', function () {
    hapticsTap();
  });

  input.events.on('pinReleased', function () {
    hapticsEcho();
  });
}

function setIntervalTimes(cb, delay, times) {
  var x = 0;
  var id = setInterval(function () {
    cb(x, times, x / times);
    x++;
    if (x >= times) {
      clearInterval(id);
    }
  }, delay);
  return id;
}

},{"./button":1,"./checkbox":2,"./dropdown":4,"./folder":5,"./imagebutton":9,"./sdftext":14,"./slider":16,"events":22}],11:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = createInteraction;

var _events = require('events');

var _events2 = _interopRequireDefault(_events);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function createInteraction(hitVolume) {
  var events = new _events2.default();

  var anyHover = false;
  var anyPressing = false;

  var hover = false;
  var anyActive = false;

  var tVector = new THREE.Vector3();
  var availableInputs = [];

  function update(inputObjects) {

    hover = false;
    anyPressing = false;
    anyActive = false;

    inputObjects.forEach(function (input) {

      if (availableInputs.indexOf(input) < 0) {
        availableInputs.push(input);
      }

      var _extractHit = extractHit(input),
          hitObject = _extractHit.hitObject,
          hitPoint = _extractHit.hitPoint;

      hover = hover || hitVolume === hitObject;

      performStateEvents({
        input: input,
        hover: hover,
        hitObject: hitObject, hitPoint: hitPoint,
        buttonName: 'pressed',
        interactionName: 'press',
        downName: 'onPressed',
        holdName: 'pressing',
        upName: 'onReleased'
      });

      performStateEvents({
        input: input,
        hover: hover,
        hitObject: hitObject, hitPoint: hitPoint,
        buttonName: 'gripped',
        interactionName: 'grip',
        downName: 'onGripped',
        holdName: 'gripping',
        upName: 'onReleaseGrip'
      });

      events.emit('tick', {
        input: input,
        hitObject: hitObject,
        inputObject: input.object
      });
    });
  }

  function extractHit(input) {
    if (input.intersections.length <= 0) {
      return {
        hitPoint: tVector.setFromMatrixPosition(input.cursor.matrixWorld).clone(),
        hitObject: undefined
      };
    } else {
      return {
        hitPoint: input.intersections[0].point,
        hitObject: input.intersections[0].object
      };
    }
  }

  function performStateEvents() {
    var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
        input = _ref.input,
        hover = _ref.hover,
        hitObject = _ref.hitObject,
        hitPoint = _ref.hitPoint,
        buttonName = _ref.buttonName,
        interactionName = _ref.interactionName,
        downName = _ref.downName,
        holdName = _ref.holdName,
        upName = _ref.upName;

    if (input[buttonName] === true && hitObject === undefined) {
      return;
    }

    //  hovering and button down but no interactions active yet
    if (hover && input[buttonName] === true && input.interaction[interactionName] === undefined) {

      var payload = {
        input: input,
        hitObject: hitObject,
        point: hitPoint,
        inputObject: input.object,
        locked: false
      };
      events.emit(downName, payload);

      if (payload.locked) {
        input.interaction[interactionName] = interaction;
        input.interaction.hover = interaction;
      }

      anyPressing = true;
      anyActive = true;
    }

    //  button still down and this is the active interaction
    if (input[buttonName] && input.interaction[interactionName] === interaction) {
      var _payload = {
        input: input,
        hitObject: hitObject,
        point: hitPoint,
        inputObject: input.object,
        locked: false
      };

      events.emit(holdName, _payload);

      anyPressing = true;

      input.events.emit('onControllerHeld');
    }

    //  button not down and this is the active interaction
    if (input[buttonName] === false && input.interaction[interactionName] === interaction) {
      input.interaction[interactionName] = undefined;
      input.interaction.hover = undefined;
      events.emit(upName, {
        input: input,
        hitObject: hitObject,
        point: hitPoint,
        inputObject: input.object
      });
    }
  }

  function isMainHover() {

    var noMainHover = true;
    for (var i = 0; i < availableInputs.length; i++) {
      if (availableInputs[i].interaction.hover !== undefined) {
        noMainHover = false;
        break;
      }
    }

    if (noMainHover) {
      return hover;
    }

    if (availableInputs.filter(function (input) {
      return input.interaction.hover === interaction;
    }).length > 0) {
      return true;
    }

    return false;
  }

  var interaction = {
    hovering: isMainHover,
    pressing: function pressing() {
      return anyPressing;
    },
    update: update,
    events: events
  };

  return interaction;
} /**
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

},{"events":22}],12:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CHECKBOX_SIZE = exports.BORDER_THICKNESS = exports.FOLDER_GRAB_HEIGHT = exports.FOLDER_HEIGHT = exports.FOLDER_WIDTH = exports.BUTTON_DEPTH = exports.CONTROLLER_ID_DEPTH = exports.CONTROLLER_ID_WIDTH = exports.PANEL_VALUE_TEXT_MARGIN = exports.PANEL_LABEL_TEXT_MARGIN = exports.PANEL_MARGIN = exports.PANEL_SPACING = exports.PANEL_DEPTH = exports.PANEL_HEIGHT = exports.PANEL_WIDTH = undefined;
exports.alignLeft = alignLeft;
exports.createPanel = createPanel;
exports.createControllerIDBox = createControllerIDBox;
exports.createDownArrow = createDownArrow;

var _sharedmaterials = require('./sharedmaterials');

var SharedMaterials = _interopRequireWildcard(_sharedmaterials);

var _colors = require('./colors');

var Colors = _interopRequireWildcard(_colors);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

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

function alignLeft(obj) {
  if (obj instanceof THREE.Mesh) {
    obj.geometry.computeBoundingBox();
    var width = obj.geometry.boundingBox.max.x - obj.geometry.boundingBox.max.y;
    obj.geometry.translate(width, 0, 0);
    return obj;
  } else if (obj instanceof THREE.Geometry) {
    obj.computeBoundingBox();
    var _width = obj.boundingBox.max.x - obj.boundingBox.max.y;
    obj.translate(_width, 0, 0);
    return obj;
  }
}

function createPanel(width, height, depth, uniqueMaterial) {
  var material = uniqueMaterial ? new THREE.MeshBasicMaterial({ color: 0xffffff }) : SharedMaterials.PANEL;
  var panel = new THREE.Mesh(new THREE.BoxGeometry(width, height, depth), material);
  panel.geometry.translate(width * 0.5, 0, 0);

  if (uniqueMaterial) {
    material.color.setHex(Colors.DEFAULT_BACK);
  } else {
    Colors.colorizeGeometry(panel.geometry, Colors.DEFAULT_BACK);
  }

  return panel;
}

function createControllerIDBox(height, color) {
  var panel = new THREE.Mesh(new THREE.BoxGeometry(CONTROLLER_ID_WIDTH, height, CONTROLLER_ID_DEPTH), SharedMaterials.PANEL);
  panel.geometry.translate(CONTROLLER_ID_WIDTH * 0.5, 0, 0);
  Colors.colorizeGeometry(panel.geometry, color);
  return panel;
}

function createDownArrow() {
  var w = 0.0096;
  var h = 0.016;
  var sh = new THREE.Shape();
  sh.moveTo(0, 0);
  sh.lineTo(-w, h);
  sh.lineTo(w, h);
  sh.lineTo(0, 0);

  var geo = new THREE.ShapeGeometry(sh);
  geo.translate(0, -h * 0.5, 0);

  return new THREE.Mesh(geo, SharedMaterials.PANEL);
}

var PANEL_WIDTH = exports.PANEL_WIDTH = 1.0;
var PANEL_HEIGHT = exports.PANEL_HEIGHT = 0.08;
var PANEL_DEPTH = exports.PANEL_DEPTH = 0.01;
var PANEL_SPACING = exports.PANEL_SPACING = 0.001;
var PANEL_MARGIN = exports.PANEL_MARGIN = 0.015;
var PANEL_LABEL_TEXT_MARGIN = exports.PANEL_LABEL_TEXT_MARGIN = 0.06;
var PANEL_VALUE_TEXT_MARGIN = exports.PANEL_VALUE_TEXT_MARGIN = 0.02;
var CONTROLLER_ID_WIDTH = exports.CONTROLLER_ID_WIDTH = 0.02;
var CONTROLLER_ID_DEPTH = exports.CONTROLLER_ID_DEPTH = 0.001;
var BUTTON_DEPTH = exports.BUTTON_DEPTH = 0.01;
var FOLDER_WIDTH = exports.FOLDER_WIDTH = 1.026;
var FOLDER_HEIGHT = exports.FOLDER_HEIGHT = 0.08;
var FOLDER_GRAB_HEIGHT = exports.FOLDER_GRAB_HEIGHT = 0.0512;
var BORDER_THICKNESS = exports.BORDER_THICKNESS = 0.01;
var CHECKBOX_SIZE = exports.CHECKBOX_SIZE = 0.05;

},{"./colors":3,"./sharedmaterials":15}],13:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.create = create;

var _interaction = require('./interaction');

var _interaction2 = _interopRequireDefault(_interaction);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function create() {
  var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
      group = _ref.group,
      panel = _ref.panel;

  var interaction = (0, _interaction2.default)(panel);

  interaction.events.on('onGripped', handleOnGrip);
  interaction.events.on('onReleaseGrip', handleOnGripRelease);

  var oldParent = void 0;
  var oldPosition = new THREE.Vector3();
  var oldRotation = new THREE.Euler();

  var rotationGroup = new THREE.Group();
  rotationGroup.scale.set(0.3, 0.3, 0.3);
  rotationGroup.position.set(-0.015, 0.015, 0.0);

  function handleOnGrip(p) {
    var inputObject = p.inputObject,
        input = p.input;


    var folder = group.folder;
    if (folder === undefined) {
      return;
    }

    if (folder.beingMoved === true) {
      return;
    }

    oldPosition.copy(folder.position);
    oldRotation.copy(folder.rotation);

    folder.position.set(0, 0, 0);
    folder.rotation.set(0, 0, 0);
    folder.rotation.x = -Math.PI * 0.5;

    oldParent = folder.parent;

    rotationGroup.add(folder);

    inputObject.add(rotationGroup);

    p.locked = true;

    folder.beingMoved = true;

    input.events.emit('pinned', input);
  }

  function handleOnGripRelease() {
    var _ref2 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
        inputObject = _ref2.inputObject,
        input = _ref2.input;

    var folder = group.folder;
    if (folder === undefined) {
      return;
    }

    if (oldParent === undefined) {
      return;
    }

    if (folder.beingMoved === false) {
      return;
    }

    oldParent.add(folder);
    oldParent = undefined;

    folder.position.copy(oldPosition);
    folder.rotation.copy(oldRotation);

    folder.beingMoved = false;

    input.events.emit('pinReleased', input);
  }

  return interaction;
} /**
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

},{"./interaction":11}],14:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createMaterial = createMaterial;
exports.creator = creator;

var _sdf = require('three-bmfont-text/shaders/sdf');

var _sdf2 = _interopRequireDefault(_sdf);

var _threeBmfontText = require('three-bmfont-text');

var _threeBmfontText2 = _interopRequireDefault(_threeBmfontText);

var _parseBmfontAscii = require('parse-bmfont-ascii');

var _parseBmfontAscii2 = _interopRequireDefault(_parseBmfontAscii);

var _font = require('./font');

var Font = _interopRequireWildcard(_font);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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

function createMaterial(color) {

  var texture = new THREE.Texture();
  var image = Font.image();
  texture.image = image;
  texture.needsUpdate = true;
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.generateMipmaps = false;

  return new THREE.RawShaderMaterial((0, _sdf2.default)({
    side: THREE.DoubleSide,
    transparent: true,
    color: color,
    map: texture
  }));
}

var textScale = 0.00024;

function creator() {

  var font = (0, _parseBmfontAscii2.default)(Font.fnt());

  var colorMaterials = {};

  function createText(str, font) {
    var color = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0xffffff;
    var scale = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 1.0;


    var geometry = (0, _threeBmfontText2.default)({
      text: str,
      align: 'left',
      width: 10000,
      flipY: true,
      font: font
    });

    var layout = geometry.layout;

    var material = colorMaterials[color];
    if (material === undefined) {
      material = colorMaterials[color] = createMaterial(color);
    }
    var mesh = new THREE.Mesh(geometry, material);
    mesh.scale.multiply(new THREE.Vector3(1, -1, 1));

    var finalScale = scale * textScale;

    mesh.scale.multiplyScalar(finalScale);

    mesh.position.y = layout.height * 0.5 * finalScale;

    return mesh;
  }

  function create(str) {
    var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
        _ref$color = _ref.color,
        color = _ref$color === undefined ? 0xffffff : _ref$color,
        _ref$scale = _ref.scale,
        scale = _ref$scale === undefined ? 1.0 : _ref$scale;

    var group = new THREE.Group();

    var mesh = createText(str, font, color, scale);
    group.add(mesh);
    group.layout = mesh.geometry.layout;

    group.update = function (str) {
      mesh.geometry.update(str);
    };

    return group;
  }

  return {
    create: create,
    getMaterial: function getMaterial() {
      return material;
    }
  };
}

},{"./font":6,"parse-bmfont-ascii":29,"three-bmfont-text":31,"three-bmfont-text/shaders/sdf":34}],15:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.FOLDER = exports.LOCATOR = exports.PANEL = undefined;

var _colors = require('./colors');

var Colors = _interopRequireWildcard(_colors);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

var PANEL = exports.PANEL = new THREE.MeshBasicMaterial({ color: 0xffffff, vertexColors: THREE.VertexColors }); /**
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

var LOCATOR = exports.LOCATOR = new THREE.MeshBasicMaterial();
var FOLDER = exports.FOLDER = new THREE.MeshBasicMaterial({ color: 0x000000 });

},{"./colors":3}],16:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = createSlider;

var _textlabel = require('./textlabel');

var _textlabel2 = _interopRequireDefault(_textlabel);

var _interaction = require('./interaction');

var _interaction2 = _interopRequireDefault(_interaction);

var _colors = require('./colors');

var Colors = _interopRequireWildcard(_colors);

var _layout = require('./layout');

var Layout = _interopRequireWildcard(_layout);

var _sharedmaterials = require('./sharedmaterials');

var SharedMaterials = _interopRequireWildcard(_sharedmaterials);

var _grab = require('./grab');

var Grab = _interopRequireWildcard(_grab);

var _palette = require('./palette');

var Palette = _interopRequireWildcard(_palette);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function createSlider() {
  var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
      textCreator = _ref.textCreator,
      object = _ref.object,
      _ref$propertyName = _ref.propertyName,
      propertyName = _ref$propertyName === undefined ? 'undefined' : _ref$propertyName,
      _ref$initialValue = _ref.initialValue,
      initialValue = _ref$initialValue === undefined ? 0.0 : _ref$initialValue,
      _ref$min = _ref.min,
      min = _ref$min === undefined ? 0.0 : _ref$min,
      _ref$max = _ref.max,
      max = _ref$max === undefined ? 1.0 : _ref$max,
      _ref$step = _ref.step,
      step = _ref$step === undefined ? 0.1 : _ref$step,
      _ref$width = _ref.width,
      width = _ref$width === undefined ? Layout.PANEL_WIDTH : _ref$width,
      _ref$height = _ref.height,
      height = _ref$height === undefined ? Layout.PANEL_HEIGHT : _ref$height,
      _ref$depth = _ref.depth,
      depth = _ref$depth === undefined ? Layout.PANEL_DEPTH : _ref$depth;

  var SLIDER_WIDTH = width * 0.5 - Layout.PANEL_MARGIN;
  var SLIDER_HEIGHT = height - Layout.PANEL_MARGIN;
  var SLIDER_DEPTH = depth;

  var state = {
    alpha: 1.0,
    value: initialValue,
    step: step,
    useStep: true,
    precision: 1,
    listen: false,
    min: min,
    max: max,
    onChangedCB: undefined,
    onFinishedChange: undefined,
    pressing: false
  };

  state.step = getImpliedStep(state.value);
  state.precision = numDecimals(state.step);
  state.alpha = getAlphaFromValue(state.value, state.min, state.max);

  var group = new THREE.Group();

  //  filled volume
  var rect = new THREE.BoxGeometry(SLIDER_WIDTH, SLIDER_HEIGHT, SLIDER_DEPTH);
  rect.translate(SLIDER_WIDTH * 0.5, 0, 0);
  // Layout.alignLeft( rect );

  var hitscanMaterial = new THREE.MeshBasicMaterial();
  hitscanMaterial.visible = false;

  var hitscanVolume = new THREE.Mesh(rect.clone(), hitscanMaterial);
  hitscanVolume.position.z = depth;
  hitscanVolume.position.x = width * 0.5;
  hitscanVolume.name = 'hitscanVolume';

  //  sliderBG volume
  var sliderBG = new THREE.Mesh(rect.clone(), SharedMaterials.PANEL);
  Colors.colorizeGeometry(sliderBG.geometry, Colors.SLIDER_BG);
  sliderBG.position.z = depth * 0.5;
  sliderBG.position.x = SLIDER_WIDTH + Layout.PANEL_MARGIN;

  var material = new THREE.MeshBasicMaterial({ color: Colors.DEFAULT_COLOR });
  var filledVolume = new THREE.Mesh(rect.clone(), material);
  filledVolume.position.z = depth * 0.5;
  hitscanVolume.add(filledVolume);

  var endLocator = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.05, 0.05, 1, 1, 1), SharedMaterials.LOCATOR);
  endLocator.position.x = SLIDER_WIDTH;
  hitscanVolume.add(endLocator);
  endLocator.visible = false;

  var valueLabel = textCreator.create(state.value.toString());
  valueLabel.position.x = Layout.PANEL_VALUE_TEXT_MARGIN + width * 0.5;
  valueLabel.position.z = depth * 2.5;
  valueLabel.position.y = -0.0325;

  var descriptorLabel = textCreator.create(propertyName);
  descriptorLabel.position.x = Layout.PANEL_LABEL_TEXT_MARGIN;
  descriptorLabel.position.z = depth;
  descriptorLabel.position.y = -0.03;

  var controllerID = Layout.createControllerIDBox(height, Colors.CONTROLLER_ID_SLIDER);
  controllerID.position.z = depth;

  var panel = Layout.createPanel(width, height, depth);
  panel.name = 'panel';
  panel.add(descriptorLabel, hitscanVolume, sliderBG, valueLabel, controllerID);

  group.add(panel);

  updateValueLabel(state.value);
  updateSlider();

  function updateValueLabel(value) {
    if (state.useStep) {
      valueLabel.update(roundToDecimal(state.value, state.precision).toString());
    } else {
      valueLabel.update(state.value.toString());
    }
  }

  function updateView() {
    if (state.pressing) {
      material.color.setHex(Colors.INTERACTION_COLOR);
    } else if (interaction.hovering()) {
      material.color.setHex(Colors.HIGHLIGHT_COLOR);
    } else {
      material.color.setHex(Colors.DEFAULT_COLOR);
    }
  }

  function updateSlider() {
    filledVolume.scale.x = Math.min(Math.max(getAlphaFromValue(state.value, state.min, state.max) * width, 0.000001), width);
  }

  function updateObject(value) {
    object[propertyName] = value;
  }

  function updateStateFromAlpha(alpha) {
    state.alpha = getClampedAlpha(alpha);
    state.value = getValueFromAlpha(state.alpha, state.min, state.max);
    if (state.useStep) {
      state.value = getSteppedValue(state.value, state.step);
    }
    state.value = getClampedValue(state.value, state.min, state.max);
  }

  function listenUpdate() {
    state.value = getValueFromObject();
    state.alpha = getAlphaFromValue(state.value, state.min, state.max);
    state.alpha = getClampedAlpha(state.alpha);
  }

  function getValueFromObject() {
    return parseFloat(object[propertyName]);
  }

  group.onChange = function (callback) {
    state.onChangedCB = callback;
    return group;
  };

  group.step = function (step) {
    state.step = step;
    state.precision = numDecimals(state.step);
    state.useStep = true;

    state.alpha = getAlphaFromValue(state.value, state.min, state.max);

    updateStateFromAlpha(state.alpha);
    updateValueLabel(state.value);
    updateSlider();
    return group;
  };

  group.listen = function () {
    state.listen = true;
    return group;
  };

  var interaction = (0, _interaction2.default)(hitscanVolume);
  interaction.events.on('onPressed', handlePress);
  interaction.events.on('pressing', handleHold);
  interaction.events.on('onReleased', handleRelease);

  function handlePress(p) {
    if (group.visible === false) {
      return;
    }
    state.pressing = true;
    p.locked = true;
  }

  function handleHold() {
    var _ref2 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
        point = _ref2.point;

    if (group.visible === false) {
      return;
    }

    state.pressing = true;

    filledVolume.updateMatrixWorld();
    endLocator.updateMatrixWorld();

    var a = new THREE.Vector3().setFromMatrixPosition(filledVolume.matrixWorld);
    var b = new THREE.Vector3().setFromMatrixPosition(endLocator.matrixWorld);

    var previousValue = state.value;

    updateStateFromAlpha(getPointAlpha(point, { a: a, b: b }));
    updateValueLabel(state.value);
    updateSlider();
    updateObject(state.value);

    if (previousValue !== state.value && state.onChangedCB) {
      state.onChangedCB(state.value);
    }
  }

  function handleRelease() {
    state.pressing = false;
  }

  group.interaction = interaction;
  group.hitscan = [hitscanVolume, panel];

  var grabInteraction = Grab.create({ group: group, panel: panel });
  var paletteInteraction = Palette.create({ group: group, panel: panel });

  group.update = function (inputObjects) {
    interaction.update(inputObjects);
    grabInteraction.update(inputObjects);
    paletteInteraction.update(inputObjects);

    if (state.listen) {
      listenUpdate();
      updateValueLabel(state.value);
      updateSlider();
    }
    updateView();
  };

  group.name = function (str) {
    descriptorLabel.update(str);
    return group;
  };

  group.min = function (m) {
    state.min = m;
    state.alpha = getAlphaFromValue(state.value, state.min, state.max);
    updateStateFromAlpha(state.alpha);
    updateValueLabel(state.value);
    updateSlider();
    return group;
  };

  group.max = function (m) {
    state.max = m;
    state.alpha = getAlphaFromValue(state.value, state.min, state.max);
    updateStateFromAlpha(state.alpha);
    updateValueLabel(state.value);
    updateSlider();
    return group;
  };

  return group;
} /**
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

var ta = new THREE.Vector3();
var tb = new THREE.Vector3();
var tToA = new THREE.Vector3();
var aToB = new THREE.Vector3();

function getPointAlpha(point, segment) {
  ta.copy(segment.b).sub(segment.a);
  tb.copy(point).sub(segment.a);

  var projected = tb.projectOnVector(ta);

  tToA.copy(point).sub(segment.a);

  aToB.copy(segment.b).sub(segment.a).normalize();

  var side = tToA.normalize().dot(aToB) >= 0 ? 1 : -1;

  var length = segment.a.distanceTo(segment.b) * side;

  var alpha = projected.length() / length;
  if (alpha > 1.0) {
    alpha = 1.0;
  }
  if (alpha < 0.0) {
    alpha = 0.0;
  }
  return alpha;
}

function lerp(min, max, value) {
  return (1 - value) * min + value * max;
}

function map_range(value, low1, high1, low2, high2) {
  return low2 + (high2 - low2) * (value - low1) / (high1 - low1);
}

function getClampedAlpha(alpha) {
  if (alpha > 1) {
    return 1;
  }
  if (alpha < 0) {
    return 0;
  }
  return alpha;
}

function getClampedValue(value, min, max) {
  if (value < min) {
    return min;
  }
  if (value > max) {
    return max;
  }
  return value;
}

function getImpliedStep(value) {
  if (value === 0) {
    return 1; // What are we, psychics?
  } else {
    // Hey Doug, check this out.
    return Math.pow(10, Math.floor(Math.log(Math.abs(value)) / Math.LN10)) / 10;
  }
}

function getValueFromAlpha(alpha, min, max) {
  return map_range(alpha, 0.0, 1.0, min, max);
}

function getAlphaFromValue(value, min, max) {
  return map_range(value, min, max, 0.0, 1.0);
}

function getSteppedValue(value, step) {
  if (value % step != 0) {
    return Math.round(value / step) * step;
  }
  return value;
}

function numDecimals(x) {
  x = x.toString();
  if (x.indexOf('.') > -1) {
    return x.length - x.indexOf('.') - 1;
  } else {
    return 0;
  }
}

function roundToDecimal(value, decimals) {
  var tenTo = Math.pow(10, decimals);
  return Math.round(value * tenTo) / tenTo;
}

},{"./colors":3,"./grab":7,"./interaction":11,"./layout":12,"./palette":13,"./sharedmaterials":15,"./textlabel":17}],17:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = createTextLabel;

var _colors = require('./colors');

var Colors = _interopRequireWildcard(_colors);

var _sharedmaterials = require('./sharedmaterials');

var SharedMaterials = _interopRequireWildcard(_sharedmaterials);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

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

function createTextLabel(textCreator, str) {
  var width = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0.4;
  var depth = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0.029;
  var fgColor = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 0xffffff;
  var bgColor = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : Colors.DEFAULT_BACK;
  var scale = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : 1.0;


  var group = new THREE.Group();
  var internalPositioning = new THREE.Group();
  group.add(internalPositioning);

  var text = textCreator.create(str, { color: fgColor, scale: scale });
  internalPositioning.add(text);

  group.setString = function (str) {
    text.update(str.toString());
  };

  group.setNumber = function (str) {
    text.update(str.toFixed(2));
  };

  text.position.z = depth;

  var backBounds = 0.01;
  var margin = 0.01;
  var totalWidth = width;
  var totalHeight = 0.04 + margin * 2;
  var labelBackGeometry = new THREE.BoxGeometry(totalWidth, totalHeight, depth, 1, 1, 1);
  labelBackGeometry.applyMatrix(new THREE.Matrix4().makeTranslation(totalWidth * 0.5 - margin, 0, 0));

  var labelBackMesh = new THREE.Mesh(labelBackGeometry, SharedMaterials.PANEL);
  Colors.colorizeGeometry(labelBackMesh.geometry, bgColor);

  labelBackMesh.position.y = 0.03;
  internalPositioning.add(labelBackMesh);
  internalPositioning.position.y = -totalHeight * 0.5;

  group.back = labelBackMesh;

  return group;
}

},{"./colors":3,"./sharedmaterials":15}],18:[function(require,module,exports){
'use strict';

/*
 *	@author zz85 / http://twitter.com/blurspline / http://www.lab4games.net/zz85/blog
 *	@author centerionware / http://www.centerionware.com
 *
 *	Subdivision Geometry Modifier
 *		using Loop Subdivision Scheme
 *
 *	References:
 *		http://graphics.stanford.edu/~mdfisher/subdivision.html
 *		http://www.holmes3d.net/graphics/subdivision/
 *		http://www.cs.rutgers.edu/~decarlo/readings/subdiv-sg00c.pdf
 *
 *	Known Issues:
 *		- currently doesn't handle "Sharp Edges"
 */

THREE.SubdivisionModifier = function (subdivisions) {

	this.subdivisions = subdivisions === undefined ? 1 : subdivisions;
};

// Applies the "modify" pattern
THREE.SubdivisionModifier.prototype.modify = function (geometry) {

	var repeats = this.subdivisions;

	while (repeats-- > 0) {

		this.smooth(geometry);
	}

	geometry.computeFaceNormals();
	geometry.computeVertexNormals();
};

(function () {

	// Some constants
	var WARNINGS = !true; // Set to true for development
	var ABC = ['a', 'b', 'c'];

	function getEdge(a, b, map) {

		var vertexIndexA = Math.min(a, b);
		var vertexIndexB = Math.max(a, b);

		var key = vertexIndexA + "_" + vertexIndexB;

		return map[key];
	}

	function processEdge(a, b, vertices, map, face, metaVertices) {

		var vertexIndexA = Math.min(a, b);
		var vertexIndexB = Math.max(a, b);

		var key = vertexIndexA + "_" + vertexIndexB;

		var edge;

		if (key in map) {

			edge = map[key];
		} else {

			var vertexA = vertices[vertexIndexA];
			var vertexB = vertices[vertexIndexB];

			edge = {

				a: vertexA, // pointer reference
				b: vertexB,
				newEdge: null,
				// aIndex: a, // numbered reference
				// bIndex: b,
				faces: [] // pointers to face

			};

			map[key] = edge;
		}

		edge.faces.push(face);

		metaVertices[a].edges.push(edge);
		metaVertices[b].edges.push(edge);
	}

	function generateLookups(vertices, faces, metaVertices, edges) {

		var i, il, face, edge;

		for (i = 0, il = vertices.length; i < il; i++) {

			metaVertices[i] = { edges: [] };
		}

		for (i = 0, il = faces.length; i < il; i++) {

			face = faces[i];

			processEdge(face.a, face.b, vertices, edges, face, metaVertices);
			processEdge(face.b, face.c, vertices, edges, face, metaVertices);
			processEdge(face.c, face.a, vertices, edges, face, metaVertices);
		}
	}

	function newFace(newFaces, a, b, c) {

		newFaces.push(new THREE.Face3(a, b, c));
	}

	function midpoint(a, b) {

		return Math.abs(b - a) / 2 + Math.min(a, b);
	}

	function newUv(newUvs, a, b, c) {

		newUvs.push([a.clone(), b.clone(), c.clone()]);
	}

	/////////////////////////////

	// Performs one iteration of Subdivision
	THREE.SubdivisionModifier.prototype.smooth = function (geometry) {

		var tmp = new THREE.Vector3();

		var oldVertices, oldFaces, oldUvs;
		var newVertices,
		    newFaces,
		    newUVs = [];

		var n, l, i, il, j, k;
		var metaVertices, sourceEdges;

		// new stuff.
		var sourceEdges, newEdgeVertices, newSourceVertices;

		oldVertices = geometry.vertices; // { x, y, z}
		oldFaces = geometry.faces; // { a: oldVertex1, b: oldVertex2, c: oldVertex3 }
		oldUvs = geometry.faceVertexUvs[0];

		var hasUvs = oldUvs !== undefined && oldUvs.length > 0;

		/******************************************************
   *
   * Step 0: Preprocess Geometry to Generate edges Lookup
   *
   *******************************************************/

		metaVertices = new Array(oldVertices.length);
		sourceEdges = {}; // Edge => { oldVertex1, oldVertex2, faces[]  }

		generateLookups(oldVertices, oldFaces, metaVertices, sourceEdges);

		/******************************************************
   *
   *	Step 1.
   *	For each edge, create a new Edge Vertex,
   *	then position it.
   *
   *******************************************************/

		newEdgeVertices = [];
		var other, currentEdge, newEdge, face;
		var edgeVertexWeight, adjacentVertexWeight, connectedFaces;

		for (i in sourceEdges) {

			currentEdge = sourceEdges[i];
			newEdge = new THREE.Vector3();

			edgeVertexWeight = 3 / 8;
			adjacentVertexWeight = 1 / 8;

			connectedFaces = currentEdge.faces.length;

			// check how many linked faces. 2 should be correct.
			if (connectedFaces != 2) {

				// if length is not 2, handle condition
				edgeVertexWeight = 0.5;
				adjacentVertexWeight = 0;

				if (connectedFaces != 1) {

					if (WARNINGS) console.warn('Subdivision Modifier: Number of connected faces != 2, is: ', connectedFaces, currentEdge);
				}
			}

			newEdge.addVectors(currentEdge.a, currentEdge.b).multiplyScalar(edgeVertexWeight);

			tmp.set(0, 0, 0);

			for (j = 0; j < connectedFaces; j++) {

				face = currentEdge.faces[j];

				for (k = 0; k < 3; k++) {

					other = oldVertices[face[ABC[k]]];
					if (other !== currentEdge.a && other !== currentEdge.b) break;
				}

				tmp.add(other);
			}

			tmp.multiplyScalar(adjacentVertexWeight);
			newEdge.add(tmp);

			currentEdge.newEdge = newEdgeVertices.length;
			newEdgeVertices.push(newEdge);

			// console.log(currentEdge, newEdge);
		}

		/******************************************************
   *
   *	Step 2.
   *	Reposition each source vertices.
   *
   *******************************************************/

		var beta, sourceVertexWeight, connectingVertexWeight;
		var connectingEdge, connectingEdges, oldVertex, newSourceVertex;
		newSourceVertices = [];

		for (i = 0, il = oldVertices.length; i < il; i++) {

			oldVertex = oldVertices[i];

			// find all connecting edges (using lookupTable)
			connectingEdges = metaVertices[i].edges;
			n = connectingEdges.length;

			if (n == 3) {

				beta = 3 / 16;
			} else if (n > 3) {

				beta = 3 / (8 * n); // Warren's modified formula
			}

			// Loop's original beta formula
			// beta = 1 / n * ( 5/8 - Math.pow( 3/8 + 1/4 * Math.cos( 2 * Math. PI / n ), 2) );

			sourceVertexWeight = 1 - n * beta;
			connectingVertexWeight = beta;

			if (n <= 2) {

				// crease and boundary rules
				// console.warn('crease and boundary rules');

				if (n == 2) {

					if (WARNINGS) console.warn('2 connecting edges', connectingEdges);
					sourceVertexWeight = 3 / 4;
					connectingVertexWeight = 1 / 8;

					// sourceVertexWeight = 1;
					// connectingVertexWeight = 0;
				} else if (n == 1) {

					if (WARNINGS) console.warn('only 1 connecting edge');
				} else if (n == 0) {

					if (WARNINGS) console.warn('0 connecting edges');
				}
			}

			newSourceVertex = oldVertex.clone().multiplyScalar(sourceVertexWeight);

			tmp.set(0, 0, 0);

			for (j = 0; j < n; j++) {

				connectingEdge = connectingEdges[j];
				other = connectingEdge.a !== oldVertex ? connectingEdge.a : connectingEdge.b;
				tmp.add(other);
			}

			tmp.multiplyScalar(connectingVertexWeight);
			newSourceVertex.add(tmp);

			newSourceVertices.push(newSourceVertex);
		}

		/******************************************************
   *
   *	Step 3.
   *	Generate Faces between source vertices
   *	and edge vertices.
   *
   *******************************************************/

		newVertices = newSourceVertices.concat(newEdgeVertices);
		var sl = newSourceVertices.length,
		    edge1,
		    edge2,
		    edge3;
		newFaces = [];

		var uv, x0, x1, x2;
		var x3 = new THREE.Vector2();
		var x4 = new THREE.Vector2();
		var x5 = new THREE.Vector2();

		for (i = 0, il = oldFaces.length; i < il; i++) {

			face = oldFaces[i];

			// find the 3 new edges vertex of each old face

			edge1 = getEdge(face.a, face.b, sourceEdges).newEdge + sl;
			edge2 = getEdge(face.b, face.c, sourceEdges).newEdge + sl;
			edge3 = getEdge(face.c, face.a, sourceEdges).newEdge + sl;

			// create 4 faces.

			newFace(newFaces, edge1, edge2, edge3);
			newFace(newFaces, face.a, edge1, edge3);
			newFace(newFaces, face.b, edge2, edge1);
			newFace(newFaces, face.c, edge3, edge2);

			// create 4 new uv's

			if (hasUvs) {

				uv = oldUvs[i];

				x0 = uv[0];
				x1 = uv[1];
				x2 = uv[2];

				x3.set(midpoint(x0.x, x1.x), midpoint(x0.y, x1.y));
				x4.set(midpoint(x1.x, x2.x), midpoint(x1.y, x2.y));
				x5.set(midpoint(x0.x, x2.x), midpoint(x0.y, x2.y));

				newUv(newUVs, x3, x4, x5);
				newUv(newUVs, x0, x3, x5);

				newUv(newUVs, x1, x4, x3);
				newUv(newUVs, x2, x5, x4);
			}
		}

		// Overwrite old arrays
		geometry.vertices = newVertices;
		geometry.faces = newFaces;
		if (hasUvs) geometry.faceVertexUvs[0] = newUVs;

		// console.log('done');
	};
})();

},{}],19:[function(require,module,exports){
var str = Object.prototype.toString

module.exports = anArray

function anArray(arr) {
  return (
       arr.BYTES_PER_ELEMENT
    && str.call(arr.buffer) === '[object ArrayBuffer]'
    || Array.isArray(arr)
  )
}

},{}],20:[function(require,module,exports){
module.exports = function numtype(num, def) {
	return typeof num === 'number'
		? num 
		: (typeof def === 'number' ? def : 0)
}
},{}],21:[function(require,module,exports){
module.exports = function(dtype) {
  switch (dtype) {
    case 'int8':
      return Int8Array
    case 'int16':
      return Int16Array
    case 'int32':
      return Int32Array
    case 'uint8':
      return Uint8Array
    case 'uint16':
      return Uint16Array
    case 'uint32':
      return Uint32Array
    case 'float32':
      return Float32Array
    case 'float64':
      return Float64Array
    case 'array':
      return Array
    case 'uint8_clamped':
      return Uint8ClampedArray
  }
}

},{}],22:[function(require,module,exports){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

function EventEmitter() {
  this._events = this._events || {};
  this._maxListeners = this._maxListeners || undefined;
}
module.exports = EventEmitter;

// Backwards-compat with node 0.10.x
EventEmitter.EventEmitter = EventEmitter;

EventEmitter.prototype._events = undefined;
EventEmitter.prototype._maxListeners = undefined;

// By default EventEmitters will print a warning if more than 10 listeners are
// added to it. This is a useful default which helps finding memory leaks.
EventEmitter.defaultMaxListeners = 10;

// Obviously not all Emitters should be limited to 10. This function allows
// that to be increased. Set to zero for unlimited.
EventEmitter.prototype.setMaxListeners = function(n) {
  if (!isNumber(n) || n < 0 || isNaN(n))
    throw TypeError('n must be a positive number');
  this._maxListeners = n;
  return this;
};

EventEmitter.prototype.emit = function(type) {
  var er, handler, len, args, i, listeners;

  if (!this._events)
    this._events = {};

  // If there is no 'error' event listener then throw.
  if (type === 'error') {
    if (!this._events.error ||
        (isObject(this._events.error) && !this._events.error.length)) {
      er = arguments[1];
      if (er instanceof Error) {
        throw er; // Unhandled 'error' event
      } else {
        // At least give some kind of context to the user
        var err = new Error('Uncaught, unspecified "error" event. (' + er + ')');
        err.context = er;
        throw err;
      }
    }
  }

  handler = this._events[type];

  if (isUndefined(handler))
    return false;

  if (isFunction(handler)) {
    switch (arguments.length) {
      // fast cases
      case 1:
        handler.call(this);
        break;
      case 2:
        handler.call(this, arguments[1]);
        break;
      case 3:
        handler.call(this, arguments[1], arguments[2]);
        break;
      // slower
      default:
        args = Array.prototype.slice.call(arguments, 1);
        handler.apply(this, args);
    }
  } else if (isObject(handler)) {
    args = Array.prototype.slice.call(arguments, 1);
    listeners = handler.slice();
    len = listeners.length;
    for (i = 0; i < len; i++)
      listeners[i].apply(this, args);
  }

  return true;
};

EventEmitter.prototype.addListener = function(type, listener) {
  var m;

  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  if (!this._events)
    this._events = {};

  // To avoid recursion in the case that type === "newListener"! Before
  // adding it to the listeners, first emit "newListener".
  if (this._events.newListener)
    this.emit('newListener', type,
              isFunction(listener.listener) ?
              listener.listener : listener);

  if (!this._events[type])
    // Optimize the case of one listener. Don't need the extra array object.
    this._events[type] = listener;
  else if (isObject(this._events[type]))
    // If we've already got an array, just append.
    this._events[type].push(listener);
  else
    // Adding the second element, need to change to array.
    this._events[type] = [this._events[type], listener];

  // Check for listener leak
  if (isObject(this._events[type]) && !this._events[type].warned) {
    if (!isUndefined(this._maxListeners)) {
      m = this._maxListeners;
    } else {
      m = EventEmitter.defaultMaxListeners;
    }

    if (m && m > 0 && this._events[type].length > m) {
      this._events[type].warned = true;
      console.error('(node) warning: possible EventEmitter memory ' +
                    'leak detected. %d listeners added. ' +
                    'Use emitter.setMaxListeners() to increase limit.',
                    this._events[type].length);
      if (typeof console.trace === 'function') {
        // not supported in IE 10
        console.trace();
      }
    }
  }

  return this;
};

EventEmitter.prototype.on = EventEmitter.prototype.addListener;

EventEmitter.prototype.once = function(type, listener) {
  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  var fired = false;

  function g() {
    this.removeListener(type, g);

    if (!fired) {
      fired = true;
      listener.apply(this, arguments);
    }
  }

  g.listener = listener;
  this.on(type, g);

  return this;
};

// emits a 'removeListener' event iff the listener was removed
EventEmitter.prototype.removeListener = function(type, listener) {
  var list, position, length, i;

  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  if (!this._events || !this._events[type])
    return this;

  list = this._events[type];
  length = list.length;
  position = -1;

  if (list === listener ||
      (isFunction(list.listener) && list.listener === listener)) {
    delete this._events[type];
    if (this._events.removeListener)
      this.emit('removeListener', type, listener);

  } else if (isObject(list)) {
    for (i = length; i-- > 0;) {
      if (list[i] === listener ||
          (list[i].listener && list[i].listener === listener)) {
        position = i;
        break;
      }
    }

    if (position < 0)
      return this;

    if (list.length === 1) {
      list.length = 0;
      delete this._events[type];
    } else {
      list.splice(position, 1);
    }

    if (this._events.removeListener)
      this.emit('removeListener', type, listener);
  }

  return this;
};

EventEmitter.prototype.removeAllListeners = function(type) {
  var key, listeners;

  if (!this._events)
    return this;

  // not listening for removeListener, no need to emit
  if (!this._events.removeListener) {
    if (arguments.length === 0)
      this._events = {};
    else if (this._events[type])
      delete this._events[type];
    return this;
  }

  // emit removeListener for all listeners on all events
  if (arguments.length === 0) {
    for (key in this._events) {
      if (key === 'removeListener') continue;
      this.removeAllListeners(key);
    }
    this.removeAllListeners('removeListener');
    this._events = {};
    return this;
  }

  listeners = this._events[type];

  if (isFunction(listeners)) {
    this.removeListener(type, listeners);
  } else if (listeners) {
    // LIFO order
    while (listeners.length)
      this.removeListener(type, listeners[listeners.length - 1]);
  }
  delete this._events[type];

  return this;
};

EventEmitter.prototype.listeners = function(type) {
  var ret;
  if (!this._events || !this._events[type])
    ret = [];
  else if (isFunction(this._events[type]))
    ret = [this._events[type]];
  else
    ret = this._events[type].slice();
  return ret;
};

EventEmitter.prototype.listenerCount = function(type) {
  if (this._events) {
    var evlistener = this._events[type];

    if (isFunction(evlistener))
      return 1;
    else if (evlistener)
      return evlistener.length;
  }
  return 0;
};

EventEmitter.listenerCount = function(emitter, type) {
  return emitter.listenerCount(type);
};

function isFunction(arg) {
  return typeof arg === 'function';
}

function isNumber(arg) {
  return typeof arg === 'number';
}

function isObject(arg) {
  return typeof arg === 'object' && arg !== null;
}

function isUndefined(arg) {
  return arg === void 0;
}

},{}],23:[function(require,module,exports){
/*eslint new-cap:0*/
var dtype = require('dtype')
module.exports = flattenVertexData
function flattenVertexData (data, output, offset) {
  if (!data) throw new TypeError('must specify data as first parameter')
  offset = +(offset || 0) | 0

  if (Array.isArray(data) && Array.isArray(data[0])) {
    var dim = data[0].length
    var length = data.length * dim

    // no output specified, create a new typed array
    if (!output || typeof output === 'string') {
      output = new (dtype(output || 'float32'))(length + offset)
    }

    var dstLength = output.length - offset
    if (length !== dstLength) {
      throw new Error('source length ' + length + ' (' + dim + 'x' + data.length + ')' +
        ' does not match destination length ' + dstLength)
    }

    for (var i = 0, k = offset; i < data.length; i++) {
      for (var j = 0; j < dim; j++) {
        output[k++] = data[i][j]
      }
    }
  } else {
    if (!output || typeof output === 'string') {
      // no output, create a new one
      var Ctor = dtype(output || 'float32')
      if (offset === 0) {
        output = new Ctor(data)
      } else {
        output = new Ctor(data.length + offset)
        output.set(data, offset)
      }
    } else {
      // store output in existing array
      output.set(data, offset)
    }
  }

  return output
}

},{"dtype":21}],24:[function(require,module,exports){
module.exports = function compile(property) {
	if (!property || typeof property !== 'string')
		throw new Error('must specify property for indexof search')

	return new Function('array', 'value', 'start', [
		'start = start || 0',
		'for (var i=start; i<array.length; i++)',
		'  if (array[i]["' + property +'"] === value)',
		'      return i',
		'return -1'
	].join('\n'))
}
},{}],25:[function(require,module,exports){
if (typeof Object.create === 'function') {
  // implementation from standard node.js 'util' module
  module.exports = function inherits(ctor, superCtor) {
    ctor.super_ = superCtor
    ctor.prototype = Object.create(superCtor.prototype, {
      constructor: {
        value: ctor,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
  };
} else {
  // old school shim for old browsers
  module.exports = function inherits(ctor, superCtor) {
    ctor.super_ = superCtor
    var TempCtor = function () {}
    TempCtor.prototype = superCtor.prototype
    ctor.prototype = new TempCtor()
    ctor.prototype.constructor = ctor
  }
}

},{}],26:[function(require,module,exports){
/*!
 * Determine if an object is a Buffer
 *
 * @author   Feross Aboukhadijeh <feross@feross.org> <http://feross.org>
 * @license  MIT
 */

// The _isBuffer check is for Safari 5-7 support, because it's missing
// Object.prototype.constructor. Remove this eventually
module.exports = function (obj) {
  return obj != null && (isBuffer(obj) || isSlowBuffer(obj) || !!obj._isBuffer)
}

function isBuffer (obj) {
  return !!obj.constructor && typeof obj.constructor.isBuffer === 'function' && obj.constructor.isBuffer(obj)
}

// For Node v0.10 support. Remove this eventually.
function isSlowBuffer (obj) {
  return typeof obj.readFloatLE === 'function' && typeof obj.slice === 'function' && isBuffer(obj.slice(0, 0))
}

},{}],27:[function(require,module,exports){
var wordWrap = require('word-wrapper')
var xtend = require('xtend')
var findChar = require('indexof-property')('id')
var number = require('as-number')

var X_HEIGHTS = ['x', 'e', 'a', 'o', 'n', 's', 'r', 'c', 'u', 'm', 'v', 'w', 'z']
var M_WIDTHS = ['m', 'w']
var CAP_HEIGHTS = ['H', 'I', 'N', 'E', 'F', 'K', 'L', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']


var TAB_ID = '\t'.charCodeAt(0)
var SPACE_ID = ' '.charCodeAt(0)
var ALIGN_LEFT = 0, 
    ALIGN_CENTER = 1, 
    ALIGN_RIGHT = 2

module.exports = function createLayout(opt) {
  return new TextLayout(opt)
}

function TextLayout(opt) {
  this.glyphs = []
  this._measure = this.computeMetrics.bind(this)
  this.update(opt)
}

TextLayout.prototype.update = function(opt) {
  opt = xtend({
    measure: this._measure
  }, opt)
  this._opt = opt
  this._opt.tabSize = number(this._opt.tabSize, 4)

  if (!opt.font)
    throw new Error('must provide a valid bitmap font')

  var glyphs = this.glyphs
  var text = opt.text||'' 
  var font = opt.font
  this._setupSpaceGlyphs(font)
  
  var lines = wordWrap.lines(text, opt)
  var minWidth = opt.width || 0

  //clear glyphs
  glyphs.length = 0

  //get max line width
  var maxLineWidth = lines.reduce(function(prev, line) {
    return Math.max(prev, line.width, minWidth)
  }, 0)

  //the pen position
  var x = 0
  var y = 0
  var lineHeight = number(opt.lineHeight, font.common.lineHeight)
  var baseline = font.common.base
  var descender = lineHeight-baseline
  var letterSpacing = opt.letterSpacing || 0
  var height = lineHeight * lines.length - descender
  var align = getAlignType(this._opt.align)

  //draw text along baseline
  y -= height
  
  //the metrics for this text layout
  this._width = maxLineWidth
  this._height = height
  this._descender = lineHeight - baseline
  this._baseline = baseline
  this._xHeight = getXHeight(font)
  this._capHeight = getCapHeight(font)
  this._lineHeight = lineHeight
  this._ascender = lineHeight - descender - this._xHeight
    
  //layout each glyph
  var self = this
  lines.forEach(function(line, lineIndex) {
    var start = line.start
    var end = line.end
    var lineWidth = line.width
    var lastGlyph
    
    //for each glyph in that line...
    for (var i=start; i<end; i++) {
      var id = text.charCodeAt(i)
      var glyph = self.getGlyph(font, id)
      if (glyph) {
        if (lastGlyph) 
          x += getKerning(font, lastGlyph.id, glyph.id)

        var tx = x
        if (align === ALIGN_CENTER) 
          tx += (maxLineWidth-lineWidth)/2
        else if (align === ALIGN_RIGHT)
          tx += (maxLineWidth-lineWidth)

        glyphs.push({
          position: [tx, y],
          data: glyph,
          index: i,
          line: lineIndex
        })  

        //move pen forward
        x += glyph.xadvance + letterSpacing
        lastGlyph = glyph
      }
    }

    //next line down
    y += lineHeight
    x = 0
  })
  this._linesTotal = lines.length;
}

TextLayout.prototype._setupSpaceGlyphs = function(font) {
  //These are fallbacks, when the font doesn't include
  //' ' or '\t' glyphs
  this._fallbackSpaceGlyph = null
  this._fallbackTabGlyph = null

  if (!font.chars || font.chars.length === 0)
    return

  //try to get space glyph
  //then fall back to the 'm' or 'w' glyphs
  //then fall back to the first glyph available
  var space = getGlyphById(font, SPACE_ID) 
          || getMGlyph(font) 
          || font.chars[0]

  //and create a fallback for tab
  var tabWidth = this._opt.tabSize * space.xadvance
  this._fallbackSpaceGlyph = space
  this._fallbackTabGlyph = xtend(space, {
    x: 0, y: 0, xadvance: tabWidth, id: TAB_ID, 
    xoffset: 0, yoffset: 0, width: 0, height: 0
  })
}

TextLayout.prototype.getGlyph = function(font, id) {
  var glyph = getGlyphById(font, id)
  if (glyph)
    return glyph
  else if (id === TAB_ID) 
    return this._fallbackTabGlyph
  else if (id === SPACE_ID) 
    return this._fallbackSpaceGlyph
  return null
}

TextLayout.prototype.computeMetrics = function(text, start, end, width) {
  var letterSpacing = this._opt.letterSpacing || 0
  var font = this._opt.font
  var curPen = 0
  var curWidth = 0
  var count = 0
  var glyph
  var lastGlyph

  if (!font.chars || font.chars.length === 0) {
    return {
      start: start,
      end: start,
      width: 0
    }
  }

  end = Math.min(text.length, end)
  for (var i=start; i < end; i++) {
    var id = text.charCodeAt(i)
    var glyph = this.getGlyph(font, id)

    if (glyph) {
      //move pen forward
      var xoff = glyph.xoffset
      var kern = lastGlyph ? getKerning(font, lastGlyph.id, glyph.id) : 0
      curPen += kern

      var nextPen = curPen + glyph.xadvance + letterSpacing
      var nextWidth = curPen + glyph.width

      //we've hit our limit; we can't move onto the next glyph
      if (nextWidth >= width || nextPen >= width)
        break

      //otherwise continue along our line
      curPen = nextPen
      curWidth = nextWidth
      lastGlyph = glyph
    }
    count++
  }
  
  //make sure rightmost edge lines up with rendered glyphs
  if (lastGlyph)
    curWidth += lastGlyph.xoffset

  return {
    start: start,
    end: start + count,
    width: curWidth
  }
}

//getters for the private vars
;['width', 'height', 
  'descender', 'ascender',
  'xHeight', 'baseline',
  'capHeight',
  'lineHeight' ].forEach(addGetter)

function addGetter(name) {
  Object.defineProperty(TextLayout.prototype, name, {
    get: wrapper(name),
    configurable: true
  })
}

//create lookups for private vars
function wrapper(name) {
  return (new Function([
    'return function '+name+'() {',
    '  return this._'+name,
    '}'
  ].join('\n')))()
}

function getGlyphById(font, id) {
  if (!font.chars || font.chars.length === 0)
    return null

  var glyphIdx = findChar(font.chars, id)
  if (glyphIdx >= 0)
    return font.chars[glyphIdx]
  return null
}

function getXHeight(font) {
  for (var i=0; i<X_HEIGHTS.length; i++) {
    var id = X_HEIGHTS[i].charCodeAt(0)
    var idx = findChar(font.chars, id)
    if (idx >= 0) 
      return font.chars[idx].height
  }
  return 0
}

function getMGlyph(font) {
  for (var i=0; i<M_WIDTHS.length; i++) {
    var id = M_WIDTHS[i].charCodeAt(0)
    var idx = findChar(font.chars, id)
    if (idx >= 0) 
      return font.chars[idx]
  }
  return 0
}

function getCapHeight(font) {
  for (var i=0; i<CAP_HEIGHTS.length; i++) {
    var id = CAP_HEIGHTS[i].charCodeAt(0)
    var idx = findChar(font.chars, id)
    if (idx >= 0) 
      return font.chars[idx].height
  }
  return 0
}

function getKerning(font, left, right) {
  if (!font.kernings || font.kernings.length === 0)
    return 0

  var table = font.kernings
  for (var i=0; i<table.length; i++) {
    var kern = table[i]
    if (kern.first === left && kern.second === right)
      return kern.amount
  }
  return 0
}

function getAlignType(align) {
  if (align === 'center')
    return ALIGN_CENTER
  else if (align === 'right')
    return ALIGN_RIGHT
  return ALIGN_LEFT
}
},{"as-number":20,"indexof-property":24,"word-wrapper":36,"xtend":37}],28:[function(require,module,exports){
/*
object-assign
(c) Sindre Sorhus
@license MIT
*/

'use strict';
/* eslint-disable no-unused-vars */
var getOwnPropertySymbols = Object.getOwnPropertySymbols;
var hasOwnProperty = Object.prototype.hasOwnProperty;
var propIsEnumerable = Object.prototype.propertyIsEnumerable;

function toObject(val) {
	if (val === null || val === undefined) {
		throw new TypeError('Object.assign cannot be called with null or undefined');
	}

	return Object(val);
}

function shouldUseNative() {
	try {
		if (!Object.assign) {
			return false;
		}

		// Detect buggy property enumeration order in older V8 versions.

		// https://bugs.chromium.org/p/v8/issues/detail?id=4118
		var test1 = new String('abc');  // eslint-disable-line no-new-wrappers
		test1[5] = 'de';
		if (Object.getOwnPropertyNames(test1)[0] === '5') {
			return false;
		}

		// https://bugs.chromium.org/p/v8/issues/detail?id=3056
		var test2 = {};
		for (var i = 0; i < 10; i++) {
			test2['_' + String.fromCharCode(i)] = i;
		}
		var order2 = Object.getOwnPropertyNames(test2).map(function (n) {
			return test2[n];
		});
		if (order2.join('') !== '0123456789') {
			return false;
		}

		// https://bugs.chromium.org/p/v8/issues/detail?id=3056
		var test3 = {};
		'abcdefghijklmnopqrst'.split('').forEach(function (letter) {
			test3[letter] = letter;
		});
		if (Object.keys(Object.assign({}, test3)).join('') !==
				'abcdefghijklmnopqrst') {
			return false;
		}

		return true;
	} catch (err) {
		// We don't expect any of the above to throw, but better to be safe.
		return false;
	}
}

module.exports = shouldUseNative() ? Object.assign : function (target, source) {
	var from;
	var to = toObject(target);
	var symbols;

	for (var s = 1; s < arguments.length; s++) {
		from = Object(arguments[s]);

		for (var key in from) {
			if (hasOwnProperty.call(from, key)) {
				to[key] = from[key];
			}
		}

		if (getOwnPropertySymbols) {
			symbols = getOwnPropertySymbols(from);
			for (var i = 0; i < symbols.length; i++) {
				if (propIsEnumerable.call(from, symbols[i])) {
					to[symbols[i]] = from[symbols[i]];
				}
			}
		}
	}

	return to;
};

},{}],29:[function(require,module,exports){
module.exports = function parseBMFontAscii(data) {
  if (!data)
    throw new Error('no data provided')
  data = data.toString().trim()

  var output = {
    pages: [],
    chars: [],
    kernings: []
  }

  var lines = data.split(/\r\n?|\n/g)

  if (lines.length === 0)
    throw new Error('no data in BMFont file')

  for (var i = 0; i < lines.length; i++) {
    var lineData = splitLine(lines[i], i)
    if (!lineData) //skip empty lines
      continue

    if (lineData.key === 'page') {
      if (typeof lineData.data.id !== 'number')
        throw new Error('malformed file at line ' + i + ' -- needs page id=N')
      if (typeof lineData.data.file !== 'string')
        throw new Error('malformed file at line ' + i + ' -- needs page file="path"')
      output.pages[lineData.data.id] = lineData.data.file
    } else if (lineData.key === 'chars' || lineData.key === 'kernings') {
      //... do nothing for these two ...
    } else if (lineData.key === 'char') {
      output.chars.push(lineData.data)
    } else if (lineData.key === 'kerning') {
      output.kernings.push(lineData.data)
    } else {
      output[lineData.key] = lineData.data
    }
  }

  return output
}

function splitLine(line, idx) {
  line = line.replace(/\t+/g, ' ').trim()
  if (!line)
    return null

  var space = line.indexOf(' ')
  if (space === -1) 
    throw new Error("no named row at line " + idx)

  var key = line.substring(0, space)

  line = line.substring(space + 1)
  //clear "letter" field as it is non-standard and
  //requires additional complexity to parse " / = symbols
  line = line.replace(/letter=[\'\"]\S+[\'\"]/gi, '')  
  line = line.split("=")
  line = line.map(function(str) {
    return str.trim().match((/(".*?"|[^"\s]+)+(?=\s*|\s*$)/g))
  })

  var data = []
  for (var i = 0; i < line.length; i++) {
    var dt = line[i]
    if (i === 0) {
      data.push({
        key: dt[0],
        data: ""
      })
    } else if (i === line.length - 1) {
      data[data.length - 1].data = parseData(dt[0])
    } else {
      data[data.length - 1].data = parseData(dt[0])
      data.push({
        key: dt[1],
        data: ""
      })
    }
  }

  var out = {
    key: key,
    data: {}
  }

  data.forEach(function(v) {
    out.data[v.key] = v.data;
  })

  return out
}

function parseData(data) {
  if (!data || data.length === 0)
    return ""

  if (data.indexOf('"') === 0 || data.indexOf("'") === 0)
    return data.substring(1, data.length - 1)
  if (data.indexOf(',') !== -1)
    return parseIntList(data)
  return parseInt(data, 10)
}

function parseIntList(data) {
  return data.split(',').map(function(val) {
    return parseInt(val, 10)
  })
}
},{}],30:[function(require,module,exports){
var dtype = require('dtype')
var anArray = require('an-array')
var isBuffer = require('is-buffer')

var CW = [0, 2, 3]
var CCW = [2, 1, 3]

module.exports = function createQuadElements(array, opt) {
    //if user didn't specify an output array
    if (!array || !(anArray(array) || isBuffer(array))) {
        opt = array || {}
        array = null
    }

    if (typeof opt === 'number') //backwards-compatible
        opt = { count: opt }
    else
        opt = opt || {}

    var type = typeof opt.type === 'string' ? opt.type : 'uint16'
    var count = typeof opt.count === 'number' ? opt.count : 1
    var start = (opt.start || 0) 

    var dir = opt.clockwise !== false ? CW : CCW,
        a = dir[0], 
        b = dir[1],
        c = dir[2]

    var numIndices = count * 6

    var indices = array || new (dtype(type))(numIndices)
    for (var i = 0, j = 0; i < numIndices; i += 6, j += 4) {
        var x = i + start
        indices[x + 0] = j + 0
        indices[x + 1] = j + 1
        indices[x + 2] = j + 2
        indices[x + 3] = j + a
        indices[x + 4] = j + b
        indices[x + 5] = j + c
    }
    return indices
}
},{"an-array":19,"dtype":21,"is-buffer":26}],31:[function(require,module,exports){
var createLayout = require('layout-bmfont-text')
var inherits = require('inherits')
var createIndices = require('quad-indices')
var buffer = require('three-buffer-vertex-data')
var assign = require('object-assign')

var vertices = require('./lib/vertices')
var utils = require('./lib/utils')

var Base = THREE.BufferGeometry

module.exports = function createTextGeometry (opt) {
  return new TextGeometry(opt)
}

function TextGeometry (opt) {
  Base.call(this)

  if (typeof opt === 'string') {
    opt = { text: opt }
  }

  // use these as default values for any subsequent
  // calls to update()
  this._opt = assign({}, opt)

  // also do an initial setup...
  if (opt) this.update(opt)
}

inherits(TextGeometry, Base)

TextGeometry.prototype.update = function (opt) {
  if (typeof opt === 'string') {
    opt = { text: opt }
  }

  // use constructor defaults
  opt = assign({}, this._opt, opt)

  if (!opt.font) {
    throw new TypeError('must specify a { font } in options')
  }

  this.layout = createLayout(opt)

  // get vec2 texcoords
  var flipY = opt.flipY !== false

  // the desired BMFont data
  var font = opt.font

  // determine texture size from font file
  var texWidth = font.common.scaleW
  var texHeight = font.common.scaleH

  // get visible glyphs
  var glyphs = this.layout.glyphs.filter(function (glyph) {
    var bitmap = glyph.data
    return bitmap.width * bitmap.height > 0
  })

  // provide visible glyphs for convenience
  this.visibleGlyphs = glyphs

  // get common vertex data
  var positions = vertices.positions(glyphs)
  var uvs = vertices.uvs(glyphs, texWidth, texHeight, flipY)
  var indices = createIndices({
    clockwise: true,
    type: 'uint16',
    count: glyphs.length
  })

  // update vertex data
  buffer.index(this, indices, 1, 'uint16')
  buffer.attr(this, 'position', positions, 2)
  buffer.attr(this, 'uv', uvs, 2)

  // update multipage data
  if (!opt.multipage && 'page' in this.attributes) {
    // disable multipage rendering
    this.removeAttribute('page')
  } else if (opt.multipage) {
    var pages = vertices.pages(glyphs)
    // enable multipage rendering
    buffer.attr(this, 'page', pages, 1)
  }
}

TextGeometry.prototype.computeBoundingSphere = function () {
  if (this.boundingSphere === null) {
    this.boundingSphere = new THREE.Sphere()
  }

  var positions = this.attributes.position.array
  var itemSize = this.attributes.position.itemSize
  if (!positions || !itemSize || positions.length < 2) {
    this.boundingSphere.radius = 0
    this.boundingSphere.center.set(0, 0, 0)
    return
  }
  utils.computeSphere(positions, this.boundingSphere)
  if (isNaN(this.boundingSphere.radius)) {
    console.error('THREE.BufferGeometry.computeBoundingSphere(): ' +
      'Computed radius is NaN. The ' +
      '"position" attribute is likely to have NaN values.')
  }
}

TextGeometry.prototype.computeBoundingBox = function () {
  if (this.boundingBox === null) {
    this.boundingBox = new THREE.Box3()
  }

  var bbox = this.boundingBox
  var positions = this.attributes.position.array
  var itemSize = this.attributes.position.itemSize
  if (!positions || !itemSize || positions.length < 2) {
    bbox.makeEmpty()
    return
  }
  utils.computeBox(positions, bbox)
}

},{"./lib/utils":32,"./lib/vertices":33,"inherits":25,"layout-bmfont-text":27,"object-assign":28,"quad-indices":30,"three-buffer-vertex-data":35}],32:[function(require,module,exports){
var itemSize = 2
var box = { min: [0, 0], max: [0, 0] }

function bounds (positions) {
  var count = positions.length / itemSize
  box.min[0] = positions[0]
  box.min[1] = positions[1]
  box.max[0] = positions[0]
  box.max[1] = positions[1]

  for (var i = 0; i < count; i++) {
    var x = positions[i * itemSize + 0]
    var y = positions[i * itemSize + 1]
    box.min[0] = Math.min(x, box.min[0])
    box.min[1] = Math.min(y, box.min[1])
    box.max[0] = Math.max(x, box.max[0])
    box.max[1] = Math.max(y, box.max[1])
  }
}

module.exports.computeBox = function (positions, output) {
  bounds(positions)
  output.min.set(box.min[0], box.min[1], 0)
  output.max.set(box.max[0], box.max[1], 0)
}

module.exports.computeSphere = function (positions, output) {
  bounds(positions)
  var minX = box.min[0]
  var minY = box.min[1]
  var maxX = box.max[0]
  var maxY = box.max[1]
  var width = maxX - minX
  var height = maxY - minY
  var length = Math.sqrt(width * width + height * height)
  output.center.set(minX + width / 2, minY + height / 2, 0)
  output.radius = length / 2
}

},{}],33:[function(require,module,exports){
module.exports.pages = function pages (glyphs) {
  var pages = new Float32Array(glyphs.length * 4 * 1)
  var i = 0
  glyphs.forEach(function (glyph) {
    var id = glyph.data.page || 0
    pages[i++] = id
    pages[i++] = id
    pages[i++] = id
    pages[i++] = id
  })
  return pages
}

module.exports.uvs = function uvs (glyphs, texWidth, texHeight, flipY) {
  var uvs = new Float32Array(glyphs.length * 4 * 2)
  var i = 0
  glyphs.forEach(function (glyph) {
    var bitmap = glyph.data
    var bw = (bitmap.x + bitmap.width)
    var bh = (bitmap.y + bitmap.height)

    // top left position
    var u0 = bitmap.x / texWidth
    var v1 = bitmap.y / texHeight
    var u1 = bw / texWidth
    var v0 = bh / texHeight

    if (flipY) {
      v1 = (texHeight - bitmap.y) / texHeight
      v0 = (texHeight - bh) / texHeight
    }

    // BL
    uvs[i++] = u0
    uvs[i++] = v1
    // TL
    uvs[i++] = u0
    uvs[i++] = v0
    // TR
    uvs[i++] = u1
    uvs[i++] = v0
    // BR
    uvs[i++] = u1
    uvs[i++] = v1
  })
  return uvs
}

module.exports.positions = function positions (glyphs) {
  var positions = new Float32Array(glyphs.length * 4 * 2)
  var i = 0
  glyphs.forEach(function (glyph) {
    var bitmap = glyph.data

    // bottom left position
    var x = glyph.position[0] + bitmap.xoffset
    var y = glyph.position[1] + bitmap.yoffset

    // quad size
    var w = bitmap.width
    var h = bitmap.height

    // BL
    positions[i++] = x
    positions[i++] = y
    // TL
    positions[i++] = x
    positions[i++] = y + h
    // TR
    positions[i++] = x + w
    positions[i++] = y + h
    // BR
    positions[i++] = x + w
    positions[i++] = y
  })
  return positions
}

},{}],34:[function(require,module,exports){
var assign = require('object-assign')

module.exports = function createSDFShader (opt) {
  opt = opt || {}
  var opacity = typeof opt.opacity === 'number' ? opt.opacity : 1
  var alphaTest = typeof opt.alphaTest === 'number' ? opt.alphaTest : 0.0001
  var precision = opt.precision || 'highp'
  var color = opt.color
  var map = opt.map

  // remove to satisfy r73
  delete opt.map
  delete opt.color
  delete opt.precision
  delete opt.opacity

  return assign({
    uniforms: {
      opacity: { type: 'f', value: opacity },
      map: { type: 't', value: map || new THREE.Texture() },
      color: { type: 'c', value: new THREE.Color(color) }
    },
    vertexShader: [
      'attribute vec2 uv;',
      'attribute vec4 position;',
      'uniform mat4 projectionMatrix;',
      'uniform mat4 modelViewMatrix;',
      'varying vec2 vUv;',
      'void main() {',
      'vUv = uv;',
      'gl_Position = projectionMatrix * modelViewMatrix * position;',
      '}'
    ].join('\n'),
    fragmentShader: [
      '#ifdef GL_OES_standard_derivatives',
      '#extension GL_OES_standard_derivatives : enable',
      '#endif',
      'precision ' + precision + ' float;',
      'uniform float opacity;',
      'uniform vec3 color;',
      'uniform sampler2D map;',
      'varying vec2 vUv;',

      'float aastep(float value) {',
      '  #ifdef GL_OES_standard_derivatives',
      '    float afwidth = length(vec2(dFdx(value), dFdy(value))) * 0.70710678118654757;',
      '  #else',
      '    float afwidth = (1.0 / 32.0) * (1.4142135623730951 / (2.0 * gl_FragCoord.w));',
      '  #endif',
      '  return smoothstep(0.5 - afwidth, 0.5 + afwidth, value);',
      '}',

      'void main() {',
      '  vec4 texColor = texture2D(map, vUv);',
      '  float alpha = aastep(texColor.a);',
      '  gl_FragColor = vec4(color, opacity * alpha);',
      alphaTest === 0
        ? ''
        : '  if (gl_FragColor.a < ' + alphaTest + ') discard;',
      '}'
    ].join('\n')
  }, opt)
}

},{"object-assign":28}],35:[function(require,module,exports){
var flatten = require('flatten-vertex-data')
var warned = false;

module.exports.attr = setAttribute
module.exports.index = setIndex

function setIndex (geometry, data, itemSize, dtype) {
  if (typeof itemSize !== 'number') itemSize = 1
  if (typeof dtype !== 'string') dtype = 'uint16'

  var isR69 = !geometry.index && typeof geometry.setIndex !== 'function'
  var attrib = isR69 ? geometry.getAttribute('index') : geometry.index
  var newAttrib = updateAttribute(attrib, data, itemSize, dtype)
  if (newAttrib) {
    if (isR69) geometry.addAttribute('index', newAttrib)
    else geometry.index = newAttrib
  }
}

function setAttribute (geometry, key, data, itemSize, dtype) {
  if (typeof itemSize !== 'number') itemSize = 3
  if (typeof dtype !== 'string') dtype = 'float32'
  if (Array.isArray(data) &&
    Array.isArray(data[0]) &&
    data[0].length !== itemSize) {
    throw new Error('Nested vertex array has unexpected size; expected ' +
      itemSize + ' but found ' + data[0].length)
  }

  var attrib = geometry.getAttribute(key)
  var newAttrib = updateAttribute(attrib, data, itemSize, dtype)
  if (newAttrib) {
    geometry.addAttribute(key, newAttrib)
  }
}

function updateAttribute (attrib, data, itemSize, dtype) {
  data = data || []
  if (!attrib || rebuildAttribute(attrib, data, itemSize)) {
    // create a new array with desired type
    data = flatten(data, dtype)

    var needsNewBuffer = attrib && typeof attrib.setArray !== 'function'
    if (!attrib || needsNewBuffer) {
      // We are on an old version of ThreeJS which can't
      // support growing / shrinking buffers, so we need
      // to build a new buffer
      if (needsNewBuffer && !warned) {
        warned = true
        console.warn([
          'A WebGL buffer is being updated with a new size or itemSize, ',
          'however this version of ThreeJS only supports fixed-size buffers.',
          '\nThe old buffer may still be kept in memory.\n',
          'To avoid memory leaks, it is recommended that you dispose ',
          'your geometries and create new ones, or update to ThreeJS r82 or newer.\n',
          'See here for discussion:\n',
          'https://github.com/mrdoob/three.js/pull/9631'
        ].join(''))
      }

      // Build a new attribute
      attrib = new THREE.BufferAttribute(data, itemSize);
    }

    attrib.itemSize = itemSize
    attrib.needsUpdate = true

    // New versions of ThreeJS suggest using setArray
    // to change the data. It will use bufferData internally,
    // so you can change the array size without any issues
    if (typeof attrib.setArray === 'function') {
      attrib.setArray(data)
    }

    return attrib
  } else {
    // copy data into the existing array
    flatten(data, attrib.array)
    attrib.needsUpdate = true
    return null
  }
}

// Test whether the attribute needs to be re-created,
// returns false if we can re-use it as-is.
function rebuildAttribute (attrib, data, itemSize) {
  if (attrib.itemSize !== itemSize) return true
  if (!attrib.array) return true
  var attribLength = attrib.array.length
  if (Array.isArray(data) && Array.isArray(data[0])) {
    // [ [ x, y, z ] ]
    return attribLength !== data.length * itemSize
  } else {
    // [ x, y, z ]
    return attribLength !== data.length
  }
  return false
}

},{"flatten-vertex-data":23}],36:[function(require,module,exports){
var newline = /\n/
var newlineChar = '\n'
var whitespace = /\s/

module.exports = function(text, opt) {
    var lines = module.exports.lines(text, opt)
    return lines.map(function(line) {
        return text.substring(line.start, line.end)
    }).join('\n')
}

module.exports.lines = function wordwrap(text, opt) {
    opt = opt||{}

    //zero width results in nothing visible
    if (opt.width === 0 && opt.mode !== 'nowrap') 
        return []

    text = text||''
    var width = typeof opt.width === 'number' ? opt.width : Number.MAX_VALUE
    var start = Math.max(0, opt.start||0)
    var end = typeof opt.end === 'number' ? opt.end : text.length
    var mode = opt.mode

    var measure = opt.measure || monospace
    if (mode === 'pre')
        return pre(measure, text, start, end, width)
    else
        return greedy(measure, text, start, end, width, mode)
}

function idxOf(text, chr, start, end) {
    var idx = text.indexOf(chr, start)
    if (idx === -1 || idx > end)
        return end
    return idx
}

function isWhitespace(chr) {
    return whitespace.test(chr)
}

function pre(measure, text, start, end, width) {
    var lines = []
    var lineStart = start
    for (var i=start; i<end && i<text.length; i++) {
        var chr = text.charAt(i)
        var isNewline = newline.test(chr)

        //If we've reached a newline, then step down a line
        //Or if we've reached the EOF
        if (isNewline || i===end-1) {
            var lineEnd = isNewline ? i : i+1
            var measured = measure(text, lineStart, lineEnd, width)
            lines.push(measured)
            
            lineStart = i+1
        }
    }
    return lines
}

function greedy(measure, text, start, end, width, mode) {
    //A greedy word wrapper based on LibGDX algorithm
    //https://github.com/libgdx/libgdx/blob/master/gdx/src/com/badlogic/gdx/graphics/g2d/BitmapFontCache.java
    var lines = []

    var testWidth = width
    //if 'nowrap' is specified, we only wrap on newline chars
    if (mode === 'nowrap')
        testWidth = Number.MAX_VALUE

    while (start < end && start < text.length) {
        //get next newline position
        var newLine = idxOf(text, newlineChar, start, end)

        //eat whitespace at start of line
        while (start < newLine) {
            if (!isWhitespace( text.charAt(start) ))
                break
            start++
        }

        //determine visible # of glyphs for the available width
        var measured = measure(text, start, newLine, testWidth)

        var lineEnd = start + (measured.end-measured.start)
        var nextStart = lineEnd + newlineChar.length

        //if we had to cut the line before the next newline...
        if (lineEnd < newLine) {
            //find char to break on
            while (lineEnd > start) {
                if (isWhitespace(text.charAt(lineEnd)))
                    break
                lineEnd--
            }
            if (lineEnd === start) {
                if (nextStart > start + newlineChar.length) nextStart--
                lineEnd = nextStart // If no characters to break, show all.
            } else {
                nextStart = lineEnd
                //eat whitespace at end of line
                while (lineEnd > start) {
                    if (!isWhitespace(text.charAt(lineEnd - newlineChar.length)))
                        break
                    lineEnd--
                }
            }
        }
        if (lineEnd >= start) {
            var result = measure(text, start, lineEnd, testWidth)
            lines.push(result)
        }
        start = nextStart
    }
    return lines
}

//determines the visible number of glyphs within a given width
function monospace(text, start, end, width) {
    var glyphs = Math.min(width, end-start)
    return {
        start: start,
        end: start+glyphs
    }
}
},{}],37:[function(require,module,exports){
module.exports = extend

var hasOwnProperty = Object.prototype.hasOwnProperty;

function extend() {
    var target = {}

    for (var i = 0; i < arguments.length; i++) {
        var source = arguments[i]

        for (var key in source) {
            if (hasOwnProperty.call(source, key)) {
                target[key] = source[key]
            }
        }
    }

    return target
}

},{}]},{},[10])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJtb2R1bGVzL2RhdGd1aXZyL2J1dHRvbi5qcyIsIm1vZHVsZXMvZGF0Z3VpdnIvY2hlY2tib3guanMiLCJtb2R1bGVzL2RhdGd1aXZyL2NvbG9ycy5qcyIsIm1vZHVsZXMvZGF0Z3VpdnIvZHJvcGRvd24uanMiLCJtb2R1bGVzL2RhdGd1aXZyL2ZvbGRlci5qcyIsIm1vZHVsZXMvZGF0Z3VpdnIvZm9udC5qcyIsIm1vZHVsZXMvZGF0Z3VpdnIvZ3JhYi5qcyIsIm1vZHVsZXMvZGF0Z3VpdnIvZ3JhcGhpYy5qcyIsIm1vZHVsZXMvZGF0Z3VpdnIvaW1hZ2VidXR0b24uanMiLCJtb2R1bGVzL2RhdGd1aXZyL2luZGV4LmpzIiwibW9kdWxlcy9kYXRndWl2ci9pbnRlcmFjdGlvbi5qcyIsIm1vZHVsZXMvZGF0Z3VpdnIvbGF5b3V0LmpzIiwibW9kdWxlcy9kYXRndWl2ci9wYWxldHRlLmpzIiwibW9kdWxlcy9kYXRndWl2ci9zZGZ0ZXh0LmpzIiwibW9kdWxlcy9kYXRndWl2ci9zaGFyZWRtYXRlcmlhbHMuanMiLCJtb2R1bGVzL2RhdGd1aXZyL3NsaWRlci5qcyIsIm1vZHVsZXMvZGF0Z3VpdnIvdGV4dGxhYmVsLmpzIiwibW9kdWxlcy90aGlyZHBhcnR5L1N1YmRpdmlzaW9uTW9kaWZpZXIuanMiLCJub2RlX21vZHVsZXMvYW4tYXJyYXkvaW5kZXguanMiLCJub2RlX21vZHVsZXMvYXMtbnVtYmVyL2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL2R0eXBlL2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL2V2ZW50cy9ldmVudHMuanMiLCJub2RlX21vZHVsZXMvZmxhdHRlbi12ZXJ0ZXgtZGF0YS9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9pbmRleG9mLXByb3BlcnR5L2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL2luaGVyaXRzL2luaGVyaXRzX2Jyb3dzZXIuanMiLCJub2RlX21vZHVsZXMvaXMtYnVmZmVyL2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL2xheW91dC1ibWZvbnQtdGV4dC9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9vYmplY3QtYXNzaWduL2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL3BhcnNlLWJtZm9udC1hc2NpaS9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9xdWFkLWluZGljZXMvaW5kZXguanMiLCJub2RlX21vZHVsZXMvdGhyZWUtYm1mb250LXRleHQvaW5kZXguanMiLCJub2RlX21vZHVsZXMvdGhyZWUtYm1mb250LXRleHQvbGliL3V0aWxzLmpzIiwibm9kZV9tb2R1bGVzL3RocmVlLWJtZm9udC10ZXh0L2xpYi92ZXJ0aWNlcy5qcyIsIm5vZGVfbW9kdWxlcy90aHJlZS1ibWZvbnQtdGV4dC9zaGFkZXJzL3NkZi5qcyIsIm5vZGVfbW9kdWxlcy90aHJlZS1idWZmZXItdmVydGV4LWRhdGEvaW5kZXguanMiLCJub2RlX21vZHVsZXMvd29yZC13cmFwcGVyL2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL3h0ZW5kL2ltbXV0YWJsZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O2tCQzRCd0IsWTs7QUFUeEI7O0lBQVksbUI7O0FBRVo7Ozs7QUFDQTs7OztBQUNBOztJQUFZLE07O0FBQ1o7O0lBQVksTTs7QUFDWjs7SUFBWSxlOztBQUNaOztJQUFZLEk7Ozs7OztBQUVHLFNBQVMsWUFBVCxHQU9QO0FBQUEsaUZBQUosRUFBSTtBQUFBLE1BTk4sV0FNTSxRQU5OLFdBTU07QUFBQSxNQUxOLE1BS00sUUFMTixNQUtNO0FBQUEsK0JBSk4sWUFJTTtBQUFBLE1BSk4sWUFJTSxxQ0FKUyxXQUlUO0FBQUEsd0JBSE4sS0FHTTtBQUFBLE1BSE4sS0FHTSw4QkFIRSxPQUFPLFdBR1Q7QUFBQSx5QkFGTixNQUVNO0FBQUEsTUFGTixNQUVNLCtCQUZHLE9BQU8sWUFFVjtBQUFBLHdCQUROLEtBQ007QUFBQSxNQUROLEtBQ00sOEJBREUsT0FBTyxXQUNUOztBQUVOLE1BQU0s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QTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOVNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDWEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqU0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMUZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3RUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOUhBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiLyoqXG4qIGRhdC1ndWlWUiBKYXZhc2NyaXB0IENvbnRyb2xsZXIgTGlicmFyeSBmb3IgVlJcbiogaHR0cHM6Ly9naXRodWIuY29tL2RhdGFhcnRzL2RhdC5ndWlWUlxuKlxuKiBDb3B5cmlnaHQgMjAxNiBEYXRhIEFydHMgVGVhbSwgR29vZ2xlIEluYy5cbipcbiogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbipcbiogICAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuKlxuKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4qIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4qIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4qL1xuXG5pbXBvcnQgKiBhcyBTdWJkaXZpc2lvbk1vZGlmaWVyIGZyb20gJy4uL3RoaXJkcGFydHkvU3ViZGl2aXNpb25Nb2RpZmllcic7XG5cbmltcG9ydCBjcmVhdGVUZXh0TGFiZWwgZnJvbSAnLi90ZXh0bGFiZWwnO1xuaW1wb3J0IGNyZWF0ZUludGVyYWN0aW9uIGZyb20gJy4vaW50ZXJhY3Rpb24nO1xuaW1wb3J0ICogYXMgQ29sb3JzIGZyb20gJy4vY29sb3JzJztcbmltcG9ydCAqIGFzIExheW91dCBmcm9tICcuL2xheW91dCc7XG5pbXBvcnQgKiBhcyBTaGFyZWRNYXRlcmlhbHMgZnJvbSAnLi9zaGFyZWRtYXRlcmlhbHMnO1xuaW1wb3J0ICogYXMgR3JhYiBmcm9tICcuL2dyYWInO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBjcmVhdGVCdXR0b24oIHtcbiAgdGV4dENyZWF0b3IsXG4gIG9iamVjdCxcbiAgcHJvcGVydHlOYW1lID0gJ3VuZGVmaW5lZCcsXG4gIHdpZHRoID0gTGF5b3V0LlBBTkVMX1dJRFRILFxuICBoZWlnaHQgPSBMYXlvdXQuUEFORUxfSEVJR0hULFxuICBkZXB0aCA9IExheW91dC5QQU5FTF9ERVBUSFxufSA9IHt9ICl7XG5cbiAgY29uc3QgQlVUVE9OX1dJRFRIID0gd2lkdGggKiAwLjUgLSBMYXlvdXQuUEFORUxfTUFSR0lOO1xuICBjb25zdCBCVVRUT05fSEVJR0hUID0gaGVpZ2h0IC0gTGF5b3V0LlBBTkVMX01BUkdJTjtcbiAgY29uc3QgQlVUVE9OX0RFUFRIID0gTGF5b3V0LkJVVFRPTl9ERVBUSDtcblxuICBjb25zdCBncm91cCA9IG5ldyBUSFJFRS5Hcm91cCgpO1xuXG4gIGNvbnN0IHBhbmVsID0gTGF5b3V0LmNyZWF0ZVBhbmVsKCB3aWR0aCwgaGVpZ2h0LCBkZXB0aCApO1xuICBncm91cC5hZGQoIHBhbmVsICk7XG5cbiAgLy8gIGJhc2UgY2hlY2tib3hcbiAgY29uc3QgZGl2aXNpb25zID0gNDtcbiAgY29uc3QgYXNwZWN0UmF0aW8gPSBCVVRUT05fV0lEVEggLyBCVVRUT05fSEVJR0hUO1xuICBjb25zdCByZWN0ID0gbmV3IFRIUkVFLkJveEdlb21ldHJ5KCBCVVRUT05fV0lEVEgsIEJVVFRPTl9IRUlHSFQsIEJVVFRPTl9ERVBUSCwgTWF0aC5mbG9vciggZGl2aXNpb25zICogYXNwZWN0UmF0aW8gKSwgZGl2aXNpb25zLCBkaXZpc2lvbnMgKTtcbiAgY29uc3QgbW9kaWZpZXIgPSBuZXcgVEhSRUUuU3ViZGl2aXNpb25Nb2RpZmllciggMSApO1xuICBtb2RpZmllci5tb2RpZnkoIHJlY3QgKTtcbiAgcmVjdC50cmFuc2xhdGUoIEJVVFRPTl9XSURUSCAqIDAuNSwgMCwgMCApO1xuXG4gIC8vICBoaXRzY2FuIHZvbHVtZVxuICBjb25zdCBoaXRzY2FuTWF0ZXJpYWwgPSBuZXcgVEhSRUUuTWVzaEJhc2ljTWF0ZXJpYWwoKTtcbiAgaGl0c2Nhbk1hdGVyaWFsLnZpc2libGUgPSBmYWxzZTtcblxuICBjb25zdCBoaXRzY2FuVm9sdW1lID0gbmV3IFRIUkVFLk1lc2goIHJlY3QuY2xvbmUoKSwgaGl0c2Nhbk1hdGVyaWFsICk7XG4gIGhpdHNjYW5Wb2x1bWUucG9zaXRpb24ueiA9IEJVVFRPTl9ERVBUSCAqIDAuNTtcbiAgaGl0c2NhblZvbHVtZS5wb3NpdGlvbi54ID0gd2lkdGggKiAwLjU7XG5cbiAgY29uc3QgbWF0ZXJpYWwgPSBuZXcgVEhSRUUuTWVzaEJhc2ljTWF0ZXJpYWwoeyBjb2xvcjogQ29sb3JzLkJVVFRPTl9DT0xPUiB9KTtcbiAgY29uc3QgZmlsbGVkVm9sdW1lID0gbmV3IFRIUkVFLk1lc2goIHJlY3QuY2xvbmUoKSwgbWF0ZXJpYWwgKTtcbiAgaGl0c2NhblZvbHVtZS5hZGQoIGZpbGxlZFZvbHVtZSApO1xuXG5cbiAgY29uc3QgYnV0dG9uTGFiZWwgPSB0ZXh0Q3JlYXRvci5jcmVhdGUoIHByb3BlcnR5TmFtZSwgeyBzY2FsZTogMC44NjYgfSApO1xuXG4gIC8vICBUaGlzIGlzIGEgcmVhbCBoYWNrIHNpbmNlIHdlIG5lZWQgdG8gZml0IHRoZSB0ZXh0IHBvc2l0aW9uIHRvIHRoZSBmb250IHNjYWxpbmdcbiAgLy8gIFBsZWFzZSBmaXggbWUuXG4gIGJ1dHRvbkxhYmVsLnBvc2l0aW9uLnggPSBCVVRUT05fV0lEVEggKiAwLjUgLSBidXR0b25MYWJlbC5sYXlvdXQud2lkdGggKiAwLjAwMDAxMSAqIDAuNTtcbiAgYnV0dG9uTGFiZWwucG9zaXRpb24ueiA9IEJVVFRPTl9ERVBUSCAqIDEuMjtcbiAgYnV0dG9uTGFiZWwucG9zaXRpb24ueSA9IC0wLjAyNTtcbiAgZmlsbGVkVm9sdW1lLmFkZCggYnV0dG9uTGFiZWwgKTtcblxuXG4gIGNvbnN0IGRlc2NyaXB0b3JMYWJlbCA9IHRleHRDcmVhdG9yLmNyZWF0ZSggcHJvcGVydHlOYW1lICk7XG4gIGRlc2NyaXB0b3JMYWJlbC5wb3NpdGlvbi54ID0gTGF5b3V0LlBBTkVMX0xBQkVMX1RFWFRfTUFSR0lOO1xuICBkZXNjcmlwdG9yTGFiZWwucG9zaXRpb24ueiA9IGRlcHRoO1xuICBkZXNjcmlwdG9yTGFiZWwucG9zaXRpb24ueSA9IC0wLjAzO1xuXG4gIGNvbnN0IGNvbnRyb2xsZXJJRCA9IExheW91dC5jcmVhdGVDb250cm9sbGVySURCb3goIGhlaWdodCwgQ29sb3JzLkNPTlRST0xMRVJfSURfQlVUVE9OICk7XG4gIGNvbnRyb2xsZXJJRC5wb3NpdGlvbi56ID0gZGVwdGg7XG5cbiAgcGFuZWwuYWRkKCBkZXNjcmlwdG9yTGFiZWwsIGhpdHNjYW5Wb2x1bWUsIGNvbnRyb2xsZXJJRCApO1xuXG4gIGNvbnN0IGludGVyYWN0aW9uID0gY3JlYXRlSW50ZXJhY3Rpb24oIGhpdHNjYW5Wb2x1bWUgKTtcbiAgaW50ZXJhY3Rpb24uZXZlbnRzLm9uKCAnb25QcmVzc2VkJywgaGFuZGxlT25QcmVzcyApO1xuICBpbnRlcmFjdGlvbi5ldmVudHMub24oICdvblJlbGVhc2VkJywgaGFuZGxlT25SZWxlYXNlICk7XG5cbiAgdXBkYXRlVmlldygpO1xuXG4gIGZ1bmN0aW9uIGhhbmRsZU9uUHJlc3MoIHAgKXtcbiAgICBpZiggZ3JvdXAudmlzaWJsZSA9PT0gZmFsc2UgKXtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBvYmplY3RbIHByb3BlcnR5TmFtZSBdKCk7XG5cbiAgICBoaXRzY2FuVm9sdW1lLnBvc2l0aW9uLnogPSBCVVRUT05fREVQVEggKiAwLjE7XG5cbiAgICBwLmxvY2tlZCA9IHRydWU7XG4gIH1cblxuICBmdW5jdGlvbiBoYW5kbGVPblJlbGVhc2UoKXtcbiAgICBoaXRzY2FuVm9sdW1lLnBvc2l0aW9uLnogPSBCVVRUT05fREVQVEggKiAwLjU7XG4gIH1cblxuICBmdW5jdGlvbiB1cGRhdGVWaWV3KCl7XG5cbiAgICBpZiggaW50ZXJhY3Rpb24uaG92ZXJpbmcoKSApe1xuICAgICAgbWF0ZXJpYWwuY29sb3Iuc2V0SGV4KCBDb2xvcnMuQlVUVE9OX0hJR0hMSUdIVF9DT0xPUiApO1xuICAgIH1cbiAgICBlbHNle1xuICAgICAgbWF0ZXJpYWwuY29sb3Iuc2V0SGV4KCBDb2xvcnMuQlVUVE9OX0NPTE9SICk7XG4gICAgfVxuXG4gIH1cblxuICBncm91cC5pbnRlcmFjdGlvbiA9IGludGVyYWN0aW9uO1xuICBncm91cC5oaXRzY2FuID0gWyBoaXRzY2FuVm9sdW1lLCBwYW5lbCBdO1xuXG4gIGNvbnN0IGdyYWJJbnRlcmFjdGlvbiA9IEdyYWIuY3JlYXRlKCB7IGdyb3VwLCBwYW5lbCB9ICk7XG5cbiAgZ3JvdXAudXBkYXRlID0gZnVuY3Rpb24oIGlucHV0T2JqZWN0cyApe1xuICAgIGludGVyYWN0aW9uLnVwZGF0ZSggaW5wdXRPYmplY3RzICk7XG4gICAgZ3JhYkludGVyYWN0aW9uLnVwZGF0ZSggaW5wdXRPYmplY3RzICk7XG4gICAgdXBkYXRlVmlldygpO1xuICB9O1xuXG4gIGdyb3VwLm5hbWUgPSBmdW5jdGlvbiggc3RyICl7XG4gICAgZGVzY3JpcHRvckxhYmVsLnVwZGF0ZSggc3RyICk7XG4gICAgcmV0dXJuIGdyb3VwO1xuICB9O1xuXG5cbiAgcmV0dXJuIGdyb3VwO1xufSIsIi8qKlxuKiBkYXQtZ3VpVlIgSmF2YXNjcmlwdCBDb250cm9sbGVyIExpYnJhcnkgZm9yIFZSXG4qIGh0dHBzOi8vZ2l0aHViLmNvbS9kYXRhYXJ0cy9kYXQuZ3VpVlJcbipcbiogQ29weXJpZ2h0IDIwMTYgRGF0YSBBcnRzIFRlYW0sIEdvb2dsZSBJbmMuXG4qXG4qIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4qIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4qXG4qICAgICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbipcbiogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4qIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4qIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuKi9cblxuaW1wb3J0IGNyZWF0ZVRleHRMYWJlbCBmcm9tICcuL3RleHRsYWJlbCc7XG5pbXBvcnQgY3JlYXRlSW50ZXJhY3Rpb24gZnJvbSAnLi9pbnRlcmFjdGlvbic7XG5pbXBvcnQgKiBhcyBDb2xvcnMgZnJvbSAnLi9jb2xvcnMnO1xuaW1wb3J0ICogYXMgTGF5b3V0IGZyb20gJy4vbGF5b3V0JztcbmltcG9ydCAqIGFzIEdyYXBoaWMgZnJvbSAnLi9ncmFwaGljJztcbmltcG9ydCAqIGFzIFNoYXJlZE1hdGVyaWFscyBmcm9tICcuL3NoYXJlZG1hdGVyaWFscyc7XG5pbXBvcnQgKiBhcyBHcmFiIGZyb20gJy4vZ3JhYic7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGNyZWF0ZUNoZWNrYm94KCB7XG4gIHRleHRDcmVhdG9yLFxuICBvYmplY3QsXG4gIHByb3BlcnR5TmFtZSA9ICd1bmRlZmluZWQnLFxuICBpbml0aWFsVmFsdWUgPSBmYWxzZSxcbiAgd2lkdGggPSBMYXlvdXQuUEFORUxfV0lEVEgsXG4gIGhlaWdodCA9IExheW91dC5QQU5FTF9IRUlHSFQsXG4gIGRlcHRoID0gTGF5b3V0LlBBTkVMX0RFUFRIXG59ID0ge30gKXtcblxuICBjb25zdCBDSEVDS0JPWF9XSURUSCA9IExheW91dC5DSEVDS0JPWF9TSVpFO1xuICBjb25zdCBDSEVDS0JPWF9IRUlHSFQgPSBDSEVDS0JPWF9XSURUSDtcbiAgY29uc3QgQ0hFQ0tCT1hfREVQVEggPSBkZXB0aDtcblxuICBjb25zdCBJTkFDVElWRV9TQ0FMRSA9IDAuMDAxO1xuICBjb25zdCBBQ1RJVkVfU0NBTEUgPSAwLjk7XG5cbiAgY29uc3Qgc3RhdGUgPSB7XG4gICAgdmFsdWU6IGluaXRpYWxWYWx1ZSxcbiAgICBsaXN0ZW46IGZhbHNlXG4gIH07XG5cbiAgY29uc3QgZ3JvdXAgPSBuZXcgVEhSRUUuR3JvdXAoKTtcblxuICBjb25zdCBwYW5lbCA9IExheW91dC5jcmVhdGVQYW5lbCggd2lkdGgsIGhlaWdodCwgZGVwdGggKTtcbiAgZ3JvdXAuYWRkKCBwYW5lbCApO1xuXG4gIC8vICBiYXNlIGNoZWNrYm94XG4gIGNvbnN0IHJlY3QgPSBuZXcgVEhSRUUuQm94R2VvbWV0cnkoIENIRUNLQk9YX1dJRFRILCBDSEVDS0JPWF9IRUlHSFQsIENIRUNLQk9YX0RFUFRIICk7XG4gIHJlY3QudHJhbnNsYXRlKCBDSEVDS0JPWF9XSURUSCAqIDAuNSwgMCwgMCApO1xuXG5cbiAgLy8gIGhpdHNjYW4gdm9sdW1lXG4gIGNvbnN0IGhpdHNjYW5NYXRlcmlhbCA9IG5ldyBUSFJFRS5NZXNoQmFzaWNNYXRlcmlhbCgpO1xuICBoaXRzY2FuTWF0ZXJpYWwudmlzaWJsZSA9IGZhbHNlO1xuXG4gIGNvbnN0IGhpdHNjYW5Wb2x1bWUgPSBuZXcgVEhSRUUuTWVzaCggcmVjdC5jbG9uZSgpLCBoaXRzY2FuTWF0ZXJpYWwgKTtcbiAgaGl0c2NhblZvbHVtZS5wb3NpdGlvbi56ID0gZGVwdGg7XG4gIGhpdHNjYW5Wb2x1bWUucG9zaXRpb24ueCA9IHdpZHRoICogMC41O1xuXG4gIC8vICBvdXRsaW5lIHZvbHVtZVxuICAvLyBjb25zdCBvdXRsaW5lID0gbmV3IFRIUkVFLkJveEhlbHBlciggaGl0c2NhblZvbHVtZSApO1xuICAvLyBvdXRsaW5lLm1hdGVyaWFsLmNvbG9yLnNldEhleCggQ29sb3JzLk9VVExJTkVfQ09MT1IgKTtcblxuICAvLyAgY2hlY2tib3ggdm9sdW1lXG4gIGNvbnN0IG1hdGVyaWFsID0gbmV3IFRIUkVFLk1lc2hCYXNpY01hdGVyaWFsKHsgY29sb3I6IENvbG9ycy5DSEVDS0JPWF9CR19DT0xPUiB9KTtcbiAgY29uc3QgZmlsbGVkVm9sdW1lID0gbmV3IFRIUkVFLk1lc2goIHJlY3QuY2xvbmUoKSwgbWF0ZXJpYWwgKTtcbiAgLy8gZmlsbGVkVm9sdW1lLnNjYWxlLnNldCggQUNUSVZFX1NDQUxFLCBBQ1RJVkVfU0NBTEUsQUNUSVZFX1NDQUxFICk7XG4gIGhpdHNjYW5Wb2x1bWUuYWRkKCBmaWxsZWRWb2x1bWUgKTtcblxuXG4gIGNvbnN0IGRlc2NyaXB0b3JMYWJlbCA9IHRleHRDcmVhdG9yLmNyZWF0ZSggcHJvcGVydHlOYW1lICk7XG4gIGRlc2NyaXB0b3JMYWJlbC5wb3NpdGlvbi54ID0gTGF5b3V0LlBBTkVMX0xBQkVMX1RFWFRfTUFSR0lOO1xuICBkZXNjcmlwdG9yTGFiZWwucG9zaXRpb24ueiA9IGRlcHRoO1xuICBkZXNjcmlwdG9yTGFiZWwucG9zaXRpb24ueSA9IC0wLjAzO1xuXG4gIGNvbnN0IGNvbnRyb2xsZXJJRCA9IExheW91dC5jcmVhdGVDb250cm9sbGVySURCb3goIGhlaWdodCwgQ29sb3JzLkNPTlRST0xMRVJfSURfQ0hFQ0tCT1ggKTtcbiAgY29udHJvbGxlcklELnBvc2l0aW9uLnogPSBkZXB0aDtcblxuICBjb25zdCBib3JkZXJCb3ggPSBMYXlvdXQuY3JlYXRlUGFuZWwoIENIRUNLQk9YX1dJRFRIICsgTGF5b3V0LkJPUkRFUl9USElDS05FU1MsIENIRUNLQk9YX0hFSUdIVCArIExheW91dC5CT1JERVJfVEhJQ0tORVNTLCBDSEVDS0JPWF9ERVBUSCwgdHJ1ZSApO1xuICBib3JkZXJCb3gubWF0ZXJpYWwuY29sb3Iuc2V0SGV4KCAweDFmN2FlNyApO1xuICBib3JkZXJCb3gucG9zaXRpb24ueCA9IC1MYXlvdXQuQk9SREVSX1RISUNLTkVTUyAqIDAuNSArIHdpZHRoICogMC41O1xuICBib3JkZXJCb3gucG9zaXRpb24ueiA9IGRlcHRoICogMC41O1xuXG4gIGNvbnN0IGNoZWNrbWFyayA9IEdyYXBoaWMuY2hlY2ttYXJrKCk7XG4gIGNoZWNrbWFyay5wb3NpdGlvbi56ID0gZGVwdGggKiAwLjUxO1xuICBoaXRzY2FuVm9sdW1lLmFkZCggY2hlY2ttYXJrICk7XG5cbiAgcGFuZWwuYWRkKCBkZXNjcmlwdG9yTGFiZWwsIGhpdHNjYW5Wb2x1bWUsIGNvbnRyb2xsZXJJRCwgYm9yZGVyQm94ICk7XG5cbiAgLy8gZ3JvdXAuYWRkKCBmaWxsZWRWb2x1bWUsIG91dGxpbmUsIGhpdHNjYW5Wb2x1bWUsIGRlc2NyaXB0b3JMYWJlbCApO1xuXG4gIGNvbnN0IGludGVyYWN0aW9uID0gY3JlYXRlSW50ZXJhY3Rpb24oIGhpdHNjYW5Wb2x1bWUgKTtcbiAgaW50ZXJhY3Rpb24uZXZlbnRzLm9uKCAnb25QcmVzc2VkJywgaGFuZGxlT25QcmVzcyApO1xuXG4gIHVwZGF0ZVZpZXcoKTtcblxuICBmdW5jdGlvbiBoYW5kbGVPblByZXNzKCBwICl7XG4gICAgaWYoIGdyb3VwLnZpc2libGUgPT09IGZhbHNlICl7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgc3RhdGUudmFsdWUgPSAhc3RhdGUudmFsdWU7XG5cbiAgICBvYmplY3RbIHByb3BlcnR5TmFtZSBdID0gc3RhdGUudmFsdWU7XG5cbiAgICBpZiggb25DaGFuZ2VkQ0IgKXtcbiAgICAgIG9uQ2hhbmdlZENCKCBzdGF0ZS52YWx1ZSApO1xuICAgIH1cblxuICAgIHAubG9ja2VkID0gdHJ1ZTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHVwZGF0ZVZpZXcoKXtcblxuICAgIGlmKCBzdGF0ZS52YWx1ZSApe1xuICAgICAgY2hlY2ttYXJrLnZpc2libGUgPSB0cnVlO1xuICAgIH1cbiAgICBlbHNle1xuICAgICAgY2hlY2ttYXJrLnZpc2libGUgPSBmYWxzZTtcbiAgICB9XG4gICAgaWYoIGludGVyYWN0aW9uLmhvdmVyaW5nKCkgKXtcbiAgICAgIGJvcmRlckJveC52aXNpYmxlID0gdHJ1ZTtcbiAgICB9XG4gICAgZWxzZXtcbiAgICAgIGJvcmRlckJveC52aXNpYmxlID0gZmFsc2U7XG4gICAgfVxuXG4gIH1cblxuICBsZXQgb25DaGFuZ2VkQ0I7XG4gIGxldCBvbkZpbmlzaENoYW5nZUNCO1xuXG4gIGdyb3VwLm9uQ2hhbmdlID0gZnVuY3Rpb24oIGNhbGxiYWNrICl7XG4gICAgb25DaGFuZ2VkQ0IgPSBjYWxsYmFjaztcbiAgICByZXR1cm4gZ3JvdXA7XG4gIH07XG5cbiAgZ3JvdXAuaW50ZXJhY3Rpb24gPSBpbnRlcmFjdGlvbjtcbiAgZ3JvdXAuaGl0c2NhbiA9IFsgaGl0c2NhblZvbHVtZSwgcGFuZWwgXTtcblxuICBjb25zdCBncmFiSW50ZXJhY3Rpb24gPSBHcmFiLmNyZWF0ZSggeyBncm91cCwgcGFuZWwgfSApO1xuXG4gIGdyb3VwLmxpc3RlbiA9IGZ1bmN0aW9uKCl7XG4gICAgc3RhdGUubGlzdGVuID0gdHJ1ZTtcbiAgICByZXR1cm4gZ3JvdXA7XG4gIH07XG5cbiAgZ3JvdXAubmFtZSA9IGZ1bmN0aW9uKCBzdHIgKXtcbiAgICBkZXNjcmlwdG9yTGFiZWwudXBkYXRlKCBzdHIgKTtcbiAgICByZXR1cm4gZ3JvdXA7XG4gIH07XG5cbiAgZ3JvdXAudXBkYXRlID0gZnVuY3Rpb24oIGlucHV0T2JqZWN0cyApe1xuICAgIGlmKCBzdGF0ZS5saXN0ZW4gKXtcbiAgICAgIHN0YXRlLnZhbHVlID0gb2JqZWN0WyBwcm9wZXJ0eU5hbWUgXTtcbiAgICB9XG4gICAgaW50ZXJhY3Rpb24udXBkYXRlKCBpbnB1dE9iamVjdHMgKTtcbiAgICBncmFiSW50ZXJhY3Rpb24udXBkYXRlKCBpbnB1dE9iamVjdHMgKTtcbiAgICB1cGRhdGVWaWV3KCk7XG4gIH07XG5cblxuICByZXR1cm4gZ3JvdXA7XG59IiwiLyoqXG4qIGRhdC1ndWlWUiBKYXZhc2NyaXB0IENvbnRyb2xsZXIgTGlicmFyeSBmb3IgVlJcbiogaHR0cHM6Ly9naXRodWIuY29tL2RhdGFhcnRzL2RhdC5ndWlWUlxuKlxuKiBDb3B5cmlnaHQgMjAxNiBEYXRhIEFydHMgVGVhbSwgR29vZ2xlIEluYy5cbipcbiogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbipcbiogICAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuKlxuKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4qIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4qIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4qL1xuXG5leHBvcnQgY29uc3QgREVGQVVMVF9DT0xPUiA9IDB4MkZBMUQ2O1xuZXhwb3J0IGNvbnN0IEhJR0hMSUdIVF9DT0xPUiA9IDB4NDNiNWVhO1xuZXhwb3J0IGNvbnN0IElOVEVSQUNUSU9OX0NPTE9SID0gMHgwN0FCRjc7XG5leHBvcnQgY29uc3QgRU1JU1NJVkVfQ09MT1IgPSAweDIyMjIyMjtcbmV4cG9ydCBjb25zdCBISUdITElHSFRfRU1JU1NJVkVfQ09MT1IgPSAweDk5OTk5OTtcbmV4cG9ydCBjb25zdCBPVVRMSU5FX0NPTE9SID0gMHg5OTk5OTk7XG5leHBvcnQgY29uc3QgREVGQVVMVF9CQUNLID0gMHgxYTFhMWFcbmV4cG9ydCBjb25zdCBISUdITElHSFRfQkFDSyA9IDB4MzEzMTMxO1xuZXhwb3J0IGNvbnN0IElOQUNUSVZFX0NPTE9SID0gMHgxNjE4Mjk7XG5leHBvcnQgY29uc3QgQ09OVFJPTExFUl9JRF9TTElERVIgPSAweDJmYTFkNjtcbmV4cG9ydCBjb25zdCBDT05UUk9MTEVSX0lEX0NIRUNLQk9YID0gMHg4MDY3ODc7XG5leHBvcnQgY29uc3QgQ09OVFJPTExFUl9JRF9CVVRUT04gPSAweGU2MWQ1ZjtcbmV4cG9ydCBjb25zdCBDT05UUk9MTEVSX0lEX1RFWFQgPSAweDFlZDM2ZjtcbmV4cG9ydCBjb25zdCBDT05UUk9MTEVSX0lEX0RST1BET1dOID0gMHhmZmYwMDA7XG5leHBvcnQgY29uc3QgRFJPUERPV05fQkdfQ09MT1IgPSAweGZmZmZmZjtcbmV4cG9ydCBjb25zdCBEUk9QRE9XTl9GR19DT0xPUiA9IDB4MDAwMDAwO1xuZXhwb3J0IGNvbnN0IENIRUNLQk9YX0JHX0NPTE9SID0gMHhmZmZmZmY7XG5leHBvcnQgY29uc3QgQlVUVE9OX0NPTE9SID0gMHhlNjFkNWY7XG5leHBvcnQgY29uc3QgQlVUVE9OX0hJR0hMSUdIVF9DT0xPUiA9IDB4ZmEzMTczO1xuZXhwb3J0IGNvbnN0IFNMSURFUl9CRyA9IDB4NDQ0NDQ0O1xuXG5leHBvcnQgZnVuY3Rpb24gY29sb3JpemVHZW9tZXRyeSggZ2VvbWV0cnksIGNvbG9yICl7XG4gIGdlb21ldHJ5LmZhY2VzLmZvckVhY2goIGZ1bmN0aW9uKGZhY2Upe1xuICAgIGZhY2UuY29sb3Iuc2V0SGV4KGNvbG9yKTtcbiAgfSk7XG4gIGdlb21ldHJ5LmNvbG9yc05lZWRVcGRhdGUgPSB0cnVlO1xuICByZXR1cm4gZ2VvbWV0cnk7XG59IiwiLyoqXG4qIGRhdC1ndWlWUiBKYXZhc2NyaXB0IENvbnRyb2xsZXIgTGlicmFyeSBmb3IgVlJcbiogaHR0cHM6Ly9naXRodWIuY29tL2RhdGFhcnRzL2RhdC5ndWlWUlxuKlxuKiBDb3B5cmlnaHQgMjAxNiBEYXRhIEFydHMgVGVhbSwgR29vZ2xlIEluYy5cbipcbiogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbipcbiogICAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuKlxuKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4qIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4qIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4qL1xuXG5pbXBvcnQgY3JlYXRlVGV4dExhYmVsIGZyb20gJy4vdGV4dGxhYmVsJztcbmltcG9ydCBjcmVhdGVJbnRlcmFjdGlvbiBmcm9tICcuL2ludGVyYWN0aW9uJztcbmltcG9ydCAqIGFzIENvbG9ycyBmcm9tICcuL2NvbG9ycyc7XG5pbXBvcnQgKiBhcyBMYXlvdXQgZnJvbSAnLi9sYXlvdXQnO1xuaW1wb3J0ICogYXMgR3JhcGhpYyBmcm9tICcuL2dyYXBoaWMnO1xuaW1wb3J0ICogYXMgU2hhcmVkTWF0ZXJpYWxzIGZyb20gJy4vc2hhcmVkbWF0ZXJpYWxzJztcbmltcG9ydCAqIGFzIEdyYWIgZnJvbSAnLi9ncmFiJztcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gY3JlYXRlQ2hlY2tib3goIHtcbiAgdGV4dENyZWF0b3IsXG4gIG9iamVjdCxcbiAgcHJvcGVydHlOYW1lID0gJ3VuZGVmaW5lZCcsXG4gIGluaXRpYWxWYWx1ZSA9IGZhbHNlLFxuICBvcHRpb25zID0gW10sXG4gIHdpZHRoID0gTGF5b3V0LlBBTkVMX1dJRFRILFxuICBoZWlnaHQgPSBMYXlvdXQuUEFORUxfSEVJR0hULFxuICBkZXB0aCA9IExheW91dC5QQU5FTF9ERVBUSFxufSA9IHt9ICl7XG5cblxuICBjb25zdCBzdGF0ZSA9IHtcbiAgICBvcGVuOiBmYWxzZSxcbiAgICBsaXN0ZW46IGZhbHNlXG4gIH07XG5cbiAgY29uc3QgRFJPUERPV05fV0lEVEggPSB3aWR0aCAqIDAuNSAtIExheW91dC5QQU5FTF9NQVJHSU47XG4gIGNvbnN0IERST1BET1dOX0hFSUdIVCA9IGhlaWdodCAtIExheW91dC5QQU5FTF9NQVJHSU47XG4gIGNvbnN0IERST1BET1dOX0RFUFRIID0gZGVwdGg7XG4gIGNvbnN0IERST1BET1dOX09QVElPTl9IRUlHSFQgPSBoZWlnaHQgLSBMYXlvdXQuUEFORUxfTUFSR0lOICogMS4yO1xuICBjb25zdCBEUk9QRE9XTl9NQVJHSU4gPSBMYXlvdXQuUEFORUxfTUFSR0lOICogLTAuNDtcblxuICBjb25zdCBncm91cCA9IG5ldyBUSFJFRS5Hcm91cCgpO1xuXG4gIGNvbnN0IHBhbmVsID0gTGF5b3V0LmNyZWF0ZVBhbmVsKCB3aWR0aCwgaGVpZ2h0LCBkZXB0aCApO1xuICBncm91cC5hZGQoIHBhbmVsICk7XG5cbiAgZ3JvdXAuaGl0c2NhbiA9IFsgcGFuZWwgXTtcblxuICBjb25zdCBsYWJlbEludGVyYWN0aW9ucyA9IFtdO1xuICBjb25zdCBvcHRpb25MYWJlbHMgPSBbXTtcblxuICAvLyAgZmluZCBhY3R1YWxseSB3aGljaCBsYWJlbCBpcyBzZWxlY3RlZFxuICBjb25zdCBpbml0aWFsTGFiZWwgPSBmaW5kTGFiZWxGcm9tUHJvcCgpO1xuXG5cblxuICBmdW5jdGlvbiBmaW5kTGFiZWxGcm9tUHJvcCgpe1xuICAgIGlmKCBBcnJheS5pc0FycmF5KCBvcHRpb25zICkgKXtcbiAgICAgIHJldHVybiBvcHRpb25zLmZpbmQoIGZ1bmN0aW9uKCBvcHRpb25OYW1lICl7XG4gICAgICAgIHJldHVybiBvcHRpb25OYW1lID09PSBvYmplY3RbIHByb3BlcnR5TmFtZSBdXG4gICAgICB9KTtcbiAgICB9XG4gICAgZWxzZXtcbiAgICAgIHJldHVybiBPYmplY3Qua2V5cyhvcHRpb25zKS5maW5kKCBmdW5jdGlvbiggb3B0aW9uTmFtZSApe1xuICAgICAgICByZXR1cm4gb2JqZWN0W3Byb3BlcnR5TmFtZV0gPT09IG9wdGlvbnNbIG9wdGlvbk5hbWUgXTtcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIGNyZWF0ZU9wdGlvbiggbGFiZWxUZXh0LCBpc09wdGlvbiApe1xuICAgIGNvbnN0IGxhYmVsID0gY3JlYXRlVGV4dExhYmVsKFxuICAgICAgdGV4dENyZWF0b3IsIGxhYmVsVGV4dCxcbiAgICAgIERST1BET1dOX1dJRFRILCBkZXB0aCxcbiAgICAgIENvbG9ycy5EUk9QRE9XTl9GR19DT0xPUiwgQ29sb3JzLkRST1BET1dOX0JHX0NPTE9SLFxuICAgICAgMC44NjZcbiAgICApO1xuXG4gICAgZ3JvdXAuaGl0c2Nhbi5wdXNoKCBsYWJlbC5iYWNrICk7XG4gICAgY29uc3QgbGFiZWxJbnRlcmFjdGlvbiA9IGNyZWF0ZUludGVyYWN0aW9uKCBsYWJlbC5iYWNrICk7XG4gICAgbGFiZWxJbnRlcmFjdGlvbnMucHVzaCggbGFiZWxJbnRlcmFjdGlvbiApO1xuICAgIG9wdGlvbkxhYmVscy5wdXNoKCBsYWJlbCApO1xuXG5cbiAgICBpZiggaXNPcHRpb24gKXtcbiAgICAgIGxhYmVsSW50ZXJhY3Rpb24uZXZlbnRzLm9uKCAnb25QcmVzc2VkJywgZnVuY3Rpb24oIHAgKXtcbiAgICAgICAgc2VsZWN0ZWRMYWJlbC5zZXRTdHJpbmcoIGxhYmVsVGV4dCApO1xuXG4gICAgICAgIGxldCBwcm9wZXJ0eUNoYW5nZWQgPSBmYWxzZTtcblxuICAgICAgICBpZiggQXJyYXkuaXNBcnJheSggb3B0aW9ucyApICl7XG4gICAgICAgICAgcHJvcGVydHlDaGFuZ2VkID0gb2JqZWN0WyBwcm9wZXJ0eU5hbWUgXSAhPT0gbGFiZWxUZXh0O1xuICAgICAgICAgIGlmKCBwcm9wZXJ0eUNoYW5nZWQgKXtcbiAgICAgICAgICAgIG9iamVjdFsgcHJvcGVydHlOYW1lIF0gPSBsYWJlbFRleHQ7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGVsc2V7XG4gICAgICAgICAgcHJvcGVydHlDaGFuZ2VkID0gb2JqZWN0WyBwcm9wZXJ0eU5hbWUgXSAhPT0gb3B0aW9uc1sgbGFiZWxUZXh0IF07XG4gICAgICAgICAgaWYoIHByb3BlcnR5Q2hhbmdlZCApe1xuICAgICAgICAgICAgb2JqZWN0WyBwcm9wZXJ0eU5hbWUgXSA9IG9wdGlvbnNbIGxhYmVsVGV4dCBdO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG5cbiAgICAgICAgY29sbGFwc2VPcHRpb25zKCk7XG4gICAgICAgIHN0YXRlLm9wZW4gPSBmYWxzZTtcblxuICAgICAgICBpZiggb25DaGFuZ2VkQ0IgJiYgcHJvcGVydHlDaGFuZ2VkICl7XG4gICAgICAgICAgb25DaGFuZ2VkQ0IoIG9iamVjdFsgcHJvcGVydHlOYW1lIF0gKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHAubG9ja2VkID0gdHJ1ZTtcblxuICAgICAgfSk7XG4gICAgfVxuICAgIGVsc2V7XG4gICAgICBsYWJlbEludGVyYWN0aW9uLmV2ZW50cy5vbiggJ29uUHJlc3NlZCcsIGZ1bmN0aW9uKCBwICl7XG4gICAgICAgIGlmKCBzdGF0ZS5vcGVuID09PSBmYWxzZSApe1xuICAgICAgICAgIG9wZW5PcHRpb25zKCk7XG4gICAgICAgICAgc3RhdGUub3BlbiA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZXtcbiAgICAgICAgICBjb2xsYXBzZU9wdGlvbnMoKTtcbiAgICAgICAgICBzdGF0ZS5vcGVuID0gZmFsc2U7XG4gICAgICAgIH1cblxuICAgICAgICBwLmxvY2tlZCA9IHRydWU7XG4gICAgICB9KTtcbiAgICB9XG4gICAgbGFiZWwuaXNPcHRpb24gPSBpc09wdGlvbjtcbiAgICByZXR1cm4gbGFiZWw7XG4gIH1cblxuICBmdW5jdGlvbiBjb2xsYXBzZU9wdGlvbnMoKXtcbiAgICBvcHRpb25MYWJlbHMuZm9yRWFjaCggZnVuY3Rpb24oIGxhYmVsICl7XG4gICAgICBpZiggbGFiZWwuaXNPcHRpb24gKXtcbiAgICAgICAgbGFiZWwudmlzaWJsZSA9IGZhbHNlO1xuICAgICAgICBsYWJlbC5iYWNrLnZpc2libGUgPSBmYWxzZTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIGZ1bmN0aW9uIG9wZW5PcHRpb25zKCl7XG4gICAgb3B0aW9uTGFiZWxzLmZvckVhY2goIGZ1bmN0aW9uKCBsYWJlbCApe1xuICAgICAgaWYoIGxhYmVsLmlzT3B0aW9uICl7XG4gICAgICAgIGxhYmVsLnZpc2libGUgPSB0cnVlO1xuICAgICAgICBsYWJlbC5iYWNrLnZpc2libGUgPSB0cnVlO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgLy8gIGJhc2Ugb3B0aW9uXG4gIGNvbnN0IHNlbGVjdGVkTGFiZWwgPSBjcmVhdGVPcHRpb24oIGluaXRpYWxMYWJlbCwgZmFsc2UgKTtcbiAgc2VsZWN0ZWRMYWJlbC5wb3NpdGlvbi54ID0gTGF5b3V0LlBBTkVMX01BUkdJTiAqIDAuNSArIHdpZHRoICogMC41O1xuICBzZWxlY3RlZExhYmVsLnBvc2l0aW9uLnogPSBkZXB0aDtcblxuICBjb25zdCBkb3duQXJyb3cgPSBHcmFwaGljLmRvd25BcnJvdygpO1xuICAvLyBDb2xvcnMuY29sb3JpemVHZW9tZXRyeSggZG93bkFycm93Lmdlb21ldHJ5LCBDb2xvcnMuRFJPUERPV05fRkdfQ09MT1IgKTtcbiAgZG93bkFycm93LnBvc2l0aW9uLnNldCggRFJPUERPV05fV0lEVEggLSAwLjA0LCAwLCBkZXB0aCAqIDEuMDEgKTtcbiAgc2VsZWN0ZWRMYWJlbC5hZGQoIGRvd25BcnJvdyApO1xuXG5cbiAgZnVuY3Rpb24gY29uZmlndXJlTGFiZWxQb3NpdGlvbiggbGFiZWwsIGluZGV4ICl7XG4gICAgbGFiZWwucG9zaXRpb24ueSA9IC1EUk9QRE9XTl9NQVJHSU4gLSAoaW5kZXgrMSkgKiAoIERST1BET1dOX09QVElPTl9IRUlHSFQgKTtcbiAgICBsYWJlbC5wb3NpdGlvbi56ID0gZGVwdGg7XG4gIH1cblxuICBmdW5jdGlvbiBvcHRpb25Ub0xhYmVsKCBvcHRpb25OYW1lLCBpbmRleCApe1xuICAgIGNvbnN0IG9wdGlvbkxhYmVsID0gY3JlYXRlT3B0aW9uKCBvcHRpb25OYW1lLCB0cnVlICk7XG4gICAgY29uZmlndXJlTGFiZWxQb3NpdGlvbiggb3B0aW9uTGFiZWwsIGluZGV4ICk7XG4gICAgcmV0dXJuIG9wdGlvbkxhYmVsO1xuICB9XG5cbiAgaWYoIEFycmF5LmlzQXJyYXkoIG9wdGlvbnMgKSApe1xuICAgIHNlbGVjdGVkTGFiZWwuYWRkKCAuLi5vcHRpb25zLm1hcCggb3B0aW9uVG9MYWJlbCApICk7XG4gIH1cbiAgZWxzZXtcbiAgICBzZWxlY3RlZExhYmVsLmFkZCggLi4uT2JqZWN0LmtleXMob3B0aW9ucykubWFwKCBvcHRpb25Ub0xhYmVsICkgKTtcbiAgfVxuXG5cbiAgY29sbGFwc2VPcHRpb25zKCk7XG5cbiAgY29uc3QgZGVzY3JpcHRvckxhYmVsID0gdGV4dENyZWF0b3IuY3JlYXRlKCBwcm9wZXJ0eU5hbWUgKTtcbiAgZGVzY3JpcHRvckxhYmVsLnBvc2l0aW9uLnggPSBMYXlvdXQuUEFORUxfTEFCRUxfVEVYVF9NQVJHSU47XG4gIGRlc2NyaXB0b3JMYWJlbC5wb3NpdGlvbi56ID0gZGVwdGg7XG4gIGRlc2NyaXB0b3JMYWJlbC5wb3NpdGlvbi55ID0gLTAuMDM7XG5cbiAgY29uc3QgY29udHJvbGxlcklEID0gTGF5b3V0LmNyZWF0ZUNvbnRyb2xsZXJJREJveCggaGVpZ2h0LCBDb2xvcnMuQ09OVFJPTExFUl9JRF9EUk9QRE9XTiApO1xuICBjb250cm9sbGVySUQucG9zaXRpb24ueiA9IGRlcHRoO1xuXG5cbiAgY29uc3QgYm9yZGVyQm94ID0gTGF5b3V0LmNyZWF0ZVBhbmVsKCBEUk9QRE9XTl9XSURUSCArIExheW91dC5CT1JERVJfVEhJQ0tORVNTLCBEUk9QRE9XTl9IRUlHSFQgKyBMYXlvdXQuQk9SREVSX1RISUNLTkVTUyAqIDAuNSwgRFJPUERPV05fREVQVEgsIHRydWUgKTtcbiAgYm9yZGVyQm94Lm1hdGVyaWFsLmNvbG9yLnNldEhleCggMHgxZjdhZTcgKTtcbiAgYm9yZGVyQm94LnBvc2l0aW9uLnggPSAtTGF5b3V0LkJPUkRFUl9USElDS05FU1MgKiAwLjUgKyB3aWR0aCAqIDAuNTtcbiAgYm9yZGVyQm94LnBvc2l0aW9uLnogPSBkZXB0aCAqIDAuNTtcblxuICBwYW5lbC5hZGQoIGRlc2NyaXB0b3JMYWJlbCwgY29udHJvbGxlcklELCBzZWxlY3RlZExhYmVsLCBib3JkZXJCb3ggKTtcblxuXG4gIHVwZGF0ZVZpZXcoKTtcblxuICBmdW5jdGlvbiB1cGRhdGVWaWV3KCl7XG5cbiAgICBsYWJlbEludGVyYWN0aW9ucy5mb3JFYWNoKCBmdW5jdGlvbiggaW50ZXJhY3Rpb24sIGluZGV4ICl7XG4gICAgICBjb25zdCBsYWJlbCA9IG9wdGlvbkxhYmVsc1sgaW5kZXggXTtcbiAgICAgIGlmKCBsYWJlbC5pc09wdGlvbiApe1xuICAgICAgICBpZiggaW50ZXJhY3Rpb24uaG92ZXJpbmcoKSApe1xuICAgICAgICAgIENvbG9ycy5jb2xvcml6ZUdlb21ldHJ5KCBsYWJlbC5iYWNrLmdlb21ldHJ5LCBDb2xvcnMuSElHSExJR0hUX0NPTE9SICk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZXtcbiAgICAgICAgICBDb2xvcnMuY29sb3JpemVHZW9tZXRyeSggbGFiZWwuYmFjay5nZW9tZXRyeSwgQ29sb3JzLkRST1BET1dOX0JHX0NPTE9SICk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KTtcblxuICAgIGlmKCBsYWJlbEludGVyYWN0aW9uc1swXS5ob3ZlcmluZygpIHx8IHN0YXRlLm9wZW4gKXtcbiAgICAgIGJvcmRlckJveC52aXNpYmxlID0gdHJ1ZTtcbiAgICB9XG4gICAgZWxzZXtcbiAgICAgIGJvcmRlckJveC52aXNpYmxlID0gZmFsc2U7XG4gICAgfVxuICB9XG5cbiAgbGV0IG9uQ2hhbmdlZENCO1xuICBsZXQgb25GaW5pc2hDaGFuZ2VDQjtcblxuICBncm91cC5vbkNoYW5nZSA9IGZ1bmN0aW9uKCBjYWxsYmFjayApe1xuICAgIG9uQ2hhbmdlZENCID0gY2FsbGJhY2s7XG4gICAgcmV0dXJuIGdyb3VwO1xuICB9O1xuXG4gIGNvbnN0IGdyYWJJbnRlcmFjdGlvbiA9IEdyYWIuY3JlYXRlKCB7IGdyb3VwLCBwYW5lbCB9ICk7XG5cbiAgZ3JvdXAubGlzdGVuID0gZnVuY3Rpb24oKXtcbiAgICBzdGF0ZS5saXN0ZW4gPSB0cnVlO1xuICAgIHJldHVybiBncm91cDtcbiAgfTtcblxuICBncm91cC51cGRhdGUgPSBmdW5jdGlvbiggaW5wdXRPYmplY3RzICl7XG4gICAgaWYoIHN0YXRlLmxpc3RlbiApe1xuICAgICAgc2VsZWN0ZWRMYWJlbC5zZXRTdHJpbmcoIGZpbmRMYWJlbEZyb21Qcm9wKCkgKTtcbiAgICB9XG4gICAgbGFiZWxJbnRlcmFjdGlvbnMuZm9yRWFjaCggZnVuY3Rpb24oIGxhYmVsSW50ZXJhY3Rpb24gKXtcbiAgICAgIGxhYmVsSW50ZXJhY3Rpb24udXBkYXRlKCBpbnB1dE9iamVjdHMgKTtcbiAgICB9KTtcbiAgICBncmFiSW50ZXJhY3Rpb24udXBkYXRlKCBpbnB1dE9iamVjdHMgKTtcbiAgICB1cGRhdGVWaWV3KCk7XG4gIH07XG5cbiAgZ3JvdXAubmFtZSA9IGZ1bmN0aW9uKCBzdHIgKXtcbiAgICBkZXNjcmlwdG9yTGFiZWwudXBkYXRlKCBzdHIgKTtcbiAgICByZXR1cm4gZ3JvdXA7XG4gIH07XG5cblxuICByZXR1cm4gZ3JvdXA7XG59IiwiLyoqXG4qIGRhdC1ndWlWUiBKYXZhc2NyaXB0IENvbnRyb2xsZXIgTGlicmFyeSBmb3IgVlJcbiogaHR0cHM6Ly9naXRodWIuY29tL2RhdGFhcnRzL2RhdC5ndWlWUlxuKlxuKiBDb3B5cmlnaHQgMjAxNiBEYXRhIEFydHMgVGVhbSwgR29vZ2xlIEluYy5cbipcbiogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbipcbiogICAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuKlxuKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4qIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4qIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4qL1xuXG5pbXBvcnQgY3JlYXRlVGV4dExhYmVsIGZyb20gJy4vdGV4dGxhYmVsJztcbmltcG9ydCBjcmVhdGVJbnRlcmFjdGlvbiBmcm9tICcuL2ludGVyYWN0aW9uJztcbmltcG9ydCAqIGFzIENvbG9ycyBmcm9tICcuL2NvbG9ycyc7XG5pbXBvcnQgKiBhcyBMYXlvdXQgZnJvbSAnLi9sYXlvdXQnO1xuaW1wb3J0ICogYXMgR3JhcGhpYyBmcm9tICcuL2dyYXBoaWMnO1xuaW1wb3J0ICogYXMgU2hhcmVkTWF0ZXJpYWxzIGZyb20gJy4vc2hhcmVkbWF0ZXJpYWxzJztcbmltcG9ydCAqIGFzIEdyYWIgZnJvbSAnLi9ncmFiJztcbmltcG9ydCAqIGFzIFBhbGV0dGUgZnJvbSAnLi9wYWxldHRlJztcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gY3JlYXRlRm9sZGVyKHtcbiAgdGV4dENyZWF0b3IsXG4gIG5hbWUsXG4gIGd1aUFkZCxcbiAgYWRkU2xpZGVyLFxuICBhZGREcm9wZG93bixcbiAgYWRkQ2hlY2tib3gsXG4gIGFkZEJ1dHRvbixcbiAgYWRkSW1hZ2VCdXR0b25cbn0gPSB7fSApe1xuXG4gIGNvbnN0IHdpZHRoID0gTGF5b3V0LkZPTERFUl9XSURUSDtcbiAgY29uc3QgZGVwdGggPSBMYXlvdXQuUEFORUxfREVQVEg7XG5cbiAgY29uc3Qgc3RhdGUgPSB7XG4gICAgY29sbGFwc2VkOiBmYWxzZSxcbiAgICBwcmV2aW91c1BhcmVudDogdW5kZWZpbmVkXG4gIH07XG5cbiAgY29uc3QgZ3JvdXAgPSBuZXcgVEhSRUUuR3JvdXAoKTtcbiAgY29uc3QgY29sbGFwc2VHcm91cCA9IG5ldyBUSFJFRS5Hcm91cCgpO1xuICBncm91cC5hZGQoIGNvbGxhcHNlR3JvdXAgKTtcbiAgXG4gIC8vZXhwb3NlIGFzIHB1YmxpYyBpbnRlcmZhY2Ugc28gdGhhdCBjaGlsZHJlbiBjYW4gY2FsbCBpdCB3aGVuIHRoZWlyIHNwYWNpbmcgY2hhbmdlc1xuICBncm91cC5wZXJmb3JtTGF5b3V0ID0gcGVyZm9ybUxheW91dDtcbiAgZ3JvdXAuaXNDb2xsYXBzZWQgPSAoKSA9PiB7IHJldHVybiBzdGF0ZS5jb2xsYXBzZWQgfVxuICBncm91cC5mb2xkZXJOYW1lID0gbmFtZTsgLy9mb3IgZGVidWdnaW5nXG4gIFxuICAvLyAgWWVhaC4gR3Jvc3MuXG4gIGNvbnN0IGFkZE9yaWdpbmFsID0gVEhSRUUuR3JvdXAucHJvdG90eXBlLmFkZDtcblxuICBmdW5jdGlvbiBhZGRJbXBsKCBvICl7XG4gICAgYWRkT3JpZ2luYWwuY2FsbCggZ3JvdXAsIG8gKTtcbiAgfVxuXG4gIGFkZEltcGwoIGNvbGxhcHNlR3JvdXAgKTtcblxuICBjb25zdCBwYW5lbCA9IExheW91dC5jcmVhdGVQYW5lbCggd2lkdGgsIExheW91dC5GT0xERVJfSEVJR0hULCBkZXB0aCwgdHJ1ZSApO1xuICBhZGRJbXBsKCBwYW5lbCApO1xuXG4gIGNvbnN0IGRlc2NyaXB0b3JMYWJlbCA9IHRleHRDcmVhdG9yLmNyZWF0ZSggbmFtZSApO1xuICBkZXNjcmlwdG9yTGFiZWwucG9zaXRpb24ueCA9IExheW91dC5QQU5FTF9MQUJFTF9URVhUX01BUkdJTiAqIDEuNTtcbiAgZGVzY3JpcHRvckxhYmVsLnBvc2l0aW9uLnkgPSAtMC4wMztcbiAgZGVzY3JpcHRvckxhYmVsLnBvc2l0aW9uLnogPSBkZXB0aDtcbiAgcGFuZWwuYWRkKCBkZXNjcmlwdG9yTGFiZWwgKTtcblxuICBjb25zdCBkb3duQXJyb3cgPSBMYXlvdXQuY3JlYXRlRG93bkFycm93KCk7XG4gIENvbG9ycy5jb2xvcml6ZUdlb21ldHJ5KCBkb3duQXJyb3cuZ2VvbWV0cnksIDB4ZmZmZmZmICk7XG4gIGRvd25BcnJvdy5wb3NpdGlvbi5zZXQoIDAuMDUsIDAsIGRlcHRoICAqIDEuMDEgKTtcbiAgcGFuZWwuYWRkKCBkb3duQXJyb3cgKTtcblxuICBjb25zdCBncmFiYmVyID0gTGF5b3V0LmNyZWF0ZVBhbmVsKCB3aWR0aCwgTGF5b3V0LkZPTERFUl9HUkFCX0hFSUdIVCwgZGVwdGgsIHRydWUgKTtcbiAgZ3JhYmJlci5wb3NpdGlvbi55ID0gTGF5b3V0LkZPTERFUl9IRUlHSFQgKiAwLjg2OyAvL1hYWDogbWFnaWMgbnVtYmVyXG4gIGdyYWJiZXIubmFtZSA9ICdncmFiYmVyJztcbiAgYWRkSW1wbCggZ3JhYmJlciApO1xuXG4gIGNvbnN0IGdyYWJCYXIgPSBHcmFwaGljLmdyYWJCYXIoKTtcbiAgZ3JhYkJhci5wb3NpdGlvbi5zZXQoIHdpZHRoICogMC41LCAwLCBkZXB0aCAqIDEuMDAxICk7XG4gIGdyYWJiZXIuYWRkKCBncmFiQmFyICk7XG4gIGdyb3VwLmlzRm9sZGVyID0gdHJ1ZTtcbiAgZ3JvdXAuaGlkZUdyYWJiZXIgPSBmdW5jdGlvbigpIHsgZ3JhYmJlci52aXNpYmxlID0gZmFsc2UgfTtcblxuICBncm91cC5hZGQgPSBmdW5jdGlvbiggLi4uYXJncyApe1xuICAgIGNvbnN0IG5ld0NvbnRyb2xsZXIgPSBndWlBZGQoIC4uLmFyZ3MgKTtcblxuICAgIGlmKCBuZXdDb250cm9sbGVyICl7XG4gICAgICBncm91cC5hZGRDb250cm9sbGVyKCBuZXdDb250cm9sbGVyICk7XG4gICAgICByZXR1cm4gbmV3Q29udHJvbGxlcjtcbiAgICB9XG4gICAgZWxzZXtcbiAgICAgIHJldHVybiBuZXcgVEhSRUUuR3JvdXAoKTtcbiAgICB9XG4gIH07XG5cbiAgZ3JvdXAuYWRkQ29udHJvbGxlciA9IGZ1bmN0aW9uKCAuLi5hcmdzICl7XG4gICAgYXJncy5mb3JFYWNoKCBmdW5jdGlvbiggb2JqICl7XG4gICAgICBjb2xsYXBzZUdyb3VwLmFkZCggb2JqICk7XG4gICAgICBvYmouZm9sZGVyID0gZ3JvdXA7XG4gICAgICBpZiAob2JqLmlzRm9sZGVyKSB7XG4gICAgICAgIG9iai5oaWRlR3JhYmJlcigpO1xuICAgICAgICBvYmouY2xvc2UoKTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIHBlcmZvcm1MYXlvdXQoKTtcbiAgfTtcblxuICBncm91cC5hZGRGb2xkZXIgPSBmdW5jdGlvbiggLi4uYXJncyApe1xuICAgIGFyZ3MuZm9yRWFjaCggZnVuY3Rpb24gKG9iaikge1xuICAgICAgY29sbGFwc2VHcm91cC5hZGQoIG9iaiApO1xuICAgICAgb2JqLmZvbGRlciA9IGdyb3VwO1xuICAgICAgb2JqLmhpZGVHcmFiYmVyKCk7XG4gICAgICBvYmouY2xvc2UoKTtcbiAgICB9KTtcbiAgICBcbiAgICBwZXJmb3JtTGF5b3V0KCk7XG4gIH1cblxuICBmdW5jdGlvbiBwZXJmb3JtTGF5b3V0KCl7XG4gICAgY29uc3Qgc3BhY2luZ1BlckNvbnRyb2xsZXIgPSBMYXlvdXQuUEFORUxfSEVJR0hUICsgTGF5b3V0LlBBTkVMX1NQQUNJTkc7XG4gICAgY29uc3QgZW1wdHlGb2xkZXJTcGFjZSA9IExheW91dC5GT0xERVJfSEVJR0hUICsgTGF5b3V0LlBBTkVMX1NQQUNJTkc7XG4gICAgdmFyIHRvdGFsU3BhY2luZyA9IGVtcHR5Rm9sZGVyU3BhY2U7XG4gICAgXG4gICAgY29sbGFwc2VHcm91cC5jaGlsZHJlbi5mb3JFYWNoKCAoYykgPT4geyBjLnZpc2libGUgPSAhc3RhdGUuY29sbGFwc2VkIH0gKTtcbiAgICBcbiAgICBpZiAoIHN0YXRlLmNvbGxhcHNlZCApIHtcbiAgICAgIGRvd25BcnJvdy5yb3RhdGlvbi56ID0gTWF0aC5QSSAqIDAuNTtcbiAgICB9IGVsc2Uge1xuICAgICAgZG93bkFycm93LnJvdGF0aW9uLnogPSAwO1xuXG4gICAgICB2YXIgeSA9IDAsIGxhc3RIZWlnaHQgPSBlbXB0eUZvbGRlclNwYWNlO1xuICAgICAgXG4gICAgICBjb2xsYXBzZUdyb3VwLmNoaWxkcmVuLmZvckVhY2goIGZ1bmN0aW9uKCBjaGlsZCwgaSApe1xuICAgICAgICB2YXIgaCA9IGNoaWxkLnNwYWNpbmcgPyBjaGlsZC5zcGFjaW5nIDogc3BhY2luZ1BlckNvbnRyb2xsZXI7XG4gICAgICAgIC8vIGhvdyBmYXIgdG8gZ2V0IGZyb20gdGhlIG1pZGRsZSBvZiBwcmV2aW91cyB0byBtaWRkbGUgb2YgdGhpcyBjaGlsZD9cbiAgICAgICAgLy8gaGFsZiBvZiB0aGUgaGVpZ2h0IG9mIHByZXZpb3VzIHBsdXMgaGFsZiBoZWlnaHQgb2YgdGhpcy5cbiAgICAgICAgdmFyIHNwYWNpbmcgPSAwLjUgKiAobGFzdEhlaWdodCArIGgpOyBcbiAgICAgICAgXG4gICAgICAgIGlmIChjaGlsZC5pc0ZvbGRlcikge1xuICAgICAgICAgIC8vIEZvciBmb2xkZXJzLCB0aGUgb3JpZ2luIGlzbid0IGluIHRoZSBtaWRkbGUgb2YgdGhlIGVudGlyZSBoZWlnaHQgb2YgdGhlIGZvbGRlcixcbiAgICAgICAgICAvLyBidXQganVzdCB0aGUgbWlkZGxlIG9mIHRoZSB0b3AgcGFuZWwuXG4gICAgICAgICAgdmFyIG9mZnNldCA9IDAuNSAqIChsYXN0SGVpZ2h0ICsgZW1wdHlGb2xkZXJTcGFjZSk7XG4gICAgICAgICAgY2hpbGQucG9zaXRpb24ueSA9IHkgLSBvZmZzZXQ7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgY2hpbGQucG9zaXRpb24ueSA9IHkgLSBzcGFjaW5nO1xuICAgICAgICB9XG4gICAgICAgIC8vIGluIGFueSBjYXNlLCBmb3IgdXNlIGJ5IHRoZSBuZXh0IG9iamVjdCBhbG9uZyB3ZSByZW1lbWJlciAneScgYXMgdGhlIG1pZGRsZSBvZiB0aGUgd2hvbGUgcGFuZWxcbiAgICAgICAgeSAtPSBzcGFjaW5nO1xuICAgICAgICBsYXN0SGVpZ2h0ID0gaDtcbiAgICAgICAgdG90YWxTcGFjaW5nICs9IGg7XG4gICAgICAgIGNoaWxkLnBvc2l0aW9uLnggPSAwLjAyNjtcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIGdyb3VwLnNwYWNpbmcgPSB0b3RhbFNwYWNpbmc7XG5cbiAgICAvL21ha2Ugc3VyZSBwYXJlbnQgZm9sZGVyIGFsc28gcGVyZm9ybXMgbGF5b3V0LlxuICAgIGlmIChncm91cC5mb2xkZXIgIT09IGdyb3VwKSBncm91cC5mb2xkZXIucGVyZm9ybUxheW91dCgpO1xuICB9XG5cbiAgZnVuY3Rpb24gdXBkYXRlVmlldygpe1xuICAgIGlmKCBpbnRlcmFjdGlvbi5ob3ZlcmluZygpICl7XG4gICAgICBwYW5lbC5tYXRlcmlhbC5jb2xvci5zZXRIZXgoIENvbG9ycy5ISUdITElHSFRfQkFDSyApO1xuICAgIH1cbiAgICBlbHNle1xuICAgICAgcGFuZWwubWF0ZXJpYWwuY29sb3Iuc2V0SGV4KCBDb2xvcnMuREVGQVVMVF9CQUNLICk7XG4gICAgfVxuXG4gICAgaWYoIGdyYWJJbnRlcmFjdGlvbi5ob3ZlcmluZygpICl7XG4gICAgICBncmFiYmVyLm1hdGVyaWFsLmNvbG9yLnNldEhleCggQ29sb3JzLkhJR0hMSUdIVF9CQUNLICk7XG4gICAgfVxuICAgIGVsc2V7XG4gICAgICBncmFiYmVyLm1hdGVyaWFsLmNvbG9yLnNldEhleCggQ29sb3JzLkRFRkFVTFRfQkFDSyApO1xuICAgIH1cbiAgfVxuXG4gIGNvbnN0IGludGVyYWN0aW9uID0gY3JlYXRlSW50ZXJhY3Rpb24oIHBhbmVsICk7XG4gIGludGVyYWN0aW9uLmV2ZW50cy5vbiggJ29uUHJlc3NlZCcsIGZ1bmN0aW9uKCBwICl7XG4gICAgc3RhdGUuY29sbGFwc2VkID0gIXN0YXRlLmNvbGxhcHNlZDtcbiAgICBwZXJmb3JtTGF5b3V0KCk7XG4gICAgcC5sb2NrZWQgPSB0cnVlO1xuICB9KTtcblxuICBncm91cC5vcGVuID0gZnVuY3Rpb24oKSB7XG4gICAgLy9zaG91bGQgd2UgY29uc2lkZXIgY2hlY2tpbmcgaWYgcGFyZW50cyBhcmUgb3BlbiBhbmQgYXV0b21hdGljYWxseSBvcGVuIHRoZW0gaWYgbm90P1xuICAgIGlmICghc3RhdGUuY29sbGFwc2VkKSByZXR1cm47XG4gICAgc3RhdGUuY29sbGFwc2VkID0gZmFsc2U7XG4gICAgcGVyZm9ybUxheW91dCgpO1xuICB9XG5cbiAgZ3JvdXAuY2xvc2UgPSBmdW5jdGlvbigpIHtcbiAgICBpZiAoc3RhdGUuY29sbGFwc2VkKSByZXR1cm47XG4gICAgc3RhdGUuY29sbGFwc2VkID0gdHJ1ZTtcbiAgICBwZXJmb3JtTGF5b3V0KCk7XG4gIH1cblxuICBncm91cC5mb2xkZXIgPSBncm91cDtcblxuICBjb25zdCBncmFiSW50ZXJhY3Rpb24gPSBHcmFiLmNyZWF0ZSggeyBncm91cCwgcGFuZWw6IGdyYWJiZXIgfSApO1xuICBjb25zdCBwYWxldHRlSW50ZXJhY3Rpb24gPSBQYWxldHRlLmNyZWF0ZSggeyBncm91cCwgcGFuZWwgfSApO1xuXG4gIGdyb3VwLnVwZGF0ZSA9IGZ1bmN0aW9uKCBpbnB1dE9iamVjdHMgKXtcbiAgICBpbnRlcmFjdGlvbi51cGRhdGUoIGlucHV0T2JqZWN0cyApO1xuICAgIGdyYWJJbnRlcmFjdGlvbi51cGRhdGUoIGlucHV0T2JqZWN0cyApO1xuICAgIHBhbGV0dGVJbnRlcmFjdGlvbi51cGRhdGUoIGlucHV0T2JqZWN0cyApO1xuXG4gICAgdXBkYXRlVmlldygpO1xuICB9O1xuXG4gIGdyb3VwLm5hbWUgPSBmdW5jdGlvbiggc3RyICl7XG4gICAgZGVzY3JpcHRvckxhYmVsLnVwZGF0ZSggc3RyICk7XG4gICAgcmV0dXJuIGdyb3VwO1xuICB9O1xuXG4gIGdyb3VwLmhpdHNjYW4gPSBbIHBhbmVsLCBncmFiYmVyIF07XG5cbiAgZ3JvdXAuYmVpbmdNb3ZlZCA9IGZhbHNlO1xuXG4gIGdyb3VwLmFkZFNsaWRlciA9ICguLi5hcmdzKT0+e1xuICAgIGNvbnN0IGNvbnRyb2xsZXIgPSBhZGRTbGlkZXIoLi4uYXJncyk7XG4gICAgaWYoIGNvbnRyb2xsZXIgKXtcbiAgICAgIGdyb3VwLmFkZENvbnRyb2xsZXIoIGNvbnRyb2xsZXIgKTtcbiAgICAgIHJldHVybiBjb250cm9sbGVyO1xuICAgIH1cbiAgICBlbHNle1xuICAgICAgcmV0dXJuIG5ldyBUSFJFRS5Hcm91cCgpO1xuICAgIH1cbiAgfTtcbiAgZ3JvdXAuYWRkRHJvcGRvd24gPSAoLi4uYXJncyk9PntcbiAgICBjb25zdCBjb250cm9sbGVyID0gYWRkRHJvcGRvd24oLi4uYXJncyk7XG4gICAgaWYoIGNvbnRyb2xsZXIgKXtcbiAgICAgIGdyb3VwLmFkZENvbnRyb2xsZXIoIGNvbnRyb2xsZXIgKTtcbiAgICAgIHJldHVybiBjb250cm9sbGVyO1xuICAgIH1cbiAgICBlbHNle1xuICAgICAgcmV0dXJuIG5ldyBUSFJFRS5Hcm91cCgpO1xuICAgIH1cbiAgfTtcbiAgZ3JvdXAuYWRkQ2hlY2tib3ggPSAoLi4uYXJncyk9PntcbiAgICBjb25zdCBjb250cm9sbGVyID0gYWRkQ2hlY2tib3goLi4uYXJncyk7XG4gICAgaWYoIGNvbnRyb2xsZXIgKXtcbiAgICAgIGdyb3VwLmFkZENvbnRyb2xsZXIoIGNvbnRyb2xsZXIgKTtcbiAgICAgIHJldHVybiBjb250cm9sbGVyO1xuICAgIH1cbiAgICBlbHNle1xuICAgICAgcmV0dXJuIG5ldyBUSFJFRS5Hcm91cCgpO1xuICAgIH1cbiAgfTtcbiAgZ3JvdXAuYWRkQnV0dG9uID0gKC4uLmFyZ3MpPT57XG4gICAgY29uc3QgY29udHJvbGxlciA9IGFkZEJ1dHRvbiguLi5hcmdzKTtcbiAgICBpZiggY29udHJvbGxlciApe1xuICAgICAgZ3JvdXAuYWRkQ29udHJvbGxlciggY29udHJvbGxlciApO1xuICAgICAgcmV0dXJuIGNvbnRyb2xsZXI7XG4gICAgfVxuICAgIGVsc2V7XG4gICAgICByZXR1cm4gbmV3IFRIUkVFLkdyb3VwKCk7XG4gICAgfVxuICB9O1xuICBncm91cC5hZGRJbWFnZUJ1dHRvbiA9ICguLi5hcmdzKT0+e1xuICAgIGNvbnN0IGNvbnRyb2xsZXIgPSBhZGRJbWFnZUJ1dHRvbiguLi5hcmdzKTtcbiAgICBpZiggY29udHJvbGxlciApe1xuICAgICAgZ3JvdXAuYWRkQ29udHJvbGxlciggY29udHJvbGxlciApO1xuICAgICAgcmV0dXJuIGNvbnRyb2xsZXI7XG4gICAgfVxuICAgIGVsc2V7XG4gICAgICByZXR1cm4gbmV3IFRIUkVFLkdyb3VwKCk7XG4gICAgfVxuICB9O1xuXG4gIHJldHVybiBncm91cDtcbn0iLCIvKipcbiogZGF0LWd1aVZSIEphdmFzY3JpcHQgQ29udHJvbGxlciBMaWJyYXJ5IGZvciBWUlxuKiBodHRwczovL2dpdGh1Yi5jb20vZGF0YWFydHMvZGF0Lmd1aVZSXG4qXG4qIENvcHlyaWdodCAyMDE2IERhdGEgQXJ0cyBUZWFtLCBHb29nbGUgSW5jLlxuKlxuKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4qIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuKlxuKiAgICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4qXG4qIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiovXG5cbmV4cG9ydCBmdW5jdGlvbiBpbWFnZSgpe1xuICBjb25zdCBpbWFnZSA9IG5ldyBJbWFnZSgpO1xuICBpbWFnZS5zcmMgPSBgZGF0YTppbWFnZS9wbmc7YmFzZTY0LGlWQk9SdzBLR2dvQUFBQU5TVWhFVWdBQUFnQUFBQUVBQ0FNQUFBRHlUajVWQUFBQWpWQk1WRVZIY0V6Ly8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vK3VtQWM3QUFBQUwzUlNUbE1BV25KZmJucURXR1I0YTJaY1luQlJhbFJMZ0g2RVRuUjhVR2gyUm9aRFhsYUhTWW84UUhVMkx5WWNGQXdGbW1VUjFPSUFBSkZoU1VSQlZIaGV0TDJKV211N2pqVUtJUWtrUUxxWnZnTUNaTzJ6VC8zMy9SL3ZTa05Ea2oyVHJPYXJWZDVWNnhEUDNwSmxXZEtRN3FhUGI2K3Zydzh2aitQWi92dnJ4ei8vL1BqNjNzL0c3L2NQMm4wL1haNk9wNlg4ZkpIZmFHLzNqOXE1WC9MS3QvdDN2L1FmdWZRay9Yb3Vib2x6L0RxNUxIN3kxbkxWbDl4ZUg0YjI4amlkbmNaeS9aTTBQK1dmZi83em4vLzgrKzkvL3NHNVV6dGF2M0gxaW5KSVhrbGU4UXZuMytPUk9QMm9qNU9QbXo3ZXYrbTVQRERGeVhhbi9Vd2V3QmQ4MTI0WkRuMm8zZVRCQm1DS0F6WlFmalk3NVdYLy9ZKy9LajZMbjc3Ly91RjNyMjR2SHlmUDVhZTljUlJzYUg1SS80OHZlUXFQNUtoOVg5ejg2d3ZuK3dqaFpmbVlqVHpteUJmbFNPQno1VjFsWE84ZUg1NG13OG56SzhkVEhzblBlcGJ1cHdmdDFWdStQc2x2YVpQdHM3M0ZhV3hYYnAvaVVqeC9JOVNVYzNITHFaMkRobnRWUDBFUmZONzlxOTE4Ky9UMnVGbE84ZXc4QlcrcXc0Uno1UlpiT1RwNWZzSmorZFRxRlovbGxUQXF1TGMrRW04akEvNGRBL1M4OWM5NWtoRWg4WlRZbThlM3ArMFFWOXhQNWY1ZlFqVThWTHVlSjNpdGU5Q1Q5TGV6bjVJRCtLcDh0QjNFbU9mZGVmc2w1ODBQWTFXTURrYUJORlhxSDVWamVTU0c1SGpSZFR6cStlQU1qUCtFTDh2SHlDU3pGelc2TEU5NlByanY3dVZwTXVwMHVsdU1wN0lwdVdYYjdYUTZ3eWNadHRrVWI5M3RvSTI2OXJITEthOGNicDBVbk0ydlR4TTl0L3Y4OEloemVOM2s2U1YvNHRieVpzZTlmZDRRZmQySnZPN204ZUc1VzU3eURSYkFyTUs1dUR2ZUdDVDlRYjdJVit6YUdNNzJ4eFB1UGNMcFNzOGo1OW56cEJ1Zk0zeDI0bkhhdnRvRGhuSVA2U1hWOE42NGFEUWtQVGxSdG5iMnM5OUUzOVJmZFJpZnJyd2tuYnc3Ym8vSmhYbEx3ZWxQbWNpVHg3UFQvbHY3VDdQWjVoSGpsa1B5dFpmUmo1dURSck9UbkE5bXZYOTR4a0IwaDN5dng4MUpCd0l2cXYxNFV6bi8rSzB2ZXllamZlNE5WdUNBRGNYbU96NXIxOXQxOWZLeHZwbjhIUFMwN1ZZais5akhON2xTZm5maTBoK2N6Y1BPZWRBYmRJU2E3MjlQY2c3YXVmdjBsai90MXN2OWFiWlUzcHpJdzZTdDlQdkdNa2FkUVp3aUEzSGtQUG5lNDl5Um5qdFlrYVJDTnZCUXZ1Smd4ekU4WWNCeDc0RU5IY1lacDY3NE9ZTnpoeHdkNHVGcHVOS25qN1lQa0F6SGs3NFJIcnJTOTlwMUp2WmdPUUQ2cjdRVEJNVzh4U0o2UFBGVjQ5T1h4Z0M4dTF5Z2hKTlJzMVZ3dGpINjczRDZSS2ZVY3JiWC92RjBLaCt4N2U2S1VaTzc2eXl4bTJNY3BsT2NiOHc2eEVDY096dDdXUTZFZE9zbkQ4RFpPQi95NTA1SHU1bHpQRjFzdnNvY0hNejdJT0lZWEhzZXpKditZdEh2TjcwZGJpRVRkVHZhTmYyOFZIbkgySDdYYS9xZzVyc3d5VzYra0RhWGQzL0xuNDE5eW5JOGZYL1h6enYzK291bVlBRDVpVlB3cGllVGxESVh4L2h1T2RodlFGSWIxcE5Oa1hOdjN0ZFhsSytSTVFTOU9lRDl4WnhEUi9vTHpacStmYzU2Y0ZhT0J2SDJKaDZHcS9XaVB4aHRqUzlPU3d3ZWJyS1RKOWhiem5BMkpzcWdXZlRYdTFHc1dKalFHRVI4VnYrU0FlUUNFZzdmQnI2N0YvcHpHREFiNzRVRjBDOU5QbnFsZDFyaks5Q1BnVmozRnhpSEJ6MUordmZIbVRIcldqK3MxNU9YQlFWUGV6SkFvNFJRbWZIeThtaWFHeGlnMXh6a1ByajM3T2hFSE16bExlWG05M2lXdnZTSGpOZmk4SUdQbFhkWEJ0QTdOc0lCeWhDbmJ4VkFlUDY4Zitpdmt3SGtzbytDQVQ0Ty9iNVJWK2ZiMnh1ZTFuem9tT2g5eVFBZk9PVk5WVTU1VXhXdHlsK1FEc0tFOHlEcHQ4cEQ4SkMvNG9lT0liN210TVNBcnc4ZmZONXN6SG5XZ1BpTjhyUnpOSWJKaEoxY0ljemZuVURTZ1dlRUFSYWYvWUc4NWdFZlJySDZnSW15YUdTa01hN3YxQTB3b2YyemR2VVNBREovY01Dbm01bnpIUTQwaS9sQkJ4U2FWU2pOSUljTXFieG85R3VuVHFhNXloSnBVS0NWNDhHc0IzQzNQR1VFQ2VDeXFpZnZvMk9EODQxZDd4NHcvUTV6enFnVGxwZUozcnR2MHM0R3ZUa2NsS2RrNUhFTCtTTHd4V0M5T0FoUGdjMk84aVVxNUZmNmZYcXRNTStML2hSV3JCaGdBY2tsbjY5RCsvVDhqS2ZaUUlsT1d6S0FOS2pweTcxSlNoNmI3NFFKbkFGTTdPSGpGbzNjZWQwc0RnMUZQc2VqNmEveFBDb3VPeDJnZVc4Z1RjOTJqbDdpUmhBUHdnRHlpclpPWTNsUldzcGp6K3UreWluVHJIQnowTCtIMTVjbllCcEFOeEJOVEdkQ3lnYXNybmdDWHNBSTkzQ3ZlZ0QxYWYwRW9VTUREb0FhRTVxZVRIYVFlamlzK20zY3p0MVFvSVBqRy9rdzVlMnp2UlFWYTJjOVBaOHExQTlWQW5IN05XVFNlQWEraGl4YTc2RHZRSGpnd2xWSGxzNjVVcHdLM3JaclBJN1JubUVGZWxBU0g1UkhWSzVTNTdsZ0FDcEdHRzlwY29JT2xQeWxzeWdaUUpycTlGRG92citTQVlUTy9aQUFMdmJtaDhNY3J5aXZ0RkNDdittTWgyd1lESGJHRVA1dE1rQTcxZWxHbmJOS09nb01uNStOU0pIRG9sbGpuWjVDcUsxV0syR1hqaXl1Zy9PcWd5ZjdZRGN5ekx0NUk1TnRhMnFkYjZMNFdSMFphMmdUd3FwVVZqc3FvOWVyTGpkZk15ckh1MGJ1SWx6UXpIZFVpRjM1MHp0cFo2ZlZyK3UwUERqNlovWk92Zlg2REIzblBESk5JeFRyWGR4SXFBMnV2Rk1pS0JrYkl5TW1DVHE0dWt5TkFTREVoNU11U0FNRkNWL1pQYThQQ3doRmJEYkdXQmY2SWl6QjNsT1Z1TnZKSlFQWW9JQnc1OTF1cCtPNlc4a2ZxNjdjT0JnQVBhNFVxNDRKWFZaWG1MNU9SRnRadjZrUlU2eGlJaTM4RlhYcGcwWnBRc3ZPNUJ3YmRZU3FuYTdPSXJrUUl1Q2RrdVRRMTVXa1R6SEZJUldlR3NyRjhnZEl2ZUhTc0tQbU9kQUpCTFh1dERFbCtreXRXYjhBT2dZMWtGQld6eDI3WkJuS3NZN0FlUmNLY2ZUckFBMDZxOHQrWmN0ZDlFKzV4SzEydmZWOFBvY1FnN1NpWXIzdXNhMTdTbTJvc25jUTVha25iY0FzWnhNSldBT1RBV1RLVEdUWmQyWWZtOEs4T0RnRHhBemxranRkWW50K2xRR0VxR1F0ZWRQZFNOcEEvb0RPNHZjWTZDRlI5Nm5Rd2Z4aE9xNlFnd29EVmxDNzdlR2dRdXhKQ2Q0L1VIK2RVWHoxN2ZHbVE2NHg1WEdYdFpCSEQ0TS85UEFXTjVLbjZscG5mRUU5OHFDL1pLQWdBSlVCcUU2NDVya2VkRXl0bzBvaXJHSmE4MXpYTnVnWXAxdVh1SExjMHhIdWRrVUh0VWxWOU1zQURXLzBqOWhQRGxjWk5oZitwUkJUUVR4MnhUcGJNb0MrcnM5NDE4RkcvR25McUYzODJWOFBkRDdxakxXVmhhT2JETEJ2TVlCcTBPeTVaQUJqTFQyR05VVEpSSjNGNzlIMEQvb1JMcCtQdHN1bENKQmVER3FzTzc0VTZkNUVLRnN4Z091Z0pnOGFXZHk2S29VWGg0VnNZa1FFY0ZIRHU1cjhHaFZybS9ieWw3TEhZbTJ5Ui91aFRoeE04NXhUanc3ZGtGcnp3ZFhBNWMxTGluRjVmdEpOeU1IR3RKU1kyKzJ2KzZkYzRocDVhTlBnQ1R1b2RtT25ZYlJrZ05NNDFtM2NnL0xVeCtSMHNubUJ6eEdob2p6UXRUbFpNUUNzYVp0cHhRQ1FDYmNaWU9ZelRvVU5wN0JlNWkrNzBJLzRDSVZ1LzVYUy9oUFQ4RFVZWUtzc2Ezc2VGUkVyYVhxbk5nTkF4S3NBNkl4MEFqWHpSditXKzFGYnpyZVhhUlNqeXZIUlJ4b2pRTDBkVTNMS0lFUHoxT00yWlRBSU9tQ2hOWk9IYjE1U2pzdkwwMVZDUHozOHVwL0VVeDBJS3U1YW5yU0d1SW92NjNtVENVSUcyRk52Y04xT0Jna3JRSS9UZWthMmJUNVVxS2p5Zk9hV3QyQ0FMdFQzcFZxQi80QUJzUFp4eFI3bGpDTUR5RWZJV2dtRmp2bzFhSTMxNmVPVDU5YUtoeTBnejBOcXVjbWpmTHlSVW45Z3pSdnNlbVFBNDUxa2dCRWtVcCtqbWlxR1hNWVZBTllSRzJ1WkU1MnpickQ0b2s1bVVRNmhOY2RhY3ZPU1d3endwLzFURG8vdTZVWWpsVFU1cHZ5eURodWxsVERBY1JaSDhXVWNKSmNSTUw3aGUvcVF5YnJWNHE0cEdBRHFvY29BSGZ6dTd6UEFySkN1SFBpU0RQb1I1MTV1Wm8vSHVLQlpKRnNrQTBBMVVTYlVSdjI2WmdDc2JpTERSUUNvWklIQnB5UFh1c1dEcjZPS20rbGRicGtpZjZxNG92YUpZVW5OTTE3MFBrOC9RMnZHbjlBeGJsN3l0eGdneDFPMDZTMTJScllmZWk5a0d4dGNBbnZaQm5JQTVUTE1vTWY4Z1ZHM1NZYzd5WHdVbWZtQjI3c09RRktkWVExODE2bXkycTFwOS9zbEE4VHFJeVJ4dGJPeUEyejVPVFMrZ2htSG1JVVlPdXV0SmNBam5FWDR3UHNMQ1VCVkNPeW1UNFBCUjJaS3d6ZkM2NmpNWGc4R0s1MURYYm5MdUZDTE9URDBXUERWNVNTb0ZwdzAxRHROaVhwOWxvZTRjTDExeWQ5akFQbmgyN1JYWFJ0aUx1YVlKdjBoQUlRQlVvbWlEaTZqaWZIZDZnUXIyVU1ONkxKeStaUU03VUJNUlBnTzA3R1ZPSlRQdjJBQXJqNDRHa3BjWlFuTTA0UFVwcTdvLy9NWnlRQjRmMnlSM1F2U1lnRDlBWGx2aW9EZVNxME56Z0JjUXFudURNVHBBUjlpc2MxTTNRZ1BkWTNnaFpRTktnVFJNVVY4Tkc5ZTh0Y1lnSS9HVEhLTkZvK3Vsb0IwRXFrcFdEUXI0MHd5UUszR1ZRd2dGaW1zWEc1aGxqVWNBeWE2UmpLQU1raVBScVhqenhuZ1dLd0J6cmVQNDVzTVFCdGxpeEtuMWk0QWFyQjdRYTR4d01KRWVYK2dES0JQR1EyQ0FlZ0VVVU5RT0QyV1puM0FBSzBYbE9iTDNESG9TenNWek9QMW5CcWtYSm5xeWMxTC9oSURzSjljVmFuR3RSS1lUaUpoZ0Mvc28yOHh3QjdEaTZldGRRTXd6QlBIVk1uVXJ0b2tBK2ptZDA0ZDgxY01jRXJwR2l2QThpWURxQjAxWkRHM3JlQ0xVclErZ0tOY3E3dk5BQjhtKy9XQUVJV2F2V3pUbitFR2xTMjhPVDNBeDJwOXNNMTVQblZjS1U0ditaU2FtaEJaVG9WYmwveGxCbUIvTGRmcmJhQlQ4UGhMQ2JCUDg3NUt4ZDBxRitVeEJnRy8xUU5MWFVaV0NTTUZQQ08vWUlBMDRzM25sSXpUTmdPa1BrcVRiNjJObVVtV200bUJTTGF0V3hSK0xnSDBESmtnS2tma2ZKQVYwUXV3ckhUT01BVDVLcFBLVHNxZDJ1TEJwMXgrWkUyRitwSy96d0MvZXZUbmdxM05BTzFUQjI3dTNjQ1JpRzF0WDZXaThNQzZIbDBqN2doZUExakF1dWo1clYyQXFQV2hNdU9NYld0b0o4T1MzNWFGam9OYmNvTEdRcUtHZDdId2NzOStUUWNBSFdNSk9HTWhHWVVoQ0FKR2JhdmlKRmdOYUpjUWhUOTFqd1dOSmN1YUFXNVA1NXNNOEg4dkFlQ3V2N1VFREFvR09HMzhWUFRHa284RitWUzQrTEV5d24rNnFrWVg0d1RMUDN3Z3Y3OE5QT2JHWGhvTmJMeUN6cWZkV2ljMlhxWGNNM1RJR0NTRzNhUVA3VjNtYmo4T3RSa0F6QzNYcXp5Zmk1RUI2aWRZUW9mdjNaWXdIWWRKTjE5NkdWdmh6MWdCOEphcDNoVjYzMXQ3SVU3OTlOb2xmNXNCYnFzZlZBSlgrSy9URFNXUU5BckZ2K0paZUpnUnNRY0hROU9IQ1dZSE0veWxKVkM5b0s5L3hBQnAyalAvVVRHMG4rS3hNMk1XWGJtRnhxaHRuYWFBY0dCL0xNd0NxcTlJNFZBeEFGZmsrUTdtR0ZrS3hSdzhuL2U1MkU4TFpYSXlMQmpnRk9aeTBJdWJvM0o4T2ZDM1ZYSHc4TTFML2hZRDNONkFKRjJHYUc0R2tHMGczZG9odDUyQmZaZGwvaGUwcy9KQUxJMnp0aTlBbG90eFc0UDQrVFlRRVZxdlcrMUxwVDdzMW9jK0RlYW1HMUFaQ1UzbUVOTnhwaUpBaEpSR0FueEFmMmQweG1sVE13Qm1DSGFBNnZQVjgrQllYRlBkVDV1dk9rN25QajJYY2hmdTJuTHZtVnNQK2ZpSFY1ZTJQOTJNMzdna0Nhb0hYcCs2Sk9pZjk5ODJRUlIwZVVKakFJa3d3TWwxWEdwdWJtdmg5T0lDZ1NBNWM1LzcxbVc1c1UrOTdRMGN6NFFDTnhuZ1hROXJMTGM5bmR1cndxRTBkMjhON29VNUIvb3MyRENTdUNZaUVkZXluSy9YWWF5R2JicGdnUFJ6aUI4Vi90Z2Qvb2NoblU0NjlYbklRaExtWnNUWmhvY00rMXZiT3AwWkR2Tzh4WXJCb3pmTmNUY3ZNZk03TkpjSnJ2aXdCZVJQKzZlWFJraU9heUVCMkxhTTRycER6TVFvbGUxMERwckJsMmFXaFFxdUxaenRIRTBoSG1oWE1jQmpyaVpxYXNMWVhXY0FPTUxsWVUvUHBsOXhOaGRNUkg4dFhhWWtUeW95OG1EWEc4VWlZVmJvSGNKZzNBSFAxU3NZZ1A1ZTVmVmRKNko4T3lQR2Z0SHJJYXZPQVFLbXoxQ25NZUpzbFY2eDZNVGFSYnV4T0E5VDh6UkI0Z2I1Y3hya2IxNlNuM2FXOTVJclBrbU1QKzJITXBSdWlMVzdJYTc1QWhqYWVqZCt0THU1ZjgzZjN3UVZmbS9KVlNQUmpzK2h1R0Iwc1Zvd0dLRjJ6Q0hteU1idUNnTjBoMHBWSVFpSE5sYUFrZ0hnMVJ0cDBJUkpJczRmZmdSMUs3QWUwUWhkNFJuZVNwMlRYTDNjMGFVR2ZKcjYxRW12Tjk4Tk5LNkFjZUVlVWF1cXp1Y2lWZ1lWZElqN0tGYUFMMW9sNVgxYzg4Ulk0MmpMSmFmdUxCdmFtNWRFU0pNd3Q0UnQ2S1V3aXYxeHZ6eTZkRVQyUGFnbHZZRnIvZ2VhZ1FFMFdwQUVoMkJmcHB3Y0lUeVpBeThYRHlRVUFPNDV4Z1NxMUEweEJnWll1bEkvdDRuTHNidGdBQWtDMG9mNTBKTGRhRG1veGRVazNEcnBsdGZXRGRFcTNDRWNBTzRYaWpaTzdGT3NYbTZZbUM3RFZTOHNzSlkyYi9EeWhneGhURDJNQUIvelhCbnNyZWNpWEh6anFaZ0FNRk5xbm9kRDJEL0g5OWVkOHN1YmwxaFE0d0JCcmRSN3dIdC8ycis4RllyZ2V0VWlta3Z0cnp1aFB3T0NSdFNvN3NrUituWlFDc0RRSWhLYitad08rZ2xkWjd0MGFZNVBpTS9seVgwTE11WFl6VnNNSUQwaCtsWTY0WVJvWktLS0FSQzlDdWhaRmZlRktGZ3FWNHhIM1ZQNHpCdHdjdVVrV0J6b25FRElISU4xRnRBbFlNUFVPd2o5aWFvUnFTWTBRdnlUT1pUSUFPb0g1VENmTkQ2eHJYbk9aYmhNODJ5RjVmUTlMR2QyOHhLTElSTFRneEx0WUtGQ2VQWWY5cyt1QmlObFJGRFJrZ0dNWlE0TmVVdlgwd3ljZytTeThOKzUrb0x4MnRKTnFjS1FlTXJoYjQ0S2VMUHlja2dyR1VCYVV6REFBVVBMeGJXbFNMNjgzQ04wMnMyVkhxbm1EMjlaRkhZTkpIZnRKdXozYmFabGVEUW11Y3gralRpVEk0elpKWnp2U1ovVHpKWDlBS3dqQXpUTjJoQVEwSjByREl6dzgxb1BNbmh4WmtnYUJ1WkpIQlVEODA0M0x3R3dBVGJvM2xxYUJ3c3UvN2kvSFk2NEF2MVY4bUcybHEzalM0Q081RHlCQ3NBV0tCRUJGakMxa0E5VGdkbk1pU0thMGl3ejc1Ry9pZlBEeVN0Ung0djlUU01OREpBL0N3YVF3VmdudU1RWklJVEVlS1BnQ1RLQXZ6bTFIV2xwVVdDWGpBYXhXK1FKNlBuY0ZqSmdkNmpJSURSeGIzZzR2d00wYlZtQzFINDBxckhuREF5VVFUcUpnb3hiaVRJR1lnYThSRVpoMUdGVXE5QWZFTTJibHhCaktBZFU3Y0VWV1BmK3RQOFlBY2tqVS9TNkRFamVRUFJVRFd1UE0wRGlHaVRFS2tSWXcvbUZoK2tXMElhTU9FSWZsMDRYS3lVajkrM045QXZQcXBYNDJIRkFpNThyNVFlTHVQWjdBc1pxNFFreWZhZ21DRmNMS29TTFM3NDVBNk1qdWhrbm9NdDErajJCWkYzaUdjR2pIckt2TWZMZGlEb0g5MHFUTmV4a1FsUWFnVHRIbXhCNnVxSUlEVTJCdGc4Y0xHOEVuSzRNb0VOVi9RQWxpU0FZYmw1aWhIc3l3Q3F1QUozL3VEKy9UNDRBdUlzSEVIOWJ0V2RDSys4d2ozdUpiSUtDYXpBbHFwYjJzR0xJUWl2YjZtOGlxSTRWc0xqYkJYZmpuQkgrdzRDMmZocWtUMXBnZmFsZG9STWJCUUFDQWhZYWlJYjYxNG1yajR3STRMNUdPZXZDZHo5YlhMYjBDV2dINk9Dblo3UW40azcyY215dkRjQklISVJNUlEvV0JXbUJnLzdtdWJ3VmJ3VFlQRzhpWkJEc2poM1JKd2o5cjE4QytoT1Fyd2UwNFowVU1DTHRXdi9QenZmdlEzc0FsSitpQjMzWkhvam92Y09rWEhIbnJLUDlIUWdwek1ISEpWN2lMWWNNY0JhT2xQNDJTVWw0TWpnQWVCL2NrS1BKQWExL0luMEFCb01jckdUNHhoSWFKTURBSGI5S1FEeW9vRkkyZituVDkrd3lpczRBbHlWVW5uMG5hN09sNWdkNGVYdVFac2l6cGZRdFovS1B0QmsrVmc1QjkwUUhMSUhhODJLWkVMNlBmdXFTdDVKbXVncjZsL3J2UmcvZ3lMMWNoZTZOUHVUVXVtUUQ5S3RPM2VYMFhRNW93enZKbVp2TldJN1gvV085NE1yNWVFODV1cG5oQ1hMa1h0cjdWSDdMVUFqamFWL1p5RW8vN3JBb2tmNm5JNGpJUld6b2N4QmNsVU5tZ0xZalJ3b29SbW42V3JpWStSY3c1a3VPcGc5bytWTUp0K1JnM0lzMHNMRVR3TGgzNmhYb1N3RGxpL3dIS2hBMmlWL3kyZUR5cFgyanFnMWpnOHRxMmdqdHNoRmF5cGs4SlArOFc1dHU5TUJVTzlFbDUyMm1QSUllOUxNQlVZdXh4eEg5ZDhwYlFWZkIwRC95M3Y0US9mZlJuN2FjeWRWK3dQcUk2ejBhWjJyREFNLzRZenJXZm12djZBQmFsdWY3QVgxL0hBV2pDeXRNZFh3ZTMyMHN4dGJId1pDUmx4Ym9ZQ3hLWEl3d0JiOGkzMExPUWR3eWg4eWc2eHdwUGNCdk13N1FjU2hISUs2YitTWHg1U2NPaHBMRVAwNmVIa1BIQzNYWWc1aVFhZzZjTG5vNGd2ajk2TDJnT3FZTjJDTVBZVVp1bG1RU25VZGtPcEhXTTh4V3VVQjdyTis0WERIMWtMN1dwLytxZURkeGNEcFJVcnpvVk5FRDJvL0ZRSDZpMDBRSU1QSHlVTzNCaWU4ZzZSSExOOXE5cmJ2NEd4SnVOck1ib1VOZjBkWWg3UitISEhqaFBKT2p1QnBMQU9jRSt5ZzB3U1Y3NWdmWVRQVTdNQ1F4a1pseDVZMWljRU81aGdhUlJVcExIeTduZE1YK0NDK0drMFBVUFU1NUhTN2h3Tm96ZVNyNjlPTkFTbmJDVVVEUnNVOXhicnlxdHhwSEQrRDl1ZEk5SUltTUtkZ2k4N21VWW9ISVcreXRnZGRmOVh3c2FBLzM1Y3F2UFZpTzREcXgyWUdCUkI4djREcDFXbUl1OFFwcUhYRXk5QUZHWXBvbWdNdFRSN0ExOVhrckRmTk9sR244TUNReWI0UU9abjM1YW1zQ09QOEpxcXZjU3BVZmhkYStNVTlNNWdqWkVsSEREQ0UyWDZjYnprMGkxaW5tMU1VN3pRbThOeG5CZERSeVZpcEllR25UQkUxSDRsTE9vZEQxSFZ0dDRPTTRHbEMvL1Z4MGNTSFNUbXlaY3RST0JqT1V0clg3QVlKbktwN0NFS1dIdXE2bmN0bFM4VDlLdy80Zmx6OGpvUXNQZlp1K3czR1pRTkUzbXlhc2dxYkw2Z3FKUWNPb005a0srdndDNkU3bU54OXFGM1lSZUFaT3RwOFRVMnZUY0wxMXJkcElDamZvYzNlRVdHVHF5L3IzMW0wYXVKSDB4Qk8vbmIyNEY1allVWG1zR2ZOMEc0aWhNSU5XNUFnaHB1NkxPWUpNbzVseHVyM29xK0RtMWoxendmTkdCVWlvejR3dHBpekVGb2ttRXVrRlRTMXBBNzV3UXI4VEdHTVdtcjl2d08wNzBKZXFpTTRuanFjQktETzVDb0YyRHNHenBDMXY4Q1A2Ym5mWWpkd3ArbHltY3JCVU1UeEVxQkVSNGJxZEhpbE90VU9ETlAwSVo5MzhZNjlMSUtMWktiYldKenZZczRmWEJtNVJEdWdtOW16UHdNbjRpYnZEZ3VhZlp2dnFjNGRNUkxRNTBRZ0ljNU8vYWRXa2ZVV3dDbUYyNGJnOWh6VmdKRWVKY3ZWYnFZbGcxTEVySWtmSXFrdHpwdEwvM3p1UXBaaHU1QUNieHBnNXo2MFovbzl5RGxQMjhLTjkwNTZzWStTQndjT3N0WHN1RGNpY2NpWVNHQUtSdG9NelRpVUhXSVlOamlkZXlsTU5BSmFpd1Q2MGUydVAzb25ZZU11THNocWc5OVZoK1hidURtWWlPV1FSSnRoT0V4R3Via2MxU1RHU0RIRUtDaktjaTExUlVLc1lOTXdBR2lTa2I3QTY5K1F3L2NOSGp4MXU1bnBGMDRPWEFpZmJ6L082WWF5c2ZSb3RhM041Y09HTlhxMzdWV29OOTJ0czNCeXJ0dy9mSysyQkE3aE5CeXVHTmdWb0FiSHQ4aHk3Z3NFQzd0Q3dkRWIvL3ZkT1JUa3RWSlJvUm1qWU90SXM0aGxrc0c2US9wNEhaeTdOMGZxaHdobEFTbzd3bldaVURwRTV4ZnJCR0xwbk51dGhZNEVjV09KTnRIUjBQQWRtU1RWbmVyOVBXTXBVRndERUt2Ym5oREFzL1pUMXViUVM2MmVRRG1vVUhxd1hIcTdDTFN2U242aURzR0VvamJteFh3bGNaVlFGVnFJNkVDQ3hJRE9UV0hrRkRObEMxY3hRQXQrOEl6amhkQlJYZ1RUWTBtRzduRjRKK25FR29PRzlQMjg4UUdxdlg1VWVBWEV2eVZmUWdjMnpFUnNqaCswS0QyNVBsK1lQTEFGR1NKOXVHT3d3NitCck1ZMHB2V1FLNENvazdRTjdCQXpPb0VEZnVZbXp2Q1lMdUhsZWRQREtoREJNTk9NSWN0RC9zRUMwMlpNdVE1RG1TSUFCWHhyTXhqWnE3cld3dERENHpZUU40YlhSQkNLZkNZQ1dkL0o0OGo2OForUldMRk1lamlET3VRWHlXa0FGTXp0VHhRQTBPWGtRZlpzQm9BSEFoWUlyOUJrVHZyWDl4QkVNZmZoczZWM3IweE4ybXdFWWZWZW5Sam1GMytXamIva00zRnUxTVFaWXk3M2xHUXZQcFdGNVZBcFFIVVRBSFJQMWNicFJIQ0hiMVk4SUdHNzB3TVJ6Z1RFVklqTlNSWG9mazB1cCswMGlyd2tWT1dwL0tqS3NINGhTNkg5ZE9KL2NBMm1Ed1R3YXhnSHVmdFpMd1RxSW9rRjJvL0FqTUR4Y0JNbEtCRU00cWIvaU14Wno5ZERwRWVKZXFXbkJGTjR6UDVLcFlMUTdGMHZBaWtibkcwc0F2Y1BTdFJiOHhFNGRQYXMwZnVPbkhzSEpIcldoZVB1ZFJqMVNxUDBPQXd4NndRQ2V5WU5SQVhORVQ5cFE2Q1BnRVdvV256STVxZG00UXoxR2hneHdQTFdtRzJHaktRR1VlZjNlZXpJQU12WW8yRExTKzJCdmtZYmNMaEc0SFZ0QWlvUXdaOHVRUXpVUTU0K1FhUWYvd0xmd0dOSmNKYVVseC9KRmdRc2RsN21tNXhudVRKVWNuUWRzT3FqWUhqb0RhRmFKeURBSG9ybW1CYlZCVkNoYzY5SGNPSlZLWU9GMmdvYk52a0VvZ2Y2SXNwMEpTRmEra0ovQ1JCRDFWUkE3OGhTUUpEOWpBTGp6ZEh5YVB2RXppWlJHK0xSR3VwdXJuSWxpdG9qa2xzQzVCVU5lWjFVZUFPamYyQWI2Q2dsQzZtREhDbUZDbnNtbGxESVVIRXpibVg0NzVrRnlyRFoxUCtnR2d3NTBYWEM0SjRSQi84N1ZRSHdHaHRPU3JWQVRaeEtVSFk2QUFaaDR6Ykh0ajRrQmd4K0JPNjZWekFXTjk2U1hFb0dQUGowbEdsd25jNmRiUzNOa3pSbnFIb29xR0JrQWVnUzJnU3AzbkFHNERSeVp5OXUzZ1M1a0R0a1loNXB4VXgzTEowbzhKS2dsOGpBRDNHOHpBTlFrS0lGTnMvWVBMbU1Qa1htc2I2RTZ4aSttVUI0YUNCZ0xZMWkyVWo5QW1vTUJ5dW5XSnhpQ2lUOHhxNWhHek9Ga3NRY3dYaFp5ZXBhdFl6QUZCaHFxdzFrRzNkUTBKb1RKMWtzY1F0SHcvWFR0NllHQko4amtHQlBYVlAxUUQya0VTZWpvVTdleTNUc1g2S0dHNFNMeXpmVTVqdkluWkhDazJxanhIRSt2YlRDTEI5RjlBcHBpU3JNemdEelhXMFpPNWcyWVlET2ltUjR3aVIyQmNwTUJxTzZmQjVBNlpPQ01rQmtCUUxNUXJTTHdNRmljZXpvTm9LM0FxWmNvSE1aWjc1TUJjcnBsWHNzZnFnUkVZcjMxT3NFay8wQUZDTEIyNnBYZnNTeklCRURXTHd1T1c1ZGdxR2o5WklCKzlqTEVGRnFZSEZDRUNnMDNOWUlwZjNBelFZWGtjTkJvcjZZUE5aTzdkeGpwaUQvSWwwMEdzTmk4WXZqTG03ZlJUQUZRT2VTSGwvQ3FBUnUzOEp0V1hoeWV5R3RCUkNmY1RRWWdiOHRYcVd6akVsYUFBTEFRTndFQ0dIdHUxNTYyaUc2ZVZlbWZ6RFlEQnBpVjB5MHoyMW9PVzQvRmF5clZRUTRsV1B0ekVUTEZGY05lMzJhVkwxS1E2bVNBSmxveWdKdys5MllNb0s2OVNQdGc2YWwveWdBZTNMelFESENyTTNVckdpY3NOZ1NTUEpYZ2dnRStzWC82UFFiWVo1YUtqQkkrbHZpNkVab2I4Wll0TU1TbWhtd1J2ZkZ6QmdoMWY2RnJPcFhZQW9IVWhRa2dNQ2R1M0pnakZWVkdSSmJZT2owTnRLUVMrSVFFV0dCTFREZkxlODI4WEhHSXFnTVlJTUhhL1FUcWFpOEpnVFVEQW9ERGxCZ05Ob3NaaWV3TzBVdHJTUnhnMHQ3OVR4a2dQMDdJRHQwcW84WXJvakhldlZ3Q0ZtVFgzMklBSDVFS0sxd3h3R1RMQnQyMHpRRGpxMml4WklERjRwSUJNbFhuMmtLQTY3d3l1aW1Semh3TjVuWTlJRFMwN3dJbU1ZNHB1WVFCVkpiRDdLVnptZnFCSGVJMHJ3OGxheVJZT3lLS1Q5OXVRMlZPVWdvQUxEbkpBQllUUWlOeDBybkxOaVFPSkE2UWlqOWxBQnlNWEhHaWVYT01RYlNBT0IvbXhkY25BekJBKy9jWWdDUENMQldFczVRdmw4Z0xOWno4SVFQMHBGMHlBSGhiZDd5cmN3ajZ2SytPc29qVEJQUUZ3eUFYbFVkZ3doL0VZVWhhM21FdU95VEc5QU4zRmR3OEJCVXd3ZHI5ek5uRlRHNU9lR3FwZUZxSjBtSVRXVk5PZE8rRndHOHp3UGZQR1NBa0s4aEx2UXREV2FjV0tiNitvQTMwbE5Idk1NQytrS09aTWFvU1QyeDBIMXhkQWdZM0FNTTBxMTlsQU4xWWRteEVXd3pRNmNFK21Bd0FUaUs4TmpsRzFzbmFGR0RRc0s4Q29xdi9sNjZDSDdjUFFXekVwcUpKYllqZXNpRXBiNEtZRG9wa2dDRWFkbERqU2dLazcraFBHWUNZSks2Q0x3VE11U3NsTldaK2ZZczJQZE1ZZm9NQlRuWEdvSUNtNU12VnlJdExCdkFUOGR2Zks1ZUFwcmxjQXFBRHJsYW0xTlVNb0MrOG02dTlKY1ZLc2MrWURNc3hqSmRQa2YwbE9rQmlMaEowajdUbk53OVJCU1NLOUp4QVhRYm5oWVdDQS90VXAreGJXVFByY3FVRGhPL29qeG5nRXE2ZGVLQ1NhR1ZtaWFRTmxNZEI1OWNNVUFGVXlnLzNsenUwa1JkdEJ1QmF4VDA3WUpsODBkdmJ3UGMzQXZTUjY1TkRrcnNBUzNXYVgxOXVZcXN4TEdkdDVBcjI3Ung2dzFXQU9PbmJoeURwWFpyd3lXNTR4Vk00UnJZSm5kUUp1OVpzOWxidFhRREg2WThaNEhiNmphV3RWcEdPenZmRkJRTndzL29iREZDTUNJYmNWY29MTzhCTkJvRDVrUkRSSi9qU2ZLMGlBMXlWQUlaWnhOMDVKQ25WNEFRSzFHYkZBSVJxdWg1VkFVRUpERG1XcVVLVHBlRkd2WFVJZ3Y0dDlJbnloaFFCOUJHcFVLSTV4aG5nODhEV3J4amdnMjN4ZjhBQW1ZaW1Ta2k1TEdoakVNN2ZZSUFVZkNxVDgxNzVjdDQ2MTVjQTVKdnhmZklRT3ppcVY3Y1pJRkRMNVJJUWxzQTVOb2FkekdMN25vc01MZ3dsMERkMXBjaSsyK3ZpVEQ3aHY1ekxYemNQY1hmZ2llRmQybm9wSFUrV2FnWlJvbWxDQXZTOTFSS2dZZnRmTVVDZGZpTU1xWm5xVUZwK2ZVRWJ5eXN6K0NVRCtJaDhNa3RGZkhpK1hJVzh1R1FBS3FRMFdNaTYzdWg3L2R3WlpETERFb3p1eUFBSjJ1d3JibGNUd2JzdklIUUEwYmJvdWFhdkZsU29QVUxJRHhDcEJFaFJodXJjUGxTcVZUS21aQTVveVJRY21WSmxhSUNUWEFJR2JMdGFCMkNqZSsxdktvSFRtQ3Rvd2NrRmJicll1SzUvelFBY0VZZFpmc1M5OHBJQ2ViRTV0Um1BZmtQYnBjbU1uc3YvY3BCdTZnQ1pzNlBielYzQTJIR1lBZ1dHTnpCUW10T3cwTzZZMWk5QnpSY2VJYzhQZ05PVWFHaytPZDQrVklDMXJYM2tIb0VpQUlzYjVob21RakFBNURBYVlyWUtPc002WU9tbU5xZS91QTEweTAwc001LzgrcEkyeURIVVhETEFzUFlGY0VSeXFmOXdsYkxVdk5nUVlOcG1BSWZlS1lUM3NGQ1U2QndZd1o5TEFFN0RsU0twQzN2ZkZqUWdSamhRbWh4OTdhSGhLRUhORng2aHUySXVheXY0WlgvelVLcUEyZUlwckl5U1g0M0l2SklCdWx0cit0RWxuYlU5STBUeUp4TGd6dzFCRVFyVHNJWGNMbWhqUzliY0dTQTFkUUZaRldsZzIxa3FVcVVzZU1hYkFYYmJES0JHUzVyMnlVSnpZaGQvcFFNczFNbXhXSEN6NXc2ZmhVY0VCVXJUelBIa01MbXFBalZIRmhHSzdMdVl5eHlkek01OXVuMG9XY05idlVlNCtHbzgrUmVHSUtXK1JUWUx5OXhrZ0Q4M0JTY2JzL1U5STFYeGxxYTFIdWlMZ3FaT1Y3c3ZyM2hPN2ljN2FEa3JNZ0dRTitQOWk2R0lXRDZyNnFKcHNCcHplUDlxRjNENEFCaWNrZzBqaDNJbmpoRlcrcmNxVnZTSkhZK0lYU2RxS0Z0M0YzTTVkamF6MjRkS3RRcXRNZ1g4a2dIWVdxWmdhMTA2VWY2UUFiRFZ1K29NQ2pibWd5T3A2RnVWcGgyNVl6NC95UUJVbFJZSXRzbFVaV1dXaW9tMDhPdm0zbXNkRFVTOVpJREVUNDVHcU9LamRRUHdrYit5QTh3YmpYTll1NzhNQTZTQkpvNFI5dktscDJVQkVrL3MrRGREUE1MZ0NGTGVlUTd6T1Z1eHM3bDlpQU1FNVlCVm4xS3YvQ1VEb0xuTnAxQUNkL0tmTkh2RUh6TEFhWFBMSFp4RVEzQWFONmhZc01xM3RCQkdaNENzdkdITEs4UFNNQ0owcDZHY0d6ODgzK2ZqNEsyNXdRQmZBZUZWbk1Kd0pJOWh5b1diVWNFSWhwSWdkT2pJWi9yTDhJNUsrbTVnaEluU1BRYUhzVFNxbDRpamQ0ZVIvS1pzM1huVmpsN001VWlJZmZzUWQ1TUhydWZRaXpMUzZCY01FQTBIcTIxZ1poTDRVd2JZTDI4RmhLUmxmRFRSaXNwRkRFNlpFczlNRjU1dmpRaDVMcTllZTRlQ2oxRXp6RkpSaHFnMS9XdzFBeFJGV2xoWDhBWDFxMUdtYm9BWWo5dTRBTXUxQlZqSXlHZ0haWisxTWFoMEVnRnJjSmZrTUVDSnZDNjAyZkNKQUxBYXlIZU1idWtQTHVieTlQWWhxbFhRZ0I4ZVVzUmlEZmdGQTNqalFRYUVaS3NaNE9PQ0FSWWxBMlRXMitzaFliSFhheHFYMVB5Vm1UWFhTSFp2NjZ3ME1FQ0VWT1R5eXIwZWc5SW9KakpFemZQTVpyUFl2UWc4REFGSi9LUmhGUjgwOVlJbHd2b0pNZ2cxMEFrVkM5cHRGQllFREZ5QktkYTJkeEE4a2RIQUxTUE5BcUs4aUFFaXY5d1YxSk5HdXRLZ2RQTVFyQzRlSkdJUlVsRk1yR0NBcHJsZ2dDcjRLeGhnWGpabVorUUJqL292a29Ta3lDMnkzbVp1Q3F3amtiZ2kxendRcmY3MTRnV0d0bGxzQ090R0p2bmc4Z3E4QkpOUWVNRVZpQW4raWt6VDJWaFppYVFrYW90ZU5rWFZMY2NLaVFVZUVFTDZKOWhBQmFvUVZ4MXd5NW5pTjBsNWJVREFiZ3dKdTA4T1U3N0E0U1h3UHNRMm8wa1hNb1NNQnBUZmIrbWJRTGptenc1dFIxRStERXNGZjRGVWw1ckdrZTVqZEdWelFxN3FYdWdBR3ord3FsUHo1WUR6QncrbmJvWFJqc1FWUm9DUW01bnVneUtkTmRoZkh2TnZLenBicHVBZ0JwUkpLTHpnaW9pSi9LVS9RTEZzVmlzdVNmbDZ6MEFMNGlkUFFNWGNPeDc0TmpvWVVOa3A0ZDhFbzAremJZRGkwNXZaS2FBc09PeWRnR2hIQ0g5OUVkdE1JTFF5QUdNNExXTWxkTHNJNHJ4OXlDTzh3ZVFaQ1o3Sm9uTFVuMEFlMjM4OFNleHQvbWNIQVhxTFJ0S29keVVPYk8ydW1TU0VBeDQvY05oMUswcEtGdCtsU2t6OEtnVENmZjdDMmlvTkFJWDRHd0V4VFBKUnBPRFlLTDJZaEVJNnlDUVAvZ3MvNnZZUytYODhRd0p4RldBQlRFYWRuSjRSQUhJYlRlZHI1Z2NBa2FYSEVrQXMwYWJFaENNWEJyS1BISUZ6enVjZTQvVzRFa1NhSWc0SFM2Wkw3ZUNjWitOcTFqM2VQalI5SkNZWVVTOWcvdmpsRU5wUzA5RG1RT0pzVzA4eFhuY3piYU1mZ0hnTXhIWU1mL1ZEeDVXNmxhMXZURndoL1V4azRjQlhyb0Q4cFFOSktWb09xZ3p6eWNpUktUZzQvQ2xYZ1hWN2oxK1F1WFdiY2lieUFPTGFDSzJ6ZUV1OUhFMnVSd29oWkJieEhzc1FrbS9GQmQ2UjE4R3NLdG1adHc3TWI3Qm9BcmRWUGhsaUd2TEhkT1ZoenJNamFnZjdQS3RuM2Z2dFE4NXNXSXpBZW0vOFpTdE5qcnF0Vm1pWGM0UXB4aW1TMkNpYjluRkFLT2xKQ3FZeFlMS0FlbzZRcVNIV01qY0ZaeEhHSDJ5UnVUaVVhdjRMZFMzdGgwTVhwVG50cEFNVGxNdXJ6OGVsWjV3NEZjdXNaUWZDQ3Z6dTlIckhXcXhUVGo0N1NBZ0JZQkxBbHF5U2g1bmh3SHVRMThCSmpWa0JkRFlDTllVMHVWeXBkdWU1bGR6RXZpUndXOWZJWVJZSklxUTJWOXI5WFNia3NZVW5mNDF2SHlKWGs4bmpsNmZ6S0VkZHBvNG5VYm1ZSTlCTVpqak9sdHJKTnc2UU9wbWtnQXFOai93N3RSdEVzREUzUlRscHdBRkJBMERjQVY3bW9wbTVLcEM1STFuMHhUcE9NeXl2UEVBcGpvd1RKbUk5YlJHVHZTRkZDUDBBTDJCTVJxUUhDVS8ycGtUa0ltTkRybUtHaWVaOHhSc1VwSFpmNjVjajFFTmhSZUlLVDVUb1RyWU44OTRPa0JJN2lnUVJVcHU2OXY2T1dFNG1RYWxtWFhGb1ZrM0lJbUdJN2k2Z2NQQmtiam0vYzV6SGRhS1FIUFFwOGgzbG1YV2VFQjY0VEZJZ0xaWmlMbmVHV2FadWRURnBrZ1lZVmFRdjRLS1oyUzNnNGtwRjdna2QzMGM3ZWVZSG5ndzlmengrTXluVk05T3hQYmdTcDNvanUwQkNZbEpJUWs5NkpqZDJnMjNxc2FBL014eXdFSFdTMnYwejhtemZVUG1XMVZMWDBIWWViblptdm9ZdE9DcGo0cG5tOS9MTUEzZVJrSWRaZW56V2JleDNKT2twWjZvbUg0cDhJWkZXeW5PcGpQR1ZIT2FVSEVhUG1TY0k4UWtoWi9xcDB6cFBpQitZVlVrSzVFQXE0OHgyWWd1cmFkY1hrK2FZTk5oNkZXcHRlOHZjV3VpWnk5aks2Zmp6N1V5NTVJRkF6My9oYXU0Q21YQkMxU3U1WCtSdUJBbUpTZ01KTGJIRmtkT0QrUTF5Sjd0M1RMejJkQUU1SXFrZGFNaE1PNjFLSFZ6YVNzdForb1FYaWcyQUZjd3pnY1B6RFVpbHhRTmtscDZ3RGtTQ0g4K05Sa2s2WTlvZTV2aXlGVWtIblFBaURpVTVRSWVaNXBuY2hURWpSK29nT2grMDhSNTFuaEJ0NVMwWVc1TGJjVGtWaEtKcXJXa3RMaVpOUVFOR0EzL1RJQUlEeGpsM21vWWlOMUFQcDZ1djFVOWJIQWowUFBsc3BKa29tSENDTTNyWHE3TGNKMmlVaVMyRVZzeWhRSlQ0WWs0R2lGVENocW5GazV6VUVOaXV5RlFNNENScU13REx4NGp2b0lrcVAwd1pPejhRenExaTUwNmtFVlgwVE9oejRvUm1ka1JTdzZSV3lzeVo1UXZKS2JJQzNwTXk0SWUwYnpmUUJ0N0RmRGJuMEVHWWNlaUgzNlBNRXdKQ0VieU9XL2cxWVpERFp4V2JhNmdBclVtajMwSWFZS0NaQUlXdkp2MXBhMXE2cFpjNGU2WVgyZERFMlBRVFBjL29kMVJTWXNJSnptaFlqN1BPeFRKSzZ4a05vUGZZOUdKK0E1NHBpZzVZQWxJN1VOcFZ4Wk5JclZVd1FKTG9nZ0dla1BsRUhHTmdVWmkzSExtSlBBeUFMWHhwaHBEU1F6QXhIR2ttTVJwdVNZM3lMT0pyNlYvd0tkS2JHMjZOZVFUc0NCSkNCT0tMNys0NnlNYVNBRG9NRlVCazVBbmgyeFczU0MvQi9ocWhzUDZmVk9GOHJDYk5Fa21wQU54RmVBQkZPQmVBTGdObktBRjAwSkRWZ3RQVmt6OHhnVVdCbmo5dDNNbDhjS3QvNW4yQWs1L1I4TkM2UnBIWXdrUXMxV3ZtTitoMHNSL0dDdElGSEg3ZFoxNk45NUlCTXJWV01vQ1RTRHJiU3dBRTFHcFhlUVFOdVVrenRWSDFUbWFPdzd3Y3JUVkdNb1pSeDRCYWtNaG16QXY3bnBJNTBrakl3SkYyd0lQeEVLaTZMT1VjZ2lRcmxsYVZRMFVpNW1Qa0NhRjhpdWdpakdEZVl1bEJWZHJGeXZ6SVFBWXRYcGVvS2lKMGlxV2FzQmxieEpjbnBUOXZjdWl2bVNjNVNjM3BhbWw1eVJaQ0txRG5UWkE1NlBkdzBFQk55Qm9QMFlNSG1RV2pBUTkvZ2x4SFlndmJwTWNHRzNrc1Zsd2VzVUZYb0xRV01vTVJYUWF5SEs1TXJaVU1jQWFKME5tV0FKQ25nM2tWRTJBU3dGa1dhK2ZkZndxWVY5TVFXMGIvczlycmV6N0dTZ3RDRjR5Wkh4TWl3SEZyR3FWU0lBUk9TSktsQXRDNjI2VThZWTZ4UFIreklGbWVFSytqd0N6S2xLSGtMVS9IQXBvNG9hQXl5cXhrUnR1Q0FRemRMUEVCNnFydk1RV09wZHZHd2dDdklWa2NWakxqWk5hUlFJTENTRVd4YzErdDVYbHlRem1Wd1BBNm53SEhZWWcyWldiSEhDTVVzWkZEUWVlaXUzZkJaMllMNS84b0ErVndGYW0xZ2dGNlNnenhWV0ZnYWdhd1pBb0FsQjRpS3FpT25UWnNZQW56WWtuSWFVU2dmSHhnUG9ZNnpVd1NFRkJjQkdEMzlRSURJRFh6Q0pndDBvOVFCcFVNVUJsc0dlVE1QQ0h1UTZKbWtOVUw5SmtxY2poVis2cmQ0aFpNMU1pYzFza0F0aHZxZVlrRzFnZkRiWldDdWhaMXFOdWY2SFVkMGQ4bmlrN0VSV21YN3FjWjdXM3AxeG1FMm1IVnpFVGVUanA4dFlSN1FieTZpT1ZLak9oSS9TUEQwTXhKUHNTTHRRTGNSN3RJclJVTTBLaHpGY01sdkZJeFFOU3RVVUFwVmlUWURLNHlBS2QyRmtYaUw3bDQzaERiV1NEaklUWXhSem56WXEvU1c1VjVCQ3pqc0VKdW9ScGduYXNZQUI2eXJXWE1Kd05nbUFlUmo0VTdRTnhjSXlkTmZydGFQbG9oUVVqWFVaalk3WTJnTFdacEt5NzBWcVFsNGlNektFdmFpcm85ZDJHbTJJY2FuMFVlc0poYXIyblR3TjU3bXJwcGdVWUN3NkE3NFY2UStFM1RMaUlNUXJZamtZV1Fsd2lIYzgrRFhFSUM5QmVOQmpuVFExY3hRRmF1RWowZ2NqaGNZNEFDNXJYZ1dSN3ZOUitnRUxDajNFS25IN0NXUkpUYVFlOXFCelBVaWxzb2J1czR5anRkZmg4cWhLQjFtelo2SW05MUxFdU1aV1JTSUY0VjIwUkNaYjJNOVJxTUFXR0V0WUlMMTd4WEZRdEZBU2Q1V282RGw3VW9rOG1NYVR1RFl0OFBOZDczWnVoRlpFaUtVaFNYZ3VXbGp1bVZSY2Z6VjJidjlmck12ODBBWjBXdzh2R09zVUdhcVo3SHd0Y000QXNTQ241SHRNWTFCa2lZRnptcEtJM2ZYVlZsQVpGT2NpS2RpS0hnOXVERVpkWURNYzVNR0xXa0dwS2ovRlR1YTNwemRETzltRmNhMFh0azRmWldkQ052VVZiTUVacDRyUk5xNFgyVDljNEFtWkFIZ2FMTWxSQVpGeVIyS05LMFJkVzRCUXN4b1RlVWUvUlNoSkFCRnNBSFhES0EyWjNBcm4rTkFaVCt2ZzFONjBDbnkxajROZ1BrZ3JRTmRORDJLZ01VTUM4Q1A4QUFoaWlyR01EVHlXRnJNUmo0OW1ESlpkYUdjNEZkWEJRMk9yTmJkZTA2UzBBZjNRMjF1SEdSQkNNS3QwOTl5V0V2Q1JYNklzcjdIYmdDTW1EWEZpN053ZGdxNUF0cDJ6U3RqQXZ6OVR5aVJ5UGp6UnF4dWl3K3BXTUQ1UjY5bjRVb0hjUVNFQXhnaFpRMXZ0REJyMytMQVFyNmwzYUFMdTU2Z3dFb0JsOG43TDdCQUFuellyeFhNSUFzMDVsT1ltYVlQNkpVclNJVmpFbWJXR2FiTlNyTHNyYjBlNmdoSE9VeVQ4Z242clkxaDhnZTRXZ1o2YzNpejRTWUxaQWFRM3NSeTR0ZVZGMVVRSXpIcUlRV0RySFlrQUV3cW9RdWJzTUFGZXYxWUtjSTlxcG9McXBLaXJBSTY1dXZqbWZEajJYUWFDaUJLWmFKb1piUkpQajFyekdBRGcwTmtaVWw4RGNZZ04wM0dhQ3RBbTRLQnFEMExITWhvcEQ4d21yU1FmWVNlcXNxdy9rOEVJSXdkcHdRT09rVzlYZnQ0TEZZdm5veTlzd2ZrK0ZuMEZseXhZb2dYSGkwR012THVZWWJqcmpPT2JSU1BobGk4UnlXaGh4VlhieFlxd2JuSXJ5NjA4bng4RnhaUFoyKzBrc0c4TkF6OUxvOG5JcHU2aFBMZk8xRjFyYlJTQzdYcU9DL3lBQUtxV1BXNU5NZk1vQTg3R2NNa0VrZ1BPWTdHWURCdnNTSmVPRlZSYW11NXd0S3pnS203TkMxbEpLUWtkcTlpMVJGOFdaQ0N4OW1pekd6UzZVTjNIbVJPRGJ0emJVdThibXJxSE9kd2g2amVwMEJ0Smw1WlFJbkFGUjdIdzk2R0JnSUdneUEwTE1WZTUwQjFJeFE1ckI2WC9vb291aDVyMkZSeTcvRUFKOGZCNWtxRkxtL3lRQ09sWjM4UWdlSUpCQUI3a29Hc0Zzd01XRlVHZGZKdXhwRS9qbkh1K3NITStzZEtQMlNHMzVkSWloU1M5YTh3cGs5dEV5Z1FyWkE0MnFrSHhvUWpLUkpLZXdMQm5pN3VnVEVoc0hDL21uTUQ5MVN5ekc2RWhFWnQ3U1R5S0VMMk1MVXdWSTZMRllWbEhiTHY4UUFoOFlXMGUzdkxnRVowTm50d283SzBiOWtnRWdDRWZET05nTkVuYmpNYkREc2h1eHRveXQ2Ri9rdVJDbTZEdDB2MDZXUnQ5alk2MEtFclFva2p6d0RIeGZqVnpBQVZUaGtTNm1WUUdLdEZ0SlNBaURob2lFLy9RWlFrQUVSUWU5MUJoakRPSkVGTnNNWjlKY1lRS2hnU1pmTStmVWJEQkR5U05VY0djUGJkb0FFRE5QZ2M2cVhnTVdjSEFBWjU1amJCRlM4MUF5UVExOXVpNjR6UUlIc2NOWFFXemxRMlZzeFFEL2F6eGdnMXFlVjZuRGNCcm9XWVFXRWkvTCt4TzJMRUE4ZGdPaVl3eHk5TnhuQXZSa3FWdzRvQW9DWWdwc013SFZPN0NTOVN4RW1mSGd4WE5CNmFkRDlOUU9RbTduUlNRdllGUVlnekN2eHdxZEtDZFJybVkrN1drK0p2LzlmTWNBMkdjQjdlOTRHNVV5SjNtQUF3RnVqZFc0dUFlOVpaeHZWdEp0YVg5QjBSWU5rQUw2UUFrS1RBWnhZNkwzTkFPN1BsRWxqQ2NtRi9nNU10WHp6bzVwVTlpUVJHVG1PaEJycUp1Uml1TENob3QvcU54aGdYSmc2MGdaK2xRR1k4aUFTUVpZTU1BSjBVVDYrblhxbWhERkN5cHJTWTJMSEZQdlNORHJNQkRhWE9nQ3Q0MXh2VnZ3UFQrUVdscjBzRkJxa1hvMmtkWFlyUUdsS1lWLzRBdHlWQnpzT2w5SDhFcWl0eVFBY1FHd2puQUZpeUVhd0pOMWtBT0lTdEZ5NWVITnhGak5qVVFKQkVqdXAwcE00WHhDUDZOc1lzdXBWVXpEVmdKOHhnS2ZlY1F4NkJaUEtzcnpKQUV4NWtOak9aQUI0b0FCZXhiRWJFcURZQlF3ZFNrK0FMYnZCL0plN2dDRnhsZ2xDd1FjcVRXZ0tESmkrYmhsUSs0VGJOVzRaTzByL2VROGcwNFNIbTdBbi9kSnErQ25hR1N2a3Z2Tytja1BWWnJHOUxQQzl1elFrNUpzaG1UbnM3bGVoaThRbHNJUzlzOGxwSEtab1VKVU00TnZiZ3lvVm9WZmdWTExxNGxKZ2puWlFBOUpIaUxXUHVNTmdBTGMvYkdwM0IwdE4xV1Y1alFFNGNJbnVyaGhBb1lza2FiSDlndlNtMUU4L3FBclV6SDd2Q1RWbDlhbmNFV2tIZ1BqRGM4TU9JT1JERmd5WUFvM1VXS3VKK0o1SFhuME9xbERLZllkSzZSVDJZUW5jdk5OdmdEek9WazE3Yk9vc00yZ3NEcFJDQ0tMU1hwZ1NvUnFtVjBYMEJlMDllRUx1U3diNCtpNUwySU9ra1ZYUVRDY0xuNnUwblpwN3dRZ1o5dWs1T3RmdXN5ZXA1YWxXOHlaTitqdXNmWVk3aEl0SXJ3OEw1TExHU1RFU3BsMldWM01GMTM2ZzViNWtBSTBwaDNqSEVPY3VRQ1ZueURQRFNES0pWWnI4MUxWQ0hjSWNrbXVNcDB1QWhSb1Q0R3NNeUY1aXV4SHA0ZFk5RzMxUWlxemxEMXo0aGlzVFpuQUd5ZFJLa0NuUysxUGlLLzBOM1U0TDgwSk9KWVBYemdRTjRrcDJrKzlpYjhNSmxnSTNHWUNkSm1rd3d2UlEwSm5oM2tEem50REJHSGhnRTlvN2RIclVUcEJhamI2ZEFYc1JaVUFZS1hHSHNFVVdQb2dsQ3lJOUU1WEdncEoxV1Y0a2k2YmdpY3lCSlFPb1kyNlZJRjhNRzZhNkNKWjVadUR3b0NjWUNLdE1OV0pEczI0aTdGTi9rY3Rsa2gwODJxRFVXUkMvZ0xMRjZMWFIxMTdUUlFENERoOS9SdCtGc09lMElnTmdKaVNRR0NXcGVGK1FaZDRMREd2cFRvd1l3ckVGbjFodlN0aE5JWEJaZ01kRDgrRzRaS2tDbXMvcHpzeVFxeUtpbUlTa2o5b0x2enU0TkVpOUJhblpxN0daaEpFNkdPaCtDclF3bzk4M0FKVWd6RjZiWVNRUU1abGxlV2RXTDhEbWFlWU9MUmxnM3N3aFR2dURjcXB6UGtLajlrcmVHRGk2Q0tRMzRuOUg3STRFTm80UlhuUDBHVyswckJ5MGF3Yi9SS0F0SEkzcStkMVNBYk1KTkovN2hvdjVMSElHWmNrOTBDQ0J4RlpOUGIzTXUxVmdXTXVBZ293aU5vODBlMFBDTG11QmUySmVUUzloejFxV3JLem9xUm95NkZJNXdEQUZFeElTck9wNDFNbXpnMHRCYXZ3QWRKaTlHNi9CZk8rNFE3VVBFUzJNS0N1ck96MG1vaFQxZms4T2RJcEt2MkNBOUFQWnFsQXdnQlllbzNNdTROQW8zRVczMzVuZzlVaGcwZXVadnBFSWdFazNYUHdtbVFJanpORm4yZnBUcmJNNE1HTGpvdy9oUjR2VXllUDhBRlZjald6RGRab1ZNNmpJMTM5c29ZcUJrTFE0RTV6YlRRd3J2ZDFvaVNQZ1docWRqQjVwQ1Z6R3dOWWw3SzNtZGFScVFQT3c2Nnp4cmkyd042eUpIc2k1SVBVTG9NUHMxZXZScG83SkFqcWNGQjRUSmp6MUk0aTloVUNROW5oZjRkVHVvR1JreVlkZ2dLWnBzSFJ4OXNaVXovbDR0a2lNQ0tVeXFMeG5xbUdSMk8wUTNhNkdFQ01zalpPQ0VlQXRiRGVoVWEzZTRmTVRBVk9jUUNDSzNCaTkrM0lHWmI3K1l3dFZITFZLOVE1S2xnSXF1OGt5K1pTbER2angzcFN3SVhBekNMcFZ3aDZJMVdOQjY2U2Y5QWEwTWVxRkg0bEgxUmJJdVpyVTdCVnNHb3ZGNHpZSllMVnlyNEh4aURMNGV6Qzl3ZFpRYWhnbE9Fd0hZRDFSVndGOUpVTUE0amxuTHozL2lCYm1mUFRRY25ENW0wb3FqS2VWY2o1NkRYSU84N1Boa3dzNDFvUm5XN1hnV21kaFZoUHRmUS9FOXpQUlZnN2lJK0RvMWF2YVhwbEJZNGkwTnBBWU83YUFkcjhGV1JoV2pOOHVTeFdadHJub1ZjaGdDbHlEUVFBNmt5WHN2Zllpa1pNVlZRMU50M0g0L3FOZkVIaFVucStDMmttOVNkeXBRbXFSWFlEalFBZzdJS3FCOGNBdzZqOFFwWkNESnJLOGVqSkx3T2tTa0lsTmRYQ0lrRUxqN09YcEorSUZZajRxOGFLMi94dkg4NTQ0RXVrRzFMRHNkdFM2dExKN2hoWTZDM28zS0pwdWVHbjJ2aWhvRjUwNlRnNDUxRHNZdVBwME1ZUFFEN0lVUUdMZ2tJSXNMTzJ2Z2hOVjlvblh6OVZTRDR6TFh2ekdJZjdFUFZuUUh3OG1Xb3Rpb1VRUmc5QTRQU1REMjV1TERGVFhQV1Z5RjBMY2xkUUY3alE0M3BjWFQyTEJ1VVRFbThwUnp6R0R1QzBxTGJxREEycUtSWVB1aUZBbDBrTmI0djJGalh6Mllwb1NNUlR6TVVtdFlHRG4yckhLcUtPTnNuWnJQemxmbVlXamhHNFFtb2pmUW1lSlljZUI2R1Vmenc1TTQ0WklVdWtKWXBwOFBDbjk4OVhrZWdEc2owb3VvTG0xOFNpUEI2WjE0eHlHZnZZYTgra1JITExKcUorVnFJVGsxU1VIWVpQclBhYnA1bVI0RXdJY241NFV3MDhrakZaeHBzNkE2dS9raThTZGdsU0VEbFBCTExMRTZkbk16cUliUnYwWDI2bHdWdXJXUnZGQzJLWmF4UkRIcUFPUWpwWjQvM3BTKzFSL3FiOFIyTUFsaHBHTnA4ZVNoaU5nWm1NQS9oYlNqakdjZVpGbXdRZ285M3ZrYTVCZUVMUk8yUkFvNzcydUlJRm1mSUJRc0g1ZkZ4NzRHZU9seU5JWnBpQm1tNHN1TkplaGluck5oZDhablloaWVYMVZGRnJMRCtpY2laeHlkbnc3UlNkS3ZGd0p2d21TMU5CUnJlOU5KQXlyT0dQWElKMFdNNjJrTG5Hbkl3U3NvLzZIYlRFWkhPdXhtTFE5TlQzZFFDTWMzRlBqbjZzaXRwYXg2ZzVMeS8yOWZramtQdUFrZmVmTUlhbEVmbU8yY2dKVHlqSFZCWWJ4NmJXQXkrZVNiQU5jSkM2Sms4QnNYTFloWlVvbzk4dHJadHpsZ2xjbmJZRStjS1JZZ2Y3bWNNWTNSN1JTTTZSMjhwSUtsNjREb2J5MGlQUHRpZllNTE9kTDNiZlNHYTlmd09hSWhBVGxZbm5NOWJHZ0tGZFQ0b3N0WlN1QSs2SldPeEptbjBIb0RMc0VUZEZMM0dudWV4bkZ2RzdVMUVMalU5YWxVeTk1R091aU5vSmFNZ2YwcTVNQk5xNXhLR0V6MzRtMFdMbXlsN1BWcDJZNXlCeEdiWVRMb3hlaWJPczFsSXpnV0hRSUFhYUc3bXBKQ2VYR2FjeTRlK1FNeTdSTjBBaEQyVWl5a0M0MkFkMUYxOFhneXpMM1pzaG15NXViMjVkeW93TG9iMjcrSVZ1SlB5U0VXUXlMUERRYVltUEs0dUZRa0ZORFJuQjhVbFJiWUJCT003cWtaWW9DZGRReDAzRUdvVXViTzZZVFc2Y0wzR2taeGR4bkxLYmFHTUsyR3hDblRLV0x3c3BXeVA2VkRNQ2NKREpwN2pQL0VSVmlUdW9IOXVac0xSTVRFaHM2NURBU0x1K0dHWmhGdWxGRGlXQUJuSVE1RWtodk14K1ZVRzRhV3JBRHBTU2RaT0sySVJkSW01WWt5eGtXQnREbGdRSW1yRU9DcWxLbUluT29kaEFHakJaeGlIVG93TkpFNEFHZXhFcXFnQ1RRQ0VXWUxPanNXMlNndGZCOW0xa0pLeWdUT2krTHd2TDlUeTh3UThzeDB6eDd6UFFtVE9JTEpwZk9RRnBFTVNNNGxoR1RIRUxVUXdhZWljRFhnR2tEb1dRc0JDVlFCWlMycDRjeUE5b3A4MTlrOXZ2WVR6UC9nZzB5c2FFZG11RDhtZjVFSFZtRjhKaGR6a3ZSOWh3Q0hKR1lSR2dtbEZzQlZwRnhGNUtVeEdMcVJrY0VmU096aEpPbGFZd3VJV0RvWVZHa2gwWUxxbHBzRXpxam5PVm9Fb2ZWcEREakVESUVLbUMwUE9qampMa29oM0JQU0NpYVNIQUZnK050OGhKTngya2FGdkhsZFFtd0xQd3E2ZnhndVdIVUcxZmNLUjFvR2RXUXdiRnBQZ1ZiQTNtRHg3bEptb3lMNldaS29QWWJqS1hNZ2JqRW1McFpqZHRFbjYyMTJxbkF3aXR1TERLaURDN2dmdlRORVVmZUJBVFlHS0J2RUVTYW13bmxWbTl5Wk56bERNdmtyWmlZbWRuRksyV0Nsb0ZPOFFJWjRnazJmSFpIbWQ5clBZWmw4NURFZ2NyTWlHYnBhb2lOZTAxc0hBUEVHa0ROREtEK1hxVG9iOWJDaFJFeDY2R2lWdTRsZldMalVnY1k5T1I5b1FPTUdSeHJ2bEpQdjF1VUFGSGNxWWV3WmZYazRhUXNhVUMyTHV2TUlwVWZCQkVZRi80YUdqRHZWTGdZdUdHYmVVK1pLdFZnY3Fnb1hKWDBodDVKS1VlUncxZzYrVCsrWGhScjFiNEZvNzhEV2hZUVlEcDI1Q29NWlJsMVVzYXVlSVg3UHZBRUltZDVmV1IyUVdwbmpMTHd3UUVUa0xuTkxOcGxoNkJIV1RMbmxFWDdVMEJKY05rOEVaU3pqR2dHTnM2QkVWWEovZ0ZpZitsRVEvSmt6dEd6R0s2aldGWUVpeXVoRWRyT0lQYlVEVXJVV3hGRU1ZeHlZdVdnRElzaVVFWDk5SklCbksydFdBQ0hsUkhkZldYcDBCY1FFWEpuSURmZVcvbUpkM25GbU5wOHFqSllML3JLUjRlQUFJM0RZNzR1UTFub1VaQk9VQzJXTFVJTDUxamdFSE5udmtTTy9nMEdBSlBoMlFPTWNLOEowVHp6YWFueEFXZzlhRUJGU1FnZFIveTc2bVY1ZEVobmVqZURPUGpNQXNCWVJvSHRxNUw5b3V1ZlBkZ3lreWV2TlVWdEhSd2ZGSjBNaXdwaGw1QkRlbHNpckRZLy93WURoRURXd3ZlNUJCUnNMY2diaG03alBiaUlXQWdNblppeUJHdzk2WDBVSTgvcXN5aFVkbWdXVmZTZnpuUHBOVFp5U0E2bVN4bk01djdTZ1FtWVRrRVBWVVhoYThEbFhEM0plbTBHeUlodGdQbEQrZ3ptWGtUWnArVmlydmVFS3pjUDhwWEJBQlpaT2VkVjNDOWpsaGx4TWhsNndRQnlBa21HUEV3WmJEMTVabEVjSFBSS1lBcmVlY2J5d1FOWnkwb080TnN6SFRsMUE2NCtydGV0R0hjV3BLNHhTK2NvOTBMUEV6SitDUHN2V2dncFZRS1RFU093UkRDU1ZSeUx1WVBCRWxISlB1L0M4SnJQaWdGTTdTU3NpekFiQm5rTmsyWTBQVjZwZWIvekJna0FWYnhyOFMwM0pRQVZYcVUvZHIyTi91RkJUQ1JrTXhqMExjSmpuZ2REQW96dzd4cCs3ekwybFhVRWtQby9xbStuSkphbGxKQW1NU3pNMkc4OVdoZEw3cGNSc0E3RWVTMUtBSmV6bzl2Tk5OV2Nwd2xFeE90V0NOTjJpRzhxZ2NSd1FrK25BTzhmWEwzTVdNeU9jTXU2WkVUZ3NiWEpMWklCc3B4Q1VWSXYwVmZ0dUZYS09hb29rZG5lV0tlTS83OWE4eDZkWFNZQnA1bDZHWmtSYmpPQW5VSXIxbnl1U3FMTUJHTkFUa3ZwR2ZRWHZaN0pmejlZNndEQ0Y0U2RMazlaYUE0bk1pTFk5U2lHbDgyZE5yYm5uWmJsL3JuWjZubWNPY2NBVnR4dUZBL085WEVnZGdPbVM2dm5hVkdTNWpvRFVBRDIraXFQc3hJR3JOWDRCdXc3Q0IyUEdnaG9nZEpBWU1sS043YU50SklCb3ZqTDJlSEVXQUd5K3V6VkFQQ0ppNHVudDdMcVFrMnp5NXIzU0NFY1pRQ1lkRFJwZnBzQlNPTlZUMmtKWXNxOUsrbUcwb2J5RWl2OHk0UDMxUzZBS3dQOGxVekJGMDk0YTljWlF6cTl4UUlSVHA2UmNGcldJNFJ4am5TR25kV0dhVEtxQ2dkeUwyUXhjRDJrU1ZCMXJ4YWI4ZVFiRE9EQlRvYS9uanRDQ0NZY2JKWUJxTFhRLzZxQ2FlSmJFcldpclZ3Q09ObmxQQytGR3pYUUdHUi9qUUVxOEExN2F3YTRXdk4rbzk3ZC9ETDRmSC9GQUx3WmFDeU1KaXc2a3MyUHZtNFZmeTZmcjZUZldWck0zWndqV3RvQkxQQnBpRVR5cGFZSEdIY1o1OHc5cDZEQkQ0MFN6YWR6MEFjaVdJM0ZaQTJPZ1Y3ZVBWZWxROGYzakQ1YndHN2d0Z1p5RENLbElhUDRMZGNaNEozaGpvdEdTZTMySVVzckN3L0JlUmZsQWJPR01Wc05pTzgzSW1zckNWQUlveERxVGhPQWhaSUIycVRtMkJFWDBGdFZESEMxNXYyNFhRdHF0djh0QnVBazM1aytoNXlOQ3RYTjlWZVpRUmxBeEJ0U3JFa0hhZWxHS21nTktGek5HT21TQVhMa3lUVU9nLzdRM2ViT0JmMjBQaXN6MGhZTUVIVmo3Q1NJdkM0c01IMk5nYVNnL2hXYXBtWUFvcE9BdnhhMkpQNGFyZ0J0d2dTajgwWEp3MmprTElJT0xuU0EySyt2ZlFWZ2RrT2Vkb3NCNnFybkxDVlI5RjZ0ZVQvK2cycHd3d3M0MGR3WWdIN3VUb3NCVmlNcWdVcXpZSUQwQmV5Z0ovYldiZ2VyR2FDU0FCbU1qQjNmd0ZVOXB3L2taSm1SbGhPYURBQzhZZHdLSGdwWTV0YVJwZWlQR0lEU3RNWmZFeUZGRTA2QnlYU2pVWmF2ZzRtVkVnZGdtcG9Cc3JJeU5FYjZFNUltdjE0QzdndDQrQ3BvVnRXOC8yTUdBRURxL0FjU1FBZldsY0Jtb09UajdwMk9xaTVNQUJwSnZHQ21rU3M2d01FdWlyUUVQVmgwRWlkWTZRQlZSbG9TVGw4T1h4eER4dHh2cUdWWW9EUkx4YWtzZFYra0dRSE5FOVRObCtCbGlaRmNxSmllWUJVaDdqR0Q5NUh3YkdWS0NpN2tzR0w0Snl3Zm43WFY1MGJ3Vk14dGgzU1ZBYmJFZ0hGNUlZcFVFVFVIMTl2cW12ZC95QUF5K05qeC9FUUgyTTI1YnJvU09ESWwwSFFBMXhCbmNGVURCaUNrYkVRbHdTNGhDaDh4RlVFQVh4Tm1DQ1pFMHBKZUdqTEIrRWFXbHpJajdZc2ZHRUVxYzhpcTNHL2JDZE1rVU52THNtdmRHamRGVXNjZkphcS90UG41dUVGTEFWdFVKUTloazRUN3I4S2RpUXhzSEtFRUJnanoxZ0tQQTFXV1JGOHhDOUVGQTRnbnBsTlpxakZoa0xQczRBeFExN3ovWXdiNDZCTWc1ZmtqYnV3Q0tMQnhFQXpRNmVtL3NVZWM3U05GZXIrbnZIR1dvV3FCdm5SRndLaGRMRU13aGkwaVRVNllpTEdYTUtsZjZGaVkzcWppUndaSVhvTGxTTitDL1QvTHFvSFJ3YmlUOGZMdXEyTC96YTNISXIyQmc4b1NhQnFqRTRsS29BMXJQRzRtREJBWllqN1ZxbVdRc1RJWGhBNzNSOFVBbUozNVJBeEw1SlZzbkdaVnpmcy8xd0VheFpqTTNiTkVIcjF1QndnalFUSUFmbVppRS9OVnJIZTloVXgzSVU3Y2xDNFdOZXRsUGNuUzhnclhuSnU4dkpJaVBEcERxeW5NYVJkd1Q1aUNxNTF6NGhoSG5UUWRPbW9adGRTWmJJUGZZdDBZOXlwdkg1T1B1Sjhoa2hOSFBNRDVNbmovMEtmQjNuZERXQUxua2ZGMEx3d3c4K0xLcktoTG02ZDhhZURrYWdaUVoxeVRUOXdVbVdYbjYxaFVxNXIzZjg0QThQckN0L3hMUzZBZGJNVFUwalF3WnducjkrczYxMVpqVjRSMHMwc0dDQzVYaVFack9uZkJTVTNUSFQvbERGZ3lOd2xXdEVOaHdNbjZ6Z01FVTd2dHJNQXhEbXpXdVBNQWQwSUtMV1RqWkExeTNnZmRvVEdPMGN2NUs1L1BreDNmUlArb1kyekN5VTFjc0FVbU1DN0NRb29pREh3R0hlQTk2NEFTSE1BVSs0R1RheTBCdXFGQmFVNUg5V2pGTmVhV0RnYW9hOTcvT1FPc3BFVjB5VTk5QVdNWDhXdGtuanp2a05OM1ozSE9KczBNKzZRTGlPcUhaSUJ3NGRLMUIvZDdSbHFrbDFCa0hyMnFrS1R1K0twSzl1TUZqWEwwQjFNMDZMdUYvMWd2TlBkaEp0R1RsaUFiM2dmZGg3N1gvWFpERUVqTlFLSEVUUlV4Z1JmQit4NFpFYWdaQkJXT2lqRHdPMVF1Z2o5Z1FSTXpBVTJKazd2UUFYcnJNcW9nb3NXbHBWcDl0ZWI5SDIwRGg4T0lMMHR2NFB6U0c3aU1QUHN5elREUGxQNnNXMzhrQXpUdzdQVVZwdDNuUk04cTZ5QU84aUNRbXE2L21OTkxoQzVoMlZ4T0tIWVBXYklmNVNOa3ZBaHVURjhwd0dJSVZjQmNDcEROeGlvc0RCREN3dUFHbEN5dzg5SGQyN0h1ZDRiY1lBTEx5UWhiWUltU09qeWpIYnpQMkNnTDBHTllzVWY0TEhVYmFKV0xaQ1prNEFOQ1ZpSFZkMmhVTUpNQnJJQnhseGl3WTlhWHFLMEQ3WnIzZjFnVS9Pa3Bna2RuUDRzSHlQeUZRcFZHdHgzaFhwMVp3Umlyenp0RU1uNDlUTkhCcE9OR0hJVDNFR1hJci9jd3JsN2pzR3kvQkY1Y0FpRWhOQzBrYUhSMjM0ZEZTeGpxVlFuTkdETHB0Z3NZR3hlWVE0SnNvaEROR2QxZTkzdEdpTE5SMm1LYW1FbjVFaGRBY3JUS0o4ckpFVkxya1grQWg5NnBqS3FjakJaS2FYcGRiM2ZtNXJWT0IrV1ZKQndEeEpqc012L0kxWnIzZjFZVi9pVkxzdjBzSXNqbEZVZGZqbVVwL2UrTXYrNXVLZExXbk9nTS9hd0QvQ3plK2pGaUJRR1F6a3JBV1pnZGh3SUlpWGNBNVV6eWNrTGErbWl5VnhmSXFQSE82RmhpRGpQeTJQRjA3R1psRmcrN0hhSk5QS3BSdWkrUVFkSXFoQUt3SlNndU9ZdHFhbG41VU9zRklOVzdoZzVraG9CamVNcjZ0cFdncTdtd0ExUzFaTDRJaXFtcUVUeGVyWG0vOURpUkN3Wmdtb3ZLTlRpV0JwVEo4V2N4Z2NkVGpIN1V4NWlBTGxiZHlVWjY4dXpRWDF4SzBRRVptaWhUWWc5eHZ3emxUbGgycEYzbzhKQURJZmtPY2pQR2hXZkVKQU9XQ1dSOExpNEFXTy9ac1FjMW5nNU5pQnFvdC9jTWliZTQ1cU9CanQ2cjRwWUF4Q2ljTElQM3Zid3N3R2lFMVdnalBCZ01JT3QveGtQSmpiRUxpUFMvNFdvdUxZRnZVVTNxQjJGeHJYb2sxMnZlejFyVjdjQUFMTldFdlUyYXpzQWYwZ0RqdUl3S25rUlU4RmVPL29nVjh6SE1qbHJCU0t2TTArdWw2ZUdjV0FEY3RJUDhnU1o4ZHJ4QXdyS0pHS0hZVmFnQnlSa0U5Wk9kcEFhRVNTUkpvRXowZ0UvVURMRW44dVRsamQxS09KWjhEbEFNa1ExYWZleDRyYmdsU21MT3JOSnNBQmdKS1E2c0RXQXpRQWN6VklUdVpOYjVYVEtGUlpWaWFGeVZCSGY0bTl5RTVicWdPREN6d2EyYTk2ZXF2aVVWVHUvUjU0ZnhISWRSb1ErSWpOdTRBRG5NMFNlaXFrS3RmUkdkcVRLUDBOOEVtUW81QWJtcllEN2FDRUt4OWtaaFNySHJTSy9FVExFdENXNU1rcWJzZlNTV0xCRk5KM2xLWUE2QkdHVFpTd1c0RWVObTNVUVlndFR2RGhxV0crc2h2WWJGTGJOR01YZ1M0TkdFTUF2MzZ1cVNXQnVoczlKZkdNQ2lRZ2NSRXkyemh0aitWa1dGZGtudzArbW9ML2VQTkpVQ3Rnem1aTGxhODM3ZnFuQjcvTTV5alZFNktZb2p6VEFudEFuRzZpb3k2Q2lIeTlFM1pEQW5GRkNnT2tBRTJHTENPY2lVdURMSTBFU1pza1R0aVlCT1lLYktTc0NCOVpRakw0UzNUY2VHbkRKMFlwUi9EdG5MT1FxS0JwNGZMMi8zY3FJZUlhUHhOc3BzaW1KRFhVNnROKzhZWTYrck9kWXBEMVRpdDVWOU8yYVZjaHRvT1VETnljdWpCd2FIV0J2US85ODdxdy9WQWRLQ3RVME51cG9yR2lFenJaTGcrblJ0eGdFVXhHODVXYTdWdkQvVk5hNHhRZGhEMWhXQ0VKTkp1Q3dwcGNLMFhjNzVoQ0VrVUg1V29MQXBuRGh2eHNUdzZ2VlRHL3hFbHVJNi85c2hjVGliUUZUWG1EWU9oQU95MjU5VjR5RkxJY3UvZ0xnS0tRelVaUlplUEZXRGdhdUJlc2RrY2I3SUxBUEsvVGE5OEZZczFJekc0bVlnVndyeVNHTUNLd2JzSHF2RTJpZ0QvUHV2eGdNQUVJSVMrYUJxcGpXSXJRUU90VXVDbytGOG9iL0RjM095SEUrdG12ZnNqU3IzbkNDY2Jlekp5WUt6ZVF3WlRWd01Kc0FQaC9PUkxPeXNPRys4MTdFRXJSSnJqMWJQK2hsNXJGMHNFNldic3o0OGRDYVJkVkhqdVc1dlZQbTlxamYva3Y2aVJIM2dycUhlVTNYeEVhWEluQXl4WElJem92eXhUVWhkSExIQTRxMjhITDAyRkRkanhyQlU1U0tSVVVUMXIyQmdaWkpBWllELzNzbTNSRktMRFZjVzVDOW9weGc2MVNYQlR6RTFBYlVsUUR3eUpzVG1NSnR2U0ttWTRGalczWmJISmVZUU56WnR6QWFDaUhoY0hIa3ZLaUVESmRoRXNaSGZJYU5HS1Z3QjdRdHc3Y3QxbnpwR0Zzc2s1dW01dEpxb3NHUE5TZlJudzRwV0FoM2pyNWVVd2pEZlJ3MVVXbTFEcGtKcFVyc09GR2FsTnpmYVdDYXBBZTlVeFFabUMySVpFaHRMQlAwVWZZYTJjd2ZzZVc1QmMvOVJNOEFwazFxTUlTb3hzN2hqaUxtS0EyVkpjSUx4TWFoRmlvZ3MwZnh0T2dFYnA0WHZ2VEpWQ2JhL0pHd0xjL2o5blZQRThyQmdvVE14aUE0cTY5cWc5OG1IVUdwUy9VL1FLcTV3dU82RjVxOWZUSFF2dTRsNXF0Tm5tTUxybUxKc2JyRU9JU3VUa0gvSmxRNTJaTUFlYkR5Wjdvd2w0dUN6ZjRJRnQ0Y3RzOUE3Y2swUlMzd0c5azNJaDZlUHVKU0RBZEtsbCtZY2x3bzl1dTBZdWg3Yi9TOWpBSm03NHhyR3orVWJUYmlDZjlhbDE4c2E0S2RqNHF5elJMUGhxTkRCQnN1WUlRbWh4MCs4YjBhdW9JSWZlN2k5SWVDWjE5Q0wxbXd6NzBWdU5GU0RnV0NNN0R5RURCSzBTcXc5RU03MzFkN2ZDbExqenExaW1WTnppcGFlRXl4MlhnNnpGNjMwV1VISWlrM2QvdElyRGV4WXBEbVdOaGlsNTFaKytzRXVEQ2N3dk12ZmFzK0NkOVlkR2cxVDIrUHB1MXpLdjdMb3c2ZTc5T1NBT2NMQzJXd2VIMGQrekk1a0FOdlpZaFZ6R1Arc1RLcmppR0RhcE5EYU5jQUxuSFdVYUNaUHJySUY3R3ByU1VwRzZJTndwYXZDamRxMDRoR2tTVENyWldZaWhnQWROaEZoYWtBNU54WEx6MldoVzBKR3RRVktFanhWV1AvQVNuWE5zVFdoaFl3Q1R0K3BNc0EzaGhVdTk2SXBXZHFsNHhqbXdiQmsyRktaZjQxdTNuZUc0bFJwOEE4TDVoWVhlbHZsdWMzSlMzWTY4QTYrcjVUa0VFb2UxaE5oWFZ3NW5rUHN2OUtWRFY1RmVwai9LQU9ZYlF1cm1NUDROMlZhTGY3SkhETGZhTzBhNEltenpycUJOUENzbzNFVTM1bXFaS2RFSUZKeU9TM3J3SjBkdXNvMXpPSHNTQ2FIY2tGOWRHQzg1U0xMV1NZWENRVlp5VXJGeHpKS1BRRGZ4dkthdFBPdncvNXYxZy9qVmdZMWhDZW5EZ0psTGpoOFBIeThuNW5Jbmd3UTBYR0N0TlF6R05vVGNVZTBnN3VjcHRUK0xCaEEyQThTQUVXK1dkVTZHR0RkYTd6SWdEdkRsZGVMeW8rSGVZVDJ6NDdzRGlqTDhNb0s4Ri94Qmw3QytNdkVlZzVBWXlKUkc0TldEZkRFV1NQVFB4bUFRRjgySDhXSVFkVzZPanc1UU56QUhMcWJPZk9XZTBZVFBEZVQxREwyUlZNdXczTXVyNkErR01DNEtCUlo2a0d4OWdOTXVyRjcrcktTSk42QTkwSUFSSUFuTHhrQVkwMDM4cUpNWkc4TGJ3WVpUVERha01mcGFuY0dZT2pGQzZkbkdlS2xsUW9zdWp4UVRMTGZNVXlTaEFTREFmQjBlclEyS042YVJSOTY4OUttRDhIZ3dWc09oQ01salFIKzU0Nitaamc5SE05VXB0WWtJcGdrWUZId3VnWTQxMFRpck1rQW1MNElRR1ZqbUhhWndJUU9vTXdVWElhMmJCeTlsU2x0c3NCc1ZFclVINndtTTFGaFlVSFFVRUVDbVlDUUpKQ2dSbGtOc2d4Y2tRWVgyTjRHZkhISkFOUUFMWHdJNlpTWnlkNm9FZm0wUVVFcmZERmtqNTVBaG1aRm9RY0dmcklRaHRsSU84WUFIVWN4bWJHUit3VmpBQ0VJbUFPK0FpcExKSFF6NkMwOEdJb2xtWlB1aU55TWxMQkNmekFBSXZvR0RaenBES1Vsa1d3eUU1ZVlEUEFQR1NERGdpMWNnemhyN0VPcnVoTmxXWWNwb2Z3cTFUVVRyY1dyZU9CVTQ4RnR2QVhMOXE0TnorWDFSU1B2UmNSRjc5YktBQmI0Nnd3d1MrbTNZaUJzcDhEd0FDVzVtelBFdTBUVWxTRjZiUVlJRFJCNXp1SFRUQTIzcXFvRFl2WGhZaDFGZFoxZ0FJSndTUnVPcm1XL05BYndPZTZaRkcwN1JBWlE1Z0NrYUdLVnNNMTB6N3BNOHJCTSsxcXRBZnhmSHVNSzhQL3U0UGFSU1FaSnlqQ1cwaWViRHFDMkJNaWlERVUxcVE0dFVZbTlRNGxrejRpTXRZTWJJZE80SzB6NHFpZ09SajF5b3FwaHBRUWk1M0k0SER0YS93M2c4aEZXelk0dEFmYnBKSWJLWllxbUt0NDVQeUhDdENrcG9iMWRNa0NoQVg0MGRHcWpWWldSKzBZbCtYU2wxeWhWZ0pnVHJHeGk2MFZrWTlkZEt4bkFRcGpNNFlqZGkxcUN5QUJrRG0wNjFKUjJXeFlrd1RyQTJFNm9nVHdpZmVkWWluSUYrSDkzOU9GcWdKTkh6RjluZ05zU0lKYjFYU2NUdWpMTEF1YUF0S0ZsUkM3V2ppMUs5eFdWQ09aS1BWREhWeEhUSXozTmN5SjZHeDFQWXFOQUlZQkJZdFdrVHorcEY0a1VYaDhMZDdQUCtXU0F5NHBETlFOd2E4R3lHQmJvaGtiL0Y1VlVRS28weEdxTnBja3hHdy9KQU93aEhvTU1nT0EyTW9ET2NhWnA1YTJYd1FCZ2pqTytxTlFSeVdkeTFOTzRJOTFWeHZzVjRGK3pBaGtENEhzU3hqL1VxZmFIRWlEV0gyMGVWcEcxemJpMUJpZVhGdzVYL3VucEE1NWtJVEZZU25NdFNnWWd0RFFrZ0N3UmpYQUFWMDBtT2RyQUJrRHFEZUh0d0xjVjdtWUFnQ256Z2dFUzlaWTRqV0NBMUFCMVFIZXNXNVRoSWlhaGlwbUlPRHRpQU9VT0dRMWpzRHNUT3NFQXMyQUFvSmlRNUdYT1dOK0NBUWFXNnFKaDBXSXVsYXlYTTZySS9FWDFFYzhzVjRCanJBQjM5T0VqL01VRGx2NlVBYmdEV1RkbFZocHVpaGU5SXVwdGVwMEIwZ2VzK28zckFKQjZ3M0pOcUNJS1V3ZFluZlV4TGhnemgxcTNZMmdkRUg4eXdZcVpqeExWTjBja3kwNmk0bEMvL0xKa2dOQUFvVHdXR0Z3dndyUUVxQWlVc0JtaHN6Rmg1L242YzRUOEc5N3JnZ0g2YS90LzFaOGpqenNab0drUUc2dmFiVVJWRmZZZUN6TFB2WDd1RHhZOWNFZ2FBYmdDTUVYTXZPY0Z1bitoQThEOVhqTUFzVmtMb3BjanRKTHkwN2ZXNkwzQkFQUXlJVTQyVEJYTXZMWDJoQ2FYRElBZkduR3RZNEpWYytCSmpvejllb3JqNGk3dEZTNnRjRGMvVTluTDBITGFURHVxNFYxbkFHcUFxSk9MbW5vZkIydGtnQVJVekhlUXhJaTBIQVJMNStzYm0xdm16b0lCSHBteFNaVVprU0Q2WVg0TW1SN1ZmTmxUUVNmY250VktXUGt4S3VsUmphWXBnQWNWRi9WUkd3RjBEMEFHa0dMZXJBeUE4ZmdKQTlBUWVBbXNST1NRQ3VORFBha01XdkRCMmpBM0dBQStZT1FhYXlJTm5sVmYyR1hSNlBIeWtnRXNEVlZmdzNZYmdFY2p5Ukc1OHVNejdUUWFDRFBEbytSWkNPNlZTN0s4Q2VQM3NSR3BHTUN6UkpuTGxVbUNPbEN0MW14a0FOTjhRWEhNMDdOeDVtV2hvUUdXQ1pDa0dOMk4rUmlnektpaW9zdDlNQUNlaloxTE16aXJpQUFEMEtlRW9ZNVdMUFhIRkErc2JQMWFxWUJrQUMzbTNVdXd6MjBHT0MzUktnWUlTdmQyeEttejdqb00zUVl1Q3RERmRRWlF0MjNVRDZlZDE4TDllNTRSQTQ2Sm1nR1l6UTlMcFF3NHh1VnpVVElBUXJkRFJHdDhoWHFJYVExR3REZXRqa1VkSXV5SERoVUQ4Q1ZUQTF5c0lXc0pYMGdYZTZFRUlNb2ExYmk0cDZocXpabXFCcElVb3d1SEJFMEFxcWpJeDZVTkJCWmJNd0VnSXhZWUFDdDJMUFBreGxUMlMxT0FJTnlpT0N6TndNa0FLT2FkcUxQYkRPQUp1ZHNNNEJteTlFbWx5ZVc4RTdzQXl2QlJqdDlnQUI4NWdLaFNoMENXRHF4TFQ0aXlxeG1BR1hSUnFBUW1BQmtYcDViN2NXd0pvQ2ExbkZrTWU5SWZlUjVWeDg0NlJCcTg3eVNyR1NBMHdNK3lsaTJhNXhoZFJ2bEM4QkJLTW1PeXQwS2liYXVBZldmSkFIZ0xtZ0JrdG1NNXArWHVaRVpzQ0RycG53K1VBYnhjMXJOak1OREs3WDVoRHU1YnZvZktDSkJMd0k0V3E1OHpnUGlOR0s3NDZ4UWg4UHFwcTI0U0ZTSW5yemNaWVB5WThNcXQrbm9qYjRHK1d0VDdxSVBLSFJqUk1jTzVnbi83QlBqU2t3dkVMcjIxRmdtOW5GSzFRSWxCZlJiOGg0enJOOXdSN0VxeFlIbE5xYlFCSHRpSTcwOG45bjZXTm5ubElWaG5hWm1wVVRGZ0VoQ3F0UVI0QlNkQWdiQXhoNHpDQ0cyTk9ZVFlGRlM0enRqU3pMM1NTRWZPZFRVSDgvam5wUkVnR1lBRStSVURpQlJpQU12bEVyQ2dhYU5BOUhvT25TTHUveVlESkFRYUpZQU1zVWlabEJWL2FnYnd3aTltQXREQndab0pDYUt4SEc2VVVVK1h4L1hJZktGcUFXaUp4eW5RbndsL1pCalRvc0FSZnFRR3VHYkQ2MCtzV1NCa0tBRm1uRmJGc2g4cVFNa0FlRE5vNVRtNmJybUhnd0lKbGl5RllWR0RFaWFBMVpyeWh3eFFPbnlrcVVrd1YzdDQ3c3hUekZpUk1BTDhPUU5FVU9Da25kYkM2OGVYeUJENjBpM1p4ZTh4UU5PUVNXdU95SnBmTlFNd3FKZXJwZzZPTW9DbG55TURMTUFBbWUrWXRjeFlocldJVTRCSEVxV01UT3hrUWZuZHpqelpoUWE0UWtQR2pRNGErQnhMbWZzNnNPUmhWOC8xNUwzU1lRRU4xakc1WklDNTEyQTlOT2xub3BGSkhHN0lMU3ROeFJSRWVpeWV5RjJteHNTcUlnRFdBTERPcFJIZ1R4a0FPeEVyZm5ldFFyY3VJNnZNYWhEbHFDYmhFUFZlUy9UU1dnS0srdjdVcDNtWld0TVgxd29rYXpoaFlIL2xxNEcvYkRKRFNZZXBNdGc4TXBKbGVIY1pweERpZDZjQk9hMXlsdlBHVEt2dm9RR0NjOHpLMUdQekJMUkxPaHMrNVN5V3gzYUgwNnhrQUJnVDFEeFhNZ0RESFZReUlaTjRlcHBoWkFMOFNSVXQ1cURvbTdycytiWHRLZkdMRE1Cb01XQXhhaVBBNzBnQTVFSElWM1JiQk8yb3pnQmx6cnRCSkx0QUx3UnRweE1NbWxXaUxkVkJNQUE5d2dQaVlkMFYzSUJRdStDZkZnUFFJbUdhTVZLUnlLZ2xOdEd5S25wTC80NTJ0K0lVWml6N09nZEtsQVVjdUxpUm84bHFMbXBCb3I0MytrVkQ1VEtxVS9RT0xnMlpIREdvQ2FVU2lMQ2tFUkx6Tk5iSUFEQkNBa3FHT2o2SU54cU1GTXZvR2ZhWmlySDZoWWpTd0dKMEoyNEcvcDBsQUxrTVJIclNGbGYyYTdLMWJyclN1SVVDWnRvSEtGSWtzbkM3cDdma3lxNG9YVkc1UC8zVGZiZUtaSGYwKzBTZWJhRFQ5RkczR0VEb3RtUGtqNllKeXRSVmZYbEMwR2hkWk9MN1BFU3JNV3VJRXVteElwNnI5Qkcrb1Z4R2Z3Tm1RRFpuQUlweHlsdlB6NXErckMyelpPcGlRdWVIL0M2M2VrK3FUMXdtVkNVMkNvQ3hWMFljaHRFencwNWhGSmpFTHhUR1NDd0c5QlFnZ3N3TzlQOXVNQUM5bWl5YW40a3NJOThGY3IrQmc5dDVidzllRGJaTWtXaTQrRkZaZmRTc043RUV1R2twU011cFpNa1JvL0xzdFBRRk1GVzhZZVE3cGloQ0NVeFA3cUpzQlFQMGkxWXhnSlViV05FRkY0V1dzTTBIemVsVWV1RXVNeHZkMEJCbElXL2R6czVqWEdaQVU1SG0vRi8zaVFKNFpqSGFiNmo3eGY5c1Y4eHc1amVGRk55cndocWJ6Nnl5WTI3RDh0Yyt3WEdCeFRncHZvR0x3QTBHaUVSRFRVK1RDc1g4bTBiK2luVnA4M09iTFhPTGU2WUtncS9SRzhnek1JdWZLb1NvR1VDaDJ5WUJhSGJ2Vk9pMHgvUUdFbHJLR0ZNWkpnU2tkbm8ybXp3OHIyNlpzcU5xdGtDbnA5bngxOHNvdFpiYUE1Mnd2c2RaNVgrTVJLcmxMYkZ5dUp3dWF0T2l0MERkeFA4UzhPOFFRQ0V4N2RXSklkZ2JsQXl3bFRId0IxbkRNcUVuaksvM1g0WXJTeXpHVkJyQkpsd0ViakFBQmdQUlZHV2RpNm5ucklWNmtzV2NxOXozbkQ0SnZrWnZBTGJCTEg3cXdESkVVd21rWjRlS0NxdHoxT2kwb0ZJNE93aWNGbCt6Tktqc1oxZlpKeldGcUtnclc0NjhaWnpDS2FzbEVuL05Hc09RcDl3L0dFQWJUaVh3WGRrWWkxakwyOERLS2FHRWduaFpvK2xEOWI5V1lBaEVSb1cwZDhLN0hVVzBMTm9NQ0NTSFlLQTVESzFDMkd3QVpTSUQ4SUt5YXV6UEdJQWxHQUtNei9sSDg3ejBWOVVvckdJU3BrZFdnMDN3TlpvRHRpMStsS2RxTTh3bzRhaFExZFAxbm1WaldXMHJxVVIxNWp1Z0ltSXF4akhPSnBLcmFrb1NaTlhZVnMwQ3c3TmFJdkhYSk5oRFFCMjgzQmtDc2ZUbDZnYVpJYTJVdDRtVkF3bFJocGJBdDBmK0x5RktMSnFIczNDVDkxdE5aekFvV2plaGQ0bXhBK3JPUVNQRVJ5YzhJMDBCWUFBRzkyV0F4cFFSMVFIR0p6clU4bGRZbWVoZWVQNVI3YzR4MDFrTk5oSllWTUgreEhvVUJYNnh3TEdPb3A2SVc3SVlHYlNlUktlVlZDSjJsUEF2U0Rma3hlQnNTbkpsMDNtTm03WWFaeGlSVU1DTGJaWm9tRGtPZHZLQ2gzcDRQQWE4alA4NVVCUnRFL0oybk1BMWI0S1dhNUUyUVlvMHN3TjBEM2czL2dOZXJXd3Z4QmhlZmtTSnNvWDRKLzA1NUxXb0NuL3dnOVdTZ2huMzdPcUlsZUdxd1Bpcy9Qc1lkZGF5bUhOZEhkUExUSDREZk0xZUFqYWt0UXRuSzhLTjNXOEZEQStrM2RURlpNdWFsZ2J6QVRoMENTQXRzWDArUWt1UTY2VkZvN0dCaExQVjVIRm82RGlwTkNXMEZJV01vNWFwbHlKbHE1Q2l3S2lSRVNwa0hCbkpQNkhBa1JQZFhlRHVDSXFXSVNSWHM1Ry9TZXFXR0tQMkVmRFFIOFN4ME1qWktjMGV1UWE4UklCL3FZNEVxa3FiQTBjekd4QnNuNTVRNFFnNkJJTEl5MHpxZUkzcjNpbitRMmNDcjZjYklqclpPeDJqNXF0ZG5tVmo3YVFvejV1aTBNZ0U0UktFZTNUeXNSWDAwVnI2OXNUeEpZSEFPekhwRXRFUEpEeXFFMHNqQjVOWFo3TkFpcEtwQ1MwTkRGdzJERmdDUk12a0lMYmdGZW9BRWlOUXBjeEdBbUVsdkZCa3lrd2JuT1NFK3B1R1Zwbzk5c0VBSVRmdkMzVkVDZG9DNDI5T1BuOTlWaE95Q1FDK1lmQmpMcUMrQnVqTWlRS2laMHVta0l2aWlyeEFtSTJYVTdMbVNRcmlmQ2xGSWY5bThlMmlkRHBJc1VFQnk1SkFvSEprVDZnYlpHYzE2Wmg3QnlEdHIrOG9yVndrMnFxUm9wd1hkREJlYUNIY05IZHpqemMwTEJQZC9hSENBT0NNVXY2UTBONGdvcFBVMlRKVGZEL1R3Sm9BeUpSWGhka2pHU0JxSkhNc1hRSzF3Zmd6RnZDZGVUMW82OFhjcDVTa0dLZkFqM0ZYbFlRLzJtb1REL0FLL29ubHZrSm1seWNGWGxTSlZmeU42QWV3TzNyd0R4UVhVK1dqU1NjQWpVUUQxbTFDQTBaT3VzaStCWVVha0dNY1Q4am9wa2FLUm1ZMjdpR3JGbGxQblp5WlRhb3dzNzlHK1hFYXhPZEZLMHl5L1d4bHB2aUtBWTZ6U0hyM3FlMlNBZHB5TTZ0ZXV6S2pLcEhTbHJJWVlqZ0JvOVhmcXNpNWE4eWgxVUM0a2dpWGlHb2M0QlYrQWVoV0lyUHhOMC9TQ2d5UmN1WXgvczRnV0c0Rm9odUVTUG9ZNUZabjdoVUMwZGlVazI2MXlrUlFRR0Y2Nm1FM0xXY2NGNXZuWmh5YlNYQmR0Z0xPd2phUEdxT0ZtZjAxU25PSFJ5UmFaYXYvT0hpN3lRQVpEdkQ1LzBtN3dnQzViVW1kQkdYWDBlOEs1dWFkR3hxZnpyNmtWWDlISVRNa01hQTdXRldTZHhMaEVsR3RCK2hNOHd1dzVheVEyZkUzMFRvd25ta3Nsenl2U0VCMVBGbUF2UFlnSDFnQitnbjZERmd2WWhuWkU3S1paYnVjZE92ZWdLbmdpTUtNMU1OaFFpU052RFdvV2lsY3kvNUR0dEtmUlhvbURyR2dYcFlmVDVkWXRIVXdRT25RdU1VQU1pVVlMd2I2WDJNQUY1cXBrMkFKcGtFakZFek5JNkl0cGpPWHRNZjhXODZDL1lqV0hMR2pZOXdSbzU1RXFCSFZQQUJuR2lCcUhyOWZJYk96UGhPelZTcHAxRjhEdXk1VDBFRTBaUWpISUFxMG9TdnA0eGxPYWZ4UCtrVG03NXgwQ0EvaStaQ0xIanJrbGRTU0FRZ1VQVVRlVi9abisreFhIbTB3R0pCd0xURE9TSnFyQnVrVWo5Wk9xSnU2L1NVRFJKYVE1dU1tQTFCb1VpWHB1c1pQL1RNVVRFWC9hdlBxbnVGZnpiOGRkV0dPa0NmNHpqUmFMNzNBVmFQWE52MGxpTk4xcjNXRnpPYmZvRSttTEZlNmxNQU5iTHNJb3g2WVZ5QVpZRUVDZlJ3Yy9VSUd5UFlaREpDVGpsNk1ORHRONytuTWFETUFnYUphSElpVmdKazFqdzJlOGNxZnBkUWNSTWFPb0o3aERMaU9KQU1FaVpRYms5U2xJZklxQS9BelFmK3JERUJIZk9va1ErejVHZG5nQ2lZcytMN0R3T0xtRTUyVGsvREc5SmcvZS96OEt1aE1FcEFVeVFEMEs1dnJoL2JsQ3BWbGYxY0JhRW90NGJLU0FVeXJoN3hyZG5KVHl6WWFrZWdONldPdnhGVTNDY1FRc2FMV285SUhma3pIWmh3TFlGQnp1R0FBeEIwSUhpQklDazhBMjg1UnUrL3AwSXpjeWpwRnFtcGZMRC8rOGxnd1FNcm9hcjBvMHEvOGxBRnVTZ0I3UktHVGRIS0pCS1FPZUdJRFQvY2IzTnM4dDR5cFJoYnZSZU1SUTE1YUZVVk93ZDRqT0ZLY1R5eE1FNjNGQUlqVFpKeld5L1NYRE1BYzdnVURVS3RYU0RwcWltbTF6bTFHb29OQXE2aWJTbTJmOUxHNnY1WkNvSngwa1JMK3liMDVGaFRRTCtST25xOVBYMFhzQXJMbVdWTXB4NkVvNDFvUlFFVUhhS1hYUVRWb3ZVeXhrMXdtcWEvM3BnN0FIQXMvV1FJcVBmT1FlWll4UWFJNmJzNXN2Q3RudC83VXYrekFxNDJwbjRnRFhyczRuV2VnZGdldHhnbUEvbDVVZlB3ckJ2Z3dMaXNad0xYNlFkOWliVFZJTm5uTXhyQ2IyUVhHb2VSc2grVFZUbnZTeVJIUDgySE9mbjc2WVg2VkFaNmZISVlGRG5OUHdLdUQwREFVbFFSWXBRUkl2UTdwNWlrdjR1YXhrNnlnVzlkN3lRQ1d6b0FSZ2I5Z0FDb2xUVmE0ajByWjRGd1BobU4xMG95TndRZ2Q1bllBZTE4bnZETUM1RWs0ejBodFg3YVNBUWdCMmJFa2Vja0FEdytYRExDd0Y1dFVERUN0dnQrSHQ5cjNYWHdFQ0xRdHNJZSt6ZEdQc1kvRE1KWUVWYXhLbEJiVVpaSGdoWDR2R2FDVzBpVURtSk1DMStBNGEyMm5Eb0FhU3dSTWxEVGREUzRpcUtxZFpKRDZlaThaUUcySjJBWjZQcE9mTVFCZmFPQVY3aU50QjBVQWJ1SFZFUklmSVNSQVdvMUkzZStsVUNDRUFieXd6RHp1UElzRkg4dFdXYnh2NXhBUUdzYVNBYmJTTGhuQXd6cVRBVUtyTnptcUtueXZaZ0RRSjBjSWhvNTdzbXpmZFBlYW9KNy8zQW5LdWhVeVJGY1pRRm9CZ2RnZzhTdUVuOHdXMXp6RzlTNUFpd0cyNEhndXA0QW9KM1Z5SjFtUytpTjZyekdBdEQyaDQvRHR3eEwwY1lNQktKSTZSYUdha3BnakZ3QlFoNkVLdTRxSGVXN01qYmkxQjg4VlFJelFNdzdNNEQ4cDRTU1c2aklaUUJjU0JzSFRqa3JhanRBdUdjQmVxTTBBalRRbzhKb0NwbWt4Z0h4Z0FUN1YvSVRPeTc0QWlQWmJNVUFBT2ZTQ1FyNWxVYUJDWXFBbHVGRlRhZHFISkM0MzBVRWZhSjlSLzZPZ1hpbW5uRHBzTmFrWFYzdjV5K3kyU0hZSTN6NFFWQitYRXNDU0VqRFhnUkhjWkJJSEIyU0dQSS9DMi9ncVh3UThodmFOUVcraStYWlJpUjJ4ZFBEM2M2eGJ0VHFSZlRXNmVvM1IzNklHOXNrQUE3WUxCcUFFU2dhZ2pSVTZvTXhRUmF2RHJob01BTFUrd2Flbm8zOEllWWtBakpvQmtoYlVjTENhKzFOZkM1MEJVN3JwTXgyUkJ6VWtjdHNHTHlRQXQ1a09teTJvOTJ5Skl3YkpBSVRlaDZNblRtNzNKZ05FNG5DV3BrQmt6dnFLTDBBWFp6TEFVQ3RocFFTRHhDTVdIaVQxZVk3UGNyVXdkbm9Lbm5Ra2hiNi92b2xiNHpRVDQ2a0ZLZFhndE93U2VTYXlrQWlyWXpKQVAxcWJBU2lCa2dIb3FSWWRjRzA2SUQwcnpnQm9LbWVjUHZLVWl3VmczMmFBSEZJdlAxZXdIZDZYay9URDJxRlB3Qm5UZEZFdEpsT1UyQUMwSzNqTWtGTXNHa3FTc0dHcTVjblhlbUZOenNUaHk4aVh1THJHQUZDZHdRQ3doWGRTNHRHUFpLSFZET3YxRkpUVFFHNWlHbUpsaUNCdFNHQlpueHBwOGJ3TFVQbHlYM1RwQ3NVYnNRZ0lOZjhDOHRwaUFOczFwakRtcms2R3krRHptaXloS0JIckJPbzcrSFIybkFVZjg5SEtsRGVYZ0h1T2hqN1QySTVodWJXMWR0NFQrak9uWGdvQUdvRnFoTHUwekVjVTFLdmxWTDVNbVl1bUlQV3QzdXoyR2hTVDRWVUdNSThGb2FYbmJwbWhJOURRaC9rYzh0em15TGU3eERwcVl1WUNvR1FMZW1yN01GaEQ1bGU2WklEcytoUzVxZk1aNXQzM2FnbUlkbWd6QUNubkgrVjJIYkVBd2U3V28yVGtJMHhFWXkzV2h4RHR6NVdNQ3dCOG1tMGxNSGZxcGhKUjljYXIxWlBVMnNwVHBIaXV3aUJ5cHI2TDlFTDRsTXFRNzNLS0l1T1hocURYVExTZXZaVzRPS20yQ3dUVkxRYlFLTTlQMnNJck5aSlpIYVZIcVFNNkl6OTFZUksxZWZ0S0xIb2FmSngyTEJWMC9BVURIRXlaQ0tXeFVBTFpMaGtBajg4TldWaDJzV3dBUGtuSm5Ub0FZQ3VzMEFicTBOU0I1ekprcDJJQUtuM0ZqdXlUUWdtT2dwb0J3b0VjbFVjMllUZnc1STIvWWdCdEtEVFBOQnV0bTZjWE5BbmxpLzJ5cFJsa1pBZ3c4UzgvWTRDK0laNWJES0F5a3VnTUt4dkUvR0pscnFRUFZ3SEdudFBZQ3RhRi90YjVEUWFBS0ZkVlBGU3hjaHVJZG9VQmh0QlBtcG9CRUs3TWY5b01RTHVMY2ZLeXZRQ2d2YmFzcnpRRXBaZXc3dzNxU1lzQklvUUU5SzhFd0dwb1lOMWZMZ0h6ZVZIQmF0cDJCdEh6V1RFQTFmMzlzcjAzQ0RxcWIvOG1BOEJqMGFOU3NtSlNPMTZZT2d5RXBDMXM5SW5SRmtTcUllN1o2ZWtEcE8zWFN3QzdXS2FYMXJqcWZhVmRaUUNqWHNrQU8rQ04xSllHUU5LZ3hRQ3hxL1VFQkpOSUUxR1lWTXRKUjFOdzdkeEpCbmZKa0RyREEwcGRnUDZXVWRlTmZZVHJ0NVRBSzBrNWRtVUZxOXhpZUx2aStNV0dQNnB2SGFLbFNWQjU4VEx2Y1dRSm85MEIwZGVKNUpjTEtRSllNaDlwZ1cwQktJeEVNQU5RZ3k0WjRPUGpEeG1Bd3BocXdHMVRjRElBQVduYzIxck9NTk1Cc1JVa29yeGdnR2UzQk5NbXl4djBWdEVxZ3RJeTV2YXYwcmxERXdVMHg1SUJFS3lJbUViN1lLb05OQUpKcXVXTGJhRDdtcEttWlI3N2k0Q1FNdlFqS1N3bVAyZUFLZ0FsR0lCNU13dVJIQXdnbHB1MEF6QnpGcE5VSXlxa2xoekFtcVZKVklaNXZVaEQ0Q3lETHdJNSsrc2xnRjJZamFFRy9BNEQyQVQyTUNkbURZUVhFTzRBNXBRb0dRQkdlZTVuSXkxUWU4U0tTZGNVcUpobDRkeUpCSVM2WGxVTWdMaCtGT1NxMDNUYUJqcTljeC9oZk5INGh6b3hWMVN5U05SOHRtU0Frc0tvMlVTVWFEWWppOUVNUUszRXdTUURZQnljQWNvbGI0bFY3R0xwaUtnb21FOTZoUnZsblZpcUxLQWZnWE8vWmdDNmcyMUIrUTEzOENKZFZNNEE3NnFYd2d0b1ltQm9XV1g0Q0YvVFhlZExwYTR0TTI5NHgyWlJFZ242OUlLNm15L1REdU5HUEs4UUJCVEJ1L1pkaEp5eWpNdWNMWk9qbHdVVHZaYk5QbEh6MlJ5bjJDa3AvSU1DNS9reUNIV0pHSHNBdFJqZll5czU4YUdsS1hnVTNrOFMreW9EY0FHZ0V6RGRnbVVBcGwrUzFWWitnd0dlU3pYZ3R4aUF0Z2ljRkttYTVUUWhEKzFvMDBoWUNRS1pXWDVSMmxpcWxnd1F1M3I2eDdGdFpJeTZ3dzdURjhEUUo2WnZSeWsxU2dCQTNnZVJudlBiQWFKc1dVdTB5R0RKL1dnUjR6Z3Evc1AwQUttVHdtaFc5Q1JiRm05QnZMUWpZcUNpSmo2MFlBQnBkZnpEVlFiUWw0Sm1TQ2NnNjI4emJNcmlkM09HWkkzYW9IWkNxVnRkUnM0Rjh6MFQzWnNNd092SzRvV214WVcxaVpOb3ZkS1p4RW9FdEQ4NmdmelAyTmNQdk9XK3FacDBpWW81SHMyNXd4eVVrUlJrNDFJdnBvMThMQ0I1UlNFdkg5QXZBa1NqT1dacVZoZE1ST0VqT2JzVnNPZWh6aVExS1h4QzJ4OGRKWm9OeThneElyY2YwV3A4YURKQUk4MExZcE5mcnpHQXU1ZDg3ZmVObElFOEVTUmN6aENxeE1rQWc0UlN0N3VBTy9URDVVM3dkeDdJNG9VNjlDNFdZeEtkTzlyWHNXY1FRTzRFeWovZkdMRlROL1puakZ5aVlxd0lvVFRDRG9rMXhJNm9LSDhqeUlGdktHWGZaU2svTTZGckkwQ1VMV3FKbmxvRkU0L0FSckd3WERhQ0hVaHFRbzBJUkpydHM0aGFrQnYzVHNabzQwT1RBYmppUlF3azlQMXJEQkQyM2o2Y3QweGR4OGhHRktpdFo0alhxUDBxU0VFb2RidEw1MmNjTG0rQ3YvTkFGaS8wdnpIRFloSU44WTlaTFJ4QVRnSzlGQUJmS25Wc2FUdXRKMTBXZTJVVjB6MWhoOFFhbmhKQkNyc3JHM2dsaTNrQzJDaE5vU3NBaUhyekltbDF3Y1Fab0hVbmh5ZG1vODBIcENhQjg0OWxXYm14ZVBJbWw0WkxmT2pkK0dZVU5FcUlaaDJrSVltV3FyNHNBRGx0M2VtemI4K1EvZEYwb2lCRlFxbGJYYm9oaWNQbFRmQzNIeWlMRitKdkY0c3hpWjZJdkZhNWpmd1lnZXF0QUw0Y0xiYjBuc1NraTExOXdMS3RqaTloaDRvMTNJeUpXd3Fray9VbzRZaUM0encwS1R6MnlvaDFlNVQveHN2c1ZnVnduMmhSbEJjRlp0RTVJREd1TC9uSHRLemQrcGF5SjVYREsvalF1L0Z0SE1RUDM4cVdtRUk2T0R4eEc5THJsZHArZTRaWWJjdHZLQ0lrUlVLcDkxV1h2SDRlTG04eUxhK0w0b1hsMzBDWXpqaUpyRTR2Y0d0ZmVPeTdFMmlaZndxbEtDL3I2V1V0ZmxkbFJqRXpBWkFrTkNyL3lJdllnd2NCaWFoY0VlK1FSVVNYSVFzQzdib3N5eVFXYUZGMDV2OHk1YkhYdEk0L3dsU2hSQ3kwajJwNzJNYUgzaTB2a1ZEM1JlSGxzaFlpWWR1SnRaSlpCdVJwQXVXd2NpV09lcXlDUkxvaTgwR1NZb2wxYTdrc3V4SkpxaWZuVFFwZ3RnRkcwWWhUNDVSaGNlVUNjYjIwUXVDYkFQMXVlQkt4aW81dnl4YTEyREZsUzRRNGNhSllDeElBZDMvL0Zud1owQmxEaU1xUHhFOFdyTTl5b21CWWFnTUoraTNMSkk0THRDZzY4Yjh1N25KWHIyRzUvQ09ObFJhVTdmazNLZ05SR3g5Nk43dUJoV1RaNXFJYWFoUnJENkNmYmJNNUdvNFVSN0htQkZWakRtSWNjN0lZaGg0L09PMGVIVlp0aDR1VEhXaU1LZWF6S3FlWDNEcXJRSFBxcy9Rb2JlQXMwVTZ3RlY0UDYyMFVta2I1V3NvUHJwVXNLT3BLbUkwUDZaWUFPTkVQbmhMajV0QVpQU1NiYlo1aWpxRmM2U2lDZFY4Uis0RkFaV2VaUkJpd0FpM3F1TzNFd1lWZFQ4TnlPMUd4Z0R0YkRYblNTSlorbWZuM0lpMFdHV0IvRFEyTnJTTXpWbVE5NUtYVk9BOXNJRFQ4bEllb2g1MjB0ekswbUlNNjNjZzBiMUJ4dktTLzAwWi9nSVBReUdIV2hadnNBVXYyV2ZYbTFIdmpuR1FDSlpsZXFWZWJHcVh6a3V3ZEZmMzM5STk3cVhtajlXeWNnSGczeE5wc2x6TlpaalRvTm1FQkN0VGREb3piRURNUlBWMG1VZWpTcEIrNnJvcGlndFBDSWhCcG9xb3lpUVZhZE5MSi81V2pSYTRyaHVVeUV4bDJzQXdzbklRSnNvYVNDa0ttWmdBdno0eG1jaEtKRjBCbTZKWlJSQlkwenVMUEtzTHh5L0hnKys5YStnTlRIeldaV1p3UUptTWlySitkTmtvTnpCV2h6OUhYR0hTWjFBRWw1UTVFbnBKNmtZekU2OEVPWTJlZDNWcVFsRHNGWkg3YWUwVlJVb3JQUFhsQ0cyQkVyYURveHNPcHNzeW9FQW5tQnBhZ3NSeW1FYmtCNlF2MWVHVnBWQVlEYytxbExVTDE2U3JqbFJyL2FOYTRqektKNmZIREVmSEc1UCtDZkZERWFkWSt3OFdKYlMrWXh1TFArTDlnaXdTVEk5eTRjZ2ZjeWE0TmVvZlFpRE1xcUs5ZFNDeUc5WTAycENybDJENTBOZnhxNjMvSTh4SnpzT3VUUmJqRUVOWkRwNDFPRDhhQ2ZCZGFwcWM4ZDByS1lxZTlYYmtNaHdHZnN0Q09vaDVzcDlVOVdwVkZhMlpSVVJTVU9qTThCQ21wbUJRbkM0cENRVkxFSWwyMG1Ma0ZERjhJMk1LNHJkZW92TkZqSWlXNjlkM2V0ZGFzUzR0V3pydW04Y3FCeksxcFU1UTUrWmh6MnFBV3hCYzVDTUxpYmdkTllGcmtPUjdHck9VTWVHNmtrNmpDMzA5a0FHWWZmQUtSTUtOWUNEd1Q3aXdKRGNWY0NUZ0Y1akozYXl6TTI5b0JNaytRejhIT2dKUEZGcit6SmhZbGJVWXJuU3M2dXJwVDluMG1KZ0prUFBPUXJWaEhhY1FjOFpxYnphUFJveDZzRUxYZG5VVnJRR29qNnR4cnBIUVRSTTdhbFFnYjB5L3drR3FXR1VXcXV6SWF3d2lZRENEVHk2S2grc2dSdklnQVVSNXRGaXFFMjFrdkYrSjNTZ1pvV01jbzhvNmpBdG1uUGlaalJjY1pyRFhRZnhqU3JFS0ZYSkpRaE1nZFJOK244UXFyaC85N3AyTUV3ZW1heU5qMHBpZWhKSHN3anNKQ2tHWUJxTkluUnJJRU0yQXVLL01ON1Z0UmszazM1MHJGdExETlhMRjNscHB4MEVBdzRSNnNSa0FOQmpxSmx5WnRNS3M0dlRJbG9SejJlckR3cjlYZGN5OWFRMVFESzRvaVppUkNSQ010cGR3M0M0cDZ6WUlzTTdwOS9Sa0RLTVVCU3BFYXZ2Z0R0QmJaN0FEVkJua1hHWmhPQnBCWG9BNFFaUkk3aGJleXNRcGtIeVFxUVNvYjV1RTg5Q3RjQnN1RnkxUHRYM2loSWJUQjN3emhSL1NHV3dJeHNxSlpJQ3MyNk1ZMFFMSkduaTFmQlhTVDNjQ2ttWWZlT1NtUkxBRmNoUjFCWWNDTnhDYytCMEZTUTg2ejhFNWp0T25QOVFmdWFCbnlzazZEYlpDNTVQV0Z2QXQxMmpVSCs0TTBOYis3VW84ZTl1enVvQnVZSjA1R1J6eUJWSjREczZ4ZE9VaHNoUFlpZVhoUlp2VCtwd3pRRE00b1U4bHNxa1FWNWRHeU1tSlUxdXlVcVg4NnlGUEIybTJZelNnVG83SE9xM1ZrSGk4S21CN0tnSXlzNEpZMVpFK004RWVBdDhkY3FRQUFBMkNNR3BFaFFpUUQ0RE84ZWlVUzFaQVZKbGNNOU0yM1pqUVUzZFdPRFlVaWhyZWtxOXhtN29CejhFRFVtZWpFNXNuWE5MS1dudm5nVkp0YWpreG5BQ2FFQTJNTHRWallobjlrckk0ZUJ0a3kwRnJKeCs2bUY5R0FTV3BRYU5mV2xGR3RNV0UvV1FXdXEvejNTd1pBenZ4aGx5VmFwYU45VktZWWI0aG54dldaL0d0ck5wZWk3TnBhbytYbVFEc29VUWxVVFo4OGlJcEpYZFlRaHJCZ3NSRVZGeVgralR0OUxBSEtBQmk2eklyOVlxa0FWV0VwWDVTSm5mbWpaQUEvQkR0VUZTd1RjNUExbVkxVndSYldMVk1MQUxuUFB1VzJKMzB4QnZDVWtKRzlHb1Z0RUVFdTFKdFR5QUZ4N1VWclZDeFM3aHJqZ3JXNmlmQkNyOEZjaG9IYXZnL1ZIb1c1RmlVRDZQMEc4anlMTWZzcEErQTZ2ZVRYUjJzR01FRUhsZHE5Q3BqTlhvRU1SYUVIT3JWWkNLS0l5a29CNEFFOFJhV2lONmF4S2hRQXV6OURBc2dBY3ZNTVhrZTVhTTFkb1dRcGlqVDNyekpBbG5PL2h5Q09jRGx1UUdJT3JoY2hXVDFVQ2hRVGxqSEZKN0lSNzdTaEZLQW5oYVdqVndTTmdjU3NRR0FyWGxkN1dRMHdnWlZSdkxqRTJqajRRUVdFWjlaWHRrY3V0YmswWndEcHhmMUVUVlBlc0gzSi93a0RtSlVLeG1GNjY1am0zMm9MTlFoMDcvVWR0WFh5cUN5VW5jaXczRndEbEdGTVdJQlZRZ0VJcTY1dkE5VjBBTDBqc21KajNkUGtLTEZXUVdlREY3MWRza0VQVVQwZ0hhcUEyVWVIVnAyUkN0N1Zrcktpc1FBMkF5VDlpaVBNbEw5WTRIOXdINCtXOElCalpoaTRyRUx4RE9yVzNRMWJvdTJjZGVqbWNDQytESVFwSlJGa3BMMVFMaEdwM2N0ZHdOOW5BRlEwTThjaXpSdExMbGFpOHFBb3RLTHRmRm1QRlVEM0hjVWFFRm4yKzQxWENDSTgwVlNaanJYU0VQU21BbitsSTh1czJJeTRXUGRDV1lrYUJKY1orM1gzRE85RGh0TmVDNWtmYUFXOWVZUWJZbUpCUmdrUjRFK01SNEVCakFqQTh0aDlXT05lZ1BNR0VndXJGaCtUWVVYbDJ6bm9oTzJTQWNMTjhSS3lDcGpTeGlXQWJYSlVHY0pUcllyNS94RUQ3R0ZqVjdPajVabWJHZUZVbkZ2Q2cwTXpaMzUybU5JQzFEWXZ0TUNNUTF5d1FNUFNnMFV0UjhxNnQ4N1lKVEFBbkQxTTB3UDdGK3BBcW9Va3FBSk85QkRFaTdKTk1CRkVRUDNBUVRQMTFGUUIwSXZMeWxMTmx2U1FkYnJJQUhOcHlyRGFYQUtnaUJLQjN4OExiejluQUhaSGF6TUE3Yk5SaWg2RkxBQXVTc0N4bVdPWkxBYno3LytLQVJnc0JITVp6Q2hqRitjTEZLT09XWjJaQ2tEN1hyRVB6QnBoVVRtT0RLQ2FFMXRUTVlDcTBEbDhRa2J1NVF1SUNCZUZhMVY3WU9pREg5MXRLU1ZzTGlrakFnQkZkR3NHR0RBZldLdFN3Ym5VQVZ6c1dHM0tPVkZaMFhhWFMwQjdaV2lLMmh0YnM1ZTdEakFNZTFQb0M2SmxaTFhZKzBpbDNkRXBhTDBKVDRWdStkY1k0TFRKdFJiQnZyNFJCRzA2QXpVdGNWYlBNaXgzRUxzN1RQZW9FUllyZ0ROQVAxck5BSzBxb09PdzA3Y1o0T01hQTVpTndaeHF6STFhQUdmejFvT0dOa3RjVnQwUVNtY3d3T1V1Z0lzTHkxczZTS3pEaGxVNTlicmhKRk42UkRmdUkrcXA1ZStMcmQxS09tTnZsNHVWZ2tHY0FiSlhDN29HQXp4eEh5bHNPai84UFFaZzhYbGY2R2UrRWZ5a09kaVVjcTh3NmFobXFuY1VEYjRHcUxnakJ0cWRGOW5PSlFOY3hPclNVL2Q3REpBWnluMDlHQmJRK1FUWnFBRElxZmxPbWx2MUhabVJ2RHZqdEdvN1FJWFdHbUdiQ1pycWpuT0hERFNRMU54VXdNN0NpY0lKcER2K2pwb1JiZTBMNjhCZ1Y5Z0I3bG1sY0cwSnc1Z3hUdjNyQXk0TVBRZHhaZDBVemZEeEZ4bUFueG51T3FyMHR2U0FzYjJLTmdQT3BZbXdFT0p5cWFRcG9DeWNNU084YTFTbjZLUVNlSlVCek1IMzhIc01NSzBNdzZnVFZDYlBlSFJvbkFxQWM4L2xVcHE1bGNUeXVwNjJnMHlVREdDUlgxbEM3bnhXcTRGUVJLbTM2MVVXSDFTdEtzQldVOWF6c3dwVmMrYytHMVZGaEtFYVZWRXYrN3ltTGJIdk1zU3huWWZLUUd6SmQybGc3aDkrbndFV1BGcmFWMElpRXdSZ0ZyY3NNNmNLT1VzUU5nMDNnWnptOUExUEVNUHNsVmFZRVNUTDBCd1p3SkNOUHRuakRRYUFULy94TnhrZ01wVGo4ZTBRMGl6L0ttT0hGY0NtWm1BbVlRZWc3WWJtV3daSm1DL0E0ejNOencxRHU2YlZVVHZ1WFAxdXRQallIbTdOMHMrSGhpcVJMWlJLdjRWMW44TVQ0ZFdvRGg0RXphMVNIMTRmVWJ1VFdlUU9UZTBpZ3RaRTg3WXF2VWxpUVBjQzRHSE8zbllWVFVqanRENTZMSWZPdk1ld3VadXhwd0FMeURRcHFpck9pb3pKcjBadVZsb0J2WXZDR2VLVGp4Q21iUENMbzRMMEZRWkFVTmZ2TWdEMUMvNnFHZUF4QzBDcmFWSU4rSE9ibWtHQy9ocHlXTXN4ciszakFqYWhJME13TE1zajY5US9vRXI5b0FIMWxGU3dCSklrSUZSVWZWUEFQQ3ZjQUN3ZTNkeFQxdFdvM04yMGh0OVhUWUprY0hNSHIwc25zYnhrT3BtOWRManlJTk1XRHdud2tLZDRmSHJXMGFVMFZxNW9sZlBiejlMcmh2ZzZkTERJRk1tTWQ0MjZLNTdtLzZrc0xiV3ZDMmV3eWtPZHJMOE1DNzlrZ0svdlAyV0FqMnNNOFBvV0plQ0JGTTBxVTdveWdQN2FOWWVQSEp2c01EUE1zNFZCQmtzZGFhYlVneSszeHlsUjFrVElzbFZSNGFZbkxicXhoZkpxVkRzUGdqYlg4UWkxM0ZLN1pJVVVpK1BwZEJrbWd0Rm5LRU9VRGdlcjFKVTNHUERGU3NaMGsrdVZSQzIyeXZrSm9kTHZEbXhBQVJaNGVmTjRRRXh6cjVxUWFmNnp0SlFIUjVhbE5MTDJBZ3R2R1Aydk04Q1BQMktBN1hVR0lNS0ZtU1A3TmdjaDI3aWt3NVBKbWR5M0RDUnBaMnFCWWFPR0VkQTduUkdwSjdZS1RvbXFLb3BYZmR2dmczN2F1dDQ5SzZ0UjBmRnlRc2hKeEJRNWRHQUc2Y2x5TzdwMElsQk1IaGVCWml3ejhZNUhWWlUzQk9GSDRzRlJINEV5R1VKWng5WXc3aVVpYnhSWlVPeXloY3dlL3V3Qlc2d3d4RCtNNUkrSWhrWGhqQWp4d2Z2eW9jUVI3Vms4OHZjWTRQRW1Bd2pCdy9SYTZRQm4yM043Z2drejNiTEsxTVp0MCt1ZHkrRUJhbjlHSnQwbUc3VUpqK0tTSnZRQjlmQW42eU9WZFpHaTZ0dTNWN2paZWpXcmw2cWFsVTArQmtFemZOQm9HTkFCQzBYMGdsc3kvRk1sVEJscXluREpUVm04SkFxRDJSK0k4VWJBTVNZaGhURW1ZNVNYWXBrY2h4OU9vMElIcVV0TUFNRG5SQUJGcExyaC9wVGFDT3Z5d2tUT2hndzJucGpZQWY5OEszNlI1V04vaXdIeVI4MEExSkk5OW13SkdBbTJLMnV6dW5taHh4NUZxQ1hQTVl2WFN1WnlWQVhzREpnaXJLNm5FVm5HR01mSk9tTk92V2ZTTktOM3RiSHFtelNqRkJVZ0dLdThtbFVVYm5yaGVzZ0FZcU9oVXhVTkViRFdJOU5ON2duS1JMQzVOaWRSWGE5SXorSGZYdXdJSEVDRVNDN0xHVk5yT3pBK0s4NkhZQzhrL1N4L1FIUkFwQ1VpaG5GYnVSV1FIeGE5eWh3dmlsNTErdjh2R1NDRFZzcU5xeWhyWmZKSzFHK0FVR1dzcmI2d1JyTkxKMmV5aUdsR1hMS2lUdjRIR1U4L21ZUGpvcGFZMVdjU2dZZEk5S3h3c3dHTk5scU1heE1qclRUYU1GbzhRWFNza0lMcWlrNUxOQkNVTGFmYkh2RnlJRDNvSWo4VDBWVVVCQU9oTExvbFhMMHBobWNVeW16c1prVTFTaHRJSGg3WVUra2plWFY2eC95ZUdid0sxSjVBNTNCLzY1a2hQaFpPMCt0aEUyTUdJSkFmQmNUL0FnUE1HV2FHZUVzWW5lYWVWeHgyQW1wRVQxNWxTbWVnb1NhZllrN3JENDI1aGgzeUVneUx2V21pV3dQU003V3A1YzMrRXNyek9FakdFemlmZ0JkaGJEc21HNEdTV0M3Y0ZUdlRCckhhQm1WYU1TMytwRG9Rc2pZTGdwRlFpRzVoVEl0dnhxM1VIb1J5Mlo0dE1oVW5VZDhvSXFObm1NUysyd3VGazFydCtONU5QNk1xcHJ6WE1BRStDMmw3WVc2QUFwRWNRT2ovK3d4d0tPTUI2TzFqdlhzbTJUdnRHWEM1WTVMT0hKS25CNHkrSVVYQkFaZ2FMb2Z4USttUE9YQTU3a0l3MW5nTDZZelVTSWw4emJWNHhnVTZpWFRLQW9ic3dpS2dYZERnR0VvQkJDVi9HNGoza2hOWlRzL2RYN1Bja09zSXZJZjRzb3JQVGpVYUdxSXlLa0tjSUpTam1lRUNncnZESGNmek1BNXNvRXlIdlFmVEd6K1FuNDN4akdMbk9QY1lXMG42MGFCcG1sbVUzSVlCNEwvL0JmMkRBZWJ6RmdPRU9TT2hSY2tBN3UyTGV2ZEVSbU1DbTRZRzdneWhxQUEvM1gydy90NHN3QWhFNURta2VVdzBiQTJHOVdVT2pWbzNJYmhFdm1hL2x6Wk1Jcm5TVnlCMTBDTW5RVE95T3ZRc3U4N2Y5TGUzRXpPQW9iZjRQcFcwVkh1NTdhYzVzYWo1em1OcGFsUVFMVmtEa0lKb0E1bzcxS3puMEFFVjJ6ekFHR0MzK0RyRkdFUmpNMXdOeFlPbVREckhyUldoOWcwMjJpWUJXRHhlNlg4SEMvUW9yVXhnZ0RwZlJTWWtvVGU4NDdYck1iSmJtQmF0cEFyVmJtbm9td0YyUW1Gc3VYTjAvcHQycE5UbVdsM1dJVnVpaFVabTZsRVU0Y3VxNllZNkl2STErNzI0S1F2dkVKakZJc2JjeWk4QjNFZmc0eW9DTFBDUitSdEM5RUliVFFsbmhNUnBPVk9vOHE0Yk0rOHl1b1ZwSnJFZlhnK0txSXBzZElVaU9xZFJheGFpMjNwK0lGRUE5SEpsZWpQZDJrWUNqWjE2a21DR0x3dmZteFZGTjlCNnhKeEFzdjRMK2NFQW04S0VjYyswQUhXK0NneXlSMDd3QjBlYjBNQTMxcVczbFpSeW5TQVR0MDRrL2NkcHFmSnFsSWsyUkUyL1lxZHRlKzhvd21jMFFtcGl5dTFuMEMwc2NtNzhnY1VBSmpVNXljdVlPOTNRQTVnQjh5RjVUdGUxcC9QaEl0amVqNGFPdzRTem15czJra1Z2ZlNnWW9JcU4wZlEweFpsc2pLbDBMNVA1SFFZcmNhSFIvY2UwckN4ZjlPNHhsWWp4ZGlWUHFDMEJrNHdwNXdldUFMWXdzZXlKU29vRVlXaEM3RFJoQ0VXUXpLUE9WeEVKU2ZRSDYyMnlkajJzak56YmpGVldoNVpzR0VOQVRLbUhqUUV0TktSc1BnOWtmSXg2MHRMcHRqWnlJSVMyQjV2MGhFYXczcjlCdGpQeVgvdmNKaitOQXVmTm5GbWJFZFp1UUpBNTVvd0Z2U2dvZ1lXb2N2L2lZUlJrZ0xaRnlndEdpRWFGRThkWEdLQi9sUUdzdXVDNm41cFVMQUZ6QW9NaW9uZWdkU1NhQWtEQWlqMXJKdS9BSkdUZThpNGphVUZ0MEJ4a3B1blJCTjZVUGx1bjhEOGxBM3lmWWxlSnlZZThBTkM1Y25mamlwYit3Qkg4ZU1kR0t5c0VRODdIUG5rRGFMQmhnM0VKeXRFeGFlazI3TnBMa3RId0pGYXlDcGFMc010Qzc0WDFtTUdSdXBaWmF2OE5qUDJZS05xZGF5MXdPWjdDa3Q3aWhaQU4yWEFqSUVIT2NOVjNhWkhsVmxFS3lvdFJJMXNaQ3REMEtKd2p1MXViQWVZRkExZ1luT1ZSZDZGdVNRMVgrTTlUWG5FRjBlSkdaNndEa1lEUDN3VitDMERSTWNFSHJyakpUOHlmN2RaTm1DaHZ6KzFrd3ZtSzFEREpBTFlCZm1jYjR3VERkRWFuSmptWW9tMW10RlhSbEFIVENPYXI3Vmpmd1FKN0ZxdEFWZ2psbm51OGpNeHRZeC80ZStBMmdVNXVPWnNCcW5UWERNWUhuaG11bVI0Q3Q1aXorTWJXK0lTSnBkYURodkNvZERTdXFRTzU5RlZ6SkNPRFBlNXgzbmNHZ0l0WEtlRlpmVjBMcWxLMDhqb3hkT28vdWRaaXBnSXpsQXlRMm5jNmhOVmJSUkVEa3FGMWF3WUFVUlc1Qm9paGlYaStDd1luQUZmbWFnSVh1aVlNaTZYSlVKK24wS0JjRXlONVF3Q2dpY0RIcXB4RjJYVVJVRkc5ckF6SzBrU044eXcwOTZyL2thZHNCZ09VcXpLQ2RZKy92NEw4cWhaU2FkaEEvT003a1FTV1Zpc0E4TlJmUUNxNngvMXc4S3pab0RYbXVzbnBZVGgybGZZRDVZck1DNm9zQWZkems5WUtWQTFkMDBDRmdCcjU3UXdROFpjSnAwRlAyYm9SSGFscGFKdEZMN1R0Z09HU0FlUXhhNGptQ3diQXNxUy9zdUk0YzU1eENTQlJYV1ZaV1FVbDE4aThuQUpOYWFtNGJjeUdvUlpMU3RyRTZaLzJSb2lOV2NHK1FnQWtBK1NlRjBzcnlpVHI3QzBNeW5CT0hPbUdoTHVLcHB3SE9uMU5mTU1NYThvQW5qcDI4bmM3cHFMWnB3eEhxT3JBZXFNR2FVV21kSWQwTUdDa2tWbk1ucUplRStRQWRTT3VoT3VGQjhZYUF5ZzdZR2xPYTRVNUVNa0FqSHNNQmtoQVRaKzB0SjdlT3Y0ckFac2FYbEFvYzNNb0JISTBHSUFaY20wWGdFZDRVanE2bERFeHRKVTV6M0p0ZkxKTnk0ZzRaOWZJTUxsaHQyNHBVaWRTTzJuK2ZWUWZRV2plUjBobHBHc1MrcHNBWUl2TW4yNnhzRlNIa1I2RzNacnAyclh1N2tnK3dveTVlRUViSy9qbTFGQnZMRUR5UHlnMmVLVGlQRUpzT3JzVmNybDJPdGhZK3FUdDkzUWJXOGhPNlRsN1R4WWtRMkw1ZmcyZ1h2YzlLbkp6alFFWUFyUklCckM0eDFFd0FOUnNQQXQyN2F6aHM0aUdKekxFUkQxWW1lRlhWRzhpcnJtN2w4bWJzV011cGdHYmlxMnBrNnpLZVpaRTlmd1ZoR3REbm9lVzlzV3RWSFRCUFFocWsrWmU2MTduTFBKVzZrOXA2UU1xR0VDdWpUMHZhK21vdFVhN2RWaGdVQWJUeW8wZHBhdWJLWFBuZ0FPNFkxckRVenV4eEdvYjd1MEFNbFdsUERBOE1tTlUrQzQwV1FLb0Zqbm1wVGNYVHhYYXUxWFBlNnk2QzM1anppY0Q2T0xlUk5rS1IrSlhERUR4M29zbFlLenZ0azBHZUdkZGp4NytnUnJZRHFYbE50RFZGWUxOTFpCN3hXbE4rNTdFRmFNajdMZGJCanNXeGlrbG1iUmxtZk5zR1VUMUREWkU4WVZHaHNrdEJLVXhKYnRJYmZ4cjAxeE9RcE0vcFNrUC9NRGZiZm9qUXdncGFDdW1aZVZCdHc1d3IyRjhxWFRUN3JYV1RiRFNuMHBLNUttZkszYWY1WWU1dHdQSVZDT3RZbU9FSkRZU0JDSzlGTytXWFdYWHFJcGt6Mks1Y0dER3JDZHJ0bG9WM3BFRFZxQVVlbGVVaXRhUTNaNGg2VElnVHhHaVpBQVo2NUlCd0pmZ0luUVIvbEdIMHVJMUlCUXBuV0hoWi9Gc1hSTTNidUdueVYrWmxudHB3TjVMSHdJU1NVcWp3NThLZWhLVmVWZTRsNlpHaHJ4SGNPUXJCMVJkcEhiUUhFUkhBOG4vOHc5YitvQ2lZUXRYeFBYQUdqYzdiYkxiNWlDeXZ2aWNVdzdJVkFhc0dRMnNyMHdON3VXWVhHVUE4c3VSM0JpSkpKWW0vN0RUSnNwTzZJK0NTOWluSys5b0hWNmljY3lVYnNSdUhPTk03SEdEVmNHeEVRNDdiT1o2TWNMdG1EYWozM2hCVGhGbk5RTkVrR3JtNEdpRjBuSk9rNjFET2lOZlg2UnNWU0tuZHkrOWdSaFJ1dm94djBneW04aTUvMHFpTWhoZ0V6UCt1TmQyaEJBWGNzclZ4NktMMVA0blNLNU56c05mUW5MN2liOUovMnptZnd3R3dNZVk3WWNxcXFtNDZGWXlNS1B6UUxVdkNGN3Nqb21mUXJuMXdUbUQ1QVk5NjF3UE1zczEwa0ljUHFWemJmR1FCSU1nYk5CWWdxWHVsTU4ybHRyRnQ0RnJlU0ZpbkxFTjVPWncwTVNtbnlBaUJBOHlFN3Z0S1JiU3NURGxQUmlnSHd4QW1HZ25rbUxXb2JTYzAxellRanJ2cVlBcmlhdmdPMjYvcHR4R3kwRVFkYlB4V1N3MEt5ZXlkaWRScWJSUmJSTzY1dXcybXJhN1NHMzhDMWNmaUI0azE1L1M4YTgwK29DeU1kRXRHV0FZbWptN1Z6QW9lOVlYc3lxREExampoOEJLMWZPRjJoQUR6YnJjK0VJc1dQQ1crOGM2U2pPWnNtZkxMRUk0bU5vKzUxd3B1REU4S0tyWWtsU3dZTFZCcGMrVzE0Y1IwT2pxTmNSRzZNc3dxMC9icWlCZjRqbStaeHNxYkN3WUhqRFJiaVJTakZEYW5OT3hwWFlLTTdSZ3ltbU5qR2pXMEpHU0d6N1EwTVFSanVjVGVXK3RGdVJjSWI1cmVZNi9iVWF6aDExVit4ZFMvbDl2LzBYN0YvK1pDNUQwWi9Pc24yQUFsM1dQR0ROclVYeGdRcm1PS004RkszM0RKUGYrd3EyZWlvRkZLMlhHV25IVm9SamN2M0lwYnl4NjIzMFptakZjYko5Wk1aY2J3eWoveWIwOE1QeXNMa2ZuWTJmSGZsektrRS9zcDBlbFhWRS9KSE44VTJIano4eUdtVWt4bDlkaWRuUnFwblRtQmt2OUhKaldYejV4WnlRMEpiZWFSRk1SNXl5T2laemRTVlFvN2g2NWsyczQvZmlVNlZWWDJaVE9SbmVTL0gvKzUzL1E4ejlCL213Y1dLdjBxdnZkdEZWekI0ekdtV01lU3dYVWZKRCtqSU1BL2JrTUZBd2d2eWdBTUtxQWluQXA3M3VRZUNBMUZMZllndzVBMngwYXJheGtWS1ZaSkRreFA4WXcrNW1DN05VeSt5RWhJejBMcEd6a3I0cVFESVRrUmpiTXQweUtxU2JzcW1HU2Y1WFMrZjhuNzJ4YjRnaUNJQndTQVNFU0NMN2xJQndZRHdJbjkvLy9YcWI3cWJxYTJmc1VSQkN0alh0dWFRQ3M3ZGwrbTk0U3FCM3dQV1pOOExYdnJ5SktSTlJGMDhVVFB5NkdESTJrK1NicnVTR1RoZ2tWUkhQaE5DUS9EZlIzeUw4Z2YycnRIazFXRW5xSmc4bEIxdlAvbVRlOTFsKzRhNlI1QXR4TmcvTUcxUzVBaFFlMTJudW1UTCtMVkE0WkNiM2ErMzNyRitsaTd3SzNTYXVLaERUeTlxcUt0dUZUNi9kb3o5UVdCU2JZeloyeURLbnQrZ1lmS21RT1M4NFJ4US9MNnV4MWU0NjJEZ2k5cUx1MTRnS0dIRDZxeW9kRDM2em5lb2EzZVMvVUNuUStiUVhQOXhjM1FPUDV2czVMMzArUWlRbmUwL0hrTzRCd3NZMy9DWGN2b3pQN0ZpQThjSUt0bnRCMy9kcEg3WUpsUkI5N2d2SDRkdGo3STBjNkR3WTg5cHVhQmFuSm9zTFQ3ZU5LRmhWSUJDNkZielRCT0E0YjVRd1hPL3BNOE1WejJIQXJyVlpuVkczOStKWUxmTHM2RFVUY2FGb2ZrVEdHREcwVUw3Y3Q2L2xSeG8wNVgxREJsLzlDMldrZUFSaWMrMzRDdWNhVTMvSC9mQWM0RVhSZnI4MVZQcENhcFpPQWQvVXo3WURUeUlYSFVlOFlwMWJiUXpvTHVKcDZCd05nRTBWYVJtNnlzWVU3WVBBMzRlMlhNVTY2cmc4NFowanJDY1p3ck94TVJ1M1dVajVJcHNtY2MxaHhaTWFVSFc0bDJ0S0JnaHQxaXh1UVppV2krYWFCUHBzNVRzOXdZT05lcVZlZ0ZOMDRnVTdaUGk1STZxWDExL3ZlMDRDV0pNQzF4bWU3REZEdC81NUtJSC9oYWd6ejBhQlB0MnlSRUtQUEc4S2dZellEOTF2WHRzWm9DNC9oVHZGMHUxODRaNjJzSmhpTEs5aGIyL05LQ0Q0VHFPWElLbzNDOGNmV2FNdUhFSEhyNThockdiRmpzK2lwYzJHY28zZ2hVaS9VNjFEeDNvRENRUGVodXUrSGpPeFhYR1BYMFhzU1gzbUN5MXRQa3dhazExNDkrZGRFaUw5MEE2akIvL3ZJTVhndzZkU24zN3NvdklvSFA1TTc1ZlNib2haaDFJYkhMM05vaFpET2pEY2c0ZXl0SlFCTE1zMUsreFIzRy9QR1pHRml2c0tnV2JsUnQzVkZValMxaUJZZHFTZTAyYVB2MjBJWkh5ZUNjSXZjOTlOeVZ6NU5yakd2d2JxdG1XNGRDMUNDWVl0d0NnRzhXV0h2Vm9BdWJZMnRRdlJlNmRVb1k5UytSeE1mV0xTZEVFdDBiVGpkRFJEdC9BRFdrOXA4L0xJSVdVd29ZaXR4ZjdlSjB6bmMxdUdUWmNiV2JiT3I1LzBpbGZzNjJpSnVIUEdnV0w2Z0E2N2ZIclZ4WWs0RkUvRFNUekNuZ3RzMVZwYWw5TzgyTkFiOGFraEFTb0dkK0VnelVOY0VyanpHaU1LRzJrTHg1VmkwazlxR09FUCs5NFdCT296YThtdmVwQkNCNjREMG85eVhqU1c0Qmk4NW9TcVdiWnZGaGpGcnJteTdJbEEzcXI0M0REdmRiUExlUGFpZlFLMW8ybDFRYWpuTFVrWEFicUx0RWQ4YUV6STFBeEFFdXdHY25YZ2FCNi8wR0hxelNWRzU3cXphVFV6d1N1NURDblVZTmRQd2M5NGtVVFRhMWtlNFhGN20wbzQyWlovcXdJSWxzVlc5dEdxKzNqMVNEbmJsUzYrTTdXYXVlb2FUdWEvWk9wU0QxWWxDSlA2TmdXYlo1WnAySUV5UmtGbTNRQy80WFFaRGJBU1hzN1VreEV4c0RUNkhkSFUrSkx5MGhRWDhHa3c0UW11a3R2c1d4TnF4WlowV1EvNDRPQnd5Uk9aSGRjdyt1UDZrL1VqYTQ3RWJ4cXRPRlB5QnVRcm0va0N0MXBnb01xb3pxRi9ha3pJWUtiTExOZHYvZGJYM1pFbGlvWW1rUXlkUFp0aUFROVEvY2JCY3JrQjkyektuandxVXB2SlZoczN1MFhLdHRDUFJlend3V3B5RDhnZGNCU014VHNjWlh2aThFck84LzhtQ1gxeEFiV1BKaHlXNlhnMGI4ZWJITVdGVWFQUGJKQWx4RlRBSlZ6U1d2Z0w1UHdlNmQweVZML2JLbHhIamhNM3R4T09hQnpmVkw0d2VZUDFaKzlITHVzN1ZiTXBnUVg0MWNEd2RBdlVGYkZvS2xYQmJQbjdaUzVLaWk3Uk5KdERpRWpoLytvbXd2cEJMUWRjNURFc1R3MjRPeTNSckJMUVRXLzZzeExvRnN1Qmozb0dVVGNva0JJWnRiclZTYVlTT0syOFcvR3Z2REZZYmlHRWdhZ2h0b2Fla2wzYWhwMXdLWWZ2L3YxZGtXWDZhUUMrRndKcnFPUmY3YWx2eFdxTnhDNkp2RGVqK1cweDhwRnhDRUlTakVKZnBJMVhpQjMvQWQyek1xWWZZQ0FNUzhBTmlOamNta2RqUWYrVzVsK09YWWZRdlUxbllvVTdhS1FSQjN2Y1VpMW1QNVpkbi9kTWZ6bFFkM3NoWXNBUlN3R2V5cDBDQkN6SHVUSVRIUmVYQ2E4aGczZ1NmODBPenBvWjlaWUNYeUJ5dE80NUl6QklJU0YweXRiOWNpTEhaSHpyM2hldHYxYW9BUVpBUk10MmNGVkxSdERnUDNQYTlCU052S1FHZnkrNGpiT3lpSy9BL2FLUGdoZUpWNUQwcEw2eGxFM2ZXRTN1RGIxSmV4dUUrcjRxdTNBTXBkRGZFQ2RkZ0FUeE5NSi94Q0FCOGd5RklPeHExQUo0aEw0Qk9GdmdabEwwaDJYbDNXMDJzSjRCL2VLTWRqc0lmNlFRclUzekJ3a1pmeGpXaTVwNVRZZGhxZm1JOXNRWUZzbkF3a1ZjMnNVTGdOK2l1RzBqeHNOWEVlMlFGQ2dwREJOdk0yTmpKNi9pT2xicTVqblkyeXdQNi9LKzJBQXF2ZE5MTnZHM1p5RElFZnFmQThycklMSk5vaHlQQUNoUVVoNEp2Wm5HWUQ0SGY1TEs1UkE4OEQ3aFdBQ2hRQkFsZDA1RkhYZUQzRmlPYkYwWGRpZWF4bnRqYlNoUzJsYVZkaDduWE5mcEQ0R2NqV2hTVitVcldFd3RSL0FCdHd6WW0rSXhTbHdBQUFBQkpSVTVFcmtKZ2dnPT1gO1xuICByZXR1cm4gaW1hZ2U7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBmbnQoKXtcbiAgcmV0dXJuIGBpbmZvIGZhY2U9XCJSb2JvdG9cIiBzaXplPTE5MiBib2xkPTAgaXRhbGljPTAgY2hhcnNldD1cIlwiIHVuaWNvZGU9MSBzdHJldGNoSD0xMDAgc21vb3RoPTEgYWE9MSBwYWRkaW5nPTI0LDI0LDI0LDI0IHNwYWNpbmc9MTIsMTIgb3V0bGluZT0wXG5jb21tb24gbGluZUhlaWdodD0xOTIgYmFzZT0xNTIgc2NhbGVXPTMwNzIgc2NhbGVIPTE1MzYgcGFnZXM9MSBwYWNrZWQ9MCBhbHBoYUNobmw9MCByZWRDaG5sPTQgZ3JlZW5DaG5sPTQgYmx1ZUNobmw9NFxucGFnZSBpZD0wIGZpbGU9XCJyb2JvdG9fMC5wbmdcIlxuY2hhcnMgY291bnQ9MTk0XG5jaGFyIGlkPTAgICAgeD02MzYgICB5PTE0MzggIHdpZHRoPTQ4ICAgIGhlaWdodD00OSAgICB4b2Zmc2V0PS0yNCAgIHlvZmZzZXQ9MTY3ICAgeGFkdmFuY2U9MCAgICAgcGFnZT0wICBjaG5sPTE1XG5jaGFyIGlkPTIgICAgeD01NzYgICB5PTE0MzggIHdpZHRoPTQ4ICAgIGhlaWdodD00OSAgICB4b2Zmc2V0PS0yNCAgIHlvZmZzZXQ9MTY3ICAgeGFkdmFuY2U9MCAgICAgcGFnZT0wICBjaG5sPTE1XG5jaGFyIGlkPTEzICAgeD00NTAgICB5PTE0MzkgIHdpZHRoPTUxICAgIGhlaWdodD00OSAgICB4b2Zmc2V0PS0yNSAgIHlvZmZzZXQ9MTY3ICAgeGFkdmFuY2U9NDAgICAgcGFnZT0wICBjaG5sPTE1XG5jaGFyIGlkPTMyICAgeD0yOTg3ICB5PTEyNDIgIHdpZHRoPTUxICAgIGhlaWdodD00OSAgICB4b2Zmc2V0PS0yNSAgIHlvZmZzZXQ9MTY3ICAgeGFkdmFuY2U9NDAgICAgcGFnZT0wICBjaG5sPTE1XG5jaGFyIGlkPTMzICAgeD0xNzE0ICB5PTc2OSAgIHdpZHRoPTY2ICAgIGhlaWdodD0xNjMgICB4b2Zmc2V0PS0xMiAgIHlvZmZzZXQ9MTQgICAgeGFkdmFuY2U9NDEgICAgcGFnZT0wICBjaG5sPTE1XG5jaGFyIGlkPTM0ICAgeD0xOTk5ICB5PTEyNjMgIHdpZHRoPTgxICAgIGhlaWdodD04NyAgICB4b2Zmc2V0PS0xNCAgIHlvZmZzZXQ9OCAgICAgeGFkdmFuY2U9NTEgICAgcGFnZT0wICBjaG5sPTE1XG5jaGFyIGlkPTM1ICAgeD0xMjE0ICB5PTk1MSAgIHdpZHRoPTEzNiAgIGhlaWdodD0xNjIgICB4b2Zmc2V0PS0xNSAgIHlvZmZzZXQ9MTQgICAgeGFkdmFuY2U9OTkgICAgcGFnZT0wICBjaG5sPTE1XG5jaGFyIGlkPTM2ICAgeD0xNjEwICB5PTAgICAgIHdpZHRoPTEyMiAgIGhlaWdodD0xOTYgICB4b2Zmc2V0PS0xNiAgIHlvZmZzZXQ9LTQgICAgeGFkdmFuY2U9OTAgICAgcGFnZT0wICBjaG5sPTE1XG5jaGFyIGlkPTM3ICAgeD0xMzQxICB5PTU5NSAgIHdpZHRoPTE1MiAgIGhlaWdodD0xNjUgICB4b2Zmc2V0PS0xNyAgIHlvZmZzZXQ9MTMgICAgeGFkdmFuY2U9MTE3ICAgcGFnZT0wICBjaG5sPTE1XG5jaGFyIGlkPTM4ICAgeD0xNjU4ICB5PTU5MiAgIHdpZHRoPTE0MSAgIGhlaWdodD0xNjUgICB4b2Zmc2V0PS0xNyAgIHlvZmZzZXQ9MTMgICAgeGFkdmFuY2U9OTkgICAgcGFnZT0wICBjaG5sPTE1XG5jaGFyIGlkPTM5ICAgeD0yMDkyICB5PTEyNjMgIHdpZHRoPTYyICAgIGhlaWdodD04NSAgICB4b2Zmc2V0PS0xNyAgIHlvZmZzZXQ9OCAgICAgeGFkdmFuY2U9MjggICAgcGFnZT0wICBjaG5sPTE1XG5jaGFyIGlkPTQwICAgeD0xMDMgICB5PTAgICAgIHdpZHRoPTkwICAgIGhlaWdodD0yMTMgICB4b2Zmc2V0PS0xNCAgIHlvZmZzZXQ9MCAgICAgeGFkdmFuY2U9NTUgICAgcGFnZT0wICBjaG5sPTE1XG5jaGFyIGlkPTQxICAgeD0wICAgICB5PTAgICAgIHdpZHRoPTkxICAgIGhlaWdodD0yMTMgICB4b2Zmc2V0PS0yMiAgIHlvZmZzZXQ9MCAgICAgeGFkdmFuY2U9NTYgICAgcGFnZT0wICBjaG5sPTE1XG5jaGFyIGlkPTQyICAgeD02NjQgICB5PTEyOTQgIHdpZHRoPTExNCAgIGhlaWdodD0xMTQgICB4b2Zmc2V0PS0yMyAgIHlvZmZzZXQ9MTQgICAgeGFkdmFuY2U9NjkgICAgcGFnZT0wICBjaG5sPTE1XG5jaGFyIGlkPTQzICAgeD0wICAgICB5PTEzMTcgIHdpZHRoPTEyOCAgIGhlaWdodD0xMjkgICB4b2Zmc2V0PS0xOSAgIHlvZmZzZXQ9MzQgICAgeGFkdmFuY2U9OTEgICAgcGFnZT0wICBjaG5sPTE1XG5jaGFyIGlkPTQ0ICAgeD0xOTE2ICB5PTEyNjQgIHdpZHRoPTcxICAgIGhlaWdodD04OCAgICB4b2Zmc2V0PS0yMiAgIHlvZmZzZXQ9MTExICAgeGFkdmFuY2U9MzEgICAgcGFnZT0wICBjaG5sPTE1XG5jaGFyIGlkPTQ1ICAgeD0yMzMgICB5PTE0NTcgIHdpZHRoPTg4ICAgIGhlaWdodD02MCAgICB4b2Zmc2V0PS0yMiAgIHlvZmZzZXQ9NzQgICAgeGFkdmFuY2U9NDQgICAgcGFnZT0wICBjaG5sPTE1XG5jaGFyIGlkPTQ2ICAgeD0yODI4ICB5PTEyNDUgIHdpZHRoPTY4ICAgIGhlaWdodD02NSAgICB4b2Zmc2V0PS0xNCAgIHlvZmZzZXQ9MTEyICAgeGFkdmFuY2U9NDIgICAgcGFnZT0wICBjaG5sPTE1XG5jaGFyIGlkPTQ3ICAgeD0wICAgICB5PTQyOSAgIHdpZHRoPTEwOSAgIGhlaWdodD0xNzIgICB4b2Zmc2V0PS0yMyAgIHlvZmZzZXQ9MTQgICAgeGFkdmFuY2U9NjYgICAgcGFnZT0wICBjaG5sPTE1XG5jaGFyIGlkPTQ4ICAgeD0yMzkyICB5PTU4MyAgIHdpZHRoPTEyMiAgIGhlaWdodD0xNjUgICB4b2Zmc2V0PS0xNiAgIHlvZmZzZXQ9MTMgICAgeGFkdmFuY2U9OTAgICAgcGFnZT0wICBjaG5sPTE1XG5jaGFyIGlkPTQ5ICAgeD0xMTIgICB5PTExNDMgIHdpZHRoPTkzICAgIGhlaWdodD0xNjIgICB4b2Zmc2V0PS0xMSAgIHlvZmZzZXQ9MTQgICAgeGFkdmFuY2U9OTAgICAgcGFnZT0wICBjaG5sPTE1XG5jaGFyIGlkPTUwICAgeD0xNDQzICB5PTc3MiAgIHdpZHRoPTEyNiAgIGhlaWdodD0xNjMgICB4b2Zmc2V0PS0xNyAgIHlvZmZzZXQ9MTMgICAgeGFkdmFuY2U9OTAgICAgcGFnZT0wICBjaG5sPTE1XG5jaGFyIGlkPTUxICAgeD0yNjYwICB5PTU3NSAgIHdpZHRoPTEyMSAgIGhlaWdodD0xNjUgICB4b2Zmc2V0PS0xNyAgIHlvZmZzZXQ9MTMgICAgeGFkdmFuY2U9OTAgICAgcGFnZT0wICBjaG5sPTE1XG5jaGFyIGlkPTUyICAgeD0xNzk0ICB5PTk0MyAgIHdpZHRoPTEzMiAgIGhlaWdodD0xNjIgICB4b2Zmc2V0PS0yMSAgIHlvZmZzZXQ9MTQgICAgeGFkdmFuY2U9OTAgICAgcGFnZT0wICBjaG5sPTE1XG5jaGFyIGlkPTUzICAgeD01MzkgICB5PTc3OSAgIHdpZHRoPTEyMSAgIGhlaWdodD0xNjQgICB4b2Zmc2V0PS0xMyAgIHlvZmZzZXQ9MTQgICAgeGFkdmFuY2U9OTAgICAgcGFnZT0wICBjaG5sPTE1XG5jaGFyIGlkPTU0ICAgeD00MDYgICB5PTc3OSAgIHdpZHRoPTEyMSAgIGhlaWdodD0xNjQgICB4b2Zmc2V0PS0xNCAgIHlvZmZzZXQ9MTQgICAgeGFkdmFuY2U9OTAgICAgcGFnZT0wICBjaG5sPTE1XG5jaGFyIGlkPTU1ICAgeD0yMDgyICB5PTk0MSAgIHdpZHRoPTEyNyAgIGhlaWdodD0xNjIgICB4b2Zmc2V0PS0xOSAgIHlvZmZzZXQ9MTQgICAgeGFkdmFuY2U9OTAgICAgcGFnZT0wICBjaG5sPTE1XG5jaGFyIGlkPTU2ICAgeD0yNTI2ICB5PTU4MSAgIHdpZHRoPTEyMiAgIGhlaWdodD0xNjUgICB4b2Zmc2V0PS0xNiAgIHlvZmZzZXQ9MTMgICAgeGFkdmFuY2U9OTAgICAgcGFnZT0wICBjaG5sPTE1XG5jaGFyIGlkPTU3ICAgeD0xNTgxICB5PTc3MSAgIHdpZHRoPTEyMSAgIGhlaWdodD0xNjMgICB4b2Zmc2V0PS0xNyAgIHlvZmZzZXQ9MTMgICAgeGFkdmFuY2U9OTAgICAgcGFnZT0wICBjaG5sPTE1XG5jaGFyIGlkPTU4ICAgeD0yMzgzICB5PTExMTMgIHdpZHRoPTY3ICAgIGhlaWdodD0xMzQgICB4b2Zmc2V0PS0xNCAgIHlvZmZzZXQ9NDMgICAgeGFkdmFuY2U9MzkgICAgcGFnZT0wICBjaG5sPTE1XG5jaGFyIGlkPTU5ICAgeD0zNzIgICB5PTExNDAgIHdpZHRoPTczICAgIGhlaWdodD0xNTYgICB4b2Zmc2V0PS0yMiAgIHlvZmZzZXQ9NDMgICAgeGFkdmFuY2U9MzQgICAgcGFnZT0wICBjaG5sPTE1XG5jaGFyIGlkPTYwICAgeD01MzkgICB5PTEzMDcgIHdpZHRoPTExMyAgIGhlaWdodD0xMTkgICB4b2Zmc2V0PS0xOSAgIHlvZmZzZXQ9NDIgICAgeGFkdmFuY2U9ODEgICAgcGFnZT0wICBjaG5sPTE1XG5jaGFyIGlkPTYxICAgeD0xNjg4ICB5PTEyNjkgIHdpZHRoPTExNSAgIGhlaWdodD05MyAgICB4b2Zmc2V0PS0xMyAgIHlvZmZzZXQ9NTEgICAgeGFkdmFuY2U9ODggICAgcGFnZT0wICBjaG5sPTE1XG5jaGFyIGlkPTYyICAgeD00MTEgICB5PTEzMDggIHdpZHRoPTExNiAgIGhlaWdodD0xMTkgICB4b2Zmc2V0PS0xNCAgIHlvZmZzZXQ9NDIgICAgeGFkdmFuY2U9ODQgICAgcGFnZT0wICBjaG5sPTE1XG5jaGFyIGlkPTYzICAgeD04MDAgICB5PTc3OSAgIHdpZHRoPTExMyAgIGhlaWdodD0xNjQgICB4b2Zmc2V0PS0xOSAgIHlvZmZzZXQ9MTMgICAgeGFkdmFuY2U9NzYgICAgcGFnZT0wICBjaG5sPTE1XG5jaGFyIGlkPTY0ICAgeD0xNDIxICB5PTAgICAgIHdpZHRoPTE3NyAgIGhlaWdodD0xOTYgICB4b2Zmc2V0PS0xNiAgIHlvZmZzZXQ9MTYgICAgeGFkdmFuY2U9MTQ0ICAgcGFnZT0wICBjaG5sPTE1XG5jaGFyIGlkPTY1ICAgeD0yNzA4ICB5PTc1MiAgIHdpZHRoPTE1MCAgIGhlaWdodD0xNjIgICB4b2Zmc2V0PS0yMyAgIHlvZmZzZXQ9MTQgICAgeGFkdmFuY2U9MTA0ICAgcGFnZT0wICBjaG5sPTE1XG5jaGFyIGlkPTY2ICAgeD0yMjIxICB5PTkzOSAgIHdpZHRoPTEyNyAgIGhlaWdodD0xNjIgICB4b2Zmc2V0PS0xMiAgIHlvZmZzZXQ9MTQgICAgeGFkdmFuY2U9MTAwICAgcGFnZT0wICBjaG5sPTE1XG5jaGFyIGlkPTY3ICAgeD0xODExICB5PTU5MiAgIHdpZHRoPTEzNyAgIGhlaWdodD0xNjUgICB4b2Zmc2V0PS0xNSAgIHlvZmZzZXQ9MTMgICAgeGFkdmFuY2U9MTA0ICAgcGFnZT0wICBjaG5sPTE1XG5jaGFyIGlkPTY4ICAgeD0xNjUwICB5PTk0NiAgIHdpZHRoPTEzMiAgIGhlaWdodD0xNjIgICB4b2Zmc2V0PS0xMiAgIHlvZmZzZXQ9MTQgICAgeGFkdmFuY2U9MTA1ICAgcGFnZT0wICBjaG5sPTE1XG5jaGFyIGlkPTY5ICAgeD0yNDk2ICB5PTkzNCAgIHdpZHRoPTEyMiAgIGhlaWdodD0xNjIgICB4b2Zmc2V0PS0xMiAgIHlvZmZzZXQ9MTQgICAgeGFkdmFuY2U9OTEgICAgcGFnZT0wICBjaG5sPTE1XG5jaGFyIGlkPTcwICAgeD0yNjMwICB5PTkzMiAgIHdpZHRoPTEyMCAgIGhlaWdodD0xNjIgICB4b2Zmc2V0PS0xMiAgIHlvZmZzZXQ9MTQgICAgeGFkdmFuY2U9ODggICAgcGFnZT0wICBjaG5sPTE1XG5jaGFyIGlkPTcxICAgeD0xOTYwICB5PTU5MCAgIHdpZHRoPTEzNyAgIGhlaWdodD0xNjUgICB4b2Zmc2V0PS0xNSAgIHlvZmZzZXQ9MTMgICAgeGFkdmFuY2U9MTA5ICAgcGFnZT0wICBjaG5sPTE1XG5jaGFyIGlkPTcyICAgeD05MTYgICB5PTk1NSAgIHdpZHRoPTEzNyAgIGhlaWdodD0xNjIgICB4b2Zmc2V0PS0xMiAgIHlvZmZzZXQ9MTQgICAgeGFkdmFuY2U9MTE0ICAgcGFnZT0wICBjaG5sPTE1XG5jaGFyIGlkPTczICAgeD0yOTYgICB5PTExNDIgIHdpZHRoPTY0ICAgIGhlaWdodD0xNjIgICB4b2Zmc2V0PS0xMCAgIHlvZmZzZXQ9MTQgICAgeGFkdmFuY2U9NDQgICAgcGFnZT0wICBjaG5sPTE1XG5jaGFyIGlkPTc0ICAgeD0yNzIgICB5PTc5MCAgIHdpZHRoPTEyMiAgIGhlaWdodD0xNjQgICB4b2Zmc2V0PS0yMSAgIHlvZmZzZXQ9MTQgICAgeGFkdmFuY2U9ODggICAgcGFnZT0wICBjaG5sPTE1XG5jaGFyIGlkPTc1ICAgeD03NjcgICB5PTk1NSAgIHdpZHRoPTEzNyAgIGhlaWdodD0xNjIgICB4b2Zmc2V0PS0xMiAgIHlvZmZzZXQ9MTQgICAgeGFkdmFuY2U9MTAwICAgcGFnZT0wICBjaG5sPTE1XG5jaGFyIGlkPTc2ICAgeD0yNzYyICB5PTkyNiAgIHdpZHRoPTExOSAgIGhlaWdodD0xNjIgICB4b2Zmc2V0PS0xMiAgIHlvZmZzZXQ9MTQgICAgeGFkdmFuY2U9ODYgICAgcGFnZT0wICBjaG5sPTE1XG5jaGFyIGlkPTc3ICAgeD0yMTk3ICB5PTc2NSAgIHdpZHRoPTE2MyAgIGhlaWdodD0xNjIgICB4b2Zmc2V0PS0xMiAgIHlvZmZzZXQ9MTQgICAgeGFkdmFuY2U9MTQwICAgcGFnZT0wICBjaG5sPTE1XG5jaGFyIGlkPTc4ICAgeD0xMDY1ICB5PTk1MiAgIHdpZHRoPTEzNyAgIGhlaWdodD0xNjIgICB4b2Zmc2V0PS0xMiAgIHlvZmZzZXQ9MTQgICAgeGFkdmFuY2U9MTE0ICAgcGFnZT0wICBjaG5sPTE1XG5jaGFyIGlkPTc5ICAgeD0xNTA1ICB5PTU5NCAgIHdpZHRoPTE0MSAgIGhlaWdodD0xNjUgICB4b2Zmc2V0PS0xNiAgIHlvZmZzZXQ9MTMgICAgeGFkdmFuY2U9MTEwICAgcGFnZT0wICBjaG5sPTE1XG5jaGFyIGlkPTgwICAgeD0xOTM4ICB5PTk0MyAgIHdpZHRoPTEzMiAgIGhlaWdodD0xNjIgICB4b2Zmc2V0PS0xMiAgIHlvZmZzZXQ9MTQgICAgeGFkdmFuY2U9MTAxICAgcGFnZT0wICBjaG5sPTE1XG5jaGFyIGlkPTgxICAgeD0yMjIyICB5PTIwNyAgIHdpZHRoPTE0MSAgIGhlaWdodD0xODMgICB4b2Zmc2V0PS0xNiAgIHlvZmZzZXQ9MTMgICAgeGFkdmFuY2U9MTEwICAgcGFnZT0wICBjaG5sPTE1XG5jaGFyIGlkPTgyICAgeD0xMzYyICB5PTk0OSAgIHdpZHRoPTEzMiAgIGhlaWdodD0xNjIgICB4b2Zmc2V0PS0xMSAgIHlvZmZzZXQ9MTQgICAgeGFkdmFuY2U9OTkgICAgcGFnZT0wICBjaG5sPTE1XG5jaGFyIGlkPTgzICAgeD0yMTA5ICB5PTU4OCAgIHdpZHRoPTEzMiAgIGhlaWdodD0xNjUgICB4b2Zmc2V0PS0xOCAgIHlvZmZzZXQ9MTMgICAgeGFkdmFuY2U9OTUgICAgcGFnZT0wICBjaG5sPTE1XG5jaGFyIGlkPTg0ICAgeD02MTcgICB5PTk1NSAgIHdpZHRoPTEzOCAgIGhlaWdodD0xNjIgICB4b2Zmc2V0PS0yMSAgIHlvZmZzZXQ9MTQgICAgeGFkdmFuY2U9OTUgICAgcGFnZT0wICBjaG5sPTE1XG5jaGFyIGlkPTg1ICAgeD0xMjggICB5PTc5MiAgIHdpZHRoPTEzMiAgIGhlaWdodD0xNjQgICB4b2Zmc2V0PS0xNCAgIHlvZmZzZXQ9MTQgICAgeGFkdmFuY2U9MTA0ICAgcGFnZT0wICBjaG5sPTE1XG5jaGFyIGlkPTg2ICAgeD0yODcwICB5PTc0OSAgIHdpZHRoPTE0NyAgIGhlaWdodD0xNjIgICB4b2Zmc2V0PS0yMiAgIHlvZmZzZXQ9MTQgICAgeGFkdmFuY2U9MTAyICAgcGFnZT0wICBjaG5sPTE1XG5jaGFyIGlkPTg3ICAgeD0yMDAyICB5PTc2NyAgIHdpZHRoPTE4MyAgIGhlaWdodD0xNjIgICB4b2Zmc2V0PS0yMCAgIHlvZmZzZXQ9MTQgICAgeGFkdmFuY2U9MTQyICAgcGFnZT0wICBjaG5sPTE1XG5jaGFyIGlkPTg4ICAgeD0zMTIgICB5PTk2NiAgIHdpZHRoPTE0MSAgIGhlaWdodD0xNjIgICB4b2Zmc2V0PS0yMCAgIHlvZmZzZXQ9MTQgICAgeGFkdmFuY2U9MTAwICAgcGFnZT0wICBjaG5sPTE1XG5jaGFyIGlkPTg5ICAgeD0xNTcgICB5PTk2OCAgIHdpZHRoPTE0MyAgIGhlaWdodD0xNjIgICB4b2Zmc2V0PS0yNCAgIHlvZmZzZXQ9MTQgICAgeGFkdmFuY2U9OTYgICAgcGFnZT0wICBjaG5sPTE1XG5jaGFyIGlkPTkwICAgeD0xNTA2ICB5PTk0NyAgIHdpZHRoPTEzMiAgIGhlaWdodD0xNjIgICB4b2Zmc2V0PS0xOCAgIHlvZmZzZXQ9MTQgICAgeGFkdmFuY2U9OTYgICAgcGFnZT0wICBjaG5sPTE1XG5jaGFyIGlkPTkxICAgeD02NTggICB5PTAgICAgIHdpZHRoPTc5ICAgIGhlaWdodD0yMDIgICB4b2Zmc2V0PS0xMyAgIHlvZmZzZXQ9LTIgICAgeGFkdmFuY2U9NDIgICAgcGFnZT0wICBjaG5sPTE1XG5jaGFyIGlkPTkyICAgeD0yOTQ1ICB5PTIwNCAgIHdpZHRoPTExMSAgIGhlaWdodD0xNzIgICB4b2Zmc2V0PS0yMiAgIHlvZmZzZXQ9MTQgICAgeGFkdmFuY2U9NjYgICAgcGFnZT0wICBjaG5sPTE1XG5jaGFyIGlkPTkzICAgeD01NjcgICB5PTAgICAgIHdpZHRoPTc5ICAgIGhlaWdodD0yMDIgICB4b2Zmc2V0PS0yNCAgIHlvZmZzZXQ9LTIgICAgeGFkdmFuY2U9NDIgICAgcGFnZT0wICBjaG5sPTE1XG5jaGFyIGlkPTk0ICAgeD0xNTcwICB5PTEyNzEgIHdpZHRoPTEwNiAgIGhlaWdodD0xMDUgICB4b2Zmc2V0PS0yMCAgIHlvZmZzZXQ9MTQgICAgeGFkdmFuY2U9NjcgICAgcGFnZT0wICBjaG5sPTE1XG5jaGFyIGlkPTk1ICAgeD0wICAgICB5PTE0NTggIHdpZHRoPTEyMSAgIGhlaWdodD02MCAgICB4b2Zmc2V0PS0yNCAgIHlvZmZzZXQ9MTI4ICAgeGFkdmFuY2U9NzIgICAgcGFnZT0wICBjaG5sPTE1XG5jaGFyIGlkPTk2ICAgeD0yNjIyICB5PTEyNTggIHdpZHRoPTgyICAgIGhlaWdodD03MSAgICB4b2Zmc2V0PS0yMCAgIHlvZmZzZXQ9OCAgICAgeGFkdmFuY2U9NDkgICAgcGFnZT0wICBjaG5sPTE1XG5jaGFyIGlkPTk3ICAgeD0xNTg1ICB5PTExMjEgIHdpZHRoPTExOSAgIGhlaWdodD0xMzYgICB4b2Zmc2V0PS0xNiAgIHlvZmZzZXQ9NDIgICAgeGFkdmFuY2U9ODcgICAgcGFnZT0wICBjaG5sPTE1XG5jaGFyIGlkPTk4ICAgeD02NzcgICB5PTQxOCAgIHdpZHRoPTEyMSAgIGhlaWdodD0xNzAgICB4b2Zmc2V0PS0xNCAgIHlvZmZzZXQ9OCAgICAgeGFkdmFuY2U9OTAgICAgcGFnZT0wICBjaG5sPTE1XG5jaGFyIGlkPTk5ICAgeD0xNDUzICB5PTExMjMgIHdpZHRoPTEyMCAgIGhlaWdodD0xMzYgICB4b2Zmc2V0PS0xNyAgIHlvZmZzZXQ9NDIgICAgeGFkdmFuY2U9ODQgICAgcGFnZT0wICBjaG5sPTE1XG5jaGFyIGlkPTEwMCAgeD0xMjA5ICB5PTQxMyAgIHdpZHRoPTEyMCAgIGhlaWdodD0xNzAgICB4b2Zmc2V0PS0xNyAgIHlvZmZzZXQ9OCAgICAgeGFkdmFuY2U9OTAgICAgcGFnZT0wICBjaG5sPTE1XG5jaGFyIGlkPTEwMSAgeD0xMzIwICB5PTExMjUgIHdpZHRoPTEyMSAgIGhlaWdodD0xMzYgICB4b2Zmc2V0PS0xNyAgIHlvZmZzZXQ9NDIgICAgeGFkdmFuY2U9ODUgICAgcGFnZT0wICBjaG5sPTE1XG5jaGFyIGlkPTEwMiAgeD0xODY2ICB5PTQwOCAgIHdpZHRoPTEwMSAgIGhlaWdodD0xNzAgICB4b2Zmc2V0PS0yMCAgIHlvZmZzZXQ9NiAgICAgeGFkdmFuY2U9NTYgICAgcGFnZT0wICBjaG5sPTE1XG5jaGFyIGlkPTEwMyAgeD0xMzQgICB5PTYxMiAgIHdpZHRoPTEyMSAgIGhlaWdodD0xNjcgICB4b2Zmc2V0PS0xNyAgIHlvZmZzZXQ9NDIgICAgeGFkdmFuY2U9OTAgICAgcGFnZT0wICBjaG5sPTE1XG5jaGFyIGlkPTEwNCAgeD0yNjI3ICB5PTM5NSAgIHdpZHRoPTExNiAgIGhlaWdodD0xNjggICB4b2Zmc2V0PS0xNCAgIHlvZmZzZXQ9OCAgICAgeGFkdmFuY2U9ODggICAgcGFnZT0wICBjaG5sPTE1XG5jaGFyIGlkPTEwNSAgeD0xMDUwICB5PTc3NiAgIHdpZHRoPTY3ICAgIGhlaWdodD0xNjQgICB4b2Zmc2V0PS0xNCAgIHlvZmZzZXQ9MTIgICAgeGFkdmFuY2U9MzkgICAgcGFnZT0wICBjaG5sPTE1XG5jaGFyIGlkPTEwNiAgeD0xMzI3ICB5PTAgICAgIHdpZHRoPTgyICAgIGhlaWdodD0xOTggICB4b2Zmc2V0PS0zMCAgIHlvZmZzZXQ9MTIgICAgeGFkdmFuY2U9MzggICAgcGFnZT0wICBjaG5sPTE1XG5jaGFyIGlkPTEwNyAgeD0yNDk1ICB5PTQwMSAgIHdpZHRoPTEyMCAgIGhlaWdodD0xNjggICB4b2Zmc2V0PS0xNCAgIHlvZmZzZXQ9OCAgICAgeGFkdmFuY2U9ODEgICAgcGFnZT0wICBjaG5sPTE1XG5jaGFyIGlkPTEwOCAgeD0yNzU1ICB5PTM5MiAgIHdpZHRoPTY0ICAgIGhlaWdodD0xNjggICB4b2Zmc2V0PS0xMyAgIHlvZmZzZXQ9OCAgICAgeGFkdmFuY2U9MzkgICAgcGFnZT0wICBjaG5sPTE1XG5jaGFyIGlkPTEwOSAgeD0xOTczICB5PTExMTcgIHdpZHRoPTE2OCAgIGhlaWdodD0xMzQgICB4b2Zmc2V0PS0xNCAgIHlvZmZzZXQ9NDIgICAgeGFkdmFuY2U9MTQwICAgcGFnZT0wICBjaG5sPTE1XG5jaGFyIGlkPTExMCAgeD0yMTUzICB5PTExMTUgIHdpZHRoPTExNiAgIGhlaWdodD0xMzQgICB4b2Zmc2V0PS0xNCAgIHlvZmZzZXQ9NDIgICAgeGFkdmFuY2U9ODggICAgcGFnZT0wICBjaG5sPTE1XG5jaGFyIGlkPTExMSAgeD0xMTgxICB5PTExMjYgIHdpZHRoPTEyNyAgIGhlaWdodD0xMzYgICB4b2Zmc2V0PS0xOCAgIHlvZmZzZXQ9NDIgICAgeGFkdmFuY2U9OTEgICAgcGFnZT0wICBjaG5sPTE1XG5jaGFyIGlkPTExMiAgeD0yNjcgICB5PTYxMSAgIHdpZHRoPTEyMSAgIGhlaWdodD0xNjcgICB4b2Zmc2V0PS0xNCAgIHlvZmZzZXQ9NDIgICAgeGFkdmFuY2U9OTAgICAgcGFnZT0wICBjaG5sPTE1XG5jaGFyIGlkPTExMyAgeD00MDAgICB5PTYwMCAgIHdpZHRoPTEyMCAgIGhlaWdodD0xNjcgICB4b2Zmc2V0PS0xNyAgIHlvZmZzZXQ9NDIgICAgeGFkdmFuY2U9OTEgICAgcGFnZT0wICBjaG5sPTE1XG5jaGFyIGlkPTExNCAgeD0yMjgxICB5PTExMTMgIHdpZHRoPTkwICAgIGhlaWdodD0xMzQgICB4b2Zmc2V0PS0xNCAgIHlvZmZzZXQ9NDIgICAgeGFkdmFuY2U9NTQgICAgcGFnZT0wICBjaG5sPTE1XG5jaGFyIGlkPTExNSAgeD0xNzE2ICB5PTExMjAgIHdpZHRoPTExNyAgIGhlaWdodD0xMzYgICB4b2Zmc2V0PS0xNyAgIHlvZmZzZXQ9NDIgICAgeGFkdmFuY2U9ODMgICAgcGFnZT0wICBjaG5sPTE1XG5jaGFyIGlkPTExNiAgeD00NTcgICB5PTExNDAgIHdpZHRoPTk1ICAgIGhlaWdodD0xNTUgICB4b2Zmc2V0PS0yNCAgIHlvZmZzZXQ9MjMgICAgeGFkdmFuY2U9NTIgICAgcGFnZT0wICBjaG5sPTE1XG5jaGFyIGlkPTExNyAgeD0xODQ1ICB5PTExMTcgIHdpZHRoPTExNiAgIGhlaWdodD0xMzUgICB4b2Zmc2V0PS0xNCAgIHlvZmZzZXQ9NDMgICAgeGFkdmFuY2U9ODggICAgcGFnZT0wICBjaG5sPTE1XG5jaGFyIGlkPTExOCAgeD0yNzcyICB5PTExMDAgIHdpZHRoPTEyMiAgIGhlaWdodD0xMzMgICB4b2Zmc2V0PS0yMiAgIHlvZmZzZXQ9NDMgICAgeGFkdmFuY2U9NzggICAgcGFnZT0wICBjaG5sPTE1XG5jaGFyIGlkPTExOSAgeD0yNDYyICB5PTExMTMgIHdpZHRoPTE2MyAgIGhlaWdodD0xMzMgICB4b2Zmc2V0PS0yMiAgIHlvZmZzZXQ9NDMgICAgeGFkdmFuY2U9MTIwICAgcGFnZT0wICBjaG5sPTE1XG5jaGFyIGlkPTEyMCAgeD0yNjM3ICB5PTExMDYgIHdpZHRoPTEyMyAgIGhlaWdodD0xMzMgICB4b2Zmc2V0PS0yMiAgIHlvZmZzZXQ9NDMgICAgeGFkdmFuY2U9NzkgICAgcGFnZT0wICBjaG5sPTE1XG5jaGFyIGlkPTEyMSAgeD0wICAgICB5PTYxMyAgIHdpZHRoPTEyMiAgIGhlaWdodD0xNjcgICB4b2Zmc2V0PS0yMyAgIHlvZmZzZXQ9NDMgICAgeGFkdmFuY2U9NzYgICAgcGFnZT0wICBjaG5sPTE1XG5jaGFyIGlkPTEyMiAgeD0yOTA2ICB5PTEwOTcgIHdpZHRoPTExNyAgIGhlaWdodD0xMzMgICB4b2Zmc2V0PS0xOCAgIHlvZmZzZXQ9NDMgICAgeGFkdmFuY2U9NzkgICAgcGFnZT0wICBjaG5sPTE1XG5jaGFyIGlkPTEyMyAgeD00NTggICB5PTAgICAgIHdpZHRoPTk3ICAgIGhlaWdodD0yMDIgICB4b2Zmc2V0PS0yMCAgIHlvZmZzZXQ9MyAgICAgeGFkdmFuY2U9NTQgICAgcGFnZT0wICBjaG5sPTE1XG5jaGFyIGlkPTEyNCAgeD0yNDUxICB5PTIwNiAgIHdpZHRoPTYxICAgIGhlaWdodD0xODMgICB4b2Zmc2V0PS0xMSAgIHlvZmZzZXQ9MTQgICAgeGFkdmFuY2U9MzkgICAgcGFnZT0wICBjaG5sPTE1XG5jaGFyIGlkPTEyNSAgeD0zNDkgICB5PTAgICAgIHdpZHRoPTk3ICAgIGhlaWdodD0yMDIgICB4b2Zmc2V0PS0yMyAgIHlvZmZzZXQ9MyAgICAgeGFkdmFuY2U9NTQgICAgcGFnZT0wICBjaG5sPTE1XG5jaGFyIGlkPTEyNiAgeD0yMzc4ICB5PTEyNTkgIHdpZHRoPTEzOCAgIGhlaWdodD03OSAgICB4b2Zmc2V0PS0xNCAgIHlvZmZzZXQ9NjUgICAgeGFkdmFuY2U9MTA5ICAgcGFnZT0wICBjaG5sPTE1XG5jaGFyIGlkPTE2MCAgeD01MTMgICB5PTE0MzkgIHdpZHRoPTUxICAgIGhlaWdodD00OSAgICB4b2Zmc2V0PS0yNSAgIHlvZmZzZXQ9MTY3ICAgeGFkdmFuY2U9NDAgICAgcGFnZT0wICBjaG5sPTE1XG5jaGFyIGlkPTE2MSAgeD0yMTcgICB5PTExNDIgIHdpZHRoPTY3ICAgIGhlaWdodD0xNjIgICB4b2Zmc2V0PS0xNCAgIHlvZmZzZXQ9NDIgICAgeGFkdmFuY2U9MzkgICAgcGFnZT0wICBjaG5sPTE1XG5jaGFyIGlkPTE2MiAgeD0xMzQxICB5PTQxMyAgIHdpZHRoPTEyMCAgIGhlaWdodD0xNzAgICB4b2Zmc2V0PS0xNiAgIHlvZmZzZXQ9MjUgICAgeGFkdmFuY2U9ODggICAgcGFnZT0wICBjaG5sPTE1XG5jaGFyIGlkPTE2MyAgeD0xMzAwICB5PTc3NCAgIHdpZHRoPTEzMSAgIGhlaWdodD0xNjMgICB4b2Zmc2V0PS0xOCAgIHlvZmZzZXQ9MTMgICAgeGFkdmFuY2U9OTMgICAgcGFnZT0wICBjaG5sPTE1XG5jaGFyIGlkPTE2NCAgeD03MDIgICB5PTExMjkgIHdpZHRoPTE0OSAgIGhlaWdodD0xNDkgICB4b2Zmc2V0PS0xNyAgIHlvZmZzZXQ9MzAgICAgeGFkdmFuY2U9MTE0ICAgcGFnZT0wICBjaG5sPTE1XG5jaGFyIGlkPTE2NSAgeD00NjUgICB5PTk1NSAgIHdpZHRoPTE0MCAgIGhlaWdodD0xNjIgICB4b2Zmc2V0PS0yMiAgIHlvZmZzZXQ9MTQgICAgeGFkdmFuY2U9OTcgICAgcGFnZT0wICBjaG5sPTE1XG5jaGFyIGlkPTE2NiAgeD0yMzc1ICB5PTIwNiAgIHdpZHRoPTY0ICAgIGhlaWdodD0xODMgICB4b2Zmc2V0PS0xMyAgIHlvZmZzZXQ9MTQgICAgeGFkdmFuY2U9MzggICAgcGFnZT0wICBjaG5sPTE1XG5jaGFyIGlkPTE2NyAgeD0yMDUgICB5PTAgICAgIHdpZHRoPTEzMiAgIGhlaWdodD0yMDIgICB4b2Zmc2V0PS0xOCAgIHlvZmZzZXQ9MTMgICAgeGFkdmFuY2U9OTggICAgcGFnZT0wICBjaG5sPTE1XG5jaGFyIGlkPTE2OCAgeD0yNzE2ICB5PTEyNTEgIHdpZHRoPTEwMCAgIGhlaWdodD02NSAgICB4b2Zmc2V0PS0xNyAgIHlvZmZzZXQ9MTIgICAgeGFkdmFuY2U9NjcgICAgcGFnZT0wICBjaG5sPTE1XG5jaGFyIGlkPTE2OSAgeD05OTUgICB5PTU5OSAgIHdpZHRoPTE2MSAgIGhlaWdodD0xNjUgICB4b2Zmc2V0PS0xOCAgIHlvZmZzZXQ9MTMgICAgeGFkdmFuY2U9MTI2ICAgcGFnZT0wICBjaG5sPTE1XG5jaGFyIGlkPTE3MCAgeD0xMzY4ICB5PTEyNzMgIHdpZHRoPTk5ICAgIGhlaWdodD0xMDkgICB4b2Zmc2V0PS0xMyAgIHlvZmZzZXQ9MTMgICAgeGFkdmFuY2U9NzEgICAgcGFnZT0wICBjaG5sPTE1XG5jaGFyIGlkPTE3MSAgeD0xMTMxICB5PTEyNzcgIHdpZHRoPTExMCAgIGhlaWdodD0xMTAgICB4b2Zmc2V0PS0xNyAgIHlvZmZzZXQ9NTQgICAgeGFkdmFuY2U9NzUgICAgcGFnZT0wICBjaG5sPTE1XG5jaGFyIGlkPTE3MiAgeD0yMjUxICB5PTEyNjEgIHdpZHRoPTExNSAgIGhlaWdodD04MSAgICB4b2Zmc2V0PS0xNSAgIHlvZmZzZXQ9NjUgICAgeGFkdmFuY2U9ODkgICAgcGFnZT0wICBjaG5sPTE1XG5jaGFyIGlkPTE3MyAgeD0xMzMgICB5PTE0NTggIHdpZHRoPTg4ICAgIGhlaWdodD02MCAgICB4b2Zmc2V0PS0yMiAgIHlvZmZzZXQ9NzQgICAgeGFkdmFuY2U9NDQgICAgcGFnZT0wICBjaG5sPTE1XG5jaGFyIGlkPTE3NCAgeD0xMTY4ICB5PTU5NyAgIHdpZHRoPTE2MSAgIGhlaWdodD0xNjUgICB4b2Zmc2V0PS0xOCAgIHlvZmZzZXQ9MTMgICAgeGFkdmFuY2U9MTI2ICAgcGFnZT0wICBjaG5sPTE1XG5jaGFyIGlkPTE3NSAgeD0zMzMgICB5PTE0NDggIHdpZHRoPTEwNSAgIGhlaWdodD01OSAgICB4b2Zmc2V0PS0xNSAgIHlvZmZzZXQ9MTQgICAgeGFkdmFuY2U9NzMgICAgcGFnZT0wICBjaG5sPTE1XG5jaGFyIGlkPTE3NiAgeD0xODE1ICB5PTEyNjggIHdpZHRoPTg5ICAgIGhlaWdodD04OCAgICB4b2Zmc2V0PS0xNSAgIHlvZmZzZXQ9MTMgICAgeGFkdmFuY2U9NjAgICAgcGFnZT0wICBjaG5sPTE1XG5jaGFyIGlkPTE3NyAgeD04NjMgICB5PTExMjkgIHdpZHRoPTEyMSAgIGhlaWdodD0xNDcgICB4b2Zmc2V0PS0xNyAgIHlvZmZzZXQ9MjkgICAgeGFkdmFuY2U9ODUgICAgcGFnZT0wICBjaG5sPTE1XG5jaGFyIGlkPTE3OCAgeD04OTkgICB5PTEyODggIHdpZHRoPTk3ICAgIGhlaWdodD0xMTEgICB4b2Zmc2V0PS0xOSAgIHlvZmZzZXQ9MTMgICAgeGFkdmFuY2U9NTkgICAgcGFnZT0wICBjaG5sPTE1XG5jaGFyIGlkPTE3OSAgeD03OTAgICB5PTEyOTAgIHdpZHRoPTk3ICAgIGhlaWdodD0xMTIgICB4b2Zmc2V0PS0yMCAgIHlvZmZzZXQ9MTMgICAgeGFkdmFuY2U9NTkgICAgcGFnZT0wICBjaG5sPTE1XG5jaGFyIGlkPTE4MCAgeD0yNTI4ICB5PTEyNTggIHdpZHRoPTgyICAgIGhlaWdodD03MSAgICB4b2Zmc2V0PS0xNSAgIHlvZmZzZXQ9OCAgICAgeGFkdmFuY2U9NTAgICAgcGFnZT0wICBjaG5sPTE1XG5jaGFyIGlkPTE4MSAgeD04NjYgICB5PTU5OSAgIHdpZHRoPTExNyAgIGhlaWdodD0xNjYgICB4b2Zmc2V0PS0xMyAgIHlvZmZzZXQ9NDMgICAgeGFkdmFuY2U9OTEgICAgcGFnZT0wICBjaG5sPTE1XG5jaGFyIGlkPTE4MiAgeD0yODkzICB5PTkyMyAgIHdpZHRoPTExMCAgIGhlaWdodD0xNjIgICB4b2Zmc2V0PS0yMCAgIHlvZmZzZXQ9MTQgICAgeGFkdmFuY2U9NzggICAgcGFnZT0wICBjaG5sPTE1XG5jaGFyIGlkPTE4MyAgeD0yOTA4ICB5PTEyNDIgIHdpZHRoPTY3ICAgIGhlaWdodD02NSAgICB4b2Zmc2V0PS0xMyAgIHlvZmZzZXQ9NjIgICAgeGFkdmFuY2U9NDIgICAgcGFnZT0wICBjaG5sPTE1XG5jaGFyIGlkPTE4NCAgeD0yMTY2ICB5PTEyNjEgIHdpZHRoPTczICAgIGhlaWdodD04MiAgICB4b2Zmc2V0PS0xNSAgIHlvZmZzZXQ9MTI4ICAgeGFkdmFuY2U9NDAgICAgcGFnZT0wICBjaG5sPTE1XG5jaGFyIGlkPTE4NSAgeD0xNDc5ICB5PTEyNzEgIHdpZHRoPTc5ICAgIGhlaWdodD0xMDkgICB4b2Zmc2V0PS0xNSAgIHlvZmZzZXQ9MTQgICAgeGFkdmFuY2U9NTkgICAgcGFnZT0wICBjaG5sPTE1XG5jaGFyIGlkPTE4NiAgeD0xMjUzICB5PTEyNzQgIHdpZHRoPTEwMyAgIGhlaWdodD0xMDkgICB4b2Zmc2V0PS0xNSAgIHlvZmZzZXQ9MTMgICAgeGFkdmFuY2U9NzMgICAgcGFnZT0wICBjaG5sPTE1XG5jaGFyIGlkPTE4NyAgeD0xMDA4ICB5PTEyNzcgIHdpZHRoPTExMSAgIGhlaWdodD0xMTAgICB4b2Zmc2V0PS0xNyAgIHlvZmZzZXQ9NTQgICAgeGFkdmFuY2U9NzUgICAgcGFnZT0wICBjaG5sPTE1XG5jaGFyIGlkPTE4OCAgeD0yNTQyICB5PTc1OCAgIHdpZHRoPTE1NCAgIGhlaWdodD0xNjIgICB4b2Zmc2V0PS0xOCAgIHlvZmZzZXQ9MTQgICAgeGFkdmFuY2U9MTE3ICAgcGFnZT0wICBjaG5sPTE1XG5jaGFyIGlkPTE4OSAgeD0yMzcyICB5PTc2MCAgIHdpZHRoPTE1OCAgIGhlaWdodD0xNjIgICB4b2Zmc2V0PS0xOCAgIHlvZmZzZXQ9MTQgICAgeGFkdmFuY2U9MTI0ICAgcGFnZT0wICBjaG5sPTE1XG5jaGFyIGlkPTE5MCAgeD0xMTI5ICB5PTc3NiAgIHdpZHRoPTE1OSAgIGhlaWdodD0xNjMgICB4b2Zmc2V0PS0xNiAgIHlvZmZzZXQ9MTMgICAgeGFkdmFuY2U9MTI0ICAgcGFnZT0wICBjaG5sPTE1XG5jaGFyIGlkPTE5MSAgeD05MjUgICB5PTc3NyAgIHdpZHRoPTExMyAgIGhlaWdodD0xNjQgICB4b2Zmc2V0PS0xOSAgIHlvZmZzZXQ9NDIgICAgeGFkdmFuY2U9NzYgICAgcGFnZT0wICBjaG5sPTE1XG5jaGFyIGlkPTE5MiAgeD0xNjIgICB5PTIyNSAgIHdpZHRoPTE1MCAgIGhlaWdodD0xOTIgICB4b2Zmc2V0PS0yMyAgIHlvZmZzZXQ9LTE2ICAgeGFkdmFuY2U9MTA0ICAgcGFnZT0wICBjaG5sPTE1XG5jaGFyIGlkPTE5MyAgeD0zMjQgICB5PTIxNCAgIHdpZHRoPTE1MCAgIGhlaWdodD0xOTIgICB4b2Zmc2V0PS0yMyAgIHlvZmZzZXQ9LTE2ICAgeGFkdmFuY2U9MTA0ICAgcGFnZT0wICBjaG5sPTE1XG5jaGFyIGlkPTE5NCAgeD0wICAgICB5PTIyNSAgIHdpZHRoPTE1MCAgIGhlaWdodD0xOTIgICB4b2Zmc2V0PS0yMyAgIHlvZmZzZXQ9LTE2ICAgeGFkdmFuY2U9MTA0ICAgcGFnZT0wICBjaG5sPTE1XG5jaGFyIGlkPTE5NSAgeD0xMzU5ICB5PTIxMCAgIHdpZHRoPTE1MCAgIGhlaWdodD0xOTAgICB4b2Zmc2V0PS0yMyAgIHlvZmZzZXQ9LTE0ICAgeGFkdmFuY2U9MTA0ICAgcGFnZT0wICBjaG5sPTE1XG5jaGFyIGlkPTE5NiAgeD0xODE0ICB5PTIwOCAgIHdpZHRoPTE1MCAgIGhlaWdodD0xODggICB4b2Zmc2V0PS0yMyAgIHlvZmZzZXQ9LTEyICAgeGFkdmFuY2U9MTA0ICAgcGFnZT0wICBjaG5sPTE1XG5jaGFyIGlkPTE5NyAgeD0xMDE2ICB5PTAgICAgIHdpZHRoPTE1MCAgIGhlaWdodD0xOTkgICB4b2Zmc2V0PS0yMyAgIHlvZmZzZXQ9LTIzICAgeGFkdmFuY2U9MTA0ICAgcGFnZT0wICBjaG5sPTE1XG5jaGFyIGlkPTE5OCAgeD0xNzkyICB5PTc2OSAgIHdpZHRoPTE5OCAgIGhlaWdodD0xNjIgICB4b2Zmc2V0PS0yNiAgIHlvZmZzZXQ9MTQgICAgeGFkdmFuY2U9MTUwICAgcGFnZT0wICBjaG5sPTE1XG5jaGFyIGlkPTE5OSAgeD0xMTc4ICB5PTAgICAgIHdpZHRoPTEzNyAgIGhlaWdodD0xOTggICB4b2Zmc2V0PS0xNSAgIHlvZmZzZXQ9MTMgICAgeGFkdmFuY2U9MTA0ICAgcGFnZT0wICBjaG5sPTE1XG5jaGFyIGlkPTIwMCAgeD0yOTIyICB5PTAgICAgIHdpZHRoPTEyMiAgIGhlaWdodD0xOTIgICB4b2Zmc2V0PS0xMiAgIHlvZmZzZXQ9LTE2ICAgeGFkdmFuY2U9OTEgICAgcGFnZT0wICBjaG5sPTE1XG5jaGFyIGlkPTIwMSAgeD02NDEgICB5PTIxNCAgIHdpZHRoPTEyMiAgIGhlaWdodD0xOTIgICB4b2Zmc2V0PS0xMiAgIHlvZmZzZXQ9LTE2ICAgeGFkdmFuY2U9OTEgICAgcGFnZT0wICBjaG5sPTE1XG5jaGFyIGlkPTIwMiAgeD03NzUgICB5PTIxMyAgIHdpZHRoPTEyMiAgIGhlaWdodD0xOTIgICB4b2Zmc2V0PS0xMiAgIHlvZmZzZXQ9LTE2ICAgeGFkdmFuY2U9OTEgICAgcGFnZT0wICBjaG5sPTE1XG5jaGFyIGlkPTIwMyAgeD0xOTc2ICB5PTIwNyAgIHdpZHRoPTEyMiAgIGhlaWdodD0xODggICB4b2Zmc2V0PS0xMiAgIHlvZmZzZXQ9LTEyICAgeGFkdmFuY2U9OTEgICAgcGFnZT0wICBjaG5sPTE1XG5jaGFyIGlkPTIwNCAgeD0xMDE4ICB5PTIxMSAgIHdpZHRoPTgyICAgIGhlaWdodD0xOTIgICB4b2Zmc2V0PS0yNyAgIHlvZmZzZXQ9LTE2ICAgeGFkdmFuY2U9NDQgICAgcGFnZT0wICBjaG5sPTE1XG5jaGFyIGlkPTIwNSAgeD0xMTEyICB5PTIxMSAgIHdpZHRoPTgyICAgIGhlaWdodD0xOTIgICB4b2Zmc2V0PS0xMSAgIHlvZmZzZXQ9LTE2ICAgeGFkdmFuY2U9NDQgICAgcGFnZT0wICBjaG5sPTE1XG5jaGFyIGlkPTIwNiAgeD05MDkgICB5PTIxMyAgIHdpZHRoPTk3ICAgIGhlaWdodD0xOTIgICB4b2Zmc2V0PS0yNyAgIHlvZmZzZXQ9LTE2ICAgeGFkdmFuY2U9NDQgICAgcGFnZT0wICBjaG5sPTE1XG5jaGFyIGlkPTIwNyAgeD0yMTEwICB5PTIwNyAgIHdpZHRoPTEwMCAgIGhlaWdodD0xODggICB4b2Zmc2V0PS0yOCAgIHlvZmZzZXQ9LTEyICAgeGFkdmFuY2U9NDQgICAgcGFnZT0wICBjaG5sPTE1XG5jaGFyIGlkPTIwOCAgeD0wICAgICB5PTk2OSAgIHdpZHRoPTE0NSAgIGhlaWdodD0xNjIgICB4b2Zmc2V0PS0yMiAgIHlvZmZzZXQ9MTQgICAgeGFkdmFuY2U9MTA3ICAgcGFnZT0wICBjaG5sPTE1XG5jaGFyIGlkPTIwOSAgeD0xNTIxICB5PTIwOCAgIHdpZHRoPTEzNyAgIGhlaWdodD0xOTAgICB4b2Zmc2V0PS0xMiAgIHlvZmZzZXQ9LTE0ICAgeGFkdmFuY2U9MTE0ICAgcGFnZT0wICBjaG5sPTE1XG5jaGFyIGlkPTIxMCAgeD0yMTg0ICB5PTAgICAgIHdpZHRoPTE0MSAgIGhlaWdodD0xOTUgICB4b2Zmc2V0PS0xNiAgIHlvZmZzZXQ9LTE3ICAgeGFkdmFuY2U9MTEwICAgcGFnZT0wICBjaG5sPTE1XG5jaGFyIGlkPTIxMSAgeD0yMDMxICB5PTAgICAgIHdpZHRoPTE0MSAgIGhlaWdodD0xOTUgICB4b2Zmc2V0PS0xNiAgIHlvZmZzZXQ9LTE3ICAgeGFkdmFuY2U9MTEwICAgcGFnZT0wICBjaG5sPTE1XG5jaGFyIGlkPTIxMiAgeD0xODc4ICB5PTAgICAgIHdpZHRoPTE0MSAgIGhlaWdodD0xOTUgICB4b2Zmc2V0PS0xNiAgIHlvZmZzZXQ9LTE3ICAgeGFkdmFuY2U9MTEwICAgcGFnZT0wICBjaG5sPTE1XG5jaGFyIGlkPTIxMyAgeD0yNzY5ICB5PTAgICAgIHdpZHRoPTE0MSAgIGhlaWdodD0xOTMgICB4b2Zmc2V0PS0xNiAgIHlvZmZzZXQ9LTE1ICAgeGFkdmFuY2U9MTEwICAgcGFnZT0wICBjaG5sPTE1XG5jaGFyIGlkPTIxNCAgeD0xMjA2ICB5PTIxMCAgIHdpZHRoPTE0MSAgIGhlaWdodD0xOTEgICB4b2Zmc2V0PS0xNiAgIHlvZmZzZXQ9LTEzICAgeGFkdmFuY2U9MTEwICAgcGFnZT0wICBjaG5sPTE1XG5jaGFyIGlkPTIxNSAgeD0yNzkgICB5PTEzMTYgIHdpZHRoPTEyMCAgIGhlaWdodD0xMjAgICB4b2Zmc2V0PS0xOCAgIHlvZmZzZXQ9NDAgICAgeGFkdmFuY2U9ODUgICAgcGFnZT0wICBjaG5sPTE1XG5jaGFyIGlkPTIxNiAgeD0yNjU1ICB5PTIwNiAgIHdpZHRoPTE0MyAgIGhlaWdodD0xNzQgICB4b2Zmc2V0PS0xNiAgIHlvZmZzZXQ9MTAgICAgeGFkdmFuY2U9MTEwICAgcGFnZT0wICBjaG5sPTE1XG5jaGFyIGlkPTIxNyAgeD0yNjI1ICB5PTAgICAgIHdpZHRoPTEzMiAgIGhlaWdodD0xOTQgICB4b2Zmc2V0PS0xNCAgIHlvZmZzZXQ9LTE2ICAgeGFkdmFuY2U9MTA0ICAgcGFnZT0wICBjaG5sPTE1XG5jaGFyIGlkPTIxOCAgeD0yNDgxICB5PTAgICAgIHdpZHRoPTEzMiAgIGhlaWdodD0xOTQgICB4b2Zmc2V0PS0xNCAgIHlvZmZzZXQ9LTE2ICAgeGFkdmFuY2U9MTA0ICAgcGFnZT0wICBjaG5sPTE1XG5jaGFyIGlkPTIxOSAgeD0yMzM3ICB5PTAgICAgIHdpZHRoPTEzMiAgIGhlaWdodD0xOTQgICB4b2Zmc2V0PS0xNCAgIHlvZmZzZXQ9LTE2ICAgeGFkdmFuY2U9MTA0ICAgcGFnZT0wICBjaG5sPTE1XG5jaGFyIGlkPTIyMCAgeD0xNjcwICB5PTIwOCAgIHdpZHRoPTEzMiAgIGhlaWdodD0xOTAgICB4b2Zmc2V0PS0xNCAgIHlvZmZzZXQ9LTEyICAgeGFkdmFuY2U9MTA0ICAgcGFnZT0wICBjaG5sPTE1XG5jaGFyIGlkPTIyMSAgeD00ODYgICB5PTIxNCAgIHdpZHRoPTE0MyAgIGhlaWdodD0xOTIgICB4b2Zmc2V0PS0yNCAgIHlvZmZzZXQ9LTE2ICAgeGFkdmFuY2U9OTYgICAgcGFnZT0wICBjaG5sPTE1XG5jaGFyIGlkPTIyMiAgeD0yMzYwICB5PTkzOSAgIHdpZHRoPTEyNCAgIGhlaWdodD0xNjIgICB4b2Zmc2V0PS0xMiAgIHlvZmZzZXQ9MTQgICAgeGFkdmFuY2U9OTUgICAgcGFnZT0wICBjaG5sPTE1XG5jaGFyIGlkPTIyMyAgeD0xMjEgICB5PTQyOSAgIHdpZHRoPTEyNyAgIGhlaWdodD0xNzEgICB4b2Zmc2V0PS0xNCAgIHlvZmZzZXQ9NyAgICAgeGFkdmFuY2U9OTUgICAgcGFnZT0wICBjaG5sPTE1XG5jaGFyIGlkPTIyNCAgeD0xNjA0ICB5PTQxMCAgIHdpZHRoPTExOSAgIGhlaWdodD0xNzAgICB4b2Zmc2V0PS0xNiAgIHlvZmZzZXQ9OCAgICAgeGFkdmFuY2U9ODcgICAgcGFnZT0wICBjaG5sPTE1XG5jaGFyIGlkPTIyNSAgeD0xNDczICB5PTQxMiAgIHdpZHRoPTExOSAgIGhlaWdodD0xNzAgICB4b2Zmc2V0PS0xNiAgIHlvZmZzZXQ9OCAgICAgeGFkdmFuY2U9ODcgICAgcGFnZT0wICBjaG5sPTE1XG5jaGFyIGlkPTIyNiAgeD0xNzM1ICB5PTQxMCAgIHdpZHRoPTExOSAgIGhlaWdodD0xNzAgICB4b2Zmc2V0PS0xNiAgIHlvZmZzZXQ9OCAgICAgeGFkdmFuY2U9ODcgICAgcGFnZT0wICBjaG5sPTE1XG5jaGFyIGlkPTIyNyAgeD01MzIgICB5PTYwMCAgIHdpZHRoPTExOSAgIGhlaWdodD0xNjcgICB4b2Zmc2V0PS0xNiAgIHlvZmZzZXQ9MTEgICAgeGFkdmFuY2U9ODcgICAgcGFnZT0wICBjaG5sPTE1XG5jaGFyIGlkPTIyOCAgeD0yOTI2ICB5PTU2OSAgIHdpZHRoPTExOSAgIGhlaWdodD0xNjUgICB4b2Zmc2V0PS0xNiAgIHlvZmZzZXQ9MTMgICAgeGFkdmFuY2U9ODcgICAgcGFnZT0wICBjaG5sPTE1XG5jaGFyIGlkPTIyOSAgeD0yNTI0ICB5PTIwNiAgIHdpZHRoPTExOSAgIGhlaWdodD0xNzcgICB4b2Zmc2V0PS0xNiAgIHlvZmZzZXQ9MSAgICAgeGFkdmFuY2U9ODcgICAgcGFnZT0wICBjaG5sPTE1XG5jaGFyIGlkPTIzMCAgeD05OTYgICB5PTExMjkgIHdpZHRoPTE3MyAgIGhlaWdodD0xMzYgICB4b2Zmc2V0PS0xOSAgIHlvZmZzZXQ9NDIgICAgeGFkdmFuY2U9MTM1ICAgcGFnZT0wICBjaG5sPTE1XG5jaGFyIGlkPTIzMSAgeD0xOTc5ICB5PTQwNyAgIHdpZHRoPTEyMCAgIGhlaWdodD0xNjkgICB4b2Zmc2V0PS0xNyAgIHlvZmZzZXQ9NDIgICAgeGFkdmFuY2U9ODQgICAgcGFnZT0wICBjaG5sPTE1XG5jaGFyIGlkPTIzMiAgeD0xMDc2ICB5PTQxNSAgIHdpZHRoPTEyMSAgIGhlaWdodD0xNzAgICB4b2Zmc2V0PS0xNyAgIHlvZmZzZXQ9OCAgICAgeGFkdmFuY2U9ODUgICAgcGFnZT0wICBjaG5sPTE1XG5jaGFyIGlkPTIzMyAgeD05NDMgICB5PTQxNyAgIHdpZHRoPTEyMSAgIGhlaWdodD0xNzAgICB4b2Zmc2V0PS0xNyAgIHlvZmZzZXQ9OCAgICAgeGFkdmFuY2U9ODUgICAgcGFnZT0wICBjaG5sPTE1XG5jaGFyIGlkPTIzNCAgeD04MTAgICB5PTQxNyAgIHdpZHRoPTEyMSAgIGhlaWdodD0xNzAgICB4b2Zmc2V0PS0xNyAgIHlvZmZzZXQ9OCAgICAgeGFkdmFuY2U9ODUgICAgcGFnZT0wICBjaG5sPTE1XG5jaGFyIGlkPTIzNSAgeD0yNzkzICB5PTU3MiAgIHdpZHRoPTEyMSAgIGhlaWdodD0xNjUgICB4b2Zmc2V0PS0xNyAgIHlvZmZzZXQ9MTMgICAgeGFkdmFuY2U9ODUgICAgcGFnZT0wICBjaG5sPTE1XG5jaGFyIGlkPTIzNiAgeD03NzIgICB5PTYwMCAgIHdpZHRoPTgyICAgIGhlaWdodD0xNjcgICB4b2Zmc2V0PS0yOSAgIHlvZmZzZXQ9OSAgICAgeGFkdmFuY2U9NDAgICAgcGFnZT0wICBjaG5sPTE1XG5jaGFyIGlkPTIzNyAgeD0yOTcwICB5PTM4OCAgIHdpZHRoPTgyICAgIGhlaWdodD0xNjcgICB4b2Zmc2V0PS0xMyAgIHlvZmZzZXQ9OSAgICAgeGFkdmFuY2U9NDAgICAgcGFnZT0wICBjaG5sPTE1XG5jaGFyIGlkPTIzOCAgeD02NjMgICB5PTYwMCAgIHdpZHRoPTk3ICAgIGhlaWdodD0xNjcgICB4b2Zmc2V0PS0yOSAgIHlvZmZzZXQ9OSAgICAgeGFkdmFuY2U9NDAgICAgcGFnZT0wICBjaG5sPTE1XG5jaGFyIGlkPTIzOSAgeD0wICAgICB5PTExNDMgIHdpZHRoPTEwMCAgIGhlaWdodD0xNjIgICB4b2Zmc2V0PS0zMCAgIHlvZmZzZXQ9MTQgICAgeGFkdmFuY2U9NDAgICAgcGFnZT0wICBjaG5sPTE1XG5jaGFyIGlkPTI0MCAgeD0yODEwICB5PTIwNSAgIHdpZHRoPTEyMyAgIGhlaWdodD0xNzMgICB4b2Zmc2V0PS0xNSAgIHlvZmZzZXQ9NSAgICAgeGFkdmFuY2U9OTQgICAgcGFnZT0wICBjaG5sPTE1XG5jaGFyIGlkPTI0MSAgeD0wICAgICB5PTc5MiAgIHdpZHRoPTExNiAgIGhlaWdodD0xNjUgICB4b2Zmc2V0PS0xNCAgIHlvZmZzZXQ9MTEgICAgeGFkdmFuY2U9ODggICAgcGFnZT0wICBjaG5sPTE1XG5jaGFyIGlkPTI0MiAgeD0yNjAgICB5PTQyOSAgIHdpZHRoPTEyNyAgIGhlaWdodD0xNzAgICB4b2Zmc2V0PS0xOCAgIHlvZmZzZXQ9OCAgICAgeGFkdmFuY2U9OTEgICAgcGFnZT0wICBjaG5sPTE1XG5jaGFyIGlkPTI0MyAgeD01MzggICB5PTQxOCAgIHdpZHRoPTEyNyAgIGhlaWdodD0xNzAgICB4b2Zmc2V0PS0xOCAgIHlvZmZzZXQ9OCAgICAgeGFkdmFuY2U9OTEgICAgcGFnZT0wICBjaG5sPTE1XG5jaGFyIGlkPTI0NCAgeD0zOTkgICB5PTQxOCAgIHdpZHRoPTEyNyAgIGhlaWdodD0xNzAgICB4b2Zmc2V0PS0xOCAgIHlvZmZzZXQ9OCAgICAgeGFkdmFuY2U9OTEgICAgcGFnZT0wICBjaG5sPTE1XG5jaGFyIGlkPTI0NSAgeD0yODMxICB5PTM5MCAgIHdpZHRoPTEyNyAgIGhlaWdodD0xNjcgICB4b2Zmc2V0PS0xOCAgIHlvZmZzZXQ9MTEgICAgeGFkdmFuY2U9OTEgICAgcGFnZT0wICBjaG5sPTE1XG5jaGFyIGlkPTI0NiAgeD0yMjUzICB5PTU4MyAgIHdpZHRoPTEyNyAgIGhlaWdodD0xNjUgICB4b2Zmc2V0PS0xOCAgIHlvZmZzZXQ9MTMgICAgeGFkdmFuY2U9OTEgICAgcGFnZT0wICBjaG5sPTE1XG5jaGFyIGlkPTI0NyAgeD0xNDAgICB5PTEzMTcgIHdpZHRoPTEyNyAgIGhlaWdodD0xMjggICB4b2Zmc2V0PS0xOSAgIHlvZmZzZXQ9MzQgICAgeGFkdmFuY2U9OTEgICAgcGFnZT0wICBjaG5sPTE1XG5jaGFyIGlkPTI0OCAgeD01NjQgICB5PTExMjkgIHdpZHRoPTEyNiAgIGhlaWdodD0xNTMgICB4b2Zmc2V0PS0xNyAgIHlvZmZzZXQ9MzQgICAgeGFkdmFuY2U9OTEgICAgcGFnZT0wICBjaG5sPTE1XG5jaGFyIGlkPTI0OSAgeD0yMTExICB5PTQwNyAgIHdpZHRoPTExNiAgIGhlaWdodD0xNjkgICB4b2Zmc2V0PS0xNCAgIHlvZmZzZXQ9OSAgICAgeGFkdmFuY2U9ODggICAgcGFnZT0wICBjaG5sPTE1XG5jaGFyIGlkPTI1MCAgeD0yMjM5ICB5PTQwMiAgIHdpZHRoPTExNiAgIGhlaWdodD0xNjkgICB4b2Zmc2V0PS0xNCAgIHlvZmZzZXQ9OSAgICAgeGFkdmFuY2U9ODggICAgcGFnZT0wICBjaG5sPTE1XG5jaGFyIGlkPTI1MSAgeD0yMzY3ICB5PTQwMiAgIHdpZHRoPTExNiAgIGhlaWdodD0xNjkgICB4b2Zmc2V0PS0xNCAgIHlvZmZzZXQ9OSAgICAgeGFkdmFuY2U9ODggICAgcGFnZT0wICBjaG5sPTE1XG5jaGFyIGlkPTI1MiAgeD02NzIgICB5PTc3OSAgIHdpZHRoPTExNiAgIGhlaWdodD0xNjQgICB4b2Zmc2V0PS0xNCAgIHlvZmZzZXQ9MTQgICAgeGFkdmFuY2U9ODggICAgcGFnZT0wICBjaG5sPTE1XG5jaGFyIGlkPTI1MyAgeD03NDkgICB5PTAgICAgIHdpZHRoPTEyMiAgIGhlaWdodD0yMDEgICB4b2Zmc2V0PS0yMyAgIHlvZmZzZXQ9OSAgICAgeGFkdmFuY2U9NzYgICAgcGFnZT0wICBjaG5sPTE1XG5jaGFyIGlkPTI1NCAgeD04ODMgICB5PTAgICAgIHdpZHRoPTEyMSAgIGhlaWdodD0yMDEgICB4b2Zmc2V0PS0xMyAgIHlvZmZzZXQ9OCAgICAgeGFkdmFuY2U9OTIgICAgcGFnZT0wICBjaG5sPTE1XG5jaGFyIGlkPTI1NSAgeD0xNzQ0ICB5PTAgICAgIHdpZHRoPTEyMiAgIGhlaWdodD0xOTYgICB4b2Zmc2V0PS0yMyAgIHlvZmZzZXQ9MTQgICAgeGFkdmFuY2U9NzYgICAgcGFnZT0wICBjaG5sPTE1XG5rZXJuaW5ncyBjb3VudD0xNjg2XG5rZXJuaW5nIGZpcnN0PTMyICBzZWNvbmQ9ODQgIGFtb3VudD0tM1xua2VybmluZyBmaXJzdD00MCAgc2Vjb25kPTg2ICBhbW91bnQ9Mlxua2VybmluZyBmaXJzdD00MCAgc2Vjb25kPTg3ICBhbW91bnQ9MVxua2VybmluZyBmaXJzdD00MCAgc2Vjb25kPTg5ICBhbW91bnQ9Mlxua2VybmluZyBmaXJzdD00MCAgc2Vjb25kPTIyMSBhbW91bnQ9Mlxua2VybmluZyBmaXJzdD03MCAgc2Vjb25kPTQ0ICBhbW91bnQ9LTE4XG5rZXJuaW5nIGZpcnN0PTcwICBzZWNvbmQ9NDYgIGFtb3VudD0tMThcbmtlcm5pbmcgZmlyc3Q9NzAgIHNlY29uZD02NSAgYW1vdW50PS0xM1xua2VybmluZyBmaXJzdD03MCAgc2Vjb25kPTc0ICBhbW91bnQ9LTIxXG5rZXJuaW5nIGZpcnN0PTcwICBzZWNvbmQ9ODQgIGFtb3VudD0yXG5rZXJuaW5nIGZpcnN0PTcwICBzZWNvbmQ9OTcgIGFtb3VudD0tM1xua2VybmluZyBmaXJzdD03MCAgc2Vjb25kPTk5ICBhbW91bnQ9LTJcbmtlcm5pbmcgZmlyc3Q9NzAgIHNlY29uZD0xMDAgYW1vdW50PS0yXG5rZXJuaW5nIGZpcnN0PTcwICBzZWNvbmQ9MTAxIGFtb3VudD0tMlxua2VybmluZyBmaXJzdD03MCAgc2Vjb25kPTEwMyBhbW91bnQ9LTJcbmtlcm5pbmcgZmlyc3Q9NzAgIHNlY29uZD0xMTEgYW1vdW50PS0yXG5rZXJuaW5nIGZpcnN0PTcwICBzZWNvbmQ9MTEzIGFtb3VudD0tMlxua2VybmluZyBmaXJzdD03MCAgc2Vjb25kPTExNyBhbW91bnQ9LTJcbmtlcm5pbmcgZmlyc3Q9NzAgIHNlY29uZD0xMTggYW1vdW50PS0yXG5rZXJuaW5nIGZpcnN0PTcwICBzZWNvbmQ9MTIxIGFtb3VudD0tMlxua2VybmluZyBmaXJzdD03MCAgc2Vjb25kPTE5MiBhbW91bnQ9LTEzXG5rZXJuaW5nIGZpcnN0PTcwICBzZWNvbmQ9MTkzIGFtb3VudD0tMTNcbmtlcm5pbmcgZmlyc3Q9NzAgIHNlY29uZD0xOTQgYW1vdW50PS0xM1xua2VybmluZyBmaXJzdD03MCAgc2Vjb25kPTE5NSBhbW91bnQ9LTEzXG5rZXJuaW5nIGZpcnN0PTcwICBzZWNvbmQ9MTk2IGFtb3VudD0tMTNcbmtlcm5pbmcgZmlyc3Q9NzAgIHNlY29uZD0xOTcgYW1vdW50PS0xM1xua2VybmluZyBmaXJzdD03MCAgc2Vjb25kPTIyNCBhbW91bnQ9LTNcbmtlcm5pbmcgZmlyc3Q9NzAgIHNlY29uZD0yMjUgYW1vdW50PS0zXG5rZXJuaW5nIGZpcnN0PTcwICBzZWNvbmQ9MjI2IGFtb3VudD0tM1xua2VybmluZyBmaXJzdD03MCAgc2Vjb25kPTIyNyBhbW91bnQ9LTNcbmtlcm5pbmcgZmlyc3Q9NzAgIHNlY29uZD0yMjggYW1vdW50PS0zXG5rZXJuaW5nIGZpcnN0PTcwICBzZWNvbmQ9MjI5IGFtb3VudD0tM1xua2VybmluZyBmaXJzdD03MCAgc2Vjb25kPTIzMSBhbW91bnQ9LTJcbmtlcm5pbmcgZmlyc3Q9NzAgIHNlY29uZD0yMzIgYW1vdW50PS0yXG5rZXJuaW5nIGZpcnN0PTcwICBzZWNvbmQ9MjMzIGFtb3VudD0tMlxua2VybmluZyBmaXJzdD03MCAgc2Vjb25kPTIzNCBhbW91bnQ9LTJcbmtlcm5pbmcgZmlyc3Q9NzAgIHNlY29uZD0yMzUgYW1vdW50PS0yXG5rZXJuaW5nIGZpcnN0PTcwICBzZWNvbmQ9MjQyIGFtb3VudD0tMlxua2VybmluZyBmaXJzdD03MCAgc2Vjb25kPTI0MyBhbW91bnQ9LTJcbmtlcm5pbmcgZmlyc3Q9NzAgIHNlY29uZD0yNDQgYW1vdW50PS0yXG5rZXJuaW5nIGZpcnN0PTcwICBzZWNvbmQ9MjQ1IGFtb3VudD0tMlxua2VybmluZyBmaXJzdD03MCAgc2Vjb25kPTI0NiBhbW91bnQ9LTJcbmtlcm5pbmcgZmlyc3Q9NzAgIHNlY29uZD0yNDkgYW1vdW50PS0yXG5rZXJuaW5nIGZpcnN0PTcwICBzZWNvbmQ9MjUwIGFtb3VudD0tMlxua2VybmluZyBmaXJzdD03MCAgc2Vjb25kPTI1MSBhbW91bnQ9LTJcbmtlcm5pbmcgZmlyc3Q9NzAgIHNlY29uZD0yNTIgYW1vdW50PS0yXG5rZXJuaW5nIGZpcnN0PTcwICBzZWNvbmQ9MjUzIGFtb3VudD0tMlxua2VybmluZyBmaXJzdD03MCAgc2Vjb25kPTI1NSBhbW91bnQ9LTJcbmtlcm5pbmcgZmlyc3Q9ODEgIHNlY29uZD04NCAgYW1vdW50PS0zXG5rZXJuaW5nIGZpcnN0PTgxICBzZWNvbmQ9ODYgIGFtb3VudD0tMlxua2VybmluZyBmaXJzdD04MSAgc2Vjb25kPTg3ICBhbW91bnQ9LTJcbmtlcm5pbmcgZmlyc3Q9ODEgIHNlY29uZD04OSAgYW1vdW50PS0zXG5rZXJuaW5nIGZpcnN0PTgxICBzZWNvbmQ9MjIxIGFtb3VudD0tM1xua2VybmluZyBmaXJzdD04MiAgc2Vjb25kPTg0ICBhbW91bnQ9LTZcbmtlcm5pbmcgZmlyc3Q9ODIgIHNlY29uZD04NiAgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTgyICBzZWNvbmQ9ODkgIGFtb3VudD0tNFxua2VybmluZyBmaXJzdD04MiAgc2Vjb25kPTIyMSBhbW91bnQ9LTRcbmtlcm5pbmcgZmlyc3Q9OTEgIHNlY29uZD03NCAgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTkxICBzZWNvbmQ9ODUgIGFtb3VudD0tMVxua2VybmluZyBmaXJzdD05MSAgc2Vjb25kPTIxNyBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9OTEgIHNlY29uZD0yMTggYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTkxICBzZWNvbmQ9MjE5IGFtb3VudD0tMVxua2VybmluZyBmaXJzdD05MSAgc2Vjb25kPTIyMCBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9MTAyIHNlY29uZD0zNCAgYW1vdW50PTFcbmtlcm5pbmcgZmlyc3Q9MTAyIHNlY29uZD0zOSAgYW1vdW50PTFcbmtlcm5pbmcgZmlyc3Q9MTAyIHNlY29uZD05OSAgYW1vdW50PS0yXG5rZXJuaW5nIGZpcnN0PTEwMiBzZWNvbmQ9MTAwIGFtb3VudD0tMlxua2VybmluZyBmaXJzdD0xMDIgc2Vjb25kPTEwMSBhbW91bnQ9LTJcbmtlcm5pbmcgZmlyc3Q9MTAyIHNlY29uZD0xMDMgYW1vdW50PS0yXG5rZXJuaW5nIGZpcnN0PTEwMiBzZWNvbmQ9MTEzIGFtb3VudD0tMlxua2VybmluZyBmaXJzdD0xMDIgc2Vjb25kPTIzMSBhbW91bnQ9LTJcbmtlcm5pbmcgZmlyc3Q9MTAyIHNlY29uZD0yMzIgYW1vdW50PS0yXG5rZXJuaW5nIGZpcnN0PTEwMiBzZWNvbmQ9MjMzIGFtb3VudD0tMlxua2VybmluZyBmaXJzdD0xMDIgc2Vjb25kPTIzNCBhbW91bnQ9LTJcbmtlcm5pbmcgZmlyc3Q9MTAyIHNlY29uZD0yMzUgYW1vdW50PS0yXG5rZXJuaW5nIGZpcnN0PTEwNyBzZWNvbmQ9OTkgIGFtb3VudD0tMlxua2VybmluZyBmaXJzdD0xMDcgc2Vjb25kPTEwMCBhbW91bnQ9LTJcbmtlcm5pbmcgZmlyc3Q9MTA3IHNlY29uZD0xMDEgYW1vdW50PS0yXG5rZXJuaW5nIGZpcnN0PTEwNyBzZWNvbmQ9MTAzIGFtb3VudD0tMlxua2VybmluZyBmaXJzdD0xMDcgc2Vjb25kPTExMyBhbW91bnQ9LTJcbmtlcm5pbmcgZmlyc3Q9MTA3IHNlY29uZD0yMzEgYW1vdW50PS0yXG5rZXJuaW5nIGZpcnN0PTEwNyBzZWNvbmQ9MjMyIGFtb3VudD0tMlxua2VybmluZyBmaXJzdD0xMDcgc2Vjb25kPTIzMyBhbW91bnQ9LTJcbmtlcm5pbmcgZmlyc3Q9MTA3IHNlY29uZD0yMzQgYW1vdW50PS0yXG5rZXJuaW5nIGZpcnN0PTEwNyBzZWNvbmQ9MjM1IGFtb3VudD0tMlxua2VybmluZyBmaXJzdD0xMTYgc2Vjb25kPTExMSBhbW91bnQ9LTJcbmtlcm5pbmcgZmlyc3Q9MTE2IHNlY29uZD0yNDIgYW1vdW50PS0yXG5rZXJuaW5nIGZpcnN0PTExNiBzZWNvbmQ9MjQzIGFtb3VudD0tMlxua2VybmluZyBmaXJzdD0xMTYgc2Vjb25kPTI0NCBhbW91bnQ9LTJcbmtlcm5pbmcgZmlyc3Q9MTE2IHNlY29uZD0yNDUgYW1vdW50PS0yXG5rZXJuaW5nIGZpcnN0PTExNiBzZWNvbmQ9MjQ2IGFtb3VudD0tMlxua2VybmluZyBmaXJzdD0xMTkgc2Vjb25kPTQ0ICBhbW91bnQ9LTEwXG5rZXJuaW5nIGZpcnN0PTExOSBzZWNvbmQ9NDYgIGFtb3VudD0tMTBcbmtlcm5pbmcgZmlyc3Q9MTIzIHNlY29uZD03NCAgYW1vdW50PS0yXG5rZXJuaW5nIGZpcnN0PTEyMyBzZWNvbmQ9ODUgIGFtb3VudD0tMlxua2VybmluZyBmaXJzdD0xMjMgc2Vjb25kPTIxNyBhbW91bnQ9LTJcbmtlcm5pbmcgZmlyc3Q9MTIzIHNlY29uZD0yMTggYW1vdW50PS0yXG5rZXJuaW5nIGZpcnN0PTEyMyBzZWNvbmQ9MjE5IGFtb3VudD0tMlxua2VybmluZyBmaXJzdD0xMjMgc2Vjb25kPTIyMCBhbW91bnQ9LTJcbmtlcm5pbmcgZmlyc3Q9MzQgIHNlY29uZD0zNCAgYW1vdW50PS04XG5rZXJuaW5nIGZpcnN0PTM0ICBzZWNvbmQ9MzkgIGFtb3VudD0tOFxua2VybmluZyBmaXJzdD0zNCAgc2Vjb25kPTExMSBhbW91bnQ9LTVcbmtlcm5pbmcgZmlyc3Q9MzQgIHNlY29uZD0yNDIgYW1vdW50PS01XG5rZXJuaW5nIGZpcnN0PTM0ICBzZWNvbmQ9MjQzIGFtb3VudD0tNVxua2VybmluZyBmaXJzdD0zNCAgc2Vjb25kPTI0NCBhbW91bnQ9LTVcbmtlcm5pbmcgZmlyc3Q9MzQgIHNlY29uZD0yNDUgYW1vdW50PS01XG5rZXJuaW5nIGZpcnN0PTM0ICBzZWNvbmQ9MjQ2IGFtb3VudD0tNVxua2VybmluZyBmaXJzdD0zNCAgc2Vjb25kPTY1ICBhbW91bnQ9LTlcbmtlcm5pbmcgZmlyc3Q9MzQgIHNlY29uZD0xOTIgYW1vdW50PS05XG5rZXJuaW5nIGZpcnN0PTM0ICBzZWNvbmQ9MTkzIGFtb3VudD0tOVxua2VybmluZyBmaXJzdD0zNCAgc2Vjb25kPTE5NCBhbW91bnQ9LTlcbmtlcm5pbmcgZmlyc3Q9MzQgIHNlY29uZD0xOTUgYW1vdW50PS05XG5rZXJuaW5nIGZpcnN0PTM0ICBzZWNvbmQ9MTk2IGFtb3VudD0tOVxua2VybmluZyBmaXJzdD0zNCAgc2Vjb25kPTE5NyBhbW91bnQ9LTlcbmtlcm5pbmcgZmlyc3Q9MzQgIHNlY29uZD05OSAgYW1vdW50PS01XG5rZXJuaW5nIGZpcnN0PTM0ICBzZWNvbmQ9MTAwIGFtb3VudD0tNVxua2VybmluZyBmaXJzdD0zNCAgc2Vjb25kPTEwMSBhbW91bnQ9LTVcbmtlcm5pbmcgZmlyc3Q9MzQgIHNlY29uZD0xMDMgYW1vdW50PS01XG5rZXJuaW5nIGZpcnN0PTM0ICBzZWNvbmQ9MTEzIGFtb3VudD0tNVxua2VybmluZyBmaXJzdD0zNCAgc2Vjb25kPTIzMSBhbW91bnQ9LTVcbmtlcm5pbmcgZmlyc3Q9MzQgIHNlY29uZD0yMzIgYW1vdW50PS01XG5rZXJuaW5nIGZpcnN0PTM0ICBzZWNvbmQ9MjMzIGFtb3VudD0tNVxua2VybmluZyBmaXJzdD0zNCAgc2Vjb25kPTIzNCBhbW91bnQ9LTVcbmtlcm5pbmcgZmlyc3Q9MzQgIHNlY29uZD0yMzUgYW1vdW50PS01XG5rZXJuaW5nIGZpcnN0PTM0ICBzZWNvbmQ9MTA5IGFtb3VudD0tMlxua2VybmluZyBmaXJzdD0zNCAgc2Vjb25kPTExMCBhbW91bnQ9LTJcbmtlcm5pbmcgZmlyc3Q9MzQgIHNlY29uZD0xMTIgYW1vdW50PS0yXG5rZXJuaW5nIGZpcnN0PTM0ICBzZWNvbmQ9MjQxIGFtb3VudD0tMlxua2VybmluZyBmaXJzdD0zNCAgc2Vjb25kPTk3ICBhbW91bnQ9LTRcbmtlcm5pbmcgZmlyc3Q9MzQgIHNlY29uZD0yMjQgYW1vdW50PS00XG5rZXJuaW5nIGZpcnN0PTM0ICBzZWNvbmQ9MjI1IGFtb3VudD0tNFxua2VybmluZyBmaXJzdD0zNCAgc2Vjb25kPTIyNiBhbW91bnQ9LTRcbmtlcm5pbmcgZmlyc3Q9MzQgIHNlY29uZD0yMjcgYW1vdW50PS00XG5rZXJuaW5nIGZpcnN0PTM0ICBzZWNvbmQ9MjI4IGFtb3VudD0tNFxua2VybmluZyBmaXJzdD0zNCAgc2Vjb25kPTIyOSBhbW91bnQ9LTRcbmtlcm5pbmcgZmlyc3Q9MzQgIHNlY29uZD0xMTUgYW1vdW50PS02XG5rZXJuaW5nIGZpcnN0PTM5ICBzZWNvbmQ9MzQgIGFtb3VudD0tOFxua2VybmluZyBmaXJzdD0zOSAgc2Vjb25kPTM5ICBhbW91bnQ9LThcbmtlcm5pbmcgZmlyc3Q9MzkgIHNlY29uZD0xMTEgYW1vdW50PS01XG5rZXJuaW5nIGZpcnN0PTM5ICBzZWNvbmQ9MjQyIGFtb3VudD0tNVxua2VybmluZyBmaXJzdD0zOSAgc2Vjb25kPTI0MyBhbW91bnQ9LTVcbmtlcm5pbmcgZmlyc3Q9MzkgIHNlY29uZD0yNDQgYW1vdW50PS01XG5rZXJuaW5nIGZpcnN0PTM5ICBzZWNvbmQ9MjQ1IGFtb3VudD0tNVxua2VybmluZyBmaXJzdD0zOSAgc2Vjb25kPTI0NiBhbW91bnQ9LTVcbmtlcm5pbmcgZmlyc3Q9MzkgIHNlY29uZD02NSAgYW1vdW50PS05XG5rZXJuaW5nIGZpcnN0PTM5ICBzZWNvbmQ9MTkyIGFtb3VudD0tOVxua2VybmluZyBmaXJzdD0zOSAgc2Vjb25kPTE5MyBhbW91bnQ9LTlcbmtlcm5pbmcgZmlyc3Q9MzkgIHNlY29uZD0xOTQgYW1vdW50PS05XG5rZXJuaW5nIGZpcnN0PTM5ICBzZWNvbmQ9MTk1IGFtb3VudD0tOVxua2VybmluZyBmaXJzdD0zOSAgc2Vjb25kPTE5NiBhbW91bnQ9LTlcbmtlcm5pbmcgZmlyc3Q9MzkgIHNlY29uZD0xOTcgYW1vdW50PS05XG5rZXJuaW5nIGZpcnN0PTM5ICBzZWNvbmQ9OTkgIGFtb3VudD0tNVxua2VybmluZyBmaXJzdD0zOSAgc2Vjb25kPTEwMCBhbW91bnQ9LTVcbmtlcm5pbmcgZmlyc3Q9MzkgIHNlY29uZD0xMDEgYW1vdW50PS01XG5rZXJuaW5nIGZpcnN0PTM5ICBzZWNvbmQ9MTAzIGFtb3VudD0tNVxua2VybmluZyBmaXJzdD0zOSAgc2Vjb25kPTExMyBhbW91bnQ9LTVcbmtlcm5pbmcgZmlyc3Q9MzkgIHNlY29uZD0yMzEgYW1vdW50PS01XG5rZXJuaW5nIGZpcnN0PTM5ICBzZWNvbmQ9MjMyIGFtb3VudD0tNVxua2VybmluZyBmaXJzdD0zOSAgc2Vjb25kPTIzMyBhbW91bnQ9LTVcbmtlcm5pbmcgZmlyc3Q9MzkgIHNlY29uZD0yMzQgYW1vdW50PS01XG5rZXJuaW5nIGZpcnN0PTM5ICBzZWNvbmQ9MjM1IGFtb3VudD0tNVxua2VybmluZyBmaXJzdD0zOSAgc2Vjb25kPTEwOSBhbW91bnQ9LTJcbmtlcm5pbmcgZmlyc3Q9MzkgIHNlY29uZD0xMTAgYW1vdW50PS0yXG5rZXJuaW5nIGZpcnN0PTM5ICBzZWNvbmQ9MTEyIGFtb3VudD0tMlxua2VybmluZyBmaXJzdD0zOSAgc2Vjb25kPTI0MSBhbW91bnQ9LTJcbmtlcm5pbmcgZmlyc3Q9MzkgIHNlY29uZD05NyAgYW1vdW50PS00XG5rZXJuaW5nIGZpcnN0PTM5ICBzZWNvbmQ9MjI0IGFtb3VudD0tNFxua2VybmluZyBmaXJzdD0zOSAgc2Vjb25kPTIyNSBhbW91bnQ9LTRcbmtlcm5pbmcgZmlyc3Q9MzkgIHNlY29uZD0yMjYgYW1vdW50PS00XG5rZXJuaW5nIGZpcnN0PTM5ICBzZWNvbmQ9MjI3IGFtb3VudD0tNFxua2VybmluZyBmaXJzdD0zOSAgc2Vjb25kPTIyOCBhbW91bnQ9LTRcbmtlcm5pbmcgZmlyc3Q9MzkgIHNlY29uZD0yMjkgYW1vdW50PS00XG5rZXJuaW5nIGZpcnN0PTM5ICBzZWNvbmQ9MTE1IGFtb3VudD0tNlxua2VybmluZyBmaXJzdD00NCAgc2Vjb25kPTM0ICBhbW91bnQ9LTEzXG5rZXJuaW5nIGZpcnN0PTQ0ICBzZWNvbmQ9MzkgIGFtb3VudD0tMTNcbmtlcm5pbmcgZmlyc3Q9NDYgIHNlY29uZD0zNCAgYW1vdW50PS0xM1xua2VybmluZyBmaXJzdD00NiAgc2Vjb25kPTM5ICBhbW91bnQ9LTEzXG5rZXJuaW5nIGZpcnN0PTY1ICBzZWNvbmQ9MTE4IGFtb3VudD0tNFxua2VybmluZyBmaXJzdD02NSAgc2Vjb25kPTEyMSBhbW91bnQ9LTRcbmtlcm5pbmcgZmlyc3Q9NjUgIHNlY29uZD0yNTMgYW1vdW50PS00XG5rZXJuaW5nIGZpcnN0PTY1ICBzZWNvbmQ9MjU1IGFtb3VudD0tNFxua2VybmluZyBmaXJzdD02NSAgc2Vjb25kPTY3ICBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9NjUgIHNlY29uZD03MSAgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTY1ICBzZWNvbmQ9NzkgIGFtb3VudD0tMVxua2VybmluZyBmaXJzdD02NSAgc2Vjb25kPTgxICBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9NjUgIHNlY29uZD0yMTYgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTY1ICBzZWNvbmQ9MTk5IGFtb3VudD0tMVxua2VybmluZyBmaXJzdD02NSAgc2Vjb25kPTIxMCBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9NjUgIHNlY29uZD0yMTEgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTY1ICBzZWNvbmQ9MjEyIGFtb3VudD0tMVxua2VybmluZyBmaXJzdD02NSAgc2Vjb25kPTIxMyBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9NjUgIHNlY29uZD0yMTQgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTY1ICBzZWNvbmQ9ODUgIGFtb3VudD0tMVxua2VybmluZyBmaXJzdD02NSAgc2Vjb25kPTIxNyBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9NjUgIHNlY29uZD0yMTggYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTY1ICBzZWNvbmQ9MjE5IGFtb3VudD0tMVxua2VybmluZyBmaXJzdD02NSAgc2Vjb25kPTIyMCBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9NjUgIHNlY29uZD0zNCAgYW1vdW50PS05XG5rZXJuaW5nIGZpcnN0PTY1ICBzZWNvbmQ9MzkgIGFtb3VudD0tOVxua2VybmluZyBmaXJzdD02NSAgc2Vjb25kPTExMSBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9NjUgIHNlY29uZD0yNDIgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTY1ICBzZWNvbmQ9MjQzIGFtb3VudD0tMVxua2VybmluZyBmaXJzdD02NSAgc2Vjb25kPTI0NCBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9NjUgIHNlY29uZD0yNDUgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTY1ICBzZWNvbmQ9MjQ2IGFtb3VudD0tMVxua2VybmluZyBmaXJzdD02NSAgc2Vjb25kPTg3ICBhbW91bnQ9LTVcbmtlcm5pbmcgZmlyc3Q9NjUgIHNlY29uZD04NCAgYW1vdW50PS0xMFxua2VybmluZyBmaXJzdD02NSAgc2Vjb25kPTExNyBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9NjUgIHNlY29uZD0yNDkgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTY1ICBzZWNvbmQ9MjUwIGFtb3VudD0tMVxua2VybmluZyBmaXJzdD02NSAgc2Vjb25kPTI1MSBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9NjUgIHNlY29uZD0yNTIgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTY1ICBzZWNvbmQ9MTIyIGFtb3VudD0xXG5rZXJuaW5nIGZpcnN0PTY1ICBzZWNvbmQ9ODYgIGFtb3VudD0tN1xua2VybmluZyBmaXJzdD02NSAgc2Vjb25kPTg5ICBhbW91bnQ9LTdcbmtlcm5pbmcgZmlyc3Q9NjUgIHNlY29uZD0yMjEgYW1vdW50PS03XG5rZXJuaW5nIGZpcnN0PTY2ICBzZWNvbmQ9ODQgIGFtb3VudD0tMlxua2VybmluZyBmaXJzdD02NiAgc2Vjb25kPTg2ICBhbW91bnQ9LTJcbmtlcm5pbmcgZmlyc3Q9NjYgIHNlY29uZD04OSAgYW1vdW50PS00XG5rZXJuaW5nIGZpcnN0PTY2ICBzZWNvbmQ9MjIxIGFtb3VudD0tNFxua2VybmluZyBmaXJzdD02NyAgc2Vjb25kPTg0ICBhbW91bnQ9LTJcbmtlcm5pbmcgZmlyc3Q9NjggIHNlY29uZD04NCAgYW1vdW50PS0yXG5rZXJuaW5nIGZpcnN0PTY4ICBzZWNvbmQ9ODYgIGFtb3VudD0tMlxua2VybmluZyBmaXJzdD02OCAgc2Vjb25kPTg5ICBhbW91bnQ9LTNcbmtlcm5pbmcgZmlyc3Q9NjggIHNlY29uZD0yMjEgYW1vdW50PS0zXG5rZXJuaW5nIGZpcnN0PTY4ICBzZWNvbmQ9NjUgIGFtb3VudD0tMlxua2VybmluZyBmaXJzdD02OCAgc2Vjb25kPTE5MiBhbW91bnQ9LTJcbmtlcm5pbmcgZmlyc3Q9NjggIHNlY29uZD0xOTMgYW1vdW50PS0yXG5rZXJuaW5nIGZpcnN0PTY4ICBzZWNvbmQ9MTk0IGFtb3VudD0tMlxua2VybmluZyBmaXJzdD02OCAgc2Vjb25kPTE5NSBhbW91bnQ9LTJcbmtlcm5pbmcgZmlyc3Q9NjggIHNlY29uZD0xOTYgYW1vdW50PS0yXG5rZXJuaW5nIGZpcnN0PTY4ICBzZWNvbmQ9MTk3IGFtb3VudD0tMlxua2VybmluZyBmaXJzdD02OCAgc2Vjb25kPTg4ICBhbW91bnQ9LTJcbmtlcm5pbmcgZmlyc3Q9NjggIHNlY29uZD00NCAgYW1vdW50PS04XG5rZXJuaW5nIGZpcnN0PTY4ICBzZWNvbmQ9NDYgIGFtb3VudD0tOFxua2VybmluZyBmaXJzdD02OCAgc2Vjb25kPTkwICBhbW91bnQ9LTJcbmtlcm5pbmcgZmlyc3Q9NjkgIHNlY29uZD0xMTggYW1vdW50PS0yXG5rZXJuaW5nIGZpcnN0PTY5ICBzZWNvbmQ9MTIxIGFtb3VudD0tMlxua2VybmluZyBmaXJzdD02OSAgc2Vjb25kPTI1MyBhbW91bnQ9LTJcbmtlcm5pbmcgZmlyc3Q9NjkgIHNlY29uZD0yNTUgYW1vdW50PS0yXG5rZXJuaW5nIGZpcnN0PTY5ICBzZWNvbmQ9MTExIGFtb3VudD0tMVxua2VybmluZyBmaXJzdD02OSAgc2Vjb25kPTI0MiBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9NjkgIHNlY29uZD0yNDMgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTY5ICBzZWNvbmQ9MjQ0IGFtb3VudD0tMVxua2VybmluZyBmaXJzdD02OSAgc2Vjb25kPTI0NSBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9NjkgIHNlY29uZD0yNDYgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTY5ICBzZWNvbmQ9ODQgIGFtb3VudD0yXG5rZXJuaW5nIGZpcnN0PTY5ICBzZWNvbmQ9MTE3IGFtb3VudD0tMVxua2VybmluZyBmaXJzdD02OSAgc2Vjb25kPTI0OSBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9NjkgIHNlY29uZD0yNTAgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTY5ICBzZWNvbmQ9MjUxIGFtb3VudD0tMVxua2VybmluZyBmaXJzdD02OSAgc2Vjb25kPTI1MiBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9NjkgIHNlY29uZD05OSAgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTY5ICBzZWNvbmQ9MTAwIGFtb3VudD0tMVxua2VybmluZyBmaXJzdD02OSAgc2Vjb25kPTEwMSBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9NjkgIHNlY29uZD0xMDMgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTY5ICBzZWNvbmQ9MTEzIGFtb3VudD0tMVxua2VybmluZyBmaXJzdD02OSAgc2Vjb25kPTIzMSBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9NjkgIHNlY29uZD0yMzIgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTY5ICBzZWNvbmQ9MjMzIGFtb3VudD0tMVxua2VybmluZyBmaXJzdD02OSAgc2Vjb25kPTIzNCBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9NjkgIHNlY29uZD0yMzUgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTcyICBzZWNvbmQ9ODQgIGFtb3VudD0tMlxua2VybmluZyBmaXJzdD03MiAgc2Vjb25kPTg5ICBhbW91bnQ9LTJcbmtlcm5pbmcgZmlyc3Q9NzIgIHNlY29uZD0yMjEgYW1vdW50PS0yXG5rZXJuaW5nIGZpcnN0PTcyICBzZWNvbmQ9NjUgIGFtb3VudD0xXG5rZXJuaW5nIGZpcnN0PTcyICBzZWNvbmQ9MTkyIGFtb3VudD0xXG5rZXJuaW5nIGZpcnN0PTcyICBzZWNvbmQ9MTkzIGFtb3VudD0xXG5rZXJuaW5nIGZpcnN0PTcyICBzZWNvbmQ9MTk0IGFtb3VudD0xXG5rZXJuaW5nIGZpcnN0PTcyICBzZWNvbmQ9MTk1IGFtb3VudD0xXG5rZXJuaW5nIGZpcnN0PTcyICBzZWNvbmQ9MTk2IGFtb3VudD0xXG5rZXJuaW5nIGZpcnN0PTcyICBzZWNvbmQ9MTk3IGFtb3VudD0xXG5rZXJuaW5nIGZpcnN0PTcyICBzZWNvbmQ9ODggIGFtb3VudD0xXG5rZXJuaW5nIGZpcnN0PTczICBzZWNvbmQ9ODQgIGFtb3VudD0tMlxua2VybmluZyBmaXJzdD03MyAgc2Vjb25kPTg5ICBhbW91bnQ9LTJcbmtlcm5pbmcgZmlyc3Q9NzMgIHNlY29uZD0yMjEgYW1vdW50PS0yXG5rZXJuaW5nIGZpcnN0PTczICBzZWNvbmQ9NjUgIGFtb3VudD0xXG5rZXJuaW5nIGZpcnN0PTczICBzZWNvbmQ9MTkyIGFtb3VudD0xXG5rZXJuaW5nIGZpcnN0PTczICBzZWNvbmQ9MTkzIGFtb3VudD0xXG5rZXJuaW5nIGZpcnN0PTczICBzZWNvbmQ9MTk0IGFtb3VudD0xXG5rZXJuaW5nIGZpcnN0PTczICBzZWNvbmQ9MTk1IGFtb3VudD0xXG5rZXJuaW5nIGZpcnN0PTczICBzZWNvbmQ9MTk2IGFtb3VudD0xXG5rZXJuaW5nIGZpcnN0PTczICBzZWNvbmQ9MTk3IGFtb3VudD0xXG5rZXJuaW5nIGZpcnN0PTczICBzZWNvbmQ9ODggIGFtb3VudD0xXG5rZXJuaW5nIGZpcnN0PTc0ICBzZWNvbmQ9NjUgIGFtb3VudD0tMlxua2VybmluZyBmaXJzdD03NCAgc2Vjb25kPTE5MiBhbW91bnQ9LTJcbmtlcm5pbmcgZmlyc3Q9NzQgIHNlY29uZD0xOTMgYW1vdW50PS0yXG5rZXJuaW5nIGZpcnN0PTc0ICBzZWNvbmQ9MTk0IGFtb3VudD0tMlxua2VybmluZyBmaXJzdD03NCAgc2Vjb25kPTE5NSBhbW91bnQ9LTJcbmtlcm5pbmcgZmlyc3Q9NzQgIHNlY29uZD0xOTYgYW1vdW50PS0yXG5rZXJuaW5nIGZpcnN0PTc0ICBzZWNvbmQ9MTk3IGFtb3VudD0tMlxua2VybmluZyBmaXJzdD03NSAgc2Vjb25kPTExOCBhbW91bnQ9LTNcbmtlcm5pbmcgZmlyc3Q9NzUgIHNlY29uZD0xMjEgYW1vdW50PS0zXG5rZXJuaW5nIGZpcnN0PTc1ICBzZWNvbmQ9MjUzIGFtb3VudD0tM1xua2VybmluZyBmaXJzdD03NSAgc2Vjb25kPTI1NSBhbW91bnQ9LTNcbmtlcm5pbmcgZmlyc3Q9NzUgIHNlY29uZD02NyAgYW1vdW50PS0yXG5rZXJuaW5nIGZpcnN0PTc1ICBzZWNvbmQ9NzEgIGFtb3VudD0tMlxua2VybmluZyBmaXJzdD03NSAgc2Vjb25kPTc5ICBhbW91bnQ9LTJcbmtlcm5pbmcgZmlyc3Q9NzUgIHNlY29uZD04MSAgYW1vdW50PS0yXG5rZXJuaW5nIGZpcnN0PTc1ICBzZWNvbmQ9MjE2IGFtb3VudD0tMlxua2VybmluZyBmaXJzdD03NSAgc2Vjb25kPTE5OSBhbW91bnQ9LTJcbmtlcm5pbmcgZmlyc3Q9NzUgIHNlY29uZD0yMTAgYW1vdW50PS0yXG5rZXJuaW5nIGZpcnN0PTc1ICBzZWNvbmQ9MjExIGFtb3VudD0tMlxua2VybmluZyBmaXJzdD03NSAgc2Vjb25kPTIxMiBhbW91bnQ9LTJcbmtlcm5pbmcgZmlyc3Q9NzUgIHNlY29uZD0yMTMgYW1vdW50PS0yXG5rZXJuaW5nIGZpcnN0PTc1ICBzZWNvbmQ9MjE0IGFtb3VudD0tMlxua2VybmluZyBmaXJzdD03NSAgc2Vjb25kPTExMSBhbW91bnQ9LTJcbmtlcm5pbmcgZmlyc3Q9NzUgIHNlY29uZD0yNDIgYW1vdW50PS0yXG5rZXJuaW5nIGZpcnN0PTc1ICBzZWNvbmQ9MjQzIGFtb3VudD0tMlxua2VybmluZyBmaXJzdD03NSAgc2Vjb25kPTI0NCBhbW91bnQ9LTJcbmtlcm5pbmcgZmlyc3Q9NzUgIHNlY29uZD0yNDUgYW1vdW50PS0yXG5rZXJuaW5nIGZpcnN0PTc1ICBzZWNvbmQ9MjQ2IGFtb3VudD0tMlxua2VybmluZyBmaXJzdD03NSAgc2Vjb25kPTExNyBhbW91bnQ9LTJcbmtlcm5pbmcgZmlyc3Q9NzUgIHNlY29uZD0yNDkgYW1vdW50PS0yXG5rZXJuaW5nIGZpcnN0PTc1ICBzZWNvbmQ9MjUwIGFtb3VudD0tMlxua2VybmluZyBmaXJzdD03NSAgc2Vjb25kPTI1MSBhbW91bnQ9LTJcbmtlcm5pbmcgZmlyc3Q9NzUgIHNlY29uZD0yNTIgYW1vdW50PS0yXG5rZXJuaW5nIGZpcnN0PTc1ICBzZWNvbmQ9OTkgIGFtb3VudD0tMlxua2VybmluZyBmaXJzdD03NSAgc2Vjb25kPTEwMCBhbW91bnQ9LTJcbmtlcm5pbmcgZmlyc3Q9NzUgIHNlY29uZD0xMDEgYW1vdW50PS0yXG5rZXJuaW5nIGZpcnN0PTc1ICBzZWNvbmQ9MTAzIGFtb3VudD0tMlxua2VybmluZyBmaXJzdD03NSAgc2Vjb25kPTExMyBhbW91bnQ9LTJcbmtlcm5pbmcgZmlyc3Q9NzUgIHNlY29uZD0yMzEgYW1vdW50PS0yXG5rZXJuaW5nIGZpcnN0PTc1ICBzZWNvbmQ9MjMyIGFtb3VudD0tMlxua2VybmluZyBmaXJzdD03NSAgc2Vjb25kPTIzMyBhbW91bnQ9LTJcbmtlcm5pbmcgZmlyc3Q9NzUgIHNlY29uZD0yMzQgYW1vdW50PS0yXG5rZXJuaW5nIGZpcnN0PTc1ICBzZWNvbmQ9MjM1IGFtb3VudD0tMlxua2VybmluZyBmaXJzdD03NSAgc2Vjb25kPTQ1ICBhbW91bnQ9LTVcbmtlcm5pbmcgZmlyc3Q9NzUgIHNlY29uZD0xNzMgYW1vdW50PS01XG5rZXJuaW5nIGZpcnN0PTc1ICBzZWNvbmQ9MTA5IGFtb3VudD0tMlxua2VybmluZyBmaXJzdD03NSAgc2Vjb25kPTExMCBhbW91bnQ9LTJcbmtlcm5pbmcgZmlyc3Q9NzUgIHNlY29uZD0xMTIgYW1vdW50PS0yXG5rZXJuaW5nIGZpcnN0PTc1ICBzZWNvbmQ9MjQxIGFtb3VudD0tMlxua2VybmluZyBmaXJzdD03NiAgc2Vjb25kPTExOCBhbW91bnQ9LTEwXG5rZXJuaW5nIGZpcnN0PTc2ICBzZWNvbmQ9MTIxIGFtb3VudD0tMTBcbmtlcm5pbmcgZmlyc3Q9NzYgIHNlY29uZD0yNTMgYW1vdW50PS0xMFxua2VybmluZyBmaXJzdD03NiAgc2Vjb25kPTI1NSBhbW91bnQ9LTEwXG5rZXJuaW5nIGZpcnN0PTc2ICBzZWNvbmQ9NjcgIGFtb3VudD0tNVxua2VybmluZyBmaXJzdD03NiAgc2Vjb25kPTcxICBhbW91bnQ9LTVcbmtlcm5pbmcgZmlyc3Q9NzYgIHNlY29uZD03OSAgYW1vdW50PS01XG5rZXJuaW5nIGZpcnN0PTc2ICBzZWNvbmQ9ODEgIGFtb3VudD0tNVxua2VybmluZyBmaXJzdD03NiAgc2Vjb25kPTIxNiBhbW91bnQ9LTVcbmtlcm5pbmcgZmlyc3Q9NzYgIHNlY29uZD0xOTkgYW1vdW50PS01XG5rZXJuaW5nIGZpcnN0PTc2ICBzZWNvbmQ9MjEwIGFtb3VudD0tNVxua2VybmluZyBmaXJzdD03NiAgc2Vjb25kPTIxMSBhbW91bnQ9LTVcbmtlcm5pbmcgZmlyc3Q9NzYgIHNlY29uZD0yMTIgYW1vdW50PS01XG5rZXJuaW5nIGZpcnN0PTc2ICBzZWNvbmQ9MjEzIGFtb3VudD0tNVxua2VybmluZyBmaXJzdD03NiAgc2Vjb25kPTIxNCBhbW91bnQ9LTVcbmtlcm5pbmcgZmlyc3Q9NzYgIHNlY29uZD04NSAgYW1vdW50PS00XG5rZXJuaW5nIGZpcnN0PTc2ICBzZWNvbmQ9MjE3IGFtb3VudD0tNFxua2VybmluZyBmaXJzdD03NiAgc2Vjb25kPTIxOCBhbW91bnQ9LTRcbmtlcm5pbmcgZmlyc3Q9NzYgIHNlY29uZD0yMTkgYW1vdW50PS00XG5rZXJuaW5nIGZpcnN0PTc2ICBzZWNvbmQ9MjIwIGFtb3VudD0tNFxua2VybmluZyBmaXJzdD03NiAgc2Vjb25kPTM0ICBhbW91bnQ9LTI2XG5rZXJuaW5nIGZpcnN0PTc2ICBzZWNvbmQ9MzkgIGFtb3VudD0tMjZcbmtlcm5pbmcgZmlyc3Q9NzYgIHNlY29uZD04NyAgYW1vdW50PS0xMVxua2VybmluZyBmaXJzdD03NiAgc2Vjb25kPTg0ICBhbW91bnQ9LTIxXG5rZXJuaW5nIGZpcnN0PTc2ICBzZWNvbmQ9MTE3IGFtb3VudD0tM1xua2VybmluZyBmaXJzdD03NiAgc2Vjb25kPTI0OSBhbW91bnQ9LTNcbmtlcm5pbmcgZmlyc3Q9NzYgIHNlY29uZD0yNTAgYW1vdW50PS0zXG5rZXJuaW5nIGZpcnN0PTc2ICBzZWNvbmQ9MjUxIGFtb3VudD0tM1xua2VybmluZyBmaXJzdD03NiAgc2Vjb25kPTI1MiBhbW91bnQ9LTNcbmtlcm5pbmcgZmlyc3Q9NzYgIHNlY29uZD04NiAgYW1vdW50PS0xNFxua2VybmluZyBmaXJzdD03NiAgc2Vjb25kPTg5ICBhbW91bnQ9LTE5XG5rZXJuaW5nIGZpcnN0PTc2ICBzZWNvbmQ9MjIxIGFtb3VudD0tMTlcbmtlcm5pbmcgZmlyc3Q9NzYgIHNlY29uZD02NSAgYW1vdW50PTFcbmtlcm5pbmcgZmlyc3Q9NzYgIHNlY29uZD0xOTIgYW1vdW50PTFcbmtlcm5pbmcgZmlyc3Q9NzYgIHNlY29uZD0xOTMgYW1vdW50PTFcbmtlcm5pbmcgZmlyc3Q9NzYgIHNlY29uZD0xOTQgYW1vdW50PTFcbmtlcm5pbmcgZmlyc3Q9NzYgIHNlY29uZD0xOTUgYW1vdW50PTFcbmtlcm5pbmcgZmlyc3Q9NzYgIHNlY29uZD0xOTYgYW1vdW50PTFcbmtlcm5pbmcgZmlyc3Q9NzYgIHNlY29uZD0xOTcgYW1vdW50PTFcbmtlcm5pbmcgZmlyc3Q9NzcgIHNlY29uZD04NCAgYW1vdW50PS0yXG5rZXJuaW5nIGZpcnN0PTc3ICBzZWNvbmQ9ODkgIGFtb3VudD0tMlxua2VybmluZyBmaXJzdD03NyAgc2Vjb25kPTIyMSBhbW91bnQ9LTJcbmtlcm5pbmcgZmlyc3Q9NzcgIHNlY29uZD02NSAgYW1vdW50PTFcbmtlcm5pbmcgZmlyc3Q9NzcgIHNlY29uZD0xOTIgYW1vdW50PTFcbmtlcm5pbmcgZmlyc3Q9NzcgIHNlY29uZD0xOTMgYW1vdW50PTFcbmtlcm5pbmcgZmlyc3Q9NzcgIHNlY29uZD0xOTQgYW1vdW50PTFcbmtlcm5pbmcgZmlyc3Q9NzcgIHNlY29uZD0xOTUgYW1vdW50PTFcbmtlcm5pbmcgZmlyc3Q9NzcgIHNlY29uZD0xOTYgYW1vdW50PTFcbmtlcm5pbmcgZmlyc3Q9NzcgIHNlY29uZD0xOTcgYW1vdW50PTFcbmtlcm5pbmcgZmlyc3Q9NzcgIHNlY29uZD04OCAgYW1vdW50PTFcbmtlcm5pbmcgZmlyc3Q9NzggIHNlY29uZD04NCAgYW1vdW50PS0yXG5rZXJuaW5nIGZpcnN0PTc4ICBzZWNvbmQ9ODkgIGFtb3VudD0tMlxua2VybmluZyBmaXJzdD03OCAgc2Vjb25kPTIyMSBhbW91bnQ9LTJcbmtlcm5pbmcgZmlyc3Q9NzggIHNlY29uZD02NSAgYW1vdW50PTFcbmtlcm5pbmcgZmlyc3Q9NzggIHNlY29uZD0xOTIgYW1vdW50PTFcbmtlcm5pbmcgZmlyc3Q9NzggIHNlY29uZD0xOTMgYW1vdW50PTFcbmtlcm5pbmcgZmlyc3Q9NzggIHNlY29uZD0xOTQgYW1vdW50PTFcbmtlcm5pbmcgZmlyc3Q9NzggIHNlY29uZD0xOTUgYW1vdW50PTFcbmtlcm5pbmcgZmlyc3Q9NzggIHNlY29uZD0xOTYgYW1vdW50PTFcbmtlcm5pbmcgZmlyc3Q9NzggIHNlY29uZD0xOTcgYW1vdW50PTFcbmtlcm5pbmcgZmlyc3Q9NzggIHNlY29uZD04OCAgYW1vdW50PTFcbmtlcm5pbmcgZmlyc3Q9NzkgIHNlY29uZD04NCAgYW1vdW50PS0yXG5rZXJuaW5nIGZpcnN0PTc5ICBzZWNvbmQ9ODYgIGFtb3VudD0tMlxua2VybmluZyBmaXJzdD03OSAgc2Vjb25kPTg5ICBhbW91bnQ9LTNcbmtlcm5pbmcgZmlyc3Q9NzkgIHNlY29uZD0yMjEgYW1vdW50PS0zXG5rZXJuaW5nIGZpcnN0PTc5ICBzZWNvbmQ9NjUgIGFtb3VudD0tMlxua2VybmluZyBmaXJzdD03OSAgc2Vjb25kPTE5MiBhbW91bnQ9LTJcbmtlcm5pbmcgZmlyc3Q9NzkgIHNlY29uZD0xOTMgYW1vdW50PS0yXG5rZXJuaW5nIGZpcnN0PTc5ICBzZWNvbmQ9MTk0IGFtb3VudD0tMlxua2VybmluZyBmaXJzdD03OSAgc2Vjb25kPTE5NSBhbW91bnQ9LTJcbmtlcm5pbmcgZmlyc3Q9NzkgIHNlY29uZD0xOTYgYW1vdW50PS0yXG5rZXJuaW5nIGZpcnN0PTc5ICBzZWNvbmQ9MTk3IGFtb3VudD0tMlxua2VybmluZyBmaXJzdD03OSAgc2Vjb25kPTg4ICBhbW91bnQ9LTJcbmtlcm5pbmcgZmlyc3Q9NzkgIHNlY29uZD00NCAgYW1vdW50PS04XG5rZXJuaW5nIGZpcnN0PTc5ICBzZWNvbmQ9NDYgIGFtb3VudD0tOFxua2VybmluZyBmaXJzdD03OSAgc2Vjb25kPTkwICBhbW91bnQ9LTJcbmtlcm5pbmcgZmlyc3Q9ODAgIHNlY29uZD0xMTggYW1vdW50PTFcbmtlcm5pbmcgZmlyc3Q9ODAgIHNlY29uZD0xMjEgYW1vdW50PTFcbmtlcm5pbmcgZmlyc3Q9ODAgIHNlY29uZD0yNTMgYW1vdW50PTFcbmtlcm5pbmcgZmlyc3Q9ODAgIHNlY29uZD0yNTUgYW1vdW50PTFcbmtlcm5pbmcgZmlyc3Q9ODAgIHNlY29uZD0xMTEgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTgwICBzZWNvbmQ9MjQyIGFtb3VudD0tMVxua2VybmluZyBmaXJzdD04MCAgc2Vjb25kPTI0MyBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9ODAgIHNlY29uZD0yNDQgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTgwICBzZWNvbmQ9MjQ1IGFtb3VudD0tMVxua2VybmluZyBmaXJzdD04MCAgc2Vjb25kPTI0NiBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9ODAgIHNlY29uZD02NSAgYW1vdW50PS0xMVxua2VybmluZyBmaXJzdD04MCAgc2Vjb25kPTE5MiBhbW91bnQ9LTExXG5rZXJuaW5nIGZpcnN0PTgwICBzZWNvbmQ9MTkzIGFtb3VudD0tMTFcbmtlcm5pbmcgZmlyc3Q9ODAgIHNlY29uZD0xOTQgYW1vdW50PS0xMVxua2VybmluZyBmaXJzdD04MCAgc2Vjb25kPTE5NSBhbW91bnQ9LTExXG5rZXJuaW5nIGZpcnN0PTgwICBzZWNvbmQ9MTk2IGFtb3VudD0tMTFcbmtlcm5pbmcgZmlyc3Q9ODAgIHNlY29uZD0xOTcgYW1vdW50PS0xMVxua2VybmluZyBmaXJzdD04MCAgc2Vjb25kPTg4ICBhbW91bnQ9LTJcbmtlcm5pbmcgZmlyc3Q9ODAgIHNlY29uZD00NCAgYW1vdW50PS0yNVxua2VybmluZyBmaXJzdD04MCAgc2Vjb25kPTQ2ICBhbW91bnQ9LTI1XG5rZXJuaW5nIGZpcnN0PTgwICBzZWNvbmQ9OTAgIGFtb3VudD0tMlxua2VybmluZyBmaXJzdD04MCAgc2Vjb25kPTk5ICBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9ODAgIHNlY29uZD0xMDAgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTgwICBzZWNvbmQ9MTAxIGFtb3VudD0tMVxua2VybmluZyBmaXJzdD04MCAgc2Vjb25kPTEwMyBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9ODAgIHNlY29uZD0xMTMgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTgwICBzZWNvbmQ9MjMxIGFtb3VudD0tMVxua2VybmluZyBmaXJzdD04MCAgc2Vjb25kPTIzMiBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9ODAgIHNlY29uZD0yMzMgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTgwICBzZWNvbmQ9MjM0IGFtb3VudD0tMVxua2VybmluZyBmaXJzdD04MCAgc2Vjb25kPTIzNSBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9ODAgIHNlY29uZD05NyAgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTgwICBzZWNvbmQ9MjI0IGFtb3VudD0tMVxua2VybmluZyBmaXJzdD04MCAgc2Vjb25kPTIyNSBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9ODAgIHNlY29uZD0yMjYgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTgwICBzZWNvbmQ9MjI3IGFtb3VudD0tMVxua2VybmluZyBmaXJzdD04MCAgc2Vjb25kPTIyOCBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9ODAgIHNlY29uZD0yMjkgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTgwICBzZWNvbmQ9NzQgIGFtb3VudD0tMTZcbmtlcm5pbmcgZmlyc3Q9ODQgIHNlY29uZD0xMTggYW1vdW50PS02XG5rZXJuaW5nIGZpcnN0PTg0ICBzZWNvbmQ9MTIxIGFtb3VudD0tNlxua2VybmluZyBmaXJzdD04NCAgc2Vjb25kPTI1MyBhbW91bnQ9LTZcbmtlcm5pbmcgZmlyc3Q9ODQgIHNlY29uZD0yNTUgYW1vdW50PS02XG5rZXJuaW5nIGZpcnN0PTg0ICBzZWNvbmQ9NjcgIGFtb3VudD0tMlxua2VybmluZyBmaXJzdD04NCAgc2Vjb25kPTcxICBhbW91bnQ9LTJcbmtlcm5pbmcgZmlyc3Q9ODQgIHNlY29uZD03OSAgYW1vdW50PS0yXG5rZXJuaW5nIGZpcnN0PTg0ICBzZWNvbmQ9ODEgIGFtb3VudD0tMlxua2VybmluZyBmaXJzdD04NCAgc2Vjb25kPTIxNiBhbW91bnQ9LTJcbmtlcm5pbmcgZmlyc3Q9ODQgIHNlY29uZD0xOTkgYW1vdW50PS0yXG5rZXJuaW5nIGZpcnN0PTg0ICBzZWNvbmQ9MjEwIGFtb3VudD0tMlxua2VybmluZyBmaXJzdD04NCAgc2Vjb25kPTIxMSBhbW91bnQ9LTJcbmtlcm5pbmcgZmlyc3Q9ODQgIHNlY29uZD0yMTIgYW1vdW50PS0yXG5rZXJuaW5nIGZpcnN0PTg0ICBzZWNvbmQ9MjEzIGFtb3VudD0tMlxua2VybmluZyBmaXJzdD04NCAgc2Vjb25kPTIxNCBhbW91bnQ9LTJcbmtlcm5pbmcgZmlyc3Q9ODQgIHNlY29uZD0xMTEgYW1vdW50PS04XG5rZXJuaW5nIGZpcnN0PTg0ICBzZWNvbmQ9MjQyIGFtb3VudD0tOFxua2VybmluZyBmaXJzdD04NCAgc2Vjb25kPTI0MyBhbW91bnQ9LThcbmtlcm5pbmcgZmlyc3Q9ODQgIHNlY29uZD0yNDQgYW1vdW50PS04XG5rZXJuaW5nIGZpcnN0PTg0ICBzZWNvbmQ9MjQ1IGFtb3VudD0tOFxua2VybmluZyBmaXJzdD04NCAgc2Vjb25kPTI0NiBhbW91bnQ9LThcbmtlcm5pbmcgZmlyc3Q9ODQgIHNlY29uZD04NyAgYW1vdW50PTFcbmtlcm5pbmcgZmlyc3Q9ODQgIHNlY29uZD04NCAgYW1vdW50PTFcbmtlcm5pbmcgZmlyc3Q9ODQgIHNlY29uZD0xMTcgYW1vdW50PS03XG5rZXJuaW5nIGZpcnN0PTg0ICBzZWNvbmQ9MjQ5IGFtb3VudD0tN1xua2VybmluZyBmaXJzdD04NCAgc2Vjb25kPTI1MCBhbW91bnQ9LTdcbmtlcm5pbmcgZmlyc3Q9ODQgIHNlY29uZD0yNTEgYW1vdW50PS03XG5rZXJuaW5nIGZpcnN0PTg0ICBzZWNvbmQ9MjUyIGFtb3VudD0tN1xua2VybmluZyBmaXJzdD04NCAgc2Vjb25kPTEyMiBhbW91bnQ9LTVcbmtlcm5pbmcgZmlyc3Q9ODQgIHNlY29uZD04NiAgYW1vdW50PTFcbmtlcm5pbmcgZmlyc3Q9ODQgIHNlY29uZD04OSAgYW1vdW50PTFcbmtlcm5pbmcgZmlyc3Q9ODQgIHNlY29uZD0yMjEgYW1vdW50PTFcbmtlcm5pbmcgZmlyc3Q9ODQgIHNlY29uZD02NSAgYW1vdW50PS02XG5rZXJuaW5nIGZpcnN0PTg0ICBzZWNvbmQ9MTkyIGFtb3VudD0tNlxua2VybmluZyBmaXJzdD04NCAgc2Vjb25kPTE5MyBhbW91bnQ9LTZcbmtlcm5pbmcgZmlyc3Q9ODQgIHNlY29uZD0xOTQgYW1vdW50PS02XG5rZXJuaW5nIGZpcnN0PTg0ICBzZWNvbmQ9MTk1IGFtb3VudD0tNlxua2VybmluZyBmaXJzdD04NCAgc2Vjb25kPTE5NiBhbW91bnQ9LTZcbmtlcm5pbmcgZmlyc3Q9ODQgIHNlY29uZD0xOTcgYW1vdW50PS02XG5rZXJuaW5nIGZpcnN0PTg0ICBzZWNvbmQ9NDQgIGFtb3VudD0tMTdcbmtlcm5pbmcgZmlyc3Q9ODQgIHNlY29uZD00NiAgYW1vdW50PS0xN1xua2VybmluZyBmaXJzdD04NCAgc2Vjb25kPTk5ICBhbW91bnQ9LThcbmtlcm5pbmcgZmlyc3Q9ODQgIHNlY29uZD0xMDAgYW1vdW50PS04XG5rZXJuaW5nIGZpcnN0PTg0ICBzZWNvbmQ9MTAxIGFtb3VudD0tOFxua2VybmluZyBmaXJzdD04NCAgc2Vjb25kPTEwMyBhbW91bnQ9LThcbmtlcm5pbmcgZmlyc3Q9ODQgIHNlY29uZD0xMTMgYW1vdW50PS04XG5rZXJuaW5nIGZpcnN0PTg0ICBzZWNvbmQ9MjMxIGFtb3VudD0tOFxua2VybmluZyBmaXJzdD04NCAgc2Vjb25kPTIzMiBhbW91bnQ9LThcbmtlcm5pbmcgZmlyc3Q9ODQgIHNlY29uZD0yMzMgYW1vdW50PS04XG5rZXJuaW5nIGZpcnN0PTg0ICBzZWNvbmQ9MjM0IGFtb3VudD0tOFxua2VybmluZyBmaXJzdD04NCAgc2Vjb25kPTIzNSBhbW91bnQ9LThcbmtlcm5pbmcgZmlyc3Q9ODQgIHNlY29uZD0xMjAgYW1vdW50PS02XG5rZXJuaW5nIGZpcnN0PTg0ICBzZWNvbmQ9NDUgIGFtb3VudD0tMThcbmtlcm5pbmcgZmlyc3Q9ODQgIHNlY29uZD0xNzMgYW1vdW50PS0xOFxua2VybmluZyBmaXJzdD04NCAgc2Vjb25kPTEwOSBhbW91bnQ9LTlcbmtlcm5pbmcgZmlyc3Q9ODQgIHNlY29uZD0xMTAgYW1vdW50PS05XG5rZXJuaW5nIGZpcnN0PTg0ICBzZWNvbmQ9MTEyIGFtb3VudD0tOVxua2VybmluZyBmaXJzdD04NCAgc2Vjb25kPTI0MSBhbW91bnQ9LTlcbmtlcm5pbmcgZmlyc3Q9ODQgIHNlY29uZD04MyAgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTg0ICBzZWNvbmQ9OTcgIGFtb3VudD0tOVxua2VybmluZyBmaXJzdD04NCAgc2Vjb25kPTIyNCBhbW91bnQ9LTlcbmtlcm5pbmcgZmlyc3Q9ODQgIHNlY29uZD0yMjUgYW1vdW50PS05XG5rZXJuaW5nIGZpcnN0PTg0ICBzZWNvbmQ9MjI2IGFtb3VudD0tOVxua2VybmluZyBmaXJzdD04NCAgc2Vjb25kPTIyNyBhbW91bnQ9LTlcbmtlcm5pbmcgZmlyc3Q9ODQgIHNlY29uZD0yMjggYW1vdW50PS05XG5rZXJuaW5nIGZpcnN0PTg0ICBzZWNvbmQ9MjI5IGFtb3VudD0tOVxua2VybmluZyBmaXJzdD04NCAgc2Vjb25kPTExNSBhbW91bnQ9LTlcbmtlcm5pbmcgZmlyc3Q9ODQgIHNlY29uZD03NCAgYW1vdW50PS0xOVxua2VybmluZyBmaXJzdD04NSAgc2Vjb25kPTY1ICBhbW91bnQ9LTJcbmtlcm5pbmcgZmlyc3Q9ODUgIHNlY29uZD0xOTIgYW1vdW50PS0yXG5rZXJuaW5nIGZpcnN0PTg1ICBzZWNvbmQ9MTkzIGFtb3VudD0tMlxua2VybmluZyBmaXJzdD04NSAgc2Vjb25kPTE5NCBhbW91bnQ9LTJcbmtlcm5pbmcgZmlyc3Q9ODUgIHNlY29uZD0xOTUgYW1vdW50PS0yXG5rZXJuaW5nIGZpcnN0PTg1ICBzZWNvbmQ9MTk2IGFtb3VudD0tMlxua2VybmluZyBmaXJzdD04NSAgc2Vjb25kPTE5NyBhbW91bnQ9LTJcbmtlcm5pbmcgZmlyc3Q9ODYgIHNlY29uZD0xMTggYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTg2ICBzZWNvbmQ9MTIxIGFtb3VudD0tMVxua2VybmluZyBmaXJzdD04NiAgc2Vjb25kPTI1MyBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9ODYgIHNlY29uZD0yNTUgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTg2ICBzZWNvbmQ9NjcgIGFtb3VudD0tMVxua2VybmluZyBmaXJzdD04NiAgc2Vjb25kPTcxICBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9ODYgIHNlY29uZD03OSAgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTg2ICBzZWNvbmQ9ODEgIGFtb3VudD0tMVxua2VybmluZyBmaXJzdD04NiAgc2Vjb25kPTIxNiBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9ODYgIHNlY29uZD0xOTkgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTg2ICBzZWNvbmQ9MjEwIGFtb3VudD0tMVxua2VybmluZyBmaXJzdD04NiAgc2Vjb25kPTIxMSBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9ODYgIHNlY29uZD0yMTIgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTg2ICBzZWNvbmQ9MjEzIGFtb3VudD0tMVxua2VybmluZyBmaXJzdD04NiAgc2Vjb25kPTIxNCBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9ODYgIHNlY29uZD0xMTEgYW1vdW50PS00XG5rZXJuaW5nIGZpcnN0PTg2ICBzZWNvbmQ9MjQyIGFtb3VudD0tNFxua2VybmluZyBmaXJzdD04NiAgc2Vjb25kPTI0MyBhbW91bnQ9LTRcbmtlcm5pbmcgZmlyc3Q9ODYgIHNlY29uZD0yNDQgYW1vdW50PS00XG5rZXJuaW5nIGZpcnN0PTg2ICBzZWNvbmQ9MjQ1IGFtb3VudD0tNFxua2VybmluZyBmaXJzdD04NiAgc2Vjb25kPTI0NiBhbW91bnQ9LTRcbmtlcm5pbmcgZmlyc3Q9ODYgIHNlY29uZD0xMTcgYW1vdW50PS0yXG5rZXJuaW5nIGZpcnN0PTg2ICBzZWNvbmQ9MjQ5IGFtb3VudD0tMlxua2VybmluZyBmaXJzdD04NiAgc2Vjb25kPTI1MCBhbW91bnQ9LTJcbmtlcm5pbmcgZmlyc3Q9ODYgIHNlY29uZD0yNTEgYW1vdW50PS0yXG5rZXJuaW5nIGZpcnN0PTg2ICBzZWNvbmQ9MjUyIGFtb3VudD0tMlxua2VybmluZyBmaXJzdD04NiAgc2Vjb25kPTY1ICBhbW91bnQ9LTZcbmtlcm5pbmcgZmlyc3Q9ODYgIHNlY29uZD0xOTIgYW1vdW50PS02XG5rZXJuaW5nIGZpcnN0PTg2ICBzZWNvbmQ9MTkzIGFtb3VudD0tNlxua2VybmluZyBmaXJzdD04NiAgc2Vjb25kPTE5NCBhbW91bnQ9LTZcbmtlcm5pbmcgZmlyc3Q9ODYgIHNlY29uZD0xOTUgYW1vdW50PS02XG5rZXJuaW5nIGZpcnN0PTg2ICBzZWNvbmQ9MTk2IGFtb3VudD0tNlxua2VybmluZyBmaXJzdD04NiAgc2Vjb25kPTE5NyBhbW91bnQ9LTZcbmtlcm5pbmcgZmlyc3Q9ODYgIHNlY29uZD00NCAgYW1vdW50PS0xOFxua2VybmluZyBmaXJzdD04NiAgc2Vjb25kPTQ2ICBhbW91bnQ9LTE4XG5rZXJuaW5nIGZpcnN0PTg2ICBzZWNvbmQ9OTkgIGFtb3VudD0tM1xua2VybmluZyBmaXJzdD04NiAgc2Vjb25kPTEwMCBhbW91bnQ9LTNcbmtlcm5pbmcgZmlyc3Q9ODYgIHNlY29uZD0xMDEgYW1vdW50PS0zXG5rZXJuaW5nIGZpcnN0PTg2ICBzZWNvbmQ9MTAzIGFtb3VudD0tM1xua2VybmluZyBmaXJzdD04NiAgc2Vjb25kPTExMyBhbW91bnQ9LTNcbmtlcm5pbmcgZmlyc3Q9ODYgIHNlY29uZD0yMzEgYW1vdW50PS0zXG5rZXJuaW5nIGZpcnN0PTg2ICBzZWNvbmQ9MjMyIGFtb3VudD0tM1xua2VybmluZyBmaXJzdD04NiAgc2Vjb25kPTIzMyBhbW91bnQ9LTNcbmtlcm5pbmcgZmlyc3Q9ODYgIHNlY29uZD0yMzQgYW1vdW50PS0zXG5rZXJuaW5nIGZpcnN0PTg2ICBzZWNvbmQ9MjM1IGFtb3VudD0tM1xua2VybmluZyBmaXJzdD04NiAgc2Vjb25kPTQ1ICBhbW91bnQ9LTNcbmtlcm5pbmcgZmlyc3Q9ODYgIHNlY29uZD0xNzMgYW1vdW50PS0zXG5rZXJuaW5nIGZpcnN0PTg2ICBzZWNvbmQ9OTcgIGFtb3VudD0tNFxua2VybmluZyBmaXJzdD04NiAgc2Vjb25kPTIyNCBhbW91bnQ9LTRcbmtlcm5pbmcgZmlyc3Q9ODYgIHNlY29uZD0yMjUgYW1vdW50PS00XG5rZXJuaW5nIGZpcnN0PTg2ICBzZWNvbmQ9MjI2IGFtb3VudD0tNFxua2VybmluZyBmaXJzdD04NiAgc2Vjb25kPTIyNyBhbW91bnQ9LTRcbmtlcm5pbmcgZmlyc3Q9ODYgIHNlY29uZD0yMjggYW1vdW50PS00XG5rZXJuaW5nIGZpcnN0PTg2ICBzZWNvbmQ9MjI5IGFtb3VudD0tNFxua2VybmluZyBmaXJzdD04NyAgc2Vjb25kPTExMSBhbW91bnQ9LTJcbmtlcm5pbmcgZmlyc3Q9ODcgIHNlY29uZD0yNDIgYW1vdW50PS0yXG5rZXJuaW5nIGZpcnN0PTg3ICBzZWNvbmQ9MjQzIGFtb3VudD0tMlxua2VybmluZyBmaXJzdD04NyAgc2Vjb25kPTI0NCBhbW91bnQ9LTJcbmtlcm5pbmcgZmlyc3Q9ODcgIHNlY29uZD0yNDUgYW1vdW50PS0yXG5rZXJuaW5nIGZpcnN0PTg3ICBzZWNvbmQ9MjQ2IGFtb3VudD0tMlxua2VybmluZyBmaXJzdD04NyAgc2Vjb25kPTg0ICBhbW91bnQ9MVxua2VybmluZyBmaXJzdD04NyAgc2Vjb25kPTExNyBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9ODcgIHNlY29uZD0yNDkgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTg3ICBzZWNvbmQ9MjUwIGFtb3VudD0tMVxua2VybmluZyBmaXJzdD04NyAgc2Vjb25kPTI1MSBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9ODcgIHNlY29uZD0yNTIgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTg3ICBzZWNvbmQ9NjUgIGFtb3VudD0tM1xua2VybmluZyBmaXJzdD04NyAgc2Vjb25kPTE5MiBhbW91bnQ9LTNcbmtlcm5pbmcgZmlyc3Q9ODcgIHNlY29uZD0xOTMgYW1vdW50PS0zXG5rZXJuaW5nIGZpcnN0PTg3ICBzZWNvbmQ9MTk0IGFtb3VudD0tM1xua2VybmluZyBmaXJzdD04NyAgc2Vjb25kPTE5NSBhbW91bnQ9LTNcbmtlcm5pbmcgZmlyc3Q9ODcgIHNlY29uZD0xOTYgYW1vdW50PS0zXG5rZXJuaW5nIGZpcnN0PTg3ICBzZWNvbmQ9MTk3IGFtb3VudD0tM1xua2VybmluZyBmaXJzdD04NyAgc2Vjb25kPTQ0ICBhbW91bnQ9LTEwXG5rZXJuaW5nIGZpcnN0PTg3ICBzZWNvbmQ9NDYgIGFtb3VudD0tMTBcbmtlcm5pbmcgZmlyc3Q9ODcgIHNlY29uZD05OSAgYW1vdW50PS0yXG5rZXJuaW5nIGZpcnN0PTg3ICBzZWNvbmQ9MTAwIGFtb3VudD0tMlxua2VybmluZyBmaXJzdD04NyAgc2Vjb25kPTEwMSBhbW91bnQ9LTJcbmtlcm5pbmcgZmlyc3Q9ODcgIHNlY29uZD0xMDMgYW1vdW50PS0yXG5rZXJuaW5nIGZpcnN0PTg3ICBzZWNvbmQ9MTEzIGFtb3VudD0tMlxua2VybmluZyBmaXJzdD04NyAgc2Vjb25kPTIzMSBhbW91bnQ9LTJcbmtlcm5pbmcgZmlyc3Q9ODcgIHNlY29uZD0yMzIgYW1vdW50PS0yXG5rZXJuaW5nIGZpcnN0PTg3ICBzZWNvbmQ9MjMzIGFtb3VudD0tMlxua2VybmluZyBmaXJzdD04NyAgc2Vjb25kPTIzNCBhbW91bnQ9LTJcbmtlcm5pbmcgZmlyc3Q9ODcgIHNlY29uZD0yMzUgYW1vdW50PS0yXG5rZXJuaW5nIGZpcnN0PTg3ICBzZWNvbmQ9NDUgIGFtb3VudD0tNVxua2VybmluZyBmaXJzdD04NyAgc2Vjb25kPTE3MyBhbW91bnQ9LTVcbmtlcm5pbmcgZmlyc3Q9ODcgIHNlY29uZD05NyAgYW1vdW50PS0zXG5rZXJuaW5nIGZpcnN0PTg3ICBzZWNvbmQ9MjI0IGFtb3VudD0tM1xua2VybmluZyBmaXJzdD04NyAgc2Vjb25kPTIyNSBhbW91bnQ9LTNcbmtlcm5pbmcgZmlyc3Q9ODcgIHNlY29uZD0yMjYgYW1vdW50PS0zXG5rZXJuaW5nIGZpcnN0PTg3ICBzZWNvbmQ9MjI3IGFtb3VudD0tM1xua2VybmluZyBmaXJzdD04NyAgc2Vjb25kPTIyOCBhbW91bnQ9LTNcbmtlcm5pbmcgZmlyc3Q9ODcgIHNlY29uZD0yMjkgYW1vdW50PS0zXG5rZXJuaW5nIGZpcnN0PTg4ICBzZWNvbmQ9MTE4IGFtb3VudD0tMlxua2VybmluZyBmaXJzdD04OCAgc2Vjb25kPTEyMSBhbW91bnQ9LTJcbmtlcm5pbmcgZmlyc3Q9ODggIHNlY29uZD0yNTMgYW1vdW50PS0yXG5rZXJuaW5nIGZpcnN0PTg4ICBzZWNvbmQ9MjU1IGFtb3VudD0tMlxua2VybmluZyBmaXJzdD04OCAgc2Vjb25kPTY3ICBhbW91bnQ9LTJcbmtlcm5pbmcgZmlyc3Q9ODggIHNlY29uZD03MSAgYW1vdW50PS0yXG5rZXJuaW5nIGZpcnN0PTg4ICBzZWNvbmQ9NzkgIGFtb3VudD0tMlxua2VybmluZyBmaXJzdD04OCAgc2Vjb25kPTgxICBhbW91bnQ9LTJcbmtlcm5pbmcgZmlyc3Q9ODggIHNlY29uZD0yMTYgYW1vdW50PS0yXG5rZXJuaW5nIGZpcnN0PTg4ICBzZWNvbmQ9MTk5IGFtb3VudD0tMlxua2VybmluZyBmaXJzdD04OCAgc2Vjb25kPTIxMCBhbW91bnQ9LTJcbmtlcm5pbmcgZmlyc3Q9ODggIHNlY29uZD0yMTEgYW1vdW50PS0yXG5rZXJuaW5nIGZpcnN0PTg4ICBzZWNvbmQ9MjEyIGFtb3VudD0tMlxua2VybmluZyBmaXJzdD04OCAgc2Vjb25kPTIxMyBhbW91bnQ9LTJcbmtlcm5pbmcgZmlyc3Q9ODggIHNlY29uZD0yMTQgYW1vdW50PS0yXG5rZXJuaW5nIGZpcnN0PTg4ICBzZWNvbmQ9MTExIGFtb3VudD0tMlxua2VybmluZyBmaXJzdD04OCAgc2Vjb25kPTI0MiBhbW91bnQ9LTJcbmtlcm5pbmcgZmlyc3Q9ODggIHNlY29uZD0yNDMgYW1vdW50PS0yXG5rZXJuaW5nIGZpcnN0PTg4ICBzZWNvbmQ9MjQ0IGFtb3VudD0tMlxua2VybmluZyBmaXJzdD04OCAgc2Vjb25kPTI0NSBhbW91bnQ9LTJcbmtlcm5pbmcgZmlyc3Q9ODggIHNlY29uZD0yNDYgYW1vdW50PS0yXG5rZXJuaW5nIGZpcnN0PTg4ICBzZWNvbmQ9MTE3IGFtb3VudD0tMlxua2VybmluZyBmaXJzdD04OCAgc2Vjb25kPTI0OSBhbW91bnQ9LTJcbmtlcm5pbmcgZmlyc3Q9ODggIHNlY29uZD0yNTAgYW1vdW50PS0yXG5rZXJuaW5nIGZpcnN0PTg4ICBzZWNvbmQ9MjUxIGFtb3VudD0tMlxua2VybmluZyBmaXJzdD04OCAgc2Vjb25kPTI1MiBhbW91bnQ9LTJcbmtlcm5pbmcgZmlyc3Q9ODggIHNlY29uZD04NiAgYW1vdW50PTFcbmtlcm5pbmcgZmlyc3Q9ODggIHNlY29uZD05OSAgYW1vdW50PS0yXG5rZXJuaW5nIGZpcnN0PTg4ICBzZWNvbmQ9MTAwIGFtb3VudD0tMlxua2VybmluZyBmaXJzdD04OCAgc2Vjb25kPTEwMSBhbW91bnQ9LTJcbmtlcm5pbmcgZmlyc3Q9ODggIHNlY29uZD0xMDMgYW1vdW50PS0yXG5rZXJuaW5nIGZpcnN0PTg4ICBzZWNvbmQ9MTEzIGFtb3VudD0tMlxua2VybmluZyBmaXJzdD04OCAgc2Vjb25kPTIzMSBhbW91bnQ9LTJcbmtlcm5pbmcgZmlyc3Q9ODggIHNlY29uZD0yMzIgYW1vdW50PS0yXG5rZXJuaW5nIGZpcnN0PTg4ICBzZWNvbmQ9MjMzIGFtb3VudD0tMlxua2VybmluZyBmaXJzdD04OCAgc2Vjb25kPTIzNCBhbW91bnQ9LTJcbmtlcm5pbmcgZmlyc3Q9ODggIHNlY29uZD0yMzUgYW1vdW50PS0yXG5rZXJuaW5nIGZpcnN0PTg4ICBzZWNvbmQ9NDUgIGFtb3VudD0tNFxua2VybmluZyBmaXJzdD04OCAgc2Vjb25kPTE3MyBhbW91bnQ9LTRcbmtlcm5pbmcgZmlyc3Q9ODkgIHNlY29uZD0xMTggYW1vdW50PS0yXG5rZXJuaW5nIGZpcnN0PTg5ICBzZWNvbmQ9MTIxIGFtb3VudD0tMlxua2VybmluZyBmaXJzdD04OSAgc2Vjb25kPTI1MyBhbW91bnQ9LTJcbmtlcm5pbmcgZmlyc3Q9ODkgIHNlY29uZD0yNTUgYW1vdW50PS0yXG5rZXJuaW5nIGZpcnN0PTg5ICBzZWNvbmQ9NjcgIGFtb3VudD0tMlxua2VybmluZyBmaXJzdD04OSAgc2Vjb25kPTcxICBhbW91bnQ9LTJcbmtlcm5pbmcgZmlyc3Q9ODkgIHNlY29uZD03OSAgYW1vdW50PS0yXG5rZXJuaW5nIGZpcnN0PTg5ICBzZWNvbmQ9ODEgIGFtb3VudD0tMlxua2VybmluZyBmaXJzdD04OSAgc2Vjb25kPTIxNiBhbW91bnQ9LTJcbmtlcm5pbmcgZmlyc3Q9ODkgIHNlY29uZD0xOTkgYW1vdW50PS0yXG5rZXJuaW5nIGZpcnN0PTg5ICBzZWNvbmQ9MjEwIGFtb3VudD0tMlxua2VybmluZyBmaXJzdD04OSAgc2Vjb25kPTIxMSBhbW91bnQ9LTJcbmtlcm5pbmcgZmlyc3Q9ODkgIHNlY29uZD0yMTIgYW1vdW50PS0yXG5rZXJuaW5nIGZpcnN0PTg5ICBzZWNvbmQ9MjEzIGFtb3VudD0tMlxua2VybmluZyBmaXJzdD04OSAgc2Vjb25kPTIxNCBhbW91bnQ9LTJcbmtlcm5pbmcgZmlyc3Q9ODkgIHNlY29uZD04NSAgYW1vdW50PS03XG5rZXJuaW5nIGZpcnN0PTg5ICBzZWNvbmQ9MjE3IGFtb3VudD0tN1xua2VybmluZyBmaXJzdD04OSAgc2Vjb25kPTIxOCBhbW91bnQ9LTdcbmtlcm5pbmcgZmlyc3Q9ODkgIHNlY29uZD0yMTkgYW1vdW50PS03XG5rZXJuaW5nIGZpcnN0PTg5ICBzZWNvbmQ9MjIwIGFtb3VudD0tN1xua2VybmluZyBmaXJzdD04OSAgc2Vjb25kPTExMSBhbW91bnQ9LTVcbmtlcm5pbmcgZmlyc3Q9ODkgIHNlY29uZD0yNDIgYW1vdW50PS01XG5rZXJuaW5nIGZpcnN0PTg5ICBzZWNvbmQ9MjQzIGFtb3VudD0tNVxua2VybmluZyBmaXJzdD04OSAgc2Vjb25kPTI0NCBhbW91bnQ9LTVcbmtlcm5pbmcgZmlyc3Q9ODkgIHNlY29uZD0yNDUgYW1vdW50PS01XG5rZXJuaW5nIGZpcnN0PTg5ICBzZWNvbmQ9MjQ2IGFtb3VudD0tNVxua2VybmluZyBmaXJzdD04OSAgc2Vjb25kPTg3ICBhbW91bnQ9MVxua2VybmluZyBmaXJzdD04OSAgc2Vjb25kPTg0ICBhbW91bnQ9MVxua2VybmluZyBmaXJzdD04OSAgc2Vjb25kPTExNyBhbW91bnQ9LTNcbmtlcm5pbmcgZmlyc3Q9ODkgIHNlY29uZD0yNDkgYW1vdW50PS0zXG5rZXJuaW5nIGZpcnN0PTg5ICBzZWNvbmQ9MjUwIGFtb3VudD0tM1xua2VybmluZyBmaXJzdD04OSAgc2Vjb25kPTI1MSBhbW91bnQ9LTNcbmtlcm5pbmcgZmlyc3Q9ODkgIHNlY29uZD0yNTIgYW1vdW50PS0zXG5rZXJuaW5nIGZpcnN0PTg5ICBzZWNvbmQ9MTIyIGFtb3VudD0tMlxua2VybmluZyBmaXJzdD04OSAgc2Vjb25kPTg2ICBhbW91bnQ9MVxua2VybmluZyBmaXJzdD04OSAgc2Vjb25kPTg5ICBhbW91bnQ9MVxua2VybmluZyBmaXJzdD04OSAgc2Vjb25kPTIyMSBhbW91bnQ9MVxua2VybmluZyBmaXJzdD04OSAgc2Vjb25kPTY1ICBhbW91bnQ9LTdcbmtlcm5pbmcgZmlyc3Q9ODkgIHNlY29uZD0xOTIgYW1vdW50PS03XG5rZXJuaW5nIGZpcnN0PTg5ICBzZWNvbmQ9MTkzIGFtb3VudD0tN1xua2VybmluZyBmaXJzdD04OSAgc2Vjb25kPTE5NCBhbW91bnQ9LTdcbmtlcm5pbmcgZmlyc3Q9ODkgIHNlY29uZD0xOTUgYW1vdW50PS03XG5rZXJuaW5nIGZpcnN0PTg5ICBzZWNvbmQ9MTk2IGFtb3VudD0tN1xua2VybmluZyBmaXJzdD04OSAgc2Vjb25kPTE5NyBhbW91bnQ9LTdcbmtlcm5pbmcgZmlyc3Q9ODkgIHNlY29uZD04OCAgYW1vdW50PTFcbmtlcm5pbmcgZmlyc3Q9ODkgIHNlY29uZD00NCAgYW1vdW50PS0xNlxua2VybmluZyBmaXJzdD04OSAgc2Vjb25kPTQ2ICBhbW91bnQ9LTE2XG5rZXJuaW5nIGZpcnN0PTg5ICBzZWNvbmQ9OTkgIGFtb3VudD0tNVxua2VybmluZyBmaXJzdD04OSAgc2Vjb25kPTEwMCBhbW91bnQ9LTVcbmtlcm5pbmcgZmlyc3Q9ODkgIHNlY29uZD0xMDEgYW1vdW50PS01XG5rZXJuaW5nIGZpcnN0PTg5ICBzZWNvbmQ9MTAzIGFtb3VudD0tNVxua2VybmluZyBmaXJzdD04OSAgc2Vjb25kPTExMyBhbW91bnQ9LTVcbmtlcm5pbmcgZmlyc3Q9ODkgIHNlY29uZD0yMzEgYW1vdW50PS01XG5rZXJuaW5nIGZpcnN0PTg5ICBzZWNvbmQ9MjMyIGFtb3VudD0tNVxua2VybmluZyBmaXJzdD04OSAgc2Vjb25kPTIzMyBhbW91bnQ9LTVcbmtlcm5pbmcgZmlyc3Q9ODkgIHNlY29uZD0yMzQgYW1vdW50PS01XG5rZXJuaW5nIGZpcnN0PTg5ICBzZWNvbmQ9MjM1IGFtb3VudD0tNVxua2VybmluZyBmaXJzdD04OSAgc2Vjb25kPTEyMCBhbW91bnQ9LTJcbmtlcm5pbmcgZmlyc3Q9ODkgIHNlY29uZD00NSAgYW1vdW50PS00XG5rZXJuaW5nIGZpcnN0PTg5ICBzZWNvbmQ9MTczIGFtb3VudD0tNFxua2VybmluZyBmaXJzdD04OSAgc2Vjb25kPTEwOSBhbW91bnQ9LTNcbmtlcm5pbmcgZmlyc3Q9ODkgIHNlY29uZD0xMTAgYW1vdW50PS0zXG5rZXJuaW5nIGZpcnN0PTg5ICBzZWNvbmQ9MTEyIGFtb3VudD0tM1xua2VybmluZyBmaXJzdD04OSAgc2Vjb25kPTI0MSBhbW91bnQ9LTNcbmtlcm5pbmcgZmlyc3Q9ODkgIHNlY29uZD04MyAgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTg5ICBzZWNvbmQ9OTcgIGFtb3VudD0tNlxua2VybmluZyBmaXJzdD04OSAgc2Vjb25kPTIyNCBhbW91bnQ9LTZcbmtlcm5pbmcgZmlyc3Q9ODkgIHNlY29uZD0yMjUgYW1vdW50PS02XG5rZXJuaW5nIGZpcnN0PTg5ICBzZWNvbmQ9MjI2IGFtb3VudD0tNlxua2VybmluZyBmaXJzdD04OSAgc2Vjb25kPTIyNyBhbW91bnQ9LTZcbmtlcm5pbmcgZmlyc3Q9ODkgIHNlY29uZD0yMjggYW1vdW50PS02XG5rZXJuaW5nIGZpcnN0PTg5ICBzZWNvbmQ9MjI5IGFtb3VudD0tNlxua2VybmluZyBmaXJzdD04OSAgc2Vjb25kPTExNSBhbW91bnQ9LTVcbmtlcm5pbmcgZmlyc3Q9ODkgIHNlY29uZD03NCAgYW1vdW50PS03XG5rZXJuaW5nIGZpcnN0PTkwICBzZWNvbmQ9MTE4IGFtb3VudD0tMlxua2VybmluZyBmaXJzdD05MCAgc2Vjb25kPTEyMSBhbW91bnQ9LTJcbmtlcm5pbmcgZmlyc3Q9OTAgIHNlY29uZD0yNTMgYW1vdW50PS0yXG5rZXJuaW5nIGZpcnN0PTkwICBzZWNvbmQ9MjU1IGFtb3VudD0tMlxua2VybmluZyBmaXJzdD05MCAgc2Vjb25kPTY3ICBhbW91bnQ9LTJcbmtlcm5pbmcgZmlyc3Q9OTAgIHNlY29uZD03MSAgYW1vdW50PS0yXG5rZXJuaW5nIGZpcnN0PTkwICBzZWNvbmQ9NzkgIGFtb3VudD0tMlxua2VybmluZyBmaXJzdD05MCAgc2Vjb25kPTgxICBhbW91bnQ9LTJcbmtlcm5pbmcgZmlyc3Q9OTAgIHNlY29uZD0yMTYgYW1vdW50PS0yXG5rZXJuaW5nIGZpcnN0PTkwICBzZWNvbmQ9MTk5IGFtb3VudD0tMlxua2VybmluZyBmaXJzdD05MCAgc2Vjb25kPTIxMCBhbW91bnQ9LTJcbmtlcm5pbmcgZmlyc3Q9OTAgIHNlY29uZD0yMTEgYW1vdW50PS0yXG5rZXJuaW5nIGZpcnN0PTkwICBzZWNvbmQ9MjEyIGFtb3VudD0tMlxua2VybmluZyBmaXJzdD05MCAgc2Vjb25kPTIxMyBhbW91bnQ9LTJcbmtlcm5pbmcgZmlyc3Q9OTAgIHNlY29uZD0yMTQgYW1vdW50PS0yXG5rZXJuaW5nIGZpcnN0PTkwICBzZWNvbmQ9MTExIGFtb3VudD0tMlxua2VybmluZyBmaXJzdD05MCAgc2Vjb25kPTI0MiBhbW91bnQ9LTJcbmtlcm5pbmcgZmlyc3Q9OTAgIHNlY29uZD0yNDMgYW1vdW50PS0yXG5rZXJuaW5nIGZpcnN0PTkwICBzZWNvbmQ9MjQ0IGFtb3VudD0tMlxua2VybmluZyBmaXJzdD05MCAgc2Vjb25kPTI0NSBhbW91bnQ9LTJcbmtlcm5pbmcgZmlyc3Q9OTAgIHNlY29uZD0yNDYgYW1vdW50PS0yXG5rZXJuaW5nIGZpcnN0PTkwICBzZWNvbmQ9MTE3IGFtb3VudD0tMVxua2VybmluZyBmaXJzdD05MCAgc2Vjb25kPTI0OSBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9OTAgIHNlY29uZD0yNTAgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTkwICBzZWNvbmQ9MjUxIGFtb3VudD0tMVxua2VybmluZyBmaXJzdD05MCAgc2Vjb25kPTI1MiBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9OTAgIHNlY29uZD02NSAgYW1vdW50PTFcbmtlcm5pbmcgZmlyc3Q9OTAgIHNlY29uZD0xOTIgYW1vdW50PTFcbmtlcm5pbmcgZmlyc3Q9OTAgIHNlY29uZD0xOTMgYW1vdW50PTFcbmtlcm5pbmcgZmlyc3Q9OTAgIHNlY29uZD0xOTQgYW1vdW50PTFcbmtlcm5pbmcgZmlyc3Q9OTAgIHNlY29uZD0xOTUgYW1vdW50PTFcbmtlcm5pbmcgZmlyc3Q9OTAgIHNlY29uZD0xOTYgYW1vdW50PTFcbmtlcm5pbmcgZmlyc3Q9OTAgIHNlY29uZD0xOTcgYW1vdW50PTFcbmtlcm5pbmcgZmlyc3Q9OTAgIHNlY29uZD05OSAgYW1vdW50PS0yXG5rZXJuaW5nIGZpcnN0PTkwICBzZWNvbmQ9MTAwIGFtb3VudD0tMlxua2VybmluZyBmaXJzdD05MCAgc2Vjb25kPTEwMSBhbW91bnQ9LTJcbmtlcm5pbmcgZmlyc3Q9OTAgIHNlY29uZD0xMDMgYW1vdW50PS0yXG5rZXJuaW5nIGZpcnN0PTkwICBzZWNvbmQ9MTEzIGFtb3VudD0tMlxua2VybmluZyBmaXJzdD05MCAgc2Vjb25kPTIzMSBhbW91bnQ9LTJcbmtlcm5pbmcgZmlyc3Q9OTAgIHNlY29uZD0yMzIgYW1vdW50PS0yXG5rZXJuaW5nIGZpcnN0PTkwICBzZWNvbmQ9MjMzIGFtb3VudD0tMlxua2VybmluZyBmaXJzdD05MCAgc2Vjb25kPTIzNCBhbW91bnQ9LTJcbmtlcm5pbmcgZmlyc3Q9OTAgIHNlY29uZD0yMzUgYW1vdW50PS0yXG5rZXJuaW5nIGZpcnN0PTk3ICBzZWNvbmQ9MTE4IGFtb3VudD0tMVxua2VybmluZyBmaXJzdD05NyAgc2Vjb25kPTEyMSBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9OTcgIHNlY29uZD0yNTMgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTk3ICBzZWNvbmQ9MjU1IGFtb3VudD0tMVxua2VybmluZyBmaXJzdD05NyAgc2Vjb25kPTM0ICBhbW91bnQ9LTVcbmtlcm5pbmcgZmlyc3Q9OTcgIHNlY29uZD0zOSAgYW1vdW50PS01XG5rZXJuaW5nIGZpcnN0PTk4ICBzZWNvbmQ9MTE4IGFtb3VudD0tMVxua2VybmluZyBmaXJzdD05OCAgc2Vjb25kPTEyMSBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9OTggIHNlY29uZD0yNTMgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTk4ICBzZWNvbmQ9MjU1IGFtb3VudD0tMVxua2VybmluZyBmaXJzdD05OCAgc2Vjb25kPTM0ICBhbW91bnQ9LTJcbmtlcm5pbmcgZmlyc3Q9OTggIHNlY29uZD0zOSAgYW1vdW50PS0yXG5rZXJuaW5nIGZpcnN0PTk4ICBzZWNvbmQ9MTIyIGFtb3VudD0tMVxua2VybmluZyBmaXJzdD05OCAgc2Vjb25kPTEyMCBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9OTkgIHNlY29uZD0zNCAgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTk5ICBzZWNvbmQ9MzkgIGFtb3VudD0tMVxua2VybmluZyBmaXJzdD0xMDEgc2Vjb25kPTExOCBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9MTAxIHNlY29uZD0xMjEgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTEwMSBzZWNvbmQ9MjUzIGFtb3VudD0tMVxua2VybmluZyBmaXJzdD0xMDEgc2Vjb25kPTI1NSBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9MTAxIHNlY29uZD0zNCAgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTEwMSBzZWNvbmQ9MzkgIGFtb3VudD0tMVxua2VybmluZyBmaXJzdD0xMDQgc2Vjb25kPTM0ICBhbW91bnQ9LThcbmtlcm5pbmcgZmlyc3Q9MTA0IHNlY29uZD0zOSAgYW1vdW50PS04XG5rZXJuaW5nIGZpcnN0PTEwOSBzZWNvbmQ9MzQgIGFtb3VudD0tOFxua2VybmluZyBmaXJzdD0xMDkgc2Vjb25kPTM5ICBhbW91bnQ9LThcbmtlcm5pbmcgZmlyc3Q9MTEwIHNlY29uZD0zNCAgYW1vdW50PS04XG5rZXJuaW5nIGZpcnN0PTExMCBzZWNvbmQ9MzkgIGFtb3VudD0tOFxua2VybmluZyBmaXJzdD0xMTEgc2Vjb25kPTExOCBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9MTExIHNlY29uZD0xMjEgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTExMSBzZWNvbmQ9MjUzIGFtb3VudD0tMVxua2VybmluZyBmaXJzdD0xMTEgc2Vjb25kPTI1NSBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9MTExIHNlY29uZD0zNCAgYW1vdW50PS0xMVxua2VybmluZyBmaXJzdD0xMTEgc2Vjb25kPTM5ICBhbW91bnQ9LTExXG5rZXJuaW5nIGZpcnN0PTExMSBzZWNvbmQ9MTIyIGFtb3VudD0tMVxua2VybmluZyBmaXJzdD0xMTEgc2Vjb25kPTEyMCBhbW91bnQ9LTJcbmtlcm5pbmcgZmlyc3Q9MTEyIHNlY29uZD0xMTggYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTExMiBzZWNvbmQ9MTIxIGFtb3VudD0tMVxua2VybmluZyBmaXJzdD0xMTIgc2Vjb25kPTI1MyBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9MTEyIHNlY29uZD0yNTUgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTExMiBzZWNvbmQ9MzQgIGFtb3VudD0tMlxua2VybmluZyBmaXJzdD0xMTIgc2Vjb25kPTM5ICBhbW91bnQ9LTJcbmtlcm5pbmcgZmlyc3Q9MTEyIHNlY29uZD0xMjIgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTExMiBzZWNvbmQ9MTIwIGFtb3VudD0tMVxua2VybmluZyBmaXJzdD0xMTQgc2Vjb25kPTExOCBhbW91bnQ9MVxua2VybmluZyBmaXJzdD0xMTQgc2Vjb25kPTEyMSBhbW91bnQ9MVxua2VybmluZyBmaXJzdD0xMTQgc2Vjb25kPTI1MyBhbW91bnQ9MVxua2VybmluZyBmaXJzdD0xMTQgc2Vjb25kPTI1NSBhbW91bnQ9MVxua2VybmluZyBmaXJzdD0xMTQgc2Vjb25kPTM0ICBhbW91bnQ9MVxua2VybmluZyBmaXJzdD0xMTQgc2Vjb25kPTM5ICBhbW91bnQ9MVxua2VybmluZyBmaXJzdD0xMTQgc2Vjb25kPTExMSBhbW91bnQ9LTJcbmtlcm5pbmcgZmlyc3Q9MTE0IHNlY29uZD0yNDIgYW1vdW50PS0yXG5rZXJuaW5nIGZpcnN0PTExNCBzZWNvbmQ9MjQzIGFtb3VudD0tMlxua2VybmluZyBmaXJzdD0xMTQgc2Vjb25kPTI0NCBhbW91bnQ9LTJcbmtlcm5pbmcgZmlyc3Q9MTE0IHNlY29uZD0yNDUgYW1vdW50PS0yXG5rZXJuaW5nIGZpcnN0PTExNCBzZWNvbmQ9MjQ2IGFtb3VudD0tMlxua2VybmluZyBmaXJzdD0xMTQgc2Vjb25kPTQ0ICBhbW91bnQ9LTEwXG5rZXJuaW5nIGZpcnN0PTExNCBzZWNvbmQ9NDYgIGFtb3VudD0tMTBcbmtlcm5pbmcgZmlyc3Q9MTE0IHNlY29uZD05OSAgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTExNCBzZWNvbmQ9MTAwIGFtb3VudD0tMVxua2VybmluZyBmaXJzdD0xMTQgc2Vjb25kPTEwMSBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9MTE0IHNlY29uZD0xMDMgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTExNCBzZWNvbmQ9MTEzIGFtb3VudD0tMVxua2VybmluZyBmaXJzdD0xMTQgc2Vjb25kPTIzMSBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9MTE0IHNlY29uZD0yMzIgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTExNCBzZWNvbmQ9MjMzIGFtb3VudD0tMVxua2VybmluZyBmaXJzdD0xMTQgc2Vjb25kPTIzNCBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9MTE0IHNlY29uZD0yMzUgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTExNCBzZWNvbmQ9OTcgIGFtb3VudD0tM1xua2VybmluZyBmaXJzdD0xMTQgc2Vjb25kPTIyNCBhbW91bnQ9LTNcbmtlcm5pbmcgZmlyc3Q9MTE0IHNlY29uZD0yMjUgYW1vdW50PS0zXG5rZXJuaW5nIGZpcnN0PTExNCBzZWNvbmQ9MjI2IGFtb3VudD0tM1xua2VybmluZyBmaXJzdD0xMTQgc2Vjb25kPTIyNyBhbW91bnQ9LTNcbmtlcm5pbmcgZmlyc3Q9MTE0IHNlY29uZD0yMjggYW1vdW50PS0zXG5rZXJuaW5nIGZpcnN0PTExNCBzZWNvbmQ9MjI5IGFtb3VudD0tM1xua2VybmluZyBmaXJzdD0xMTggc2Vjb25kPTM0ICBhbW91bnQ9MVxua2VybmluZyBmaXJzdD0xMTggc2Vjb25kPTM5ICBhbW91bnQ9MVxua2VybmluZyBmaXJzdD0xMTggc2Vjb25kPTExMSBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9MTE4IHNlY29uZD0yNDIgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTExOCBzZWNvbmQ9MjQzIGFtb3VudD0tMVxua2VybmluZyBmaXJzdD0xMTggc2Vjb25kPTI0NCBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9MTE4IHNlY29uZD0yNDUgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTExOCBzZWNvbmQ9MjQ2IGFtb3VudD0tMVxua2VybmluZyBmaXJzdD0xMTggc2Vjb25kPTQ0ICBhbW91bnQ9LThcbmtlcm5pbmcgZmlyc3Q9MTE4IHNlY29uZD00NiAgYW1vdW50PS04XG5rZXJuaW5nIGZpcnN0PTExOCBzZWNvbmQ9OTkgIGFtb3VudD0tMVxua2VybmluZyBmaXJzdD0xMTggc2Vjb25kPTEwMCBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9MTE4IHNlY29uZD0xMDEgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTExOCBzZWNvbmQ9MTAzIGFtb3VudD0tMVxua2VybmluZyBmaXJzdD0xMTggc2Vjb25kPTExMyBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9MTE4IHNlY29uZD0yMzEgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTExOCBzZWNvbmQ9MjMyIGFtb3VudD0tMVxua2VybmluZyBmaXJzdD0xMTggc2Vjb25kPTIzMyBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9MTE4IHNlY29uZD0yMzQgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTExOCBzZWNvbmQ9MjM1IGFtb3VudD0tMVxua2VybmluZyBmaXJzdD0xMTggc2Vjb25kPTk3ICBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9MTE4IHNlY29uZD0yMjQgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTExOCBzZWNvbmQ9MjI1IGFtb3VudD0tMVxua2VybmluZyBmaXJzdD0xMTggc2Vjb25kPTIyNiBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9MTE4IHNlY29uZD0yMjcgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTExOCBzZWNvbmQ9MjI4IGFtb3VudD0tMVxua2VybmluZyBmaXJzdD0xMTggc2Vjb25kPTIyOSBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9MTIwIHNlY29uZD0xMTEgYW1vdW50PS0yXG5rZXJuaW5nIGZpcnN0PTEyMCBzZWNvbmQ9MjQyIGFtb3VudD0tMlxua2VybmluZyBmaXJzdD0xMjAgc2Vjb25kPTI0MyBhbW91bnQ9LTJcbmtlcm5pbmcgZmlyc3Q9MTIwIHNlY29uZD0yNDQgYW1vdW50PS0yXG5rZXJuaW5nIGZpcnN0PTEyMCBzZWNvbmQ9MjQ1IGFtb3VudD0tMlxua2VybmluZyBmaXJzdD0xMjAgc2Vjb25kPTI0NiBhbW91bnQ9LTJcbmtlcm5pbmcgZmlyc3Q9MTIwIHNlY29uZD05OSAgYW1vdW50PS0yXG5rZXJuaW5nIGZpcnN0PTEyMCBzZWNvbmQ9MTAwIGFtb3VudD0tMlxua2VybmluZyBmaXJzdD0xMjAgc2Vjb25kPTEwMSBhbW91bnQ9LTJcbmtlcm5pbmcgZmlyc3Q9MTIwIHNlY29uZD0xMDMgYW1vdW50PS0yXG5rZXJuaW5nIGZpcnN0PTEyMCBzZWNvbmQ9MTEzIGFtb3VudD0tMlxua2VybmluZyBmaXJzdD0xMjAgc2Vjb25kPTIzMSBhbW91bnQ9LTJcbmtlcm5pbmcgZmlyc3Q9MTIwIHNlY29uZD0yMzIgYW1vdW50PS0yXG5rZXJuaW5nIGZpcnN0PTEyMCBzZWNvbmQ9MjMzIGFtb3VudD0tMlxua2VybmluZyBmaXJzdD0xMjAgc2Vjb25kPTIzNCBhbW91bnQ9LTJcbmtlcm5pbmcgZmlyc3Q9MTIwIHNlY29uZD0yMzUgYW1vdW50PS0yXG5rZXJuaW5nIGZpcnN0PTEyMSBzZWNvbmQ9MzQgIGFtb3VudD0xXG5rZXJuaW5nIGZpcnN0PTEyMSBzZWNvbmQ9MzkgIGFtb3VudD0xXG5rZXJuaW5nIGZpcnN0PTEyMSBzZWNvbmQ9MTExIGFtb3VudD0tMVxua2VybmluZyBmaXJzdD0xMjEgc2Vjb25kPTI0MiBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9MTIxIHNlY29uZD0yNDMgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTEyMSBzZWNvbmQ9MjQ0IGFtb3VudD0tMVxua2VybmluZyBmaXJzdD0xMjEgc2Vjb25kPTI0NSBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9MTIxIHNlY29uZD0yNDYgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTEyMSBzZWNvbmQ9NDQgIGFtb3VudD0tOFxua2VybmluZyBmaXJzdD0xMjEgc2Vjb25kPTQ2ICBhbW91bnQ9LThcbmtlcm5pbmcgZmlyc3Q9MTIxIHNlY29uZD05OSAgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTEyMSBzZWNvbmQ9MTAwIGFtb3VudD0tMVxua2VybmluZyBmaXJzdD0xMjEgc2Vjb25kPTEwMSBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9MTIxIHNlY29uZD0xMDMgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTEyMSBzZWNvbmQ9MTEzIGFtb3VudD0tMVxua2VybmluZyBmaXJzdD0xMjEgc2Vjb25kPTIzMSBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9MTIxIHNlY29uZD0yMzIgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTEyMSBzZWNvbmQ9MjMzIGFtb3VudD0tMVxua2VybmluZyBmaXJzdD0xMjEgc2Vjb25kPTIzNCBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9MTIxIHNlY29uZD0yMzUgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTEyMSBzZWNvbmQ9OTcgIGFtb3VudD0tMVxua2VybmluZyBmaXJzdD0xMjEgc2Vjb25kPTIyNCBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9MTIxIHNlY29uZD0yMjUgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTEyMSBzZWNvbmQ9MjI2IGFtb3VudD0tMVxua2VybmluZyBmaXJzdD0xMjEgc2Vjb25kPTIyNyBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9MTIxIHNlY29uZD0yMjggYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTEyMSBzZWNvbmQ9MjI5IGFtb3VudD0tMVxua2VybmluZyBmaXJzdD0xMjIgc2Vjb25kPTExMSBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9MTIyIHNlY29uZD0yNDIgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTEyMiBzZWNvbmQ9MjQzIGFtb3VudD0tMVxua2VybmluZyBmaXJzdD0xMjIgc2Vjb25kPTI0NCBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9MTIyIHNlY29uZD0yNDUgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTEyMiBzZWNvbmQ9MjQ2IGFtb3VudD0tMVxua2VybmluZyBmaXJzdD0xMjIgc2Vjb25kPTk5ICBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9MTIyIHNlY29uZD0xMDAgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTEyMiBzZWNvbmQ9MTAxIGFtb3VudD0tMVxua2VybmluZyBmaXJzdD0xMjIgc2Vjb25kPTEwMyBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9MTIyIHNlY29uZD0xMTMgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTEyMiBzZWNvbmQ9MjMxIGFtb3VudD0tMVxua2VybmluZyBmaXJzdD0xMjIgc2Vjb25kPTIzMiBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9MTIyIHNlY29uZD0yMzMgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTEyMiBzZWNvbmQ9MjM0IGFtb3VudD0tMVxua2VybmluZyBmaXJzdD0xMjIgc2Vjb25kPTIzNSBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9MjU0IHNlY29uZD0xMTggYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTI1NCBzZWNvbmQ9MTIxIGFtb3VudD0tMVxua2VybmluZyBmaXJzdD0yNTQgc2Vjb25kPTI1MyBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9MjU0IHNlY29uZD0yNTUgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTI1NCBzZWNvbmQ9MzQgIGFtb3VudD0tMlxua2VybmluZyBmaXJzdD0yNTQgc2Vjb25kPTM5ICBhbW91bnQ9LTJcbmtlcm5pbmcgZmlyc3Q9MjU0IHNlY29uZD0xMjIgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTI1NCBzZWNvbmQ9MTIwIGFtb3VudD0tMVxua2VybmluZyBmaXJzdD0yMDggc2Vjb25kPTg0ICBhbW91bnQ9LTJcbmtlcm5pbmcgZmlyc3Q9MjA4IHNlY29uZD04NiAgYW1vdW50PS0yXG5rZXJuaW5nIGZpcnN0PTIwOCBzZWNvbmQ9ODkgIGFtb3VudD0tM1xua2VybmluZyBmaXJzdD0yMDggc2Vjb25kPTIyMSBhbW91bnQ9LTNcbmtlcm5pbmcgZmlyc3Q9MjA4IHNlY29uZD02NSAgYW1vdW50PS0yXG5rZXJuaW5nIGZpcnN0PTIwOCBzZWNvbmQ9MTkyIGFtb3VudD0tMlxua2VybmluZyBmaXJzdD0yMDggc2Vjb25kPTE5MyBhbW91bnQ9LTJcbmtlcm5pbmcgZmlyc3Q9MjA4IHNlY29uZD0xOTQgYW1vdW50PS0yXG5rZXJuaW5nIGZpcnN0PTIwOCBzZWNvbmQ9MTk1IGFtb3VudD0tMlxua2VybmluZyBmaXJzdD0yMDggc2Vjb25kPTE5NiBhbW91bnQ9LTJcbmtlcm5pbmcgZmlyc3Q9MjA4IHNlY29uZD0xOTcgYW1vdW50PS0yXG5rZXJuaW5nIGZpcnN0PTIwOCBzZWNvbmQ9ODggIGFtb3VudD0tMlxua2VybmluZyBmaXJzdD0yMDggc2Vjb25kPTQ0ICBhbW91bnQ9LThcbmtlcm5pbmcgZmlyc3Q9MjA4IHNlY29uZD00NiAgYW1vdW50PS04XG5rZXJuaW5nIGZpcnN0PTIwOCBzZWNvbmQ9OTAgIGFtb3VudD0tMlxua2VybmluZyBmaXJzdD0xOTIgc2Vjb25kPTExOCBhbW91bnQ9LTRcbmtlcm5pbmcgZmlyc3Q9MTkyIHNlY29uZD0xMjEgYW1vdW50PS00XG5rZXJuaW5nIGZpcnN0PTE5MiBzZWNvbmQ9MjUzIGFtb3VudD0tNFxua2VybmluZyBmaXJzdD0xOTIgc2Vjb25kPTI1NSBhbW91bnQ9LTRcbmtlcm5pbmcgZmlyc3Q9MTkyIHNlY29uZD02NyAgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTE5MiBzZWNvbmQ9NzEgIGFtb3VudD0tMVxua2VybmluZyBmaXJzdD0xOTIgc2Vjb25kPTc5ICBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9MTkyIHNlY29uZD04MSAgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTE5MiBzZWNvbmQ9MjE2IGFtb3VudD0tMVxua2VybmluZyBmaXJzdD0xOTIgc2Vjb25kPTE5OSBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9MTkyIHNlY29uZD0yMTAgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTE5MiBzZWNvbmQ9MjExIGFtb3VudD0tMVxua2VybmluZyBmaXJzdD0xOTIgc2Vjb25kPTIxMiBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9MTkyIHNlY29uZD0yMTMgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTE5MiBzZWNvbmQ9MjE0IGFtb3VudD0tMVxua2VybmluZyBmaXJzdD0xOTIgc2Vjb25kPTg1ICBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9MTkyIHNlY29uZD0yMTcgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTE5MiBzZWNvbmQ9MjE4IGFtb3VudD0tMVxua2VybmluZyBmaXJzdD0xOTIgc2Vjb25kPTIxOSBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9MTkyIHNlY29uZD0yMjAgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTE5MiBzZWNvbmQ9MzQgIGFtb3VudD0tOVxua2VybmluZyBmaXJzdD0xOTIgc2Vjb25kPTM5ICBhbW91bnQ9LTlcbmtlcm5pbmcgZmlyc3Q9MTkyIHNlY29uZD0xMTEgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTE5MiBzZWNvbmQ9MjQyIGFtb3VudD0tMVxua2VybmluZyBmaXJzdD0xOTIgc2Vjb25kPTI0MyBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9MTkyIHNlY29uZD0yNDQgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTE5MiBzZWNvbmQ9MjQ1IGFtb3VudD0tMVxua2VybmluZyBmaXJzdD0xOTIgc2Vjb25kPTI0NiBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9MTkyIHNlY29uZD04NyAgYW1vdW50PS01XG5rZXJuaW5nIGZpcnN0PTE5MiBzZWNvbmQ9ODQgIGFtb3VudD0tMTBcbmtlcm5pbmcgZmlyc3Q9MTkyIHNlY29uZD0xMTcgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTE5MiBzZWNvbmQ9MjQ5IGFtb3VudD0tMVxua2VybmluZyBmaXJzdD0xOTIgc2Vjb25kPTI1MCBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9MTkyIHNlY29uZD0yNTEgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTE5MiBzZWNvbmQ9MjUyIGFtb3VudD0tMVxua2VybmluZyBmaXJzdD0xOTIgc2Vjb25kPTEyMiBhbW91bnQ9MVxua2VybmluZyBmaXJzdD0xOTIgc2Vjb25kPTg2ICBhbW91bnQ9LTdcbmtlcm5pbmcgZmlyc3Q9MTkyIHNlY29uZD04OSAgYW1vdW50PS03XG5rZXJuaW5nIGZpcnN0PTE5MiBzZWNvbmQ9MjIxIGFtb3VudD0tN1xua2VybmluZyBmaXJzdD0xOTMgc2Vjb25kPTExOCBhbW91bnQ9LTRcbmtlcm5pbmcgZmlyc3Q9MTkzIHNlY29uZD0xMjEgYW1vdW50PS00XG5rZXJuaW5nIGZpcnN0PTE5MyBzZWNvbmQ9MjUzIGFtb3VudD0tNFxua2VybmluZyBmaXJzdD0xOTMgc2Vjb25kPTI1NSBhbW91bnQ9LTRcbmtlcm5pbmcgZmlyc3Q9MTkzIHNlY29uZD02NyAgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTE5MyBzZWNvbmQ9NzEgIGFtb3VudD0tMVxua2VybmluZyBmaXJzdD0xOTMgc2Vjb25kPTc5ICBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9MTkzIHNlY29uZD04MSAgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTE5MyBzZWNvbmQ9MjE2IGFtb3VudD0tMVxua2VybmluZyBmaXJzdD0xOTMgc2Vjb25kPTE5OSBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9MTkzIHNlY29uZD0yMTAgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTE5MyBzZWNvbmQ9MjExIGFtb3VudD0tMVxua2VybmluZyBmaXJzdD0xOTMgc2Vjb25kPTIxMiBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9MTkzIHNlY29uZD0yMTMgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTE5MyBzZWNvbmQ9MjE0IGFtb3VudD0tMVxua2VybmluZyBmaXJzdD0xOTMgc2Vjb25kPTg1ICBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9MTkzIHNlY29uZD0yMTcgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTE5MyBzZWNvbmQ9MjE4IGFtb3VudD0tMVxua2VybmluZyBmaXJzdD0xOTMgc2Vjb25kPTIxOSBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9MTkzIHNlY29uZD0yMjAgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTE5MyBzZWNvbmQ9MzQgIGFtb3VudD0tOVxua2VybmluZyBmaXJzdD0xOTMgc2Vjb25kPTM5ICBhbW91bnQ9LTlcbmtlcm5pbmcgZmlyc3Q9MTkzIHNlY29uZD0xMTEgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTE5MyBzZWNvbmQ9MjQyIGFtb3VudD0tMVxua2VybmluZyBmaXJzdD0xOTMgc2Vjb25kPTI0MyBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9MTkzIHNlY29uZD0yNDQgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTE5MyBzZWNvbmQ9MjQ1IGFtb3VudD0tMVxua2VybmluZyBmaXJzdD0xOTMgc2Vjb25kPTI0NiBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9MTkzIHNlY29uZD04NyAgYW1vdW50PS01XG5rZXJuaW5nIGZpcnN0PTE5MyBzZWNvbmQ9ODQgIGFtb3VudD0tMTBcbmtlcm5pbmcgZmlyc3Q9MTkzIHNlY29uZD0xMTcgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTE5MyBzZWNvbmQ9MjQ5IGFtb3VudD0tMVxua2VybmluZyBmaXJzdD0xOTMgc2Vjb25kPTI1MCBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9MTkzIHNlY29uZD0yNTEgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTE5MyBzZWNvbmQ9MjUyIGFtb3VudD0tMVxua2VybmluZyBmaXJzdD0xOTMgc2Vjb25kPTEyMiBhbW91bnQ9MVxua2VybmluZyBmaXJzdD0xOTMgc2Vjb25kPTg2ICBhbW91bnQ9LTdcbmtlcm5pbmcgZmlyc3Q9MTkzIHNlY29uZD04OSAgYW1vdW50PS03XG5rZXJuaW5nIGZpcnN0PTE5MyBzZWNvbmQ9MjIxIGFtb3VudD0tN1xua2VybmluZyBmaXJzdD0xOTQgc2Vjb25kPTExOCBhbW91bnQ9LTRcbmtlcm5pbmcgZmlyc3Q9MTk0IHNlY29uZD0xMjEgYW1vdW50PS00XG5rZXJuaW5nIGZpcnN0PTE5NCBzZWNvbmQ9MjUzIGFtb3VudD0tNFxua2VybmluZyBmaXJzdD0xOTQgc2Vjb25kPTI1NSBhbW91bnQ9LTRcbmtlcm5pbmcgZmlyc3Q9MTk0IHNlY29uZD02NyAgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTE5NCBzZWNvbmQ9NzEgIGFtb3VudD0tMVxua2VybmluZyBmaXJzdD0xOTQgc2Vjb25kPTc5ICBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9MTk0IHNlY29uZD04MSAgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTE5NCBzZWNvbmQ9MjE2IGFtb3VudD0tMVxua2VybmluZyBmaXJzdD0xOTQgc2Vjb25kPTE5OSBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9MTk0IHNlY29uZD0yMTAgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTE5NCBzZWNvbmQ9MjExIGFtb3VudD0tMVxua2VybmluZyBmaXJzdD0xOTQgc2Vjb25kPTIxMiBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9MTk0IHNlY29uZD0yMTMgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTE5NCBzZWNvbmQ9MjE0IGFtb3VudD0tMVxua2VybmluZyBmaXJzdD0xOTQgc2Vjb25kPTg1ICBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9MTk0IHNlY29uZD0yMTcgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTE5NCBzZWNvbmQ9MjE4IGFtb3VudD0tMVxua2VybmluZyBmaXJzdD0xOTQgc2Vjb25kPTIxOSBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9MTk0IHNlY29uZD0yMjAgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTE5NCBzZWNvbmQ9MzQgIGFtb3VudD0tOVxua2VybmluZyBmaXJzdD0xOTQgc2Vjb25kPTM5ICBhbW91bnQ9LTlcbmtlcm5pbmcgZmlyc3Q9MTk0IHNlY29uZD0xMTEgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTE5NCBzZWNvbmQ9MjQyIGFtb3VudD0tMVxua2VybmluZyBmaXJzdD0xOTQgc2Vjb25kPTI0MyBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9MTk0IHNlY29uZD0yNDQgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTE5NCBzZWNvbmQ9MjQ1IGFtb3VudD0tMVxua2VybmluZyBmaXJzdD0xOTQgc2Vjb25kPTI0NiBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9MTk0IHNlY29uZD04NyAgYW1vdW50PS01XG5rZXJuaW5nIGZpcnN0PTE5NCBzZWNvbmQ9ODQgIGFtb3VudD0tMTBcbmtlcm5pbmcgZmlyc3Q9MTk0IHNlY29uZD0xMTcgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTE5NCBzZWNvbmQ9MjQ5IGFtb3VudD0tMVxua2VybmluZyBmaXJzdD0xOTQgc2Vjb25kPTI1MCBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9MTk0IHNlY29uZD0yNTEgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTE5NCBzZWNvbmQ9MjUyIGFtb3VudD0tMVxua2VybmluZyBmaXJzdD0xOTQgc2Vjb25kPTEyMiBhbW91bnQ9MVxua2VybmluZyBmaXJzdD0xOTQgc2Vjb25kPTg2ICBhbW91bnQ9LTdcbmtlcm5pbmcgZmlyc3Q9MTk0IHNlY29uZD04OSAgYW1vdW50PS03XG5rZXJuaW5nIGZpcnN0PTE5NCBzZWNvbmQ9MjIxIGFtb3VudD0tN1xua2VybmluZyBmaXJzdD0xOTUgc2Vjb25kPTExOCBhbW91bnQ9LTRcbmtlcm5pbmcgZmlyc3Q9MTk1IHNlY29uZD0xMjEgYW1vdW50PS00XG5rZXJuaW5nIGZpcnN0PTE5NSBzZWNvbmQ9MjUzIGFtb3VudD0tNFxua2VybmluZyBmaXJzdD0xOTUgc2Vjb25kPTI1NSBhbW91bnQ9LTRcbmtlcm5pbmcgZmlyc3Q9MTk1IHNlY29uZD02NyAgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTE5NSBzZWNvbmQ9NzEgIGFtb3VudD0tMVxua2VybmluZyBmaXJzdD0xOTUgc2Vjb25kPTc5ICBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9MTk1IHNlY29uZD04MSAgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTE5NSBzZWNvbmQ9MjE2IGFtb3VudD0tMVxua2VybmluZyBmaXJzdD0xOTUgc2Vjb25kPTE5OSBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9MTk1IHNlY29uZD0yMTAgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTE5NSBzZWNvbmQ9MjExIGFtb3VudD0tMVxua2VybmluZyBmaXJzdD0xOTUgc2Vjb25kPTIxMiBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9MTk1IHNlY29uZD0yMTMgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTE5NSBzZWNvbmQ9MjE0IGFtb3VudD0tMVxua2VybmluZyBmaXJzdD0xOTUgc2Vjb25kPTg1ICBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9MTk1IHNlY29uZD0yMTcgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTE5NSBzZWNvbmQ9MjE4IGFtb3VudD0tMVxua2VybmluZyBmaXJzdD0xOTUgc2Vjb25kPTIxOSBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9MTk1IHNlY29uZD0yMjAgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTE5NSBzZWNvbmQ9MzQgIGFtb3VudD0tOVxua2VybmluZyBmaXJzdD0xOTUgc2Vjb25kPTM5ICBhbW91bnQ9LTlcbmtlcm5pbmcgZmlyc3Q9MTk1IHNlY29uZD0xMTEgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTE5NSBzZWNvbmQ9MjQyIGFtb3VudD0tMVxua2VybmluZyBmaXJzdD0xOTUgc2Vjb25kPTI0MyBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9MTk1IHNlY29uZD0yNDQgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTE5NSBzZWNvbmQ9MjQ1IGFtb3VudD0tMVxua2VybmluZyBmaXJzdD0xOTUgc2Vjb25kPTI0NiBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9MTk1IHNlY29uZD04NyAgYW1vdW50PS01XG5rZXJuaW5nIGZpcnN0PTE5NSBzZWNvbmQ9ODQgIGFtb3VudD0tMTBcbmtlcm5pbmcgZmlyc3Q9MTk1IHNlY29uZD0xMTcgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTE5NSBzZWNvbmQ9MjQ5IGFtb3VudD0tMVxua2VybmluZyBmaXJzdD0xOTUgc2Vjb25kPTI1MCBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9MTk1IHNlY29uZD0yNTEgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTE5NSBzZWNvbmQ9MjUyIGFtb3VudD0tMVxua2VybmluZyBmaXJzdD0xOTUgc2Vjb25kPTEyMiBhbW91bnQ9MVxua2VybmluZyBmaXJzdD0xOTUgc2Vjb25kPTg2ICBhbW91bnQ9LTdcbmtlcm5pbmcgZmlyc3Q9MTk1IHNlY29uZD04OSAgYW1vdW50PS03XG5rZXJuaW5nIGZpcnN0PTE5NSBzZWNvbmQ9MjIxIGFtb3VudD0tN1xua2VybmluZyBmaXJzdD0xOTYgc2Vjb25kPTExOCBhbW91bnQ9LTRcbmtlcm5pbmcgZmlyc3Q9MTk2IHNlY29uZD0xMjEgYW1vdW50PS00XG5rZXJuaW5nIGZpcnN0PTE5NiBzZWNvbmQ9MjUzIGFtb3VudD0tNFxua2VybmluZyBmaXJzdD0xOTYgc2Vjb25kPTI1NSBhbW91bnQ9LTRcbmtlcm5pbmcgZmlyc3Q9MTk2IHNlY29uZD02NyAgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTE5NiBzZWNvbmQ9NzEgIGFtb3VudD0tMVxua2VybmluZyBmaXJzdD0xOTYgc2Vjb25kPTc5ICBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9MTk2IHNlY29uZD04MSAgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTE5NiBzZWNvbmQ9MjE2IGFtb3VudD0tMVxua2VybmluZyBmaXJzdD0xOTYgc2Vjb25kPTE5OSBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9MTk2IHNlY29uZD0yMTAgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTE5NiBzZWNvbmQ9MjExIGFtb3VudD0tMVxua2VybmluZyBmaXJzdD0xOTYgc2Vjb25kPTIxMiBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9MTk2IHNlY29uZD0yMTMgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTE5NiBzZWNvbmQ9MjE0IGFtb3VudD0tMVxua2VybmluZyBmaXJzdD0xOTYgc2Vjb25kPTg1ICBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9MTk2IHNlY29uZD0yMTcgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTE5NiBzZWNvbmQ9MjE4IGFtb3VudD0tMVxua2VybmluZyBmaXJzdD0xOTYgc2Vjb25kPTIxOSBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9MTk2IHNlY29uZD0yMjAgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTE5NiBzZWNvbmQ9MzQgIGFtb3VudD0tOVxua2VybmluZyBmaXJzdD0xOTYgc2Vjb25kPTM5ICBhbW91bnQ9LTlcbmtlcm5pbmcgZmlyc3Q9MTk2IHNlY29uZD0xMTEgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTE5NiBzZWNvbmQ9MjQyIGFtb3VudD0tMVxua2VybmluZyBmaXJzdD0xOTYgc2Vjb25kPTI0MyBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9MTk2IHNlY29uZD0yNDQgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTE5NiBzZWNvbmQ9MjQ1IGFtb3VudD0tMVxua2VybmluZyBmaXJzdD0xOTYgc2Vjb25kPTI0NiBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9MTk2IHNlY29uZD04NyAgYW1vdW50PS01XG5rZXJuaW5nIGZpcnN0PTE5NiBzZWNvbmQ9ODQgIGFtb3VudD0tMTBcbmtlcm5pbmcgZmlyc3Q9MTk2IHNlY29uZD0xMTcgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTE5NiBzZWNvbmQ9MjQ5IGFtb3VudD0tMVxua2VybmluZyBmaXJzdD0xOTYgc2Vjb25kPTI1MCBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9MTk2IHNlY29uZD0yNTEgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTE5NiBzZWNvbmQ9MjUyIGFtb3VudD0tMVxua2VybmluZyBmaXJzdD0xOTYgc2Vjb25kPTEyMiBhbW91bnQ9MVxua2VybmluZyBmaXJzdD0xOTYgc2Vjb25kPTg2ICBhbW91bnQ9LTdcbmtlcm5pbmcgZmlyc3Q9MTk2IHNlY29uZD04OSAgYW1vdW50PS03XG5rZXJuaW5nIGZpcnN0PTE5NiBzZWNvbmQ9MjIxIGFtb3VudD0tN1xua2VybmluZyBmaXJzdD0xOTcgc2Vjb25kPTExOCBhbW91bnQ9LTRcbmtlcm5pbmcgZmlyc3Q9MTk3IHNlY29uZD0xMjEgYW1vdW50PS00XG5rZXJuaW5nIGZpcnN0PTE5NyBzZWNvbmQ9MjUzIGFtb3VudD0tNFxua2VybmluZyBmaXJzdD0xOTcgc2Vjb25kPTI1NSBhbW91bnQ9LTRcbmtlcm5pbmcgZmlyc3Q9MTk3IHNlY29uZD02NyAgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTE5NyBzZWNvbmQ9NzEgIGFtb3VudD0tMVxua2VybmluZyBmaXJzdD0xOTcgc2Vjb25kPTc5ICBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9MTk3IHNlY29uZD04MSAgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTE5NyBzZWNvbmQ9MjE2IGFtb3VudD0tMVxua2VybmluZyBmaXJzdD0xOTcgc2Vjb25kPTE5OSBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9MTk3IHNlY29uZD0yMTAgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTE5NyBzZWNvbmQ9MjExIGFtb3VudD0tMVxua2VybmluZyBmaXJzdD0xOTcgc2Vjb25kPTIxMiBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9MTk3IHNlY29uZD0yMTMgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTE5NyBzZWNvbmQ9MjE0IGFtb3VudD0tMVxua2VybmluZyBmaXJzdD0xOTcgc2Vjb25kPTg1ICBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9MTk3IHNlY29uZD0yMTcgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTE5NyBzZWNvbmQ9MjE4IGFtb3VudD0tMVxua2VybmluZyBmaXJzdD0xOTcgc2Vjb25kPTIxOSBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9MTk3IHNlY29uZD0yMjAgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTE5NyBzZWNvbmQ9MzQgIGFtb3VudD0tOVxua2VybmluZyBmaXJzdD0xOTcgc2Vjb25kPTM5ICBhbW91bnQ9LTlcbmtlcm5pbmcgZmlyc3Q9MTk3IHNlY29uZD0xMTEgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTE5NyBzZWNvbmQ9MjQyIGFtb3VudD0tMVxua2VybmluZyBmaXJzdD0xOTcgc2Vjb25kPTI0MyBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9MTk3IHNlY29uZD0yNDQgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTE5NyBzZWNvbmQ9MjQ1IGFtb3VudD0tMVxua2VybmluZyBmaXJzdD0xOTcgc2Vjb25kPTI0NiBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9MTk3IHNlY29uZD04NyAgYW1vdW50PS01XG5rZXJuaW5nIGZpcnN0PTE5NyBzZWNvbmQ9ODQgIGFtb3VudD0tMTBcbmtlcm5pbmcgZmlyc3Q9MTk3IHNlY29uZD0xMTcgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTE5NyBzZWNvbmQ9MjQ5IGFtb3VudD0tMVxua2VybmluZyBmaXJzdD0xOTcgc2Vjb25kPTI1MCBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9MTk3IHNlY29uZD0yNTEgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTE5NyBzZWNvbmQ9MjUyIGFtb3VudD0tMVxua2VybmluZyBmaXJzdD0xOTcgc2Vjb25kPTEyMiBhbW91bnQ9MVxua2VybmluZyBmaXJzdD0xOTcgc2Vjb25kPTg2ICBhbW91bnQ9LTdcbmtlcm5pbmcgZmlyc3Q9MTk3IHNlY29uZD04OSAgYW1vdW50PS03XG5rZXJuaW5nIGZpcnN0PTE5NyBzZWNvbmQ9MjIxIGFtb3VudD0tN1xua2VybmluZyBmaXJzdD0xOTkgc2Vjb25kPTg0ICBhbW91bnQ9LTJcbmtlcm5pbmcgZmlyc3Q9MjAwIHNlY29uZD0xMTggYW1vdW50PS0yXG5rZXJuaW5nIGZpcnN0PTIwMCBzZWNvbmQ9MTIxIGFtb3VudD0tMlxua2VybmluZyBmaXJzdD0yMDAgc2Vjb25kPTI1MyBhbW91bnQ9LTJcbmtlcm5pbmcgZmlyc3Q9MjAwIHNlY29uZD0yNTUgYW1vdW50PS0yXG5rZXJuaW5nIGZpcnN0PTIwMCBzZWNvbmQ9MTExIGFtb3VudD0tMVxua2VybmluZyBmaXJzdD0yMDAgc2Vjb25kPTI0MiBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9MjAwIHNlY29uZD0yNDMgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTIwMCBzZWNvbmQ9MjQ0IGFtb3VudD0tMVxua2VybmluZyBmaXJzdD0yMDAgc2Vjb25kPTI0NSBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9MjAwIHNlY29uZD0yNDYgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTIwMCBzZWNvbmQ9ODQgIGFtb3VudD0yXG5rZXJuaW5nIGZpcnN0PTIwMCBzZWNvbmQ9MTE3IGFtb3VudD0tMVxua2VybmluZyBmaXJzdD0yMDAgc2Vjb25kPTI0OSBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9MjAwIHNlY29uZD0yNTAgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTIwMCBzZWNvbmQ9MjUxIGFtb3VudD0tMVxua2VybmluZyBmaXJzdD0yMDAgc2Vjb25kPTI1MiBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9MjAwIHNlY29uZD05OSAgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTIwMCBzZWNvbmQ9MTAwIGFtb3VudD0tMVxua2VybmluZyBmaXJzdD0yMDAgc2Vjb25kPTEwMSBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9MjAwIHNlY29uZD0xMDMgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTIwMCBzZWNvbmQ9MTEzIGFtb3VudD0tMVxua2VybmluZyBmaXJzdD0yMDAgc2Vjb25kPTIzMSBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9MjAwIHNlY29uZD0yMzIgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTIwMCBzZWNvbmQ9MjMzIGFtb3VudD0tMVxua2VybmluZyBmaXJzdD0yMDAgc2Vjb25kPTIzNCBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9MjAwIHNlY29uZD0yMzUgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTIwMSBzZWNvbmQ9MTE4IGFtb3VudD0tMlxua2VybmluZyBmaXJzdD0yMDEgc2Vjb25kPTEyMSBhbW91bnQ9LTJcbmtlcm5pbmcgZmlyc3Q9MjAxIHNlY29uZD0yNTMgYW1vdW50PS0yXG5rZXJuaW5nIGZpcnN0PTIwMSBzZWNvbmQ9MjU1IGFtb3VudD0tMlxua2VybmluZyBmaXJzdD0yMDEgc2Vjb25kPTExMSBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9MjAxIHNlY29uZD0yNDIgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTIwMSBzZWNvbmQ9MjQzIGFtb3VudD0tMVxua2VybmluZyBmaXJzdD0yMDEgc2Vjb25kPTI0NCBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9MjAxIHNlY29uZD0yNDUgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTIwMSBzZWNvbmQ9MjQ2IGFtb3VudD0tMVxua2VybmluZyBmaXJzdD0yMDEgc2Vjb25kPTg0ICBhbW91bnQ9Mlxua2VybmluZyBmaXJzdD0yMDEgc2Vjb25kPTExNyBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9MjAxIHNlY29uZD0yNDkgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTIwMSBzZWNvbmQ9MjUwIGFtb3VudD0tMVxua2VybmluZyBmaXJzdD0yMDEgc2Vjb25kPTI1MSBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9MjAxIHNlY29uZD0yNTIgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTIwMSBzZWNvbmQ9OTkgIGFtb3VudD0tMVxua2VybmluZyBmaXJzdD0yMDEgc2Vjb25kPTEwMCBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9MjAxIHNlY29uZD0xMDEgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTIwMSBzZWNvbmQ9MTAzIGFtb3VudD0tMVxua2VybmluZyBmaXJzdD0yMDEgc2Vjb25kPTExMyBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9MjAxIHNlY29uZD0yMzEgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTIwMSBzZWNvbmQ9MjMyIGFtb3VudD0tMVxua2VybmluZyBmaXJzdD0yMDEgc2Vjb25kPTIzMyBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9MjAxIHNlY29uZD0yMzQgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTIwMSBzZWNvbmQ9MjM1IGFtb3VudD0tMVxua2VybmluZyBmaXJzdD0yMDIgc2Vjb25kPTExOCBhbW91bnQ9LTJcbmtlcm5pbmcgZmlyc3Q9MjAyIHNlY29uZD0xMjEgYW1vdW50PS0yXG5rZXJuaW5nIGZpcnN0PTIwMiBzZWNvbmQ9MjUzIGFtb3VudD0tMlxua2VybmluZyBmaXJzdD0yMDIgc2Vjb25kPTI1NSBhbW91bnQ9LTJcbmtlcm5pbmcgZmlyc3Q9MjAyIHNlY29uZD0xMTEgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTIwMiBzZWNvbmQ9MjQyIGFtb3VudD0tMVxua2VybmluZyBmaXJzdD0yMDIgc2Vjb25kPTI0MyBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9MjAyIHNlY29uZD0yNDQgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTIwMiBzZWNvbmQ9MjQ1IGFtb3VudD0tMVxua2VybmluZyBmaXJzdD0yMDIgc2Vjb25kPTI0NiBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9MjAyIHNlY29uZD04NCAgYW1vdW50PTJcbmtlcm5pbmcgZmlyc3Q9MjAyIHNlY29uZD0xMTcgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTIwMiBzZWNvbmQ9MjQ5IGFtb3VudD0tMVxua2VybmluZyBmaXJzdD0yMDIgc2Vjb25kPTI1MCBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9MjAyIHNlY29uZD0yNTEgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTIwMiBzZWNvbmQ9MjUyIGFtb3VudD0tMVxua2VybmluZyBmaXJzdD0yMDIgc2Vjb25kPTk5ICBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9MjAyIHNlY29uZD0xMDAgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTIwMiBzZWNvbmQ9MTAxIGFtb3VudD0tMVxua2VybmluZyBmaXJzdD0yMDIgc2Vjb25kPTEwMyBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9MjAyIHNlY29uZD0xMTMgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTIwMiBzZWNvbmQ9MjMxIGFtb3VudD0tMVxua2VybmluZyBmaXJzdD0yMDIgc2Vjb25kPTIzMiBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9MjAyIHNlY29uZD0yMzMgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTIwMiBzZWNvbmQ9MjM0IGFtb3VudD0tMVxua2VybmluZyBmaXJzdD0yMDIgc2Vjb25kPTIzNSBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9MjAzIHNlY29uZD0xMTggYW1vdW50PS0yXG5rZXJuaW5nIGZpcnN0PTIwMyBzZWNvbmQ9MTIxIGFtb3VudD0tMlxua2VybmluZyBmaXJzdD0yMDMgc2Vjb25kPTI1MyBhbW91bnQ9LTJcbmtlcm5pbmcgZmlyc3Q9MjAzIHNlY29uZD0yNTUgYW1vdW50PS0yXG5rZXJuaW5nIGZpcnN0PTIwMyBzZWNvbmQ9MTExIGFtb3VudD0tMVxua2VybmluZyBmaXJzdD0yMDMgc2Vjb25kPTI0MiBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9MjAzIHNlY29uZD0yNDMgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTIwMyBzZWNvbmQ9MjQ0IGFtb3VudD0tMVxua2VybmluZyBmaXJzdD0yMDMgc2Vjb25kPTI0NSBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9MjAzIHNlY29uZD0yNDYgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTIwMyBzZWNvbmQ9ODQgIGFtb3VudD0yXG5rZXJuaW5nIGZpcnN0PTIwMyBzZWNvbmQ9MTE3IGFtb3VudD0tMVxua2VybmluZyBmaXJzdD0yMDMgc2Vjb25kPTI0OSBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9MjAzIHNlY29uZD0yNTAgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTIwMyBzZWNvbmQ9MjUxIGFtb3VudD0tMVxua2VybmluZyBmaXJzdD0yMDMgc2Vjb25kPTI1MiBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9MjAzIHNlY29uZD05OSAgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTIwMyBzZWNvbmQ9MTAwIGFtb3VudD0tMVxua2VybmluZyBmaXJzdD0yMDMgc2Vjb25kPTEwMSBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9MjAzIHNlY29uZD0xMDMgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTIwMyBzZWNvbmQ9MTEzIGFtb3VudD0tMVxua2VybmluZyBmaXJzdD0yMDMgc2Vjb25kPTIzMSBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9MjAzIHNlY29uZD0yMzIgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTIwMyBzZWNvbmQ9MjMzIGFtb3VudD0tMVxua2VybmluZyBmaXJzdD0yMDMgc2Vjb25kPTIzNCBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9MjAzIHNlY29uZD0yMzUgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTIwNCBzZWNvbmQ9ODQgIGFtb3VudD0tMlxua2VybmluZyBmaXJzdD0yMDQgc2Vjb25kPTg5ICBhbW91bnQ9LTJcbmtlcm5pbmcgZmlyc3Q9MjA0IHNlY29uZD0yMjEgYW1vdW50PS0yXG5rZXJuaW5nIGZpcnN0PTIwNCBzZWNvbmQ9NjUgIGFtb3VudD0xXG5rZXJuaW5nIGZpcnN0PTIwNCBzZWNvbmQ9MTkyIGFtb3VudD0xXG5rZXJuaW5nIGZpcnN0PTIwNCBzZWNvbmQ9MTkzIGFtb3VudD0xXG5rZXJuaW5nIGZpcnN0PTIwNCBzZWNvbmQ9MTk0IGFtb3VudD0xXG5rZXJuaW5nIGZpcnN0PTIwNCBzZWNvbmQ9MTk1IGFtb3VudD0xXG5rZXJuaW5nIGZpcnN0PTIwNCBzZWNvbmQ9MTk2IGFtb3VudD0xXG5rZXJuaW5nIGZpcnN0PTIwNCBzZWNvbmQ9MTk3IGFtb3VudD0xXG5rZXJuaW5nIGZpcnN0PTIwNCBzZWNvbmQ9ODggIGFtb3VudD0xXG5rZXJuaW5nIGZpcnN0PTIwNSBzZWNvbmQ9ODQgIGFtb3VudD0tMlxua2VybmluZyBmaXJzdD0yMDUgc2Vjb25kPTg5ICBhbW91bnQ9LTJcbmtlcm5pbmcgZmlyc3Q9MjA1IHNlY29uZD0yMjEgYW1vdW50PS0yXG5rZXJuaW5nIGZpcnN0PTIwNSBzZWNvbmQ9NjUgIGFtb3VudD0xXG5rZXJuaW5nIGZpcnN0PTIwNSBzZWNvbmQ9MTkyIGFtb3VudD0xXG5rZXJuaW5nIGZpcnN0PTIwNSBzZWNvbmQ9MTkzIGFtb3VudD0xXG5rZXJuaW5nIGZpcnN0PTIwNSBzZWNvbmQ9MTk0IGFtb3VudD0xXG5rZXJuaW5nIGZpcnN0PTIwNSBzZWNvbmQ9MTk1IGFtb3VudD0xXG5rZXJuaW5nIGZpcnN0PTIwNSBzZWNvbmQ9MTk2IGFtb3VudD0xXG5rZXJuaW5nIGZpcnN0PTIwNSBzZWNvbmQ9MTk3IGFtb3VudD0xXG5rZXJuaW5nIGZpcnN0PTIwNSBzZWNvbmQ9ODggIGFtb3VudD0xXG5rZXJuaW5nIGZpcnN0PTIwNiBzZWNvbmQ9ODQgIGFtb3VudD0tMlxua2VybmluZyBmaXJzdD0yMDYgc2Vjb25kPTg5ICBhbW91bnQ9LTJcbmtlcm5pbmcgZmlyc3Q9MjA2IHNlY29uZD0yMjEgYW1vdW50PS0yXG5rZXJuaW5nIGZpcnN0PTIwNiBzZWNvbmQ9NjUgIGFtb3VudD0xXG5rZXJuaW5nIGZpcnN0PTIwNiBzZWNvbmQ9MTkyIGFtb3VudD0xXG5rZXJuaW5nIGZpcnN0PTIwNiBzZWNvbmQ9MTkzIGFtb3VudD0xXG5rZXJuaW5nIGZpcnN0PTIwNiBzZWNvbmQ9MTk0IGFtb3VudD0xXG5rZXJuaW5nIGZpcnN0PTIwNiBzZWNvbmQ9MTk1IGFtb3VudD0xXG5rZXJuaW5nIGZpcnN0PTIwNiBzZWNvbmQ9MTk2IGFtb3VudD0xXG5rZXJuaW5nIGZpcnN0PTIwNiBzZWNvbmQ9MTk3IGFtb3VudD0xXG5rZXJuaW5nIGZpcnN0PTIwNiBzZWNvbmQ9ODggIGFtb3VudD0xXG5rZXJuaW5nIGZpcnN0PTIwNyBzZWNvbmQ9ODQgIGFtb3VudD0tMlxua2VybmluZyBmaXJzdD0yMDcgc2Vjb25kPTg5ICBhbW91bnQ9LTJcbmtlcm5pbmcgZmlyc3Q9MjA3IHNlY29uZD0yMjEgYW1vdW50PS0yXG5rZXJuaW5nIGZpcnN0PTIwNyBzZWNvbmQ9NjUgIGFtb3VudD0xXG5rZXJuaW5nIGZpcnN0PTIwNyBzZWNvbmQ9MTkyIGFtb3VudD0xXG5rZXJuaW5nIGZpcnN0PTIwNyBzZWNvbmQ9MTkzIGFtb3VudD0xXG5rZXJuaW5nIGZpcnN0PTIwNyBzZWNvbmQ9MTk0IGFtb3VudD0xXG5rZXJuaW5nIGZpcnN0PTIwNyBzZWNvbmQ9MTk1IGFtb3VudD0xXG5rZXJuaW5nIGZpcnN0PTIwNyBzZWNvbmQ9MTk2IGFtb3VudD0xXG5rZXJuaW5nIGZpcnN0PTIwNyBzZWNvbmQ9MTk3IGFtb3VudD0xXG5rZXJuaW5nIGZpcnN0PTIwNyBzZWNvbmQ9ODggIGFtb3VudD0xXG5rZXJuaW5nIGZpcnN0PTIwOSBzZWNvbmQ9ODQgIGFtb3VudD0tMlxua2VybmluZyBmaXJzdD0yMDkgc2Vjb25kPTg5ICBhbW91bnQ9LTJcbmtlcm5pbmcgZmlyc3Q9MjA5IHNlY29uZD0yMjEgYW1vdW50PS0yXG5rZXJuaW5nIGZpcnN0PTIwOSBzZWNvbmQ9NjUgIGFtb3VudD0xXG5rZXJuaW5nIGZpcnN0PTIwOSBzZWNvbmQ9MTkyIGFtb3VudD0xXG5rZXJuaW5nIGZpcnN0PTIwOSBzZWNvbmQ9MTkzIGFtb3VudD0xXG5rZXJuaW5nIGZpcnN0PTIwOSBzZWNvbmQ9MTk0IGFtb3VudD0xXG5rZXJuaW5nIGZpcnN0PTIwOSBzZWNvbmQ9MTk1IGFtb3VudD0xXG5rZXJuaW5nIGZpcnN0PTIwOSBzZWNvbmQ9MTk2IGFtb3VudD0xXG5rZXJuaW5nIGZpcnN0PTIwOSBzZWNvbmQ9MTk3IGFtb3VudD0xXG5rZXJuaW5nIGZpcnN0PTIwOSBzZWNvbmQ9ODggIGFtb3VudD0xXG5rZXJuaW5nIGZpcnN0PTIxMCBzZWNvbmQ9ODQgIGFtb3VudD0tMlxua2VybmluZyBmaXJzdD0yMTAgc2Vjb25kPTg2ICBhbW91bnQ9LTJcbmtlcm5pbmcgZmlyc3Q9MjEwIHNlY29uZD04OSAgYW1vdW50PS0zXG5rZXJuaW5nIGZpcnN0PTIxMCBzZWNvbmQ9MjIxIGFtb3VudD0tM1xua2VybmluZyBmaXJzdD0yMTAgc2Vjb25kPTY1ICBhbW91bnQ9LTJcbmtlcm5pbmcgZmlyc3Q9MjEwIHNlY29uZD0xOTIgYW1vdW50PS0yXG5rZXJuaW5nIGZpcnN0PTIxMCBzZWNvbmQ9MTkzIGFtb3VudD0tMlxua2VybmluZyBmaXJzdD0yMTAgc2Vjb25kPTE5NCBhbW91bnQ9LTJcbmtlcm5pbmcgZmlyc3Q9MjEwIHNlY29uZD0xOTUgYW1vdW50PS0yXG5rZXJuaW5nIGZpcnN0PTIxMCBzZWNvbmQ9MTk2IGFtb3VudD0tMlxua2VybmluZyBmaXJzdD0yMTAgc2Vjb25kPTE5NyBhbW91bnQ9LTJcbmtlcm5pbmcgZmlyc3Q9MjEwIHNlY29uZD04OCAgYW1vdW50PS0yXG5rZXJuaW5nIGZpcnN0PTIxMCBzZWNvbmQ9NDQgIGFtb3VudD0tOFxua2VybmluZyBmaXJzdD0yMTAgc2Vjb25kPTQ2ICBhbW91bnQ9LThcbmtlcm5pbmcgZmlyc3Q9MjEwIHNlY29uZD05MCAgYW1vdW50PS0yXG5rZXJuaW5nIGZpcnN0PTIxMSBzZWNvbmQ9ODQgIGFtb3VudD0tMlxua2VybmluZyBmaXJzdD0yMTEgc2Vjb25kPTg2ICBhbW91bnQ9LTJcbmtlcm5pbmcgZmlyc3Q9MjExIHNlY29uZD04OSAgYW1vdW50PS0zXG5rZXJuaW5nIGZpcnN0PTIxMSBzZWNvbmQ9MjIxIGFtb3VudD0tM1xua2VybmluZyBmaXJzdD0yMTEgc2Vjb25kPTY1ICBhbW91bnQ9LTJcbmtlcm5pbmcgZmlyc3Q9MjExIHNlY29uZD0xOTIgYW1vdW50PS0yXG5rZXJuaW5nIGZpcnN0PTIxMSBzZWNvbmQ9MTkzIGFtb3VudD0tMlxua2VybmluZyBmaXJzdD0yMTEgc2Vjb25kPTE5NCBhbW91bnQ9LTJcbmtlcm5pbmcgZmlyc3Q9MjExIHNlY29uZD0xOTUgYW1vdW50PS0yXG5rZXJuaW5nIGZpcnN0PTIxMSBzZWNvbmQ9MTk2IGFtb3VudD0tMlxua2VybmluZyBmaXJzdD0yMTEgc2Vjb25kPTE5NyBhbW91bnQ9LTJcbmtlcm5pbmcgZmlyc3Q9MjExIHNlY29uZD04OCAgYW1vdW50PS0yXG5rZXJuaW5nIGZpcnN0PTIxMSBzZWNvbmQ9NDQgIGFtb3VudD0tOFxua2VybmluZyBmaXJzdD0yMTEgc2Vjb25kPTQ2ICBhbW91bnQ9LThcbmtlcm5pbmcgZmlyc3Q9MjExIHNlY29uZD05MCAgYW1vdW50PS0yXG5rZXJuaW5nIGZpcnN0PTIxMiBzZWNvbmQ9ODQgIGFtb3VudD0tMlxua2VybmluZyBmaXJzdD0yMTIgc2Vjb25kPTg2ICBhbW91bnQ9LTJcbmtlcm5pbmcgZmlyc3Q9MjEyIHNlY29uZD04OSAgYW1vdW50PS0zXG5rZXJuaW5nIGZpcnN0PTIxMiBzZWNvbmQ9MjIxIGFtb3VudD0tM1xua2VybmluZyBmaXJzdD0yMTIgc2Vjb25kPTY1ICBhbW91bnQ9LTJcbmtlcm5pbmcgZmlyc3Q9MjEyIHNlY29uZD0xOTIgYW1vdW50PS0yXG5rZXJuaW5nIGZpcnN0PTIxMiBzZWNvbmQ9MTkzIGFtb3VudD0tMlxua2VybmluZyBmaXJzdD0yMTIgc2Vjb25kPTE5NCBhbW91bnQ9LTJcbmtlcm5pbmcgZmlyc3Q9MjEyIHNlY29uZD0xOTUgYW1vdW50PS0yXG5rZXJuaW5nIGZpcnN0PTIxMiBzZWNvbmQ9MTk2IGFtb3VudD0tMlxua2VybmluZyBmaXJzdD0yMTIgc2Vjb25kPTE5NyBhbW91bnQ9LTJcbmtlcm5pbmcgZmlyc3Q9MjEyIHNlY29uZD04OCAgYW1vdW50PS0yXG5rZXJuaW5nIGZpcnN0PTIxMiBzZWNvbmQ9NDQgIGFtb3VudD0tOFxua2VybmluZyBmaXJzdD0yMTIgc2Vjb25kPTQ2ICBhbW91bnQ9LThcbmtlcm5pbmcgZmlyc3Q9MjEyIHNlY29uZD05MCAgYW1vdW50PS0yXG5rZXJuaW5nIGZpcnN0PTIxMyBzZWNvbmQ9ODQgIGFtb3VudD0tMlxua2VybmluZyBmaXJzdD0yMTMgc2Vjb25kPTg2ICBhbW91bnQ9LTJcbmtlcm5pbmcgZmlyc3Q9MjEzIHNlY29uZD04OSAgYW1vdW50PS0zXG5rZXJuaW5nIGZpcnN0PTIxMyBzZWNvbmQ9MjIxIGFtb3VudD0tM1xua2VybmluZyBmaXJzdD0yMTMgc2Vjb25kPTY1ICBhbW91bnQ9LTJcbmtlcm5pbmcgZmlyc3Q9MjEzIHNlY29uZD0xOTIgYW1vdW50PS0yXG5rZXJuaW5nIGZpcnN0PTIxMyBzZWNvbmQ9MTkzIGFtb3VudD0tMlxua2VybmluZyBmaXJzdD0yMTMgc2Vjb25kPTE5NCBhbW91bnQ9LTJcbmtlcm5pbmcgZmlyc3Q9MjEzIHNlY29uZD0xOTUgYW1vdW50PS0yXG5rZXJuaW5nIGZpcnN0PTIxMyBzZWNvbmQ9MTk2IGFtb3VudD0tMlxua2VybmluZyBmaXJzdD0yMTMgc2Vjb25kPTE5NyBhbW91bnQ9LTJcbmtlcm5pbmcgZmlyc3Q9MjEzIHNlY29uZD04OCAgYW1vdW50PS0yXG5rZXJuaW5nIGZpcnN0PTIxMyBzZWNvbmQ9NDQgIGFtb3VudD0tOFxua2VybmluZyBmaXJzdD0yMTMgc2Vjb25kPTQ2ICBhbW91bnQ9LThcbmtlcm5pbmcgZmlyc3Q9MjEzIHNlY29uZD05MCAgYW1vdW50PS0yXG5rZXJuaW5nIGZpcnN0PTIxNCBzZWNvbmQ9ODQgIGFtb3VudD0tMlxua2VybmluZyBmaXJzdD0yMTQgc2Vjb25kPTg2ICBhbW91bnQ9LTJcbmtlcm5pbmcgZmlyc3Q9MjE0IHNlY29uZD04OSAgYW1vdW50PS0zXG5rZXJuaW5nIGZpcnN0PTIxNCBzZWNvbmQ9MjIxIGFtb3VudD0tM1xua2VybmluZyBmaXJzdD0yMTQgc2Vjb25kPTY1ICBhbW91bnQ9LTJcbmtlcm5pbmcgZmlyc3Q9MjE0IHNlY29uZD0xOTIgYW1vdW50PS0yXG5rZXJuaW5nIGZpcnN0PTIxNCBzZWNvbmQ9MTkzIGFtb3VudD0tMlxua2VybmluZyBmaXJzdD0yMTQgc2Vjb25kPTE5NCBhbW91bnQ9LTJcbmtlcm5pbmcgZmlyc3Q9MjE0IHNlY29uZD0xOTUgYW1vdW50PS0yXG5rZXJuaW5nIGZpcnN0PTIxNCBzZWNvbmQ9MTk2IGFtb3VudD0tMlxua2VybmluZyBmaXJzdD0yMTQgc2Vjb25kPTE5NyBhbW91bnQ9LTJcbmtlcm5pbmcgZmlyc3Q9MjE0IHNlY29uZD04OCAgYW1vdW50PS0yXG5rZXJuaW5nIGZpcnN0PTIxNCBzZWNvbmQ9NDQgIGFtb3VudD0tOFxua2VybmluZyBmaXJzdD0yMTQgc2Vjb25kPTQ2ICBhbW91bnQ9LThcbmtlcm5pbmcgZmlyc3Q9MjE0IHNlY29uZD05MCAgYW1vdW50PS0yXG5rZXJuaW5nIGZpcnN0PTIxNyBzZWNvbmQ9NjUgIGFtb3VudD0tMlxua2VybmluZyBmaXJzdD0yMTcgc2Vjb25kPTE5MiBhbW91bnQ9LTJcbmtlcm5pbmcgZmlyc3Q9MjE3IHNlY29uZD0xOTMgYW1vdW50PS0yXG5rZXJuaW5nIGZpcnN0PTIxNyBzZWNvbmQ9MTk0IGFtb3VudD0tMlxua2VybmluZyBmaXJzdD0yMTcgc2Vjb25kPTE5NSBhbW91bnQ9LTJcbmtlcm5pbmcgZmlyc3Q9MjE3IHNlY29uZD0xOTYgYW1vdW50PS0yXG5rZXJuaW5nIGZpcnN0PTIxNyBzZWNvbmQ9MTk3IGFtb3VudD0tMlxua2VybmluZyBmaXJzdD0yMTggc2Vjb25kPTY1ICBhbW91bnQ9LTJcbmtlcm5pbmcgZmlyc3Q9MjE4IHNlY29uZD0xOTIgYW1vdW50PS0yXG5rZXJuaW5nIGZpcnN0PTIxOCBzZWNvbmQ9MTkzIGFtb3VudD0tMlxua2VybmluZyBmaXJzdD0yMTggc2Vjb25kPTE5NCBhbW91bnQ9LTJcbmtlcm5pbmcgZmlyc3Q9MjE4IHNlY29uZD0xOTUgYW1vdW50PS0yXG5rZXJuaW5nIGZpcnN0PTIxOCBzZWNvbmQ9MTk2IGFtb3VudD0tMlxua2VybmluZyBmaXJzdD0yMTggc2Vjb25kPTE5NyBhbW91bnQ9LTJcbmtlcm5pbmcgZmlyc3Q9MjE5IHNlY29uZD02NSAgYW1vdW50PS0yXG5rZXJuaW5nIGZpcnN0PTIxOSBzZWNvbmQ9MTkyIGFtb3VudD0tMlxua2VybmluZyBmaXJzdD0yMTkgc2Vjb25kPTE5MyBhbW91bnQ9LTJcbmtlcm5pbmcgZmlyc3Q9MjE5IHNlY29uZD0xOTQgYW1vdW50PS0yXG5rZXJuaW5nIGZpcnN0PTIxOSBzZWNvbmQ9MTk1IGFtb3VudD0tMlxua2VybmluZyBmaXJzdD0yMTkgc2Vjb25kPTE5NiBhbW91bnQ9LTJcbmtlcm5pbmcgZmlyc3Q9MjE5IHNlY29uZD0xOTcgYW1vdW50PS0yXG5rZXJuaW5nIGZpcnN0PTIyMCBzZWNvbmQ9NjUgIGFtb3VudD0tMlxua2VybmluZyBmaXJzdD0yMjAgc2Vjb25kPTE5MiBhbW91bnQ9LTJcbmtlcm5pbmcgZmlyc3Q9MjIwIHNlY29uZD0xOTMgYW1vdW50PS0yXG5rZXJuaW5nIGZpcnN0PTIyMCBzZWNvbmQ9MTk0IGFtb3VudD0tMlxua2VybmluZyBmaXJzdD0yMjAgc2Vjb25kPTE5NSBhbW91bnQ9LTJcbmtlcm5pbmcgZmlyc3Q9MjIwIHNlY29uZD0xOTYgYW1vdW50PS0yXG5rZXJuaW5nIGZpcnN0PTIyMCBzZWNvbmQ9MTk3IGFtb3VudD0tMlxua2VybmluZyBmaXJzdD0yMjEgc2Vjb25kPTExOCBhbW91bnQ9LTJcbmtlcm5pbmcgZmlyc3Q9MjIxIHNlY29uZD0xMjEgYW1vdW50PS0yXG5rZXJuaW5nIGZpcnN0PTIyMSBzZWNvbmQ9MjUzIGFtb3VudD0tMlxua2VybmluZyBmaXJzdD0yMjEgc2Vjb25kPTI1NSBhbW91bnQ9LTJcbmtlcm5pbmcgZmlyc3Q9MjIxIHNlY29uZD02NyAgYW1vdW50PS0yXG5rZXJuaW5nIGZpcnN0PTIyMSBzZWNvbmQ9NzEgIGFtb3VudD0tMlxua2VybmluZyBmaXJzdD0yMjEgc2Vjb25kPTc5ICBhbW91bnQ9LTJcbmtlcm5pbmcgZmlyc3Q9MjIxIHNlY29uZD04MSAgYW1vdW50PS0yXG5rZXJuaW5nIGZpcnN0PTIyMSBzZWNvbmQ9MjE2IGFtb3VudD0tMlxua2VybmluZyBmaXJzdD0yMjEgc2Vjb25kPTE5OSBhbW91bnQ9LTJcbmtlcm5pbmcgZmlyc3Q9MjIxIHNlY29uZD0yMTAgYW1vdW50PS0yXG5rZXJuaW5nIGZpcnN0PTIyMSBzZWNvbmQ9MjExIGFtb3VudD0tMlxua2VybmluZyBmaXJzdD0yMjEgc2Vjb25kPTIxMiBhbW91bnQ9LTJcbmtlcm5pbmcgZmlyc3Q9MjIxIHNlY29uZD0yMTMgYW1vdW50PS0yXG5rZXJuaW5nIGZpcnN0PTIyMSBzZWNvbmQ9MjE0IGFtb3VudD0tMlxua2VybmluZyBmaXJzdD0yMjEgc2Vjb25kPTg1ICBhbW91bnQ9LTdcbmtlcm5pbmcgZmlyc3Q9MjIxIHNlY29uZD0yMTcgYW1vdW50PS03XG5rZXJuaW5nIGZpcnN0PTIyMSBzZWNvbmQ9MjE4IGFtb3VudD0tN1xua2VybmluZyBmaXJzdD0yMjEgc2Vjb25kPTIxOSBhbW91bnQ9LTdcbmtlcm5pbmcgZmlyc3Q9MjIxIHNlY29uZD0yMjAgYW1vdW50PS03XG5rZXJuaW5nIGZpcnN0PTIyMSBzZWNvbmQ9MTExIGFtb3VudD0tNVxua2VybmluZyBmaXJzdD0yMjEgc2Vjb25kPTI0MiBhbW91bnQ9LTVcbmtlcm5pbmcgZmlyc3Q9MjIxIHNlY29uZD0yNDMgYW1vdW50PS01XG5rZXJuaW5nIGZpcnN0PTIyMSBzZWNvbmQ9MjQ0IGFtb3VudD0tNVxua2VybmluZyBmaXJzdD0yMjEgc2Vjb25kPTI0NSBhbW91bnQ9LTVcbmtlcm5pbmcgZmlyc3Q9MjIxIHNlY29uZD0yNDYgYW1vdW50PS01XG5rZXJuaW5nIGZpcnN0PTIyMSBzZWNvbmQ9ODcgIGFtb3VudD0xXG5rZXJuaW5nIGZpcnN0PTIyMSBzZWNvbmQ9ODQgIGFtb3VudD0xXG5rZXJuaW5nIGZpcnN0PTIyMSBzZWNvbmQ9MTE3IGFtb3VudD0tM1xua2VybmluZyBmaXJzdD0yMjEgc2Vjb25kPTI0OSBhbW91bnQ9LTNcbmtlcm5pbmcgZmlyc3Q9MjIxIHNlY29uZD0yNTAgYW1vdW50PS0zXG5rZXJuaW5nIGZpcnN0PTIyMSBzZWNvbmQ9MjUxIGFtb3VudD0tM1xua2VybmluZyBmaXJzdD0yMjEgc2Vjb25kPTI1MiBhbW91bnQ9LTNcbmtlcm5pbmcgZmlyc3Q9MjIxIHNlY29uZD0xMjIgYW1vdW50PS0yXG5rZXJuaW5nIGZpcnN0PTIyMSBzZWNvbmQ9ODYgIGFtb3VudD0xXG5rZXJuaW5nIGZpcnN0PTIyMSBzZWNvbmQ9ODkgIGFtb3VudD0xXG5rZXJuaW5nIGZpcnN0PTIyMSBzZWNvbmQ9MjIxIGFtb3VudD0xXG5rZXJuaW5nIGZpcnN0PTIyMSBzZWNvbmQ9NjUgIGFtb3VudD0tN1xua2VybmluZyBmaXJzdD0yMjEgc2Vjb25kPTE5MiBhbW91bnQ9LTdcbmtlcm5pbmcgZmlyc3Q9MjIxIHNlY29uZD0xOTMgYW1vdW50PS03XG5rZXJuaW5nIGZpcnN0PTIyMSBzZWNvbmQ9MTk0IGFtb3VudD0tN1xua2VybmluZyBmaXJzdD0yMjEgc2Vjb25kPTE5NSBhbW91bnQ9LTdcbmtlcm5pbmcgZmlyc3Q9MjIxIHNlY29uZD0xOTYgYW1vdW50PS03XG5rZXJuaW5nIGZpcnN0PTIyMSBzZWNvbmQ9MTk3IGFtb3VudD0tN1xua2VybmluZyBmaXJzdD0yMjEgc2Vjb25kPTg4ICBhbW91bnQ9MVxua2VybmluZyBmaXJzdD0yMjEgc2Vjb25kPTQ0ICBhbW91bnQ9LTE2XG5rZXJuaW5nIGZpcnN0PTIyMSBzZWNvbmQ9NDYgIGFtb3VudD0tMTZcbmtlcm5pbmcgZmlyc3Q9MjIxIHNlY29uZD05OSAgYW1vdW50PS01XG5rZXJuaW5nIGZpcnN0PTIyMSBzZWNvbmQ9MTAwIGFtb3VudD0tNVxua2VybmluZyBmaXJzdD0yMjEgc2Vjb25kPTEwMSBhbW91bnQ9LTVcbmtlcm5pbmcgZmlyc3Q9MjIxIHNlY29uZD0xMDMgYW1vdW50PS01XG5rZXJuaW5nIGZpcnN0PTIyMSBzZWNvbmQ9MTEzIGFtb3VudD0tNVxua2VybmluZyBmaXJzdD0yMjEgc2Vjb25kPTIzMSBhbW91bnQ9LTVcbmtlcm5pbmcgZmlyc3Q9MjIxIHNlY29uZD0yMzIgYW1vdW50PS01XG5rZXJuaW5nIGZpcnN0PTIyMSBzZWNvbmQ9MjMzIGFtb3VudD0tNVxua2VybmluZyBmaXJzdD0yMjEgc2Vjb25kPTIzNCBhbW91bnQ9LTVcbmtlcm5pbmcgZmlyc3Q9MjIxIHNlY29uZD0yMzUgYW1vdW50PS01XG5rZXJuaW5nIGZpcnN0PTIyMSBzZWNvbmQ9MTIwIGFtb3VudD0tMlxua2VybmluZyBmaXJzdD0yMjEgc2Vjb25kPTQ1ICBhbW91bnQ9LTRcbmtlcm5pbmcgZmlyc3Q9MjIxIHNlY29uZD0xNzMgYW1vdW50PS00XG5rZXJuaW5nIGZpcnN0PTIyMSBzZWNvbmQ9MTA5IGFtb3VudD0tM1xua2VybmluZyBmaXJzdD0yMjEgc2Vjb25kPTExMCBhbW91bnQ9LTNcbmtlcm5pbmcgZmlyc3Q9MjIxIHNlY29uZD0xMTIgYW1vdW50PS0zXG5rZXJuaW5nIGZpcnN0PTIyMSBzZWNvbmQ9MjQxIGFtb3VudD0tM1xua2VybmluZyBmaXJzdD0yMjEgc2Vjb25kPTgzICBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9MjIxIHNlY29uZD05NyAgYW1vdW50PS02XG5rZXJuaW5nIGZpcnN0PTIyMSBzZWNvbmQ9MjI0IGFtb3VudD0tNlxua2VybmluZyBmaXJzdD0yMjEgc2Vjb25kPTIyNSBhbW91bnQ9LTZcbmtlcm5pbmcgZmlyc3Q9MjIxIHNlY29uZD0yMjYgYW1vdW50PS02XG5rZXJuaW5nIGZpcnN0PTIyMSBzZWNvbmQ9MjI3IGFtb3VudD0tNlxua2VybmluZyBmaXJzdD0yMjEgc2Vjb25kPTIyOCBhbW91bnQ9LTZcbmtlcm5pbmcgZmlyc3Q9MjIxIHNlY29uZD0yMjkgYW1vdW50PS02XG5rZXJuaW5nIGZpcnN0PTIyMSBzZWNvbmQ9MTE1IGFtb3VudD0tNVxua2VybmluZyBmaXJzdD0yMjEgc2Vjb25kPTc0ICBhbW91bnQ9LTdcbmtlcm5pbmcgZmlyc3Q9MjI0IHNlY29uZD0xMTggYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTIyNCBzZWNvbmQ9MTIxIGFtb3VudD0tMVxua2VybmluZyBmaXJzdD0yMjQgc2Vjb25kPTI1MyBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9MjI0IHNlY29uZD0yNTUgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTIyNCBzZWNvbmQ9MzQgIGFtb3VudD0tNVxua2VybmluZyBmaXJzdD0yMjQgc2Vjb25kPTM5ICBhbW91bnQ9LTVcbmtlcm5pbmcgZmlyc3Q9MjI1IHNlY29uZD0xMTggYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTIyNSBzZWNvbmQ9MTIxIGFtb3VudD0tMVxua2VybmluZyBmaXJzdD0yMjUgc2Vjb25kPTI1MyBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9MjI1IHNlY29uZD0yNTUgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTIyNSBzZWNvbmQ9MzQgIGFtb3VudD0tNVxua2VybmluZyBmaXJzdD0yMjUgc2Vjb25kPTM5ICBhbW91bnQ9LTVcbmtlcm5pbmcgZmlyc3Q9MjI2IHNlY29uZD0xMTggYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTIyNiBzZWNvbmQ9MTIxIGFtb3VudD0tMVxua2VybmluZyBmaXJzdD0yMjYgc2Vjb25kPTI1MyBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9MjI2IHNlY29uZD0yNTUgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTIyNiBzZWNvbmQ9MzQgIGFtb3VudD0tNVxua2VybmluZyBmaXJzdD0yMjYgc2Vjb25kPTM5ICBhbW91bnQ9LTVcbmtlcm5pbmcgZmlyc3Q9MjI3IHNlY29uZD0xMTggYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTIyNyBzZWNvbmQ9MTIxIGFtb3VudD0tMVxua2VybmluZyBmaXJzdD0yMjcgc2Vjb25kPTI1MyBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9MjI3IHNlY29uZD0yNTUgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTIyNyBzZWNvbmQ9MzQgIGFtb3VudD0tNVxua2VybmluZyBmaXJzdD0yMjcgc2Vjb25kPTM5ICBhbW91bnQ9LTVcbmtlcm5pbmcgZmlyc3Q9MjI4IHNlY29uZD0xMTggYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTIyOCBzZWNvbmQ9MTIxIGFtb3VudD0tMVxua2VybmluZyBmaXJzdD0yMjggc2Vjb25kPTI1MyBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9MjI4IHNlY29uZD0yNTUgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTIyOCBzZWNvbmQ9MzQgIGFtb3VudD0tNVxua2VybmluZyBmaXJzdD0yMjggc2Vjb25kPTM5ICBhbW91bnQ9LTVcbmtlcm5pbmcgZmlyc3Q9MjI5IHNlY29uZD0xMTggYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTIyOSBzZWNvbmQ9MTIxIGFtb3VudD0tMVxua2VybmluZyBmaXJzdD0yMjkgc2Vjb25kPTI1MyBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9MjI5IHNlY29uZD0yNTUgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTIyOSBzZWNvbmQ9MzQgIGFtb3VudD0tNVxua2VybmluZyBmaXJzdD0yMjkgc2Vjb25kPTM5ICBhbW91bnQ9LTVcbmtlcm5pbmcgZmlyc3Q9MjMxIHNlY29uZD0zNCAgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTIzMSBzZWNvbmQ9MzkgIGFtb3VudD0tMVxua2VybmluZyBmaXJzdD0yMzIgc2Vjb25kPTExOCBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9MjMyIHNlY29uZD0xMjEgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTIzMiBzZWNvbmQ9MjUzIGFtb3VudD0tMVxua2VybmluZyBmaXJzdD0yMzIgc2Vjb25kPTI1NSBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9MjMyIHNlY29uZD0zNCAgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTIzMiBzZWNvbmQ9MzkgIGFtb3VudD0tMVxua2VybmluZyBmaXJzdD0yMzMgc2Vjb25kPTExOCBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9MjMzIHNlY29uZD0xMjEgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTIzMyBzZWNvbmQ9MjUzIGFtb3VudD0tMVxua2VybmluZyBmaXJzdD0yMzMgc2Vjb25kPTI1NSBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9MjMzIHNlY29uZD0zNCAgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTIzMyBzZWNvbmQ9MzkgIGFtb3VudD0tMVxua2VybmluZyBmaXJzdD0yMzQgc2Vjb25kPTExOCBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9MjM0IHNlY29uZD0xMjEgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTIzNCBzZWNvbmQ9MjUzIGFtb3VudD0tMVxua2VybmluZyBmaXJzdD0yMzQgc2Vjb25kPTI1NSBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9MjM0IHNlY29uZD0zNCAgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTIzNCBzZWNvbmQ9MzkgIGFtb3VudD0tMVxua2VybmluZyBmaXJzdD0yMzUgc2Vjb25kPTExOCBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9MjM1IHNlY29uZD0xMjEgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTIzNSBzZWNvbmQ9MjUzIGFtb3VudD0tMVxua2VybmluZyBmaXJzdD0yMzUgc2Vjb25kPTI1NSBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9MjM1IHNlY29uZD0zNCAgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTIzNSBzZWNvbmQ9MzkgIGFtb3VudD0tMVxua2VybmluZyBmaXJzdD0yNDEgc2Vjb25kPTM0ICBhbW91bnQ9LThcbmtlcm5pbmcgZmlyc3Q9MjQxIHNlY29uZD0zOSAgYW1vdW50PS04XG5rZXJuaW5nIGZpcnN0PTI0MiBzZWNvbmQ9MTE4IGFtb3VudD0tMVxua2VybmluZyBmaXJzdD0yNDIgc2Vjb25kPTEyMSBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9MjQyIHNlY29uZD0yNTMgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTI0MiBzZWNvbmQ9MjU1IGFtb3VudD0tMVxua2VybmluZyBmaXJzdD0yNDIgc2Vjb25kPTM0ICBhbW91bnQ9LTExXG5rZXJuaW5nIGZpcnN0PTI0MiBzZWNvbmQ9MzkgIGFtb3VudD0tMTFcbmtlcm5pbmcgZmlyc3Q9MjQyIHNlY29uZD0xMjIgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTI0MiBzZWNvbmQ9MTIwIGFtb3VudD0tMlxua2VybmluZyBmaXJzdD0yNDMgc2Vjb25kPTExOCBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9MjQzIHNlY29uZD0xMjEgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTI0MyBzZWNvbmQ9MjUzIGFtb3VudD0tMVxua2VybmluZyBmaXJzdD0yNDMgc2Vjb25kPTI1NSBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9MjQzIHNlY29uZD0zNCAgYW1vdW50PS0xMVxua2VybmluZyBmaXJzdD0yNDMgc2Vjb25kPTM5ICBhbW91bnQ9LTExXG5rZXJuaW5nIGZpcnN0PTI0MyBzZWNvbmQ9MTIyIGFtb3VudD0tMVxua2VybmluZyBmaXJzdD0yNDMgc2Vjb25kPTEyMCBhbW91bnQ9LTJcbmtlcm5pbmcgZmlyc3Q9MjQ0IHNlY29uZD0xMTggYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTI0NCBzZWNvbmQ9MTIxIGFtb3VudD0tMVxua2VybmluZyBmaXJzdD0yNDQgc2Vjb25kPTI1MyBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9MjQ0IHNlY29uZD0yNTUgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTI0NCBzZWNvbmQ9MzQgIGFtb3VudD0tMTFcbmtlcm5pbmcgZmlyc3Q9MjQ0IHNlY29uZD0zOSAgYW1vdW50PS0xMVxua2VybmluZyBmaXJzdD0yNDQgc2Vjb25kPTEyMiBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9MjQ0IHNlY29uZD0xMjAgYW1vdW50PS0yXG5rZXJuaW5nIGZpcnN0PTI0NSBzZWNvbmQ9MTE4IGFtb3VudD0tMVxua2VybmluZyBmaXJzdD0yNDUgc2Vjb25kPTEyMSBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9MjQ1IHNlY29uZD0yNTMgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTI0NSBzZWNvbmQ9MjU1IGFtb3VudD0tMVxua2VybmluZyBmaXJzdD0yNDUgc2Vjb25kPTM0ICBhbW91bnQ9LTExXG5rZXJuaW5nIGZpcnN0PTI0NSBzZWNvbmQ9MzkgIGFtb3VudD0tMTFcbmtlcm5pbmcgZmlyc3Q9MjQ1IHNlY29uZD0xMjIgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTI0NSBzZWNvbmQ9MTIwIGFtb3VudD0tMlxua2VybmluZyBmaXJzdD0yNDYgc2Vjb25kPTExOCBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9MjQ2IHNlY29uZD0xMjEgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTI0NiBzZWNvbmQ9MjUzIGFtb3VudD0tMVxua2VybmluZyBmaXJzdD0yNDYgc2Vjb25kPTI1NSBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9MjQ2IHNlY29uZD0zNCAgYW1vdW50PS0xMVxua2VybmluZyBmaXJzdD0yNDYgc2Vjb25kPTM5ICBhbW91bnQ9LTExXG5rZXJuaW5nIGZpcnN0PTI0NiBzZWNvbmQ9MTIyIGFtb3VudD0tMVxua2VybmluZyBmaXJzdD0yNDYgc2Vjb25kPTEyMCBhbW91bnQ9LTJcbmtlcm5pbmcgZmlyc3Q9MjUzIHNlY29uZD0zNCAgYW1vdW50PTFcbmtlcm5pbmcgZmlyc3Q9MjUzIHNlY29uZD0zOSAgYW1vdW50PTFcbmtlcm5pbmcgZmlyc3Q9MjUzIHNlY29uZD0xMTEgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTI1MyBzZWNvbmQ9MjQyIGFtb3VudD0tMVxua2VybmluZyBmaXJzdD0yNTMgc2Vjb25kPTI0MyBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9MjUzIHNlY29uZD0yNDQgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTI1MyBzZWNvbmQ9MjQ1IGFtb3VudD0tMVxua2VybmluZyBmaXJzdD0yNTMgc2Vjb25kPTI0NiBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9MjUzIHNlY29uZD00NCAgYW1vdW50PS04XG5rZXJuaW5nIGZpcnN0PTI1MyBzZWNvbmQ9NDYgIGFtb3VudD0tOFxua2VybmluZyBmaXJzdD0yNTMgc2Vjb25kPTk5ICBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9MjUzIHNlY29uZD0xMDAgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTI1MyBzZWNvbmQ9MTAxIGFtb3VudD0tMVxua2VybmluZyBmaXJzdD0yNTMgc2Vjb25kPTEwMyBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9MjUzIHNlY29uZD0xMTMgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTI1MyBzZWNvbmQ9MjMxIGFtb3VudD0tMVxua2VybmluZyBmaXJzdD0yNTMgc2Vjb25kPTIzMiBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9MjUzIHNlY29uZD0yMzMgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTI1MyBzZWNvbmQ9MjM0IGFtb3VudD0tMVxua2VybmluZyBmaXJzdD0yNTMgc2Vjb25kPTIzNSBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9MjUzIHNlY29uZD05NyAgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTI1MyBzZWNvbmQ9MjI0IGFtb3VudD0tMVxua2VybmluZyBmaXJzdD0yNTMgc2Vjb25kPTIyNSBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9MjUzIHNlY29uZD0yMjYgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTI1MyBzZWNvbmQ9MjI3IGFtb3VudD0tMVxua2VybmluZyBmaXJzdD0yNTMgc2Vjb25kPTIyOCBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9MjUzIHNlY29uZD0yMjkgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTI1NSBzZWNvbmQ9MzQgIGFtb3VudD0xXG5rZXJuaW5nIGZpcnN0PTI1NSBzZWNvbmQ9MzkgIGFtb3VudD0xXG5rZXJuaW5nIGZpcnN0PTI1NSBzZWNvbmQ9MTExIGFtb3VudD0tMVxua2VybmluZyBmaXJzdD0yNTUgc2Vjb25kPTI0MiBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9MjU1IHNlY29uZD0yNDMgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTI1NSBzZWNvbmQ9MjQ0IGFtb3VudD0tMVxua2VybmluZyBmaXJzdD0yNTUgc2Vjb25kPTI0NSBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9MjU1IHNlY29uZD0yNDYgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTI1NSBzZWNvbmQ9NDQgIGFtb3VudD0tOFxua2VybmluZyBmaXJzdD0yNTUgc2Vjb25kPTQ2ICBhbW91bnQ9LThcbmtlcm5pbmcgZmlyc3Q9MjU1IHNlY29uZD05OSAgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTI1NSBzZWNvbmQ9MTAwIGFtb3VudD0tMVxua2VybmluZyBmaXJzdD0yNTUgc2Vjb25kPTEwMSBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9MjU1IHNlY29uZD0xMDMgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTI1NSBzZWNvbmQ9MTEzIGFtb3VudD0tMVxua2VybmluZyBmaXJzdD0yNTUgc2Vjb25kPTIzMSBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9MjU1IHNlY29uZD0yMzIgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTI1NSBzZWNvbmQ9MjMzIGFtb3VudD0tMVxua2VybmluZyBmaXJzdD0yNTUgc2Vjb25kPTIzNCBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9MjU1IHNlY29uZD0yMzUgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTI1NSBzZWNvbmQ9OTcgIGFtb3VudD0tMVxua2VybmluZyBmaXJzdD0yNTUgc2Vjb25kPTIyNCBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9MjU1IHNlY29uZD0yMjUgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTI1NSBzZWNvbmQ9MjI2IGFtb3VudD0tMVxua2VybmluZyBmaXJzdD0yNTUgc2Vjb25kPTIyNyBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9MjU1IHNlY29uZD0yMjggYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTI1NSBzZWNvbmQ9MjI5IGFtb3VudD0tMVxuYDtcbn0iLCIvKipcbiogZGF0LWd1aVZSIEphdmFzY3JpcHQgQ29udHJvbGxlciBMaWJyYXJ5IGZvciBWUlxuKiBodHRwczovL2dpdGh1Yi5jb20vZGF0YWFydHMvZGF0Lmd1aVZSXG4qXG4qIENvcHlyaWdodCAyMDE2IERhdGEgQXJ0cyBUZWFtLCBHb29nbGUgSW5jLlxuKlxuKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4qIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuKlxuKiAgICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4qXG4qIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiovXG5cbmltcG9ydCBjcmVhdGVJbnRlcmFjdGlvbiBmcm9tICcuL2ludGVyYWN0aW9uJztcblxuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZSggeyBncm91cCwgcGFuZWwgfSA9IHt9ICl7XG5cbiAgY29uc3QgaW50ZXJhY3Rpb24gPSBjcmVhdGVJbnRlcmFjdGlvbiggcGFuZWwgKTtcblxuICBpbnRlcmFjdGlvbi5ldmVudHMub24oICdvblByZXNzZWQnLCBoYW5kbGVPblByZXNzICk7XG4gIGludGVyYWN0aW9uLmV2ZW50cy5vbiggJ3RpY2snLCBoYW5kbGVUaWNrICk7XG4gIGludGVyYWN0aW9uLmV2ZW50cy5vbiggJ29uUmVsZWFzZWQnLCBoYW5kbGVPblJlbGVhc2UgKTtcblxuICBjb25zdCB0ZW1wTWF0cml4ID0gbmV3IFRIUkVFLk1hdHJpeDQoKTtcbiAgY29uc3QgdFBvc2l0aW9uID0gbmV3IFRIUkVFLlZlY3RvcjMoKTtcblxuICBsZXQgb2xkUGFyZW50O1xuICBcbiAgZnVuY3Rpb24gZ2V0VG9wTGV2ZWxGb2xkZXIoZ3JvdXApIHtcbiAgICB2YXIgZm9sZGVyID0gZ3JvdXAuZm9sZGVyO1xuICAgIHdoaWxlIChmb2xkZXIuZm9sZGVyICE9PSBmb2xkZXIpIGZvbGRlciA9IGZvbGRlci5mb2xkZXI7XG4gICAgcmV0dXJuIGZvbGRlcjtcbiAgfVxuXG4gIGZ1bmN0aW9uIGhhbmRsZVRpY2soIHsgaW5wdXQgfSA9IHt9ICl7XG4gICAgY29uc3QgZm9sZGVyID0gZ2V0VG9wTGV2ZWxGb2xkZXIoZ3JvdXApO1xuICAgIGlmKCBmb2xkZXIgPT09IHVuZGVmaW5lZCApe1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlmKCBpbnB1dC5tb3VzZSApe1xuICAgICAgaWYoIGlucHV0LnByZXNzZWQgJiYgaW5wdXQuc2VsZWN0ZWQgJiYgaW5wdXQucmF5Y2FzdC5yYXkuaW50ZXJzZWN0UGxhbmUoIGlucHV0Lm1vdXNlUGxhbmUsIGlucHV0Lm1vdXNlSW50ZXJzZWN0aW9uICkgKXtcbiAgICAgICAgaWYoIGlucHV0LmludGVyYWN0aW9uLnByZXNzID09PSBpbnRlcmFjdGlvbiApe1xuICAgICAgICAgIGZvbGRlci5wb3NpdGlvbi5jb3B5KCBpbnB1dC5tb3VzZUludGVyc2VjdGlvbi5zdWIoIGlucHV0Lm1vdXNlT2Zmc2V0ICkgKTtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGVsc2UgaWYoIGlucHV0LmludGVyc2VjdGlvbnMubGVuZ3RoID4gMCApe1xuICAgICAgICBjb25zdCBoaXRPYmplY3QgPSBpbnB1dC5pbnRlcnNlY3Rpb25zWyAwIF0ub2JqZWN0O1xuICAgICAgICBpZiggaGl0T2JqZWN0ID09PSBwYW5lbCApe1xuICAgICAgICAgIGhpdE9iamVjdC51cGRhdGVNYXRyaXhXb3JsZCgpO1xuICAgICAgICAgIHRQb3NpdGlvbi5zZXRGcm9tTWF0cml4UG9zaXRpb24oIGhpdE9iamVjdC5tYXRyaXhXb3JsZCApO1xuXG4gICAgICAgICAgaW5wdXQubW91c2VQbGFuZS5zZXRGcm9tTm9ybWFsQW5kQ29wbGFuYXJQb2ludCggaW5wdXQubW91c2VDYW1lcmEuZ2V0V29ybGREaXJlY3Rpb24oIGlucHV0Lm1vdXNlUGxhbmUubm9ybWFsICksIHRQb3NpdGlvbiApO1xuICAgICAgICAgIC8vIGNvbnNvbGUubG9nKCBpbnB1dC5tb3VzZVBsYW5lICk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cblxuXG4gIH1cblxuICBmdW5jdGlvbiBoYW5kbGVPblByZXNzKCBwICl7XG5cbiAgICBsZXQgeyBpbnB1dE9iamVjdCwgaW5wdXQgfSA9IHA7XG5cbiAgICBjb25zdCBmb2xkZXIgPSBnZXRUb3BMZXZlbEZvbGRlcihncm91cCk7XG4gICAgaWYoIGZvbGRlciA9PT0gdW5kZWZpbmVkICl7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYoIGZvbGRlci5iZWluZ01vdmVkID09PSB0cnVlICl7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYoIGlucHV0Lm1vdXNlICl7XG4gICAgICBpZiggaW5wdXQuaW50ZXJzZWN0aW9ucy5sZW5ndGggPiAwICl7XG4gICAgICAgIGlmKCBpbnB1dC5yYXljYXN0LnJheS5pbnRlcnNlY3RQbGFuZSggaW5wdXQubW91c2VQbGFuZSwgaW5wdXQubW91c2VJbnRlcnNlY3Rpb24gKSApe1xuICAgICAgICAgIGNvbnN0IGhpdE9iamVjdCA9IGlucHV0LmludGVyc2VjdGlvbnNbIDAgXS5vYmplY3Q7XG4gICAgICAgICAgaWYoIGhpdE9iamVjdCAhPT0gcGFuZWwgKXtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBpbnB1dC5zZWxlY3RlZCA9IGZvbGRlcjtcblxuICAgICAgICAgIGlucHV0LnNlbGVjdGVkLnVwZGF0ZU1hdHJpeFdvcmxkKCk7XG4gICAgICAgICAgdFBvc2l0aW9uLnNldEZyb21NYXRyaXhQb3NpdGlvbiggaW5wdXQuc2VsZWN0ZWQubWF0cml4V29ybGQgKTtcblxuICAgICAgICAgIGlucHV0Lm1vdXNlT2Zmc2V0LmNvcHkoIGlucHV0Lm1vdXNlSW50ZXJzZWN0aW9uICkuc3ViKCB0UG9zaXRpb24gKTtcbiAgICAgICAgICAvLyBjb25zb2xlLmxvZyggaW5wdXQubW91c2VPZmZzZXQgKTtcblxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgZWxzZXtcbiAgICAgIHRlbXBNYXRyaXguZ2V0SW52ZXJzZSggaW5wdXRPYmplY3QubWF0cml4V29ybGQgKTtcblxuICAgICAgZm9sZGVyLm1hdHJpeC5wcmVtdWx0aXBseSggdGVtcE1hdHJpeCApO1xuICAgICAgZm9sZGVyLm1hdHJpeC5kZWNvbXBvc2UoIGZvbGRlci5wb3NpdGlvbiwgZm9sZGVyLnF1YXRlcm5pb24sIGZvbGRlci5zY2FsZSApO1xuXG4gICAgICBvbGRQYXJlbnQgPSBmb2xkZXIucGFyZW50O1xuICAgICAgaW5wdXRPYmplY3QuYWRkKCBmb2xkZXIgKTtcbiAgICB9XG5cbiAgICBwLmxvY2tlZCA9IHRydWU7XG5cbiAgICBmb2xkZXIuYmVpbmdNb3ZlZCA9IHRydWU7XG5cbiAgICBpbnB1dC5ldmVudHMuZW1pdCggJ2dyYWJiZWQnLCBpbnB1dCApO1xuICB9XG5cbiAgZnVuY3Rpb24gaGFuZGxlT25SZWxlYXNlKCBwICl7XG5cbiAgICBsZXQgeyBpbnB1dE9iamVjdCwgaW5wdXQgfSA9IHA7XG5cbiAgICBjb25zdCBmb2xkZXIgPSBnZXRUb3BMZXZlbEZvbGRlcihncm91cCk7XG4gICAgaWYoIGZvbGRlciA9PT0gdW5kZWZpbmVkICl7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYoIGZvbGRlci5iZWluZ01vdmVkID09PSBmYWxzZSApe1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlmKCBpbnB1dC5tb3VzZSApe1xuICAgICAgaW5wdXQuc2VsZWN0ZWQgPSB1bmRlZmluZWQ7XG4gICAgfVxuICAgIGVsc2V7XG5cbiAgICAgIGlmKCBvbGRQYXJlbnQgPT09IHVuZGVmaW5lZCApe1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIGZvbGRlci5tYXRyaXgucHJlbXVsdGlwbHkoIGlucHV0T2JqZWN0Lm1hdHJpeFdvcmxkICk7XG4gICAgICBmb2xkZXIubWF0cml4LmRlY29tcG9zZSggZm9sZGVyLnBvc2l0aW9uLCBmb2xkZXIucXVhdGVybmlvbiwgZm9sZGVyLnNjYWxlICk7XG4gICAgICBvbGRQYXJlbnQuYWRkKCBmb2xkZXIgKTtcbiAgICAgIG9sZFBhcmVudCA9IHVuZGVmaW5lZDtcbiAgICB9XG5cbiAgICBmb2xkZXIuYmVpbmdNb3ZlZCA9IGZhbHNlO1xuXG4gICAgaW5wdXQuZXZlbnRzLmVtaXQoICdncmFiUmVsZWFzZWQnLCBpbnB1dCApO1xuICB9XG5cbiAgcmV0dXJuIGludGVyYWN0aW9uO1xufSIsImV4cG9ydCBjb25zdCBncmFiQmFyID0gKGZ1bmN0aW9uKCl7XG4gIGNvbnN0IGltYWdlID0gbmV3IEltYWdlKCk7XG4gIGltYWdlLnNyYyA9IGBkYXRhOmltYWdlL3BuZztiYXNlNjQsaVZCT1J3MEtHZ29BQUFBTlNVaEVVZ0FBQUVBQUFBQWdDQVlBQUFDaW5YNkVBQUFBQ1hCSVdYTUFBQzRqQUFBdUl3RjRwVDkyQUFBS1QybERRMUJRYUc5MGIzTm9iM0FnU1VORElIQnliMlpwYkdVQUFIamFuVk5uVkZQcEZqMzMzdlJDUzRpQWxFdHZVaFVJSUZKQ2k0QVVrU1lxSVFrUVNvZ2hvZGtWVWNFUlJVVUVHOGlnaUFPT2pvQ01GVkVzRElvSzJBZmtJYUtPZzZPSWlzcjc0WHVqYTlhODkrYk4vclhYUHVlczg1Mnp6d2ZBQ0F5V1NETlJOWUFNcVVJZUVlQ0R4OFRHNGVRdVFJRUtKSEFBRUFpelpDRnovU01CQVBoK1BEd3JJc0FIdmdBQmVOTUxDQURBVFp2QU1CeUgvdy9xUXBsY0FZQ0VBY0Iwa1RoTENJQVVBRUI2amtLbUFFQkdBWUNkbUNaVEFLQUVBR0RMWTJMakFGQXRBR0FuZitiVEFJQ2QrSmw3QVFCYmxDRVZBYUNSQUNBVFpZaEVBR2c3QUt6UFZvcEZBRmd3QUJSbVM4UTVBTmd0QURCSlYyWklBTEMzQU1ET0VBdXlBQWdNQURCUmlJVXBBQVI3QUdESUl5TjRBSVNaQUJSRzhsYzg4U3V1RU9jcUFBQjRtYkk4dVNRNVJZRmJDQzF4QjFkWExoNG96a2tYS3hRMllRSmhta0F1d25tWkdUS0JOQS9nODh3QUFLQ1JGUkhnZy9QOWVNNE9yczdPTm82MkRsOHQ2cjhHL3lKaVl1UCs1YytyY0VBQUFPRjBmdEgrTEMrekdvQTdCb0J0L3FJbDdnUm9YZ3VnZGZlTFpySVBRTFVBb09uYVYvTncrSDQ4UEVXaGtMbloyZVhrNU5oS3hFSmJZY3BYZmY1bndsL0FWLzFzK1g0OC9QZjE0TDdpSklFeVhZRkhCUGpnd3N6MFRLVWN6NUlKaEdMYzVvOUgvTGNMLy93ZDB5TEVTV0s1V0NvVTQxRVNjWTVFbW96ek1xVWlpVUtTS2NVbDB2OWs0dDhzK3dNKzN6VUFzR28rQVh1UkxhaGRZd1AyU3ljUVdIVEE0dmNBQVBLN2I4SFVLQWdEZ0dpRDRjOTMvKzgvL1VlZ0pRQ0Faa21TY1FBQVhrUWtMbFRLc3ovSENBQUFSS0NCS3JCQkcvVEJHQ3pBQmh6QkJkekJDL3hnTm9SQ0pNVENRaEJDQ21TQUhISmdLYXlDUWlpR3piQWRLbUF2MUVBZE5NQlJhSWFUY0E0dXdsVzREajF3RC9waENKN0JLTHlCQ1FSQnlBZ1RZU0hhaUFGaWlsZ2pqZ2dYbVlYNEljRklCQktMSkNESmlCUlJJa3VSTlVneFVvcFVJRlZJSGZJOWNnSTVoMXhHdXBFN3lBQXlndnlHdkVjeGxJR3lVVDNVRExWRHVhZzNHb1JHb2d2UVpIUXhtbzhXb0p2UWNyUWFQWXcyb2VmUXEyZ1AybzgrUThjd3dPZ1lCelBFYkRBdXhzTkNzVGdzQ1pOank3RWlyQXlyeGhxd1Zxd0R1NG4xWTgreGR3UVNnVVhBQ1RZRWQwSWdZUjVCU0ZoTVdFN1lTS2dnSENRMEVkb0pOd2tEaEZIQ0p5S1RxRXUwSnJvUitjUVlZakl4aDFoSUxDUFdFbzhUTHhCN2lFUEVOeVFTaVVNeUo3bVFBa214cEZUU0V0SkcwbTVTSStrc3FaczBTQm9qazhuYVpHdXlCem1VTENBcnlJWGtuZVRENURQa0crUWg4bHNLbldKQWNhVDRVK0lvVXNwcVNobmxFT1UwNVFabG1ESkJWYU9hVXQyb29WUVJOWTlhUXEyaHRsS3ZVWWVvRXpSMW1qbk5neFpKUzZXdG9wWFRHbWdYYVBkcHIraDB1aEhkbFI1T2w5Qlgwc3ZwUitpWDZBUDBkd3dOaGhXRHg0aG5LQm1iR0FjWVp4bDNHSytZVEtZWjA0c1p4MVF3TnpIcm1PZVpENWx2VlZncXRpcDhGWkhLQ3BWS2xTYVZHeW92VkttcXBxcmVxZ3RWODFYTFZJK3BYbE45cmtaVk0xUGpxUW5VbHF0VnFwMVE2MU1iVTJlcE82aUhxbWVvYjFRL3BINVovWWtHV2NOTXcwOURwRkdnc1YvanZNWWdDMk1aczNnc0lXc05xNFoxZ1RYRUpySE4yWHgyS3J1WS9SMjdpejJxcWFFNVF6TktNMWV6VXZPVVpqOEg0NWh4K0p4MFRnbm5LS2VYODM2SzNoVHZLZUlwRzZZMFRMa3haVnhycXBhWGxsaXJTS3RScTBmcnZUYXU3YWVkcHIxRnUxbjdnUTVCeDBvblhDZEhaNC9PQlozblU5bFQzYWNLcHhaTlBUcjFyaTZxYTZVYm9idEVkNzl1cCs2WW5yNWVnSjVNYjZmZWViM24raHg5TC8xVS9XMzZwL1ZIREZnR3N3d2tCdHNNemhnOHhUVnhiendkTDhmYjhWRkRYY05BUTZWaGxXR1g0WVNSdWRFOG85VkdqVVlQakduR1hPTWs0MjNHYmNhakpnWW1JU1pMVGVwTjdwcFNUYm1tS2FZN1REdE14ODNNemFMTjFwazFtejB4MXpMbm0rZWIxNXZmdDJCYWVGb3N0cWkydUdWSnN1UmFwbG51dHJ4dWhWbzVXYVZZVlZwZHMwYXRuYTBsMXJ1dHU2Y1JwN2xPazA2cm50Wm53N0R4dHNtMnFiY1pzT1hZQnR1dXRtMjJmV0ZuWWhkbnQ4V3V3KzZUdlpOOXVuMk4vVDBIRFlmWkRxc2RXaDErYzdSeUZEcFdPdDZhenB6dVAzM0Y5SmJwTDJkWXp4RFAyRFBqdGhQTEtjUnBuVk9iMDBkbkYyZTVjNFB6aUl1SlM0TExMcGMrTHBzYnh0M0l2ZVJLZFBWeFhlRjYwdldkbTdPYnd1Mm8yNi91TnU1cDdvZmNuOHcwbnltZVdUTnowTVBJUStCUjVkRS9DNStWTUd2ZnJINVBRMCtCWjdYbkl5OWpMNUZYcmRld3Q2VjNxdmRoN3hjKzlqNXluK00rNHp3MzNqTGVXVi9NTjhDM3lMZkxUOE52bmwrRjMwTi9JLzlrLzNyLzBRQ25nQ1VCWndPSmdVR0JXd0w3K0hwOEliK09QenJiWmZheTJlMUJqS0M1UVJWQmo0S3RndVhCclNGb3lPeVFyU0gzNTVqT2tjNXBEb1ZRZnVqVzBBZGg1bUdMdzM0TUo0V0hoVmVHUDQ1d2lGZ2EwVEdYTlhmUjNFTnozMFQ2UkpaRTNwdG5NVTg1cnkxS05TbytxaTVxUE5vM3VqUzZQOFl1WmxuTTFWaWRXRWxzU3h3NUxpcXVObTVzdnQvODdmT0g0cDNpQytON0Y1Z3Z5RjF3ZWFIT3d2U0ZweGFwTGhJc09wWkFUSWhPT0pUd1FSQXFxQmFNSmZJVGR5V09Dbm5DSGNKbklpL1JOdEdJMkVOY0toNU84a2dxVFhxUzdKRzhOWGtreFRPbExPVzVoQ2Vwa0x4TURVemRtenFlRnBwMklHMHlQVHE5TVlPU2taQnhRcW9oVFpPMlorcG41bVoyeTZ4bGhiTCt4VzZMdHk4ZWxRZkphN09RckFWWkxRcTJRcWJvVkZvbzF5b0hzbWRsVjJhL3pZbktPWmFybml2TjdjeXp5dHVRTjV6dm4vL3RFc0lTNFpLMnBZWkxWeTBkV09hOXJHbzVzanh4ZWRzSzR4VUZLNFpXQnF3OHVJcTJLbTNWVDZ2dFY1ZXVmcjBtZWsxcmdWN0J5b0xCdFFGcjZ3dFZDdVdGZmV2YzErMWRUMWd2V2QrMVlmcUduUnMrRlltS3JoVGJGNWNWZjlnbzNIamxHNGR2eXIrWjNKUzBxYXZFdVdUUFp0Sm02ZWJlTFo1YkRwYXFsK2FYRG00TjJkcTBEZDlXdE8zMTlrWGJMNWZOS051N2c3WkR1YU8vUExpOFphZkp6czA3UDFTa1ZQUlUrbFEyN3RMZHRXSFgrRzdSN2h0N3ZQWTA3TlhiVzd6My9UN0p2dHRWQVZWTjFXYlZaZnRKKzdQM1A2NkpxdW40bHZ0dFhhMU9iWEh0eHdQU0EvMEhJdzYyMTduVTFSM1NQVlJTajlZcjYwY094eCsrL3AzdmR5ME5OZzFWalp6RzRpTndSSG5rNmZjSjMvY2VEVHJhZG94N3JPRUgweDkySFdjZEwycENtdkthUnB0VG12dGJZbHU2VDh3KzBkYnEzbnI4UjlzZkQ1dzBQRmw1U3ZOVXlXbmE2WUxUazJmeXo0eWRsWjE5Zmk3NTNHRGJvclo3NTJQTzMyb1BiKys2RUhUaDBrWC9pK2M3dkR2T1hQSzRkUEt5MitVVFY3aFhtcTg2WDIzcWRPbzgvcFBUVDhlN25MdWFycmxjYTdudWVyMjFlMmIzNlJ1ZU44N2Q5TDE1OFJiLzF0V2VPVDNkdmZONmIvZkY5L1hmRnQxK2NpZjl6c3U3MlhjbjdxMjhUN3hmOUVEdFFkbEQzWWZWUDF2KzNOanYzSDlxd0hlZzg5SGNSL2NHaFlQUC9wSDFqdzlEQlkrWmo4dUdEWWJybmpnK09UbmlQM0w5NmZ5blE4OWt6eWFlRi82aS9zdXVGeFl2ZnZqVjY5Zk8wWmpSb1pmeWw1Ty9iWHlsL2VyQTZ4bXYyOGJDeGg2K3lYZ3pNVjcwVnZ2dHdYZmNkeDN2bzk4UFQrUjhJSDhvLzJqNXNmVlQwS2Y3a3htVGsvOEVBNWp6L0dNekxkc0FBRHNrYVZSWWRGaE5URHBqYjIwdVlXUnZZbVV1ZUcxd0FBQUFBQUE4UDNod1lXTnJaWFFnWW1WbmFXNDlJdSs3dnlJZ2FXUTlJbGMxVFRCTmNFTmxhR2xJZW5KbFUzcE9WR042YTJNNVpDSS9QZ284ZURwNGJYQnRaWFJoSUhodGJHNXpPbmc5SW1Ga2IySmxPbTV6T20xbGRHRXZJaUI0T25odGNIUnJQU0pCWkc5aVpTQllUVkFnUTI5eVpTQTFMall0WXpFek1pQTNPUzR4TlRreU9EUXNJREl3TVRZdk1EUXZNVGt0TVRNNk1UTTZOREFnSUNBZ0lDQWdJQ0krQ2lBZ0lEeHlaR1k2VWtSR0lIaHRiRzV6T25Ka1pqMGlhSFIwY0RvdkwzZDNkeTUzTXk1dmNtY3ZNVGs1T1M4d01pOHlNaTF5WkdZdGMzbHVkR0Y0TFc1ekl5SStDaUFnSUNBZ0lEeHlaR1k2UkdWelkzSnBjSFJwYjI0Z2NtUm1PbUZpYjNWMFBTSWlDaUFnSUNBZ0lDQWdJQ0FnSUhodGJHNXpPbmh0Y0QwaWFIUjBjRG92TDI1ekxtRmtiMkpsTG1OdmJTOTRZWEF2TVM0d0x5SUtJQ0FnSUNBZ0lDQWdJQ0FnZUcxc2JuTTZaR005SW1oMGRIQTZMeTl3ZFhKc0xtOXlaeTlrWXk5bGJHVnRaVzUwY3k4eExqRXZJZ29nSUNBZ0lDQWdJQ0FnSUNCNGJXeHVjenB3YUc5MGIzTm9iM0E5SW1oMGRIQTZMeTl1Y3k1aFpHOWlaUzVqYjIwdmNHaHZkRzl6YUc5d0x6RXVNQzhpQ2lBZ0lDQWdJQ0FnSUNBZ0lIaHRiRzV6T25odGNFMU5QU0pvZEhSd09pOHZibk11WVdSdlltVXVZMjl0TDNoaGNDOHhMakF2Ylcwdklnb2dJQ0FnSUNBZ0lDQWdJQ0I0Yld4dWN6cHpkRVYyZEQwaWFIUjBjRG92TDI1ekxtRmtiMkpsTG1OdmJTOTRZWEF2TVM0d0wzTlVlWEJsTDFKbGMyOTFjbU5sUlhabGJuUWpJZ29nSUNBZ0lDQWdJQ0FnSUNCNGJXeHVjenAwYVdabVBTSm9kSFJ3T2k4dmJuTXVZV1J2WW1VdVkyOXRMM1JwWm1Zdk1TNHdMeUlLSUNBZ0lDQWdJQ0FnSUNBZ2VHMXNibk02WlhocFpqMGlhSFIwY0RvdkwyNXpMbUZrYjJKbExtTnZiUzlsZUdsbUx6RXVNQzhpUGdvZ0lDQWdJQ0FnSUNBOGVHMXdPa055WldGMGIzSlViMjlzUGtGa2IySmxJRkJvYjNSdmMyaHZjQ0JEUXlBeU1ERTFMalVnS0ZkcGJtUnZkM01wUEM5NGJYQTZRM0psWVhSdmNsUnZiMncrQ2lBZ0lDQWdJQ0FnSUR4NGJYQTZRM0psWVhSbFJHRjBaVDR5TURFMkxUQTVMVEk0VkRFMk9qSTFPak15TFRBM09qQXdQQzk0YlhBNlEzSmxZWFJsUkdGMFpUNEtJQ0FnSUNBZ0lDQWdQSGh0Y0RwTmIyUnBabmxFWVhSbFBqSXdNVFl0TURrdE1qaFVNVFk2TXpjNk1qTXRNRGM2TURBOEwzaHRjRHBOYjJScFpubEVZWFJsUGdvZ0lDQWdJQ0FnSUNBOGVHMXdPazFsZEdGa1lYUmhSR0YwWlQ0eU1ERTJMVEE1TFRJNFZERTJPak0zT2pJekxUQTNPakF3UEM5NGJYQTZUV1YwWVdSaGRHRkVZWFJsUGdvZ0lDQWdJQ0FnSUNBOFpHTTZabTl5YldGMFBtbHRZV2RsTDNCdVp6d3ZaR002Wm05eWJXRjBQZ29nSUNBZ0lDQWdJQ0E4Y0dodmRHOXphRzl3T2tOdmJHOXlUVzlrWlQ0elBDOXdhRzkwYjNOb2IzQTZRMjlzYjNKTmIyUmxQZ29nSUNBZ0lDQWdJQ0E4Y0dodmRHOXphRzl3T2tsRFExQnliMlpwYkdVK2MxSkhRaUJKUlVNMk1UazJOaTB5TGpFOEwzQm9iM1J2YzJodmNEcEpRME5RY205bWFXeGxQZ29nSUNBZ0lDQWdJQ0E4ZUcxd1RVMDZTVzV6ZEdGdVkyVkpSRDU0YlhBdWFXbGtPbUZoWVRGak1UUXpMVFV3Wm1VdE9UUTBNeTFoTlRobUxXRXlNMlZrTlRNM01EZG1NRHd2ZUcxd1RVMDZTVzV6ZEdGdVkyVkpSRDRLSUNBZ0lDQWdJQ0FnUEhodGNFMU5Pa1J2WTNWdFpXNTBTVVErWVdSdlltVTZaRzlqYVdRNmNHaHZkRzl6YUc5d09qZGxOemRtWW1aakxUZzFaRFF0TVRGbE5pMWhZemhtTFdGak56VTBaV1ExT0RNM1pqd3ZlRzF3VFUwNlJHOWpkVzFsYm5SSlJENEtJQ0FnSUNBZ0lDQWdQSGh0Y0UxTk9rOXlhV2RwYm1Gc1JHOWpkVzFsYm5SSlJENTRiWEF1Wkdsa09tTTFabU0wWkdZeUxUa3hZMk10WlRJME1TMDRZMlZqTFRNek9ESXlZMlExWldGbE9Ud3ZlRzF3VFUwNlQzSnBaMmx1WVd4RWIyTjFiV1Z1ZEVsRVBnb2dJQ0FnSUNBZ0lDQThlRzF3VFUwNlNHbHpkRzl5ZVQ0S0lDQWdJQ0FnSUNBZ0lDQWdQSEprWmpwVFpYRStDaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lEeHlaR1k2YkdrZ2NtUm1PbkJoY25ObFZIbHdaVDBpVW1WemIzVnlZMlVpUGdvZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBOGMzUkZkblE2WVdOMGFXOXVQbU55WldGMFpXUThMM04wUlhaME9tRmpkR2x2Ymo0S0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ1BITjBSWFowT21sdWMzUmhibU5sU1VRK2VHMXdMbWxwWkRwak5XWmpOR1JtTWkwNU1XTmpMV1V5TkRFdE9HTmxZeTB6TXpneU1tTmtOV1ZoWlRrOEwzTjBSWFowT21sdWMzUmhibU5sU1VRK0NpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lEeHpkRVYyZERwM2FHVnVQakl3TVRZdE1Ea3RNamhVTVRZNk1qVTZNekl0TURjNk1EQThMM04wUlhaME9uZG9aVzQrQ2lBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUR4emRFVjJkRHB6YjJaMGQyRnlaVUZuWlc1MFBrRmtiMkpsSUZCb2IzUnZjMmh2Y0NCRFF5QXlNREUxTGpVZ0tGZHBibVJ2ZDNNcFBDOXpkRVYyZERwemIyWjBkMkZ5WlVGblpXNTBQZ29nSUNBZ0lDQWdJQ0FnSUNBZ0lDQThMM0prWmpwc2FUNEtJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ1BISmtaanBzYVNCeVpHWTZjR0Z5YzJWVWVYQmxQU0pTWlhOdmRYSmpaU0krQ2lBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUR4emRFVjJkRHBoWTNScGIyNCtZMjl1ZG1WeWRHVmtQQzl6ZEVWMmREcGhZM1JwYjI0K0NpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lEeHpkRVYyZERwd1lYSmhiV1YwWlhKelBtWnliMjBnWVhCd2JHbGpZWFJwYjI0dmRtNWtMbUZrYjJKbExuQm9iM1J2YzJodmNDQjBieUJwYldGblpTOXdibWM4TDNOMFJYWjBPbkJoY21GdFpYUmxjbk0rQ2lBZ0lDQWdJQ0FnSUNBZ0lDQWdJRHd2Y21SbU9teHBQZ29nSUNBZ0lDQWdJQ0FnSUNBZ0lDQThjbVJtT214cElISmtaanB3WVhKelpWUjVjR1U5SWxKbGMyOTFjbU5sSWo0S0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ1BITjBSWFowT21GamRHbHZiajV6WVhabFpEd3ZjM1JGZG5RNllXTjBhVzl1UGdvZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBOGMzUkZkblE2YVc1emRHRnVZMlZKUkQ1NGJYQXVhV2xrT21GaFlURmpNVFF6TFRVd1ptVXRPVFEwTXkxaE5UaG1MV0V5TTJWa05UTTNNRGRtTUR3dmMzUkZkblE2YVc1emRHRnVZMlZKUkQ0S0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ1BITjBSWFowT25kb1pXNCtNakF4Tmkwd09TMHlPRlF4Tmpvek56b3lNeTB3Tnpvd01Ed3ZjM1JGZG5RNmQyaGxiajRLSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnUEhOMFJYWjBPbk52Wm5SM1lYSmxRV2RsYm5RK1FXUnZZbVVnVUdodmRHOXphRzl3SUVORElESXdNVFV1TlNBb1YybHVaRzkzY3lrOEwzTjBSWFowT25OdlpuUjNZWEpsUVdkbGJuUStDaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJRHh6ZEVWMmREcGphR0Z1WjJWa1BpODhMM04wUlhaME9tTm9ZVzVuWldRK0NpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUR3dmNtUm1PbXhwUGdvZ0lDQWdJQ0FnSUNBZ0lDQThMM0prWmpwVFpYRStDaUFnSUNBZ0lDQWdJRHd2ZUcxd1RVMDZTR2x6ZEc5eWVUNEtJQ0FnSUNBZ0lDQWdQSFJwWm1ZNlQzSnBaVzUwWVhScGIyNCtNVHd2ZEdsbVpqcFBjbWxsYm5SaGRHbHZiajRLSUNBZ0lDQWdJQ0FnUEhScFptWTZXRkpsYzI5c2RYUnBiMjQrTXpBd01EQXdNQzh4TURBd01Ed3ZkR2xtWmpwWVVtVnpiMngxZEdsdmJqNEtJQ0FnSUNBZ0lDQWdQSFJwWm1ZNldWSmxjMjlzZFhScGIyNCtNekF3TURBd01DOHhNREF3TUR3dmRHbG1aanBaVW1WemIyeDFkR2x2Ymo0S0lDQWdJQ0FnSUNBZ1BIUnBabVk2VW1WemIyeDFkR2x2YmxWdWFYUStNand2ZEdsbVpqcFNaWE52YkhWMGFXOXVWVzVwZEQ0S0lDQWdJQ0FnSUNBZ1BHVjRhV1k2UTI5c2IzSlRjR0ZqWlQ0eFBDOWxlR2xtT2tOdmJHOXlVM0JoWTJVK0NpQWdJQ0FnSUNBZ0lEeGxlR2xtT2xCcGVHVnNXRVJwYldWdWMybHZiajQyTkR3dlpYaHBaanBRYVhobGJGaEVhVzFsYm5OcGIyNCtDaUFnSUNBZ0lDQWdJRHhsZUdsbU9sQnBlR1ZzV1VScGJXVnVjMmx2Ymo0ek1qd3ZaWGhwWmpwUWFYaGxiRmxFYVcxbGJuTnBiMjQrQ2lBZ0lDQWdJRHd2Y21SbU9rUmxjMk55YVhCMGFXOXVQZ29nSUNBOEwzSmtaanBTUkVZK0Nqd3ZlRHA0YlhCdFpYUmhQZ29nSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnQ2lBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBS0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lBb2dJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdDaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FLSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUFvZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0NpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQUtJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQW9nSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnQ2lBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBS0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lBb2dJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdDaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FLSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUFvZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0NpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQUtJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQW9nSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnQ2lBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBS0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lBb2dJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdDaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FLSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUFvZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0NpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQUtJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQW9nSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnQ2lBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBS0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lBb2dJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdDaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FLSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUFvZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0NpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQUtJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQW9nSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnQ2lBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBS0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lBb2dJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdDaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FLSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUFvZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0NpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQUtJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQW9nSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnQ2lBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBS0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lBb2dJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdDaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FLSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUFvZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0NpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQUtJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQW9nSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnQ2lBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBS0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lBb2dJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdDaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FLSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUFvZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0NpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQUtJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQW9nSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnQ2lBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBS0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lBb2dJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdDaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FLSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUFvZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0NpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQUtJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQW9nSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnQ2lBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBS0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lBb2dJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdDaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FLSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUFvZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0NpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQUtJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQW9nSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnQ2lBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBS0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lBb2dJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdDaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FLSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUFvZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0NpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQUtJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQW9nSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnQ2lBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBS0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lBb2dJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdDaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FLSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUFvZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0NpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQUtJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQW9nSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnQ2lBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBS0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lBb2dJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdDaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FLSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUFvZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0NpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQUtJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQW9nSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnQ2lBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBS0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lBb2dJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdDaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FLSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUFvZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0NpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQUtJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQW9nSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnQ2lBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBS0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lBbzhQM2h3WVdOclpYUWdaVzVrUFNKM0lqOCtPaEY3UndBQUFDQmpTRkpOQUFCNkpRQUFnSU1BQVBuL0FBQ0E2UUFBZFRBQUFPcGdBQUE2bUFBQUYyK1NYOFZHQUFBQWxFbEVRVlI0MnV6WnNRM0FJQXhFVVR1VFpKUnNrdDVMUkZtQ2RUTGFwVUtDQmlqby9GMGhuMlNrSnhJS1hKSmxyc09TRndBQUFBQkE2dktJNk83QlVvclhkWnUxL1ZFV0VaZVpmYk41bS9aYW1qZksrQVFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQ0JmdWFTbmE3aS9kZDFtYlgrVVNUck43SjdOMjdUWDByeFJ4Z25nWllpZklBQUFBSkM0ZmdBQUFQLy9Bd0F1TVZQdzIwaHhDd0FBQUFCSlJVNUVya0pnZ2c9PWA7XG5cbiAgY29uc3QgdGV4dHVyZSA9IG5ldyBUSFJFRS5UZXh0dXJlKCk7XG4gIHRleHR1cmUuaW1hZ2UgPSBpbWFnZTtcbiAgdGV4dHVyZS5uZWVkc1VwZGF0ZSA9IHRydWU7XG4gIC8vIHRleHR1cmUubWluRmlsdGVyID0gVEhSRUUuTGluZWFyTWlwTWFwTGluZWFyRmlsdGVyO1xuICAvLyB0ZXh0dXJlLm1hZ0ZpbHRlciA9IFRIUkVFLkxpbmVhckZpbHRlcjtcbiAgLy8gdGV4dHVyZS5nZW5lcmF0ZU1pcG1hcHMgPSBmYWxzZTtcblxuICBjb25zdCBtYXRlcmlhbCA9IG5ldyBUSFJFRS5NZXNoQmFzaWNNYXRlcmlhbCh7XG4gICAgLy8gY29sb3I6IDB4ZmYwMDAwLFxuICAgIHNpZGU6IFRIUkVFLkRvdWJsZVNpZGUsXG4gICAgdHJhbnNwYXJlbnQ6IHRydWUsXG4gICAgbWFwOiB0ZXh0dXJlXG4gIH0pO1xuICBtYXRlcmlhbC5hbHBoYVRlc3QgPSAwLjU7XG5cbiAgcmV0dXJuIGZ1bmN0aW9uKCl7XG4gICAgY29uc3QgZ2VvbWV0cnkgPSBuZXcgVEhSRUUuUGxhbmVHZW9tZXRyeSggaW1hZ2Uud2lkdGggLyAxMDAwLCBpbWFnZS5oZWlnaHQgLyAxMDAwLCAxLCAxICk7XG5cbiAgICBjb25zdCBtZXNoID0gbmV3IFRIUkVFLk1lc2goIGdlb21ldHJ5LCBtYXRlcmlhbCApO1xuICAgIHJldHVybiBtZXNoO1xuICB9XG5cbn0oKSk7XG5cbmV4cG9ydCBjb25zdCBkb3duQXJyb3cgPSAoZnVuY3Rpb24oKXtcbiAgY29uc3QgaW1hZ2UgPSBuZXcgSW1hZ2UoKTtcbiAgaW1hZ2Uuc3JjID0gJ2RhdGE6aW1hZ2UvcG5nO2Jhc2U2NCxpVkJPUncwS0dnb0FBQUFOU1VoRVVnQUFBSUFBQUFCQUNBWUFBQURTMW45L0FBQUFDWEJJV1hNQUFDeExBQUFzU3dHbFBaYXBBQUE0SzJsVVdIUllUVXc2WTI5dExtRmtiMkpsTG5odGNBQUFBQUFBUEQ5NGNHRmphMlYwSUdKbFoybHVQU0x2dTc4aUlHbGtQU0pYTlUwd1RYQkRaV2hwU0hweVpWTjZUbFJqZW10ak9XUWlQejRLUEhnNmVHMXdiV1YwWVNCNGJXeHVjenA0UFNKaFpHOWlaVHB1Y3pwdFpYUmhMeUlnZURwNGJYQjBhejBpUVdSdlltVWdXRTFRSUVOdmNtVWdOUzQyTFdNeE16SWdOemt1TVRVNU1qZzBMQ0F5TURFMkx6QTBMekU1TFRFek9qRXpPalF3SUNBZ0lDQWdJQ0FpUGdvZ0lDQThjbVJtT2xKRVJpQjRiV3h1Y3pweVpHWTlJbWgwZEhBNkx5OTNkM2N1ZHpNdWIzSm5MekU1T1Rrdk1ESXZNakl0Y21SbUxYTjViblJoZUMxdWN5TWlQZ29nSUNBZ0lDQThjbVJtT2tSbGMyTnlhWEIwYVc5dUlISmtaanBoWW05MWREMGlJZ29nSUNBZ0lDQWdJQ0FnSUNCNGJXeHVjenA0YlhBOUltaDBkSEE2THk5dWN5NWhaRzlpWlM1amIyMHZlR0Z3THpFdU1DOGlDaUFnSUNBZ0lDQWdJQ0FnSUhodGJHNXpPbVJqUFNKb2RIUndPaTh2Y0hWeWJDNXZjbWN2WkdNdlpXeGxiV1Z1ZEhNdk1TNHhMeUlLSUNBZ0lDQWdJQ0FnSUNBZ2VHMXNibk02Y0dodmRHOXphRzl3UFNKb2RIUndPaTh2Ym5NdVlXUnZZbVV1WTI5dEwzQm9iM1J2YzJodmNDOHhMakF2SWdvZ0lDQWdJQ0FnSUNBZ0lDQjRiV3h1Y3pwNGJYQk5UVDBpYUhSMGNEb3ZMMjV6TG1Ga2IySmxMbU52YlM5NFlYQXZNUzR3TDIxdEx5SUtJQ0FnSUNBZ0lDQWdJQ0FnZUcxc2JuTTZjM1JGZG5ROUltaDBkSEE2THk5dWN5NWhaRzlpWlM1amIyMHZlR0Z3THpFdU1DOXpWSGx3WlM5U1pYTnZkWEpqWlVWMlpXNTBJeUlLSUNBZ0lDQWdJQ0FnSUNBZ2VHMXNibk02ZEdsbVpqMGlhSFIwY0RvdkwyNXpMbUZrYjJKbExtTnZiUzkwYVdabUx6RXVNQzhpQ2lBZ0lDQWdJQ0FnSUNBZ0lIaHRiRzV6T21WNGFXWTlJbWgwZEhBNkx5OXVjeTVoWkc5aVpTNWpiMjB2WlhocFppOHhMakF2SWo0S0lDQWdJQ0FnSUNBZ1BIaHRjRHBEY21WaGRHOXlWRzl2YkQ1QlpHOWlaU0JRYUc5MGIzTm9iM0FnUTBNZ01qQXhOUzQxSUNoWGFXNWtiM2R6S1R3dmVHMXdPa055WldGMGIzSlViMjlzUGdvZ0lDQWdJQ0FnSUNBOGVHMXdPa055WldGMFpVUmhkR1UrTWpBeE5pMHhNQzB4T0ZReE56b3pNem93Tmkwd056b3dNRHd2ZUcxd09rTnlaV0YwWlVSaGRHVStDaUFnSUNBZ0lDQWdJRHg0YlhBNlRXOWthV1o1UkdGMFpUNHlNREUyTFRFd0xUSXdWREl4T2pFNE9qSTFMVEEzT2pBd1BDOTRiWEE2VFc5a2FXWjVSR0YwWlQ0S0lDQWdJQ0FnSUNBZ1BIaHRjRHBOWlhSaFpHRjBZVVJoZEdVK01qQXhOaTB4TUMweU1GUXlNVG94T0RveU5TMHdOem93TUR3dmVHMXdPazFsZEdGa1lYUmhSR0YwWlQ0S0lDQWdJQ0FnSUNBZ1BHUmpPbVp2Y20xaGRENXBiV0ZuWlM5d2JtYzhMMlJqT21admNtMWhkRDRLSUNBZ0lDQWdJQ0FnUEhCb2IzUnZjMmh2Y0RwRGIyeHZjazF2WkdVK016d3ZjR2h2ZEc5emFHOXdPa052Ykc5eVRXOWtaVDRLSUNBZ0lDQWdJQ0FnUEhodGNFMU5Pa2x1YzNSaGJtTmxTVVErZUcxd0xtbHBaRG96TURReVlqSTBaUzFpTXpjMkxXSTBOR0l0T0dJNFl5MWxaVEZqWTJJellXVTFNRFU4TDNodGNFMU5Pa2x1YzNSaGJtTmxTVVErQ2lBZ0lDQWdJQ0FnSUR4NGJYQk5UVHBFYjJOMWJXVnVkRWxFUG5odGNDNWthV1E2TXpBME1tSXlOR1V0WWpNM05pMWlORFJpTFRoaU9HTXRaV1V4WTJOaU0yRmxOVEExUEM5NGJYQk5UVHBFYjJOMWJXVnVkRWxFUGdvZ0lDQWdJQ0FnSUNBOGVHMXdUVTA2VDNKcFoybHVZV3hFYjJOMWJXVnVkRWxFUG5odGNDNWthV1E2TXpBME1tSXlOR1V0WWpNM05pMWlORFJpTFRoaU9HTXRaV1V4WTJOaU0yRmxOVEExUEM5NGJYQk5UVHBQY21sbmFXNWhiRVJ2WTNWdFpXNTBTVVErQ2lBZ0lDQWdJQ0FnSUR4NGJYQk5UVHBJYVhOMGIzSjVQZ29nSUNBZ0lDQWdJQ0FnSUNBOGNtUm1PbE5sY1Q0S0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnUEhKa1pqcHNhU0J5WkdZNmNHRnljMlZVZVhCbFBTSlNaWE52ZFhKalpTSStDaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJRHh6ZEVWMmREcGhZM1JwYjI0K1kzSmxZWFJsWkR3dmMzUkZkblE2WVdOMGFXOXVQZ29nSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0E4YzNSRmRuUTZhVzV6ZEdGdVkyVkpSRDU0YlhBdWFXbGtPak13TkRKaU1qUmxMV0l6TnpZdFlqUTBZaTA0WWpoakxXVmxNV05qWWpOaFpUVXdOVHd2YzNSRmRuUTZhVzV6ZEdGdVkyVkpSRDRLSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnUEhOMFJYWjBPbmRvWlc0K01qQXhOaTB4TUMweE9GUXhOem96TXpvd05pMHdOem93TUR3dmMzUkZkblE2ZDJobGJqNEtJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdQSE4wUlhaME9uTnZablIzWVhKbFFXZGxiblErUVdSdlltVWdVR2h2ZEc5emFHOXdJRU5ESURJd01UVXVOU0FvVjJsdVpHOTNjeWs4TDNOMFJYWjBPbk52Wm5SM1lYSmxRV2RsYm5RK0NpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUR3dmNtUm1PbXhwUGdvZ0lDQWdJQ0FnSUNBZ0lDQThMM0prWmpwVFpYRStDaUFnSUNBZ0lDQWdJRHd2ZUcxd1RVMDZTR2x6ZEc5eWVUNEtJQ0FnSUNBZ0lDQWdQSFJwWm1ZNlQzSnBaVzUwWVhScGIyNCtNVHd2ZEdsbVpqcFBjbWxsYm5SaGRHbHZiajRLSUNBZ0lDQWdJQ0FnUEhScFptWTZXRkpsYzI5c2RYUnBiMjQrTWpnNE1EQXdNQzh4TURBd01Ed3ZkR2xtWmpwWVVtVnpiMngxZEdsdmJqNEtJQ0FnSUNBZ0lDQWdQSFJwWm1ZNldWSmxjMjlzZFhScGIyNCtNamc0TURBd01DOHhNREF3TUR3dmRHbG1aanBaVW1WemIyeDFkR2x2Ymo0S0lDQWdJQ0FnSUNBZ1BIUnBabVk2VW1WemIyeDFkR2x2YmxWdWFYUStNand2ZEdsbVpqcFNaWE52YkhWMGFXOXVWVzVwZEQ0S0lDQWdJQ0FnSUNBZ1BHVjRhV1k2UTI5c2IzSlRjR0ZqWlQ0Mk5UVXpOVHd2WlhocFpqcERiMnh2Y2xOd1lXTmxQZ29nSUNBZ0lDQWdJQ0E4WlhocFpqcFFhWGhsYkZoRWFXMWxibk5wYjI0K01USTRQQzlsZUdsbU9sQnBlR1ZzV0VScGJXVnVjMmx2Ymo0S0lDQWdJQ0FnSUNBZ1BHVjRhV1k2VUdsNFpXeFpSR2x0Wlc1emFXOXVQalkwUEM5bGVHbG1PbEJwZUdWc1dVUnBiV1Z1YzJsdmJqNEtJQ0FnSUNBZ1BDOXlaR1k2UkdWelkzSnBjSFJwYjI0K0NpQWdJRHd2Y21SbU9sSkVSajRLUEM5NE9uaHRjRzFsZEdFK0NpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQUtJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQW9nSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnQ2lBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBS0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lBb2dJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdDaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FLSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUFvZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0NpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQUtJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQW9nSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnQ2lBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBS0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lBb2dJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdDaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FLSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUFvZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0NpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQUtJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQW9nSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnQ2lBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBS0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lBb2dJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdDaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FLSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUFvZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0NpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQUtJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQW9nSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnQ2lBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBS0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lBb2dJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdDaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FLSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUFvZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0NpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQUtJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQW9nSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnQ2lBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBS0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lBb2dJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdDaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FLSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUFvZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0NpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQUtJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQW9nSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnQ2lBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBS0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lBb2dJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdDaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FLSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUFvZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0NpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQUtJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQW9nSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnQ2lBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBS0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lBb2dJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdDaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FLSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUFvZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0NpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQUtJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQW9nSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnQ2lBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBS0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lBb2dJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdDaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FLSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUFvZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0NpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQUtJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQW9nSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnQ2lBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBS0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lBb2dJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdDaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FLSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUFvZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0NpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQUtJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQW9nSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnQ2lBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBS0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lBb2dJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdDaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FLSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUFvZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0NpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQUtJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQW9nSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnQ2lBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBS0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lBb2dJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdDaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FLSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUFvZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0NpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQUtJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQW9nSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnQ2lBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBS0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lBb2dJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdDaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FLSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUFvZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0NpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQUtJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQW9nSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnQ2lBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBS0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lBb2dJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdDaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FLSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUFvZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0NpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQUtJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQW9nSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnQ2p3L2VIQmhZMnRsZENCbGJtUTlJbmNpUHo1VWlsejBBQUFBSUdOSVVrMEFBSG9sQUFDQWd3QUErZjhBQUlEcEFBQjFNQUFBNm1BQUFEcVlBQUFYYjVKZnhVWUFBQUpkU1VSQlZIamE3TjNMY2NKQUVJVGhSdVc3bmNVZVRRaGtRQWlJRE1nSWhVSUljRlFXSmdKODhGS2xvdndBck4yZDZaNDVjWkdBL1Q5dmlZZnR4ZVZ5UVl6dWRMRUVBU0FtQU1RRWdCakplV2wxeHltbE53QUhBTWR4SEh2RnhVOHBEUUNXQUZiak9IN0k3QUNUK084QU5ua2hGT052OGhvYzhwcndBN2lKZngwcEJKUDQxMm1Hb0RNUVh3ckJOL0diSXVpTXhKZEE4RXY4WmdnNlEvR3BFZHdSdndtQ3psaDhTZ1FQeEsrT29NWU9NRHdZbndyQkUvR25DQWJYQVBLVFgvL2pGSnVVVXU4NGZ2OWsvT3VzUy84UWRBYmwzODdlSTRMOG1QY3puS3JvVGxoeUIxak9lQzVYQ0dhTVgySXRxd0ZZQVRpcElTZ1EvNVRYMGhlQS9ONjJGSUpTOFV0K1RsRDBJbEFKZ2NmNFZWNEdLaUR3R3IvVyt3RFVDRHpIcndhQUZZSDMrRlVCc0NGZ2lGOGRBQXNDbHZoTkFIaEh3QlMvR1FDdkNOamlOd1hnRFFGai9PWUF2Q0Jnalc4Q2dIVUV6UEhOQUxDS2dEMitLUURXRUNqRU53ZkFDZ0tWK0NZQlRCRDBBTTYxRVJTSWZ3YlFXNHh2RmtCR2NNdzdRVFVFaGVLdjhuTkJBRENNUURHK2VRQzFFS2pHQjRDRmw3OFJsRkphNHVzWFRGN25qSlJ2ejM1ZUQvRmRBU2lJQUtyeDNRRW9oQUNxOFYxY0ExUzZKcENNN3hLQVFRUnU0N3NGWUFpQjYvaXVBUmhBNEQ2K2V3QU5FVkRFcHdEUUFBRk5mQm9BRlJGUXhhY0NVQUVCWFh3NkFBVVJVTWFuQkZBQUFXMThXZ0F6SXFDT1R3MWdCZ1QwOGVrQlRCRHNuamgweHg1ZkFrQkdNQURZUG5ESU5oK0RBS0NIUUNhK0ZJQTdFVWpGbHdQd0J3SzUrSklBZmtBZ0dSOXcrSld3T2VmNnpXRFYrUElBWXVMZnhnV0FXSUlBRUJNQVlnSkFqT1I4RGdEKzZPemd2NHV5OWdBQUFBQkpSVTVFcmtKZ2dnPT0nO1xuXG4gIGNvbnN0IHRleHR1cmUgPSBuZXcgVEhSRUUuVGV4dHVyZSgpO1xuICB0ZXh0dXJlLmltYWdlID0gaW1hZ2U7XG4gIHRleHR1cmUubmVlZHNVcGRhdGUgPSB0cnVlO1xuICB0ZXh0dXJlLm1pbkZpbHRlciA9IFRIUkVFLkxpbmVhck1pcE1hcExpbmVhckZpbHRlcjtcbiAgdGV4dHVyZS5tYWdGaWx0ZXIgPSBUSFJFRS5MaW5lYXJGaWx0ZXI7XG4gIC8vIHRleHR1cmUuYW5pc290cm9waWNcbiAgLy8gdGV4dHVyZS5nZW5lcmF0ZU1pcG1hcHMgPSBmYWxzZTtcblxuICBjb25zdCBtYXRlcmlhbCA9IG5ldyBUSFJFRS5NZXNoQmFzaWNNYXRlcmlhbCh7XG4gICAgLy8gY29sb3I6IDB4ZmYwMDAwLFxuICAgIHNpZGU6IFRIUkVFLkRvdWJsZVNpZGUsXG4gICAgdHJhbnNwYXJlbnQ6IHRydWUsXG4gICAgbWFwOiB0ZXh0dXJlXG4gIH0pO1xuICBtYXRlcmlhbC5hbHBoYVRlc3QgPSAwLjI7XG5cbiAgcmV0dXJuIGZ1bmN0aW9uKCl7XG4gICAgY29uc3QgaCA9IDAuMztcbiAgICBjb25zdCBnZW8gPSBuZXcgVEhSRUUuUGxhbmVHZW9tZXRyeSggaW1hZ2Uud2lkdGggLyAxMDAwICogaCwgaW1hZ2UuaGVpZ2h0IC8gMTAwMCAqIGgsIDEsIDEgKTtcbiAgICBnZW8udHJhbnNsYXRlKCAtMC4wMDUsIC0wLjAwNCwgMCApO1xuICAgIHJldHVybiBuZXcgVEhSRUUuTWVzaCggZ2VvLCBtYXRlcmlhbCApO1xuICB9XG59KCkpO1xuXG5cbmV4cG9ydCBjb25zdCBjaGVja21hcmsgPSAoZnVuY3Rpb24oKXtcbiAgY29uc3QgaW1hZ2UgPSBuZXcgSW1hZ2UoKTtcbiAgaW1hZ2Uuc3JjID0gJ2RhdGE6aW1hZ2UvcG5nO2Jhc2U2NCxpVkJPUncwS0dnb0FBQUFOU1VoRVVnQUFBSUFBQUFCQUNBWUFBQURTMW45L0FBQUFDWEJJV1hNQUFDeExBQUFzU3dHbFBaYXBBQUE0SzJsVVdIUllUVXc2WTI5dExtRmtiMkpsTG5odGNBQUFBQUFBUEQ5NGNHRmphMlYwSUdKbFoybHVQU0x2dTc4aUlHbGtQU0pYTlUwd1RYQkRaV2hwU0hweVpWTjZUbFJqZW10ak9XUWlQejRLUEhnNmVHMXdiV1YwWVNCNGJXeHVjenA0UFNKaFpHOWlaVHB1Y3pwdFpYUmhMeUlnZURwNGJYQjBhejBpUVdSdlltVWdXRTFRSUVOdmNtVWdOUzQyTFdNeE16SWdOemt1TVRVNU1qZzBMQ0F5TURFMkx6QTBMekU1TFRFek9qRXpPalF3SUNBZ0lDQWdJQ0FpUGdvZ0lDQThjbVJtT2xKRVJpQjRiV3h1Y3pweVpHWTlJbWgwZEhBNkx5OTNkM2N1ZHpNdWIzSm5MekU1T1Rrdk1ESXZNakl0Y21SbUxYTjViblJoZUMxdWN5TWlQZ29nSUNBZ0lDQThjbVJtT2tSbGMyTnlhWEIwYVc5dUlISmtaanBoWW05MWREMGlJZ29nSUNBZ0lDQWdJQ0FnSUNCNGJXeHVjenA0YlhBOUltaDBkSEE2THk5dWN5NWhaRzlpWlM1amIyMHZlR0Z3THpFdU1DOGlDaUFnSUNBZ0lDQWdJQ0FnSUhodGJHNXpPbVJqUFNKb2RIUndPaTh2Y0hWeWJDNXZjbWN2WkdNdlpXeGxiV1Z1ZEhNdk1TNHhMeUlLSUNBZ0lDQWdJQ0FnSUNBZ2VHMXNibk02Y0dodmRHOXphRzl3UFNKb2RIUndPaTh2Ym5NdVlXUnZZbVV1WTI5dEwzQm9iM1J2YzJodmNDOHhMakF2SWdvZ0lDQWdJQ0FnSUNBZ0lDQjRiV3h1Y3pwNGJYQk5UVDBpYUhSMGNEb3ZMMjV6TG1Ga2IySmxMbU52YlM5NFlYQXZNUzR3TDIxdEx5SUtJQ0FnSUNBZ0lDQWdJQ0FnZUcxc2JuTTZjM1JGZG5ROUltaDBkSEE2THk5dWN5NWhaRzlpWlM1amIyMHZlR0Z3THpFdU1DOXpWSGx3WlM5U1pYTnZkWEpqWlVWMlpXNTBJeUlLSUNBZ0lDQWdJQ0FnSUNBZ2VHMXNibk02ZEdsbVpqMGlhSFIwY0RvdkwyNXpMbUZrYjJKbExtTnZiUzkwYVdabUx6RXVNQzhpQ2lBZ0lDQWdJQ0FnSUNBZ0lIaHRiRzV6T21WNGFXWTlJbWgwZEhBNkx5OXVjeTVoWkc5aVpTNWpiMjB2WlhocFppOHhMakF2SWo0S0lDQWdJQ0FnSUNBZ1BIaHRjRHBEY21WaGRHOXlWRzl2YkQ1QlpHOWlaU0JRYUc5MGIzTm9iM0FnUTBNZ01qQXhOUzQxSUNoWGFXNWtiM2R6S1R3dmVHMXdPa055WldGMGIzSlViMjlzUGdvZ0lDQWdJQ0FnSUNBOGVHMXdPa055WldGMFpVUmhkR1UrTWpBeE5pMHhNQzB4T0ZReE56b3pNem93Tmkwd056b3dNRHd2ZUcxd09rTnlaV0YwWlVSaGRHVStDaUFnSUNBZ0lDQWdJRHg0YlhBNlRXOWthV1o1UkdGMFpUNHlNREUyTFRFd0xUSXdWREl4T2pNek9qVXpMVEEzT2pBd1BDOTRiWEE2VFc5a2FXWjVSR0YwWlQ0S0lDQWdJQ0FnSUNBZ1BIaHRjRHBOWlhSaFpHRjBZVVJoZEdVK01qQXhOaTB4TUMweU1GUXlNVG96TXpvMU15MHdOem93TUR3dmVHMXdPazFsZEdGa1lYUmhSR0YwWlQ0S0lDQWdJQ0FnSUNBZ1BHUmpPbVp2Y20xaGRENXBiV0ZuWlM5d2JtYzhMMlJqT21admNtMWhkRDRLSUNBZ0lDQWdJQ0FnUEhCb2IzUnZjMmh2Y0RwRGIyeHZjazF2WkdVK016d3ZjR2h2ZEc5emFHOXdPa052Ykc5eVRXOWtaVDRLSUNBZ0lDQWdJQ0FnUEhodGNFMU5Pa2x1YzNSaGJtTmxTVVErZUcxd0xtbHBaRG8yT0RjeFlUazVZeTB6TmpFNUxUbGtOR0V0T0Rka05pMHdZV0U1WVRSaU5XVTRNamM4TDNodGNFMU5Pa2x1YzNSaGJtTmxTVVErQ2lBZ0lDQWdJQ0FnSUR4NGJYQk5UVHBFYjJOMWJXVnVkRWxFUG5odGNDNWthV1E2TmpnM01XRTVPV010TXpZeE9TMDVaRFJoTFRnM1pEWXRNR0ZoT1dFMFlqVmxPREkzUEM5NGJYQk5UVHBFYjJOMWJXVnVkRWxFUGdvZ0lDQWdJQ0FnSUNBOGVHMXdUVTA2VDNKcFoybHVZV3hFYjJOMWJXVnVkRWxFUG5odGNDNWthV1E2TmpnM01XRTVPV010TXpZeE9TMDVaRFJoTFRnM1pEWXRNR0ZoT1dFMFlqVmxPREkzUEM5NGJYQk5UVHBQY21sbmFXNWhiRVJ2WTNWdFpXNTBTVVErQ2lBZ0lDQWdJQ0FnSUR4NGJYQk5UVHBJYVhOMGIzSjVQZ29nSUNBZ0lDQWdJQ0FnSUNBOGNtUm1PbE5sY1Q0S0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnUEhKa1pqcHNhU0J5WkdZNmNHRnljMlZVZVhCbFBTSlNaWE52ZFhKalpTSStDaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJRHh6ZEVWMmREcGhZM1JwYjI0K1kzSmxZWFJsWkR3dmMzUkZkblE2WVdOMGFXOXVQZ29nSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0E4YzNSRmRuUTZhVzV6ZEdGdVkyVkpSRDU0YlhBdWFXbGtPalk0TnpGaE9UbGpMVE0yTVRrdE9XUTBZUzA0TjJRMkxUQmhZVGxoTkdJMVpUZ3lOend2YzNSRmRuUTZhVzV6ZEdGdVkyVkpSRDRLSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnUEhOMFJYWjBPbmRvWlc0K01qQXhOaTB4TUMweE9GUXhOem96TXpvd05pMHdOem93TUR3dmMzUkZkblE2ZDJobGJqNEtJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdQSE4wUlhaME9uTnZablIzWVhKbFFXZGxiblErUVdSdlltVWdVR2h2ZEc5emFHOXdJRU5ESURJd01UVXVOU0FvVjJsdVpHOTNjeWs4TDNOMFJYWjBPbk52Wm5SM1lYSmxRV2RsYm5RK0NpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUR3dmNtUm1PbXhwUGdvZ0lDQWdJQ0FnSUNBZ0lDQThMM0prWmpwVFpYRStDaUFnSUNBZ0lDQWdJRHd2ZUcxd1RVMDZTR2x6ZEc5eWVUNEtJQ0FnSUNBZ0lDQWdQSFJwWm1ZNlQzSnBaVzUwWVhScGIyNCtNVHd2ZEdsbVpqcFBjbWxsYm5SaGRHbHZiajRLSUNBZ0lDQWdJQ0FnUEhScFptWTZXRkpsYzI5c2RYUnBiMjQrTWpnNE1EQXdNQzh4TURBd01Ed3ZkR2xtWmpwWVVtVnpiMngxZEdsdmJqNEtJQ0FnSUNBZ0lDQWdQSFJwWm1ZNldWSmxjMjlzZFhScGIyNCtNamc0TURBd01DOHhNREF3TUR3dmRHbG1aanBaVW1WemIyeDFkR2x2Ymo0S0lDQWdJQ0FnSUNBZ1BIUnBabVk2VW1WemIyeDFkR2x2YmxWdWFYUStNand2ZEdsbVpqcFNaWE52YkhWMGFXOXVWVzVwZEQ0S0lDQWdJQ0FnSUNBZ1BHVjRhV1k2UTI5c2IzSlRjR0ZqWlQ0Mk5UVXpOVHd2WlhocFpqcERiMnh2Y2xOd1lXTmxQZ29nSUNBZ0lDQWdJQ0E4WlhocFpqcFFhWGhsYkZoRWFXMWxibk5wYjI0K01USTRQQzlsZUdsbU9sQnBlR1ZzV0VScGJXVnVjMmx2Ymo0S0lDQWdJQ0FnSUNBZ1BHVjRhV1k2VUdsNFpXeFpSR2x0Wlc1emFXOXVQalkwUEM5bGVHbG1PbEJwZUdWc1dVUnBiV1Z1YzJsdmJqNEtJQ0FnSUNBZ1BDOXlaR1k2UkdWelkzSnBjSFJwYjI0K0NpQWdJRHd2Y21SbU9sSkVSajRLUEM5NE9uaHRjRzFsZEdFK0NpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQUtJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQW9nSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnQ2lBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBS0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lBb2dJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdDaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FLSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUFvZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0NpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQUtJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQW9nSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnQ2lBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBS0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lBb2dJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdDaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FLSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUFvZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0NpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQUtJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQW9nSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnQ2lBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBS0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lBb2dJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdDaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FLSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUFvZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0NpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQUtJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQW9nSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnQ2lBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBS0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lBb2dJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdDaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FLSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUFvZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0NpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQUtJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQW9nSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnQ2lBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBS0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lBb2dJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdDaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FLSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUFvZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0NpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQUtJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQW9nSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnQ2lBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBS0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lBb2dJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdDaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FLSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUFvZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0NpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQUtJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQW9nSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnQ2lBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBS0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lBb2dJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdDaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FLSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUFvZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0NpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQUtJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQW9nSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnQ2lBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBS0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lBb2dJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdDaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FLSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUFvZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0NpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQUtJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQW9nSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnQ2lBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBS0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lBb2dJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdDaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FLSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUFvZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0NpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQUtJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQW9nSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnQ2lBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBS0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lBb2dJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdDaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FLSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUFvZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0NpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQUtJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQW9nSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnQ2lBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBS0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lBb2dJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdDaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FLSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUFvZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0NpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQUtJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQW9nSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnQ2lBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBS0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lBb2dJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdDaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FLSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUFvZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0NpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQUtJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQW9nSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnQ2lBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBS0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lBb2dJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdDaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FLSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUFvZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0NpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQUtJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQW9nSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnQ2p3L2VIQmhZMnRsZENCbGJtUTlJbmNpUHo1ejlSVDNBQUFBSUdOSVVrMEFBSG9sQUFDQWd3QUErZjhBQUlEcEFBQjFNQUFBNm1BQUFEcVlBQUFYYjVKZnhVWUFBQVR0U1VSQlZIamE3SnpiYjVSRkdNWi8yeGJDdlZoQVNFeFVpSTE0NHcwaFF0SEVHckhnSVNxZ042S2d0TllXQWIwdzBXbzFYcXJiUGJTbG9rWVN4Zk1oZW1YL0FhN3dHQVZxOFhUcDMwRFhpNW1KbTBhMnU5djMvYjZaMlhsdWRyT0hkdy9QTXpQUCs3NHpYNkZXcXlHRmdZRUJFbHBHRC9BZWNDdHdCL0RiY20rWW01c1QrL0N1OVAvbmltNmdDRHdDWEF0OERWeVg1UmRJQXNnUEJhQUVqTlE5ZGlQd0ZiQTVDU0IrVEFGUC9jL2pXNEhQZ0w0a2dIZ3hDd3cxZVA1bTRHTjdtd1FRRWJvcytVODA4ZHF0d0VmMk5na2dFcmMvMHlUNURuMTJPZGlTQkJBKythVVd5WGZZQW53RFhKOEVFRzZxTndrTXJ5REdacHNpM3BBRUVCNnFWM0Q3cmFJUCtOS21pa2tBZ2VBdDRJaGd2SnZzVEpBRTREa0t3Q25nc0VMc3Mwa0EvcS81czhBaGhkalR3RUZwZDVvZ1MzNVZhZVRQQWs4RGkwa0EvcEpmRWw3ekhVN1N1SEtZbGdBUDF2eXlrTnRmaWhrdDhwTUFaRWthVm9oYlZZcWJCQ0NJVThDVENuRkx3SmoybDA4Q1dObWEvN2FTMjY4Q3g2UU5YeEtBckhtZUJoNVhXazdHc2lBL1R3R01ZZmEvaFVwK21mWWFPODI0L2VHc3lNOUxBQzlnbWlQdkF6c0RJNy9McnMxRFNpTi9LSThmbENYR2dWZnQvVjdnRExBcklBRk1oK3IyZlJEQVM4REVrc2MyQWg4Qy9SM3M5c3ZBYUo1VFdsYmt2M3lGNTlaamRyMXM5M2phMTNMN0ZldjJhekVMWUx3QitRNXJNYjN1YlI0YXZwTktibjhhZUFhNG5MZTZ0UTNmUkpPdjdRVys4R2dtNkxFalZLT3hNNE01RDNBNTd4K3BLWUFYNnd4ZnM5Z0FmQUxzOElCOHJjYU9LeHZYZkZDNWxnREdnVmZhZks4emhydHkvRSswWEhrbEw3ZWZwUUFtV3BqMmx4UEJiVG44SjdQbzFmWkg4UXpTQW5qTmpuNEpyTWVjanNtcVdGUUEzbFZ5K3lYcjlvbGRBSGNLeDdzYStEd0RZOWhqOC95RGlxbmVZaWNJNEZIZ1IrR1lhNVd6QTgzR3poUncxRmZ5TlFUd0MzQ1B2WlhFT3VCVHpFVVVKTEVxZzFUUFcvSzFUT0Nmd0NCd1VUanVOY2lXamJzeFpWaU5WQyszMnI0dmFlQWZ3RjNBZ25EY1RWWUV0d3VOVUEzeXk1amR1M1N5QUFCK0IzWXJMQWNiQk9vRTd5aE4rNU4yelNjSndHQWVlQUQ0VGpodUw2YUIxS29uNkxia1A2WTA4by9qU1lYUEZ3RUFuQWNlVmhEQlZTMW1CNjZ4bzBIK0ZLYXhzMGhneUtvZGZBRjRFUGhKcVU2dzNFeXd5aHF6UTBya2o0UklmcFlDQUxnRTdMRXpnaVJjeGJDL3djaXZvRlBlZGVRSGk2eTNoUDFsamVHOFVvcTRORHNvWUlvOFdqdDVnaVkvRHdIVXA0aS9LbVFIWitwRVVNRHM1TkZ3KzBVeU9MUVJxd0RjY25BdjhMMXczSFhBYVpzaXZxNWsrSXJBQ1NKQm5xZUQ1NEVEd0FmQUxZSnhOd0hmS3BteXNpVi9NUllCNUgweTZBS3dIL2hCT081cVlJMkM0VHNhRS9rK0NBRE0xYkgzSWw4eGxFVFZHcjRha2NHWHM0Ri9BM2ZiR2NFM1ZBaW90aCtxQU1CMEVYZDdKb0pKUE56R0Zhc0F3RFNRQnBIZlZOS3UyejlHNVBEeGVQZ0M4QkJ3THVlUmZ5TEdOVDhFQVlEWlRISUErUVpTczJ2KzhkamNmbWdDY0hXQys1RnZJQzNuOWtjN2hYemZCZUNNNFI3a3k4WWQ1L1pERlFEODEwQzZxUGdaMGJ2OWtBVlFueUpxRkl2ZXhHem1JQW5BYjF3QzdoTTJoa1hnV1RvWW9WMGx6RFdRSkZMRTZCbzduU0FBbHlMdVkyVU5wQW9aWG9vdENVQWVDNWdHMHM5dGtqOUtRdEFDQU5OQUdxUzFQWWFsUkg0OEFuQXBZclBieTRvRWRtZ2pDYUQ1RkhFdmpiZVh2WUVwN3laRUtBRG5DZlpiRWZ3RFBJODVMK0RJZjQ0T2FPeTBnMzhIQU0vZTdndUlSeDk0QUFBQUFFbEZUa1N1UW1DQyc7XG5cbiAgY29uc3QgdGV4dHVyZSA9IG5ldyBUSFJFRS5UZXh0dXJlKCk7XG4gIHRleHR1cmUuaW1hZ2UgPSBpbWFnZTtcbiAgdGV4dHVyZS5uZWVkc1VwZGF0ZSA9IHRydWU7XG4gIHRleHR1cmUubWluRmlsdGVyID0gVEhSRUUuTGluZWFyTWlwTWFwTGluZWFyRmlsdGVyO1xuICB0ZXh0dXJlLm1hZ0ZpbHRlciA9IFRIUkVFLkxpbmVhckZpbHRlcjtcbiAgLy8gdGV4dHVyZS5hbmlzb3Ryb3BpY1xuICAvLyB0ZXh0dXJlLmdlbmVyYXRlTWlwbWFwcyA9IGZhbHNlO1xuXG4gIGNvbnN0IG1hdGVyaWFsID0gbmV3IFRIUkVFLk1lc2hCYXNpY01hdGVyaWFsKHtcbiAgICAvLyBjb2xvcjogMHhmZjAwMDAsXG4gICAgc2lkZTogVEhSRUUuRG91YmxlU2lkZSxcbiAgICB0cmFuc3BhcmVudDogdHJ1ZSxcbiAgICBtYXA6IHRleHR1cmVcbiAgfSk7XG4gIG1hdGVyaWFsLmFscGhhVGVzdCA9IDAuMjtcblxuICByZXR1cm4gZnVuY3Rpb24oKXtcbiAgICBjb25zdCBoID0gMC40O1xuICAgIGNvbnN0IGdlbyA9IG5ldyBUSFJFRS5QbGFuZUdlb21ldHJ5KCBpbWFnZS53aWR0aCAvIDEwMDAgKiBoLCBpbWFnZS5oZWlnaHQgLyAxMDAwICogaCwgMSwgMSApO1xuICAgIGdlby50cmFuc2xhdGUoIDAuMDI1LCAwLCAwICk7XG4gICAgcmV0dXJuIG5ldyBUSFJFRS5NZXNoKCBnZW8sIG1hdGVyaWFsICk7XG4gIH1cbn0oKSk7IiwiLyoqIFxuICogQmlnIGJ1dHRvbiB3aXRoIGFuIGltYWdlIG9uICh3aGljaCBtaWdodCBjb21lIGZyb20gYSBmaWxlIG9yIGV4aXN0aW5nIHRleHR1cmUsXG4gKiB0aGUgdGV4dHVyZSBtaWdodCBiZSBmcm9tIGEgUmVuZGVyVGFyZ2V0Li4uKS5cbiAqIFxuICogSSdkIHB1dCB0aGlzIG1vcmUgc2VwYXJhdGUgZnJvbSB0aGUgZGF0Z3VpIG1vZHVsZXMgYnV0IG5lZWQgdG8gdGhpbmsgYSBsaXR0bGVcbiAqIGJpdCBhYm91dCBob3cgdG8gc3RydWN0dXJlIHRoYXQgZXRjLiAgVmVyeSB1bi1EUlksIGJ1dCBJJ20gc3RhcnRpbmcgYnkganVzdFxuICogY29weWluZyBleGlzdGluZyBidXR0b24uanMgaW4gaXRzIGVudGlyZXR5LlxuICogXG4gKiBUT0RPOiBub3QganVzdCBzaW1wbGUgJ2JhbmcnIGZ1bmN0aW9uIGJ1dCBjYWxsYmFja3MgZm9yIGhvdmVyIC8gZXRjLlxuICogXG4gKiBcbiAqIENvcHlyaWdodCAgRGF0YSBBcnRzIFRlYW0sIEdvb2dsZSBpbmMuIDIwMTYgLyBQZXRlciBUb2RkLCAyMDE3XG4gKiBcbiogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbipcbiogICAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuKlxuKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4qIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4qIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKi9cblxuaW1wb3J0ICogYXMgU3ViZGl2aXNpb25Nb2RpZmllciBmcm9tICcuLi90aGlyZHBhcnR5L1N1YmRpdmlzaW9uTW9kaWZpZXInO1xuXG5pbXBvcnQgY3JlYXRlVGV4dExhYmVsIGZyb20gJy4vdGV4dGxhYmVsJztcbmltcG9ydCBjcmVhdGVJbnRlcmFjdGlvbiBmcm9tICcuL2ludGVyYWN0aW9uJztcbmltcG9ydCAqIGFzIENvbG9ycyBmcm9tICcuL2NvbG9ycyc7XG5pbXBvcnQgKiBhcyBMYXlvdXQgZnJvbSAnLi9sYXlvdXQnO1xuaW1wb3J0ICogYXMgU2hhcmVkTWF0ZXJpYWxzIGZyb20gJy4vc2hhcmVkbWF0ZXJpYWxzJztcbmltcG9ydCAqIGFzIEdyYWIgZnJvbSAnLi9ncmFiJztcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gY3JlYXRlSW1hZ2VCdXR0b24oIHtcbiAgdGV4dENyZWF0b3IsXG4gIG9iamVjdCxcbiAgcHJvcGVydHlOYW1lID0gJ3VuZGVmaW5lZCcsXG4gIGltYWdlID0gXCJ0ZXh0dXJlcy9zcG90bGlnaHQuanBnXCIsIC8vVE9ETyBiZXR0ZXIgZGVmYXVsdFxuICB3aWR0aCA9IExheW91dC5QQU5FTF9XSURUSCxcbiAgaGVpZ2h0ID0gTGF5b3V0LlBBTkVMX1dJRFRIIC8gMyxcbiAgZGVwdGggPSBMYXlvdXQuUEFORUxfREVQVEhcbn0gPSB7fSApe1xuXG4gIGZ1bmN0aW9uIGFwcGx5SW1hZ2VUb01hdGVyaWFsKGltYWdlLCB0YXJnZXRNYXRlcmlhbCkge1xuICAgICAgaWYgKHR5cGVvZiBpbWFnZSA9PT0gXCJzdHJpbmdcIikge1xuICAgICAgICAvL1RPRE8gY2FjaGUuICBEb2VzIFRleHR1cmVMb2FkZXIgYWxyZWFkeSBjYWNoZT9cbiAgICAgICAgLy9UT0RPIEltYWdlIG9ubHkgb24gZnJvbnQgZmFjZSBvZiBidXR0b24uXG4gICAgICAgIG5ldyBUSFJFRS5UZXh0dXJlTG9hZGVyKCkubG9hZChpbWFnZSwgKHRleHR1cmUpID0+IHtcbiAgICAgICAgICAgIHRleHR1cmUud3JhcFMgPSB0ZXh0dXJlLndyYXBUID0gVEhSRUUuQ2xhbXBUb0VkZ2VXcmFwcGluZztcbiAgICAgICAgICAgIHRhcmdldE1hdGVyaWFsLm1hcCA9IHRleHR1cmU7XG4gICAgICAgICAgICB0YXJnZXRNYXRlcmlhbC5uZWVkc1VwZGF0ZSA9IHRydWU7XG4gICAgICAgIH0pO1xuICAgICAgfSBlbHNlIGlmIChpbWFnZS5pc1RleHR1cmUpIHtcbiAgICAgICAgICB0YXJnZXRNYXRlcmlhbC5tYXAgPSBpbWFnZTtcbiAgICAgIH0gZWxzZSBpZiAoaW1hZ2UuaXNXZWJHTFJlbmRlclRhcmdldCkge1xuICAgICAgICAgIHRhcmdldE1hdGVyaWFsLm1hcCA9IGltYWdlLnRleHR1cmU7XG4gICAgICB9IGVsc2UgdGhyb3cgXCJub3Qgc3VyZSBob3cgdG8gaW50ZXJwcmV0IGltYWdlIFwiICsgaW1hZ2U7XG4gICAgICB0YXJnZXRNYXRlcmlhbC5uZWVkc1VwZGF0ZSA9IHRydWU7XG4gIH1cblxuICBjb25zdCBCVVRUT05fV0lEVEggPSB3aWR0aCAqIDAuNSAtIExheW91dC5QQU5FTF9NQVJHSU47XG4gIGNvbnN0IEJVVFRPTl9IRUlHSFQgPSBoZWlnaHQgLSBMYXlvdXQuUEFORUxfTUFSR0lOO1xuICBjb25zdCBCVVRUT05fREVQVEggPSBMYXlvdXQuQlVUVE9OX0RFUFRIICogMjtcblxuICBjb25zdCBncm91cCA9IG5ldyBUSFJFRS5Hcm91cCgpO1xuICBncm91cC5zcGFjaW5nID0gaGVpZ2h0O1xuXG4gIGNvbnN0IHBhbmVsID0gTGF5b3V0LmNyZWF0ZVBhbmVsKCB3aWR0aCwgaGVpZ2h0LCBkZXB0aCApO1xuICBncm91cC5hZGQoIHBhbmVsICk7XG5cbiAgLy8gIGJhc2UgY2hlY2tib3hcbiAgY29uc3QgYXNwZWN0UmF0aW8gPSBCVVRUT05fV0lEVEggLyBCVVRUT05fSEVJR0hUO1xuICBjb25zdCByZWN0ID0gbmV3IFRIUkVFLlBsYW5lR2VvbWV0cnkoIEJVVFRPTl9XSURUSCwgQlVUVE9OX0hFSUdIVCwgMSwgMSApO1xuICBjb25zdCBtb2RpZmllciA9IG5ldyBUSFJFRS5TdWJkaXZpc2lvbk1vZGlmaWVyKCAxICk7XG4gIC8vbW9kaWZpZXIubW9kaWZ5KCByZWN0ICk7XG4gIHJlY3QudHJhbnNsYXRlKCBCVVRUT05fV0lEVEggKiAwLjUsIDAsIEJVVFRPTl9ERVBUSCApO1xuXG4gIC8vICBoaXRzY2FuIHZvbHVtZVxuICBjb25zdCBoaXRzY2FuTWF0ZXJpYWwgPSBuZXcgVEhSRUUuTWVzaEJhc2ljTWF0ZXJpYWwoKTtcbiAgaGl0c2Nhbk1hdGVyaWFsLnZpc2libGUgPSBmYWxzZTtcblxuICBjb25zdCBoaXRzY2FuVm9sdW1lID0gbmV3IFRIUkVFLk1lc2goIHJlY3QuY2xvbmUoKSwgaGl0c2Nhbk1hdGVyaWFsICk7XG4gIGhpdHNjYW5Wb2x1bWUucG9zaXRpb24ueiA9IEJVVFRPTl9ERVBUSDtcbiAgaGl0c2NhblZvbHVtZS5wb3NpdGlvbi54ID0gd2lkdGggKiAwLjU7XG5cbiAgY29uc3QgbWF0ZXJpYWwgPSBuZXcgVEhSRUUuTWVzaEJhc2ljTWF0ZXJpYWwoKTtcbiAgbWF0ZXJpYWwudHJhbnNwYXJlbnQgPSB0cnVlO1xuICBhcHBseUltYWdlVG9NYXRlcmlhbChpbWFnZSwgbWF0ZXJpYWwpO1xuICBjb25zdCBmaWxsZWRWb2x1bWUgPSBuZXcgVEhSRUUuTWVzaCggcmVjdC5jbG9uZSgpLCBtYXRlcmlhbCApO1xuICBoaXRzY2FuVm9sdW1lLmFkZCggZmlsbGVkVm9sdW1lICk7XG5cbiAgLy9idXR0b24gbGFiZWwgcmVtb3ZlZDsgbWlnaHQgd2FudCBvcHRpb25zIGxpa2UgYSBob3ZlciBsYWJlbCBpbiBmdXR1cmUuXG5cbiAgY29uc3QgZGVzY3JpcHRvckxhYmVsID0gdGV4dENyZWF0b3IuY3JlYXRlKCBwcm9wZXJ0eU5hbWUgKTtcbiAgZGVzY3JpcHRvckxhYmVsLnBvc2l0aW9uLnggPSBMYXlvdXQuUEFORUxfTEFCRUxfVEVYVF9NQVJHSU47XG4gIGRlc2NyaXB0b3JMYWJlbC5wb3NpdGlvbi56ID0gZGVwdGg7XG4gIGRlc2NyaXB0b3JMYWJlbC5wb3NpdGlvbi55ID0gLTAuMDM7XG5cbiAgY29uc3QgY29udHJvbGxlcklEID0gTGF5b3V0LmNyZWF0ZUNvbnRyb2xsZXJJREJveCggaGVpZ2h0LCBDb2xvcnMuQ09OVFJPTExFUl9JRF9CVVRUT04gKTtcbiAgY29udHJvbGxlcklELnBvc2l0aW9uLnogPSBkZXB0aDtcblxuICBwYW5lbC5hZGQoIGRlc2NyaXB0b3JMYWJlbCwgaGl0c2NhblZvbHVtZSwgY29udHJvbGxlcklEICk7XG5cbiAgY29uc3QgaW50ZXJhY3Rpb24gPSBjcmVhdGVJbnRlcmFjdGlvbiggaGl0c2NhblZvbHVtZSApO1xuICBpbnRlcmFjdGlvbi5ldmVudHMub24oICdvblByZXNzZWQnLCBoYW5kbGVPblByZXNzICk7XG4gIGludGVyYWN0aW9uLmV2ZW50cy5vbiggJ29uUmVsZWFzZWQnLCBoYW5kbGVPblJlbGVhc2UgKTtcblxuICB1cGRhdGVWaWV3KCk7XG5cbiAgZnVuY3Rpb24gaGFuZGxlT25QcmVzcyggcCApe1xuICAgIGlmKCBncm91cC52aXNpYmxlID09PSBmYWxzZSApe1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIG9iamVjdFsgcHJvcGVydHlOYW1lIF0oKTtcblxuICAgIGhpdHNjYW5Wb2x1bWUucG9zaXRpb24ueiA9IEJVVFRPTl9ERVBUSCAqIDAuMTtcblxuICAgIHAubG9ja2VkID0gdHJ1ZTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGhhbmRsZU9uUmVsZWFzZSgpe1xuICAgIGhpdHNjYW5Wb2x1bWUucG9zaXRpb24ueiA9IEJVVFRPTl9ERVBUSCAqIDAuNTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHVwZGF0ZVZpZXcoKXtcblxuICAgIGlmKCBpbnRlcmFjdGlvbi5ob3ZlcmluZygpICl7XG4gICAgICBtYXRlcmlhbC5jb2xvci5zZXRIZXgoIDB4RkZGRkZGICk7XG4gICAgfVxuICAgIGVsc2V7XG4gICAgICBtYXRlcmlhbC5jb2xvci5zZXRIZXgoIDB4Q0NDQ0NDICk7XG4gICAgfVxuXG4gIH1cblxuICBncm91cC5pbnRlcmFjdGlvbiA9IGludGVyYWN0aW9uO1xuICBncm91cC5oaXRzY2FuID0gWyBoaXRzY2FuVm9sdW1lLCBwYW5lbCBdO1xuXG4gIGNvbnN0IGdyYWJJbnRlcmFjdGlvbiA9IEdyYWIuY3JlYXRlKCB7IGdyb3VwLCBwYW5lbCB9ICk7XG5cbiAgZ3JvdXAudXBkYXRlID0gZnVuY3Rpb24oIGlucHV0T2JqZWN0cyApe1xuICAgIGludGVyYWN0aW9uLnVwZGF0ZSggaW5wdXRPYmplY3RzICk7XG4gICAgZ3JhYkludGVyYWN0aW9uLnVwZGF0ZSggaW5wdXRPYmplY3RzICk7XG4gICAgdXBkYXRlVmlldygpO1xuICB9O1xuXG4gIGdyb3VwLm5hbWUgPSBmdW5jdGlvbiggc3RyICl7XG4gICAgZGVzY3JpcHRvckxhYmVsLnVwZGF0ZSggc3RyICk7XG4gICAgcmV0dXJuIGdyb3VwO1xuICB9O1xuXG5cbiAgcmV0dXJuIGdyb3VwO1xufSIsIi8qKlxuKiBkYXQtZ3VpVlIgSmF2YXNjcmlwdCBDb250cm9sbGVyIExpYnJhcnkgZm9yIFZSXG4qIGh0dHBzOi8vZ2l0aHViLmNvbS9kYXRhYXJ0cy9kYXQuZ3VpVlJcbipcbiogQ29weXJpZ2h0IDIwMTYgRGF0YSBBcnRzIFRlYW0sIEdvb2dsZSBJbmMuXG4qXG4qIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4qIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4qXG4qICAgICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbipcbiogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4qIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4qIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuKi9cblxuaW1wb3J0IEVtaXR0ZXIgZnJvbSAnZXZlbnRzJztcbmltcG9ydCBjcmVhdGVTbGlkZXIgZnJvbSAnLi9zbGlkZXInO1xuaW1wb3J0IGNyZWF0ZUNoZWNrYm94IGZyb20gJy4vY2hlY2tib3gnO1xuaW1wb3J0IGNyZWF0ZUJ1dHRvbiBmcm9tICcuL2J1dHRvbic7XG5pbXBvcnQgY3JlYXRlRm9sZGVyIGZyb20gJy4vZm9sZGVyJztcbmltcG9ydCBjcmVhdGVEcm9wZG93biBmcm9tICcuL2Ryb3Bkb3duJztcbi8vUEpUOiBJJ2QgcmF0aGVyIGluamVjdCBjdXN0b20gZXh0ZW5zaW9ucyBsaWtlIHRoaXMsIGJ1dCB3aWxsIHdvcmsgdGhhdCBvdXQgbGF0ZXIuXG5pbXBvcnQgY3JlYXRlSW1hZ2VCdXR0b24gZnJvbSAnLi9pbWFnZWJ1dHRvbic7XG5pbXBvcnQgKiBhcyBTREZUZXh0IGZyb20gJy4vc2RmdGV4dCc7XG5cbmNvbnN0IEdVSVZSID0gKGZ1bmN0aW9uIERBVEdVSVZSKCl7XG5cbiAgLypcbiAgICBTREYgZm9udFxuICAqL1xuICBjb25zdCB0ZXh0Q3JlYXRvciA9IFNERlRleHQuY3JlYXRvcigpO1xuXG5cbiAgLypcbiAgICBMaXN0cy5cbiAgICBJbnB1dE9iamVjdHMgYXJlIHRoaW5ncyBsaWtlIFZJVkUgY29udHJvbGxlcnMsIGNhcmRib2FyZCBoZWFkc2V0cywgZXRjLlxuICAgIENvbnRyb2xsZXJzIGFyZSB0aGUgREFUIEdVSSBzbGlkZXJzLCBjaGVja2JveGVzLCBldGMuXG4gICAgSGl0c2Nhbk9iamVjdHMgYXJlIGFueXRoaW5nIHJheWNhc3RzIHdpbGwgaGl0LXRlc3QgYWdhaW5zdC5cbiAgKi9cbiAgY29uc3QgaW5wdXRPYmplY3RzID0gW107XG4gIGNvbnN0IGNvbnRyb2xsZXJzID0gW107XG4gIGNvbnN0IGhpdHNjYW5PYmplY3RzID0gW107IC8vWFhYOiB0aGlzIGlzIGN1cnJlbnRseSBub3QgdXNlZC5cblxuICAvKlxuICAgIEZ1bmN0aW9ucyBmb3IgZGV0ZXJtaW5pbmcgd2hldGhlciBhIGdpdmVuIGNvbnRyb2xsZXIgaXMgdmlzaWJsZSAoYnkgd2hpY2ggd2VcbiAgICBtZWFuIG5vdCBoaWRkZW4sIG5vdCAndmlzaWJsZScgaW4gdGVybXMgb2YgdGhlIGNhbWVyYSBvcmllbnRhdGlvbiBldGMpLCBhbmRcbiAgICBmb3IgcmV0cmlldmluZyB0aGUgbGlzdCBvZiB2aXNpYmxlIGhpdHNjYW5PYmplY3RzIGR5bmFtaWNhbGx5LlxuICAgIFRoaXMgbWlnaHQgYmVuZWZpdCBmcm9tIHNvbWUgY2FjaGluZyBlc3BlY2lhbGx5IGluIGNhc2VzIHdpdGggbGFyZ2UgY29tcGxleCBHVUlzLlxuICAgIEkgaGF2ZW4ndCBtZWFzdXJlZCB0aGUgaW1wYWN0IG9mIGdhcmJhZ2UgY29sbGVjdGlvbiBldGMuXG4gICovXG4gIGZ1bmN0aW9uIGlzQ29udHJvbGxlclZpc2libGUoY29udHJvbCkge1xuICAgIGlmICghY29udHJvbC52aXNpYmxlKSByZXR1cm4gZmFsc2U7XG4gICAgdmFyIGZvbGRlciA9IGNvbnRyb2wuZm9sZGVyO1xuICAgIHdoaWxlIChmb2xkZXIuZm9sZGVyICE9PSBmb2xkZXIpe1xuICAgICAgZm9sZGVyID0gZm9sZGVyLmZvbGRlcjtcbiAgICAgIGlmIChmb2xkZXIuaXNDb2xsYXBzZWQoKSB8fCAhZm9sZGVyLnZpc2libGUpIHJldHVybiBmYWxzZTtcbiAgICB9IFxuICAgIHJldHVybiB0cnVlO1xuICB9XG4gIGZ1bmN0aW9uIGdldFZpc2libGVDb250cm9sbGVycygpIHtcbiAgICAvLyBub3QgdGVycmlibHkgZWZmaWNpZW50XG4gICAgcmV0dXJuIGNvbnRyb2xsZXJzLmZpbHRlciggaXNDb250cm9sbGVyVmlzaWJsZSApO1xuICB9XG4gIGZ1bmN0aW9uIGdldFZpc2libGVIaXRzY2FuT2JqZWN0cygpIHtcbiAgICBjb25zdCB0bXAgPSBnZXRWaXNpYmxlQ29udHJvbGxlcnMoKS5tYXAoIG8gPT4geyByZXR1cm4gby5oaXRzY2FuOyB9IClcbiAgICByZXR1cm4gdG1wLnJlZHVjZSgoYSwgYikgPT4geyByZXR1cm4gYS5jb25jYXQoYil9LCBbXSk7XG4gIH1cblxuICBsZXQgbW91c2VFbmFibGVkID0gZmFsc2U7XG4gIGxldCBtb3VzZVJlbmRlcmVyID0gdW5kZWZpbmVkO1xuXG4gIGZ1bmN0aW9uIGVuYWJsZU1vdXNlKCBjYW1lcmEsIHJlbmRlcmVyICl7XG4gICAgbW91c2VFbmFibGVkID0gdHJ1ZTtcbiAgICBtb3VzZVJlbmRlcmVyID0gcmVuZGVyZXI7XG4gICAgbW91c2VJbnB1dC5tb3VzZUNhbWVyYSA9IGNhbWVyYTtcbiAgICByZXR1cm4gbW91c2VJbnB1dC5sYXNlcjtcbiAgfVxuXG4gIGZ1bmN0aW9uIGRpc2FibGVNb3VzZSgpe1xuICAgIG1vdXNlRW5hYmxlZCA9IGZhbHNlO1xuICB9XG5cblxuXG5cbiAgLypcbiAgICBUaGUgZGVmYXVsdCBsYXNlciBwb2ludGVyIGNvbWluZyBvdXQgb2YgZWFjaCBJbnB1dE9iamVjdC5cbiAgKi9cbiAgY29uc3QgbGFzZXJNYXRlcmlhbCA9IG5ldyBUSFJFRS5MaW5lQmFzaWNNYXRlcmlhbCh7Y29sb3I6MHg1NWFhZmYsIHRyYW5zcGFyZW50OiB0cnVlLCBibGVuZGluZzogVEhSRUUuQWRkaXRpdmVCbGVuZGluZyB9KTtcbiAgZnVuY3Rpb24gY3JlYXRlTGFzZXIoKXtcbiAgICBjb25zdCBnID0gbmV3IFRIUkVFLkdlb21ldHJ5KCk7XG4gICAgZy52ZXJ0aWNlcy5wdXNoKCBuZXcgVEhSRUUuVmVjdG9yMygpICk7XG4gICAgZy52ZXJ0aWNlcy5wdXNoKCBuZXcgVEhSRUUuVmVjdG9yMygwLDAsMCkgKTtcbiAgICByZXR1cm4gbmV3IFRIUkVFLkxpbmUoIGcsIGxhc2VyTWF0ZXJpYWwgKTtcbiAgfVxuXG5cblxuXG5cbiAgLypcbiAgICBBIFwiY3Vyc29yXCIsIGVnIHRoZSBiYWxsIHRoYXQgYXBwZWFycyBhdCB0aGUgZW5kIG9mIHlvdXIgbGFzZXIuXG4gICovXG4gIGNvbnN0IGN1cnNvck1hdGVyaWFsID0gbmV3IFRIUkVFLk1lc2hCYXNpY01hdGVyaWFsKHtjb2xvcjoweDQ0NDQ0NCwgdHJhbnNwYXJlbnQ6IHRydWUsIGJsZW5kaW5nOiBUSFJFRS5BZGRpdGl2ZUJsZW5kaW5nIH0gKTtcbiAgZnVuY3Rpb24gY3JlYXRlQ3Vyc29yKCl7XG4gICAgcmV0dXJuIG5ldyBUSFJFRS5NZXNoKCBuZXcgVEhSRUUuU3BoZXJlR2VvbWV0cnkoMC4wMDYsIDQsIDQgKSwgY3Vyc29yTWF0ZXJpYWwgKTtcbiAgfVxuXG5cblxuXG4gIC8qXG4gICAgQ3JlYXRlcyBhIGdlbmVyaWMgSW5wdXQgdHlwZS5cbiAgICBUYWtlcyBhbnkgVEhSRUUuT2JqZWN0M0QgdHlwZSBvYmplY3QgYW5kIHVzZXMgaXRzIHBvc2l0aW9uXG4gICAgYW5kIG9yaWVudGF0aW9uIGFzIGFuIGlucHV0IGRldmljZS5cblxuICAgIEEgbGFzZXIgcG9pbnRlciBpcyBpbmNsdWRlZCBhbmQgd2lsbCBiZSB1cGRhdGVkLlxuICAgIENvbnRhaW5zIHN0YXRlIGFib3V0IHdoaWNoIEludGVyYWN0aW9uIGlzIGN1cnJlbnRseSBiZWluZyB1c2VkIG9yIGhvdmVyLlxuICAqL1xuICBmdW5jdGlvbiBjcmVhdGVJbnB1dCggaW5wdXRPYmplY3QgPSBuZXcgVEhSRUUuR3JvdXAoKSApe1xuICAgIGNvbnN0IGlucHV0ID0ge1xuICAgICAgcmF5Y2FzdDogbmV3IFRIUkVFLlJheWNhc3RlciggbmV3IFRIUkVFLlZlY3RvcjMoKSwgbmV3IFRIUkVFLlZlY3RvcjMoKSApLFxuICAgICAgbGFzZXI6IGNyZWF0ZUxhc2VyKCksXG4gICAgICBjdXJzb3I6IGNyZWF0ZUN1cnNvcigpLFxuICAgICAgb2JqZWN0OiBpbnB1dE9iamVjdCxcbiAgICAgIHByZXNzZWQ6IGZhbHNlLFxuICAgICAgZ3JpcHBlZDogZmFsc2UsXG4gICAgICBldmVudHM6IG5ldyBFbWl0dGVyKCksXG4gICAgICBpbnRlcmFjdGlvbjoge1xuICAgICAgICBncmlwOiB1bmRlZmluZWQsXG4gICAgICAgIHByZXNzOiB1bmRlZmluZWQsXG4gICAgICAgIGhvdmVyOiB1bmRlZmluZWRcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgaW5wdXQubGFzZXIuYWRkKCBpbnB1dC5jdXJzb3IgKTtcblxuICAgIHJldHVybiBpbnB1dDtcbiAgfVxuXG5cblxuXG5cbiAgLypcbiAgICBNb3VzZUlucHV0LlxuICAgIEFsbG93cyB5b3UgdG8gY2xpY2sgb24gdGhlIHNjcmVlbiB3aGVuIG5vdCBpbiBWUiBmb3IgZGVidWdnaW5nLlxuICAqL1xuICBjb25zdCBtb3VzZUlucHV0ID0gY3JlYXRlTW91c2VJbnB1dCgpO1xuXG4gIGZ1bmN0aW9uIGNyZWF0ZU1vdXNlSW5wdXQoKXtcbiAgICBjb25zdCBtb3VzZSA9IG5ldyBUSFJFRS5WZWN0b3IyKC0xLC0xKTtcblxuICAgIGNvbnN0IGlucHV0ID0gY3JlYXRlSW5wdXQoKTtcbiAgICBpbnB1dC5tb3VzZSA9IG1vdXNlO1xuICAgIGlucHV0Lm1vdXNlSW50ZXJzZWN0aW9uID0gbmV3IFRIUkVFLlZlY3RvcjMoKTtcbiAgICBpbnB1dC5tb3VzZU9mZnNldCA9IG5ldyBUSFJFRS5WZWN0b3IzKCk7XG4gICAgaW5wdXQubW91c2VQbGFuZSA9IG5ldyBUSFJFRS5QbGFuZSgpO1xuICAgIGlucHV0LmludGVyc2VjdGlvbnMgPSBbXTtcblxuICAgIC8vICBzZXQgbXkgZW5hYmxlTW91c2VcbiAgICBpbnB1dC5tb3VzZUNhbWVyYSA9IHVuZGVmaW5lZDtcblxuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCAnbW91c2Vtb3ZlJywgZnVuY3Rpb24oIGV2ZW50ICl7XG4gICAgICAvLyBpZiBhIHNwZWNpZmljIHJlbmRlcmVyIGhhcyBiZWVuIGRlZmluZWRcbiAgICAgIGlmIChtb3VzZVJlbmRlcmVyKSB7XG4gICAgICAgIGNvbnN0IGNsaWVudFJlY3QgPSBtb3VzZVJlbmRlcmVyLmRvbUVsZW1lbnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgICAgIG1vdXNlLnggPSAoIChldmVudC5jbGllbnRYIC0gY2xpZW50UmVjdC5sZWZ0KSAvIGNsaWVudFJlY3Qud2lkdGgpICogMiAtIDE7XG4gICAgICAgIG1vdXNlLnkgPSAtICggKGV2ZW50LmNsaWVudFkgLSBjbGllbnRSZWN0LnRvcCkgLyBjbGllbnRSZWN0LmhlaWdodCkgKiAyICsgMTtcbiAgICAgIH1cbiAgICAgIC8vIGRlZmF1bHQgdG8gZnVsbHNjcmVlblxuICAgICAgZWxzZSB7XG4gICAgICAgIG1vdXNlLnggPSAoIGV2ZW50LmNsaWVudFggLyB3aW5kb3cuaW5uZXJXaWR0aCApICogMiAtIDE7XG4gICAgICAgIG1vdXNlLnkgPSAtICggZXZlbnQuY2xpZW50WSAvIHdpbmRvdy5pbm5lckhlaWdodCApICogMiArIDE7XG4gICAgICB9XG5cbiAgICB9LCBmYWxzZSApO1xuXG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoICdtb3VzZWRvd24nLCBmdW5jdGlvbiggZXZlbnQgKXtcbiAgICAgIGlmIChpbnB1dC5pbnRlcnNlY3Rpb25zLmxlbmd0aCA+IDApIHtcbiAgICAgICAgLy8gcHJldmVudCBtb3VzZSBkb3duIGZyb20gdHJpZ2dlcmluZyBvdGhlciBsaXN0ZW5lcnMgKHBvbHlmaWxsLCBldGMpXG4gICAgICAgIGV2ZW50LnN0b3BJbW1lZGlhdGVQcm9wYWdhdGlvbigpO1xuICAgICAgICBpbnB1dC5wcmVzc2VkID0gdHJ1ZTtcbiAgICAgIH1cbiAgICB9LCB0cnVlICk7XG5cbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lciggJ21vdXNldXAnLCBmdW5jdGlvbiggZXZlbnQgKXtcbiAgICAgIGlucHV0LnByZXNzZWQgPSBmYWxzZTtcbiAgICB9LCBmYWxzZSApO1xuXG5cbiAgICByZXR1cm4gaW5wdXQ7XG4gIH1cblxuXG5cblxuXG4gIC8qXG4gICAgUHVibGljIGZ1bmN0aW9uIHVzZXJzIHJ1biB0byBnaXZlIERBVCBHVUkgYW4gaW5wdXQgZGV2aWNlLlxuICAgIEF1dG9tYXRpY2FsbHkgZGV0ZWN0cyBmb3IgVml2ZUNvbnRyb2xsZXIgYW5kIGJpbmRzIGJ1dHRvbnMgKyBoYXB0aWMgZmVlZGJhY2suXG5cbiAgICBSZXR1cm5zIGEgbGFzZXIgcG9pbnRlciBzbyBpdCBjYW4gYmUgZGlyZWN0bHkgYWRkZWQgdG8gc2NlbmUuXG5cbiAgICBUaGUgbGFzZXIgd2lsbCB0aGVuIGhhdmUgdHdvIG1ldGhvZHM6XG4gICAgbGFzZXIucHJlc3NlZCgpLCBsYXNlci5ncmlwcGVkKClcblxuICAgIFRoZXNlIGNhbiB0aGVuIGJlIGJvdW5kIHRvIGFueSBidXR0b24gdGhlIHVzZXIgd2FudHMuIFVzZWZ1bCBmb3IgYmluZGluZyB0b1xuICAgIGNhcmRib2FyZCBvciBhbHRlcm5hdGUgaW5wdXQgZGV2aWNlcy5cblxuICAgIEZvciBleGFtcGxlLi4uXG4gICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCAnbW91c2Vkb3duJywgZnVuY3Rpb24oKXsgbGFzZXIucHJlc3NlZCggdHJ1ZSApOyB9ICk7XG4gICovXG4gIGZ1bmN0aW9uIGFkZElucHV0T2JqZWN0KCBvYmplY3QgKXtcbiAgICBjb25zdCBpbnB1dCA9IGNyZWF0ZUlucHV0KCBvYmplY3QgKTtcblxuICAgIGlucHV0Lmxhc2VyLnByZXNzZWQgPSBmdW5jdGlvbiggZmxhZyApe1xuICAgICAgLy8gb25seSBwYXkgYXR0ZW50aW9uIHRvIHByZXNzZXMgb3ZlciB0aGUgR1VJXG4gICAgICBpZiAoZmxhZyAmJiAoaW5wdXQuaW50ZXJzZWN0aW9ucy5sZW5ndGggPiAwKSkge1xuICAgICAgICBpbnB1dC5wcmVzc2VkID0gdHJ1ZTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGlucHV0LnByZXNzZWQgPSBmYWxzZTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgaW5wdXQubGFzZXIuZ3JpcHBlZCA9IGZ1bmN0aW9uKCBmbGFnICl7XG4gICAgICBpbnB1dC5ncmlwcGVkID0gZmxhZztcbiAgICB9O1xuXG4gICAgaW5wdXQubGFzZXIuY3Vyc29yID0gaW5wdXQuY3Vyc29yO1xuXG4gICAgaWYoIFRIUkVFLlZpdmVDb250cm9sbGVyICYmIG9iamVjdCBpbnN0YW5jZW9mIFRIUkVFLlZpdmVDb250cm9sbGVyICl7XG4gICAgICBiaW5kVml2ZUNvbnRyb2xsZXIoIGlucHV0LCBvYmplY3QsIGlucHV0Lmxhc2VyLnByZXNzZWQsIGlucHV0Lmxhc2VyLmdyaXBwZWQgKTtcbiAgICB9XG5cbiAgICBpbnB1dE9iamVjdHMucHVzaCggaW5wdXQgKTtcblxuICAgIHJldHVybiBpbnB1dC5sYXNlcjtcbiAgfVxuXG5cblxuXG4gIC8qXG4gICAgSGVyZSBhcmUgdGhlIG1haW4gZGF0IGd1aSBjb250cm9sbGVyIHR5cGVzLlxuICAqL1xuXG4gIGZ1bmN0aW9uIGFkZFNsaWRlciggb2JqZWN0LCBwcm9wZXJ0eU5hbWUsIG1pbiA9IDAuMCwgbWF4ID0gMTAwLjAgKXtcbiAgICBjb25zdCBzbGlkZXIgPSBjcmVhdGVTbGlkZXIoIHtcbiAgICAgIHRleHRDcmVhdG9yLCBwcm9wZXJ0eU5hbWUsIG9iamVjdCwgbWluLCBtYXgsXG4gICAgICBpbml0aWFsVmFsdWU6IG9iamVjdFsgcHJvcGVydHlOYW1lIF1cbiAgICB9KTtcblxuICAgIGNvbnRyb2xsZXJzLnB1c2goIHNsaWRlciApO1xuICAgIGhpdHNjYW5PYmplY3RzLnB1c2goIC4uLnNsaWRlci5oaXRzY2FuIClcblxuICAgIHJldHVybiBzbGlkZXI7XG4gIH1cblxuICBmdW5jdGlvbiBhZGRDaGVja2JveCggb2JqZWN0LCBwcm9wZXJ0eU5hbWUgKXtcbiAgICBjb25zdCBjaGVja2JveCA9IGNyZWF0ZUNoZWNrYm94KHtcbiAgICAgIHRleHRDcmVhdG9yLCBwcm9wZXJ0eU5hbWUsIG9iamVjdCxcbiAgICAgIGluaXRpYWxWYWx1ZTogb2JqZWN0WyBwcm9wZXJ0eU5hbWUgXVxuICAgIH0pO1xuXG4gICAgY29udHJvbGxlcnMucHVzaCggY2hlY2tib3ggKTtcbiAgICBoaXRzY2FuT2JqZWN0cy5wdXNoKCAuLi5jaGVja2JveC5oaXRzY2FuIClcblxuICAgIHJldHVybiBjaGVja2JveDtcbiAgfVxuXG4gIGZ1bmN0aW9uIGFkZEJ1dHRvbiggb2JqZWN0LCBwcm9wZXJ0eU5hbWUgKXtcbiAgICBjb25zdCBidXR0b24gPSBjcmVhdGVCdXR0b24oe1xuICAgICAgdGV4dENyZWF0b3IsIHByb3BlcnR5TmFtZSwgb2JqZWN0XG4gICAgfSk7XG5cbiAgICBjb250cm9sbGVycy5wdXNoKCBidXR0b24gKTtcbiAgICBoaXRzY2FuT2JqZWN0cy5wdXNoKCAuLi5idXR0b24uaGl0c2NhbiApO1xuICAgIHJldHVybiBidXR0b247XG4gIH1cbiAgXG4gIGZ1bmN0aW9uIGFkZEltYWdlQnV0dG9uKGZ1bmMsIGltYWdlKSB7XG4gICAgY29uc3Qgb2JqZWN0ID0geyBmOiBmdW5jIH07XG4gICAgY29uc3QgcHJvcGVydHlOYW1lID0gJ2YnO1xuXG5cbiAgICAvL3NlZSBhbHNvIGZvbGRlci5qcyB3aGVyZSB0aGlzIGlzIGFkZGVkIHRvIGdyb3VwIG9iamVjdC4uLlxuICAgIC8vYXMgc3VjaCB0aGlzIGZ1bmN0aW9uIGFsc28gbmVlZHMgdG8gYmUgcGFzc2VkIGFzIGFuIGFyZ3VtZW50IHRvIGNyZWF0ZUZvbGRlci5cbiAgICAvL3BlcmhhcHMgYWxsIG9mIHRoZXNlICdhZGRYJyBmdW5jdGlvbnMgY291bGQgYmUgaW5pdGlhbGx5IHB1dCBvbnRvIGFuIG9iamVjdCBzbyB0aGF0XG4gICAgLy9uZXcgYWRkaXRpb25zIGNvdWxkIGJlIGFkZGVkIHNsaWdodGx5IG1vcmUgZWFzaWx5LlxuICAgIGNvbnN0IGJ1dHRvbiA9IGNyZWF0ZUltYWdlQnV0dG9uKHtcbiAgICAgIHRleHRDcmVhdG9yLCBvYmplY3QsIHByb3BlcnR5TmFtZSwgaW1hZ2VcbiAgICB9KTtcbiAgICBjb250cm9sbGVycy5wdXNoKCBidXR0b24gKTtcbiAgICBoaXRzY2FuT2JqZWN0cy5wdXNoKCAuLi5idXR0b24uaGl0c2NhbiApOyAvL1BKVDogd2hhdCBkb2VzIHRoaXMgLi4uIGFjdHVhbGx5IG1lYW4/XG4gICAgcmV0dXJuIGJ1dHRvbjtcbiAgfVxuXG4gIGZ1bmN0aW9uIGFkZERyb3Bkb3duKCBvYmplY3QsIHByb3BlcnR5TmFtZSwgb3B0aW9ucyApe1xuICAgIGNvbnN0IGRyb3Bkb3duID0gY3JlYXRlRHJvcGRvd24oe1xuICAgICAgdGV4dENyZWF0b3IsIHByb3BlcnR5TmFtZSwgb2JqZWN0LCBvcHRpb25zXG4gICAgfSk7XG5cbiAgICBjb250cm9sbGVycy5wdXNoKCBkcm9wZG93biApO1xuICAgIGhpdHNjYW5PYmplY3RzLnB1c2goIC4uLmRyb3Bkb3duLmhpdHNjYW4gKTtcbiAgICByZXR1cm4gZHJvcGRvd247XG4gIH1cblxuXG5cblxuXG4gIC8qXG4gICAgQW4gaW1wbGljaXQgQWRkIGZ1bmN0aW9uIHdoaWNoIGRldGVjdHMgZm9yIHByb3BlcnR5IHR5cGVcbiAgICBhbmQgZ2l2ZXMgeW91IHRoZSBjb3JyZWN0IGNvbnRyb2xsZXIuXG5cbiAgICBEcm9wZG93bjpcbiAgICAgIGFkZCggb2JqZWN0LCBwcm9wZXJ0eU5hbWUsIG9iamVjdFR5cGUgKVxuXG4gICAgU2xpZGVyOlxuICAgICAgYWRkKCBvYmplY3QsIHByb3BlcnR5T2ZOdW1iZXJUeXBlLCBtaW4sIG1heCApXG5cbiAgICBDaGVja2JveDpcbiAgICAgIGFkZCggb2JqZWN0LCBwcm9wZXJ0eU9mQm9vbGVhblR5cGUgKVxuXG4gICAgQnV0dG9uOlxuICAgICAgYWRkKCBvYmplY3QsIHByb3BlcnR5T2ZGdW5jdGlvblR5cGUgKVxuXG4gICAgTm90IHVzZWQgZGlyZWN0bHkuIFVzZWQgYnkgZm9sZGVycy5cbiAgKi9cblxuICBmdW5jdGlvbiBhZGQoIG9iamVjdCwgcHJvcGVydHlOYW1lLCBhcmczLCBhcmc0ICl7XG5cbiAgICBpZiggb2JqZWN0ID09PSB1bmRlZmluZWQgKXtcbiAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgfVxuICAgIGVsc2VcblxuICAgIGlmKCBvYmplY3RbIHByb3BlcnR5TmFtZSBdID09PSB1bmRlZmluZWQgKXtcbiAgICAgIGNvbnNvbGUud2FybiggJ25vIHByb3BlcnR5IG5hbWVkJywgcHJvcGVydHlOYW1lLCAnb24gb2JqZWN0Jywgb2JqZWN0ICk7XG4gICAgICByZXR1cm4gbmV3IFRIUkVFLkdyb3VwKCk7XG4gICAgfVxuXG4gICAgaWYoIGlzT2JqZWN0KCBhcmczICkgfHwgaXNBcnJheSggYXJnMyApICl7XG4gICAgICByZXR1cm4gYWRkRHJvcGRvd24oIG9iamVjdCwgcHJvcGVydHlOYW1lLCBhcmczICk7XG4gICAgfVxuXG4gICAgaWYoIGlzTnVtYmVyKCBvYmplY3RbIHByb3BlcnR5TmFtZV0gKSApe1xuICAgICAgcmV0dXJuIGFkZFNsaWRlciggb2JqZWN0LCBwcm9wZXJ0eU5hbWUsIGFyZzMsIGFyZzQgKTtcbiAgICB9XG5cbiAgICBpZiggaXNCb29sZWFuKCBvYmplY3RbIHByb3BlcnR5TmFtZV0gKSApe1xuICAgICAgcmV0dXJuIGFkZENoZWNrYm94KCBvYmplY3QsIHByb3BlcnR5TmFtZSApO1xuICAgIH1cblxuICAgIGlmKCBpc0Z1bmN0aW9uKCBvYmplY3RbIHByb3BlcnR5TmFtZSBdICkgKXtcbiAgICAgIHJldHVybiBhZGRCdXR0b24oIG9iamVjdCwgcHJvcGVydHlOYW1lICk7XG4gICAgfVxuXG4gICAgLy8gIGFkZCBjb3VsZG4ndCBmaWd1cmUgaXQgb3V0LCBwYXNzIGl0IGJhY2sgdG8gZm9sZGVyXG4gICAgcmV0dXJuIHVuZGVmaW5lZFxuICB9XG5cblxuICBmdW5jdGlvbiBhZGRTaW1wbGVTbGlkZXIoIG1pbiA9IDAsIG1heCA9IDEgKXtcbiAgICBjb25zdCBwcm94eSA9IHtcbiAgICAgIG51bWJlcjogbWluXG4gICAgfTtcblxuICAgIHJldHVybiBhZGRTbGlkZXIoIHByb3h5LCAnbnVtYmVyJywgbWluLCBtYXggKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGFkZFNpbXBsZURyb3Bkb3duKCBvcHRpb25zID0gW10gKXtcbiAgICBjb25zdCBwcm94eSA9IHtcbiAgICAgIG9wdGlvbjogJydcbiAgICB9O1xuXG4gICAgaWYoIG9wdGlvbnMgIT09IHVuZGVmaW5lZCApe1xuICAgICAgcHJveHkub3B0aW9uID0gaXNBcnJheSggb3B0aW9ucyApID8gb3B0aW9uc1sgMCBdIDogb3B0aW9uc1sgT2JqZWN0LmtleXMob3B0aW9ucylbMF0gXTtcbiAgICB9XG5cbiAgICByZXR1cm4gYWRkRHJvcGRvd24oIHByb3h5LCAnb3B0aW9uJywgb3B0aW9ucyApO1xuICB9XG5cbiAgZnVuY3Rpb24gYWRkU2ltcGxlQ2hlY2tib3goIGRlZmF1bHRPcHRpb24gPSBmYWxzZSApe1xuICAgIGNvbnN0IHByb3h5ID0ge1xuICAgICAgY2hlY2tlZDogZGVmYXVsdE9wdGlvblxuICAgIH07XG5cbiAgICByZXR1cm4gYWRkQ2hlY2tib3goIHByb3h5LCAnY2hlY2tlZCcgKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGFkZFNpbXBsZUJ1dHRvbiggZm4gKXtcbiAgICBjb25zdCBwcm94eSA9IHtcbiAgICAgIGJ1dHRvbjogKGZuIT09dW5kZWZpbmVkKSA/IGZuIDogZnVuY3Rpb24oKXt9XG4gICAgfTtcblxuICAgIHJldHVybiBhZGRCdXR0b24oIHByb3h5LCAnYnV0dG9uJyApO1xuICB9XG5cblxuXG4gIC8qXG4gICAgQ3JlYXRlcyBhIGZvbGRlciB3aXRoIHRoZSBuYW1lLlxuXG4gICAgRm9sZGVycyBhcmUgVEhSRUUuR3JvdXAgdHlwZSBvYmplY3RzIGFuZCBjYW4gZG8gZ3JvdXAuYWRkKCkgZm9yIHNpYmxpbmdzLlxuICAgIEZvbGRlcnMgd2lsbCBhdXRvbWF0aWNhbGx5IGF0dGVtcHQgdG8gbGF5IGl0cyBjaGlsZHJlbiBvdXQgaW4gc2VxdWVuY2UuXG5cbiAgICBGb2xkZXJzIGFyZSBnaXZlbiB0aGUgYWRkKCkgZnVuY3Rpb25hbGl0eSBzbyB0aGF0IHRoZXkgY2FuIGRvXG4gICAgZm9sZGVyLmFkZCggLi4uICkgdG8gY3JlYXRlIGNvbnRyb2xsZXJzLlxuICAqL1xuXG4gIGZ1bmN0aW9uIGNyZWF0ZSggbmFtZSApe1xuICAgIGNvbnN0IGZvbGRlciA9IGNyZWF0ZUZvbGRlcih7XG4gICAgICB0ZXh0Q3JlYXRvcixcbiAgICAgIG5hbWUsXG4gICAgICBndWlBZGQ6IGFkZCxcbiAgICAgIGFkZFNsaWRlcjogYWRkU2ltcGxlU2xpZGVyLFxuICAgICAgYWRkRHJvcGRvd246IGFkZFNpbXBsZURyb3Bkb3duLFxuICAgICAgYWRkQ2hlY2tib3g6IGFkZFNpbXBsZUNoZWNrYm94LFxuICAgICAgYWRkQnV0dG9uOiBhZGRTaW1wbGVCdXR0b24sXG4gICAgICBhZGRJbWFnZUJ1dHRvbjogYWRkSW1hZ2VCdXR0b25cbiAgICB9KTtcblxuICAgIGNvbnRyb2xsZXJzLnB1c2goIGZvbGRlciApO1xuICAgIGlmKCBmb2xkZXIuaGl0c2NhbiApe1xuICAgICAgaGl0c2Nhbk9iamVjdHMucHVzaCggLi4uZm9sZGVyLmhpdHNjYW4gKTtcbiAgICB9XG5cbiAgICByZXR1cm4gZm9sZGVyO1xuICB9XG5cblxuXG5cblxuICAvKlxuICAgIFBlcmZvcm0gdGhlIG5lY2Vzc2FyeSB1cGRhdGVzLCByYXljYXN0cyBvbiBpdHMgb3duIFJBRi5cbiAgKi9cblxuICBjb25zdCB0UG9zaXRpb24gPSBuZXcgVEhSRUUuVmVjdG9yMygpO1xuICBjb25zdCB0RGlyZWN0aW9uID0gbmV3IFRIUkVFLlZlY3RvcjMoIDAsIDAsIC0xICk7XG4gIGNvbnN0IHRNYXRyaXggPSBuZXcgVEhSRUUuTWF0cml4NCgpO1xuXG4gIGZ1bmN0aW9uIHVwZGF0ZSgpIHtcbiAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoIHVwZGF0ZSApO1xuXG4gICAgdmFyIGhpdHNjYW5PYmplY3RzID0gZ2V0VmlzaWJsZUhpdHNjYW5PYmplY3RzKCk7XG5cbiAgICBpZiggbW91c2VFbmFibGVkICl7XG4gICAgICBtb3VzZUlucHV0LmludGVyc2VjdGlvbnMgPSBwZXJmb3JtTW91c2VJbnB1dCggaGl0c2Nhbk9iamVjdHMsIG1vdXNlSW5wdXQgKTtcbiAgICB9XG5cbiAgICBpbnB1dE9iamVjdHMuZm9yRWFjaCggZnVuY3Rpb24oIHtib3gsb2JqZWN0LHJheWNhc3QsbGFzZXIsY3Vyc29yfSA9IHt9LCBpbmRleCApe1xuICAgICAgb2JqZWN0LnVwZGF0ZU1hdHJpeFdvcmxkKCk7XG5cbiAgICAgIHRQb3NpdGlvbi5zZXQoMCwwLDApLnNldEZyb21NYXRyaXhQb3NpdGlvbiggb2JqZWN0Lm1hdHJpeFdvcmxkICk7XG4gICAgICB0TWF0cml4LmlkZW50aXR5KCkuZXh0cmFjdFJvdGF0aW9uKCBvYmplY3QubWF0cml4V29ybGQgKTtcbiAgICAgIHREaXJlY3Rpb24uc2V0KDAsMCwtMSkuYXBwbHlNYXRyaXg0KCB0TWF0cml4ICkubm9ybWFsaXplKCk7XG5cbiAgICAgIHJheWNhc3Quc2V0KCB0UG9zaXRpb24sIHREaXJlY3Rpb24gKTtcblxuICAgICAgbGFzZXIuZ2VvbWV0cnkudmVydGljZXNbIDAgXS5jb3B5KCB0UG9zaXRpb24gKTtcblxuICAgICAgLy8gIGRlYnVnLi4uXG4gICAgICAvLyBsYXNlci5nZW9tZXRyeS52ZXJ0aWNlc1sgMSBdLmNvcHkoIHRQb3NpdGlvbiApLmFkZCggdERpcmVjdGlvbi5tdWx0aXBseVNjYWxhciggMSApICk7XG5cbiAgICAgIGNvbnN0IGludGVyc2VjdGlvbnMgPSByYXljYXN0LmludGVyc2VjdE9iamVjdHMoIGhpdHNjYW5PYmplY3RzLCBmYWxzZSApO1xuICAgICAgcGFyc2VJbnRlcnNlY3Rpb25zKCBpbnRlcnNlY3Rpb25zLCBsYXNlciwgY3Vyc29yICk7XG5cbiAgICAgIGlucHV0T2JqZWN0c1sgaW5kZXggXS5pbnRlcnNlY3Rpb25zID0gaW50ZXJzZWN0aW9ucztcbiAgICB9KTtcblxuICAgIGNvbnN0IGlucHV0cyA9IGlucHV0T2JqZWN0cy5zbGljZSgpO1xuXG4gICAgaWYoIG1vdXNlRW5hYmxlZCApe1xuICAgICAgaW5wdXRzLnB1c2goIG1vdXNlSW5wdXQgKTtcbiAgICB9XG5cbiAgICBjb250cm9sbGVycy5mb3JFYWNoKCBmdW5jdGlvbiggY29udHJvbGxlciApe1xuICAgICAgLy9uYiwgd2UgY291bGQgZG8gYSBtb3JlIHRob3JvdWdoIGNoZWNrIGZvciB2aXNpYmlsdHksIG5vdCBzdXJlIGhvdyBpbXBvcnRhbnRcbiAgICAgIC8vdGhpcyBiaXQgaXMgYXQgdGhpcyBzdGFnZS4uLlxuICAgICAgaWYgKGNvbnRyb2xsZXIudmlzaWJsZSkgY29udHJvbGxlci51cGRhdGUoIGlucHV0cyApO1xuICAgIH0pO1xuICB9XG5cbiAgZnVuY3Rpb24gdXBkYXRlTGFzZXIoIGxhc2VyLCBwb2ludCApe1xuICAgIGxhc2VyLmdlb21ldHJ5LnZlcnRpY2VzWyAxIF0uY29weSggcG9pbnQgKTtcbiAgICBsYXNlci52aXNpYmxlID0gdHJ1ZTtcbiAgICBsYXNlci5nZW9tZXRyeS5jb21wdXRlQm91bmRpbmdTcGhlcmUoKTtcbiAgICBsYXNlci5nZW9tZXRyeS5jb21wdXRlQm91bmRpbmdCb3goKTtcbiAgICBsYXNlci5nZW9tZXRyeS52ZXJ0aWNlc05lZWRVcGRhdGUgPSB0cnVlO1xuICB9XG5cbiAgZnVuY3Rpb24gcGFyc2VJbnRlcnNlY3Rpb25zKCBpbnRlcnNlY3Rpb25zLCBsYXNlciwgY3Vyc29yICl7XG4gICAgaWYoIGludGVyc2VjdGlvbnMubGVuZ3RoID4gMCApe1xuICAgICAgY29uc3QgZmlyc3RIaXQgPSBpbnRlcnNlY3Rpb25zWyAwIF07XG4gICAgICB1cGRhdGVMYXNlciggbGFzZXIsIGZpcnN0SGl0LnBvaW50ICk7XG4gICAgICBjdXJzb3IucG9zaXRpb24uY29weSggZmlyc3RIaXQucG9pbnQgKTtcbiAgICAgIGN1cnNvci52aXNpYmxlID0gdHJ1ZTtcbiAgICAgIGN1cnNvci51cGRhdGVNYXRyaXhXb3JsZCgpO1xuICAgIH1cbiAgICBlbHNle1xuICAgICAgbGFzZXIudmlzaWJsZSA9IGZhbHNlO1xuICAgICAgY3Vyc29yLnZpc2libGUgPSBmYWxzZTtcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBwYXJzZU1vdXNlSW50ZXJzZWN0aW9uKCBpbnRlcnNlY3Rpb24sIGxhc2VyLCBjdXJzb3IgKXtcbiAgICBjdXJzb3IucG9zaXRpb24uY29weSggaW50ZXJzZWN0aW9uICk7XG4gICAgdXBkYXRlTGFzZXIoIGxhc2VyLCBjdXJzb3IucG9zaXRpb24gKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHBlcmZvcm1Nb3VzZUludGVyc2VjdGlvbiggcmF5Y2FzdCwgbW91c2UsIGNhbWVyYSApe1xuICAgIHJheWNhc3Quc2V0RnJvbUNhbWVyYSggbW91c2UsIGNhbWVyYSApO1xuICAgIGNvbnN0IGhpdHNjYW5PYmplY3RzID0gZ2V0VmlzaWJsZUhpdHNjYW5PYmplY3RzKCk7XG4gICAgcmV0dXJuIHJheWNhc3QuaW50ZXJzZWN0T2JqZWN0cyggaGl0c2Nhbk9iamVjdHMsIGZhbHNlICk7XG4gIH1cblxuICBmdW5jdGlvbiBtb3VzZUludGVyc2VjdHNQbGFuZSggcmF5Y2FzdCwgdiwgcGxhbmUgKXtcbiAgICByZXR1cm4gcmF5Y2FzdC5yYXkuaW50ZXJzZWN0UGxhbmUoIHBsYW5lLCB2ICk7XG4gIH1cblxuICBmdW5jdGlvbiBwZXJmb3JtTW91c2VJbnB1dCggaGl0c2Nhbk9iamVjdHMsIHtib3gsb2JqZWN0LHJheWNhc3QsbGFzZXIsY3Vyc29yLG1vdXNlLG1vdXNlQ2FtZXJhfSA9IHt9ICl7XG4gICAgbGV0IGludGVyc2VjdGlvbnMgPSBbXTtcblxuICAgIGlmIChtb3VzZUNhbWVyYSkge1xuICAgICAgaW50ZXJzZWN0aW9ucyA9IHBlcmZvcm1Nb3VzZUludGVyc2VjdGlvbiggcmF5Y2FzdCwgbW91c2UsIG1vdXNlQ2FtZXJhICk7XG4gICAgICBwYXJzZUludGVyc2VjdGlvbnMoIGludGVyc2VjdGlvbnMsIGxhc2VyLCBjdXJzb3IgKTtcbiAgICAgIGN1cnNvci52aXNpYmxlID0gdHJ1ZTtcbiAgICAgIGxhc2VyLnZpc2libGUgPSB0cnVlO1xuICAgIH1cblxuICAgIHJldHVybiBpbnRlcnNlY3Rpb25zO1xuICB9XG5cbiAgdXBkYXRlKCk7XG5cblxuXG5cblxuICAvKlxuICAgIFB1YmxpYyBtZXRob2RzLlxuICAqL1xuXG4gIHJldHVybiB7XG4gICAgY3JlYXRlLFxuICAgIGFkZElucHV0T2JqZWN0LFxuICAgIGVuYWJsZU1vdXNlLFxuICAgIGRpc2FibGVNb3VzZVxuICB9O1xuXG59KCkpO1xuXG5pZiggd2luZG93ICl7XG4gIGlmKCB3aW5kb3cuZGF0ID09PSB1bmRlZmluZWQgKXtcbiAgICB3aW5kb3cuZGF0ID0ge307XG4gIH1cblxuICB3aW5kb3cuZGF0LkdVSVZSID0gR1VJVlI7XG59XG5cbmlmKCBtb2R1bGUgKXtcbiAgbW9kdWxlLmV4cG9ydHMgPSB7XG4gICAgZGF0OiBHVUlWUlxuICB9O1xufVxuXG5pZih0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQpIHtcbiAgZGVmaW5lKFtdLCBHVUlWUik7XG59XG5cbi8qXG4gIEJ1bmNoIG9mIHN0YXRlLWxlc3MgdXRpbGl0eSBmdW5jdGlvbnMuXG4qL1xuXG5mdW5jdGlvbiBpc051bWJlcihuKSB7XG4gIHJldHVybiAhaXNOYU4ocGFyc2VGbG9hdChuKSkgJiYgaXNGaW5pdGUobik7XG59XG5cbmZ1bmN0aW9uIGlzQm9vbGVhbihuKXtcbiAgcmV0dXJuIHR5cGVvZiBuID09PSAnYm9vbGVhbic7XG59XG5cbmZ1bmN0aW9uIGlzRnVuY3Rpb24oZnVuY3Rpb25Ub0NoZWNrKSB7XG4gIGNvbnN0IGdldFR5cGUgPSB7fTtcbiAgcmV0dXJuIGZ1bmN0aW9uVG9DaGVjayAmJiBnZXRUeXBlLnRvU3RyaW5nLmNhbGwoZnVuY3Rpb25Ub0NoZWNrKSA9PT0gJ1tvYmplY3QgRnVuY3Rpb25dJztcbn1cblxuLy8gIG9ubHkge30gb2JqZWN0cyBub3QgYXJyYXlzXG4vLyAgICAgICAgICAgICAgICAgICAgd2hpY2ggYXJlIHRlY2huaWNhbGx5IG9iamVjdHMgYnV0IHlvdSdyZSBqdXN0IGJlaW5nIHBlZGFudGljXG5mdW5jdGlvbiBpc09iamVjdCAoaXRlbSkge1xuICByZXR1cm4gKHR5cGVvZiBpdGVtID09PSAnb2JqZWN0JyAmJiAhQXJyYXkuaXNBcnJheShpdGVtKSAmJiBpdGVtICE9PSBudWxsKTtcbn1cblxuZnVuY3Rpb24gaXNBcnJheSggbyApe1xuICByZXR1cm4gQXJyYXkuaXNBcnJheSggbyApO1xufVxuXG5cblxuXG5cblxuXG4vKlxuICBDb250cm9sbGVyLXNwZWNpZmljIHN1cHBvcnQuXG4qL1xuXG5mdW5jdGlvbiBiaW5kVml2ZUNvbnRyb2xsZXIoIGlucHV0LCBjb250cm9sbGVyLCBwcmVzc2VkLCBncmlwcGVkICl7XG4gIGNvbnRyb2xsZXIuYWRkRXZlbnRMaXN0ZW5lciggJ3RyaWdnZXJkb3duJywgKCk9PnByZXNzZWQoIHRydWUgKSApO1xuICBjb250cm9sbGVyLmFkZEV2ZW50TGlzdGVuZXIoICd0cmlnZ2VydXAnLCAoKT0+cHJlc3NlZCggZmFsc2UgKSApO1xuICBjb250cm9sbGVyLmFkZEV2ZW50TGlzdGVuZXIoICdncmlwc2Rvd24nLCAoKT0+Z3JpcHBlZCggdHJ1ZSApICk7XG4gIGNvbnRyb2xsZXIuYWRkRXZlbnRMaXN0ZW5lciggJ2dyaXBzdXAnLCAoKT0+Z3JpcHBlZCggZmFsc2UgKSApO1xuXG4gIGNvbnN0IGdhbWVwYWQgPSBjb250cm9sbGVyLmdldEdhbWVwYWQoKTtcbiAgZnVuY3Rpb24gdmlicmF0ZSggdCwgYSApe1xuICAgIGlmKCBnYW1lcGFkICYmIGdhbWVwYWQuaGFwdGljQWN0dWF0b3JzLmxlbmd0aCA+IDAgKXtcbiAgICAgIGdhbWVwYWQuaGFwdGljQWN0dWF0b3JzWyAwIF0ucHVsc2UoIHQsIGEgKTtcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBoYXB0aWNzVGFwKCl7XG4gICAgc2V0SW50ZXJ2YWxUaW1lcyggKHgsdCxhKT0+dmlicmF0ZSgxLWEsIDAuNSksIDEwLCAyMCApO1xuICB9XG5cbiAgZnVuY3Rpb24gaGFwdGljc0VjaG8oKXtcbiAgICBzZXRJbnRlcnZhbFRpbWVzKCAoeCx0LGEpPT52aWJyYXRlKDQsIDEuMCAqICgxLWEpKSwgMTAwLCA0ICk7XG4gIH1cblxuICBpbnB1dC5ldmVudHMub24oICdvbkNvbnRyb2xsZXJIZWxkJywgZnVuY3Rpb24oIGlucHV0ICl7XG4gICAgdmlicmF0ZSggMC4zLCAwLjMgKTtcbiAgfSk7XG5cbiAgaW5wdXQuZXZlbnRzLm9uKCAnZ3JhYmJlZCcsIGZ1bmN0aW9uKCl7XG4gICAgaGFwdGljc1RhcCgpO1xuICB9KTtcblxuICBpbnB1dC5ldmVudHMub24oICdncmFiUmVsZWFzZWQnLCBmdW5jdGlvbigpe1xuICAgIGhhcHRpY3NFY2hvKCk7XG4gIH0pO1xuXG4gIGlucHV0LmV2ZW50cy5vbiggJ3Bpbm5lZCcsIGZ1bmN0aW9uKCl7XG4gICAgaGFwdGljc1RhcCgpO1xuICB9KTtcblxuICBpbnB1dC5ldmVudHMub24oICdwaW5SZWxlYXNlZCcsIGZ1bmN0aW9uKCl7XG4gICAgaGFwdGljc0VjaG8oKTtcbiAgfSk7XG5cblxuXG59XG5cbmZ1bmN0aW9uIHNldEludGVydmFsVGltZXMoIGNiLCBkZWxheSwgdGltZXMgKXtcbiAgbGV0IHggPSAwO1xuICBsZXQgaWQgPSBzZXRJbnRlcnZhbCggZnVuY3Rpb24oKXtcbiAgICBjYiggeCwgdGltZXMsIHgvdGltZXMgKTtcbiAgICB4Kys7XG4gICAgaWYoIHg+PXRpbWVzICl7XG4gICAgICBjbGVhckludGVydmFsKCBpZCApO1xuICAgIH1cbiAgfSwgZGVsYXkgKTtcbiAgcmV0dXJuIGlkO1xufSIsIi8qKlxuKiBkYXQtZ3VpVlIgSmF2YXNjcmlwdCBDb250cm9sbGVyIExpYnJhcnkgZm9yIFZSXG4qIGh0dHBzOi8vZ2l0aHViLmNvbS9kYXRhYXJ0cy9kYXQuZ3VpVlJcbipcbiogQ29weXJpZ2h0IDIwMTYgRGF0YSBBcnRzIFRlYW0sIEdvb2dsZSBJbmMuXG4qXG4qIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4qIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4qXG4qICAgICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbipcbiogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4qIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4qIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuKi9cbmltcG9ydCBFbWl0dGVyIGZyb20gJ2V2ZW50cyc7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGNyZWF0ZUludGVyYWN0aW9uKCBoaXRWb2x1bWUgKXtcbiAgY29uc3QgZXZlbnRzID0gbmV3IEVtaXR0ZXIoKTtcblxuICBsZXQgYW55SG92ZXIgPSBmYWxzZTtcbiAgbGV0IGFueVByZXNzaW5nID0gZmFsc2U7XG5cbiAgbGV0IGhvdmVyID0gZmFsc2U7XG4gIGxldCBhbnlBY3RpdmUgPSBmYWxzZTtcblxuICBjb25zdCB0VmVjdG9yID0gbmV3IFRIUkVFLlZlY3RvcjMoKTtcbiAgY29uc3QgYXZhaWxhYmxlSW5wdXRzID0gW107XG5cbiAgZnVuY3Rpb24gdXBkYXRlKCBpbnB1dE9iamVjdHMgKXtcblxuICAgIGhvdmVyID0gZmFsc2U7XG4gICAgYW55UHJlc3NpbmcgPSBmYWxzZTtcbiAgICBhbnlBY3RpdmUgPSBmYWxzZTtcblxuICAgIGlucHV0T2JqZWN0cy5mb3JFYWNoKCBmdW5jdGlvbiggaW5wdXQgKXtcblxuICAgICAgaWYoIGF2YWlsYWJsZUlucHV0cy5pbmRleE9mKCBpbnB1dCApIDwgMCApe1xuICAgICAgICBhdmFpbGFibGVJbnB1dHMucHVzaCggaW5wdXQgKTtcbiAgICAgIH1cblxuICAgICAgY29uc3QgeyBoaXRPYmplY3QsIGhpdFBvaW50IH0gPSBleHRyYWN0SGl0KCBpbnB1dCApO1xuXG4gICAgICBob3ZlciA9IGhvdmVyIHx8IGhpdFZvbHVtZSA9PT0gaGl0T2JqZWN0O1xuXG4gICAgICBwZXJmb3JtU3RhdGVFdmVudHMoe1xuICAgICAgICBpbnB1dCxcbiAgICAgICAgaG92ZXIsXG4gICAgICAgIGhpdE9iamVjdCwgaGl0UG9pbnQsXG4gICAgICAgIGJ1dHRvbk5hbWU6ICdwcmVzc2VkJyxcbiAgICAgICAgaW50ZXJhY3Rpb25OYW1lOiAncHJlc3MnLFxuICAgICAgICBkb3duTmFtZTogJ29uUHJlc3NlZCcsXG4gICAgICAgIGhvbGROYW1lOiAncHJlc3NpbmcnLFxuICAgICAgICB1cE5hbWU6ICdvblJlbGVhc2VkJ1xuICAgICAgfSk7XG5cbiAgICAgIHBlcmZvcm1TdGF0ZUV2ZW50cyh7XG4gICAgICAgIGlucHV0LFxuICAgICAgICBob3ZlcixcbiAgICAgICAgaGl0T2JqZWN0LCBoaXRQb2ludCxcbiAgICAgICAgYnV0dG9uTmFtZTogJ2dyaXBwZWQnLFxuICAgICAgICBpbnRlcmFjdGlvbk5hbWU6ICdncmlwJyxcbiAgICAgICAgZG93bk5hbWU6ICdvbkdyaXBwZWQnLFxuICAgICAgICBob2xkTmFtZTogJ2dyaXBwaW5nJyxcbiAgICAgICAgdXBOYW1lOiAnb25SZWxlYXNlR3JpcCdcbiAgICAgIH0pO1xuXG4gICAgICBldmVudHMuZW1pdCggJ3RpY2snLCB7XG4gICAgICAgIGlucHV0LFxuICAgICAgICBoaXRPYmplY3QsXG4gICAgICAgIGlucHV0T2JqZWN0OiBpbnB1dC5vYmplY3RcbiAgICAgIH0gKTtcblxuICAgIH0pO1xuXG4gIH1cblxuICBmdW5jdGlvbiBleHRyYWN0SGl0KCBpbnB1dCApe1xuICAgIGlmKCBpbnB1dC5pbnRlcnNlY3Rpb25zLmxlbmd0aCA8PSAwICl7XG4gICAgICByZXR1cm4ge1xuICAgICAgICBoaXRQb2ludDogdFZlY3Rvci5zZXRGcm9tTWF0cml4UG9zaXRpb24oIGlucHV0LmN1cnNvci5tYXRyaXhXb3JsZCApLmNsb25lKCksXG4gICAgICAgIGhpdE9iamVjdDogdW5kZWZpbmVkLFxuICAgICAgfTtcbiAgICB9XG4gICAgZWxzZXtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIGhpdFBvaW50OiBpbnB1dC5pbnRlcnNlY3Rpb25zWyAwIF0ucG9pbnQsXG4gICAgICAgIGhpdE9iamVjdDogaW5wdXQuaW50ZXJzZWN0aW9uc1sgMCBdLm9iamVjdFxuICAgICAgfTtcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBwZXJmb3JtU3RhdGVFdmVudHMoe1xuICAgIGlucHV0LCBob3ZlcixcbiAgICBoaXRPYmplY3QsIGhpdFBvaW50LFxuICAgIGJ1dHRvbk5hbWUsIGludGVyYWN0aW9uTmFtZSwgZG93bk5hbWUsIGhvbGROYW1lLCB1cE5hbWVcbiAgfSA9IHt9ICl7XG5cbiAgICBpZiggaW5wdXRbIGJ1dHRvbk5hbWUgXSA9PT0gdHJ1ZSAmJiBoaXRPYmplY3QgPT09IHVuZGVmaW5lZCApe1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIC8vICBob3ZlcmluZyBhbmQgYnV0dG9uIGRvd24gYnV0IG5vIGludGVyYWN0aW9ucyBhY3RpdmUgeWV0XG4gICAgaWYoIGhvdmVyICYmIGlucHV0WyBidXR0b25OYW1lIF0gPT09IHRydWUgJiYgaW5wdXQuaW50ZXJhY3Rpb25bIGludGVyYWN0aW9uTmFtZSBdID09PSB1bmRlZmluZWQgKXtcblxuICAgICAgY29uc3QgcGF5bG9hZCA9IHtcbiAgICAgICAgaW5wdXQsXG4gICAgICAgIGhpdE9iamVjdCxcbiAgICAgICAgcG9pbnQ6IGhpdFBvaW50LFxuICAgICAgICBpbnB1dE9iamVjdDogaW5wdXQub2JqZWN0LFxuICAgICAgICBsb2NrZWQ6IGZhbHNlXG4gICAgICB9O1xuICAgICAgZXZlbnRzLmVtaXQoIGRvd25OYW1lLCBwYXlsb2FkICk7XG5cbiAgICAgIGlmKCBwYXlsb2FkLmxvY2tlZCApe1xuICAgICAgICBpbnB1dC5pbnRlcmFjdGlvblsgaW50ZXJhY3Rpb25OYW1lIF0gPSBpbnRlcmFjdGlvbjtcbiAgICAgICAgaW5wdXQuaW50ZXJhY3Rpb24uaG92ZXIgPSBpbnRlcmFjdGlvbjtcbiAgICAgIH1cblxuICAgICAgYW55UHJlc3NpbmcgPSB0cnVlO1xuICAgICAgYW55QWN0aXZlID0gdHJ1ZTtcbiAgICB9XG5cbiAgICAvLyAgYnV0dG9uIHN0aWxsIGRvd24gYW5kIHRoaXMgaXMgdGhlIGFjdGl2ZSBpbnRlcmFjdGlvblxuICAgIGlmKCBpbnB1dFsgYnV0dG9uTmFtZSBdICYmIGlucHV0LmludGVyYWN0aW9uWyBpbnRlcmFjdGlvbk5hbWUgXSA9PT0gaW50ZXJhY3Rpb24gKXtcbiAgICAgIGNvbnN0IHBheWxvYWQgPSB7XG4gICAgICAgIGlucHV0LFxuICAgICAgICBoaXRPYmplY3QsXG4gICAgICAgIHBvaW50OiBoaXRQb2ludCxcbiAgICAgICAgaW5wdXRPYmplY3Q6IGlucHV0Lm9iamVjdCxcbiAgICAgICAgbG9ja2VkOiBmYWxzZVxuICAgICAgfTtcblxuICAgICAgZXZlbnRzLmVtaXQoIGhvbGROYW1lLCBwYXlsb2FkICk7XG5cbiAgICAgIGFueVByZXNzaW5nID0gdHJ1ZTtcblxuICAgICAgaW5wdXQuZXZlbnRzLmVtaXQoICdvbkNvbnRyb2xsZXJIZWxkJyApO1xuICAgIH1cblxuICAgIC8vICBidXR0b24gbm90IGRvd24gYW5kIHRoaXMgaXMgdGhlIGFjdGl2ZSBpbnRlcmFjdGlvblxuICAgIGlmKCBpbnB1dFsgYnV0dG9uTmFtZSBdID09PSBmYWxzZSAmJiBpbnB1dC5pbnRlcmFjdGlvblsgaW50ZXJhY3Rpb25OYW1lIF0gPT09IGludGVyYWN0aW9uICl7XG4gICAgICBpbnB1dC5pbnRlcmFjdGlvblsgaW50ZXJhY3Rpb25OYW1lIF0gPSB1bmRlZmluZWQ7XG4gICAgICBpbnB1dC5pbnRlcmFjdGlvbi5ob3ZlciA9IHVuZGVmaW5lZDtcbiAgICAgIGV2ZW50cy5lbWl0KCB1cE5hbWUsIHtcbiAgICAgICAgaW5wdXQsXG4gICAgICAgIGhpdE9iamVjdCxcbiAgICAgICAgcG9pbnQ6IGhpdFBvaW50LFxuICAgICAgICBpbnB1dE9iamVjdDogaW5wdXQub2JqZWN0XG4gICAgICB9KTtcbiAgICB9XG5cbiAgfVxuXG4gIGZ1bmN0aW9uIGlzTWFpbkhvdmVyKCl7XG5cbiAgICBsZXQgbm9NYWluSG92ZXIgPSB0cnVlO1xuICAgIGZvciggbGV0IGk9MDsgaTxhdmFpbGFibGVJbnB1dHMubGVuZ3RoOyBpKysgKXtcbiAgICAgIGlmKCBhdmFpbGFibGVJbnB1dHNbIGkgXS5pbnRlcmFjdGlvbi5ob3ZlciAhPT0gdW5kZWZpbmVkICl7XG4gICAgICAgIG5vTWFpbkhvdmVyID0gZmFsc2U7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmKCBub01haW5Ib3ZlciApe1xuICAgICAgcmV0dXJuIGhvdmVyO1xuICAgIH1cblxuICAgIGlmKCBhdmFpbGFibGVJbnB1dHMuZmlsdGVyKCBmdW5jdGlvbiggaW5wdXQgKXtcbiAgICAgIHJldHVybiBpbnB1dC5pbnRlcmFjdGlvbi5ob3ZlciA9PT0gaW50ZXJhY3Rpb247XG4gICAgfSkubGVuZ3RoID4gMCApe1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuXG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cblxuICBjb25zdCBpbnRlcmFjdGlvbiA9IHtcbiAgICBob3ZlcmluZzogaXNNYWluSG92ZXIsXG4gICAgcHJlc3Npbmc6ICgpPT5hbnlQcmVzc2luZyxcbiAgICB1cGRhdGUsXG4gICAgZXZlbnRzXG4gIH07XG5cbiAgcmV0dXJuIGludGVyYWN0aW9uO1xufSIsIi8qKlxuKiBkYXQtZ3VpVlIgSmF2YXNjcmlwdCBDb250cm9sbGVyIExpYnJhcnkgZm9yIFZSXG4qIGh0dHBzOi8vZ2l0aHViLmNvbS9kYXRhYXJ0cy9kYXQuZ3VpVlJcbipcbiogQ29weXJpZ2h0IDIwMTYgRGF0YSBBcnRzIFRlYW0sIEdvb2dsZSBJbmMuXG4qXG4qIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4qIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4qXG4qICAgICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbipcbiogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4qIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4qIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuKi9cblxuaW1wb3J0ICogYXMgU2hhcmVkTWF0ZXJpYWxzIGZyb20gJy4vc2hhcmVkbWF0ZXJpYWxzJztcbmltcG9ydCAqIGFzIENvbG9ycyBmcm9tICcuL2NvbG9ycyc7XG5cbmV4cG9ydCBmdW5jdGlvbiBhbGlnbkxlZnQoIG9iaiApe1xuICBpZiggb2JqIGluc3RhbmNlb2YgVEhSRUUuTWVzaCApe1xuICAgIG9iai5nZW9tZXRyeS5jb21wdXRlQm91bmRpbmdCb3goKTtcbiAgICBjb25zdCB3aWR0aCA9IG9iai5nZW9tZXRyeS5ib3VuZGluZ0JveC5tYXgueCAtIG9iai5nZW9tZXRyeS5ib3VuZGluZ0JveC5tYXgueTtcbiAgICBvYmouZ2VvbWV0cnkudHJhbnNsYXRlKCB3aWR0aCwgMCwgMCApO1xuICAgIHJldHVybiBvYmo7XG4gIH1cbiAgZWxzZSBpZiggb2JqIGluc3RhbmNlb2YgVEhSRUUuR2VvbWV0cnkgKXtcbiAgICBvYmouY29tcHV0ZUJvdW5kaW5nQm94KCk7XG4gICAgY29uc3Qgd2lkdGggPSBvYmouYm91bmRpbmdCb3gubWF4LnggLSBvYmouYm91bmRpbmdCb3gubWF4Lnk7XG4gICAgb2JqLnRyYW5zbGF0ZSggd2lkdGgsIDAsIDAgKTtcbiAgICByZXR1cm4gb2JqO1xuICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVQYW5lbCggd2lkdGgsIGhlaWdodCwgZGVwdGgsIHVuaXF1ZU1hdGVyaWFsICl7XG4gIGNvbnN0IG1hdGVyaWFsID0gdW5pcXVlTWF0ZXJpYWwgPyBuZXcgVEhSRUUuTWVzaEJhc2ljTWF0ZXJpYWwoe2NvbG9yOjB4ZmZmZmZmfSkgOiBTaGFyZWRNYXRlcmlhbHMuUEFORUw7XG4gIGNvbnN0IHBhbmVsID0gbmV3IFRIUkVFLk1lc2goIG5ldyBUSFJFRS5Cb3hHZW9tZXRyeSggd2lkdGgsIGhlaWdodCwgZGVwdGggKSwgbWF0ZXJpYWwgKTtcbiAgcGFuZWwuZ2VvbWV0cnkudHJhbnNsYXRlKCB3aWR0aCAqIDAuNSwgMCwgMCApO1xuXG4gIGlmKCB1bmlxdWVNYXRlcmlhbCApe1xuICAgIG1hdGVyaWFsLmNvbG9yLnNldEhleCggQ29sb3JzLkRFRkFVTFRfQkFDSyApO1xuICB9XG4gIGVsc2V7XG4gICAgQ29sb3JzLmNvbG9yaXplR2VvbWV0cnkoIHBhbmVsLmdlb21ldHJ5LCBDb2xvcnMuREVGQVVMVF9CQUNLICk7XG4gIH1cblxuICByZXR1cm4gcGFuZWw7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVDb250cm9sbGVySURCb3goIGhlaWdodCwgY29sb3IgKXtcbiAgY29uc3QgcGFuZWwgPSBuZXcgVEhSRUUuTWVzaCggbmV3IFRIUkVFLkJveEdlb21ldHJ5KCBDT05UUk9MTEVSX0lEX1dJRFRILCBoZWlnaHQsIENPTlRST0xMRVJfSURfREVQVEggKSwgU2hhcmVkTWF0ZXJpYWxzLlBBTkVMICk7XG4gIHBhbmVsLmdlb21ldHJ5LnRyYW5zbGF0ZSggQ09OVFJPTExFUl9JRF9XSURUSCAqIDAuNSwgMCwgMCApO1xuICBDb2xvcnMuY29sb3JpemVHZW9tZXRyeSggcGFuZWwuZ2VvbWV0cnksIGNvbG9yICk7XG4gIHJldHVybiBwYW5lbDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZURvd25BcnJvdygpe1xuICBjb25zdCB3ID0gMC4wMDk2O1xuICBjb25zdCBoID0gMC4wMTY7XG4gIGNvbnN0IHNoID0gbmV3IFRIUkVFLlNoYXBlKCk7XG4gIHNoLm1vdmVUbygwLDApO1xuICBzaC5saW5lVG8oLXcsaCk7XG4gIHNoLmxpbmVUbyh3LGgpO1xuICBzaC5saW5lVG8oMCwwKTtcblxuICBjb25zdCBnZW8gPSBuZXcgVEhSRUUuU2hhcGVHZW9tZXRyeSggc2ggKTtcbiAgZ2VvLnRyYW5zbGF0ZSggMCwgLWggKiAwLjUsIDAgKTtcblxuICByZXR1cm4gbmV3IFRIUkVFLk1lc2goIGdlbywgU2hhcmVkTWF0ZXJpYWxzLlBBTkVMICk7XG59XG5cbmV4cG9ydCBjb25zdCBQQU5FTF9XSURUSCA9IDEuMDtcbmV4cG9ydCBjb25zdCBQQU5FTF9IRUlHSFQgPSAwLjA4O1xuZXhwb3J0IGNvbnN0IFBBTkVMX0RFUFRIID0gMC4wMTtcbmV4cG9ydCBjb25zdCBQQU5FTF9TUEFDSU5HID0gMC4wMDE7XG5leHBvcnQgY29uc3QgUEFORUxfTUFSR0lOID0gMC4wMTU7XG5leHBvcnQgY29uc3QgUEFORUxfTEFCRUxfVEVYVF9NQVJHSU4gPSAwLjA2O1xuZXhwb3J0IGNvbnN0IFBBTkVMX1ZBTFVFX1RFWFRfTUFSR0lOID0gMC4wMjtcbmV4cG9ydCBjb25zdCBDT05UUk9MTEVSX0lEX1dJRFRIID0gMC4wMjtcbmV4cG9ydCBjb25zdCBDT05UUk9MTEVSX0lEX0RFUFRIID0gMC4wMDE7XG5leHBvcnQgY29uc3QgQlVUVE9OX0RFUFRIID0gMC4wMTtcbmV4cG9ydCBjb25zdCBGT0xERVJfV0lEVEggPSAxLjAyNjtcbmV4cG9ydCBjb25zdCBGT0xERVJfSEVJR0hUID0gMC4wODtcbmV4cG9ydCBjb25zdCBGT0xERVJfR1JBQl9IRUlHSFQgPSAwLjA1MTI7XG5leHBvcnQgY29uc3QgQk9SREVSX1RISUNLTkVTUyA9IDAuMDE7XG5leHBvcnQgY29uc3QgQ0hFQ0tCT1hfU0laRSA9IDAuMDU7IiwiLyoqXG4qIGRhdC1ndWlWUiBKYXZhc2NyaXB0IENvbnRyb2xsZXIgTGlicmFyeSBmb3IgVlJcbiogaHR0cHM6Ly9naXRodWIuY29tL2RhdGFhcnRzL2RhdC5ndWlWUlxuKlxuKiBDb3B5cmlnaHQgMjAxNiBEYXRhIEFydHMgVGVhbSwgR29vZ2xlIEluYy5cbipcbiogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbipcbiogICAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuKlxuKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4qIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4qIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4qL1xuXG5pbXBvcnQgY3JlYXRlSW50ZXJhY3Rpb24gZnJvbSAnLi9pbnRlcmFjdGlvbic7XG5cbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGUoIHsgZ3JvdXAsIHBhbmVsIH0gPSB7fSApe1xuXG4gIGNvbnN0IGludGVyYWN0aW9uID0gY3JlYXRlSW50ZXJhY3Rpb24oIHBhbmVsICk7XG5cbiAgaW50ZXJhY3Rpb24uZXZlbnRzLm9uKCAnb25HcmlwcGVkJywgaGFuZGxlT25HcmlwICk7XG4gIGludGVyYWN0aW9uLmV2ZW50cy5vbiggJ29uUmVsZWFzZUdyaXAnLCBoYW5kbGVPbkdyaXBSZWxlYXNlICk7XG5cbiAgbGV0IG9sZFBhcmVudDtcbiAgbGV0IG9sZFBvc2l0aW9uID0gbmV3IFRIUkVFLlZlY3RvcjMoKTtcbiAgbGV0IG9sZFJvdGF0aW9uID0gbmV3IFRIUkVFLkV1bGVyKCk7XG5cbiAgY29uc3Qgcm90YXRpb25Hcm91cCA9IG5ldyBUSFJFRS5Hcm91cCgpO1xuICByb3RhdGlvbkdyb3VwLnNjYWxlLnNldCggMC4zLCAwLjMsIDAuMyApO1xuICByb3RhdGlvbkdyb3VwLnBvc2l0aW9uLnNldCggLTAuMDE1LCAwLjAxNSwgMC4wICk7XG5cblxuICBmdW5jdGlvbiBoYW5kbGVPbkdyaXAoIHAgKXtcblxuICAgIGNvbnN0IHsgaW5wdXRPYmplY3QsIGlucHV0IH0gPSBwO1xuXG4gICAgY29uc3QgZm9sZGVyID0gZ3JvdXAuZm9sZGVyO1xuICAgIGlmKCBmb2xkZXIgPT09IHVuZGVmaW5lZCApe1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlmKCBmb2xkZXIuYmVpbmdNb3ZlZCA9PT0gdHJ1ZSApe1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIG9sZFBvc2l0aW9uLmNvcHkoIGZvbGRlci5wb3NpdGlvbiApO1xuICAgIG9sZFJvdGF0aW9uLmNvcHkoIGZvbGRlci5yb3RhdGlvbiApO1xuXG4gICAgZm9sZGVyLnBvc2l0aW9uLnNldCggMCwwLDAgKTtcbiAgICBmb2xkZXIucm90YXRpb24uc2V0KCAwLDAsMCApO1xuICAgIGZvbGRlci5yb3RhdGlvbi54ID0gLU1hdGguUEkgKiAwLjU7XG5cbiAgICBvbGRQYXJlbnQgPSBmb2xkZXIucGFyZW50O1xuXG4gICAgcm90YXRpb25Hcm91cC5hZGQoIGZvbGRlciApO1xuXG4gICAgaW5wdXRPYmplY3QuYWRkKCByb3RhdGlvbkdyb3VwICk7XG5cbiAgICBwLmxvY2tlZCA9IHRydWU7XG5cbiAgICBmb2xkZXIuYmVpbmdNb3ZlZCA9IHRydWU7XG5cbiAgICBpbnB1dC5ldmVudHMuZW1pdCggJ3Bpbm5lZCcsIGlucHV0ICk7XG4gIH1cblxuICBmdW5jdGlvbiBoYW5kbGVPbkdyaXBSZWxlYXNlKCB7IGlucHV0T2JqZWN0LCBpbnB1dCB9PXt9ICl7XG5cbiAgICBjb25zdCBmb2xkZXIgPSBncm91cC5mb2xkZXI7XG4gICAgaWYoIGZvbGRlciA9PT0gdW5kZWZpbmVkICl7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYoIG9sZFBhcmVudCA9PT0gdW5kZWZpbmVkICl7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYoIGZvbGRlci5iZWluZ01vdmVkID09PSBmYWxzZSApe1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIG9sZFBhcmVudC5hZGQoIGZvbGRlciApO1xuICAgIG9sZFBhcmVudCA9IHVuZGVmaW5lZDtcblxuICAgIGZvbGRlci5wb3NpdGlvbi5jb3B5KCBvbGRQb3NpdGlvbiApO1xuICAgIGZvbGRlci5yb3RhdGlvbi5jb3B5KCBvbGRSb3RhdGlvbiApO1xuXG4gICAgZm9sZGVyLmJlaW5nTW92ZWQgPSBmYWxzZTtcblxuICAgIGlucHV0LmV2ZW50cy5lbWl0KCAncGluUmVsZWFzZWQnLCBpbnB1dCApO1xuICB9XG5cbiAgcmV0dXJuIGludGVyYWN0aW9uO1xufSIsIi8qKlxuKiBkYXQtZ3VpVlIgSmF2YXNjcmlwdCBDb250cm9sbGVyIExpYnJhcnkgZm9yIFZSXG4qIGh0dHBzOi8vZ2l0aHViLmNvbS9kYXRhYXJ0cy9kYXQuZ3VpVlJcbipcbiogQ29weXJpZ2h0IDIwMTYgRGF0YSBBcnRzIFRlYW0sIEdvb2dsZSBJbmMuXG4qXG4qIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4qIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4qXG4qICAgICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbipcbiogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4qIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4qIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuKi9cblxuaW1wb3J0IFNERlNoYWRlciBmcm9tICd0aHJlZS1ibWZvbnQtdGV4dC9zaGFkZXJzL3NkZic7XG5pbXBvcnQgY3JlYXRlR2VvbWV0cnkgZnJvbSAndGhyZWUtYm1mb250LXRleHQnO1xuaW1wb3J0IHBhcnNlQVNDSUkgZnJvbSAncGFyc2UtYm1mb250LWFzY2lpJztcblxuaW1wb3J0ICogYXMgRm9udCBmcm9tICcuL2ZvbnQnO1xuXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlTWF0ZXJpYWwoIGNvbG9yICl7XG5cbiAgY29uc3QgdGV4dHVyZSA9IG5ldyBUSFJFRS5UZXh0dXJlKCk7XG4gIGNvbnN0IGltYWdlID0gRm9udC5pbWFnZSgpO1xuICB0ZXh0dXJlLmltYWdlID0gaW1hZ2U7XG4gIHRleHR1cmUubmVlZHNVcGRhdGUgPSB0cnVlO1xuICB0ZXh0dXJlLm1pbkZpbHRlciA9IFRIUkVFLkxpbmVhckZpbHRlcjtcbiAgdGV4dHVyZS5tYWdGaWx0ZXIgPSBUSFJFRS5MaW5lYXJGaWx0ZXI7XG4gIHRleHR1cmUuZ2VuZXJhdGVNaXBtYXBzID0gZmFsc2U7XG5cbiAgcmV0dXJuIG5ldyBUSFJFRS5SYXdTaGFkZXJNYXRlcmlhbChTREZTaGFkZXIoe1xuICAgIHNpZGU6IFRIUkVFLkRvdWJsZVNpZGUsXG4gICAgdHJhbnNwYXJlbnQ6IHRydWUsXG4gICAgY29sb3I6IGNvbG9yLFxuICAgIG1hcDogdGV4dHVyZVxuICB9KSk7XG59XG5cbmNvbnN0IHRleHRTY2FsZSA9IDAuMDAwMjQ7XG5cbmV4cG9ydCBmdW5jdGlvbiBjcmVhdG9yKCl7XG5cbiAgY29uc3QgZm9udCA9IHBhcnNlQVNDSUkoIEZvbnQuZm50KCkgKTtcblxuICBjb25zdCBjb2xvck1hdGVyaWFscyA9IHt9O1xuXG4gIGZ1bmN0aW9uIGNyZWF0ZVRleHQoIHN0ciwgZm9udCwgY29sb3IgPSAweGZmZmZmZiwgc2NhbGUgPSAxLjAgKXtcblxuICAgIGNvbnN0IGdlb21ldHJ5ID0gY3JlYXRlR2VvbWV0cnkoe1xuICAgICAgdGV4dDogc3RyLFxuICAgICAgYWxpZ246ICdsZWZ0JyxcbiAgICAgIHdpZHRoOiAxMDAwMCxcbiAgICAgIGZsaXBZOiB0cnVlLFxuICAgICAgZm9udFxuICAgIH0pO1xuXG5cbiAgICBjb25zdCBsYXlvdXQgPSBnZW9tZXRyeS5sYXlvdXQ7XG5cbiAgICBsZXQgbWF0ZXJpYWwgPSBjb2xvck1hdGVyaWFsc1sgY29sb3IgXTtcbiAgICBpZiggbWF0ZXJpYWwgPT09IHVuZGVmaW5lZCApe1xuICAgICAgbWF0ZXJpYWwgPSBjb2xvck1hdGVyaWFsc1sgY29sb3IgXSA9IGNyZWF0ZU1hdGVyaWFsKCBjb2xvciApO1xuICAgIH1cbiAgICBjb25zdCBtZXNoID0gbmV3IFRIUkVFLk1lc2goIGdlb21ldHJ5LCBtYXRlcmlhbCApO1xuICAgIG1lc2guc2NhbGUubXVsdGlwbHkoIG5ldyBUSFJFRS5WZWN0b3IzKDEsLTEsMSkgKTtcblxuICAgIGNvbnN0IGZpbmFsU2NhbGUgPSBzY2FsZSAqIHRleHRTY2FsZTtcblxuICAgIG1lc2guc2NhbGUubXVsdGlwbHlTY2FsYXIoIGZpbmFsU2NhbGUgKTtcblxuICAgIG1lc2gucG9zaXRpb24ueSA9IGxheW91dC5oZWlnaHQgKiAwLjUgKiBmaW5hbFNjYWxlO1xuXG4gICAgcmV0dXJuIG1lc2g7XG4gIH1cblxuXG4gIGZ1bmN0aW9uIGNyZWF0ZSggc3RyLCB7IGNvbG9yPTB4ZmZmZmZmLCBzY2FsZT0xLjAgfSA9IHt9ICl7XG4gICAgY29uc3QgZ3JvdXAgPSBuZXcgVEhSRUUuR3JvdXAoKTtcblxuICAgIGxldCBtZXNoID0gY3JlYXRlVGV4dCggc3RyLCBmb250LCBjb2xvciwgc2NhbGUgKTtcbiAgICBncm91cC5hZGQoIG1lc2ggKTtcbiAgICBncm91cC5sYXlvdXQgPSBtZXNoLmdlb21ldHJ5LmxheW91dDtcblxuICAgIGdyb3VwLnVwZGF0ZSA9IGZ1bmN0aW9uKCBzdHIgKXtcbiAgICAgIG1lc2guZ2VvbWV0cnkudXBkYXRlKCBzdHIgKTtcbiAgICB9O1xuXG4gICAgcmV0dXJuIGdyb3VwO1xuICB9XG5cbiAgcmV0dXJuIHtcbiAgICBjcmVhdGUsXG4gICAgZ2V0TWF0ZXJpYWw6ICgpPT4gbWF0ZXJpYWxcbiAgfVxuXG59IiwiLyoqXG4qIGRhdC1ndWlWUiBKYXZhc2NyaXB0IENvbnRyb2xsZXIgTGlicmFyeSBmb3IgVlJcbiogaHR0cHM6Ly9naXRodWIuY29tL2RhdGFhcnRzL2RhdC5ndWlWUlxuKlxuKiBDb3B5cmlnaHQgMjAxNiBEYXRhIEFydHMgVGVhbSwgR29vZ2xlIEluYy5cbiogXG4qIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4qIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4qIFxuKiAgICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4qIFxuKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4qIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4qIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4qL1xuXG5pbXBvcnQgKiBhcyBDb2xvcnMgZnJvbSAnLi9jb2xvcnMnO1xuXG5leHBvcnQgY29uc3QgUEFORUwgPSBuZXcgVEhSRUUuTWVzaEJhc2ljTWF0ZXJpYWwoIHsgY29sb3I6IDB4ZmZmZmZmLCB2ZXJ0ZXhDb2xvcnM6IFRIUkVFLlZlcnRleENvbG9ycyB9ICk7XG5leHBvcnQgY29uc3QgTE9DQVRPUiA9IG5ldyBUSFJFRS5NZXNoQmFzaWNNYXRlcmlhbCgpO1xuZXhwb3J0IGNvbnN0IEZPTERFUiA9IG5ldyBUSFJFRS5NZXNoQmFzaWNNYXRlcmlhbCggeyBjb2xvcjogMHgwMDAwMDAgfSApOyIsIi8qKlxuKiBkYXQtZ3VpVlIgSmF2YXNjcmlwdCBDb250cm9sbGVyIExpYnJhcnkgZm9yIFZSXG4qIGh0dHBzOi8vZ2l0aHViLmNvbS9kYXRhYXJ0cy9kYXQuZ3VpVlJcbipcbiogQ29weXJpZ2h0IDIwMTYgRGF0YSBBcnRzIFRlYW0sIEdvb2dsZSBJbmMuXG4qXG4qIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4qIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4qXG4qICAgICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbipcbiogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4qIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4qIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuKi9cblxuaW1wb3J0IGNyZWF0ZVRleHRMYWJlbCBmcm9tICcuL3RleHRsYWJlbCc7XG5pbXBvcnQgY3JlYXRlSW50ZXJhY3Rpb24gZnJvbSAnLi9pbnRlcmFjdGlvbic7XG5pbXBvcnQgKiBhcyBDb2xvcnMgZnJvbSAnLi9jb2xvcnMnO1xuaW1wb3J0ICogYXMgTGF5b3V0IGZyb20gJy4vbGF5b3V0JztcbmltcG9ydCAqIGFzIFNoYXJlZE1hdGVyaWFscyBmcm9tICcuL3NoYXJlZG1hdGVyaWFscyc7XG5pbXBvcnQgKiBhcyBHcmFiIGZyb20gJy4vZ3JhYic7XG5pbXBvcnQgKiBhcyBQYWxldHRlIGZyb20gJy4vcGFsZXR0ZSc7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGNyZWF0ZVNsaWRlcigge1xuICB0ZXh0Q3JlYXRvcixcbiAgb2JqZWN0LFxuICBwcm9wZXJ0eU5hbWUgPSAndW5kZWZpbmVkJyxcbiAgaW5pdGlhbFZhbHVlID0gMC4wLFxuICBtaW4gPSAwLjAsIG1heCA9IDEuMCxcbiAgc3RlcCA9IDAuMSxcbiAgd2lkdGggPSBMYXlvdXQuUEFORUxfV0lEVEgsXG4gIGhlaWdodCA9IExheW91dC5QQU5FTF9IRUlHSFQsXG4gIGRlcHRoID0gTGF5b3V0LlBBTkVMX0RFUFRIXG59ID0ge30gKXtcblxuXG4gIGNvbnN0IFNMSURFUl9XSURUSCA9IHdpZHRoICogMC41IC0gTGF5b3V0LlBBTkVMX01BUkdJTjtcbiAgY29uc3QgU0xJREVSX0hFSUdIVCA9IGhlaWdodCAtIExheW91dC5QQU5FTF9NQVJHSU47XG4gIGNvbnN0IFNMSURFUl9ERVBUSCA9IGRlcHRoO1xuXG4gIGNvbnN0IHN0YXRlID0ge1xuICAgIGFscGhhOiAxLjAsXG4gICAgdmFsdWU6IGluaXRpYWxWYWx1ZSxcbiAgICBzdGVwOiBzdGVwLFxuICAgIHVzZVN0ZXA6IHRydWUsXG4gICAgcHJlY2lzaW9uOiAxLFxuICAgIGxpc3RlbjogZmFsc2UsXG4gICAgbWluOiBtaW4sXG4gICAgbWF4OiBtYXgsXG4gICAgb25DaGFuZ2VkQ0I6IHVuZGVmaW5lZCxcbiAgICBvbkZpbmlzaGVkQ2hhbmdlOiB1bmRlZmluZWQsXG4gICAgcHJlc3Npbmc6IGZhbHNlXG4gIH07XG5cbiAgc3RhdGUuc3RlcCA9IGdldEltcGxpZWRTdGVwKCBzdGF0ZS52YWx1ZSApO1xuICBzdGF0ZS5wcmVjaXNpb24gPSBudW1EZWNpbWFscyggc3RhdGUuc3RlcCApO1xuICBzdGF0ZS5hbHBoYSA9IGdldEFscGhhRnJvbVZhbHVlKCBzdGF0ZS52YWx1ZSwgc3RhdGUubWluLCBzdGF0ZS5tYXggKTtcblxuICBjb25zdCBncm91cCA9IG5ldyBUSFJFRS5Hcm91cCgpO1xuXG4gIC8vICBmaWxsZWQgdm9sdW1lXG4gIGNvbnN0IHJlY3QgPSBuZXcgVEhSRUUuQm94R2VvbWV0cnkoIFNMSURFUl9XSURUSCwgU0xJREVSX0hFSUdIVCwgU0xJREVSX0RFUFRIICk7XG4gIHJlY3QudHJhbnNsYXRlKFNMSURFUl9XSURUSCowLjUsMCwwKTtcbiAgLy8gTGF5b3V0LmFsaWduTGVmdCggcmVjdCApO1xuXG4gIGNvbnN0IGhpdHNjYW5NYXRlcmlhbCA9IG5ldyBUSFJFRS5NZXNoQmFzaWNNYXRlcmlhbCgpO1xuICBoaXRzY2FuTWF0ZXJpYWwudmlzaWJsZSA9IGZhbHNlO1xuXG4gIGNvbnN0IGhpdHNjYW5Wb2x1bWUgPSBuZXcgVEhSRUUuTWVzaCggcmVjdC5jbG9uZSgpLCBoaXRzY2FuTWF0ZXJpYWwgKTtcbiAgaGl0c2NhblZvbHVtZS5wb3NpdGlvbi56ID0gZGVwdGg7XG4gIGhpdHNjYW5Wb2x1bWUucG9zaXRpb24ueCA9IHdpZHRoICogMC41O1xuICBoaXRzY2FuVm9sdW1lLm5hbWUgPSAnaGl0c2NhblZvbHVtZSc7XG5cbiAgLy8gIHNsaWRlckJHIHZvbHVtZVxuICBjb25zdCBzbGlkZXJCRyA9IG5ldyBUSFJFRS5NZXNoKCByZWN0LmNsb25lKCksIFNoYXJlZE1hdGVyaWFscy5QQU5FTCApO1xuICBDb2xvcnMuY29sb3JpemVHZW9tZXRyeSggc2xpZGVyQkcuZ2VvbWV0cnksIENvbG9ycy5TTElERVJfQkcgKTtcbiAgc2xpZGVyQkcucG9zaXRpb24ueiA9IGRlcHRoICogMC41O1xuICBzbGlkZXJCRy5wb3NpdGlvbi54ID0gU0xJREVSX1dJRFRIICsgTGF5b3V0LlBBTkVMX01BUkdJTjtcblxuICBjb25zdCBtYXRlcmlhbCA9IG5ldyBUSFJFRS5NZXNoQmFzaWNNYXRlcmlhbCh7IGNvbG9yOiBDb2xvcnMuREVGQVVMVF9DT0xPUiB9KTtcbiAgY29uc3QgZmlsbGVkVm9sdW1lID0gbmV3IFRIUkVFLk1lc2goIHJlY3QuY2xvbmUoKSwgbWF0ZXJpYWwgKTtcbiAgZmlsbGVkVm9sdW1lLnBvc2l0aW9uLnogPSBkZXB0aCAqIDAuNTtcbiAgaGl0c2NhblZvbHVtZS5hZGQoIGZpbGxlZFZvbHVtZSApO1xuXG4gIGNvbnN0IGVuZExvY2F0b3IgPSBuZXcgVEhSRUUuTWVzaCggbmV3IFRIUkVFLkJveEdlb21ldHJ5KCAwLjA1LCAwLjA1LCAwLjA1LCAxLCAxLCAxICksIFNoYXJlZE1hdGVyaWFscy5MT0NBVE9SICk7XG4gIGVuZExvY2F0b3IucG9zaXRpb24ueCA9IFNMSURFUl9XSURUSDtcbiAgaGl0c2NhblZvbHVtZS5hZGQoIGVuZExvY2F0b3IgKTtcbiAgZW5kTG9jYXRvci52aXNpYmxlID0gZmFsc2U7XG5cbiAgY29uc3QgdmFsdWVMYWJlbCA9IHRleHRDcmVhdG9yLmNyZWF0ZSggc3RhdGUudmFsdWUudG9TdHJpbmcoKSApO1xuICB2YWx1ZUxhYmVsLnBvc2l0aW9uLnggPSBMYXlvdXQuUEFORUxfVkFMVUVfVEVYVF9NQVJHSU4gKyB3aWR0aCAqIDAuNTtcbiAgdmFsdWVMYWJlbC5wb3NpdGlvbi56ID0gZGVwdGgqMi41O1xuICB2YWx1ZUxhYmVsLnBvc2l0aW9uLnkgPSAtMC4wMzI1O1xuXG4gIGNvbnN0IGRlc2NyaXB0b3JMYWJlbCA9IHRleHRDcmVhdG9yLmNyZWF0ZSggcHJvcGVydHlOYW1lICk7XG4gIGRlc2NyaXB0b3JMYWJlbC5wb3NpdGlvbi54ID0gTGF5b3V0LlBBTkVMX0xBQkVMX1RFWFRfTUFSR0lOO1xuICBkZXNjcmlwdG9yTGFiZWwucG9zaXRpb24ueiA9IGRlcHRoO1xuICBkZXNjcmlwdG9yTGFiZWwucG9zaXRpb24ueSA9IC0wLjAzO1xuXG4gIGNvbnN0IGNvbnRyb2xsZXJJRCA9IExheW91dC5jcmVhdGVDb250cm9sbGVySURCb3goIGhlaWdodCwgQ29sb3JzLkNPTlRST0xMRVJfSURfU0xJREVSICk7XG4gIGNvbnRyb2xsZXJJRC5wb3NpdGlvbi56ID0gZGVwdGg7XG5cbiAgY29uc3QgcGFuZWwgPSBMYXlvdXQuY3JlYXRlUGFuZWwoIHdpZHRoLCBoZWlnaHQsIGRlcHRoICk7XG4gIHBhbmVsLm5hbWUgPSAncGFuZWwnO1xuICBwYW5lbC5hZGQoIGRlc2NyaXB0b3JMYWJlbCwgaGl0c2NhblZvbHVtZSwgc2xpZGVyQkcsIHZhbHVlTGFiZWwsIGNvbnRyb2xsZXJJRCApO1xuXG4gIGdyb3VwLmFkZCggcGFuZWwgKVxuXG4gIHVwZGF0ZVZhbHVlTGFiZWwoIHN0YXRlLnZhbHVlICk7XG4gIHVwZGF0ZVNsaWRlcigpO1xuXG4gIGZ1bmN0aW9uIHVwZGF0ZVZhbHVlTGFiZWwoIHZhbHVlICl7XG4gICAgaWYoIHN0YXRlLnVzZVN0ZXAgKXtcbiAgICAgIHZhbHVlTGFiZWwudXBkYXRlKCByb3VuZFRvRGVjaW1hbCggc3RhdGUudmFsdWUsIHN0YXRlLnByZWNpc2lvbiApLnRvU3RyaW5nKCkgKTtcbiAgICB9XG4gICAgZWxzZXtcbiAgICAgIHZhbHVlTGFiZWwudXBkYXRlKCBzdGF0ZS52YWx1ZS50b1N0cmluZygpICk7XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gdXBkYXRlVmlldygpe1xuICAgIGlmKCBzdGF0ZS5wcmVzc2luZyApe1xuICAgICAgbWF0ZXJpYWwuY29sb3Iuc2V0SGV4KCBDb2xvcnMuSU5URVJBQ1RJT05fQ09MT1IgKTtcbiAgICB9XG4gICAgZWxzZVxuICAgIGlmKCBpbnRlcmFjdGlvbi5ob3ZlcmluZygpICl7XG4gICAgICBtYXRlcmlhbC5jb2xvci5zZXRIZXgoIENvbG9ycy5ISUdITElHSFRfQ09MT1IgKTtcbiAgICB9XG4gICAgZWxzZXtcbiAgICAgIG1hdGVyaWFsLmNvbG9yLnNldEhleCggQ29sb3JzLkRFRkFVTFRfQ09MT1IgKTtcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiB1cGRhdGVTbGlkZXIoKXtcbiAgICBmaWxsZWRWb2x1bWUuc2NhbGUueCA9XG4gICAgICBNYXRoLm1pbihcbiAgICAgICAgTWF0aC5tYXgoIGdldEFscGhhRnJvbVZhbHVlKCBzdGF0ZS52YWx1ZSwgc3RhdGUubWluLCBzdGF0ZS5tYXggKSAqIHdpZHRoLCAwLjAwMDAwMSApLFxuICAgICAgICB3aWR0aFxuICAgICAgKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHVwZGF0ZU9iamVjdCggdmFsdWUgKXtcbiAgICBvYmplY3RbIHByb3BlcnR5TmFtZSBdID0gdmFsdWU7XG4gIH1cblxuICBmdW5jdGlvbiB1cGRhdGVTdGF0ZUZyb21BbHBoYSggYWxwaGEgKXtcbiAgICBzdGF0ZS5hbHBoYSA9IGdldENsYW1wZWRBbHBoYSggYWxwaGEgKTtcbiAgICBzdGF0ZS52YWx1ZSA9IGdldFZhbHVlRnJvbUFscGhhKCBzdGF0ZS5hbHBoYSwgc3RhdGUubWluLCBzdGF0ZS5tYXggKTtcbiAgICBpZiggc3RhdGUudXNlU3RlcCApe1xuICAgICAgc3RhdGUudmFsdWUgPSBnZXRTdGVwcGVkVmFsdWUoIHN0YXRlLnZhbHVlLCBzdGF0ZS5zdGVwICk7XG4gICAgfVxuICAgIHN0YXRlLnZhbHVlID0gZ2V0Q2xhbXBlZFZhbHVlKCBzdGF0ZS52YWx1ZSwgc3RhdGUubWluLCBzdGF0ZS5tYXggKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGxpc3RlblVwZGF0ZSgpe1xuICAgIHN0YXRlLnZhbHVlID0gZ2V0VmFsdWVGcm9tT2JqZWN0KCk7XG4gICAgc3RhdGUuYWxwaGEgPSBnZXRBbHBoYUZyb21WYWx1ZSggc3RhdGUudmFsdWUsIHN0YXRlLm1pbiwgc3RhdGUubWF4ICk7XG4gICAgc3RhdGUuYWxwaGEgPSBnZXRDbGFtcGVkQWxwaGEoIHN0YXRlLmFscGhhICk7XG4gIH1cblxuICBmdW5jdGlvbiBnZXRWYWx1ZUZyb21PYmplY3QoKXtcbiAgICByZXR1cm4gcGFyc2VGbG9hdCggb2JqZWN0WyBwcm9wZXJ0eU5hbWUgXSApO1xuICB9XG5cbiAgZ3JvdXAub25DaGFuZ2UgPSBmdW5jdGlvbiggY2FsbGJhY2sgKXtcbiAgICBzdGF0ZS5vbkNoYW5nZWRDQiA9IGNhbGxiYWNrO1xuICAgIHJldHVybiBncm91cDtcbiAgfTtcblxuICBncm91cC5zdGVwID0gZnVuY3Rpb24oIHN0ZXAgKXtcbiAgICBzdGF0ZS5zdGVwID0gc3RlcDtcbiAgICBzdGF0ZS5wcmVjaXNpb24gPSBudW1EZWNpbWFscyggc3RhdGUuc3RlcCApXG4gICAgc3RhdGUudXNlU3RlcCA9IHRydWU7XG5cbiAgICBzdGF0ZS5hbHBoYSA9IGdldEFscGhhRnJvbVZhbHVlKCBzdGF0ZS52YWx1ZSwgc3RhdGUubWluLCBzdGF0ZS5tYXggKTtcblxuICAgIHVwZGF0ZVN0YXRlRnJvbUFscGhhKCBzdGF0ZS5hbHBoYSApO1xuICAgIHVwZGF0ZVZhbHVlTGFiZWwoIHN0YXRlLnZhbHVlICk7XG4gICAgdXBkYXRlU2xpZGVyKCApO1xuICAgIHJldHVybiBncm91cDtcbiAgfTtcblxuICBncm91cC5saXN0ZW4gPSBmdW5jdGlvbigpe1xuICAgIHN0YXRlLmxpc3RlbiA9IHRydWU7XG4gICAgcmV0dXJuIGdyb3VwO1xuICB9O1xuXG4gIGNvbnN0IGludGVyYWN0aW9uID0gY3JlYXRlSW50ZXJhY3Rpb24oIGhpdHNjYW5Wb2x1bWUgKTtcbiAgaW50ZXJhY3Rpb24uZXZlbnRzLm9uKCAnb25QcmVzc2VkJywgaGFuZGxlUHJlc3MgKTtcbiAgaW50ZXJhY3Rpb24uZXZlbnRzLm9uKCAncHJlc3NpbmcnLCBoYW5kbGVIb2xkICk7XG4gIGludGVyYWN0aW9uLmV2ZW50cy5vbiggJ29uUmVsZWFzZWQnLCBoYW5kbGVSZWxlYXNlICk7XG5cbiAgZnVuY3Rpb24gaGFuZGxlUHJlc3MoIHAgKXtcbiAgICBpZiggZ3JvdXAudmlzaWJsZSA9PT0gZmFsc2UgKXtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgc3RhdGUucHJlc3NpbmcgPSB0cnVlO1xuICAgIHAubG9ja2VkID0gdHJ1ZTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGhhbmRsZUhvbGQoIHsgcG9pbnQgfSA9IHt9ICl7XG4gICAgaWYoIGdyb3VwLnZpc2libGUgPT09IGZhbHNlICl7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgc3RhdGUucHJlc3NpbmcgPSB0cnVlO1xuXG4gICAgZmlsbGVkVm9sdW1lLnVwZGF0ZU1hdHJpeFdvcmxkKCk7XG4gICAgZW5kTG9jYXRvci51cGRhdGVNYXRyaXhXb3JsZCgpO1xuXG4gICAgY29uc3QgYSA9IG5ldyBUSFJFRS5WZWN0b3IzKCkuc2V0RnJvbU1hdHJpeFBvc2l0aW9uKCBmaWxsZWRWb2x1bWUubWF0cml4V29ybGQgKTtcbiAgICBjb25zdCBiID0gbmV3IFRIUkVFLlZlY3RvcjMoKS5zZXRGcm9tTWF0cml4UG9zaXRpb24oIGVuZExvY2F0b3IubWF0cml4V29ybGQgKTtcblxuICAgIGNvbnN0IHByZXZpb3VzVmFsdWUgPSBzdGF0ZS52YWx1ZTtcblxuICAgIHVwZGF0ZVN0YXRlRnJvbUFscGhhKCBnZXRQb2ludEFscGhhKCBwb2ludCwge2EsYn0gKSApO1xuICAgIHVwZGF0ZVZhbHVlTGFiZWwoIHN0YXRlLnZhbHVlICk7XG4gICAgdXBkYXRlU2xpZGVyKCApO1xuICAgIHVwZGF0ZU9iamVjdCggc3RhdGUudmFsdWUgKTtcblxuICAgIGlmKCBwcmV2aW91c1ZhbHVlICE9PSBzdGF0ZS52YWx1ZSAmJiBzdGF0ZS5vbkNoYW5nZWRDQiApe1xuICAgICAgc3RhdGUub25DaGFuZ2VkQ0IoIHN0YXRlLnZhbHVlICk7XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gaGFuZGxlUmVsZWFzZSgpe1xuICAgIHN0YXRlLnByZXNzaW5nID0gZmFsc2U7XG4gIH1cblxuICBncm91cC5pbnRlcmFjdGlvbiA9IGludGVyYWN0aW9uO1xuICBncm91cC5oaXRzY2FuID0gWyBoaXRzY2FuVm9sdW1lLCBwYW5lbCBdO1xuXG4gIGNvbnN0IGdyYWJJbnRlcmFjdGlvbiA9IEdyYWIuY3JlYXRlKCB7IGdyb3VwLCBwYW5lbCB9ICk7XG4gIGNvbnN0IHBhbGV0dGVJbnRlcmFjdGlvbiA9IFBhbGV0dGUuY3JlYXRlKCB7IGdyb3VwLCBwYW5lbCB9ICk7XG5cbiAgZ3JvdXAudXBkYXRlID0gZnVuY3Rpb24oIGlucHV0T2JqZWN0cyApe1xuICAgIGludGVyYWN0aW9uLnVwZGF0ZSggaW5wdXRPYmplY3RzICk7XG4gICAgZ3JhYkludGVyYWN0aW9uLnVwZGF0ZSggaW5wdXRPYmplY3RzICk7XG4gICAgcGFsZXR0ZUludGVyYWN0aW9uLnVwZGF0ZSggaW5wdXRPYmplY3RzICk7XG5cbiAgICBpZiggc3RhdGUubGlzdGVuICl7XG4gICAgICBsaXN0ZW5VcGRhdGUoKTtcbiAgICAgIHVwZGF0ZVZhbHVlTGFiZWwoIHN0YXRlLnZhbHVlICk7XG4gICAgICB1cGRhdGVTbGlkZXIoKTtcbiAgICB9XG4gICAgdXBkYXRlVmlldygpO1xuICB9O1xuXG4gIGdyb3VwLm5hbWUgPSBmdW5jdGlvbiggc3RyICl7XG4gICAgZGVzY3JpcHRvckxhYmVsLnVwZGF0ZSggc3RyICk7XG4gICAgcmV0dXJuIGdyb3VwO1xuICB9O1xuXG4gIGdyb3VwLm1pbiA9IGZ1bmN0aW9uKCBtICl7XG4gICAgc3RhdGUubWluID0gbTtcbiAgICBzdGF0ZS5hbHBoYSA9IGdldEFscGhhRnJvbVZhbHVlKCBzdGF0ZS52YWx1ZSwgc3RhdGUubWluLCBzdGF0ZS5tYXggKTtcbiAgICB1cGRhdGVTdGF0ZUZyb21BbHBoYSggc3RhdGUuYWxwaGEgKTtcbiAgICB1cGRhdGVWYWx1ZUxhYmVsKCBzdGF0ZS52YWx1ZSApO1xuICAgIHVwZGF0ZVNsaWRlciggKTtcbiAgICByZXR1cm4gZ3JvdXA7XG4gIH07XG5cbiAgZ3JvdXAubWF4ID0gZnVuY3Rpb24oIG0gKXtcbiAgICBzdGF0ZS5tYXggPSBtO1xuICAgIHN0YXRlLmFscGhhID0gZ2V0QWxwaGFGcm9tVmFsdWUoIHN0YXRlLnZhbHVlLCBzdGF0ZS5taW4sIHN0YXRlLm1heCApO1xuICAgIHVwZGF0ZVN0YXRlRnJvbUFscGhhKCBzdGF0ZS5hbHBoYSApO1xuICAgIHVwZGF0ZVZhbHVlTGFiZWwoIHN0YXRlLnZhbHVlICk7XG4gICAgdXBkYXRlU2xpZGVyKCApO1xuICAgIHJldHVybiBncm91cDtcbiAgfTtcblxuICByZXR1cm4gZ3JvdXA7XG59XG5cbmNvbnN0IHRhID0gbmV3IFRIUkVFLlZlY3RvcjMoKTtcbmNvbnN0IHRiID0gbmV3IFRIUkVFLlZlY3RvcjMoKTtcbmNvbnN0IHRUb0EgPSBuZXcgVEhSRUUuVmVjdG9yMygpO1xuY29uc3QgYVRvQiA9IG5ldyBUSFJFRS5WZWN0b3IzKCk7XG5cbmZ1bmN0aW9uIGdldFBvaW50QWxwaGEoIHBvaW50LCBzZWdtZW50ICl7XG4gIHRhLmNvcHkoIHNlZ21lbnQuYiApLnN1Yiggc2VnbWVudC5hICk7XG4gIHRiLmNvcHkoIHBvaW50ICkuc3ViKCBzZWdtZW50LmEgKTtcblxuICBjb25zdCBwcm9qZWN0ZWQgPSB0Yi5wcm9qZWN0T25WZWN0b3IoIHRhICk7XG5cbiAgdFRvQS5jb3B5KCBwb2ludCApLnN1Yiggc2VnbWVudC5hICk7XG5cbiAgYVRvQi5jb3B5KCBzZWdtZW50LmIgKS5zdWIoIHNlZ21lbnQuYSApLm5vcm1hbGl6ZSgpO1xuXG4gIGNvbnN0IHNpZGUgPSB0VG9BLm5vcm1hbGl6ZSgpLmRvdCggYVRvQiApID49IDAgPyAxIDogLTE7XG5cbiAgY29uc3QgbGVuZ3RoID0gc2VnbWVudC5hLmRpc3RhbmNlVG8oIHNlZ21lbnQuYiApICogc2lkZTtcblxuICBsZXQgYWxwaGEgPSBwcm9qZWN0ZWQubGVuZ3RoKCkgLyBsZW5ndGg7XG4gIGlmKCBhbHBoYSA+IDEuMCApe1xuICAgIGFscGhhID0gMS4wO1xuICB9XG4gIGlmKCBhbHBoYSA8IDAuMCApe1xuICAgIGFscGhhID0gMC4wO1xuICB9XG4gIHJldHVybiBhbHBoYTtcbn1cblxuZnVuY3Rpb24gbGVycChtaW4sIG1heCwgdmFsdWUpIHtcbiAgcmV0dXJuICgxLXZhbHVlKSptaW4gKyB2YWx1ZSptYXg7XG59XG5cbmZ1bmN0aW9uIG1hcF9yYW5nZSh2YWx1ZSwgbG93MSwgaGlnaDEsIGxvdzIsIGhpZ2gyKSB7XG4gICAgcmV0dXJuIGxvdzIgKyAoaGlnaDIgLSBsb3cyKSAqICh2YWx1ZSAtIGxvdzEpIC8gKGhpZ2gxIC0gbG93MSk7XG59XG5cbmZ1bmN0aW9uIGdldENsYW1wZWRBbHBoYSggYWxwaGEgKXtcbiAgaWYoIGFscGhhID4gMSApe1xuICAgIHJldHVybiAxXG4gIH1cbiAgaWYoIGFscGhhIDwgMCApe1xuICAgIHJldHVybiAwO1xuICB9XG4gIHJldHVybiBhbHBoYTtcbn1cblxuZnVuY3Rpb24gZ2V0Q2xhbXBlZFZhbHVlKCB2YWx1ZSwgbWluLCBtYXggKXtcbiAgaWYoIHZhbHVlIDwgbWluICl7XG4gICAgcmV0dXJuIG1pbjtcbiAgfVxuICBpZiggdmFsdWUgPiBtYXggKXtcbiAgICByZXR1cm4gbWF4O1xuICB9XG4gIHJldHVybiB2YWx1ZTtcbn1cblxuZnVuY3Rpb24gZ2V0SW1wbGllZFN0ZXAoIHZhbHVlICl7XG4gIGlmKCB2YWx1ZSA9PT0gMCApe1xuICAgIHJldHVybiAxOyAvLyBXaGF0IGFyZSB3ZSwgcHN5Y2hpY3M/XG4gIH0gZWxzZSB7XG4gICAgLy8gSGV5IERvdWcsIGNoZWNrIHRoaXMgb3V0LlxuICAgIHJldHVybiBNYXRoLnBvdygxMCwgTWF0aC5mbG9vcihNYXRoLmxvZyhNYXRoLmFicyh2YWx1ZSkpL01hdGguTE4xMCkpLzEwO1xuICB9XG59XG5cbmZ1bmN0aW9uIGdldFZhbHVlRnJvbUFscGhhKCBhbHBoYSwgbWluLCBtYXggKXtcbiAgcmV0dXJuIG1hcF9yYW5nZSggYWxwaGEsIDAuMCwgMS4wLCBtaW4sIG1heCApXG59XG5cbmZ1bmN0aW9uIGdldEFscGhhRnJvbVZhbHVlKCB2YWx1ZSwgbWluLCBtYXggKXtcbiAgcmV0dXJuIG1hcF9yYW5nZSggdmFsdWUsIG1pbiwgbWF4LCAwLjAsIDEuMCApO1xufVxuXG5mdW5jdGlvbiBnZXRTdGVwcGVkVmFsdWUoIHZhbHVlLCBzdGVwICl7XG4gIGlmKCB2YWx1ZSAlIHN0ZXAgIT0gMCkge1xuICAgIHJldHVybiBNYXRoLnJvdW5kKCB2YWx1ZSAvIHN0ZXAgKSAqIHN0ZXA7XG4gIH1cbiAgcmV0dXJuIHZhbHVlO1xufVxuXG5mdW5jdGlvbiBudW1EZWNpbWFscyh4KSB7XG4gIHggPSB4LnRvU3RyaW5nKCk7XG4gIGlmICh4LmluZGV4T2YoJy4nKSA+IC0xKSB7XG4gICAgcmV0dXJuIHgubGVuZ3RoIC0geC5pbmRleE9mKCcuJykgLSAxO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiAwO1xuICB9XG59XG5cbmZ1bmN0aW9uIHJvdW5kVG9EZWNpbWFsKHZhbHVlLCBkZWNpbWFscykge1xuICBjb25zdCB0ZW5UbyA9IE1hdGgucG93KDEwLCBkZWNpbWFscyk7XG4gIHJldHVybiBNYXRoLnJvdW5kKHZhbHVlICogdGVuVG8pIC8gdGVuVG87XG59IiwiLyoqXG4qIGRhdC1ndWlWUiBKYXZhc2NyaXB0IENvbnRyb2xsZXIgTGlicmFyeSBmb3IgVlJcbiogaHR0cHM6Ly9naXRodWIuY29tL2RhdGFhcnRzL2RhdC5ndWlWUlxuKlxuKiBDb3B5cmlnaHQgMjAxNiBEYXRhIEFydHMgVGVhbSwgR29vZ2xlIEluYy5cbipcbiogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbipcbiogICAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuKlxuKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4qIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4qIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4qL1xuXG5pbXBvcnQgKiBhcyBDb2xvcnMgZnJvbSAnLi9jb2xvcnMnO1xuaW1wb3J0ICogYXMgU2hhcmVkTWF0ZXJpYWxzIGZyb20gJy4vc2hhcmVkbWF0ZXJpYWxzJztcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gY3JlYXRlVGV4dExhYmVsKCB0ZXh0Q3JlYXRvciwgc3RyLCB3aWR0aCA9IDAuNCwgZGVwdGggPSAwLjAyOSwgZmdDb2xvciA9IDB4ZmZmZmZmLCBiZ0NvbG9yID0gQ29sb3JzLkRFRkFVTFRfQkFDSywgc2NhbGUgPSAxLjAgKXtcblxuICBjb25zdCBncm91cCA9IG5ldyBUSFJFRS5Hcm91cCgpO1xuICBjb25zdCBpbnRlcm5hbFBvc2l0aW9uaW5nID0gbmV3IFRIUkVFLkdyb3VwKCk7XG4gIGdyb3VwLmFkZCggaW50ZXJuYWxQb3NpdGlvbmluZyApO1xuXG4gIGNvbnN0IHRleHQgPSB0ZXh0Q3JlYXRvci5jcmVhdGUoIHN0ciwgeyBjb2xvcjogZmdDb2xvciwgc2NhbGUgfSApO1xuICBpbnRlcm5hbFBvc2l0aW9uaW5nLmFkZCggdGV4dCApO1xuXG5cbiAgZ3JvdXAuc2V0U3RyaW5nID0gZnVuY3Rpb24oIHN0ciApe1xuICAgIHRleHQudXBkYXRlKCBzdHIudG9TdHJpbmcoKSApO1xuICB9O1xuXG4gIGdyb3VwLnNldE51bWJlciA9IGZ1bmN0aW9uKCBzdHIgKXtcbiAgICB0ZXh0LnVwZGF0ZSggc3RyLnRvRml4ZWQoMikgKTtcbiAgfTtcblxuICB0ZXh0LnBvc2l0aW9uLnogPSBkZXB0aDtcblxuICBjb25zdCBiYWNrQm91bmRzID0gMC4wMTtcbiAgY29uc3QgbWFyZ2luID0gMC4wMTtcbiAgY29uc3QgdG90YWxXaWR0aCA9IHdpZHRoO1xuICBjb25zdCB0b3RhbEhlaWdodCA9IDAuMDQgKyBtYXJnaW4gKiAyO1xuICBjb25zdCBsYWJlbEJhY2tHZW9tZXRyeSA9IG5ldyBUSFJFRS5Cb3hHZW9tZXRyeSggdG90YWxXaWR0aCwgdG90YWxIZWlnaHQsIGRlcHRoLCAxLCAxLCAxICk7XG4gIGxhYmVsQmFja0dlb21ldHJ5LmFwcGx5TWF0cml4KCBuZXcgVEhSRUUuTWF0cml4NCgpLm1ha2VUcmFuc2xhdGlvbiggdG90YWxXaWR0aCAqIDAuNSAtIG1hcmdpbiwgMCwgMCApICk7XG5cbiAgY29uc3QgbGFiZWxCYWNrTWVzaCA9IG5ldyBUSFJFRS5NZXNoKCBsYWJlbEJhY2tHZW9tZXRyeSwgU2hhcmVkTWF0ZXJpYWxzLlBBTkVMICk7XG4gIENvbG9ycy5jb2xvcml6ZUdlb21ldHJ5KCBsYWJlbEJhY2tNZXNoLmdlb21ldHJ5LCBiZ0NvbG9yICk7XG5cbiAgbGFiZWxCYWNrTWVzaC5wb3NpdGlvbi55ID0gMC4wMztcbiAgaW50ZXJuYWxQb3NpdGlvbmluZy5hZGQoIGxhYmVsQmFja01lc2ggKTtcbiAgaW50ZXJuYWxQb3NpdGlvbmluZy5wb3NpdGlvbi55ID0gLXRvdGFsSGVpZ2h0ICogMC41O1xuXG4gIGdyb3VwLmJhY2sgPSBsYWJlbEJhY2tNZXNoO1xuXG4gIHJldHVybiBncm91cDtcbn0iLCIvKlxuICpcdEBhdXRob3Igeno4NSAvIGh0dHA6Ly90d2l0dGVyLmNvbS9ibHVyc3BsaW5lIC8gaHR0cDovL3d3dy5sYWI0Z2FtZXMubmV0L3p6ODUvYmxvZ1xuICpcdEBhdXRob3IgY2VudGVyaW9ud2FyZSAvIGh0dHA6Ly93d3cuY2VudGVyaW9ud2FyZS5jb21cbiAqXG4gKlx0U3ViZGl2aXNpb24gR2VvbWV0cnkgTW9kaWZpZXJcbiAqXHRcdHVzaW5nIExvb3AgU3ViZGl2aXNpb24gU2NoZW1lXG4gKlxuICpcdFJlZmVyZW5jZXM6XG4gKlx0XHRodHRwOi8vZ3JhcGhpY3Muc3RhbmZvcmQuZWR1L35tZGZpc2hlci9zdWJkaXZpc2lvbi5odG1sXG4gKlx0XHRodHRwOi8vd3d3LmhvbG1lczNkLm5ldC9ncmFwaGljcy9zdWJkaXZpc2lvbi9cbiAqXHRcdGh0dHA6Ly93d3cuY3MucnV0Z2Vycy5lZHUvfmRlY2FybG8vcmVhZGluZ3Mvc3ViZGl2LXNnMDBjLnBkZlxuICpcbiAqXHRLbm93biBJc3N1ZXM6XG4gKlx0XHQtIGN1cnJlbnRseSBkb2Vzbid0IGhhbmRsZSBcIlNoYXJwIEVkZ2VzXCJcbiAqL1xuXG5USFJFRS5TdWJkaXZpc2lvbk1vZGlmaWVyID0gZnVuY3Rpb24gKCBzdWJkaXZpc2lvbnMgKSB7XG5cblx0dGhpcy5zdWJkaXZpc2lvbnMgPSAoIHN1YmRpdmlzaW9ucyA9PT0gdW5kZWZpbmVkICkgPyAxIDogc3ViZGl2aXNpb25zO1xuXG59O1xuXG4vLyBBcHBsaWVzIHRoZSBcIm1vZGlmeVwiIHBhdHRlcm5cblRIUkVFLlN1YmRpdmlzaW9uTW9kaWZpZXIucHJvdG90eXBlLm1vZGlmeSA9IGZ1bmN0aW9uICggZ2VvbWV0cnkgKSB7XG5cblx0dmFyIHJlcGVhdHMgPSB0aGlzLnN1YmRpdmlzaW9ucztcblxuXHR3aGlsZSAoIHJlcGVhdHMgLS0gPiAwICkge1xuXG5cdFx0dGhpcy5zbW9vdGgoIGdlb21ldHJ5ICk7XG5cblx0fVxuXG5cdGdlb21ldHJ5LmNvbXB1dGVGYWNlTm9ybWFscygpO1xuXHRnZW9tZXRyeS5jb21wdXRlVmVydGV4Tm9ybWFscygpO1xuXG59O1xuXG4oIGZ1bmN0aW9uKCkge1xuXG5cdC8vIFNvbWUgY29uc3RhbnRzXG5cdHZhciBXQVJOSU5HUyA9ICEgdHJ1ZTsgLy8gU2V0IHRvIHRydWUgZm9yIGRldmVsb3BtZW50XG5cdHZhciBBQkMgPSBbICdhJywgJ2InLCAnYycgXTtcblxuXG5cdGZ1bmN0aW9uIGdldEVkZ2UoIGEsIGIsIG1hcCApIHtcblxuXHRcdHZhciB2ZXJ0ZXhJbmRleEEgPSBNYXRoLm1pbiggYSwgYiApO1xuXHRcdHZhciB2ZXJ0ZXhJbmRleEIgPSBNYXRoLm1heCggYSwgYiApO1xuXG5cdFx0dmFyIGtleSA9IHZlcnRleEluZGV4QSArIFwiX1wiICsgdmVydGV4SW5kZXhCO1xuXG5cdFx0cmV0dXJuIG1hcFsga2V5IF07XG5cblx0fVxuXG5cblx0ZnVuY3Rpb24gcHJvY2Vzc0VkZ2UoIGEsIGIsIHZlcnRpY2VzLCBtYXAsIGZhY2UsIG1ldGFWZXJ0aWNlcyApIHtcblxuXHRcdHZhciB2ZXJ0ZXhJbmRleEEgPSBNYXRoLm1pbiggYSwgYiApO1xuXHRcdHZhciB2ZXJ0ZXhJbmRleEIgPSBNYXRoLm1heCggYSwgYiApO1xuXG5cdFx0dmFyIGtleSA9IHZlcnRleEluZGV4QSArIFwiX1wiICsgdmVydGV4SW5kZXhCO1xuXG5cdFx0dmFyIGVkZ2U7XG5cblx0XHRpZiAoIGtleSBpbiBtYXAgKSB7XG5cblx0XHRcdGVkZ2UgPSBtYXBbIGtleSBdO1xuXG5cdFx0fSBlbHNlIHtcblxuXHRcdFx0dmFyIHZlcnRleEEgPSB2ZXJ0aWNlc1sgdmVydGV4SW5kZXhBIF07XG5cdFx0XHR2YXIgdmVydGV4QiA9IHZlcnRpY2VzWyB2ZXJ0ZXhJbmRleEIgXTtcblxuXHRcdFx0ZWRnZSA9IHtcblxuXHRcdFx0XHRhOiB2ZXJ0ZXhBLCAvLyBwb2ludGVyIHJlZmVyZW5jZVxuXHRcdFx0XHRiOiB2ZXJ0ZXhCLFxuXHRcdFx0XHRuZXdFZGdlOiBudWxsLFxuXHRcdFx0XHQvLyBhSW5kZXg6IGEsIC8vIG51bWJlcmVkIHJlZmVyZW5jZVxuXHRcdFx0XHQvLyBiSW5kZXg6IGIsXG5cdFx0XHRcdGZhY2VzOiBbXSAvLyBwb2ludGVycyB0byBmYWNlXG5cblx0XHRcdH07XG5cblx0XHRcdG1hcFsga2V5IF0gPSBlZGdlO1xuXG5cdFx0fVxuXG5cdFx0ZWRnZS5mYWNlcy5wdXNoKCBmYWNlICk7XG5cblx0XHRtZXRhVmVydGljZXNbIGEgXS5lZGdlcy5wdXNoKCBlZGdlICk7XG5cdFx0bWV0YVZlcnRpY2VzWyBiIF0uZWRnZXMucHVzaCggZWRnZSApO1xuXG5cblx0fVxuXG5cdGZ1bmN0aW9uIGdlbmVyYXRlTG9va3VwcyggdmVydGljZXMsIGZhY2VzLCBtZXRhVmVydGljZXMsIGVkZ2VzICkge1xuXG5cdFx0dmFyIGksIGlsLCBmYWNlLCBlZGdlO1xuXG5cdFx0Zm9yICggaSA9IDAsIGlsID0gdmVydGljZXMubGVuZ3RoOyBpIDwgaWw7IGkgKysgKSB7XG5cblx0XHRcdG1ldGFWZXJ0aWNlc1sgaSBdID0geyBlZGdlczogW10gfTtcblxuXHRcdH1cblxuXHRcdGZvciAoIGkgPSAwLCBpbCA9IGZhY2VzLmxlbmd0aDsgaSA8IGlsOyBpICsrICkge1xuXG5cdFx0XHRmYWNlID0gZmFjZXNbIGkgXTtcblxuXHRcdFx0cHJvY2Vzc0VkZ2UoIGZhY2UuYSwgZmFjZS5iLCB2ZXJ0aWNlcywgZWRnZXMsIGZhY2UsIG1ldGFWZXJ0aWNlcyApO1xuXHRcdFx0cHJvY2Vzc0VkZ2UoIGZhY2UuYiwgZmFjZS5jLCB2ZXJ0aWNlcywgZWRnZXMsIGZhY2UsIG1ldGFWZXJ0aWNlcyApO1xuXHRcdFx0cHJvY2Vzc0VkZ2UoIGZhY2UuYywgZmFjZS5hLCB2ZXJ0aWNlcywgZWRnZXMsIGZhY2UsIG1ldGFWZXJ0aWNlcyApO1xuXG5cdFx0fVxuXG5cdH1cblxuXHRmdW5jdGlvbiBuZXdGYWNlKCBuZXdGYWNlcywgYSwgYiwgYyApIHtcblxuXHRcdG5ld0ZhY2VzLnB1c2goIG5ldyBUSFJFRS5GYWNlMyggYSwgYiwgYyApICk7XG5cblx0fVxuXG5cdGZ1bmN0aW9uIG1pZHBvaW50KCBhLCBiICkge1xuXG5cdFx0cmV0dXJuICggTWF0aC5hYnMoIGIgLSBhICkgLyAyICkgKyBNYXRoLm1pbiggYSwgYiApO1xuXG5cdH1cblxuXHRmdW5jdGlvbiBuZXdVdiggbmV3VXZzLCBhLCBiLCBjICkge1xuXG5cdFx0bmV3VXZzLnB1c2goIFsgYS5jbG9uZSgpLCBiLmNsb25lKCksIGMuY2xvbmUoKSBdICk7XG5cblx0fVxuXG5cdC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG5cblx0Ly8gUGVyZm9ybXMgb25lIGl0ZXJhdGlvbiBvZiBTdWJkaXZpc2lvblxuXHRUSFJFRS5TdWJkaXZpc2lvbk1vZGlmaWVyLnByb3RvdHlwZS5zbW9vdGggPSBmdW5jdGlvbiAoIGdlb21ldHJ5ICkge1xuXG5cdFx0dmFyIHRtcCA9IG5ldyBUSFJFRS5WZWN0b3IzKCk7XG5cblx0XHR2YXIgb2xkVmVydGljZXMsIG9sZEZhY2VzLCBvbGRVdnM7XG5cdFx0dmFyIG5ld1ZlcnRpY2VzLCBuZXdGYWNlcywgbmV3VVZzID0gW107XG5cblx0XHR2YXIgbiwgbCwgaSwgaWwsIGosIGs7XG5cdFx0dmFyIG1ldGFWZXJ0aWNlcywgc291cmNlRWRnZXM7XG5cblx0XHQvLyBuZXcgc3R1ZmYuXG5cdFx0dmFyIHNvdXJjZUVkZ2VzLCBuZXdFZGdlVmVydGljZXMsIG5ld1NvdXJjZVZlcnRpY2VzO1xuXG5cdFx0b2xkVmVydGljZXMgPSBnZW9tZXRyeS52ZXJ0aWNlczsgLy8geyB4LCB5LCB6fVxuXHRcdG9sZEZhY2VzID0gZ2VvbWV0cnkuZmFjZXM7IC8vIHsgYTogb2xkVmVydGV4MSwgYjogb2xkVmVydGV4MiwgYzogb2xkVmVydGV4MyB9XG5cdFx0b2xkVXZzID0gZ2VvbWV0cnkuZmFjZVZlcnRleFV2c1sgMCBdO1xuXG5cdFx0dmFyIGhhc1V2cyA9IG9sZFV2cyAhPT0gdW5kZWZpbmVkICYmIG9sZFV2cy5sZW5ndGggPiAwO1xuXG5cdFx0LyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuXHRcdCAqXG5cdFx0ICogU3RlcCAwOiBQcmVwcm9jZXNzIEdlb21ldHJ5IHRvIEdlbmVyYXRlIGVkZ2VzIExvb2t1cFxuXHRcdCAqXG5cdFx0ICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG5cblx0XHRtZXRhVmVydGljZXMgPSBuZXcgQXJyYXkoIG9sZFZlcnRpY2VzLmxlbmd0aCApO1xuXHRcdHNvdXJjZUVkZ2VzID0ge307IC8vIEVkZ2UgPT4geyBvbGRWZXJ0ZXgxLCBvbGRWZXJ0ZXgyLCBmYWNlc1tdICB9XG5cblx0XHRnZW5lcmF0ZUxvb2t1cHMoIG9sZFZlcnRpY2VzLCBvbGRGYWNlcywgbWV0YVZlcnRpY2VzLCBzb3VyY2VFZGdlcyApO1xuXG5cblx0XHQvKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG5cdFx0ICpcblx0XHQgKlx0U3RlcCAxLlxuXHRcdCAqXHRGb3IgZWFjaCBlZGdlLCBjcmVhdGUgYSBuZXcgRWRnZSBWZXJ0ZXgsXG5cdFx0ICpcdHRoZW4gcG9zaXRpb24gaXQuXG5cdFx0ICpcblx0XHQgKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cblxuXHRcdG5ld0VkZ2VWZXJ0aWNlcyA9IFtdO1xuXHRcdHZhciBvdGhlciwgY3VycmVudEVkZ2UsIG5ld0VkZ2UsIGZhY2U7XG5cdFx0dmFyIGVkZ2VWZXJ0ZXhXZWlnaHQsIGFkamFjZW50VmVydGV4V2VpZ2h0LCBjb25uZWN0ZWRGYWNlcztcblxuXHRcdGZvciAoIGkgaW4gc291cmNlRWRnZXMgKSB7XG5cblx0XHRcdGN1cnJlbnRFZGdlID0gc291cmNlRWRnZXNbIGkgXTtcblx0XHRcdG5ld0VkZ2UgPSBuZXcgVEhSRUUuVmVjdG9yMygpO1xuXG5cdFx0XHRlZGdlVmVydGV4V2VpZ2h0ID0gMyAvIDg7XG5cdFx0XHRhZGphY2VudFZlcnRleFdlaWdodCA9IDEgLyA4O1xuXG5cdFx0XHRjb25uZWN0ZWRGYWNlcyA9IGN1cnJlbnRFZGdlLmZhY2VzLmxlbmd0aDtcblxuXHRcdFx0Ly8gY2hlY2sgaG93IG1hbnkgbGlua2VkIGZhY2VzLiAyIHNob3VsZCBiZSBjb3JyZWN0LlxuXHRcdFx0aWYgKCBjb25uZWN0ZWRGYWNlcyAhPSAyICkge1xuXG5cdFx0XHRcdC8vIGlmIGxlbmd0aCBpcyBub3QgMiwgaGFuZGxlIGNvbmRpdGlvblxuXHRcdFx0XHRlZGdlVmVydGV4V2VpZ2h0ID0gMC41O1xuXHRcdFx0XHRhZGphY2VudFZlcnRleFdlaWdodCA9IDA7XG5cblx0XHRcdFx0aWYgKCBjb25uZWN0ZWRGYWNlcyAhPSAxICkge1xuXG5cdFx0XHRcdFx0aWYgKCBXQVJOSU5HUyApIGNvbnNvbGUud2FybiggJ1N1YmRpdmlzaW9uIE1vZGlmaWVyOiBOdW1iZXIgb2YgY29ubmVjdGVkIGZhY2VzICE9IDIsIGlzOiAnLCBjb25uZWN0ZWRGYWNlcywgY3VycmVudEVkZ2UgKTtcblxuXHRcdFx0XHR9XG5cblx0XHRcdH1cblxuXHRcdFx0bmV3RWRnZS5hZGRWZWN0b3JzKCBjdXJyZW50RWRnZS5hLCBjdXJyZW50RWRnZS5iICkubXVsdGlwbHlTY2FsYXIoIGVkZ2VWZXJ0ZXhXZWlnaHQgKTtcblxuXHRcdFx0dG1wLnNldCggMCwgMCwgMCApO1xuXG5cdFx0XHRmb3IgKCBqID0gMDsgaiA8IGNvbm5lY3RlZEZhY2VzOyBqICsrICkge1xuXG5cdFx0XHRcdGZhY2UgPSBjdXJyZW50RWRnZS5mYWNlc1sgaiBdO1xuXG5cdFx0XHRcdGZvciAoIGsgPSAwOyBrIDwgMzsgayArKyApIHtcblxuXHRcdFx0XHRcdG90aGVyID0gb2xkVmVydGljZXNbIGZhY2VbIEFCQ1sgayBdIF0gXTtcblx0XHRcdFx0XHRpZiAoIG90aGVyICE9PSBjdXJyZW50RWRnZS5hICYmIG90aGVyICE9PSBjdXJyZW50RWRnZS5iICkgYnJlYWs7XG5cblx0XHRcdFx0fVxuXG5cdFx0XHRcdHRtcC5hZGQoIG90aGVyICk7XG5cblx0XHRcdH1cblxuXHRcdFx0dG1wLm11bHRpcGx5U2NhbGFyKCBhZGphY2VudFZlcnRleFdlaWdodCApO1xuXHRcdFx0bmV3RWRnZS5hZGQoIHRtcCApO1xuXG5cdFx0XHRjdXJyZW50RWRnZS5uZXdFZGdlID0gbmV3RWRnZVZlcnRpY2VzLmxlbmd0aDtcblx0XHRcdG5ld0VkZ2VWZXJ0aWNlcy5wdXNoKCBuZXdFZGdlICk7XG5cblx0XHRcdC8vIGNvbnNvbGUubG9nKGN1cnJlbnRFZGdlLCBuZXdFZGdlKTtcblxuXHRcdH1cblxuXHRcdC8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcblx0XHQgKlxuXHRcdCAqXHRTdGVwIDIuXG5cdFx0ICpcdFJlcG9zaXRpb24gZWFjaCBzb3VyY2UgdmVydGljZXMuXG5cdFx0ICpcblx0XHQgKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cblxuXHRcdHZhciBiZXRhLCBzb3VyY2VWZXJ0ZXhXZWlnaHQsIGNvbm5lY3RpbmdWZXJ0ZXhXZWlnaHQ7XG5cdFx0dmFyIGNvbm5lY3RpbmdFZGdlLCBjb25uZWN0aW5nRWRnZXMsIG9sZFZlcnRleCwgbmV3U291cmNlVmVydGV4O1xuXHRcdG5ld1NvdXJjZVZlcnRpY2VzID0gW107XG5cblx0XHRmb3IgKCBpID0gMCwgaWwgPSBvbGRWZXJ0aWNlcy5sZW5ndGg7IGkgPCBpbDsgaSArKyApIHtcblxuXHRcdFx0b2xkVmVydGV4ID0gb2xkVmVydGljZXNbIGkgXTtcblxuXHRcdFx0Ly8gZmluZCBhbGwgY29ubmVjdGluZyBlZGdlcyAodXNpbmcgbG9va3VwVGFibGUpXG5cdFx0XHRjb25uZWN0aW5nRWRnZXMgPSBtZXRhVmVydGljZXNbIGkgXS5lZGdlcztcblx0XHRcdG4gPSBjb25uZWN0aW5nRWRnZXMubGVuZ3RoO1xuXG5cdFx0XHRpZiAoIG4gPT0gMyApIHtcblxuXHRcdFx0XHRiZXRhID0gMyAvIDE2O1xuXG5cdFx0XHR9IGVsc2UgaWYgKCBuID4gMyApIHtcblxuXHRcdFx0XHRiZXRhID0gMyAvICggOCAqIG4gKTsgLy8gV2FycmVuJ3MgbW9kaWZpZWQgZm9ybXVsYVxuXG5cdFx0XHR9XG5cblx0XHRcdC8vIExvb3AncyBvcmlnaW5hbCBiZXRhIGZvcm11bGFcblx0XHRcdC8vIGJldGEgPSAxIC8gbiAqICggNS84IC0gTWF0aC5wb3coIDMvOCArIDEvNCAqIE1hdGguY29zKCAyICogTWF0aC4gUEkgLyBuICksIDIpICk7XG5cblx0XHRcdHNvdXJjZVZlcnRleFdlaWdodCA9IDEgLSBuICogYmV0YTtcblx0XHRcdGNvbm5lY3RpbmdWZXJ0ZXhXZWlnaHQgPSBiZXRhO1xuXG5cdFx0XHRpZiAoIG4gPD0gMiApIHtcblxuXHRcdFx0XHQvLyBjcmVhc2UgYW5kIGJvdW5kYXJ5IHJ1bGVzXG5cdFx0XHRcdC8vIGNvbnNvbGUud2FybignY3JlYXNlIGFuZCBib3VuZGFyeSBydWxlcycpO1xuXG5cdFx0XHRcdGlmICggbiA9PSAyICkge1xuXG5cdFx0XHRcdFx0aWYgKCBXQVJOSU5HUyApIGNvbnNvbGUud2FybiggJzIgY29ubmVjdGluZyBlZGdlcycsIGNvbm5lY3RpbmdFZGdlcyApO1xuXHRcdFx0XHRcdHNvdXJjZVZlcnRleFdlaWdodCA9IDMgLyA0O1xuXHRcdFx0XHRcdGNvbm5lY3RpbmdWZXJ0ZXhXZWlnaHQgPSAxIC8gODtcblxuXHRcdFx0XHRcdC8vIHNvdXJjZVZlcnRleFdlaWdodCA9IDE7XG5cdFx0XHRcdFx0Ly8gY29ubmVjdGluZ1ZlcnRleFdlaWdodCA9IDA7XG5cblx0XHRcdFx0fSBlbHNlIGlmICggbiA9PSAxICkge1xuXG5cdFx0XHRcdFx0aWYgKCBXQVJOSU5HUyApIGNvbnNvbGUud2FybiggJ29ubHkgMSBjb25uZWN0aW5nIGVkZ2UnICk7XG5cblx0XHRcdFx0fSBlbHNlIGlmICggbiA9PSAwICkge1xuXG5cdFx0XHRcdFx0aWYgKCBXQVJOSU5HUyApIGNvbnNvbGUud2FybiggJzAgY29ubmVjdGluZyBlZGdlcycgKTtcblxuXHRcdFx0XHR9XG5cblx0XHRcdH1cblxuXHRcdFx0bmV3U291cmNlVmVydGV4ID0gb2xkVmVydGV4LmNsb25lKCkubXVsdGlwbHlTY2FsYXIoIHNvdXJjZVZlcnRleFdlaWdodCApO1xuXG5cdFx0XHR0bXAuc2V0KCAwLCAwLCAwICk7XG5cblx0XHRcdGZvciAoIGogPSAwOyBqIDwgbjsgaiArKyApIHtcblxuXHRcdFx0XHRjb25uZWN0aW5nRWRnZSA9IGNvbm5lY3RpbmdFZGdlc1sgaiBdO1xuXHRcdFx0XHRvdGhlciA9IGNvbm5lY3RpbmdFZGdlLmEgIT09IG9sZFZlcnRleCA/IGNvbm5lY3RpbmdFZGdlLmEgOiBjb25uZWN0aW5nRWRnZS5iO1xuXHRcdFx0XHR0bXAuYWRkKCBvdGhlciApO1xuXG5cdFx0XHR9XG5cblx0XHRcdHRtcC5tdWx0aXBseVNjYWxhciggY29ubmVjdGluZ1ZlcnRleFdlaWdodCApO1xuXHRcdFx0bmV3U291cmNlVmVydGV4LmFkZCggdG1wICk7XG5cblx0XHRcdG5ld1NvdXJjZVZlcnRpY2VzLnB1c2goIG5ld1NvdXJjZVZlcnRleCApO1xuXG5cdFx0fVxuXG5cblx0XHQvKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG5cdFx0ICpcblx0XHQgKlx0U3RlcCAzLlxuXHRcdCAqXHRHZW5lcmF0ZSBGYWNlcyBiZXR3ZWVuIHNvdXJjZSB2ZXJ0aWNlc1xuXHRcdCAqXHRhbmQgZWRnZSB2ZXJ0aWNlcy5cblx0XHQgKlxuXHRcdCAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuXG5cdFx0bmV3VmVydGljZXMgPSBuZXdTb3VyY2VWZXJ0aWNlcy5jb25jYXQoIG5ld0VkZ2VWZXJ0aWNlcyApO1xuXHRcdHZhciBzbCA9IG5ld1NvdXJjZVZlcnRpY2VzLmxlbmd0aCwgZWRnZTEsIGVkZ2UyLCBlZGdlMztcblx0XHRuZXdGYWNlcyA9IFtdO1xuXG5cdFx0dmFyIHV2LCB4MCwgeDEsIHgyO1xuXHRcdHZhciB4MyA9IG5ldyBUSFJFRS5WZWN0b3IyKCk7XG5cdFx0dmFyIHg0ID0gbmV3IFRIUkVFLlZlY3RvcjIoKTtcblx0XHR2YXIgeDUgPSBuZXcgVEhSRUUuVmVjdG9yMigpO1xuXG5cdFx0Zm9yICggaSA9IDAsIGlsID0gb2xkRmFjZXMubGVuZ3RoOyBpIDwgaWw7IGkgKysgKSB7XG5cblx0XHRcdGZhY2UgPSBvbGRGYWNlc1sgaSBdO1xuXG5cdFx0XHQvLyBmaW5kIHRoZSAzIG5ldyBlZGdlcyB2ZXJ0ZXggb2YgZWFjaCBvbGQgZmFjZVxuXG5cdFx0XHRlZGdlMSA9IGdldEVkZ2UoIGZhY2UuYSwgZmFjZS5iLCBzb3VyY2VFZGdlcyApLm5ld0VkZ2UgKyBzbDtcblx0XHRcdGVkZ2UyID0gZ2V0RWRnZSggZmFjZS5iLCBmYWNlLmMsIHNvdXJjZUVkZ2VzICkubmV3RWRnZSArIHNsO1xuXHRcdFx0ZWRnZTMgPSBnZXRFZGdlKCBmYWNlLmMsIGZhY2UuYSwgc291cmNlRWRnZXMgKS5uZXdFZGdlICsgc2w7XG5cblx0XHRcdC8vIGNyZWF0ZSA0IGZhY2VzLlxuXG5cdFx0XHRuZXdGYWNlKCBuZXdGYWNlcywgZWRnZTEsIGVkZ2UyLCBlZGdlMyApO1xuXHRcdFx0bmV3RmFjZSggbmV3RmFjZXMsIGZhY2UuYSwgZWRnZTEsIGVkZ2UzICk7XG5cdFx0XHRuZXdGYWNlKCBuZXdGYWNlcywgZmFjZS5iLCBlZGdlMiwgZWRnZTEgKTtcblx0XHRcdG5ld0ZhY2UoIG5ld0ZhY2VzLCBmYWNlLmMsIGVkZ2UzLCBlZGdlMiApO1xuXG5cdFx0XHQvLyBjcmVhdGUgNCBuZXcgdXYnc1xuXG5cdFx0XHRpZiAoIGhhc1V2cyApIHtcblxuXHRcdFx0XHR1diA9IG9sZFV2c1sgaSBdO1xuXG5cdFx0XHRcdHgwID0gdXZbIDAgXTtcblx0XHRcdFx0eDEgPSB1dlsgMSBdO1xuXHRcdFx0XHR4MiA9IHV2WyAyIF07XG5cblx0XHRcdFx0eDMuc2V0KCBtaWRwb2ludCggeDAueCwgeDEueCApLCBtaWRwb2ludCggeDAueSwgeDEueSApICk7XG5cdFx0XHRcdHg0LnNldCggbWlkcG9pbnQoIHgxLngsIHgyLnggKSwgbWlkcG9pbnQoIHgxLnksIHgyLnkgKSApO1xuXHRcdFx0XHR4NS5zZXQoIG1pZHBvaW50KCB4MC54LCB4Mi54ICksIG1pZHBvaW50KCB4MC55LCB4Mi55ICkgKTtcblxuXHRcdFx0XHRuZXdVdiggbmV3VVZzLCB4MywgeDQsIHg1ICk7XG5cdFx0XHRcdG5ld1V2KCBuZXdVVnMsIHgwLCB4MywgeDUgKTtcblxuXHRcdFx0XHRuZXdVdiggbmV3VVZzLCB4MSwgeDQsIHgzICk7XG5cdFx0XHRcdG5ld1V2KCBuZXdVVnMsIHgyLCB4NSwgeDQgKTtcblxuXHRcdFx0fVxuXG5cdFx0fVxuXG5cdFx0Ly8gT3ZlcndyaXRlIG9sZCBhcnJheXNcblx0XHRnZW9tZXRyeS52ZXJ0aWNlcyA9IG5ld1ZlcnRpY2VzO1xuXHRcdGdlb21ldHJ5LmZhY2VzID0gbmV3RmFjZXM7XG5cdFx0aWYgKCBoYXNVdnMgKSBnZW9tZXRyeS5mYWNlVmVydGV4VXZzWyAwIF0gPSBuZXdVVnM7XG5cblx0XHQvLyBjb25zb2xlLmxvZygnZG9uZScpO1xuXG5cdH07XG5cbn0gKSgpO1xuIiwidmFyIHN0ciA9IE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmdcblxubW9kdWxlLmV4cG9ydHMgPSBhbkFycmF5XG5cbmZ1bmN0aW9uIGFuQXJyYXkoYXJyKSB7XG4gIHJldHVybiAoXG4gICAgICAgYXJyLkJZVEVTX1BFUl9FTEVNRU5UXG4gICAgJiYgc3RyLmNhbGwoYXJyLmJ1ZmZlcikgPT09ICdbb2JqZWN0IEFycmF5QnVmZmVyXSdcbiAgICB8fCBBcnJheS5pc0FycmF5KGFycilcbiAgKVxufVxuIiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBudW10eXBlKG51bSwgZGVmKSB7XG5cdHJldHVybiB0eXBlb2YgbnVtID09PSAnbnVtYmVyJ1xuXHRcdD8gbnVtIFxuXHRcdDogKHR5cGVvZiBkZWYgPT09ICdudW1iZXInID8gZGVmIDogMClcbn0iLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGR0eXBlKSB7XG4gIHN3aXRjaCAoZHR5cGUpIHtcbiAgICBjYXNlICdpbnQ4JzpcbiAgICAgIHJldHVybiBJbnQ4QXJyYXlcbiAgICBjYXNlICdpbnQxNic6XG4gICAgICByZXR1cm4gSW50MTZBcnJheVxuICAgIGNhc2UgJ2ludDMyJzpcbiAgICAgIHJldHVybiBJbnQzMkFycmF5XG4gICAgY2FzZSAndWludDgnOlxuICAgICAgcmV0dXJuIFVpbnQ4QXJyYXlcbiAgICBjYXNlICd1aW50MTYnOlxuICAgICAgcmV0dXJuIFVpbnQxNkFycmF5XG4gICAgY2FzZSAndWludDMyJzpcbiAgICAgIHJldHVybiBVaW50MzJBcnJheVxuICAgIGNhc2UgJ2Zsb2F0MzInOlxuICAgICAgcmV0dXJuIEZsb2F0MzJBcnJheVxuICAgIGNhc2UgJ2Zsb2F0NjQnOlxuICAgICAgcmV0dXJuIEZsb2F0NjRBcnJheVxuICAgIGNhc2UgJ2FycmF5JzpcbiAgICAgIHJldHVybiBBcnJheVxuICAgIGNhc2UgJ3VpbnQ4X2NsYW1wZWQnOlxuICAgICAgcmV0dXJuIFVpbnQ4Q2xhbXBlZEFycmF5XG4gIH1cbn1cbiIsIi8vIENvcHlyaWdodCBKb3llbnQsIEluYy4gYW5kIG90aGVyIE5vZGUgY29udHJpYnV0b3JzLlxuLy9cbi8vIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhXG4vLyBjb3B5IG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlXG4vLyBcIlNvZnR3YXJlXCIpLCB0byBkZWFsIGluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmdcbi8vIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCxcbi8vIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0byBwZXJtaXRcbi8vIHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXMgZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZVxuLy8gZm9sbG93aW5nIGNvbmRpdGlvbnM6XG4vL1xuLy8gVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWRcbi8vIGluIGFsbCBjb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuLy9cbi8vIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1Ncbi8vIE9SIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0Zcbi8vIE1FUkNIQU5UQUJJTElUWSwgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU5cbi8vIE5PIEVWRU5UIFNIQUxMIFRIRSBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLFxuLy8gREFNQUdFUyBPUiBPVEhFUiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SXG4vLyBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSwgT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFXG4vLyBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU4gVEhFIFNPRlRXQVJFLlxuXG5mdW5jdGlvbiBFdmVudEVtaXR0ZXIoKSB7XG4gIHRoaXMuX2V2ZW50cyA9IHRoaXMuX2V2ZW50cyB8fCB7fTtcbiAgdGhpcy5fbWF4TGlzdGVuZXJzID0gdGhpcy5fbWF4TGlzdGVuZXJzIHx8IHVuZGVmaW5lZDtcbn1cbm1vZHVsZS5leHBvcnRzID0gRXZlbnRFbWl0dGVyO1xuXG4vLyBCYWNrd2FyZHMtY29tcGF0IHdpdGggbm9kZSAwLjEwLnhcbkV2ZW50RW1pdHRlci5FdmVudEVtaXR0ZXIgPSBFdmVudEVtaXR0ZXI7XG5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUuX2V2ZW50cyA9IHVuZGVmaW5lZDtcbkV2ZW50RW1pdHRlci5wcm90b3R5cGUuX21heExpc3RlbmVycyA9IHVuZGVmaW5lZDtcblxuLy8gQnkgZGVmYXVsdCBFdmVudEVtaXR0ZXJzIHdpbGwgcHJpbnQgYSB3YXJuaW5nIGlmIG1vcmUgdGhhbiAxMCBsaXN0ZW5lcnMgYXJlXG4vLyBhZGRlZCB0byBpdC4gVGhpcyBpcyBhIHVzZWZ1bCBkZWZhdWx0IHdoaWNoIGhlbHBzIGZpbmRpbmcgbWVtb3J5IGxlYWtzLlxuRXZlbnRFbWl0dGVyLmRlZmF1bHRNYXhMaXN0ZW5lcnMgPSAxMDtcblxuLy8gT2J2aW91c2x5IG5vdCBhbGwgRW1pdHRlcnMgc2hvdWxkIGJlIGxpbWl0ZWQgdG8gMTAuIFRoaXMgZnVuY3Rpb24gYWxsb3dzXG4vLyB0aGF0IHRvIGJlIGluY3JlYXNlZC4gU2V0IHRvIHplcm8gZm9yIHVubGltaXRlZC5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUuc2V0TWF4TGlzdGVuZXJzID0gZnVuY3Rpb24obikge1xuICBpZiAoIWlzTnVtYmVyKG4pIHx8IG4gPCAwIHx8IGlzTmFOKG4pKVxuICAgIHRocm93IFR5cGVFcnJvcignbiBtdXN0IGJlIGEgcG9zaXRpdmUgbnVtYmVyJyk7XG4gIHRoaXMuX21heExpc3RlbmVycyA9IG47XG4gIHJldHVybiB0aGlzO1xufTtcblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5lbWl0ID0gZnVuY3Rpb24odHlwZSkge1xuICB2YXIgZXIsIGhhbmRsZXIsIGxlbiwgYXJncywgaSwgbGlzdGVuZXJzO1xuXG4gIGlmICghdGhpcy5fZXZlbnRzKVxuICAgIHRoaXMuX2V2ZW50cyA9IHt9O1xuXG4gIC8vIElmIHRoZXJlIGlzIG5vICdlcnJvcicgZXZlbnQgbGlzdGVuZXIgdGhlbiB0aHJvdy5cbiAgaWYgKHR5cGUgPT09ICdlcnJvcicpIHtcbiAgICBpZiAoIXRoaXMuX2V2ZW50cy5lcnJvciB8fFxuICAgICAgICAoaXNPYmplY3QodGhpcy5fZXZlbnRzLmVycm9yKSAmJiAhdGhpcy5fZXZlbnRzLmVycm9yLmxlbmd0aCkpIHtcbiAgICAgIGVyID0gYXJndW1lbnRzWzFdO1xuICAgICAgaWYgKGVyIGluc3RhbmNlb2YgRXJyb3IpIHtcbiAgICAgICAgdGhyb3cgZXI7IC8vIFVuaGFuZGxlZCAnZXJyb3InIGV2ZW50XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAvLyBBdCBsZWFzdCBnaXZlIHNvbWUga2luZCBvZiBjb250ZXh0IHRvIHRoZSB1c2VyXG4gICAgICAgIHZhciBlcnIgPSBuZXcgRXJyb3IoJ1VuY2F1Z2h0LCB1bnNwZWNpZmllZCBcImVycm9yXCIgZXZlbnQuICgnICsgZXIgKyAnKScpO1xuICAgICAgICBlcnIuY29udGV4dCA9IGVyO1xuICAgICAgICB0aHJvdyBlcnI7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgaGFuZGxlciA9IHRoaXMuX2V2ZW50c1t0eXBlXTtcblxuICBpZiAoaXNVbmRlZmluZWQoaGFuZGxlcikpXG4gICAgcmV0dXJuIGZhbHNlO1xuXG4gIGlmIChpc0Z1bmN0aW9uKGhhbmRsZXIpKSB7XG4gICAgc3dpdGNoIChhcmd1bWVudHMubGVuZ3RoKSB7XG4gICAgICAvLyBmYXN0IGNhc2VzXG4gICAgICBjYXNlIDE6XG4gICAgICAgIGhhbmRsZXIuY2FsbCh0aGlzKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIDI6XG4gICAgICAgIGhhbmRsZXIuY2FsbCh0aGlzLCBhcmd1bWVudHNbMV0pO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgMzpcbiAgICAgICAgaGFuZGxlci5jYWxsKHRoaXMsIGFyZ3VtZW50c1sxXSwgYXJndW1lbnRzWzJdKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICAvLyBzbG93ZXJcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIGFyZ3MgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMsIDEpO1xuICAgICAgICBoYW5kbGVyLmFwcGx5KHRoaXMsIGFyZ3MpO1xuICAgIH1cbiAgfSBlbHNlIGlmIChpc09iamVjdChoYW5kbGVyKSkge1xuICAgIGFyZ3MgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMsIDEpO1xuICAgIGxpc3RlbmVycyA9IGhhbmRsZXIuc2xpY2UoKTtcbiAgICBsZW4gPSBsaXN0ZW5lcnMubGVuZ3RoO1xuICAgIGZvciAoaSA9IDA7IGkgPCBsZW47IGkrKylcbiAgICAgIGxpc3RlbmVyc1tpXS5hcHBseSh0aGlzLCBhcmdzKTtcbiAgfVxuXG4gIHJldHVybiB0cnVlO1xufTtcblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5hZGRMaXN0ZW5lciA9IGZ1bmN0aW9uKHR5cGUsIGxpc3RlbmVyKSB7XG4gIHZhciBtO1xuXG4gIGlmICghaXNGdW5jdGlvbihsaXN0ZW5lcikpXG4gICAgdGhyb3cgVHlwZUVycm9yKCdsaXN0ZW5lciBtdXN0IGJlIGEgZnVuY3Rpb24nKTtcblxuICBpZiAoIXRoaXMuX2V2ZW50cylcbiAgICB0aGlzLl9ldmVudHMgPSB7fTtcblxuICAvLyBUbyBhdm9pZCByZWN1cnNpb24gaW4gdGhlIGNhc2UgdGhhdCB0eXBlID09PSBcIm5ld0xpc3RlbmVyXCIhIEJlZm9yZVxuICAvLyBhZGRpbmcgaXQgdG8gdGhlIGxpc3RlbmVycywgZmlyc3QgZW1pdCBcIm5ld0xpc3RlbmVyXCIuXG4gIGlmICh0aGlzLl9ldmVudHMubmV3TGlzdGVuZXIpXG4gICAgdGhpcy5lbWl0KCduZXdMaXN0ZW5lcicsIHR5cGUsXG4gICAgICAgICAgICAgIGlzRnVuY3Rpb24obGlzdGVuZXIubGlzdGVuZXIpID9cbiAgICAgICAgICAgICAgbGlzdGVuZXIubGlzdGVuZXIgOiBsaXN0ZW5lcik7XG5cbiAgaWYgKCF0aGlzLl9ldmVudHNbdHlwZV0pXG4gICAgLy8gT3B0aW1pemUgdGhlIGNhc2Ugb2Ygb25lIGxpc3RlbmVyLiBEb24ndCBuZWVkIHRoZSBleHRyYSBhcnJheSBvYmplY3QuXG4gICAgdGhpcy5fZXZlbnRzW3R5cGVdID0gbGlzdGVuZXI7XG4gIGVsc2UgaWYgKGlzT2JqZWN0KHRoaXMuX2V2ZW50c1t0eXBlXSkpXG4gICAgLy8gSWYgd2UndmUgYWxyZWFkeSBnb3QgYW4gYXJyYXksIGp1c3QgYXBwZW5kLlxuICAgIHRoaXMuX2V2ZW50c1t0eXBlXS5wdXNoKGxpc3RlbmVyKTtcbiAgZWxzZVxuICAgIC8vIEFkZGluZyB0aGUgc2Vjb25kIGVsZW1lbnQsIG5lZWQgdG8gY2hhbmdlIHRvIGFycmF5LlxuICAgIHRoaXMuX2V2ZW50c1t0eXBlXSA9IFt0aGlzLl9ldmVudHNbdHlwZV0sIGxpc3RlbmVyXTtcblxuICAvLyBDaGVjayBmb3IgbGlzdGVuZXIgbGVha1xuICBpZiAoaXNPYmplY3QodGhpcy5fZXZlbnRzW3R5cGVdKSAmJiAhdGhpcy5fZXZlbnRzW3R5cGVdLndhcm5lZCkge1xuICAgIGlmICghaXNVbmRlZmluZWQodGhpcy5fbWF4TGlzdGVuZXJzKSkge1xuICAgICAgbSA9IHRoaXMuX21heExpc3RlbmVycztcbiAgICB9IGVsc2Uge1xuICAgICAgbSA9IEV2ZW50RW1pdHRlci5kZWZhdWx0TWF4TGlzdGVuZXJzO1xuICAgIH1cblxuICAgIGlmIChtICYmIG0gPiAwICYmIHRoaXMuX2V2ZW50c1t0eXBlXS5sZW5ndGggPiBtKSB7XG4gICAgICB0aGlzLl9ldmVudHNbdHlwZV0ud2FybmVkID0gdHJ1ZTtcbiAgICAgIGNvbnNvbGUuZXJyb3IoJyhub2RlKSB3YXJuaW5nOiBwb3NzaWJsZSBFdmVudEVtaXR0ZXIgbWVtb3J5ICcgK1xuICAgICAgICAgICAgICAgICAgICAnbGVhayBkZXRlY3RlZC4gJWQgbGlzdGVuZXJzIGFkZGVkLiAnICtcbiAgICAgICAgICAgICAgICAgICAgJ1VzZSBlbWl0dGVyLnNldE1heExpc3RlbmVycygpIHRvIGluY3JlYXNlIGxpbWl0LicsXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2V2ZW50c1t0eXBlXS5sZW5ndGgpO1xuICAgICAgaWYgKHR5cGVvZiBjb25zb2xlLnRyYWNlID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIC8vIG5vdCBzdXBwb3J0ZWQgaW4gSUUgMTBcbiAgICAgICAgY29uc29sZS50cmFjZSgpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHJldHVybiB0aGlzO1xufTtcblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5vbiA9IEV2ZW50RW1pdHRlci5wcm90b3R5cGUuYWRkTGlzdGVuZXI7XG5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUub25jZSA9IGZ1bmN0aW9uKHR5cGUsIGxpc3RlbmVyKSB7XG4gIGlmICghaXNGdW5jdGlvbihsaXN0ZW5lcikpXG4gICAgdGhyb3cgVHlwZUVycm9yKCdsaXN0ZW5lciBtdXN0IGJlIGEgZnVuY3Rpb24nKTtcblxuICB2YXIgZmlyZWQgPSBmYWxzZTtcblxuICBmdW5jdGlvbiBnKCkge1xuICAgIHRoaXMucmVtb3ZlTGlzdGVuZXIodHlwZSwgZyk7XG5cbiAgICBpZiAoIWZpcmVkKSB7XG4gICAgICBmaXJlZCA9IHRydWU7XG4gICAgICBsaXN0ZW5lci5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgIH1cbiAgfVxuXG4gIGcubGlzdGVuZXIgPSBsaXN0ZW5lcjtcbiAgdGhpcy5vbih0eXBlLCBnKTtcblxuICByZXR1cm4gdGhpcztcbn07XG5cbi8vIGVtaXRzIGEgJ3JlbW92ZUxpc3RlbmVyJyBldmVudCBpZmYgdGhlIGxpc3RlbmVyIHdhcyByZW1vdmVkXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLnJlbW92ZUxpc3RlbmVyID0gZnVuY3Rpb24odHlwZSwgbGlzdGVuZXIpIHtcbiAgdmFyIGxpc3QsIHBvc2l0aW9uLCBsZW5ndGgsIGk7XG5cbiAgaWYgKCFpc0Z1bmN0aW9uKGxpc3RlbmVyKSlcbiAgICB0aHJvdyBUeXBlRXJyb3IoJ2xpc3RlbmVyIG11c3QgYmUgYSBmdW5jdGlvbicpO1xuXG4gIGlmICghdGhpcy5fZXZlbnRzIHx8ICF0aGlzLl9ldmVudHNbdHlwZV0pXG4gICAgcmV0dXJuIHRoaXM7XG5cbiAgbGlzdCA9IHRoaXMuX2V2ZW50c1t0eXBlXTtcbiAgbGVuZ3RoID0gbGlzdC5sZW5ndGg7XG4gIHBvc2l0aW9uID0gLTE7XG5cbiAgaWYgKGxpc3QgPT09IGxpc3RlbmVyIHx8XG4gICAgICAoaXNGdW5jdGlvbihsaXN0Lmxpc3RlbmVyKSAmJiBsaXN0Lmxpc3RlbmVyID09PSBsaXN0ZW5lcikpIHtcbiAgICBkZWxldGUgdGhpcy5fZXZlbnRzW3R5cGVdO1xuICAgIGlmICh0aGlzLl9ldmVudHMucmVtb3ZlTGlzdGVuZXIpXG4gICAgICB0aGlzLmVtaXQoJ3JlbW92ZUxpc3RlbmVyJywgdHlwZSwgbGlzdGVuZXIpO1xuXG4gIH0gZWxzZSBpZiAoaXNPYmplY3QobGlzdCkpIHtcbiAgICBmb3IgKGkgPSBsZW5ndGg7IGktLSA+IDA7KSB7XG4gICAgICBpZiAobGlzdFtpXSA9PT0gbGlzdGVuZXIgfHxcbiAgICAgICAgICAobGlzdFtpXS5saXN0ZW5lciAmJiBsaXN0W2ldLmxpc3RlbmVyID09PSBsaXN0ZW5lcikpIHtcbiAgICAgICAgcG9zaXRpb24gPSBpO1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAocG9zaXRpb24gPCAwKVxuICAgICAgcmV0dXJuIHRoaXM7XG5cbiAgICBpZiAobGlzdC5sZW5ndGggPT09IDEpIHtcbiAgICAgIGxpc3QubGVuZ3RoID0gMDtcbiAgICAgIGRlbGV0ZSB0aGlzLl9ldmVudHNbdHlwZV07XG4gICAgfSBlbHNlIHtcbiAgICAgIGxpc3Quc3BsaWNlKHBvc2l0aW9uLCAxKTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5fZXZlbnRzLnJlbW92ZUxpc3RlbmVyKVxuICAgICAgdGhpcy5lbWl0KCdyZW1vdmVMaXN0ZW5lcicsIHR5cGUsIGxpc3RlbmVyKTtcbiAgfVxuXG4gIHJldHVybiB0aGlzO1xufTtcblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5yZW1vdmVBbGxMaXN0ZW5lcnMgPSBmdW5jdGlvbih0eXBlKSB7XG4gIHZhciBrZXksIGxpc3RlbmVycztcblxuICBpZiAoIXRoaXMuX2V2ZW50cylcbiAgICByZXR1cm4gdGhpcztcblxuICAvLyBub3QgbGlzdGVuaW5nIGZvciByZW1vdmVMaXN0ZW5lciwgbm8gbmVlZCB0byBlbWl0XG4gIGlmICghdGhpcy5fZXZlbnRzLnJlbW92ZUxpc3RlbmVyKSB7XG4gICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDApXG4gICAgICB0aGlzLl9ldmVudHMgPSB7fTtcbiAgICBlbHNlIGlmICh0aGlzLl9ldmVudHNbdHlwZV0pXG4gICAgICBkZWxldGUgdGhpcy5fZXZlbnRzW3R5cGVdO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgLy8gZW1pdCByZW1vdmVMaXN0ZW5lciBmb3IgYWxsIGxpc3RlbmVycyBvbiBhbGwgZXZlbnRzXG4gIGlmIChhcmd1bWVudHMubGVuZ3RoID09PSAwKSB7XG4gICAgZm9yIChrZXkgaW4gdGhpcy5fZXZlbnRzKSB7XG4gICAgICBpZiAoa2V5ID09PSAncmVtb3ZlTGlzdGVuZXInKSBjb250aW51ZTtcbiAgICAgIHRoaXMucmVtb3ZlQWxsTGlzdGVuZXJzKGtleSk7XG4gICAgfVxuICAgIHRoaXMucmVtb3ZlQWxsTGlzdGVuZXJzKCdyZW1vdmVMaXN0ZW5lcicpO1xuICAgIHRoaXMuX2V2ZW50cyA9IHt9O1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgbGlzdGVuZXJzID0gdGhpcy5fZXZlbnRzW3R5cGVdO1xuXG4gIGlmIChpc0Z1bmN0aW9uKGxpc3RlbmVycykpIHtcbiAgICB0aGlzLnJlbW92ZUxpc3RlbmVyKHR5cGUsIGxpc3RlbmVycyk7XG4gIH0gZWxzZSBpZiAobGlzdGVuZXJzKSB7XG4gICAgLy8gTElGTyBvcmRlclxuICAgIHdoaWxlIChsaXN0ZW5lcnMubGVuZ3RoKVxuICAgICAgdGhpcy5yZW1vdmVMaXN0ZW5lcih0eXBlLCBsaXN0ZW5lcnNbbGlzdGVuZXJzLmxlbmd0aCAtIDFdKTtcbiAgfVxuICBkZWxldGUgdGhpcy5fZXZlbnRzW3R5cGVdO1xuXG4gIHJldHVybiB0aGlzO1xufTtcblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5saXN0ZW5lcnMgPSBmdW5jdGlvbih0eXBlKSB7XG4gIHZhciByZXQ7XG4gIGlmICghdGhpcy5fZXZlbnRzIHx8ICF0aGlzLl9ldmVudHNbdHlwZV0pXG4gICAgcmV0ID0gW107XG4gIGVsc2UgaWYgKGlzRnVuY3Rpb24odGhpcy5fZXZlbnRzW3R5cGVdKSlcbiAgICByZXQgPSBbdGhpcy5fZXZlbnRzW3R5cGVdXTtcbiAgZWxzZVxuICAgIHJldCA9IHRoaXMuX2V2ZW50c1t0eXBlXS5zbGljZSgpO1xuICByZXR1cm4gcmV0O1xufTtcblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5saXN0ZW5lckNvdW50ID0gZnVuY3Rpb24odHlwZSkge1xuICBpZiAodGhpcy5fZXZlbnRzKSB7XG4gICAgdmFyIGV2bGlzdGVuZXIgPSB0aGlzLl9ldmVudHNbdHlwZV07XG5cbiAgICBpZiAoaXNGdW5jdGlvbihldmxpc3RlbmVyKSlcbiAgICAgIHJldHVybiAxO1xuICAgIGVsc2UgaWYgKGV2bGlzdGVuZXIpXG4gICAgICByZXR1cm4gZXZsaXN0ZW5lci5sZW5ndGg7XG4gIH1cbiAgcmV0dXJuIDA7XG59O1xuXG5FdmVudEVtaXR0ZXIubGlzdGVuZXJDb3VudCA9IGZ1bmN0aW9uKGVtaXR0ZXIsIHR5cGUpIHtcbiAgcmV0dXJuIGVtaXR0ZXIubGlzdGVuZXJDb3VudCh0eXBlKTtcbn07XG5cbmZ1bmN0aW9uIGlzRnVuY3Rpb24oYXJnKSB7XG4gIHJldHVybiB0eXBlb2YgYXJnID09PSAnZnVuY3Rpb24nO1xufVxuXG5mdW5jdGlvbiBpc051bWJlcihhcmcpIHtcbiAgcmV0dXJuIHR5cGVvZiBhcmcgPT09ICdudW1iZXInO1xufVxuXG5mdW5jdGlvbiBpc09iamVjdChhcmcpIHtcbiAgcmV0dXJuIHR5cGVvZiBhcmcgPT09ICdvYmplY3QnICYmIGFyZyAhPT0gbnVsbDtcbn1cblxuZnVuY3Rpb24gaXNVbmRlZmluZWQoYXJnKSB7XG4gIHJldHVybiBhcmcgPT09IHZvaWQgMDtcbn1cbiIsIi8qZXNsaW50IG5ldy1jYXA6MCovXG52YXIgZHR5cGUgPSByZXF1aXJlKCdkdHlwZScpXG5tb2R1bGUuZXhwb3J0cyA9IGZsYXR0ZW5WZXJ0ZXhEYXRhXG5mdW5jdGlvbiBmbGF0dGVuVmVydGV4RGF0YSAoZGF0YSwgb3V0cHV0LCBvZmZzZXQpIHtcbiAgaWYgKCFkYXRhKSB0aHJvdyBuZXcgVHlwZUVycm9yKCdtdXN0IHNwZWNpZnkgZGF0YSBhcyBmaXJzdCBwYXJhbWV0ZXInKVxuICBvZmZzZXQgPSArKG9mZnNldCB8fCAwKSB8IDBcblxuICBpZiAoQXJyYXkuaXNBcnJheShkYXRhKSAmJiBBcnJheS5pc0FycmF5KGRhdGFbMF0pKSB7XG4gICAgdmFyIGRpbSA9IGRhdGFbMF0ubGVuZ3RoXG4gICAgdmFyIGxlbmd0aCA9IGRhdGEubGVuZ3RoICogZGltXG5cbiAgICAvLyBubyBvdXRwdXQgc3BlY2lmaWVkLCBjcmVhdGUgYSBuZXcgdHlwZWQgYXJyYXlcbiAgICBpZiAoIW91dHB1dCB8fCB0eXBlb2Ygb3V0cHV0ID09PSAnc3RyaW5nJykge1xuICAgICAgb3V0cHV0ID0gbmV3IChkdHlwZShvdXRwdXQgfHwgJ2Zsb2F0MzInKSkobGVuZ3RoICsgb2Zmc2V0KVxuICAgIH1cblxuICAgIHZhciBkc3RMZW5ndGggPSBvdXRwdXQubGVuZ3RoIC0gb2Zmc2V0XG4gICAgaWYgKGxlbmd0aCAhPT0gZHN0TGVuZ3RoKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ3NvdXJjZSBsZW5ndGggJyArIGxlbmd0aCArICcgKCcgKyBkaW0gKyAneCcgKyBkYXRhLmxlbmd0aCArICcpJyArXG4gICAgICAgICcgZG9lcyBub3QgbWF0Y2ggZGVzdGluYXRpb24gbGVuZ3RoICcgKyBkc3RMZW5ndGgpXG4gICAgfVxuXG4gICAgZm9yICh2YXIgaSA9IDAsIGsgPSBvZmZzZXQ7IGkgPCBkYXRhLmxlbmd0aDsgaSsrKSB7XG4gICAgICBmb3IgKHZhciBqID0gMDsgaiA8IGRpbTsgaisrKSB7XG4gICAgICAgIG91dHB1dFtrKytdID0gZGF0YVtpXVtqXVxuICAgICAgfVxuICAgIH1cbiAgfSBlbHNlIHtcbiAgICBpZiAoIW91dHB1dCB8fCB0eXBlb2Ygb3V0cHV0ID09PSAnc3RyaW5nJykge1xuICAgICAgLy8gbm8gb3V0cHV0LCBjcmVhdGUgYSBuZXcgb25lXG4gICAgICB2YXIgQ3RvciA9IGR0eXBlKG91dHB1dCB8fCAnZmxvYXQzMicpXG4gICAgICBpZiAob2Zmc2V0ID09PSAwKSB7XG4gICAgICAgIG91dHB1dCA9IG5ldyBDdG9yKGRhdGEpXG4gICAgICB9IGVsc2Uge1xuICAgICAgICBvdXRwdXQgPSBuZXcgQ3RvcihkYXRhLmxlbmd0aCArIG9mZnNldClcbiAgICAgICAgb3V0cHV0LnNldChkYXRhLCBvZmZzZXQpXG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIHN0b3JlIG91dHB1dCBpbiBleGlzdGluZyBhcnJheVxuICAgICAgb3V0cHV0LnNldChkYXRhLCBvZmZzZXQpXG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIG91dHB1dFxufVxuIiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBjb21waWxlKHByb3BlcnR5KSB7XG5cdGlmICghcHJvcGVydHkgfHwgdHlwZW9mIHByb3BlcnR5ICE9PSAnc3RyaW5nJylcblx0XHR0aHJvdyBuZXcgRXJyb3IoJ211c3Qgc3BlY2lmeSBwcm9wZXJ0eSBmb3IgaW5kZXhvZiBzZWFyY2gnKVxuXG5cdHJldHVybiBuZXcgRnVuY3Rpb24oJ2FycmF5JywgJ3ZhbHVlJywgJ3N0YXJ0JywgW1xuXHRcdCdzdGFydCA9IHN0YXJ0IHx8IDAnLFxuXHRcdCdmb3IgKHZhciBpPXN0YXJ0OyBpPGFycmF5Lmxlbmd0aDsgaSsrKScsXG5cdFx0JyAgaWYgKGFycmF5W2ldW1wiJyArIHByb3BlcnR5ICsnXCJdID09PSB2YWx1ZSknLFxuXHRcdCcgICAgICByZXR1cm4gaScsXG5cdFx0J3JldHVybiAtMSdcblx0XS5qb2luKCdcXG4nKSlcbn0iLCJpZiAodHlwZW9mIE9iamVjdC5jcmVhdGUgPT09ICdmdW5jdGlvbicpIHtcbiAgLy8gaW1wbGVtZW50YXRpb24gZnJvbSBzdGFuZGFyZCBub2RlLmpzICd1dGlsJyBtb2R1bGVcbiAgbW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBpbmhlcml0cyhjdG9yLCBzdXBlckN0b3IpIHtcbiAgICBjdG9yLnN1cGVyXyA9IHN1cGVyQ3RvclxuICAgIGN0b3IucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShzdXBlckN0b3IucHJvdG90eXBlLCB7XG4gICAgICBjb25zdHJ1Y3Rvcjoge1xuICAgICAgICB2YWx1ZTogY3RvcixcbiAgICAgICAgZW51bWVyYWJsZTogZmFsc2UsXG4gICAgICAgIHdyaXRhYmxlOiB0cnVlLFxuICAgICAgICBjb25maWd1cmFibGU6IHRydWVcbiAgICAgIH1cbiAgICB9KTtcbiAgfTtcbn0gZWxzZSB7XG4gIC8vIG9sZCBzY2hvb2wgc2hpbSBmb3Igb2xkIGJyb3dzZXJzXG4gIG1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gaW5oZXJpdHMoY3Rvciwgc3VwZXJDdG9yKSB7XG4gICAgY3Rvci5zdXBlcl8gPSBzdXBlckN0b3JcbiAgICB2YXIgVGVtcEN0b3IgPSBmdW5jdGlvbiAoKSB7fVxuICAgIFRlbXBDdG9yLnByb3RvdHlwZSA9IHN1cGVyQ3Rvci5wcm90b3R5cGVcbiAgICBjdG9yLnByb3RvdHlwZSA9IG5ldyBUZW1wQ3RvcigpXG4gICAgY3Rvci5wcm90b3R5cGUuY29uc3RydWN0b3IgPSBjdG9yXG4gIH1cbn1cbiIsIi8qIVxuICogRGV0ZXJtaW5lIGlmIGFuIG9iamVjdCBpcyBhIEJ1ZmZlclxuICpcbiAqIEBhdXRob3IgICBGZXJvc3MgQWJvdWtoYWRpamVoIDxmZXJvc3NAZmVyb3NzLm9yZz4gPGh0dHA6Ly9mZXJvc3Mub3JnPlxuICogQGxpY2Vuc2UgIE1JVFxuICovXG5cbi8vIFRoZSBfaXNCdWZmZXIgY2hlY2sgaXMgZm9yIFNhZmFyaSA1LTcgc3VwcG9ydCwgYmVjYXVzZSBpdCdzIG1pc3Npbmdcbi8vIE9iamVjdC5wcm90b3R5cGUuY29uc3RydWN0b3IuIFJlbW92ZSB0aGlzIGV2ZW50dWFsbHlcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKG9iaikge1xuICByZXR1cm4gb2JqICE9IG51bGwgJiYgKGlzQnVmZmVyKG9iaikgfHwgaXNTbG93QnVmZmVyKG9iaikgfHwgISFvYmouX2lzQnVmZmVyKVxufVxuXG5mdW5jdGlvbiBpc0J1ZmZlciAob2JqKSB7XG4gIHJldHVybiAhIW9iai5jb25zdHJ1Y3RvciAmJiB0eXBlb2Ygb2JqLmNvbnN0cnVjdG9yLmlzQnVmZmVyID09PSAnZnVuY3Rpb24nICYmIG9iai5jb25zdHJ1Y3Rvci5pc0J1ZmZlcihvYmopXG59XG5cbi8vIEZvciBOb2RlIHYwLjEwIHN1cHBvcnQuIFJlbW92ZSB0aGlzIGV2ZW50dWFsbHkuXG5mdW5jdGlvbiBpc1Nsb3dCdWZmZXIgKG9iaikge1xuICByZXR1cm4gdHlwZW9mIG9iai5yZWFkRmxvYXRMRSA9PT0gJ2Z1bmN0aW9uJyAmJiB0eXBlb2Ygb2JqLnNsaWNlID09PSAnZnVuY3Rpb24nICYmIGlzQnVmZmVyKG9iai5zbGljZSgwLCAwKSlcbn1cbiIsInZhciB3b3JkV3JhcCA9IHJlcXVpcmUoJ3dvcmQtd3JhcHBlcicpXG52YXIgeHRlbmQgPSByZXF1aXJlKCd4dGVuZCcpXG52YXIgZmluZENoYXIgPSByZXF1aXJlKCdpbmRleG9mLXByb3BlcnR5JykoJ2lkJylcbnZhciBudW1iZXIgPSByZXF1aXJlKCdhcy1udW1iZXInKVxuXG52YXIgWF9IRUlHSFRTID0gWyd4JywgJ2UnLCAnYScsICdvJywgJ24nLCAncycsICdyJywgJ2MnLCAndScsICdtJywgJ3YnLCAndycsICd6J11cbnZhciBNX1dJRFRIUyA9IFsnbScsICd3J11cbnZhciBDQVBfSEVJR0hUUyA9IFsnSCcsICdJJywgJ04nLCAnRScsICdGJywgJ0snLCAnTCcsICdUJywgJ1UnLCAnVicsICdXJywgJ1gnLCAnWScsICdaJ11cblxuXG52YXIgVEFCX0lEID0gJ1xcdCcuY2hhckNvZGVBdCgwKVxudmFyIFNQQUNFX0lEID0gJyAnLmNoYXJDb2RlQXQoMClcbnZhciBBTElHTl9MRUZUID0gMCwgXG4gICAgQUxJR05fQ0VOVEVSID0gMSwgXG4gICAgQUxJR05fUklHSFQgPSAyXG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gY3JlYXRlTGF5b3V0KG9wdCkge1xuICByZXR1cm4gbmV3IFRleHRMYXlvdXQob3B0KVxufVxuXG5mdW5jdGlvbiBUZXh0TGF5b3V0KG9wdCkge1xuICB0aGlzLmdseXBocyA9IFtdXG4gIHRoaXMuX21lYXN1cmUgPSB0aGlzLmNvbXB1dGVNZXRyaWNzLmJpbmQodGhpcylcbiAgdGhpcy51cGRhdGUob3B0KVxufVxuXG5UZXh0TGF5b3V0LnByb3RvdHlwZS51cGRhdGUgPSBmdW5jdGlvbihvcHQpIHtcbiAgb3B0ID0geHRlbmQoe1xuICAgIG1lYXN1cmU6IHRoaXMuX21lYXN1cmVcbiAgfSwgb3B0KVxuICB0aGlzLl9vcHQgPSBvcHRcbiAgdGhpcy5fb3B0LnRhYlNpemUgPSBudW1iZXIodGhpcy5fb3B0LnRhYlNpemUsIDQpXG5cbiAgaWYgKCFvcHQuZm9udClcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ211c3QgcHJvdmlkZSBhIHZhbGlkIGJpdG1hcCBmb250JylcblxuICB2YXIgZ2x5cGhzID0gdGhpcy5nbHlwaHNcbiAgdmFyIHRleHQgPSBvcHQudGV4dHx8JycgXG4gIHZhciBmb250ID0gb3B0LmZvbnRcbiAgdGhpcy5fc2V0dXBTcGFjZUdseXBocyhmb250KVxuICBcbiAgdmFyIGxpbmVzID0gd29yZFdyYXAubGluZXModGV4dCwgb3B0KVxuICB2YXIgbWluV2lkdGggPSBvcHQud2lkdGggfHwgMFxuXG4gIC8vY2xlYXIgZ2x5cGhzXG4gIGdseXBocy5sZW5ndGggPSAwXG5cbiAgLy9nZXQgbWF4IGxpbmUgd2lkdGhcbiAgdmFyIG1heExpbmVXaWR0aCA9IGxpbmVzLnJlZHVjZShmdW5jdGlvbihwcmV2LCBsaW5lKSB7XG4gICAgcmV0dXJuIE1hdGgubWF4KHByZXYsIGxpbmUud2lkdGgsIG1pbldpZHRoKVxuICB9LCAwKVxuXG4gIC8vdGhlIHBlbiBwb3NpdGlvblxuICB2YXIgeCA9IDBcbiAgdmFyIHkgPSAwXG4gIHZhciBsaW5lSGVpZ2h0ID0gbnVtYmVyKG9wdC5saW5lSGVpZ2h0LCBmb250LmNvbW1vbi5saW5lSGVpZ2h0KVxuICB2YXIgYmFzZWxpbmUgPSBmb250LmNvbW1vbi5iYXNlXG4gIHZhciBkZXNjZW5kZXIgPSBsaW5lSGVpZ2h0LWJhc2VsaW5lXG4gIHZhciBsZXR0ZXJTcGFjaW5nID0gb3B0LmxldHRlclNwYWNpbmcgfHwgMFxuICB2YXIgaGVpZ2h0ID0gbGluZUhlaWdodCAqIGxpbmVzLmxlbmd0aCAtIGRlc2NlbmRlclxuICB2YXIgYWxpZ24gPSBnZXRBbGlnblR5cGUodGhpcy5fb3B0LmFsaWduKVxuXG4gIC8vZHJhdyB0ZXh0IGFsb25nIGJhc2VsaW5lXG4gIHkgLT0gaGVpZ2h0XG4gIFxuICAvL3RoZSBtZXRyaWNzIGZvciB0aGlzIHRleHQgbGF5b3V0XG4gIHRoaXMuX3dpZHRoID0gbWF4TGluZVdpZHRoXG4gIHRoaXMuX2hlaWdodCA9IGhlaWdodFxuICB0aGlzLl9kZXNjZW5kZXIgPSBsaW5lSGVpZ2h0IC0gYmFzZWxpbmVcbiAgdGhpcy5fYmFzZWxpbmUgPSBiYXNlbGluZVxuICB0aGlzLl94SGVpZ2h0ID0gZ2V0WEhlaWdodChmb250KVxuICB0aGlzLl9jYXBIZWlnaHQgPSBnZXRDYXBIZWlnaHQoZm9udClcbiAgdGhpcy5fbGluZUhlaWdodCA9IGxpbmVIZWlnaHRcbiAgdGhpcy5fYXNjZW5kZXIgPSBsaW5lSGVpZ2h0IC0gZGVzY2VuZGVyIC0gdGhpcy5feEhlaWdodFxuICAgIFxuICAvL2xheW91dCBlYWNoIGdseXBoXG4gIHZhciBzZWxmID0gdGhpc1xuICBsaW5lcy5mb3JFYWNoKGZ1bmN0aW9uKGxpbmUsIGxpbmVJbmRleCkge1xuICAgIHZhciBzdGFydCA9IGxpbmUuc3RhcnRcbiAgICB2YXIgZW5kID0gbGluZS5lbmRcbiAgICB2YXIgbGluZVdpZHRoID0gbGluZS53aWR0aFxuICAgIHZhciBsYXN0R2x5cGhcbiAgICBcbiAgICAvL2ZvciBlYWNoIGdseXBoIGluIHRoYXQgbGluZS4uLlxuICAgIGZvciAodmFyIGk9c3RhcnQ7IGk8ZW5kOyBpKyspIHtcbiAgICAgIHZhciBpZCA9IHRleHQuY2hhckNvZGVBdChpKVxuICAgICAgdmFyIGdseXBoID0gc2VsZi5nZXRHbHlwaChmb250LCBpZClcbiAgICAgIGlmIChnbHlwaCkge1xuICAgICAgICBpZiAobGFzdEdseXBoKSBcbiAgICAgICAgICB4ICs9IGdldEtlcm5pbmcoZm9udCwgbGFzdEdseXBoLmlkLCBnbHlwaC5pZClcblxuICAgICAgICB2YXIgdHggPSB4XG4gICAgICAgIGlmIChhbGlnbiA9PT0gQUxJR05fQ0VOVEVSKSBcbiAgICAgICAgICB0eCArPSAobWF4TGluZVdpZHRoLWxpbmVXaWR0aCkvMlxuICAgICAgICBlbHNlIGlmIChhbGlnbiA9PT0gQUxJR05fUklHSFQpXG4gICAgICAgICAgdHggKz0gKG1heExpbmVXaWR0aC1saW5lV2lkdGgpXG5cbiAgICAgICAgZ2x5cGhzLnB1c2goe1xuICAgICAgICAgIHBvc2l0aW9uOiBbdHgsIHldLFxuICAgICAgICAgIGRhdGE6IGdseXBoLFxuICAgICAgICAgIGluZGV4OiBpLFxuICAgICAgICAgIGxpbmU6IGxpbmVJbmRleFxuICAgICAgICB9KSAgXG5cbiAgICAgICAgLy9tb3ZlIHBlbiBmb3J3YXJkXG4gICAgICAgIHggKz0gZ2x5cGgueGFkdmFuY2UgKyBsZXR0ZXJTcGFjaW5nXG4gICAgICAgIGxhc3RHbHlwaCA9IGdseXBoXG4gICAgICB9XG4gICAgfVxuXG4gICAgLy9uZXh0IGxpbmUgZG93blxuICAgIHkgKz0gbGluZUhlaWdodFxuICAgIHggPSAwXG4gIH0pXG4gIHRoaXMuX2xpbmVzVG90YWwgPSBsaW5lcy5sZW5ndGg7XG59XG5cblRleHRMYXlvdXQucHJvdG90eXBlLl9zZXR1cFNwYWNlR2x5cGhzID0gZnVuY3Rpb24oZm9udCkge1xuICAvL1RoZXNlIGFyZSBmYWxsYmFja3MsIHdoZW4gdGhlIGZvbnQgZG9lc24ndCBpbmNsdWRlXG4gIC8vJyAnIG9yICdcXHQnIGdseXBoc1xuICB0aGlzLl9mYWxsYmFja1NwYWNlR2x5cGggPSBudWxsXG4gIHRoaXMuX2ZhbGxiYWNrVGFiR2x5cGggPSBudWxsXG5cbiAgaWYgKCFmb250LmNoYXJzIHx8IGZvbnQuY2hhcnMubGVuZ3RoID09PSAwKVxuICAgIHJldHVyblxuXG4gIC8vdHJ5IHRvIGdldCBzcGFjZSBnbHlwaFxuICAvL3RoZW4gZmFsbCBiYWNrIHRvIHRoZSAnbScgb3IgJ3cnIGdseXBoc1xuICAvL3RoZW4gZmFsbCBiYWNrIHRvIHRoZSBmaXJzdCBnbHlwaCBhdmFpbGFibGVcbiAgdmFyIHNwYWNlID0gZ2V0R2x5cGhCeUlkKGZvbnQsIFNQQUNFX0lEKSBcbiAgICAgICAgICB8fCBnZXRNR2x5cGgoZm9udCkgXG4gICAgICAgICAgfHwgZm9udC5jaGFyc1swXVxuXG4gIC8vYW5kIGNyZWF0ZSBhIGZhbGxiYWNrIGZvciB0YWJcbiAgdmFyIHRhYldpZHRoID0gdGhpcy5fb3B0LnRhYlNpemUgKiBzcGFjZS54YWR2YW5jZVxuICB0aGlzLl9mYWxsYmFja1NwYWNlR2x5cGggPSBzcGFjZVxuICB0aGlzLl9mYWxsYmFja1RhYkdseXBoID0geHRlbmQoc3BhY2UsIHtcbiAgICB4OiAwLCB5OiAwLCB4YWR2YW5jZTogdGFiV2lkdGgsIGlkOiBUQUJfSUQsIFxuICAgIHhvZmZzZXQ6IDAsIHlvZmZzZXQ6IDAsIHdpZHRoOiAwLCBoZWlnaHQ6IDBcbiAgfSlcbn1cblxuVGV4dExheW91dC5wcm90b3R5cGUuZ2V0R2x5cGggPSBmdW5jdGlvbihmb250LCBpZCkge1xuICB2YXIgZ2x5cGggPSBnZXRHbHlwaEJ5SWQoZm9udCwgaWQpXG4gIGlmIChnbHlwaClcbiAgICByZXR1cm4gZ2x5cGhcbiAgZWxzZSBpZiAoaWQgPT09IFRBQl9JRCkgXG4gICAgcmV0dXJuIHRoaXMuX2ZhbGxiYWNrVGFiR2x5cGhcbiAgZWxzZSBpZiAoaWQgPT09IFNQQUNFX0lEKSBcbiAgICByZXR1cm4gdGhpcy5fZmFsbGJhY2tTcGFjZUdseXBoXG4gIHJldHVybiBudWxsXG59XG5cblRleHRMYXlvdXQucHJvdG90eXBlLmNvbXB1dGVNZXRyaWNzID0gZnVuY3Rpb24odGV4dCwgc3RhcnQsIGVuZCwgd2lkdGgpIHtcbiAgdmFyIGxldHRlclNwYWNpbmcgPSB0aGlzLl9vcHQubGV0dGVyU3BhY2luZyB8fCAwXG4gIHZhciBmb250ID0gdGhpcy5fb3B0LmZvbnRcbiAgdmFyIGN1clBlbiA9IDBcbiAgdmFyIGN1cldpZHRoID0gMFxuICB2YXIgY291bnQgPSAwXG4gIHZhciBnbHlwaFxuICB2YXIgbGFzdEdseXBoXG5cbiAgaWYgKCFmb250LmNoYXJzIHx8IGZvbnQuY2hhcnMubGVuZ3RoID09PSAwKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIHN0YXJ0OiBzdGFydCxcbiAgICAgIGVuZDogc3RhcnQsXG4gICAgICB3aWR0aDogMFxuICAgIH1cbiAgfVxuXG4gIGVuZCA9IE1hdGgubWluKHRleHQubGVuZ3RoLCBlbmQpXG4gIGZvciAodmFyIGk9c3RhcnQ7IGkgPCBlbmQ7IGkrKykge1xuICAgIHZhciBpZCA9IHRleHQuY2hhckNvZGVBdChpKVxuICAgIHZhciBnbHlwaCA9IHRoaXMuZ2V0R2x5cGgoZm9udCwgaWQpXG5cbiAgICBpZiAoZ2x5cGgpIHtcbiAgICAgIC8vbW92ZSBwZW4gZm9yd2FyZFxuICAgICAgdmFyIHhvZmYgPSBnbHlwaC54b2Zmc2V0XG4gICAgICB2YXIga2VybiA9IGxhc3RHbHlwaCA/IGdldEtlcm5pbmcoZm9udCwgbGFzdEdseXBoLmlkLCBnbHlwaC5pZCkgOiAwXG4gICAgICBjdXJQZW4gKz0ga2VyblxuXG4gICAgICB2YXIgbmV4dFBlbiA9IGN1clBlbiArIGdseXBoLnhhZHZhbmNlICsgbGV0dGVyU3BhY2luZ1xuICAgICAgdmFyIG5leHRXaWR0aCA9IGN1clBlbiArIGdseXBoLndpZHRoXG5cbiAgICAgIC8vd2UndmUgaGl0IG91ciBsaW1pdDsgd2UgY2FuJ3QgbW92ZSBvbnRvIHRoZSBuZXh0IGdseXBoXG4gICAgICBpZiAobmV4dFdpZHRoID49IHdpZHRoIHx8IG5leHRQZW4gPj0gd2lkdGgpXG4gICAgICAgIGJyZWFrXG5cbiAgICAgIC8vb3RoZXJ3aXNlIGNvbnRpbnVlIGFsb25nIG91ciBsaW5lXG4gICAgICBjdXJQZW4gPSBuZXh0UGVuXG4gICAgICBjdXJXaWR0aCA9IG5leHRXaWR0aFxuICAgICAgbGFzdEdseXBoID0gZ2x5cGhcbiAgICB9XG4gICAgY291bnQrK1xuICB9XG4gIFxuICAvL21ha2Ugc3VyZSByaWdodG1vc3QgZWRnZSBsaW5lcyB1cCB3aXRoIHJlbmRlcmVkIGdseXBoc1xuICBpZiAobGFzdEdseXBoKVxuICAgIGN1cldpZHRoICs9IGxhc3RHbHlwaC54b2Zmc2V0XG5cbiAgcmV0dXJuIHtcbiAgICBzdGFydDogc3RhcnQsXG4gICAgZW5kOiBzdGFydCArIGNvdW50LFxuICAgIHdpZHRoOiBjdXJXaWR0aFxuICB9XG59XG5cbi8vZ2V0dGVycyBmb3IgdGhlIHByaXZhdGUgdmFyc1xuO1snd2lkdGgnLCAnaGVpZ2h0JywgXG4gICdkZXNjZW5kZXInLCAnYXNjZW5kZXInLFxuICAneEhlaWdodCcsICdiYXNlbGluZScsXG4gICdjYXBIZWlnaHQnLFxuICAnbGluZUhlaWdodCcgXS5mb3JFYWNoKGFkZEdldHRlcilcblxuZnVuY3Rpb24gYWRkR2V0dGVyKG5hbWUpIHtcbiAgT2JqZWN0LmRlZmluZVByb3BlcnR5KFRleHRMYXlvdXQucHJvdG90eXBlLCBuYW1lLCB7XG4gICAgZ2V0OiB3cmFwcGVyKG5hbWUpLFxuICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxuICB9KVxufVxuXG4vL2NyZWF0ZSBsb29rdXBzIGZvciBwcml2YXRlIHZhcnNcbmZ1bmN0aW9uIHdyYXBwZXIobmFtZSkge1xuICByZXR1cm4gKG5ldyBGdW5jdGlvbihbXG4gICAgJ3JldHVybiBmdW5jdGlvbiAnK25hbWUrJygpIHsnLFxuICAgICcgIHJldHVybiB0aGlzLl8nK25hbWUsXG4gICAgJ30nXG4gIF0uam9pbignXFxuJykpKSgpXG59XG5cbmZ1bmN0aW9uIGdldEdseXBoQnlJZChmb250LCBpZCkge1xuICBpZiAoIWZvbnQuY2hhcnMgfHwgZm9udC5jaGFycy5sZW5ndGggPT09IDApXG4gICAgcmV0dXJuIG51bGxcblxuICB2YXIgZ2x5cGhJZHggPSBmaW5kQ2hhcihmb250LmNoYXJzLCBpZClcbiAgaWYgKGdseXBoSWR4ID49IDApXG4gICAgcmV0dXJuIGZvbnQuY2hhcnNbZ2x5cGhJZHhdXG4gIHJldHVybiBudWxsXG59XG5cbmZ1bmN0aW9uIGdldFhIZWlnaHQoZm9udCkge1xuICBmb3IgKHZhciBpPTA7IGk8WF9IRUlHSFRTLmxlbmd0aDsgaSsrKSB7XG4gICAgdmFyIGlkID0gWF9IRUlHSFRTW2ldLmNoYXJDb2RlQXQoMClcbiAgICB2YXIgaWR4ID0gZmluZENoYXIoZm9udC5jaGFycywgaWQpXG4gICAgaWYgKGlkeCA+PSAwKSBcbiAgICAgIHJldHVybiBmb250LmNoYXJzW2lkeF0uaGVpZ2h0XG4gIH1cbiAgcmV0dXJuIDBcbn1cblxuZnVuY3Rpb24gZ2V0TUdseXBoKGZvbnQpIHtcbiAgZm9yICh2YXIgaT0wOyBpPE1fV0lEVEhTLmxlbmd0aDsgaSsrKSB7XG4gICAgdmFyIGlkID0gTV9XSURUSFNbaV0uY2hhckNvZGVBdCgwKVxuICAgIHZhciBpZHggPSBmaW5kQ2hhcihmb250LmNoYXJzLCBpZClcbiAgICBpZiAoaWR4ID49IDApIFxuICAgICAgcmV0dXJuIGZvbnQuY2hhcnNbaWR4XVxuICB9XG4gIHJldHVybiAwXG59XG5cbmZ1bmN0aW9uIGdldENhcEhlaWdodChmb250KSB7XG4gIGZvciAodmFyIGk9MDsgaTxDQVBfSEVJR0hUUy5sZW5ndGg7IGkrKykge1xuICAgIHZhciBpZCA9IENBUF9IRUlHSFRTW2ldLmNoYXJDb2RlQXQoMClcbiAgICB2YXIgaWR4ID0gZmluZENoYXIoZm9udC5jaGFycywgaWQpXG4gICAgaWYgKGlkeCA+PSAwKSBcbiAgICAgIHJldHVybiBmb250LmNoYXJzW2lkeF0uaGVpZ2h0XG4gIH1cbiAgcmV0dXJuIDBcbn1cblxuZnVuY3Rpb24gZ2V0S2VybmluZyhmb250LCBsZWZ0LCByaWdodCkge1xuICBpZiAoIWZvbnQua2VybmluZ3MgfHwgZm9udC5rZXJuaW5ncy5sZW5ndGggPT09IDApXG4gICAgcmV0dXJuIDBcblxuICB2YXIgdGFibGUgPSBmb250Lmtlcm5pbmdzXG4gIGZvciAodmFyIGk9MDsgaTx0YWJsZS5sZW5ndGg7IGkrKykge1xuICAgIHZhciBrZXJuID0gdGFibGVbaV1cbiAgICBpZiAoa2Vybi5maXJzdCA9PT0gbGVmdCAmJiBrZXJuLnNlY29uZCA9PT0gcmlnaHQpXG4gICAgICByZXR1cm4ga2Vybi5hbW91bnRcbiAgfVxuICByZXR1cm4gMFxufVxuXG5mdW5jdGlvbiBnZXRBbGlnblR5cGUoYWxpZ24pIHtcbiAgaWYgKGFsaWduID09PSAnY2VudGVyJylcbiAgICByZXR1cm4gQUxJR05fQ0VOVEVSXG4gIGVsc2UgaWYgKGFsaWduID09PSAncmlnaHQnKVxuICAgIHJldHVybiBBTElHTl9SSUdIVFxuICByZXR1cm4gQUxJR05fTEVGVFxufSIsIi8qXG5vYmplY3QtYXNzaWduXG4oYykgU2luZHJlIFNvcmh1c1xuQGxpY2Vuc2UgTUlUXG4qL1xuXG4ndXNlIHN0cmljdCc7XG4vKiBlc2xpbnQtZGlzYWJsZSBuby11bnVzZWQtdmFycyAqL1xudmFyIGdldE93blByb3BlcnR5U3ltYm9scyA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eVN5bWJvbHM7XG52YXIgaGFzT3duUHJvcGVydHkgPSBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5O1xudmFyIHByb3BJc0VudW1lcmFibGUgPSBPYmplY3QucHJvdG90eXBlLnByb3BlcnR5SXNFbnVtZXJhYmxlO1xuXG5mdW5jdGlvbiB0b09iamVjdCh2YWwpIHtcblx0aWYgKHZhbCA9PT0gbnVsbCB8fCB2YWwgPT09IHVuZGVmaW5lZCkge1xuXHRcdHRocm93IG5ldyBUeXBlRXJyb3IoJ09iamVjdC5hc3NpZ24gY2Fubm90IGJlIGNhbGxlZCB3aXRoIG51bGwgb3IgdW5kZWZpbmVkJyk7XG5cdH1cblxuXHRyZXR1cm4gT2JqZWN0KHZhbCk7XG59XG5cbmZ1bmN0aW9uIHNob3VsZFVzZU5hdGl2ZSgpIHtcblx0dHJ5IHtcblx0XHRpZiAoIU9iamVjdC5hc3NpZ24pIHtcblx0XHRcdHJldHVybiBmYWxzZTtcblx0XHR9XG5cblx0XHQvLyBEZXRlY3QgYnVnZ3kgcHJvcGVydHkgZW51bWVyYXRpb24gb3JkZXIgaW4gb2xkZXIgVjggdmVyc2lvbnMuXG5cblx0XHQvLyBodHRwczovL2J1Z3MuY2hyb21pdW0ub3JnL3AvdjgvaXNzdWVzL2RldGFpbD9pZD00MTE4XG5cdFx0dmFyIHRlc3QxID0gbmV3IFN0cmluZygnYWJjJyk7ICAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLW5ldy13cmFwcGVyc1xuXHRcdHRlc3QxWzVdID0gJ2RlJztcblx0XHRpZiAoT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXModGVzdDEpWzBdID09PSAnNScpIHtcblx0XHRcdHJldHVybiBmYWxzZTtcblx0XHR9XG5cblx0XHQvLyBodHRwczovL2J1Z3MuY2hyb21pdW0ub3JnL3AvdjgvaXNzdWVzL2RldGFpbD9pZD0zMDU2XG5cdFx0dmFyIHRlc3QyID0ge307XG5cdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCAxMDsgaSsrKSB7XG5cdFx0XHR0ZXN0MlsnXycgKyBTdHJpbmcuZnJvbUNoYXJDb2RlKGkpXSA9IGk7XG5cdFx0fVxuXHRcdHZhciBvcmRlcjIgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyh0ZXN0MikubWFwKGZ1bmN0aW9uIChuKSB7XG5cdFx0XHRyZXR1cm4gdGVzdDJbbl07XG5cdFx0fSk7XG5cdFx0aWYgKG9yZGVyMi5qb2luKCcnKSAhPT0gJzAxMjM0NTY3ODknKSB7XG5cdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0fVxuXG5cdFx0Ly8gaHR0cHM6Ly9idWdzLmNocm9taXVtLm9yZy9wL3Y4L2lzc3Vlcy9kZXRhaWw/aWQ9MzA1NlxuXHRcdHZhciB0ZXN0MyA9IHt9O1xuXHRcdCdhYmNkZWZnaGlqa2xtbm9wcXJzdCcuc3BsaXQoJycpLmZvckVhY2goZnVuY3Rpb24gKGxldHRlcikge1xuXHRcdFx0dGVzdDNbbGV0dGVyXSA9IGxldHRlcjtcblx0XHR9KTtcblx0XHRpZiAoT2JqZWN0LmtleXMoT2JqZWN0LmFzc2lnbih7fSwgdGVzdDMpKS5qb2luKCcnKSAhPT1cblx0XHRcdFx0J2FiY2RlZmdoaWprbG1ub3BxcnN0Jykge1xuXHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdH1cblxuXHRcdHJldHVybiB0cnVlO1xuXHR9IGNhdGNoIChlcnIpIHtcblx0XHQvLyBXZSBkb24ndCBleHBlY3QgYW55IG9mIHRoZSBhYm92ZSB0byB0aHJvdywgYnV0IGJldHRlciB0byBiZSBzYWZlLlxuXHRcdHJldHVybiBmYWxzZTtcblx0fVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHNob3VsZFVzZU5hdGl2ZSgpID8gT2JqZWN0LmFzc2lnbiA6IGZ1bmN0aW9uICh0YXJnZXQsIHNvdXJjZSkge1xuXHR2YXIgZnJvbTtcblx0dmFyIHRvID0gdG9PYmplY3QodGFyZ2V0KTtcblx0dmFyIHN5bWJvbHM7XG5cblx0Zm9yICh2YXIgcyA9IDE7IHMgPCBhcmd1bWVudHMubGVuZ3RoOyBzKyspIHtcblx0XHRmcm9tID0gT2JqZWN0KGFyZ3VtZW50c1tzXSk7XG5cblx0XHRmb3IgKHZhciBrZXkgaW4gZnJvbSkge1xuXHRcdFx0aWYgKGhhc093blByb3BlcnR5LmNhbGwoZnJvbSwga2V5KSkge1xuXHRcdFx0XHR0b1trZXldID0gZnJvbVtrZXldO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdGlmIChnZXRPd25Qcm9wZXJ0eVN5bWJvbHMpIHtcblx0XHRcdHN5bWJvbHMgPSBnZXRPd25Qcm9wZXJ0eVN5bWJvbHMoZnJvbSk7XG5cdFx0XHRmb3IgKHZhciBpID0gMDsgaSA8IHN5bWJvbHMubGVuZ3RoOyBpKyspIHtcblx0XHRcdFx0aWYgKHByb3BJc0VudW1lcmFibGUuY2FsbChmcm9tLCBzeW1ib2xzW2ldKSkge1xuXHRcdFx0XHRcdHRvW3N5bWJvbHNbaV1dID0gZnJvbVtzeW1ib2xzW2ldXTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblx0fVxuXG5cdHJldHVybiB0bztcbn07XG4iLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIHBhcnNlQk1Gb250QXNjaWkoZGF0YSkge1xuICBpZiAoIWRhdGEpXG4gICAgdGhyb3cgbmV3IEVycm9yKCdubyBkYXRhIHByb3ZpZGVkJylcbiAgZGF0YSA9IGRhdGEudG9TdHJpbmcoKS50cmltKClcblxuICB2YXIgb3V0cHV0ID0ge1xuICAgIHBhZ2VzOiBbXSxcbiAgICBjaGFyczogW10sXG4gICAga2VybmluZ3M6IFtdXG4gIH1cblxuICB2YXIgbGluZXMgPSBkYXRhLnNwbGl0KC9cXHJcXG4/fFxcbi9nKVxuXG4gIGlmIChsaW5lcy5sZW5ndGggPT09IDApXG4gICAgdGhyb3cgbmV3IEVycm9yKCdubyBkYXRhIGluIEJNRm9udCBmaWxlJylcblxuICBmb3IgKHZhciBpID0gMDsgaSA8IGxpbmVzLmxlbmd0aDsgaSsrKSB7XG4gICAgdmFyIGxpbmVEYXRhID0gc3BsaXRMaW5lKGxpbmVzW2ldLCBpKVxuICAgIGlmICghbGluZURhdGEpIC8vc2tpcCBlbXB0eSBsaW5lc1xuICAgICAgY29udGludWVcblxuICAgIGlmIChsaW5lRGF0YS5rZXkgPT09ICdwYWdlJykge1xuICAgICAgaWYgKHR5cGVvZiBsaW5lRGF0YS5kYXRhLmlkICE9PSAnbnVtYmVyJylcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdtYWxmb3JtZWQgZmlsZSBhdCBsaW5lICcgKyBpICsgJyAtLSBuZWVkcyBwYWdlIGlkPU4nKVxuICAgICAgaWYgKHR5cGVvZiBsaW5lRGF0YS5kYXRhLmZpbGUgIT09ICdzdHJpbmcnKVxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ21hbGZvcm1lZCBmaWxlIGF0IGxpbmUgJyArIGkgKyAnIC0tIG5lZWRzIHBhZ2UgZmlsZT1cInBhdGhcIicpXG4gICAgICBvdXRwdXQucGFnZXNbbGluZURhdGEuZGF0YS5pZF0gPSBsaW5lRGF0YS5kYXRhLmZpbGVcbiAgICB9IGVsc2UgaWYgKGxpbmVEYXRhLmtleSA9PT0gJ2NoYXJzJyB8fCBsaW5lRGF0YS5rZXkgPT09ICdrZXJuaW5ncycpIHtcbiAgICAgIC8vLi4uIGRvIG5vdGhpbmcgZm9yIHRoZXNlIHR3byAuLi5cbiAgICB9IGVsc2UgaWYgKGxpbmVEYXRhLmtleSA9PT0gJ2NoYXInKSB7XG4gICAgICBvdXRwdXQuY2hhcnMucHVzaChsaW5lRGF0YS5kYXRhKVxuICAgIH0gZWxzZSBpZiAobGluZURhdGEua2V5ID09PSAna2VybmluZycpIHtcbiAgICAgIG91dHB1dC5rZXJuaW5ncy5wdXNoKGxpbmVEYXRhLmRhdGEpXG4gICAgfSBlbHNlIHtcbiAgICAgIG91dHB1dFtsaW5lRGF0YS5rZXldID0gbGluZURhdGEuZGF0YVxuICAgIH1cbiAgfVxuXG4gIHJldHVybiBvdXRwdXRcbn1cblxuZnVuY3Rpb24gc3BsaXRMaW5lKGxpbmUsIGlkeCkge1xuICBsaW5lID0gbGluZS5yZXBsYWNlKC9cXHQrL2csICcgJykudHJpbSgpXG4gIGlmICghbGluZSlcbiAgICByZXR1cm4gbnVsbFxuXG4gIHZhciBzcGFjZSA9IGxpbmUuaW5kZXhPZignICcpXG4gIGlmIChzcGFjZSA9PT0gLTEpIFxuICAgIHRocm93IG5ldyBFcnJvcihcIm5vIG5hbWVkIHJvdyBhdCBsaW5lIFwiICsgaWR4KVxuXG4gIHZhciBrZXkgPSBsaW5lLnN1YnN0cmluZygwLCBzcGFjZSlcblxuICBsaW5lID0gbGluZS5zdWJzdHJpbmcoc3BhY2UgKyAxKVxuICAvL2NsZWFyIFwibGV0dGVyXCIgZmllbGQgYXMgaXQgaXMgbm9uLXN0YW5kYXJkIGFuZFxuICAvL3JlcXVpcmVzIGFkZGl0aW9uYWwgY29tcGxleGl0eSB0byBwYXJzZSBcIiAvID0gc3ltYm9sc1xuICBsaW5lID0gbGluZS5yZXBsYWNlKC9sZXR0ZXI9W1xcJ1xcXCJdXFxTK1tcXCdcXFwiXS9naSwgJycpICBcbiAgbGluZSA9IGxpbmUuc3BsaXQoXCI9XCIpXG4gIGxpbmUgPSBsaW5lLm1hcChmdW5jdGlvbihzdHIpIHtcbiAgICByZXR1cm4gc3RyLnRyaW0oKS5tYXRjaCgoLyhcIi4qP1wifFteXCJcXHNdKykrKD89XFxzKnxcXHMqJCkvZykpXG4gIH0pXG5cbiAgdmFyIGRhdGEgPSBbXVxuICBmb3IgKHZhciBpID0gMDsgaSA8IGxpbmUubGVuZ3RoOyBpKyspIHtcbiAgICB2YXIgZHQgPSBsaW5lW2ldXG4gICAgaWYgKGkgPT09IDApIHtcbiAgICAgIGRhdGEucHVzaCh7XG4gICAgICAgIGtleTogZHRbMF0sXG4gICAgICAgIGRhdGE6IFwiXCJcbiAgICAgIH0pXG4gICAgfSBlbHNlIGlmIChpID09PSBsaW5lLmxlbmd0aCAtIDEpIHtcbiAgICAgIGRhdGFbZGF0YS5sZW5ndGggLSAxXS5kYXRhID0gcGFyc2VEYXRhKGR0WzBdKVxuICAgIH0gZWxzZSB7XG4gICAgICBkYXRhW2RhdGEubGVuZ3RoIC0gMV0uZGF0YSA9IHBhcnNlRGF0YShkdFswXSlcbiAgICAgIGRhdGEucHVzaCh7XG4gICAgICAgIGtleTogZHRbMV0sXG4gICAgICAgIGRhdGE6IFwiXCJcbiAgICAgIH0pXG4gICAgfVxuICB9XG5cbiAgdmFyIG91dCA9IHtcbiAgICBrZXk6IGtleSxcbiAgICBkYXRhOiB7fVxuICB9XG5cbiAgZGF0YS5mb3JFYWNoKGZ1bmN0aW9uKHYpIHtcbiAgICBvdXQuZGF0YVt2LmtleV0gPSB2LmRhdGE7XG4gIH0pXG5cbiAgcmV0dXJuIG91dFxufVxuXG5mdW5jdGlvbiBwYXJzZURhdGEoZGF0YSkge1xuICBpZiAoIWRhdGEgfHwgZGF0YS5sZW5ndGggPT09IDApXG4gICAgcmV0dXJuIFwiXCJcblxuICBpZiAoZGF0YS5pbmRleE9mKCdcIicpID09PSAwIHx8IGRhdGEuaW5kZXhPZihcIidcIikgPT09IDApXG4gICAgcmV0dXJuIGRhdGEuc3Vic3RyaW5nKDEsIGRhdGEubGVuZ3RoIC0gMSlcbiAgaWYgKGRhdGEuaW5kZXhPZignLCcpICE9PSAtMSlcbiAgICByZXR1cm4gcGFyc2VJbnRMaXN0KGRhdGEpXG4gIHJldHVybiBwYXJzZUludChkYXRhLCAxMClcbn1cblxuZnVuY3Rpb24gcGFyc2VJbnRMaXN0KGRhdGEpIHtcbiAgcmV0dXJuIGRhdGEuc3BsaXQoJywnKS5tYXAoZnVuY3Rpb24odmFsKSB7XG4gICAgcmV0dXJuIHBhcnNlSW50KHZhbCwgMTApXG4gIH0pXG59IiwidmFyIGR0eXBlID0gcmVxdWlyZSgnZHR5cGUnKVxudmFyIGFuQXJyYXkgPSByZXF1aXJlKCdhbi1hcnJheScpXG52YXIgaXNCdWZmZXIgPSByZXF1aXJlKCdpcy1idWZmZXInKVxuXG52YXIgQ1cgPSBbMCwgMiwgM11cbnZhciBDQ1cgPSBbMiwgMSwgM11cblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBjcmVhdGVRdWFkRWxlbWVudHMoYXJyYXksIG9wdCkge1xuICAgIC8vaWYgdXNlciBkaWRuJ3Qgc3BlY2lmeSBhbiBvdXRwdXQgYXJyYXlcbiAgICBpZiAoIWFycmF5IHx8ICEoYW5BcnJheShhcnJheSkgfHwgaXNCdWZmZXIoYXJyYXkpKSkge1xuICAgICAgICBvcHQgPSBhcnJheSB8fCB7fVxuICAgICAgICBhcnJheSA9IG51bGxcbiAgICB9XG5cbiAgICBpZiAodHlwZW9mIG9wdCA9PT0gJ251bWJlcicpIC8vYmFja3dhcmRzLWNvbXBhdGlibGVcbiAgICAgICAgb3B0ID0geyBjb3VudDogb3B0IH1cbiAgICBlbHNlXG4gICAgICAgIG9wdCA9IG9wdCB8fCB7fVxuXG4gICAgdmFyIHR5cGUgPSB0eXBlb2Ygb3B0LnR5cGUgPT09ICdzdHJpbmcnID8gb3B0LnR5cGUgOiAndWludDE2J1xuICAgIHZhciBjb3VudCA9IHR5cGVvZiBvcHQuY291bnQgPT09ICdudW1iZXInID8gb3B0LmNvdW50IDogMVxuICAgIHZhciBzdGFydCA9IChvcHQuc3RhcnQgfHwgMCkgXG5cbiAgICB2YXIgZGlyID0gb3B0LmNsb2Nrd2lzZSAhPT0gZmFsc2UgPyBDVyA6IENDVyxcbiAgICAgICAgYSA9IGRpclswXSwgXG4gICAgICAgIGIgPSBkaXJbMV0sXG4gICAgICAgIGMgPSBkaXJbMl1cblxuICAgIHZhciBudW1JbmRpY2VzID0gY291bnQgKiA2XG5cbiAgICB2YXIgaW5kaWNlcyA9IGFycmF5IHx8IG5ldyAoZHR5cGUodHlwZSkpKG51bUluZGljZXMpXG4gICAgZm9yICh2YXIgaSA9IDAsIGogPSAwOyBpIDwgbnVtSW5kaWNlczsgaSArPSA2LCBqICs9IDQpIHtcbiAgICAgICAgdmFyIHggPSBpICsgc3RhcnRcbiAgICAgICAgaW5kaWNlc1t4ICsgMF0gPSBqICsgMFxuICAgICAgICBpbmRpY2VzW3ggKyAxXSA9IGogKyAxXG4gICAgICAgIGluZGljZXNbeCArIDJdID0gaiArIDJcbiAgICAgICAgaW5kaWNlc1t4ICsgM10gPSBqICsgYVxuICAgICAgICBpbmRpY2VzW3ggKyA0XSA9IGogKyBiXG4gICAgICAgIGluZGljZXNbeCArIDVdID0gaiArIGNcbiAgICB9XG4gICAgcmV0dXJuIGluZGljZXNcbn0iLCJ2YXIgY3JlYXRlTGF5b3V0ID0gcmVxdWlyZSgnbGF5b3V0LWJtZm9udC10ZXh0JylcbnZhciBpbmhlcml0cyA9IHJlcXVpcmUoJ2luaGVyaXRzJylcbnZhciBjcmVhdGVJbmRpY2VzID0gcmVxdWlyZSgncXVhZC1pbmRpY2VzJylcbnZhciBidWZmZXIgPSByZXF1aXJlKCd0aHJlZS1idWZmZXItdmVydGV4LWRhdGEnKVxudmFyIGFzc2lnbiA9IHJlcXVpcmUoJ29iamVjdC1hc3NpZ24nKVxuXG52YXIgdmVydGljZXMgPSByZXF1aXJlKCcuL2xpYi92ZXJ0aWNlcycpXG52YXIgdXRpbHMgPSByZXF1aXJlKCcuL2xpYi91dGlscycpXG5cbnZhciBCYXNlID0gVEhSRUUuQnVmZmVyR2VvbWV0cnlcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBjcmVhdGVUZXh0R2VvbWV0cnkgKG9wdCkge1xuICByZXR1cm4gbmV3IFRleHRHZW9tZXRyeShvcHQpXG59XG5cbmZ1bmN0aW9uIFRleHRHZW9tZXRyeSAob3B0KSB7XG4gIEJhc2UuY2FsbCh0aGlzKVxuXG4gIGlmICh0eXBlb2Ygb3B0ID09PSAnc3RyaW5nJykge1xuICAgIG9wdCA9IHsgdGV4dDogb3B0IH1cbiAgfVxuXG4gIC8vIHVzZSB0aGVzZSBhcyBkZWZhdWx0IHZhbHVlcyBmb3IgYW55IHN1YnNlcXVlbnRcbiAgLy8gY2FsbHMgdG8gdXBkYXRlKClcbiAgdGhpcy5fb3B0ID0gYXNzaWduKHt9LCBvcHQpXG5cbiAgLy8gYWxzbyBkbyBhbiBpbml0aWFsIHNldHVwLi4uXG4gIGlmIChvcHQpIHRoaXMudXBkYXRlKG9wdClcbn1cblxuaW5oZXJpdHMoVGV4dEdlb21ldHJ5LCBCYXNlKVxuXG5UZXh0R2VvbWV0cnkucHJvdG90eXBlLnVwZGF0ZSA9IGZ1bmN0aW9uIChvcHQpIHtcbiAgaWYgKHR5cGVvZiBvcHQgPT09ICdzdHJpbmcnKSB7XG4gICAgb3B0ID0geyB0ZXh0OiBvcHQgfVxuICB9XG5cbiAgLy8gdXNlIGNvbnN0cnVjdG9yIGRlZmF1bHRzXG4gIG9wdCA9IGFzc2lnbih7fSwgdGhpcy5fb3B0LCBvcHQpXG5cbiAgaWYgKCFvcHQuZm9udCkge1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ211c3Qgc3BlY2lmeSBhIHsgZm9udCB9IGluIG9wdGlvbnMnKVxuICB9XG5cbiAgdGhpcy5sYXlvdXQgPSBjcmVhdGVMYXlvdXQob3B0KVxuXG4gIC8vIGdldCB2ZWMyIHRleGNvb3Jkc1xuICB2YXIgZmxpcFkgPSBvcHQuZmxpcFkgIT09IGZhbHNlXG5cbiAgLy8gdGhlIGRlc2lyZWQgQk1Gb250IGRhdGFcbiAgdmFyIGZvbnQgPSBvcHQuZm9udFxuXG4gIC8vIGRldGVybWluZSB0ZXh0dXJlIHNpemUgZnJvbSBmb250IGZpbGVcbiAgdmFyIHRleFdpZHRoID0gZm9udC5jb21tb24uc2NhbGVXXG4gIHZhciB0ZXhIZWlnaHQgPSBmb250LmNvbW1vbi5zY2FsZUhcblxuICAvLyBnZXQgdmlzaWJsZSBnbHlwaHNcbiAgdmFyIGdseXBocyA9IHRoaXMubGF5b3V0LmdseXBocy5maWx0ZXIoZnVuY3Rpb24gKGdseXBoKSB7XG4gICAgdmFyIGJpdG1hcCA9IGdseXBoLmRhdGFcbiAgICByZXR1cm4gYml0bWFwLndpZHRoICogYml0bWFwLmhlaWdodCA+IDBcbiAgfSlcblxuICAvLyBwcm92aWRlIHZpc2libGUgZ2x5cGhzIGZvciBjb252ZW5pZW5jZVxuICB0aGlzLnZpc2libGVHbHlwaHMgPSBnbHlwaHNcblxuICAvLyBnZXQgY29tbW9uIHZlcnRleCBkYXRhXG4gIHZhciBwb3NpdGlvbnMgPSB2ZXJ0aWNlcy5wb3NpdGlvbnMoZ2x5cGhzKVxuICB2YXIgdXZzID0gdmVydGljZXMudXZzKGdseXBocywgdGV4V2lkdGgsIHRleEhlaWdodCwgZmxpcFkpXG4gIHZhciBpbmRpY2VzID0gY3JlYXRlSW5kaWNlcyh7XG4gICAgY2xvY2t3aXNlOiB0cnVlLFxuICAgIHR5cGU6ICd1aW50MTYnLFxuICAgIGNvdW50OiBnbHlwaHMubGVuZ3RoXG4gIH0pXG5cbiAgLy8gdXBkYXRlIHZlcnRleCBkYXRhXG4gIGJ1ZmZlci5pbmRleCh0aGlzLCBpbmRpY2VzLCAxLCAndWludDE2JylcbiAgYnVmZmVyLmF0dHIodGhpcywgJ3Bvc2l0aW9uJywgcG9zaXRpb25zLCAyKVxuICBidWZmZXIuYXR0cih0aGlzLCAndXYnLCB1dnMsIDIpXG5cbiAgLy8gdXBkYXRlIG11bHRpcGFnZSBkYXRhXG4gIGlmICghb3B0Lm11bHRpcGFnZSAmJiAncGFnZScgaW4gdGhpcy5hdHRyaWJ1dGVzKSB7XG4gICAgLy8gZGlzYWJsZSBtdWx0aXBhZ2UgcmVuZGVyaW5nXG4gICAgdGhpcy5yZW1vdmVBdHRyaWJ1dGUoJ3BhZ2UnKVxuICB9IGVsc2UgaWYgKG9wdC5tdWx0aXBhZ2UpIHtcbiAgICB2YXIgcGFnZXMgPSB2ZXJ0aWNlcy5wYWdlcyhnbHlwaHMpXG4gICAgLy8gZW5hYmxlIG11bHRpcGFnZSByZW5kZXJpbmdcbiAgICBidWZmZXIuYXR0cih0aGlzLCAncGFnZScsIHBhZ2VzLCAxKVxuICB9XG59XG5cblRleHRHZW9tZXRyeS5wcm90b3R5cGUuY29tcHV0ZUJvdW5kaW5nU3BoZXJlID0gZnVuY3Rpb24gKCkge1xuICBpZiAodGhpcy5ib3VuZGluZ1NwaGVyZSA9PT0gbnVsbCkge1xuICAgIHRoaXMuYm91bmRpbmdTcGhlcmUgPSBuZXcgVEhSRUUuU3BoZXJlKClcbiAgfVxuXG4gIHZhciBwb3NpdGlvbnMgPSB0aGlzLmF0dHJpYnV0ZXMucG9zaXRpb24uYXJyYXlcbiAgdmFyIGl0ZW1TaXplID0gdGhpcy5hdHRyaWJ1dGVzLnBvc2l0aW9uLml0ZW1TaXplXG4gIGlmICghcG9zaXRpb25zIHx8ICFpdGVtU2l6ZSB8fCBwb3NpdGlvbnMubGVuZ3RoIDwgMikge1xuICAgIHRoaXMuYm91bmRpbmdTcGhlcmUucmFkaXVzID0gMFxuICAgIHRoaXMuYm91bmRpbmdTcGhlcmUuY2VudGVyLnNldCgwLCAwLCAwKVxuICAgIHJldHVyblxuICB9XG4gIHV0aWxzLmNvbXB1dGVTcGhlcmUocG9zaXRpb25zLCB0aGlzLmJvdW5kaW5nU3BoZXJlKVxuICBpZiAoaXNOYU4odGhpcy5ib3VuZGluZ1NwaGVyZS5yYWRpdXMpKSB7XG4gICAgY29uc29sZS5lcnJvcignVEhSRUUuQnVmZmVyR2VvbWV0cnkuY29tcHV0ZUJvdW5kaW5nU3BoZXJlKCk6ICcgK1xuICAgICAgJ0NvbXB1dGVkIHJhZGl1cyBpcyBOYU4uIFRoZSAnICtcbiAgICAgICdcInBvc2l0aW9uXCIgYXR0cmlidXRlIGlzIGxpa2VseSB0byBoYXZlIE5hTiB2YWx1ZXMuJylcbiAgfVxufVxuXG5UZXh0R2VvbWV0cnkucHJvdG90eXBlLmNvbXB1dGVCb3VuZGluZ0JveCA9IGZ1bmN0aW9uICgpIHtcbiAgaWYgKHRoaXMuYm91bmRpbmdCb3ggPT09IG51bGwpIHtcbiAgICB0aGlzLmJvdW5kaW5nQm94ID0gbmV3IFRIUkVFLkJveDMoKVxuICB9XG5cbiAgdmFyIGJib3ggPSB0aGlzLmJvdW5kaW5nQm94XG4gIHZhciBwb3NpdGlvbnMgPSB0aGlzLmF0dHJpYnV0ZXMucG9zaXRpb24uYXJyYXlcbiAgdmFyIGl0ZW1TaXplID0gdGhpcy5hdHRyaWJ1dGVzLnBvc2l0aW9uLml0ZW1TaXplXG4gIGlmICghcG9zaXRpb25zIHx8ICFpdGVtU2l6ZSB8fCBwb3NpdGlvbnMubGVuZ3RoIDwgMikge1xuICAgIGJib3gubWFrZUVtcHR5KClcbiAgICByZXR1cm5cbiAgfVxuICB1dGlscy5jb21wdXRlQm94KHBvc2l0aW9ucywgYmJveClcbn1cbiIsInZhciBpdGVtU2l6ZSA9IDJcbnZhciBib3ggPSB7IG1pbjogWzAsIDBdLCBtYXg6IFswLCAwXSB9XG5cbmZ1bmN0aW9uIGJvdW5kcyAocG9zaXRpb25zKSB7XG4gIHZhciBjb3VudCA9IHBvc2l0aW9ucy5sZW5ndGggLyBpdGVtU2l6ZVxuICBib3gubWluWzBdID0gcG9zaXRpb25zWzBdXG4gIGJveC5taW5bMV0gPSBwb3NpdGlvbnNbMV1cbiAgYm94Lm1heFswXSA9IHBvc2l0aW9uc1swXVxuICBib3gubWF4WzFdID0gcG9zaXRpb25zWzFdXG5cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBjb3VudDsgaSsrKSB7XG4gICAgdmFyIHggPSBwb3NpdGlvbnNbaSAqIGl0ZW1TaXplICsgMF1cbiAgICB2YXIgeSA9IHBvc2l0aW9uc1tpICogaXRlbVNpemUgKyAxXVxuICAgIGJveC5taW5bMF0gPSBNYXRoLm1pbih4LCBib3gubWluWzBdKVxuICAgIGJveC5taW5bMV0gPSBNYXRoLm1pbih5LCBib3gubWluWzFdKVxuICAgIGJveC5tYXhbMF0gPSBNYXRoLm1heCh4LCBib3gubWF4WzBdKVxuICAgIGJveC5tYXhbMV0gPSBNYXRoLm1heCh5LCBib3gubWF4WzFdKVxuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzLmNvbXB1dGVCb3ggPSBmdW5jdGlvbiAocG9zaXRpb25zLCBvdXRwdXQpIHtcbiAgYm91bmRzKHBvc2l0aW9ucylcbiAgb3V0cHV0Lm1pbi5zZXQoYm94Lm1pblswXSwgYm94Lm1pblsxXSwgMClcbiAgb3V0cHV0Lm1heC5zZXQoYm94Lm1heFswXSwgYm94Lm1heFsxXSwgMClcbn1cblxubW9kdWxlLmV4cG9ydHMuY29tcHV0ZVNwaGVyZSA9IGZ1bmN0aW9uIChwb3NpdGlvbnMsIG91dHB1dCkge1xuICBib3VuZHMocG9zaXRpb25zKVxuICB2YXIgbWluWCA9IGJveC5taW5bMF1cbiAgdmFyIG1pblkgPSBib3gubWluWzFdXG4gIHZhciBtYXhYID0gYm94Lm1heFswXVxuICB2YXIgbWF4WSA9IGJveC5tYXhbMV1cbiAgdmFyIHdpZHRoID0gbWF4WCAtIG1pblhcbiAgdmFyIGhlaWdodCA9IG1heFkgLSBtaW5ZXG4gIHZhciBsZW5ndGggPSBNYXRoLnNxcnQod2lkdGggKiB3aWR0aCArIGhlaWdodCAqIGhlaWdodClcbiAgb3V0cHV0LmNlbnRlci5zZXQobWluWCArIHdpZHRoIC8gMiwgbWluWSArIGhlaWdodCAvIDIsIDApXG4gIG91dHB1dC5yYWRpdXMgPSBsZW5ndGggLyAyXG59XG4iLCJtb2R1bGUuZXhwb3J0cy5wYWdlcyA9IGZ1bmN0aW9uIHBhZ2VzIChnbHlwaHMpIHtcbiAgdmFyIHBhZ2VzID0gbmV3IEZsb2F0MzJBcnJheShnbHlwaHMubGVuZ3RoICogNCAqIDEpXG4gIHZhciBpID0gMFxuICBnbHlwaHMuZm9yRWFjaChmdW5jdGlvbiAoZ2x5cGgpIHtcbiAgICB2YXIgaWQgPSBnbHlwaC5kYXRhLnBhZ2UgfHwgMFxuICAgIHBhZ2VzW2krK10gPSBpZFxuICAgIHBhZ2VzW2krK10gPSBpZFxuICAgIHBhZ2VzW2krK10gPSBpZFxuICAgIHBhZ2VzW2krK10gPSBpZFxuICB9KVxuICByZXR1cm4gcGFnZXNcbn1cblxubW9kdWxlLmV4cG9ydHMudXZzID0gZnVuY3Rpb24gdXZzIChnbHlwaHMsIHRleFdpZHRoLCB0ZXhIZWlnaHQsIGZsaXBZKSB7XG4gIHZhciB1dnMgPSBuZXcgRmxvYXQzMkFycmF5KGdseXBocy5sZW5ndGggKiA0ICogMilcbiAgdmFyIGkgPSAwXG4gIGdseXBocy5mb3JFYWNoKGZ1bmN0aW9uIChnbHlwaCkge1xuICAgIHZhciBiaXRtYXAgPSBnbHlwaC5kYXRhXG4gICAgdmFyIGJ3ID0gKGJpdG1hcC54ICsgYml0bWFwLndpZHRoKVxuICAgIHZhciBiaCA9IChiaXRtYXAueSArIGJpdG1hcC5oZWlnaHQpXG5cbiAgICAvLyB0b3AgbGVmdCBwb3NpdGlvblxuICAgIHZhciB1MCA9IGJpdG1hcC54IC8gdGV4V2lkdGhcbiAgICB2YXIgdjEgPSBiaXRtYXAueSAvIHRleEhlaWdodFxuICAgIHZhciB1MSA9IGJ3IC8gdGV4V2lkdGhcbiAgICB2YXIgdjAgPSBiaCAvIHRleEhlaWdodFxuXG4gICAgaWYgKGZsaXBZKSB7XG4gICAgICB2MSA9ICh0ZXhIZWlnaHQgLSBiaXRtYXAueSkgLyB0ZXhIZWlnaHRcbiAgICAgIHYwID0gKHRleEhlaWdodCAtIGJoKSAvIHRleEhlaWdodFxuICAgIH1cblxuICAgIC8vIEJMXG4gICAgdXZzW2krK10gPSB1MFxuICAgIHV2c1tpKytdID0gdjFcbiAgICAvLyBUTFxuICAgIHV2c1tpKytdID0gdTBcbiAgICB1dnNbaSsrXSA9IHYwXG4gICAgLy8gVFJcbiAgICB1dnNbaSsrXSA9IHUxXG4gICAgdXZzW2krK10gPSB2MFxuICAgIC8vIEJSXG4gICAgdXZzW2krK10gPSB1MVxuICAgIHV2c1tpKytdID0gdjFcbiAgfSlcbiAgcmV0dXJuIHV2c1xufVxuXG5tb2R1bGUuZXhwb3J0cy5wb3NpdGlvbnMgPSBmdW5jdGlvbiBwb3NpdGlvbnMgKGdseXBocykge1xuICB2YXIgcG9zaXRpb25zID0gbmV3IEZsb2F0MzJBcnJheShnbHlwaHMubGVuZ3RoICogNCAqIDIpXG4gIHZhciBpID0gMFxuICBnbHlwaHMuZm9yRWFjaChmdW5jdGlvbiAoZ2x5cGgpIHtcbiAgICB2YXIgYml0bWFwID0gZ2x5cGguZGF0YVxuXG4gICAgLy8gYm90dG9tIGxlZnQgcG9zaXRpb25cbiAgICB2YXIgeCA9IGdseXBoLnBvc2l0aW9uWzBdICsgYml0bWFwLnhvZmZzZXRcbiAgICB2YXIgeSA9IGdseXBoLnBvc2l0aW9uWzFdICsgYml0bWFwLnlvZmZzZXRcblxuICAgIC8vIHF1YWQgc2l6ZVxuICAgIHZhciB3ID0gYml0bWFwLndpZHRoXG4gICAgdmFyIGggPSBiaXRtYXAuaGVpZ2h0XG5cbiAgICAvLyBCTFxuICAgIHBvc2l0aW9uc1tpKytdID0geFxuICAgIHBvc2l0aW9uc1tpKytdID0geVxuICAgIC8vIFRMXG4gICAgcG9zaXRpb25zW2krK10gPSB4XG4gICAgcG9zaXRpb25zW2krK10gPSB5ICsgaFxuICAgIC8vIFRSXG4gICAgcG9zaXRpb25zW2krK10gPSB4ICsgd1xuICAgIHBvc2l0aW9uc1tpKytdID0geSArIGhcbiAgICAvLyBCUlxuICAgIHBvc2l0aW9uc1tpKytdID0geCArIHdcbiAgICBwb3NpdGlvbnNbaSsrXSA9IHlcbiAgfSlcbiAgcmV0dXJuIHBvc2l0aW9uc1xufVxuIiwidmFyIGFzc2lnbiA9IHJlcXVpcmUoJ29iamVjdC1hc3NpZ24nKVxuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGNyZWF0ZVNERlNoYWRlciAob3B0KSB7XG4gIG9wdCA9IG9wdCB8fCB7fVxuICB2YXIgb3BhY2l0eSA9IHR5cGVvZiBvcHQub3BhY2l0eSA9PT0gJ251bWJlcicgPyBvcHQub3BhY2l0eSA6IDFcbiAgdmFyIGFscGhhVGVzdCA9IHR5cGVvZiBvcHQuYWxwaGFUZXN0ID09PSAnbnVtYmVyJyA/IG9wdC5hbHBoYVRlc3QgOiAwLjAwMDFcbiAgdmFyIHByZWNpc2lvbiA9IG9wdC5wcmVjaXNpb24gfHwgJ2hpZ2hwJ1xuICB2YXIgY29sb3IgPSBvcHQuY29sb3JcbiAgdmFyIG1hcCA9IG9wdC5tYXBcblxuICAvLyByZW1vdmUgdG8gc2F0aXNmeSByNzNcbiAgZGVsZXRlIG9wdC5tYXBcbiAgZGVsZXRlIG9wdC5jb2xvclxuICBkZWxldGUgb3B0LnByZWNpc2lvblxuICBkZWxldGUgb3B0Lm9wYWNpdHlcblxuICByZXR1cm4gYXNzaWduKHtcbiAgICB1bmlmb3Jtczoge1xuICAgICAgb3BhY2l0eTogeyB0eXBlOiAnZicsIHZhbHVlOiBvcGFjaXR5IH0sXG4gICAgICBtYXA6IHsgdHlwZTogJ3QnLCB2YWx1ZTogbWFwIHx8IG5ldyBUSFJFRS5UZXh0dXJlKCkgfSxcbiAgICAgIGNvbG9yOiB7IHR5cGU6ICdjJywgdmFsdWU6IG5ldyBUSFJFRS5Db2xvcihjb2xvcikgfVxuICAgIH0sXG4gICAgdmVydGV4U2hhZGVyOiBbXG4gICAgICAnYXR0cmlidXRlIHZlYzIgdXY7JyxcbiAgICAgICdhdHRyaWJ1dGUgdmVjNCBwb3NpdGlvbjsnLFxuICAgICAgJ3VuaWZvcm0gbWF0NCBwcm9qZWN0aW9uTWF0cml4OycsXG4gICAgICAndW5pZm9ybSBtYXQ0IG1vZGVsVmlld01hdHJpeDsnLFxuICAgICAgJ3ZhcnlpbmcgdmVjMiB2VXY7JyxcbiAgICAgICd2b2lkIG1haW4oKSB7JyxcbiAgICAgICd2VXYgPSB1djsnLFxuICAgICAgJ2dsX1Bvc2l0aW9uID0gcHJvamVjdGlvbk1hdHJpeCAqIG1vZGVsVmlld01hdHJpeCAqIHBvc2l0aW9uOycsXG4gICAgICAnfSdcbiAgICBdLmpvaW4oJ1xcbicpLFxuICAgIGZyYWdtZW50U2hhZGVyOiBbXG4gICAgICAnI2lmZGVmIEdMX09FU19zdGFuZGFyZF9kZXJpdmF0aXZlcycsXG4gICAgICAnI2V4dGVuc2lvbiBHTF9PRVNfc3RhbmRhcmRfZGVyaXZhdGl2ZXMgOiBlbmFibGUnLFxuICAgICAgJyNlbmRpZicsXG4gICAgICAncHJlY2lzaW9uICcgKyBwcmVjaXNpb24gKyAnIGZsb2F0OycsXG4gICAgICAndW5pZm9ybSBmbG9hdCBvcGFjaXR5OycsXG4gICAgICAndW5pZm9ybSB2ZWMzIGNvbG9yOycsXG4gICAgICAndW5pZm9ybSBzYW1wbGVyMkQgbWFwOycsXG4gICAgICAndmFyeWluZyB2ZWMyIHZVdjsnLFxuXG4gICAgICAnZmxvYXQgYWFzdGVwKGZsb2F0IHZhbHVlKSB7JyxcbiAgICAgICcgICNpZmRlZiBHTF9PRVNfc3RhbmRhcmRfZGVyaXZhdGl2ZXMnLFxuICAgICAgJyAgICBmbG9hdCBhZndpZHRoID0gbGVuZ3RoKHZlYzIoZEZkeCh2YWx1ZSksIGRGZHkodmFsdWUpKSkgKiAwLjcwNzEwNjc4MTE4NjU0NzU3OycsXG4gICAgICAnICAjZWxzZScsXG4gICAgICAnICAgIGZsb2F0IGFmd2lkdGggPSAoMS4wIC8gMzIuMCkgKiAoMS40MTQyMTM1NjIzNzMwOTUxIC8gKDIuMCAqIGdsX0ZyYWdDb29yZC53KSk7JyxcbiAgICAgICcgICNlbmRpZicsXG4gICAgICAnICByZXR1cm4gc21vb3Roc3RlcCgwLjUgLSBhZndpZHRoLCAwLjUgKyBhZndpZHRoLCB2YWx1ZSk7JyxcbiAgICAgICd9JyxcblxuICAgICAgJ3ZvaWQgbWFpbigpIHsnLFxuICAgICAgJyAgdmVjNCB0ZXhDb2xvciA9IHRleHR1cmUyRChtYXAsIHZVdik7JyxcbiAgICAgICcgIGZsb2F0IGFscGhhID0gYWFzdGVwKHRleENvbG9yLmEpOycsXG4gICAgICAnICBnbF9GcmFnQ29sb3IgPSB2ZWM0KGNvbG9yLCBvcGFjaXR5ICogYWxwaGEpOycsXG4gICAgICBhbHBoYVRlc3QgPT09IDBcbiAgICAgICAgPyAnJ1xuICAgICAgICA6ICcgIGlmIChnbF9GcmFnQ29sb3IuYSA8ICcgKyBhbHBoYVRlc3QgKyAnKSBkaXNjYXJkOycsXG4gICAgICAnfSdcbiAgICBdLmpvaW4oJ1xcbicpXG4gIH0sIG9wdClcbn1cbiIsInZhciBmbGF0dGVuID0gcmVxdWlyZSgnZmxhdHRlbi12ZXJ0ZXgtZGF0YScpXG52YXIgd2FybmVkID0gZmFsc2U7XG5cbm1vZHVsZS5leHBvcnRzLmF0dHIgPSBzZXRBdHRyaWJ1dGVcbm1vZHVsZS5leHBvcnRzLmluZGV4ID0gc2V0SW5kZXhcblxuZnVuY3Rpb24gc2V0SW5kZXggKGdlb21ldHJ5LCBkYXRhLCBpdGVtU2l6ZSwgZHR5cGUpIHtcbiAgaWYgKHR5cGVvZiBpdGVtU2l6ZSAhPT0gJ251bWJlcicpIGl0ZW1TaXplID0gMVxuICBpZiAodHlwZW9mIGR0eXBlICE9PSAnc3RyaW5nJykgZHR5cGUgPSAndWludDE2J1xuXG4gIHZhciBpc1I2OSA9ICFnZW9tZXRyeS5pbmRleCAmJiB0eXBlb2YgZ2VvbWV0cnkuc2V0SW5kZXggIT09ICdmdW5jdGlvbidcbiAgdmFyIGF0dHJpYiA9IGlzUjY5ID8gZ2VvbWV0cnkuZ2V0QXR0cmlidXRlKCdpbmRleCcpIDogZ2VvbWV0cnkuaW5kZXhcbiAgdmFyIG5ld0F0dHJpYiA9IHVwZGF0ZUF0dHJpYnV0ZShhdHRyaWIsIGRhdGEsIGl0ZW1TaXplLCBkdHlwZSlcbiAgaWYgKG5ld0F0dHJpYikge1xuICAgIGlmIChpc1I2OSkgZ2VvbWV0cnkuYWRkQXR0cmlidXRlKCdpbmRleCcsIG5ld0F0dHJpYilcbiAgICBlbHNlIGdlb21ldHJ5LmluZGV4ID0gbmV3QXR0cmliXG4gIH1cbn1cblxuZnVuY3Rpb24gc2V0QXR0cmlidXRlIChnZW9tZXRyeSwga2V5LCBkYXRhLCBpdGVtU2l6ZSwgZHR5cGUpIHtcbiAgaWYgKHR5cGVvZiBpdGVtU2l6ZSAhPT0gJ251bWJlcicpIGl0ZW1TaXplID0gM1xuICBpZiAodHlwZW9mIGR0eXBlICE9PSAnc3RyaW5nJykgZHR5cGUgPSAnZmxvYXQzMidcbiAgaWYgKEFycmF5LmlzQXJyYXkoZGF0YSkgJiZcbiAgICBBcnJheS5pc0FycmF5KGRhdGFbMF0pICYmXG4gICAgZGF0YVswXS5sZW5ndGggIT09IGl0ZW1TaXplKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdOZXN0ZWQgdmVydGV4IGFycmF5IGhhcyB1bmV4cGVjdGVkIHNpemU7IGV4cGVjdGVkICcgK1xuICAgICAgaXRlbVNpemUgKyAnIGJ1dCBmb3VuZCAnICsgZGF0YVswXS5sZW5ndGgpXG4gIH1cblxuICB2YXIgYXR0cmliID0gZ2VvbWV0cnkuZ2V0QXR0cmlidXRlKGtleSlcbiAgdmFyIG5ld0F0dHJpYiA9IHVwZGF0ZUF0dHJpYnV0ZShhdHRyaWIsIGRhdGEsIGl0ZW1TaXplLCBkdHlwZSlcbiAgaWYgKG5ld0F0dHJpYikge1xuICAgIGdlb21ldHJ5LmFkZEF0dHJpYnV0ZShrZXksIG5ld0F0dHJpYilcbiAgfVxufVxuXG5mdW5jdGlvbiB1cGRhdGVBdHRyaWJ1dGUgKGF0dHJpYiwgZGF0YSwgaXRlbVNpemUsIGR0eXBlKSB7XG4gIGRhdGEgPSBkYXRhIHx8IFtdXG4gIGlmICghYXR0cmliIHx8IHJlYnVpbGRBdHRyaWJ1dGUoYXR0cmliLCBkYXRhLCBpdGVtU2l6ZSkpIHtcbiAgICAvLyBjcmVhdGUgYSBuZXcgYXJyYXkgd2l0aCBkZXNpcmVkIHR5cGVcbiAgICBkYXRhID0gZmxhdHRlbihkYXRhLCBkdHlwZSlcblxuICAgIHZhciBuZWVkc05ld0J1ZmZlciA9IGF0dHJpYiAmJiB0eXBlb2YgYXR0cmliLnNldEFycmF5ICE9PSAnZnVuY3Rpb24nXG4gICAgaWYgKCFhdHRyaWIgfHwgbmVlZHNOZXdCdWZmZXIpIHtcbiAgICAgIC8vIFdlIGFyZSBvbiBhbiBvbGQgdmVyc2lvbiBvZiBUaHJlZUpTIHdoaWNoIGNhbid0XG4gICAgICAvLyBzdXBwb3J0IGdyb3dpbmcgLyBzaHJpbmtpbmcgYnVmZmVycywgc28gd2UgbmVlZFxuICAgICAgLy8gdG8gYnVpbGQgYSBuZXcgYnVmZmVyXG4gICAgICBpZiAobmVlZHNOZXdCdWZmZXIgJiYgIXdhcm5lZCkge1xuICAgICAgICB3YXJuZWQgPSB0cnVlXG4gICAgICAgIGNvbnNvbGUud2FybihbXG4gICAgICAgICAgJ0EgV2ViR0wgYnVmZmVyIGlzIGJlaW5nIHVwZGF0ZWQgd2l0aCBhIG5ldyBzaXplIG9yIGl0ZW1TaXplLCAnLFxuICAgICAgICAgICdob3dldmVyIHRoaXMgdmVyc2lvbiBvZiBUaHJlZUpTIG9ubHkgc3VwcG9ydHMgZml4ZWQtc2l6ZSBidWZmZXJzLicsXG4gICAgICAgICAgJ1xcblRoZSBvbGQgYnVmZmVyIG1heSBzdGlsbCBiZSBrZXB0IGluIG1lbW9yeS5cXG4nLFxuICAgICAgICAgICdUbyBhdm9pZCBtZW1vcnkgbGVha3MsIGl0IGlzIHJlY29tbWVuZGVkIHRoYXQgeW91IGRpc3Bvc2UgJyxcbiAgICAgICAgICAneW91ciBnZW9tZXRyaWVzIGFuZCBjcmVhdGUgbmV3IG9uZXMsIG9yIHVwZGF0ZSB0byBUaHJlZUpTIHI4MiBvciBuZXdlci5cXG4nLFxuICAgICAgICAgICdTZWUgaGVyZSBmb3IgZGlzY3Vzc2lvbjpcXG4nLFxuICAgICAgICAgICdodHRwczovL2dpdGh1Yi5jb20vbXJkb29iL3RocmVlLmpzL3B1bGwvOTYzMSdcbiAgICAgICAgXS5qb2luKCcnKSlcbiAgICAgIH1cblxuICAgICAgLy8gQnVpbGQgYSBuZXcgYXR0cmlidXRlXG4gICAgICBhdHRyaWIgPSBuZXcgVEhSRUUuQnVmZmVyQXR0cmlidXRlKGRhdGEsIGl0ZW1TaXplKTtcbiAgICB9XG5cbiAgICBhdHRyaWIuaXRlbVNpemUgPSBpdGVtU2l6ZVxuICAgIGF0dHJpYi5uZWVkc1VwZGF0ZSA9IHRydWVcblxuICAgIC8vIE5ldyB2ZXJzaW9ucyBvZiBUaHJlZUpTIHN1Z2dlc3QgdXNpbmcgc2V0QXJyYXlcbiAgICAvLyB0byBjaGFuZ2UgdGhlIGRhdGEuIEl0IHdpbGwgdXNlIGJ1ZmZlckRhdGEgaW50ZXJuYWxseSxcbiAgICAvLyBzbyB5b3UgY2FuIGNoYW5nZSB0aGUgYXJyYXkgc2l6ZSB3aXRob3V0IGFueSBpc3N1ZXNcbiAgICBpZiAodHlwZW9mIGF0dHJpYi5zZXRBcnJheSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgYXR0cmliLnNldEFycmF5KGRhdGEpXG4gICAgfVxuXG4gICAgcmV0dXJuIGF0dHJpYlxuICB9IGVsc2Uge1xuICAgIC8vIGNvcHkgZGF0YSBpbnRvIHRoZSBleGlzdGluZyBhcnJheVxuICAgIGZsYXR0ZW4oZGF0YSwgYXR0cmliLmFycmF5KVxuICAgIGF0dHJpYi5uZWVkc1VwZGF0ZSA9IHRydWVcbiAgICByZXR1cm4gbnVsbFxuICB9XG59XG5cbi8vIFRlc3Qgd2hldGhlciB0aGUgYXR0cmlidXRlIG5lZWRzIHRvIGJlIHJlLWNyZWF0ZWQsXG4vLyByZXR1cm5zIGZhbHNlIGlmIHdlIGNhbiByZS11c2UgaXQgYXMtaXMuXG5mdW5jdGlvbiByZWJ1aWxkQXR0cmlidXRlIChhdHRyaWIsIGRhdGEsIGl0ZW1TaXplKSB7XG4gIGlmIChhdHRyaWIuaXRlbVNpemUgIT09IGl0ZW1TaXplKSByZXR1cm4gdHJ1ZVxuICBpZiAoIWF0dHJpYi5hcnJheSkgcmV0dXJuIHRydWVcbiAgdmFyIGF0dHJpYkxlbmd0aCA9IGF0dHJpYi5hcnJheS5sZW5ndGhcbiAgaWYgKEFycmF5LmlzQXJyYXkoZGF0YSkgJiYgQXJyYXkuaXNBcnJheShkYXRhWzBdKSkge1xuICAgIC8vIFsgWyB4LCB5LCB6IF0gXVxuICAgIHJldHVybiBhdHRyaWJMZW5ndGggIT09IGRhdGEubGVuZ3RoICogaXRlbVNpemVcbiAgfSBlbHNlIHtcbiAgICAvLyBbIHgsIHksIHogXVxuICAgIHJldHVybiBhdHRyaWJMZW5ndGggIT09IGRhdGEubGVuZ3RoXG4gIH1cbiAgcmV0dXJuIGZhbHNlXG59XG4iLCJ2YXIgbmV3bGluZSA9IC9cXG4vXG52YXIgbmV3bGluZUNoYXIgPSAnXFxuJ1xudmFyIHdoaXRlc3BhY2UgPSAvXFxzL1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKHRleHQsIG9wdCkge1xuICAgIHZhciBsaW5lcyA9IG1vZHVsZS5leHBvcnRzLmxpbmVzKHRleHQsIG9wdClcbiAgICByZXR1cm4gbGluZXMubWFwKGZ1bmN0aW9uKGxpbmUpIHtcbiAgICAgICAgcmV0dXJuIHRleHQuc3Vic3RyaW5nKGxpbmUuc3RhcnQsIGxpbmUuZW5kKVxuICAgIH0pLmpvaW4oJ1xcbicpXG59XG5cbm1vZHVsZS5leHBvcnRzLmxpbmVzID0gZnVuY3Rpb24gd29yZHdyYXAodGV4dCwgb3B0KSB7XG4gICAgb3B0ID0gb3B0fHx7fVxuXG4gICAgLy96ZXJvIHdpZHRoIHJlc3VsdHMgaW4gbm90aGluZyB2aXNpYmxlXG4gICAgaWYgKG9wdC53aWR0aCA9PT0gMCAmJiBvcHQubW9kZSAhPT0gJ25vd3JhcCcpIFxuICAgICAgICByZXR1cm4gW11cblxuICAgIHRleHQgPSB0ZXh0fHwnJ1xuICAgIHZhciB3aWR0aCA9IHR5cGVvZiBvcHQud2lkdGggPT09ICdudW1iZXInID8gb3B0LndpZHRoIDogTnVtYmVyLk1BWF9WQUxVRVxuICAgIHZhciBzdGFydCA9IE1hdGgubWF4KDAsIG9wdC5zdGFydHx8MClcbiAgICB2YXIgZW5kID0gdHlwZW9mIG9wdC5lbmQgPT09ICdudW1iZXInID8gb3B0LmVuZCA6IHRleHQubGVuZ3RoXG4gICAgdmFyIG1vZGUgPSBvcHQubW9kZVxuXG4gICAgdmFyIG1lYXN1cmUgPSBvcHQubWVhc3VyZSB8fCBtb25vc3BhY2VcbiAgICBpZiAobW9kZSA9PT0gJ3ByZScpXG4gICAgICAgIHJldHVybiBwcmUobWVhc3VyZSwgdGV4dCwgc3RhcnQsIGVuZCwgd2lkdGgpXG4gICAgZWxzZVxuICAgICAgICByZXR1cm4gZ3JlZWR5KG1lYXN1cmUsIHRleHQsIHN0YXJ0LCBlbmQsIHdpZHRoLCBtb2RlKVxufVxuXG5mdW5jdGlvbiBpZHhPZih0ZXh0LCBjaHIsIHN0YXJ0LCBlbmQpIHtcbiAgICB2YXIgaWR4ID0gdGV4dC5pbmRleE9mKGNociwgc3RhcnQpXG4gICAgaWYgKGlkeCA9PT0gLTEgfHwgaWR4ID4gZW5kKVxuICAgICAgICByZXR1cm4gZW5kXG4gICAgcmV0dXJuIGlkeFxufVxuXG5mdW5jdGlvbiBpc1doaXRlc3BhY2UoY2hyKSB7XG4gICAgcmV0dXJuIHdoaXRlc3BhY2UudGVzdChjaHIpXG59XG5cbmZ1bmN0aW9uIHByZShtZWFzdXJlLCB0ZXh0LCBzdGFydCwgZW5kLCB3aWR0aCkge1xuICAgIHZhciBsaW5lcyA9IFtdXG4gICAgdmFyIGxpbmVTdGFydCA9IHN0YXJ0XG4gICAgZm9yICh2YXIgaT1zdGFydDsgaTxlbmQgJiYgaTx0ZXh0Lmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIHZhciBjaHIgPSB0ZXh0LmNoYXJBdChpKVxuICAgICAgICB2YXIgaXNOZXdsaW5lID0gbmV3bGluZS50ZXN0KGNocilcblxuICAgICAgICAvL0lmIHdlJ3ZlIHJlYWNoZWQgYSBuZXdsaW5lLCB0aGVuIHN0ZXAgZG93biBhIGxpbmVcbiAgICAgICAgLy9PciBpZiB3ZSd2ZSByZWFjaGVkIHRoZSBFT0ZcbiAgICAgICAgaWYgKGlzTmV3bGluZSB8fCBpPT09ZW5kLTEpIHtcbiAgICAgICAgICAgIHZhciBsaW5lRW5kID0gaXNOZXdsaW5lID8gaSA6IGkrMVxuICAgICAgICAgICAgdmFyIG1lYXN1cmVkID0gbWVhc3VyZSh0ZXh0LCBsaW5lU3RhcnQsIGxpbmVFbmQsIHdpZHRoKVxuICAgICAgICAgICAgbGluZXMucHVzaChtZWFzdXJlZClcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgbGluZVN0YXJ0ID0gaSsxXG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGxpbmVzXG59XG5cbmZ1bmN0aW9uIGdyZWVkeShtZWFzdXJlLCB0ZXh0LCBzdGFydCwgZW5kLCB3aWR0aCwgbW9kZSkge1xuICAgIC8vQSBncmVlZHkgd29yZCB3cmFwcGVyIGJhc2VkIG9uIExpYkdEWCBhbGdvcml0aG1cbiAgICAvL2h0dHBzOi8vZ2l0aHViLmNvbS9saWJnZHgvbGliZ2R4L2Jsb2IvbWFzdGVyL2dkeC9zcmMvY29tL2JhZGxvZ2ljL2dkeC9ncmFwaGljcy9nMmQvQml0bWFwRm9udENhY2hlLmphdmFcbiAgICB2YXIgbGluZXMgPSBbXVxuXG4gICAgdmFyIHRlc3RXaWR0aCA9IHdpZHRoXG4gICAgLy9pZiAnbm93cmFwJyBpcyBzcGVjaWZpZWQsIHdlIG9ubHkgd3JhcCBvbiBuZXdsaW5lIGNoYXJzXG4gICAgaWYgKG1vZGUgPT09ICdub3dyYXAnKVxuICAgICAgICB0ZXN0V2lkdGggPSBOdW1iZXIuTUFYX1ZBTFVFXG5cbiAgICB3aGlsZSAoc3RhcnQgPCBlbmQgJiYgc3RhcnQgPCB0ZXh0Lmxlbmd0aCkge1xuICAgICAgICAvL2dldCBuZXh0IG5ld2xpbmUgcG9zaXRpb25cbiAgICAgICAgdmFyIG5ld0xpbmUgPSBpZHhPZih0ZXh0LCBuZXdsaW5lQ2hhciwgc3RhcnQsIGVuZClcblxuICAgICAgICAvL2VhdCB3aGl0ZXNwYWNlIGF0IHN0YXJ0IG9mIGxpbmVcbiAgICAgICAgd2hpbGUgKHN0YXJ0IDwgbmV3TGluZSkge1xuICAgICAgICAgICAgaWYgKCFpc1doaXRlc3BhY2UoIHRleHQuY2hhckF0KHN0YXJ0KSApKVxuICAgICAgICAgICAgICAgIGJyZWFrXG4gICAgICAgICAgICBzdGFydCsrXG4gICAgICAgIH1cblxuICAgICAgICAvL2RldGVybWluZSB2aXNpYmxlICMgb2YgZ2x5cGhzIGZvciB0aGUgYXZhaWxhYmxlIHdpZHRoXG4gICAgICAgIHZhciBtZWFzdXJlZCA9IG1lYXN1cmUodGV4dCwgc3RhcnQsIG5ld0xpbmUsIHRlc3RXaWR0aClcblxuICAgICAgICB2YXIgbGluZUVuZCA9IHN0YXJ0ICsgKG1lYXN1cmVkLmVuZC1tZWFzdXJlZC5zdGFydClcbiAgICAgICAgdmFyIG5leHRTdGFydCA9IGxpbmVFbmQgKyBuZXdsaW5lQ2hhci5sZW5ndGhcblxuICAgICAgICAvL2lmIHdlIGhhZCB0byBjdXQgdGhlIGxpbmUgYmVmb3JlIHRoZSBuZXh0IG5ld2xpbmUuLi5cbiAgICAgICAgaWYgKGxpbmVFbmQgPCBuZXdMaW5lKSB7XG4gICAgICAgICAgICAvL2ZpbmQgY2hhciB0byBicmVhayBvblxuICAgICAgICAgICAgd2hpbGUgKGxpbmVFbmQgPiBzdGFydCkge1xuICAgICAgICAgICAgICAgIGlmIChpc1doaXRlc3BhY2UodGV4dC5jaGFyQXQobGluZUVuZCkpKVxuICAgICAgICAgICAgICAgICAgICBicmVha1xuICAgICAgICAgICAgICAgIGxpbmVFbmQtLVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGxpbmVFbmQgPT09IHN0YXJ0KSB7XG4gICAgICAgICAgICAgICAgaWYgKG5leHRTdGFydCA+IHN0YXJ0ICsgbmV3bGluZUNoYXIubGVuZ3RoKSBuZXh0U3RhcnQtLVxuICAgICAgICAgICAgICAgIGxpbmVFbmQgPSBuZXh0U3RhcnQgLy8gSWYgbm8gY2hhcmFjdGVycyB0byBicmVhaywgc2hvdyBhbGwuXG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIG5leHRTdGFydCA9IGxpbmVFbmRcbiAgICAgICAgICAgICAgICAvL2VhdCB3aGl0ZXNwYWNlIGF0IGVuZCBvZiBsaW5lXG4gICAgICAgICAgICAgICAgd2hpbGUgKGxpbmVFbmQgPiBzdGFydCkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoIWlzV2hpdGVzcGFjZSh0ZXh0LmNoYXJBdChsaW5lRW5kIC0gbmV3bGluZUNoYXIubGVuZ3RoKSkpXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVha1xuICAgICAgICAgICAgICAgICAgICBsaW5lRW5kLS1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGxpbmVFbmQgPj0gc3RhcnQpIHtcbiAgICAgICAgICAgIHZhciByZXN1bHQgPSBtZWFzdXJlKHRleHQsIHN0YXJ0LCBsaW5lRW5kLCB0ZXN0V2lkdGgpXG4gICAgICAgICAgICBsaW5lcy5wdXNoKHJlc3VsdClcbiAgICAgICAgfVxuICAgICAgICBzdGFydCA9IG5leHRTdGFydFxuICAgIH1cbiAgICByZXR1cm4gbGluZXNcbn1cblxuLy9kZXRlcm1pbmVzIHRoZSB2aXNpYmxlIG51bWJlciBvZiBnbHlwaHMgd2l0aGluIGEgZ2l2ZW4gd2lkdGhcbmZ1bmN0aW9uIG1vbm9zcGFjZSh0ZXh0LCBzdGFydCwgZW5kLCB3aWR0aCkge1xuICAgIHZhciBnbHlwaHMgPSBNYXRoLm1pbih3aWR0aCwgZW5kLXN0YXJ0KVxuICAgIHJldHVybiB7XG4gICAgICAgIHN0YXJ0OiBzdGFydCxcbiAgICAgICAgZW5kOiBzdGFydCtnbHlwaHNcbiAgICB9XG59IiwibW9kdWxlLmV4cG9ydHMgPSBleHRlbmRcblxudmFyIGhhc093blByb3BlcnR5ID0gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eTtcblxuZnVuY3Rpb24gZXh0ZW5kKCkge1xuICAgIHZhciB0YXJnZXQgPSB7fVxuXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBhcmd1bWVudHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgdmFyIHNvdXJjZSA9IGFyZ3VtZW50c1tpXVxuXG4gICAgICAgIGZvciAodmFyIGtleSBpbiBzb3VyY2UpIHtcbiAgICAgICAgICAgIGlmIChoYXNPd25Qcm9wZXJ0eS5jYWxsKHNvdXJjZSwga2V5KSkge1xuICAgICAgICAgICAgICAgIHRhcmdldFtrZXldID0gc291cmNlW2tleV1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiB0YXJnZXRcbn1cbiJdfQ==
