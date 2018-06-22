declare var apiDomain: string;
declare var notify: any;

function http(method: string, body: object, route: string, callback: any){
    let headers = new Headers({
        "Content-Type": "application/json",
        "Authorization": `Bearer ${localStorage.token}`
    })

    let init = {
        method: method,
        headers: headers,
        body: ""
    }

    if (body) {
        init.body = JSON.stringify(body)
    }

    fetch(`${apiDomain}/api/${route}`, init).then((response: any) => {
        console.log(response.status)
        if (response.status == 304){
            callback(304)
        }
        if (response.status == 204){
            callback(0)
        }
        if (response.status == 200) {
            response.json().then(callback)
        } else {
            response.json().then((err: string) => {
                console.log(err)
                notify(err, "warning", true)
            })
        }
    })
}

function get(route: string, callback: any){
    http("GET", null, route, callback)
}

function post(body: any, route: string, callback: any){
    http("POST", body, route, callback)
}

export { get, post }