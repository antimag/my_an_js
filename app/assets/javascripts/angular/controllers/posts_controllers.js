var myApp = angular.module('myapp', ['ngRoute', 'ngResource','angularFileUpload']);

//Factory
myApp.factory('Posts', ['$resource',function($resource){
  return $resource('/posts.json', {},{
    query: { method: 'GET', isArray: true },
    create: { method: 'POST' }
  })
}]);

myApp.factory('Post', ['$resource', function($resource){
  return $resource('/posts/:id.json', {}, {
    show: { method: 'GET' },
    update: { method: 'PUT', params: {id: '@id'} },
    delete: { method: 'DELETE', params: {id: '@id'} }
  });
}]);
;
//Controller
myApp.controller("PostListCtr", ['$scope', '$http', '$resource', 'Posts', 'Post', '$location', function($scope, $http, $resource, Posts, Post, $location) {
  $scope.posts = Posts.query();
  $scope.deletePost = function (PostId) {
    if (confirm("Are you sure you want to delete this Post?")){
      Post.delete({ id: PostId }, function(){
        $scope.posts = Posts.query();
        $location.path('/');
      });
    }
  };
}]);
myApp.controller("PostCtr", ['$scope', '$resource','Posts', 'Post', '$location', '$routeParams', function($scope, $resource, Posts, Post, $location, $routeParams) {
  $scope.post = Post.get({id: $routeParams.id})
  $scope.deletePost = function (PostId) {
    if (confirm("Are you sure you want to delete this Post?")){
      Post.delete({ id: PostId }, function(){
        $scope.posts = Posts.query();
        $location.path('/');
      });
    }
  };
}]);

myApp.controller("PostUpdateCtr", ['$scope', '$resource', 'Post', '$location', '$routeParams', function($scope, $resource, Post, $location, $routeParams) {
  $scope.post = Post.get({id: $routeParams.id})
  $scope.update = function(){
    if ($scope.postForm.$valid){
      Post.update({id: $scope.post.id},{post: $scope.post},function(){
      $location.path('/');
      }, function(error) {
        console.log(error)
      });
    }
  };
}]);

myApp.controller("PostAddCtr", ['$scope', '$resource', 'Posts', '$location', function($scope, $resource, Posts, $location ){
  $scope.post = {}
  $scope.save = function () {
    if ($scope.postForm.$valid){
      Posts.create({post: $scope.post},{picture_url: $scope.uploader}, function(){
        $location.path('/');
      }, function(error){
      console.log(error)
      });
    }
  }
}]);

myApp.controller("PostPicCtr", ['$scope', '$resource', 'Post', '$location','$upload', '$routeParams', function($scope, $resource, Post, $location,$upload, $routeParams) {
  $scope.onFileSelect = function($files) {
    //$files: an array of files selected, each file has name, size, and type.
    for (var i = 0; i < $files.length; i++) {
      var file = $files[i];
      $scope.upload = $upload.upload({
        url: '/posts/'+$routeParams.id+'/add_image.json', //upload.php script, node.js route, or servlet url
        method:'PUT',
        //headers: {'header-key': 'header-value'},
        //withCredentials: true,
        file: file, // or list of files ($files) for html5 only
        //fileName: 'doc.jpg' or ['1.jpg', '2.jpg', ...] // to modify the name of the file(s)
        // customize file formData name ('Content-Disposition'), server side file variable name. 
        //fileFormDataName: myFile, //or a list of names for multiple files (html5). Default is 'file' 
        // customize how data is added to formData. See #40#issuecomment-28612000 for sample code
        //formDataAppender: function(formData, key, val){}
      }).progress(function(evt) {
        console.log('percent: ' + parseInt(100.0 * evt.loaded / evt.total));
      }).success(function(data, status, headers, config) {
        console.log(data);
      });
      //.error(...)
      //.then(success, error, progress); 
      // access or attach event listeners to the underlying XMLHttpRequest.
      //.xhr(function(xhr){xhr.upload.addEventListener(...)})
    }
    /* alternative way of uploading, send the file binary with the file's content-type.
       Could be used to upload files to CouchDB, imgur, etc... html5 FileReader is needed. 
       It could also be used to monitor the progress of a normal http post/put request with large data*/
    // $scope.upload = $upload.http({...})  see 88#issuecomment-31366487 for sample code.
  $location.path('/');
  };
}]);
myApp.directive('ngTest', function() {
  return {
    restrict: 'A',
    template: '<div class="test">HI , This is made By Antima Gupta</div>'
  }
});
//Routes
myApp.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
  $routeProvider.when('/posts',{
    templateUrl: '/templates/posts/index.html',
    controller: 'PostListCtr'
  });
  $routeProvider.when('/posts/new', {
    templateUrl: '/templates/posts/new.html',
    controller: 'PostAddCtr'
  });
  $routeProvider.when('/posts/:id/edit', {
    templateUrl: '/templates/posts/edit.html',
    controller: "PostUpdateCtr"
  });
  $routeProvider.when('/posts/:id', {
    templateUrl: '/templates/posts/show.html',
    controller: "PostCtr"
  });
  $routeProvider.when('/posts/:id/add_image', {
    templateUrl: '/templates/posts/add_image.html',
    controller: "PostPicCtr"
  });
  $routeProvider.otherwise({
    redirectTo: '/posts'
  });
  }
]);
