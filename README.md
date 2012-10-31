simple-binding.js
=================

Sinmple binding library.

Authors
-------------
* [@tenntenn](https://twitter.com/tenntenn) (Takuya Ueda)
* [spd-user](http://github.com/spd-user/) (Yuji Katsumata)
* kazuma-s

Build
-------------

Build script create a minified js file by executing such as following.

    $ ./build


Usage
-------------

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


    var piyo = sb.observable(100);
    var piyopiyo = sb.observable(200);
    var piyopiyopiyo = sb.observable(300);
    sb.binding().synchronize(piyo, piyopiyo, piyopiyopiyo).bind();
    piyo(200); // piyo() === piyopiyo() === piyopiyopiyo()


    var hogera = sb.observable(100);
    sb.binding().onChage(hogera, function() {
        console.log("callback!!");
    }).bind();
    hogera(200); // print "callback!!" on consle.
