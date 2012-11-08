define(
        "sb/observable",
        [
                "sb/DEFAULT_OBSERVER",
                "sb/base/observable/main"
        ],

        function(DEFAULT_OBSERVER, observable) {

                /**
                 * Create default setting of sb.base.observable.Observable.
                 * @method observable
                 * @param {*} initValue initial value.
                 * @return {sb.base.observable.Observable} default setting of sb.base.observable.Observable.
                 */
                function createDefaultObservable(initValue) {
                        var o  = observable.newObservable(DEFAULT_OBSERVER, initValue);
                        return o;
                }

                return createDefaultObservable;
        }

);
