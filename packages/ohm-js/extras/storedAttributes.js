/*
  Normal attributes are lazily computed. A stored attribute is initialized
  by a separate initialization operation. After initialization, you can read
  a stored attribute's value just like a normal (computed) attribute.
 */
export function addStoredAttribute(semantics, attrName, initSignature, fn) {
  semantics.addAttribute(attrName, {
    _default() {
      throw new Error(`Attribute '${attrName}' not initialized`);
    },
  });

  // Create the attribute setter, which the semantic actions of the init
  // operation will close over.
  const key = semantics._getSemantics().attributeKeys[attrName];
  const setAttr = (wrapper, val) => {
    wrapper._node[key] = val;
    return val;
  };

  // Create the init operation. It's the user's responsibility to call it.
  semantics.addOperation(initSignature, fn(setAttr));
  return semantics;
}
