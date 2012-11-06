define(
    "sb.base.observable.newObservable",
    [
    ],
    function() {

        /**
         * Create a sb.base.observable.Observable object.
         * 
         * @param {sb.base.binding.Observer} observer observer of this observable value
         * @param {*} value
         */
        function newObservable(observer, value) {

            /**
             * An observable object which can have an internal value.
             * @typedef {function(*):*}
             * @implements {sb.base.observable.ObservableObject}
             * @param {*} v it is set for this observable 
             * @return {*} set value at this observable
             */
            function observable(v) {

                /**
                 * Propagation context.
                 * @type {sb.Propagation}
                 */
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
);
