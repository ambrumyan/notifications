describe('Notification Tests', function () {

  var Notification, controller, scope, httpBackend, sce;

  beforeEach(module('demo'));
  beforeEach(module('templates'));

  beforeEach(inject(function (_Notification_, $controller, $rootScope, $templateCache,  $sce) {
    scope = $rootScope.$new();
    Notification = _Notification_;

    sce =  $sce;

    
    controller = $controller('mainController', {
      $scope: scope
    });
  }));



  it('should set type to error', function (done) {     
  
    var promise = Notification.error({body: 'Error notification', title: 'Title', scope: scope});
   
    promise.then(function(data){
      var title = sce.getTrustedHtml(data.title);
      var body = sce.getTrustedHtml(data.body);
      expect(data.type).to.equal('error');
      expect(title).to.equal('Title');
      expect(body).to.equal('Error notification');

      done();
    });

    scope.$digest();
  });

  it('should set type to warning', function (done) {     
  
    var promise = Notification.warning({body: 'Warning notification', title: 'Title', scope: scope});
   
    promise.then(function(data){
      expect(data.type).to.equal('warning');
      var title = sce.getTrustedHtml(data.title);
      var body = sce.getTrustedHtml(data.body);
      expect(title).to.equal('Title');
      expect(body).to.equal('Warning notification');

      done();
    });
     scope.$digest();
  });


  it('should set type to info', function (done) {     
  
    var promise = Notification.info({body: 'Info notification', title: 'Title', scope: scope, timeout: 300});
   
    promise.then(function(data){
      expect(data.type).to.equal('info');
      expect(data.timeout).to.equal(300);

      var title = sce.getTrustedHtml(data.title);
      var body = sce.getTrustedHtml(data.body);
      expect(title).to.equal('Title');
      expect(body).to.equal('Info notification');

      done();
    });
     scope.$digest();
  });

  it('should check notifications count', function (done) {  
    var count = document.getElementsByClassName('ri-notification').length;
    expect(count).to.equal(3);
    
    done();
  });



});