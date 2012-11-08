define(
    "sb/binding",
    [
        "sb/defaultObserver",
        "sb/util",
        "sb/base/observable",
        "sb/base/binding"
    ],
    function(defaultObserver, util, observable, binding) {

        /**
         * Create default setting binding chain.
         * @return {sb.base.binding.BindingChain} default setting binding chain.
         */
        function defaultBindingChain() {
    
            /**
             * @type {Array.<*>} arguments array of this function.
             */
            var args = util.argumentsToArray(arguments);
    
            /**
             * @type {Array.<sb.base.observable.ObservableObject>} 
             */
            var observables = args.filter(function(arg){
                return observable.isObservableObject(arg);
            });
    
            /**
             * @type {sb.base.binding.BindingChain} default setting binding chain.
             */
            var chain = new binding.BindingChain(defaultObserver, observables);
    
            return chain;
        }

        return defaultBindingChain;
    }
);
