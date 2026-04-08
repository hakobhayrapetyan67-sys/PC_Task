class Counter{
		_count = 0;
		increment(){
			++this._count;
		}
		getter(){
			return this._count;
		}
}


let c1 = new Counter(3);
c1.increment();
console.log(c1.getter());
