/**
 * @private
 * @constructor
 * @param {sb.BindingMaster} bindingMaster
 * @param {*} value
 */
sb.Observable = function(bindingMaster, value) {

    /**
     * @param {(void|*)} v
     * @return {*}
     * @this {sb.Observable}
     */
    var property = function(v) {

        if (v !== undefined) {
            property.notify([], v);
        }

        return value;
    };

    /**
     * @param {Array.<sb.Observable>} callStack
     * @param {*} v
     */
    property.notify = function(callStack, v) {
        var pre = value;
        if (callStack.lastIndexOf(property) < 0) {
           value = v;
           bindingMaster.notify(callStack.concat(property), property);
        }  
    };

    property.observable = this;
    this.property = property;
};

sb.isObservable = function(obj) {

    if (obj instanceof sb.Observable) {
        return true;
    }

    if (obj.observable 
            && obj.observable instanceof sb.Observable){
        return true;
    }
    
    return false;
};
