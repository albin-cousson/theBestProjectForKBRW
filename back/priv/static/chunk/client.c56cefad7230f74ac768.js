"use strict";
(self["webpackChunkweb"] = self["webpackChunkweb"] || []).push([["components_app_js"],{

/***/ "./components/app.js":
/*!***************************!*\
  !*** ./components/app.js ***!
  \***************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _toArray(arr) { return _arrayWithHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

__webpack_require__(/*! !!file-loader?name=[name].[ext]!../index.html */ "./node_modules/file-loader/dist/cjs.js?name=[name].[ext]!./index.html");
/* required library for our React app */


var ReactDOM = __webpack_require__(/*! react-dom */ "./node_modules/react-dom/index.js");

var React = __webpack_require__(/*! react */ "./node_modules/react/index.js");

var createReactClass = __webpack_require__(/*! create-react-class */ "./node_modules/create-react-class/index.js");
/* required css for our application */


__webpack_require__(/*! ../webflow/page.css */ "./webflow/page.css"); // import bibliotèque cookies et chaine 


var Qs = __webpack_require__(/*! qs */ "./node_modules/qs/lib/index.js");

var Cookie = __webpack_require__(/*! cookie */ "./node_modules/cookie/index.js");

var localhost = (__webpack_require__(/*! reaxt/config */ "./node_modules/reaxt/config.js").localhost);

var XMLHttpRequest = __webpack_require__(/*! xhr2 */ "./node_modules/xhr2/lib/browser.js"); // External XmlHTTPReq on browser, xhr2 on server


var HTTP = new function () {
  var _this = this;

  this.get = function (url) {
    return _this.req('GET', url);
  };

  this.delete = function (url) {
    return _this.req('DELETE', url);
  };

  this.post = function (url, data) {
    return _this.req('POST', url, data);
  };

  this.put = function (url, data) {
    return _this.req('PUT', url, data);
  };

  this.req = function (method, url, data) {
    return new Promise(function (resolve, reject) {
      var req = new XMLHttpRequest();
      url = typeof window !== 'undefined' ? url : localhost + url;
      req.open(method, url);
      req.responseType = "text";
      req.setRequestHeader("accept", "application/json,*/*;0.8"); // req.setRequestHeader("content-type", "application/json")

      req.onload = function () {
        if (req.status >= 200 && req.status < 300) {
          resolve(req.responseText && JSON.parse(req.responseText));
        } else {
          reject({
            http_code: req.status
          });
        }
      };

      req.onerror = function (err) {
        reject({
          http_code: req.status
        });
      };

      req.send(data && JSON.stringify(data));
    });
  };
}();
var remoteProps = {
  // user: (props)=>{
  //   return {
  //     url: "/api/me",
  //     prop: "user"
  //   }
  // },
  orders: function orders(props) {
    // if (!props.user)
    //     return
    // , user_id: props.user.value.id
    var qs = _objectSpread({}, props.qs);

    var query = Qs.stringify(qs);
    return {
      url: "/api/orders" + (query == '' ? '' : '?' + query),
      prop: "orders"
    };
  },
  order: function order(props) {
    return {
      url: "/api/order/" + props.order_id,
      prop: "order"
    };
  }
};

function addRemoteProps(props) {
  return new Promise(function (resolve, reject) {
    var remoteProps = Array.prototype.concat.apply([], props.handlerPath.map(function (c) {
      return c.remoteProps;
    }) // -> [[remoteProps.orders], null]
    .filter(function (p) {
      return p;
    }) // -> [[remoteProps.orders]]
    );
    remoteProps = remoteProps.map(function (spec_fun) {
      return spec_fun(props);
    }) // [{url: '/api/orders', prop: 'orders'}]
    .filter(function (specs) {
      return specs;
    }) // get rid of undefined from remoteProps that don't match their dependencies
    .filter(function (specs) {
      return !props[specs.prop] || props[specs.prop].url != specs.url;
    }); // get rid of remoteProps already resolved with the url

    if (remoteProps.length == 0) return resolve(props);

    var promise_mapper = function promise_mapper(spec) {
      // we want to keep the url in the value resolved by the promise here : spec = {url: '/api/orders', value: ORDERS, prop: 'orders'}
      return HTTP.get(spec.url).then(function (res) {
        spec.value = res;
        return spec;
      });
    };

    var reducer = function reducer(acc, spec) {
      // spec = url: '/api/orders', value: ORDERS, prop: 'user'}
      acc[spec.prop] = {
        url: spec.url,
        value: spec.value
      };
      return acc;
    };

    var promise_array = remoteProps.map(promise_mapper);
    return Promise.all(promise_array).then(function (xs) {
      return xs.reduce(reducer, props);
    }, reject).then(function (p) {
      // recursively call remote props, because props computed from
      // previous queries can give the missing data/props necessary
      // to define another query
      return addRemoteProps(p).then(resolve, reject);
    }, reject);
  });
}

var Child = createReactClass({
  displayName: "Child",
  render: function render() {
    var _this$props$handlerPa = _toArray(this.props.handlerPath),
        ChildHandler = _this$props$handlerPa[0],
        rest = _this$props$handlerPa.slice(1);

    return /*#__PURE__*/React.createElement(ChildHandler, _extends({}, this.props, {
      handlerPath: rest
    }));
  }
});

var cn = function cn() {
  var args = arguments,
      classes = {};

  for (var i in args) {
    var arg = args[i];
    if (!arg) continue;

    if ('string' === typeof arg || 'number' === typeof arg) {
      arg.split(" ").filter(function (c) {
        return c != "";
      }).map(function (c) {
        classes[c] = true;
      });
    } else if ('object' === _typeof(arg)) {
      for (var key in arg) {
        classes[key] = arg[key];
      }
    }
  }

  return Object.keys(classes).map(function (k) {
    return classes[k] && k || '';
  }).join(' ');
};

var DeleteModal = createReactClass({
  displayName: "DeleteModal",
  render: function render() {
    var _this2 = this;

    return /*#__PURE__*/React.createElement("div", {
      className: "modal-wrapper"
    }, /*#__PURE__*/React.createElement("div", {
      className: "modal-content"
    }, /*#__PURE__*/React.createElement("h1", null, "Heading"), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("a", {
      href: "#",
      className: "button-2 w-button"
    }, "Annuler"), /*#__PURE__*/React.createElement("a", {
      href: "#",
      className: "button w-button",
      onClick: function onClick() {
        HTTP.delete("/api/order/" + _this2.props.id).then(function () {
          location.reload();
        });
      }
    }, "Confirmer"))));
  }
});
var Layout = createReactClass({
  displayName: "Layout",
  getInitialState: function getInitialState() {
    return {
      modal: null,
      loading: false
    };
  },
  modal: function modal(spec) {
    var _this3 = this;

    this.setState({
      modal: _objectSpread(_objectSpread({}, spec), {}, {
        callback: function callback(res) {
          _this3.setState({
            modal: null
          }, function () {
            if (spec.callback) spec.callback(res);
          });
        }
      })
    });
  },
  render: function render() {
    var modal_component = {
      'delete': function _delete(props) {
        return /*#__PURE__*/React.createElement(DeleteModal, props);
      }
    }[this.state.modal && this.state.modal.type];
    modal_component = modal_component && modal_component(this.state.modal);

    var props = _objectSpread(_objectSpread({}, this.props), {}, {
      modal: this.modal,
      loading: this.state.loading
    });

    return /*#__PURE__*/React.createElement("div", {
      className: "layout"
    }, /*#__PURE__*/React.createElement("div", {
      className: "layout-container"
    }, /*#__PURE__*/React.createElement(this.props.Child, props)), /*#__PURE__*/React.createElement("div", {
      className: cn("modal-wrapper hidden", {
        'hidden': !modal_component
      })
    }, modal_component), /*#__PURE__*/React.createElement("div", {
      className: "loader-wrapper hidden"
    }, /*#__PURE__*/React.createElement("div", {
      className: "div-block-6"
    }, /*#__PURE__*/React.createElement("img", {
      src: "https://uploads-ssl.webflow.com/624b5a6b284d214aeb407c92/624da109f5a42a002279d4bf_index.svg",
      loading: "lazy",
      alt: "",
      className: "image"
    }))));
  }
});
var Header = createReactClass({
  displayName: "Header",
  render: function render() {
    return /*#__PURE__*/React.createElement("div", {
      className: "header"
    }, /*#__PURE__*/React.createElement("div", {
      className: "header-container"
    }, /*#__PURE__*/React.createElement(this.props.Child, this.props)));
  }
});
var Orders = createReactClass({
  displayName: "Orders",
  getInitialState: function getInitialState() {
    return {
      forPage: []
    };
  },
  handleSubmit: function handleSubmit(e) {
    e.preventDefault();
    query = document.querySelector(".w-input").value;
    queryForSend = query.split(":");
    key = queryForSend[0];
    value = queryForSend[1];
    Link.GoTo("orders", "", _defineProperty({}, key, value));
  },
  statics: {
    remoteProps: [remoteProps.orders]
  },
  viewModal: function viewModal(id) {
    this.props.modal({
      type: 'delete',
      id: id,
      title: 'Order deletion',
      message: "Are you sure you want to delete this ?",
      callback: function callback(value) {}
    });
  },
  render: function render() {
    var _this4 = this;

    var x = 0;
    var countPaginationTabs = [];

    if (this.props.orders.value[1] != undefined) {
      for (var i = 2; i > 0; i--) {
        this.state.forPage.push(this.props.orders.value.pop());
      }

      for (var _i = this.state.forPage[0]; _i > 0; _i -= this.state.forPage[1]) {
        countPaginationTabs.push(x);
        x++;
      }
    }

    return /*#__PURE__*/React.createElement("div", {
      className: "orders"
    }, /*#__PURE__*/React.createElement("div", {
      className: "w-container"
    }, /*#__PURE__*/React.createElement("div", {
      className: "w-form",
      onSubmit: this.handleSubmit
    }, /*#__PURE__*/React.createElement("div", {
      className: "w-form"
    }, /*#__PURE__*/React.createElement("form", {
      id: "email-form-2",
      name: "email-form-2",
      "data-name": "Email Form 2",
      method: "get",
      className: "form"
    }, /*#__PURE__*/React.createElement("label", {
      htmlFor: "name"
    }, "Name"), /*#__PURE__*/React.createElement("input", {
      type: "text",
      className: "text-field w-input",
      maxLength: 256,
      name: "email-2",
      "data-name": "Email 2",
      placeholder: "",
      id: "email-2",
      required: ""
    }), /*#__PURE__*/React.createElement("input", {
      type: "submit",
      defaultValue: "Submit",
      "data-wait": "Please wait...",
      className: "w-button"
    })), /*#__PURE__*/React.createElement("div", {
      className: "w-form-done"
    }, /*#__PURE__*/React.createElement("div", null, "Thank you! Your submission has been received!")), /*#__PURE__*/React.createElement("div", {
      className: "w-form-fail"
    }, /*#__PURE__*/React.createElement("div", null, "Oops! Something went wrong while submitting the form."))))), /*#__PURE__*/React.createElement("div", {
      className: "headerorder w-container"
    }, /*#__PURE__*/React.createElement("div", {
      className: "wf-section"
    }, /*#__PURE__*/React.createElement("h1", {
      className: "titleorder"
    }, "Orders")), /*#__PURE__*/React.createElement("div", {
      className: "wf-section"
    }, /*#__PURE__*/React.createElement("div", {
      className: "namecustomer"
    }, "Albin COUSSON"), /*#__PURE__*/React.createElement("a", {
      href: "#",
      className: "button buttonlogin w-button"
    }, "Login"))), /*#__PURE__*/React.createElement("div", {
      className: "orders-container"
    }, /*#__PURE__*/React.createElement("div", {
      className: "blocktitletable w-container"
    }, /*#__PURE__*/React.createElement("div", {
      className: "titletable"
    }, "Command number"), /*#__PURE__*/React.createElement("div", {
      className: "titletable"
    }, "Customer"), /*#__PURE__*/React.createElement("div", {
      className: "titletable"
    }, "Adress"), /*#__PURE__*/React.createElement("div", {
      className: "titletable"
    }, "Quantity"), /*#__PURE__*/React.createElement("div", {
      className: "titletable"
    }, "Details"), /*#__PURE__*/React.createElement("div", {
      className: "titletable"
    }, "Pay"), /*#__PURE__*/React.createElement("div", {
      className: "titletable"
    }, "Delete")), /*#__PURE__*/React.createElement("div", {
      className: "blocktexttable texttable1"
    }, /*#__PURE__*/React.createElement("div", {
      className: "container-3 w-container",
      key: this.props.orders.value.id
    }, /*#__PURE__*/React.createElement("div", {
      className: "divtable"
    }, /*#__PURE__*/React.createElement("div", {
      className: "div-block-4"
    }, /*#__PURE__*/React.createElement("div", {
      className: "textcustomtable texttable1"
    }, this.props.orders.value.custom.order_number))), /*#__PURE__*/React.createElement("div", {
      className: "divtable"
    }, /*#__PURE__*/React.createElement("div", {
      className: "div-block-10"
    }, /*#__PURE__*/React.createElement("div", {
      className: "textcustomtable texttable2"
    }, this.props.orders.value.custom.customer.full_name))), /*#__PURE__*/React.createElement("div", {
      className: "divtable"
    }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      className: "textcustomtable texttable3"
    }, this.props.orders.value.custom.billing_address.street + " " + this.props.orders.value.custom.billing_address.postcode + " " + this.props.orders.value.order.custom.billing_address.city))), /*#__PURE__*/React.createElement("div", {
      className: "divtable"
    }, /*#__PURE__*/React.createElement("div", {
      className: "div-block-9"
    }, /*#__PURE__*/React.createElement("div", {
      className: "textcustomtable texttable4"
    }, this.props.orders.value.custom.items.length))), /*#__PURE__*/React.createElement("div", {
      className: "divtable"
    }, /*#__PURE__*/React.createElement("div", {
      className: "div-block-8"
    }, /*#__PURE__*/React.createElement("div", {
      className: "textcustomtable icontable texttable5",
      onClick: function onClick() {
        Link.GoTo('order', order.id);
      }
    }, "\uF061"))), /*#__PURE__*/React.createElement("div", {
      className: "div-block-2"
    }, /*#__PURE__*/React.createElement("div", {
      className: "div-block-8"
    }, /*#__PURE__*/React.createElement("div", {
      className: "iconepaytable",
      onClick: function onClick() {
        Link.GoTo('orders', "", {
          "payment": order.status.state,
          "order_id": order.id
        });
      }
    }, "\uF061"), /*#__PURE__*/React.createElement("div", {
      className: "textcustomtable textpaytable texttable6"
    }, "Satus: ", order.status.state, /*#__PURE__*/React.createElement("br", null), "Payment method: ", order.custom.magento.payment.method, /*#__PURE__*/React.createElement("br", null), "Delivry: ", order.custom.delivry_date))), /*#__PURE__*/React.createElement("div", {
      className: "divtable"
    }, /*#__PURE__*/React.createElement("div", {
      className: "div-block-4"
    }, /*#__PURE__*/React.createElement("div", {
      className: "textcustomtable texttable7 icontable",
      onClick: function onClick() {
        _this4.viewModal(order.id);
      }
    }, "\uF793")))))), /*#__PURE__*/React.createElement("div", {
      className: "blockpagination wf-section"
    }, countPaginationTabs.map(function (count) {
      return /*#__PURE__*/React.createElement("div", {
        className: "blockpagination wf-section",
        key: count
      }, /*#__PURE__*/React.createElement("button", {
        className: "pagination w-button",
        onClick: function onClick() {
          Link.GoTo('orders', "", {
            "page": count,
            "rows": _this4.state.forPage[1]
          });
        }
      }, count));
    })));
  }
});
var Order = createReactClass({
  displayName: "Order",
  statics: {
    remoteProps: [remoteProps.order]
  },
  render: function render() {
    count = this.props.order.value.custom.items.length;
    return /*#__PURE__*/React.createElement("div", {
      className: "order"
    }, /*#__PURE__*/React.createElement("div", {
      className: "oder-container"
    }, /*#__PURE__*/React.createElement("div", {
      className: "blockcustomerinfo wf-section"
    }, /*#__PURE__*/React.createElement("div", {
      className: "infocustomer"
    }, "Client: Albin COUSSON"), /*#__PURE__*/React.createElement("div", {
      className: "infocustomer"
    }, "Adrress: 24 rue d&#x27;Issenheim 68190 RAEDERSHEIM"), /*#__PURE__*/React.createElement("div", {
      className: "infocustomer"
    }, "Command number: 456787654")), /*#__PURE__*/React.createElement("div", {
      className: "headerorder w-container"
    }, /*#__PURE__*/React.createElement("div", {
      className: "wf-section"
    }, /*#__PURE__*/React.createElement("h1", {
      className: "titleorder"
    }, "Orders")), /*#__PURE__*/React.createElement("div", {
      className: "wf-section"
    }, /*#__PURE__*/React.createElement("div", {
      className: "namecustomer"
    }, "Albin COUSSON"), /*#__PURE__*/React.createElement("a", {
      href: "#",
      className: "button buttonlogin w-button"
    }, "Login"))), /*#__PURE__*/React.createElement("div", {
      className: "container-4 w-container"
    }, /*#__PURE__*/React.createElement("div", {
      className: "titletable"
    }, "Product Name"), /*#__PURE__*/React.createElement("div", {
      className: "titletable"
    }, "Quantity"), /*#__PURE__*/React.createElement("div", {
      className: "titletable"
    }, "Unit price"), /*#__PURE__*/React.createElement("div", {
      className: "titletable"
    }, "Total price")), /*#__PURE__*/React.createElement("div", {
      className: "blocktableorderinfo w-container"
    }, this.props.order.value.custom.items.map(function (order) {
      return /*#__PURE__*/React.createElement("div", {
        className: "div-block-7",
        key: order.product_ean
      }, /*#__PURE__*/React.createElement("div", {
        className: "textcustomtable textcustomtable1"
      }, order.product_title), /*#__PURE__*/React.createElement("div", {
        className: "textcustomtable textcustomtable2"
      }, count), /*#__PURE__*/React.createElement("div", {
        className: "textcustomtable textcustomtable3"
      }, order.unit_price), /*#__PURE__*/React.createElement("div", {
        className: "textcustomtable textcustomtable4"
      }, order.price));
    })), /*#__PURE__*/React.createElement("div", {
      className: "goback",
      onClick: function onClick() {
        Link.GoTo('orders', "");
      }
    }, /*#__PURE__*/React.createElement("a", {
      href: "#"
    }, "Go back"))));
  }
});
var ErrorPage = createReactClass({
  displayName: "ErrorPage",
  render: function render() {
    return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("p", null, "Error ", this.props.code), /*#__PURE__*/React.createElement("p", null, this.props.message));
  }
});
var routes = {
  "orders": {
    path: function path(params) {
      return "/";
    },
    match: function match(path, qs) {
      return path == "/" && {
        handlerPath: [Layout, Header, Orders]
      }; // Note that we use the "&&" expression to simulate a IF statement
    }
  },
  "order": {
    path: function path(params) {
      return "/order/" + params;
    },
    match: function match(path, qs) {
      var r = new RegExp("/order/([^/]*)$").exec(path);
      return r && {
        handlerPath: [Layout, Header, Order],
        order_id: r[1]
      }; // Note that we use the "&&" expression to simulate a IF statement
    }
  }
};
var Link = createReactClass({
  displayName: "Link",
  statics: {
    renderFunc: null,
    //render function to use (differently set depending if we are server sided or client sided)
    GoTo: function GoTo(route, params, query) {
      var qs = Qs.stringify(query);
      var url = routes[route].path(params) + (qs == '' ? '' : '?' + qs);
      history.pushState({}, "", url);
      Link.onPathChange();
    },
    onPathChange: function onPathChange() {
      //Updated onPathChange
      var path = location.pathname;
      var qs = Qs.parse(location.search.slice(1));
      var cookies = Cookie.parse(document.cookie);
      inferPropsChange(path, qs, cookies).then( //inferPropsChange download the new props if the url query changed as done previously
      function () {
        Link.renderFunc( /*#__PURE__*/React.createElement(Child, browserState)); //if we are on server side we render 
      }, function (_ref) {
        var http_code = _ref.http_code;
        Link.renderFunc( /*#__PURE__*/React.createElement(ErrorPage, {
          message: "Not Found",
          code: http_code
        }), http_code); //idem
      });
    },
    LinkTo: function LinkTo(route, params, query) {
      var qs = Qs.stringify(query);
      return routes[route].path(params) + (qs == '' ? '' : '?' + qs);
    }
  },
  onClick: function onClick(ev) {
    ev.preventDefault();
    Link.GoTo(this.props.to, this.props.params, this.props.query);
  },
  render: function render() {
    //render a <Link> this way transform link into href path which allows on browser without javascript to work perfectly on the website
    return /*#__PURE__*/React.createElement("a", {
      href: Link.LinkTo(this.props.to, this.props.params, this.props.query),
      onClick: this.onClick
    }, this.props.children);
  }
});
var browserState = {
  Child: Child
};

