define(
        "sb/base/observable/newObservable",
        [
        ],
        function() {

                /**
                 * Create a sb.base.observable.Observable object.
                 * @method sb.base.observable.newObservable
                 * @static
                 * @for sb.base.observable.Observable
                 * @public
                 * @param {sb.base.binding.Observer} observer observer of this observable value
                 * @param {*} value initial value
                 * @return {sb.base.observable.Observable} created observable object
                 */
                function newObservable(observer, value) {

                        /**
                         * An observable object which can have an internal value.
                         * @class Observable
                         * @namespace sb.base.observable
                         * @type function(*):*
                         * @extends {sb.base.observable.ObservableObject}
                         * @param {*} v it is set for this observable 
                         * @return {*} set value at this observable
                         */
                        function observable(v) {

                                // Propagation context.
                                var propagation;

                                // if v is not undefined, it works as setter.
                                if (v !== undefined) {
                                        propagation = observer.getPropagationGuardian().createPropagation();
                                        observable.notify(propagation, v);
                                }

                                // getter
                                return value;
                        }

                        /**
                         * Notify change registed observer object.
                         * @method notify
                         * @public
                         * @param {sb.Propagation} propagation propagation context
                         * @param {*} v it is set for this observable
                         */
                        observable.notify = function(propagation, v) {

                                /**
                                 * @type {sb.base.binding.NotificationEvent}
                                 */
                                var e = {
                                        previousValue : value,
                                        newValue : v
                                };

                                if (propagation(observable, e)) {
                                        value = v;
                                        observer.notify(propagation, observable);
                                }  
                        };

                        return observable;
                }
                
                return newObservable;
        }
);
