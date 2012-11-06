simple-binding.js
=================

Simple binding library for JavaScript.
simple-binding.js provides observable objects and these binding.
The binding can connect bi-directionally and it is not only single bidirectional binding. 
Unfortunately it works for JavaScript only and does not work for HTML or CSS using template bindings such as [KnockoutJS](http://knockoutjs.com/).
But simple-binding.js also provides wrapper for [KnockoutJS](http://knockoutjs.com/).

Authors
-------------
<<<<<<< HEAD
* @tenntenn (Takuya Ueda)
* [spd-user](http://github.com/spd-user/simple-binding.js) (Yuji Katsumata)
=======
* [@tenntenn](https://twitter.com/tenntenn) (Takuya Ueda)
* [spd-user](http://github.com/spd-user/) (Yuji Katsumata)
>>>>>>> 1ef920a0333906286bd3c8b1aece395f220b31b1
* kazuma-s

Build
-------------

Build script create a minified js file by executing such as following.

    $ ./build


Usage
-------------

    // bidirectional binding among three observable objects.
    var foo = sb.observable(100);
    var bar = sb.observable(200);
    var hoge = sb.observable(300);
    sb.binding()
        .computed(foo, function() {
            return hoge() - bar();
        })
        .computed(bar, function() {
            return hoge() - foo();
        })
        .computed(hoge, function() {
            return foo() + bar();
        })
        .bind();
    foo(200); // foo = 200, bar = hoge - foo, hoge = foo + bar


    // synchronize binding
    var piyo = sb.observable(100);
    var piyopiyo = sb.observable(200);
    var piyopiyopiyo = sb.observable(300);
    sb.binding().synchronize(piyo, piyopiyo, piyopiyopiyo).bind();
    piyo(200); // piyo() === piyopiyo() === piyopiyopiyo()


    // Callback function
    var hogera = sb.observable(100);
    sb.binding().onChage(hogera, function() {
        console.log("callback!!");
    }).bind();
    hogera(200); // print "callback!!" on consle.

    // KnockoutJS wrappers
    // Please look at http://jsfiddle.net/uedatakuya/rKcv3/
    var koObservable = ko.observable(100);
    var fuga = sb.ko.observable(koObservable); 
    koObservable(200); // -> fuga(200)
    fuga(300); // -> koObservable(300)
