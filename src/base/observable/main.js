define(
    "sb.base.observable",
    [
        "sb.base.observable.newObservable"
        "sb.base.observable.newObservableArray"
    ],
    function(newObservable, newObservableArray) {

        /**
         * It provides data structures of observables.
         * @namespace
         */
        var observable = {
            newObservable: newObservable,
            newObservableArray: newObservableArray
        };

        return observable;
    }
);
