require('!!file-loader?name=[name].[ext]!../index.html')
/* required library for our React app */
var ReactDOM = require('react-dom')
var React = require("react")
var createReactClass = require('create-react-class')

/* required css for our application */
require('../webflow/page.css');

// import bibliotèque cookies et chaine 
var Qs = require('qs')
var Cookie = require('cookie');
var localhost = require('reaxt/config').localhost
var XMLHttpRequest = require("xhr2") // External XmlHTTPReq on browser, xhr2 on server

var HTTP = new (function () {
    this.get = (url) => this.req('GET', url)
    this.delete = (url) => this.req('DELETE', url)
    this.post = (url, data) => this.req('POST', url, data)
    this.put = (url, data) => this.req('PUT', url, data)

    this.req = (method, url, data) => new Promise((resolve, reject) => {
        var req = new XMLHttpRequest()
        url = (typeof window !== 'undefined') ? url : localhost + url
        req.open(method, url)
        req.responseType = "text"
        req.setRequestHeader("accept", "application/json,*/*;0.8")
        // req.setRequestHeader("content-type", "application/json")
        req.onload = () => {
            if (req.status >= 200 && req.status < 300) {
                resolve(req.responseText && JSON.parse(req.responseText))
            } else {
                reject({ http_code: req.status })
            }
        }
        req.onerror = (err) => {
            reject({ http_code: req.status })
        }
        req.send(data && JSON.stringify(data))
    })
})()

var remoteProps = {
    // user: (props)=>{
    //   return {
    //     url: "/api/me",
    //     prop: "user"
    //   }
    // },
    orders: (props) => {
        // if (!props.user)
        //     return
        // , user_id: props.user.value.id
        var qs = { ...props.qs }
        var query = Qs.stringify(qs)
        return {
            url: "/api/orders" + (query == '' ? '' : '?' + query),
            prop: "orders"
        }
    },
    order: (props) => {
        return {
            url: "/api/order/" + props.order_id,
            prop: "order"
        }
    }
}

function addRemoteProps(props) {
    return new Promise((resolve, reject) => {
        var remoteProps = Array.prototype.concat.apply([],
            props.handlerPath
                .map((c) => c.remoteProps) // -> [[remoteProps.orders], null]
                .filter((p) => p) // -> [[remoteProps.orders]]
        )
        remoteProps = remoteProps
            .map((spec_fun) => spec_fun(props)) // [{url: '/api/orders', prop: 'orders'}]
            .filter((specs) => specs) // get rid of undefined from remoteProps that don't match their dependencies
            .filter((specs) => !props[specs.prop] || props[specs.prop].url != specs.url) // get rid of remoteProps already resolved with the url
        if (remoteProps.length == 0)
            return resolve(props)
        const promise_mapper = (spec) => {
            // we want to keep the url in the value resolved by the promise here : spec = {url: '/api/orders', value: ORDERS, prop: 'orders'}
            return HTTP.get(spec.url).then((res) => { spec.value = res; return spec })
        }

        const reducer = (acc, spec) => {
            // spec = url: '/api/orders', value: ORDERS, prop: 'user'}
            acc[spec.prop] = { url: spec.url, value: spec.value }
            return acc
        }

        const promise_array = remoteProps.map(promise_mapper)
        return Promise.all(promise_array)
            .then(xs => xs.reduce(reducer, props), reject)
            .then((p) => {
                // recursively call remote props, because props computed from
                // previous queries can give the missing data/props necessary
                // to define another query
                return addRemoteProps(p).then(resolve, reject)
            }, reject)
    })
}

var Child = createReactClass({
    render() {

        var [ChildHandler, ...rest] = this.props.handlerPath
        return <ChildHandler {...this.props} handlerPath={rest} />
    }
})

var cn = function () {
    var args = arguments, classes = {}
    for (var i in args) {
        var arg = args[i]
        if (!arg) continue
        if ('string' === typeof arg || 'number' === typeof arg) {
            arg.split(" ").filter((c) => c != "").map((c) => {
                classes[c] = true
            })
        } else if ('object' === typeof arg) {
            for (var key in arg) classes[key] = arg[key]
        }
    }
    return Object.keys(classes).map((k) => classes[k] && k || '').join(' ')
}

