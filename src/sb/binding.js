define(
    "sb/binding",
    [
        "sb/DEFAULT_OBSERVER",
        "sb/util/main",
        "sb/base/observable/main",
        "sb/base/binding/main"
    ],
    function(DEFAULT_OBSERVER, util, observable, binding) {

        /**
         * Create default setting binding chain.
         * @return {sb.base.binding.BindingChain} default setting binding chain.
         */
        function defaultBindingChain() {
    
            var args = util.argumentsToArray(arguments);
    
            var observables = args.filter(function(arg){
                return observable.isObservableObject(arg);
            });
    
            var chain = new binding.BindingChain(DEFAULT_OBSERVER, observables);
    
            return chain;
        }

        return defaultBindingChain;
    }
);
