(function() {


    /**
     * @type {sb.BindingMaster}
     */
    var bindingMaster = new sb.BindingMaster();

    sb.binding = function() {
        var observables = [];
        var args = arguments;
        Object.keys(args).forEach(function(i) {
            var arg = args[i];
            if (sb.isObservable(arg)) {
                observables.push(arg);
            }
        });

        var chain = new sb.BindingChain(bindingMaster, observables);

        return chain;
    };

    /**
     * @param {*} value
     */
    sb.observable = function(value) {
        var observable = new sb.Observable(bindingMaster, value);
        return observable.property;
    };

})();

