 /**
    /*  EVENTS - events binded to the DOM through addEventListener  */
    /*  @param {object} e - event properties */
    /* */
  
    const _onWheel = function (e) {
        //   e.preventDefault(); //need it here ?
        const dir = Math.abs(e.deltaY) > Math.abs(e.deltaX) ? e.deltaY : e.deltaX;
        this.move.dest += (this.runFirefox && e.deltaMode == 1) ? dir * this.config.speed * this.config.multFirefox : dir * this.config.speed;
  
        _requestTick.call(this); // start animation
    };
  
    const _onTouchStart = function (e) {
        const t = (e.targetTouches) ? e.targetTouches[0] : e;
        this.move.touch = {
            pageY:  t.pageY,
            pageX: t.pageX
        };
    };
  
    const _onTouchMove = function (e) {
        const t = (e.targetTouches) ? e.targetTouches[0] : e;
        const moveY = t.pageY;
        const moveX = t.pageX;
        const dir = Math.abs(t.pageY - this.move.touch.pageY) > Math.abs(t.pageX - this.move.touch.pageX) ? 'pageY' : 'pageX';
        const move = (dir === "pageY" ? moveY : moveX);

        this.move.dest += -(move -  this.move.touch[dir]) * this.config.touchSpeed; //mouvement

        this.move.touch = {
            pageY: moveY,
            pageX: moveX
        }; // update touch
  
        _requestTick.call(this); // start animation
    };
  
    const _onKeydown = function (e) {
        if (e.keyCode === 38 || e.keyCode === 40) e.preventDefault();
  
        // if downKey is pressed, then jump + else if upKey is pressed, then jump - else 0
        this.move.dest += e.keyCode === 38 ? -this.config.jump : (e.keyCode === 40 ? this.config.jump : 0); // 38 up arrow && 40 down arrow
  
        _requestTick.call(this); // start animation
    };
  
    const _onScroll = function (e) {
        this.move.dest = window.scrollY || window.pageYOffset;
        _requestTick.call(this); // start animation
    };