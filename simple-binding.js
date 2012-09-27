/**
 * @namespace 
 */
var sb = {};

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
     * @type {sb.Observer}
     */
    var that = this;

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
            if (observable === dependencies[i].source) {
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
            if (compute === dependencies[i].source.compute) {
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

        if (that.find(observable) != null) {
            return;
        }

        dependencies.push({
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
        var dependency = that.find(source);
       
        /**
         * @type {sb.Observable}
         */ 
        var dist;

        for (i=0; i<dependency.dists.length; i++) {
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

    /**
     * @type {sb.Observable}
     */
    var that = this;

    var value = value;

    /**
     * @type {boolean}
     */
    var firstCall = true;

    /**
     * @param {(void|*)} v
     * @return {*}
     * @this {sb.Observable}
     */
    var propertyMain = function(v) {

        if (v !== undefined) {
            value = v;
            observer.notify(that);
        }
        
        return value;
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
        var dependency = observer.find(that);

        /**
         * @type {Array.<sb.Dependency>}
         */
        var dependencies = observer.findByCompute(that.property.caller);
        for (i = 0; i<dependencies.length; i++) {
            dependency.dists.push(dependencies[i].source);
        }
    }
   
    /**
     * @param {(void|*)} v
     * @return {*}
     * @this {sb.Observable}
     */ 
    this.property = function(v) {
        addDependencies();
        
        that.property = propertyMain;
        
        return propertyMain(v); 
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
var observer = new sb.Observer();

/**
 * @param {*} value
 * @param {sb.Compute} compute
 */
sb.observable = function(value, compute) {
    var observable = new sb.Observable(observer, value, compute);
    return observable.property; 
};
