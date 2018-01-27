const MergeMap = require('../src').MergeMap;

describe('MergeMap', () => {
   let mm = null;
   describe('#constructor', () => {
      it('should set the map and constants if provided', () => {
         mm = new MergeMap();
         mm.constantMap.should.deep.equal({});
         mm.propertyMap.should.deep.equal({});
         mm = new MergeMap({blub: 'wubb'}, {blah: 'bloo'});
         mm.constantMap.should.deep.equal({blah: 'bloo'});
         mm.propertyMap.should.deep.equal({blub: 'wubb'});
      });
   });

   describe('#meta', () => {
      beforeEach(() => {
         mm = new MergeMap();
      })
      it('should tolerate empty arguments', () => {
         mm.meta().should.not.throw;
         mm.meta({}, null).should.not.throw;
         mm.meta(null, {}).should.not.throw;
      })
      it('should map properties of the first object into the return, given the key', () => {
         mm.meta({test: 'blah'}, {BLAH: 'test'}).should.deep.equal({BLAH: 'blah'})
      });
      it('should handle multiple parameters', () => {
         mm.meta({test: 'blah', testo: 'blaho'}, {
            Test: 'test',
            Testo: 'testo'
         }).should.deep.equal({Test: 'blah', Testo: 'blaho'});
      });
      it('should use a default map if one is not provided', () => {
         mm.propertyMap = {boo: 'blah'};
         mm.meta({blah: 'booboo'}).should.deep.equal({boo: 'booboo'});
      });
      it('should add mapped constants', () => {
         mm.constantMap = {bunk: 'brackish'};
         mm.meta({blah: 'booboo', bunk: 'baabaa'}, {}, {bunk: 'blargh'}).should.deep.equal({bunk: 'blargh'});
      });
      it('should add constants whether or not they are present in the data', () => {
         mm.constantMap = {bunk: 'brackish'};
         mm.meta({blah: 'booboo'}, {bunk: 'blah'}).should.deep.equal({bunk: 'brackish'});
      });
   });
});