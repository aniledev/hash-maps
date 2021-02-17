class HashMap {
  // creates an empty hash table, a hash map with a length and a capacity
  constructor(initialCapacity = 8) {
    this.length = 0;
    this._hashTable = [];
    this._capacity = initialCapacity;
    this._deleted = 0;
  }

  //takes a string and hashes it, outputting a number. This is the famous djb2 algorithm
  static _hashString(string) {
    let hash = 5381;
    for (let i = 0; i < string.length; i++) {
      hash = (hash << 5) + hash + string.charCodeAt(i);
      hash = hash & hash;
    }
    return hash >>> 0;
  }

  // method for retrieving item from a hash map
  get(key) {
    const index = this._findSlot(key);
    if (this._hashTable[index] === undefined) {
      throw new Error("Key error");
    }
    return this._hashTable[index].value;
  }

  // adds an item to the hasp map once a correct slot is found
  set(key, value) {
    // checks whether the load ratio is greater than the given maximum
    const loadRatio = (this.length + this._deleted + 1) / this._capacity;
    // MAX_LOAD_RATIO keeps track of how full the hash map is
    if (loadRatio > HashMap.MAX_LOAD_RATIO) {
      // SIZE_RATIO creates a bigger hash table to reduce the number of collisions
      this._resize(this._capacity * HashMap.SIZE_RATIO);
    }
    //Find the slot where this key should be in
    const index = this._findSlot(key);

    if (!this._hashTable[index]) {
      this.length++;
    }
    // adds an object to the array containing the key/value pair, increasing the length
    this._hashTable[index] = {
      key,
      value,
      DELETED: false,
    };
  }

    // method for deleting an item from a has map
  delete(key) {
    const index = this._findSlot(key);
    const slot = this._hashTable[index];
    if (slot === undefined) {
      throw new Error("Key error");
    }
    slot.DELETED = true;
    this.length--;
    this._deleted++;
  }

  // finds the correct slot for an item
  _findSlot(key) {
    // calculates the hash of the key
    const hash = HashMap._hashString(key);
    const start = hash % this._capacity;

    // loops through array stopping when it finds the slot with a matching key or empty slot
    for (let i = start; i < start + this._capacity; i++) {
      const index = i % this._capacity;
      const slot = this._hashTable[index];
      if (slot === undefined || (slot.key === key && !slot.DELETED)) {
        return index;
      }
    }
  }

  // recreate the hash map from scratch using a larger capacity
  _resize(size) {
    const oldSlots = this._hashTable;
    this._capacity = size;
    // Reset the length - it will get rebuilt as you add the items back
    this.length = 0;
    this._hashTable = [];

    for (const slot of oldSlots) {
      if (slot !== undefined) {
        this.set(slot.key, slot.value);
      }
    }
  }
}
