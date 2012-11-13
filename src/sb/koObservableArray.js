define(
        "sb/koObservableArray",
        [
                "sb/DEFAULT_OBSERVER",
                "sb/base/observable/main"
        ],
        function(DEFAULT_OBSERVER, observable) {

                /**
                 * Create default setting of sb.base.observable.ko.ObservableArray.
                 * @for sb.ko
                 * @method observableArray
                 * @param {ko.observable} koObservable observable object of KnockoutJS
                 * @return {sb.base.observable.ko.Observable} default setting of sb.base.observable.ko.Observable
                 */
                function createKoObservableArrayWrapper(koObservableArray) {
                        var o = observable.ko.newObservableArray(DEFAULT_OBSERVER, koObservableArray);
                        return o;
                }

                return createKoObservableArrayWrapper;
        }
);
