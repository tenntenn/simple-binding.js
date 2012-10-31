// It provide functions which can be use easily.
(function() {

    /**
     * @const {sb.base.binding.Observer} default observer.
     */
    var observer = new sb.base.binding.Observer();

    /**
     * Create default setting binding chain.
     * @return {sb.base.binding.BindingChain} default setting binding chain.
     */
    sb.binding = function() {

        /**
         * @type {Array.<*>} arguments array of this function.
         */
        var args = sb.util.argumentsToArray(arguments);

        /**
         * @type {Array.<sb.base.observable.ObservableObject>} 
         */
        var observables = args.filter(function(arg){
            return sb.base.observable.isObservableObject(arg);
        });

        /**
         * @type {sb.base.binding.BindingChain} default setting binding chain.
         */
        var chain = new sb.base.binding.BindingChain(observer, observables);

        return chain;
    };

    /**
     * Create default setting property of sb.base.observable.Observable.
     * @param {*} initValue initial value.
     * @return {sb.base.observable.Observable} default setting of sb.base.observable.Observable.
     */
    sb.observable = function(initValue) {
        /**
         * @type {sb.base.observable.Observable} default setting of sb.base.observable.Observable.
         */
        var observable = new sb.base.observable.newObservable(observer, initValue);
        return observable;
    };

     /**
      * Create default setting property of sb.base.observable.ObservableArray.
      * @param {*} array initial value.
      * @return {sb.base.observable.ObservableArray} default setting sb.base.observable.ObservableArray.
      */
    sb.observableArray = function(array) {
        /**
         * @type {sb.base.observable.ObservableArray} default setting of sb.base.observable.ObservableArray.
         */
        var observableArray = new sb.base.observable.newObservableArray(observer, array);
        return observableArray;
    };
})();

