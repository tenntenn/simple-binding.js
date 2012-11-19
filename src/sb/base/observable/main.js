define(
        "sb/base/observable/main",
        [
                "sb/base/observable/newObservable",
                "sb/base/observable/newObservableArray",
                "sb/base/observable/isObservableObject"
        ],
        function(newObservable, newObservableArray, isObservableObject) {

                /**
                 * It provides data structures of observables.
                 */
                var observable = {
                        newObservable: newObservable,
                        newObservableArray: newObservableArray,
                        isObservableObject: isObservableObject
                };

                return observable;
        }
);
