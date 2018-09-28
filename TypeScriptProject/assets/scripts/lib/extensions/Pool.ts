import {Stack} from "./Stack"
import { IConstructorName } from "../framework/IocConst";
import {inject} from "../framework/Injector/InjectDecorator";
import {Prototype} from "./Prototype"

export enum PoolOverflowBehavior
{
    /// Requesting more than the fixed size will throw an exception.
    EXCEPTION,
    
    /// Requesting more than the fixed size will throw a warning.
    WARNING,

    /// Requesting more than the fixed size will return null and not throw an error.
    IGNORE
}
export enum BindingConstraintType
{
    /// Constrains a SemiBinding to carry no more than one item in its Value
    ONE,
    /// Constrains a SemiBinding to carry a list of items in its Value
    MANY,
    /// Instructs the Binding to apply a Pool instead of a SemiBinding
    POOL,
}
export enum PoolInflationType
{
    /// When a dynamic pool inflates, add one to the pool.
    INCREMENT,

    /// When a dynamic pool inflates, double the size of the pool
    DOUBLE
}
export interface IPoolable
{
    /// <summary>
    /// Clean up this instance for reuse.
    /// </summary>
    /// Restore methods should clean up the instance sufficiently to remove prior state.
    restore ();

    /// <summary>
    /// Keep this instance from being returned to the pool 
    /// </summary>
    retain ();

    /// <summary>
    /// Release this instance back to the pool.
    /// </summary>
    /// Release methods should clean up the instance sufficiently to remove prior state.
    release();

    /// <summary>
    /// Is this instance retained?
    /// </summary>
    /// <value><c>true</c> if retained; otherwise, <c>false</c>.</value>
    isRetain : boolean;
}
export interface IInstanceProvider{
    /// Retrieve an Instance based on the key.
    /// ex. `injectionBinder.Get<cISomeInterface>();`
    //getInstance<T>() : T;

    /// Retrieve an Instance based on the key.
    /// ex. `injectionBinder.Get(typeof(ISomeInterface));`
    getInstance(key : object) : object;
}
export class __IC_InstanceProvider extends IConstructorName{
    //getInstance<T>() : T{return;} 
    get constructorName(){return "IInstanceProvider";}
}
export interface IManagedList
{
    /// Add a value to this List. 
    add( value : object) : IManagedList;

    /// Add a set of values to this List. 
    add( list : object[]) : IManagedList;

    /// Remove a value from this List. 
    remove( value : object) : IManagedList;

    /// Remove a set of values from this List. 
    remove( list : object[]) : IManagedList;

    /// Retrieve the value of this List.
    /// If the constraint is MANY, the value will be an Array.
    /// If the constraint is POOL, this becomes a synonym for GetInstance().
    value : object;
}
export interface IPool extends IManagedList
{
    /// A class that provides instances to the pool when it needs them.
    /// This can be the InjectionBinder, or any class you write that satisfies the IInstanceProvider
    /// interface.
    instanceProvider : IInstanceProvider;

    /// The object Type of the first object added to the pool.
    /// Pool objects must be of the same concrete type. This property enforces that requirement. 
    poolType : object;
    /// <summary>
    /// Gets an instance from the pool if one is available.
    /// </summary>
    /// <returns>The instance.</returns>
    getInstance() : object;

    /// <summary>
    /// Returns an instance to the pool.
    /// </summary>
    /// If the instance being released implements IPoolable, the Release() method will be called.
    /// <param name="value">The instance to be return to the pool.</param>
    returnInstance (value : object);

    /// <summary>
    /// Remove all instance references from the Pool.
    /// </summary>
    clean ();

    /// <summary>
    /// Returns the count of non-committed instances
    /// </summary>
    available : number;

    /// <summary>
    /// Gets or sets the size of the pool.
    /// </summary>
    /// <value>The pool size. '0' is a special value indicating infinite size. Infinite pools expand as necessary to accomodate requirement.</value>
    size : number;

    /// <summary>
    /// Returns the total number of instances currently managed by this pool.
    /// </summary>
    instanceCount : number;

    /// <summary>
    /// Gets or sets the overflow behavior of this pool.
    /// </summary>
    /// <value>A PoolOverflowBehavior value.</value>
    overflowBehavior : PoolOverflowBehavior;

    /// <summary>
    /// Gets or sets the type of inflation for infinite-sized pools.
    /// </summary>
    /// By default, a pool doubles its InstanceCount.
    /// <value>A PoolInflationType value.</value>
    inflationType : PoolInflationType;
}
export class Pool implements IPool, IPoolable
{

    @inject(__IC_InstanceProvider)
    public instanceProvider : IInstanceProvider

    /// Stack of instances still in the Pool.
    protected instancesAvailable : Stack<any> = new Stack<any> ();

    /// A HashSet of the objects checked out of the Pool.
    protected instancesInUse :Set<object>= new Set<object> ();

    protected _instanceCount : number;

