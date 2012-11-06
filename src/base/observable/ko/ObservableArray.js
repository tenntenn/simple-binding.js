define(
    "sb.base.observable.ko.newObservableArray",
    [
        "ko"
    ],
    function(ko) {

        /**
         * Create a wraper for ko.observableArray. 
         * @param {sb.base.binding.Observer} observer observer of this observable object
         * @param {ko.observableArray} koObservableArray observableArray object of KnockoutJS
         * @return {sb.base.observable.ko.ObservableArray} A wraper for ko.observableArray. 
         */
        function newObservableArray(observer, koObservableArray) {
    
            /**
             * A wraper for ko.observableArray. 
             * @typedef {sb.base.observable.ko.ObservableArray}
             * @implements {sb.base.observable.ObservableObject}
             */
             var observableArray = sb.base.observable.newObservableArray(observer, koObservableArray());
    
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
      
        return newObservableArray; 
    }
);

