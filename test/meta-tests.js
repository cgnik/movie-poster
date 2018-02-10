let meta = rewire('../src/meta');


describe("meta", () => {
   describe('#merge', () => {
      it('should set values on the target from the metadata', () => {
         let src = {a: 1, b: 2};
         let dst = {a: 3, c: 4};
         let map = {d: "b"};
         let expected = {a: 3, c: 4, d: 2};
         meta.merge(dst, src, map).should.deep.equal(expected);
      });
      it('should tolerate empty arguments', () => {
         meta.merge.bind().should.not.throw;
      });
      it('should give back first argument unaltered if other args are empty', () => {
         let expected = {derp: "drep", grop: "florp"};
         meta.merge(expected).should.equal(expected);
      });
      it('should not replace existing with empty', () => {
         let src = {a: 1};
         let dst = {a: 3, b: 5, c: 4};
         let map = {d: "a", b: "b"};
         let expected = {a: 3, b: 5, c: 4, d: 1};
         meta.merge(dst, src, map).should.deep.equal(expected);
      });
   });
   describe('#read', () => {
      let ffm = null;
      beforeEach(() => {
         ffm = {read: sinon.stub()};
         meta.__set__('meta', ffm);
      });
      it('should read the metadata from the file', () => {
         let filename = 'file.fil';
         let expected = {title: 'test'};
         ffm.read.withArgs(filename).returns(expected);
         meta.read(filename).should.equal(expected);
      });
   });
});
