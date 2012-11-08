// It provide functions which can be use easily.
(function() {


    /**
     * Create default setting of sb.base.observable.Observable.
     * @param {*} initValue initial value.
     * @return {sb.base.observable.Observable} default setting of sb.base.observable.Observable.
     */
    sb.observable = function(initValue) {
        /**
         * @type {sb.base.observable.Observable} default setting of sb.base.observable.Observable.
         */
        var observable = sb.base.observable.newObservable(observer, initValue);
        return observable;
    };

     /**
      * Create default setting of sb.base.observable.ObservableArray.
      * @param {*} array initial value.
      * @return {sb.base.observable.ObservableArray} default setting sb.base.observable.ObservableArray.
      */
    sb.observableArray = function(array) {
        /**
         * @type {sb.base.observable.ObservableArray} default setting of sb.base.observable.ObservableArray.
         */
        var observableArray = sb.base.observable.newObservableArray(observer, array);
        return observableArray;
    };

    // when only available KnockoutJS
    if (typeof ko !== "undefined") {
        // wrappers of KnockoutJS.
        sb.ko = {};

        /**
         * Create default setting of sb.base.observable.ko.Observable.
         * @param {ko.observable} koObservable observable object of KnockoutJS
         * @return {sb.base.observable.ko.Observable} default setting of sb.base.observable.ko.Observable
         */
        sb.ko.observable = function(koObservable) {
            /**
             * default setting of sb.base.observable.ko.Observable.
             * @type {sb.base.observable.ko.Observable} 
             */
            var observable = sb.base.observable.ko.newObservable(observer, koObservable);
            return observable;
        };
    }
})();

