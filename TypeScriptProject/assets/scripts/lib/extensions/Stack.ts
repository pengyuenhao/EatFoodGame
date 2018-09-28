export interface IStack<T> {
    //获取栈顶元素
    top(): T;
    //压栈
    push(item: T);
    //出栈
    pop(): T;
    //清空
    clear();
    //是否空栈
    isEmpty: boolean;
    //栈大小
    size: number;
}

export class Item<T> {
    private _value: T;
    private _next: Item<T>;
    constructor(value: T, next: Item<T> = null) {
        this._value = value;
        this._next = next;
    }
    set value(value: T) {
        this._value = value;
    }
    get value(): T {
        return this._value;
    }
    set next(next: Item<T>) {
        this._next = next;
    }
    get next(): Item<T> {
        return this._next;
    }
}

export class Stack<T> implements IStack<T> {
    private _header: Item<T>;
    private _size: number = 0;
    constructor() {
        this._header = new Item<T>(null);
    }
    top(): T {
        if (this._size === 0) {
            return null;
        }
        return this._header.next.value;
    }

    /**
     * 入栈
     * @param item 添加的元素
     * 将header的下一个元素的引用赋值给新元素的next
     * 再将新元素赋值给header的next
     */
    push(item: T) {
        let newItem = new Item<T>(item);
        newItem.next = this._header.next;
        this._header.next = newItem;
        this._size++;
    }

    /**
     * 出栈
     * 将header之后的第一个元素移除
     * 同时修改header的next到下一个元素
     */
    pop(): T {
        if (this._size === 0) {
            return null;
        }
        let item = this._header.next;
        this._header.next = item.next;
        this._size--;
        item.next = null;//清除引用
        return item.value;
    }
    clear(){
        let item;
        let tmp = this._header;
        while(this._size !== 0){
            item = tmp.next;
            tmp = item;
            item.next = null;
            this._size--;
        }
        this._header = null;
    }
    get isEmpty(): boolean {
        return this._size === 0;
    }

    get size(): number {
        return this._size;
    }
}