var Preloader = function (DOM = {}, success = [], fail = []) {
    this.DOM = {};
    this.events = {
        success: [],
        fail:[]
    }
    const events = {success, fail};
    this.init(DOM, events)
};
  
  
Preloader.prototype = function () {

    /**********************
    ****** PRIVATE *******
    *********************/

    /**
    /*  _DISPATCHEVENT - callbacks for fail or success */
    /* */
    const _dispatchEvent = function _dispatchEvent(event) {
        this.events[event].forEach(fn => fn());
    };

    /**
    /*  _LOAD - load all assets in promise */
    /* */
    const _load = function _load() {
        const medias = [...this.DOM.querySelectorAll('img[src], video')];
        if (medias.length <= 0) {
            _dispatchEvent.call(this, 'success');
            return;
        }
  
        const isPromise = window.Promise ? true : false;
        const isFetch = window.fetch ? true : false;
        const loading = isPromise ? [] : null;
  
  
        // Loader
        medias.forEach((media, key, array) => {
  
            const eventType = media.nodeName.toLowerCase() === 'img' ? 'load' : 'loadstart';
            const el = document.createElement(media.nodeName.toLowerCase());

            if (isPromise) {
                let loader = null;

                if (isFetch) {
                    // If fetch available (no 400 error may be throwned - fetch only allow network error rejection)
                    loader = fetch(media.src)
                        .then(response => {
                            if (!response.ok) {
                                // make the promise be rejected if we didn't get a 2xx response
                                _dispatchEvent.call(this, 'fail');
                                throw new Error(response.url + " Is not a 2xx response")
                            } else {
                                 return response
                            }
                        })
                        .catch(error => console.error('Fetch error: ' + error.message))
                
                    } else {
                    // If at least one media is not available, an error is throwned -> initFuncs will not work art all 
                    loader = new Promise((resolve, reject) => {
                        el.src = media.src;

                        el.addEventListener(eventType, e => {
                                return resolve();
                        }, false);
                        el.addEventListener("error", e => {
                            _dispatchEvent.call(this, 'fail');
                            return reject(new Error("Media failed loading"));
                        }, false);
                    });
                }
                loading.push(loader);
  
            } else {
                // OLD way - No error message here (should add a timeout here for legacy)
                el.onloadstart = el.onload = () => {
                    array.splice(array.indexOf(media), 1);
                    array.length === 0 && _dispatchEvent.call(this, 'success');
                };
            }
        });
        
        isPromise && Promise.all(loading).then(values => { 
            _dispatchEvent.call(this, 'success');
        }).catch(error => {
            console.error(error.message)
        })
    }


    /**********************
     ****** PUBLICS ******
     *********************/

    /**
    /*  INIT - init function */
    /* */
    const init = function init(DOM, events) {
        Object.assign(this.events, events);
        this.DOM = DOM;

        _load.call(this);
    };


    /**
    /*  DESTROY - destroy content */
    /* */
    const destroy = function destroy() {
        for (let prop in this) {
            if (!Object.prototype.hasOwnProperty.call(this, prop)) continue;
  
            this[prop] = null;
            delete this[prop];
        }
        return null;
    };

    return {
        init,
        destroy
    }
}()

export { Preloader }