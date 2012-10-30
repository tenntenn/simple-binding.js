/**
 * A binding between observables.
 * If an observer which contained of input observables
 * notifies changing own value to the observer 
 * observer will notifies values which converted by computed function
 * to binded observables which contained of output observables. 
 * 
 * @param {sb.Observer} observer the observer
 * @param {sb.Parameters} inputs input observables
 * @param {sb.Parameters} outputs output observables
 * @param {sb.Computed} computed computed function
 */
sb.Binding = function(observer, inputs, outputs, computed) {

    /**
     * @type {sb.Binding} own
     */
    var that = this;

    /**
     * @type {sb.Parameters} input observables
     */
    that.inputs = inputs;

    /**
     * 
     * @type {sb.Parameters} output observables
     */
    that.outputs = outputs;

    /**
     * Computed function.
     * @type {sb.Computed}
     */
    that.computed = computed;

    /**
     * Enable this binding.
     * @return {sb.Binding}
     */
    that.bind = function() {
        observer.add(that);
        return that;
    };

    /**
     * Disable this binding.
     * @return {sb.Binding}
     */
    that.unbind = function() {
        observer.remove(that);
        return that;
    };

    /**
     * Notify changing to output observables.
     * 
     * @param {Array.<sb.ObservableProperty>}
     * @return {sb.Binding}
     */
    that.notify = function(callStack) {

        /**
         * @type {sb.Parameters} result of computed
         */
        var result = computed(inputs);

        /**
         * @type {sb.ObservableProperty} input observable
         */
        var input = callStack[callStack.length - 1];

        // notify to output observables
        Object.keys(result).forEach(function(name){
            var observable = outputs[name];
            if (input !== observable
                    && outputs.hasOwnProperty(name)
                    && sb.isObservable(observable)) {
                observable.notify(callStack, result[name]);
            }
        });

        return that;
    };

};
