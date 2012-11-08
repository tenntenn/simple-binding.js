define(
        "sb/base/observable/ko",
        [
                "sb/base/observable/ko/newObservable",
                "sb/base/observable/ko/newObservableArray"  
        ],
        function(newObservable, newObservableArray) {

                /**
                 * It provides wrappers of KnockoutJS.
                 * @namespace
                 */
                var sbko = {
                        newObservable: newObservable,
                        newObservableArray: newObservableArray
                }; 

                return sbko;
        }
);
