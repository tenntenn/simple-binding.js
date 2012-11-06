define(
    "sb.base.observable.ko.newObservable",
    [
        "ko"
    ],
    function(ko) {

        /**
         * Create a wraper for ko.observable.
         * @param {sb.base.binding.Observer} observer observer of this observable object
         * @param {ko.observable} koObservable observable object of KnockoutJS
         * @return {sb.base.observable.ko.Observable} a wraper for ko.observable.
         */
        function newObservable(observer, koObservable) {
    
            /**
             * A wraper for ko.observable. 
             * @typedef {sb.base.observable.ko.Observable}
             * @implements {sb.base.observable.ObservableObject}
             */
            var observable = sb.base.observable.newObservable(observer, koObservable());
    
            /**
             * handling changing of ko.observable value. 
             * @type {ko.computed}
             */
            var koComputed = ko.computed(function() {
                    var v = koObservable();
                    if (v !== observable()) {
                            observable(v);
                    }
                    return v;
            });
    
            /**
             * handling chaing of observable value.
             * @type {sb.base.binding.Binding}
             */
            var binding = new sb.base.binding.Binding(
                            observer,
                            {observable: observable}, // inputs
                            {},                       // outputs
                            function() {              // computed
                                    var v = observable();
                                    if (v !== koObservable()) {
                                            koObservable(v);
                                    }
                                    return {};
                            }
            );
            binding.bind();
    
            return observable;
        } 

        return newObservable;
    }
);
