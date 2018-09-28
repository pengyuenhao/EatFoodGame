/**
 * 简单的对象池
 */
export default class PrefabPool {
	type;
	prefab;
	nodePool;

	constructor(type, prefab) {
		this.type = type
		this.prefab = prefab
		this.nodePool = new cc.NodePool(type)
	}
	/**
	 * 获取节点
	 */
	get() {
		let node = null
	    if (this.nodePool.size > 0) {
	        node = this.nodePool.get()
	    } else {
	        node = cc.instantiate(this.prefab)
	    }
	    return node
	}
	/**
	 * 回收节点
	 * @param node 
	 */
	res(node) {
		this.nodePool.put(node)
	}

}