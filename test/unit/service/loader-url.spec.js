describe('pascalprecht.translate', function () {

  describe('$translateUrlLoader', function () {

    var $translate, $httpBackend;

    beforeEach(module('pascalprecht.translate'));

    beforeEach(inject(function (_$translate_, _$httpBackend_) {
      $translate = _$translate_;
      $httpBackend = _$httpBackend_;

      $httpBackend.when('GET', 'foo/bar.json?lang=de_DE').respond({
        it: 'works'
      });
    }));

    afterEach(function () {
      $httpBackend.verifyNoOutstandingExpectation();
      $httpBackend.verifyNoOutstandingRequest();
    });

    it('should be defined', function () {
      inject(function ($translateUrlLoader) {
        expect($translateUrlLoader).toBeDefined();
      });
    });

    it('should be a function', function () {
      inject(function ($translateUrlLoader) {
        expect(typeof $translateUrlLoader).toBe('function');
      });
    });

    it('should throw an error when called without url option', function () {
      inject(function ($translateUrlLoader) {
        expect(function () {
          $translateUrlLoader();
        }).toThrow('Couldn\'t use urlLoader since no url is given!');
      });
    });

    it('should fetch url when invoking', function () {
      inject(function ($translateUrlLoader) {
        $httpBackend.expectGET('foo/bar.json?lang=de_DE');
        $translateUrlLoader({
          key: 'de_DE',
          url: 'foo/bar.json'
        });
        $httpBackend.flush();
      });
    });

    it('should return a promise', function () {
      inject(function ($translateUrlLoader) {
        var promise = $translateUrlLoader({
          key: 'de_DE',
          url: 'foo/bar.json'
        });
        expect(promise.then).toBeDefined();
        expect(typeof promise.then).toBe('function');
        $httpBackend.flush();
      });
    });
  });

  describe('useUrlLoader()', function () {
    beforeEach(module('pascalprecht.translate', function ($translateProvider) {
      $translateProvider.useUrlLoader('foo/bar.json');
    }));

    var $translate, $httpBackend;

    beforeEach(inject(function (_$translate_, _$httpBackend_) {
      $httpBackend = _$httpBackend_;
      $translate = _$translate_;

      $httpBackend.when('GET', 'foo/bar.json?lang=de_DE').respond({it: 'works'});
    }));

    afterEach(function () {
      $httpBackend.verifyNoOutstandingExpectation();
      $httpBackend.verifyNoOutstandingRequest();
    });

    it('should fetch url when invoking #uses', function () {
      $httpBackend.expectGET('foo/bar.json?lang=de_DE');
      $translate.uses('de_DE');
      $httpBackend.flush();
    });
  });
});
