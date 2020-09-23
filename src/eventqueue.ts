enum EventTypes{create,save,update,get,delete,detailviewmounted,listviewmounted,knotArrowClicked,knotNameClicked}
class QueueEvent{

    constructor(
        public eventtype:EventTypes,
        public data:any,
    ){

    }
}

class Listener{
    constructor(public type:EventTypes,public cb:(data:any) => void){

    }
}

class EventQueue{
    listeners:Listener[] = []
    queue:QueueEvent[] = []

    listen(type:EventTypes,cb:(data:any) => void){
        this.listeners.push(new Listener(type,cb))
    }

    pushEvent(event:EventTypes,data:any){
        this.queue.push(new QueueEvent(event,data))
    }

    process(){
        while(this.queue.length > 0){
            var event = this.queue.shift()
            var l = this.listeners.filter(l => l.type == event.eventtype)
            for(var listener of l){
                listener.cb(event.data)
            }
        }
    }

    trigger(event:EventTypes,data:any){
        this.pushEvent(event,data)
        this.process()
    }
}