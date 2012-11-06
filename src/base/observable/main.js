define(
    "sb.base.observable"
    [
        "sb.base.observables.newObservable"
    ],
    function(newObservable) {

        /**
         * It provides data structures of observables.
         * @namespace
         */
        var observable = {
            newObservable: newObservable
        };

        return observable;
    }
);
