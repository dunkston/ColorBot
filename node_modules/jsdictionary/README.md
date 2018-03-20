# jsdictionary
A key value map which allows objects as keys.  

### Example

```coffee-script
    
    nullKey     = null
    stringKey   = 'string'
    numberKey   = 1
    boolenKey   = false
    arrayKey    = []
    objectKey   = {}
    functionKey = () -> null
    
    JSDictionary = require 'jsdictionary'
    dict         = new JSDictionary()
    
    # map key, value
    dict.map nullKey,     'nullValue'
    dict.map stringKey,   'stringValue'
    dict.map numberKey,   'numberValue'
    dict.map boolenKey,   'boolenValue'
    dict.map arrayKey,    'arrayValue'
    dict.map objectKey,   'objectValue'
    dict.map functionKey, 'functionValue'
    
    # get key
    console.log 'null:     ', dict.get nullKey     # 'nullValue'
    console.log 'string:   ', dict.get stringKey   # 'stringValue'
    console.log 'number:   ', dict.get numberKey   # 'numberValue'
    console.log 'boolen:   ', dict.get boolenKey   # 'boolenValue'
    console.log 'array:    ', dict.get arrayKey    # 'arrayValue'
    console.log 'object:   ', dict.get objectKey   # 'objectValue'
    console.log 'function: ', dict.get functionKey # 'functionValue'
    
    # has key
    dict.has boolenKey # true
    dict.has true      # false
    
    # isEmpty()
    dict.isEmpty()     # false
    
    # length()
    dict.length()      # 7
    
    # forEach
    dict.forEach (key, value) ->
        console.log key + ':' + value
    
    # clear()
    dict.clear()    
    
```  

The dict defines a not enumerable property, which holds a uid, on each object.  
The default name for this property is `'__dict_uid__'`.  

If, however, you have to change the name of this property, you can do:
```coffee-script
JSDictionary.key = 'whatEver'
```
    
One more:
```coffee-script

    a = key:'value'
    b = {}
    
    # JSDictionary.hasKeys
    JSDictionary.hasKeys a # true
    JSDictionary.hasKeys b # false
    
```
