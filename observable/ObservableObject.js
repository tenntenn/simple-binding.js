/**
 * An interface for observable objects.
 * It is a function and provides followings :
 *  + notify function as method
 * @interface
 */
sb.observable.ObservableObject;

/**
 * Check either obj is sb.ObservableyObject or not.
 * @param {*} tested object 
 * @return {boolean} true indicates that obj implements sb.ObservableObject. 
 */
sb.observable.isObservableObject = function(obj) {

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
