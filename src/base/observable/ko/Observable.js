define(
    "sb.base.observable.ko.newObservable",
    [
        "ko",
        "sb.base.observable.newObservable",
        "sb.base.binding.Binding"
    ],
    function(ko, newObservable, Binding) {

        /**
         * Create a wraper for ko.observable.
         * @param {sb.base.binding.Observer} observer observer of this observable object
         * @param {ko.observable} koObservable observable object of KnockoutJS
         * @return {sb.base.observable.ko.Observable} a wraper for ko.observable.
         */
        function newKoObservable(observer, koObservable) {
    
            /**
             * A wraper for ko.observable. 
             * @typedef {sb.base.observable.ko.Observable}
             * @implements {sb.base.observable.ObservableObject}
             */
            var observable = newObservable(observer, koObservable());
    
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
            var binding = new Binding(
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

        return newKoObservable;
    }
);
