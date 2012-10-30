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

        /**
         * Propagation context.
         * @type {sb.Propagation}
         */
        var propagation;

        // if v is not undefined, it works as setter.
        if (v !== undefined) {
            propagation = observer.getPropagationGuardian().createPropagation();
            that.property.notify(propagation, v);
        }

        // getter
        return value;
    };

    /**
     * @param {sb.Propagation} propagation propagation context
     * @param {*} v it is set for this observable
     */
    that.property.notify = function(propagation, v) {
        if (propagation(that.property, v)) {
           value = v;
           observer.notify(propagation, that.property);
        }  
    };

};
