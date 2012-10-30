/**
 * An observable value which is observable by sb.Observer.
 * 
 * @constructor
 * @param {sb.Observer} observer observer of this observable value
 * @param {*} value
 */
sb.Observable = function(observer, value) {

    /**
     * @type {sb.Observable} own
     */
    var that = this;

    /**
     * @implements {sb.ObservableProperty}
     * @param {*} v it is set for this observable 
     * @return {*} set value at this observable
     * @this {sb.Observable}
     */
    that.property = function(v) {

        // if v is not undefined, it works as setter.
        if (v !== undefined) {
            that.property.notify([], v);
        }

        // getter
        return value;
    };

    /**
     * @param {Array.<sb.ObservableProperty>} callStack stack of sb.ObservableProperty which have already propagated.
     * @param {*} v it is set for this observable
     */
    that.property.notify = function(callStack, v) {
        if (callStack.lastIndexOf(that.property) < 0) {
           value = v;
           observer.notify(callStack.concat(that.property), that.property);
        }  
    };

};
