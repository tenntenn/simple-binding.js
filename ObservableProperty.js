/**
 * A property of observable value.
 * It is a function and provides notify function as method.
 * @interface
 */
sb.ObservableProperty;

/**
 * Check either obj is sb.ObservableProperty or not.
 * @param {*} tested object 
 * @return {boolean} true indicates that obj implements sb.ObservableProperty. 
 */
sb.isObservable = function(obj) {

    // either obj is a function or not?
    if (typeof obj !== "function") { 
        return false;
    }

    // either obj has notify function as own method.
    if (!obj.notify
            || typeof obj.notify !== "function") {
        return false;
    }

    return true;
};
