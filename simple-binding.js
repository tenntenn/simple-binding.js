(function() {


    /**
     * @type {sb.BindingMaster}
     */
    var bindingMaster = new sb.BindingMaster();

    /**
     * @param {Object} inputs
     * @param {Object} outputs
     * @param {sb.Compute} compute
     */
    sb.binding = function(inputs, outputs, compute) {
        var binding = new sb.Binding(bindingMaster, inputs, outputs, compute);
        return binding;
    };

    /**
     * @param {*} value
     */
    sb.observable = function(value) {
        var observable = new sb.Observable(bindingMaster, value);
        return observable.property;
    };


})();

