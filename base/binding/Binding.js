/**
 * A binding between observables.
 * If an observer which contained of input observables
 * notifies changing own value to the observer 
 * observer will notifies values which converted by computed function
 * to binded observables which contained of output observables. 
 * 
 * @param {sb.base.binding.Observer} observer the observer
 * @param {sb.base.binding.Parameters} inputs input observables
 * @param {sb.base.binding.Parameters} outputs output observables
 * @param {sb.base.binding.Computed} computed computed function
 */
sb.base.binding.Binding = function(observer, inputs, outputs, computed) {

    /**
     * @type {sb.base.binding.Binding} own
     */
    var that = this;

    /**
     * @type {sb.base.binding.Parameters} input observables
     */
    that.inputs = inputs;

    /**
     * 
     * @type {sb.base.binding.Parameters} output observables
     */
    that.outputs = outputs;

    /**
     * Computed function.
     * @type {sb.base.binding.Computed}
     */
    that.computed = computed;

    /**
     * Enable this binding.
     * @return {sb.base.binding.Binding}
     */
    that.bind = function() {
        observer.add(that);
        return that;
    };

    /**
     * Disable this binding.
     * @return {sb.base.binding.Binding}
     */
    that.unbind = function() {
        observer.remove(that);
        return that;
    };

    /**
     * Notify changing to output observables.
     * 
     * @param {sb.base.binding.Propagation} propagation propagation context
     * @return {sb.base.binding.Binding}
     */
    that.notify = function(propagation) {

        /**
         * @type {sb.base.binding.Parameters} result of computed
         */
        var result = computed(inputs);

        /**
         * @type {Array.<sb.base.observable.ObservableObject>}
         */
        var callStack = propagation.callStack();

        /**
         * @type {sb.base.observable.ObservableObject} input observable
         */
        var input = callStack[callStack.length - 1];

        // notify to output observables
        Object.keys(result).forEach(function(name){
            var observable = outputs[name];
            if (input !== observable
                    && outputs.hasOwnProperty(name)
                    && sb.base.observable.isObservableObject(observable)) {
                observable.notify(propagation, result[name]);
            }
        });

        return that;
    };

};
