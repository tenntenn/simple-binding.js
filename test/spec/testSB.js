// test.js
describe("simple binding test", function(){
        it('get test', function(){
                var hoge = sb.observable(100);
                expect(100).to.equal(hoge());
        });

        it('set test', function(){
                var hoge = sb.observable(100);
                hoge(200);
                expect(200).to.equal(hoge());
        });
});
