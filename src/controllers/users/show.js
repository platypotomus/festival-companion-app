/* global L */
function UsersShowCtrl($http, $scope, $state, $auth) {
  $scope.deleteUser = function() {
    console.log('we are in delete');
    console.log('url =>', `/api/user/${$state.params.id}`);
    $http({
      method: 'DELETE',
      url: `/api/user/${$state.params.id}`
    })
      .then(() => $state.go('login'));
  };

  // GET /users/:id
  $http({
    method: 'GET',
    url: `/api/user/${$state.params.id}`
  })
    .then(res => {
      $scope.idCheck = $auth.getPayload().sub;
      $scope.user = res.data;

      if($scope.user.userFriends.map(friend => friend._id).includes($scope.idCheck)) {
        $scope.friendStatus = 'friend';
      } else if ($scope.user.pendingFriends.map(friend => friend._id).includes($scope.idCheck)) {
        $scope.friendStatus = 'pending';
      } else {
        $scope.friendStatus = 'nonFriend';
      }
    });


  // console.log('We have arrived in the show controller');
  console.log('state.params.id is', $state.params.id);
  console.log('current user is', $scope.currentUser()._id);
  console.log($scope.currentUser()._id === $state.params.id);

  // $scope.user = $scope.currentUser();

  if($scope.currentUser()._id === $state.params.id) {
    $scope.$watch('map', function() {
      if($scope.map) {
        console.log('The controller knows about the map');
        navigator.geolocation.getCurrentPosition(
          position => {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            $scope.map.setView([lat, lon], 13);
            L.marker([lat, lon]).addTo($scope.map);
          },
          err => console.log(err),
          { timeout: 10000 });
      }
    });
  }

  $scope.sendFriendRequest = function() {
    $http({
      method: 'POST',
      url: `/api/user/${$scope.currentUser()._id}/friends/${$state.params.id}`
    })
      .then(res => {
        console.log('user data is', res.data);
        $scope.friendStatus = 'pending';
        $scope.user = res.data;
        console.log('this is the friends status', $scope.friendStatus);
      });
  };

  $scope.removeFriend = function() {
    $http({
      method: 'DELETE',
      url: `/api/user/${$scope.currentUser()._id}/friends/${$state.params.id}`
    })
      .then(res => {
        console.log('user data is', res.data);
        $scope.friendStatus = 'nonFriend';
        $scope.user = res.data;
        console.log('this is the friends status', $scope.friendStatus);
      });
  };
}

export default UsersShowCtrl;
