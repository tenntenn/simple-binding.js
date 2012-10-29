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

    sb.observableArray = function(array) {
        var observableArray = new sb.ObservableArray(bindingMaster, array);
        return observableArray.property;
    };

    sb.isObservable = function(obj) {

        if (obj instanceof sb.Observable) {
            return true;
        }

        if (obj.observable 
                && obj.observable instanceof sb.Observable){
            return true;
        }

        if (obj instanceof sb.ObservableArray) {
            return true;
        }

        if (obj.observable 
                && obj.observable instanceof sb.ObservableArray){
            return true;
        }    

        return false;
    };

})();

