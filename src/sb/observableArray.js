define(
        "sb/observableArray",
        [
                "sb/DEFAULT_OBSERVER",
                "sb/base/observable/main"
        ],
        function(DEFAULT_OBSERVER, observable) {
                
                /**
                 * Create default setting of sb.base.observable.ObservableArray.
                 * @method observableArray
                 * @for sb
                 * @param {Array} [array] initial value.
                 * @return {sb.base.observable.ObservableArray} default setting sb.base.observable.ObservableArray.
                 */
                function createDefaultObservableArray(array) {
                        var o = observable.newObservableArray(DEFAULT_OBSERVER, array);
                        return o;
                }

                return createDefaultObservableArray;
        }
);
