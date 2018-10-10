/**
 * 简单的对象池
 */
export default class PrefabPool {
	type;
	prefab;
	nodePool : cc.NodePool;

	constructor(type, prefab) {
		this.type = type
		this.prefab = prefab
		this.nodePool = new cc.NodePool(type)
	}
	/**
	 * 获取节点
	 */
	get() {
		let node : cc.Node= null
	    if (this.nodePool.size() > 0) {
	        node = this.nodePool.get()
	    } else {
	        node = cc.instantiate(this.prefab)
		}
		node.active = true;
	    return node
	}
	/**
	 * 回收节点
	 * @param node 
	 */
	res(node : cc.Node) {
		node.active = false;
		this.nodePool.put(node)
	}

}