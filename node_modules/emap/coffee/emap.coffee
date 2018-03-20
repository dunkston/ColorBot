Dict = require 'jsdictionary'


class EventMap


    ###
        00000000  000   000  00000000  000   000  000000000  00     00   0000000   00000000
        000       000   000  000       0000  000     000     000   000  000   000  000   000
        0000000    000 000   0000000   000 0 000     000     000000000  000000000  00000000
        000          000     000       000  0000     000     000 0 000  000   000  000
        00000000      0      00000000  000   000     000     000   000  000   000  000
    ###
    constructor: () ->
        @dispatcherMap = new Dict()  




    ###
        00     00   0000000   00000000
        000   000  000   000  000   000
        000000000  000000000  00000000
        000 0 000  000   000  000
        000   000  000   000  000
    ###
    map: (dispatcher, type, handler, owner, useCapture = false) ->
        listenerMap = @dispatcherMap.get(dispatcher) ? @dispatcherMap.map(dispatcher, {})
        listeners   = listenerMap[type] ? listenerMap[type] = []
        unregister  = null

        for info in listeners
            return null if info.h == handler and info.o == owner and info.u == useCapture

        if owner
            cb = callback = (args...) -> handler.apply(owner, args); null
        else
            cb = handler

        if dispatcher.addEventListener
            dispatcher.addEventListener type, cb, useCapture

        else if dispatcher.addListener
            dispatcher.addListener type, cb, useCapture

        else if dispatcher.on
            dispatcher.on type, cb, useCapture

        else if dispatcher.$on
            unregister = dispatcher.$on type, cb, useCapture

        else if dispatcher.add
            dispatcher.add type, handler, owner

        listeners.push d:dispatcher, o:owner, h:handler, u:useCapture, c:callback, unregister:unregister
        null




    ###
        000   000  000   000  00     00   0000000   00000000
        000   000  0000  000  000   000  000   000  000   000
        000   000  000 0 000  000000000  000000000  00000000
        000   000  000  0000  000 0 000  000   000  000
         0000000   000   000  000   000  000   000  000
    ###
    unmap: (dispatcher, type, handler, owner, useCapture = false) ->
        listenerMap = @dispatcherMap.get dispatcher
        return null if not listenerMap
        listeners = listenerMap[type]
        return null if not listeners

        i = listeners.length
        while --i >= 0
            info = listeners[i]
            if info.h == handler and info.o == owner and info.u == useCapture
                listeners.splice i, 1

                cb = if owner then info.c else handler

                if info.unregister
                    info.unregister()

                else if dispatcher.removeEventListener
                    dispatcher.removeEventListener type, cb, useCapture

                else if dispatcher.removeListener
                    dispatcher.removeListener type, cb, useCapture

                else if dispatcher.off
                    dispatcher.off type, cb, useCapture

                else if dispatcher.remove
                    dispatcher.remove type, handler, owner

        delete listenerMap[type] if not listeners.length
        @dispatcherMap.unmap dispatcher if not Dict.hasKeys listenerMap
        null




    ###
         0000000   000      000
        000   000  000      000
        000000000  000      000
        000   000  000      000
        000   000  0000000  0000000
    ###
    all: ->
        @dispatcherMap.forEach (dispatcher, listenerMap) =>
            for type, listeners of listenerMap
                while info = listeners.shift()
                    cb = if info.o then info.c else info.h

                    if info.unregister
                        info.unregister()

                    else if dispatcher.removeEventListener
                        dispatcher.removeEventListener type, cb, info.u

                    else if dispatcher.removeListener
                        dispatcher.removeListener type, cb, info.u

                    else if dispatcher.off
                        dispatcher.off type, cb, info.u

                    else if dispatcher.remove
                        dispatcher.remove type, info.h, info.o
            @dispatcherMap.unmap dispatcher
        null




###
    00000000  000   000  00000000    0000000   00000000   000000000   0000000
    000        000 000   000   000  000   000  000   000     000     000
    0000000     00000    00000000   000   000  0000000       000     0000000
    000        000 000   000        000   000  000   000     000          000
    00000000  000   000  000         0000000   000   000     000     0000000
###

module.exports = EventMap.default = EventMap
