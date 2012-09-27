/**
 * @namespace 
 */
sb = {};

/**
 * @private
 * @typedef {function(void):*}
 */
sb.Compute;

/**
 * @private
 * @typedef {{source:sb.Observable, dists: Array.<sb.Observable>}}
 */
sb.Dependency;

/**
 * @private
 * @constructor
 */
sb.Observer = function() {

    /**
     * @type {Array.<sb.Dependency>
     */
    var dependencies = [];

    /**
     * @param {sb.Observable} observable
     * @return {sb.Dependency}
     */
    this.find = function(observable) {
        var i;
        for (i=0; i<dependencies.length; i++) {
            if (observable === dependencies[i].observable) {
                return dependencies[i];
            }
        } 

        return null;
    };

    /**
     * @param {sb.Compute} compute
     * @return {Array.<sb.Dependency>}
     */
    this.findByCompute = function(compute) {
        /**
         * @type {number}
         */
        var i;

        /**
         * @type {Array.<sb.Dependency>}
         */
        var found = [];

        for (i=0; i<dependencies.length; i++) {
            if (compute === dependencies[i].compute) {
                found.push(dependencies[i]);
            }
        } 

        return found;
    };

    /**
     * @param {sb.Observable} observable
     * @return void
     */
    this.add = function(observable) {

        if (this.find(observable) != null) {
            return;
        }

        observable.push({
            source: observable,
            dists: []
        });

        observable.compute();
    };

    /**
     * @param {sb.Observable} source
     * @return void
     */
    this.notify = function(source) {
        /**
         * @type {number}
         */
        var i;

        /**
         * @type {sb.Dependency}
         */
        var dependency = this.find(source);
       
        /**
         * @type {sb.Observable}
         */ 
        var dist;

        for (i=0; i<dependency.dists[i]; i++) {
            dist = dependency.dists[i];
            dist.property(dist.compute())
        }  
    };
}

/**
 * @private
 * @constructor
 * @param {sb.Observer} observer
 * @param {*} value
 * @param {sb.Compute} compute
 */
sb.Observable = function(observer, value, compute) {
    var value = value;

    /**
     * @type {boolean}
     */
    var firstCall = true;

    /**
     * @param {(void|*)} value
     * @return {*}
     * @this {sb.Observable}
     */
    var propertyMain = function(value) {

        if (value === undefined) {
            this.value = value;
            this.observer.notify(this);
        }
        
        return this.value;
    }


    /**
     * @param {void}
     * @return {void}
     * @this {sb.Observable}
     */
    var addDependencies = function() {

        /**
         * @type {number}
         */
        var i;
        
        /**
         * @type {sb.Dependency}
         */
        var dependency = observer.find(this);

        /**
         * @type {Array.<sb.Dependency>}
         */
        var dependencies = observer.findByCompute(this.compute);
        for (i = 0; i<dependencies.length; i++) {
            dependency.dists.push(dependencies[i].source);
        }
    }
   
    /**
     * @param {(void|*)} value
     * @return {*}
     * @this {sb.Observable}
     */ 
    this.property = function(value) {
        addDependencies();
        
        this.property = propertyMain;
        
        return propertyMain(value); 
    };

    /**
     * @type sb.Compute
     */
    this.compute = compute; 

    observer.add(this);
}

/**
 * @private
 * @type {sb.Observer}
 */
var observer = new Observer();

/**
 * @param {*} value
 * @param {sb.Compute} compute
 */
sb.observable = function(value, compute) {
    var observable = new Observable(observer, value, compute);
    return observable.property; 
};
