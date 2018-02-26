let meta = rewire('../src/meta');


describe("meta", () => {
   describe('#merge', () => {
      it('should set values on the target from the metadata', () => {
         let src = {derp: "dorp", flerg: "florp"};
         let dst = {derp: "drep", gerp: "gorp"};
         let map = {grop: "flerg"};
         let expected = {derp: "drep", grop: "florp", gerp: "gorp"};
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
         let src = {derp: "dorp", flerp: "florp"};
         let dst = {derp: "drep", gerp: "gorp"};
         let map = {flerp: null};

      });
   });
   describe('#write', () => {
      it('should write the metadata to the file', () => {

      });
   });
});