var DeleteModal = createReactClass({
    render() {
        console.log(this.props.modal)
        return <JSXZ in="modaleDelete" sel=".modal-wrapper">
            <Z sel=".button" onClick={() => {
                this.props.callback(this.props.id)
            }}>
                <ChildrenZ />
            </Z>
            <Z sel=".button-2" onClick={()=>{this.props.callback(null)}} >
                <ChildrenZ />
            </Z>
        </JSXZ>
    }
})

const Loader = createReactClass({
    render() {
        return <JSXZ in="firstpage" sel=".div-block-6"></JSXZ>
    }
})

var Layout = createReactClass({
    getInitialState: function () {
        return {
            modal: null,
            loader: true,
            loading: true
        };
    },

    loader(promise){
        return new Promise((resolve, reject) => {
          this.setState({loader: false});
          promise.then(() => {
            this.setState({loader: true});
            resolve();
          }, reject)
        })
      },

    modal(spec) {
        this.setState({
            modal: {
                ...spec, callback: (res) => {
                    this.setState({ modal: null }, () => {
                        if (spec.callback) spec.callback(res)
                    })
                }
            }
        })
    },

    render() {
        var modal_component = {
            'delete': (props) => <DeleteModal {...props} />
        }[this.state.modal && this.state.modal.type];
        modal_component = modal_component && modal_component(this.state.modal)

        var props = {
            ...this.props, modal: this.modal, loading: this.state.loading, loader: this.loader
        }
        return <JSXZ in="firstpage" sel=".layout">
            <Z sel=".layout-container">
                <this.props.Child {...props} />
            </Z>
            <Z sel=".modal-wrapper" className={cn(classNameZ, { 'hidden': !modal_component })}>
                {modal_component}
            </Z>
            <Z sel=".loader-wrapper.hidden" className={cn(classNameZ, { 'hidden': this.state.loader })}>
                <Loader/>
            </Z>
        </JSXZ>
    }
})

var Header = createReactClass({
    render() {
        return <JSXZ in="firstpage" sel=".header">
            <Z sel=".header-container">
                <this.props.Child {...this.props} />
            </Z>
        </JSXZ>
    }
})