    public size : number;

    public overflowBehavior : PoolOverflowBehavior;

    public inflationType : PoolInflationType;

    public uniqueValues : boolean;

    public constraint : any;

    public poolType : object;
    
    public isRetain : boolean;

    public Pool ()
    {
        this.size = 0;
        this.constraint = BindingConstraintType.POOL;
        this.uniqueValues = true;
        
        this.overflowBehavior = PoolOverflowBehavior.EXCEPTION;
        this.inflationType = PoolInflationType.DOUBLE;
    }
    public bind(type){
        this.poolType = type;
    }

    public add ( value : object) : IManagedList
    {
        //检查对象原型是否相同
        this.failIf(!Prototype.isProtetype(value,this.poolType) , " Pool Type mismatch. Pools must consist of a common concrete type.\n\t\tPool type: " + this.poolType + "\n\t\tMismatch type: " + value);
        this._instanceCount++;
        this.instancesAvailable.push (value);
        return this;
    }
    public addList (list : object[]) : IManagedList
    {
        if(list&&list.length>0){
            list.forEach((item : object)=>{
                this.add (item);
            });
        }
        return this;
    }
    public remove (value : object) : IManagedList
    {
        this._instanceCount--;
        this.removeInstance (value);
        return this;
    }

    public removeList (list : object[]) : IManagedList
    {
        if(list&&list.length>0){
            list.forEach((item : object)=>{
                this.remove(item);
            });
        }
        return this;
    }

    public get value() : object
    {
        return this.getInstance ();
    }

    /// The object Type of the first object added to the pool.
    /// Pool objects must be of the same concrete type. This property enforces that requirement. 

    public get instanceCount() : number
    {
        return this._instanceCount;
    }

    public getInstance () : object
    {
        // Is an instance available?
        if (this.instancesAvailable.size > 0)
        {
            let retv : object = this.instancesAvailable.pop ();
            this.instancesInUse.add (retv);
            return retv;
        }

        let instancesToCreate : number = 0;

        //New fixed-size pool. Populate.
        if (this.size > 0)
        {
            if (this.instanceCount == 0)
            {
                //New pool. Add instances.
                instancesToCreate = this.size;
            }
            else
            {
                //Illegal overflow. Report and return null
                this.failIf (this.overflowBehavior == PoolOverflowBehavior.EXCEPTION,
                    "A pool has overflowed its limit.\n\t\tPool type: " + this.poolType);

                if (this.overflowBehavior == PoolOverflowBehavior.WARNING)
                {
                    console.warn ("WARNING: A pool has overflowed its limit.\n\t\tPool type: " + this.poolType);
                }
                return null;
            }
        }
        else
        {
            //Zero-sized pools will expand.
            if (this.instanceCount == 0 || this.inflationType == PoolInflationType.INCREMENT)
            {
                instancesToCreate = 1;
            }
            else
            {
                instancesToCreate = this.instanceCount;
            }
        }

        if (instancesToCreate > 0)
        {
            this.failIf (this.instanceProvider == null, "A Pool of type: " + this.poolType + " has no instance provider.");

            for (let a = 0; a < instancesToCreate; a++)
            {
                let newInstance : object= this.instanceProvider.getInstance (this.poolType);
                this.add (newInstance);
            }
            return this.getInstance ();
        }

        //If not, return null
        return null;
    }

    public returnInstance ( value : object)
    {
        if (this.instancesInUse.has (value))
        {
            /* if (value extends IPoolable)
            {
                (value as IPoolable).Restore ();
            } */
            (value as IPoolable).restore ();
            this.instancesInUse.delete (value);
            this.instancesAvailable.push (value);
        }
    }

    public clean()
    {
        this.instancesAvailable.clear();
        this.instancesInUse = new Set<object> ();
        this._instanceCount = 0;
    }

    public get available() : number
    {
        return this.instancesAvailable.size;

    }

    public restore ()
    {
        this.clean ();
        this.size = 0;
    }

    public retain()
    {
        this.isRetain = true;
    }

    public release()
    {
        this.isRetain = false;
    }

    /// <summary>
    /// Permanently removes an instance from the Pool
    /// </summary>
    /// In the event that the removed Instance is in use, it is removed from instancesInUse.
    /// Otherwise, it is presumed inactive, and the next available object is popped from
    /// instancesAvailable.
    /// <param name="value">An instance to remove permanently from the Pool.</param>
    protected removeInstance(value : object)
    {
        this.failIf (value != this.poolType, "Attempt to remove a instance from a pool that is of the wrong Type:\n\t\tPool type: " + this.poolType.toString() + "\n\t\tInstance type: " + value.toString());
        if (this.instancesInUse.has(value))
        {
            this.instancesInUse.delete (value);
        }
        else
        {
            this.instancesAvailable.pop ();
        }
    }

    protected failIf(condition : boolean, message : string)
    {
        if (condition)
        {
            throw new Error(message);
        }
    }
}