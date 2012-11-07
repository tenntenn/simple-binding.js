define(
        "sb/base/observable/main",
        [
                "sb/base/observable/Observable",
                "sb/base/observable/ObservableArray",
                "sb/base/observable/ObservableObject"
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
