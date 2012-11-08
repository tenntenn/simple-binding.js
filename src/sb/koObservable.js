define(
        "sb/koObservable",
        [
                "sb/DEFAULT_OBSERVER",
                "sb/base/observable"
        ],
        function(DEFAULT_OBSERVER, observable) {

                /**
                 * Create default setting of sb.base.observable.ko.Observable.
                 * @for sb.ko
                 * @method observable
                 * @param {ko.observable} koObservable observable object of KnockoutJS
                 * @return {sb.base.observable.ko.Observable} default setting of sb.base.observable.ko.Observable
                 */
                function createKoObservableWrapper(koObservable) {
                        var o = observable.ko.newObservable(DEFAULT_OBSERVER, koObservable);
                        return o;
                }

                return createKoObservableWrapper;
        }
);
