(function (ResponseGame, Timer) {

  /**
   * ResponseGame.Timer - Adapter between Find the words and H5P.Timer.
   * @class H5P.ResponseGame.Timer
   * @extends H5P.Timer
   * @param {H5P.jQuery} $element
   */
  ResponseGame.Timer = function (element) {
    /** @alias H5P.ResponseGame.Timer# */
    const that = this;
    // Initialize event inheritance
    if (element instanceof Element) {
      Timer.call(that, 100);

      /**
      * @private {string}
      */
      const naturalState = element.innerText;

      /**
       * Set up callback for time updates.
       * Formats time stamp for humans.
       * @private
       */
      const update = function () {
        const time = that.getTime();
        let hours = Timer.extractTimeElement(time, 'hours');
        let minutes = Timer.extractTimeElement(time, 'minutes');
        let seconds = Timer.extractTimeElement(time, 'seconds') % 60;

        // Update duration attribute
        element.setAttribute('datetime', 'PT' + hours + 'H' + minutes + 'M' + seconds + 'S');

        // Add leading zero
        if (seconds < 10) {
          seconds = '0' + seconds;
        }
        if (minutes < 10) {
          minutes = '0' + minutes;
        }
        if (hours < 10) {
          hours = '0' + hours;
        }
        element.innerText = hours + ':' + minutes + ':' + seconds;
      };

      // Setup default behavior
      that.notify('every_tenth_second', update);
      that.on('reset', function () {
        element.innerText = naturalState;
        that.notify('every_tenth_second', update);
      });
      // that.notify('every_tenth_minutes', update);
      that.on('reset', function () {
        element.innerText = naturalState;
      });
    }
    else {
      if (element === 'hard') {
        Timer.call(that);


        /** @private {string} */
        const naturalState = '0:00';

        /**
         * update - Set up callback for time updates.
         * Formats time stamp for humans.
         *
         * @private
         */
        const update = function () {
          const time = that.getTime();

          const minutes = Timer.extractTimeElement(time, 'minutes');
          let seconds = Timer.extractTimeElement(time, 'seconds') % 60;
          if (seconds < 10) {
            seconds = '0' + seconds;
          }

          // console.log(time);
          // $element.text(minutes + ':' + seconds);
        };

        that.notify({ "type": H5P.Timer.TYPE_PLAYING,
         // "calltime": 10000,
         "repeat": 1000,
         "mode": H5P.Timer.NOTIFIY_RELATIVE
        }, function() {
           // console.log(that.getTime());
           // console.log('triggering update');
           // console.log(that.getStatus());
        } );


            that.notify({ "type": H5P.Timer.TYPE_PLAYING,
             "calltime": "0:02",
             "mode": H5P.Timer.NOTIFIY_RELATIVE
            }, function() {
               // console.log(that.getTime());
               // console.log('End');
               that.stop();
               that.trigger('skipped');
               // console.log(that.getStatus());
              } );

          // Setup default behavior
          that.notify('every_tenth_second', update);
          that.on('reset', function () {
            $element.text(naturalState);
            that.notify('every_tenth_second', update);
          });
        }
        else {
          Timer.call(that);


          /** @private {string} */
          const naturalState = '0:00';

          /**
           * update - Set up callback for time updates.
           * Formats time stamp for humans.
           *
           * @private
           */
          const update = function () {
            const time = that.getTime();

            const minutes = Timer.extractTimeElement(time, 'minutes');
            let seconds = Timer.extractTimeElement(time, 'seconds') % 60;
            if (seconds < 10) {
              seconds = '0' + seconds;
            }

            // console.log(time);
            // $element.text(minutes + ':' + seconds);
          };

          that.notify({ "type": H5P.Timer.TYPE_PLAYING,
           // "calltime": 10000,
           "repeat": 1000,
           "mode": H5P.Timer.NOTIFIY_RELATIVE
          }, function() {
             // console.log(that.getTime());
             // console.log('triggering update');
             // console.log(that.getStatus());
          } );


              that.notify({ "type": H5P.Timer.TYPE_PLAYING,
               "calltime": "0:04",
               "mode": H5P.Timer.NOTIFIY_RELATIVE
              }, function() {
                 // console.log(that.getTime());
                 // console.log('End');
                 that.stop();
                 that.trigger('skipped');
                 // console.log(that.getStatus());
                } );

            // Setup default behavior
            that.notify('every_tenth_second', update);
            that.on('reset', function () {
              $element.text(naturalState);
              that.notify('every_tenth_second', update);
            });
        }
      }

  };


  // Inheritance
  ResponseGame.Timer.prototype = Object.create(Timer.prototype);
  ResponseGame.Timer.prototype.constructor = ResponseGame.Timer;

}) (H5P.ResponseGame, H5P.Timer);
