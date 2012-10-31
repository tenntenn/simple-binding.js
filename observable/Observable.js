/**
 * An observable object which can have an internal value.
 *
 * @typedef {function(*):*}
*/
sb.observable.Observable;

/**
 * Create an sb.observable.Observable object.
 * 
 * @param {sb.Observer} observer observer of this observable value
 * @param {*} value
 */
sb.observable.newObservable = function(observer, value) {

    /**
     * @implements {sb.observable.ObservableObject}
     * @type {sb.observable.Observable}
     * @param {*} v it is set for this observable 
     * @return {*} set value at this observable
     */
    var observable = function(v) {

        /**
         * Propagation context.
         * @type {sb.Propagation}
         */
        var propagation;

        // if v is not undefined, it works as setter.
        if (v !== undefined) {
            propagation = observer.getPropagationGuardian().createPropagation();
            observable.notify(propagation, v);
        }

        // getter
        return value;
    };

    /**
     * @param {sb.Propagation} propagation propagation context
     * @param {*} v it is set for this observable
     */
    observable.notify = function(propagation, v) {
        if (propagation(observable, v)) {
           value = v;
           observer.notify(propagation, observable);
        }  
    };

    return observable;
};
