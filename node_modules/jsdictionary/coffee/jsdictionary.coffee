class Dict

    @uid = 0
    @key = '__dict_uid__'

    @hasKeys: (obj) ->
        for key of obj
          return true
        false

    @getUID: (key) ->
        return 'null' if not key?

        name = Dict.key
        uid  = key[name]
        return uid if uid?

        type = typeof key
        switch type
            when 'string'  then return 's::'
            when 'number'  then return 'n::'
            when 'boolean' then return 'b::'

        uid      = ++Dict.uid + '_' + Math.random()
        Dict.uid = 0 if Dict.uid == Number.MAX_VALUE

        if Object.defineProperty?
            Object.defineProperty(key, name, value: uid)
        else
            key[name] = uid

        uid


    constructor: () ->
        @datas = {}

    map: (key, value) ->
        @datas[Dict.getUID(key)] = { key:key, value:value }
        value

    unmap: (key) ->
        delete @datas[Dict.getUID(key)]
        null

    get: (key) ->
        @datas[Dict.getUID(key)]?.value

    has: (key) ->
        @datas[Dict.getUID(key)] != null

    clear: () ->
        @datas = {}

    isEmpty: () ->
        for uid of @datas
            return true
        false

    length: () ->
        i = 0
        ++i for uid of @datas
        i

    forEach: (callback) ->
        callback(data.key, data.value) for uid, data of @datas
        null


module.exports = Dict.default = Dict