var Orders = createReactClass({
    getInitialState: function () {
        return { forPage: [] };
    },

    handleSubmit(e) {
        e.preventDefault()

        Link.GoTo("orders", "", { [document.querySelector(".w-input").value.split(":")[0]]: document.querySelector(".w-input").value.split(":")[1] })
    },

    statics: {
        remoteProps: [remoteProps.orders]
    },

    viewModal(id) {
        this.props.modal({
            type: 'delete',
            id: id,
            title: 'Order deletion',
            message: `Are you sure you want to delete this ?`,
            callback: (id) => {
                if (id != null){
                    console.log(id)
                    this.props.loader(HTTP.delete("/api/order/" + id).then(() => {
                        location.reload();
                    }))
                }
            }
        })
    },

    render() {
        let x = 0
        let countPaginationTabs = []

        if (typeof this.props.orders.value === 'string') {
            return <React.Fragment>
                {this.props.orders.value}
            </React.Fragment>
        } if (this.props.orders.value[1] != undefined && typeof this.props.orders.value != 'string') {
            for (let i = 2; i > 0; i--) {
                if(typeof this.props.orders.value[this.props.orders.value.length - 1] != "number") {
                    break
                }
                this.state.forPage.push(this.props.orders.value.pop())
            }

            for (let i = this.state.forPage[0]; i > 0; i -= this.state.forPage[1]) {
                countPaginationTabs.push(x)
                x++
            }

            return <JSXZ in="firstpage" sel=".orders">
                <Z sel=".w-form" onSubmit={this.handleSubmit}>
                    <JSXZ in="firstpage" sel=".w-form">
                        <Z sel=".w-input" >
                            <ChildrenZ />
                        </Z>
                        <Z sel=".w-button">
                            <ChildrenZ />
                        </Z>
                    </JSXZ>
                </Z>
                <Z sel=".blocktexttable">
                    {this.props.orders.value.map(order => (
                        <JSXZ key={order.id} in="firstpage" sel=".container-3">
                            <Z sel=".texttable1">
                                {order.custom.order_number}
                            </Z>
                            <Z sel=".texttable2">
                                {order.custom.customer.full_name}
                            </Z>
                            <Z sel=".texttable3">
                                {order.custom.billing_address.street + " " + order.custom.billing_address.postcode + " " + order.custom.billing_address.city}
                            </Z>
                            <Z sel=".texttable4">
                                {order.custom.items.length}
                            </Z>
                            <Z sel=".texttable5" onClick={() => { Link.GoTo('order', order.id) }}>
                                <ChildrenZ />
                            </Z>
                            <Z sel=".iconepaytable" onClick={() => { Link.GoTo('orders', "", { "payment": order.status.state, "order_id": order.id }) }}>
                                <ChildrenZ />
                            </Z>
                            <Z sel=".textpaytable">
                                Satus: {order.status.state}<br></br>
                                Payment method: {order.custom.magento.payment.method}<br></br>
                                Delivry: {order.custom.delivry_date}
                            </Z>
                            <Z sel=".texttable7" onClick={() => { this.viewModal(order.id) }}>
                                <ChildrenZ />
                            </Z>
                        </JSXZ>
                    ))}
                </Z>
                <Z sel=".blockpagination">
                    {countPaginationTabs.map(count => (
                        <JSXZ key={count} in="firstpage" sel=".blockpagination">
                            <Z sel=".pagination" onClick={() => { Link.GoTo('orders', "", { "page": count, "rows": this.state.forPage[1] }) }}>
                                {count}
                            </Z>
                        </JSXZ>
                    ))}
                </Z>
            </JSXZ>
        } else {
            return <JSXZ in="firstpage" sel=".orders">
                <Z sel=".w-form" onSubmit={this.handleSubmit}>
                    <JSXZ in="firstpage" sel=".w-form">
                        <Z sel=".w-input" >
                            <ChildrenZ />
                        </Z>
                        <Z sel=".w-button">
                            <ChildrenZ />
                        </Z>
                    </JSXZ>
                </Z>
                <Z sel=".blocktexttable">
                    <JSXZ in="firstpage" sel=".container-3">
                        <Z sel=".texttable1">
                            {this.props.orders.value.custom.order_number}
                        </Z>
                        <Z sel=".texttable2">
                            {this.props.orders.value.custom.customer.full_name}
                        </Z>
                        <Z sel=".texttable3">
                            {this.props.orders.value.custom.billing_address.street + " " + this.props.orders.value.custom.billing_address.postcode + " " + this.props.orders.value.custom.billing_address.city}
                        </Z>
                        <Z sel=".texttable4">
                            {this.props.orders.value.custom.items.length}
                        </Z>
                        <Z sel=".texttable5" onClick={() => { Link.GoTo('order', this.props.orders.value.id) }}>
                            <ChildrenZ />
                        </Z>
                        {/* <Z sel=".iconepaytable" onClick={() => { Link.GoTo('orders', "", { "payment": order.status.state, "order_id": order.id }) }}>
                            <ChildrenZ />
                        </Z> */}
                        <Z sel=".textpaytable">
                            Satus: {this.props.orders.value.status.state}<br></br>
                            Payment method: {this.props.orders.value.custom.magento.payment.method}<br></br>
                            Delivry: {this.props.orders.value.custom.delivry_date}
                        </Z>
                        <Z sel=".texttable7" onClick={() => { this.viewModal(this.props.orders.value.id) }}>
                            <ChildrenZ />
                        </Z>
                    </JSXZ>
                </Z>
                {/* <Z sel=".blockpagination">
                    {countPaginationTabs.map(count => (
                        <JSXZ key={count} in="firstpage" sel=".blockpagination">
                            <Z sel=".pagination" onClick={() => { Link.GoTo('orders', "", { "page": count, "rows": this.state.forPage[1] }) }}>
                                {count}
                            </Z>
                        </JSXZ>
                    ))}
                </Z> */}
            </JSXZ>
        }
    }
})

