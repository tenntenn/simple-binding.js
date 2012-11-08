define(
        "sb/base/observable/ko/newObservableArray",
        [
                "ko",
                "sb/base/observable/main",
                "sb/base/binding/main"
        ],
        function(ko, observable, binding) {

                /**
                 * Create a wraper for ko.observableArray. 
                 * @method sb.base.observable.ko.newKoObservableArray
                 * @public
                 * @static
                 * @param {sb.base.binding.Observer} observer observer of this observable object
                 * @param {ko.observableArray} koObservableArray observableArray object of KnockoutJS
                 * @return {sb.base.observable.ko.ObservableArray} A wraper for ko.observableArray. 
                 */
                function newKoObservableArray(observer, koObservableArray) {

                        /**
                         * A wraper for ko.observableArray. 
                         * @class ObservableArray
                         * @namespace sb.base.observable.ko
                         * @type sb.base.observable.ko.ObservableArray
                         * @extends sb.base.observable.ObservableObject
                         */
                        var observableArray = observable.newObservableArray(observer, koObservableArray());

                        /**
                         * Handling changing of ko.observable value. 
                         * @property koComputed
                         * @private
                         * @type {ko.computed}
                         */
                        var koComputed = ko.computed(function() {
                                var arry = koObservableArray();
                                var length = observableArray.length();
                                var args = [0, length].concat(arry); 

                                observableArray.splice.apply(observableArray, args);

                                return arry;
                        });

                        /**
                         * Handling chaing of observable value.
                         * @property b
                         * @private
                         * @type {sb.base.binding.Binding}
                         */
                        var b = new binding.Binding(
                                observer,
                                {observable: observableArray}, // inputs
                                {},                       // outputs
                                function() {              // computed
                                        var arry = observableArray();
                                        var length = koObservableArray().length;
                                        var args = [0, length].concat(arry);
                                        koObservableArray.splice.apply(args);
                                        return {};
                                }
                        );
                        b.bind();

                        return observableArray;
                }

                return newKoObservableArray; 
        }
);

