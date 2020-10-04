function genGameDef(){

    var appdef = new AppDef('server',null,'null')
    
    var lobbydef = new ObjDef('lobby',appdef._id,false,null,false,objdefDef._id)
    var guestdef = new ObjDef('guest',appdef._id,false,null,false,objdefDef._id)
    var gamedef = new ObjDef('game',appdef._id,false,null,false,objdefDef._id)
    var player = new ObjDef('player',appdef._id,false,null,false,objdefDef._id)
    var eventdef = new ObjDef('event',appdef._id,false,null,false,objdefDef._id)
    var meter = new ObjDef('meter',appdef._id,false,null,false,objdefDef._id)
    var tile = new ObjDef('tile',appdef._id,false,null,false,objdefDef._id)
    var tileslot = new ObjDef('tileslot',appdef._id,false,null,false,objdefDef._id)
    var card = new ObjDef('card',appdef._id,false,null,false,objdefDef._id)
    var resource = new ObjDef('resource',appdef._id,false,null,false,objdefDef._id)
    var tag = new ObjDef('tag',appdef._id,false,null,false,objdefDef._id)
    var tagref = new ObjDef('tagref',appdef._id,false,null,false,objdefDef._id)
    var folder = new ObjDef('folder',appdef._id,false,null,false,objdefDef._id)//maybe auto inject folder into designer
    var corporationdef = new ObjDef('corporation',appdef._id,false,null,false,objdefDef._id)
    
    var attributeknots = [
        //game
        new Attribute('generation',gamedef._id,numberDef._id,null,attrDef._id),
        new Attribute('phase',gamedef._id,stringDef._id,null,attrDef._id),
        new Attribute('firstPlayerMarker',gamedef._id,numberDef._id,null,attrDef._id),
        new Attribute('playerturnmarker',gamedef._id,numberDef._id,null,attrDef._id),

        //player
        new Attribute('guestcookieid',player._id,numberDef._id,null,attrDef._id),
        new Attribute('actions',player._id,numberDef._id,null,attrDef._id),
        new Attribute('maxActions',player._id,numberDef._id,null,attrDef._id),
        new Attribute('terrapoints',player._id,numberDef._id,null,attrDef._id),

        //card
        new Attribute('cost',card._id,numberDef._id,null,attrDef._id),
        new Attribute('victorypoints',card._id,numberDef._id,null,attrDef._id),
        new Attribute('mulliganSelected',card._id,booleanDef._id,null,attrDef._id),
        new Attribute('imageurl',card._id,stringDef._id,null,attrDef._id),
        new Attribute('microbes',card._id,numberDef._id,null,attrDef._id),
        new Attribute('animals',card._id,numberDef._id,null,attrDef._id),
        new Attribute('tapped',card._id,booleanDef._id,null,attrDef._id),
        new Attribute('flavortext',card._id,stringDef._id,null,attrDef._id),
        new Attribute('effect',card._id,stringDef._id,null,attrDef._id),
        new Attribute('description',card._id,stringDef._id,null,attrDef._id),

        //resource
        new Attribute('minimumProduction',resource._id,numberDef._id,null,attrDef._id),
        new Attribute('production',resource._id,numberDef._id,null,attrDef._id),
        new Attribute('instock',resource._id,numberDef._id,null,attrDef._id),
        new Attribute('moneyvalue',resource._id,numberDef._id,null,attrDef._id),

        //meter
        new Attribute('min',meter._id,numberDef._id,null,attrDef._id),
        new Attribute('max',meter._id,numberDef._id,null,attrDef._id),
        new Attribute('step',meter._id,numberDef._id,null,attrDef._id),
        new Attribute('current',meter._id,numberDef._id,null,attrDef._id),

        //tag
        new Attribute('imageurl',tag._id,stringDef._id,null,attrDef._id),

        //tagref
        new Attribute('tag',tagref._id,pointerDef._id,'needs to point to physical data knot',attrDef._id),
    ]
    var knots = [lobbydef,guestdef,gamedef,player,eventdef,meter,tile,tileslot,card,resource,tag,tagref,folder,corporationdef,...attributeknots]
    return knots
}