var Order = createReactClass({
    statics: {
        remoteProps: [remoteProps.order]
    },
    render() {
        return <JSXZ in="secondpage" sel=".order">
            <Z sel=".blocktableorderinfo">
                {this.props.order.value.custom.items.map(order => (
                    <JSXZ key={order.product_ean} in="secondpage" sel=".div-block-7">
                        <Z sel=".textcustomtable1">
                            {order.product_title}
                        </Z>
                        <Z sel=".textcustomtable2">
                            {this.props.order.value.custom.items.length}
                        </Z>
                        <Z sel=".textcustomtable3">
                            {order.unit_price}
                        </Z>
                        <Z sel=".textcustomtable4">
                            {order.price}
                        </Z>
                    </JSXZ>
                ))}
            </Z>
            <Z sel=".goback" onClick={() => { Link.GoTo('orders', "") }}>
                <ChildrenZ />
            </Z>
        </JSXZ>
    }
})

var ErrorPage = createReactClass({
    render() {
        return <React.Fragment>
            {/* <p>Error {this.props.code}</p>
            <p>{this.props.message}</p> */}
        </React.Fragment>
    }
})

var routes = {
    "orders": {
        path: (params) => {
            return "/";
        },
        match: (path, qs) => {
            return (path == "/") && { handlerPath: [Layout, Header, Orders] } // Note that we use the "&&" expression to simulate a IF statement
        }
    },
    "order": {
        path: (params) => {
            return "/order/" + params;
        },
        match: (path, qs) => {
            var r = new RegExp("/order/([^/]*)$").exec(path)
            return r && { handlerPath: [Layout, Header, Order], order_id: r[1] } // Note that we use the "&&" expression to simulate a IF statement
        }
    }
}

var Link = createReactClass({
    statics: {
        renderFunc: null, //render function to use (differently set depending if we are server sided or client sided)
        GoTo(route, params, query) {
            var qs = Qs.stringify(query)
            var url = routes[route].path(params) + ((qs == '') ? '' : ('?' + qs))
            history.pushState({}, "", url)
            Link.onPathChange()
        },
        onPathChange() { //Updated onPathChange
            var path = location.pathname
            var qs = Qs.parse(location.search.slice(1))
            var cookies = Cookie.parse(document.cookie)
            inferPropsChange(path, qs, cookies).then( //inferPropsChange download the new props if the url query changed as done previously
                () => {
                    Link.renderFunc(<Child {...browserState} />) //if we are on server side we render 
                }, ({ http_code }) => {
                    Link.renderFunc(<ErrorPage message={"Not Found"} code={http_code} />, http_code) //idem
                }
            )
        },
        LinkTo: (route, params, query) => {
            var qs = Qs.stringify(query)
            return routes[route].path(params) + ((qs == '') ? '' : ('?' + qs))
        }
    },
    onClick(ev) {
        ev.preventDefault();
        Link.GoTo(this.props.to, this.props.params, this.props.query);
    },
    render() {//render a <Link> this way transform link into href path which allows on browser without javascript to work perfectly on the website
        return (
            <a href={Link.LinkTo(this.props.to, this.props.params, this.props.query)} onClick={this.onClick}>
                {this.props.children}
            </a>
        )
    }
})

var browserState = { Child: Child }

function inferPropsChange(path, query, cookies) { // the second part of the onPathChange function have been moved here
    browserState = {
        ...browserState,
        path: path, qs: query,
        Link: Link,
        Child: Child
    }

    var route, routeProps
    for (var key in routes) {
        routeProps = routes[key].match(path, query)
        if (routeProps) {
            route = key
            break
        }
    }

    if (!route) {
        return new Promise((res, reject) => reject({ http_code: 404 }))
    }
    browserState = {
        ...browserState,
        ...routeProps,
        route: route
    }

    return addRemoteProps(browserState).then(
        (props) => {
            browserState = props
        })
}

export default {
    reaxt_server_render(params, render) {
        inferPropsChange(params.path, params.query, params.cookies)
            .then(() => {
                render(<Child {...browserState} />)
            }, (err) => {
                render(<ErrorPage message={"Not Found :" + err.url} code={err.http_code} />, err.http_code)
            })
    },
    reaxt_client_render(initialProps, render) {
        browserState = initialProps
        Link.renderFunc = render
        window.addEventListener("popstate", () => { Link.onPathChange() })
        Link.onPathChange()
    }
}