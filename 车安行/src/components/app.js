import Store from "@/store/store"
window['app'] = new Vue({
    store: Store,
    el: '#fc68VehApp',
    render: h => h(App)
})