/**
 * A wraper for ko.observable. 
 * @typedef {sb.base.observable.Observable}
 * @implements {sb.base.observable.ObservableObject}
 */
sb.base.observable.ko.Observable;

/**
 * @param {sb.base.binding.Observer} observer observer of this observable object
 * @param {ko.observable} koObservable observable object of KnockoutJS
 */
sb.base.observable.ko.newObservable = function(observer, koObservable) {

        /**
         * wrapper
         * @type {sb.base.observable.Observable}
         */
        var observable = new sb.base.observable.Observable(observer, koObservable());

        /**
         * handling changing of ko.observable value. 
         * @type {ko.computed}
         */
        var koComputed = ko.computed(function() {
                return observable(koObservable());
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
                                // handling chaing of observable value
                                koObservable(observable());
                        }
        );
        binding.bind();

        return observable;
};