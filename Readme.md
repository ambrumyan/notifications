angular-notification-messages module
=======================

## Install

To install dependencies run the following command
```bash
npm install
```

## Usage

In your html/template add 
```html
...
  <link rel="stylesheet" href="notification-messages.css">
...
  <script src="notification-messages.js"></script>
...

```

in your angular appliation, put the following dependency

```javascript
  angular.module('demo', ['notification-messages']);
```

Here is example of usage

```javascript
angular.module('demo').controller('mainController', function($scope, Notification) {
 
  Notification.error({body: 'Error notification', title: 'Title'});
 Notification.info({body: 'Error notification', title: 'Title'});
 Notification.warning({body: 'Error notification', title: 'Title'});
});
```


#### Notification service methods

|              Method name               |                   Description                   |
|----------------------------------------|-------------------------------------------------|
| Notification.warning() 				 | Show warning notification |
| Notification.info()                    | Show info notification  |
| Notification.error()                   | Show error notification  |