function inferPropsChange(path, query, cookies) {
  // the second part of the onPathChange function have been moved here
  browserState = _objectSpread(_objectSpread({}, browserState), {}, {
    path: path,
    qs: query,
    Link: Link,
    Child: Child
  });
  var route, routeProps;

  for (var key in routes) {
    routeProps = routes[key].match(path, query);

    if (routeProps) {
      route = key;
      break;
    }
  }

  if (!route) {
    return new Promise(function (res, reject) {
      return reject({
        http_code: 404
      });
    });
  }

  browserState = _objectSpread(_objectSpread(_objectSpread({}, browserState), routeProps), {}, {
    route: route
  });
  return addRemoteProps(browserState).then(function (props) {
    browserState = props;
  });
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  reaxt_server_render: function reaxt_server_render(params, render) {
    inferPropsChange(params.path, params.query, params.cookies).then(function () {
      render( /*#__PURE__*/React.createElement(Child, browserState));
    }, function (err) {
      render( /*#__PURE__*/React.createElement(ErrorPage, {
        message: "Not Found :" + err.url,
        code: err.http_code
      }), err.http_code);
    });
  },
  reaxt_client_render: function reaxt_client_render(initialProps, render) {
    browserState = initialProps;
    Link.renderFunc = render;
    window.addEventListener("popstate", function () {
      Link.onPathChange();
    });
    Link.onPathChange();
  }
});

/***/ }),

/***/ "./node_modules/file-loader/dist/cjs.js?name=[name].[ext]!./index.html":
/*!*****************************************************************************!*\
  !*** ./node_modules/file-loader/dist/cjs.js?name=[name].[ext]!./index.html ***!
  \*****************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (__webpack_require__.p + "index.html");

/***/ })

}]);
//# sourceMappingURL=client.c56cefad7230f74ac768.js.map