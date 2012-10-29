sb.extend = function(superclass, constructor) {
    function f(){};
    f.property = superclass.property;
    constructor.property = new f();
    constructor.superclass = superclass.property;
    constructor.superclass.constructor = superclass;
    constructor.property.constructor = constructor;

    return constructor;
};
